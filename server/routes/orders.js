const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { sendOrderEmails } = require('../utils/email');

// POST /api/orders - create order (user or guest)
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, guestEmail, paymentMethod = 'pending' } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = subtotal >= 250 ? 0 : 15;
    const total = subtotal + shippingCost;

    const orderData = { items, subtotal, shippingCost, total, shippingAddress, paymentMethod };
    orderData.guestEmail = guestEmail || shippingAddress?.email;
    if (req.headers.authorization) {
      const jwt = require('jsonwebtoken');
      try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        orderData.user = decoded.id;
      } catch (_) {}
    }

    const order = await Order.create(orderData);

    // Send emails asynchronously in background so HTTP response is instant (<50ms)
    setImmediate(() => {
      sendOrderEmails(order).catch(err => console.error('Background order email error:', err.message));
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/orders/my - user's own orders
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product', 'name image').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders - admin
router.get('/', auth, admin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
      Order.find(query).populate('user', 'firstName lastName email').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Order.countDocuments(query),
    ]);
    res.json({ orders, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id - admin update status
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
