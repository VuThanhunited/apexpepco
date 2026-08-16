const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET /api/products - public
router.get('/', async (req, res) => {
  try {
    const { category, featured, search, limit = 20, page = 1 } = req.query;
    const query = { isActive: { $ne: false } };
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Field projection — only return fields needed by ProductCard
    const fields = 'name slug shortDescription imageUrl image basePrice variants isFeatured inStock category tags';

    const [products, total] = await Promise.all([
      Product.find(query, fields)
        .populate('category', 'name slug')
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(), // 2-3x faster: returns plain JS objects instead of Mongoose docs
      Product.countDocuments(query),
    ]);

    // No cache — always serve fresh product data so admin changes reflect immediately
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json({ products, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:slug - public
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products - admin
router.post('/', auth, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id - admin
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id - admin
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
