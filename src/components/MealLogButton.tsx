'use client';

import { useState } from 'react';
import { Recipe } from '@/types/recipe';
import { MealType } from '@/types/mealLog';
import { saveMeal } from '@/lib/mealLogger';

interface MealLogButtonProps {
  recipe: Recipe;
  onSaved?: () => void;
}

export default function MealLogButton({ recipe, onSaved }: MealLogButtonProps) {
  const [showMealTypeSelect, setShowMealTypeSelect] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (mealType?: MealType) => {
    saveMeal(recipe, mealType);
    setSaved(true);
    setShowMealTypeSelect(false);

    // Show success state for 2 seconds
    setTimeout(() => {
      setSaved(false);
      onSaved?.();
    }, 2000);
  };

  const handleQuickSave = () => {
    handleSave(); // Save without meal type
  };

  const mealTypes: { value: MealType; label: string; emoji: string }[] = [
    { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
    { value: 'lunch', label: 'Lunch', emoji: '☀️' },
    { value: 'dinner', label: 'Dinner', emoji: '🌙' },
    { value: 'snack', label: 'Snack', emoji: '🍎' },
  ];

  if (saved) {
    return (
      <div className="meal-log-success">
        <span className="success-icon">✓</span>
        <span className="success-text">Saved to Log</span>
      </div>
    );
  }

  if (showMealTypeSelect) {
    return (
      <div className="meal-type-selector">
        <button
          className="meal-type-close"
          onClick={() => setShowMealTypeSelect(false)}
          aria-label="Close"
        >
          ×
        </button>
        <p className="meal-type-prompt">Save as:</p>
        <div className="meal-type-buttons">
          {mealTypes.map(({ value, label, emoji }) => (
            <button
              key={value}
              className="meal-type-option"
              onClick={() => handleSave(value)}
            >
              <span className="meal-type-emoji">{emoji}</span>
              <span className="meal-type-label">{label}</span>
            </button>
          ))}
        </div>
        <button className="meal-type-skip" onClick={handleQuickSave}>
          Skip & Save
        </button>
      </div>
    );
  }

  return (
    <div className="meal-log-button-group">
      <button
        className="meal-log-button primary"
        onClick={() => setShowMealTypeSelect(true)}
        aria-label="Save to meal log"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        <span>Save to Log</span>
      </button>
      <button
        className="meal-log-button quick-save"
        onClick={handleQuickSave}
        aria-label="Quick save"
        title="Quick save without meal type"
      >
        +
      </button>
    </div>
  );
}
