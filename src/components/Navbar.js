'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          🎲 <span>Board Store</span>
        </Link>

        <div className="navbar-nav">
          <Link href="/products" className="navbar-link">Products</Link>
          <Link href="/products?category=Board Games" className="navbar-link">Board Games</Link>
          <Link href="/products?category=Card Games" className="navbar-link">Card Games</Link>
          <Link href="/products?category=Miniatures" className="navbar-link">Miniatures</Link>
          <Link href="/products?category=Dice & Tokens" className="navbar-link">Dice & Tokens</Link>
        </div>

        <div className="navbar-actions">
          <Link href="/cart" className="btn-icon cart-badge" id="cart-icon" aria-label="Shopping Cart">
            🛒
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <button
                className="user-menu-trigger"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                id="user-menu-btn"
              >
                👤 {user.name}
              </button>
              {userMenuOpen && (
                <div className="user-menu-dropdown">
                  <Link href="/wishlist" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
                    ❤️ Wishlist
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
                      ⚙️ Admin Dashboard
                    </Link>
                  )}
                  <div className="user-menu-divider" />
                  <button
                    className="user-menu-item"
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    id="logout-btn"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="btn btn-primary btn-sm" id="login-btn">
              Sign In
            </Link>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
