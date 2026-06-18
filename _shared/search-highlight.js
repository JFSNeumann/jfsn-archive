/* search-highlight.js — Search term highlighting and feedback */

const SearchHighlight = {
  currentQuery: '',

  init() {
    this.setupSearchListeners();
  },

  setupSearchListeners() {
    // Hook into search input
    const searchInputs = document.querySelectorAll('#nav-search-input, .search-input, [data-search-input]');

    searchInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        this.currentQuery = e.target.value.toLowerCase().trim();
        this.highlightResults();
      });

      input.addEventListener('change', (e) => {
        this.currentQuery = e.target.value.toLowerCase().trim();
        this.showSearchFeedback(e.target);
      });
    });
  },

  highlightResults() {
    if (!this.currentQuery) {
      this.clearHighlights();
      return;
    }

    // Highlight matching text in visible results
    const results = document.querySelectorAll('[data-search-result], .thumb');

    results.forEach(result => {
      const titleEl = result.querySelector('[data-work-title], .work-title, h3, p');
      if (titleEl && titleEl.textContent.toLowerCase().includes(this.currentQuery)) {
        titleEl.classList.add('search-match');

        // Visual feedback: bold the matching term
        const text = titleEl.textContent;
        const regex = new RegExp(`(${this.currentQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        if (text.match(regex)) {
          titleEl.innerHTML = text.replace(regex, '<mark class="search-highlight">$1</mark>');
        }
      } else {
        titleEl?.classList.remove('search-match');
      }
    });
  },

  clearHighlights() {
    document.querySelectorAll('.search-match').forEach(el => {
      el.classList.remove('search-match');
      el.innerHTML = el.textContent; // Remove mark tags
    });
  },

  showSearchFeedback(input) {
    if (!this.currentQuery) return;

    const results = document.querySelectorAll('.thumb, [data-search-result]');
    const matches = Array.from(results).filter(r => {
      const title = r.querySelector('[data-work-title], .work-title, h3, p');
      return title && title.textContent.toLowerCase().includes(this.currentQuery);
    }).length;

    if (typeof Toast !== 'undefined') {
      if (matches === 0) {
        Toast.info(`No results for "${this.currentQuery}"`);
      } else if (matches === 1) {
        Toast.success(`Found 1 result for "${this.currentQuery}"`);
      } else {
        Toast.success(`Found ${matches} results for "${this.currentQuery}"`);
      }
    }
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SearchHighlight.init());
} else {
  SearchHighlight.init();
}
