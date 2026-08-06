import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../contexts/SiteContext';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import './Home.css';

const Home = () => {
  const { settings, loading: siteLoading } = useSite();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products?featured=true&limit=8');
        let prods = data.products || (Array.isArray(data) ? data : []);
        if (prods.length === 0) {
          const fallbackRes = await api.get('/products?limit=8');
          prods = fallbackRes.data.products || (Array.isArray(fallbackRes.data) ? fallbackRes.data : []);
        }
        setFeaturedProducts(prods);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchFeatured();
  }, []);

  if (siteLoading) return (
    <div className="page-loader">
      <div className="loader-ring"></div>
    </div>
  );

  // ── Settings shortcuts with fallbacks ───────────────────
  const hero = settings?.hero || {};
  const featuredSection = settings?.featuredSection || {};
  const preFooterCta = settings?.preFooterCta || {};
  const stats = settings?.aboutPage?.stats || [
    { value: '99%+', label: 'Purity Guaranteed' },
    { value: '24hr', label: 'Express Dispatch' },
    { value: '100%', label: 'COA Included' },
  ];

  // Features marquee: prefer DB settings.features, fallback to defaults
  const marqueeFeatures = (settings?.features && settings.features.length > 0)
    ? settings.features
    : [
        {
          title: 'Lab Tested',
          description: 'Every batch',
          svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6M9 3v6l-4 9a1 1 0 0 0 .9 1.4h12.2A1 1 0 0 0 19 18l-4-9V3"/><line x1="6.5" y1="14" x2="17.5" y2="14"/></svg>
        },
        {
          title: '99%+ Purity',
          description: 'Third-party verified',
          svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
        },
        {
          title: 'Free Shipping',
          description: 'Orders over $250',
          svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
        },
        {
          title: 'COA Included',
          description: 'With every order',
          svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>
        },
        {
          title: 'Fast Dispatch',
          description: 'Ships within 24 hrs',
          svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        },
        {
          title: 'Discreet Packing',
          description: 'Plain packaging',
          svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
        },
      ];

  return (
    <div className="home">
      {/* ── HERO ───────────────────────────────────────── */}
      <section className="hero" id="hero-section">
        <div className="hero-dna-bg">
          {hero.backgroundImage ? (
            <img src={hero.backgroundImage} alt="Hero Background" className="dna-bg-img" />
          ) : (
            <img src="https://astroresearch.health/bg.webp" alt="DNA Animation Background" className="dna-bg-img" />
          )}
          <div className="dna-gradient-overlay"></div>
        </div>

        <div className="hero-container-left">
          <div className="hero-content-left">
            <span className="hero-eyebrow-red">RESEARCH USE ONLY</span>

            <h1 className="hero-title-apex">
              {hero.title || 'Research-grade peptides, documented to the batch.'}
            </h1>

            <p className="hero-subtitle-left">
              {hero.subtitle || 'High-purity compounds supplied to qualified laboratories, with independent COA verification on every lot. Built for researchers who need consistency they can cite.'}
            </p>

            <div className="hero-buttons-row">
              <Link
                to={hero.primaryButtonHref || '/shop'}
                className="btn-browse-catalog-red"
                id="hero-shop-now-btn"
              >
                <span>{hero.primaryButtonText || 'BROWSE CATALOG'}</span>
              </Link>
              <Link
                to={hero.secondaryButtonHref || '/coas'}
                className="btn-view-coa-outline"
                id="hero-coa-btn"
              >
                {hero.secondaryButtonText || 'VIEW COA LIBRARY'}
              </Link>
            </div>

            {/* Badges row */}
            {hero.badges && hero.badges.length > 0 && (
              <div className="hero-badges-boxes">
                {hero.badges.map((b, i) => (
                  <div key={i} className="badge-box">
                    <div className="badge-box-val">{b.icon}</div>
                    <div className="badge-box-sub">{b.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FEATURES MARQUEE ───────────────────────────── */}
      <section className="features-marquee-section" id="features">
        <div className="marquee-track">
          <div className="marquee-inner">
            {[...marqueeFeatures, ...marqueeFeatures, ...marqueeFeatures].map((f, i) => (
              <div key={i} className="marquee-item">
                <span className="marquee-icon red-icon">
                  {f.svg || f.icon}
                </span>
                <div className="marquee-text">
                  <strong className="marquee-title-text">{f.title}</strong>
                  {f.description && <span className="marquee-sub-text">{f.description}</span>}
                </div>
                <span className="marquee-divider">·</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ───────────────────────────── */}
      {featuredSection.isVisible !== false && (
        <section className="featured-section" id="featured-products">
          <div className="section-container">
            <div className="featured-header-row">
              <div className="featured-header-left">
                <h2 className="featured-main-title">
                  {featuredSection.title || 'Featured Compounds'}
                </h2>
                <p className="featured-main-subtitle">
                  {featuredSection.subtitle || 'Curated items of exceptional purity.'}
                </p>
              </div>
              <Link to="/shop" className="view-all-cyan-link" id="view-all-products-btn">
                View All →
              </Link>
            </div>

            {featuredProducts.length > 0 ? (
              <div className="products-grid">
                {featuredProducts.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            ) : (
              <div className="empty-products">
                <p>Products coming soon. <Link to="/shop">Browse all products →</Link></p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── WHY CHOOSE US ──────────────────────────────── */}
      <section className="why-section">
        <div className="section-container">
          <div className="why-grid">
            <div className="why-content">
              <div className="section-tag">WHY APEX PEP CO</div>
              <h2>PRECISION. PURITY. PERFORMANCE.</h2>
              <p>Every compound we offer undergoes rigorous third-party testing to ensure 99%+ purity. Our research-grade compounds are trusted by laboratories worldwide.</p>
              <div className="why-stats">
                {stats.map((s, i) => (
                  <div key={i} className="stat">
                    <span className="stat-num">{s.value}</span>
                    <span className="stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
              <Link to="/shop" className="btn-primary" id="why-shop-btn">Explore Products</Link>
            </div>
            <div className="why-visual">
              <div className="why-card">
                <div className="why-card-icon">🔬</div>
                <h3>Third-Party Tested</h3>
                <p>Every batch is independently verified by accredited laboratories.</p>
              </div>
              <div className="why-card why-card-offset">
                <div className="why-card-icon">📦</div>
                <h3>Discreet Packaging</h3>
                <p>Plain, unmarked packaging for complete privacy.</p>
              </div>
              <div className="why-card">
                <div className="why-card-icon">⚡</div>
                <h3>Fast Dispatch</h3>
                <p>Orders ship within 24 hours of confirmation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRE-FOOTER CTA ──────────────────────────────── */}
      {preFooterCta.isVisible !== false && (
        <section className="prefooter-cta">
          <div className="cta-glow"></div>
          <div className="section-container cta-content">
            <h2>{preFooterCta.title ? preFooterCta.title.toUpperCase() : 'READY TO BEGIN YOUR RESEARCH?'}</h2>
            <p>{preFooterCta.subtitle || 'Browse our full catalog of premium research compounds, all shipped with certificates of analysis.'}</p>
            <Link
              to={preFooterCta.buttonHref || '/shop'}
              className="btn-primary"
              id="cta-btn"
            >
              {preFooterCta.buttonText || 'EXPLORE THE COLLECTION'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
