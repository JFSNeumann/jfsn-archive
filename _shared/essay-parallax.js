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

  function updateParallax() {
    var y = window.scrollY || window.pageYOffset || 0;
    quotes.forEach(function (el, i) {
      var rate = rates[i % 3];
      // Parallax is capped at 80px so it doesn't drift too far off-screen
      var offset = -Math.min(y * (1 - rate), 80);
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
