'use client';

import { FormEvent } from 'react';
import { UserPreferences } from '@/types/preferences';

interface PreferencesFormProps {
  onSubmit: (preferences: UserPreferences) => void;
}

export default function PreferencesForm({ onSubmit }: PreferencesFormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Collect dietary restrictions
    const dietaryRestrictions: string[] = [];
    ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'].forEach(id => {
      const checkbox = e.currentTarget.querySelector(`#${id}`) as HTMLInputElement;
      if (checkbox?.checked) {
        dietaryRestrictions.push(checkbox.value);
      }
    });

    // Collect equipment
    const equipment: string[] = [];
    ['oven', 'stove', 'microwave', 'air-fryer', 'slow-cooker'].forEach(id => {
      const checkbox = e.currentTarget.querySelector(`#${id}`) as HTMLInputElement;
      if (checkbox?.checked) {
        equipment.push(checkbox.value);
      }
    });

    const preferences: UserPreferences = {
      primaryGoal: formData.get('primary-goal') as UserPreferences['primaryGoal'],
      maxCalories: parseInt(formData.get('max-calories') as string),
      minProtein: parseInt(formData.get('min-protein') as string),
      prepTime: parseInt(formData.get('prep-time') as string),
      dietaryRestrictions,
      allergies: formData.get('allergies') as string || '',
      equipment
    };

    onSubmit(preferences);
  };

  return (
    <form id="preferences-form" onSubmit={handleSubmit}>
      <div className="form-sections-wrapper">
        {/* Goals Section */}
        <div className="section">
          <h2>Your Goals</h2>
          <div className="form-group">
            <label htmlFor="primary-goal">Primary Goal</label>
            <select id="primary-goal" name="primary-goal" required>
              <option value="weight-loss">Weight Loss</option>
              <option value="muscle-gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
              <option value="quick-easy">Quick & Easy</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="max-calories">Maximum Calories</label>
            <input
              type="number"
              id="max-calories"
              name="max-calories"
              placeholder="e.g., 600"
              min="200"
              max="1500"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="min-protein">Minimum Protein (g)</label>
            <input
              type="number"
              id="min-protein"
              name="min-protein"
              placeholder="e.g., 30"
              min="10"
              max="100"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="prep-time">Max Prep + Cook Time (minutes)</label>
            <input
              type="number"
              id="prep-time"
              name="prep-time"
              placeholder="e.g., 30"
              min="10"
              max="120"
              required
            />
          </div>
        </div>

        {/* Preferences Section */}
        <div className="section">
          <h2>Preferences</h2>
          <div className="form-group">
            <label>Dietary Restrictions</label>
            <div className="checkbox-grid">
              <div className="checkbox-item">
                <input type="checkbox" id="vegetarian" value="vegetarian" />
                <label htmlFor="vegetarian">Vegetarian</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="vegan" value="vegan" />
                <label htmlFor="vegan">Vegan</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="gluten-free" value="gluten-free" />
                <label htmlFor="gluten-free">Gluten-Free</label>
              </div>
              <div className="checkbox-item">
                <input type="checkbox" id="dairy-free" value="dairy-free" />
                <label htmlFor="dairy-free">Dairy-Free</label>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="allergies">Allergies or Ingredients to Avoid</label>
            <input
              type="text"
              id="allergies"
              name="allergies"
              placeholder="e.g., nuts, shellfish"
            />
          </div>
        </div>

        {/* Equipment Section */}
        <div className="section full-width">
          <h2>Available Equipment</h2>
          <div className="checkbox-grid">
            <div className="checkbox-item">
              <input type="checkbox" id="oven" value="oven" defaultChecked />
              <label htmlFor="oven">Oven</label>
            </div>
            <div className="checkbox-item">
              <input type="checkbox" id="stove" value="stove" defaultChecked />
              <label htmlFor="stove">Stove</label>
            </div>
            <div className="checkbox-item">
              <input type="checkbox" id="microwave" value="microwave" />
              <label htmlFor="microwave">Microwave</label>
            </div>
            <div className="checkbox-item">
              <input type="checkbox" id="air-fryer" value="air-fryer" />
              <label htmlFor="air-fryer">Air Fryer</label>
            </div>
            <div className="checkbox-item">
              <input type="checkbox" id="slow-cooker" value="slow-cooker" />
              <label htmlFor="slow-cooker">Slow Cooker</label>
            </div>
          </div>
        </div>
      </div>

      <div className="button-container">
        <button type="submit">Get My Dinner Suggestion</button>
      </div>
    </form>
  );
}