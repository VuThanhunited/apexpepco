import { useState } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import api from '../utils/api';
import './AccountSettings.css';

const AccountSettings = () => {
  const { user, updateProfile } = useAdminAuth();
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.put('/auth/profile', profileForm);
      if (updateProfile) updateProfile(data.user);
      showToast('Profile updated successfully!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return showToast('New passwords do not match', 'error');
    }
    if (passwordForm.newPassword.length < 6) {
      return showToast('Password must be at least 6 characters', 'error');
    }
    setSavingPassword(true);
    try {
      await api.put('/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      showToast('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="account-settings-page">
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>}

      {/* Page Header */}
      <div className="page-header-banner">
        <div className="banner-icon-box">
          <span className="banner-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </span>
        </div>
        <div className="banner-text">
          <h1>Account Settings</h1>
          <p>Manage your personal information and security</p>
        </div>
        <div className="banner-breadcrumb">
          <span>🏠</span> / <strong>Account</strong>
        </div>
      </div>

      <div className="account-grid">
        {/* Profile Card */}
        <div className="account-profile-card">
          <div className="profile-visual">
            <div className="profile-avatar-large">
              {user?.firstName?.[0] || 'A'}{user?.lastName?.[0] || 'D'}
            </div>
            <h2>{user ? `${user.firstName} ${user.lastName}` : 'Admin User'}</h2>
            <span className="profile-role-badge">Administrator</span>
            <p className="profile-email">{user?.email || 'admin@apexpepco.com'}</p>
          </div>
          <div className="profile-stats-row">
            <div className="profile-stat">
              <span className="stat-value">Admin</span>
              <span className="stat-label">Role</span>
            </div>
            <div className="profile-stat">
              <span className="stat-value">{user?.id ? user.id.slice(-6) : '—'}</span>
              <span className="stat-label">ID</span>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="account-forms-column">
          {/* Personal Info Form */}
          <div className="account-section">
            <div className="section-header-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <h3>Personal Information</h3>
            </div>
            <form onSubmit={handleProfileSubmit} className="account-form">
              <div className="account-form-grid">
                <div className="form-field">
                  <label>First Name</label>
                  <input
                    id="acc-firstname"
                    type="text"
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm(f => ({ ...f, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Last Name</label>
                  <input
                    id="acc-lastname"
                    type="text"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm(f => ({ ...f, lastName: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Email Address</label>
                  <input
                    id="acc-email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Phone Number</label>
                  <input
                    id="acc-phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="Optional"
                  />
                </div>
              </div>
              <button type="submit" className="btn-admin-primary" id="save-profile-btn" disabled={savingProfile}>
                {savingProfile ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </form>
          </div>

          {/* Password Change Form */}
          <div className="account-section">
            <div className="section-header-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <h3>Change Password</h3>
            </div>
            <form onSubmit={handlePasswordSubmit} className="account-form">
              <div className="account-form-grid single-col">
                <div className="form-field">
                  <label>Current Password</label>
                  <input
                    id="acc-current-password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
                    required
                    placeholder="Enter current password"
                  />
                </div>
                <div className="form-field">
                  <label>New Password</label>
                  <input
                    id="acc-new-password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                    required
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <div className="form-field">
                  <label>Confirm New Password</label>
                  <input
                    id="acc-confirm-password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    required
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>
              <button type="submit" className="btn-admin-primary" id="change-password-btn" disabled={savingPassword}>
                {savingPassword ? '⏳ Changing...' : '🔒 Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
