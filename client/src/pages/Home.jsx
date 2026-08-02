import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../contexts/SiteContext';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import './Home.css';

const Home = () => {
  const { settings, loading: siteLoading } = useSite();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const marqueeRef = useRef(null);

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

  const renderMarqueeIcon = (type) => {
    switch (type) {
      case 'file-check':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-icon text-sky-400">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
            <path d="m9 15 2 2 4-4"></path>
          </svg>
        );
      case 'truck':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-icon text-sky-400">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
            <path d="M15 18H9"></path>
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
            <circle cx="17" cy="18" r="2"></circle>
            <circle cx="7" cy="18" r="2"></circle>
          </svg>
        );
      case 'flask':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-icon text-sky-400">
            <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"></path>
            <path d="M6.453 15h11.094"></path>
            <path d="M8.5 2h7"></path>
          </svg>
        );
    }
  };

  const features = [
    { iconType: 'file-check', title: 'COA Included', description: 'With every order' },
    { iconType: 'flask', title: 'Fast Dispatch', description: 'Ships within 24 hrs' },
    { iconType: 'truck', title: 'Discreet Packing', description: 'Plain packaging' },
    { iconType: 'file-check', title: 'Lab Tested', description: 'Every batch' },
    { iconType: 'flask', title: '99%+ Purity', description: 'Third-party verified' },
    { iconType: 'truck', title: 'Free Shipping', description: 'Orders over $250' }
  ];

  return (
    <div className="home">
      {/* ── HERO ───────────────────────────────────────── */}
      <section className="hero" id="hero-section">
        {/* Animated DNA Background Image */}
        <div className="hero-dna-bg">
          <img src="https://astroresearch.health/bg.webp" alt="DNA Animation Background" className="dna-bg-img" />
          <div className="dna-gradient-overlay"></div>
        </div>

        <div className="hero-container-left">
          <div className="hero-content-left">
            <span className="hero-eyebrow-red">RESEARCH USE ONLY</span>

            <h1 className="hero-title-apex">
              Research-grade peptides, documented to the batch.
            </h1>

            <p className="hero-subtitle-left">
              High-purity compounds supplied to qualified laboratories, with independent COA verification on every lot. Built for researchers who need consistency they can cite.
            </p>

            <div className="hero-buttons-row">
              <Link to="/shop" className="btn-browse-catalog-red" id="hero-shop-now-btn">
                <span>BROWSE CATALOG</span>
              </Link>
              <Link to="/coas" className="btn-view-coa-outline" id="hero-coa-btn">
                VIEW COA LIBRARY
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES MARQUEE ───────────────────────────── */}
      <section className="features-marquee-section" id="features">
        <div className="marquee-track" ref={marqueeRef}>
          <div className="marquee-inner">
            {[...features, ...features, ...features].map((f, i) => (
              <div key={i} className="marquee-item">
                <span className="marquee-icon cyan-icon">{renderMarqueeIcon(f.iconType)}</span>
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
      <section className="featured-section" id="featured-products">
        <div className="section-container">
          <div className="featured-header-row">
            <div className="featured-header-left">
              <h2 className="featured-main-title">Featured Compounds</h2>
              <p className="featured-main-subtitle">Curated items of exceptional purity.</p>
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

      {/* ── WHY CHOOSE US ──────────────────────────────── */}
      <section className="why-section">
        <div className="section-container">
          <div className="why-grid">
            <div className="why-content">
              <div className="section-tag">WHY APEX PEP CO</div>
              <h2>PRECISION. PURITY. PERFORMANCE.</h2>
              <p>Every compound we offer undergoes rigorous third-party testing to ensure 99%+ purity. Our research-grade compounds are trusted by laboratories worldwide.</p>
              <div className="why-stats">
                <div className="stat"><span className="stat-num">99%+</span><span className="stat-label">Purity Guaranteed</span></div>
                <div className="stat"><span className="stat-num">24hr</span><span className="stat-label">Express Dispatch</span></div>
                <div className="stat"><span className="stat-num">100%</span><span className="stat-label">COA Included</span></div>
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
      <section className="prefooter-cta">
        <div className="cta-glow"></div>
        <div className="section-container cta-content">
          <h2>READY TO BEGIN YOUR RESEARCH?</h2>
          <p>Browse our full catalog of premium research compounds, all shipped with certificates of analysis.</p>
          <Link to="/shop" className="btn-primary" id="cta-btn">
            EXPLORE THE COLLECTION
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
