import { useState } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import './AdminHeader.css';

const AdminHeader = () => {
  const { user, logout } = useAdminAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  return (
    <header className="admin-top-header">
      <div className="header-left">
        <div className="header-search">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search here..." />
        </div>
        <button className="header-icon-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
          <span className="fullscreen-icon">⛶</span>
        </button>
      </div>

      <div className="header-right">
        {/* Notifications */}
        <div className="header-icon-wrapper">
          <button className="header-icon-btn">
            <span>🔔</span>
            <span className="badge badge-pink">5</span>
          </button>
        </div>

        {/* Messages */}
        <div className="header-icon-wrapper">
          <button className="header-icon-btn">
            <span>💬</span>
            <span className="badge badge-teal">3</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="header-user-wrapper">
          <div className="header-user-profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="user-avatar-img">
              {user?.firstName?.[0] || 'A'}{user?.lastName?.[0] || 'D'}
            </div>
            <span className="user-name">{user ? `${user.firstName || 'John'} ${user.lastName || 'Doe'}` : 'John Doe'}</span>
            <span className="caret-down">▾</span>
          </div>

          {dropdownOpen && (
            <div className="header-user-dropdown">
              <div className="dropdown-header">
                <strong>{user ? `${user.firstName} ${user.lastName}` : 'John Doe'}</strong>
                <small>{user?.email || 'admin@apexpepco.com'}</small>
              </div>
              <a href="http://localhost:5173" target="_blank" rel="noreferrer" className="dropdown-item">
                <span>🌐</span> Preview Storefront
              </a>
              <button className="dropdown-item logout" onClick={logout}>
                <span>⏻</span> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
