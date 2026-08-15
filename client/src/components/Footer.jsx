import { Link } from 'react-router-dom';
import { useSite } from '../contexts/SiteContext';
import './Footer.css';

const Footer = () => {
  const { settings } = useSite();
  const footer = settings?.footer;
  const siteName = settings?.siteName || 'Apex Pep Co';

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              {settings?.logo
                ? <img src={settings.logo} alt={siteName} />
                : <img src="/logo-new.jpg" alt={siteName} className="footer-logo-img" onError={(e) => { e.target.onerror = null; e.target.src = '/logo.jpg'; }} />
              }
            </div>
            <p className="footer-desc">
              {footer?.description || 'Premium laboratory equipment and specialty chemicals. Precise, authoritative, exclusive.'}
            </p>
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
            {footer?.disclaimer || 'THE PRODUCTS WE OFFER ARE NOT INTENDED FOR HUMAN USE. THEY ARE INTENDED FOR IN-VITRO AND PRE-CLINICAL RESEARCH PURPOSES ONLY.'}
          </p>
        </div>

        <div className="footer-bottom">
          <p>{footer?.copyrightText || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}</p>
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
