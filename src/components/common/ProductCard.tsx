import { Link } from 'react-router-dom';
import type { Product } from '../../data/products';
import { formatPrice } from '../../utils/format';
import { useWishlistStore } from '../../store/useWishlistStore';

export default function ProductCard({ product }: { product: Product }) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const wished = isInWishlist(product.id);
  return (
    <article className="product-card">
      <div className="product-media">
        <Link to={`/product/${product.slug}`}>
          <img src={product.images[0]} alt={product.name} />
        </Link>
        {product.isNew && <span className="product-badge">New</span>}
        <div className="product-actions">
          <Link to={`/product/${product.slug}`} aria-label="View product">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" /><circle cx="12" cy="12" r="3" />
            </svg>
          </Link>
          <button
            className={wished ? 'active' : ''}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={() => toggleItem(product.id)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z" />
            </svg>
          </button>
        </div>
      </div>
      <Link to={`/product/${product.slug}`} className="product-info">
        <p className="product-meta">{product.category}</p>
        <div className="product-row">
          <h3 className="product-name">{product.name}</h3>
          <span className="price">{formatPrice(product.price)}</span>
        </div>
      </Link>
    </article>
  );
}
