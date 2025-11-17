export interface UserPreferences {
  primaryGoal: 'weight-loss' | 'muscle-gain' | 'maintenance' | 'quick-easy';
  maxCalories: number;
  minProtein: number;
  prepTime: number;
  dietaryRestrictions: string[];
  allergies: string;
  equipment: string[];
}