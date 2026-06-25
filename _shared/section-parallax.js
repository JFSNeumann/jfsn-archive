/* section-parallax.js — staggered section parallax for prose pages

   Applies layered parallax to main content sections on about, series, lost pages.
   Sections move at 0.95× scroll (environment-plate rate) for subtle depth.
   Footer moves at 1.05× (scrim rate — pulls forward).

   Targets `.prose`, `main section`, or generic `section` elements. No opt-in
   markup needed. Ignored harmlessly if no sections found. Respects
   prefers-reduced-motion. JS-off safe (no hidden initial state). */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main > section, .prose, main > article')
  ).filter(function (el) {
    // Skip elements already carrying their own load-time entrance treatment
    // (hero-zoom-settle.js) — both scripts write to el.style.transform
    // directly, so layering them on the same element would fight rather
    // than compose. Same non-overlap rule depth-hero.js already follows.
    return !el.hasAttribute('data-hero');
  });
  var footer = document.querySelector('footer');

  if (!sections.length) return;

  sections.forEach(function (el) {
    el.style.willChange = 'transform';
  });

  if (footer) footer.style.willChange = 'transform';

  var ticking = false;

  // Per-element, position-relative-to-viewport offset (not raw scrollY) —
  // a global scrollY-based offset caps out after one screen of scrolling and
  // then freezes for the rest of the page, since every section would be
  // pinned to the same capped number. Computing each section's own distance
  // from viewport-center instead means every section gets its moment of
  // depth as it passes through, for as long as the page scrolls.
  function updateParallax() {
    var viewportCenter = window.innerHeight / 2;

    // Sections: environment-plate rate (0.95×)
    sections.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var delta = (rect.top + rect.height / 2) - viewportCenter;
      var offset = Math.max(-40, Math.min(40, -delta * 0.05));
      el.style.transform = 'translateY(' + offset + 'px)';
    });

    // Footer: scrim rate (1.05×) — pulls forward as it enters view
    if (footer) {
      var fRect = footer.getBoundingClientRect();
      var fDelta = (fRect.top + fRect.height / 2) - viewportCenter;
      var footerOffset = Math.max(-60, Math.min(60, -fDelta * 0.05));
      footer.style.transform = 'translateY(' + footerOffset + 'px)';
    }

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
