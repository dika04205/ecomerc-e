'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const toast = useToast();

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="empty-state" style={{ minHeight: 'calc(100vh - 72px)' }}>
        <div className="empty-state-icon">🛒</div>
        <h3 className="empty-state-title">Your cart is empty</h3>
        <p className="empty-state-text">Looks like you haven&apos;t added anything yet</p>
        <Link href="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
        <div className="flex-between" style={{ marginBottom: 'var(--space-2xl)' }}>
          <h1 className="heading-1">
            Shopping <span className="text-gradient">Cart</span>
          </h1>
          <button className="btn btn-ghost" onClick={() => { clearCart(); toast.info('Cart cleared'); }}>
            🗑️ Clear Cart
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-2xl)' }}>
          {/* Cart Items */}
          <div className="flex-col gap-md">
            {items.map(item => (
              <div key={item.id} className="cart-item" id={`cart-item-${item.id}`}>
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <Link href={`/products/${item.id}`} className="cart-item-name">{item.name}</Link>
                  <span className="cart-item-price">${item.price.toFixed(2)}</span>
                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => { removeItem(item.id); toast.info('Item removed'); }}
                      style={{ color: 'var(--color-accent-danger)' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary" id="cart-summary">
            <h3 className="heading-3" style={{ marginBottom: 'var(--space-lg)' }}>Order Summary</h3>
            <div className="cart-summary-row">
              <span>Subtotal ({items.length} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span style={{ color: 'var(--color-accent-success)' }}>FREE</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="cart-summary-row">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="cart-summary-total">
              <span>Total</span>
              <span className="text-gradient">${total.toFixed(2)}</span>
            </div>
            {subtotal < 50 && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-sm)' }}>
                Add ${(50 - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}
            <Link href="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-lg)' }} id="checkout-btn">
              Proceed to Checkout →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
