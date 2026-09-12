'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') { setLoading(false); return; }

    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch('/api/products?limit=100'),
          fetch('/api/orders')
        ]);
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        const orders = ordersData.orders || [];
        const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

        setStats({
          products: productsData.total || 0,
          orders: orders.length,
          revenue
        });
        setRecentOrders(orders.slice(-5).reverse());
      } catch {
        // ignore
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

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

  return (
    <div className="admin-layout page-enter">
      {/* Sidebar */}
      <aside className="admin-sidebar" id="admin-sidebar">
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-xl)', fontSize: 'var(--text-lg)' }}>
          ⚙️ Admin
        </h3>
        <Link href="/admin" className="admin-sidebar-link active">📊 Dashboard</Link>
        <Link href="/admin/products" className="admin-sidebar-link">📦 Products</Link>
        <Link href="/admin/orders" className="admin-sidebar-link">🧾 Orders</Link>
        <div style={{ marginTop: 'auto' }}>
          <Link href="/" className="admin-sidebar-link">← Back to Store</Link>
        </div>
      </aside>

      {/* Content */}
      <div className="admin-content">
        <h1 className="heading-1" style={{ marginBottom: 'var(--space-2xl)' }}>
          <span className="text-gradient">Dashboard</span>
        </h1>

        {/* Stat Cards */}
        <div className="grid grid-3" style={{ marginBottom: 'var(--space-3xl)' }}>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>📦</div>
            <div className="stat-card-value">{stats.products}</div>
            <div className="stat-card-label">Total Products</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(6,182,212,0.15)', color: '#22d3ee' }}>🧾</div>
            <div className="stat-card-value">{stats.orders}</div>
            <div className="stat-card-label">Total Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>💰</div>
            <div className="stat-card-value">${stats.revenue.toFixed(2)}</div>
            <div className="stat-card-label">Total Revenue</div>
          </div>
        </div>

        {/* Recent Orders */}
        <h2 className="heading-2" style={{ marginBottom: 'var(--space-lg)' }}>Recent Orders</h2>
        {recentOrders.length === 0 ? (
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
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600 }}>{order.id}</td>
                    <td>{order.userName}</td>
                    <td>{order.items?.length || 0}</td>
                    <td style={{ fontWeight: 700 }}>${order.total?.toFixed(2)}</td>
                    <td><span className={`badge ${statusColor(order.status)}`}>{order.status}</span></td>
                    <td className="text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
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
