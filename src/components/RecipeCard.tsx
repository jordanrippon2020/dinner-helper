import { Recipe } from '@/types/recipe';
import MealLogButton from './MealLogButton';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="recipe-card">
      <div className="recipe-card-actions">
        <MealLogButton recipe={recipe} />
      </div>
      <h2 className="recipe-title">{recipe.name || 'Your Perfect Dinner'}</h2>

      <div className="nutrition-info">
        <div className="nutrition-item">
          <div className="nutrition-value">{recipe.calories}</div>
          <div className="nutrition-label">Calories</div>
        </div>
        <div className="nutrition-item">
          <div className="nutrition-value">{recipe.protein}g</div>
          <div className="nutrition-label">Protein</div>
        </div>
        <div className="nutrition-item">
          <div className="nutrition-value">{recipe.carbs}g</div>
          <div className="nutrition-label">Carbs</div>
        </div>
        <div className="nutrition-item">
          <div className="nutrition-value">{recipe.fat}g</div>
          <div className="nutrition-label">Fat</div>
        </div>
        <div className="nutrition-item">
          <div className="nutrition-value">{recipe.prepTime + recipe.cookTime}</div>
          <div className="nutrition-label">Minutes</div>
        </div>
      </div>

      {recipe.whyItWorks && (
        <div className="recipe-section">
          <h3>Why This Works</h3>
          <p>{recipe.whyItWorks}</p>
        </div>
      )}

      <div className="recipe-section">
        <h3>Ingredients</h3>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>

      <div className="recipe-section">
        <h3>Instructions</h3>
        <div className="instructions-text">{recipe.instructions}</div>
      </div>
    </div>
  );
}