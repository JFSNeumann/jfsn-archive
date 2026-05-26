/**
 * SHOW MORE BUTTON 2026
 * Manages the "Show More" button above footer for loading more artworks
 */

(function() {
  'use strict';

  class ShowMoreButton {
    constructor() {
      this.container = document.getElementById('showMoreContainer');
      this.button = document.getElementById('showMoreBtn');
      this.loadingEl = this.button?.querySelector('.show-more-loading');
      this.contentEl = this.button?.querySelector('.show-more-content');
      this.countEl = this.button?.querySelector('.show-more-count');
      this.isLoading = false;
      
      if (!this.button || !this.container) {
        console.warn('⚠️ Show More button elements not found');
        return;
      }

      this.init();
    }

    init() {
      // Wait for gallery to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setup());
      } else {
        this.setup();
      }
    }

    setup() {
      // Setup click handler
      this.button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleClick();
      });

      // Listen for gallery updates
      document.addEventListener('galleryUpdated', () => {
        setTimeout(() => {
          this.updateVisibility();
          this.updateCount();
        }, 100);
      });

      // Listen for filter changes
      document.addEventListener('filterApplied', () => {
        setTimeout(() => {
          this.updateVisibility();
          this.updateCount();
        }, 100);
      });

      // Listen for artwork rendering
      const observer = new MutationObserver(() => {
        this.updateVisibility();
        this.updateCount();
      });

      const galleryContainer = document.getElementById('galleryContainer') || 
                              document.getElementById('gallery');
      if (galleryContainer) {
        observer.observe(galleryContainer, {
          childList: true,
          subtree: true
        });
      }

      // Initial update with retries
      let attempts = 0;
      const checkInterval = setInterval(() => {
        attempts++;
        const hasData = window.ArtGallery?.state?.allArtworks?.length > 0;
        
        if (hasData || attempts >= 10) {
          clearInterval(checkInterval);
          setTimeout(() => {
            this.updateVisibility();
            this.updateCount();
          }, 200);
        }
      }, 500);

      console.log('✅ Show More button initialized');
    }

    handleClick() {
      if (this.isLoading) return;

      console.log('🖱️ Show More button clicked');

      // Check if loadMoreArtworks function exists
      if (typeof window.loadMoreArtworks === 'function') {
        this.setLoading(true);
        window.loadMoreArtworks();
        // Reset loading after a delay (function should handle this)
        setTimeout(() => {
          this.setLoading(false);
          this.updateVisibility();
          this.updateCount();
        }, 1000);
      } else if (typeof window.ArtGallery !== 'undefined' && window.ArtGallery.loadMore) {
        this.setLoading(true);
        window.ArtGallery.loadMore();
        setTimeout(() => {
          this.setLoading(false);
          this.updateVisibility();
          this.updateCount();
        }, 1000);
      } else {
        console.warn('⚠️ loadMoreArtworks function not found');
        // Fallback: scroll to load more (if infinite scroll is active)
        window.scrollTo({
          top: document.documentElement.scrollHeight - window.innerHeight - 100,
          behavior: 'smooth'
        });
      }
    }

    setLoading(loading) {
      this.isLoading = loading;
      
      if (loading) {
        this.button.classList.add('loading');
        this.button.setAttribute('disabled', 'true');
        this.button.setAttribute('aria-busy', 'true');
        if (this.loadingEl) this.loadingEl.classList.remove('display-none');
        if (this.contentEl) this.contentEl.style.opacity = '0';
      } else {
        this.button.classList.remove('loading');
        this.button.removeAttribute('disabled');
        this.button.setAttribute('aria-busy', 'false');
        if (this.loadingEl) this.loadingEl.classList.add('display-none');
        if (this.contentEl) this.contentEl.style.opacity = '1';
      }
    }

    updateVisibility() {
      // Check if there are more artworks to load
      const hasMore = this.checkHasMore();
      
      if (hasMore) {
        this.container.classList.remove('display-none');
        this.button.style.display = 'inline-flex';
      } else {
        this.container.classList.add('display-none');
        this.button.style.display = 'none';
      }
    }

    checkHasMore() {
      // Check various ways to determine if more artworks are available
      
      // Method 1: Check ArtGallery state (use filteredArtworks when filter is active)
      if (window.ArtGallery?.state) {
        const state = window.ArtGallery.state;
        
        // Use filteredArtworks if available (when filters are active), otherwise allArtworks
        const totalArtworks = state.filteredArtworks?.length > 0 
          ? state.filteredArtworks.length 
          : state.allArtworks?.length || 0;
        
        // Count displayed cards from DOM
        const galleryContainer = document.getElementById('galleryContainer') || 
                                document.getElementById('gallery');
        let displayed = 0;
        
        if (galleryContainer) {
          displayed = galleryContainer.querySelectorAll('.artwork-card, .gallery-item, [data-artwork-id]').length;
        } else if (state.displayedArtworks) {
          displayed = state.displayedArtworks.length;
        }
        
        if (displayed < totalArtworks) {
          return true;
        }
      }

      // Method 2: Check gallery container directly
      const galleryContainer = document.getElementById('galleryContainer') || 
                              document.getElementById('gallery');
      if (galleryContainer) {
        const displayedCards = galleryContainer.querySelectorAll('.artwork-card, .gallery-item, [data-artwork-id]').length;
        
        // Get total based on current filter state
        let totalArtworks = 0;
        if (window.ArtGallery?.state?.filteredArtworks?.length > 0) {
          totalArtworks = window.ArtGallery.state.filteredArtworks.length;
        } else {
          totalArtworks = window.ArtGallery?.state?.allArtworks?.length || 
                         window.galleryData?.length || 0;
        }
        
        if (displayedCards < totalArtworks) {
          return true;
        }
      }

      // Method 3: Check if infinite scroll is active
      if (window.infiniteScroll && window.infiniteScroll.hasMore) {
        return true;
      }

      return false;
    }

    updateCount() {
      if (!this.countEl) return;

      let remaining = 0;
      let displayed = 0;
      let total = 0;

      // Calculate remaining artworks - use filteredArtworks when filter is active
      if (window.ArtGallery?.state) {
        const state = window.ArtGallery.state;
        
        // Use filteredArtworks if available (when filters are active), otherwise allArtworks
        total = state.filteredArtworks?.length > 0 
          ? state.filteredArtworks.length 
          : state.allArtworks?.length || 0;
        
        // Count displayed cards from DOM
        const galleryContainer = document.getElementById('galleryContainer') || 
                                document.getElementById('gallery');
        if (galleryContainer) {
          displayed = galleryContainer.querySelectorAll('.artwork-card, .gallery-item, [data-artwork-id]').length;
        } else if (state.displayedArtworks) {
          displayed = state.displayedArtworks.length;
        }
        
        remaining = Math.max(0, total - displayed);
      } else {
        const galleryContainer = document.getElementById('galleryContainer') || 
                                document.getElementById('gallery');
        if (galleryContainer) {
          displayed = galleryContainer.querySelectorAll('.artwork-card, .gallery-item, [data-artwork-id]').length;
          
          // Get total based on current filter state
          if (window.ArtGallery?.state?.filteredArtworks?.length > 0) {
            total = window.ArtGallery.state.filteredArtworks.length;
          } else {
            total = window.ArtGallery?.state?.allArtworks?.length || 
                   window.galleryData?.length || 0;
          }
          
          remaining = Math.max(0, total - displayed);
        }
      }

      if (remaining > 0) {
        this.countEl.textContent = remaining.toLocaleString();
        this.countEl.style.display = 'inline';
      } else {
        this.countEl.textContent = '';
        this.countEl.style.display = 'none';
      }
    }

    show() {
      this.container.classList.remove('display-none');
      this.updateCount();
    }

    hide() {
      this.container.classList.add('display-none');
    }
  }

  // Initialize
  window.showMoreButton = new ShowMoreButton();

  // Expose API
  window.ShowMoreButton = ShowMoreButton;

})();

