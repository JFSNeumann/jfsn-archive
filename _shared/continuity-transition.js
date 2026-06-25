/* continuity-transition.js — shared cross-document view transition handler

   Applies shared-element morph (view-transition) to any click on a .thumb__link
   or .archive-card that links to artwork.html. The clicked image gets
   viewTransitionName = 'artwork-hero', which the browser then morphs into
   artwork.html's #work-image (also named 'artwork-hero' in CSS).

   Works on: archive.html (already has this logic inline), favorites.html,
   all theme pages (guernica, targets, etc.), series.html.

   No opt-in needed — just include this file. It's ignored harmlessly in
   browsers without View Transitions support. */
(function () {
  'use strict';

  // Only set on click (not on page load). Browsers handle the navigation —
  // we just name the source element so it can be morphed.
  document.addEventListener(
    'click',
    function (e) {
      var card = e.target.closest('.archive-card') || e.target.closest('.thumb__link');
      if (!card) return;
      var img = card.querySelector('img');
      if (img) img.style.viewTransitionName = 'artwork-hero';
    },
    true  // capture phase: ensures this fires even if other handlers stop propagation
  );
})();
