'use client';

import { useEffect } from 'react';

/**
 * Ports the original fade-and-rise reveal animation: observes cards as they
 * enter the viewport and fades them in. Runs once per page mount.
 */
export default function ScrollRevealInit() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      '.cat-card, .product-card, .why-card, .testi-card'
    );
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );

    targets.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
