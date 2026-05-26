/**
 * Lazy Load Filter Counts
 * Only calculates and displays filter counts when buttons are visible
 */

(function() {
  'use strict';

  let artworkData = null;
  let countsCalculated = new Set();
  let observer = null;

  // Get artwork data
  function getArtworkData() {
    return window.ArtGallery?.state?.allArtworks || 
           window.galleryData || 
           [];
  }

  // Calculate count for a category - matches gallery filtering logic exactly
  function calculateCount(category) {
    const artworks = getArtworkData();
    if (!artworks || artworks.length === 0) {
      return 0;
    }

    if (category === 'all') {
      return artworks.length;
    }

    if (category === 'favorites') {
      const favorites = JSON.parse(localStorage.getItem('artworkFavorites') || '[]');
      return artworks.filter(art => favorites.includes(art.id?.toString())).length;
    }

    if (category.startsWith('orientation-')) {
      const orientation = category.replace('orientation-', '');
      return artworks.filter(art => {
        // Check orientation from metadata - exact match
        if (art.orientation) {
          return art.orientation.toLowerCase() === orientation.toLowerCase();
        }
        // Fallback: check dimensions if available
        if (art.width && art.height) {
          const ratio = art.width / art.height;
          if (orientation === 'horizontal' && ratio > 1.1) return true;
          if (orientation === 'vertical' && ratio < 0.9) return true;
          if (orientation === 'square' && ratio >= 0.9 && ratio <= 1.1) return true;
        }
        return false;
      }).length;
    }

    // Determine filter type based on button class or data attribute
    const button = document.querySelector(`[data-category="${category}"]`);
    const filterGroup = button?.getAttribute('data-filter-group') || '';
    
    // For status filters, check art.status field
    if (filterGroup === 'status') {
      return artworks.filter(art => {
        // Exact match on status field
        if (art.status) {
          return art.status.toLowerCase() === category.toLowerCase();
        }
        // Fallback: check category field for "New"
        if (category === 'New' && art.category && art.category.toLowerCase() === 'new') {
          return true;
        }
        return false;
      }).length;
    }

    // For series and other filters, use exact match on category field (like gallery does)
    return artworks.filter(art => {
      if (!art.category) return false;
      // Exact match (case-insensitive) - matches gallery filtering logic
      return art.category.toLowerCase() === category.toLowerCase();
    }).length;
  }

  // Update count for a button
  function updateButtonCount(button) {
    const category = button.getAttribute('data-category');
    if (!category || countsCalculated.has(category)) {
      return;
    }

    const count = calculateCount(category);
    const countEl = button.querySelector('.artwork-count-badge') || 
                    button.querySelector('.artwork-count') ||
                    button.querySelector(`#count-${category.toLowerCase().replace(/\s+/g, '-')}`);
    
    if (countEl) {
      // Add loading state
      countEl.classList.add('count-loading');
      
      // Update count with animation
      setTimeout(() => {
        countEl.textContent = count > 0 ? count.toLocaleString() : '';
        countEl.classList.remove('count-loading');
        countEl.classList.add('count-loaded');
        
        // Trigger pulse animation
        setTimeout(() => {
          countEl.classList.remove('count-loaded');
        }, 500);
      }, 100);
    }

    countsCalculated.add(category);
  }

  // Initialize lazy loading with Intersection Observer
  function initLazyCounts() {
    artworkData = getArtworkData();
    
    // If no data yet, wait for it
    if (!artworkData || artworkData.length === 0) {
      setTimeout(initLazyCounts, 500);
      return;
    }

    const filterButtons = document.querySelectorAll('.filter-btn[data-category]');
    
    if (filterButtons.length === 0) {
      setTimeout(initLazyCounts, 500);
      return;
    }

    // Create Intersection Observer
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateButtonCount(entry.target);
          // Unobserve after loading to avoid recalculation
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px', // Start loading 50px before button is visible
      threshold: 0.1
    });

    // Observe all filter buttons
    filterButtons.forEach(button => {
      const category = button.getAttribute('data-category');
      // Skip "all" button as it's already loaded
      if (category && category !== 'all') {
        observer.observe(button);
      }
    });

    // Also update counts for buttons that are already visible
    filterButtons.forEach(button => {
      const rect = button.getBoundingClientRect();
      if (rect.top < window.innerHeight + 50 && rect.bottom > -50) {
        updateButtonCount(button);
      }
    });
  }

  // Recalculate counts when artwork data changes
  function recalculateCounts() {
    countsCalculated.clear();
    artworkData = getArtworkData();
    
    const filterButtons = document.querySelectorAll('.filter-btn[data-category]');
    filterButtons.forEach(button => {
      const category = button.getAttribute('data-category');
      if (category) {
        // Clear the calculated flag to force recalculation
        countsCalculated.delete(category);
        updateButtonCount(button);
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initLazyCounts, 1000);
    });
  } else {
    setTimeout(initLazyCounts, 1000);
  }

  // Re-initialize when artwork data loads
  document.addEventListener('artworkDataLoaded', () => {
    setTimeout(() => {
      countsCalculated.clear();
      if (observer) {
        observer.disconnect();
      }
      initLazyCounts();
    }, 500);
  });

  // Also listen for gallery ready event
  document.addEventListener('galleryReady', () => {
    setTimeout(() => {
      countsCalculated.clear();
      if (observer) {
        observer.disconnect();
      }
      initLazyCounts();
    }, 500);
  });

  // Expose recalculate function for manual updates
  window.lazyFilterCounts = {
    recalculate: recalculateCounts
  };

})();

