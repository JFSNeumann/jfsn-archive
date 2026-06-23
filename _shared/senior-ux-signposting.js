/* senior-ux-signposting.js — Add "You are here" indicators for 70+ users
   Explicit orientation on archive, artwork, and series pages
   Reduces cognitive load: "Where am I? What am I looking at?"
*/

(function() {
  'use strict';

  /* ─── Archive Page: Show Active Filters ────────────────────────────────── */
  function setupArchiveSignposting() {
    const archiveHeader = document.querySelector('h1');
    if (!archiveHeader || !window.location.pathname.includes('archive')) return;

    const signpost = document.createElement('div');
    signpost.id = 'archive-signpost';
    signpost.style.cssText = `
      background: #fcf9f3;
      border-bottom: 1px solid #e3bfb1;
      padding: 16px;
      margin-bottom: 16px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #454545;
    `;

    // Get active filters from UI
    const activeFilters = document.querySelectorAll('.filter-chip');
    let filterText = 'All Works';

    if (activeFilters.length > 0) {
      const filterLabels = Array.from(activeFilters)
        .map(chip => chip.textContent.trim().replace('✕', '').trim())
        .slice(0, 3); // Show first 3

      if (filterLabels.length > 0) {
        filterText = `Viewing: ${filterLabels.join(', ')}`;
        if (activeFilters.length > 3) filterText += `, +${activeFilters.length - 3} more`;
      }
    }

    signpost.innerHTML = `<strong>Location:</strong> Archive — ${filterText}`;
    archiveHeader.parentElement.insertBefore(signpost, archiveHeader.nextSibling);

    // Update signpost when filters change
    const observer = new MutationObserver(() => {
      const chips = document.querySelectorAll('.filter-chip');
      let newText = 'All Works';

      if (chips.length > 0) {
        const labels = Array.from(chips)
          .map(chip => chip.textContent.trim().replace('✕', '').trim())
          .slice(0, 3);

        if (labels.length > 0) {
          newText = `Viewing: ${labels.join(', ')}`;
          if (chips.length > 3) newText += `, +${chips.length - 3} more`;
        }
      }

      signpost.innerHTML = `<strong>Location:</strong> Archive — ${newText}`;
    });

    const filterContainer = document.querySelector('[class*="filter"]');
    if (filterContainer) {
      observer.observe(filterContainer, { childList: true, subtree: true });
    }
  }

  /* ─── Artwork Page: Add Breadcrumb with Position in Archive ────────────── */
  function setupArtworkSignposting() {
    const workContent = document.getElementById('work-content');
    if (!workContent || !window.location.pathname.includes('artwork')) return;

    const backLink = document.querySelector('a[href="archive.html"]');
    if (!backLink) return;

    const signpost = document.createElement('div');
    signpost.id = 'artwork-signpost';
    signpost.style.cssText = `
      background: #fcf9f3;
      border: 1px solid #e3bfb1;
      border-radius: 2px;
      padding: 12px 16px;
      margin-bottom: 24px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #454545;
      line-height: 1.6;
    `;

    // Get work type from metadata
    const typeEl = document.getElementById('work-type-subline');
    const typeText = typeEl ? typeEl.textContent.trim() : 'Work';
    const titleEl = document.getElementById('work-title');
    const titleText = titleEl ? titleEl.textContent.trim() : 'Untitled';

    signpost.innerHTML = `
      <strong>You are viewing:</strong> ${titleText}<br/>
      <strong>Medium:</strong> ${typeText}<br/>
      <strong>Navigation:</strong> Use ← → keys to browse, or <a href="archive.html" style="color:#B84700;text-decoration:underline;">return to archive</a>
    `;

    backLink.parentElement.insertBefore(signpost, backLink.nextSibling);
  }

  /* ─── Series Page: Add Series Context ───────────────────────────────────– */
  function setupSeriesSignposting() {
    const seriesHeading = document.querySelector('h1');
    if (!seriesHeading || !window.location.pathname.includes('series')) return;

    const signpost = document.createElement('div');
    signpost.id = 'series-signpost';
    signpost.style.cssText = `
      background: #fcf9f3;
      border-bottom: 1px solid #e3bfb1;
      padding: 16px;
      margin-bottom: 16px;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #454545;
    `;

    // Get series count from page (if available)
    const seriesGrid = document.querySelector('[id*="grid"]');
    const workCount = seriesGrid ? seriesGrid.children.length : '?';

    const seriesName = seriesHeading.textContent.trim();
    signpost.innerHTML = `<strong>You are in:</strong> ${seriesName} Series (${workCount} works)`;

    seriesHeading.parentElement.insertBefore(signpost, seriesHeading.nextSibling);
  }

  /* ─── Init ──────────────────────────────────────────────────────────────── */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    setupArchiveSignposting();
    setupArtworkSignposting();
    setupSeriesSignposting();
  }

  // Start immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
