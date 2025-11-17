'use client';

import { useState } from 'react';
import { Recipe } from '@/types/recipe';
import { MealType } from '@/types/mealLog';
import { planRecipe } from '@/lib/mealPlanner';
import DatePicker from './DatePicker';

interface PlanMealButtonProps {
  recipe: Recipe;
  onPlanned?: () => void;
}

export default function PlanMealButton({ recipe, onPlanned }: PlanMealButtonProps) {
  const [step, setStep] = useState<'initial' | 'mealType' | 'date'>('initial');
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const [planned, setPlanned] = useState(false);

  const mealTypes: { value: MealType; label: string; emoji: string }[] = [
    { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
    { value: 'lunch', label: 'Lunch', emoji: '☀️' },
    { value: 'dinner', label: 'Dinner', emoji: '🌙' },
    { value: 'snack', label: 'Snack', emoji: '🍎' },
  ];

  const handleMealTypeSelect = (mealType: MealType) => {
    setSelectedMealType(mealType);
    setStep('date');
  };

  const handleDateSelect = (date: string) => {
    if (!selectedMealType) return;

    planRecipe(recipe, date, selectedMealType);
    setPlanned(true);

    // Show success state for 2 seconds
    setTimeout(() => {
      setPlanned(false);
      setStep('initial');
      setSelectedMealType(null);
      onPlanned?.();
    }, 2000);
  };

  const handleCancel = () => {
    setStep('initial');
    setSelectedMealType(null);
  };

  if (planned) {
    return (
      <div className="plan-meal-success">
        <span className="success-icon">📅</span>
        <span className="success-text">Added to Plan</span>
      </div>
    );
  }

  if (step === 'date' && selectedMealType) {
    return (
      <div className="plan-meal-date-picker">
        <button className="plan-close" onClick={handleCancel}>
          ×
        </button>
        <p className="plan-prompt">
          Select a date for {selectedMealType}:
        </p>
        <DatePicker onSelectDate={handleDateSelect} />
      </div>
    );
  }

  if (step === 'mealType') {
    return (
      <div className="plan-meal-type-selector">
        <button className="plan-close" onClick={handleCancel}>
          ×
        </button>
        <p className="plan-prompt">Plan for which meal?</p>
        <div className="plan-meal-type-buttons">
          {mealTypes.map(({ value, label, emoji }) => (
            <button
              key={value}
              className="plan-meal-type-option"
              onClick={() => handleMealTypeSelect(value)}
            >
              <span className="plan-meal-type-emoji">{emoji}</span>
              <span className="plan-meal-type-label">{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <button
      className="plan-meal-button"
      onClick={() => setStep('mealType')}
      aria-label="Add to meal plan"
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
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      <span>Add to Plan</span>
    </button>
  );
}
