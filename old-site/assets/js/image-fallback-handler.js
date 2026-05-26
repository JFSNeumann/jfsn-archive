/**
 * Image Fallback Handler
 * External file to comply with CSP (no inline onerror handlers)
 */

(function() {
  'use strict';
  
  // Handle image fallbacks using data-fallback attribute
  function setupImageFallbacks() {
    const images = document.querySelectorAll('img[data-fallback]');
    
    images.forEach(img => {
      const fallback = img.getAttribute('data-fallback');
      if (!fallback) return;
      
      // Set up error handler
      img.addEventListener('error', function() {
        if (this.src !== fallback && !this.dataset.fallbackUsed) {
          this.dataset.fallbackUsed = 'true';
          this.src = fallback;
        }
      });
    });
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupImageFallbacks);
  } else {
    setupImageFallbacks();
  }
  
  // Also run after a delay to catch dynamically loaded images
  setTimeout(setupImageFallbacks, 1000);
})();
