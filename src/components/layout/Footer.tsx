import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-charcoal)',
        color: 'var(--color-ivory)',
        padding: '64px 0 32px',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '48px',
            marginBottom: '48px',
          }}
        >
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                marginBottom: '16px',
              }}
            >
              LAOBAN
            </h4>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--color-warm-gray-light)',
                lineHeight: 1.7,
                maxWidth: '280px',
              }}
            >
              Premium menswear for the modern boss. Confidence, crafted.
            </p>
            <p
              style={{
                marginTop: '12px',
                fontSize: '0.85rem',
                color: 'var(--color-gold)',
                fontFamily: 'var(--font-display)',
              }}
            >
              老板
            </p>
          </div>

          <div>
            <h5
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '16px',
                color: 'var(--color-warm-gray-light)',
              }}
            >
              Shop
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/shop" style={{ fontSize: '0.9rem', opacity: 0.8, transition: 'opacity 0.2s' }}>
                All Products
              </Link>
              <Link to="/shop?tag=essentials" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Essentials
              </Link>
              <Link to="/shop?tag=premium" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Premium
              </Link>
            </div>
          </div>

          <div>
            <h5
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '16px',
                color: 'var(--color-warm-gray-light)',
              }}
            >
              Company
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/about" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Our Story
              </Link>
              <Link to="/about" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Sustainability
              </Link>
            </div>
          </div>

          <div>
            <h5
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '16px',
                color: 'var(--color-warm-gray-light)',
              }}
            >
              Help
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Size Guide</span>
              <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Shipping & Returns</span>
              <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Contact Us</span>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(250, 250, 245, 0.1)',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: 'var(--color-warm-gray)' }}>
            &copy; 2025 Laoban. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Laoban on Instagram"
              style={{ color: 'var(--color-warm-gray-light)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Laoban on Twitter"
              style={{ color: 'var(--color-warm-gray-light)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
