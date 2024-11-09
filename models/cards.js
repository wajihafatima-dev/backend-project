const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
   
  name: { type: String, required: true },
  description: { type: String, required: true },
  buttontext: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('cards', cardSchema);
