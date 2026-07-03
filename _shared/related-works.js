/* related-works.js — populate "You Might Also Like" on artwork.html.

   Restores the Related Works feature originally shipped in
   micro-interactions.js (cc30a3cf) and lost when that file was removed
   in the bundle cleanup (5fcedd17): the section markup survived but
   nothing filled the grid, so every artwork page showed an empty
   heading. Same selection rules as the original — same series, medium,
   or (decade-bucket) year, capped at 8 — with same-series matches
   listed first. Hides the whole section when there is nothing to show. */

(function () {
  'use strict';

  var grid = document.getElementById('related-works-grid');
  var section = document.getElementById('related-works-section');
  if (!grid || !section) return;

  var currentId = new URL(window.location).searchParams.get('id');
  if (!currentId) { section.style.display = 'none'; return; }

  /* catalog-lite.json's `file` is "artNNNN.avif"; the page id is "artNNNN" */
  function idOf(w) { return String(w.file || '').replace(/\.[a-z0-9]+$/i, ''); }

  fetch('/catalog-lite.json')
    .then(function (r) { return r.json(); })
    .then(function (works) {
      var current = works.find(function (w) { return idOf(w) === currentId; });
      if (!current) { section.style.display = 'none'; return; }

      function score(w) {
        if (idOf(w) === currentId) return -1;
        if (current.series && w.series === current.series) return 3;
        if (w.work_type === current.work_type && w.year === current.year) return 2;
        if (w.work_type === current.work_type || w.year === current.year) return 1;
        return -1;
      }

      var related = works
        .map(function (w) { return { w: w, s: score(w) }; })
        .filter(function (x) { return x.s > 0; })
        .sort(function (a, b) { return b.s - a.s; })
        .slice(0, 8)
        .map(function (x) { return x.w; });

      if (!related.length) { section.style.display = 'none'; return; }

      grid.innerHTML = '';
      related.forEach(function (work, idx) {
        var title = work.title || 'Untitled';
        var a = document.createElement('a');
        a.className = 'thumb';
        a.href = 'artwork.html?id=' + encodeURIComponent(idOf(work));
        a.style.setProperty('--stagger-index', idx);
        var img = document.createElement('img');
        img.src = 'artworks/medium/' + idOf(work) + '.avif';
        img.alt = title;
        img.loading = 'lazy';
        img.style.cssText = 'width:100%;height:auto;display:block;';
        var link = document.createElement('div');
        link.className = 'thumb__link';
        link.style.cssText = 'display:block;position:relative;';
        link.appendChild(img);
        var cap = document.createElement('div');
        cap.className = 'thumb__caption';
        cap.style.cssText = 'padding:8px 2px;font-family:Inter,sans-serif;font-size:13px;color:#0B0B0B;';
        var capTitle = document.createElement('span');
        capTitle.textContent = title;
        var capYear = document.createElement('span');
        capYear.textContent = work.year_display || work.year || '';
        capYear.style.cssText = 'display:block;color:#575757;font-size:11px;';
        cap.appendChild(capTitle);
        cap.appendChild(capYear);
        a.appendChild(link);
        a.appendChild(cap);
        grid.appendChild(a);
      });
    })
    .catch(function () {
      section.style.display = 'none';
    });
})();
