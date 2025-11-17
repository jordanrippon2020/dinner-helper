import { LoggedMeal } from '@/types/mealLog';

/**
 * Export meals as JSON file
 */
export function exportAsJSON(meals: LoggedMeal[]): void {
  const dataStr = JSON.stringify(meals, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `nourish-meal-log-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Convert meals to CSV format
 */
function mealsToCSV(meals: LoggedMeal[]): string {
  if (meals.length === 0) {
    return 'No meals to export';
  }

  const headers = [
    'Date',
    'Time',
    'Meal Type',
    'Recipe Name',
    'Calories',
    'Protein (g)',
    'Carbs (g)',
    'Fat (g)',
    'Prep Time (min)',
    'Cook Time (min)',
  ];

  const rows = meals.map((meal) => {
    const date = new Date(meal.loggedAt);
    return [
      date.toLocaleDateString(),
      date.toLocaleTimeString(),
      meal.mealType || 'Not specified',
      meal.recipe.name,
      meal.recipe.calories,
      meal.recipe.protein,
      meal.recipe.carbs,
      meal.recipe.fat,
      meal.recipe.prepTime,
      meal.recipe.cookTime,
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Export meals as CSV file
 */
export function exportAsCSV(meals: LoggedMeal[]): void {
  const csvContent = mealsToCSV(meals);
  const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `nourish-meal-log-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
