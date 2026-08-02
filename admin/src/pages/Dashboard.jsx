import { useState, useEffect } from 'react';
import api from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, orderRes, userRes] = await Promise.all([
          api.get('/products?limit=1'),
          api.get('/orders?limit=5'),
          api.get('/users?limit=1'),
        ]);
        const revenue = orderRes.data.orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
        setStats({
          products: prodRes.data.total || 0,
          orders: orderRes.data.total || 0,
          users: userRes.data.total || 0,
          revenue,
        });
        setRecentOrders(orderRes.data.orders || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const statusColor = { pending: '#f59e0b', processing: '#38bdf8', shipped: '#a78bfa', delivered: '#4ade80', cancelled: '#f87171' };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening.</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: '💰', color: '#4ade80' },
          { label: 'Total Orders', value: stats.orders, icon: '🛒', color: '#38bdf8' },
          { label: 'Total Products', value: stats.products, icon: '📦', color: '#a78bfa' },
          { label: 'Total Users', value: stats.users, icon: '👥', color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="stat-card" id={`stat-${s.label.toLowerCase().replace(/ /g, '-')}`}>
            <div className="stat-icon" style={{ background: `${s.color}1a`, color: s.color }}>{s.icon}</div>
            <div className="stat-info">
              <p className="stat-value">{loading ? '...' : s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-recent">
        <h2>Recent Orders</h2>
        {loading ? (
          <div className="dash-loading">Loading...</div>
        ) : recentOrders.length === 0 ? (
          <p className="dash-empty">No orders yet.</p>
        ) : (
          <div className="orders-table">
            <div className="table-header">
              <span>Order #</span>
              <span>Customer</span>
              <span>Total</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            {recentOrders.map(o => (
              <div key={o._id} className="table-row">
                <span className="order-num">#{o.orderNumber}</span>
                <span className="order-customer">{o.user ? `${o.user.firstName} ${o.user.lastName}` : o.guestEmail || 'Guest'}</span>
                <span className="order-total">${o.total?.toFixed(2)}</span>
                <span className="order-status-badge" style={{ color: statusColor[o.status] || '#94a3b8' }}>{o.status}</span>
                <span className="order-date">{new Date(o.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <a href="/products" className="action-card" id="qa-products">
            <span>📦</span>
            <strong>Manage Products</strong>
            <p>Add, edit, delete products</p>
          </a>
          <a href="/site-settings" className="action-card highlight" id="qa-settings">
            <span>🎨</span>
            <strong>Site Settings</strong>
            <p>Edit website content & design</p>
          </a>
          <a href="/orders" className="action-card" id="qa-orders">
            <span>🛒</span>
            <strong>View Orders</strong>
            <p>Process and track orders</p>
          </a>
          <a href="/wholesale" className="action-card" id="qa-wholesale">
            <span>🤝</span>
            <strong>Wholesale Requests</strong>
            <p>Review business applications</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
