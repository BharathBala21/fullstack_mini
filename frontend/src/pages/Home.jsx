import React, { useState, useEffect, useCallback } from 'react';
import { recipeApi } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import SearchAndFilter from '../components/SearchAndFilter';
import Pagination from '../components/Pagination';
import { Utensils, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PAGINATION, RECIPE_DEFAULTS } from '../config/constants';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredientQuery, setIngredientQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [maxTime, setMaxTime] = useState('');
  const [sort, setSort] = useState(RECIPE_DEFAULTS.SORT);
  const [categories, setCategories] = useState([]);

  // Pagination state
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await recipeApi.getCategories();
        if (res.success) {
          setCategories(res.data);
        }
      } catch (e) {
        console.error('Failed to load categories:', e);
      }
    };
    fetchCats();
  }, []);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: PAGINATION.DEFAULT_LIMIT,
        sort,
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (ingredientQuery.trim()) params.ingredient = ingredientQuery.trim();
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (difficulty && difficulty !== 'All') params.difficulty = difficulty;
      if (maxTime) params.maxTime = maxTime;

      const res = await recipeApi.getRecipes(params);
      if (res.success) {
        setRecipes(res.data);
        setTotal(res.total);
        setPages(res.pages);
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Unable to load recipes. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, ingredientQuery, selectedCategory, difficulty, maxTime, sort]);

  useEffect(() => {
    setPage(PAGINATION.DEFAULT_PAGE);
  }, [searchQuery, ingredientQuery, selectedCategory, difficulty, maxTime, sort]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setIngredientQuery('');
    setSelectedCategory('All');
    setDifficulty('All');
    setMaxTime('');
    setSort(RECIPE_DEFAULTS.SORT);
    setPage(PAGINATION.DEFAULT_PAGE);
  };

  const handleRecipeCardUpdate = (updatedRecipe) => {
    setRecipes((prev) =>
      prev.map((r) => (r._id === updatedRecipe._id ? updatedRecipe : r))
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Clean Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Recipes
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Browse dishes, search by ingredient, or filter by cooking time.
          </p>
        </div>
        <div className="text-xs text-stone-500 font-medium self-start sm:self-auto">
          {total} {total === 1 ? 'recipe' : 'recipes'} available
        </div>
      </div>

      {/* Search & Filter Controls */}
      <SearchAndFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        ingredientQuery={ingredientQuery}
        setIngredientQuery={setIngredientQuery}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        maxTime={maxTime}
        setMaxTime={setMaxTime}
        sort={sort}
        setSort={setSort}
        categories={categories}
        onReset={handleResetFilters}
      />

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <div className="flex items-center justify-between w-full">
            <span>{error}</span>
            <button
              onClick={fetchRecipes}
              className="text-xs text-rose-700 underline font-semibold ml-4 hover:text-rose-900"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Recipes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 animate-pulse"
            >
              <div className="bg-stone-200 aspect-[16/10] rounded-lg" />
              <div className="h-4 bg-stone-200 rounded w-3/4" />
              <div className="h-3 bg-stone-200 rounded w-full" />
              <div className="h-3 bg-stone-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : recipes.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onUpdate={handleRecipeCardUpdate}
              />
            ))}
          </div>

          <Pagination
            page={page}
            pages={pages}
            total={total}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center mx-auto">
            <Utensils className="w-6 h-6" />
          </div>
          <h2 className="text-base font-semibold text-stone-900">
            No recipes found
          </h2>
          <p className="text-stone-500 text-xs max-w-sm mx-auto">
            Try adjusting your search terms, changing the category, or clearing filters.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition"
            >
              Reset Filters
            </button>
            <Link
              to="/create"
              className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition"
            >
              Add a Recipe
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
