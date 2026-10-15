import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  Clock,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';

const COMMON_INGREDIENTS = ['Garlic', 'Chicken', 'Tomato', 'Cheese', 'Pasta', 'Quinoa', 'Chocolate', 'Onion'];

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
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(ingredientQuery) ||
    selectedCategory !== 'All' ||
    difficulty !== 'All' ||
    Boolean(maxTime) ||
    sort !== 'newest';

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-5 space-y-4">
      {/* Top Search Bar & Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Main Search Input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes by name, keywords, or cuisine (e.g. tacos, pizza)..."
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search by Ingredient Direct Input */}
        <div className="relative sm:w-64">
          <Sparkles className="w-4 h-4 text-brand-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={ingredientQuery}
            onChange={(e) => setIngredientQuery(e.target.value)}
            placeholder="Ingredient (e.g. garlic)..."
            className="w-full pl-10 pr-9 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
          />
          {ingredientQuery && (
            <button
              onClick={() => setIngredientQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Drawer Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition ${
            showAdvanced || hasActiveFilters
              ? 'bg-brand-50 border-brand-200 text-brand-700'
              : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-brand-500"></span>
          )}
        </button>
      </div>

      {/* Quick Ingredient Tags */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-stone-400 font-semibold uppercase tracking-wider shrink-0 text-[10px]">
          Quick Ingredients:
        </span>
        {COMMON_INGREDIENTS.map((item) => {
          const isSelected = ingredientQuery.toLowerCase() === item.toLowerCase();
          return (
            <button
              key={item}
              onClick={() => setIngredientQuery(isSelected ? '' : item)}
              className={`px-3 py-1 rounded-full font-medium shrink-0 transition ${
                isSelected
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              +{item}
            </button>
          );
        })}
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-stone-100 pt-3">
        {(categories.length > 0
          ? categories
          : ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegetarian', 'Snack']
        ).map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition ${
                isSelected
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Collapsible Advanced Filters (Sort, Difficulty, Max Cook Time) */}
      {showAdvanced && (
        <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Sort By */}
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-brand-600" />
              <span>Sort By</span>
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="newest">Newest First</option>
              <option value="likes">Most Liked</option>
              <option value="cookingTime">Quickest Cooking Time</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Max Cooking Time */}
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-600" />
                <span>Max Cooking Time</span>
              </span>
              <span className="text-brand-600 font-semibold">
                {maxTime ? `${maxTime} mins` : 'Any'}
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={maxTime || 0}
              onChange={(e) => setMaxTime(Number(e.target.value) || '')}
              className="w-full accent-brand-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>Any</span>
              <span>30m</span>
              <span>60m</span>
              <span>90m</span>
            </div>
          </div>
        </div>
      )}

      {/* Clear Filters Indicator */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
          <span className="text-stone-500">
            Active filters applied
          </span>
          <button
            onClick={onReset}
            className="text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
