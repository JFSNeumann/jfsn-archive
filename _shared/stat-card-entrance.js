/* stat-card-entrance.js — stat boxes scale-fade entrance

   Any element with [data-stat-card] attribute scales up (0.9 → 1.0)
   and fades in (0 → 1) on page load with staggered timing.
   Pairs nicely with count-up animations.

   No opt-in markup needed for archive grid count — script auto-detects
   #work-count. For other stat boxes, add data-stat-card attribute.
   Uses anime.js. Respects prefers-reduced-motion. JS-off safe. */
(function () {
  'use strict';

  if (!window.anime || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Auto-detect common stat elements
  var stats = Array.prototype.slice.call(
    document.querySelectorAll(
      '[data-stat-card], #work-count, #chrom-count-works, #ghost-grid'
    )
  );

  if (!stats.length) return;

  stats.forEach(function (stat, i) {
    stat.style.opacity = '0';
    stat.style.transform = 'scale(0.9)';

    window.anime({
      targets: stat,
      opacity: [0, 1],
      scale: [0.9, 1.0],
      duration: 500,
      easing: 'easeOutQuad',
      delay: 50 * i // 50ms stagger
    });
  });
})();
