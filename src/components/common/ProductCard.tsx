import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../data/products';
import { formatPrice } from '../../utils/format';
import { useWishlistStore } from '../../store/useWishlistStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(product.id);

  function handleMouseMove(e: React.MouseEvent) {
    if (!cardRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
  }

  function handleMouseLeave() {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0px)';
  }

  return (
    <div
      ref={cardRef}
      style={{
        transition: 'transform var(--transition-base)',
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={`/product/${product.slug}`}
        style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
      >
        <div
          style={{
            position: 'relative',
            aspectRatio: '3/4',
            backgroundColor: 'var(--color-linen)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '12px',
          }}
        >
          {!imageError ? (
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              onError={() => setImageError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-warm-gray-light)',
                gap: '8px',
              }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)' }}>
                {product.name}
              </span>
            </div>
          )}

          {product.new && (
            <span
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                padding: '4px 10px',
                backgroundColor: 'var(--color-charcoal)',
                color: 'var(--color-ivory)',
                fontSize: '0.65rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              New
            </span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleItem(product.id);
            }}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(250, 250, 245, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform var(--transition-fast)',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={wishlisted ? 'var(--color-cinnabar)' : 'none'}
              stroke={wishlisted ? 'var(--color-cinnabar)' : 'var(--color-charcoal)'}
              strokeWidth="1.5"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        <div style={{ padding: '0 4px' }}>
          <h3
            style={{
              fontSize: '0.95rem',
              fontWeight: 500,
              marginBottom: '4px',
              fontFamily: 'var(--font-display)',
            }}
          >
            {product.name}
          </h3>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--color-warm-gray)',
              fontFamily: 'var(--font-display)',
            }}
          >
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </div>
  );
}
