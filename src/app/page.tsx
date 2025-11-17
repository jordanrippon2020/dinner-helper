'use client';

import { useState } from 'react';
import PreferencesForm from '@/components/PreferencesForm';
import RecipeCard from '@/components/RecipeCard';
import LoadingState from '@/components/LoadingState';
import ErrorMessage from '@/components/ErrorMessage';
import { Recipe } from '@/types/recipe';
import { UserPreferences } from '@/types/preferences';

export default function Home() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [currentPreferences, setCurrentPreferences] = useState<UserPreferences | null>(null);

  const handleGenerate = async (preferences: UserPreferences) => {
    setLoading(true);
    setError(null);
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
        throw new Error(data.error || 'Failed to generate recipe');
      }

      setRecipe(data.recipe);
    } catch (err) {
      console.error('Error generating recipe:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnother = async () => {
    if (!currentPreferences) return;

    setLoading(true);
    setError(null);
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
        throw new Error(data.error || 'Failed to generate recipe');
      }

      setRecipe(data.recipe);
    } catch (err) {
      console.error('Error generating recipe:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
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
        <h1 className="brand">Nourish</h1>
        <p className="tagline">
          Your intelligent evening meal companion — personalized dinner ideas in seconds
        </p>
      </header>

      {showForm && <PreferencesForm onSubmit={handleGenerate} />}

      {!showForm && (
        <div id="results">
          {loading && <LoadingState />}

          {error && !loading && <ErrorMessage message={error} />}

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
    </div>
  );
}