import { Link } from 'react-router-dom';
import { useCart, resolveImageUrl } from '../contexts/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const minPrice = product.variants?.length
    ? Math.min(...product.variants.map(v => v.price))
    : product.basePrice || 0;
  const maxPrice = product.variants?.length
    ? Math.max(...product.variants.map(v => v.price))
    : product.basePrice || 0;
  const priceRange = minPrice === maxPrice ? `$${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)} – $${maxPrice.toFixed(2)}`;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const firstVariant = product.variants?.[0] || null;
    addItem(product, firstVariant, 1);
  };

  const imgPath = product.imageUrl || product.image;
  const imgUrl = resolveImageUrl(imgPath);

  return (
    <Link to={`/product/${product.slug}`} className="product-card" id={`product-${product.slug}`}>
      <div className="product-img-wrapper">
        {imgUrl
          ? <img src={imgUrl} alt={product.name} loading="lazy" />
          : <div className="product-img-placeholder"><span>🔬</span></div>
        }
        <div className="product-badges">
          <span className="badge featured-cyan-badge">FEATURED</span>
          {!product.inStock && <span className="badge oos-badge">Out of Stock</span>}
        </div>
        <div className="product-card-overlay">
          <button
            className="btn-quick-add"
            id={`quick-add-${product.slug}`}
            onClick={handleQuickAdd}
            disabled={!product.inStock}
          >
            {product.inStock ? '+ Add to Cart' : 'Out of Stock'}
          </button>
          <span className="btn-view-details">
            View Details →
          </span>
        </div>
      </div>
      <div className="product-info">
        {product.category?.name && (
          <span className="product-category">{product.category.name}</span>
        )}
        <h3 className="product-name">{product.name}</h3>
        {product.shortDescription && (
          <p className="product-desc">{product.shortDescription}</p>
        )}
        <div className="product-footer">
          <span className="product-price">{priceRange}</span>
          {product.variants?.length > 1 && (
            <span className="product-variants">{product.variants.length} options</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
