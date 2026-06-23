/* artwork-animations.js — Artwork detail page reveal choreography with anime.js
   A single master Timeline orchestrates the page-load entrance so every
   piece arrives in relation to the others, not as separate fades:
   - Back link slides in first
   - Image follows a short, gentle motion-path arc (anime.path) while
     fading/scaling up — never distorts the image itself, just how it arrives
   - Title gets one restrained spring overshoot (the single "earned" gesture);
     eyebrow/subline/meta rows stay on a calm stagger
   - Related works + prev/next stay as scroll/load-triggered fades
*/

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Hidden SVG path used purely as a motion-path sampler ──────────────── */
  function buildEntryPath() {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    // anime.path() derives its coordinate scale factor from this SVG's
    // rendered width/height (rect.width / viewBox.width) — a 0x0 box makes
    // that 0/0 = NaN and silently kills every translateX/Y value. Needs a
    // real nonzero size; hide it off-screen instead of collapsing it.
    svg.style.cssText = 'position:absolute;width:24px;height:24px;left:-9999px;top:-9999px;overflow:hidden;pointer-events:none;';
    const path = document.createElementNS(svgNS, 'path');
    // Gentle arc: arrives from slightly right/below, settles dead center — a
    // few px of deviation, not a swoop. Honest entrance, not a stunt.
    path.setAttribute('d', 'M 22 12 Q 6 -4 0 0');
    svg.appendChild(path);
    document.body.appendChild(svg);
    return path;
  }

  /* ─── Master load timeline ───────────────────────────────────────────────── */
  function runEntranceTimeline() {
    if (prefersReducedMotion || typeof anime === 'undefined') return;

    const backLink = document.querySelector('a[href="archive.html"]');
    const imageWrap = document.getElementById('work-image-wrap');
    const image = document.getElementById('work-image');
    const eyebrow = document.getElementById('work-eyebrow');
    const title = document.getElementById('work-title');
    const subline = document.getElementById('work-type-subline');
    const metaRows = document.getElementById('meta-rows');
    const copyBtn = document.getElementById('copy-link-btn');
    const prevLink = document.getElementById('prev-link');
    const nextLink = document.getElementById('next-link');

    const tl = anime.timeline({ easing: 'easeOutQuad' });

    if (backLink) {
      anime.set(backLink, { opacity: 0, translateX: -4 });
      tl.add({ targets: backLink, opacity: [0, 1], translateX: [-4, 0], duration: 280 });
    }

    // The browser's own cross-document view transition already morphed the
    // clicked card into this image — re-running opacity/scale/path on top of
    // that would yank it back to a "fresh fade" mid-morph. Skip just the
    // image step; everything else still gets its calm entrance.
    if (image && !window.__incomingViewTransition) {
      const pathEl = buildEntryPath();
      const pathFn = anime.path(pathEl);
      // anime.set() can't resolve path-function values (only the real tween
      // engine evaluates them per-frame) — no need to anyway: at progress 0
      // the path tween itself starts the image at the path's first point.
      anime.set(image, { opacity: 0, scale: 0.97 });
      tl.add({
        targets: image,
        opacity: [0, 1],
        scale: [0.97, 1],
        translateX: pathFn('x'),
        translateY: pathFn('y'),
        easing: 'easeOutCubic',
        duration: 700
      }, '-=120');
    }

    if (eyebrow || subline) {
      const calm = [eyebrow, subline].filter(el => el);
      anime.set(calm, { opacity: 0, translateY: 8 });
      tl.add({ targets: calm, opacity: [0, 1], translateY: [8, 0], duration: 360, delay: anime.stagger(80) }, '-=450');
    }

    if (title) {
      // The one earned gesture: a restrained spring overshoot on the title only.
      anime.set(title, { opacity: 0, translateY: 10 });
      tl.add({
        targets: title,
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 620,
        easing: 'easeOutElastic(1, 0.7)'
      }, '-=320');
    }

    if (metaRows) {
      const rows = metaRows.querySelectorAll('[class*="flex"], div');
      if (rows.length) {
        anime.set(rows, { opacity: 0, translateX: -8 });
        tl.add({ targets: rows, opacity: [0, 1], translateX: [-8, 0], duration: 320, delay: anime.stagger(55) }, '-=280');
      }
    }

    if (copyBtn) {
      anime.set(copyBtn, { opacity: 0 });
      tl.add({ targets: copyBtn, opacity: [0, 1], duration: 280 }, '-=120');
    }

    if (prevLink || nextLink) {
      const nav = [prevLink, nextLink].filter(el => el);
      anime.set(nav, { opacity: 0 });
      tl.add({ targets: nav, opacity: [0, 1], duration: 280, delay: anime.stagger(100) }, '-=100');
    }
  }

  /* ─── Persistent scroll parallax on the image (independent of load timeline) ── */
  function setupImageParallax() {
    if (prefersReducedMotion) return;

    const imageWrap = document.getElementById('work-image-wrap');
    const image = document.getElementById('work-image');
    if (!imageWrap || !image) return;

    window.addEventListener('scroll', function() {
      const rect = imageWrap.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1,
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      ));
      const parallaxOffset = scrollProgress * 20; // 20px max parallax
      image.style.transform = `translateY(${parallaxOffset}px)`;
    }, { passive: true });
  }

  /* ─── Accent Color Animation ────────────────────────────────────────────── */
  function setupAccentColor() {
    if (prefersReducedMotion) return;

    const eyebrow = document.getElementById('work-eyebrow');
    if (!eyebrow) return;

    anime({
      targets: eyebrow,
      color: '#FF6600',
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

  /* ─── Init ──────────────────────────────────────────────────────────────── */
  function init() {
    if (!window.anime) return; // anime.js not loaded

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    runEntranceTimeline();
    setupImageParallax();
    setupAccentColor();
    setupRelatedWorksStagger();
  }

  if (window.anime) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
})();
