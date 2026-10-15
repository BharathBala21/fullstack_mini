import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recipeApi } from '../services/api';
import { useUser } from '../context/UserContext';
import IngredientInputList from '../components/IngredientInputList';
import StepInputList from '../components/StepInputList';
import ImageUploader from '../components/ImageUploader';
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Clock,
  Loader2,
} from 'lucide-react';

const CATEGORIES = [
  'Dinner',
  'Lunch',
  'Breakfast',
  'Dessert',
  'Vegetarian',
  'Snack',
  'Drink',
  'Appetizer',
  'Other',
];

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useUser();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Dinner');
  const [difficulty, setDifficulty] = useState('Medium');
  const [cookingTime, setCookingTime] = useState(30);
  const [prepTime, setPrepTime] = useState(15);
  const [servings, setServings] = useState(4);

  // Cover photo
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Dynamic arrays
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const res = await recipeApi.getRecipeById(id);
        if (res.success && res.data) {
          const rec = res.data;
          setTitle(rec.title || '');
          setDescription(rec.description || '');
          setCategory(rec.category || 'Dinner');
          setDifficulty(rec.difficulty || 'Medium');
          setCookingTime(rec.cookingTime || 30);
          setPrepTime(rec.prepTime || 10);
          setServings(rec.servings || 4);
          setImageUrl(rec.imageUrl || '');
          setPreviewUrl(rec.imageUrl || '');
          setIngredients(
            Array.isArray(rec.ingredients) && rec.ingredients.length > 0
              ? rec.ingredients
              : [{ name: '', amount: '', unit: '' }]
          );
          setSteps(
            Array.isArray(rec.steps) && rec.steps.length > 0
              ? rec.steps
              : [{ stepNumber: 1, instruction: '' }]
          );
        } else {
          setErrorMessage('Recipe not found.');
        }
      } catch (err) {
        console.error('Error fetching recipe for edit:', err);
        setErrorMessage('Failed to load recipe data.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Recipe title is required.');
      return;
    }

    const validIngredients = ingredients.filter((ing) => ing.name.trim() !== '');
    if (validIngredients.length === 0) {
      setErrorMessage('Please include at least one ingredient.');
      return;
    }

    const validSteps = steps.filter((s) => s.instruction.trim() !== '');
    if (validSteps.length === 0) {
      setErrorMessage('Please include at least one instruction step.');
      return;
    }

    setSubmitting(true);

    try {
      let payload;

      if (imageFile) {
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        formData.append('category', category);
        formData.append('difficulty', difficulty);
        formData.append('cookingTime', Number(cookingTime));
        formData.append('prepTime', Number(prepTime));
        formData.append('servings', Number(servings));
        formData.append('image', imageFile);
        formData.append('ingredients', JSON.stringify(validIngredients));
        formData.append('steps', JSON.stringify(validSteps));
        payload = formData;
      } else {
        payload = {
          title: title.trim(),
          description: description.trim(),
          category,
          difficulty,
          cookingTime: Number(cookingTime),
          prepTime: Number(prepTime),
          servings: Number(servings),
          imageUrl,
          ingredients: validIngredients,
          steps: validSteps,
        };
      }

      const res = await recipeApi.updateRecipe(id, payload);
      if (res.success) {
        showToast('Recipe updated successfully! ✨', 'success');
        navigate(`/recipes/${id}`);
      }
    } catch (err) {
      console.error('Error updating recipe:', err);
      const msg = err.response?.data?.message || 'Failed to update recipe.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500 mx-auto" />
        <p className="text-xs text-stone-500">Loading recipe details for editing...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div>
        <Link
          to={`/recipes/${id}`}
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-stone-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Return</span>
        </Link>
      </div>

      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Edit Recipe
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Update the ingredients, cook time, instructions, or cover photo.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-medium">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-sm space-y-8">
        {/* Basic Info Section */}
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
            1. Recipe Overview
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Recipe Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white resize-none transition leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Cook Time (mins) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Servings
              </label>
              <input
                type="number"
                min="1"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Cover Photo */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="font-serif text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
            2. Cover Photo
          </h2>
          <ImageUploader
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            imageFile={imageFile}
            setImageFile={setImageFile}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
          />
        </div>

        {/* Dynamic Ingredients */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="font-serif text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
            3. Ingredients Array
          </h2>
          <IngredientInputList
            ingredients={ingredients}
            onChange={setIngredients}
          />
        </div>

        {/* Dynamic Steps */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="font-serif text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
            4. Preparation Steps
          </h2>
          <StepInputList steps={steps} onChange={setSteps} />
        </div>

        {/* Submit Bar */}
        <div className="pt-6 border-t border-stone-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(`/recipes/${id}`)}
            className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 text-xs font-semibold hover:bg-stone-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:bg-stone-300 text-white font-semibold text-xs px-6 py-3 rounded-xl shadow-lg shadow-brand-500/25 transition transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving Changes...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipe;
