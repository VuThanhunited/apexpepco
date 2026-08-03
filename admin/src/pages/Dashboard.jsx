import { useState, useEffect } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import api from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAdminAuth();
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
        const allOrders = orderRes.data.orders || [];
        const revenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        setStats({
          products: prodRes.data.total || 0,
          orders: orderRes.data.total || 0,
          users: userRes.data.total || 0,
          revenue,
        });
        setRecentOrders(allOrders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusMeta = {
    pending: { label: 'Pending', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
    processing: { label: 'Processing', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
    shipped: { label: 'Shipped', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' },
    delivered: { label: 'Delivered', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
    cancelled: { label: 'Cancelled', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' },
  };

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: loading ? '...' : `$${stats.revenue.toLocaleString()}`,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      shadow: 'rgba(99, 102, 241, 0.3)',
    },
    {
      title: 'Total Orders',
      value: loading ? '...' : stats.orders.toLocaleString(),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
      shadow: 'rgba(6, 182, 212, 0.3)',
    },
    {
      title: 'Total Products',
      value: loading ? '...' : stats.products.toLocaleString(),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      shadow: 'rgba(16, 185, 129, 0.3)',
    },
    {
      title: 'Total Users',
      value: loading ? '...' : stats.users.toLocaleString(),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      shadow: 'rgba(245, 158, 11, 0.3)',
    },
  ];

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <h1>Welcome back, {user?.firstName || 'Admin'} 👋</h1>
          <p>Here's what's happening with your store today.</p>
        </div>
        <div className="welcome-decoration">
          <div className="welcome-orb orb-1"></div>
          <div className="welcome-orb orb-2"></div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpiCards.map((card, idx) => (
          <div key={idx} className="kpi-card" style={{ animationDelay: `${idx * 0.08}s` }}>
            <div className="kpi-icon-box" style={{ background: card.gradient, boxShadow: `0 4px 15px ${card.shadow}` }}>
              {card.icon}
            </div>
            <div className="kpi-info">
              <span className="kpi-label">{card.title}</span>
              <h2 className="kpi-value">{card.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3>Recent Orders</h3>
          <a href="/orders" className="card-view-all">View All →</a>
        </div>

        {loading ? (
          <div className="admin-loading"><div className="admin-spinner"></div></div>
        ) : recentOrders.length === 0 ? (
          <div className="dashboard-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <p>No orders recorded yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>CUSTOMER</th>
                  <th>TOTAL</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => {
                  const meta = statusMeta[o.status] || { label: o.status, color: '#64748b', bg: 'rgba(100,116,139,0.12)' };
                  return (
                    <tr key={o._id}>
                      <td><span className="order-id-link">#{o.orderNumber}</span></td>
                      <td>{o.user ? `${o.user.firstName} ${o.user.lastName}` : o.guestEmail || 'Guest'}</td>
                      <td className="font-bold">${o.total?.toFixed(2)}</td>
                      <td>
                        <span className="status-pill" style={{ color: meta.color, background: meta.bg }}>
                          {meta.label}
                        </span>
                      </td>
                      <td className="text-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
