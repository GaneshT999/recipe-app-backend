const axios = require('axios');
const Recipe = require('../models/Recipe');

// ... (generateRecipe function remains the same)
exports.generateRecipe = async (req, res) => {
  const { ingredients } = req.body;
  
  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ message: 'Please provide ingredients.' });
  }

  try {
    const response = await axios.get(
      'https://api.spoonacular.com/recipes/findByIngredients',
      {
        params: {
          ingredients: ingredients.join(','),
          number: 3,
          ranking: 1,
          ignorePantry: true,
          apiKey: process.env.SPOONACULAR_API_KEY,
        },
      }
    );

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ message: 'No recipes found with those ingredients.' });
    }

    const recipes = response.data.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      usedIngredients: recipe.usedIngredients.map(i => i.original),
      missedIngredients: recipe.missedIngredients.map(i => i.original),
    }));

    res.json(recipes);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to generate recipes due to a server error.' });
  }
};


// NEW: Function to get detailed information for a single recipe
exports.getRecipeDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information`,
      {
        params: {
          includeNutrition: false,
          apiKey: process.env.SPOONACULAR_API_KEY,
        },
      }
    );

    const details = response.data;
    res.json({
      title: details.title,
      image: details.image,
      instructions: details.instructions,
      extendedIngredients: details.extendedIngredients.map(i => i.original),
      sourceUrl: details.sourceUrl,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch recipe details.' });
  }
};


// ... (saveRecipe and getMyRecipes functions remain the same)
exports.saveRecipe = async (req, res) => {
  const { title, ingredients, steps } = req.body;
  try {
    const recipe = new Recipe({
      title,
      ingredients,
      steps,
      createdBy: req.user.id
    });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to save recipe' });
  }
};

exports.getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user.id });
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Failed to fetch recipes' });
  }
};
