/* accent-transition.js — Color-cued page transitions
   When a link carries the destination work's own accent color
   (data-accent-color, set from chromatic.json's per-work bg), a wash of
   that color covers the screen before navigating, and fades back out on
   arrival — ties ordinary navigation into the sitewide chromatic motif
   instead of a colorless cut. Links without that attribute are completely
   untouched: this never invents a color where the page has no real data.
*/

(function () {
  'use strict';

  var STORE_KEY = 'jfsn-accent-transition';
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var overlay = null;

  function getOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'accent-transition-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;opacity:0;pointer-events:none;';
    document.body.appendChild(overlay);
    return overlay;
  }

  /* ── Arrival: if a color was staged just before this page loaded, wash it back out ── */
  if (!prefersReduced) {
    try {
      var staged = sessionStorage.getItem(STORE_KEY);
      if (staged) {
        sessionStorage.removeItem(STORE_KEY);
        var ov = getOverlay();
        ov.style.background = staged;
        ov.style.opacity = '1';
        if (window.anime) {
          anime({ targets: ov, opacity: [1, 0], duration: 380, easing: 'easeOutQuad', delay: 60 });
        } else {
          ov.style.opacity = '0';
        }
      }
    } catch (_) { /* sessionStorage unavailable — skip arrival fade */ }
  } else {
    try { sessionStorage.removeItem(STORE_KEY); } catch (_) {}
  }

  /* ── Departure: clicking a link with a known accent color washes the screen
     in that color, then navigates — capture phase so it pre-empts the
     site's other nav-interception scripts for these specific links only. ── */
  document.addEventListener('click', function (e) {
    if (prefersReduced) return;
    if (e.target.closest('.fc-peek')) return; // quick-preview button wins inside cards

    var link = e.target.closest('a[data-accent-color]');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href || link.target === '_blank' || link.hasAttribute('download') || link.hasAttribute('data-no-transition')) return;

    var color = link.getAttribute('data-accent-color');
    if (!color) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    try { sessionStorage.setItem(STORE_KEY, color); } catch (_) {}

    var ov = getOverlay();
    ov.style.background = color;

    if (window.anime) {
      var navigated = false;
      function go() {
        if (navigated) return;
        navigated = true;
        window.location.href = href;
      }
      anime.set(ov, { opacity: 0 });
      anime({ targets: ov, opacity: [0, 1], duration: 260, easing: 'easeOutQuad', complete: go });
      // anime's completion relies on requestAnimationFrame, which browsers
      // can suspend (e.g. the tab gets backgrounded right after the click) —
      // a plain setTimeout fallback can't stall the same way, so navigation
      // never hangs waiting on a tick that may not come for a while.
      setTimeout(go, 400);
    } else {
      ov.style.opacity = '1';
      window.location.href = href;
    }
  }, true);
})();
