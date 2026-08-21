const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const SiteSettings = require('../models/SiteSettings');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// ── Auto-backup helper ─────────────────────────────────────
// Writes settings to a JSON file on disk every time they are saved.
// This protects against accidental data loss (e.g., seed re-run, DB restore).
const BACKUP_DIR = path.join(__dirname, '../backups');
const BACKUP_FILE = path.join(BACKUP_DIR, 'site-settings-backup.json');

function autoBackupSettings(settingsObj) {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
    const backup = {
      backedUpAt: new Date().toISOString(),
      settings: settingsObj,
    };
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(backup, null, 2), 'utf-8');
  } catch (e) {
    // Non-fatal — just log
    console.warn('⚠️  Settings backup failed:', e.message);
  }
}

// GET /api/settings - public (user site fetches this)
router.get('/', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne().populate('featuredSection.featuredProductIds', 'name slug image basePrice variants isFeatured inStock purity');
    if (!settings) {
      // ── Auto-restore from backup if DB is empty ──────────
      if (fs.existsSync(BACKUP_FILE)) {
        console.log('⚠️  No SiteSettings in DB — restoring from backup...');
        const backup = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8'));
        const restored = backup.settings;
        delete restored._id;
        delete restored.__v;
        settings = await SiteSettings.create(restored);
        console.log('✅ SiteSettings restored from backup');
      } else {
        settings = await SiteSettings.create({});
        console.log('ℹ️  SiteSettings created with defaults (no backup found)');
      }
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/settings/backup - admin: view last backup info
router.get('/backup', auth, admin, async (req, res) => {
  try {
    if (!fs.existsSync(BACKUP_FILE)) {
      return res.json({ exists: false, message: 'No backup found yet' });
    }
    const backup = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8'));
    res.json({ exists: true, backedUpAt: backup.backedUpAt, siteName: backup.settings?.siteName });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/settings/restore - admin: restore from backup
router.post('/restore', auth, admin, async (req, res) => {
  try {
    if (!fs.existsSync(BACKUP_FILE)) {
      return res.status(404).json({ message: 'No backup file found' });
    }
    const backup = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8'));
    const restored = backup.settings;
    delete restored._id;
    delete restored.__v;

    let settings = await SiteSettings.findOne();
    if (settings) {
      Object.assign(settings, restored);
      await settings.save();
    } else {
      settings = await SiteSettings.create(restored);
    }
    req.app.get('io')?.emit('settings:updated', settings.toObject());
    res.json({ message: `Settings restored from backup (${backup.backedUpAt})`, settings });
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
    // Auto-backup after every save
    autoBackupSettings(settings.toObject());
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
      'shippingInfo', 'termsOfService', 'contactPage',
    ];


    if (!allowedSections.includes(section)) {
      return res.status(400).json({ message: 'Invalid section' });
    }

    // Primitive root-level fields (Number or String, not nested objects)
    const primitiveFields = ['freeShippingThreshold', 'shippingCost', 'siteName', 'siteTagline', 'logo'];

    if (primitiveFields.includes(section)) {
      // Accept either { value: X } wrapper or raw primitive
      const val = (req.body !== null && typeof req.body === 'object' && 'value' in req.body)
        ? req.body.value
        : req.body;
      settings[section] = val;
    } else {
      settings[section] = req.body;
    }

    await settings.save();

    // Broadcast updated settings to all connected WS clients
    req.app.get('io')?.emit('settings:updated', settings.toObject());
    // Auto-backup after every section save
    autoBackupSettings(settings.toObject());

    res.json({ message: `Section "${section}" updated`, [section]: settings[section] });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

