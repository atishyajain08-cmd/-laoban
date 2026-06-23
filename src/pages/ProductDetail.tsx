import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { formatPrice } from '../utils/format';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import Button from '../components/common/Button';
import ProductCard from '../components/common/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  if (!product) {
    return (
      <div className="section container" style={{ textAlign: 'center', padding: '120px 0' }}>
        <h2>Product not found</h2>
        <Link to="/shop" style={{ color: 'var(--color-gold)', marginTop: '16px', display: 'inline-block' }}>
          Back to shop
        </Link>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  function handleAddToCart() {
    if (!selectedSize || !product) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: product.colors[0],
      image: product.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="section">
      <div className="container">
        <nav style={{ marginBottom: '32px', fontSize: '0.85rem', color: 'var(--color-warm-gray)' }}>
          <Link to="/" style={{ opacity: 0.7 }}>Home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link to="/shop" style={{ opacity: 0.7 }}>Shop</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>{product.name}</span>
        </nav>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '48px',
            marginBottom: '80px',
          }}
        >
          <div>
            <div
              style={{
                aspectRatio: '3/4',
                backgroundColor: 'var(--color-linen)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {!imageError ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  onError={() => setImageError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--color-warm-gray-light)' }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <p style={{ marginTop: '8px', fontSize: '0.8rem' }}>{product.name}</p>
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedImage(i); setImageError(false); }}
                    style={{
                      width: '72px',
                      height: '96px',
                      backgroundColor: 'var(--color-linen)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      border: i === selectedImage ? '2px solid var(--color-charcoal)' : '1px solid var(--color-sand)',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ paddingTop: '16px' }}>
            {product.new && (
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  backgroundColor: 'var(--color-charcoal)',
                  color: 'var(--color-ivory)',
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                }}
              >
                New
              </span>
            )}

            <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', marginBottom: '8px' }}>
              {product.name}
            </h1>

            <p
              style={{
                fontSize: '1.5rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                color: 'var(--color-charcoal)',
                marginBottom: '24px',
              }}
            >
              {formatPrice(product.price)}
            </p>

            <p
              style={{
                color: 'var(--color-warm-gray)',
                lineHeight: 1.8,
                marginBottom: '32px',
              }}
            >
              {product.description}
            </p>

            <div style={{ marginBottom: '24px' }}>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                Size {!selectedSize && <span style={{ color: 'var(--color-cinnabar)', fontWeight: 400 }}>— Select a size</span>}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid',
                      borderColor: selectedSize === size ? 'var(--color-charcoal)' : 'var(--color-sand)',
                      borderRadius: '2px',
                      backgroundColor: selectedSize === size ? 'var(--color-charcoal)' : 'transparent',
                      color: selectedSize === size ? 'var(--color-ivory)' : 'var(--color-charcoal)',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                disabled={!selectedSize}
                style={{
                  opacity: selectedSize ? 1 : 0.5,
                  cursor: selectedSize ? 'pointer' : 'not-allowed',
                }}
              >
                {added ? 'Added!' : 'Add to Cart'}
              </Button>
              <button
                onClick={() => toggleItem(product.id)}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                style={{
                  width: '52px',
                  height: '52px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--color-sand)',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  backgroundColor: wishlisted ? 'var(--color-cinnabar)' : 'transparent',
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={wishlisted ? '#fff' : 'none'}
                  stroke={wishlisted ? '#fff' : 'var(--color-charcoal)'}
                  strokeWidth="1.5"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            <div
              style={{
                padding: '16px',
                backgroundColor: 'var(--color-linen)',
                borderRadius: '4px',
                fontSize: '0.85rem',
                color: 'var(--color-warm-gray)',
              }}
            >
              <p style={{ marginBottom: '4px' }}>Free shipping on orders above ₹2,000</p>
              <p>Easy 7-day returns</p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h3 style={{ marginBottom: '24px' }}>You might also like</h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '24px',
              }}
            >
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
