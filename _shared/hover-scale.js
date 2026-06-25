/* hover-scale.js — micro scale feedback on card hover

   Applies subtle scale (1.0 → 1.02) to hoverable cards on archive, series,
   and theme pages. Uses anime.js for smooth, performant animation.

   Targets .archive-card and .thumb__link elements. No opt-in markup needed.
   Respects prefers-reduced-motion. */
(function () {
  'use strict';

  if (!window.anime || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var cards = Array.prototype.slice.call(
    document.querySelectorAll('.archive-card, .thumb__link')
  );

  if (!cards.length) return;

  cards.forEach(function (card) {
    var scale = 1.0;

    card.addEventListener('mouseenter', function () {
      // Cancel any in-flight animation
      window.anime.set(card, { scale: scale });
      window.anime({
        targets: card,
        scale: 1.02,
        duration: 150,
        easing: 'easeOutQuad',
        update: function (anim) {
          scale = anim.progress * 0.02 + 1.0;
          card.style.transform = 'scale(' + scale + ')';
        }
      });
    });

    card.addEventListener('mouseleave', function () {
      window.anime({
        targets: card,
        scale: 1.0,
        duration: 150,
        easing: 'easeOutQuad',
        update: function (anim) {
          scale = 1.0 + (anim.progress * 0.02 * (1.0 - anim.progress));
          card.style.transform = 'scale(' + scale + ')';
        }
      });
    });
  });
})();
