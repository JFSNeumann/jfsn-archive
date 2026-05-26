/**
 * INFINITE SCROLL - Smart endless scrolling
 * Load more content as user scrolls
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    threshold: 300, // Pixels from bottom to trigger load
    batchSize: 20, // Items to load per batch
    loadDelay: 500 // Delay between loads (ms)
  };

  // State
  let isLoading = false;
  let hasMore = true;
  let currentBatch = 1;
  let totalLoaded = 0;

  // DOM elements
  const galleryContainer = document.querySelector('.row.g-4, .bento-grid, .artwork-grid');
  let loadingIndicator = null;
  let progressIndicator = null;

  if (!galleryContainer) return;

  /**
   * Create loading indicator
   */
  const createLoadingIndicator = () => {
    const indicator = document.createElement('div');
    indicator.id = 'infiniteScrollLoading';
    indicator.style.cssText = `
      text-align: center;
      padding: 2rem 1rem;
      display: none;
    `;
    indicator.innerHTML = `
      <div style="
        display: inline-flex;
        align-items: center;
        gap: 12px;
        background: rgba(99, 102, 241, 0.1);
        padding: 12px 24px;
        border-radius: 24px;
        backdrop-filter: blur(10px);
      ">
        <div style="
          width: 24px;
          height: 24px;
          border: 3px solid rgba(99, 102, 241, 0.3);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: infiniteSpinner 0.8s linear infinite;
        "></div>
        <span style="color: #6366f1; font-weight: 600; font-size: 0.875rem;">
          Loading more artworks...
        </span>
      </div>
    `;
    
    // Add spinner animation
    if (!document.getElementById('infiniteScrollStyles')) {
      const style = document.createElement('style');
      style.id = 'infiniteScrollStyles';
      style.textContent = `
        @keyframes infiniteSpinner {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
    
    return indicator;
  };

  /**
   * Create progress indicator
   */
  const createProgressIndicator = () => {
    const indicator = document.createElement('div');
    indicator.id = 'infiniteScrollProgress';
    indicator.style.cssText = `
      text-align: center;
      padding: 1.5rem 1rem;
      color: #64748b;
      font-size: 0.875rem;
      font-weight: 500;
    `;
    return indicator;
  };

  /**
   * Update progress indicator
   */
  const updateProgress = () => {
    if (!progressIndicator) return;
    
    const total = artworks.length;
    const percentage = Math.round((totalLoaded / total) * 100);
    
    progressIndicator.innerHTML = `
      <div style="max-width: 300px; margin: 0 auto;">
        <div style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          color: #6366f1;
          font-weight: 600;
        ">
          <span>Viewing ${totalLoaded} of ${total}</span>
          <span>${percentage}%</span>
        </div>
        <div style="
          height: 4px;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 2px;
          overflow: hidden;
        ">
          <div style="
            height: 100%;
            width: ${percentage}%;
            background: linear-gradient(90deg, #6366f1, #a855f7);
            transition: width 0.3s ease;
            border-radius: 2px;
          "></div>
        </div>
      </div>
    `;
  };

  /**
   * Load more items (simulated - replace with actual API/data loading)
   */
  const loadMoreItems = () => {
    if (isLoading || !hasMore) return;
    
    isLoading = true;
    loadingIndicator.style.display = 'block';
    
    // Simulate loading delay
    setTimeout(() => {
      // In real implementation, load actual data here
      // For now, we'll just mark as complete since items are already loaded
      
      currentBatch++;
      totalLoaded = Math.min(totalLoaded + CONFIG.batchSize, artworks.length);
      
      if (totalLoaded >= artworks.length) {
        hasMore = false;
        loadingIndicator.style.display = 'none';
        showEndMessage();
      } else {
        loadingIndicator.style.display = 'none';
      }
      
      updateProgress();
      isLoading = false;
      
      // Haptic feedback
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(10);
      }
      
    }, CONFIG.loadDelay);
  };

  /**
   * Show end of content message
   */
  const showEndMessage = () => {
    const endMessage = document.createElement('div');
    endMessage.className = 'infinite-scroll-end-message';
    endMessage.style.cssText = `
      text-align: center;
      padding: 3rem 1rem;
      color: #64748b;
    `;
    endMessage.innerHTML = `
      <div style="
        max-width: 400px;
        margin: 0 auto;
        background: rgba(99, 102, 241, 0.05);
        padding: 2rem;
        border-radius: 20px;
      ">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🎨</div>
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: #1a1a1a;">
          You've seen it all!
        </h3>
        <p style="font-size: 0.9rem; margin-bottom: 1.5rem; color: #64748b;">
          You've viewed all ${artworks.length} artworks in this collection.
        </p>
        <button onclick="window.scrollTo({top: 0, behavior: 'smooth'})" style="
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 24px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        ">
          ↑ Back to Top
        </button>
      </div>
    `;
    
    galleryContainer.parentNode.appendChild(endMessage);
  };

  /**
   * Check if should load more
   */
  const checkScrollPosition = () => {
    if (isLoading || !hasMore) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    
    if (scrollHeight - scrollTop - clientHeight < CONFIG.threshold) {
      loadMoreItems();
    }
  };

  /**
   * Initialize infinite scroll
   */
  const init = () => {
    // Create indicators
    loadingIndicator = createLoadingIndicator();
    progressIndicator = createProgressIndicator();
    
    // Insert after gallery
    if (galleryContainer.parentNode) {
      galleryContainer.parentNode.insertBefore(loadingIndicator, galleryContainer.nextSibling);
      galleryContainer.parentNode.insertBefore(progressIndicator, loadingIndicator.nextSibling);
    }
    
    // Count initial items
    totalLoaded = document.querySelectorAll('.category-card, .artwork-grid-item, .bento-card').length;
    
    // Update initial progress
    updateProgress();
    
    // Listen for scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(checkScrollPosition, 100);
    }, { passive: true });
    
    // Initial check
    checkScrollPosition();
  };

  // Collect artworks data for progress tracking
  let artworks = [];
  document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.category-card, .artwork-grid-item, .bento-card');
    artworks = Array.from(cards).map((card, index) => ({
      index,
      element: card
    }));
    
    // Only init if on mobile
    if (window.innerWidth <= 992) {
      init();
    }
  });

  // Export for external control
  window.InfiniteScroll = {
    loadMore: loadMoreItems,
    reset: init
  };

})();

