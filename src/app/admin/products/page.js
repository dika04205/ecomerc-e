'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function AdminProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: 'Board Games', stock: '', image: '/images/board-game-1.webp', featured: false
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      setProducts(data.products || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchProducts();
    else setLoading(false);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock)
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (res.ok) { toast.success('Product updated!'); }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (res.ok) { toast.success('Product created!'); }
      }
      setShowForm(false);
      setEditingId(null);
      setForm({ name: '', description: '', price: '', category: 'Board Games', stock: '', image: '/images/board-game-1.webp', featured: false });
      fetchProducts();
    } catch {
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image: product.image,
      featured: product.featured
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (authLoading || loading) {
    return <div className="loading-page"><div className="spinner" /></div>;
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="empty-state" style={{ minHeight: 'calc(100vh - 72px)' }}>
        <div className="empty-state-icon">🔒</div>
        <h3 className="empty-state-title">Admin access required</h3>
        <Link href="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="admin-layout page-enter">
      <aside className="admin-sidebar">
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-xl)', fontSize: 'var(--text-lg)' }}>⚙️ Admin</h3>
        <Link href="/admin" className="admin-sidebar-link">📊 Dashboard</Link>
        <Link href="/admin/products" className="admin-sidebar-link active">📦 Products</Link>
        <Link href="/admin/orders" className="admin-sidebar-link">🧾 Orders</Link>
        <div style={{ marginTop: 'auto' }}><Link href="/" className="admin-sidebar-link">← Back to Store</Link></div>
      </aside>

      <div className="admin-content">
        <div className="flex-between" style={{ marginBottom: 'var(--space-2xl)' }}>
          <h1 className="heading-1"><span className="text-gradient">Products</span></h1>
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', description: '', price: '', category: 'Board Games', stock: '', image: '/images/board-game-1.webp', featured: false }); }}>
            {showForm ? '✕ Cancel' : '+ Add Product'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="card" style={{ padding: 'var(--space-xl)', marginBottom: 'var(--space-2xl)', animation: 'fadeInDown 0.3s ease' }}>
            <h3 className="heading-3" style={{ marginBottom: 'var(--space-lg)' }}>{editingId ? 'Edit Product' : 'New Product'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
              <div className="input-group">
                <label>Name</label>
                <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Category</label>
                <select className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {['Board Games', 'Card Games', 'Miniatures', 'Dice & Tokens', 'Accessories'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Price ($)</label>
                <input className="input" type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Stock</label>
                <input className="input" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
              </div>
            </div>
            <div className="input-group" style={{ marginBottom: 'var(--space-lg)' }}>
              <label>Description</label>
              <textarea className="input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} required />
            </div>
            <div className="input-group" style={{ marginBottom: 'var(--space-lg)' }}>
              <label>Image URL</label>
              <input className="input" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} />
              Featured Product
            </label>
            <button type="submit" className="btn btn-primary">{editingId ? 'Update Product' : 'Create Product'}</button>
          </form>
        )}

        {/* Products Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                      <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--color-bg-tertiary)', flexShrink: 0 }}>
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{product.name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-info">{product.category}</span></td>
                  <td style={{ fontWeight: 700 }}>${product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>⭐ {product.rating}</td>
                  <td>{product.featured ? '✅' : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(product)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
