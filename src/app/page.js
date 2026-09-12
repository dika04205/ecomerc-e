'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

const categories = [
  { name: 'Board Games', emoji: '🎲', count: 4 },
  { name: 'Card Games', emoji: '🃏', count: 4 },
  { name: 'Miniatures', emoji: '⚔️', count: 4 },
  { name: 'Dice & Tokens', emoji: '🎯', count: 5 },
  { name: 'Accessories', emoji: '🛡️', count: 7 },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?featured=true&limit=8')
      .then(r => r.json())
      .then(data => { setFeatured(data.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Level Up Your <span className="text-gradient">Game Night</span>
            </h1>
            <p className="hero-subtitle">
              Discover premium board games, rare collectible cards, hand-crafted miniatures,
              and artisan dice. Everything you need for the ultimate tabletop experience.
            </p>
            <div className="hero-actions">
              <Link href="/products" className="btn btn-primary btn-lg" id="shop-now-btn">
                🛒 Shop Now
              </Link>
              <Link href="/products?category=Dice & Tokens" className="btn btn-secondary btn-lg">
                🎯 Browse Dice
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section" id="categories-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
            <h2 className="heading-2" style={{ marginBottom: 'var(--space-sm)' }}>
              Browse by <span className="text-gradient">Category</span>
            </h2>
            <p className="text-secondary">Find exactly what you&apos;re looking for</p>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-lg)' }}>
            {categories.map(cat => (
              <Link
                key={cat.name}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="category-card"
              >
                <div className="category-card-bg">{cat.emoji}</div>
                <div className="category-card-content">
                  <div className="category-card-name">{cat.name}</div>
                  <div className="category-card-count">{cat.count} products</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" id="featured-section" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: 'var(--space-2xl)' }}>
            <div>
              <h2 className="heading-2" style={{ marginBottom: 'var(--space-sm)' }}>
                ⭐ Featured <span className="text-gradient">Products</span>
              </h2>
              <p className="text-secondary">Hand-picked favorites from our collection</p>
            </div>
            <Link href="/products" className="btn btn-outline">View All →</Link>
          </div>

          {loading ? (
            <div className="grid grid-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="card" style={{ height: 380 }}>
                  <div className="skeleton" style={{ height: 200 }} />
                  <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="skeleton" style={{ height: 12, width: '60%' }} />
                    <div className="skeleton" style={{ height: 18, width: '80%' }} />
                    <div className="skeleton" style={{ height: 14, width: '40%' }} />
                    <div className="skeleton" style={{ height: 20, width: '30%', marginTop: 'auto' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-4">
              {featured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats / Trust Section */}
      <section className="section" id="stats-section">
        <div className="container">
          <div className="grid grid-4" style={{ textAlign: 'center' }}>
            {[
              { value: '10K+', label: 'Happy Gamers', icon: '🎮' },
              { value: '500+', label: 'Products', icon: '📦' },
              { value: '24/7', label: 'Support', icon: '💬' },
              { value: 'Free', label: 'Shipping $50+', icon: '🚚' },
            ].map(stat => (
              <div key={stat.label} className="glass-card" style={{ padding: 'var(--space-2xl)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>{stat.icon}</div>
                <div className="heading-2 text-gradient">{stat.value}</div>
                <p className="text-secondary" style={{ marginTop: 'var(--space-xs)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <h2 className="heading-1" style={{ marginBottom: 'var(--space-lg)' }}>
            Ready to <span className="text-gradient">Play?</span>
          </h2>
          <p className="text-secondary" style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2xl)' }}>
            Join thousands of tabletop enthusiasts. Create an account and start building
            your ultimate game collection today.
          </p>
          <div className="flex-center gap-md">
            <Link href="/auth/register" className="btn btn-primary btn-lg">Create Account</Link>
            <Link href="/products" className="btn btn-secondary btn-lg">Browse Store</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
