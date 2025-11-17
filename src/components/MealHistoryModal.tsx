'use client';

import { useState, useEffect } from 'react';
import MealHistory from './MealHistory';
import NutritionDashboard from './NutritionDashboard';
import { getRecentMeals, getNutritionSummary } from '@/lib/mealLogger';
import { exportAsJSON, exportAsCSV } from '@/lib/exportMeals';
import { LoggedMeal } from '@/types/mealLog';

interface MealHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MealHistoryModal({ isOpen, onClose }: MealHistoryModalProps) {
  const [meals, setMeals] = useState<LoggedMeal[]>([]);
  const [dateRange, setDateRange] = useState<'7' | '30' | 'all'>('30');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const loadMeals = () => {
    const allMeals = getRecentMeals(dateRange === 'all' ? 365 : parseInt(dateRange));
    setMeals(allMeals);
  };

  useEffect(() => {
    if (isOpen) {
      loadMeals();
    }
  }, [isOpen, dateRange]);

  const handleMealDeleted = () => {
    loadMeals(); // Refresh the list
  };

  const handleExportJSON = () => {
    exportAsJSON(meals);
    setShowExportMenu(false);
  };

  const handleExportCSV = () => {
    exportAsCSV(meals);
    setShowExportMenu(false);
  };

  const summary = getNutritionSummary(meals);

  if (!isOpen) return null;

  return (
    <div className="meal-modal-overlay" onClick={onClose}>
      <div className="meal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="meal-modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">Your Meal Log</h2>
            <p className="modal-subtitle">Track your nutrition journey</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
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

        <div className="meal-modal-controls">
          <div className="date-range-selector">
            <button
              className={`range-button ${dateRange === '7' ? 'active' : ''}`}
              onClick={() => setDateRange('7')}
            >
              Last 7 days
            </button>
            <button
              className={`range-button ${dateRange === '30' ? 'active' : ''}`}
              onClick={() => setDateRange('30')}
            >
              Last 30 days
            </button>
            <button
              className={`range-button ${dateRange === 'all' ? 'active' : ''}`}
              onClick={() => setDateRange('all')}
            >
              All time
            </button>
          </div>

          <div className="export-menu-container">
            <button
              className="export-button"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export
            </button>

            {showExportMenu && (
              <div className="export-menu">
                <button className="export-option" onClick={handleExportJSON}>
                  <span>Export as JSON</span>
                  <small>Full data format</small>
                </button>
                <button className="export-option" onClick={handleExportCSV}>
                  <span>Export as CSV</span>
                  <small>Spreadsheet format</small>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="meal-modal-content">
          <NutritionDashboard summary={summary} />
          <MealHistory meals={meals} onMealDeleted={handleMealDeleted} />
        </div>
      </div>
    </div>
  );
}
