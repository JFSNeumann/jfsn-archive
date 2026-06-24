/* click-feedback.js — A tactile scale-pulse on click for controls that
   currently rely on hover-only CSS transitions and otherwise give no
   feedback at the moment of the click itself: bracket-links
   ("[ Back to Archive ]" etc.), the footer back-to-top controls, and the
   floating home button.

   Reuses the exact pulse already established for archive's filter chips
   (scale 1→1.05→1, 300ms easeOutQuad — see _shared/archive-animations.js)
   rather than inventing a third click-feedback mechanism.
*/
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SELECTOR = '.bracket-link, #back-to-top, #btt-float, #floating-home-btn';

  document.addEventListener('click', function (e) {
    if (typeof anime === 'undefined') return;
    var el = e.target.closest(SELECTOR);
    if (!el) return;
    anime({ targets: el, scale: [1, 1.05, 1], duration: 300, easing: 'easeOutQuad' });
  });
})();
