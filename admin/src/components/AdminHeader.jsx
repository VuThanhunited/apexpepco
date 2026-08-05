import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import './AdminHeader.css';

const routeNames = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/orders': 'Orders',
  '/users': 'Users',
  '/site-settings': 'Site Settings',
  '/account-settings': 'Account',
};

const AdminHeader = ({ onMenuToggle }) => {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentPage = routeNames[location.pathname] || 'Dashboard';

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  return (
    <header className="admin-header">
      {/* Left: Menu toggle + Breadcrumb */}
      <div className="header-left-section">
        <button className="header-menu-toggle" onClick={onMenuToggle} aria-label="Toggle menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div className="header-breadcrumb">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{currentPage}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="header-right-section">
        {/* Fullscreen */}
        <button className="header-action-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
          </svg>
        </button>

        {/* Notifications */}
        <button className="header-action-btn" title="Notifications">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="notification-dot"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="header-user-wrap" ref={dropdownRef}>
          <button className="header-user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="header-avatar">
              {user?.firstName?.[0] || 'A'}{user?.lastName?.[0] || 'D'}
            </div>
            <div className="header-user-text">
              <span className="header-user-name">
                {user ? `${user.firstName} ${user.lastName}` : 'Admin'}
              </span>
              <span className="header-user-role">Admin</span>
            </div>
            <svg className={`header-caret ${dropdownOpen ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {dropdownOpen && (
            <div className="header-dropdown">
              <div className="dropdown-user-info">
                <div className="dropdown-avatar">
                  {user?.firstName?.[0] || 'A'}{user?.lastName?.[0] || 'D'}
                </div>
                <div>
                  <strong>{user ? `${user.firstName} ${user.lastName}` : 'Admin'}</strong>
                  <small>{user?.email || 'admin@apexpepco.com'}</small>
                </div>
              </div>

              <div className="dropdown-menu-items">
                <button className="dropdown-menu-item" onClick={() => { navigate('/account-settings'); setDropdownOpen(false); }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  Account Settings
                </button>
                <a href="http://localhost:5173" target="_blank" rel="noreferrer" className="dropdown-menu-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  View Storefront
                </a>
              </div>

              <div className="dropdown-divider"></div>
              <button className="dropdown-menu-item dropdown-logout" onClick={logout}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
