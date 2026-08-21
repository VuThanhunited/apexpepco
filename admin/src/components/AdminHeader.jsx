import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import api from '../utils/api';
import './AdminHeader.css';

const routeNames = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/orders': 'Orders',
  '/users': 'Users',
  '/site-settings': 'Site Settings',
  '/account-settings': 'Account',
};

const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const AdminHeader = ({ onMenuToggle }) => {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Đọc danh sách notif đã đọc từ localStorage
  const getReadIds = () => {
    try { return new Set(JSON.parse(localStorage.getItem('admin_read_notifs') || '[]')); }
    catch { return new Set(); }
  };
  const markRead = (ids) => {
    const existing = getReadIds();
    ids.forEach(id => existing.add(id));
    localStorage.setItem('admin_read_notifs', JSON.stringify([...existing]));
  };

  const currentPage = routeNames[location.pathname] || 'Dashboard';

  const fetchNotifications = useCallback(async () => {
    setNotifLoading(true);
    try {
      // Lấy 10 đơn hàng mới nhất
      const { data } = await api.get('/orders?limit=10&page=1');
      const orders = data.orders || [];
      const readIds = getReadIds();

      const notifs = orders.map(o => ({
        id: o._id,
        type: 'order',
        status: o.status,
        title: `New Order #${o.orderNumber || o._id.slice(-6).toUpperCase()}`,
        subtitle: `${o.shippingAddress?.firstName || ''} ${o.shippingAddress?.lastName || ''} · $${o.total?.toFixed(2) || '0.00'}`,
        time: o.createdAt,
        isNew: o.status === 'pending' && !readIds.has(o._id),
        orderId: o._id,
      }));

      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => n.isNew).length);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setNotifLoading(false);
    }
  }, []);

  // Fetch on mount và mỗi 60 giây
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
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

  const handleOpenNotif = () => {
    setNotifOpen(v => !v);
    setDropdownOpen(false);
    if (!notifOpen) fetchNotifications();
  };

  const handleMarkAllRead = () => {
    markRead(notifications.map(n => n.id));
    setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
    setUnreadCount(0);
  };

  const handleNotifClick = (notif) => {
    markRead([notif.id]);
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isNew: false } : n));
    setUnreadCount(prev => Math.max(0, prev - (notif.isNew ? 1 : 0)));
    setNotifOpen(false);
    navigate('/orders');
  };

  const statusColor = (status) => {
    const map = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444' };
    return map[status] || '#8c8c8f';
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
        <div className="notif-wrap" ref={notifRef}>
          <button
            className={`header-action-btn ${notifOpen ? 'active' : ''}`}
            title="Notifications"
            onClick={handleOpenNotif}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div className="notif-dropdown">
              {/* Header */}
              <div className="notif-header">
                <span className="notif-title">Notifications</span>
                {unreadCount > 0 && (
                  <button className="notif-mark-all" onClick={handleMarkAllRead}>
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="notif-list">
                {notifLoading ? (
                  <div className="notif-empty">
                    <div className="notif-spinner" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="notif-empty">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <button
                      key={notif.id}
                      className={`notif-item ${notif.isNew ? 'unread' : ''}`}
                      onClick={() => handleNotifClick(notif)}
                    >
                      <div className="notif-icon-wrap" style={{ background: statusColor(notif.status) + '18', color: statusColor(notif.status) }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                        </svg>
                      </div>
                      <div className="notif-content">
                        <div className="notif-item-title">{notif.title}</div>
                        <div className="notif-item-sub">{notif.subtitle}</div>
                        <div className="notif-meta">
                          <span className="notif-status-tag" style={{ color: statusColor(notif.status), background: statusColor(notif.status) + '15' }}>
                            {notif.status}
                          </span>
                          <span className="notif-time">{timeAgo(notif.time)}</span>
                        </div>
                      </div>
                      {notif.isNew && <span className="notif-unread-dot" />}
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="notif-footer">
                <button className="notif-view-all" onClick={() => { setNotifOpen(false); navigate('/orders'); }}>
                  View all orders →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="header-user-wrap" ref={dropdownRef}>
          <button className="header-user-btn" onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}>
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
                <a href="https://apexpepco.com" target="_blank" rel="noreferrer" className="dropdown-menu-item">
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
