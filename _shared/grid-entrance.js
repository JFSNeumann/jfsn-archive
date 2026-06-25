/* grid-entrance.js — staggered card entrance animation

   Auto-targets cards on grid pages (index, archive, series, lost) and staggers
   them in on page load via the existing .reveal-delay-* system. Uses the
   @keyframes scroll-reveal (fade + slide) from ui.css with staggered delays.

   No opt-in markup needed — just include this file. Ignored harmlessly if no
   cards are found. Respects prefers-reduced-motion. */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var cards = document.querySelectorAll('.thumb, .featured-card, figure');
  if (!cards.length) return;

  // Trigger entrance animation by adding .reveal class with stagger
  // The animation is driven by ui.css's .scroll-reveal keyframe + .reveal-delay-*
  cards.forEach(function (el, i) {
    // Max delay: prevent > 5 items from staggering too long
    var delayIdx = Math.min(i, 4);
    el.classList.add('reveal-section', 'reveal-delay-' + (delayIdx + 1));
    // Force reflow so animation triggers
    el.offsetHeight;
    el.classList.add('revealed');
  });
})();
