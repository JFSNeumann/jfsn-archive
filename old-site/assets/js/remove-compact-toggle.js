/**
 * Remove any existing compact mode toggle buttons
 * Runs immediately to remove buttons that may have been created before CSS loads
 */

(function() {
  'use strict';
  
  function removeCompactToggles() {
    // Remove all compact toggle buttons
    const toggles = document.querySelectorAll('.navbar-compact-toggle, button[aria-label*="compact"], button[aria-label*="Toggle compact"]');
    toggles.forEach(toggle => {
      toggle.remove();
    });
  }
  
  // Remove immediately
  removeCompactToggles();
  
  // Remove after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeCompactToggles);
  } else {
    setTimeout(removeCompactToggles, 100);
  }
  
  // Watch for dynamically added buttons
  // Only set up observer if document.body exists
  if (document.body) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node && node.nodeType === 1) { // Element node
            if (node.classList && (node.classList.contains('navbar-compact-toggle') || 
                node.getAttribute && (node.getAttribute('aria-label') || '').includes('compact'))) {
              node.remove();
            }
            // Also check children
            const toggles = node.querySelectorAll && node.querySelectorAll('.navbar-compact-toggle, button[aria-label*="compact"]');
            if (toggles) {
              toggles.forEach(toggle => toggle.remove());
            }
          }
        });
      });
    });
    
    try {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    } catch (error) {
      console.warn('MutationObserver setup failed:', error);
    }
  } else {
    // Wait for body to be available
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        if (document.body) {
          const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
              mutation.addedNodes.forEach(function(node) {
                if (node && node.nodeType === 1) {
                  if (node.classList && (node.classList.contains('navbar-compact-toggle') || 
                      node.getAttribute && (node.getAttribute('aria-label') || '').includes('compact'))) {
                    node.remove();
                  }
                  const toggles = node.querySelectorAll && node.querySelectorAll('.navbar-compact-toggle, button[aria-label*="compact"]');
                  if (toggles) {
                    toggles.forEach(toggle => toggle.remove());
                  }
                }
              });
            });
          });
          try {
            observer.observe(document.body, {
              childList: true,
              subtree: true
            });
          } catch (error) {
            console.warn('MutationObserver setup failed:', error);
          }
        }
      });
    }
  }
  
})();
