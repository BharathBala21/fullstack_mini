import React, { useState, useEffect } from 'react';
import { recipeApi } from '../services/api';
import { useUser } from '../context/UserContext';
import RecipeCard from '../components/RecipeCard';
import { ChefHat, PlusCircle, AlertCircle, BookOpen, User } from 'lucide-react';
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
      setError('Could not load your recipes.');
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
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ChefHat className="w-4 h-4" />
            <span>Chef Dashboard</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            My Published Recipes
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage, edit, and view feedback on recipes published under "{user.name}".
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500">Published:</span>
            <span className="text-sm font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-lg">
              {recipes.length}
            </span>
          </div>
          <Link
            to="/create"
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-brand-500/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish New</span>
          </Link>
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
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <ChefHat className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-xl font-bold text-stone-900">
            No recipes published yet
          </h2>
          <p className="text-stone-500 text-xs leading-relaxed">
            Ready to share your secret recipe or favorite dinner dish with the community?
            Click below to publish your first recipe in minutes!
          </p>
          <div className="pt-2">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-brand-500/20 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Your First Recipe</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
