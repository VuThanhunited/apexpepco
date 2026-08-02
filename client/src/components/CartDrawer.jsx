import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useSite } from '../contexts/SiteContext';
import './CartDrawer.css';

const CartDrawer = ({ open, onClose }) => {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const { settings } = useSite();
  const navigate = useNavigate();
  const threshold = settings?.freeShippingThreshold || 250;
  const shippingCost = settings?.shippingCost || 15;
  const remaining = Math.max(0, threshold - subtotal);
  const shipping = subtotal >= threshold ? 0 : shippingCost;
  const total = subtotal + shipping;

  const handleCheckout = () => { onClose(); navigate('/checkout'); };

  return (
    <>
      {open && <div className="cart-overlay" onClick={onClose} />}
      <div className={`cart-drawer ${open ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Your Cart <span className="cart-count">{items.length} items</span></h3>
          <button className="cart-close" id="cart-close-btn" onClick={onClose}>✕</button>
        </div>

        {remaining > 0 && (
          <div className="free-ship-bar">
            <div className="free-ship-text">
              <span>Add <strong>${remaining.toFixed(2)}</strong> more for free shipping!</span>
            </div>
            <div className="free-ship-progress">
              <div className="free-ship-fill" style={{ width: `${Math.min(100, (subtotal / threshold) * 100)}%` }} />
            </div>
          </div>
        )}
        {remaining === 0 && items.length > 0 && (
          <div className="free-ship-earned">🚚 You've earned free shipping!</div>
        )}

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <p>Your cart is empty</p>
              <Link to="/shop" className="btn-shop-now" onClick={onClose}>Browse Products</Link>
            </div>
          ) : (
            items.map(item => (
              <div key={item.key} className="cart-item">
                <div className="cart-item-img">
                  {item.productImage
                    ? <img src={item.productImage.startsWith('/') ? item.productImage : `/uploads/${item.productImage}`} alt={item.productName} />
                    : <div className="img-placeholder">🔬</div>}
                </div>
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.productName}</p>
                  {item.variant && <p className="cart-item-variant">{item.variant.name}</p>}
                  <p className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="qty-controls">
                    <button onClick={() => updateQuantity(item.key, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.key, item.quantity + 1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeItem(item.key)}>✕</button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="summary-row total-row"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
            <button className="btn-checkout" id="cart-checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
            <button className="btn-clear-cart" onClick={clearCart}>Clear Cart</button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
