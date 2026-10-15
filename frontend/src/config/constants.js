export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const STORAGE_KEYS = {
  USER_ID: 'recipe_app_user_id',
  USER_NAME: 'recipe_app_user_name',
  SAVED_RECIPES: 'recipe_app_saved',
  LIKED_RECIPES: 'recipe_app_liked',
};

export const DEFAULT_USER = {
  ID: 'user_default',
  NAME: 'Alex',
};

export const DEFAULT_RECIPE_IMAGE =
  import.meta.env.VITE_DEFAULT_RECIPE_IMAGE ||
  'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80';

export const DEFAULT_CATEGORIES = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Vegetarian',
  'Snack',
  'Drink',
  'Appetizer',
  'Other',
];

export const RECIPE_CATEGORIES = [
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

export const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
export const RECIPE_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'likes', label: 'Most Liked' },
  { value: 'cookingTime', label: 'Quickest Cook Time' },
  { value: 'oldest', label: 'Oldest' },
];

export const COOK_TIME_PRESETS = [
  { value: '', label: 'Any time' },
  { value: '15', label: 'Under 15 mins' },
  { value: '30', label: 'Under 30 mins' },
  { value: '45', label: 'Under 45 mins' },
  { value: '60', label: 'Under 60 mins' },
];

export const COMMON_UNITS = [
  '',
  'tbsp',
  'tsp',
  'cup',
  'cups',
  'g',
  'kg',
  'oz',
  'lbs',
  'ml',
  'cloves',
  'pinch',
  'slices',
  'pieces',
];

export const IMAGE_PRESETS = [
  {
    name: 'Pasta',
    url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Salad',
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Steak',
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dessert',
    url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
  },
];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 9,
  MAX_USER_LIST_LIMIT: 50,
};

export const RECIPE_DEFAULTS = {
  PREP_TIME: 15,
  COOKING_TIME: 30,
  SERVINGS: 4,
  CATEGORY: 'Dinner',
  DIFFICULTY: 'Medium',
  SORT: 'newest',
};

export const MAX_UPLOAD_SIZE_MB = 5;
export const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;
