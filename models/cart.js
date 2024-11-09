const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true, default: 1 },
    description: { type: String, required: true, default: 1 },
    price: { type: Number, required: true },
  });
  module.exports = mongoose.model('carts', cartItemSchema);