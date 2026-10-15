const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const upload = require('../middleware/upload');

// Category list route (placed before :id to prevent matching issues)
router.get('/categories', recipeController.getCategories);

// Base /api/recipes endpoints
router
  .route('/')
  .get(recipeController.getRecipes)
  .post(upload.single('image'), recipeController.createRecipe);

// Recipe by ID endpoints
router
  .route('/:id')
  .get(recipeController.getRecipeById)
  .put(upload.single('image'), recipeController.updateRecipe)
  .delete(recipeController.deleteRecipe);

// Social interaction endpoints
router.post('/:id/like', recipeController.likeRecipe);
router.post('/:id/save', recipeController.saveRecipe);

module.exports = router;
