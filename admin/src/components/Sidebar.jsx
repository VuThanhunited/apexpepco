import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navSections = [
  {
    title: 'Navigation',
    items: [
      { label: 'Dashboard', href: '/', icon: '🏠', badge: 'Default' },
      { label: 'Products', href: '/products', icon: '📦' },
      { label: 'Orders', href: '/orders', icon: '🛒' },
      { label: 'Site Settings', href: '/site-settings', icon: '🎨', badge: 'CMS', badgeColor: 'orange' },
    ]
  },
  {
    title: 'Management',
    items: [
      { label: 'Categories', href: '/categories', icon: '🏷️' },
      { label: 'Users', href: '/users', icon: '👥' },
      { label: 'Wholesale Apps', href: '/wholesale', icon: '🤝', badge: 'new', badgeColor: 'cyan' },
    ]
  },
  {
    title: 'UI Element',
    items: [
      { label: 'Basic', href: '/#', icon: '💎' },
      { label: 'Advance', href: '/#', icon: '🚀' },
      { label: 'Extra', href: '/#', icon: '📦', badge: '100+', badgeColor: 'pink' },
    ]
  }
];

const Sidebar = () => {
  return (
    <aside className="admindek-sidebar">
      {/* Top Logo Header */}
      <div className="sidebar-brand">
        <div className="brand-logo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 19H22L12 2Z" fill="#3b82f6" />
            <circle cx="12" cy="13" r="3" fill="#ffffff" />
          </svg>
        </div>
        <span className="brand-title">ADMINDEK</span>
        <button className="sidebar-toggle-btn" title="Toggle Sidebar">
          <span>🎯</span>
        </button>
      </div>

      {/* Nav Menu Body */}
      <nav className="sidebar-nav-body">
        {navSections.map((sec, idx) => (
          <div key={idx} className="nav-section">
            <h4 className="section-heading">{sec.title}</h4>
            <ul className="nav-list">
              {sec.items.map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={item.href}
                    end={item.href === '/'}
                    className={({ isActive }) => `sidebar-menu-link ${isActive ? 'active' : ''}`}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-text">{item.label}</span>
                    {item.badge && (
                      <span className={`menu-badge badge-${item.badgeColor || 'blue'}`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Quick External Store Preview */}
      <div className="sidebar-bottom-action">
        <a href="http://localhost:5173" target="_blank" rel="noreferrer" className="btn-sidebar-preview">
          <span>🌐</span> View Storefront
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
