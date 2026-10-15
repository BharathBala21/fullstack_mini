import React, { useState, useEffect } from 'react';
import { recipeApi } from '../services/api';
import { useUser } from '../context/UserContext';
import RecipeCard from '../components/RecipeCard';
import { Plus, AlertCircle, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyRecipes = () => {
  const { user } = useUser();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await recipeApi.getRecipes({ authorId: user.id, limit: 50 });
      if (res.success) {
        setRecipes(res.data);
      }
    } catch (err) {
      console.error('Error fetching user recipes:', err);
      setError('Unable to load your recipes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, [user.id]);

  const handleUpdate = (updatedRecipe) => {
    setRecipes((prev) =>
      prev.map((r) => (r._id === updatedRecipe._id ? updatedRecipe : r))
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            My Recipes
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Recipes created by {user.name}.
          </p>
        </div>

        <Link
          to="/create"
          className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Recipe</span>
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 animate-pulse"
            >
              <div className="bg-stone-200 aspect-[16/10] rounded-lg" />
              <div className="h-4 bg-stone-200 rounded w-3/4" />
              <div className="h-3 bg-stone-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} onUpdate={handleUpdate} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200 p-8 space-y-3 max-w-md mx-auto">
          <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Utensils className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-stone-900">
            You haven't added any recipes yet
          </h2>
          <p className="text-stone-500 text-xs">
            Share your favorite dishes with other cooks.
          </p>
          <div className="pt-2">
            <Link
              to="/create"
              className="inline-block px-3.5 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition"
            >
              Add Your First Recipe
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
