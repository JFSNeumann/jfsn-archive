/* chromatic-river-parallax.js — v1 chromatic river motion primitive

   Stages the space around the river canvas with staggered parallax layers.
   The canvas (#river-wrap) stays locked at 1.0× scroll. Surrounding elements
   parallax at different rates to create visual depth:

   - Decade labels (#decade-labels): 0.90× (environment plate rate)
   - Count strip (#chromatic-counts): 0.95× (middle layer)
   - Footer: 1.05× (scrim rate — pulls forward)

   The hero section (title/description) already parallaxes via depth-hero.js
   at 1.12× for display type. No further parallax needed there.

   No opt-in markup — just include this file with `defer`, AFTER
   _shared/anime.min.js. Ignored harmlessly in browsers without requestAnimationFrame.

   Two things stay true:
   1. The river canvas plane is never moved — only staging around it.
   2. JS-off safe: this script applies transform via JS, so with JS off
      all elements stay visible and readable.
   Reduced-motion: the whole thing is skipped, leaving clean static states. */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var decadeLabels = document.getElementById('decade-labels');
  var counts = document.getElementById('chromatic-counts');
  var footer = document.querySelector('footer');

  if (!decadeLabels || !counts || !footer) return;

  decadeLabels.style.willChange = 'transform';
  counts.style.willChange = 'transform';
  footer.style.willChange = 'transform';

  var ticking = false;

  // Per-element, position-relative-to-viewport offset (not raw scrollY) —
  // see section-parallax.js for why a global scrollY-based offset freezes
  // after one screen of scrolling. Each layer gets its own depth wave as it
  // passes through the viewport instead.
  function layerOffset(el, rate, cap) {
    var rect = el.getBoundingClientRect();
    var delta = (rect.top + rect.height / 2) - (window.innerHeight / 2);
    return Math.max(-cap, Math.min(cap, -delta * rate));
  }

  function updateParallax() {
    // Decade labels: environment plate rate (0.90×)
    decadeLabels.style.transform = 'translateY(' + layerOffset(decadeLabels, 0.10, 60) + 'px)';
    // Count strip: middle layer (0.95×)
    counts.style.transform = 'translateY(' + layerOffset(counts, 0.05, 40) + 'px)';
    // Footer: scrim rate (1.05×) — pulls forward
    footer.style.transform = 'translateY(' + (-layerOffset(footer, 0.05, 60)) + 'px)';
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
