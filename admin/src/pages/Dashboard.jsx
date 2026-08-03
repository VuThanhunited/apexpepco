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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusMeta = {
    pending: { label: 'Pending', color: '#f59e0b', bg: '#fef3c7' },
    processing: { label: 'Processing', color: '#0284c7', bg: '#e0f2fe' },
    shipped: { label: 'Shipped', color: '#7c3aed', bg: '#ede9fe' },
    delivered: { label: 'Delivered', color: '#16a34a', bg: '#dcfce7' },
    cancelled: { label: 'Cancelled', color: '#dc2626', bg: '#fee2e2' },
  };

  return (
    <div className="admindek-dashboard">
      {/* Top Banner Card */}
      <div className="page-header-banner">
        <div className="banner-icon-box">
          <span className="banner-icon">🏠</span>
        </div>
        <div className="banner-text">
          <h1>Dashboard</h1>
          <p>lorem ipsum dolor sit amet, consectetur adipisicing elit</p>
        </div>
        <div className="banner-breadcrumb">
          <span>🏠</span> / <strong>Dashboard</strong>
        </div>
      </div>

      {/* Main Analytics & Right Cards Row */}
      <div className="analytics-section-grid">
        {/* Left Chart Card */}
        <div className="chart-card">
          <div className="card-header">
            <h3>Deals Analytics</h3>
          </div>
          
          <div className="chart-wrapper">
            {/* Top Slider Simulation Overlay */}
            <div className="chart-top-slider">
              <span className="month-label left">Aug</span>
              <span className="month-label center">Sep</span>
              <div className="slider-handle-bar">
                <span className="handle-knob">||</span>
                <div className="handle-fill"></div>
                <span className="handle-knob">||</span>
              </div>
              <span className="month-label right">Dec</span>
              <span className="year-label">2013</span>
            </div>

            {/* Interactive Area Line Chart SVG */}
            <div className="svg-chart-container">
              <svg viewBox="0 0 700 240" className="deals-analytics-svg">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="40" y1="30" x2="680" y2="30" stroke="#f1f5f9" strokeDasharray="3 3" />
                <text x="25" y="34" className="axis-text">90</text>

                <line x1="40" y1="70" x2="680" y2="70" stroke="#f1f5f9" strokeDasharray="3 3" />
                <text x="25" y="74" className="axis-text">85</text>

                <line x1="40" y1="110" x2="680" y2="110" stroke="#f1f5f9" strokeDasharray="3 3" />
                <text x="25" y="114" className="axis-text">80</text>

                <line x1="40" y1="150" x2="680" y2="150" stroke="#f1f5f9" strokeDasharray="3 3" />
                <text x="25" y="154" className="axis-text">75</text>

                <line x1="40" y1="190" x2="680" y2="190" stroke="#f1f5f9" strokeDasharray="3 3" />
                <text x="25" y="194" className="axis-text">70</text>

                {/* Filled Area Gradient */}
                <path
                  d="M 50,170 Q 80,140 100,120 T 150,90 T 200,140 T 250,110 T 300,130 T 350,150 T 400,100 T 450,70 T 500,60 T 550,40 T 600,90 T 650,40 L 650,210 L 50,210 Z"
                  fill="url(#chartGradient)"
                />

                {/* Spline Path Line */}
                <path
                  d="M 50,170 Q 80,140 100,120 T 150,90 T 200,140 T 250,110 T 300,130 T 350,150 T 400,100 T 450,70 T 500,60 T 550,40 T 600,90 T 650,40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Node Points */}
                {[
                  [50,170], [100,120], [150,90], [200,140], [250,110],
                  [300,130], [350,150], [400,100], [450,70], [500,60],
                  [550,40], [600,90], [650,40]
                ].map(([cx, cy], idx) => (
                  <circle key={idx} cx={cx} cy={cy} r="4.5" fill="#ffffff" stroke="#3b82f6" strokeWidth="2.5" />
                ))}

                {/* Search Magnifier Pin at Peak */}
                <g transform="translate(585, 30)">
                  <circle cx="15" cy="15" r="12" fill="#ffffff" stroke="#334155" strokeWidth="2" />
                  <text x="10" y="19" fontSize="11">🔍</text>
                  <text x="28" y="10" fontSize="10" fill="#64748b" fontWeight="600">Show all</text>
                </g>

                {/* Timeline Bottom Axis Labels */}
                <text x="100" y="230" className="axis-date">Oct 23</text>
                <text x="200" y="230" className="axis-date">Oct 27</text>
                <text x="300" y="230" className="axis-date">Oct 31</text>
                <text x="400" y="230" className="axis-date bold">Nov</text>
                <text x="500" y="230" className="axis-date">Nov 08</text>
                <text x="580" y="230" className="axis-date">Nov 12</text>
                <text x="640" y="230" className="axis-date">Nov 16</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Metric Cards Column */}
        <div className="right-kpi-column">
          {/* Card 1: Impressions / Orders */}
          <div className="kpi-card">
            <div className="kpi-info">
              <span className="kpi-title">Impressions</span>
              <h2 className="kpi-number">{loading ? '...' : (stats.orders ? stats.orders.toLocaleString() : '1,563')}</h2>
              <span className="kpi-date-range">May 23 - June 01 (2017)</span>
            </div>
            <div className="kpi-icon-box icon-blue">
              <span>👁️</span>
            </div>
          </div>

          {/* Card 2: Goal / Revenue */}
          <div className="kpi-card">
            <div className="kpi-info">
              <span className="kpi-title">Goal</span>
              <h2 className="kpi-number">{loading ? '...' : `$${stats.revenue ? stats.revenue.toLocaleString() : '30,564'}`}</h2>
              <span className="kpi-date-range">May 23 - June 01 (2017)</span>
            </div>
            <div className="kpi-icon-box icon-teal">
              <span>🎯</span>
            </div>
          </div>

          {/* Card 3: Impact / Products */}
          <div className="kpi-card">
            <div className="kpi-info">
              <span className="kpi-title">Impact</span>
              <h2 className="kpi-number">{loading ? '...' : (stats.products ? `${stats.products} Products` : '42.6%')}</h2>
              <span className="kpi-date-range">May 23 - June 01 (2017)</span>
            </div>
            <div className="kpi-icon-box icon-amber">
              <span>🖐️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Progress Metrics Row */}
      <div className="progress-metrics-row">
        <div className="progress-metric-item">
          <div className="metric-header">
            <span>Published Project</span>
            <strong>75%</strong>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill fill-blue" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="progress-metric-item">
          <div className="metric-header">
            <span>Completed Task</span>
            <strong>90%</strong>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill fill-teal" style={{ width: '90%' }}></div>
          </div>
        </div>

        <div className="progress-metric-item">
          <div className="metric-header">
            <span>Successfull Task</span>
            <strong>60%</strong>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill fill-green" style={{ width: '60%' }}></div>
          </div>
        </div>

        <div className="progress-metric-item">
          <div className="metric-header">
            <span>Ongoing Project</span>
            <strong>45%</strong>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill fill-amber" style={{ width: '45%' }}></div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="dashboard-recent-card">
        <div className="card-header">
          <h3>Recent Orders</h3>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading store orders...</div>
        ) : recentOrders.length === 0 ? (
          <p className="no-data">No orders recorded yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="admindek-table">
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
                  const meta = statusMeta[o.status] || { label: o.status, color: '#64748b', bg: '#f1f5f9' };
                  return (
                    <tr key={o._id}>
                      <td className="font-semibold text-blue">#{o.orderNumber}</td>
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
