import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useSite } from '../contexts/SiteContext';
import api from '../utils/api';
import './Checkout.css';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { settings } = useSite();
  const navigate = useNavigate();
  const threshold = settings?.freeShippingThreshold || 250;
  const shippingCost = settings?.shippingCost || 15;
  const shipping = subtotal >= threshold ? 0 : shippingCost;
  const total = subtotal + shipping;

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '', country: 'US' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true); setError('');
    try {
      const orderItems = items.map(i => ({
        product: i.productId,
        productName: i.productName,
        productImage: i.productImage,
        variant: i.variant,
        quantity: i.quantity,
        price: i.price,
      }));
      const { data } = await api.post('/orders', {
        items: orderItems,
        shippingAddress: form,
        guestEmail: form.email,
      });
      clearCart();
      setSuccess(data.orderNumber);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  if (success) return (
    <div className="checkout-success">
      <div className="success-icon">✓</div>
      <h1>Order Placed!</h1>
      <p>Order number: <strong>{success}</strong></p>
      <p className="success-sub">Thank you for your order. We'll dispatch it within 24 hours.</p>
      <Link to="/shop" className="btn-continue">Continue Shopping</Link>
    </div>
  );

  if (items.length === 0) return (
    <div className="checkout-empty">
      <h2>Your cart is empty</h2>
      <Link to="/shop" className="btn-continue">Browse Products</Link>
    </div>
  );

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-form-col">
          <h1>Checkout</h1>
          {error && <div className="checkout-error">{error}</div>}
          <form onSubmit={handleSubmit} id="checkout-form">
            <div className="checkout-section">
              <h2>Contact Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input required placeholder="John" value={form.firstName} onChange={set('firstName')} id="checkout-firstname" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input required placeholder="Doe" value={form.lastName} onChange={set('lastName')} id="checkout-lastname" />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input required type="email" placeholder="email@example.com" value={form.email} onChange={set('email')} id="checkout-email" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" placeholder="+1 555 000 0000" value={form.phone} onChange={set('phone')} id="checkout-phone" />
              </div>
            </div>
            <div className="checkout-section">
              <h2>Shipping Address</h2>
              <div className="form-group">
                <label>Street Address</label>
                <input required placeholder="123 Main St" value={form.address} onChange={set('address')} id="checkout-address" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input required placeholder="New York" value={form.city} onChange={set('city')} id="checkout-city" />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input required placeholder="NY" value={form.state} onChange={set('state')} id="checkout-state" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input required placeholder="10001" value={form.zipCode} onChange={set('zipCode')} id="checkout-zip" />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <select value={form.country} onChange={set('country')} id="checkout-country">
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="checkout-disclaimer">
              <p>⚠️ By placing this order, you confirm that you are a qualified researcher and these products are for laboratory research use only. Not for human or animal consumption.</p>
            </div>
            <button type="submit" className="btn-place-order" id="place-order-btn" disabled={loading}>
              {loading ? 'Processing...' : `Place Order · $${total.toFixed(2)}`}
            </button>
          </form>
        </div>
        <div className="checkout-summary-col">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {items.map(item => (
                <div key={item.key} className="summary-item">
                  <div className="summary-item-img">
                    {item.productImage
                      ? <img src={`/uploads/${item.productImage}`} alt={item.productName} />
                      : <span>🔬</span>}
                  </div>
                  <div className="summary-item-info">
                    <p>{item.productName}</p>
                    {item.variant && <small>{item.variant.name}</small>}
                    <small>Qty: {item.quantity}</small>
                  </div>
                  <span className="summary-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-totals">
              <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
