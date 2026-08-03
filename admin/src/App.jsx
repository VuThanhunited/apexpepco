import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';
import Sidebar from './components/Sidebar';
import AdminHeader from './components/AdminHeader';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import SiteSettings from './pages/SiteSettings';
import Products from './pages/Products';
import Orders from './pages/Orders';
import './App.css';

const ProtectedLayout = ({ children }) => {
  const { user } = useAdminAuth();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main-container">
        <AdminHeader />
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
          <Route path="/categories" element={<ProtectedLayout><CategoriesPlaceholder /></ProtectedLayout>} />
          <Route path="/users" element={<ProtectedLayout><UsersPlaceholder /></ProtectedLayout>} />
          <Route path="/wholesale" element={<ProtectedLayout><WholesalePlaceholder /></ProtectedLayout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
};

// Simple placeholder pages
const CategoriesPlaceholder = () => <SimplePage title="Categories" icon="🏷️" desc="Manage product categories" />;
const UsersPlaceholder = () => <SimplePage title="Users" icon="👥" desc="Manage registered users" />;
const WholesalePlaceholder = () => <SimplePage title="Wholesale Applications" icon="🤝" desc="Review business applications" />;

const SimplePage = ({ title, icon, desc }) => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f3f5f7', margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{icon} {title}</h1>
    <p style={{ color: '#7585a3', fontSize: '0.875rem', margin: '0 0 2rem' }}>{desc}</p>
    <div style={{ background: '#0a1020', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '3rem', textAlign: 'center', color: '#7585a3' }}>
      <p>This section is ready — extend it following the same pattern as Products.</p>
    </div>
  </div>
);

export default App;
