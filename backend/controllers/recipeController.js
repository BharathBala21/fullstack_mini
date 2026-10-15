const Recipe = require('../models/Recipe');
const fileStore = require('../models/recipeStore');
const { isMongoConnected } = require('../config/db');
const {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_SORT_OPTION,
  DEFAULT_COOKING_TIME,
  DEFAULT_PREP_TIME,
  DEFAULT_SERVINGS,
  DEFAULT_RECIPE_IMAGE,
  DEFAULT_AUTHOR_NAME,
  DEFAULT_AUTHOR_ID,
  FILTER_CATEGORIES,
} = require('../config/constants');

const parseJsonField = (field, defaultValue = []) => {
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch {
      return defaultValue;
    }
  }
  return Array.isArray(field) ? field : defaultValue;
};

// @desc    Get all recipes with search, ingredient search, category filter, sorting, pagination
// @route   GET /api/recipes
exports.getRecipes = async (req, res, next) => {
  try {
    const {
      search,
      ingredient,
      category,
      difficulty,
      maxTime,
      sort = DEFAULT_SORT_OPTION,
      page = DEFAULT_PAGE_NUMBER,
      limit = DEFAULT_PAGE_SIZE,
      authorId,
      savedBy,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || DEFAULT_PAGE_NUMBER);
    const limitNum = Math.max(1, parseInt(limit, 10) || DEFAULT_PAGE_SIZE);

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
exports.createRecipe = async (req, res, next) => {
  try {
    const body = { ...req.body };

    if (body.ingredients) {
      body.ingredients = parseJsonField(body.ingredients, []);
    }
    if (body.steps) {
      body.steps = parseJsonField(body.steps, []);
    }
    if (body.author && typeof body.author === 'string') {
      try {
        body.author = JSON.parse(body.author);
      } catch {
        body.author = { name: body.author, id: DEFAULT_AUTHOR_ID };
      }
    } else if (!body.author) {
      body.author = { name: DEFAULT_AUTHOR_NAME, id: DEFAULT_AUTHOR_ID };
    }

    if (req.file) {
      const serverBase = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      body.imageUrl = `${serverBase}/uploads/${req.file.filename}`;
    } else if (!body.imageUrl) {
      body.imageUrl = DEFAULT_RECIPE_IMAGE;
    }

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

    body.cookingTime = Number(body.cookingTime) || DEFAULT_COOKING_TIME;
    body.prepTime = Number(body.prepTime) || DEFAULT_PREP_TIME;
    body.servings = Number(body.servings) || DEFAULT_SERVINGS;

    let created;
    if (!isMongoConnected()) {
      created = await fileStore.create(body);
    } else {
      created = await Recipe.create(body);
    }

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
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
      } catch {
        // preserve existing
      }
    }

    if (req.file) {
      const serverBase = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
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
      message: 'Recipe updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
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
exports.likeRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId || req.headers['x-user-id'] || DEFAULT_AUTHOR_ID;

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
      likedBy.push(userId);
      isLiked = true;
    } else {
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

// @desc    Save or unsave a recipe
// @route   POST /api/recipes/:id/save
exports.saveRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId || req.headers['x-user-id'] || DEFAULT_AUTHOR_ID;

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
      savedBy.push(userId);
      isSaved = true;
    } else {
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
exports.getCategories = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: FILTER_CATEGORIES,
    });
  } catch (error) {
    next(error);
  }
};
