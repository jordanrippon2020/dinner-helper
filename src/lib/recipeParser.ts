import { Recipe } from '@/types/recipe';

export function parseRecipeResponse(text: string): Recipe {
    const recipe: Recipe = {
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        prepTime: 0,
        cookTime: 0,
        ingredients: [],
        instructions: '',
        whyItWorks: ''
    };

    const nameMatch = text.match(/RECIPE NAME:\s*(.+)/i);
    if (nameMatch) recipe.name = nameMatch[1].trim();

    const caloriesMatch = text.match(/CALORIES:\s*(\d+)/i);
    if (caloriesMatch) recipe.calories = parseInt(caloriesMatch[1]);

    const proteinMatch = text.match(/PROTEIN:\s*(\d+)/i);
    if (proteinMatch) recipe.protein = parseInt(proteinMatch[1]);

    const carbsMatch = text.match(/CARBS:\s*(\d+)/i);
    if (carbsMatch) recipe.carbs = parseInt(carbsMatch[1]);

    const fatMatch = text.match(/FAT:\s*(\d+)/i);
    if (fatMatch) recipe.fat = parseInt(fatMatch[1]);

    const prepTimeMatch = text.match(/PREP TIME:\s*(\d+)/i);
    if (prepTimeMatch) recipe.prepTime = parseInt(prepTimeMatch[1]);

    const cookTimeMatch = text.match(/COOK TIME:\s*(\d+)/i);
    if (cookTimeMatch) recipe.cookTime = parseInt(cookTimeMatch[1]);

    const ingredientsMatch = text.match(/INGREDIENTS:\s*\n([\s\S]*?)(?=\n\n|INSTRUCTIONS:)/i);
    if (ingredientsMatch) {
        recipe.ingredients = ingredientsMatch[1]
            .split('\n')
            .filter(line => line.trim())
            .map(line => line.replace(/^-\s*/, '').trim());
    }

    // Extract instructions - more flexible matching
    const instructionsMatch = text.match(/INSTRUCTIONS:\s*\n([\s\S]*?)(?=\n+WHY THIS WORKS:|$)/i);
    if (instructionsMatch) {
        recipe.instructions = instructionsMatch[1].trim();
    } else {
        // Fallback: try to get everything after INSTRUCTIONS:
        const fallbackMatch = text.match(/INSTRUCTIONS:\s*\n([\s\S]*)/i);
        if (fallbackMatch) {
            // Remove "WHY THIS WORKS:" section if it exists
            recipe.instructions = fallbackMatch[1].replace(/\n+WHY THIS WORKS:[\s\S]*/i, '').trim();
        }
    }

    const whyMatch = text.match(/WHY THIS WORKS:\s*\n([\s\S]*?)$/i);
    if (whyMatch) {
        recipe.whyItWorks = whyMatch[1].trim();
    }

    return recipe;
}