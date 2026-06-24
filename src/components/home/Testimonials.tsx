import { useState } from 'react';
import { testimonials } from '../../data/testimonials';
import { useRevealOnScroll } from '../../hooks/useScrollAnimation';

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const head = useRevealOnScroll<HTMLDivElement>();
  const t = testimonials[current];
  const go = (d: number) => setCurrent((c) => (c + d + testimonials.length) % testimonials.length);

  return (
    <section className="section">
      <div className="shell testimonials">
        <div className="section-head section-head--center" ref={head}>
          <div>
            <p className="eyebrow">Trusted by gentlemen</p>
            <h2 className="title" style={{ marginTop: 16 }}>What our<br /><span className="serif-italic">customers say.</span></h2>
          </div>
        </div>

        <div className="testimonial" key={current}>
          <div className="stars" aria-label={`${t.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i < t.rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.3">
                <path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z" />
              </svg>
            ))}
          </div>
          <blockquote className="testimonial-quote">“{t.text}”</blockquote>
          <div className="testimonial-by">
            <span className="avatar" aria-hidden="true">{initials(t.name)}</span>
            <div>
              <p className="testimonial-name">{t.name}</p>
              <p className="testimonial-meta">{t.location} · {t.product}</p>
            </div>
          </div>
        </div>

        <div className="testimonial-controls">
          <button type="button" aria-label="Previous testimonial" onClick={() => go(-1)}>‹</button>
          <div className="dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                className={i === current ? 'active' : ''}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
          <button type="button" aria-label="Next testimonial" onClick={() => go(1)}>›</button>
        </div>
      </div>
    </section>
  );
}
