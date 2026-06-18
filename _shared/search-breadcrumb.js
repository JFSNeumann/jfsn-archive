/* search-breadcrumb.js — Show "back to search" breadcrumb on artwork pages */

const SearchBreadcrumb = {
  init() {
    this.checkSearchContext();
  },

  checkSearchContext() {
    // Only add breadcrumb on artwork.html
    if (!document.body.classList.contains('artwork-page') && !window.location.pathname.includes('artwork.html')) {
      // Fallback: check if there's a work ID
      const params = new URLSearchParams(window.location.search);
      if (!params.get('id')) return;
    }

    // Check if user came from search (sessionStorage)
    const searchContext = sessionStorage.getItem('search-query');
    const searchResults = sessionStorage.getItem('search-results-page');

    if (searchContext) {
      this.addBreadcrumb(searchContext, searchResults);
    }

    // Also set context when leaving artwork page
    this.setupContextTracking();
  },

  addBreadcrumb(query, page) {
    // Find or create breadcrumb container
    let container = document.querySelector('.breadcrumb-container');

    if (!container) {
      const headerOrTitle = document.querySelector('header, h1, [role="banner"]');
      if (headerOrTitle) {
        container = document.createElement('div');
        container.className = 'breadcrumb-container';
        headerOrTitle.parentNode.insertBefore(container, headerOrTitle);
      } else {
        return; // Can't find place to add breadcrumb
      }
    }

    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'breadcrumb';
    breadcrumb.setAttribute('aria-label', 'Breadcrumb navigation');

    const ol = document.createElement('ol');

    // Home
    const homeItem = document.createElement('li');
    const homeLink = document.createElement('a');
    homeLink.href = '/';
    homeLink.textContent = 'Home';
    homeItem.appendChild(homeLink);
    ol.appendChild(homeItem);

    // Archive
    const archiveItem = document.createElement('li');
    const archiveLink = document.createElement('a');
    archiveLink.href = '/archive.html';
    archiveLink.textContent = 'Archive';
    archiveItem.appendChild(archiveLink);
    ol.appendChild(archiveItem);

    // Search results
    if (query) {
      const searchItem = document.createElement('li');
      const searchLink = document.createElement('a');
      searchLink.href = `/archive.html?search=${encodeURIComponent(query)}`;
      searchLink.textContent = `Search: "${query}"`;
      searchItem.appendChild(searchLink);
      ol.appendChild(searchItem);
    }

    // Current artwork (no link)
    const currentItem = document.createElement('li');
    currentItem.setAttribute('aria-current', 'page');
    const params = new URLSearchParams(window.location.search);
    currentItem.textContent = params.get('id') || 'Artwork';
    ol.appendChild(currentItem);

    breadcrumb.appendChild(ol);
    container.appendChild(breadcrumb);

    // Show toast with search context
    if (typeof Toast !== 'undefined' && query) {
      Toast.info(`Viewing result from search: "${query}"`);
    }
  },

  setupContextTracking() {
    // Save search context when navigating to artwork from archive
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href*="?id="]');
      if (!link) return;

      // Check if we're on archive page
      if (window.location.pathname.includes('archive')) {
        const query = new URLSearchParams(window.location.search).get('search');
        if (query) {
          sessionStorage.setItem('search-query', query);
          sessionStorage.setItem('search-results-page', window.location.href);
        }
      }
    });
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SearchBreadcrumb.init());
} else {
  SearchBreadcrumb.init();
}
