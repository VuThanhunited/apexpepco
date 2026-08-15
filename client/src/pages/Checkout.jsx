import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart, resolveImageUrl } from '../contexts/CartContext';
import { useSite } from '../contexts/SiteContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import './Checkout.css';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { settings } = useSite();
  const { user } = useAuth();

  const threshold = settings?.freeShippingThreshold || 250;
  const shippingCost = subtotal >= threshold ? 0 : (settings?.shippingCost || 15);
  const estimatedTax = Number((subtotal * 0.06).toFixed(2));
  const total = subtotal + shippingCost + estimatedTax;

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    country: user?.country || 'US',
    paymentMethod: 'cash_app',
    zelleNote: '',
    couponCode: '',
  });

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        firstName: prev.firstName || user.firstName || '',
        lastName: prev.lastName || user.lastName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address || '',
        city: prev.city || user.city || '',
        state: prev.state || user.state || '',
        zipCode: prev.zipCode || user.zipCode || '',
        country: prev.country || user.country || 'US',
      }));
    }
  }, [user]);

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successOrder, setSuccessOrder] = useState(null);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const isFormValid = Boolean(
    form.firstName && form.lastName && form.email && form.address && form.city && form.state && form.zipCode
  );

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!form.couponCode.trim()) return;
    if (form.couponCode.trim().toUpperCase() === 'ASTRO10') {
      setAppliedCoupon({ code: 'ASTRO10', discount: subtotal * 0.1 });
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError('');

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
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
        },
        guestEmail: form.email,
        paymentMethod: form.paymentMethod,
        totalAmount: total,
      });

      clearCart();
      setSuccessOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please verify your info.');
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div className="checkout-success">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h1>{settings?.checkoutPage?.successTitle || 'Order Confirmed!'}</h1>
          <p className="order-number">
            Order Reference: <strong>#{successOrder.orderNumber || successOrder._id?.slice(-8).toUpperCase()}</strong>
          </p>
          <p className="success-msg">
            {settings?.checkoutPage?.successText
              ? settings.checkoutPage.successText
              : <>Thank you for your order, <strong>{form.firstName}</strong>. A confirmation email has been sent to <strong>{form.email}</strong>.</>
            }
          </p>
          
          <div className="order-receipt-summary">
            <h3>Receipt Summary</h3>
            <div className="receipt-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="receipt-row">
              <span>Shipping (2-day):</span>
              <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="receipt-row">
              <span>Estimated Tax:</span>
              <span>${estimatedTax.toFixed(2)}</span>
            </div>
            <div className="receipt-row total">
              <span>Total Paid:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/shop" className="btn-success-shop">
              Continue Shopping
            </Link>
            <Link to="/account" className="btn-success-account">
              View Order Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="empty-cart-card">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Add items to your requisition cart before proceeding to checkout.</p>
          <Link to="/shop" className="btn-browse-catalog">Browse Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Left Column: Form */}
        <div className="checkout-form-col">
          <h1 className="checkout-main-title">Checkout</h1>
          {error && <div className="checkout-error">{error}</div>}

          <form onSubmit={handleSubmit} id="checkout-form">
            {/* Contact & Shipping */}
            <div className="checkout-section">
              <h2>1. Contact & Shipping Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    required
                    placeholder="John"
                    value={form.firstName}
                    onChange={set('firstName')}
                    id="checkout-firstname"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    required
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={set('lastName')}
                    id="checkout-lastname"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    required
                    type="email"
                    placeholder="johndoe@example.com"
                    value={form.email}
                    onChange={set('email')}
                    id="checkout-email"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    required
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={set('phone')}
                    id="checkout-phone"
                  />
                </div>
              </div>

              <div className="form-group margin-top-sm">
                <label>Street Address *</label>
                <input
                  required
                  placeholder="123 Research Parkway, Suite 400"
                  value={form.address}
                  onChange={set('address')}
                  id="checkout-address"
                />
              </div>

              <div className="form-row margin-top-sm">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    required
                    placeholder="New York"
                    value={form.city}
                    onChange={set('city')}
                    id="checkout-city"
                  />
                </div>
                <div className="form-group">
                  <label>State / Province *</label>
                  <input
                    required
                    placeholder="NY"
                    value={form.state}
                    onChange={set('state')}
                    id="checkout-state"
                  />
                </div>
              </div>

              <div className="form-row margin-top-sm">
                <div className="form-group">
                  <label>ZIP / Postal Code *</label>
                  <input
                    required
                    placeholder="10001"
                    value={form.zipCode}
                    onChange={set('zipCode')}
                    id="checkout-zip"
                  />
                </div>
                <div className="form-group">
                  <label>Country *</label>
                  <select value={form.country} onChange={set('country')} id="checkout-country">
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Details Section */}
            <div className="checkout-section">
              <div className="payment-section-header">
                <h2>Payment Details</h2>
                <span className="lock-badge">🔒</span>
              </div>

              {!isFormValid && (
                <div className="payment-unlock-banner">
                  <div className="lock-icon">🔒</div>
                  <div>
                    <strong>Complete your details first</strong>
                    <p>Fill in your contact and shipping information above to unlock payment.</p>
                  </div>
                </div>
              )}

              <div className="payment-options-list">

                {/* Option 1: Zelle */}
                <label className={`payment-option-row ${form.paymentMethod === 'zelle' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="zelle"
                    checked={form.paymentMethod === 'zelle'}
                    onChange={set('paymentMethod')}
                  />
                  <div className="payment-option-body">
                    <div className="option-title-line">
                      <span className="zelle-badge">Z</span>
                      <span className="method-name">Zelle</span>
                    </div>
                    <span className="method-sub">Pay via Zelle to our registered account</span>
                  </div>
                  <span className="radio-circle"></span>
                </label>

                {/* Option 2: Cash App Pay */}
                <label className={`payment-option-row ${form.paymentMethod === 'cash_app' ? 'selected green-glow' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_app"
                    checked={form.paymentMethod === 'cash_app'}
                    onChange={set('paymentMethod')}
                  />
                  <div className="payment-option-body">
                    <div className="option-title-line">
                      <span className="cashapp-badge">$</span>
                      <span className="method-name">Cash App Pay</span>
                    </div>
                    <span className="method-sub">Pay @Apexpepco from the Cash App</span>
                  </div>
                  <span className="radio-circle"></span>
                </label>

                {/* Option 3: Venmo */}
                <label className={`payment-option-row ${form.paymentMethod === 'venmo' ? 'selected blue-glow' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="venmo"
                    checked={form.paymentMethod === 'venmo'}
                    onChange={set('paymentMethod')}
                  />
                  <div className="payment-option-body">
                    <div className="option-title-line">
                      <span className="venmo-badge">V</span>
                      <span className="method-name">Venmo</span>
                    </div>
                    <span className="method-sub">Pay @Apexpepco on Venmo</span>
                  </div>
                  <span className="radio-circle"></span>
                </label>
              </div>

              {/* Dynamic Payment Instruction Box */}
              {form.paymentMethod === 'cash_app' && (
                <div className="payment-instruction-box cash-app-box">
                  <div className="instruction-header">
                    <span className="icon-bolt">⚡</span>
                    <h3>How Cash App Pay checkout works</h3>
                  </div>
                  <ol className="instruction-steps">
                    <li>Click <strong>"Place Order — Pay with Cash App"</strong> below.</li>
                    <li>Cash App opens to <strong>$Apexpepco</strong> with your total pre-filled (mobile) or shown (desktop).</li>
                    <li>Send the payment from your Cash App account.</li>
                    <li>Your order is held as <strong>Pending Payment</strong> — items ship once we confirm the deposit.</li>
                  </ol>
                </div>
              )}

              {form.paymentMethod === 'venmo' && (
                <div className="payment-instruction-box venmo-box">
                  <div className="instruction-header">
                    <span className="icon-bolt">⚡</span>
                    <h3>How Venmo checkout works</h3>
                  </div>
                  <ol className="instruction-steps">
                    <li>Click <strong>"Place Order — Pay with Venmo"</strong> below.</li>
                    <li>Send payment to <strong>@Apexpepco</strong> on Venmo.</li>
                    <li>Include your Order Reference Number in the payment note.</li>
                    <li>Your order is held as <strong>Pending Payment</strong> — items ship once we confirm deposit.</li>
                  </ol>
                </div>
              )}


              {form.paymentMethod === 'zelle' && (
                <div className="payment-instruction-box" style={{ borderColor: '#6c3fa4', background: 'rgba(108,63,164,0.08)' }}>
                  <div className="instruction-header">
                    <span className="icon-bolt">⚡</span>
                    <h3>How Zelle checkout works</h3>
                  </div>
                  <ol className="instruction-steps">
                    <li>Click <strong>"Place Order — Pay with Zelle"</strong> below.</li>
                    <li>Open your banking app and send payment via <strong>Zelle</strong> to our registered account.</li>
                    <li>Include your Order Reference Number in the memo/note field.</li>
                    <li>Your order is held as <strong>Pending Payment</strong> — items ship once we confirm the deposit.</li>
                  </ol>
                </div>
              )}

            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              className="btn-place-order-cyan"
              id="place-order-btn"
              disabled={loading}
            >
              {loading
                ? 'PROCESSING ORDER...'
                : form.paymentMethod === 'cash_app'
                ? `PLACE ORDER — PAY WITH CASH APP · $${total.toFixed(2)}`
                : form.paymentMethod === 'venmo'
                ? `PLACE ORDER — PAY WITH VENMO · $${total.toFixed(2)}`
                : form.paymentMethod === 'zelle'
                ? `PLACE ORDER — PAY WITH ZELLE · $${total.toFixed(2)}`
                : `PLACE ORDER · $${total.toFixed(2)}`
              }
            </button>
          </form>
        </div>

        {/* Right Column: Sticky Order Summary */}
        <div className="checkout-summary-col">
          <div className="sticky-order-summary-card">
            <h2 className="summary-title">Order Summary</h2>

            {/* Cart Items List */}
            <div className="summary-items-list">
              {items.map(item => {
                const imgUrl = resolveImageUrl(item.productImage || item.imageUrl || item.image || item.product?.imageUrl || item.product?.image);
                return (
                  <div key={item.key} className="summary-item-row">
                    <div className="summary-item-thumb">
                      <img
                        src={imgUrl || '/product-default.jpg'}
                        alt={item.productName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/product-default.jpg';
                        }}
                      />
                    </div>
                    <div className="summary-item-details">
                      <p className="item-name">{item.productName} <span className="qty-tag">[x{item.quantity}]</span></p>
                      {item.variant && <span className="item-variant">{item.variant.name}</span>}
                    </div>
                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="coupon-code-form">
              <div className="coupon-input-group">
                <input
                  type="text"
                  placeholder="Enter code..."
                  value={form.couponCode}
                  onChange={set('couponCode')}
                />
                <button type="submit" className="btn-apply-coupon">Apply</button>
              </div>
              {appliedCoupon && <span className="coupon-success">✓ 10% Discount Applied!</span>}
              {couponError && <span className="coupon-error">{couponError}</span>}
            </form>

            {/* Breakdown lines */}
            <div className="summary-breakdown">
              <div className="breakdown-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="breakdown-row">
                <span>Shipping (2-day shipping)</span>
                <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="breakdown-row">
                <span>Estimated Tax</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>
            </div>

            <div className="summary-total-row">
              <span>Total</span>
              <span className="total-price">${total.toFixed(2)}</span>
            </div>

            {/* Reward Points Pill */}
            <div className="rewards-points-badge">
              <span>✦ You'll earn +{Math.round(total)} points with this order</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
