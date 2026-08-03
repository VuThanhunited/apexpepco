import { useState, useEffect } from 'react';
import api from '../utils/api';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('USPS');
  const [toast, setToast] = useState(null);
  const [updating, setUpdating] = useState(false);
  const LIMIT = 15;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (statusFilter) params.set('status', statusFilter);
      const { data } = await api.get(`/orders?${params}`);
      let list = data.orders || [];
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(o =>
          o.orderNumber?.toString().includes(q) ||
          o.guestEmail?.toLowerCase().includes(q) ||
          (o.user && (o.user.firstName?.toLowerCase().includes(q) || o.user.lastName?.toLowerCase().includes(q) || o.user.email?.toLowerCase().includes(q)))
        );
      }
      setOrders(list);
      setTotal(data.total || list.length);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      showToast(`Order status updated to ${status}`);
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder(prev => ({ ...prev, status }));
      }
      fetchOrders();
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  const saveTrackingInfo = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      await api.put(`/orders/${selectedOrder._id}`, {
        trackingNumber,
        carrier,
        status: selectedOrder.status === 'pending' ? 'shipped' : selectedOrder.status,
      });
      showToast('Tracking info saved!');
      setSelectedOrder(prev => ({ ...prev, trackingNumber, carrier }));
      fetchOrders();
    } catch (err) {
      showToast('Save failed', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setTrackingNumber(order.trackingNumber || '');
    setCarrier(order.carrier || 'USPS');
  };

  const statusMeta = {
    pending: { label: '⏳ Pending', color: '#d97706', bg: '#fef3c7' },
    processing: { label: '⚙️ Processing', color: '#0284c7', bg: '#e0f2fe' },
    shipped: { label: '🚚 Shipped', color: '#7c3aed', bg: '#ede9fe' },
    delivered: { label: '✅ Delivered', color: '#16a34a', bg: '#dcfce7' },
    cancelled: { label: '❌ Cancelled', color: '#dc2626', bg: '#fee2e2' },
  };

  return (
    <div className="admin-orders-page">
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>}

      {/* Page Header */}
      <div className="page-header-banner">
        <div className="banner-icon-box">
          <span className="banner-icon">🛒</span>
        </div>
        <div className="banner-text">
          <h1>Order Management</h1>
          <p>Track, manage, update tracking numbers, and fulfill customer orders</p>
        </div>
        <div className="banner-breadcrumb">
          <span>🏠</span> / <strong>Orders</strong>
        </div>
      </div>

      {/* Filter Tabs & Toolbar */}
      <div className="orders-toolbar-card">
        <div className="status-tabs-row">
          {[
            { id: '', label: 'All Orders' },
            { id: 'pending', label: 'Pending' },
            { id: 'processing', label: 'Processing' },
            { id: 'shipped', label: 'Shipped' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`status-tab-btn ${statusFilter === tab.id ? 'active' : ''}`}
              onClick={() => { setStatusFilter(tab.id); setPage(1); }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="orders-search-form">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search Order # or Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-search">Search</button>
        </form>
      </div>

      {/* Orders Table */}
      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="table-empty">
            <p>No orders found.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ORDER #</th>
                <th>CUSTOMER</th>
                <th>ITEMS</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>SHIPPING DESTINATION</th>
                <th>DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const meta = statusMeta[o.status] || { label: o.status, color: '#64748b', bg: '#f1f5f9' };
                const customerName = o.user
                  ? `${o.user.firstName} ${o.user.lastName}`
                  : (o.shippingAddress?.fullName || o.guestEmail || 'Guest Customer');
                const customerEmail = o.user?.email || o.guestEmail || o.shippingAddress?.email || 'N/A';

                return (
                  <tr key={o._id}>
                    <td>
                      <span className="order-num-text">#{o.orderNumber}</span>
                    </td>
                    <td>
                      <div className="order-customer-info">
                        <strong>{customerName}</strong>
                        <small>{customerEmail}</small>
                      </div>
                    </td>
                    <td>
                      <span className="items-count-badge">{o.items?.length || 0} Item(s)</span>
                    </td>
                    <td>
                      <span className="order-total-price">${o.total?.toFixed(2)}</span>
                    </td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                        className="status-dropdown-select"
                        style={{ color: meta.color, backgroundColor: meta.bg }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <span className="shipping-dest-text">
                        {o.shippingAddress ? `${o.shippingAddress.city || ''}, ${o.shippingAddress.country || 'USA'}` : 'US Standard'}
                      </span>
                    </td>
                    <td className="text-muted">
                      {new Date(o.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <button
                        className="btn-view-order"
                        onClick={() => openOrderDetail(o)}
                      >
                        View Details 👁️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="table-pagination">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="btn-page"
            >
              Previous
            </button>
            <span className="page-indicator">Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="btn-page"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-card modal-lg">
            <div className="modal-header">
              <h2>Order Details #{selectedOrder.orderNumber}</h2>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            <div className="modal-body">
              {/* Top Summary Banner */}
              <div className="order-summary-box">
                <div>
                  <span className="summary-label">Order Date</span>
                  <strong>{new Date(selectedOrder.createdAt).toLocaleString()}</strong>
                </div>
                <div>
                  <span className="summary-label">Order Status</span>
                  <span className="status-pill" style={{
                    color: statusMeta[selectedOrder.status]?.color || '#334155',
                    background: statusMeta[selectedOrder.status]?.bg || '#f1f5f9'
                  }}>
                    {statusMeta[selectedOrder.status]?.label || selectedOrder.status}
                  </span>
                </div>
                <div>
                  <span className="summary-label">Payment Total</span>
                  <strong className="text-green">${selectedOrder.total?.toFixed(2)}</strong>
                </div>
              </div>

              {/* Customer & Shipping Section Grid */}
              <div className="order-details-grid">
                {/* Customer Information */}
                <div className="detail-box">
                  <h4>👤 Customer Info</h4>
                  <p><strong>Name:</strong> {selectedOrder.user ? `${selectedOrder.user.firstName} ${selectedOrder.user.lastName}` : (selectedOrder.shippingAddress?.fullName || 'Guest')}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email || selectedOrder.guestEmail || selectedOrder.shippingAddress?.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone || 'N/A'}</p>
                </div>

                {/* Shipping Address */}
                <div className="detail-box">
                  <h4>🚚 Shipping Address</h4>
                  {selectedOrder.shippingAddress ? (
                    <>
                      <p>{selectedOrder.shippingAddress.address || selectedOrder.shippingAddress.street}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode || selectedOrder.shippingAddress.zipCode}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </>
                  ) : (
                    <p className="text-muted">No address specified</p>
                  )}
                </div>
              </div>

              {/* Tracking Information Box */}
              <div className="tracking-edit-box">
                <h4>📦 Fulfillment & Tracking Number</h4>
                <div className="tracking-inputs-row">
                  <div className="form-group flex-1">
                    <label>Carrier</label>
                    <select value={carrier} onChange={(e) => setCarrier(e.target.value)}>
                      <option value="USPS">USPS Priority Mail</option>
                      <option value="FedEx">FedEx Express</option>
                      <option value="UPS">UPS Ground</option>
                      <option value="DHL">DHL Express</option>
                    </select>
                  </div>
                  <div className="form-group flex-2">
                    <label>Tracking Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 9400111899564123456789"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                  </div>
                  <button className="btn-admin-primary" onClick={saveTrackingInfo} disabled={updating}>
                    {updating ? 'Saving...' : 'Update Tracking'}
                  </button>
                </div>
              </div>

              {/* Ordered Products Table */}
              <div className="ordered-items-box">
                <h4>🧪 Items Ordered ({selectedOrder.items?.length || 0})</h4>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>PRODUCT</th>
                      <th>VARIANT</th>
                      <th>UNIT PRICE</th>
                      <th>QTY</th>
                      <th>SUBTOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="item-prod-cell">
                            {item.product?.imageUrl && (
                              <img src={item.product.imageUrl} alt={item.name} className="item-thumb" />
                            )}
                            <strong>{item.name || item.product?.name}</strong>
                          </div>
                        </td>
                        <td>{item.variantName || 'Standard'}</td>
                        <td>${(item.price || item.unitPrice || 0).toFixed(2)}</td>
                        <td>x{item.quantity}</td>
                        <td className="font-bold">${((item.price || item.unitPrice || 0) * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
