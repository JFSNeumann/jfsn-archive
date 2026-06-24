/* chromatic-position-strip.js — A slim, fixed color strip (reusing
   chromatic.json) showing where the works on THIS page fall across
   1974-present, with a marker that tracks whichever works are currently
   scrolled into view. Click a point to jump to that decade in the full
   archive.

   Sitewide companion to archive.html's own archive-river.js, which has
   richer in-page filter integration this generic version doesn't need.
   Self-scoping: skips entirely if archive-river-bar already exists (i.e.
   on archive.html), or if the page has no dated works to map.
*/
(function () {
  'use strict';

  if (document.getElementById('archive-river-bar')) return; // archive.html has its own, richer version

  function decadeOf(year) { return Math.floor(year / 10) * 10; }

  function idFromHref(href) {
    var m = href && href.match(/[?&]id=([^&]+)/);
    return m && m[1];
  }

  function buildStyles() {
    if (document.getElementById('cps-styles')) return;
    var s = document.createElement('style');
    s.id = 'cps-styles';
    s.textContent =
      '#cps-bar{position:fixed;left:0;right:0;z-index:35;background:#fcf9f3;border-bottom:1px solid #c4c7c7;}' +
      '#cps-wrap{position:relative;cursor:pointer;}' +
      '#cps-canvas{display:block;width:100%;height:20px;}' +
      '#cps-marker{position:absolute;top:0;height:100%;border:2px solid rgba(11,11,11,0.55);box-sizing:border-box;pointer-events:none;mix-blend-mode:difference;}' +
      '#cps-label{position:absolute;top:100%;transform:translateX(-50%);font-family:Inter,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#575757;background:#fcf9f3;border:1px solid #c4c7c7;padding:2px 6px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity 0.15s ease;margin-top:2px;}' +
      '#cps-label.cps-label--visible{opacity:1;}' +
      '@media(prefers-reduced-motion:reduce){#cps-marker,#cps-label{transition:none;}}' +
      '@media(max-width:768px){#cps-bar{display:none;}}' +
      'html.dark #cps-bar,html.dark #cps-label{background:#1a1a1a;border-color:#404040;color:#a8a8a8;}';
    document.head.appendChild(s);
  }

  function buildBar() {
    var header = document.querySelector('header');
    var bcBar  = document.getElementById('breadcrumb-navigation');
    var anchor = bcBar || header;
    if (!anchor) return null;

    var bar = document.createElement('div');
    bar.id = 'cps-bar';
    bar.innerHTML =
      '<div id="cps-wrap" role="img" aria-label="Chromatic position map of works on this page across 1974 to present. Click a point to view that decade in the archive.">' +
        '<canvas id="cps-canvas"></canvas>' +
        '<div id="cps-marker"></div>' +
        '<div id="cps-label"></div>' +
      '</div>';
    anchor.insertAdjacentElement('afterend', bar);

    var topOffset = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
    if (bcBar) topOffset += Math.ceil(bcBar.getBoundingClientRect().height);
    bar.style.top = topOffset + 'px';

    var main = document.querySelector('main');
    if (main) {
      var currentPaddingTop = window.getComputedStyle(main).paddingTop;
      main.style.paddingTop = 'calc(' + currentPaddingTop + ' + 32px)';
    }
    return bar;
  }

  function init(data) {
    var sorted = data.filter(function (w) { return w.year; }).sort(function (a, b) { return a.year - b.year; });
    var total = sorted.length;
    if (!total) return;

    var byId = {};
    sorted.forEach(function (w) { byId[w.id] = w; });

    var decadeRanges = {};
    sorted.forEach(function (w, i) {
      var d = decadeOf(w.year);
      if (!decadeRanges[d]) decadeRanges[d] = { start: i, end: i, decade: d };
      decadeRanges[d].end = i;
    });

    buildStyles();
    var bar = buildBar();
    if (!bar) return;

    var wrap   = document.getElementById('cps-wrap');
    var canvas = document.getElementById('cps-canvas');
    var marker = document.getElementById('cps-marker');
    var label  = document.getElementById('cps-label');

    function draw() {
      var W = wrap.clientWidth;
      var dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, W * dpr);
      canvas.height = 20 * dpr;
      canvas.style.width = W + 'px';
      var ctx = canvas.getContext('2d');
      var sliceW = canvas.width / total;
      sorted.forEach(function (w, i) {
        ctx.fillStyle = w.bg || '#8e7164';
        ctx.fillRect(Math.floor(i * sliceW), 0, Math.ceil(sliceW) + 1, canvas.height);
      });
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });

    function rangeToPct(range) {
      return {
        left: (range.start / total) * 100,
        width: Math.max((((range.end - range.start + 1) / total) * 100), (1 / total) * 100)
      };
    }

    var currentLabelDecade = null;
    function showLabel(decade, pct) {
      currentLabelDecade = decade;
      label.textContent = decade + 's';
      label.style.left = (pct.left + pct.width / 2) + '%';
      label.classList.add('cps-label--visible');
    }

    // The one decade with nothing documented (master-notes §20/§23/§24) —
    // same device as timeline.html's thread marker: instead of arriving the
    // same as every other smooth, confident transition, the marker hesitates
    // and dims partway through whenever it crosses into or out of the gap.
    var GAP_DECADE = 1980;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var activeDecade = null;

    function moveMarkerTo(range) {
      var pct = rangeToPct(range);
      var isGap = range.decade === GAP_DECADE;
      var wasGap = activeDecade === GAP_DECADE;

      if (reducedMotion || typeof anime === 'undefined') {
        marker.style.left = pct.left + '%';
        marker.style.width = pct.width + '%';
      } else if (isGap || wasGap) {
        var curLeft = parseFloat(marker.style.left) || pct.left;
        var midLeft = curLeft + (pct.left - curLeft) * 0.55;
        anime.timeline({ easing: 'easeInOutQuad' })
          .add({ targets: marker, left: midLeft + '%', width: pct.width + '%', duration: 260 })
          .add({ targets: marker, opacity: [1, 0.3, 1], duration: 260 })
          .add({ targets: marker, left: pct.left + '%', duration: 240 });
      } else {
        anime({ targets: marker, left: pct.left + '%', width: pct.width + '%', duration: 420, easing: 'easeOutCubic' });
      }

      activeDecade = range.decade;
      if (range.decade != null && range.decade !== currentLabelDecade) showLabel(range.decade, pct);
    }

    canvas.addEventListener('click', function (e) {
      var rect = canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var idx = Math.max(0, Math.min(total - 1, Math.floor((x / rect.width) * total)));
      var d = decadeOf(sorted[idx].year);
      window.location.href = 'archive.html?decade=' + d + 's';
    });

    // ── Track which works on THIS page are currently scrolled into view ──
    var visibleYears = new Map();

    function updateFromVisible() {
      if (!visibleYears.size) return;
      // Mode, not mean — see archive-river.js for why averaging raw years is wrong here.
      var counts = {};
      visibleYears.forEach(function (y) {
        var d = decadeOf(y);
        counts[d] = (counts[d] || 0) + 1;
      });
      var bestDecade = null, bestCount = -1;
      Object.keys(counts).forEach(function (d) {
        if (counts[d] > bestCount) { bestCount = counts[d]; bestDecade = parseInt(d, 10); }
      });
      var r = decadeRanges[bestDecade];
      if (r) moveMarkerTo({ start: r.start, end: r.end, decade: bestDecade });
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = idFromHref(entry.target.getAttribute('href'));
        var w = id && byId[id];
        if (!w) return;
        if (entry.isIntersecting) visibleYears.set(entry.target, w.year);
        else visibleYears.delete(entry.target);
      });
      updateFromVisible();
    }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });

    function observeAll() {
      document.querySelectorAll('a[href*="artwork.html?id="]').forEach(function (a) {
        if (a.__cpsObserved) return;
        a.__cpsObserved = true;
        io.observe(a);
      });
    }
    observeAll();
    new MutationObserver(observeAll).observe(document.body, { childList: true, subtree: true });

    // Initial state — full-range until scroll-tracking finds something in view.
    moveMarkerTo({ start: 0, end: total - 1, decade: null });
  }

  fetch('/chromatic.json')
    .then(function (r) { return r.json(); })
    .then(init)
    .catch(function () { /* no chromatic data — strip never appears */ });
})();
