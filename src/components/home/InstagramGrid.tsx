import { instagramTiles, INSTAGRAM_URL } from '../../data/instagram';
import { useStaggerReveal } from '../../hooks/useScrollAnimation';

export default function InstagramGrid() {
  const grid = useStaggerReveal<HTMLDivElement>();
  return (
    <section className="section">
      <div className="shell">
        <div className="section-head section-head--center">
          <div>
            <p className="eyebrow">@laoban</p>
            <h2 className="title" style={{ marginTop: 16 }}>Worn<br /><span className="serif-italic">well.</span></h2>
            <a className="ig-follow" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Follow us on Instagram →</a>
          </div>
        </div>
        <div className="ig-grid" ref={grid}>
          {instagramTiles.map((src, i) => (
            <a key={i} className="ig-tile" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={`Laoban menswear look ${i + 1}`}>
              <img src={src} alt={`Laoban menswear look ${i + 1}`} loading="lazy" />
              <span className="ig-overlay" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
