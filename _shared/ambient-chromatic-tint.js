/* ambient-chromatic-tint.js — A faint wash behind the page, tinted to the
   real average color of whichever works are currently scrolled into view.

   section-tints.css already gives each page type a fixed identity-color
   gradient, but it's a static, hand-picked color that fades out 320px down
   and never changes again. This is a second, independent layer: as you
   scroll from one decade or medium to the next, the room itself shifts
   through that span's true chromatic.json colors — the archive's own
   palette, not an invented mood color. Sits behind everything (z-index -1),
   low alpha, additive — it never replaces or fights the existing tint.

   Self-scoping: does nothing visible on pages with no artwork.html?id=
   links (about.html, editorial pages) since there's nothing real to
   average — no allowlist needed.
*/
(function () {
  'use strict';

  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
  }

  function averageColor(hexes) {
    var sum = { r: 0, g: 0, b: 0 }, n = 0;
    hexes.forEach(function (h) {
      var c = hexToRgb(h);
      if (!c) return;
      sum.r += c.r; sum.g += c.g; sum.b += c.b; n++;
    });
    if (!n) return null;
    return { r: Math.round(sum.r / n), g: Math.round(sum.g / n), b: Math.round(sum.b / n) };
  }

  function idFromHref(href) {
    var m = href && href.match(/[?&]id=([^&]+)/);
    return m && m[1];
  }

  function start(map) {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var overlay = document.createElement('div');
    overlay.id = 'ambient-chromatic-tint';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;' +
      'transition:background-color ' + (reduced ? '0.3s' : '1.4s') + ' ease;';
    document.body.insertBefore(overlay, document.body.firstChild);

    // The OS/browser chrome (mobile address bar) reads this meta tag — keep
    // it in sync with the same blend so the tint isn't confined to the page
    // itself. Stored once: each update blends from the page's true base
    // color, never from a previous (already-blended) value.
    var themeMeta = document.querySelector('meta[name="theme-color"]');
    var baseColor = themeMeta && hexToRgb(themeMeta.getAttribute('content'));

    var visible = new Set();

    function applyTint() {
      var hexes = [];
      visible.forEach(function (id) { if (map[id]) hexes.push(map[id]); });
      var avg = averageColor(hexes);
      var isDark = document.documentElement.classList.contains('dark');
      var alpha = isDark ? 0.06 : 0.1;
      overlay.style.backgroundColor = avg
        ? 'rgba(' + avg.r + ',' + avg.g + ',' + avg.b + ',' + alpha + ')'
        : 'transparent';

      if (themeMeta && baseColor) {
        var c = avg ? {
          r: Math.round(baseColor.r * (1 - alpha) + avg.r * alpha),
          g: Math.round(baseColor.g * (1 - alpha) + avg.g * alpha),
          b: Math.round(baseColor.b * (1 - alpha) + avg.b * alpha)
        } : baseColor;
        themeMeta.setAttribute('content', 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')');
      }
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = idFromHref(entry.target.getAttribute('href'));
        if (!id) return;
        if (entry.isIntersecting) visible.add(id); else visible.delete(id);
      });
      applyTint();
    }, { threshold: 0.2 });

    function observeAll() {
      document.querySelectorAll('a[href*="artwork.html?id="]').forEach(function (a) {
        if (a.__ambientObserved) return;
        a.__ambientObserved = true;
        io.observe(a);
      });
    }
    observeAll();

    // Catch grids that render after this script runs (archive.html,
    // index.html, wall.html etc. all build cards from an async catalog
    // fetch) — wiring directly here, no rAF/setTimeout debounce, so it
    // isn't subject to the throttling browsers apply to those timers in
    // background tabs.
    new MutationObserver(observeAll).observe(document.body, { childList: true, subtree: true });
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
    .catch(function () { /* no chromatic data — overlay never colors, stays fully transparent */ });
})();
