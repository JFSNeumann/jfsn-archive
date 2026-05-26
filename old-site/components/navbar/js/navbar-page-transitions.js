/**
 * SMOOTH PAGE TRANSITIONS
 * Navbar coordinates with page transitions
 */

(function() {
  'use strict';
  
  function initPageTransitions() {
    // Intercept link clicks
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (!link) return;
      
      // Only handle internal links
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }
      
      // Check if it's a same-origin link
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) {
          return; // External link, don't intercept
        }
      } catch (e) {
        // Relative URL, proceed
      }
      
      // Don't intercept if modifier keys are pressed
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
        return;
      }
      
      // Add transitioning class
      document.documentElement.classList.add('transitioning');
      
      // Remove transitioning and add transitioned after delay
      setTimeout(() => {
        document.documentElement.classList.remove('transitioning');
        document.documentElement.classList.add('transitioned');
        
        // Remove transitioned class after animation
        setTimeout(() => {
          document.documentElement.classList.remove('transitioned');
        }, 400);
      }, 100);
    }, true);
    
    // Handle browser back/forward
    window.addEventListener('popstate', function() {
      document.documentElement.classList.add('transitioned');
      setTimeout(() => {
        document.documentElement.classList.remove('transitioned');
      }, 400);
    });
    
    // Initial load
    document.documentElement.classList.add('transitioned');
    setTimeout(() => {
      document.documentElement.classList.remove('transitioned');
    }, 400);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageTransitions);
  } else {
    initPageTransitions();
  }
  
  // Expose globally
  window.navbarPageTransitions = {
    init: initPageTransitions
  };
  
})();

