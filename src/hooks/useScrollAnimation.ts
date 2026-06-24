import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Reveal helpers. IMPORTANT: these are fail-safe — if ScrollTrigger never fires
// (e.g. smooth-scroll/raf hiccup, trigger never reached), a fallback timer forces
// the element fully visible so content can never get stuck at opacity:0.
export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !ref.current) return;

    const el = ref.current;
    gsap.set(el, { y: 40, opacity: 0 });

    let done = false;
    const reveal = () => {
      done = true;
      gsap.to(el, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', overwrite: true });
    };

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: reveal,
    });
    // If the element is already in view on mount, reveal immediately.
    if (st.isActive || (el.getBoundingClientRect().top < window.innerHeight)) reveal();
    // Hard fail-safe: never leave content hidden.
    const fallback = window.setTimeout(() => { if (!done) gsap.set(el, { opacity: 1, y: 0 }); }, 1600);

    return () => {
      clearTimeout(fallback);
      st.kill();
    };
  }, []);

  return ref;
}

export function useStaggerReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !ref.current) return;

    const el = ref.current;
    const children = el.children;
    gsap.set(children, { y: 30, opacity: 0 });

    let done = false;
    const reveal = () => {
      done = true;
      gsap.to(children, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', overwrite: true });
    };

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: reveal,
    });
    if (st.isActive || (el.getBoundingClientRect().top < window.innerHeight)) reveal();
    const fallback = window.setTimeout(() => { if (!done) gsap.set(children, { opacity: 1, y: 0 }); }, 1600);

    return () => {
      clearTimeout(fallback);
      st.kill();
    };
  }, []);

  return ref;
}
