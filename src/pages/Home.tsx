import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { useCatalog } from '../hooks/useCatalog';
import { categories } from '../data/categories';
import { subscribe } from '../lib/supabase';
import { asset } from '../utils/asset';

const Scene = lazy(() => import('../components/three/Scene'));

const marquee = [
  'Premium compact cotton',
  'Cut for Indian frames',
  'Free shipping above ₹2,500',
  'Made in limited runs',
  'Crafted in India',
];

export default function Home() {
  const { products } = useCatalog();
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  async function join(e: React.FormEvent) {
    e.preventDefault();
    try { await subscribe(email.trim()); } catch { /* stored locally if offline */ }
    setJoined(true);
    setEmail('');
  }

  return (
    <>
      <section className="hero">
        <div className="hero-media">
          <img src={asset('/assets/campaign/hero-black.png')} alt="Laoban structured black tee campaign" />
        </div>
        <div className="shell hero-copy">
          <p className="eyebrow">Premium Menswear · India</p>
          <h1 className="display">Refined<br /><span className="serif-italic">essentials.</span></h1>
          <p className="body-large">
            Considered menswear for the modern Indian man — premium fabrics,
            precise fits, and limited runs you'll reach for first.
          </p>
          <div className="hero-actions">
            <Link className="btn btn--accent" to="/shop">Shop the collection</Link>
            <Link className="btn btn--outline" to="/about" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.4)' }}>Our story</Link>
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
              <h2 className="title" style={{ marginTop: 16 }}>Wardrobe<br /><span className="serif-italic">foundations.</span></h2>
            </div>
            <p className="body-large">
              Pieces that carry a wardrobe—not a season. Precise proportion,
              honest material, and quiet confidence in every stitch.
            </p>
          </div>
          <div className="product-grid">
            {products.filter((p) => p.featured).slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="editorial-grid">
        <div className="editorial-image">
          <img src={asset('/assets/campaign/forest-polo.png')} alt="Laoban knit polo campaign" />
        </div>
        <div className="editorial-copy">
          <p className="eyebrow">The Laoban study · 01</p>
          <div>
            <h2 className="title">Built<br /><span className="serif-italic">to last.</span></h2>
            <p className="body-large" style={{ marginTop: 28, color: 'rgba(250,243,224,.72)' }}>
              Made for Indian days that run from the first meeting to the last
              table. Composure, never stiffness.
            </p>
            <Link className="btn btn--ivory" style={{ marginTop: 34 }} to="/shop?category=Polos">Explore polos</Link>
          </div>
          <span className="eyebrow" style={{ color: 'rgba(250,243,224,.55)' }}>Knit polo / tailored ease</span>
        </div>
      </section>

      <section className="section light-panel">
        <div className="shell">
          <div className="section-head">
            <div>
              <p className="eyebrow">Shop by category</p>
              <h2 className="title" style={{ marginTop: 16 }}>Find your<br /><span className="serif-italic">fit.</span></h2>
            </div>
          </div>
          <div className="cat-tiles">
            {categories.map((c) => (
              <Link key={c.slug} to={`/shop?category=${encodeURIComponent(c.name)}`} className="cat-tile">
                <img src={c.image} alt={c.name} />
                <div className="cat-tile-body">
                  <h3 className="subtitle">{c.name}</h3>
                  <span className="eyebrow">{c.blurb} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="statement">
        <div className="statement-orbit">
          <Suspense fallback={null}><Scene /></Suspense>
        </div>
        <div className="shell" style={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }}>
          <p className="eyebrow">The Laoban standard</p>
          <h2 className="title" style={{ marginTop: 28 }}>
            Quiet quality.<br /><span className="serif-italic">Lasting confidence.</span>
          </h2>
        </div>
      </section>

      <section className="section dark-panel">
        <div className="shell" style={{ maxWidth: 900, textAlign: 'center' }}>
          <p className="eyebrow" style={{ color: 'var(--accent)' }}>Private access</p>
          <h2 className="title" style={{ marginTop: 18, color: '#fff' }}>First word on the next drop.</h2>
          {joined ? (
            <p className="body-large" style={{ marginTop: 24, color: 'rgba(250,243,224,.8)' }}>Thank you — you're on the list.</p>
          ) : (
            <form style={{ display: 'flex', maxWidth: 560, margin: '36px auto 0' }} onSubmit={join}>
              <input
                aria-label="Email address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                style={{ flex: 1, minWidth: 0, background: 'transparent', border: '1px solid rgba(250,243,224,.28)', color: 'var(--ivory)', padding: '0 18px' }}
              />
              <button className="btn btn--accent">Join</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
