const mongoose = require('mongoose');

const featureItemSchema = new mongoose.Schema({
  icon: { type: String, default: '⚡' },
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, default: 0 },
});

const navLinkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  href: { type: String, required: true },
  highlightColor: { type: String }, // e.g. 'sky', 'violet'
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
});

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String },
  url: { type: String },
  icon: { type: String },
});

const footerColumnSchema = new mongoose.Schema({
  title: { type: String },
  links: [{ label: String, href: String }],
});

const siteSettingsSchema = new mongoose.Schema({
  // ── General ──────────────────────────────────────────────
  siteName: { type: String, default: 'Apex Pepco' },
  siteTagline: { type: String, default: 'Premium Research Compounds' },
  logo: { type: String },
  favicon: { type: String },

  // ── Announcement Bar ─────────────────────────────────────
  announcementBar: {
    isVisible: { type: Boolean, default: true },
    text: { type: String, default: 'Free Shipping On Orders $250+ | For Research Use Only' },
    bgColor: { type: String, default: '#c4222f' },
    textColor: { type: String, default: '#ffffff' },
  },

  // ── Age Gate ─────────────────────────────────────────────
  ageGate: {
    isEnabled: { type: Boolean, default: true },
    minAge: { type: Number, default: 21 },
    title: { type: String, default: 'Age Verification Required' },
    message: { type: String, default: 'You must be 21 years or older to enter this site. This site sells research compounds for laboratory use only.' },
    confirmText: { type: String, default: 'I am 21+ and understand these products are for research use only' },
    enterButtonText: { type: String, default: 'Enter Site' },
    exitButtonText: { type: String, default: 'Exit' },
  },

  // ── Navigation ───────────────────────────────────────────
  navLinks: { type: [navLinkSchema], default: [
    { label: 'Home', href: '/', order: 0, isVisible: true },
    { label: 'Shop', href: '/shop', order: 1, isVisible: true },
    { label: 'Portal', href: '/account', order: 2, isVisible: true },
    { label: 'COAs', href: '/coas', order: 3, isVisible: true },
    { label: 'Affiliate', href: '/affiliate', highlightColor: 'sky', order: 4, isVisible: true },
    { label: 'Business', href: '/wholesale', highlightColor: 'violet', order: 5, isVisible: true },
  ]},

  // ── Hero Section ─────────────────────────────────────────
  hero: {
    title: { type: String, default: 'Apex Pepco' },
    subtitle: { type: String, default: 'Where precision meets excellence. Laboratory-grade research compounds with 99%+ purity, trusted by researchers worldwide.' },
    backgroundImage: { type: String },
    primaryButtonText: { type: String, default: 'Shop Now' },
    primaryButtonHref: { type: String, default: '/shop' },
    secondaryButtonText: { type: String, default: 'Learn More' },
    secondaryButtonHref: { type: String, default: '#features' },
    badges: { type: [{ icon: String, text: String }], default: [
      { icon: '✓', text: '99%+ Purity' },
      { icon: '🚚', text: '$250+ Free Ship' },
      { icon: '📋', text: 'COA Included' },
    ]},
  },

  // ── Features Bar ─────────────────────────────────────────
  features: { type: [featureItemSchema], default: [
    { icon: '⚡', title: 'Fast Dispatch', description: 'Ships within 24 hrs', order: 0 },
    { icon: '📦', title: 'Discreet Packing', description: 'Plain packaging', order: 1 },
    { icon: '🔬', title: 'Lab Tested', description: 'Every batch', order: 2 },
    { icon: '✅', title: '99%+ Purity', description: 'Third-party verified', order: 3 },
    { icon: '🚚', title: 'Free Shipping', description: 'Orders over $250', order: 4 },
    { icon: '📋', title: 'COA Included', description: 'With every order', order: 5 },
  ]},

  // ── Featured Products Section ─────────────────────────────
  featuredSection: {
    isVisible: { type: Boolean, default: true },
    title: { type: String, default: 'Featured Compounds' },
    subtitle: { type: String, default: 'Our most popular research compounds' },
    featuredProductIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },

  // ── Promo Popup ──────────────────────────────────────────
  promoPopup: {
    isEnabled: { type: Boolean, default: true },
    title: { type: String, default: 'Exclusive Offer' },
    subtitle: { type: String, default: 'Free Peptide Vial' },
    description: { type: String, default: 'Create an account and verify your phone number to receive a complimentary peptide vial with your first order.' },
    ctaText: { type: String, default: 'Claim Free Vial' },
    ctaHref: { type: String, default: '/register' },
    delaySeconds: { type: Number, default: 3 },
  },

  // ── Pre-Footer CTA ────────────────────────────────────────
  preFooterCta: {
    isVisible: { type: Boolean, default: true },
    title: { type: String, default: 'Ready to begin your research?' },
    subtitle: { type: String, default: 'Browse our full catalog of premium research compounds.' },
    buttonText: { type: String, default: 'Explore the Collection' },
    buttonHref: { type: String, default: '/shop' },
  },

  // ── Footer ────────────────────────────────────────────────
  footer: {
    description: { type: String, default: 'Premium laboratory research compounds with uncompromising purity standards.' },
    disclaimer: { type: String, default: 'All products sold by Apex Pepco are intended for laboratory research purposes only. These products are not intended for human or veterinary use. By purchasing, you confirm that you are a qualified researcher.' },
    socialLinks: { type: [socialLinkSchema], default: [
      { platform: 'Instagram', url: '#', icon: 'instagram' },
    ]},
    columns: { type: [footerColumnSchema], default: [
      {
        title: 'Shop',
        links: [
          { label: 'All Products', href: '/shop' },
          { label: 'Peptides', href: '/shop?category=peptides' },
          { label: 'Accessories', href: '/shop?category=accessories' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Terms of Service', href: '/terms' },
          { label: 'Refund Policy', href: '/refund-policy' },
          { label: 'Shipping Info', href: '/shipping' },
        ],
      },
    ]},
    copyrightText: { type: String, default: '© 2026 Apex Pepco. All rights reserved.' },
  },

  // ── SEO / Meta ────────────────────────────────────────────
  seo: {
    defaultTitle: { type: String, default: 'Apex Pepco - Premium Research Compounds' },
    defaultDescription: { type: String, default: 'Laboratory-grade research compounds with 99%+ purity. Fast dispatch, discreet packaging, COA included.' },
    keywords: { type: String, default: 'research compounds, peptides, lab chemicals, high purity' },
  },

  // ── Theme / Colors ────────────────────────────────────────
  theme: {
    primaryBg: { type: String, default: '#0b0b0c' },
    primaryAccent: { type: String, default: '#c4222f' },
    secondaryAccent: { type: String, default: '#ef4444' },
    tertiaryAccent: { type: String, default: '#7a1119' },
    primaryText: { type: String, default: '#ededed' },
    mutedText: { type: String, default: '#8c8c8f' },
    fontFamily: { type: String, default: 'Inter' },
  },

  // ── Free Shipping Threshold ───────────────────────────────
  freeShippingThreshold: { type: Number, default: 250 },
  shippingCost: { type: Number, default: 15 },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
