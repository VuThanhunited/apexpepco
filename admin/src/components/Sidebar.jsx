import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import './Sidebar.css';

const navItems = [
  { label: 'Dashboard', href: '/', icon: '📊' },
  { label: 'Site Settings', href: '/site-settings', icon: '🎨', highlight: true },
  { label: 'Products', href: '/products', icon: '📦' },
  { label: 'Orders', href: '/orders', icon: '🛒' },
  { label: 'Categories', href: '/categories', icon: '🏷️' },
  { label: 'Users', href: '/users', icon: '👥' },
  { label: 'Wholesale', href: '/wholesale', icon: '🤝' },
];

const Sidebar = () => {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🔬</span>
        <div>
          <span className="sidebar-logo-text">Apex Pepco</span>
          <span className="sidebar-logo-sub">Admin Panel</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`
            }
            id={`sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.highlight && <span className="sidebar-badge">CMS</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
          <div className="sidebar-user-info">
            <span>{user?.firstName} {user?.lastName}</span>
            <small>Administrator</small>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout} title="Logout">⏻</button>
      </div>

      <a href="http://localhost:5173" target="_blank" rel="noreferrer" className="sidebar-preview-btn" id="preview-site-btn">
        👁 Preview Site ↗
      </a>
    </aside>
  );
};

export default Sidebar;
