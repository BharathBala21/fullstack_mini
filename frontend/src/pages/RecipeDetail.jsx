import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { recipeApi } from '../services/api';
import { useUser } from '../context/UserContext';
import {
  Clock,
  Heart,
  Bookmark,
  ArrowLeft,
  Edit,
  Trash2,
} from 'lucide-react';
import { DEFAULT_RECIPE_IMAGE } from '../config/constants';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, showToast, toggleLocalSaved, toggleLocalLiked } = useUser();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await recipeApi.getRecipeById(id);
        if (res.success && res.data) {
          const rec = res.data;
          setRecipe(rec);
          setLikes(rec.likes || 0);
          setIsLiked(Array.isArray(rec.likedBy) && rec.likedBy.includes(user.id));
          setIsSaved(Array.isArray(rec.savedBy) && rec.savedBy.includes(user.id));
        } else {
          setError('Recipe not found.');
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Unable to load recipe details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user.id]);

  const handleLike = async () => {
    try {
      const res = await recipeApi.likeRecipe(recipe._id, user.id);
      if (res.success) {
        setLikes(res.likes);
        setIsLiked(res.isLiked);
        toggleLocalLiked(recipe._id, res.isLiked);
      }
    } catch {
      showToast('Could not update like', 'error');
    }
  };

  const handleSave = async () => {
    try {
      const res = await recipeApi.saveRecipe(recipe._id, user.id);
      if (res.success) {
        setIsSaved(res.isSaved);
        toggleLocalSaved(recipe._id, res.isSaved);
        showToast(res.isSaved ? 'Saved to bookmarks' : 'Removed from saved');
      }
    } catch {
      showToast('Could not save recipe', 'error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
      return;
    }
    try {
      const res = await recipeApi.deleteRecipe(recipe._id);
      if (res.success) {
        showToast('Recipe deleted');
        navigate('/');
      }
    } catch {
      showToast('Could not delete recipe', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-sm text-stone-500">
        Loading recipe...
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-3">
        <h2 className="text-lg font-semibold text-stone-900">Recipe not found</h2>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to recipes</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto space-y-6 pb-16">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 text-xs font-medium transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to recipes</span>
      </Link>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <span className="uppercase tracking-wide text-stone-800 font-semibold">{recipe.category || 'Recipe'}</span>
          <span>•</span>
          <span>By {recipe.author?.name || 'Chef'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          {recipe.title}
        </h1>

        {recipe.description && (
          <p className="text-stone-600 text-sm leading-relaxed">
            {recipe.description}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between border-y border-stone-200 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              isLiked
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
            <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              isSaved
                ? 'bg-stone-900 border-stone-900 text-white'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/recipes/${recipe._id}/edit`}
            className="flex items-center gap-1 text-xs text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 font-medium transition"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Link>

          <button
            onClick={handleDelete}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-50 font-medium transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Recipe image */}
      <div className="rounded-xl overflow-hidden aspect-[16/9] bg-stone-100 border border-stone-200">
        <img
          src={recipe.imageUrl || DEFAULT_RECIPE_IMAGE}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Meta quick stats */}
      <div className="flex items-center gap-6 text-xs text-stone-600 bg-stone-50 border border-stone-200 rounded-xl p-3">
        <div className="flex items-center gap-1.5 font-medium">
          <Clock className="w-4 h-4 text-stone-400" />
          <span>Cook time: <strong className="text-stone-900">{recipe.cookingTime || 30} mins</strong></span>
        </div>
        {recipe.servings && (
          <div>
            <span>Servings: <strong className="text-stone-900">{recipe.servings}</strong></span>
          </div>
        )}
        {recipe.difficulty && (
          <div>
            <span>Difficulty: <strong className="text-stone-900">{recipe.difficulty}</strong></span>
          </div>
        )}
      </div>

      {/* Ingredients & Steps */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
        {/* Ingredients */}
        <div className="md:col-span-5 space-y-3">
          <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-200">
            Ingredients
          </h2>
          <ul className="space-y-2 text-xs">
            {recipe.ingredients?.map((ing, idx) => (
              <li key={idx} className="flex items-start gap-2 text-stone-800">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                <span>
                  {ing.amount && <strong className="font-semibold text-stone-900 mr-1">{ing.amount} {ing.unit}</strong>}
                  {ing.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="md:col-span-7 space-y-3">
          <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-200">
            Instructions
          </h2>
          <ol className="space-y-3 text-xs">
            {recipe.steps?.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-stone-800">
                <span className="w-5 h-5 rounded-md bg-stone-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  {step.stepNumber || idx + 1}
                </span>
                <p className="leading-relaxed flex-1">
                  {step.instruction}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
};

export default RecipeDetail;
