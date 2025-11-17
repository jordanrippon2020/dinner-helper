import { Recipe } from '@/types/recipe';
import { PlannedMeal, MealType, ManualMeal, DayPlan } from '@/types/mealLog';
import { getFromStorage, setToStorage, STORAGE_KEYS } from './localStorage';

// Add meal plan key to storage
const MEAL_PLAN_KEY = 'nourish_meal_plan';

/**
 * Generate a unique ID for a planned meal
 */
function generateId(): string {
  return `planned-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all planned meals from storage
 */
export function getAllPlannedMeals(): PlannedMeal[] {
  return getFromStorage<PlannedMeal[]>(MEAL_PLAN_KEY, []);
}

/**
 * Add a recipe to meal plan
 */
export function planRecipe(
  recipe: Recipe,
  plannedFor: string, // ISO date string
  mealType: MealType
): PlannedMeal {
  const meals = getAllPlannedMeals();

  const newPlannedMeal: PlannedMeal = {
    id: generateId(),
    plannedFor,
    mealType,
    recipe,
    createdAt: new Date().toISOString(),
    completed: false,
  };

  meals.push(newPlannedMeal);
  setToStorage(MEAL_PLAN_KEY, meals);

  return newPlannedMeal;
}

/**
 * Add a manual meal to meal plan
 */
export function planManualMeal(
  manualMeal: ManualMeal,
  plannedFor: string,
  mealType: MealType
): PlannedMeal {
  const meals = getAllPlannedMeals();

  const newPlannedMeal: PlannedMeal = {
    id: generateId(),
    plannedFor,
    mealType,
    manualMeal,
    createdAt: new Date().toISOString(),
    completed: false,
  };

  meals.push(newPlannedMeal);
  setToStorage(MEAL_PLAN_KEY, meals);

  return newPlannedMeal;
}

/**
 * Delete a planned meal by ID
 */
export function deletePlannedMeal(id: string): boolean {
  const meals = getAllPlannedMeals();
  const filteredMeals = meals.filter((meal) => meal.id !== id);

  if (filteredMeals.length === meals.length) {
    return false; // ID not found
  }

  setToStorage(MEAL_PLAN_KEY, filteredMeals);
  return true;
}

/**
 * Get planned meals for a specific date
 */
export function getPlannedMealsForDate(date: string): PlannedMeal[] {
  const meals = getAllPlannedMeals();
  return meals.filter((meal) => meal.plannedFor === date && !meal.completed);
}

/**
 * Get planned meals for a date range
 */
export function getPlannedMealsForRange(startDate: string, endDate: string): PlannedMeal[] {
  const meals = getAllPlannedMeals();
  return meals.filter((meal) => {
    const plannedDate = meal.plannedFor;
    return plannedDate >= startDate && plannedDate <= endDate && !meal.completed;
  });
}

/**
 * Get meals organized by day for a week
 */
export function getWeekPlan(weekStart: Date): DayPlan[] {
  const weekPlan: DayPlan[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    const dayMeals = getPlannedMealsForDate(dateStr);

    weekPlan.push({
      date: dateStr,
      breakfast: dayMeals.filter(m => m.mealType === 'breakfast'),
      lunch: dayMeals.filter(m => m.mealType === 'lunch'),
      dinner: dayMeals.filter(m => m.mealType === 'dinner'),
      snack: dayMeals.filter(m => m.mealType === 'snack'),
    });
  }

  return weekPlan;
}

/**
 * Get the Monday of the current week
 */
export function getMondayOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

/**
 * Get Monday of next week
 */
export function getNextWeekMonday(currentMonday: Date): Date {
  const nextMonday = new Date(currentMonday);
  nextMonday.setDate(nextMonday.getDate() + 7);
  return nextMonday;
}

/**
 * Get Monday of previous week
 */
export function getPreviousWeekMonday(currentMonday: Date): Date {
  const prevMonday = new Date(currentMonday);
  prevMonday.setDate(prevMonday.getDate() - 7);
  return prevMonday;
}

/**
 * Mark a planned meal as completed (NOT moved to log yet)
 * This is separate from actually logging it
 */
export function markPlannedMealAsCompleted(id: string): boolean {
  const meals = getAllPlannedMeals();
  const meal = meals.find(m => m.id === id);

  if (!meal) {
    return false;
  }

  meal.completed = true;
  setToStorage(MEAL_PLAN_KEY, meals);
  return true;
}

/**
 * Update a planned meal's date or meal type
 */
export function updatePlannedMeal(
  id: string,
  updates: { plannedFor?: string; mealType?: MealType }
): boolean {
  const meals = getAllPlannedMeals();
  const meal = meals.find(m => m.id === id);

  if (!meal) {
    return false;
  }

  if (updates.plannedFor) {
    meal.plannedFor = updates.plannedFor;
  }
  if (updates.mealType) {
    meal.mealType = updates.mealType;
  }

  setToStorage(MEAL_PLAN_KEY, meals);
  return true;
}

/**
 * Clear all planned meals
 */
export function clearAllPlannedMeals(): boolean {
  return setToStorage(MEAL_PLAN_KEY, []);
}

/**
 * Get formatted week range string
 */
export function getWeekRangeString(monday: Date): string {
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const startMonth = monthNames[monday.getMonth()];
  const endMonth = monthNames[sunday.getMonth()];

  if (monday.getMonth() === sunday.getMonth()) {
    return `${startMonth} ${monday.getDate()}-${sunday.getDate()}, ${monday.getFullYear()}`;
  } else {
    return `${startMonth} ${monday.getDate()} - ${endMonth} ${sunday.getDate()}, ${monday.getFullYear()}`;
  }
}
