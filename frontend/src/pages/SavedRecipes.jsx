import React, { useState, useEffect } from 'react';
import { recipeApi } from '../services/api';
import { useUser } from '../context/UserContext';
import RecipeCard from '../components/RecipeCard';
import { Bookmark, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SavedRecipes = () => {
  const { user } = useUser();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSavedRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await recipeApi.getRecipes({ savedBy: user.id, limit: 50 });
      if (res.success) {
        setRecipes(res.data);
      }
    } catch (err) {
      console.error('Error fetching saved recipes:', err);
      setError('Could not load saved recipes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedRecipes();
  }, [user.id]);

  const handleUpdate = (updatedRecipe) => {
    // If unsaved, remove from this view
    if (
      Array.isArray(updatedRecipe.savedBy) &&
      !updatedRecipe.savedBy.includes(user.id)
    ) {
      setRecipes((prev) => prev.filter((r) => r._id !== updatedRecipe._id));
    } else {
      setRecipes((prev) =>
        prev.map((r) => (r._id === updatedRecipe._id ? updatedRecipe : r))
      );
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Personal Cookbook</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Saved Recipes
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            All the delicious recipes you have bookmarked for later cooking.
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-stone-500">Total Bookmarked:</span>
          <span className="text-sm font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-lg">
            {recipes.length}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-stone-200 p-4 space-y-4 animate-pulse"
            >
              <div className="bg-stone-200 aspect-[4/3] rounded-xl" />
              <div className="space-y-2">
                <div className="h-5 bg-stone-200 rounded w-3/4" />
                <div className="h-3 bg-stone-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} onUpdate={handleUpdate} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-xl font-bold text-stone-900">
            No saved recipes yet
          </h2>
          <p className="text-stone-500 text-xs leading-relaxed">
            Whenever you find a recipe you want to try, click the bookmark icon on any recipe
            card or detail page to save it to your personal cookbook.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-brand-500/20 transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Recipes</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
