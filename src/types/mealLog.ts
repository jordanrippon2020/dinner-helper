import { Recipe } from './recipe';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface LoggedMeal {
  id: string;
  recipe: Recipe;
  loggedAt: string; // ISO date string for easy serialization
  mealType?: MealType;
}

export interface NutritionSummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealCount: number;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface DateRange {
  start: Date;
  end: Date;
}
