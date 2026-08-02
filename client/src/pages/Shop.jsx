import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const LIMIT = 12;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (search) params.set('search', search);
        params.set('page', page);
        params.set('limit', LIMIT);
        const [prodRes, catRes] = await Promise.all([
          api.get(`/products?${params}`),
          api.get('/categories'),
        ]);
        setProducts(prodRes.data.products || []);
        setTotal(prodRes.data.total || 0);
        setCategories(catRes.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [category, search, page]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="shop-page">
      <div className="shop-header">
        <div className="shop-header-content">
          <h1>Research Compounds</h1>
          <p>Laboratory-grade compounds with 99%+ purity</p>
        </div>
      </div>

      <div className="shop-container">
        {/* Sidebar Filters */}
        <aside className="shop-sidebar">
          <div className="filter-group">
            <h3>Categories</h3>
            <button
              className={`filter-btn ${!category ? 'active' : ''}`}
              onClick={() => setParam('category', '')}
            >All Products <span className="filter-count">{total}</span></button>
            {categories.map(cat => (
              <button
                key={cat._id}
                className={`filter-btn ${category === cat._id ? 'active' : ''}`}
                onClick={() => setParam('category', cat._id)}
              >{cat.name}</button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="shop-main">
          <div className="shop-toolbar">
            <div className="shop-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                type="text"
                placeholder="Search compounds..."
                value={search}
                onChange={e => setParam('search', e.target.value)}
                id="shop-search-input"
              />
            </div>
            <div className="shop-results-count">
              {loading ? 'Loading...' : `${total} product${total !== 1 ? 's' : ''} found`}
            </div>
          </div>

          {loading ? (
            <div className="shop-loading">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="product-skeleton" />)}
            </div>
          ) : products.length > 0 ? (
            <div className="shop-grid">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="shop-empty">
              <div className="shop-empty-icon">🔬</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms.</p>
              <button className="btn-clear-filters" onClick={() => setSearchParams({})}>Clear Filters</button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="shop-pagination">
              <button
                className="page-btn"
                disabled={page <= 1}
                onClick={() => setParam('page', page - 1)}
              >← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`page-btn ${p === page ? 'active' : ''}`}
                  onClick={() => setParam('page', p)}
                >{p}</button>
              ))}
              <button
                className="page-btn"
                disabled={page >= totalPages}
                onClick={() => setParam('page', page + 1)}
              >Next →</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
