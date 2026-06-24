/* chromatic-lazy-tint.js — Replaces the generic shimmer placeholder with
   each work's own chromatic.json color, so the "loading" state is already
   a true (if blurred-by-absence) preview of the work's tone instead of a
   content-free shimmer. Matches the convention already baked into decade
   pages at build time (.thumb__link style="background-color:#xxxxxx") —
   this just brings it, live, to every other page that doesn't have it
   pre-rendered (archive.html, index.html, theme pages, wall.html,
   favorites.html, series.html, curatorial-map.html).

   Sets --lazy-tint as a CSS custom property on each <img> inside an
   artwork.html?id= link; _shared/lazy-load.css's shimmer reads it with a
   transparent fallback, so untagged images are pixel-identical to before.
*/
(function () {
  'use strict';

  function idFromHref(href) {
    var m = href && href.match(/[?&]id=([^&]+)/);
    return m && m[1];
  }

  function tint(map) {
    document.querySelectorAll('a[href*="artwork.html?id="] img').forEach(function (img) {
      if (img.style.getPropertyValue('--lazy-tint')) return;
      var a = img.closest('a[href*="artwork.html?id="]');
      var id = a && idFromHref(a.getAttribute('href'));
      var color = id && map[id];
      if (color) img.style.setProperty('--lazy-tint', color);
    });
  }

  function start(map) {
    tint(map);
    new MutationObserver(function () { tint(map); })
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
    .catch(function () { /* no chromatic data — placeholders stay generic */ });
})();
