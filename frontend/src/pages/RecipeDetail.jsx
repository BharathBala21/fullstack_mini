import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { recipeApi } from '../services/api';
import { useUser } from '../context/UserContext';
import {
  Clock,
  Heart,
  Bookmark,
  Share2,
  ChefHat,
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  Plus,
  Minus,
  Utensils,
  AlertTriangle,
  Timer,
  Users,
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

  // Checked ingredients for interactive cooking checklist
  const [checkedIngredients, setCheckedIngredients] = useState({});

  // Checked steps for interactive cooking
  const [completedSteps, setCompletedSteps] = useState({});

  // Like & Save local state
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation modal
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
        setError('Failed to load recipe details. Please verify the ID or check backend.');
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
        showToast(res.isLiked ? 'Liked recipe!' : 'Unliked recipe', 'info');
      }
    } catch {
      showToast('Failed to update like status', 'error');
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
        showToast(
          res.isSaved ? 'Recipe saved to your bookmarks!' : 'Removed from saved recipes',
          'info'
        );
      }
    } catch {
      showToast('Failed to save recipe', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Recipe URL copied to clipboard!', 'success');
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await recipeApi.deleteRecipe(recipe._id);
      if (res.success) {
        showToast('Recipe deleted successfully', 'success');
        navigate('/');
      }
    } catch {
      showToast('Failed to delete recipe', 'error');
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

  // Helper to scale ingredient amounts
  const scaleAmount = (amountStr) => {
    if (!amountStr || servingsMultiplier === 1) return amountStr;
    const num = parseFloat(amountStr);
    if (isNaN(num)) return amountStr;
    const scaled = (num * servingsMultiplier).toFixed(2).replace(/\.00$/, '');
    return scaled;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-6 animate-pulse">
        <div className="h-6 bg-stone-200 rounded w-32" />
        <div className="aspect-[21/9] bg-stone-200 rounded-3xl" />
        <div className="h-10 bg-stone-200 rounded w-2/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-stone-200 rounded-2xl" />
          <div className="md:col-span-2 h-64 bg-stone-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900">
          Recipe Not Found
        </h2>
        <p className="text-stone-500 text-sm">
          {error || "The recipe you are looking for doesn't exist or was removed."}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>
      </div>
    );
  }

  const isAuthor = recipe.author?.id === user.id || recipe.author?.name === user.name;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Back button and quick actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-stone-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Recipes</span>
        </Link>

        {/* Author Actions (Edit & Delete) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition"
            title="Share Recipe"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <Link
            to={`/recipes/${recipe._id}/edit`}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl transition shadow-xs"
          >
            <Edit className="w-3.5 h-3.5 text-stone-500" />
            <span>Edit</span>
          </Link>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden aspect-[16/8] sm:aspect-[21/9] bg-stone-900 shadow-xl border border-stone-200">
        <img
          src={recipe.imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80'}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />

        {/* Floating tags */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {recipe.category || 'Dinner'}
          </span>
          <span className="bg-white/90 backdrop-blur-md text-stone-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {recipe.difficulty || 'Medium'}
          </span>
        </div>

        {/* Hero Bottom Bar with Title & Author */}
        <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
              {recipe.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-stone-300">
              <span className="flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-brand-400" />
                By {recipe.author?.name || 'Community Chef'}
              </span>
              <span>•</span>
              <span>
                Added {new Date(recipe.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </span>
            </div>
          </div>

          {/* Action Buttons: Like & Save */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg transition transform active:scale-95 ${
                isLiked
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/90 text-stone-900 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likes} Likes</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg transition transform active:scale-95 ${
                isSaved
                  ? 'bg-brand-500 text-white'
                  : 'bg-white/90 text-stone-900 hover:bg-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metadata Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Prep Time</span>
            <p className="text-sm font-bold text-stone-800">{recipe.prepTime || 10} mins</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Cook Time</span>
            <p className="text-sm font-bold text-stone-800">{recipe.cookingTime} mins</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Servings</span>
            <p className="text-sm font-bold text-stone-800">
              {Math.round(originalServings * servingsMultiplier)} servings
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Total Time</span>
            <p className="text-sm font-bold text-stone-800">
              {(recipe.prepTime || 10) + (recipe.cookingTime || 0)} mins
            </p>
          </div>
        </div>
      </div>

      {/* Description quote if present */}
      {recipe.description && (
        <div className="bg-brand-50/50 border border-brand-100 rounded-2xl p-5 text-stone-700 text-sm leading-relaxed italic">
          "{recipe.description}"
        </div>
      )}

      {/* Recipe Body: Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Ingredients Checklist (4 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/90 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Ingredients
              </h2>
              <span className="text-xs text-stone-500">
                {recipe.ingredients?.length || 0} items needed
              </span>
            </div>

            {/* Servings Scaler */}
            <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                onClick={() => setServingsMultiplier((prev) => Math.max(0.5, prev - 0.5))}
                className="w-6 h-6 rounded-lg bg-white text-stone-700 hover:bg-stone-200 flex items-center justify-center shadow-xs transition"
                title="Decrease servings"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold text-stone-800 px-1">
                {Math.round(originalServings * servingsMultiplier)}
              </span>
              <button
                onClick={() => setServingsMultiplier((prev) => prev + 0.5)}
                className="w-6 h-6 rounded-lg bg-white text-stone-700 hover:bg-stone-200 flex items-center justify-center shadow-xs transition"
                title="Increase servings"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {recipe.ingredients?.map((ing, idx) => {
              const isChecked = checkedIngredients[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleIngredientCheck(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition ${
                    isChecked
                      ? 'bg-stone-50 border-stone-200 text-stone-400 line-through'
                      : 'bg-white border-stone-200/80 hover:border-brand-300 text-stone-800 hover:bg-brand-50/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(isChecked)}
                      onChange={() => {}}
                      className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-semibold">{ing.name}</span>
                  </div>

                  {(ing.amount || ing.unit) && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        isChecked
                          ? 'bg-stone-200 text-stone-500'
                          : 'bg-brand-50 text-brand-700'
                      }`}
                    >
                      {scaleAmount(ing.amount)} {ing.unit}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-stone-400 italic text-center">
            Tip: Click an ingredient to check it off while preparing.
          </p>
        </div>

        {/* Right Column: Steps / Instructions (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Cooking Instructions
              </h2>
              <span className="text-xs text-stone-500">
                {recipe.steps?.length || 0} steps to deliciousness
              </span>
            </div>

            <div className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
              {Object.values(completedSteps).filter(Boolean).length} / {recipe.steps?.length || 0} completed
            </div>
          </div>

          <div className="space-y-5">
            {recipe.steps?.map((step, idx) => {
              const isDone = completedSteps[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleStepCheck(idx)}
                  className={`p-4 rounded-2xl border transition cursor-pointer select-none flex items-start gap-4 ${
                    isDone
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-stone-50 border-stone-200 hover:border-brand-300'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition ${
                      isDone
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-stone-900 text-white'
                    }`}
                  >
                    {isDone ? <CheckCircle className="w-4 h-4" /> : step.stepNumber || idx + 1}
                  </div>

                  <div className="flex-1 space-y-1">
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isDone ? 'text-emerald-900 font-medium' : 'text-stone-700'
                      }`}
                    >
                      {step.instruction}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Delete "{recipe.title}"?
              </h3>
              <p className="text-stone-500 text-xs mt-1 leading-relaxed">
                Are you sure you want to delete this recipe? This action will remove it from the
                platform and cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
