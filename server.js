const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Restaurant = require('./models/restaurant');
const Menu = require('./models/menu');
const Order = require('./models/order');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Đã kết nối thành công với MongoDB!'))
  .catch((err) => console.error('❌ Lỗi kết nối Database:', err));

app.get('/', (req, res) => {
  res.send('Server QR Order đang hoạt động trơn tru!');
});

// ==========================================
// CÁC API DÀNH CHO THỰC ĐƠN (MENU)
// ==========================================

// 1. Lấy danh sách món ăn của quán
app.get('/api/menu/:restaurantId', async (req, res) => {
  try {
    const idCuaQuan = req.params.restaurantId;
    const danhSachMon = await Menu.find({ restaurantId: idCuaQuan });
    res.json({ success: true, data: danhSachMon });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
// API cho Admin lấy danh sách đơn hàng của quán
app.get('/api/orders/:restaurantId', async (req, res) => {
    try {
        const orders = await Order.find({ restaurantId: req.params.restaurantId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 2. Thêm món mới
app.post('/api/menu', async (req, res) => {
  try {
    const { restaurantId, itemName, price, isAvailable } = req.body;
    const monMoi = new Menu({ restaurantId, itemName, price, isAvailable });
    await monMoi.save();
    res.status(201).json({ success: true, message: "Đã thêm món ăn!", data: monMoi });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Cập nhật món ăn (Sửa giá, đổi trạng thái)
app.put('/api/menu/:itemId', async (req, res) => {
  try {
    const idMonAn = req.params.itemId;
    const duLieuMoi = req.body;
    // Đã thay đổi cú pháp để fix cảnh báo Warning màu vàng
    const monDaCapNhat = await Menu.findByIdAndUpdate(idMonAn, duLieuMoi, { returnDocument: 'after' });
    res.json({ success: true, message: "Đã cập nhật!", data: monDaCapNhat });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
// API để cập nhật trạng thái đơn hàng thành 'completed'
app.put('/api/orders/:orderId', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.orderId, 
            { status: 'completed' }, 
            { new: true }
        );
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 4. Xóa món ăn
app.delete('/api/menu/:itemId', async (req, res) => {
  try {
    const idMonAn = req.params.itemId;
    await Menu.findByIdAndDelete(idMonAn);
    res.json({ success: true, message: "Đã xóa!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// CÁC API DÀNH CHO ĐƠN HÀNG (ORDERS)
// ==========================================

// Khách gửi đơn đặt món
app.post('/api/order', async (req, res) => {
  try {
    const { restaurantId, tableNumber, items, totalPrice } = req.body;
    const donHangMoi = new Order({ restaurantId, tableNumber, items, totalPrice });
    await donHangMoi.save();
    res.status(201).json({ success: true, message: "Có đơn hàng mới!", data: donHangMoi });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Chủ quán xem danh sách đơn
app.get('/api/orders/:restaurantId', async (req, res) => {
  try {
    const idCuaQuan = req.params.restaurantId;
    const danhSachDon = await Order.find({ restaurantId: idCuaQuan }).sort({ createdAt: -1 });
    res.json({ success: true, data: danhSachDon });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Khởi chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});