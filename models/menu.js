const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  restaurantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', // Liên kết ID với bảng Restaurant
    required: true 
  },
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);