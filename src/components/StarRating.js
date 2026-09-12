'use client';

export default function StarRating({ rating = 0, maxStars = 5, size = 'medium', interactive = false, onRate }) {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    const filled = i <= Math.round(rating);
    stars.push(
      <span
        key={i}
        className={`star ${filled ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
        style={{ fontSize: size === 'small' ? '12px' : size === 'large' ? '24px' : '16px' }}
        onClick={interactive ? () => onRate?.(i) : undefined}
        role={interactive ? 'button' : undefined}
        aria-label={interactive ? `Rate ${i} stars` : undefined}
      >
        ★
      </span>
    );
  }

  return <span className="stars">{stars}</span>;
}
