import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { recipeApi } from '../services/api';
import { Clock, Heart, Bookmark } from 'lucide-react';
import { DEFAULT_RECIPE_IMAGE, RECIPE_DEFAULTS } from '../config/constants';

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
        if (onUpdate) onUpdate({ ...recipe, likes: res.likes, likedBy: res.likedBy });
      }
    } catch {
      showToast('Could not update like', 'error');
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
        showToast(res.isSaved ? 'Recipe saved' : 'Recipe unsaved');
        if (onUpdate) onUpdate({ ...recipe, savedBy: res.savedBy });
      }
    } catch {
      showToast('Could not save recipe', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className="group bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <Link to={`/recipes/${recipe._id}`} className="block relative aspect-[16/10] overflow-hidden bg-stone-100">
          <img
            src={recipe.imageUrl || DEFAULT_RECIPE_IMAGE}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.src = DEFAULT_RECIPE_IMAGE;
            }}
          />

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`absolute top-2.5 right-2.5 p-1.5 rounded-md backdrop-blur-md transition ${
              isSaved
                ? 'bg-stone-900 text-white'
                : 'bg-white/90 text-stone-700 hover:bg-white'
            }`}
            aria-label={isSaved ? 'Unsave' : 'Save'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </Link>

        <div className="p-4">
          <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-1.5">
            <span className="font-semibold text-stone-700 uppercase tracking-wide">
              {recipe.category || RECIPE_DEFAULTS.CATEGORY}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              {recipe.cookingTime} mins
            </span>
            {recipe.difficulty && (
              <>
                <span>•</span>
                <span>{recipe.difficulty}</span>
              </>
            )}
          </div>

          <Link to={`/recipes/${recipe._id}`}>
            <h3 className="font-semibold text-stone-900 text-base leading-snug group-hover:text-stone-700 transition line-clamp-1 mb-1">
              {recipe.title}
            </h3>
          </Link>

          {recipe.description && (
            <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
              {recipe.description}
            </p>
          )}
        </div>
      </div>

      <div className="px-4 pb-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <span className="truncate max-w-[150px]">
          By {recipe.author?.name || 'Chef'}
        </span>

        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-1 px-2 py-1 rounded transition ${
            isLiked
              ? 'text-rose-600 bg-rose-50 font-medium'
              : 'text-stone-500 hover:text-stone-900'
          }`}
          aria-label="Like recipe"
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-500' : ''}`} />
          <span>{likes}</span>
        </button>
      </div>
    </article>
  );
};

export default RecipeCard;
