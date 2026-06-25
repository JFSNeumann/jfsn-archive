/* depth-hero.js — v2 named motion primitive (shared, single source of truth)
   See DESIGN-SYSTEM.md § "Motion system (v2)".

   A page opts in by adding, inside its hero:
     • class "dh-rise"          on each layer that should stagger in on load
     • id   "dh-word"           (or [data-dh-word]) on the display headline that
                                 should parallax up faster than scroll
   That's it — no per-page script. Include this file with `defer`, AFTER
   _shared/anime.min.js (also deferred, so anime is defined first).

   Two things stay true (the hard rail, extended to motion):
   1. The artwork plane is never moved — only type/labels/UI around it parallax.
   2. JS-off safe: this script ADDS the hidden initial state, so with JS off
      every .dh-rise layer stays fully visible (never put opacity:0 in the HTML).
   Reduced-motion: the whole thing is skipped, leaving clean static states. */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var rises = Array.prototype.slice.call(document.querySelectorAll('.dh-rise'));
  var word  = document.getElementById('dh-word') ||
              document.querySelector('[data-dh-word]');

  function start() {
    /* 1. Load choreography — one staged reveal (only if anime.js is present). */
    if (window.anime && rises.length) {
      rises.forEach(function (el) { el.style.opacity = '0'; });
      window.anime.timeline({ easing: 'cubicBezier(0.22, 1, 0.36, 1)' })
        .add({
          targets: rises,
          opacity: [0, 1],
          translateY: [18, 0],
          duration: 700,
          delay: window.anime.stagger(90)
        });
    }

    /* 2. Display-type parallax — the word lifts away as you scroll.
          rate ~1.12x (coefficient 0.12), capped at 64px so it never drifts far. */
    if (word) {
      word.style.willChange = 'transform';
      var ticking = false;
      window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          var y = window.scrollY || window.pageYOffset || 0;
          word.style.transform = 'translateY(' + (-Math.min(y * 0.12, 64)) + 'px)';
          ticking = false;
        });
      }, { passive: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
