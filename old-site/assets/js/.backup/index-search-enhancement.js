/* ===========================================
   INDEX.HTML SEARCH ENHANCEMENT
   Advanced search with autocomplete and history
   =========================================== */

(function() {
  'use strict';
  
  // Search history management
  const SEARCH_HISTORY_KEY = 'jfsn_search_history';
  const MAX_HISTORY = 10;
  
  function getSearchHistory() {
    try {
      return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]');
    } catch {
      return [];
    }
  }
  
  function saveSearchHistory(query) {
    if (!query || query.trim().length === 0) return;
    const history = getSearchHistory();
    const trimmedQuery = query.trim().toLowerCase();
    
    // Remove if already exists
    const index = history.indexOf(trimmedQuery);
    if (index > -1) history.splice(index, 1);
    
    // Add to beginning
    history.unshift(trimmedQuery);
    
    // Limit history
    if (history.length > MAX_HISTORY) history.pop();
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  }
  
  // Enhanced search with autocomplete
  function enhanceSearch() {
    const searchInput = document.getElementById('navbarSearchInput');
    const searchOverlay = document.getElementById('navbarSearchOverlay');
    if (!searchInput || !searchOverlay) return;
    
    // Create suggestions container
    let suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) {
      suggestionsContainer = document.createElement('div');
      suggestionsContainer.id = 'searchSuggestions';
      suggestionsContainer.className = 'navbar-search-suggestions';
      searchInput.parentElement.appendChild(suggestionsContainer);
    }
    
    // Search data (artworks, categories, etc.)
    let searchData = [];
    if (window.galleryData && Array.isArray(window.galleryData)) {
      searchData = window.galleryData;
    }
    
    // Get unique categories
    const categories = [...new Set(searchData.map(item => item.category).filter(Boolean))];
    
    function showSuggestions(query) {
      if (!query || query.trim().length === 0) {
        // Show recent searches
        const history = getSearchHistory();
        if (history.length > 0) {
          suggestionsContainer.innerHTML = `
            <div class="search-suggestions-header">Recent Searches</div>
            ${history.map(term => `
              <div class="search-suggestion-item" data-query="${term}">
                <i class="bx bx-time"></i>
                <span>${term}</span>
              </div>
            `).join('')}
          `;
          suggestionsContainer.style.display = 'block';
        } else {
          suggestionsContainer.style.display = 'none';
        }
        return;
      }
      
      const lowerQuery = query.toLowerCase();
      const suggestions = [];
      
      // Search artworks
      searchData.forEach(item => {
        if (item.title && item.title.toLowerCase().includes(lowerQuery)) {
          suggestions.push({
            type: 'artwork',
            title: item.title,
            category: item.category,
            url: `art.html?search=${encodeURIComponent(item.title)}`
          });
        }
      });
      
      // Search categories
      categories.forEach(cat => {
        if (cat.toLowerCase().includes(lowerQuery)) {
          suggestions.push({
            type: 'category',
            title: cat,
            url: `art.html?category=${encodeURIComponent(cat)}`
          });
        }
      });
      
      // Limit suggestions
      const limitedSuggestions = suggestions.slice(0, 8);
      
      if (limitedSuggestions.length > 0) {
        suggestionsContainer.innerHTML = `
          <div class="search-suggestions-header">Suggestions</div>
          ${limitedSuggestions.map(suggestion => `
            <a href="${suggestion.url}" class="search-suggestion-item">
              <i class="bx ${suggestion.type === 'artwork' ? 'bx-image' : 'bx-folder'}"></i>
              <span>${suggestion.title}</span>
              ${suggestion.category ? `<span class="search-suggestion-category">${suggestion.category}</span>` : ''}
            </a>
          `).join('')}
        `;
        suggestionsContainer.style.display = 'block';
      } else {
        suggestionsContainer.style.display = 'none';
      }
    }
    
    // Enhanced input handler
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value;
      searchTimeout = setTimeout(() => showSuggestions(query), 200);
    });
    
    // Handle suggestion clicks
    suggestionsContainer.addEventListener('click', (e) => {
      const item = e.target.closest('.search-suggestion-item');
      if (item) {
        const query = item.dataset.query || item.textContent.trim();
        if (query) {
          saveSearchHistory(query);
          if (item.href) {
            window.location.href = item.href;
          }
        }
      }
    });
    
    // Keyboard navigation
    let activeIndex = -1;
    searchInput.addEventListener('keydown', (e) => {
      const suggestions = suggestionsContainer.querySelectorAll('.search-suggestion-item');
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, suggestions.length - 1);
        suggestions.forEach((el, i) => {
          el.classList.toggle('active', i === activeIndex);
        });
        if (suggestions[activeIndex]) {
          suggestions[activeIndex].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, -1);
        suggestions.forEach((el, i) => {
          el.classList.toggle('active', i === activeIndex);
        });
      } else if (e.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        suggestions[activeIndex].click();
      } else {
        activeIndex = -1;
      }
    });
    
    // Save search on submit
    const searchForm = searchInput.closest('form');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          saveSearchHistory(query);
          window.location.href = `art.html?search=${encodeURIComponent(query)}`;
        }
      });
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceSearch);
  } else {
    enhanceSearch();
  }
  
  // Re-initialize when search overlay opens
  document.addEventListener('click', (e) => {
    if (e.target.id === 'navbarSearchToggle' || e.target.closest('#navbarSearchToggle')) {
      setTimeout(enhanceSearch, 100);
    }
  });
})();

