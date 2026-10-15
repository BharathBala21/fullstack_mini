import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { recipeApi } from '../services/api';
import { useUser } from '../context/UserContext';
import IngredientInputList from '../components/IngredientInputList';
import StepInputList from '../components/StepInputList';
import ImageUploader from '../components/ImageUploader';
import {
  ArrowLeft,
  Utensils,
  PlusCircle,
  Clock,
  Users,
  Flame,
  AlertCircle,
  CheckCircle2,
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

const CreateRecipe = () => {
  const navigate = useNavigate();
  const { user, showToast } = useUser();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Dinner');
  const [difficulty, setDifficulty] = useState('Medium');
  const [cookingTime, setCookingTime] = useState(30);
  const [prepTime, setPrepTime] = useState(15);
  const [servings, setServings] = useState(4);

  // Cover image states
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Dynamic nested arrays
  const [ingredients, setIngredients] = useState([
    { name: '', amount: '', unit: '' },
    { name: '', amount: '', unit: '' },
  ]);

  const [steps, setSteps] = useState([
    { stepNumber: 1, instruction: '' },
    { stepNumber: 2, instruction: '' },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!title.trim()) {
      setErrorMessage('Please provide a recipe title.');
      return;
    }

    const validIngredients = ingredients.filter((ing) => ing.name.trim() !== '');
    if (validIngredients.length === 0) {
      setErrorMessage('Please add at least one ingredient.');
      return;
    }

    const validSteps = steps.filter((s) => s.instruction.trim() !== '');
    if (validSteps.length === 0) {
      setErrorMessage('Please add at least one preparation step.');
      return;
    }

    setSubmitting(true);

    try {
      let payload;

      if (imageFile) {
        // Use FormData for Multer file upload
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
        formData.append(
          'author',
          JSON.stringify({
            name: user.name,
            id: user.id,
          })
        );
        payload = formData;
      } else {
        // Plain JSON payload
        payload = {
          title: title.trim(),
          description: description.trim(),
          category,
          difficulty,
          cookingTime: Number(cookingTime),
          prepTime: Number(prepTime),
          servings: Number(servings),
          imageUrl:
            imageUrl ||
            'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80',
          ingredients: validIngredients,
          steps: validSteps,
          author: {
            name: user.name,
            id: user.id,
          },
        };
      }

      const res = await recipeApi.createRecipe(payload);
      if (res.success && res.data) {
        showToast('Recipe published successfully! 🎉', 'success');
        navigate(`/recipes/${res.data._id}`);
      }
    } catch (err) {
      console.error('Error creating recipe:', err);
      const msg = err.response?.data?.message || 'Failed to create recipe. Please check all fields.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-stone-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Back</span>
        </Link>
      </div>

      {/* Header title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Publish a New Recipe
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Share your culinary magic with fellow food lovers. Fill in ingredients, measurements, and steps.
        </p>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-medium">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Card */}
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
              placeholder="e.g. Creamy Tuscan Garlic Butter Salmon"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Description / Story
            </label>
            <textarea
              rows={3}
              placeholder="Give a short mouth-watering introduction to this dish..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white resize-none transition leading-relaxed"
            />
          </div>

          {/* Quick Details Row */}
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

        {/* Cover Photo Upload with Multer */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="font-serif text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
            2. Cover Photo (Multer Upload or Image URL)
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

        {/* Dynamic Ingredients Array */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="font-serif text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
            3. Ingredients Array
          </h2>
          <IngredientInputList
            ingredients={ingredients}
            onChange={setIngredients}
          />
        </div>

        {/* Dynamic Steps Array */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h2 className="font-serif text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
            4. Preparation Steps Array
          </h2>
          <StepInputList steps={steps} onChange={setSteps} />
        </div>

        {/* Submit Bar */}
        <div className="pt-6 border-t border-stone-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 text-xs font-semibold hover:bg-stone-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:bg-stone-300 text-white font-semibold text-xs px-6 py-3 rounded-xl shadow-lg shadow-brand-500/25 transition transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{submitting ? 'Publishing Recipe...' : 'Publish Recipe'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;
