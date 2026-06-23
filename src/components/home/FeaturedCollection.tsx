import { products } from '../../data/products';
import ProductCard from '../common/ProductCard';
import { useStaggerReveal } from '../../hooks/useScrollAnimation';
import { useRevealOnScroll } from '../../hooks/useScrollAnimation';

export default function FeaturedCollection() {
  const titleRef = useRevealOnScroll<HTMLDivElement>();
  const gridRef = useStaggerReveal<HTMLDivElement>();
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="section" style={{ backgroundColor: 'var(--color-ivory)' }}>
      <div className="container">
        <div ref={titleRef} style={{ textAlign: 'center', marginBottom: '48px' }}>
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
            Featured
          </p>
          <h2>The essentials</h2>
          <p
            style={{
              marginTop: '12px',
              color: 'var(--color-warm-gray)',
              maxWidth: '480px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Curated pieces that anchor every boss's wardrobe.
          </p>
        </div>

        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
