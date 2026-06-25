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
  );
  var footer = document.querySelector('footer');

  if (!sections.length) return;

  sections.forEach(function (el) {
    el.style.willChange = 'transform';
  });

  if (footer) footer.style.willChange = 'transform';

  var ticking = false;

  function updateParallax() {
    var y = window.scrollY || window.pageYOffset || 0;

    // Sections: environment-plate rate (0.95×)
    var sectionOffset = -Math.min(y * 0.05, 40);
    sections.forEach(function (el) {
      el.style.transform = 'translateY(' + sectionOffset + 'px)';
    });

    // Footer: scrim rate (1.05×) — pulls forward
    if (footer) {
      var footerOffset = Math.min(y * 0.05, 60);
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
