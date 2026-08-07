const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET /api/settings - public (user site fetches this)
router.get('/', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne().populate('featuredSection.featuredProductIds', 'name slug image basePrice variants isFeatured inStock purity');
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/settings - admin only
router.put('/', auth, admin, async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      // Deep merge using dot-notation friendly update
      Object.assign(settings, req.body);
      await settings.save();
    }
    // Broadcast to all connected WS clients
    req.app.get('io')?.emit('settings:updated', settings.toObject());
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/settings/:section - admin: update a specific section only
router.patch('/:section', auth, admin, async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings({});

    const section = req.params.section;
    const allowedSections = [
      'announcementBar', 'ageGate', 'hero', 'features', 'featuredSection',
      'promoPopup', 'preFooterCta', 'footer', 'seo', 'theme',
      'navLinks', 'siteName', 'siteTagline', 'logo',
      'freeShippingThreshold', 'shippingCost',
      'shopPage', 'aboutPage', 'productDetailPage', 'cartPage', 'checkoutPage',
      'shippingInfo', 'termsOfService',
    ];

    if (!allowedSections.includes(section)) {
      return res.status(400).json({ message: 'Invalid section' });
    }

    settings[section] = req.body;
    await settings.save();

    // Broadcast updated settings to all connected WS clients
    req.app.get('io')?.emit('settings:updated', settings.toObject());

    res.json({ message: `Section "${section}" updated`, [section]: settings[section] });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

