'use client';

import Link from 'next/link';
import StarRating from './StarRating';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const toast = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link href={`/products/${product.id}`} className="product-card" id={`product-${product.id}`}>
      <div className="product-card-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.featured && (
          <span className="product-card-badge">
            <span className="badge badge-primary">⭐ Featured</span>
          </span>
        )}
        <div className="product-card-overlay">
          <button className="btn btn-primary btn-sm" onClick={handleAddToCart}>
            🛒 Add to Cart
          </button>
        </div>
      </div>
      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-rating">
          <StarRating rating={product.rating} size="small" />
          <span className="rating-text">({product.reviewCount})</span>
        </div>
        <div className="product-card-price">
          <span className="currency">$</span>{product.price.toFixed(2)}
        </div>
      </div>
    </Link>
  );
}
