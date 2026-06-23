import { useState, useMemo } from 'react';
import { products, sizes, priceRanges } from '../data/products';
import ProductCard from '../components/common/ProductCard';
import { useStaggerReveal } from '../hooks/useScrollAnimation';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export default function Shop() {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<number>(-1);
  const [sort, setSort] = useState<SortOption>('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const gridRef = useStaggerReveal<HTMLDivElement>();

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedSize) {
      result = result.filter((p) => p.sizes.includes(selectedSize));
    }

    if (selectedPriceRange >= 0) {
      const range = priceRanges[selectedPriceRange];
      result = result.filter((p) => p.price >= range.min && p.price < range.max);
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [selectedSize, selectedPriceRange, sort]);

  const clearFilters = () => {
    setSelectedSize('');
    setSelectedPriceRange(-1);
  };

  const hasFilters = selectedSize || selectedPriceRange >= 0;

  return (
    <div className="section">
      <div className="container">
        <div style={{ marginBottom: '48px' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              marginBottom: '8px',
            }}
          >
            Collection
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Shop</h1>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                border: '1px solid var(--color-sand)',
                borderRadius: '2px',
                fontFamily: 'var(--font-display)',
                fontSize: '0.8rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                backgroundColor: filtersOpen ? 'var(--color-charcoal)' : 'transparent',
                color: filtersOpen ? 'var(--color-ivory)' : 'var(--color-charcoal)',
                transition: 'all var(--transition-fast)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="20" y2="12" />
                <line x1="12" y1="18" x2="20" y2="18" />
              </svg>
              Filters
            </button>

            {hasFilters && (
              <button
                onClick={clearFilters}
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-cinnabar)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                }}
              >
                Clear all
              </button>
            )}

            <span style={{ fontSize: '0.85rem', color: 'var(--color-warm-gray)' }}>
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--color-sand)',
              borderRadius: '2px',
              fontFamily: 'var(--font-display)',
              fontSize: '0.8rem',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {filtersOpen && (
          <div
            style={{
              display: 'flex',
              gap: '32px',
              marginBottom: '32px',
              padding: '24px',
              backgroundColor: 'var(--color-linen)',
              borderRadius: '4px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-warm-gray)',
                  marginBottom: '10px',
                }}
              >
                Size
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                    style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid',
                      borderColor:
                        selectedSize === size ? 'var(--color-charcoal)' : 'var(--color-sand)',
                      borderRadius: '2px',
                      backgroundColor:
                        selectedSize === size ? 'var(--color-charcoal)' : 'transparent',
                      color:
                        selectedSize === size ? 'var(--color-ivory)' : 'var(--color-charcoal)',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-warm-gray)',
                  marginBottom: '10px',
                }}
              >
                Price
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {priceRanges.map((range, i) => (
                  <button
                    key={range.label}
                    onClick={() => setSelectedPriceRange(selectedPriceRange === i ? -1 : i)}
                    style={{
                      padding: '8px 14px',
                      border: '1px solid',
                      borderColor:
                        selectedPriceRange === i ? 'var(--color-charcoal)' : 'var(--color-sand)',
                      borderRadius: '2px',
                      backgroundColor:
                        selectedPriceRange === i ? 'var(--color-charcoal)' : 'transparent',
                      color:
                        selectedPriceRange === i ? 'var(--color-ivory)' : 'var(--color-charcoal)',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div
          ref={gridRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: 'var(--color-warm-gray)', fontSize: '1.1rem' }}>
              No products match your filters.
            </p>
            <button
              onClick={clearFilters}
              style={{
                marginTop: '16px',
                fontSize: '0.9rem',
                color: 'var(--color-gold)',
                textDecoration: 'underline',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
