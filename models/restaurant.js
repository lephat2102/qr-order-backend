const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  restaurantName: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  plan: { type: String, default: 'Free' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true }); // Tự động thêm ngày tạo và ngày cập nhật

module.exports = mongoose.model('Restaurant', restaurantSchema);