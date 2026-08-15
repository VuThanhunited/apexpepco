import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result.success) navigate(from, { replace: true });
    else setError(result.message);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-glow"></div>
      </div>
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <img
              src="/logo-triangle.png"
              alt="Apex Pep Co"
              className="auth-logo-img"
              onError={e => { e.target.onerror = null; e.target.src = '/logo-icon.jpg'; }}
            />
            <div className="auth-logo-text">
              <span className="auth-logo-apex">APEX</span>
              <div className="auth-logo-pepco">
                <span className="auth-logo-pep">PEP</span>
                <span className="auth-logo-co">CO</span>
              </div>
            </div>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your research account</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form" id="login-form">
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email" type="email" required
              placeholder="researcher@lab.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password" type="password" required
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
          </div>
          <button type="submit" className="btn-auth" id="login-submit-btn" disabled={loading}>
            {loading ? <span className="btn-spinner"></span> : 'Sign In'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Create one →</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
