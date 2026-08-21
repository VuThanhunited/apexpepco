const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { sendOrderEmails } = require('../utils/email');

// GET /api/orders/test-email - debug endpoint to test email sending
router.get('/test-email', async (req, res) => {
  try {
    const fakeOrder = {
      orderNumber: 'TEST-' + Date.now().toString().slice(-6),
      _id: '000000000000000000000001',
      shippingAddress: { firstName: 'Test', lastName: 'User', email: 'apexpepco@gmail.com', address: '123 St', city: 'Houston', state: 'TX', zipCode: '77001', country: 'US', phone: '555-0000' },
      guestEmail: 'apexpepco@gmail.com',
      items: [{ productName: 'Test Product', quantity: 1, price: 49.99 }],
      subtotal: 49.99, shippingCost: 0, total: 49.99,
      paymentMethod: 'Test'
    };
    await sendOrderEmails(fakeOrder);
    res.json({ success: true, message: 'Test email sent successfully', server: process.env.NODE_ENV, dbHost: require('mongoose').connection.host });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, server: process.env.NODE_ENV });
  }
});

// POST /api/orders - create order (user or guest)
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, guestEmail, paymentMethod = 'pending' } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = subtotal >= 250 ? 0 : 15;
    const total = subtotal + shippingCost;

    const cleanedEmail = (shippingAddress?.email || guestEmail || '').trim().toLowerCase();
    const cleanedShipping = shippingAddress ? {
      ...shippingAddress,
      email: cleanedEmail || (shippingAddress.email ? shippingAddress.email.trim().toLowerCase() : ''),
      firstName: shippingAddress.firstName ? shippingAddress.firstName.trim() : '',
      lastName: shippingAddress.lastName ? shippingAddress.lastName.trim() : '',
      phone: shippingAddress.phone ? shippingAddress.phone.trim() : '',
      address: shippingAddress.address ? shippingAddress.address.trim() : '',
      city: shippingAddress.city ? shippingAddress.city.trim() : '',
      state: shippingAddress.state ? shippingAddress.state.trim() : '',
      zipCode: shippingAddress.zipCode ? shippingAddress.zipCode.trim() : '',
      country: shippingAddress.country ? shippingAddress.country.trim() : 'US',
    } : {};

    const orderData = {
      items,
      subtotal,
      shippingCost,
      total,
      shippingAddress: cleanedShipping,
      guestEmail: cleanedEmail,
      paymentMethod
    };

    if (req.headers.authorization) {
      const jwt = require('jsonwebtoken');
      try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        orderData.user = decoded.id;
      } catch (_) {}
    }

    const order = await Order.create(orderData);
    console.log(`📦 Order created: ${order.orderNumber} | Customer email: ${order.shippingAddress?.email || order.guestEmail || 'N/A'}`);

    // Send emails asynchronously in background
    setImmediate(() => {
      sendOrderEmails(order)
        .then(() => console.log(`✅ Order email process completed for #${order.orderNumber}`))
        .catch(err => console.error(`❌ Order email process failed for #${order.orderNumber}:`, err));
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
