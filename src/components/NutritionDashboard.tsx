'use client';

import { NutritionSummary } from '@/types/mealLog';

interface NutritionDashboardProps {
  summary: NutritionSummary;
}

interface NutritionRingProps {
  label: string;
  value: number;
  unit: string;
  color: string;
  maxValue?: number;
}

function NutritionRing({ label, value, unit, color, maxValue }: NutritionRingProps) {
  // Calculate percentage for ring fill (if maxValue provided)
  const percentage = maxValue ? Math.min((value / maxValue) * 100, 100) : 75;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="nutrition-ring">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="var(--cream)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          className="nutrition-ring-progress"
        />
      </svg>
      <div className="nutrition-ring-content">
        <div className="nutrition-value">{value}</div>
        <div className="nutrition-unit">{unit}</div>
      </div>
      <div className="nutrition-label">{label}</div>
    </div>
  );
}

export default function NutritionDashboard({ summary }: NutritionDashboardProps) {
  const { totalCalories, totalProtein, totalCarbs, totalFat, mealCount } = summary;

  return (
    <div className="nutrition-dashboard">
      <div className="dashboard-header">
        <h3 className="dashboard-title">Nutrition Overview</h3>
        <p className="dashboard-subtitle">
          {mealCount} {mealCount === 1 ? 'meal' : 'meals'} tracked
        </p>
      </div>

      <div className="nutrition-rings">
        <NutritionRing
          label="Calories"
          value={totalCalories}
          unit="kcal"
          color="var(--terracotta)"
          maxValue={2000}
        />
        <NutritionRing
          label="Protein"
          value={totalProtein}
          unit="g"
          color="var(--sage)"
          maxValue={150}
        />
        <NutritionRing
          label="Carbs"
          value={totalCarbs}
          unit="g"
          color="var(--highlight-amber)"
          maxValue={250}
        />
        <NutritionRing
          label="Fat"
          value={totalFat}
          unit="g"
          color="var(--logged-green)"
          maxValue={70}
        />
      </div>

      <div className="dashboard-stats">
        <div className="stat-row">
          <span className="stat-label">Average per meal:</span>
          <span className="stat-value">
            {mealCount > 0 ? Math.round(totalCalories / mealCount) : 0} kcal
          </span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Protein per meal:</span>
          <span className="stat-value">
            {mealCount > 0 ? Math.round(totalProtein / mealCount) : 0}g
          </span>
        </div>
      </div>
    </div>
  );
}
