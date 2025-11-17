'use client';

import { Recipe } from '@/types/recipe';
import { ManualMeal } from '@/types/mealLog';

interface RecipeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe?: Recipe;
  manualMeal?: ManualMeal;
  mealType?: string;
}

export default function RecipeDetailModal({
  isOpen,
  onClose,
  recipe,
  manualMeal,
  mealType
}: RecipeDetailModalProps) {
  if (!isOpen) return null;

  const getMealName = () => {
    if (recipe) return recipe.name;
    if (manualMeal) return manualMeal.name;
    return 'Meal Details';
  };

  const getNutrition = () => {
    if (recipe) {
      return {
        calories: recipe.calories,
        protein: recipe.protein,
        carbs: recipe.carbs,
        fat: recipe.fat,
      };
    }
    if (manualMeal) {
      return {
        calories: manualMeal.calories || 0,
        protein: manualMeal.protein || 0,
        carbs: manualMeal.carbs || 0,
        fat: manualMeal.fat || 0,
      };
    }
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  };

  const nutrition = getNutrition();

  return (
    <div className="recipe-detail-overlay" onClick={onClose}>
      <div className="recipe-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="recipe-detail-header">
          <div>
            <h2 className="recipe-detail-title">{getMealName()}</h2>
            {mealType && (
              <p className="recipe-detail-meal-type">
                {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
              </p>
            )}
          </div>
          <button className="recipe-detail-close" onClick={onClose} aria-label="Close">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="recipe-detail-nutrition">
          <div className="nutrition-item">
            <div className="nutrition-value">{nutrition.calories}</div>
            <div className="nutrition-label">Calories</div>
          </div>
          <div className="nutrition-item">
            <div className="nutrition-value">{nutrition.protein}g</div>
            <div className="nutrition-label">Protein</div>
          </div>
          <div className="nutrition-item">
            <div className="nutrition-value">{nutrition.carbs}g</div>
            <div className="nutrition-label">Carbs</div>
          </div>
          <div className="nutrition-item">
            <div className="nutrition-value">{nutrition.fat}g</div>
            <div className="nutrition-label">Fat</div>
          </div>
          {recipe && (
            <div className="nutrition-item">
              <div className="nutrition-value">{recipe.prepTime + recipe.cookTime}</div>
              <div className="nutrition-label">Minutes</div>
            </div>
          )}
        </div>

        <div className="recipe-detail-content">
          {recipe?.whyItWorks && (
            <div className="recipe-detail-section">
              <h3>Why This Works</h3>
              <p>{recipe.whyItWorks}</p>
            </div>
          )}

          {recipe && (
            <>
              <div className="recipe-detail-section">
                <h3>Ingredients</h3>
                <ul className="recipe-detail-list">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="recipe-detail-section">
                <h3>Instructions</h3>
                <div className="recipe-detail-instructions">{recipe.instructions}</div>
              </div>
            </>
          )}

          {manualMeal?.notes && (
            <div className="recipe-detail-section">
              <h3>Notes</h3>
              <p>{manualMeal.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
