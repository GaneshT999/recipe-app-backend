const mongoose = require('mongoose');
const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  steps: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Recipe', recipeSchema);