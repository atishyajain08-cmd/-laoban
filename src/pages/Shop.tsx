import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import { categoryNames, getCategory } from '../data/categories';
import { useCatalog } from '../hooks/useCatalog';

export default function Shop() {
  const { products } = useCatalog();
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState('featured');

  const category = params.get('category') || 'All';
  const subcategory = params.get('subcategory') || '';
  const q = (params.get('q') || '').toLowerCase();
  const onlyNew = params.get('filter') === 'new';
  const onlyBest = params.get('filter') === 'bestseller';
  const activeCat = getCategory(category);

  function chooseCategory(c: string) {
    const next = new URLSearchParams(params);
    next.delete('subcategory');
    if (c === 'All') next.delete('category'); else next.set('category', c);
    setParams(next);
  }
  function chooseSub(s: string) {
    const next = new URLSearchParams(params);
    if (subcategory === s) next.delete('subcategory'); else next.set('subcategory', s);
    setParams(next);
  }

  const list = useMemo(() => {
    let x = products
      .filter((p) => category === 'All' || p.category === category)
      .filter((p) => !subcategory || p.subcategory === subcategory || p.tags?.includes(subcategory))
      .filter((p) => !onlyNew || p.isNew)
      .filter((p) => !onlyBest || p.bestSeller || p.featured)
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.subcategory || '').toLowerCase().includes(q));
    if (sort === 'low') x = [...x].sort((a, b) => a.price - b.price);
    if (sort === 'high') x = [...x].sort((a, b) => b.price - a.price);
    if (sort === 'new') x = [...x].sort((a, b) => Number(b.isNew) - Number(a.isNew));
    return x;
  }, [products, category, subcategory, onlyNew, onlyBest, q, sort]);

  const heading = q ? `“${params.get('q')}”`
    : onlyNew ? 'New Arrivals'
    : onlyBest ? 'Best Sellers'
    : category === 'All' ? 'The edit.' : category;
  const eyebrow = q ? 'Search results'
    : onlyNew ? 'New In'
    : onlyBest ? 'Most Wanted'
    : category === 'All' ? 'The complete wardrobe' : 'Collection';

  return (
    <>
      <header className="shop-head">
        <div className="shell">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display" style={{ marginTop: 22 }}>{heading}</h1>
          <p className="body-large" style={{ maxWidth: 520, marginTop: 24 }}>
            {activeCat
              ? `${activeCat.blurb}. Designed in India, built around proportion and material.`
              : 'Designed in India. Built around proportion, material, and the quiet confidence of getting it right.'}
          </p>
        </div>
      </header>

      <div className="shop-toolbar">
        <div className="shell">
          <div className="toolbar-inner">
            <div className="filter-row">
              {categoryNames.map((c) => (
                <button key={c} onClick={() => chooseCategory(c)} className={`chip ${category === c ? 'active' : ''}`}>{c}</button>
              ))}
            </div>
            <select aria-label="Sort products" className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="new">Newest</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </div>
          {activeCat && activeCat.subcategories.length > 0 && (
            <div className="subfilter-row">
              {activeCat.subcategories.map((s) => (
                <button key={s.slug} onClick={() => chooseSub(s.name)} className={`subchip ${subcategory === s.name ? 'active' : ''}`}>{s.name}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="section--compact">
        <div className="shell">
          <p className="eyebrow" style={{ marginBottom: 18 }}>{list.length} {list.length === 1 ? 'piece' : 'pieces'}</p>
          {list.length ? (
            <div className="product-grid">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          ) : (
            <div className="empty-state">
              <h3 className="subtitle">Nothing here yet.</h3>
              <p className="body-large" style={{ marginTop: 12 }}>No pieces match this filter — try another category.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
