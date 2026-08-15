import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const { login, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result.success) navigate('/');
    else setError(result.message);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg">
        <div className="admin-login-glow"></div>
        <div className="admin-login-grid"></div>
      </div>
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-logo">
            <img
              src="/logo-triangle.png"
              alt="Apex Pep Co"
              className="admin-login-logo-icon"
              onError={e => { e.target.onerror = null; e.target.src = '/logo-icon.jpg'; }}
            />
            <div className="admin-login-logo-text">
              <span className="admin-login-logo-apex">APEX</span>
              <div className="admin-login-logo-pepco">
                <span className="admin-login-logo-pep">PEP</span>
                <span className="admin-login-logo-co">CO</span>
              </div>
              <span className="admin-login-logo-tagline">Research Use Only</span>
            </div>
          </div>
          <h1>Admin Dashboard</h1>
          <p>Restricted to authorized personnel only</p>
        </div>
        {error && <div className="admin-login-error">{error}</div>}
        <form onSubmit={handleSubmit} id="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="admin-email">Email Address</label>
            <input
              id="admin-email" type="email" required
              placeholder="admin@apexpepco.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password" type="password" required
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
          </div>
          <button type="submit" className="admin-login-btn" id="admin-login-submit" disabled={loading}>
            {loading ? <span className="admin-spinner"></span> : 'Sign In to Admin'}
          </button>
        </form>
        <p className="admin-login-note">Restricted access. Admin credentials only.</p>
      </div>
    </div>
  );
};

export default AdminLogin;
