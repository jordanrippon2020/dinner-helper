'use client';

import { useState } from 'react';
import PreferencesForm from '@/components/PreferencesForm';
import RecipeCard from '@/components/RecipeCard';
import LoadingState from '@/components/LoadingState';
import ErrorMessage from '@/components/ErrorMessage';
import MealHistoryModal from '@/components/MealHistoryModal';
import { Recipe } from '@/types/recipe';
import { UserPreferences } from '@/types/preferences';

export default function Home() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorSuggestions, setErrorSuggestions] = useState<string[] | undefined>(undefined);
  const [errorTechnical, setErrorTechnical] = useState<string | undefined>(undefined);
  const [showForm, setShowForm] = useState(true);
  const [currentPreferences, setCurrentPreferences] = useState<UserPreferences | null>(null);
  const [showMealLog, setShowMealLog] = useState(false);

  const handleGenerate = async (preferences: UserPreferences) => {
    setLoading(true);
    setError(null);
    setErrorSuggestions(undefined);
    setErrorTechnical(undefined);
    setShowForm(false);
    setCurrentPreferences(preferences);

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to generate recipe');
        setErrorSuggestions(data.suggestions);
        setErrorTechnical(data.technicalDetails);
        return;
      }

      setRecipe(data.recipe);
    } catch (err) {
      console.error('Error generating recipe:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setErrorSuggestions(['Check your internet connection', 'Try again in a few moments']);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnother = async () => {
    if (!currentPreferences) return;

    setLoading(true);
    setError(null);
    setErrorSuggestions(undefined);
    setErrorTechnical(undefined);
    setRecipe(null);

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentPreferences)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to generate recipe');
        setErrorSuggestions(data.suggestions);
        setErrorTechnical(data.technicalDetails);
        return;
      }

      setRecipe(data.recipe);
    } catch (err) {
      console.error('Error generating recipe:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setErrorSuggestions(['Check your internet connection', 'Try again in a few moments']);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePreferences = () => {
    setShowForm(true);
    setRecipe(null);
    setError(null);
  };

  return (
    <div className="container">
      <header>
        <div className="header-content">
          <div>
            <h1 className="brand">Nourish</h1>
            <p className="tagline">
              Your intelligent evening meal companion — personalized dinner ideas in seconds
            </p>
          </div>
          <button className="view-log-button" onClick={() => setShowMealLog(true)}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span>View Meal Log</span>
          </button>
        </div>
      </header>

      {showForm && <PreferencesForm onSubmit={handleGenerate} />}

      {!showForm && (
        <div id="results">
          {loading && <LoadingState />}

          {error && !loading && (
            <ErrorMessage
              message={error}
              suggestions={errorSuggestions}
              technicalDetails={errorTechnical}
            />
          )}

          {recipe && !loading && !error && (
            <>
              <RecipeCard recipe={recipe} />
              <div className="button-group">
                <button onClick={handleGenerateAnother}>
                  Generate Another
                </button>
                <button className="secondary" onClick={handleChangePreferences}>
                  Change Preferences
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <MealHistoryModal isOpen={showMealLog} onClose={() => setShowMealLog(false)} />
    </div>
  );
}