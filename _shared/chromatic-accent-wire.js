/* chromatic-accent-wire.js — Wires every artwork-bound link to that work's
   own chromatic color, sitewide.

   accent-transition.js already washes the screen in a work's real color
   before navigating to it, but only acts on links carrying
   data-accent-color. This script is what sets that attribute: it reads
   chromatic.json (each work's own extracted dominant color — no invented
   color, ever) and tags every <a href="artwork.html?id=..."> on the page,
   so the wash follows from wherever you click into the archive, not just
   artwork.html's prev/next links.

   Reuses window.__chromaticBgById if another script on the page already
   fetched chromatic.json (archive.html, artwork.html do); otherwise fetches
   it itself. A MutationObserver catches grids that render after this script
   runs (archive.html, index.html, favorites.html, wall.html,
   curatorial-map.html all build cards from an async catalog fetch).
*/

(function () {
  'use strict';

  function wire(map) {
    document.querySelectorAll('a[href*="artwork.html?id="]:not([data-accent-color])').forEach(function (a) {
      var m = a.getAttribute('href').match(/[?&]id=([^&]+)/);
      var color = m && map[m[1]];
      if (color) a.setAttribute('data-accent-color', color);
    });
  }

  function start(map) {
    wire(map);
    // MutationObserver callbacks already batch every mutation from a single
    // render pass into one call — wiring directly here (no rAF/setTimeout
    // debounce) avoids the throttling browsers apply to those timers in
    // background tabs, so a card someone opens without ever foregrounding
    // the tab still gets its accent color before they click it.
    new MutationObserver(function () { wire(map); })
      .observe(document.body, { childList: true, subtree: true });
  }

  if (window.__chromaticBgById) {
    start(window.__chromaticBgById);
    return;
  }

  fetch('/chromatic.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var map = window.__chromaticBgById || {};
      data.forEach(function (w) { if (w.id && w.bg) map[w.id] = w.bg; });
      window.__chromaticBgById = map;
      start(map);
    })
    .catch(function () { /* no chromatic data — links stay untouched, accent-transition.js no-ops gracefully */ });
})();
