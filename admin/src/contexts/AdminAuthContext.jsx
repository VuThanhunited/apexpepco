import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until token verified

  // Verify token on mount — tránh hiện layout khi token đã hết hạn
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('admin_user');
    if (!token || !savedUser) {
      setLoading(false);
      return;
    }
    // Verify token với server
    api.get('/auth/me')
      .then(({ data }) => {
        if (data.role === 'admin') {
          setUser(data);
          localStorage.setItem('admin_user', JSON.stringify(data));
        } else {
          // Không phải admin → clear
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
        }
      })
      .catch(() => {
        // Token hết hạn hoặc không hợp lệ → clear
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.user.role !== 'admin') return { success: false, message: 'Access denied: Admin only' };
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
    // Force redirect về login ngay lập tức
    window.location.href = '/login';
  };

  const updateProfile = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    localStorage.setItem('admin_user', JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);

