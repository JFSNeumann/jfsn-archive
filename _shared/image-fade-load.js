/* image-fade-load.js — progressive image fade-in on load

   Images fade in (0 → 1 opacity) as they load. Works with existing
   lazy-load system: placeholder color is visible during load,
   image fades in over it as it arrives.

   Targets all <img> tags (especially in grids/galleries).
   No opt-in markup needed. Respects prefers-reduced-motion.
   JS-off safe (images visible, no fade, which is fine). */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var images = Array.prototype.slice.call(document.querySelectorAll('img'));

  if (!images.length) return;

  images.forEach(function (img) {
    // Skip if already loaded
    if (img.complete) {
      if (!reduced) img.style.opacity = '1';
      return;
    }

    // Start invisible (placeholder shows through)
    if (!reduced) img.style.opacity = '0';

    img.addEventListener('load', function () {
      if (reduced) {
        img.style.opacity = '1';
        return;
      }

      // Fade in over 300ms
      var start = performance.now();
      var duration = 300;

      function fade() {
        var now = performance.now();
        var progress = Math.min((now - start) / duration, 1);
        img.style.opacity = progress;
        if (progress < 1) requestAnimationFrame(fade);
      }

      requestAnimationFrame(fade);
    });

    // Fallback: if image fails to load, show it anyway
    img.addEventListener('error', function () {
      img.style.opacity = '1';
    });
  });
})();
