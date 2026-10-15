const mongoose = require('mongoose');
const {
  RECIPE_CATEGORIES,
  DIFFICULTIES,
  DEFAULT_RECIPE_IMAGE,
  DEFAULT_AUTHOR_NAME,
  DEFAULT_AUTHOR_ID,
  DEFAULT_PREP_TIME,
  DEFAULT_SERVINGS,
  MAX_TITLE_LENGTH,
} = require('../config/constants');

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    amount: { type: String, default: '' },
    unit: { type: String, default: '' },
  },
  { _id: false }
);

const stepSchema = new mongoose.Schema(
  {
    stepNumber: { type: Number, required: true },
    instruction: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
      maxlength: [MAX_TITLE_LENGTH, `Title cannot exceed ${MAX_TITLE_LENGTH} characters`],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    ingredients: {
      type: [ingredientSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A recipe must have at least one ingredient',
      },
    },
    steps: {
      type: [stepSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A recipe must have at least one step',
      },
    },
    cookingTime: {
      type: Number,
      required: [true, 'Cooking time is required'],
      min: [1, 'Cooking time must be at least 1 minute'],
    },
    prepTime: {
      type: Number,
      default: DEFAULT_PREP_TIME,
      min: [0, 'Prep time cannot be negative'],
    },
    servings: {
      type: Number,
      default: DEFAULT_SERVINGS,
      min: [1, 'Servings must be at least 1'],
    },
    category: {
      type: String,
      enum: RECIPE_CATEGORIES,
      default: RECIPE_CATEGORIES[0] || 'Dinner',
    },
    difficulty: {
      type: String,
      enum: DIFFICULTIES,
      default: DIFFICULTIES[1] || 'Medium',
    },
    imageUrl: {
      type: String,
      default: DEFAULT_RECIPE_IMAGE,
    },
    author: {
      name: { type: String, default: DEFAULT_AUTHOR_NAME },
      id: { type: String, default: DEFAULT_AUTHOR_ID },
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [String],
      default: [],
    },
    savedBy: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Search indexes
recipeSchema.index({ title: 'text', 'ingredients.name': 'text', category: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);
