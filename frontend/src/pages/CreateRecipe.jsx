import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { recipeApi } from '../services/api';
import { useUser } from '../context/UserContext';
import IngredientInputList from '../components/IngredientInputList';
import StepInputList from '../components/StepInputList';
import ImageUploader from '../components/ImageUploader';
import { ArrowLeft, AlertCircle } from 'lucide-react';

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

  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

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

    if (!title.trim()) {
      setErrorMessage('Please enter a recipe title.');
      return;
    }

    const validIngredients = ingredients.filter((ing) => ing.name.trim() !== '');
    if (validIngredients.length === 0) {
      setErrorMessage('Please add at least one ingredient.');
      return;
    }

    const validSteps = steps.filter((s) => s.instruction.trim() !== '');
    if (validSteps.length === 0) {
      setErrorMessage('Please add at least one instruction step.');
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
        formData.append(
          'author',
          JSON.stringify({
            name: user.name,
            id: user.id,
          })
        );
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
        showToast('Recipe published');
        navigate(`/recipes/${res.data._id}`);
      }
    } catch (err) {
      console.error('Error creating recipe:', err);
      const msg = err.response?.data?.message || 'Could not save recipe.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 text-xs font-medium transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
          New Recipe
        </h1>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2.5 text-rose-800 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200 p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Title
          </label>
          <input
            type="text"
            placeholder="e.g. Lemon Herb Roasted Chicken"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Description
          </label>
          <textarea
            rows={2}
            placeholder="Short overview of the dish..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white resize-none"
          />
        </div>

        {/* Metadata row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Cook Time (min)</label>
            <input
              type="number"
              min="1"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Servings</label>
            <input
              type="number"
              min="1"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>
        </div>

        {/* Cover Photo */}
        <div className="pt-2 border-t border-stone-100">
          <ImageUploader
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            imageFile={imageFile}
            setImageFile={setImageFile}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
          />
        </div>

        {/* Ingredients */}
        <div className="pt-2 border-t border-stone-100">
          <IngredientInputList
            ingredients={ingredients}
            onChange={setIngredients}
          />
        </div>

        {/* Instructions */}
        <div className="pt-2 border-t border-stone-100">
          <StepInputList steps={steps} onChange={setSteps} />
        </div>

        {/* Submit row */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition"
          >
            {submitting ? 'Publishing...' : 'Publish Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;
