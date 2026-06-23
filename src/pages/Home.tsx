import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { useCatalog } from '../hooks/useCatalog';
import { asset } from '../utils/asset';

const Scene = lazy(() => import('../components/three/Scene'));

const marquee = [
  'Premium compact cotton',
  'Cut for Indian frames',
  'Free shipping above ₹2,500',
  'Made in considered quantities',
  '老板 · Be the Boss',
];

const categories: [string, string, string][] = [
  ['01', 'T-Shirts', 'The daily foundation'],
  ['02', 'Polos', 'Polish without the stiffness'],
  ['03', 'Trousers', 'A sharper line'],
];

export default function Home() {
  const { products } = useCatalog();
  return (
    <>
      <section className="hero">
        <div className="hero-media">
          <img src={asset('/assets/campaign/hero-black.png')} alt="Laoban structured black tee campaign" />
        </div>
        <div className="shell hero-copy">
          <p className="eyebrow">老板 — Be the Boss</p>
          <h1 className="display">Own<br />the room.</h1>
          <p className="body-large">
            Premium menswear for the man who leads it. Cut for Indian frames,
            made in considered quantities, and built to be remembered.
          </p>
          <div className="hero-actions">
            <Link className="btn btn--accent" to="/shop">Shop the collection <span>↗</span></Link>
            <Link className="btn btn--outline" to="/about">The brand story</Link>
          </div>
        </div>
        <span className="hero-index">Designed in India · 2026</span>
      </section>

      <div className="marquee">
        <div className="marquee-track">
          {[...Array(2)].flatMap(() => marquee).map((x, i) => <span key={i}>{x}</span>)}
        </div>
      </div>

      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="eyebrow">The essentials</p>
              <h2 className="title" style={{ marginTop: 16 }}>Built<br />to lead.</h2>
            </div>
            <p className="body-large">
              Pieces that carry a wardrobe—not a season. Precise proportion,
              honest material, and quiet confidence in every stitch.
            </p>
          </div>
          <div className="product-grid">
            {products.filter(p => p.featured).slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="editorial-grid">
        <div className="editorial-image">
          <img src={asset('/assets/campaign/forest-polo.png')} alt="Laoban knit polo campaign" />
        </div>
        <div className="editorial-copy">
          <p className="eyebrow" style={{ color: 'var(--gold)' }}>Laoban study · 01</p>
          <div>
            <h2 className="title">Clothes that<br />command the room.</h2>
            <p className="body-large" style={{ marginTop: 28, color: 'rgba(242,239,231,.72)' }}>
              Made for Indian days that run from the first meeting to the last
              table. Composure, never stiffness.
            </p>
            <Link className="btn btn--ivory" style={{ marginTop: 34 }} to="/shop?category=Polos">Explore polos</Link>
          </div>
          <span className="eyebrow" style={{ color: 'rgba(242,239,231,.55)' }}>Knit polo / tailored ease</span>
        </div>
      </section>

      <section className="statement">
        <div className="statement-orbit">
          <Suspense fallback={null}><Scene /></Suspense>
        </div>
        <div className="shell" style={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }}>
          <p className="eyebrow">The 老板 code</p>
          <h2 className="title" style={{ marginTop: 28 }}>
            Not loud. Not borrowed.<br />
            <span style={{ color: 'var(--accent-soft)' }}>Entirely yours.</span>
          </h2>
        </div>
      </section>

      <section className="section light-panel">
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="eyebrow">Build the wardrobe</p>
              <h2 className="title" style={{ marginTop: 16 }}>Three precise<br />directions.</h2>
            </div>
          </div>
          <div className="category-grid" style={{ background: 'var(--line-dark)' }}>
            {categories.map(([n, c, t]) => (
              <Link key={c} to={`/shop?category=${c}`} className="category-card">
                <span className="category-number">{n}</span>
                <div>
                  <h3 className="subtitle">{t}</h3>
                  <p className="eyebrow" style={{ marginTop: 18 }}>Shop {c} ↗</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark-panel">
        <div className="shell" style={{ maxWidth: 900, textAlign: 'center' }}>
          <p className="eyebrow">Private access</p>
          <h2 className="title" style={{ marginTop: 18 }}>First word on the next drop.</h2>
          <form style={{ display: 'flex', maxWidth: 560, margin: '36px auto 0' }} onSubmit={e => e.preventDefault()}>
            <input
              aria-label="Email address"
              type="email"
              required
              placeholder="Email address"
              style={{ flex: 1, minWidth: 0, background: 'transparent', border: '1px solid var(--line)', color: 'var(--ivory)', padding: '0 18px' }}
            />
            <button className="btn btn--accent">Join</button>
          </form>
        </div>
      </section>
    </>
  );
}
