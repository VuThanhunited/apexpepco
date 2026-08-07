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
    // Global
    primaryBg:        { type: String, default: '#0b0b0c' },
    primaryAccent:    { type: String, default: '#c4222f' },
    secondaryAccent:  { type: String, default: '#ef4444' },
    tertiaryAccent:   { type: String, default: '#7a1119' },
    primaryText:      { type: String, default: '#ededed' },
    mutedText:        { type: String, default: '#8c8c8f' },
    fontFamily:       { type: String, default: 'Inter' },
    // Navbar
    navbarBg:         { type: String, default: '#ffffff' },
    navbarText:       { type: String, default: '#0f172a' },
    navbarBorder:     { type: String, default: '#e5e7eb' },
    // Hero
    heroBg:           { type: String, default: '#0b0b0c' },
    heroText:         { type: String, default: '#ffffff' },
    heroSubText:      { type: String, default: '#d1d5db' },
    // Buttons
    btnPrimaryBg:     { type: String, default: '#c4222f' },
    btnPrimaryText:   { type: String, default: '#ffffff' },
    btnSecondaryBg:   { type: String, default: 'transparent' },
    btnSecondaryText: { type: String, default: '#ffffff' },
    btnSecondaryBorder: { type: String, default: '#ffffff' },
    // Sections
    sectionBg:        { type: String, default: '#ffffff' },
    sectionAltBg:     { type: String, default: '#f9fafb' },
    sectionText:      { type: String, default: '#111827' },
    cardBg:           { type: String, default: '#ffffff' },
    cardBorder:       { type: String, default: '#e5e7eb' },
    cardText:         { type: String, default: '#111827' },
    // Links
    linkColor:        { type: String, default: '#c4222f' },
    // Footer
    footerBg:         { type: String, default: '#0b0b0c' },
    footerText:       { type: String, default: '#9ca3af' },
    footerHeading:    { type: String, default: '#ffffff' },
    // Announcement bar
    announcementBg:   { type: String, default: '#c4222f' },
    announcementText: { type: String, default: '#ffffff' },
    // Age Gate modal
    ageGateBg:           { type: String, default: '#ffffff' },
    ageGateText:         { type: String, default: '#111827' },
    ageGateSubText:      { type: String, default: '#4b5563' },
    ageGateCheckbox:     { type: String, default: '#c4222f' },
    ageGateBtnBg:        { type: String, default: '#c4222f' },
    ageGateBtnText:      { type: String, default: '#ffffff' },
    ageGateLeaveBg:      { type: String, default: '#ffffff' },
    ageGateLeaveText:    { type: String, default: '#1f2937' },
    ageGateLeaveBorder:  { type: String, default: '#d1d5db' },
  },



  // ── Shop Page ──────────────────────────────────────────────
  shopPage: {
    title: { type: String, default: 'Research Compounds' },
    subtitle: { type: String, default: 'Laboratory-grade compounds with 99%+ purity' },
    emptyIcon: { type: String, default: '🔬' },
    emptyTitle: { type: String, default: 'No products found' },
    emptyText: { type: String, default: 'Try adjusting your filters or search terms.' },
    productsPerPage: { type: Number, default: 12 },
  },

  // ── About Page ─────────────────────────────────────────────
  aboutPage: {
    eyebrow: { type: String, default: 'ABOUT APEX PEP CO' },
    heroTitle: { type: String, default: 'Pioneering Research-Grade Compound Standards.' },
    heroSubtitle: { type: String, default: 'Dedicated to supplying certified, high-purity peptides and analytical research compounds to academic, clinical, and industrial laboratories nationwide.' },
    pillars: { type: [{
      icon: { type: String, default: '🔬' },
      title: { type: String },
      description: { type: String },
    }], default: [
      { icon: '🔬', title: '99%+ Certified Purity', description: 'Every compound undergoes rigorous High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry (MS) testing to guarantee verified purity.' },
      { icon: '📜', title: 'Batch Traceability', description: 'Every single lot is shipped with an independent, downloadable Certificate of Analysis (COA) containing precise batch purity verification.' },
      { icon: '⚡', title: 'Cold-Chain & Rapid Dispatch', description: 'Stored under strict temperature-controlled conditions and dispatched within 24 hours in discreet, protective packaging.' },
      { icon: '🛡️', title: 'Strict Compliance', description: 'Formulated exclusively for qualified laboratory researchers, ensuring uncompromised consistency across all experimental protocols.' },
    ]},
    standardsTag: { type: String, default: 'ANALYTICAL RIGOR' },
    standardsTitle: { type: String, default: 'Unmatched Consistency in Every Batch.' },
    standardsText1: { type: String, default: 'In scientific research, consistency is paramount. Slight variations in peptide purity can alter experimental outcomes and compromise publication integrity.' },
    standardsText2: { type: String, default: 'At Apex PepCo, we address this challenge directly by enforcing stringent quality control protocols at every stage of synthesis, purification, and packaging.' },
    standardsList: { type: [String], default: [
      '✓ Full 3rd-Party HPLC & Mass Spec Testing on all batches',
      '✓ Lyophilized in sterile ISO 6 laboratory environments',
      '✓ Sealed under inert nitrogen atmosphere to preserve stability',
      '✓ Fully documented lot tracking from synthesis to delivery',
    ]},
    stats: { type: [{
      value: { type: String },
      label: { type: String },
    }], default: [
      { value: '99.4%', label: 'Average HPLC Purity Rating' },
      { value: '100%', label: 'Independent COA Batch Verification' },
      { value: '<24hr', label: 'Order Processing & Dispatch Time' },
    ]},
    missionTitle: { type: String, default: 'Our Mission' },
    missionText: { type: String, default: '"To empower scientific discovery by providing researchers with uncompromised, batch-verified research compounds and transparent analytical documentation."' },
    ctaTitle: { type: String, default: 'Ready to Expand Your Research?' },
    ctaSubtitle: { type: String, default: 'Explore our catalog of certified 99%+ pure research peptides and compounds.' },
    ctaPrimaryText: { type: String, default: 'BROWSE CATALOG' },
    ctaPrimaryHref: { type: String, default: '/shop' },
    ctaSecondaryText: { type: String, default: 'VIEW COA LIBRARY' },
    ctaSecondaryHref: { type: String, default: '/coas' },
  },

  // ── Product Detail Page ────────────────────────────────────
  productDetailPage: {
    relatedTitle: { type: String, default: 'Related Compounds' },
    relatedSubtitle: { type: String, default: 'You may also be interested in' },
    addToCartText: { type: String, default: 'Add to Cart' },
    outOfStockText: { type: String, default: 'Out of Stock' },
  },

  // ── Cart Page ──────────────────────────────────────────────
  cartPage: {
    title: { type: String, default: 'Your Cart' },
    emptyTitle: { type: String, default: 'Your cart is empty' },
    emptyText: { type: String, default: 'Looks like you haven\'t added any research compounds yet.' },
    emptyButtonText: { type: String, default: 'Continue Shopping' },
    checkoutButtonText: { type: String, default: 'Proceed to Checkout' },
  },

  // ── Checkout Page ──────────────────────────────────────────
  checkoutPage: {
    title: { type: String, default: 'Checkout' },
    successTitle: { type: String, default: 'Order Confirmed!' },
    successText: { type: String, default: 'Thank you for your order. You will receive a confirmation email shortly.' },
  },

  // ── Free Shipping Threshold ───────────────────────────────
  freeShippingThreshold: { type: Number, default: 250 },
  shippingCost: { type: Number, default: 15 },

  // ── Shipping Info Page ────────────────────────────────────
  shippingInfo: {
    processingTime: { type: String, default: 'Orders ship within 24 hours of payment confirmation.' },
    freeShippingNote: { type: String, default: 'Free shipping on orders over $250.' },
    packagingNote: { type: String, default: 'Shipped in plain, unmarked packages.' },
    refundTitle: { type: String, default: 'Refund Policy' },
    refundBody: { type: String, default: 'Due to the nature of research chemicals, unopened vials can be returned within 14 days of receipt for store credit or replacement.' },
  },

  // ── Terms of Service ──────────────────────────────────────
  termsOfService: {
    body: { type: String, default: 'All products sold are intended strictly for laboratory research use by qualified personnel. Not for human or veterinary administration.' },
  },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
