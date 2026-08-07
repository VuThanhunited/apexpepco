import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        {/* Hero Section */}
        <section className="about-hero">
          <span className="about-eyebrow">ABOUT APEX PEP CO</span>
          <h1 className="about-title">Pioneering Research-Grade Compound Standards.</h1>
          <p className="about-subtitle">
            Dedicated to supplying certified, high-purity peptides and analytical research compounds to academic, clinical, and industrial laboratories nationwide.
          </p>
        </section>

        {/* Pillars Grid */}
        <section className="about-pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon">🔬</div>
            <h3>99%+ Certified Purity</h3>
            <p>Every compound undergoes rigorous High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry (MS) testing to guarantee verified purity.</p>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon">📜</div>
            <h3>Batch Traceability</h3>
            <p>Every single lot is shipped with an independent, downloadable Certificate of Analysis (COA) containing precise batch purity verification.</p>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon">⚡</div>
            <h3>Cold-Chain & Rapid Dispatch</h3>
            <p>Stored under strict temperature-controlled conditions and dispatched within 24 hours in discreet, protective packaging.</p>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon">🛡️</div>
            <h3>Strict Compliance</h3>
            <p>Formulated exclusively for qualified laboratory researchers, ensuring uncompromised consistency across all experimental protocols.</p>
          </div>
        </section>

        {/* Analytical Standards Story */}
        <section className="about-standards-section">
          <div className="standards-grid">
            <div className="standards-text">
              <span className="section-tag-red">ANALYTICAL RIGOR</span>
              <h2>Unmatched Consistency in Every Batch.</h2>
              <p>
                In scientific research, consistency is paramount. Slight variations in peptide purity can alter experimental outcomes and compromise publication integrity.
              </p>
              <p>
                At <strong>Apex Pep Co</strong>, we address this challenge directly by enforcing stringent quality control protocols at every stage of synthesis, purification, and packaging.
              </p>

              <ul className="standards-list">
                <li>✓ Full 3rd-Party HPLC & Mass Spec Testing on all batches</li>
                <li>✓ Lyophilized in sterile ISO 6 laboratory environments</li>
                <li>✓ Sealed under inert nitrogen atmosphere to preserve stability</li>
                <li>✓ Fully documented lot tracking from synthesis to delivery</li>
              </ul>
            </div>

            <div className="standards-stats-card">
              <div className="stat-block">
                <span className="stat-value">99.4%</span>
                <span className="stat-lbl">Average HPLC Purity Rating</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-block">
                <span className="stat-value">100%</span>
                <span className="stat-lbl">Independent COA Batch Verification</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-block">
                <span className="stat-value">&lt;24hr</span>
                <span className="stat-lbl">Order Processing & Dispatch Time</span>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Card */}
        <section className="about-mission-card">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              "To empower scientific discovery by providing researchers with uncompromised, batch-verified research compounds and transparent analytical documentation."
            </p>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="about-cta">
          <h2>Ready to Expand Your Research?</h2>
          <p>Explore our catalog of certified 99%+ pure research peptides and compounds.</p>
          <div className="about-cta-buttons">
            <Link to="/shop" className="btn-about-primary">
              BROWSE CATALOG
            </Link>
            <Link to="/coas" className="btn-about-outline">
              VIEW COA LIBRARY
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
