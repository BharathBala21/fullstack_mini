import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import {
  DEFAULT_CATEGORIES,
  DIFFICULTIES,
  SORT_OPTIONS,
  COOK_TIME_PRESETS,
  RECIPE_DEFAULTS,
} from '../config/constants';

const SearchAndFilter = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  ingredientQuery,
  setIngredientQuery,
  difficulty,
  setDifficulty,
  maxTime,
  setMaxTime,
  sort,
  setSort,
  categories = [],
  onReset,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(ingredientQuery) ||
    selectedCategory !== 'All' ||
    difficulty !== 'All' ||
    Boolean(maxTime) ||
    sort !== RECIPE_DEFAULTS.SORT;

  const categoryList =
    categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3">
      {/* Search Input Row */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes, ingredients, or cuisines..."
            className="w-full pl-10 pr-9 py-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg border text-xs font-medium transition ${
            showFilters || hasActiveFilters
              ? 'bg-stone-900 text-white border-stone-900'
              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5" />
          )}
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar pt-1">
        {categoryList.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition ${
                isSelected
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Expandable Filter Drawer */}
      {showFilters && (
        <div className="pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Ingredient Specific Search */}
          <div>
            <label className="block text-stone-600 font-medium mb-1">
              Filter by Ingredient
            </label>
            <input
              type="text"
              value={ingredientQuery}
              onChange={(e) => setIngredientQuery(e.target.value)}
              placeholder="e.g. garlic, chicken"
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>

          {/* Sort */}
          <div>
            <label className="block text-stone-600 font-medium mb-1">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-stone-600 font-medium mb-1">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Max Cook Time */}
          <div>
            <label className="block text-stone-600 font-medium mb-1 flex items-center justify-between">
              <span>Max Time</span>
              <span className="text-stone-500 font-normal">
                {maxTime ? `${maxTime}m` : 'Any'}
              </span>
            </label>
            <select
              value={maxTime}
              onChange={(e) => setMaxTime(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
            >
              {COOK_TIME_PRESETS.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>Filters active</span>
          <button
            onClick={onReset}
            className="text-stone-700 hover:text-stone-900 font-medium underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
