# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nourish** is a full-stack web application that generates personalized dinner recipes using Google's Gemini AI. Built with Next.js 14, TypeScript, and optimized for deployment on Vercel.

## Architecture

### Full-Stack Structure
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Custom CSS with CSS Variables (preserved from original design)
- **API**: Server-side routes for secure API key management
- **Deployment**: Optimized for Vercel

### Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate-recipe/
│   │       └── route.ts           # Secure API endpoint
│   ├── globals.css                # All styles (migrated from original)
│   ├── layout.tsx                 # Root layout with font optimization
│   └── page.tsx                   # Main application page
├── components/
│   ├── PreferencesForm.tsx        # User input form
│   ├── RecipeCard.tsx             # Recipe display component
│   ├── LoadingState.tsx           # Loading spinner
│   └── ErrorMessage.tsx           # Error handling component
├── lib/
│   ├── promptBuilder.ts           # AI prompt construction
│   └── recipeParser.ts            # Response parsing logic
└── types/
    ├── preferences.ts             # User preference types
    └── recipe.ts                  # Recipe data types
```

## Key Components

### Frontend Components

**PreferencesForm** (`src/components/PreferencesForm.tsx`):
- Collects user preferences (goals, nutrition, dietary restrictions)
- Custom checkbox styling using hidden inputs + labels
- Form validation before submission

**RecipeCard** (`src/components/RecipeCard.tsx`):
- Displays generated recipe with full details
- Nutrition grid with calories, protein, carbs, fat, time
- Ingredients list and step-by-step instructions
- "Why This Works" explanation section

**Main Page** (`src/app/page.tsx`):
- React state management for recipe, loading, and error states
- Handles form submission and API calls
- "Generate Another" and "Change Preferences" functionality

### Backend API

**API Route** (`src/app/api/generate-recipe/route.ts`):
- POST endpoint: `/api/generate-recipe`
- Server-side API key handling (never exposed to client)
- Request validation with Zod schemas
- Comprehensive error handling
- Returns structured recipe data

**Security Features:**
- API key stored in environment variables (`.env.local`)
- Input validation on all user data
- Proper error messages without exposing internals
- CORS and security headers configured in `next.config.js`

### Utility Functions

**Prompt Builder** (`src/lib/promptBuilder.ts`):
- Constructs structured prompts for Gemini AI
- Includes goals, nutrition targets, dietary restrictions
- Specifies exact output format for parsing

**Recipe Parser** (`src/lib/recipeParser.ts`):
- Extracts recipe data from AI response using regex
- Flexible parsing with fallbacks for varying formats
- Handles edge cases in AI responses

## Gemini API Integration

**Current Model**: `gemini-2.5-flash`

**Request Structure:**
```typescript
{
  contents: [{
    role: 'user',
    parts: [{ text: prompt }]
  }],
  generationConfig: {
    temperature: 0.9,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 4096
  }
}
```

**Expected Response Format:**
```
RECIPE NAME: [name]
CALORIES: [number]
PROTEIN: [number]
CARBS: [number]
FAT: [number]
PREP TIME: [number]
COOK TIME: [number]

INGREDIENTS:
- [item 1]
- [item 2]

INSTRUCTIONS:
1. [step 1]
2. [step 2]

WHY THIS WORKS:
[explanation]
```

## Design System

**Preserved from Original:**
- Custom CSS variables for consistent theming (forest green, terracotta, sage)
- Typography: Fraunces (display), Outfit (body), Space Mono (data)
- Organic/wellness aesthetic with animated background shapes
- Fully responsive grid layout

**Color Variables** (in `src/app/globals.css`):
```css
--forest: #1a3a2e;      /* Primary dark */
--terracotta: #e07a5f;  /* Accent/CTA */
--sage: #81b29a;        /* Interactive */
--cream: #f4f1ea;       /* Background */
--warm-white: #fdfcf9;  /* Cards */
```

**Font Loading:**
Optimized with Next.js font system in `src/app/layout.tsx`:
- Google Fonts loaded with `display: 'swap'` for performance
- Font variables available throughout app

## Running the App

### Development

```bash
# Install dependencies
npm install

# Set up environment variables
# Edit .env.local and add your Gemini API key
GEMINI_API_KEY=your_actual_api_key_here

# Start dev server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

**Required:**
- `GEMINI_API_KEY`: Your Google Gemini API key from https://aistudio.google.com/app/apikey

**Files:**
- `.env.local`: Local development (git-ignored, contains actual key)
- `.env.example`: Template for reference

### Deployment

**Vercel (Recommended):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Add GEMINI_API_KEY in Vercel dashboard
# Project Settings → Environment Variables
```

## Important Implementation Details

### Custom Checkbox Interaction

Checkboxes use custom styling with hidden inputs (same as original):
```html
<input type="checkbox" id="vegetarian" value="vegetarian">
<label htmlFor="vegetarian">Vegetarian</label>
```

The actual checkbox is visually hidden (`opacity: 0`), and the label provides the UI. When testing with Playwright or similar tools, click the label, not the checkbox input.

### API Error Handling

Three levels of error checking in `src/app/api/generate-recipe/route.ts`:
1. HTTP response status from Gemini API
2. Presence of `candidates` array in response
3. Validity of response structure (content.parts)

### CSS Critical Fix

**IMPORTANT**: The `#results` div in `globals.css` must NOT have `display: none`. React handles visibility through conditional rendering. Setting `display: none` in CSS will hide all results regardless of React state.

```css
/* CORRECT - Let React control visibility */
#results {
    animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

/* WRONG - This will hide everything */
#results {
    display: none;  /* ❌ Don't do this */
    animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Token Limits

Gemini API configured with 4096 tokens (in `route.ts`) to accommodate detailed recipes with 6+ instruction steps.

## Modifying the Design

**Color Scheme:**
Edit CSS variables in `src/app/globals.css` (lines 2-9):
```css
:root {
  --forest: #1a3a2e;
  --terracotta: #e07a5f;
  /* ... etc */
}
```

**Typography:**
Update font imports in `src/app/layout.tsx`

**Layout:**
Grid system uses `repeat(auto-fit, minmax(300px, 1fr))` for responsive columns

## API Endpoints

### POST `/api/generate-recipe`

**Request Body:**
```typescript
{
  primaryGoal: 'weight-loss' | 'muscle-gain' | 'maintenance' | 'quick-easy',
  maxCalories: number,        // 200-1500
  minProtein: number,         // 10-100g
  prepTime: number,           // 10-120 minutes
  dietaryRestrictions: string[], // ['vegetarian', 'vegan', etc.]
  allergies: string,
  equipment: string[]         // ['oven', 'stove', etc.]
}
```

**Response (Success):**
```typescript
{
  recipe: {
    name: string,
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
    prepTime: number,
    cookTime: number,
    ingredients: string[],
    instructions: string,
    whyItWorks: string
  }
}
```

**Response (Error):**
```typescript
{
  error: string,
  details?: object  // Validation errors if applicable
}
```

## Type Safety

All data structures are strongly typed with TypeScript:
- `UserPreferences` in `src/types/preferences.ts`
- `Recipe` and `GeminiResponse` in `src/types/recipe.ts`

Request validation uses Zod schemas for runtime type checking.

## Known Constraints & Considerations

### API Rate Limiting
- Free tier Gemini API can get overloaded during peak times
- App handles 503 errors gracefully with user-friendly messages
- Consider implementing retry logic or rate limiting for production

### State Management
- Currently uses React useState (sufficient for current scope)
- Consider Redux/Zustand if adding more complex features like recipe history

### Caching
- No recipe caching currently implemented
- Each request generates a new recipe via API
- Could add localStorage caching for recent recipes

### Browser Compatibility
- Requires modern browser with ES6+ support
- Tested in Chrome, Firefox, Safari, Edge

## Migration Notes

This application was migrated from a single-file HTML application to a full-stack Next.js architecture. Key improvements:

- ✅ **Security**: API key moved from client-side localStorage to server-side environment variables
- ✅ **Type Safety**: Full TypeScript implementation with Zod validation
- ✅ **Scalability**: Component-based architecture easy to extend
- ✅ **Performance**: Next.js optimizations (fonts, code splitting, etc.)
- ✅ **Error Handling**: Comprehensive error boundaries and user feedback
- ✅ **Deployment**: Production-ready for Vercel or any Node.js platform

Original single-file version preserved in `backup-original/` directory.

## Future Enhancement Ideas

- **Recipe History**: Save generated recipes to database (Vercel KV/Postgres)
- **User Accounts**: Authentication with NextAuth.js
- **Favorites**: Mark and save favorite recipes
- **Meal Planning**: Generate weekly meal plans
- **Shopping Lists**: Auto-generate shopping lists from recipes
- **Image Generation**: Add recipe photos via AI image generation
- **Nutritional Tracking**: Track daily/weekly nutrition totals
- **Social Sharing**: Share recipes with friends
- **Mobile App**: React Native version

## Development Tips

- **Hot Reload**: Next.js dev server auto-reloads on file changes
- **TypeScript**: Run `npm run type-check` to check for type errors
- **Linting**: Run `npm run lint` for code quality checks
- **Debugging**: Use React DevTools browser extension
- **API Testing**: Test API routes directly via Postman or curl

## Troubleshooting

**Port Already in Use:**
- Next.js will auto-increment port (3000 → 3001 → 3002)
- Or manually specify: `PORT=3005 npm run dev`

**API Key Not Found:**
- Verify `.env.local` exists and contains `GEMINI_API_KEY`
- Restart dev server after changing `.env.local`
- Check for typos in environment variable name

**Styles Not Updating:**
- Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
- Clear `.next` cache: `rm -rf .next` then restart

**TypeScript Errors:**
- Run `npm run type-check` to see all errors
- Check that all imports use correct paths with `@/` alias

## Contributing

When adding new features:
1. Create new components in `src/components/`
2. Add types in `src/types/`
3. Keep utility functions in `src/lib/`
4. Follow existing naming conventions
5. Maintain TypeScript strict mode compliance
6. Test on mobile viewports