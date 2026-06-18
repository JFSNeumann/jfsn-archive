// Breadcrumb navigation — populate based on current artwork
(function() {
  function populateBreadcrumb(work) {
    const breadcrumbEl = document.getElementById('breadcrumb');
    if (!breadcrumbEl || !work) return;

    const medium = work.work_type || '—';
    const year = work.year_display || work.year || '—';
    const title = work.title || 'Untitled';

    // Build breadcrumb path: Archive > [Medium] > [Year] > Title
    const breadcrumbHTML = `
      <nav class="breadcrumb-nav" aria-label="Breadcrumb">
        <a href="archive.html">Archive</a>
        <span class="breadcrumb-separator">›</span>
        <a href="archive.html?filter=${encodeURIComponent(medium)}">${medium}</a>
        <span class="breadcrumb-separator">›</span>
        <a href="archive.html?filter=${encodeURIComponent(year)}">${year}</a>
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-current">${title}</span>
      </nav>
    `;

    breadcrumbEl.innerHTML = breadcrumbHTML;
  }

  // Hook into the page's work-loading logic
  // Listen for when work data is available
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    return originalFetch.apply(window, args).then(response => {
      if (response.url.includes('api.html') || response.url.includes('catalog')) {
        return response.json().then(data => {
          // Find the current work if this is the catalog
          if (data.works && data.works.length > 0) {
            // If we have global work data, use it
            if (window.currentWork) {
              populateBreadcrumb(window.currentWork);
            }
          }
          return new Response(JSON.stringify(data), response);
        });
      }
      return response;
    });
  };

  // Fallback: listen for when work title is populated
  const observer = new MutationObserver(() => {
    const titleEl = document.getElementById('work-title');
    if (titleEl && titleEl.textContent && !breadcrumbEl.innerHTML.includes('breadcrumb-nav')) {
      // Work data is loaded, try to populate breadcrumb
      const work = {
        title: titleEl.textContent,
        work_type: document.getElementById('work-type-subline')?.textContent || '—',
        year: document.getElementById('work-eyebrow')?.textContent || '—'
      };
      populateBreadcrumb(work);
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const breadcrumbEl = document.getElementById('breadcrumb');
    if (breadcrumbEl) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: false
      });
    }
  });
})();
