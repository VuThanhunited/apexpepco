import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useSite } from '../contexts/SiteContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems, isCartOpen, setIsCartOpen } = useCart();
  const { settings, loading: siteLoading } = useSite();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [annVisible, setAnnVisible] = useState(() => window.scrollY < 60);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setAnnVisible(y < 60); // hide after scrolling 60px
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const annBar = settings?.announcementBar;

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCartOpen(prev => !prev);
  };

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <img
              src="/logo-new.jpg"
              alt="Apex Pep Co"
              className="nav-logo-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo-icon.jpg';
              }}
            />
            <div className="nav-logo-text">
              <span className="nav-logo-apex">APEX</span>
              <div className="nav-logo-pepco">
                <span className="nav-logo-pep">PEP</span>
                <span className="nav-logo-co">CO</span>
              </div>
              <span className="nav-logo-tagline">RESEARCH USE ONLY</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="nav-links-desktop">
            <Link to="/" className={`nav-link ${location.pathname === '/' || location.pathname === '/home' ? 'active' : ''}`}>SHOP</Link>
            <Link to="/shop" className={`nav-link ${location.pathname.startsWith('/shop') || location.pathname.startsWith('/product') ? 'active' : ''}`}>PRODUCTS</Link>
            <Link to="/coas" className={`nav-link ${location.pathname === '/coas' ? 'active' : ''}`}>COA LIBRARY</Link>
            <Link to="/policies" className={`nav-link ${location.pathname === '/policies' ? 'active' : ''}`}>SHIPPING</Link>
            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>ABOUT</Link>
            <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>CONTACT</Link>
          </nav>

          {/* Actions */}
          <div className="nav-actions">
            {/* Cart Icon - Exact Lucide Shopping Cart matching astroresearch.health */}
            <Link
              to="/cart"
              className="cart-btn"
              aria-label="Shopping Cart"
              id="nav-cart-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-cart-icon">
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>

            {/* Auth Button or User Menu */}
            {user ? (
              <div className="user-menu-wrapper">
                <button
                  className="user-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  id="user-menu-btn"
                >
                  <div className="user-avatar">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                </button>
                {userDropdownOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <span>{user.firstName} {user.lastName}</span>
                      <small>{user.email}</small>
                    </div>
                    {user.role === 'admin' && (
                      <a href="http://localhost:5174" target="_blank" rel="noreferrer" className="user-dropdown-item admin-link">
                        ⚡ Admin CMS Dashboard
                      </a>
                    )}
                    <Link to="/account" className="user-dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                      My Account & Orders
                    </Link>
                    <button className="user-dropdown-item logout-btn" onClick={() => { logout(); setUserDropdownOpen(false); }}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-signin-nav" id="nav-signin-btn">
                Sign in
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              className="hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>

        {/* Announcement text strip - hides on scroll, only render after settings loaded */}
        {!siteLoading && annBar?.isVisible !== false && (
          <div className={`announcement-substrip${annVisible ? '' : ' ann-hidden'}`}>
            <span>{annBar?.text || 'FREE SHIPPING ON ORDERS $250+ | FOR RESEARCH USE ONLY'}</span>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="nav-mobile-menu">
            <Link to="/" className={`mobile-link ${location.pathname === '/' || location.pathname === '/home' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>SHOP</Link>
            <Link to="/shop" className={`mobile-link ${location.pathname.startsWith('/shop') || location.pathname.startsWith('/product') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>PRODUCTS</Link>
            <Link to="/coas" className={`mobile-link ${location.pathname === '/coas' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>COA LIBRARY</Link>
            <Link to="/policies" className={`mobile-link ${location.pathname === '/policies' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>SHIPPING</Link>
            <Link to="/about" className={`mobile-link ${location.pathname === '/about' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>ABOUT</Link>
            <Link to="/contact" className={`mobile-link ${location.pathname === '/contact' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>CONTACT</Link>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
