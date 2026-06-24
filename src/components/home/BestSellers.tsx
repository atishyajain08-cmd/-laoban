import { Link } from 'react-router-dom';
import ProductCard from '../common/ProductCard';
import { useCatalog } from '../../hooks/useCatalog';
import { getBestSellers } from '../../data/products';
import { useStaggerReveal } from '../../hooks/useScrollAnimation';

export default function BestSellers() {
  const { products } = useCatalog();
  const items = getBestSellers(products).slice(0, 3);
  const grid = useStaggerReveal<HTMLDivElement>();
  if (!items.length) return null;
  return (
    <section className="section light-panel">
      <div className="shell">
        <div className="section-head section-head--center">
          <div>
            <p className="eyebrow">Most Wanted</p>
            <h2 className="title" style={{ marginTop: 16 }}>Best<br /><span className="serif-italic">sellers.</span></h2>
          </div>
        </div>
        <div className="product-grid product-grid--three" ref={grid}>
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="section-cta">
          <Link className="btn btn--accent" to="/shop?filter=bestseller">Shop best sellers</Link>
        </div>
      </div>
    </section>
  );
}
