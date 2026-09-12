'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { addItem } = useCart();
  const toast = useToast();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const fetchWishlist = async () => {
      try {
        const wishlistRes = await fetch('/api/wishlist');
        const wishlistData = await wishlistRes.json();
        const productIds = wishlistData.wishlist || [];

        if (productIds.length === 0) {
          setWishlistProducts([]);
          setLoading(false);
          return;
        }

        const productsRes = await fetch('/api/products?limit=100');
        const productsData = await productsRes.json();
        const filtered = (productsData.products || []).filter(p => productIds.includes(p.id));
        setWishlistProducts(filtered);
      } catch {
        setWishlistProducts([]);
      }
      setLoading(false);
    };

    fetchWishlist();
  }, [user]);

  const handleRemove = async (productId) => {
    await fetch('/api/wishlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    });
    setWishlistProducts(prev => prev.filter(p => p.id !== productId));
    toast.info('Removed from wishlist');
  };

  const handleMoveToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
    handleRemove(product.id);
    toast.success(`${product.name} moved to cart!`);
  };

  if (authLoading || loading) {
    return <div className="loading-page"><div className="spinner" /></div>;
  }

  if (!user) {
    return (
      <div className="empty-state" style={{ minHeight: 'calc(100vh - 72px)' }}>
        <div className="empty-state-icon">🔒</div>
        <h3 className="empty-state-title">Sign in to view wishlist</h3>
        <Link href="/auth/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
        <h1 className="heading-1" style={{ marginBottom: 'var(--space-2xl)' }}>
          My <span className="text-gradient">Wishlist</span>
        </h1>

        {wishlistProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">❤️</div>
            <h3 className="empty-state-title">Your wishlist is empty</h3>
            <p className="empty-state-text">Browse products and save your favorites!</p>
            <Link href="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistProducts.map(product => (
              <div key={product.id} className="card" style={{ animation: 'fadeInUp 0.4s ease' }}>
                <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: 'var(--color-bg-tertiary)' }}>
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="card-body">
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {product.category}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, margin: 'var(--space-xs) 0' }}>
                    <Link href={`/products/${product.id}`}>{product.name}</Link>
                  </h3>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 'var(--space-md)' }}>
                    <span style={{ color: 'var(--color-accent-primary)' }}>$</span>{product.price.toFixed(2)}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => handleMoveToCart(product)}>
                      🛒 Move to Cart
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleRemove(product.id)} style={{ color: 'var(--color-accent-danger)' }}>
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
