/**
 * ARIA Live Regions
 * Enhanced screen reader announcements
 */

(function() {
  'use strict';
  
  function announceToScreenReader(message, priority = 'polite') {
    let liveRegion;
    
    // Choose appropriate live region based on priority
    if (priority === 'assertive') {
      liveRegion = document.getElementById('aria-live-region-assertive');
    } else if (priority === 'status') {
      liveRegion = document.getElementById('aria-live-region-status');
    } else {
      liveRegion = document.getElementById('aria-live-region');
    }
    
    if (liveRegion) {
      // Clear previous message
      liveRegion.textContent = '';
      
      // Small delay to ensure screen reader picks up the change
      setTimeout(() => {
        liveRegion.textContent = message;
        
        // Clear after announcement (longer for assertive)
        const clearDelay = priority === 'assertive' ? 2000 : 1000;
        setTimeout(() => {
          liveRegion.textContent = '';
        }, clearDelay);
      }, 100);
    }
  }
  
  // Export for global use
  window.announceToScreenReader = announceToScreenReader;
})();

