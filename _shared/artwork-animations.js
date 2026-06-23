/* artwork-animations.js — Artwork detail page reveal choreography with anime.js
   Makes each artwork page load feel intimate and orchestrated
   - Image parallax fade-in on scroll
   - Metadata stagger reveal (title, year, medium, dimensions)
   - Accent color animation to match work's dominant color
   - Related works grid stagger
   - Navigation elements gentle fade-in
*/

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Image Parallax Entrance ───────────────────────────────────────────── */
  function setupImageParallax() {
    if (prefersReducedMotion) return;

    const imageWrap = document.getElementById('work-image-wrap');
    const image = document.getElementById('work-image');
    if (!imageWrap || !image) return;

    // Wait for image to load
    image.addEventListener('load', function() {
      anime.set(image, { opacity: 0, scale: 0.98 });
      anime({
        targets: image,
        opacity: [0, 1],
        scale: [0.98, 1],
        duration: 600,
        easing: 'easeOutQuad'
      });
    });

    // Parallax on scroll
    window.addEventListener('scroll', function() {
      const rect = imageWrap.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1,
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      ));

      const parallaxOffset = scrollProgress * 20; // 20px max parallax
      image.style.transform = `translateY(${parallaxOffset}px)`;
    }, { passive: true });
  }

  /* ─── Metadata Stagger Reveal ───────────────────────────────────────────── */
  function setupMetadataStagger() {
    if (prefersReducedMotion) return;

    const eyebrow = document.getElementById('work-eyebrow');
    const title = document.getElementById('work-title');
    const subline = document.getElementById('work-type-subline');
    const metaRows = document.getElementById('meta-rows');
    const copyBtn = document.getElementById('copy-link-btn');

    const elements = [eyebrow, title, subline];
    if (elements.some(el => el)) {
      anime.set(elements.filter(el => el), { opacity: 0, translateY: 8 });
      anime({
        targets: elements.filter(el => el),
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 400,
        easing: 'easeOutQuad',
        delay: anime.stagger(80, { start: 200 })
      });
    }

    // Meta rows (year, medium, dimensions, etc.)
    if (metaRows) {
      const rows = metaRows.querySelectorAll('[class*="flex"], div');
      if (rows.length > 0) {
        anime.set(rows, { opacity: 0, translateX: -8 });
        anime({
          targets: rows,
          opacity: [0, 1],
          translateX: [-8, 0],
          duration: 350,
          easing: 'easeOutQuad',
          delay: anime.stagger(60, { start: 500 })
        });
      }
    }

    // Copy button
    if (copyBtn) {
      anime.set(copyBtn, { opacity: 0 });
      anime({
        targets: copyBtn,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad',
        delay: 700
      });
    }
  }

  /* ─── Accent Color Animation ────────────────────────────────────────────── */
  function setupAccentColor() {
    if (prefersReducedMotion) return;

    const eyebrow = document.getElementById('work-eyebrow');
    if (!eyebrow) return;

    // Get current color from CSS or data attribute
    const currentColor = window.getComputedStyle(eyebrow).color;
    const targetColor = '#FF6600'; // Default accent

    anime({
      targets: eyebrow,
      color: targetColor,
      duration: 600,
      easing: 'easeOutQuad',
      delay: 200
    });
  }

  /* ─── Related Works Grid Stagger ────────────────────────────────────────── */
  function setupRelatedWorksStagger() {
    if (prefersReducedMotion) return;

    const relatedSection = document.getElementById('related-works-section');
    if (!relatedSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const grid = relatedSection.querySelector('[id*="grid"], .grid, [class*="grid"]');
          if (grid) {
            const cards = grid.querySelectorAll('[class*="card"], [class*="item"], > div');
            if (cards.length > 0) {
              anime.set(cards, { opacity: 0, translateY: 12 });
              anime({
                targets: cards,
                opacity: [0, 1],
                translateY: [12, 0],
                duration: 350,
                easing: 'easeOutQuad',
                delay: anime.stagger(50)
              });
            }
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(relatedSection);
  }

  /* ─── Navigation Prev/Next Fade In ──────────────────────────────────────── */
  function setupNavigation() {
    if (prefersReducedMotion) return;

    const prevLink = document.getElementById('prev-link');
    const nextLink = document.getElementById('next-link');
    const prevNext = document.getElementById('prev-next');

    if (prevNext) {
      anime.set([prevLink, nextLink].filter(el => el), { opacity: 0 });
      anime({
        targets: [prevLink, nextLink].filter(el => el),
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad',
        delay: anime.stagger(100, { start: 800 })
      });
    }
  }

  /* ─── Back Link Animation ───────────────────────────────────────────────── */
  function setupBackLink() {
    if (prefersReducedMotion) return;

    const backLink = document.querySelector('a[href="archive.html"]');
    if (backLink) {
      anime.set(backLink, { opacity: 0, translateX: -4 });
      anime({
        targets: backLink,
        opacity: [0, 1],
        translateX: [-4, 0],
        duration: 300,
        easing: 'easeOutQuad',
        delay: 100
      });
    }
  }

  /* ─── Init ──────────────────────────────────────────────────────────────── */
  function init() {
    if (!window.anime) return; // anime.js not loaded

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    setupBackLink();
    setupImageParallax();
    setupMetadataStagger();
    setupAccentColor();
    setupRelatedWorksStagger();
    setupNavigation();
  }

  // Start when anime.js is available
  if (window.anime) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
})();
