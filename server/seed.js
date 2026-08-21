/**
 * seed.js — Apexpepco Database Seeder
 *
 * SAFETY RULES (enforced):
 *  1. NEVER uses deleteMany / drop / remove on any collection
 *  2. Only creates records that don't exist yet (upsert-safe)
 *  3. SiteSettings: only created once — never overwritten
 *  4. Products: imageUrl/image from admin uploads always preserved
 *  5. Running this multiple times is 100% idempotent
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const SiteSettings = require('./models/SiteSettings');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
    console.log('✅ Connected to MongoDB:', mongoose.connection.host);
    console.log('─────────────────────────────────');
    console.log('⚠️  SAFE MODE: No data will be deleted');
    console.log('─────────────────────────────────\n');

    // ── Admin user — create only if missing ───────────────
    const existingAdmin = await User.findOne({ email: 'admin@apexpepco.com' });
    if (!existingAdmin) {
      await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@apexpepco.com',
        password: 'Admin@123456',
        role: 'admin',
      });
      console.log('✅ Admin user created: admin@apexpepco.com / Admin@123456');
    } else {
      console.log('ℹ️  Admin already exists — skipped');
    }

    // ── Categories — create only if missing ───────────────
    const categoryData = [
      { name: 'Peptides', slug: 'peptides', description: 'Research-grade peptide compounds' },
      { name: 'Growth Factors', slug: 'growth-factors', description: 'Growth hormone releasing compounds' },
      { name: 'Accessories', slug: 'accessories', description: 'Lab accessories and supplies' },
      { name: 'Bundles', slug: 'bundles', description: 'Value bundles and kits' },
    ];
    let categories = {};
    for (const cat of categoryData) {
      let c = await Category.findOne({ slug: cat.slug });
      if (!c) {
        c = await Category.create(cat);
        console.log(`✅ Category created: ${cat.name}`);
      } else {
        console.log(`ℹ️  Category exists: ${cat.name}`);
      }
      categories[cat.slug] = c._id;
    }

    // ── Products — SAFE upsert: NEVER overwrite admin-set data ──
    // Rules:
    //  - If product doesn't exist → create with seed data
    //  - If product exists AND has admin-uploaded image → keep existing image
    //  - If product exists AND uses astroresearch image → keep (don't force-change)
    //  - Never change: imageUrl, image, images, variants with custom stock/price
    const productData = [
      {
        name: 'Tirzepatide',
        slug: 'tirzepatide',
        shortDescription: 'Dual GIP and GLP-1 receptor agonist compound.',
        description: '<p>Tirzepatide is a synthetic dual GIP and GLP-1 receptor agonist studied for its effects on glucose metabolism and metabolic regulation. Each vial contains 10mg lyophilized powder, 99%+ purity. For research use only.</p>',
        imageUrl: 'https://astroresearch.health/images/tirzepatide.png?v=20260610',
        category: categories['peptides'],
        basePrice: 59.00,
        purity: '99%+',
        isFeatured: true,
        inStock: true,
        tags: ['tirzepatide', 'glp1', 'gip', 'peptide'],
        variants: [
          { name: '10mg', price: 59.00, stock: 100 },
          { name: '60mg', price: 175.00, stock: 50 },
        ],
      },
      {
        name: 'GHK-Cu',
        slug: 'ghk-cu',
        shortDescription: 'Copper peptide complex for tissue & dermal research.',
        description: '<p>GHK-Cu (copper peptide) is a naturally occurring tripeptide found in human plasma. Extensively studied for its role in wound healing, tissue remodeling, and anti-inflammatory effects. 50mg lyophilized powder, 99%+ purity.</p>',
        imageUrl: 'https://astroresearch.health/images/ghk-cu.png?v=20260610',
        category: categories['peptides'],
        basePrice: 42.00,
        purity: '99%+',
        isFeatured: true,
        inStock: true,
        tags: ['ghk-cu', 'copper-peptide', 'dermal'],
        variants: [
          { name: '50mg', price: 42.00, stock: 80 },
          { name: '100mg', price: 58.00, stock: 40 },
        ],
      },
      {
        name: 'Semaglutide 10mg',
        slug: 'semaglutide-10mg',
        shortDescription: 'GLP-1 receptor agonist for metabolic research.',
        description: '<p>Semaglutide is a synthetic GLP-1 receptor agonist widely studied in metabolic and glucose-regulation research. Each vial contains 10mg lyophilized powder, 99%+ purity. For research use only.</p>',
        imageUrl: 'https://astroresearch.health/images/semaglutide.png?v=20260610',
        category: categories['peptides'],
        basePrice: 59.00,
        purity: '99%+',
        isFeatured: true,
        inStock: true,
        tags: ['semaglutide', 'glp1', 'metabolic'],
        variants: [
          { name: '10mg', price: 59.00, stock: 90 },
        ],
      },
      {
        name: 'MT-2 10mg',
        slug: 'mt-2-10mg',
        shortDescription: 'Melanotan II synthetic peptide analog.',
        description: '<p>Melanotan II (MT-2) is a synthetic analogue of alpha-melanocyte-stimulating hormone (alpha-MSH). Studied for its effects on melanogenesis and sexual function research. Each vial contains 10mg lyophilized powder, 99%+ purity.</p>',
        imageUrl: 'https://astroresearch.health/images/mt-2.png?v=20260610',
        category: categories['peptides'],
        basePrice: 42.00,
        purity: '99%+',
        isFeatured: true,
        inStock: true,
        tags: ['mt2', 'melanotan', 'peptide'],
        variants: [
          { name: '10mg', price: 42.00, stock: 60 },
        ],
      },
      {
        name: 'Wolverine',
        slug: 'wolverine',
        shortDescription: 'BPC-157 & TB-500 synergy blend.',
        description: '<p>Wolverine is a research blend formulated for studies on tissue repair and recovery pathways. Available in 10mg and 20mg lyophilized powder, 99%+ purity. For research use only.</p>',
        imageUrl: 'https://astroresearch.health/images/wolverine.png?v=20260610',
        category: categories['bundles'],
        basePrice: 59.00,
        purity: '99%+',
        isFeatured: true,
        inStock: true,
        tags: ['wolverine', 'bpc157', 'tb500', 'blend'],
        variants: [
          { name: '10mg', price: 59.00, stock: 50 },
          { name: '20mg', price: 119.00, stock: 30 },
        ],
      },
      {
        name: 'GLOW 50mg',
        slug: 'glow-50mg',
        shortDescription: 'GHK-Cu, BPC-157, TB-500 multi-peptide formula.',
        description: '<p>GLOW is a research blend containing 35mg GHK-Cu, 10mg TB-500, and 5mg BPC-157 in a single 50mg vial. Formulated for studies on tissue repair, regeneration, and cosmetic research pathways. 99%+ purity, lyophilized powder.</p>',
        imageUrl: 'https://astroresearch.health/images/glow.png?v=20260610',
        category: categories['bundles'],
        basePrice: 84.00,
        purity: '99%+',
        isFeatured: true,
        inStock: true,
        tags: ['glow', 'ghk-cu', 'blend'],
        variants: [
          { name: '50mg Blend', price: 84.00, stock: 40 },
        ],
      },
      {
        name: 'BPC-157',
        slug: 'bpc-157',
        shortDescription: 'Body Protection Compound – 15 amino acid sequence.',
        description: '<p>Body Protection Compound-157 is a synthetic peptide consisting of 15 amino acids. Widely researched for its protective effects on gastrointestinal tissue, tendon and ligament healing, and angiogenesis. 5mg lyophilized powder, 99%+ purity.</p>',
        imageUrl: 'https://astroresearch.health/images/bpc-157.png?v=20260610',
        category: categories['peptides'],
        basePrice: 35.00,
        purity: '99%+',
        isFeatured: true,
        inStock: true,
        tags: ['bpc157', 'peptide', 'healing'],
        variants: [
          { name: '5mg', price: 35.00, stock: 120 },
        ],
      },
      {
        name: 'Tesamorelin 10mg',
        slug: 'tesamorelin-10mg',
        shortDescription: 'GHRH analog for growth hormone secretion research.',
        description: '<p>Tesamorelin is a synthetic form of growth hormone-releasing hormone (GHRH) studied for its effects on growth hormone secretion and lipid metabolism. Each vial contains 10mg lyophilized powder, 99%+ purity. For research use only.</p>',
        imageUrl: 'https://astroresearch.health/images/tesamorelin.png?v=20260610',
        category: categories['growth-factors'],
        basePrice: 95.00,
        purity: '99%+',
        isFeatured: true,
        inStock: true,
        tags: ['tesamorelin', 'ghrh', 'growth'],
        variants: [
          { name: '10mg', price: 95.00, stock: 30 },
        ],
      },
    ];

    console.log('\n📦 Processing products...');
    for (const prod of productData) {
      const existing = await Product.findOne({ slug: prod.slug });
      if (!existing) {
        // New product — create with seed data
        await Product.create(prod);
        console.log(`✅ Product created: ${prod.name}`);
      } else {
        // Existing product — ONLY update non-media fields (name, description, category, tags)
        // PRESERVE: imageUrl, image, images, variants (admin may have edited prices/stock)
        const safeUpdate = {
          name: prod.name,
          shortDescription: prod.shortDescription,
          description: prod.description,
          category: prod.category,
          purity: prod.purity,
          tags: prod.tags,
          // Only set imageUrl if product has no image at all
          ...(!existing.imageUrl && !existing.image ? { imageUrl: prod.imageUrl } : {}),
          // Only set variants if product has no variants at all
          ...((!existing.variants || existing.variants.length === 0) ? { variants: prod.variants, basePrice: prod.basePrice } : {}),
        };
        await Product.findOneAndUpdate({ slug: prod.slug }, { $set: safeUpdate }, { returnDocument: 'after' });
        console.log(`ℹ️  Product updated (safe): ${prod.name}`);
      }
    }

    // ── Site Settings — NEVER overwrite existing ──────────
    console.log('\n⚙️  Checking SiteSettings...');
    const existingSettings = await SiteSettings.findOne();
    if (!existingSettings) {
      await SiteSettings.create({
        announcementBar: {
          isVisible: true,
          text: 'Free Shipping On Orders $250+ | For Research Use Only',
          bgColor: '#c4222f',
          textColor: '#ffffff',
        },
        theme: {
          primaryBg: '#0b0b0c',
          primaryAccent: '#c4222f',
          secondaryAccent: '#ef4444',
          tertiaryAccent: '#7a1119',
          primaryText: '#ededed',
          mutedText: '#8c8c8f',
          fontFamily: 'Inter',
        }
      });
      console.log('✅ SiteSettings created (first time)');
    } else {
      console.log('ℹ️  SiteSettings exists — NOT touched (all admin customizations preserved)');
    }

    console.log('\n🎉 Seed complete! All existing data preserved.');
    console.log('─────────────────────────────────');
    console.log('Admin Login:');
    console.log('  Email:    admin@apexpepco.com');
    console.log('  Password: Admin@123456');
    console.log('─────────────────────────────────');

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
