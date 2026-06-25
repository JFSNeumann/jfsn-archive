/* archive-river.js — Chromatic position river for archive.html
   A slim, sticky color map (reusing chromatic.json) that shows where the
   currently visible works fall across 1974–present. Tracks scroll position
   via the grid's IntersectionObserver and syncs with the decade filter
   checkboxes. Click any point on the river to filter that decade.
*/

(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function decadeOf(year) { return Math.floor(year / 10) * 10; }

  function init(works) {
    var bar    = document.getElementById('archive-river-bar');
    var wrap   = document.getElementById('archive-river-wrap');
    var canvas = document.getElementById('archive-river-canvas');
    var marker = document.getElementById('archive-river-marker');
    var label  = document.getElementById('archive-river-label');
    if (!bar || !wrap || !canvas || !marker || !works || !works.length) return;

    var sorted = works.filter(function (w) { return w.year; }).sort(function (a, b) { return a.year - b.year; });
    var total = sorted.length;
    if (!total) return;

    var decadeRanges = {};
    sorted.forEach(function (w, i) {
      var d = decadeOf(w.year);
      if (!decadeRanges[d]) decadeRanges[d] = { start: i, end: i, decade: d };
      decadeRanges[d].end = i;
    });

    function draw() {
      var W = wrap.clientWidth;
      var dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, W * dpr);
      canvas.height = 26 * dpr;
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
      label.classList.add('archive-river-label--visible');
    }

    function moveMarkerTo(range, animate) {
      var pct = rangeToPct(range);
      if (!animate || prefersReduced || typeof anime === 'undefined') {
        marker.style.left = pct.left + '%';
        marker.style.width = pct.width + '%';
      } else {
        anime({
          targets: marker,
          left: pct.left + '%',
          width: pct.width + '%',
          duration: 420,
          easing: 'easeOutCubic'
        });
      }
      if (range.decade != null && range.decade !== currentLabelDecade) showLabel(range.decade, pct);
      // Live nav accent — same data, no invented color. CSS eases the change.
      var repColor = sorted[range.start] && sorted[range.start].bg;
      if (repColor) document.documentElement.style.setProperty('--nav-accent', repColor);
    }

    // ── Click-to-filter: clicking a point on the river toggles that decade ──
    canvas.addEventListener('click', function (e) {
      var rect = canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var idx = Math.max(0, Math.min(total - 1, Math.floor((x / rect.width) * total)));
      var d = decadeOf(sorted[idx].year);
      var cb = document.querySelector('#filter-decade input[value="' + d + 's"]');
      if (cb) {
        cb.checked = !cb.checked;
        if (typeof window.applyFilters === 'function') window.applyFilters();
        syncToFilters();
      }
    });

    // ── Sync marker to active decade filter checkboxes ──
    function syncToFilters() {
      var checked = Array.prototype.slice.call(document.querySelectorAll('#filter-decade input:checked'))
        .map(function (i) { return parseInt(i.value, 10); });

      if (!checked.length) {
        marker.classList.remove('archive-river-marker--active');
        label.classList.remove('archive-river-label--visible');
        currentLabelDecade = null;
        return false;
      }
      marker.classList.add('archive-river-marker--active');
      var minStart = Infinity, maxEnd = -Infinity, soleDecade = checked.length === 1 ? checked[0] : null;
      checked.forEach(function (d) {
        var r = decadeRanges[d];
        if (!r) return;
        minStart = Math.min(minStart, r.start);
        maxEnd = Math.max(maxEnd, r.end);
      });
      if (minStart === Infinity) return false;
      moveMarkerTo({ start: minStart, end: maxEnd, decade: soleDecade }, true);
      return true;
    }

    document.querySelectorAll('#filter-decade input').forEach(function (cb) {
      cb.addEventListener('change', function () { setTimeout(syncToFilters, 60); });
    });

    // ── Auto-track scroll position (only when no decade filter is active) ──
    var grid = document.getElementById('works-grid');
    if (grid && 'IntersectionObserver' in window) {
      var visibleYears = new Map();
      var pending = false;

      function updateFromVisible() {
        pending = false;
        if (document.querySelectorAll('#filter-decade input:checked').length) return;
        if (!visibleYears.size) return;
        // Mode, not mean — averaging raw years can land on a decade with
        // zero visible works (e.g. a mix of 1970s+1990s cards averages to
        // "1980s"). Pick the decade most of the visible cards actually belong to.
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
        if (r) moveMarkerTo({ start: r.start, end: r.end, decade: bestDecade }, true);
      }

      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var y = parseInt(entry.target.getAttribute('data-year'), 10);
          if (!y) return;
          if (entry.isIntersecting) visibleYears.set(entry.target, y);
          else visibleYears.delete(entry.target);
        });
        if (!pending) { pending = true; requestAnimationFrame(updateFromVisible); }
      }, { root: null, rootMargin: '-35% 0px -35% 0px', threshold: 0 });

      function reobserve() {
        obs.disconnect();
        visibleYears.clear();
        grid.querySelectorAll('.archive-card').forEach(function (card) { obs.observe(card); });
      }

      reobserve();
      new MutationObserver(function () { reobserve(); }).observe(grid, { childList: true });
    }

    // Initial state: reflect any decade filter already applied via URL params
    if (!syncToFilters()) moveMarkerTo({ start: 0, end: total - 1, decade: null }, false);
  }

  function start() {
    if (window.__chromaticWorks) { init(window.__chromaticWorks); return; }
    document.addEventListener('chromatic:ready', function () { init(window.__chromaticWorks); }, { once: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
