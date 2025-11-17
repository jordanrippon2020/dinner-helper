'use client';

import { useState, useEffect } from 'react';
import { MealType, ManualMeal } from '@/types/mealLog';
import {
  getWeekPlan,
  getMondayOfWeek,
  getNextWeekMonday,
  getPreviousWeekMonday,
  getWeekRangeString,
  planManualMeal,
} from '@/lib/mealPlanner';
import PlannedMealCard from './PlannedMealCard';
import DatePicker from './DatePicker';

export default function MealPlanner() {
  const [currentMonday, setCurrentMonday] = useState(getMondayOfWeek());
  const [weekPlan, setWeekPlan] = useState(getWeekPlan(currentMonday));
  const [showAddManual, setShowAddManual] = useState<{ date: string; mealType: MealType } | null>(null);
  const [manualMealForm, setManualMealForm] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    notes: '',
  });

  useEffect(() => {
    loadWeekPlan();
  }, [currentMonday]);

  const loadWeekPlan = () => {
    setWeekPlan(getWeekPlan(currentMonday));
  };

  const goToPreviousWeek = () => {
    setCurrentMonday(getPreviousWeekMonday(currentMonday));
  };

  const goToNextWeek = () => {
    setCurrentMonday(getNextWeekMonday(currentMonday));
  };

  const goToThisWeek = () => {
    setCurrentMonday(getMondayOfWeek());
  };

  const handleAddManualMeal = (date: string, mealType: MealType) => {
    setShowAddManual({ date, mealType });
    setManualMealForm({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      notes: '',
    });
  };

  const submitManualMeal = () => {
    if (!showAddManual || !manualMealForm.name.trim()) return;

    const manualMeal: ManualMeal = {
      name: manualMealForm.name.trim(),
      calories: manualMealForm.calories ? parseInt(manualMealForm.calories) : undefined,
      protein: manualMealForm.protein ? parseInt(manualMealForm.protein) : undefined,
      carbs: manualMealForm.carbs ? parseInt(manualMealForm.carbs) : undefined,
      fat: manualMealForm.fat ? parseInt(manualMealForm.fat) : undefined,
      notes: manualMealForm.notes.trim() || undefined,
    };

    planManualMeal(manualMeal, showAddManual.date, showAddManual.mealType);
    setShowAddManual(null);
    loadWeekPlan();
  };

  const getMealTypeEmoji = (type: MealType) => {
    switch (type) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
    }
  };

  const getDayName = (date: string) => {
    const d = new Date(date);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[d.getDay()];
  };

  const getDayNumber = (date: string) => {
    const d = new Date(date);
    return d.getDate();
  };

  const isToday = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    return date === today;
  };

  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner'];

  return (
    <div className="meal-planner">
      <div className="planner-header">
        <h3 className="planner-title">Weekly Meal Planner</h3>
        <p className="planner-subtitle">{getWeekRangeString(currentMonday)}</p>
      </div>

      <div className="planner-nav">
        <button onClick={goToPreviousWeek} className="nav-btn">
          ← Previous Week
        </button>
        <button onClick={goToThisWeek} className="nav-btn primary">
          This Week
        </button>
        <button onClick={goToNextWeek} className="nav-btn">
          Next Week →
        </button>
      </div>

      <div className="week-grid">
        <div className="week-grid-header">
          {weekPlan.map((day) => (
            <div key={day.date} className={`day-header-cell ${isToday(day.date) ? 'today' : ''}`}>
              <div className="day-name">{getDayName(day.date)}</div>
              <div className="day-number">{getDayNumber(day.date)}</div>
            </div>
          ))}
        </div>

        {mealTypes.map((mealType) => (
          <div key={mealType} className="meal-row">
            <div className="meal-row-label">
              <span className="meal-emoji">{getMealTypeEmoji(mealType)}</span>
              <span className="meal-label">{mealType}</span>
            </div>

            {weekPlan.map((day) => {
              const meals = day[mealType];
              return (
                <div key={`${day.date}-${mealType}`} className="meal-cell">
                  {meals.length > 0 ? (
                    meals.map((meal) => (
                      <PlannedMealCard
                        key={meal.id}
                        meal={meal}
                        onUpdate={loadWeekPlan}
                      />
                    ))
                  ) : (
                    <button
                      className="add-meal-btn"
                      onClick={() => handleAddManualMeal(day.date, mealType)}
                    >
                      +
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {showAddManual && (
        <div className="manual-meal-modal-overlay" onClick={() => setShowAddManual(null)}>
          <div className="manual-meal-modal" onClick={(e) => e.stopPropagation()}>
            <h4>Add Manual Meal</h4>
            <p className="modal-subtitle">
              {getMealTypeEmoji(showAddManual.mealType)} {showAddManual.mealType} on{' '}
              {new Date(showAddManual.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </p>

            <div className="manual-meal-form">
              <div className="form-group">
                <label>Meal Name *</label>
                <input
                  type="text"
                  value={manualMealForm.name}
                  onChange={(e) => setManualMealForm({ ...manualMealForm, name: e.target.value })}
                  placeholder="e.g., Leftover Pizza"
                  autoFocus
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Calories</label>
                  <input
                    type="number"
                    value={manualMealForm.calories}
                    onChange={(e) => setManualMealForm({ ...manualMealForm, calories: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>Protein (g)</label>
                  <input
                    type="number"
                    value={manualMealForm.protein}
                    onChange={(e) => setManualMealForm({ ...manualMealForm, protein: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Carbs (g)</label>
                  <input
                    type="number"
                    value={manualMealForm.carbs}
                    onChange={(e) => setManualMealForm({ ...manualMealForm, carbs: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>Fat (g)</label>
                  <input
                    type="number"
                    value={manualMealForm.fat}
                    onChange={(e) => setManualMealForm({ ...manualMealForm, fat: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea
                  value={manualMealForm.notes}
                  onChange={(e) => setManualMealForm({ ...manualMealForm, notes: e.target.value })}
                  placeholder="Any additional notes..."
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button onClick={() => setShowAddManual(null)} className="cancel-btn">
                  Cancel
                </button>
                <button
                  onClick={submitManualMeal}
                  className="submit-btn"
                  disabled={!manualMealForm.name.trim()}
                >
                  Add Meal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
