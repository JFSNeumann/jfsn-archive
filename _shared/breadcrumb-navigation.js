/* breadcrumb-navigation.js — Sticky breadcrumb bar showing current location
   Always visible, shows full path through site
   Reduces anxiety for 70+ users: "Where am I?"
*/

(function() {
  'use strict';

  const MEDIUM_LABELS = { collage: 'Collage', photograph: 'Photography', sculpture: 'Sculpture', painting: 'Painting' };

  /* ─── Build Breadcrumb Trail ────────────────────────────────────────────── */
  // workData (optional): the catalog record for the work shown on artwork.html,
  // passed via the 'artwork:loaded' event — DOM text isn't ready at init time
  // since it's populated after an async catalog fetch.
  function buildBreadcrumb(workData) {
    const path = window.location.pathname;
    const breadcrumbs = [{ label: 'Home', url: '/' }];

    // Determine current page and build trail
    if (path.includes('archive.html')) {
      breadcrumbs.push({ label: 'Archive', url: 'archive.html' });

      // Add active filters if present (data-filter-type lives on the chip's
      // remove <button>, not the .filter-chip span itself)
      function chipLabel(type) {
        const btn = document.querySelector(`.filter-chip button[data-filter-type="${type}"]`);
        if (!btn) return null;
        const chip = btn.closest('.filter-chip');
        return chip.firstChild.textContent.trim();
      }

      ['medium', 'decade', 'series', 'orientation'].forEach(type => {
        const label = chipLabel(type);
        if (label) breadcrumbs.push({ label, url: null });
      });
    } else if (path.includes('artwork.html') || path.includes('?id=')) {
      breadcrumbs.push({ label: 'Archive', url: 'archive.html' });

      if (workData) {
        if (workData.series) {
          breadcrumbs.push({ label: workData.series, url: `archive.html?series=${encodeURIComponent(workData.series)}` });
        } else if (workData.year) {
          const decade = Math.floor(workData.year / 10) * 10 + 's';
          breadcrumbs.push({ label: decade, url: `archive.html?decade=${decade}` });
        }

        const medium = MEDIUM_LABELS[workData.work_type] || workData.work_type;
        if (medium) breadcrumbs.push({ label: medium, url: null });

        breadcrumbs.push({ label: workData.title || 'Untitled', url: null, current: true });
      }
    } else if (path.includes('series.html') || path.includes('guernica.html') ||
               path.includes('targets.html') || path.includes('collage.html') ||
               path.includes('sculpture.html') || path.includes('photography.html') ||
               path.includes('painting.html')) {
      breadcrumbs.push({ label: 'Series', url: 'series-index.html' });

      const heading = document.querySelector('h1');
      if (heading) {
        const seriesName = heading.textContent.trim();
        breadcrumbs.push({ label: seriesName, url: null, current: true });
      }
    } else if (path.includes('chromatic.html')) {
      breadcrumbs.push({ label: 'Chromatic River', url: 'chromatic.html', current: true });
    } else if (path.includes('about.html')) {
      breadcrumbs.push({ label: 'About', url: 'about.html', current: true });
    } else if (path.includes('lost.html')) {
      breadcrumbs.push({ label: 'Lost Works', url: 'lost.html', current: true });
    }

    return breadcrumbs;
  }

  /* ─── Render Breadcrumb HTML ─────────────────────────────────────────────– */
  function renderCrumbs(breadcrumbs) {
    let html = '';
    breadcrumbs.forEach((crumb, idx) => {
      if (idx > 0) html += ' <span style="margin: 0 6px; color: #c4c7c7;">›</span> ';

      if (crumb.url && !crumb.current) {
        html += `<a href="${crumb.url}" style="color: #B84700; text-decoration: none; border-bottom: 1px solid #B84700; padding-bottom: 2px; transition: color 0.2s ease;">${crumb.label}</a>`;
      } else {
        const fontWeight = crumb.current ? 'font-weight: 600;' : '';
        html += `<span style="${fontWeight} color: #454545;">${crumb.label}</span>`;
      }
    });
    return html;
  }

  function updateBreadcrumbBar(breadcrumbs) {
    const breadcrumb = document.getElementById('breadcrumb-navigation');
    if (breadcrumb) breadcrumb.innerHTML = renderCrumbs(breadcrumbs);
  }

  /* ─── Create Breadcrumb HTML ─────────────────────────────────────────────– */
  function createBreadcrumbBar() {
    const bar = document.createElement('div');
    bar.id = 'breadcrumb-navigation';
    bar.setAttribute('aria-label', 'Breadcrumb navigation');
    bar.style.cssText = `
      position: fixed;
      top: 64px;
      left: 0;
      right: 0;
      background: #fcf9f3;
      border-bottom: 1px solid #e3bfb1;
      padding: 12px 16px;
      z-index: 40;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #454545;
      line-height: 1.6;
      overflow-x: auto;
      white-space: nowrap;
    `;
    bar.innerHTML = renderCrumbs(buildBreadcrumb());

    // Insert after nav
    const header = document.querySelector('header');
    if (header) {
      header.insertAdjacentElement('afterend', bar);

      // Adjust main content to account for breadcrumb height
      const main = document.querySelector('main');
      if (main) {
        const currentPaddingTop = window.getComputedStyle(main).paddingTop;
        main.style.paddingTop = `calc(${currentPaddingTop} + 48px)`;
      }
    }
  }

  /* ─── Update Breadcrumb on Filter Change ────────────────────────────────── */
  function watchFilterChanges() {
    if (!window.location.pathname.includes('archive')) return;

    const filterContainer = document.getElementById('filter-chips');
    if (!filterContainer) return;

    const observer = new MutationObserver(() => updateBreadcrumbBar(buildBreadcrumb()));
    observer.observe(filterContainer, { childList: true, subtree: true });
  }

  /* ─── Update Breadcrumb once artwork data loads ─────────────────────────── */
  // artwork.html fetches the catalog async, then dispatches this with the
  // work record — DOM text (#work-title etc.) isn't populated at init time.
  function watchArtworkData() {
    const path = window.location.pathname;
    if (!path.includes('artwork.html') && !path.includes('?id=')) return;

    document.addEventListener('artwork:loaded', (e) => {
      updateBreadcrumbBar(buildBreadcrumb(e.detail));
    });
  }

  /* ─── Init ──────────────────────────────────────────────────────────────── */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    createBreadcrumbBar();
    watchFilterChanges();
    watchArtworkData();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
