const router = require('express').Router();
const auth = require('../middleware/auth');
const { 
  generateRecipe, 
  saveRecipe, 
  getMyRecipes,
  getRecipeDetails // Import the new controller function
} = require('../controllers/recipeController');

router.post('/generate', auth, generateRecipe);
router.post('/', auth, saveRecipe);
router.get('/', auth, getMyRecipes);

// NEW: Route to get details for a specific recipe by its Spoonacular ID
router.get('/:id', auth, getRecipeDetails);

module.exports = router;
