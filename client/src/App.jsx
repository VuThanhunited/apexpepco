import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { SiteProvider } from './contexts/SiteContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import AgeGate from './components/AgeGate';
import PromoModal from './components/PromoModal';
import FloatingAssistant from './components/FloatingAssistant';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <SiteProvider>
        <AuthProvider>
          <CartProvider>
            <AgeGate />
            <PromoModal />
            <CartDrawer />
            <div className="app-layout">
              <Navbar />
              <main className="app-main">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/shop/:id" element={<ProductDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/account/orders" element={<Account />} />
                  <Route path="/coas" element={
                    <div className="coas-page" style={{ padding: '4rem 1.5rem', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
                      <h1 style={{ fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>Certificates of Analysis (COAs)</h1>
                      <p style={{ color: '#8c8c8f', marginBottom: '2rem' }}>Download independent third-party lab testing reports for all batches.</p>
                      <div style={{ background: '#0b0b0c', border: '1px solid #2a2a2c', borderRadius: '0.75rem', padding: '3rem' }}>
                        <p style={{ color: '#8c8c8f' }}>All products include a printed COA with shipment. PDF downloads are linked on each product page.</p>
                        <a href="/shop" style={{ display: 'inline-block', marginTop: '1.5rem', background: '#c4222f', color: '#fff', padding: '0.75rem 2rem', borderRadius: '0.5rem', fontWeight: 700, textDecoration: 'none' }}>Browse Products</a>
                      </div>
                    </div>
                  } />
                  <Route path="/wholesale" element={
                    <div className="wholesale-page" style={{ padding: '4rem 1.5rem', maxWidth: 800, margin: '0 auto' }}>
                      <h1 style={{ fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>Wholesale & Business Applications</h1>
                      <p style={{ color: '#8c8c8f', textAlign: 'center', marginBottom: '2.5rem' }}>Partner with Astro Research for bulk compound orders and specialized lab supply.</p>
                      <form style={{ background: '#0b0b0c', border: '1px solid #2a2a2c', borderRadius: '0.75rem', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }} onSubmit={e => { e.preventDefault(); alert('Application submitted successfully!'); }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div><label style={{ display: 'block', fontSize: '0.8rem', color: '#8c8c8f', marginBottom: '0.4rem' }}>Business Name</label><input required style={{ width: '100%', background: '#121214', border: '1px solid #2a2a2c', color: '#fff', padding: '0.7rem', borderRadius: '0.5rem' }} /></div>
                          <div><label style={{ display: 'block', fontSize: '0.8rem', color: '#8c8c8f', marginBottom: '0.4rem' }}>Contact Name</label><input required style={{ width: '100%', background: '#121214', border: '1px solid #2a2a2c', color: '#fff', padding: '0.7rem', borderRadius: '0.5rem' }} /></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div><label style={{ display: 'block', fontSize: '0.8rem', color: '#8c8c8f', marginBottom: '0.4rem' }}>Email</label><input required type="email" style={{ width: '100%', background: '#121214', border: '1px solid #2a2a2c', color: '#fff', padding: '0.7rem', borderRadius: '0.5rem' }} /></div>
                          <div><label style={{ display: 'block', fontSize: '0.8rem', color: '#8c8c8f', marginBottom: '0.4rem' }}>Phone</label><input style={{ width: '100%', background: '#121214', border: '1px solid #2a2a2c', color: '#fff', padding: '0.7rem', borderRadius: '0.5rem' }} /></div>
                        </div>
                        <div><label style={{ display: 'block', fontSize: '0.8rem', color: '#8c8c8f', marginBottom: '0.4rem' }}>Expected Monthly Volume</label><select style={{ width: '100%', background: '#121214', border: '1px solid #2a2a2c', color: '#fff', padding: '0.7rem', borderRadius: '0.5rem' }}><option>Under $1,000</option><option>$1,000 - $5,000</option><option>$5,000 - $20,000</option><option>$20,000+</option></select></div>
                        <div><label style={{ display: 'block', fontSize: '0.8rem', color: '#8c8c8f', marginBottom: '0.4rem' }}>Additional Details</label><textarea rows={4} style={{ width: '100%', background: '#121214', border: '1px solid #2a2a2c', color: '#fff', padding: '0.7rem', borderRadius: '0.5rem' }} /></div>
                        <button type="submit" style={{ background: '#c4222f', color: '#fff', border: 'none', padding: '0.875rem', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}>Submit Wholesale Application</button>
                      </form>
                    </div>
                  } />
                  <Route path="/policies" element={
                    <div style={{ padding: '4rem 1.5rem', maxWidth: 900, margin: '0 auto' }}>
                      <h1 style={{ fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>Store Policies & Information</h1>
                      <div style={{ background: '#0b0b0c', border: '1px solid #2a2a2c', borderRadius: '0.75rem', padding: '2rem', color: '#8c8c8f', lineHeight: 1.7 }}>
                        <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Shipping Info</h3>
                        <p style={{ marginBottom: '1.5rem' }}>Orders ship within 24 hours of payment confirmation. Free shipping on orders over $250. Shipped in plain, unmarked packages.</p>
                        <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Refund Policy</h3>
                        <p style={{ marginBottom: '1.5rem' }}>Due to the nature of research chemicals, unopened vials can be returned within 14 days of receipt for store credit or replacement.</p>
                        <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Terms of Service</h3>
                        <p>All products sold are intended strictly for laboratory research use by qualified personnel. Not for human or veterinary administration.</p>
                      </div>
                    </div>
                  } />
                  <Route path="*" element={
                    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                      <h1 style={{ color: '#ededed', fontSize: '3rem', fontWeight: 800 }}>404</h1>
                      <p style={{ color: '#8c8c8f' }}>Page not found</p>
                      <a href="/" style={{ color: '#c4222f', textDecoration: 'none', fontWeight: 700 }}>← Go Home</a>
                    </div>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
            <FloatingAssistant />
          </CartProvider>
        </AuthProvider>
      </SiteProvider>
    </BrowserRouter>
  );
};

export default App;
