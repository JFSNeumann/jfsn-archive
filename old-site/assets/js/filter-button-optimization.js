/**
 * Filter Button Rendering Optimization
 * Optimizes filter button rendering and interactions for better performance
 */

(function() {
  'use strict';

  let rafPending = false;
  let pendingUpdates = new Set();
  let updateQueue = [];

  // Batch DOM updates using requestAnimationFrame
  function batchUpdate(callback) {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        callback();
        rafPending = false;
      });
    } else {
      updateQueue.push(callback);
    }
  }

  // Optimized class toggle for filter buttons
  function toggleFilterButtonActive(button, isActive) {
    if (!button) return;

    batchUpdate(() => {
      const wasActive = button.classList.contains('active');
      
      if (wasActive === isActive) {
        return; // No change needed
      }

      // Use classList for better performance
      if (isActive) {
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
      } else {
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
      }

      // Trigger transition
      button.classList.add('transitioning');
      setTimeout(() => {
        button.classList.remove('transitioning');
      }, 300);
    });
  }

  // Optimized batch update for multiple buttons
  function updateFilterButtons(activeCategory) {
    batchUpdate(() => {
      const filterButtons = document.querySelectorAll('.filter-btn[data-category]');
      
      filterButtons.forEach(button => {
        const category = button.getAttribute('data-category');
        const isActive = category === activeCategory;
        toggleFilterButtonActive(button, isActive);
      });
    });
  }

  // Debounced scroll handler for filter container
  let scrollTimeout;
  function handleFilterScroll() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const container = document.getElementById('filterButtonsContainer');
      if (!container) return;

      // Update scroll indicators
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      batchUpdate(() => {
        if (scrollLeft > 10) {
          container.classList.add('scrollable-left');
        } else {
          container.classList.remove('scrollable-left');
        }

        if (scrollLeft < scrollWidth - clientWidth - 10) {
          container.classList.add('scrollable-right');
        } else {
          container.classList.remove('scrollable-right');
        }
      });
    }, 16); // ~60fps
  }

  // Optimize filter button click handlers
  // NOTE: Removed click handler - art-gallery.js handles clicks and filtering
  // This script only provides utility functions for button state updates
  function optimizeFilterClicks() {
    const container = document.getElementById('filterButtonsContainer');
    if (!container) return;

    // Only optimize scroll handler - don't interfere with click events
    container.addEventListener('scroll', handleFilterScroll, { passive: true });
  }

  // Use CSS containment for better rendering performance
  function addCSSContainment() {
    const style = document.createElement('style');
    style.textContent = `
      .filter-buttons-container {
        contain: layout style paint;
        will-change: scroll-position;
      }
      .filter-btn {
        contain: layout style paint;
        will-change: transform, opacity;
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize optimizations
  function initOptimizations() {
    optimizeFilterClicks();
    addCSSContainment();
    
    // Expose update function
    window.filterButtonOptimization = {
      updateButtons: updateFilterButtons,
      toggleActive: toggleFilterButtonActive
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOptimizations);
  } else {
    initOptimizations();
  }

})();

