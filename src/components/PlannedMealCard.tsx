'use client';

import { useState } from 'react';
import { PlannedMeal } from '@/types/mealLog';
import { deletePlannedMeal } from '@/lib/mealPlanner';
import { saveMeal } from '@/lib/mealLogger';
import DatePicker from './DatePicker';
import RecipeDetailModal from './RecipeDetailModal';

interface PlannedMealCardProps {
  meal: PlannedMeal;
  onUpdate?: () => void;
}

export default function PlannedMealCard({ meal, onUpdate }: PlannedMealCardProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getMealName = () => {
    if (meal.recipe) {
      return meal.recipe.name;
    }
    if (meal.manualMeal) {
      return meal.manualMeal.name;
    }
    return 'Unnamed Meal';
  };

  const getNutrition = () => {
    if (meal.recipe) {
      return {
        calories: meal.recipe.calories,
        protein: meal.recipe.protein,
        carbs: meal.recipe.carbs,
        fat: meal.recipe.fat,
      };
    }
    if (meal.manualMeal) {
      return {
        calories: meal.manualMeal.calories || 0,
        protein: meal.manualMeal.protein || 0,
        carbs: meal.manualMeal.carbs || 0,
        fat: meal.manualMeal.fat || 0,
      };
    }
    return { calories: 0, protein: 0, carbs: 0, fat: 0 };
  };

  const handleDelete = () => {
    deletePlannedMeal(meal.id);
    onUpdate?.();
  };

  const handleMarkComplete = (actualDate: string) => {
    // Log the meal to the chosen date
    if (meal.recipe) {
      saveMeal(meal.recipe, meal.mealType);
    }
    // Then delete from planned meals
    deletePlannedMeal(meal.id);
    setShowCompleteDialog(false);
    onUpdate?.();
  };

  const nutrition = getNutrition();

  return (
    <>
      <div className="planned-meal-card" onClick={() => setShowDetailModal(true)}>
        <div className="planned-meal-header">
          <h5 className="planned-meal-name">{getMealName()}</h5>
          <button
            className="planned-meal-options"
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions(!showOptions);
            }}
          >
            ⋮
          </button>
        </div>

        <div className="planned-meal-nutrition-preview">
          <span>{nutrition.calories} cal</span>
          <span>{nutrition.protein}g protein</span>
        </div>

        {showOptions && (
          <div className="planned-meal-options-menu" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { setShowCompleteDialog(true); setShowOptions(false); }}>
              ✓ Mark Completed
            </button>
            <button onClick={handleDelete} className="delete-option">
              🗑️ Delete
            </button>
          </div>
        )}

        {showCompleteDialog && (
          <div className="complete-dialog" onClick={(e) => e.stopPropagation()}>
            <p>When did you eat this meal?</p>
            <DatePicker
              onSelectDate={handleMarkComplete}
              minDate={(() => {
                const d = new Date();
                d.setDate(d.getDate() - 7); // Allow logging up to 7 days ago
                return d;
              })()}
              maxDate={new Date()}
            />
            <button onClick={() => setShowCompleteDialog(false)} className="cancel-btn">
              Cancel
            </button>
          </div>
        )}
      </div>

      <RecipeDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        recipe={meal.recipe}
        manualMeal={meal.manualMeal}
        mealType={meal.mealType}
      />
    </>
  );
}
