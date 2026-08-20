import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { resolveImageUrl } from '../contexts/CartContext';
import api from '../utils/api';
import './Account.css';

const Account = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'password'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileStatus, setProfileStatus] = useState(null); // { type: 'success' | 'error', message: '' }

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(null); // { type: 'success' | 'error', message: '' }

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/account' } });
      return;
    }

    setProfileForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      zipCode: user.zipCode || '',
      country: user.country || 'US',
    });

    api.get('/orders/my')
      .then(({ data }) => setOrders(data || []))
      .catch(console.error)
      .finally(() => setLoadingOrders(false));
  }, [user, navigate]);

  if (!user) return null;

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileStatus(null);

    if (!profileForm.firstName.trim() || !profileForm.lastName.trim() || !profileForm.email.trim()) {
      setProfileStatus({ type: 'error', message: 'First name, last name, and email/login are required.' });
      setProfileSaving(false);
      return;
    }

    try {
      const { data } = await api.put('/auth/profile', profileForm);
      if (data.user) {
        updateUser(data.user);
      }
      setProfileStatus({ type: 'success', message: 'Account information updated successfully!' });
      setTimeout(() => setProfileStatus(null), 4000);
    } catch (err) {
      setProfileStatus({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update profile. Please try again.',
      });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordStatus(null);

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordStatus({ type: 'error', message: 'Please enter current and new password.' });
      setPasswordSaving(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 6 characters.' });
      setPasswordSaving(false);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      setPasswordSaving(false);
      return;
    }

    try {
      const { data } = await api.put('/auth/password', passwordForm);
      setPasswordStatus({ type: 'success', message: data.message || 'Password changed successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordStatus(null), 4000);
    } catch (err) {
      setPasswordStatus({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update password. Please check your current password.',
      });
    } finally {
      setPasswordSaving(false);
    }
  };

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
        {/* Left Sidebar */}
        <aside className="account-sidebar">
          <div className="account-avatar">
            <div className="avatar-circle">
              {(user.firstName?.[0] || '').toUpperCase()}
              {(user.lastName?.[0] || '').toUpperCase()}
            </div>
            <div className="avatar-info">
              <h3>{user.firstName} {user.lastName}</h3>
              <p>{user.email}</p>
            </div>
          </div>

          <nav className="account-nav">
            <button
              type="button"
              className={`account-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              <span>My Orders</span>
              {orders.length > 0 && <span className="account-badge">{orders.length}</span>}
            </button>

            <button
              type="button"
              className={`account-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Account Details</span>
            </button>

            <button
              type="button"
              className={`account-nav-item ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>Change Password</span>
            </button>

            <button
              type="button"
              className="account-nav-item logout-btn"
              onClick={() => { logout(); navigate('/'); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="account-main">
          {/* ═════════ TAB: MY ORDERS ═════════ */}
          {activeTab === 'orders' && (
            <section className="account-section">
              <div className="account-section-header">
                <h1>My Orders</h1>
                <p className="account-section-subtitle">Track and review your past purchases</p>
              </div>

              {loadingOrders ? (
                <div className="account-loading"><div className="loader-ring"></div></div>
              ) : orders.length === 0 ? (
                <div className="account-empty">
                  <div className="empty-icon">📦</div>
                  <h3>No Orders Found</h3>
                  <p>You haven't placed any orders with us yet.</p>
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
                          <span
                            className="order-status-badge"
                            style={{
                              color: meta.color,
                              background: meta.bg,
                              border: `1px solid ${meta.border}`,
                              padding: '0.25rem 0.65rem',
                              borderRadius: '0.35rem',
                              fontSize: '0.78rem',
                              fontWeight: 700
                            }}
                          >
                            {meta.label}
                          </span>
                        </div>

                        <div className="order-items-preview">
                          {order.items?.map((item, i) => {
                            const itemImg = resolveImageUrl(item.productImage || item.imageUrl || item.image || item.product?.imageUrl || item.product?.image);
                            return (
                              <div key={i} className="account-order-item-row">
                                <div className="account-order-item-img-box">
                                  <img
                                    src={itemImg || '/product-default.jpg'}
                                    alt={item.productName}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/product-default.jpg';
                                    }}
                                  />
                                </div>
                                <div className="account-order-item-info">
                                  <div className="account-order-item-name">
                                    {item.productName} <span className="account-order-item-qty">×{item.quantity}</span>
                                  </div>
                                  {item.variant && (
                                    <div className="account-order-item-variant">
                                      {item.variant.name || item.variant}
                                    </div>
                                  )}
                                </div>
                                <div className="account-order-item-price">
                                  ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="order-card-footer">
                          <span className="order-total">Total: ${order.total?.toFixed(2)}</span>
                          {order.trackingNumber && (
                            <span className="order-tracking">Tracking: <strong>{order.trackingNumber}</strong></span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* ═════════ TAB: ACCOUNT DETAILS ═════════ */}
          {activeTab === 'profile' && (
            <section className="account-section">
              <div className="account-section-header">
                <h1>Account Details</h1>
                <p className="account-section-subtitle">Update your personal information, login email, and shipping address</p>
              </div>

              {profileStatus && (
                <div className={`account-alert ${profileStatus.type}`}>
                  {profileStatus.type === 'success' ? '✓ ' : '✕ '}
                  {profileStatus.message}
                </div>
              )}

              <form className="account-form" onSubmit={handleProfileSubmit}>
                <div className="form-card">
                  <div className="form-card-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>Personal &amp; Login Info</span>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="acc-firstName">First Name <span className="req">*</span></label>
                      <input
                        id="acc-firstName"
                        type="text"
                        name="firstName"
                        value={profileForm.firstName}
                        onChange={handleProfileChange}
                        placeholder="First name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="acc-lastName">Last Name <span className="req">*</span></label>
                      <input
                        id="acc-lastName"
                        type="text"
                        name="lastName"
                        value={profileForm.lastName}
                        onChange={handleProfileChange}
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="acc-email">Login Email / Username <span className="req">*</span></label>
                      <input
                        id="acc-email"
                        type="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        placeholder="your.email@example.com"
                        required
                      />
                      <span className="input-hint">Used to sign in to your Apex PepCo account</span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="acc-phone">Phone Number</label>
                      <input
                        id="acc-phone"
                        type="tel"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-card">
                  <div className="form-card-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>Default Shipping Address</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="acc-address">Street Address</label>
                    <input
                      id="acc-address"
                      type="text"
                      name="address"
                      value={profileForm.address}
                      onChange={handleProfileChange}
                      placeholder="123 Main St, Apt 4B"
                    />
                  </div>

                  <div className="form-row-3">
                    <div className="form-group">
                      <label htmlFor="acc-city">City</label>
                      <input
                        id="acc-city"
                        type="text"
                        name="city"
                        value={profileForm.city}
                        onChange={handleProfileChange}
                        placeholder="City"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="acc-state">State / Province</label>
                      <input
                        id="acc-state"
                        type="text"
                        name="state"
                        value={profileForm.state}
                        onChange={handleProfileChange}
                        placeholder="State / Province"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="acc-zip">ZIP / Postal Code</label>
                      <input
                        id="acc-zip"
                        type="text"
                        name="zipCode"
                        value={profileForm.zipCode}
                        onChange={handleProfileChange}
                        placeholder="ZIP Code"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="acc-country">Country</label>
                    <select
                      id="acc-country"
                      name="country"
                      value={profileForm.country}
                      onChange={handleProfileChange}
                    >
                      <option value="US">United States (US)</option>
                      <option value="CA">Canada (CA)</option>
                      <option value="UK">United Kingdom (UK)</option>
                      <option value="AU">Australia (AU)</option>
                      <option value="VN">Vietnam (VN)</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-account-submit" disabled={profileSaving}>
                    {profileSaving ? (
                      <>
                        <span className="btn-spinner"></span> Saving Changes...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* ═════════ TAB: CHANGE PASSWORD ═════════ */}
          {activeTab === 'password' && (
            <section className="account-section">
              <div className="account-section-header">
                <h1>Change Password</h1>
                <p className="account-section-subtitle">Keep your account secure with a strong password</p>
              </div>

              {passwordStatus && (
                <div className={`account-alert ${passwordStatus.type}`}>
                  {passwordStatus.type === 'success' ? '✓ ' : '✕ '}
                  {passwordStatus.message}
                </div>
              )}

              <form className="account-form" onSubmit={handlePasswordSubmit}>
                <div className="form-card">
                  <div className="form-card-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <span>Security Credentials</span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="acc-currentPassword">Current Password <span className="req">*</span></label>
                    <div className="password-input-wrap">
                      <input
                        id="acc-currentPassword"
                        type={showCurrentPw ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        className="btn-toggle-pw"
                        onClick={() => setShowCurrentPw(prev => !prev)}
                        tabIndex="-1"
                        aria-label="Toggle password visibility"
                      >
                        {showCurrentPw ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="acc-newPassword">New Password <span className="req">*</span></label>
                      <div className="password-input-wrap">
                        <input
                          id="acc-newPassword"
                          type={showNewPw ? 'text' : 'password'}
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Min 6 characters"
                          minLength={6}
                          required
                        />
                        <button
                          type="button"
                          className="btn-toggle-pw"
                          onClick={() => setShowNewPw(prev => !prev)}
                          tabIndex="-1"
                          aria-label="Toggle password visibility"
                        >
                          {showNewPw ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          )}
                        </button>
                      </div>
                      <span className="input-hint">Must be at least 6 characters</span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="acc-confirmPassword">Confirm New Password <span className="req">*</span></label>
                      <div className="password-input-wrap">
                        <input
                          id="acc-confirmPassword"
                          type={showConfirmPw ? 'text' : 'password'}
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Re-enter new password"
                          required
                        />
                        <button
                          type="button"
                          className="btn-toggle-pw"
                          onClick={() => setShowConfirmPw(prev => !prev)}
                          tabIndex="-1"
                          aria-label="Toggle password visibility"
                        >
                          {showConfirmPw ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-account-submit" disabled={passwordSaving}>
                    {passwordSaving ? (
                      <>
                        <span className="btn-spinner"></span> Updating Password...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </form>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Account;
