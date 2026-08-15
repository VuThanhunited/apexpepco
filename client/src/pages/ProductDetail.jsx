import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart, resolveImageUrl } from '../contexts/CartContext';
import { useSite } from '../contexts/SiteContext';
import api from '../utils/api';
import './ProductDetail.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { settings } = useSite();
  const pdp = settings?.productDetailPage || {};
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data);
        if (data.variants?.length) setSelectedVariant(data.variants[0]);
      } catch { navigate('/shop'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, selectedVariant, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const price = selectedVariant?.price ?? product?.basePrice ?? 0;

  if (loading) return <div className="page-loader"><div className="loader-ring"></div></div>;
  if (!product) return null;

  const mainImgUrl = resolveImageUrl(product.imageUrl || product.image);

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Image */}
        <div className="product-detail-image">
          <img
            src={mainImgUrl || '/product-default.jpg'}
            alt={product.name}
            className="product-detail-vial-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/product-default.jpg';
            }}
          />
          {product.purity && <div className="detail-purity-badge">{product.purity} Purity</div>}
        </div>

        {/* Info */}
        <div className="product-detail-info">
          {product.category?.name && <span className="detail-category">{product.category.name}</span>}
          <h1>{product.name}</h1>
          <p className="detail-short-desc">{product.shortDescription}</p>

          <div className="detail-price">${price.toFixed(2)}</div>

          {product.variants?.length > 0 && (
            <div className="detail-variants">
              <label>Select Option:</label>
              <div className="variant-buttons">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    className={`variant-btn ${selectedVariant?.name === v.name ? 'active' : ''}`}
                    onClick={() => setSelectedVariant(v)}
                    id={`variant-${v.name.replace(/\s+/g, '-')}`}
                    disabled={v.stock === 0}
                  >{v.name}{v.stock === 0 ? ' (OOS)' : ''}</button>
                ))}
              </div>
            </div>
          )}

          <div className="detail-qty">
            <label>Quantity:</label>
            <div className="qty-row">
              <div className="qty-ctrl">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} id="qty-minus-btn">-</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} id="qty-plus-btn">+</button>
              </div>
              <button
                className={`btn-add-to-cart ${added ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                id="add-to-cart-btn"
              >
                {added ? '✓ Added!' : product.inStock ? (pdp.addToCartText || 'Add to Cart') : (pdp.outOfStockText || 'Out of Stock')}
              </button>
            </div>
          </div>

          <div className="detail-meta">
            <div className="meta-item"><span>Purity</span><strong>{product.purity || '99%+'}</strong></div>
            <div className="meta-item"><span>Stock</span><strong className={product.inStock ? 'in-stock' : 'out-stock'}>{product.inStock ? 'In Stock' : 'Out of Stock'}</strong></div>
            {product.coaFile && <div className="meta-item"><span>COA</span><a href={`/uploads/${product.coaFile}`} target="_blank" rel="noreferrer" className="coa-link">Download ↗</a></div>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="product-tabs-container">
        <div className="product-tabs">
          {['description', 'research', 'shipping'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              id={`tab-${tab}`}
            >{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
          ))}
        </div>
        <div className="tab-content">
          {activeTab === 'description' && <div className="tab-body" dangerouslySetInnerHTML={{ __html: product.description || '<p>No description available.</p>' }} />}
          {activeTab === 'research' && <div className="tab-body" dangerouslySetInnerHTML={{ __html: product.researchInfo || '<p>No research information available.</p>' }} />}
          {activeTab === 'shipping' && (
            <div className="tab-body">
              <p>Orders are dispatched within 24 hours of payment confirmation. Free shipping on orders over $250.</p>
              <p>All orders are shipped in plain, discreet packaging with no reference to the contents.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
