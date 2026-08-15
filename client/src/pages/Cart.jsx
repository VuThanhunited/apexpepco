import { Link, useNavigate } from 'react-router-dom';
import { useCart, resolveImageUrl } from '../contexts/CartContext';
import { useSite } from '../contexts/SiteContext';
import './Cart.css';

const Cart = () => {
  const { items, removeItem, updateQuantity, subtotal, clearCart, itemCount } = useCart();
  const { settings } = useSite();
  const cartPage = settings?.cartPage || {};
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="cart-page-empty">
        <div className="cart-empty-card">
          <div className="cart-empty-icon">🛒</div>
          <h2>{cartPage.emptyTitle || 'Your Cart is Empty'}</h2>
          <p>{cartPage.emptyText || 'Explore our premium research catalog and add items to your requisition cart.'}</p>
          <Link to="/shop" className="btn-browse-shop">{cartPage.emptyButtonText || 'Browse Products'}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-container">
        <h1 className="cart-page-title">{cartPage.title || 'Requisition Cart'}</h1>

        <div className="cart-grid">
          {/* Left Column: Cart Items List */}
          <div className="cart-items-section">
            <div className="cart-table-header">
              <div className="col-product">PRODUCT</div>
              <div className="col-quantity">QUANTITY</div>
              <div className="col-total">TOTAL</div>
            </div>

            <div className="cart-items-list">
              {items.map((item) => (
                <div key={item.key} className="cart-page-item">
                  {/* Product Info */}
                  <div className="cart-item-product">
                    <div className="cart-item-thumbnail">
                      <img
                        src={resolveImageUrl(item.productImage || item.imageUrl || item.image) || '/product-default.jpg'}
                        alt={item.productName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/product-default.jpg';
                        }}
                      />
                    </div>
                    <div className="cart-item-meta">
                      <Link to={`/product/${item.productSlug}`} className="cart-item-title">
                        {item.productName}
                      </Link>
                      {item.variant && (
                        <span className="cart-item-variant-tag">{item.variant.name}</span>
                      )}
                      <span className="cart-item-unit-price">${Number(item.price).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="cart-item-qty">
                    <div className="qty-picker">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Line Total & Remove */}
                  <div className="cart-item-line-total">
                    <span className="price-amount">${(item.price * item.quantity).toFixed(2)}</span>
                    <button
                      type="button"
                      className="btn-remove-item"
                      onClick={() => removeItem(item.key)}
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="cart-bottom-actions">
              <Link to="/shop" className="btn-continue-shopping">
                ← Continue Shopping
              </Link>
              <button type="button" className="btn-clear-all" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="cart-summary-section">
            <div className="order-summary-card">
              <h2>Order Summary</h2>

              <div className="summary-rows">
                <div className="summary-line">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                  <span className="val-subtotal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-line">
                  <span>Shipping</span>
                  <span className="val-muted">Calculated at checkout</span>
                </div>
                <div className="summary-line">
                  <span>Tax</span>
                  <span className="val-muted">Calculated at checkout</span>
                </div>
              </div>

              <div className="summary-divider" />

              <div className="summary-total-line">
                <span>Estimated Total</span>
                <span className="total-amount">${subtotal.toFixed(2)}</span>
              </div>

              <button
                type="button"
                className="btn-proceed-checkout"
                onClick={() => navigate('/checkout')}
                id="cart-proceed-checkout-btn"
              >
                {cartPage.checkoutButtonText || 'PROCEED TO CHECKOUT'} →
              </button>

              <p className="checkout-security-note">
                Secure checkout powered by Apex Pep Co Processing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
