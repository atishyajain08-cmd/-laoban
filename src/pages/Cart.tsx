import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { formatPrice } from '../utils/format';
import Button from '../components/common/Button';

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="section container" style={{ textAlign: 'center', padding: '120px 0' }}>
        <svg
          width="48" height="48" viewBox="0 0 24 24"
          fill="none" stroke="var(--color-warm-gray-light)" strokeWidth="1"
          style={{ marginBottom: '16px' }}
        >
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        <h2 style={{ marginBottom: '8px' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--color-warm-gray)', marginBottom: '24px' }}>
          Time to fill it with some boss essentials.
        </p>
        <Link to="/shop">
          <Button variant="primary">Shop Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '48px' }}>Cart</h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '48px',
            alignItems: 'start',
          }}
          className="cart-layout"
        >
          <div>
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                style={{
                  display: 'flex',
                  gap: '20px',
                  padding: '24px 0',
                  borderBottom: '1px solid var(--color-sand)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '130px',
                    backgroundColor: 'var(--color-linen)',
                    borderRadius: '4px',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{ marginBottom: '4px' }}>{item.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-warm-gray)', marginBottom: '4px' }}>
                    Size: {item.size} · {item.color}
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}>
                    {formatPrice(item.price)}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--color-sand)',
                        borderRadius: '2px',
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.1rem',
                          cursor: 'pointer',
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          width: '32px',
                          textAlign: 'center',
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.1rem',
                          cursor: 'pointer',
                        }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--color-cinnabar)',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 500, flexShrink: 0 }}>
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: '24px',
              backgroundColor: 'var(--color-linen)',
              borderRadius: '4px',
              position: 'sticky',
              top: 'calc(var(--header-height) + 24px)',
            }}
          >
            <h3 style={{ marginBottom: '20px' }}>Order summary</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--color-warm-gray)' }}>Subtotal</span>
              <span>{formatPrice(totalPrice())}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--color-warm-gray)' }}>Shipping</span>
              <span style={{ color: 'var(--color-warm-gray)' }}>
                {totalPrice() >= 2000 ? 'Free' : formatPrice(99)}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--color-sand)',
                paddingTop: '16px',
                marginTop: '16px',
                marginBottom: '24px',
              }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1.1rem' }}>
                {formatPrice(totalPrice() + (totalPrice() >= 2000 ? 0 : 99))}
              </span>
            </div>

            <Link to="/checkout">
              <Button variant="primary" size="lg" fullWidth>
                Checkout
              </Button>
            </Link>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .cart-layout {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
