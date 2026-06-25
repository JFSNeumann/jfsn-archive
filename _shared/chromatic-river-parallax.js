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

  function updateParallax() {
    var y = window.scrollY || window.pageYOffset || 0;
    // Decade labels: environment plate rate (0.90×)
    var decadeOffset = -Math.min(y * 0.10, 60);
    decadeLabels.style.transform = 'translateY(' + decadeOffset + 'px)';
    // Count strip: middle layer (0.95×)
    var countsOffset = -Math.min(y * 0.05, 40);
    counts.style.transform = 'translateY(' + countsOffset + 'px)';
    // Footer: scrim rate (1.05×) — pulls forward
    var footerOffset = Math.min(y * 0.05, 60);
    footer.style.transform = 'translateY(' + footerOffset + 'px)';
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
