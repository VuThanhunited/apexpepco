import { Link } from 'react-router-dom';
import { useSite } from '../contexts/SiteContext';
import './Footer.css';

const Footer = () => {
  const { settings } = useSite();
  const footer = settings?.footer;
  const siteName = settings?.siteName || 'Apex Pepco';

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              {settings?.logo
                ? <img src={settings.logo} alt={siteName} />
                : <span className="footer-logo-text">{siteName}</span>
              }
            </div>
            <p className="footer-desc">
              {footer?.description || 'Premium laboratory equipment and specialty chemicals. Precise, authoritative, exclusive.'}
            </p>
            <div className="footer-social">
              <a href="https://www.instagram.com/astroxresearch" target="_blank" rel="noreferrer" className="social-link" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <span>@astroxresearch</span>
              </a>
            </div>
          </div>

          <div className="footer-columns">
            <div className="footer-col">
              <h4>Shop</h4>
              <ul>
                <li><Link to="/shop">All Products</Link></li>
                <li><Link to="/shop?category=peptides">Peptides</Link></li>
                <li><Link to="/shop?category=accessories">Accessories</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><Link to="/policies?tab=terms">Terms of Service</Link></li>
                <li><Link to="/policies?tab=refund">Refund Policy</Link></li>
                <li><Link to="/policies?tab=shipping">Shipping Info</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-disclaimer">
          <p>
            THE PRODUCTS WE OFFER ARE NOT INTENDED FOR HUMAN USE. THEY ARE INTENDED FOR IN-VITRO AND PRE-CLINICAL RESEARCH PURPOSES ONLY. THE CUSTOMER ACKNOWLEDGES THAT THERE ARE RISKS IN THE HANDLING, USE, AND DISTRIBUTION OF THESE PRODUCTS, AND CERTIFIES THAT IT HAS THE PROPER EQUIPMENT, FACILITIES, AND PERSONNEL FOR MANAGING THOSE RISKS; AND THE CUSTOMER KNOWINGLY ACCEPTS THESE RISKS.
          </p>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/policies?tab=terms">Terms</Link>
            <Link to="/policies?tab=refund">Refund Policy</Link>
            <Link to="/policies?tab=shipping">Shipping Info</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
