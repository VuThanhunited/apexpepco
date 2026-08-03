import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import './Account.css';

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login', { state: { from: '/account' } }); return; }
    api.get('/orders/my').then(({ data }) => setOrders(data)).catch(console.error).finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  const statusMeta = {
    pending: { label: '⏳ Pending Payment', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: '#f59e0b' },
    processing: { label: '⚙️ Processing', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', border: '#38bdf8' },
    shipped: { label: '🚚 Shipped', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.12)', border: '#a78bfa' },
    delivered: { label: '✅ Delivered', color: '#4ade80', bg: 'rgba(74, 222, 128, 0.12)', border: '#4ade80' },
    cancelled: { label: '❌ Cancelled', color: '#f87171', bg: 'rgba(248, 113, 113, 0.12)', border: '#f87171' },
    refunded: { label: '↩️ Refunded', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', border: '#94a3b8' }
  };

  return (
    <div className="account-page">
      <div className="account-container">
        <div className="account-sidebar">
          <div className="account-avatar">
            <div className="avatar-circle">{user.firstName?.[0]}{user.lastName?.[0]}</div>
            <div>
              <h3>{user.firstName} {user.lastName}</h3>
              <p>{user.email}</p>
            </div>
          </div>
          <nav className="account-nav">
            <button className="account-nav-item active">My Orders</button>
            <button className="account-nav-item" onClick={() => { logout(); navigate('/'); }}>Logout</button>
          </nav>
        </div>
        <div className="account-main">
          <h1>My Orders</h1>
          {loading ? (
            <div className="account-loading"><div className="loader-ring"></div></div>
          ) : orders.length === 0 ? (
            <div className="account-empty">
              <p>You haven't placed any orders yet.</p>
              <Link to="/shop" className="btn-shop">Browse Products</Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => {
                const meta = statusMeta[order.status] || { label: order.status, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: '#94a3b8' };
                return (
                  <div key={order._id} className="order-card">
                    <div className="order-card-header">
                      <div>
                        <span className="order-number">#{order.orderNumber}</span>
                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="order-status-badge" style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.border}`, padding: '0.25rem 0.65rem', borderRadius: '0.35rem', fontSize: '0.78rem', fontWeight: 700 }}>
                        {meta.label}
                      </span>
                    </div>
                  <div className="order-items-preview">
                    {order.items.map((item, i) => (
                      <span key={i} className="order-item-tag">{item.productName} ×{item.quantity}</span>
                    ))}
                  </div>
                  <div className="order-card-footer">
                    <span className="order-total">Total: ${order.total?.toFixed(2)}</span>
                    {order.trackingNumber && <span className="order-tracking">Tracking: {order.trackingNumber}</span>}
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
