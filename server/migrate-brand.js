/**
 * Migration: Update brand name from "Apex Pepco" / "Apex PepCo" → "Apex Pep Co"
 * Run: node migrate-brand.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const SiteSettings = require('./models/SiteSettings');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://vtu21102000:Vuthanh1810%40@ac-hjrte0y-shard-00-01.7t35nab.mongodb.net:27017/apexpepco_db?ssl=true&authSource=admin';

async function migrate() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('✅ Connected to MongoDB');

  const settings = await SiteSettings.findOne();
  if (!settings) {
    console.log('No settings found, nothing to migrate.');
    return process.exit(0);
  }

  let changed = false;

  // Helper to replace brand name in a string
  const fix = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/Apex PepCo/g, 'Apex Pep Co')
      .replace(/Apex Pepco/g, 'Apex Pep Co')
      .replace(/APEX PEPCO/g, 'APEX PEP CO');
  };

  // siteName
  if (settings.siteName) { settings.siteName = fix(settings.siteName); changed = true; }

  // hero title
  if (settings.hero?.title) { settings.hero.title = fix(settings.hero.title); changed = true; }
  if (settings.hero?.subtitle) { settings.hero.subtitle = fix(settings.hero.subtitle); changed = true; }

  // footer
  if (settings.footer?.disclaimer) { settings.footer.disclaimer = fix(settings.footer.disclaimer); changed = true; }
  if (settings.footer?.copyrightText) { settings.footer.copyrightText = fix(settings.footer.copyrightText); changed = true; }
  if (settings.footer?.description) { settings.footer.description = fix(settings.footer.description); changed = true; }

  // seo
  if (settings.seo?.defaultTitle) { settings.seo.defaultTitle = fix(settings.seo.defaultTitle); changed = true; }
  if (settings.seo?.defaultDescription) { settings.seo.defaultDescription = fix(settings.seo.defaultDescription); changed = true; }

  // aboutPage
  if (settings.aboutPage?.eyebrow) { settings.aboutPage.eyebrow = fix(settings.aboutPage.eyebrow); changed = true; }
  if (settings.aboutPage?.standardsText2) { settings.aboutPage.standardsText2 = fix(settings.aboutPage.standardsText2); changed = true; }
  if (settings.aboutPage?.heroTitle) { settings.aboutPage.heroTitle = fix(settings.aboutPage.heroTitle); changed = true; }
  if (settings.aboutPage?.heroSubtitle) { settings.aboutPage.heroSubtitle = fix(settings.aboutPage.heroSubtitle); changed = true; }

  if (changed) {
    settings.markModified('hero');
    settings.markModified('footer');
    settings.markModified('seo');
    settings.markModified('aboutPage');
    await settings.save();
    console.log('✅ Brand name updated: "Apex Pepco" / "Apex PepCo" → "Apex Pep Co"');
  } else {
    console.log('ℹ️ No changes needed.');
  }

  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Migration error:', err);
  process.exit(1);
});
