'use client';

import { useState } from 'react';
import { LoggedMeal } from '@/types/mealLog';
import { deleteMeal, groupMealsByDate } from '@/lib/mealLogger';

interface MealHistoryProps {
  meals: LoggedMeal[];
  onMealDeleted?: () => void;
}

interface MealCardProps {
  meal: LoggedMeal;
  onDelete: () => void;
}

function MealCard({ meal, onDelete }: MealCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleDelete = () => {
    deleteMeal(meal.id);
    onDelete();
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getMealTypeEmoji = (type?: string) => {
    switch (type) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '☀️';
      case 'dinner':
        return '🌙';
      case 'snack':
        return '🍎';
      default:
        return '🍽️';
    }
  };

  return (
    <div className={`meal-card ${expanded ? 'expanded' : ''}`}>
      <div className="meal-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="meal-card-time">
          <span className="meal-type-emoji">{getMealTypeEmoji(meal.mealType)}</span>
          <span className="meal-time">{formatTime(meal.loggedAt)}</span>
        </div>
        <h4 className="meal-card-title">{meal.recipe.name}</h4>
        <button
          className="meal-card-expand"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <div className="meal-card-nutrition">
        <div className="nutrition-badge">
          <span className="badge-value">{meal.recipe.calories}</span>
          <span className="badge-label">cal</span>
        </div>
        <div className="nutrition-badge">
          <span className="badge-value">{meal.recipe.protein}g</span>
          <span className="badge-label">protein</span>
        </div>
        <div className="nutrition-badge">
          <span className="badge-value">{meal.recipe.carbs}g</span>
          <span className="badge-label">carbs</span>
        </div>
        <div className="nutrition-badge">
          <span className="badge-value">{meal.recipe.fat}g</span>
          <span className="badge-label">fat</span>
        </div>
      </div>

      {expanded && (
        <div className="meal-card-details">
          <div className="meal-detail-section">
            <h5>Ingredients</h5>
            <ul>
              {meal.recipe.ingredients.map((ingredient, idx) => (
                <li key={idx}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div className="meal-detail-section">
            <h5>Instructions</h5>
            <p>{meal.recipe.instructions}</p>
          </div>

          {showConfirm ? (
            <div className="meal-delete-confirm">
              <p>Delete this meal from your log?</p>
              <div className="confirm-buttons">
                <button className="confirm-yes" onClick={handleDelete}>
                  Yes, Delete
                </button>
                <button className="confirm-no" onClick={() => setShowConfirm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button className="meal-delete-button" onClick={() => setShowConfirm(true)}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Delete Meal
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function getDateLabel(dateKey: string): string {
  const date = new Date(dateKey);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return 'Today';
  } else if (date.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }
}

export default function MealHistory({ meals, onMealDeleted }: MealHistoryProps) {
  const groupedMeals = groupMealsByDate(meals);
  const sortedDates = Array.from(groupedMeals.keys()).sort((a, b) => b.localeCompare(a));

  if (meals.length === 0) {
    return (
      <div className="meal-history-empty">
        <div className="empty-icon">🌱</div>
        <h3>No meals logged yet</h3>
        <p>Start tracking your meals to see your nutrition journey</p>
      </div>
    );
  }

  return (
    <div className="meal-history">
      <div className="meal-timeline">
        {sortedDates.map((dateKey, idx) => {
          const dayMeals = groupedMeals.get(dateKey)!;
          return (
            <div key={dateKey} className="timeline-day" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="day-header">
                <h3 className="day-label">{getDateLabel(dateKey)}</h3>
                <span className="day-count">
                  {dayMeals.length} {dayMeals.length === 1 ? 'meal' : 'meals'}
                </span>
              </div>
              <div className="day-meals">
                {dayMeals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} onDelete={onMealDeleted || (() => {})} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
