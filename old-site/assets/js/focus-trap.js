/**
 * Focus Trap Utility
 * Traps keyboard focus within modals, lightboxes, and dialogs
 * 
 * Features:
 * - Traps focus within modal elements
 * - Handles Tab and Shift+Tab navigation
 * - Esc key to close
 * - Returns focus to trigger element
 * - ARIA compliant
 */

(function() {
  'use strict';

  // Store original focus element
  let previousActiveElement = null;
  let currentTrap = null;
  let trapListeners = [];

  /**
   * Get all focusable elements within a container
   * @param {HTMLElement} container - Container element
   * @returns {Array} Array of focusable elements
   */
  function getFocusableElements(container) {
    if (!container) return [];

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    const elements = Array.from(container.querySelectorAll(focusableSelectors));
    
    // Filter out hidden elements
    return elements.filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             style.opacity !== '0' &&
             !el.hasAttribute('aria-hidden') &&
             el.offsetWidth > 0 &&
             el.offsetHeight > 0;
    });
  }

  /**
   * Trap focus within a container
   * @param {HTMLElement} container - Container element to trap focus in
   * @param {Object} options - Options
   */
  function trapFocus(container, options = {}) {
    if (!container) return;

    const {
      returnFocus = true,
      initialFocus = null,
      escapeDeactivates = true,
      clickOutsideDeactivates = false,
      onDeactivate = null
    } = options;

    // Store previous active element
    if (returnFocus) {
      previousActiveElement = document.activeElement;
    }

    // Get focusable elements
    const focusableElements = getFocusableElements(container);
    
    if (focusableElements.length === 0) {
      console.warn('No focusable elements found in container');
      return;
    }

    // Set initial focus
    const firstFocusable = initialFocus || focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus initial element
    if (firstFocusable) {
      firstFocusable.focus();
    }

    // Handle Tab key
    function handleTabKey(e) {
      if (e.key !== 'Tab') return;

      // If only one focusable element, keep focus on it
      if (focusableElements.length === 1) {
        e.preventDefault();
        focusableElements[0].focus();
        return;
      }

      // Shift+Tab: go to previous element
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } 
      // Tab: go to next element
      else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }

    // Handle Escape key
    function handleEscapeKey(e) {
      if (e.key === 'Escape' && escapeDeactivates) {
        deactivate();
      }
    }

    // Handle click outside
    function handleClickOutside(e) {
      if (clickOutsideDeactivates && !container.contains(e.target)) {
        deactivate();
      }
    }

    // Deactivate focus trap
    function deactivate() {
      // Remove event listeners
      trapListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
      trapListeners = [];

      // Return focus to previous element
      if (returnFocus && previousActiveElement) {
        // Check if element still exists and is focusable
        if (previousActiveElement.focus && document.body.contains(previousActiveElement)) {
          previousActiveElement.focus();
        }
      }

      // Clear current trap
      currentTrap = null;
      previousActiveElement = null;

      // Call callback
      if (onDeactivate) {
        onDeactivate();
      }
    }

    // Add event listeners
    const tabHandler = handleTabKey.bind(this);
    const escapeHandler = handleEscapeKey.bind(this);
    const clickHandler = handleClickOutside.bind(this);

    container.addEventListener('keydown', tabHandler);
    if (escapeDeactivates) {
      container.addEventListener('keydown', escapeHandler);
    }
    if (clickOutsideDeactivates) {
      document.addEventListener('click', clickHandler);
    }

    // Store listeners for cleanup
    trapListeners = [
      { element: container, event: 'keydown', handler: tabHandler },
      { element: container, event: 'keydown', handler: escapeHandler },
      { element: document, event: 'click', handler: clickHandler }
    ];

    // Store current trap
    currentTrap = {
      container,
      deactivate
    };

    // Update focusable elements when DOM changes
    const observer = new MutationObserver(() => {
      const newFocusableElements = getFocusableElements(container);
      if (newFocusableElements.length > 0) {
        focusableElements.length = 0;
        focusableElements.push(...newFocusableElements);
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'tabindex', 'aria-hidden']
    });

    // Store observer for cleanup
    currentTrap.observer = observer;

    return deactivate;
  }

  /**
   * Auto-detect and trap focus in modals/lightboxes
   */
  function initAutoFocusTrap() {
    // Watch for modal/lightbox opening
    const modalSelectors = [
      '.modal.show',
      '.modal[aria-hidden="false"]',
      '.lightbox.show',
      '.lg-container.lg-show',
      '[role="dialog"][aria-hidden="false"]',
      '.overlay.active',
      '.overlay[aria-hidden="false"]'
    ];

    function checkForModals() {
      modalSelectors.forEach(selector => {
        const modal = document.querySelector(selector);
        if (modal && modal !== currentTrap?.container) {
          // Modal opened, trap focus
          const closeButton = modal.querySelector('[data-dismiss="modal"], .close, [aria-label*="close" i]');
          
          trapFocus(modal, {
            initialFocus: closeButton || null,
            escapeDeactivates: true,
            clickOutsideDeactivates: false,
            onDeactivate: () => {
              // Modal closed, remove trap
              if (modal.classList) {
                modal.classList.remove('show', 'active');
              }
              modal.setAttribute('aria-hidden', 'true');
            }
          });
        }
      });
    }

    // Check immediately
    checkForModals();

    // Watch for DOM changes
    const observer = new MutationObserver(checkForModals);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'aria-hidden']
    });

    // Watch for LightGallery events
    document.addEventListener('lgAfterOpen', (e) => {
      const container = e.detail.container || document.querySelector('.lg-container.lg-show');
      if (container) {
        trapFocus(container, {
          escapeDeactivates: false, // LightGallery handles Escape
          clickOutsideDeactivates: false
        });
      }
    });

    document.addEventListener('lgAfterClose', () => {
      if (currentTrap) {
        currentTrap.deactivate();
      }
    });
  }

  /**
   * Public API
   */
  window.FocusTrap = {
    trap: trapFocus,
    
    deactivate: function() {
      if (currentTrap) {
        currentTrap.deactivate();
      }
    },
    
    isActive: function() {
      return currentTrap !== null;
    }
  };

  // Initialize auto-detection
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoFocusTrap);
  } else {
    initAutoFocusTrap();
  }

})();
