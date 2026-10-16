const Recipe = require('../models/Recipe');
const fileStore = require('../models/recipeStore');
const { isMongoConnected } = require('../config/db');

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
      return res.json({
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
      const q = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: q },
        { description: q },
        { category: q },
        { 'ingredients.name': q },
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
    if (sort === 'likes') sortOption = { likes: -1, createdAt: -1 };
    if (sort === 'cookingTime') sortOption = { cookingTime: 1 };

    const total = await Recipe.countDocuments(filter);
    const recipes = await Recipe.find(filter)
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      success: true,
      count: recipes.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      data: recipes,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
exports.getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = isMongoConnected()
      ? await Recipe.findById(id)
      : await fileStore.findById(id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }
    res.json({ success: true, data: recipe });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new recipe
// @route   POST /api/recipes
exports.createRecipe = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (typeof data.ingredients === 'string') {
      try { data.ingredients = JSON.parse(data.ingredients); } catch { data.ingredients = []; }
    }
    if (typeof data.steps === 'string') {
      try { data.steps = JSON.parse(data.steps); } catch { data.steps = []; }
    }
    if (typeof data.author === 'string') {
      try { data.author = JSON.parse(data.author); } catch { data.author = { name: data.author, id: 'user_default' }; }
    } else if (!data.author) {
      data.author = { name: 'Alex', id: 'user_default' };
    }

    if (req.file) {
      const serverBase = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      data.imageUrl = `${serverBase}/uploads/${req.file.filename}`;
    }

    if (!data.title?.trim()) {
      return res.status(400).json({ success: false, message: 'Recipe title is required' });
    }
    if (!Array.isArray(data.ingredients) || data.ingredients.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one ingredient is required' });
    }
    if (!Array.isArray(data.steps) || data.steps.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one step instruction is required' });
    }

    data.cookingTime = Number(data.cookingTime) || 30;

    const created = isMongoConnected()
      ? await Recipe.create(data)
      : await fileStore.create(data);

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: created,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
exports.updateRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (typeof data.ingredients === 'string') {
      try { data.ingredients = JSON.parse(data.ingredients); } catch {}
    }
    if (typeof data.steps === 'string') {
      try { data.steps = JSON.parse(data.steps); } catch {}
    }

    if (req.file) {
      const serverBase = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      data.imageUrl = `${serverBase}/uploads/${req.file.filename}`;
    }

    if (data.cookingTime) data.cookingTime = Number(data.cookingTime);

    const updated = isMongoConnected()
      ? await Recipe.findByIdAndUpdate(id, data, { new: true })
      : await fileStore.findByIdAndUpdate(id, data);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    res.json({
      success: true,
      message: 'Recipe updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
exports.deleteRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = isMongoConnected()
      ? await Recipe.findByIdAndDelete(id)
      : await fileStore.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    res.json({
      success: true,
      message: 'Recipe deleted successfully',
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Like or unlike a recipe
// @route   POST /api/recipes/:id/like
exports.likeRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId || req.headers['x-user-id'] || 'user_default';
    const recipe = isMongoConnected()
      ? await Recipe.findById(id)
      : await fileStore.findById(id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const likedBy = Array.isArray(recipe.likedBy) ? [...recipe.likedBy] : [];
    const idx = likedBy.indexOf(userId);
    const isLiked = idx === -1;

    if (isLiked) {
      likedBy.push(userId);
    } else {
      likedBy.splice(idx, 1);
    }

    const update = { likedBy, likes: Math.max(0, likedBy.length) };
    const updated = isMongoConnected()
      ? await Recipe.findByIdAndUpdate(id, update, { new: true })
      : await fileStore.findByIdAndUpdate(id, update);

    res.json({
      success: true,
      likes: updated.likes,
      isLiked,
      likedBy: updated.likedBy,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Save or unsave a recipe
// @route   POST /api/recipes/:id/save
exports.saveRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId || req.headers['x-user-id'] || 'user_default';
    const recipe = isMongoConnected()
      ? await Recipe.findById(id)
      : await fileStore.findById(id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const savedBy = Array.isArray(recipe.savedBy) ? [...recipe.savedBy] : [];
    const idx = savedBy.indexOf(userId);
    const isSaved = idx === -1;

    if (isSaved) {
      savedBy.push(userId);
    } else {
      savedBy.splice(idx, 1);
    }

    const updated = isMongoConnected()
      ? await Recipe.findByIdAndUpdate(id, { savedBy }, { new: true })
      : await fileStore.findByIdAndUpdate(id, { savedBy });

    res.json({
      success: true,
      isSaved,
      savedCount: updated.savedBy.length,
      savedBy: updated.savedBy,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get list of available categories
// @route   GET /api/recipes/categories
exports.getCategories = async (req, res) => {
  const categories = [
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
  res.json({ success: true, data: categories });
};
