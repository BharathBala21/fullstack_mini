import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { recipeApi } from '../services/api';
import {
  Clock,
  Heart,
  Bookmark,
  Users,
  ChefHat,
  Sparkles,
} from 'lucide-react';

const RecipeCard = ({ recipe, onUpdate }) => {
  const { user, showToast, toggleLocalSaved, toggleLocalLiked } = useUser();
  const [likes, setLikes] = useState(recipe.likes || 0);
  const [isLiked, setIsLiked] = useState(
    Array.isArray(recipe.likedBy) ? recipe.likedBy.includes(user.id) : false
  );
  const [isSaved, setIsSaved] = useState(
    Array.isArray(recipe.savedBy) ? recipe.savedBy.includes(user.id) : false
  );
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiking) return;
    setIsLiking(true);

    try {
      const res = await recipeApi.likeRecipe(recipe._id, user.id);
      if (res.success) {
        setLikes(res.likes);
        setIsLiked(res.isLiked);
        toggleLocalLiked(recipe._id, res.isLiked);
        showToast(res.isLiked ? 'Liked recipe!' : 'Unliked recipe', 'info');
        if (onUpdate) onUpdate({ ...recipe, likes: res.likes, likedBy: res.likedBy });
      }
    } catch (err) {
      showToast('Failed to update like', 'error');
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaving) return;
    setIsSaving(true);

    try {
      const res = await recipeApi.saveRecipe(recipe._id, user.id);
      if (res.success) {
        setIsSaved(res.isSaved);
        toggleLocalSaved(recipe._id, res.isSaved);
        showToast(
          res.isSaved ? 'Recipe saved to your cookbook!' : 'Removed from saved recipes',
          'info'
        );
        if (onUpdate) onUpdate({ ...recipe, savedBy: res.savedBy });
      }
    } catch (err) {
      showToast('Failed to save recipe', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const difficultyColors = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Hard: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col justify-between">
      {/* Top Media Anchor */}
      <Link to={`/recipes/${recipe._id}`} className="block relative overflow-hidden aspect-[4/3]">
        <img
          src={recipe.imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80'}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-black/10" />

        {/* Category & Difficulty Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span className="bg-white/90 backdrop-blur-md text-stone-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {recipe.category || 'Dinner'}
          </span>
          {recipe.difficulty && (
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${
                difficultyColors[recipe.difficulty] || 'bg-stone-100 text-stone-700'
              }`}
            >
              {recipe.difficulty}
            </span>
          )}
        </div>

        {/* Quick Save Bookmark on thumbnail */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-md transition-transform duration-200 active:scale-90 ${
            isSaved
              ? 'bg-brand-500 text-white hover:bg-brand-600'
              : 'bg-white/90 text-stone-700 hover:text-brand-600 hover:bg-white'
          }`}
          aria-label={isSaved ? 'Remove from saved' : 'Save recipe'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Cooking Time Overlay badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-medium bg-stone-900/70 backdrop-blur-md px-2.5 py-1 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{recipe.cookingTime} mins</span>
        </div>
      </Link>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/recipes/${recipe._id}`} className="block group-hover:text-brand-600 transition">
            <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug line-clamp-1 mb-1.5">
              {recipe.title}
            </h3>
          </Link>
          <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed mb-4">
            {recipe.description || 'A delicious homemade recipe crafted with fresh ingredients.'}
          </p>

          {/* Quick ingredients highlight */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="mb-4 bg-stone-50 rounded-xl p-2.5 border border-stone-100">
              <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide flex items-center justify-between mb-1">
                <span>Ingredients ({recipe.ingredients.length})</span>
                <Sparkles className="w-3 h-3 text-brand-500" />
              </div>
              <p className="text-xs text-stone-600 line-clamp-1">
                {recipe.ingredients.map((ing) => ing.name).join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Card Footer: Author + Like Button */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold">
              <ChefHat className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-stone-600 max-w-[110px] truncate">
              {recipe.author?.name || 'Chef'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition active:scale-90 ${
                isLiked
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-stone-100 text-stone-600 hover:bg-rose-50 hover:text-rose-600 border border-transparent'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
              <span>{likes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
