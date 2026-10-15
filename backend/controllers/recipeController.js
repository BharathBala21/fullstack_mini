const Recipe = require('../models/Recipe');
const fileStore = require('../models/recipeStore');
const { isMongoConnected } = require('../config/db');

// Helper to normalize JSON arrays for ingredients & steps (handles both JSON and multipart form data)
const parseJsonField = (field, defaultValue = []) => {
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (e) {
      return defaultValue;
    }
  }
  return Array.isArray(field) ? field : defaultValue;
};

// @desc    Get all recipes with search, ingredient search, category filter, sorting, pagination
// @route   GET /api/recipes
// @access  Public
exports.getRecipes = async (req, res, next) => {
  try {
    const {
      search,
      ingredient,
      category,
      difficulty,
      maxTime,
      sort = 'newest',
      page = 1,
      limit = 9,
      authorId,
      savedBy,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 9);

    if (!isMongoConnected()) {
      const result = await fileStore.find({
        search,
        ingredient,
        category,
        difficulty,
        maxTime,
        sort,
        page: pageNum,
        limit: limitNum,
        authorId,
        savedBy,
      });
      return res.status(200).json({
        success: true,
        count: result.recipes.length,
        total: result.total,
        page: result.page,
        pages: result.pages,
        data: result.recipes,
      });
    }

    // Build MongoDB query
    const filter = {};

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { 'ingredients.name': searchRegex },
      ];
    }

    if (ingredient) {
      filter['ingredients.name'] = new RegExp(ingredient.trim(), 'i');
    }

    if (category && category !== 'All') {
      filter.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    if (difficulty && difficulty !== 'All') {
      filter.difficulty = new RegExp(`^${difficulty.trim()}$`, 'i');
    }

    if (maxTime && Number(maxTime) > 0) {
      filter.cookingTime = { $lte: Number(maxTime) };
    }

    if (authorId) {
      filter['author.id'] = authorId;
    }

    if (savedBy) {
      filter.savedBy = savedBy;
    }

    // Sorting options
    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    else if (sort === 'likes') sortOption = { likes: -1, createdAt: -1 };
    else if (sort === 'cookingTime') sortOption = { cookingTime: 1 };

    const total = await Recipe.countDocuments(filter);
    const recipes = await Recipe.find(filter)
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: recipes.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      data: recipes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
exports.getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let recipe;
    if (!isMongoConnected()) {
      recipe = await fileStore.findById(id);
    } else {
      recipe = await Recipe.findById(id);
    }

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: `Recipe not found with id ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new recipe
// @route   POST /api/recipes
// @access  Public
exports.createRecipe = async (req, res, next) => {
  try {
    const body = { ...req.body };

    // Parse ingredients & steps if sent as JSON string (via form-data)
    if (body.ingredients) {
      body.ingredients = parseJsonField(body.ingredients, []);
    }
    if (body.steps) {
      body.steps = parseJsonField(body.steps, []);
    }
    if (body.author && typeof body.author === 'string') {
      try {
        body.author = JSON.parse(body.author);
      } catch (e) {
        body.author = { name: body.author, id: 'user_default' };
      }
    }

    // Handle image from file upload or imageUrl
    if (req.file) {
      const serverBase = `${req.protocol}://${req.get('host')}`;
      body.imageUrl = `${serverBase}/uploads/${req.file.filename}`;
    } else if (!body.imageUrl) {
      body.imageUrl =
        'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80';
    }

    // Validation
    if (!body.title || !body.title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Recipe title is required',
      });
    }

    if (!Array.isArray(body.ingredients) || body.ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one ingredient is required',
      });
    }

    if (!Array.isArray(body.steps) || body.steps.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one step instruction is required',
      });
    }

    // Number conversions
    body.cookingTime = Number(body.cookingTime) || 30;
    body.prepTime = Number(body.prepTime) || 10;
    body.servings = Number(body.servings) || 4;

    let created;
    if (!isMongoConnected()) {
      created = await fileStore.create(body);
    } else {
      created = await Recipe.create(body);
    }

    res.status(201).json({
      success: true,
      message: 'Recipe published successfully!',
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Public
exports.updateRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = { ...req.body };

    if (body.ingredients) {
      body.ingredients = parseJsonField(body.ingredients, body.ingredients);
    }
    if (body.steps) {
      body.steps = parseJsonField(body.steps, body.steps);
    }
    if (body.author && typeof body.author === 'string') {
      try {
        body.author = JSON.parse(body.author);
      } catch (e) {
        // preserve existing author
      }
    }

    if (req.file) {
      const serverBase = `${req.protocol}://${req.get('host')}`;
      body.imageUrl = `${serverBase}/uploads/${req.file.filename}`;
    }

    if (body.cookingTime) body.cookingTime = Number(body.cookingTime);
    if (body.prepTime) body.prepTime = Number(body.prepTime);
    if (body.servings) body.servings = Number(body.servings);

    let updated;
    if (!isMongoConnected()) {
      updated = await fileStore.findByIdAndUpdate(id, body);
    } else {
      updated = await Recipe.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
    }

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Recipe not found with id ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully!',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Public
exports.deleteRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;

    let deleted;
    if (!isMongoConnected()) {
      deleted = await fileStore.findByIdAndDelete(id);
    } else {
      deleted = await Recipe.findByIdAndDelete(id);
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Recipe not found with id ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Recipe deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like or unlike a recipe
// @route   POST /api/recipes/:id/like
// @access  Public
exports.likeRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId || req.headers['x-user-id'] || 'guest_user';

    let recipe;
    if (!isMongoConnected()) {
      recipe = await fileStore.findById(id);
    } else {
      recipe = await Recipe.findById(id);
    }

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    const likedBy = Array.isArray(recipe.likedBy) ? [...recipe.likedBy] : [];
    const index = likedBy.indexOf(userId);
    let isLiked = false;

    if (index === -1) {
      // Like
      likedBy.push(userId);
      isLiked = true;
    } else {
      // Unlike
      likedBy.splice(index, 1);
      isLiked = false;
    }

    const updatedLikes = Math.max(0, likedBy.length);

    let updated;
    if (!isMongoConnected()) {
      updated = await fileStore.findByIdAndUpdate(id, {
        likedBy,
        likes: updatedLikes,
      });
    } else {
      recipe.likedBy = likedBy;
      recipe.likes = updatedLikes;
      await recipe.save();
      updated = recipe;
    }

    res.status(200).json({
      success: true,
      likes: updated.likes,
      isLiked,
      likedBy: updated.likedBy,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save or unsave (bookmark) a recipe
// @route   POST /api/recipes/:id/save
// @access  Public
exports.saveRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId || req.headers['x-user-id'] || 'guest_user';

    let recipe;
    if (!isMongoConnected()) {
      recipe = await fileStore.findById(id);
    } else {
      recipe = await Recipe.findById(id);
    }

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    const savedBy = Array.isArray(recipe.savedBy) ? [...recipe.savedBy] : [];
    const index = savedBy.indexOf(userId);
    let isSaved = false;

    if (index === -1) {
      // Bookmark
      savedBy.push(userId);
      isSaved = true;
    } else {
      // Un-bookmark
      savedBy.splice(index, 1);
      isSaved = false;
    }

    let updated;
    if (!isMongoConnected()) {
      updated = await fileStore.findByIdAndUpdate(id, { savedBy });
    } else {
      recipe.savedBy = savedBy;
      await recipe.save();
      updated = recipe;
    }

    res.status(200).json({
      success: true,
      isSaved,
      savedCount: updated.savedBy.length,
      savedBy: updated.savedBy,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of available categories
// @route   GET /api/recipes/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = [
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
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
