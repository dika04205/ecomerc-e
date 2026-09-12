'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

const STEPS = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', email: '', address: '', city: '', state: '', zip: '', country: 'US'
  });

  const [payment, setPayment] = useState({
    cardNumber: '', cardName: '', expiry: '', cvv: ''
  });

  const shippingCost = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  if (!user) {
    return (
      <div className="empty-state" style={{ minHeight: 'calc(100vh - 72px)' }}>
        <div className="empty-state-icon">🔒</div>
        <h3 className="empty-state-title">Sign in to checkout</h3>
        <p className="empty-state-text">You need an account to place an order</p>
        <Link href="/auth/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="empty-state" style={{ minHeight: 'calc(100vh - 72px)' }}>
        <div className="empty-state-icon">🛒</div>
        <h3 className="empty-state-title">Your cart is empty</h3>
        <Link href="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="confirmation" style={{ minHeight: 'calc(100vh - 72px)' }}>
        <div className="confirmation-icon">🎉</div>
        <h1 className="heading-1" style={{ marginBottom: 'var(--space-md)' }}>
          Order <span className="text-gradient">Confirmed!</span>
        </h1>
        <p className="text-secondary" style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-sm)' }}>
          Thank you for your purchase!
        </p>
        <p className="text-muted" style={{ marginBottom: 'var(--space-2xl)' }}>
          Order ID: {orderId}
        </p>
        <div className="flex-center gap-md">
          <Link href="/products" className="btn btn-primary btn-lg">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shipping, total })
      });
      const data = await res.json();
      if (res.ok) {
        setOrderId(data.order.id);
        setOrderPlaced(true);
        clearCart();
        toast.success('Order placed successfully!');
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } catch {
      toast.error('Something went wrong');
    }
    setSubmitting(false);
  };

  return (
    <div className="page-enter" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="container container-narrow" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
        <h1 className="heading-1" style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <span className="text-gradient">Checkout</span>
        </h1>

        {/* Steps */}
        <div className="checkout-steps" id="checkout-steps">
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <div className={`checkout-step ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}>
                <span className="checkout-step-number">{i < step ? '✓' : i + 1}</span>
                <span>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`checkout-step-line ${i < step ? 'completed' : ''}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="card" style={{ padding: 'var(--space-2xl)', marginTop: 'var(--space-xl)' }}>
          {step === 0 && (
            <div>
              <h2 className="heading-3" style={{ marginBottom: 'var(--space-xl)' }}>Shipping Information</h2>
              <div className="auth-form">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                  <div className="input-group">
                    <label>First Name</label>
                    <input className="input" value={shipping.firstName} onChange={e => setShipping({...shipping, firstName: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>Last Name</label>
                    <input className="input" value={shipping.lastName} onChange={e => setShipping({...shipping, lastName: e.target.value})} required />
                  </div>
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input className="input" type="email" value={shipping.email} onChange={e => setShipping({...shipping, email: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Address</label>
                  <input className="input" value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 'var(--space-lg)' }}>
                  <div className="input-group">
                    <label>City</label>
                    <input className="input" value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>State</label>
                    <input className="input" value={shipping.state} onChange={e => setShipping({...shipping, state: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>ZIP</label>
                    <input className="input" value={shipping.zip} onChange={e => setShipping({...shipping, zip: e.target.value})} required />
                  </div>
                </div>
                <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setStep(1)}>
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="heading-3" style={{ marginBottom: 'var(--space-xl)' }}>Payment Details</h2>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', marginBottom: 'var(--space-xl)', fontSize: 'var(--text-sm)', color: '#fbbf24' }}>
                ⚠️ This is a demo checkout. No real payment will be processed.
              </div>
              <div className="auth-form">
                <div className="input-group">
                  <label>Card Number</label>
                  <input className="input" placeholder="4242 4242 4242 4242" value={payment.cardNumber} onChange={e => setPayment({...payment, cardNumber: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Cardholder Name</label>
                  <input className="input" value={payment.cardName} onChange={e => setPayment({...payment, cardName: e.target.value})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                  <div className="input-group">
                    <label>Expiry Date</label>
                    <input className="input" placeholder="MM/YY" value={payment.expiry} onChange={e => setPayment({...payment, expiry: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label>CVV</label>
                    <input className="input" placeholder="123" value={payment.cvv} onChange={e => setPayment({...payment, cvv: e.target.value})} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                  <button className="btn btn-secondary btn-lg" onClick={() => setStep(0)}>← Back</button>
                  <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => setStep(2)}>Review Order →</button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="heading-3" style={{ marginBottom: 'var(--space-xl)' }}>Review Order</h2>

              {/* Items */}
              <div className="flex-col gap-md" style={{ marginBottom: 'var(--space-xl)' }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--color-border)' }}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                      <span className="text-muted"> × {item.quantity}</span>
                    </div>
                    <span style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div style={{ background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="cart-summary-total">
                  <span>Total</span>
                  <span className="text-gradient">${total.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <button className="btn btn-secondary btn-lg" onClick={() => setStep(1)}>← Back</button>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1 }}
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  id="place-order-btn"
                >
                  {submitting ? 'Processing...' : '🎉 Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
