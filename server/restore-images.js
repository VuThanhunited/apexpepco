/**
 * restore-images.js — Khôi phục ảnh gốc cho tất cả sản phẩm
 * Chạy: node restore-images.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const Product = require('./models/Product');

const imageMap = {
  'tirzepatide':     'https://astroresearch.health/images/tirzepatide.png?v=20260610',
  'ghk-cu':          'https://astroresearch.health/images/ghk-cu.png?v=20260610',
  'semaglutide-10mg':'https://astroresearch.health/images/semaglutide.png?v=20260610',
  'mt-2-10mg':       'https://astroresearch.health/images/mt-2.png?v=20260610',
  'wolverine':       'https://astroresearch.health/images/wolverine.png?v=20260610',
  'glow-50mg':       'https://astroresearch.health/images/glow.png?v=20260610',
  'bpc-157':         'https://astroresearch.health/images/bpc-157.png?v=20260610',
  'tesamorelin-10mg':'https://astroresearch.health/images/tesamorelin.png?v=20260610',
};

async function restore() {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  console.log('✅ Connected to MongoDB');

  for (const [slug, imageUrl] of Object.entries(imageMap)) {
    const result = await Product.findOneAndUpdate(
      { slug },
      { $set: { image: imageUrl, imageUrl } },
      { new: true }
    );
    if (result) {
      console.log(`✅ Restored: ${result.name} → ${imageUrl}`);
    } else {
      console.log(`⚠️  Not found: ${slug}`);
    }
  }

  console.log('\n🎉 Done! All images restored.');
  await mongoose.disconnect();
  process.exit(0);
}

restore().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
