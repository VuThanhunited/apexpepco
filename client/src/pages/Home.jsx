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
        setFeaturedProducts(data.products || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeatured();
  }, []);

  if (siteLoading) return (
    <div className="page-loader">
      <div className="loader-ring"></div>
    </div>
  );

  const features = settings?.features || [
    { icon: '🔬', title: 'Lab Tested', description: 'Every batch' },
    { icon: '✅', title: '99%+ Purity', description: 'Third-party verified' },
    { icon: '🚚', title: 'Free Shipping', description: 'Orders over $250' },
    { icon: '📋', title: 'COA Included', description: 'With every order' },
    { icon: '⚡', title: 'Fast Dispatch', description: 'Ships within 24 hrs' },
    { icon: '📦', title: 'Discreet Packing', description: 'Plain packaging' }
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
            <h1 className="hero-title-split">
              <span className="hero-title-solid">ASTRO</span>
              <span className="hero-title-hollow">RESEARCH</span>
            </h1>

            <p className="hero-subtitle-left">
              Where precision meets excellence. Laboratory-grade research compounds with 99%+ purity, trusted by researchers worldwide.
            </p>

            <div className="hero-buttons-row">
              <Link to="/shop" className="btn-shop-pill" id="hero-shop-now-btn">
                <span>SHOP NOW</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <a href="#featured-products" className="btn-learn-text" id="hero-learn-more-btn">
                LEARN MORE
              </a>
            </div>

            <div className="hero-badges-boxes">
              <div className="badge-box">
                <div className="badge-box-val">99%+</div>
                <div className="badge-box-sub">PURITY</div>
              </div>
              <div className="badge-box">
                <div className="badge-box-val">$250+</div>
                <div className="badge-box-sub">FREE SHIP</div>
              </div>
              <div className="badge-box">
                <div className="badge-box-val">COA</div>
                <div className="badge-box-sub">INCLUDED</div>
              </div>
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
                <span className="marquee-icon">{f.icon}</span>
                <div className="marquee-text">
                  <strong>{f.title}</strong>
                  {f.description && <span>{f.description}</span>}
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
          <div className="section-header">
            <div className="section-tag">TOP SELLERS</div>
            <h2>FEATURED COMPOUNDS</h2>
            <p>Our most popular research compounds</p>
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
          <div className="section-footer">
            <Link to="/shop" className="btn-view-all" id="view-all-products-btn">
              View All Products
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ──────────────────────────────── */}
      <section className="why-section">
        <div className="section-container">
          <div className="why-grid">
            <div className="why-content">
              <div className="section-tag">WHY ASTRO RESEARCH</div>
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
