import { Link } from 'react-router-dom';
import ProductCard from '../common/ProductCard';
import { useCatalog } from '../../hooks/useCatalog';
import { getNewArrivals } from '../../data/products';
import { useStaggerReveal } from '../../hooks/useScrollAnimation';

export default function NewArrivals() {
  const { products } = useCatalog();
  const items = getNewArrivals(products).slice(0, 4);
  const grid = useStaggerReveal<HTMLDivElement>();
  if (!items.length) return null;
  return (
    <section className="section">
      <div className="shell">
        <div className="section-head section-head--center">
          <div>
            <p className="eyebrow">New In</p>
            <h2 className="title" style={{ marginTop: 16 }}>New<br /><span className="serif-italic">arrivals.</span></h2>
          </div>
        </div>
        <div className="product-grid" ref={grid}>
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="section-cta">
          <Link className="btn btn--outline" to="/shop?filter=new">Shop all new arrivals</Link>
        </div>
      </div>
    </section>
  );
}
