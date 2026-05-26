/**
 * FOCUS TRAP FOR NAVBAR OVERLAY
 * Proper focus management for accessibility
 */

(function() {
  'use strict';
  
  let focusTrapActive = false;
  let firstFocusableElement = null;
  let lastFocusableElement = null;
  let previouslyFocusedElement = null;
  
  function getFocusableElements(container) {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(el => {
        return el.offsetWidth > 0 && el.offsetHeight > 0 && 
               !el.hasAttribute('disabled') &&
               !el.getAttribute('aria-hidden') === 'true';
      });
  }
  
  function trapFocus(container) {
    if (!container) return;
    
    const focusableElements = getFocusableElements(container);
    
    if (focusableElements.length === 0) return;
    
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    // Store previously focused element
    previouslyFocusedElement = document.activeElement;
    
    // Focus first element
    firstFocusableElement.focus();
    focusTrapActive = true;
    
    // Handle Tab key
    function handleTabKey(e) {
      if (!focusTrapActive) return;
      
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          e.preventDefault();
          lastFocusableElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableElement) {
          e.preventDefault();
          firstFocusableElement.focus();
        }
      }
    }
    
    document.addEventListener('keydown', handleTabKey);
    
    // Return cleanup function
    return function releaseFocus() {
      focusTrapActive = false;
      document.removeEventListener('keydown', handleTabKey);
      
      // Restore focus to previously focused element
      if (previouslyFocusedElement && previouslyFocusedElement.focus) {
        previouslyFocusedElement.focus();
      }
    };
  }
  
  // Expose globally
  window.navbarFocusTrap = {
    trap: trapFocus,
    getFocusableElements: getFocusableElements
  };
  
})();

