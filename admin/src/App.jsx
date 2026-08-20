import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';
import Sidebar from './components/Sidebar';
import AdminHeader from './components/AdminHeader';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import SiteSettings from './pages/SiteSettings';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';
import AccountSettings from './pages/AccountSettings';
import Categories from './pages/Categories';
import './App.css';

const ProtectedLayout = ({ children }) => {
  const { user } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className={`admin-layout${sidebarOpen ? ' sidebar-is-open' : ''}`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main-container">
        <AdminHeader onMenuToggle={() => setSidebarOpen(prev => !prev)} />
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/site-settings" element={<ProtectedLayout><SiteSettings /></ProtectedLayout>} />
          <Route path="/products" element={<ProtectedLayout><Products /></ProtectedLayout>} />
          <Route path="/orders" element={<ProtectedLayout><Orders /></ProtectedLayout>} />
          <Route path="/users" element={<ProtectedLayout><Users /></ProtectedLayout>} />
          <Route path="/categories" element={<ProtectedLayout><Categories /></ProtectedLayout>} />
          <Route path="/account-settings" element={<ProtectedLayout><AccountSettings /></ProtectedLayout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
};

export default App;
