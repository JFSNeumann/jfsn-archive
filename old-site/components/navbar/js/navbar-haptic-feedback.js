/**
 * HAPTIC FEEDBACK FOR NAVBAR
 * Vibration on button interactions (mobile)
 */

(function() {
  'use strict';
  
  function triggerHaptic(type = 'light') {
    // Check if Vibration API is supported
    if (!navigator.vibrate) return;
    
    // Check if device supports haptics (mobile devices)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) return;
    
    // Vibration patterns
    const patterns = {
      light: 10,           // Light tap
      medium: 20,          // Medium tap
      heavy: 30,           // Heavy tap
      double: [10, 50, 10], // Double tap
      success: [10, 50, 10, 50, 10], // Success pattern
      error: [20, 50, 20, 50, 20]    // Error pattern
    };
    
    const pattern = patterns[type] || patterns.light;
    navigator.vibrate(pattern);
  }
  
  function initHapticFeedback() {
    // Navbar toggle button
    const toggle = document.getElementById('editorialNavToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        triggerHaptic('medium');
      });
    }
    
    // Close button
    const closeBtn = document.getElementById('editorialNavClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        triggerHaptic('light');
      });
    }
    
    // Quick action buttons
    const quickActionBtns = document.querySelectorAll('.navbar-quick-action-btn, .editorial-nav-quick-action-btn');
    quickActionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        triggerHaptic('medium');
      });
    });
    
    // Search toggle
    const searchToggle = document.getElementById('navbarSearchToggle');
    if (searchToggle) {
      searchToggle.addEventListener('click', () => {
        triggerHaptic('light');
      });
    }
    
    // Menu links
    const menuLinks = document.querySelectorAll('.editorial-nav-link');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        triggerHaptic('light');
      });
    });
    
    // Watch for dynamically added buttons
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            // Check if it's a button or link
            if (node.matches && (
              node.matches('.navbar-quick-action-btn, .editorial-nav-quick-action-btn, .editorial-nav-link') ||
              node.querySelector('.navbar-quick-action-btn, .editorial-nav-quick-action-btn, .editorial-nav-link')
            )) {
              const buttons = node.matches ? [node] : node.querySelectorAll('.navbar-quick-action-btn, .editorial-nav-quick-action-btn, .editorial-nav-link');
              buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                  triggerHaptic('light');
                });
              });
            }
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHapticFeedback);
  } else {
    setTimeout(initHapticFeedback, 500);
  }
  
  // Expose globally
  window.navbarHapticFeedback = {
    trigger: triggerHaptic,
    init: initHapticFeedback
  };
  
})();

