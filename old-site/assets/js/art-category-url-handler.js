/**
 * Category URL Parameter Handler for art.html
 * Handles category filtering from URL parameters
 */

(function() {
  'use strict';
  
  let filterApplied = false;
  let lockScheduled = false;
  let lockAttempts = 0;
  const MAX_LOCK_ATTEMPTS = 40; // ~10s with 250ms interval
  
  function getUrlCategoryParam() {
    const urlParams = new URLSearchParams(window.location.search);
    let value = urlParams.get('category') || urlParams.get('filter') || urlParams.get('series');
    if (value) return value;

    const rawSearch = window.location.search || '';
    const trimmed = rawSearch.startsWith('?') ? rawSearch.slice(1) : rawSearch;
    if (!trimmed) return null;

    const decodedSearch = decodeURIComponent(trimmed);
    if (decodedSearch === trimmed) return null;

    const decodedParams = new URLSearchParams(decodedSearch);
    return decodedParams.get('category') || decodedParams.get('filter') || decodedParams.get('series');
  }
  
  function normalizeCategoryValue(value) {
    if (!value) return '';
    const decoded = decodeURIComponent(String(value).replace(/\+/g, ' ')).trim();
    return decoded.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').toLowerCase();
  }
  
  function clearCategoryParams() {
    const url = new URL(window.location.href);
    ['category', 'filter', 'series'].forEach(key => url.searchParams.delete(key));
    const search = url.searchParams.toString();
    const nextUrl = `${url.pathname}${search ? `?${search}` : ''}${url.hash}`;
    window.history.replaceState({}, document.title, nextUrl);
  }
  
  function applyCategoryFromURL() {
    // Prevent multiple applications
    if (filterApplied) return;
    
    const rawCategoryParam = getUrlCategoryParam();
    
    if (!rawCategoryParam) return;
    
    // Normalize category
    const normalizedParam = normalizeCategoryValue(rawCategoryParam);
    if (!normalizedParam) return;
    
    // Wait for everything to be ready
    if (!window.filterArtworks || !window.ArtGallery || !window.ArtGallery.state) {
      // Retry after a short delay
      setTimeout(applyCategoryFromURL, 200);
      return;
    }

    const hasFullDataset = Array.isArray(window.ArtGallery.fullDataset) && window.ArtGallery.fullDataset.length > 0;
    const datasetToCheck = hasFullDataset
      ? window.ArtGallery.fullDataset
      : window.ArtGallery.state.allArtworks;

    if (!Array.isArray(datasetToCheck) || datasetToCheck.length === 0) {
      // Retry after a short delay
      setTimeout(applyCategoryFromURL, 200);
      return;
    }
    
    // Check if category exists
    const allCategories = [...new Set(datasetToCheck.map(art => art.category).filter(Boolean))];
    const normalizedCategories = allCategories.map(cat => ({
      original: cat,
      normalized: normalizeCategoryValue(cat)
    }));
    const matchedCategory = normalizedCategories.find(cat => cat.normalized === normalizedParam)?.original;
    
    if (!matchedCategory) {
      // If full dataset isn't ready yet, retry instead of clearing
      if (!hasFullDataset) {
        setTimeout(applyCategoryFromURL, 200);
        return;
      }
      // Invalid category - clear URL parameter once full dataset is available
      clearCategoryParams();
      return;
    }
    
    // Mark as applied to prevent re-running
    filterApplied = true;
    
    // Ensure URL-driven filter stays active
    window.pendingCategoryFilter = matchedCategory;
    window.urlCategoryFilterActive = true;
    window.ArtGallery.state.showingCategoryReps = false;
    
    // Start a lock to prevent other scripts from overriding URL filter
    scheduleUrlFilterLock(matchedCategory);
    
    // Find and click the filter button (for UI consistency)
    const filterButton = document.querySelector(`.filter-btn[data-category="${matchedCategory}"]`);
    if (filterButton) {
      // Update button states
      document.querySelectorAll('.filter-btn[data-category]').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      filterButton.classList.add('active');
      filterButton.setAttribute('aria-pressed', 'true');
    }
    
    // Apply the filter directly with explicit parameters
    window.filterArtworks(matchedCategory, null, null, null, null);
  }

  function scheduleUrlFilterLock(matchedCategory) {
    if (lockScheduled) return;
    lockScheduled = true;

    const ensureShowCategoryRepsDisabled = () => {
      if (!window.ArtGallery) return;
      window.ArtGallery.state.showingCategoryReps = false;
      // Guard against scripts calling showCategoryRepresentatives
      if (typeof window.ArtGallery.showCategoryRepresentatives === 'function' && !window.ArtGallery._showCategoryRepsWrapped) {
        const original = window.ArtGallery.showCategoryRepresentatives.bind(window.ArtGallery);
        window.ArtGallery.showCategoryRepresentatives = function() {
          const urlCategory = getUrlCategoryParam();
          if (urlCategory || window.pendingCategoryFilter || window.urlCategoryFilterActive) {
            return;
          }
          return original();
        };
        window.ArtGallery._showCategoryRepsWrapped = true;
      }
    };

    const enforceUrlFilter = () => {
      const urlCategory = getUrlCategoryParam();
      if (!urlCategory) return;
      if (!window.ArtGallery || !window.ArtGallery.state) return;

      ensureShowCategoryRepsDisabled();

      const dataset = (Array.isArray(window.ArtGallery.fullDataset) && window.ArtGallery.fullDataset.length > 0)
        ? window.ArtGallery.fullDataset
        : window.ArtGallery.state.allArtworks;

      if (!Array.isArray(dataset) || dataset.length === 0) return;

      const filtered = window.ArtGallery.state.filteredArtworks || [];
      const hasNonMatching = filtered.length === 0 || filtered.some(art => art.category !== matchedCategory);

      if (hasNonMatching) {
        const nextFiltered = dataset.filter(art => art.category === matchedCategory);
        if (nextFiltered.length > 0) {
          window.ArtGallery.state.filteredArtworks = nextFiltered;
          window.ArtGallery.state.showingCategoryReps = false;
          if (typeof window.ArtGallery.renderGallery === 'function') {
            window.ArtGallery.renderGallery(false, true);
          } else if (typeof window.renderGallery === 'function') {
            window.renderGallery(false, true);
          }
        }
      }
    };

    const attemptLock = () => {
      if (lockAttempts >= MAX_LOCK_ATTEMPTS) return;
      lockAttempts += 1;
      enforceUrlFilter();
      setTimeout(attemptLock, 250);
    };

    // Try repeatedly for a short window while other scripts initialize
    attemptLock();

    // Also listen for signals that data/filters are ready
    window.addEventListener('categoriesPopulated', () => enforceUrlFilter());
    window.addEventListener('filterButtonsReady', () => enforceUrlFilter());
    document.addEventListener('galleryReady', () => enforceUrlFilter());
    document.addEventListener('artworkDataLoaded', () => enforceUrlFilter());
  }
  
  // Try immediately if DOM is ready, otherwise wait for DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(applyCategoryFromURL, 500);
    });
  } else {
    setTimeout(applyCategoryFromURL, 500);
  }
  
  // Also listen for when filter buttons are ready
  window.addEventListener('filterButtonsReady', function() {
    setTimeout(applyCategoryFromURL, 100);
  });
  
  // Also try after a longer delay as fallback
  setTimeout(applyCategoryFromURL, 2000);
})();
