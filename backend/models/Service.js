const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  perks:{
    type: [String],
    required: true,
  },
  hoverDescription: 
  { type: String },
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
