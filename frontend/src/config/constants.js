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
  'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80';

export const RECIPE_CATEGORIES = [
  'Dinner',
  'Lunch',
  'Breakfast',
  'Dessert',
  'Vegetarian',
  'Snack',
  'Other',
];

export const RECIPE_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export const COMMON_UNITS = ['', 'g', 'kg', 'ml', 'cups', 'tbsp', 'tsp', 'cloves', 'pieces'];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 9,
  MAX_USER_LIST_LIMIT: 50,
};

export const RECIPE_DEFAULTS = {
  COOKING_TIME: 30,
  SERVINGS: 4,
  CATEGORY: 'Dinner',
  DIFFICULTY: 'Medium',
  SORT: 'newest',
};

export const MAX_UPLOAD_SIZE_MB = 5;
export const MAX_IMAGE_FILE_SIZE_MB = 5;
export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
