const mongoose = require('mongoose');

const AddToCartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true }
});

module.exports = mongoose.model('addToCarts', AddToCartSchema);