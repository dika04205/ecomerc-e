'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') { setLoading(false); return; }

    fetch('/api/orders')
      .then(r => r.json())
      .then(data => { setOrders((data.orders || []).reverse()); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  const updateStatus = async (orderId, status) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
        toast.success(`Order ${status}`);
      }
    } catch {
      toast.error('Failed to update order');
    }
  };

  const statusColor = (status) => {
    switch(status) {
      case 'pending': return 'badge-warning';
      case 'processing': return 'badge-info';
      case 'shipped': return 'badge-primary';
      case 'delivered': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-primary';
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
        <Link href="/admin/products" className="admin-sidebar-link">📦 Products</Link>
        <Link href="/admin/orders" className="admin-sidebar-link active">🧾 Orders</Link>
        <div style={{ marginTop: 'auto' }}><Link href="/" className="admin-sidebar-link">← Back to Store</Link></div>
      </aside>

      <div className="admin-content">
        <h1 className="heading-1" style={{ marginBottom: 'var(--space-2xl)' }}>
          <span className="text-gradient">Orders</span>
        </h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🧾</div>
            <h3 className="empty-state-title">No orders yet</h3>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600 }}>{order.id}</td>
                    <td>{order.userName}</td>
                    <td className="text-muted">{order.userEmail}</td>
                    <td>{order.items?.length || 0}</td>
                    <td style={{ fontWeight: 700 }}>${order.total?.toFixed(2)}</td>
                    <td><span className={`badge ${statusColor(order.status)}`}>{order.status}</span></td>
                    <td className="text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select
                        className="input"
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        style={{ padding: '0.375rem 0.5rem', fontSize: 'var(--text-xs)', minWidth: 120 }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
