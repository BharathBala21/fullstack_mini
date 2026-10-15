import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { recipeApi } from '../services/api';
import { useUser } from '../context/UserContext';
import {
  Clock,
  Heart,
  Bookmark,
  Share2,
  ArrowLeft,
  Edit,
  Trash2,
  Check,
  Plus,
  Minus,
  AlertTriangle,
} from 'lucide-react';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, showToast, toggleLocalSaved, toggleLocalLiked } = useUser();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scalable servings
  const [servingsMultiplier, setServingsMultiplier] = useState(1);
  const [originalServings, setOriginalServings] = useState(4);

  // Checked ingredients for cooking
  const [checkedIngredients, setCheckedIngredients] = useState({});

  // Checked steps for cooking
  const [completedSteps, setCompletedSteps] = useState({});

  // Like & Save state
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
          setOriginalServings(rec.servings || 4);
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
    if (isLiking || !recipe) return;
    setIsLiking(true);
    try {
      const res = await recipeApi.likeRecipe(recipe._id, user.id);
      if (res.success) {
        setLikes(res.likes);
        setIsLiked(res.isLiked);
        toggleLocalLiked(recipe._id, res.isLiked);
      }
    } catch {
      showToast('Could not update like', 'error');
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async () => {
    if (isSaving || !recipe) return;
    setIsSaving(true);
    try {
      const res = await recipeApi.saveRecipe(recipe._id, user.id);
      if (res.success) {
        setIsSaved(res.isSaved);
        toggleLocalSaved(recipe._id, res.isSaved);
        showToast(res.isSaved ? 'Saved to cookbook' : 'Removed from saved');
      }
    } catch {
      showToast('Could not save recipe', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard');
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await recipeApi.deleteRecipe(recipe._id);
      if (res.success) {
        showToast('Recipe deleted');
        navigate('/');
      }
    } catch {
      showToast('Could not delete recipe', 'error');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const toggleIngredientCheck = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const toggleStepCheck = (idx) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const scaleAmount = (amountStr) => {
    if (!amountStr || servingsMultiplier === 1) return amountStr;
    const num = parseFloat(amountStr);
    if (isNaN(num)) return amountStr;
    return (num * servingsMultiplier).toFixed(1).replace(/\.0$/, '');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 space-y-4 animate-pulse">
        <div className="h-4 bg-stone-200 rounded w-24" />
        <div className="h-8 bg-stone-200 rounded w-2/3" />
        <div className="aspect-[16/9] bg-stone-200 rounded-xl" />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-3">
        <h2 className="text-lg font-semibold text-stone-900">Recipe not found</h2>
        <p className="text-stone-500 text-xs">
          The requested recipe could not be found or has been removed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 underline mt-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to recipes</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Back link */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 text-xs font-medium transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Recipes</span>
        </Link>
      </div>

      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span className="font-semibold text-stone-800 uppercase tracking-wide">
            {recipe.category || 'Dinner'}
          </span>
          {recipe.difficulty && (
            <>
              <span>•</span>
              <span>{recipe.difficulty}</span>
            </>
          )}
          <span>•</span>
          <span>By {recipe.author?.name || 'Chef'}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight leading-snug">
          {recipe.title}
        </h1>

        {recipe.description && (
          <p className="text-stone-600 text-sm leading-relaxed max-w-2xl">
            {recipe.description}
          </p>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-b border-stone-200 py-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              disabled={isLiking}
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
              disabled={isSaving}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                isSaved
                  ? 'bg-stone-900 border-stone-900 text-white'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg bg-white hover:bg-stone-50 transition"
              title="Copy recipe link"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/recipes/${recipe._id}/edit`}
              className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 font-medium transition"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Link>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-50 font-medium transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="rounded-xl overflow-hidden aspect-[16/9] bg-stone-100 border border-stone-200">
        <img
          src={recipe.imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80'}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Metadata Row */}
      <div className="grid grid-cols-3 gap-3 text-center border border-stone-200 rounded-xl p-3 bg-stone-50/50">
        <div>
          <span className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold block">Prep Time</span>
          <span className="text-sm font-bold text-stone-900">{recipe.prepTime || 10} min</span>
        </div>
        <div className="border-x border-stone-200">
          <span className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold block">Cook Time</span>
          <span className="text-sm font-bold text-stone-900">{recipe.cookingTime} min</span>
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold block">Total Time</span>
          <span className="text-sm font-bold text-stone-900">
            {(recipe.prepTime || 10) + (recipe.cookingTime || 0)} min
          </span>
        </div>
      </div>

      {/* Recipe Body */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
        {/* Ingredients Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <h2 className="text-lg font-bold text-stone-900">
              Ingredients
            </h2>

            {/* Servings scaler */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-2 py-1">
              <span className="text-xs text-stone-500 font-medium mr-1">Servings:</span>
              <button
                onClick={() => setServingsMultiplier((prev) => Math.max(0.5, prev - 0.5))}
                className="w-5 h-5 rounded text-stone-600 hover:bg-stone-100 flex items-center justify-center transition"
                title="Decrease"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold text-stone-800 px-1">
                {Math.round(originalServings * servingsMultiplier)}
              </span>
              <button
                onClick={() => setServingsMultiplier((prev) => prev + 0.5)}
                className="w-5 h-5 rounded text-stone-600 hover:bg-stone-100 flex items-center justify-center transition"
                title="Increase"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <ul className="space-y-2">
            {recipe.ingredients?.map((ing, idx) => {
              const isChecked = checkedIngredients[idx];
              return (
                <li
                  key={idx}
                  onClick={() => toggleIngredientCheck(idx)}
                  className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition select-none ${
                    isChecked
                      ? 'text-stone-400 line-through'
                      : 'hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(isChecked)}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-stone-900 focus:ring-stone-400 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="text-xs leading-relaxed flex-1">
                    <strong className="font-semibold text-stone-900 mr-1">
                      {scaleAmount(ing.amount)} {ing.unit}
                    </strong>
                    {ing.name}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Instructions Column */}
        <div className="md:col-span-7 space-y-4">
          <div className="pb-2 border-b border-stone-200">
            <h2 className="text-lg font-bold text-stone-900">
              Instructions
            </h2>
          </div>

          <ol className="space-y-4">
            {recipe.steps?.map((step, idx) => {
              const isDone = completedSteps[idx];
              return (
                <li
                  key={idx}
                  onClick={() => toggleStepCheck(idx)}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition select-none ${
                    isDone
                      ? 'bg-stone-50 text-stone-400'
                      : 'hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isDone
                        ? 'bg-stone-200 text-stone-500'
                        : 'bg-stone-900 text-white'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : step.stepNumber || idx + 1}
                  </span>

                  <p className={`text-xs leading-relaxed flex-1 ${isDone ? 'line-through' : ''}`}>
                    {step.instruction}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-stone-200 space-y-3">
            <h3 className="text-base font-bold text-stone-900">
              Delete recipe?
            </h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Are you sure you want to delete "{recipe.title}"? This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default RecipeDetail;
