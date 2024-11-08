const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
   
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
//   inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('products', productSchema);
