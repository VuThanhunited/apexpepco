import { createContext, useContext, useState } from 'react';
import api from '../utils/api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

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
