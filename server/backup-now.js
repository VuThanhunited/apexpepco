#!/usr/bin/env node
// Run once to create initial backup of current SiteSettings
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const BACKUP_DIR = path.join(__dirname, 'backups');
const BACKUP_FILE = path.join(BACKUP_DIR, 'site-settings-backup.json');

async function createBackup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    const SiteSettings = require('./models/SiteSettings');
    const settings = await SiteSettings.findOne();
    if (!settings) {
      console.log('❌ No SiteSettings found in DB');
      process.exit(1);
    }
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
    const backup = {
      backedUpAt: new Date().toISOString(),
      settings: settings.toObject(),
    };
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(backup, null, 2), 'utf-8');
    console.log('✅ Backup created:', BACKUP_FILE);
    console.log('   siteName:', settings.siteName);
    console.log('   backedUpAt:', backup.backedUpAt);
  } catch (err) {
    console.error('❌ Backup failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createBackup();
