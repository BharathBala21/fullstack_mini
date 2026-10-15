import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

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
        setErrorMessage('Unable to load recipe data.');
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
        showToast('Recipe updated');
        navigate(`/recipes/${id}`);
      }
    } catch (err) {
      console.error('Error updating recipe:', err);
      const msg = err.response?.data?.message || 'Could not update recipe.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-xs text-stone-500">
        Loading recipe...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      <div>
        <Link
          to={`/recipes/${id}`}
          className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-900 text-xs font-medium transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
          Edit Recipe
        </h1>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2.5 text-rose-800 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200 p-6 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white resize-none"
          />
        </div>

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

        <div className="pt-2 border-t border-stone-100">
          <IngredientInputList
            ingredients={ingredients}
            onChange={setIngredients}
          />
        </div>

        <div className="pt-2 border-t border-stone-100">
          <StepInputList steps={steps} onChange={setSteps} />
        </div>

        <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(`/recipes/${id}`)}
            className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipe;
