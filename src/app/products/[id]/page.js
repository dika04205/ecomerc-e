'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import StarRating from '@/components/StarRating';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { addItem } = useCart();
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${id}`).then(r => r.json()),
      fetch(`/api/products/${id}/reviews`).then(r => r.json())
    ]).then(([prodData, revData]) => {
      setProduct(prodData.product);
      setReviews(revData.reviews || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleAddToWishlist = async () => {
    if (!user) { toast.warning('Please sign in to use wishlist'); return; }
    await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id })
    });
    toast.success('Added to wishlist!');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.warning('Please sign in to leave a review'); return; }
    if (!reviewRating) { toast.warning('Please select a rating'); return; }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
      });
      const data = await res.json();
      if (res.ok) {
        setReviews(prev => [data.review, ...prev]);
        setReviewRating(0);
        setReviewComment('');
        toast.success('Review submitted!');
      }
    } catch {
      toast.error('Failed to submit review');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="empty-state" style={{ minHeight: 'calc(100vh - 72px)' }}>
        <div className="empty-state-icon">😕</div>
        <h3 className="empty-state-title">Product not found</h3>
        <Link href="/products" className="btn btn-primary">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ padding: 'var(--space-lg) 0', display: 'flex', gap: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>
          <Link href="/" className="text-secondary" style={{ textDecoration: 'none' }}>Home</Link>
          <span className="text-muted">/</span>
          <Link href="/products" className="text-secondary" style={{ textDecoration: 'none' }}>Products</Link>
          <span className="text-muted">/</span>
          <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="text-secondary" style={{ textDecoration: 'none' }}>{product.category}</Link>
          <span className="text-muted">/</span>
          <span>{product.name}</span>
        </div>

        {/* Product Detail */}
        <div className="product-detail" id="product-detail">
          <div className="product-gallery">
            <img src={product.image} alt={product.name} />
            {product.featured && (
              <span style={{ position: 'absolute', top: 'var(--space-lg)', left: 'var(--space-lg)' }}>
                <span className="badge badge-primary">⭐ Featured</span>
              </span>
            )}
          </div>

          <div className="product-info">
            <span className="product-info-category">{product.category}</span>
            <h1 className="product-info-name">{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
              <StarRating rating={product.rating} size="medium" />
              <span className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="product-info-price">
              <span className="currency">$</span>{product.price.toFixed(2)}
            </div>

            <p className="product-info-description">{product.description}</p>

            <div className="product-info-meta">
              <div className="product-info-meta-row">
                <span className="product-info-meta-label">Availability</span>
                <span className="product-info-meta-value" style={{ color: product.stock > 0 ? 'var(--color-accent-success)' : 'var(--color-accent-danger)' }}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              <div className="product-info-meta-row">
                <span className="product-info-meta-label">Category</span>
                <span className="product-info-meta-value">{product.category}</span>
              </div>
              {product.tags && (
                <div className="product-info-meta-row">
                  <span className="product-info-meta-label">Tags</span>
                  <span className="product-info-meta-value">{product.tags.join(', ')}</span>
                </div>
              )}
            </div>

            <div className="product-info-actions">
              <div className="quantity-control">
                <button className="quantity-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span className="quantity-value">{quantity}</span>
                <button className="quantity-btn" onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                style={{ flex: 1 }}
                id="add-to-cart-btn"
              >
                🛒 Add to Cart
              </button>
              <button className="btn btn-outline btn-lg" onClick={handleAddToWishlist} id="add-to-wishlist-btn">
                ❤️
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="reviews-section" id="reviews-section">
          <h2 className="heading-2" style={{ marginBottom: 'var(--space-2xl)' }}>
            Customer <span className="text-gradient">Reviews</span>
          </h2>

          {/* Write Review */}
          {user && (
            <form onSubmit={handleSubmitReview} className="review-card" style={{ marginBottom: 'var(--space-2xl)' }}>
              <h3 className="heading-3" style={{ marginBottom: 'var(--space-md)' }}>Write a Review</h3>
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <StarRating rating={reviewRating} interactive onRate={setReviewRating} size="large" />
              </div>
              <textarea
                className="input"
                placeholder="Share your thoughts about this product..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: 'var(--space-md)' }}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="flex-col gap-md">
            {reviews.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">💬</div>
                <h3 className="empty-state-title">No reviews yet</h3>
                <p className="empty-state-text">Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div>
                      <div className="review-author">{review.userName}</div>
                      <StarRating rating={review.rating} size="small" />
                    </div>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && <p className="review-text">{review.comment}</p>}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
