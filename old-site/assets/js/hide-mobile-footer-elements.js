/**
 * Hide Mobile Footer Elements
 * Aggressively removes quick actions buttons and footer bottom section on mobile
 */

(function() {
  'use strict';
  
  // Only run on mobile devices
  if (window.innerWidth > 767) return;
  
  function removeElements() {
    // Remove quick actions buttons
    const quickActions = document.querySelector('.footer-quick-actions');
    if (quickActions) {
      quickActions.remove();
    }
    
    // Remove individual quick action buttons
    document.querySelectorAll('.footer-quick-action-btn, .footer-quick-action-main, .footer-quick-action-secondary').forEach(el => {
      el.remove();
    });
    
    // Remove footer toggle button
    const toggleBtn = document.querySelector('.footer-toggle-btn');
    if (toggleBtn) {
      toggleBtn.remove();
    }
    
    // Hide footer bottom section
    const footerBottomRow = document.querySelector('.footer-bottom-row');
    if (footerBottomRow) {
      footerBottomRow.style.display = 'none';
      footerBottomRow.style.visibility = 'hidden';
      footerBottomRow.style.opacity = '0';
      footerBottomRow.style.height = '0';
      footerBottomRow.style.overflow = 'hidden';
      footerBottomRow.style.margin = '0';
      footerBottomRow.style.padding = '0';
    }
    
    // Hide footer divider
    const footerDivider = document.querySelector('.footer-divider');
    if (footerDivider) {
      footerDivider.style.display = 'none';
      footerDivider.style.visibility = 'hidden';
      footerDivider.style.opacity = '0';
      footerDivider.style.height = '0';
      footerDivider.style.margin = '0';
    }
    
    // Hide mobile bottom nav
    const mobileBottomNav = document.querySelector('.mobile-bottom-nav, #mobileBottomNav');
    if (mobileBottomNav) {
      mobileBottomNav.style.display = 'none';
      mobileBottomNav.style.visibility = 'hidden';
      mobileBottomNav.style.opacity = '0';
      mobileBottomNav.style.pointerEvents = 'none';
    }
  }
  
  // Run immediately
  removeElements();
  
  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeElements);
  } else {
    removeElements();
  }
  
  // Use MutationObserver to watch for dynamically created elements
  const observer = new MutationObserver(function(mutations) {
    removeElements();
  });
  
  // Start observing
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
  
  // Also run periodically as a fallback
  setInterval(removeElements, 500);
  
  // Run on window load
  window.addEventListener('load', removeElements);
  
})();
