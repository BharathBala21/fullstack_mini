const mongoose = require('mongoose');

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
      maxlength: [120, 'Title cannot exceed 120 characters'],
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
      default: 10,
      min: [0, 'Prep time cannot be negative'],
    },
    servings: {
      type: Number,
      default: 4,
      min: [1, 'Servings must be at least 1'],
    },
    category: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Appetizer', 'Vegetarian', 'Other'],
      default: 'Dinner',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80',
    },
    author: {
      name: { type: String, default: 'Chef User' },
      id: { type: String, default: 'user_default' },
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

// Indexes for fast text search and queries
recipeSchema.index({ title: 'text', 'ingredients.name': 'text', category: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);
