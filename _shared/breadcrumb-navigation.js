/* breadcrumb-navigation.js — Sticky breadcrumb bar showing current location
   Always visible, shows full path through site
   Reduces anxiety for 70+ users: "Where am I?"
*/

(function() {
  'use strict';

  /* ─── Build Breadcrumb Trail ────────────────────────────────────────────── */
  function buildBreadcrumb() {
    const path = window.location.pathname;
    const breadcrumbs = [{ label: 'Home', url: '/' }];

    // Determine current page and build trail
    if (path.includes('archive.html')) {
      breadcrumbs.push({ label: 'Archive', url: 'archive.html' });

      // Add active filters if present
      const mediumChip = document.querySelector('.filter-chip[data-filter-type="medium"]');
      const decadeChip = document.querySelector('.filter-chip[data-filter-type="decade"]');

      if (mediumChip) {
        const medium = mediumChip.textContent.trim().replace('✕', '').trim();
        breadcrumbs.push({ label: medium, url: null });
      }

      if (decadeChip) {
        const decade = decadeChip.textContent.trim().replace('✕', '').trim();
        breadcrumbs.push({ label: decade, url: null });
      }
    } else if (path.includes('artwork.html') || path.includes('?id=')) {
      breadcrumbs.push({ label: 'Archive', url: 'archive.html' });

      const titleEl = document.getElementById('work-title');
      const typeEl = document.getElementById('work-type-subline');

      if (typeEl) {
        const medium = typeEl.textContent.trim();
        breadcrumbs.push({ label: medium, url: null });
      }

      if (titleEl) {
        const title = titleEl.textContent.trim();
        breadcrumbs.push({ label: title, url: null, current: true });
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

  /* ─── Create Breadcrumb HTML ─────────────────────────────────────────────– */
  function createBreadcrumbBar() {
    const breadcrumbs = buildBreadcrumb();

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

    bar.innerHTML = html;

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

    const filterContainer = document.querySelector('[class*="filter"]');
    if (!filterContainer) return;

    const observer = new MutationObserver(() => {
      const breadcrumb = document.getElementById('breadcrumb-navigation');
      if (breadcrumb) {
        const newBreadcrumbs = buildBreadcrumb();
        let html = '';

        newBreadcrumbs.forEach((crumb, idx) => {
          if (idx > 0) html += ' <span style="margin: 0 6px; color: #c4c7c7;">›</span> ';

          if (crumb.url && !crumb.current) {
            html += `<a href="${crumb.url}" style="color: #B84700; text-decoration: none; border-bottom: 1px solid #B84700; padding-bottom: 2px; transition: color 0.2s ease;">${crumb.label}</a>`;
          } else {
            const fontWeight = crumb.current ? 'font-weight: 600;' : '';
            html += `<span style="${fontWeight} color: #454545;">${crumb.label}</span>`;
          }
        });

        breadcrumb.innerHTML = html;
      }
    });

    observer.observe(filterContainer, { childList: true, subtree: true });
  }

  /* ─── Init ──────────────────────────────────────────────────────────────── */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    createBreadcrumbBar();
    watchFilterChanges();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
