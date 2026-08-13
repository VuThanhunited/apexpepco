import { Link, useNavigate } from 'react-router-dom';
import { useCart, resolveImageUrl } from '../contexts/CartContext';
import { useSite } from '../contexts/SiteContext';
import './CartDrawer.css';

const CartDrawer = ({ open, isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, subtotal, clearCart, isCartOpen, setIsCartOpen } = useCart();
  const { settings } = useSite();
  const navigate = useNavigate();

  const drawerOpen = open !== undefined ? open : (isOpen !== undefined ? isOpen : isCartOpen);
  const handleClose = onClose || (() => setIsCartOpen(false));

  const shippingCost = settings?.shippingCost || 15;
  const total = subtotal + shippingCost;

  const handleCheckout = () => { handleClose(); navigate('/checkout'); };

  return (
    <>
      {drawerOpen && <div className="cart-overlay" onClick={handleClose} />}
      <div className={`cart-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Your Cart <span className="cart-count">{items.length} items</span></h3>
          <button className="cart-close" id="cart-close-btn" onClick={handleClose}>✕</button>
        </div>



        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <p>Your cart is empty</p>
              <Link to="/shop" className="btn-shop-now" onClick={handleClose}>Browse Products</Link>
            </div>
          ) : (
            items.map(item => (
              <div key={item.key} className="cart-item">
                <div className="cart-item-img">
                  <img
                    src={resolveImageUrl(item.productImage || item.imageUrl || item.image) || '/logo-icon-apex.jpg'}
                    alt={item.productName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/logo-icon-apex.jpg';
                    }}
                  />
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
              <div className="summary-row"><span>Shipping</span><span>${shippingCost.toFixed(2)}</span></div>
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
