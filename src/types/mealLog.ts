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

// Meal Planning Types

export interface ManualMeal {
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  notes?: string;
}

export interface PlannedMeal {
  id: string;
  plannedFor: string; // ISO date string (date only, e.g., "2024-12-18")
  mealType: MealType; // Required for planning
  recipe?: Recipe; // Optional - from generated recipe
  manualMeal?: ManualMeal; // Optional - manual text entry
  createdAt: string; // When the plan was created
  completed?: boolean; // If moved to meal log
}

export interface DayPlan {
  date: string; // ISO date string
  breakfast: PlannedMeal[];
  lunch: PlannedMeal[];
  dinner: PlannedMeal[];
  snack: PlannedMeal[];
}
