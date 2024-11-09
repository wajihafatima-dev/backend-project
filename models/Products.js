const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
   
  name: { type: String, required: true },
  description: { type: String, required: true },
  buttontext: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('cards', ProductSchema);
