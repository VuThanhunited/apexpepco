import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useSite } from '../contexts/SiteContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems, isCartOpen, setIsCartOpen } = useCart();
  const { settings } = useSite();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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
          {/* Logo - SVG Triangle Icon + APEX PEP CO text */}
          <Link to="/" className="nav-logo">
            <svg
              className="nav-logo-svg"
              width="50"
              height="46"
              viewBox="0 0 100 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="outerTriGrad" x1="50" y1="0" x2="10" y2="90" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#c0222e" />
                  <stop offset="100%" stopColor="#5a0b12" />
                </linearGradient>
                <linearGradient id="innerTriGrad" x1="50" y1="30" x2="80" y2="85" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#8b0e19" />
                  <stop offset="100%" stopColor="#3a0508" />
                </linearGradient>
              </defs>
              {/* Outer triangle */}
              <polygon points="50,2 98,88 2,88" fill="url(#outerTriGrad)" />
              {/* Inner dark cutout - A shape */}
              <polygon points="50,28 76,80 24,80" fill="#0d0305" />
              {/* Crossbar of A */}
              <rect x="40" y="68" width="20" height="9" rx="1" fill="url(#innerTriGrad)" />
            </svg>
            {/* Brand text */}
            <div className="nav-logo-text">
              <span className="nav-logo-name">APEX PEP CO</span>
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
            <Link to="/wholesale" className={`nav-link ${location.pathname === '/wholesale' ? 'active' : ''}`}>FAQ</Link>
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

        {/* Announcement text strip positioned BELOW navigation bar */}
        {annBar?.isVisible !== false && (
          <div className="announcement-substrip">
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
            <Link to="/wholesale" className={`mobile-link ${location.pathname === '/wholesale' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
