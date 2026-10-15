import React, { useState, useEffect, useCallback } from 'react';
import { recipeApi } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import SearchAndFilter from '../components/SearchAndFilter';
import Pagination from '../components/Pagination';
import { Utensils, Sparkles, ChefHat, Flame, BookOpen, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const [sort, setSort] = useState('newest');
  const [categories, setCategories] = useState([]);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch categories once on mount
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

  // Fetch recipes whenever filters or page changes
  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 9,
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
      setError('Failed to load recipes. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, ingredientQuery, selectedCategory, difficulty, maxTime, sort]);

  useEffect(() => {
    // Reset to page 1 whenever filters change
    setPage(1);
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
    setSort('newest');
    setPage(1);
  };

  const handleRecipeCardUpdate = (updatedRecipe) => {
    setRecipes((prev) =>
      prev.map((r) => (r._id === updatedRecipe._id ? updatedRecipe : r))
    );
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white p-8 sm:p-12 shadow-xl border border-stone-800">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            Discover & Share Home Cooking
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Cook with Passion. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-amber-300 to-amber-500">
              Share with the World.
            </span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Explore hundreds of verified recipes, search recipes by the exact ingredients
            in your fridge, curate your personal cookbook, and publish your own culinary creations.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/create"
              className="bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-brand-500/25 transition hover:scale-105"
            >
              Share Your Recipe
            </Link>
            <button
              onClick={() => {
                const searchEl = document.getElementById('browse-section');
                searchEl?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-stone-800/80 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold text-sm px-5 py-2.5 rounded-xl transition"
            >
              Browse Recipes ({total})
            </button>
          </div>
        </div>
      </section>

      {/* Main Browse Section */}
      <section id="browse-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Explore Recipes
            </h2>
            <p className="text-xs text-stone-500">
              Browse community recipes, search by ingredient, or filter by category and cook time.
            </p>
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

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <p className="font-semibold">{error}</p>
              <button
                onClick={fetchRecipes}
                className="text-xs text-rose-600 underline font-medium mt-1 hover:text-rose-900"
              >
                Click to retry
              </button>
            </div>
          </div>
        )}

        {/* Recipes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-stone-200 p-4 space-y-4 animate-pulse"
              >
                <div className="bg-stone-200 aspect-[4/3] rounded-xl" />
                <div className="space-y-2">
                  <div className="h-5 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-200 rounded w-full" />
                  <div className="h-3 bg-stone-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onUpdate={handleRecipeCardUpdate}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              page={page}
              pages={pages}
              total={total}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
              <Utensils className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-800">
              No recipes matched your search
            </h3>
            <p className="text-stone-500 text-xs max-w-md mx-auto">
              We couldn't find any recipes matching your current filters. Try searching with
              different ingredients or reset your filters.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition"
              >
                Clear All Filters
              </button>
              <Link
                to="/create"
                className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-brand-500/20"
              >
                Publish New Recipe
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
