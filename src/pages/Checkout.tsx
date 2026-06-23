import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { formatPrice } from '../utils/format';
import Button from '../components/common/Button';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (items.length === 0 && !submitted) {
    return (
      <div className="section container" style={{ textAlign: 'center', padding: '120px 0' }}>
        <h2>Nothing to checkout</h2>
        <Link to="/shop" style={{ color: 'var(--color-gold)', marginTop: '16px', display: 'inline-block' }}>
          Continue shopping
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="section container" style={{ textAlign: 'center', padding: '120px 0', maxWidth: '560px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 style={{ marginBottom: '12px' }}>Order placed, boss.</h2>
        <p style={{ color: 'var(--color-warm-gray)', marginBottom: '24px', lineHeight: 1.7 }}>
          Your order summary has been saved. Payment and delivery integration are coming soon — we'll be in touch.
        </p>
        <div
          style={{
            padding: '20px',
            backgroundColor: 'var(--color-linen)',
            borderRadius: '4px',
            marginBottom: '32px',
            textAlign: 'left',
          }}
        >
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 500, marginBottom: '12px' }}>
            Order summary
          </p>
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.9rem',
                padding: '4px 0',
              }}
            >
              <span style={{ color: 'var(--color-warm-gray)' }}>
                {item.name} ({item.size}) × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--color-sand)',
              paddingTop: '8px',
              marginTop: '8px',
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
            }}
          >
            <span>Total</span>
            <span>{formatPrice(totalPrice())}</span>
          </div>
        </div>
        <div
          style={{
            padding: '16px',
            border: '1px solid var(--color-gold)',
            borderRadius: '4px',
            backgroundColor: 'rgba(197, 165, 90, 0.06)',
            marginBottom: '32px',
          }}
        >
          <p style={{ fontSize: '0.9rem', color: 'var(--color-gold-dark)' }}>
            Payment & delivery integration coming soon.
          </p>
        </div>
        <Link to="/shop" onClick={() => clearCart()}>
          <Button variant="primary">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid var(--color-sand)',
    borderRadius: '2px',
    fontSize: '0.9rem',
    backgroundColor: 'transparent',
    outline: 'none',
    transition: 'border-color var(--transition-fast)',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-display)',
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: '6px',
    display: 'block',
  };

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '880px' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '48px' }}>Checkout</h1>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '48px',
            alignItems: 'start',
          }}
          className="checkout-layout"
        >
          <div>
            <h3 style={{ marginBottom: '24px' }}>Shipping address</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Full name</label>
                <input style={inputStyle} required value={form.name} onChange={(e) => updateField('name', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input style={inputStyle} type="email" required value={form.email} onChange={(e) => updateField('email', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input style={inputStyle} type="tel" required value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Address</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  required
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>City</label>
                  <input style={inputStyle} required value={form.city} onChange={(e) => updateField('city', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>State</label>
                  <input style={inputStyle} required value={form.state} onChange={(e) => updateField('state', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Pincode</label>
                  <input style={inputStyle} required value={form.pincode} onChange={(e) => updateField('pincode', e.target.value)} />
                </div>
              </div>
            </div>
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
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem',
                  padding: '6px 0',
                }}
              >
                <span style={{ color: 'var(--color-warm-gray)' }}>
                  {item.name} ({item.size}) × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--color-sand)',
                paddingTop: '12px',
                marginTop: '12px',
                marginBottom: '24px',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
              }}
            >
              <span>Total</span>
              <span>{formatPrice(totalPrice())}</span>
            </div>
            <Button variant="primary" size="lg" fullWidth type="submit">
              Place Order
            </Button>
          </div>
        </form>

        <style>{`
          @media (max-width: 768px) {
            .checkout-layout {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
