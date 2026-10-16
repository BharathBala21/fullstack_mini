import React, { useState, useEffect, useCallback } from 'react';
import { recipeApi } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import SearchAndFilter from '../components/SearchAndFilter';
import Pagination from '../components/Pagination';
import { Utensils, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PAGINATION } from '../config/constants';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & filter state
  const [search, setSearch] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');

  // Pagination
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: PAGINATION.DEFAULT_LIMIT,
        sort,
      };

      if (search.trim()) params.search = search.trim();
      if (ingredient.trim()) params.ingredient = ingredient.trim();
      if (category && category !== 'All') params.category = category;

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
  }, [page, search, ingredient, category, sort]);

  useEffect(() => {
    setPage(1);
  }, [search, ingredient, category, sort]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const clearFilters = () => {
    setSearch('');
    setIngredient('');
    setCategory('All');
    setSort('newest');
    setPage(1);
  };

  const updateRecipe = (updated) => {
    setRecipes((prev) =>
      prev.map((r) => (r._id === updated._id ? updated : r))
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Recipes
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Browse recipes, search by ingredient, or discover new meals.
          </p>
        </div>
        <div className="text-xs text-stone-500 font-medium">
          {total} {total === 1 ? 'recipe' : 'recipes'} available
        </div>
      </div>

      <SearchAndFilter
        search={search}
        setSearch={setSearch}
        ingredient={ingredient}
        setIngredient={setIngredient}
        category={category}
        setCategory={setCategory}
        sort={sort}
        setSort={setSort}
        onClear={clearFilters}
      />

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-rose-800 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchRecipes}
            className="text-xs text-rose-700 underline font-semibold hover:text-rose-900"
          >
            Retry
          </button>
        </div>
      )}

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
                onUpdate={updateRecipe}
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
            Try adjusting your search terms or clearing the filters.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={clearFilters}
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
