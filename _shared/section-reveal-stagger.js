/* section-reveal-stagger.js — staggered section entrance on load

   Each major section (main > section) fades in + slides up sequentially
   on page load, creating a guided reading flow. Uses the existing
   .reveal-section + .reveal-delay-* system from ui.css.

   Targets main > section elements. No opt-in markup needed. Respects
   prefers-reduced-motion. JS-off safe. */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main > section')
  );

  if (!sections.length) return;

  // Add reveal class with staggered delays
  sections.forEach(function (el, i) {
    var delayIdx = Math.min(i, 4); // Max delay cap at index 4
    el.classList.add('reveal-section', 'reveal-delay-' + (delayIdx + 1));
    // Force reflow
    el.offsetHeight;
    el.classList.add('revealed');
  });
})();
