import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await register(form.firstName, form.lastName, form.email, form.password, form.phone);
    if (result.success) navigate('/');
    else setError(result.message);
  };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="auth-page">
      <div className="auth-bg"><div className="auth-glow"></div></div>
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
          <h1>Create Account</h1>
          <p>Join our research community</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form" id="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-firstname">First Name</label>
              <input id="reg-firstname" type="text" required placeholder="John" value={form.firstName} onChange={set('firstName')} />
            </div>
            <div className="form-group">
              <label htmlFor="reg-lastname">Last Name</label>
              <input id="reg-lastname" type="text" required placeholder="Doe" value={form.lastName} onChange={set('lastName')} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input id="reg-email" type="email" required placeholder="researcher@lab.com" value={form.email} onChange={set('email')} />
          </div>
          <div className="form-group">
            <label htmlFor="reg-phone">Phone (optional)</label>
            <input id="reg-phone" type="tel" placeholder="+1 555 000 0000" value={form.phone} onChange={set('phone')} />
          </div>
          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input id="reg-password" type="password" required placeholder="Min 6 characters" value={form.password} onChange={set('password')} minLength={6} />
          </div>
          <button type="submit" className="btn-auth" id="register-submit-btn" disabled={loading}>
            {loading ? <span className="btn-spinner"></span> : 'Create Account'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in →</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
