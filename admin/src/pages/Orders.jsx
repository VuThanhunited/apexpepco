import { useState, useEffect } from 'react';
import api from '../utils/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [toast, setToast] = useState(null);
  const LIMIT = 20;

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (statusFilter) params.set('status', statusFilter);
      const { data } = await api.get(`/orders?${params}`);
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      showToast('Order status updated!');
      fetchOrders();
    } catch { showToast('Update failed', 'error'); }
  };

  const statusColor = { pending: '#f59e0b', processing: '#38bdf8', shipped: '#a78bfa', delivered: '#4ade80', cancelled: '#f87171', refunded: '#94a3b8' };
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

  return (
    <div style={{ padding: '2rem' }}>
      {toast && <div className={`admin-toast ${toast.type}`} style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999, padding: '0.875rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600, boxShadow: '0 10px 30px rgba(0,0,0,0.4)', background: toast.type === 'success' ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)', border: `1px solid ${toast.type === 'success' ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`, color: toast.type === 'success' ? '#4ade80' : '#f87171' }}>{toast.msg}</div>}

      <div className="admin-page-header">
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f3f5f7', margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Orders <span className="count-badge">{total}</span>
          </h1>
          <p style={{ color: '#7585a3', fontSize: '0.875rem', margin: 0 }}>Manage and track all orders</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select id="status-filter" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ background: '#0a1020', border: '1px solid rgba(255,255,255,0.08)', color: '#f3f5f7', padding: '0.6rem 0.875rem', borderRadius: '0.6rem', fontSize: '0.875rem', outline: 'none', cursor: 'pointer' }}>
            <option value="">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div style={{ width: 36, height: 36, border: '3px solid rgba(167,139,250,0.15)', borderTopColor: '#a78bfa', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        </div>
      ) : (
        <div style={{ background: '#0a1020', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Order #', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7585a3', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: '#7585a3', padding: '2rem' }}>No orders found</td></tr>
              ) : orders.map(o => (
                <tr key={o._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.875rem 1rem', color: '#38bdf8', fontWeight: 600, fontSize: '0.875rem' }}>#{o.orderNumber}</td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#f3f5f7' }}>
                    {o.user ? `${o.user.firstName} ${o.user.lastName}` : o.guestEmail || 'Guest'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#94a3b8', fontSize: '0.8rem' }}>{o.items?.length} item(s)</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#4ade80', fontWeight: 700, fontSize: '0.875rem' }}>${o.total?.toFixed(2)}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <select
                      value={o.status}
                      onChange={e => updateStatus(o._id, e.target.value)}
                      id={`status-${o._id}`}
                      style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${statusColor[o.status]}40`, color: statusColor[o.status] || '#94a3b8', padding: '0.3rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
                    >
                      {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#7585a3', fontSize: '0.8rem' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {o.shippingAddress && <div style={{ fontSize: '0.72rem', color: '#7585a3' }}>{o.shippingAddress.city}, {o.shippingAddress.country}</div>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {Math.ceil(total / LIMIT) > 1 && (
        <div className="admin-pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span>Page {page} of {Math.ceil(total / LIMIT)}</span>
          <button disabled={page >= Math.ceil(total / LIMIT)} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      <style>{`
        .admin-page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; gap: 1rem; }
        .count-badge { font-size: 0.7rem; background: rgba(56,189,248,0.1); color: #38bdf8; border: 1px solid rgba(56,189,248,0.2); padding: 0.2rem 0.5rem; border-radius: 1rem; font-weight: 700; }
        .admin-pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.25rem; font-size: 0.875rem; color: #7585a3; }
        .admin-pagination button { background: #0a1020; border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; font-family: inherit; }
        .admin-pagination button:disabled { opacity: 0.4; cursor: not-allowed; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Orders;
