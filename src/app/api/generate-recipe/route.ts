import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { buildPrompt } from '@/lib/promptBuilder';
import { parseRecipeResponse } from '@/lib/recipeParser';
import { GeminiResponse } from '@/types/recipe';

// Request validation schema
const PreferencesSchema = z.object({
  primaryGoal: z.enum(['weight-loss', 'muscle-gain', 'maintenance', 'quick-easy']),
  maxCalories: z.number().min(200).max(1500),
  minProtein: z.number().min(10).max(100),
  prepTime: z.number().min(10).max(120),
  dietaryRestrictions: z.array(z.string()).optional().default([]),
  allergies: z.string().optional().default(''),
  equipment: z.array(z.string())
});

// Configuration for retry logic and timeouts
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash']; // Fallback models (2.5 Flash is latest stable)

// Sleep utility for retry delays
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const preferences = PreferencesSchema.parse(body);

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please set GEMINI_API_KEY in environment variables.' },
        { status: 500 }
      );
    }

    // Build prompt using the utility function
    const prompt = buildPrompt(preferences);

    // Try multiple models with retry logic
    let lastError: Error | null = null;

    for (const model of MODELS) {
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          console.log(`Attempt ${attempt + 1}/${MAX_RETRIES} with model ${model}`);

          // Call Gemini API with timeout
          const response = await fetchWithTimeout(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                contents: [{
                  role: 'user',
                  parts: [{
                    text: prompt
                  }]
                }],
                generationConfig: {
                  temperature: 0.9,
                  topK: 40,
                  topP: 0.95,
                  maxOutputTokens: 4096
                }
              })
            },
            REQUEST_TIMEOUT
          );

          // Check if response is OK
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || 'Unknown API error';
            const status = response.status;

            console.error(`Gemini API Error (${status}):`, errorData);

            // Handle specific error cases
            if (status === 503 || status === 429) {
              // Service overloaded or rate limited - retry with exponential backoff
              if (attempt < MAX_RETRIES - 1) {
                const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
                console.log(`Retrying in ${delay}ms...`);
                await sleep(delay);
                continue; // Try again
              }
              // Last attempt failed - try next model
              lastError = new Error(`The AI service is currently experiencing high demand. We've tried ${attempt + 1} times. Please try again in a moment.`);
              break; // Break inner loop to try next model
            } else if (status === 400) {
              // Bad request - don't retry
              throw new Error(`Invalid request: ${errorMessage}`);
            } else {
              // Other errors - retry
              if (attempt < MAX_RETRIES - 1) {
                const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
                await sleep(delay);
                continue;
              }
              lastError = new Error(errorMessage);
              break;
            }
          }

          // Success! Parse the response
          const data: GeminiResponse = await response.json();

          // Validate response structure
          if (!data.candidates || !data.candidates.length) {
            console.error('Invalid API Response:', data);
            if (attempt < MAX_RETRIES - 1) {
              const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
              await sleep(delay);
              continue;
            }
            lastError = new Error('No response generated. The API may have blocked the request due to safety filters.');
            break;
          }

          if (!data.candidates[0].content ||
              !data.candidates[0].content.parts ||
              !data.candidates[0].content.parts.length ||
              !data.candidates[0].content.parts[0].text) {
            console.error('Invalid API Response Structure:', data);
            if (attempt < MAX_RETRIES - 1) {
              const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
              await sleep(delay);
              continue;
            }
            lastError = new Error('Invalid response structure from API.');
            break;
          }

          // Successfully got a valid response!
          const recipeText = data.candidates[0].content.parts[0].text;
          const recipe = parseRecipeResponse(recipeText);

          console.log(`Success with model ${model} on attempt ${attempt + 1}`);
          return NextResponse.json({ recipe });

        } catch (error) {
          console.error(`Error on attempt ${attempt + 1} with model ${model}:`, error);

          // Handle timeout errors
          if (error instanceof Error && error.name === 'AbortError') {
            if (attempt < MAX_RETRIES - 1) {
              const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
              console.log(`Request timeout. Retrying in ${delay}ms...`);
              await sleep(delay);
              continue;
            }
            lastError = new Error('Request timed out. The service may be experiencing high load. Please try again.');
            break;
          }

          // Handle other errors
          if (attempt < MAX_RETRIES - 1) {
            const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
            await sleep(delay);
            continue;
          }

          lastError = error instanceof Error ? error : new Error('Unknown error occurred');
          break;
        }
      }
    }

    // If we get here, all retries and models failed
    throw lastError || new Error('All attempts to generate a recipe failed. Please try again later.');

  } catch (error) {
    console.error('Recipe generation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    // Enhanced error messages for users
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    // Provide helpful context based on error type
    let userMessage = errorMessage;
    let suggestions: string[] = [];

    if (errorMessage.includes('high demand') || errorMessage.includes('overloaded')) {
      userMessage = 'The AI service is currently experiencing high demand.';
      suggestions = [
        'Wait 30-60 seconds and try again',
        'Try during off-peak hours (early morning or late evening)',
        'Your preferences have been saved - just click "Generate Recipe" again'
      ];
    } else if (errorMessage.includes('timeout')) {
      userMessage = 'The request took too long to complete.';
      suggestions = [
        'Check your internet connection',
        'Try again in a few moments',
        'The service may be experiencing temporary issues'
      ];
    } else if (errorMessage.includes('safety filters')) {
      userMessage = 'The AI couldn\'t generate a recipe with these specific requirements.';
      suggestions = [
        'Try adjusting your dietary restrictions',
        'Modify your nutrition targets slightly',
        'Try a different primary goal'
      ];
    }

    return NextResponse.json(
      {
        error: userMessage,
        suggestions: suggestions.length > 0 ? suggestions : undefined,
        technicalDetails: errorMessage !== userMessage ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}