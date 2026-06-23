import { useRevealOnScroll } from '../hooks/useScrollAnimation';

export default function About() {
  const section1 = useRevealOnScroll<HTMLDivElement>();
  const section2 = useRevealOnScroll<HTMLDivElement>();
  const section3 = useRevealOnScroll<HTMLDivElement>();

  return (
    <div>
      <section
        style={{
          padding: '120px 0 80px',
          backgroundColor: 'var(--color-charcoal)',
          color: 'var(--color-ivory)',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              marginBottom: '16px',
            }}
          >
            Our Story
          </p>
          <h1 style={{ marginBottom: '20px' }}>
            Every boss has<br />an origin story.
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--color-warm-gray-light)',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.8,
            }}
          >
            Laoban wasn't born in a boardroom. It started with a question:
            why does looking the part have to cost a fortune or compromise on quality?
          </p>
        </div>
      </section>

      <section className="section" style={{ backgroundColor: 'var(--color-ivory)' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <div ref={section1} style={{ marginBottom: '64px' }}>
            <h2 style={{ marginBottom: '16px' }}>The name</h2>
            <p style={{ color: 'var(--color-warm-gray)', lineHeight: 1.9, marginBottom: '16px' }}>
              老板 (Lǎobǎn) — Mandarin for "boss" or "owner." Not the corner-office, suit-and-tie kind. The self-made kind. The one who built something from scratch, who leads by example, who earns respect instead of demanding it.
            </p>
            <p style={{ color: 'var(--color-warm-gray)', lineHeight: 1.9 }}>
              We chose this name because it captures something universal: the drive to be your own person, to set your own standard. Whether you're running a startup from your apartment or walking into your first job interview — there's a boss inside. Laoban is how you dress that energy.
            </p>
          </div>

          <div ref={section2} style={{ marginBottom: '64px' }}>
            <h2 style={{ marginBottom: '16px' }}>The philosophy</h2>
            <p style={{ color: 'var(--color-warm-gray)', lineHeight: 1.9, marginBottom: '16px' }}>
              We believe premium doesn't have to mean premium pricing. Every Laoban piece is designed in India, made from carefully sourced fabrics, and built to last — at a price point that respects your hustle.
            </p>
            <p style={{ color: 'var(--color-warm-gray)', lineHeight: 1.9 }}>
              No logos screaming for attention. No trend-chasing. Just intentional design, honest materials, and fits that actually work on Indian body types. We obsess over the details so you can focus on what matters — being the boss.
            </p>
          </div>

          <div ref={section3}>
            <h2 style={{ marginBottom: '16px' }}>The craft</h2>
            <p style={{ color: 'var(--color-warm-gray)', lineHeight: 1.9, marginBottom: '16px' }}>
              Every t-shirt starts as a conversation between fabric and fit. We test dozens of cotton weights, trial multiple stitching techniques, and wear-test each piece before it earns the Laoban name.
            </p>
            <p style={{ color: 'var(--color-warm-gray)', lineHeight: 1.9, marginBottom: '16px' }}>
              Our white tees? They're not "just white tees." The Classic Crew uses 180 GSM combed cotton that softens with every wash. The Oversized uses 220 GSM heavyweight fabric for that structured drape. The Polo features piqué-knit cotton with a collar engineered to hold its shape.
            </p>
            <p style={{ color: 'var(--color-warm-gray)', lineHeight: 1.9 }}>
              Because if you're going to do something simple, you'd better do it perfectly.
            </p>
          </div>

          <div
            style={{
              marginTop: '64px',
              padding: '40px',
              backgroundColor: 'var(--color-linen)',
              borderRadius: '4px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '3rem',
                color: 'var(--color-gold)',
                opacity: 0.6,
                lineHeight: 1,
                marginBottom: '16px',
              }}
            >
              老板
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                marginBottom: '8px',
              }}
            >
              Be the boss.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-warm-gray)' }}>
              Confidence, crafted. From India, for the modern man.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
