const path = require('path');

const DEFAULT_PORT = 5000;
const DEFAULT_MONGO_URI = 'mongodb://127.0.0.1:27017/recipe_sharing_app';
const DEFAULT_CLIENT_URL = 'http://localhost:5173';

const DEFAULT_PAGE_SIZE = 9;
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_SORT_OPTION = 'newest';

const DEFAULT_PREP_TIME = 10;
const DEFAULT_COOKING_TIME = 30;
const DEFAULT_SERVINGS = 4;
const DEFAULT_AUTHOR_NAME = 'Chef User';
const DEFAULT_AUTHOR_ID = 'user_default';

const MAX_TITLE_LENGTH = 120;
const MAX_UPLOAD_SIZE_MB = Number(process.env.MAX_UPLOAD_SIZE_MB) || 5;
const MAX_FILE_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

const ALLOWED_IMAGE_EXTENSIONS = ['jpeg', 'jpg', 'png', 'webp', 'gif'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

const DEFAULT_RECIPE_IMAGE =
  process.env.DEFAULT_RECIPE_IMAGE ||
  'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80';

const RECIPE_CATEGORIES = [
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

const FILTER_CATEGORIES = ['All', ...RECIPE_CATEGORIES];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const FILTER_DIFFICULTIES = ['All', ...DIFFICULTIES];

const SORT_OPTIONS = ['newest', 'likes', 'cookingTime', 'oldest'];

module.exports = {
  DEFAULT_PORT,
  DEFAULT_MONGO_URI,
  DEFAULT_CLIENT_URL,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_SORT_OPTION,
  DEFAULT_PREP_TIME,
  DEFAULT_COOKING_TIME,
  DEFAULT_SERVINGS,
  DEFAULT_AUTHOR_NAME,
  DEFAULT_AUTHOR_ID,
  MAX_TITLE_LENGTH,
  MAX_UPLOAD_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  DEFAULT_RECIPE_IMAGE,
  RECIPE_CATEGORIES,
  FILTER_CATEGORIES,
  DIFFICULTIES,
  FILTER_DIFFICULTIES,
  SORT_OPTIONS,
};
