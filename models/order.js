const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  restaurantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true 
  },
  tableNumber: { type: String, required: true }, // Số bàn khách đang ngồi
  items: [{ // Danh sách các món khách chọn
    itemName: String,
    price: Number,
    quantity: Number,
    note: String
  }],
  totalPrice: { type: Number, required: true }, // Tổng tiền hóa đơn
  status: { type: String, default: 'pending' } // Trạng thái: pending (chờ), preparing (đang làm), completed (hoàn thành)
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);