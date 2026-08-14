import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Bulk update image
  const [showBulkImage, setShowBulkImage] = useState(false);
  const [bulkImageUrl, setBulkImageUrl] = useState('');
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const bulkFileRef = useRef(null);
  const [bulkUploading, setBulkUploading] = useState(false);

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

  const uploadImage = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setImageUploading(true);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm(f => ({ ...f, image: res.data.url }));
      showToast('Ảnh đã được tải lên!', 'success');
    } catch (err) {
      showToast('Upload ảnh thất bại', 'error');
    } finally {
      setImageUploading(false);
    }
  };

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

  const uploadBulkImage = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setBulkUploading(true);
    try {
      const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setBulkImageUrl(res.data.url);
      showToast('Ảnh đã được tải lên!', 'success');
    } catch {
      showToast('Upload ảnh thất bại', 'error');
    } finally {
      setBulkUploading(false);
    }
  };

  const handleBulkUpdateImage = async () => {
    if (!bulkImageUrl.trim()) { showToast('Vui lòng nhập URL ảnh hoặc upload ảnh', 'error'); return; }
    if (!confirm(`Xác nhận cập nhật ảnh cho TẤT CẢ ${total} sản phẩm?`)) return;
    setBulkUpdating(true);
    try {
      // Fetch all products (no pagination limit)
      const { data } = await api.get('/products?limit=1000&page=1');
      const allProducts = data.products || [];
      await Promise.all(allProducts.map(p => api.put(`/products/${p._id}`, { ...p, image: bulkImageUrl.trim(), category: p.category?._id || p.category || '' })));
      showToast(`✅ Đã cập nhật ảnh cho ${allProducts.length} sản phẩm!`, 'success');
      setShowBulkImage(false);
      setBulkImageUrl('');
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Bulk update thất bại', 'error');
    } finally {
      setBulkUpdating(false);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="admin-products-page">
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>}

      <div className="admin-page-header">
        <div>
          <h1>Products <span className="count-badge">{total}</span></h1>
          <p>Manage your research compound catalog</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-bulk-img" onClick={() => setShowBulkImage(true)} id="bulk-image-btn" title="Cập nhật ảnh cho tất cả sản phẩm">🖼️ Bulk Image</button>
          <button className="btn-admin-primary" onClick={openNew} id="add-product-btn">+ Add Product</button>
        </div>
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
                    <label>Hình ảnh sản phẩm</label>
                    <div className="image-upload-area">
                      {/* Preview */}
                      {form.image ? (
                        <div className="image-preview-wrap">
                          <img
                            src={form.image.startsWith('/') ? form.image : (form.image.startsWith('http') ? form.image : `/uploads/${form.image}`)}
                            alt="Preview"
                            className="image-preview"
                          />
                          <button type="button" className="btn-remove-img" onClick={() => { setForm(f => ({ ...f, image: '' })); if (fileInputRef.current) fileInputRef.current.value = ''; }} title="Xoá ảnh">✕</button>
                        </div>
                      ) : (
                        <div className="image-placeholder" onClick={() => fileInputRef.current?.click()}>
                          <span className="upload-icon">📷</span>
                          <span>{imageUploading ? 'Đang tải lên...' : 'Nhấn để chọn ảnh'}</span>
                        </div>
                      )}
                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="pf-image-file"
                        onChange={e => uploadImage(e.target.files[0])}
                      />
                      {/* Action buttons */}
                      <div className="image-actions">
                        <button type="button" className="btn-upload-img" onClick={() => fileInputRef.current?.click()} disabled={imageUploading}>
                          {imageUploading ? '⏳ Đang upload...' : '📂 Chọn từ máy'}
                        </button>
                        <span className="or-divider">hoặc</span>
                        <input
                          id="pf-image"
                          className="url-input"
                          value={form.image}
                          onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                          placeholder="Nhập URL ảnh..."
                        />
                      </div>
                    </div>
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

      {/* Bulk Image Update Modal */}
      {showBulkImage && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setShowBulkImage(false)}>
          <div className="admin-modal" style={{ maxWidth: '520px' }}>
            <div className="admin-modal-header">
              <h2>🖼️ Bulk Update Product Image</h2>
              <button className="modal-close" onClick={() => { setShowBulkImage(false); setBulkImageUrl(''); }}>✕</button>
            </div>
            <div className="admin-modal-body" style={{ padding: '1.5rem' }}>
              <p style={{ color: '#8c8c8f', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Thao tác này sẽ thay thế ảnh của <strong style={{ color: '#ededed' }}>tất cả {total} sản phẩm</strong> bằng ảnh mới. Không thể hoàn tác.
              </p>

              {/* Upload from device */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#8c8c8f', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.5rem' }}>
                  Upload ảnh từ máy
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input ref={bulkFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => uploadBulkImage(e.target.files[0])} />
                  <button
                    type="button"
                    className="btn-upload-img"
                    onClick={() => bulkFileRef.current?.click()}
                    disabled={bulkUploading}
                    style={{ minWidth: 140 }}
                  >
                    {bulkUploading ? '⏳ Đang upload...' : '📂 Chọn ảnh'}
                  </button>
                  {bulkImageUrl && <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>✓ Đã có URL</span>}
                </div>
              </div>

              {/* Or paste URL */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#8c8c8f', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.5rem' }}>
                  Hoặc nhập URL ảnh
                </label>
                <input
                  type="text"
                  value={bulkImageUrl}
                  onChange={e => setBulkImageUrl(e.target.value)}
                  placeholder="https://... hoặc /uploads/..."
                  style={{ width: '100%', background: '#1a1a1c', border: '1px solid #2a2a2c', borderRadius: '6px', padding: '0.6rem 0.85rem', color: '#ededed', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Preview */}
              {bulkImageUrl && (
                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                  <img
                    src={bulkImageUrl}
                    alt="Preview"
                    style={{ maxWidth: '180px', maxHeight: '180px', objectFit: 'contain', borderRadius: '8px', background: '#111', border: '1px solid #2a2a2c', padding: '0.5rem' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <p style={{ fontSize: '0.72rem', color: '#8c8c8f', marginTop: '0.4rem' }}>Preview ảnh mới</p>
                </div>
              )}

              <div className="modal-footer" style={{ paddingTop: '1rem', borderTop: '1px solid #2a2a2c' }}>
                <button type="button" className="btn-cancel" onClick={() => { setShowBulkImage(false); setBulkImageUrl(''); }}>Hủy</button>
                <button
                  type="button"
                  className="btn-admin-danger"
                  onClick={handleBulkUpdateImage}
                  disabled={bulkUpdating || !bulkImageUrl.trim()}
                >
                  {bulkUpdating ? '⏳ Đang cập nhật...' : `🔄 Cập nhật tất cả ${total} sản phẩm`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
