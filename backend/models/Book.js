const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  imageUrl: String,
  price: Number,
  category: String,
  rating: Number,
  hoveredPopupDescription: String,
});

module.exports = mongoose.model('Book', bookSchema);