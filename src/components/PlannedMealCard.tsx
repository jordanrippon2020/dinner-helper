'use client';

import { useState } from 'react';
import { PlannedMeal } from '@/types/mealLog';
import { deletePlannedMeal } from '@/lib/mealPlanner';
import { saveMeal } from '@/lib/mealLogger';
import DatePicker from './DatePicker';

interface PlannedMealCardProps {
  meal: PlannedMeal;
  onUpdate?: () => void;
}

export default function PlannedMealCard({ meal, onUpdate }: PlannedMealCardProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [expanded, setExpanded] = useState(false);

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
    <div className={`planned-meal-card ${expanded ? 'expanded' : ''}`}>
      <div className="planned-meal-header" onClick={() => setExpanded(!expanded)}>
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

      {showOptions && (
        <div className="planned-meal-options-menu">
          <button onClick={() => { setShowCompleteDialog(true); setShowOptions(false); }}>
            ✓ Mark Completed
          </button>
          <button onClick={handleDelete} className="delete-option">
            🗑️ Delete
          </button>
        </div>
      )}

      {showCompleteDialog && (
        <div className="complete-dialog">
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

      {expanded && (
        <div className="planned-meal-details">
          <div className="planned-meal-nutrition">
            <span>{nutrition.calories} cal</span>
            <span>{nutrition.protein}g protein</span>
            <span>{nutrition.carbs}g carbs</span>
            <span>{nutrition.fat}g fat</span>
          </div>

          {meal.recipe && (
            <>
              <div className="planned-meal-section">
                <h6>Ingredients</h6>
                <ul>
                  {meal.recipe.ingredients.map((ingredient, idx) => (
                    <li key={idx}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="planned-meal-section">
                <h6>Instructions</h6>
                <p>{meal.recipe.instructions}</p>
              </div>
            </>
          )}

          {meal.manualMeal?.notes && (
            <div className="planned-meal-section">
              <h6>Notes</h6>
              <p>{meal.manualMeal.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
