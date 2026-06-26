/* essay-parallax.js — v1 essay motion primitive (shared, single source of truth)

   Applies staggered parallax to blockquotes on essay pages (stories.html,
   why-i-made-things.html). The body text stays locked at 1.0× scroll;
   pull quotes drift upward at 0.88–0.92× (environment-plate rate), creating
   depth and visual rhythm.

   No opt-in markup needed — it auto-targets all `.prose blockquote` elements
   and applies parallax at load time. Just include this file with `defer`,
   AFTER _shared/anime.min.js.

   Two things stay true:
   1. The body text plane is never moved — only quotes parallax.
   2. JS-off safe: this script applies transform via JS, so with JS off
      blockquotes stay fully visible with zero parallax (honest, readable).
   Reduced-motion: the whole thing is skipped, leaving clean static states. */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var quotes = Array.prototype.slice.call(
    document.querySelectorAll('.prose blockquote')
  );

  if (!quotes.length) return;

  // Parallax rates: stagger every 3rd quote through 0.88, 0.90, 0.92
  var rates = [0.88, 0.90, 0.92];

  quotes.forEach(function (el, i) {
    el.style.willChange = 'transform';
  });

  var ticking = false;

  // Per-element, position-relative-to-viewport offset (not raw scrollY) —
  // a global scrollY-based offset caps out after one screen of scrolling and
  // then freezes for the rest of the page (same bug found and fixed in
  // section-parallax.js / chromatic-river-parallax.js this session). With 18
  // blockquotes on stories.html, a global offset would freeze nearly all of
  // them at the same capped value well before the page ends. Computing each
  // quote's own distance from viewport-center instead gives every quote its
  // own drift as it passes through, for the full length of the page.
  function updateParallax() {
    var viewportCenter = window.innerHeight / 2;
    quotes.forEach(function (el, i) {
      var rate = rates[i % 3];
      var rect = el.getBoundingClientRect();
      var delta = (rect.top + rect.height / 2) - viewportCenter;
      var offset = Math.max(-80, Math.min(80, -delta * (1 - rate)));
      el.style.transform = 'translateY(' + offset + 'px)';
    });
    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateParallax);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateParallax(); // Initial state
})();
