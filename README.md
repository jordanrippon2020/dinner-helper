# Nourish - Intelligent Dinner Companion

A modern, full-stack web application that generates personalized dinner recipes using Google's Gemini AI. Built with Next.js 14, TypeScript, and optimized for deployment on Vercel.

## Overview

**Nourish** transforms dinner planning by creating personalized recipe suggestions based on your dietary goals, restrictions, and available equipment. Originally a single HTML file, now a secure, scalable full-stack application.

## Features

- **Personalized Recipe Generation**: AI-powered recipes tailored to your specific nutritional goals
- **Secure API Integration**: Server-side API key management for enhanced security
- **Beautiful Design**: Organic, wellness-focused aesthetic with smooth animations
- **Responsive Interface**: Works seamlessly on desktop, tablet, and mobile devices
- **Nutritional Tracking**: Detailed macro breakdowns for every recipe
- **Equipment Awareness**: Recipes matched to your available kitchen tools

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Model**: [Google Gemini 2.5 Flash](https://ai.google.dev/)
- **Styling**: Custom CSS with CSS Variables
- **Fonts**: Google Fonts (Fraunces, Outfit, Space Mono)
- **Deployment**: [Vercel](https://vercel.com/)
- **Validation**: [Zod](https://zod.dev/)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dinner-helper-app.git
cd dinner-helper-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and add your Gemini API key
GEMINI_API_KEY=your_actual_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
dinner-helper-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate-recipe/
│   │   │       └── route.ts       # Secure API endpoint
│   │   ├── globals.css            # Global styles
│   │   ├── layout.tsx             # Root layout with fonts
│   │   └── page.tsx               # Main application page
│   ├── components/
│   │   ├── PreferencesForm.tsx    # User input form
│   │   ├── RecipeCard.tsx         # Recipe display
│   │   ├── LoadingState.tsx       # Loading indicator
│   │   └── ErrorMessage.tsx       # Error handling
│   ├── lib/
│   │   ├── promptBuilder.ts       # AI prompt construction
│   │   └── recipeParser.ts        # Response parsing
│   └── types/
│       ├── preferences.ts          # User preference types
│       └── recipe.ts              # Recipe data types
├── public/                        # Static assets
├── .env.local                     # Environment variables (git-ignored)
├── next.config.js                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies
└── vercel.json                    # Vercel deployment config
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Set environment variables in Vercel Dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `GEMINI_API_KEY` with your API key

### Alternative Deployment

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Digital Ocean App Platform
- Self-hosted with Node.js

## API Routes

### POST `/api/generate-recipe`

Generates a personalized recipe based on user preferences.

**Request Body:**
```typescript
{
  primaryGoal: 'weight-loss' | 'muscle-gain' | 'maintenance' | 'quick-easy',
  maxCalories: number,        // 200-1500
  minProtein: number,         // 10-100g
  prepTime: number,           // 10-120 minutes
  dietaryRestrictions: string[], // ['vegetarian', 'vegan', etc.]
  allergies: string,          // Free text
  equipment: string[]         // ['oven', 'stove', etc.]
}
```

**Response:**
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

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Key Design Decisions

1. **Server-Side API Key**: Moved from client-side localStorage to server-side environment variables for security
2. **Component Architecture**: Separated concerns into reusable React components
3. **Type Safety**: Full TypeScript implementation with Zod validation
4. **Error Handling**: Comprehensive error boundaries and user-friendly messages
5. **Performance**: Next.js font optimization and static generation where possible

## Configuration

### Customizing the Theme

Edit CSS variables in `src/app/globals.css`:

```css
:root {
  --forest: #1a3a2e;      /* Primary dark */
  --terracotta: #e07a5f;  /* Accent */
  --sage: #81b29a;        /* Interactive */
  --cream: #f4f1ea;       /* Background */
  /* ... more variables */
}
```

### Adjusting Recipe Parameters

Modify validation limits in `src/app/api/generate-recipe/route.ts`:

```typescript
const PreferencesSchema = z.object({
  maxCalories: z.number().min(200).max(1500),
  minProtein: z.number().min(10).max(100),
  // ... adjust as needed
});
```

## Security Considerations

- **API Key Protection**: Never commit `.env.local` to version control
- **Input Validation**: All user inputs validated with Zod schemas
- **Rate Limiting**: Consider implementing rate limiting for production
- **CORS**: Configure appropriate CORS headers if needed

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Migration from v1

The original single-file HTML version is preserved in `backup-original/index.html`. Key improvements in v2:

- ✅ Secure server-side API key management
- ✅ Component-based architecture
- ✅ TypeScript type safety
- ✅ Production-ready deployment
- ✅ Better error handling
- ✅ Optimized performance

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Google Gemini AI for recipe generation
- Vercel for hosting platform
- Next.js team for the amazing framework

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team

---

Built with ❤️ for food lovers who value their time and health.