/* counter-animate.js — number count-up animation on scroll reveal

   Triggers an anime.js count animation on any element with
   [data-count-target="NUMBER"] when it scrolls into view.

   Usage: <span data-count-target="1084">1,084</span>
   The element starts at 0 and counts up to 1084 with comma formatting
   when the element enters the viewport.

   Respects prefers-reduced-motion (skips animation, shows final number).
   JS-off safe (number stays visible in HTML). */
(function () {
  'use strict';

  if (!window.anime || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var targets = Array.prototype.slice.call(
    document.querySelectorAll('[data-count-target]')
  );

  if (!targets.length) return;

  var animatedSet = new Set();

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      if (animatedSet.has(el)) return; // Already animated

      var target = parseInt(el.getAttribute('data-count-target'), 10);
      if (isNaN(target)) return;

      animatedSet.add(el);
      var obj = { val: 0 };
      window.anime({
        targets: obj,
        val: target,
        duration: 1600,
        easing: 'easeInOutQuad',
        round: 1,
        update: function () {
          el.textContent = Math.round(obj.val).toLocaleString();
        },
        complete: function () {
          el.textContent = target.toLocaleString();
        }
      });
    });
  }, { threshold: 0.5 });

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
