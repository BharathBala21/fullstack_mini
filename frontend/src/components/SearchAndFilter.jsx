import React from 'react';
import { Search, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Vegetarian',
  'Snack',
];

const SearchAndFilter = ({
  search,
  setSearch,
  ingredient,
  setIngredient,
  category,
  setCategory,
  sort,
  setSort,
  onClear,
}) => {
  const hasFilters = Boolean(search) || Boolean(ingredient) || category !== 'All' || sort !== 'newest';

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3">
      {/* Search inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
        <div className="relative sm:col-span-6">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes..."
            className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="relative sm:col-span-4">
          <input
            type="text"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder="Filter by ingredient (e.g. garlic)..."
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
          />
          {ingredient && (
            <button
              onClick={() => setIngredient('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="sm:col-span-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
          >
            <option value="newest" className="bg-white text-stone-900">Newest</option>
            <option value="likes" className="bg-white text-stone-900">Most Liked</option>
            <option value="cookingTime" className="bg-white text-stone-900">Quickest</option>
            <option value="oldest" className="bg-white text-stone-900">Oldest</option>
          </select>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex items-center justify-between pt-1 border-t border-stone-100">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition ${
                category.toLowerCase() === c.toLowerCase()
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {hasFilters && (
          <button
            onClick={onClear}
            className="text-xs text-stone-500 hover:text-stone-900 font-medium underline shrink-0 ml-2"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;
