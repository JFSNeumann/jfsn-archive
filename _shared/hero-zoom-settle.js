/* hero-zoom-settle.js — hero section zoom-settle entrance

   On page load, hero containers start at 0.95× scale and smoothly
   settle to 1.0 over 400ms with ease-out. Creates confident "landing"
   sensation without distraction.

   Targets #chromatic-hero, #series-hero, .dh-rise parent, or generic
   [data-hero] element. Uses anime.js. Respects prefers-reduced-motion.
   JS-off safe (hero stays at 1.0×). */
(function () {
  'use strict';

  if (!window.anime || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Try multiple selectors for different page types
  var heroes = Array.prototype.slice.call(
    document.querySelectorAll(
      '#chromatic-hero, #series-hero, [data-hero], main > section:first-of-type'
    )
  );

  if (!heroes.length) return;

  // Filter to only actual hero sections (skip if page doesn't have clear hero)
  heroes = heroes.filter(function (el) {
    return el && el.offsetHeight > 200; // Genuine hero, not a tiny section
  });

  heroes.forEach(function (hero) {
    hero.style.transformOrigin = 'center top';

    window.anime({
      targets: hero,
      scale: [0.95, 1.0],
      duration: 400,
      easing: 'easeOutQuad',
      delay: 100 // Brief pause before settling
    });
  });
})();
