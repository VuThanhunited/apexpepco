import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useSite } from '../contexts/SiteContext';
import CartDrawer from './CartDrawer';
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

  return (
    <>
      {annBar?.isVisible !== false && (
        <div
          className="announcement-bar"
          style={{
            backgroundColor: annBar?.bgColor || '#c4222f',
            color: annBar?.textColor || '#ffffff'
          }}
        >
          <p>{annBar?.text || 'FREE SHIPPING ON ORDERS $250+ | FOR RESEARCH USE ONLY'}</p>
        </div>
      )}

      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <img src="https://astroresearch.health/logo.png" alt="Astro Research Logo" className="logo-triangle-img" />
            <span className="logo-brand-text">ASTRO RESEARCH</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="nav-links-desktop">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            <Link to="/shop" className={`nav-link ${location.pathname.startsWith('/shop') ? 'active' : ''}`}>Shop</Link>
            <Link to="/account" className="nav-link">Portal</Link>
            <Link to="/coas" className="nav-link">COAs</Link>
            <Link to="/login" className="nav-link highlight-red">Affiliate</Link>
            <Link to="/wholesale" className="nav-link highlight-red">Business</Link>
          </nav>

          {/* Actions */}
          <div className="nav-actions">
            {/* Cart Icon */}
            <button
              className="cart-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              id="nav-cart-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>

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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="nav-mobile-menu">
            <Link to="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
            <Link to="/account" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Portal</Link>
            <Link to="/coas" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>COAs</Link>
            <Link to="/login" className="mobile-link mobile-link-cta" onClick={() => setMobileMenuOpen(false)}>Affiliate</Link>
            <Link to="/wholesale" className="mobile-link mobile-link-cta" onClick={() => setMobileMenuOpen(false)}>Business</Link>
          </div>
        )}
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
