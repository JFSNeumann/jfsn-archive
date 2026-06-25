/* filter-slide-in.js — filter panel entrance animation

   Filter control bar (#filter-controls, #archive-filters, or similar)
   slides in from the left on page load with subtle ease, creating
   the sense of the interface "building" itself.

   Targets #filter-controls or #archive-filters. Archive-specific.
   Uses anime.js. Respects prefers-reduced-motion. JS-off safe. */
(function () {
  'use strict';

  if (!window.anime || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var filterBar = document.getElementById('filter-controls') ||
                   document.getElementById('archive-filters') ||
                   document.querySelector('[data-filter-panel]');

  if (!filterBar) return;

  filterBar.style.opacity = '0';
  filterBar.style.transform = 'translateX(-20px)';

  window.anime({
    targets: filterBar,
    opacity: [0, 1],
    translateX: [-20, 0],
    duration: 500,
    easing: 'easeOutCubic',
    delay: 200 // After hero settles
  });
})();
