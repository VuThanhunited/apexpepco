import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import './Categories.css';

const generateSlug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const emptyForm = { name: '', slug: '', description: '', order: 0 };

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState(null); // id khi edit
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data || []);
    } catch (err) {
      console.error(err);
      showToast('Không thể tải categories', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openNew = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setForm({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      order: cat.order ?? 0,
    });
    setEditing(cat._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/categories/${editing}`, form);
        showToast('Category đã được cập nhật!');
      } else {
        await api.post('/categories', form);
        showToast('Category đã được tạo!');
      }
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Lỗi khi lưu category', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id, name) => {
    if (!confirm(`Xóa category "${name}"? Các sản phẩm thuộc category này sẽ không còn category.`)) return;
    try {
      await api.delete(`/categories/${id}`);
      showToast('Category đã được xóa');
      fetchCategories();
    } catch (err) {
      showToast('Xóa thất bại', 'error');
    }
  };

  const setField = (key) => (e) =>
    setForm(f => ({ ...f, [key]: key === 'order' ? parseInt(e.target.value) || 0 : e.target.value }));

  return (
    <div className="admin-categories-page">
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>}

      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1>Categories <span className="count-badge">{categories.length}</span></h1>
          <p>Quản lý danh mục sản phẩm</p>
        </div>
        <button className="btn-admin-primary" onClick={openNew} id="add-category-btn">
          + Add Category
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="admin-loading"><div className="admin-spinner" /></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan="5" className="table-empty">Chưa có category nào</td></tr>
              ) : categories.map(cat => (
                <tr key={cat._id}>
                  <td>
                    <div className="cat-name-cell">
                      <span className="cat-name">{cat.name}</span>
                    </div>
                  </td>
                  <td><code className="cat-slug">{cat.slug}</code></td>
                  <td className="cat-desc">{cat.description || <span className="text-muted">—</span>}</td>
                  <td><span className="cat-order">{cat.order}</span></td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-edit" onClick={() => openEdit(cat)} id={`edit-cat-${cat._id}`}>Edit</button>
                      <button className="btn-delete" onClick={() => deleteCategory(cat._id, cat.name)} id={`delete-cat-${cat._id}`}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="admin-modal" style={{ maxWidth: '540px' }}>
            <div className="admin-modal-header">
              <h2>{editing ? 'Edit Category' : 'New Category'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-body" id="category-form">
              <div className="form-field">
                <label>Category Name *</label>
                <input
                  required
                  id="cf-name"
                  placeholder="e.g. Peptides"
                  value={form.name}
                  onChange={e => setForm(f => ({
                    ...f,
                    name: e.target.value,
                    slug: !editing ? generateSlug(e.target.value) : f.slug,
                  }))}
                />
              </div>

              <div className="form-field">
                <label>Slug *</label>
                <input
                  required
                  id="cf-slug"
                  placeholder="e.g. peptides"
                  value={form.slug}
                  onChange={setField('slug')}
                />
                <small className="field-hint">Dùng để lọc sản phẩm theo URL. Chỉ gồm chữ thường, số và dấu gạch ngang.</small>
              </div>

              <div className="form-field">
                <label>Description</label>
                <textarea
                  id="cf-desc"
                  rows={3}
                  placeholder="Mô tả ngắn về category..."
                  value={form.description}
                  onChange={setField('description')}
                />
              </div>

              <div className="form-field" style={{ maxWidth: 160 }}>
                <label>Sort Order</label>
                <input
                  id="cf-order"
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={setField('order')}
                />
                <small className="field-hint">Số nhỏ hơn hiển thị trước.</small>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-admin-primary" id="category-submit-btn" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
