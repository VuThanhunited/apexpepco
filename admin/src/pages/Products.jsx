import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 15;

  const emptyForm = { name: '', slug: '', shortDescription: '', description: '', researchInfo: '', category: '', image: '', basePrice: 0, purity: '99%+', isFeatured: false, inStock: true, variants: [], tags: '' };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (search) params.set('search', search);
      const [prodRes, catRes] = await Promise.all([api.get(`/products?${params}`), api.get('/categories')]);
      setProducts(prodRes.data.products || []);
      setTotal(prodRes.data.total || 0);
      setCategories(catRes.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openNew = () => { setForm(emptyForm); setEditing(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({ ...p, tags: p.tags?.join(', ') || '', category: p.category?._id || p.category || '' });
    setEditing(p._id);
    setShowForm(true);
  };

  const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
      if (editing) await api.put(`/products/${editing}`, payload);
      else await api.post('/products', payload);
      showToast(editing ? 'Product updated!' : 'Product created!');
      setShowForm(false); fetchProducts();
    } catch (err) { showToast(err.response?.data?.message || 'Error saving product', 'error'); }
    finally { setSaving(false); }
  };

  const deleteProduct = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await api.delete(`/products/${id}`); showToast('Product deleted'); fetchProducts(); }
    catch (err) { showToast('Delete failed', 'error'); }
  };

  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, { name: '', price: 0, stock: 0, sku: '' }] }));
  const updateVariant = (i, key, val) => {
    const variants = [...form.variants];
    variants[i] = { ...variants[i], [key]: key === 'price' || key === 'stock' ? parseFloat(val) || 0 : val };
    setForm(f => ({ ...f, variants }));
  };
  const removeVariant = (i) => setForm(f => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }));

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="admin-products-page">
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>}

      <div className="admin-page-header">
        <div>
          <h1>Products <span className="count-badge">{total}</span></h1>
          <p>Manage your research compound catalog</p>
        </div>
        <button className="btn-admin-primary" onClick={openNew} id="add-product-btn">+ Add Product</button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input id="product-search" type="text" placeholder="Search products..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-spinner"></div></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Purity</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan="7" className="table-empty">No products found</td></tr>
              ) : products.map(p => (
                <tr key={p._id}>
                  <td>
                    <div className="product-cell">
                      <div className="product-thumb">{p.image ? <img src={p.image.startsWith('/') ? p.image : `/uploads/${p.image}`} alt="" /> : <span>🔬</span>}</div>
                      <div>
                        <strong>{p.name}</strong>
                        <small>{p.slug}</small>
                      </div>
                    </div>
                  </td>
                  <td><span className="table-tag">{p.category?.name || '—'}</span></td>
                  <td>
                    {p.variants?.length
                      ? `$${Math.min(...p.variants.map(v => v.price)).toFixed(2)}+`
                      : `$${p.basePrice?.toFixed(2) || '0.00'}`}
                  </td>
                  <td>{p.purity || '—'}</td>
                  <td><span className={`status-dot ${p.inStock ? 'in' : 'out'}`}>{p.inStock ? 'In Stock' : 'OOS'}</span></td>
                  <td><span className={`featured-dot ${p.isFeatured ? 'yes' : ''}`}>{p.isFeatured ? '⭐' : '—'}</span></td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-edit" onClick={() => openEdit(p)} id={`edit-${p._id}`}>Edit</button>
                      <button className="btn-delete" onClick={() => deleteProduct(p._id, p.name)} id={`delete-${p._id}`}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>{editing ? 'Edit Product' : 'New Product'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="admin-modal-body" id="product-form">
              <div className="form-grid">
                <div className="form-col">
                  <div className="form-field">
                    <label>Product Name *</label>
                    <input required id="pf-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: !editing ? generateSlug(e.target.value) : f.slug }))} />
                  </div>
                  <div className="form-field">
                    <label>Slug *</label>
                    <input required id="pf-slug" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
                  </div>
                  <div className="form-field">
                    <label>Short Description</label>
                    <input id="pf-shortdesc" value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} />
                  </div>
                  <div className="form-field">
                    <label>Description</label>
                    <textarea id="pf-desc" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div className="form-field">
                    <label>Research Info</label>
                    <textarea id="pf-research" rows={3} value={form.researchInfo} onChange={e => setForm(f => ({ ...f, researchInfo: e.target.value }))} />
                  </div>
                </div>
                <div className="form-col">
                  <div className="form-field">
                    <label>Category</label>
                    <select id="pf-category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                      <option value="">— No Category —</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Image URL</label>
                    <input id="pf-image" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="/uploads/... or https://..." />
                  </div>
                  <div className="form-row-2">
                    <div className="form-field">
                      <label>Base Price ($)</label>
                      <input id="pf-price" type="number" step="0.01" value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: parseFloat(e.target.value) || 0 }))} />
                    </div>
                    <div className="form-field">
                      <label>Purity</label>
                      <input id="pf-purity" value={form.purity} onChange={e => setForm(f => ({ ...f, purity: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-toggles">
                    <label className="toggle-label">
                      <span>In Stock</span>
                      <label className="toggle"><input type="checkbox" id="pf-instock" checked={form.inStock} onChange={e => setForm(f => ({ ...f, inStock: e.target.checked }))} /><span className="toggle-slider"></span></label>
                    </label>
                    <label className="toggle-label">
                      <span>Featured</span>
                      <label className="toggle"><input type="checkbox" id="pf-featured" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} /><span className="toggle-slider"></span></label>
                    </label>
                  </div>
                  <div className="form-field">
                    <label>Tags (comma-separated)</label>
                    <input id="pf-tags" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="peptide, ghrelin, research" />
                  </div>

                  <div className="variants-section">
                    <div className="variants-header">
                      <h4>Variants</h4>
                      <button type="button" className="btn-add-variant" onClick={addVariant} id="add-variant-btn">+ Add</button>
                    </div>
                    {form.variants.map((v, i) => (
                      <div key={i} className="variant-row-admin">
                        <input placeholder="Name (e.g. 5mg)" value={v.name} onChange={e => updateVariant(i, 'name', e.target.value)} />
                        <input placeholder="Price" type="number" step="0.01" value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)} />
                        <input placeholder="Stock" type="number" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} />
                        <button type="button" className="btn-remove-var" onClick={() => removeVariant(i)}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-admin-primary" id="product-submit-btn" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
