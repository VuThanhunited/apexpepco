const express = require('express');
const router = express.Router();
const WholesaleApplication = require('../models/WholesaleApplication');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// POST /api/wholesale - public submit
router.post('/', async (req, res) => {
  try {
    const app = await WholesaleApplication.create(req.body);
    res.status(201).json({ message: 'Application submitted successfully', id: app._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/wholesale - admin
router.get('/', auth, admin, async (req, res) => {
  try {
    const apps = await WholesaleApplication.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/wholesale/:id - admin update status
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const app = await WholesaleApplication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json(app);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
