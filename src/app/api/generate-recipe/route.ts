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

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to get suggestion from Gemini API');
    }

    const data: GeminiResponse = await response.json();

    // Validate response structure
    if (!data.candidates || !data.candidates.length) {
      console.error('Invalid API Response:', data);
      throw new Error('No response generated. The API may have blocked the request due to safety filters.');
    }

    if (!data.candidates[0].content ||
        !data.candidates[0].content.parts ||
        !data.candidates[0].content.parts.length ||
        !data.candidates[0].content.parts[0].text) {
      console.error('Invalid API Response Structure:', data);
      throw new Error('Invalid response structure from API.');
    }

    const recipeText = data.candidates[0].content.parts[0].text;
    const recipe = parseRecipeResponse(recipeText);

    return NextResponse.json({ recipe });

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

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}