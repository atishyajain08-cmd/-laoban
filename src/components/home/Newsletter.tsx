import { useState } from 'react';
import { useRevealOnScroll } from '../../hooks/useScrollAnimation';
import Button from '../common/Button';

export default function Newsletter() {
  const ref = useRevealOnScroll<HTMLElement>();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  }

  return (
    <section ref={ref} style={{ padding: '80px 0', backgroundColor: 'var(--color-charcoal)' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-gold)',
            marginBottom: '12px',
          }}
        >
          Stay in the loop
        </p>
        <h2 style={{ color: 'var(--color-ivory)', marginBottom: '12px' }}>
          Join the inner circle
        </h2>
        <p
          style={{
            color: 'var(--color-warm-gray-light)',
            marginBottom: '32px',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Early access, exclusive drops, and things we only share with the boss.
        </p>

        {submitted ? (
          <p style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-display)' }}>
            Welcome to the circle, boss.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              gap: '12px',
              maxWidth: '440px',
              margin: '0 auto',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: '1 1 240px',
                padding: '14px 20px',
                backgroundColor: 'rgba(250, 250, 245, 0.08)',
                border: '1px solid rgba(250, 250, 245, 0.15)',
                borderRadius: '2px',
                color: 'var(--color-ivory)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            <Button variant="secondary" type="submit">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
