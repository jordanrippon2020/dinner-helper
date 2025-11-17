import { UserPreferences } from '@/types/preferences';

export function buildPrompt(prefs: UserPreferences): string {
    let prompt = `You are a nutritionist and chef. Create ONE specific dinner recipe suggestion based on these requirements:\n\n`;

    prompt += `GOALS:\n`;
    prompt += `- Primary goal: ${prefs.primaryGoal}\n`;
    prompt += `- Maximum ${prefs.maxCalories} calories per serving\n`;
    prompt += `- Minimum ${prefs.minProtein}g protein per serving\n`;
    prompt += `- Maximum ${prefs.prepTime} minutes prep and cook time\n\n`;

    if (prefs.dietaryRestrictions.length > 0) {
        prompt += `DIETARY RESTRICTIONS: ${prefs.dietaryRestrictions.join(', ')}\n\n`;
    }

    if (prefs.allergies) {
        prompt += `AVOID: ${prefs.allergies}\n\n`;
    }

    prompt += `AVAILABLE EQUIPMENT: ${prefs.equipment.join(', ')}\n\n`;

    prompt += `Please provide the response in this EXACT format:\n\n`;
    prompt += `RECIPE NAME: [Name of the dish]\n`;
    prompt += `CALORIES: [number only]\n`;
    prompt += `PROTEIN: [number only]\n`;
    prompt += `CARBS: [number only]\n`;
    prompt += `FAT: [number only]\n`;
    prompt += `PREP TIME: [number only]\n`;
    prompt += `COOK TIME: [number only]\n\n`;
    prompt += `INGREDIENTS:\n[List each ingredient on a new line with - prefix]\n\n`;
    prompt += `INSTRUCTIONS:\n[Number each step]\n\n`;
    prompt += `WHY THIS WORKS:\n[1-2 sentences explaining why this meal fits their goals]\n\n`;
    prompt += `Make it simple, delicious, and perfectly matched to their goals. Be creative but practical!`;

    return prompt;
}