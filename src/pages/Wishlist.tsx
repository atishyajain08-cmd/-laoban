import { Link } from 'react-router-dom';
import { useWishlistStore } from '../store/useWishlistStore';
import { products } from '../data/products';
import ProductCard from '../components/common/ProductCard';
import Button from '../components/common/Button';

export default function Wishlist() {
  const { items } = useWishlistStore();
  const wishlistProducts = products.filter((p) => items.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="section container" style={{ textAlign: 'center', padding: '120px 0' }}>
        <svg
          width="48" height="48" viewBox="0 0 24 24"
          fill="none" stroke="var(--color-warm-gray-light)" strokeWidth="1"
          style={{ marginBottom: '16px' }}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <h2 style={{ marginBottom: '8px' }}>Your wishlist is empty</h2>
        <p style={{ color: 'var(--color-warm-gray)', marginBottom: '24px' }}>
          Save pieces you love for later.
        </p>
        <Link to="/shop">
          <Button variant="primary">Browse Collection</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '8px' }}>Wishlist</h1>
        <p style={{ color: 'var(--color-warm-gray)', marginBottom: '48px' }}>
          {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} saved
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
