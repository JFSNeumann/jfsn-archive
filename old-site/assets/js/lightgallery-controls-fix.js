/**
 * LightGallery Controls Visibility Fix
 * 
 * Problem: LightGallery defaults to color: #999 for toolbar icons, making them
 * nearly invisible on dark backgrounds. Additionally, the library uses .lg-hide-items
 * class to hide controls, which conflicts with our visibility requirements.
 * 
 * Solution: Force white color (#ffffff) and override all hide states with !important
 * rules. Use both CSS and JavaScript to ensure maximum compatibility.
 * 
 * Last Updated: 2025-11-27
 */

(function() {
  'use strict';

  // Configuration
  const DEBUG = false; // Set to true for debugging
  const RETRY_DELAYS = [0, 50]; // Milliseconds - reduced for faster response
  const MONITOR_INTERVAL = 200; // ms - reduced frequency

  // State
  let toolbarMonitorInterval = null;
  let buttonObserver = null;
  let rafId = null;

  /**
   * Conditional debug logging
   * Uses global debugLog if available, otherwise falls back to local implementation
   */
  function debugLog(message) {
    if (window.debugLog) {
      window.debugLog('[LightGallery Fix]', message);
    } else if (DEBUG && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      console.log('[LightGallery Fix]', message);
    }
  }

  /**
   * Style an icon element with consistent properties
   */
  function styleIcon(element, options = {}) {
    if (!element) return;

    const defaults = {
      opacity: '1',
      visibility: 'visible',
      display: 'block',
      color: '#ffffff',
      fontFamily: 'lg'
    };

    const styles = { ...defaults, ...options };

    // Remove hide classes
    element.classList.remove('disabled');
    element.classList.add('lg-icon');
    const outer = element.closest('.lg-outer');
    if (outer) {
      outer.classList.remove('lg-hide-items');
    }

    // Apply styles - handle vendor prefixes specially
    Object.keys(styles).forEach(prop => {
      if (prop === 'WebkitTransform') {
        element.style.setProperty('-webkit-transform', styles[prop], 'important');
      } else {
        const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
        element.style.setProperty(cssProp, styles[prop], 'important');
      }
    });

    return element;
  }

  /**
   * Style navigation buttons (prev/next)
   */
  function styleNavButton(btn, isPrev) {
    if (!btn) return;

    // Remove hide classes
    btn.classList.remove('disabled');
    btn.classList.add('lg-icon');
    const outer = btn.closest('.lg-outer');
    if (outer) {
      outer.classList.remove('lg-hide-items');
    }

    // Base styles object
    const baseStyles = {
      opacity: '1',
      visibility: 'visible',
      display: 'block',
      color: '#ffffff',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      fontFamily: 'lg',
      borderRadius: '4px',
      width: '44px',
      height: '44px',
      minWidth: '44px',
      minHeight: '44px',
      fontSize: '22px',
      padding: '8px 10px 9px',
      marginTop: '-10px',
      zIndex: '1085',
      position: 'absolute',
      top: '50%',
      cursor: 'pointer',
      pointerEvents: 'auto',
      border: 'none',
      outline: 'none',
      lineHeight: '1'
    };

    // Apply base styles
    styleIcon(btn, baseStyles);
    
    // Set transform properties directly (vendor prefixes)
    const transformValue = 'translateY(-50%) translate3d(0, 0, 0)';
    btn.style.setProperty('transform', transformValue, 'important');
    btn.style.setProperty('-webkit-transform', transformValue, 'important');
    btn.style.setProperty('-moz-transform', transformValue, 'important');
    btn.style.setProperty('-ms-transform', transformValue, 'important');
    
    // Set position (left for prev, right for next)
    btn.style.setProperty(isPrev ? 'left' : 'right', '20px', 'important');
    if (isPrev) {
      btn.style.removeProperty('right');
    } else {
      btn.style.removeProperty('left');
    }
  }

  /**
   * Force toolbar and all controls to be visible
   */
  function forceToolbarVisible() {
    const container = document.querySelector('.lg-container.lg-show');
    if (!container) {
      debugLog('No container found');
      return;
    }

    debugLog('forceToolbarVisible called');

    // Remove hide-items class from outer
    const outer = container.querySelector('.lg-outer') || document.querySelector('.lg-outer');
    if (outer) {
      outer.classList.remove('lg-hide-items');
      outer.style.setProperty('opacity', '1', 'important');
    }

    // Force toolbar visibility
    const toolbar = container.querySelector('.lg-toolbar') || document.querySelector('.lg-toolbar');
    if (toolbar) {
      debugLog('Toolbar found, forcing visibility');
      toolbar.classList.remove('lg-toolbar-hide');
      toolbar.style.cssText += 'opacity: 1 !important; visibility: visible !important; display: block !important; transform: translate3d(0, 0, 0) !important; -webkit-transform: translate3d(0, 0, 0) !important; z-index: 10001 !important; position: absolute !important; top: 0 !important; left: 0 !important; right: 0 !important; width: 100% !important; background: rgba(0, 0, 0, 0.85) !important;';

      // Style all toolbar icons
      const icons = toolbar.querySelectorAll('.lg-icon');
      for (let i = 0; i < icons.length; i++) {
        styleIcon(icons[i], {
          fontSize: icons[i].classList.contains('lg-rotate-left') || 
                   icons[i].classList.contains('lg-rotate-right') ||
                   icons[i].classList.contains('lg-flip-ver') ||
                   icons[i].classList.contains('lg-flip-hor') ? '22px' : undefined,
          width: icons[i].classList.contains('lg-rotate-left') || 
                 icons[i].classList.contains('lg-rotate-right') ||
                 icons[i].classList.contains('lg-flip-ver') ||
                 icons[i].classList.contains('lg-flip-hor') ? '50px' : undefined,
          height: icons[i].classList.contains('lg-rotate-left') || 
                  icons[i].classList.contains('lg-rotate-right') ||
                  icons[i].classList.contains('lg-flip-ver') ||
                  icons[i].classList.contains('lg-flip-hor') ? '47px' : undefined,
          lineHeight: icons[i].classList.contains('lg-rotate-left') || 
                     icons[i].classList.contains('lg-rotate-right') ||
                     icons[i].classList.contains('lg-flip-ver') ||
                     icons[i].classList.contains('lg-flip-hor') ? '47px' : undefined
        });
      }

      // Force close button
      const closeBtn = toolbar.querySelector('.lg-close') || document.querySelector('.lg-close');
      if (closeBtn) {
        styleIcon(closeBtn, {
          width: '50px',
          height: '47px',
          fontSize: '24px',
          lineHeight: '47px',
          zIndex: '10002'
        });
      }
    }

    // Force actions container
    const actions = container.querySelector('.lg-actions') || document.querySelector('.lg-actions');
    if (actions) {
      actions.style.cssText += 'display: flex !important; opacity: 1 !important; visibility: visible !important;';
      const actionIcons = actions.querySelectorAll('.lg-icon');
      for (let i = 0; i < actionIcons.length; i++) {
        styleIcon(actionIcons[i], { display: 'flex' });
      }
    }

    // Force prev/next buttons
    const prevBtns = document.querySelectorAll('.lg-prev');
    const nextBtns = document.querySelectorAll('.lg-next');
    
    for (let i = 0; i < prevBtns.length; i++) {
      styleNavButton(prevBtns[i], true);
    }
    for (let i = 0; i < nextBtns.length; i++) {
      styleNavButton(nextBtns[i], false);
    }

    // Force counter
    const counter = container.querySelector('.lg-counter') || document.querySelector('.lg-counter');
    if (counter) {
      styleIcon(counter, {
        display: 'inline-block',
        color: '#fff'
      });
    }
  }

  /**
   * Force visibility with retry mechanism
   */
  function forceVisibilityWithRetry() {
    forceToolbarVisible();
    
    // Retry with exponential backoff
    RETRY_DELAYS.forEach((delay, index) => {
      setTimeout(() => {
        forceToolbarVisible();
      }, delay);
    });
  }

  /**
   * Start monitoring toolbar visibility
   */
  function startMonitoring() {
    if (toolbarMonitorInterval) {
      clearInterval(toolbarMonitorInterval);
    }

    toolbarMonitorInterval = setInterval(() => {
      if (document.querySelector('.lg-container.lg-show')) {
        forceToolbarVisible();
      } else {
        stopMonitoring();
      }
    }, MONITOR_INTERVAL);

    // Also use requestAnimationFrame
    function rafForce() {
      if (document.querySelector('.lg-container.lg-show')) {
        forceToolbarVisible();
        rafId = requestAnimationFrame(rafForce);
      } else {
        stopMonitoring();
      }
    }
    rafId = requestAnimationFrame(rafForce);
  }

  /**
   * Stop monitoring toolbar visibility
   */
  function stopMonitoring() {
    if (toolbarMonitorInterval) {
      clearInterval(toolbarMonitorInterval);
      toolbarMonitorInterval = null;
    }
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  /**
   * Start observing for dynamically added buttons
   */
  function startObserving() {
    if (buttonObserver) return;

    buttonObserver = new MutationObserver(() => {
      const prevBtns = document.querySelectorAll('.lg-prev:not([data-lg-styled])');
      const nextBtns = document.querySelectorAll('.lg-next:not([data-lg-styled])');

      prevBtns.forEach(btn => {
        btn.setAttribute('data-lg-styled', 'true');
        styleNavButton(btn, true);
      });

      nextBtns.forEach(btn => {
        btn.setAttribute('data-lg-styled', 'true');
        styleNavButton(btn, false);
      });
    });

    const container = document.querySelector('.lg-container');
    if (container) {
      buttonObserver.observe(container, {
        childList: true,
        subtree: true
      });
    }
  }

  /**
   * Stop observing
   */
  function stopObserving() {
    if (buttonObserver) {
      buttonObserver.disconnect();
      buttonObserver = null;
    }
  }

  /**
   * Handle LightGallery events
   */
  function handleLightGalleryEvent(event) {
    debugLog(event.type + ' fired');
    
    // Debounce rapid events
    clearTimeout(window.lgVisibilityTimeout);
    window.lgVisibilityTimeout = setTimeout(() => {
      forceVisibilityWithRetry();
      startMonitoring();
      
      if (event.type === 'lgAfterOpen') {
        startObserving();
      }
    }, 50);
  }

  /**
   * Initialize event listeners
   */
  function init() {
    // Wait for DOM to be ready
    if (document.body) {
      setupListeners();
    } else {
      document.addEventListener('DOMContentLoaded', setupListeners);
    }
  }

  /**
   * Setup event listeners (only once)
   */
  function setupListeners() {
    // Prevent duplicate listeners
    if (window.lgControlsFixInitialized) {
      debugLog('Listeners already initialized, skipping');
      return;
    }
    window.lgControlsFixInitialized = true;

    // Listen for LightGallery events
    ['lgInit', 'lgAfterOpen', 'lgAfterSlide'].forEach(event => {
      document.addEventListener(event, handleLightGalleryEvent);
    });

    // Clean up on close
    document.addEventListener('lgBeforeClose', () => {
      stopMonitoring();
      stopObserving();
    });
  }

  // Expose function globally for manual calls
  window.forceLightGalleryControlsVisible = function() {
    forceToolbarVisible();
    forceVisibilityWithRetry();
    startMonitoring();
    startObserving();
  };

  // Initialize
  init();

})();
