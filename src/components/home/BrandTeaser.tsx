import { Link } from 'react-router-dom';
import { useRevealOnScroll } from '../../hooks/useScrollAnimation';
import Button from '../common/Button';

export default function BrandTeaser() {
  const ref = useRevealOnScroll<HTMLElement>();

  return (
    <section
      ref={ref}
      className="section"
      style={{ backgroundColor: 'var(--color-linen)' }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          <div>
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
              The brand
            </p>
            <h2 style={{ marginBottom: '20px' }}>
              老板 means boss.
              <br />
              And you are one.
            </h2>
            <p
              style={{
                color: 'var(--color-warm-gray)',
                lineHeight: 1.8,
                marginBottom: '12px',
              }}
            >
              Laoban was born from a simple idea: the modern Indian man deserves clothing that matches his ambition. Not fast fashion. Not throwaway trends. Pieces built with intention, cut with precision, worn with confidence.
            </p>
            <p
              style={{
                color: 'var(--color-warm-gray)',
                lineHeight: 1.8,
                marginBottom: '32px',
              }}
            >
              Every thread, every stitch, every silhouette — considered. Because being the boss isn't about what you say. It's about how you show up.
            </p>
            <Link to="/about">
              <Button variant="outline" size="md">
                Read Our Story
              </Button>
            </Link>
          </div>

          <div
            style={{
              position: 'relative',
              aspectRatio: '4/5',
              backgroundColor: 'var(--color-sand)',
              borderRadius: '4px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                color: 'var(--color-warm-gray-light)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '4rem',
                  fontWeight: 500,
                  color: 'var(--color-gold)',
                  opacity: 0.4,
                  lineHeight: 1,
                }}
              >
                老板
              </p>
              <p
                style={{
                  marginTop: '12px',
                  fontSize: '0.75rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                Brand image placeholder
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
