import { useState, useEffect } from 'react';
import api from '../utils/api';
import './Users.css';

const emptyEditForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'customer',
  password: '',
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Edit user state
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [saving, setSaving] = useState(false);

  const LIMIT = 15;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (search) params.set('search', search);
      const { data } = await api.get(`/users?${params}`);
      let list = data.users || [];
      if (roleFilter) {
        list = list.filter(u => u.role === roleFilter);
      }
      setUsers(list);
      setTotal(data.total || list.length);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const openEdit = (u) => {
    setEditUser(u);
    setEditForm({
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      email: u.email || '',
      phone: u.phone || '',
      role: u.role || 'customer',
      password: '',
    });
  };

  const closeEdit = () => {
    setEditUser(null);
    setEditForm(emptyEditForm);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editUser) return;
    setSaving(true);
    try {
      const payload = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        phone: editForm.phone,
        role: editForm.role,
      };
      // Only include password if filled
      if (editForm.password && editForm.password.length >= 6) {
        payload.password = editForm.password;
      } else if (editForm.password && editForm.password.length > 0) {
        showToast('Password must be at least 6 characters', 'error');
        setSaving(false);
        return;
      }
      await api.put(`/users/${editUser._id}`, payload);
      showToast('User updated successfully!');
      closeEdit();
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/users/${userToDelete._id}`);
      showToast('User account deleted');
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-users-page">
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>}

      {/* Page Header */}
      <div className="page-header-banner">
        <div className="banner-icon-box">
          <span className="banner-icon">👥</span>
        </div>
        <div className="banner-text">
          <h1>User Management</h1>
          <p>View, manage roles, and monitor registered user accounts</p>
        </div>
        <div className="banner-breadcrumb">
          <span>🏠</span> / <strong>Users</strong>
        </div>
      </div>

      {/* Top Controls Toolbar */}
      <div className="users-toolbar-card">
        <form onSubmit={handleSearchSubmit} className="users-search-form">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn-search">Search</button>
        </form>

        <div className="users-filter-group">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="role-select-filter"
          >
            <option value="">All Roles</option>
            <option value="admin">Admins Only</option>
            <option value="customer">Customers Only</option>
          </select>

          <span className="users-count-badge">Total: {total} User(s)</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="table-empty">
            <p>No user accounts found matching your search.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>USER</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>ROLE</th>
                <th>JOINED DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="user-profile-cell">
                      <div className="user-avatar-circle">
                        {u.firstName?.[0] || 'U'}{u.lastName?.[0] || ''}
                      </div>
                      <div className="user-name-info">
                        <strong>{u.firstName} {u.lastName}</strong>
                        <small>ID: {u._id.slice(-6)}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="user-email-text">{u.email}</span>
                  </td>
                  <td>
                    <span className="user-phone-text">{u.phone || 'N/A'}</span>
                  </td>
                  <td>
                    <span className={`role-pill role-${u.role || 'customer'}`}>
                      {u.role === 'admin' ? '🛡️ Admin' : '👤 Customer'}
                    </span>
                  </td>
                  <td className="text-muted">
                    {new Date(u.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-edit"
                        onClick={() => openEdit(u)}
                        title="Edit User"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => setUserToDelete(u)}
                        title="Delete User"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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

      {/* Edit User Modal */}
      {editUser && (
        <div className="modal-overlay">
          <div className="modal-card modal-edit-user">
            <div className="modal-header">
              <h2>✏️ Edit User</h2>
              <button className="modal-close" onClick={closeEdit}>✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className="modal-body">
              <div className="edit-user-avatar-row">
                <div className="user-avatar-circle large">
                  {editForm.firstName?.[0] || 'U'}{editForm.lastName?.[0] || ''}
                </div>
                <div>
                  <strong>{editForm.firstName} {editForm.lastName}</strong>
                  <small style={{ display: 'block', color: '#8c8c8f' }}>ID: {editUser._id.slice(-6)}</small>
                </div>
              </div>

              <div className="edit-user-grid">
                <div className="edit-field">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div className="edit-field">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))}
                    required
                  />
                </div>
                <div className="edit-field">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="edit-field">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="Optional"
                  />
                </div>
                <div className="edit-field">
                  <label>Role</label>
                  <select
                    value={editForm.role}
                    onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                  >
                    <option value="customer">👤 Customer</option>
                    <option value="admin">🛡️ Admin</option>
                  </select>
                </div>
                <div className="edit-field">
                  <label>New Password <span style={{ color: '#8c8c8f', fontWeight: 400 }}>(leave blank to keep current)</span></label>
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Min 6 characters"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeEdit}>Cancel</button>
                <button type="submit" className="btn-admin-primary" disabled={saving}>
                  {saving ? '⏳ Saving...' : '💾 Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {userToDelete && (
        <div className="modal-overlay">
          <div className="modal-card modal-sm">
            <div className="modal-header">
              <h2>Confirm Account Deletion</h2>
              <button className="modal-close" onClick={() => setUserToDelete(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete the user account for <strong>{userToDelete.firstName} {userToDelete.lastName}</strong> ({userToDelete.email})?</p>
              <p className="text-warning">⚠️ This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setUserToDelete(null)}>Cancel</button>
              <button className="btn-admin-danger" onClick={handleDeleteUser} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Yes, Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
