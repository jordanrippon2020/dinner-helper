import { Recipe } from '@/types/recipe';
import { LoggedMeal, MealType, NutritionSummary, DateRange } from '@/types/mealLog';
import { getFromStorage, setToStorage, STORAGE_KEYS } from './localStorage';

/**
 * Generate a unique ID for a logged meal
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all logged meals from storage
 */
export function getAllMeals(): LoggedMeal[] {
  return getFromStorage<LoggedMeal[]>(STORAGE_KEYS.MEAL_LOG, []);
}

/**
 * Save a new meal to the log
 */
export function saveMeal(recipe: Recipe, mealType?: MealType): LoggedMeal {
  const meals = getAllMeals();

  const newMeal: LoggedMeal = {
    id: generateId(),
    recipe,
    loggedAt: new Date().toISOString(),
    mealType,
  };

  meals.unshift(newMeal); // Add to beginning (most recent first)
  setToStorage(STORAGE_KEYS.MEAL_LOG, meals);

  return newMeal;
}

/**
 * Delete a meal from the log by ID
 */
export function deleteMeal(id: string): boolean {
  const meals = getAllMeals();
  const filteredMeals = meals.filter((meal) => meal.id !== id);

  if (filteredMeals.length === meals.length) {
    return false; // ID not found
  }

  setToStorage(STORAGE_KEYS.MEAL_LOG, filteredMeals);
  return true;
}

/**
 * Get meals within a specific date range
 */
export function getMealsByDateRange(dateRange?: DateRange): LoggedMeal[] {
  const meals = getAllMeals();

  if (!dateRange) {
    return meals;
  }

  return meals.filter((meal) => {
    const mealDate = new Date(meal.loggedAt);
    return mealDate >= dateRange.start && mealDate <= dateRange.end;
  });
}

/**
 * Get meals for today
 */
export function getTodaysMeals(): LoggedMeal[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getMealsByDateRange({
    start: today,
    end: tomorrow,
  });
}

/**
 * Get meals from the last N days
 */
export function getRecentMeals(days: number = 30): LoggedMeal[] {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);

  return getMealsByDateRange({ start, end });
}

/**
 * Calculate nutrition summary for a set of meals
 */
export function getNutritionSummary(meals: LoggedMeal[]): NutritionSummary {
  if (meals.length === 0) {
    return {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      mealCount: 0,
      dateRange: {
        start: new Date().toISOString(),
        end: new Date().toISOString(),
      },
    };
  }

  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.recipe.calories,
      protein: acc.protein + meal.recipe.protein,
      carbs: acc.carbs + meal.recipe.carbs,
      fat: acc.fat + meal.recipe.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const dates = meals.map((m) => new Date(m.loggedAt));
  const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));
  const latest = new Date(Math.max(...dates.map((d) => d.getTime())));

  return {
    totalCalories: Math.round(totals.calories),
    totalProtein: Math.round(totals.protein),
    totalCarbs: Math.round(totals.carbs),
    totalFat: Math.round(totals.fat),
    mealCount: meals.length,
    dateRange: {
      start: earliest.toISOString(),
      end: latest.toISOString(),
    },
  };
}

/**
 * Group meals by date
 */
export function groupMealsByDate(meals: LoggedMeal[]): Map<string, LoggedMeal[]> {
  const grouped = new Map<string, LoggedMeal[]>();

  meals.forEach((meal) => {
    const date = new Date(meal.loggedAt);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(meal);
  });

  return grouped;
}

/**
 * Clear all logged meals
 */
export function clearAllMeals(): boolean {
  return setToStorage(STORAGE_KEYS.MEAL_LOG, []);
}
