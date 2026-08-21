const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "5mg", "10mg"
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  sku: { type: String },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  shortDescription: { type: String },
  description: { type: String },
  researchInfo: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  imageUrl: { type: String }, // primary image URL (used by seed & admin)
  image: { type: String },   // legacy / uploaded image filename
  images: [{ type: String }],
  variants: [variantSchema],
  basePrice: { type: Number, default: 0 }, // fallback if no variants
  purity: { type: String, default: '99%+' },
  coaFile: { type: String }, // path to COA PDF
  isFeatured: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  tags: [{ type: String }],
  metaTitle: { type: String },
  metaDescription: { type: String },
  isActive: { type: Boolean, default: true }, // used to soft-delete products
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
