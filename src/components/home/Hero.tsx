import { lazy, Suspense, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import Button from '../common/Button';

const Scene = lazy(() => import('../three/Scene'));

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !textRef.current) return;

    const els = textRef.current.children;
    gsap.set(els, { y: 40, opacity: 0 });
    const tween = gsap.to(els, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.3,
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--color-charcoal)',
        overflow: 'hidden',
      }}
    >
      <div
        className="hero-3d-container"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '55%',
          height: '100%',
          opacity: 0.85,
        }}
      >
        <Suspense
          fallback={
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  border: '2px solid rgba(197, 165, 90, 0.2)',
                  borderTopColor: 'var(--color-gold)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
            </div>
          }
        >
          <Scene />
        </Suspense>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div ref={textRef} style={{ maxWidth: '560px' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              marginBottom: '16px',
            }}
          >
            Premium Menswear
          </p>

          <h1
            style={{
              color: 'var(--color-ivory)',
              marginBottom: '24px',
              lineHeight: 1.1,
            }}
          >
            Be the boss.
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--color-warm-gray-light)',
              lineHeight: 1.7,
              marginBottom: '40px',
              maxWidth: '440px',
            }}
          >
            Confidence isn't loud — it's the quiet knowing that every detail is handled. Laoban is menswear for the man who sets the standard.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/shop">
              <Button variant="secondary" size="lg">
                Shop Now
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="outline"
                size="lg"
                style={{
                  borderColor: 'rgba(250, 250, 245, 0.3)',
                  color: 'var(--color-ivory)',
                }}
              >
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--color-warm-gray)',
          animation: 'float 2s ease-in-out infinite',
        }}
      >
        <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Scroll
        </span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 4v16M8 20l-4-4M8 20l4-4" />
        </svg>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
        @media (max-width: 768px) {
          .hero-3d-container {
            width: 100% !important;
            opacity: 0.3 !important;
          }
        }
      `}</style>
    </section>
  );
}
