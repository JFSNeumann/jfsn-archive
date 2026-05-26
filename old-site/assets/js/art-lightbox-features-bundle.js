/**
 * LightGallery Autoplay Button
 * 
 * Adds a custom autoplay toggle button to the LightGallery slideshow.
 */

(function() {
  'use strict';

  let autoplayButton = null;
  let isAutoplayActive = false;
  let lightGalleryInstance = null;

  function createAutoplayButton() {
    // Remove existing button if any
    if (autoplayButton) {
      autoplayButton.remove();
    }

    // Create button
    autoplayButton = document.createElement('button');
    autoplayButton.className = 'lg-autoplay-toggle-btn';
    autoplayButton.setAttribute('aria-label', 'Toggle autoplay slideshow');
    autoplayButton.setAttribute('title', 'Toggle autoplay slideshow');
    autoplayButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3"></circle>
      </svg>
      <span class="lg-autoplay-label">Play</span>
    `;

    // Add click handler
    autoplayButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleAutoplay();
    });

    return autoplayButton;
  }

  function toggleAutoplay() {
    // Try to get instance if not set
    if (!lightGalleryInstance) {
      lightGalleryInstance = window.lightGalleryInstance;
    }
    
    // If still no instance, try to find it from DOM
    if (!lightGalleryInstance) {
      const lgContainer = document.querySelector('.lg-container.lg-show');
      if (lgContainer && lgContainer.lightGallery) {
        lightGalleryInstance = lgContainer.lightGallery;
      }
    }

    if (!lightGalleryInstance) {
      console.warn('LightGallery instance not available, using fallback');
      // Use fallback manual autoplay
      if (isAutoplayActive) {
        if (window.lgAutoplayInterval) {
          clearInterval(window.lgAutoplayInterval);
          window.lgAutoplayInterval = null;
        }
        isAutoplayActive = false;
        updateButtonState(false);
        console.log('⏸️ Autoplay stopped (fallback)');
      } else {
        startManualAutoplay();
        isAutoplayActive = true;
        updateButtonState(true);
        console.log('▶️ Autoplay started (fallback)');
      }
      return;
    }

    try {
      // Get the autoplay plugin instance
      const autoplayPlugin = lightGalleryInstance.modules?.autoplay;
      
      if (autoplayPlugin) {
        if (isAutoplayActive) {
          // Stop autoplay
          if (typeof autoplayPlugin.stop === 'function') {
            autoplayPlugin.stop();
          } else if (typeof autoplayPlugin.pause === 'function') {
            autoplayPlugin.pause();
          }
          isAutoplayActive = false;
          updateButtonState(false);
          console.log('⏸️ Autoplay stopped');
        } else {
          // Start autoplay
          if (typeof autoplayPlugin.start === 'function') {
            autoplayPlugin.start();
          } else if (typeof autoplayPlugin.play === 'function') {
            autoplayPlugin.play();
          }
          isAutoplayActive = true;
          updateButtonState(true);
          console.log('▶️ Autoplay started');
        }
      } else {
        // Fallback: manually trigger slide changes
        if (isAutoplayActive) {
          // Stop interval if running
          if (window.lgAutoplayInterval) {
            clearInterval(window.lgAutoplayInterval);
            window.lgAutoplayInterval = null;
          }
          isAutoplayActive = false;
          updateButtonState(false);
          console.log('⏸️ Autoplay stopped (fallback - no plugin)');
        } else {
          // Start manual autoplay
          startManualAutoplay();
          isAutoplayActive = true;
          updateButtonState(true);
          console.log('▶️ Autoplay started (fallback - no plugin)');
        }
      }
    } catch (error) {
      console.error('Error toggling autoplay:', error);
      // Fallback to manual autoplay
      if (!isAutoplayActive) {
        startManualAutoplay();
        isAutoplayActive = true;
        updateButtonState(true);
      } else {
        if (window.lgAutoplayInterval) {
          clearInterval(window.lgAutoplayInterval);
          window.lgAutoplayInterval = null;
        }
        isAutoplayActive = false;
        updateButtonState(false);
      }
    }
  }

  function startManualAutoplay() {
    // Clear any existing interval
    if (window.lgAutoplayInterval) {
      clearInterval(window.lgAutoplayInterval);
    }

    // Try to get instance if not set
    if (!lightGalleryInstance) {
      lightGalleryInstance = window.lightGalleryInstance;
    }

    // Start autoplay - advance slide every 5 seconds
    window.lgAutoplayInterval = setInterval(() => {
      if (!isAutoplayActive) {
        clearInterval(window.lgAutoplayInterval);
        window.lgAutoplayInterval = null;
        return;
      }

      try {
        // Try to get instance again
        if (!lightGalleryInstance) {
          lightGalleryInstance = window.lightGalleryInstance;
        }
        
        // Try to get from DOM
        if (!lightGalleryInstance) {
          const lgContainer = document.querySelector('.lg-container.lg-show');
          if (lgContainer && lgContainer.lightGallery) {
            lightGalleryInstance = lgContainer.lightGallery;
          }
        }

        if (lightGalleryInstance) {
          // Get current index
          const currentIndex = lightGalleryInstance.index || 0;
          const totalSlides = lightGalleryInstance.galleryItems?.length || 0;
          
          if (totalSlides > 0) {
            // Move to next slide
            const nextIndex = (currentIndex + 1) % totalSlides;
            if (typeof lightGalleryInstance.slide === 'function') {
              lightGalleryInstance.slide(nextIndex, false, false);
            } else {
              // Fallback: trigger next button click
              const nextBtn = document.querySelector('.lg-next');
              if (nextBtn) {
                nextBtn.click();
              }
            }
          }
        } else {
          // Fallback: trigger next button click
          const nextBtn = document.querySelector('.lg-next');
          if (nextBtn) {
            nextBtn.click();
          } else {
            console.warn('Cannot advance slide - no instance or next button');
            clearInterval(window.lgAutoplayInterval);
            window.lgAutoplayInterval = null;
            isAutoplayActive = false;
            updateButtonState(false);
          }
        }
      } catch (error) {
        console.error('Error in manual autoplay:', error);
        clearInterval(window.lgAutoplayInterval);
        window.lgAutoplayInterval = null;
        isAutoplayActive = false;
        updateButtonState(false);
      }
    }, 5000); // 5 second interval
  }

  function updateButtonState(isPlaying) {
    if (!autoplayButton) return;

    isAutoplayActive = isPlaying;
    
    if (isPlaying) {
      autoplayButton.classList.add('lg-autoplay-active');
      autoplayButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
        <span class="lg-autoplay-label">Pause</span>
      `;
      autoplayButton.setAttribute('aria-label', 'Pause autoplay');
      autoplayButton.setAttribute('title', 'Pause autoplay');
    } else {
      autoplayButton.classList.remove('lg-autoplay-active');
      autoplayButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
          <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3"></circle>
        </svg>
        <span class="lg-autoplay-label">Play</span>
      `;
      autoplayButton.setAttribute('aria-label', 'Start autoplay');
      autoplayButton.setAttribute('title', 'Start autoplay');
    }
  }

  function insertAutoplayButton() {
    const toolbar = document.querySelector('.lg-toolbar');
    if (!toolbar) {
      console.warn('⚠️ Toolbar not found');
      return;
    }
    
    if (toolbar.querySelector('.lg-autoplay-toggle-btn')) {
      console.log('✅ Autoplay button already exists');
      return;
    }
    
    const button = createAutoplayButton();
    
    // Try to insert into actions container first (where other buttons are)
    const actionsContainer = toolbar.querySelector('.lg-actions');
    if (actionsContainer) {
      // Insert before the close button in actions
      const closeBtn = actionsContainer.querySelector('.lg-close');
      if (closeBtn) {
        actionsContainer.insertBefore(button, closeBtn);
      } else {
        actionsContainer.appendChild(button);
      }
    } else {
      // Fallback: insert directly into toolbar before close button
      const closeBtn = toolbar.querySelector('.lg-close');
      if (closeBtn) {
        toolbar.insertBefore(button, closeBtn);
      } else {
        toolbar.appendChild(button);
      }
    }
    
    console.log('✅ Autoplay button added to toolbar', { toolbar: !!toolbar, button: !!button, actions: !!actionsContainer });
  }

  // Listen for LightGallery initialization
  document.addEventListener('lgInit', function(e) {
    lightGalleryInstance = e.detail.instance || e.detail.instance || window.lightGalleryInstance;
    if (!lightGalleryInstance && e.detail) {
      lightGalleryInstance = e.detail.instance;
    }
    // Also try to get from window
    if (!lightGalleryInstance) {
      lightGalleryInstance = window.lightGalleryInstance;
    }
    console.log('🎬 LightGallery initialized', { instance: !!lightGalleryInstance });
    
    setTimeout(() => {
      insertAutoplayButton();
    }, 100);
  });

  // Listen for gallery open
  document.addEventListener('lgAfterOpen', function(e) {
    // Try to get instance from event or window
    if (!lightGalleryInstance) {
      lightGalleryInstance = e.detail?.instance || window.lightGalleryInstance;
    }
    
    setTimeout(() => {
      insertAutoplayButton();
      isAutoplayActive = false;
      updateButtonState(false);
    }, 200);
  });

  // Listen for autoplay events
  document.addEventListener('lgAutoplayStart', function() {
    isAutoplayActive = true;
    updateButtonState(true);
  });

  document.addEventListener('lgAutoplayStop', function() {
    isAutoplayActive = false;
    updateButtonState(false);
  });

  // Watch for toolbar creation
  const toolbarObserver = new MutationObserver(function(mutations) {
    const toolbar = document.querySelector('.lg-toolbar');
    if (toolbar && !toolbar.querySelector('.lg-autoplay-toggle-btn')) {
      insertAutoplayButton();
    }
  });

  toolbarObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Clean up on gallery close
  document.addEventListener('lgAfterClose', function() {
    isAutoplayActive = false;
    if (window.lgAutoplayInterval) {
      clearInterval(window.lgAutoplayInterval);
      window.lgAutoplayInterval = null;
    }
  });

  // Clean up on page unload
  window.addEventListener('beforeunload', function() {
    if (window.lgAutoplayInterval) {
      clearInterval(window.lgAutoplayInterval);
      window.lgAutoplayInterval = null;
    }
  });

})();

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
/**
 * Lightbox Info Panel Toggle
 * Works with LightGallery and Fancybox
 * Shows all content in .lg-sub-html and hides it when clicking on the image
 */

(function() {
  'use strict';

  let infoPanelHidden = false;

  function hideInfoPanel() {
    // LightGallery
    const lgSubHtml = document.querySelector('.lg-sub-html');
    if (lgSubHtml) {
      lgSubHtml.classList.add('lg-info-hidden');
      infoPanelHidden = true;
      console.log('✅ LightGallery info panel hidden');
    }

    // Fancybox (if used)
    const fancyboxCaption = document.querySelector('.fancybox-caption, .fancybox__caption');
    if (fancyboxCaption) {
      fancyboxCaption.style.display = 'none';
      fancyboxCaption.style.visibility = 'hidden';
      fancyboxCaption.style.opacity = '0';
      console.log('✅ Fancybox caption hidden');
    }
  }

  function showInfoPanel() {
    // LightGallery
    const lgSubHtml = document.querySelector('.lg-sub-html');
    if (lgSubHtml) {
      lgSubHtml.classList.remove('lg-info-hidden');
      infoPanelHidden = false;
      console.log('✅ LightGallery info panel shown');
    }

    // Fancybox (if used)
    const fancyboxCaption = document.querySelector('.fancybox-caption, .fancybox__caption');
    if (fancyboxCaption) {
      fancyboxCaption.style.display = '';
      fancyboxCaption.style.visibility = '';
      fancyboxCaption.style.opacity = '';
      console.log('✅ Fancybox caption shown');
    }
  }

  function handleImageClick(e) {
    // Check if we're inside LightGallery
    const lgContainer = document.querySelector('.lg-container.lg-show');
    const fancyboxContainer = document.querySelector('.fancybox-container, .fancybox__container');
    
    if (!lgContainer && !fancyboxContainer) {
      return;
    }

    const container = lgContainer || fancyboxContainer;
    if (!container.contains(e.target)) {
      return;
    }

    // Don't hide if clicking on controls or info panel itself
    if (e.target.closest('.lg-close') || 
        e.target.closest('.lg-prev') || 
        e.target.closest('.lg-next') ||
        e.target.closest('.lg-toolbar') ||
        e.target.closest('.lg-thumb-outer') ||
        e.target.closest('.lg-sub-html') ||
        e.target.closest('.lg-counter') ||
        e.target.closest('.lg-autoplay-button') ||
        e.target.closest('.fancybox-button') ||
        e.target.closest('.fancybox__button') ||
        e.target.closest('.fancybox-caption') ||
        e.target.closest('.fancybox__caption') ||
        e.target.closest('button') ||
        e.target.closest('a[href]')) {
      return;
    }

    // Check if clicking on ANY image element (more comprehensive)
    const isImage = e.target.tagName === 'IMG' || 
                    e.target.tagName === 'PICTURE' ||
                    e.target.closest('img') ||
                    e.target.closest('picture') ||
                    e.target.closest('.lg-image') ||
                    e.target.closest('.lg-img-wrap') ||
                    e.target.closest('.lg-item') ||
                    e.target.closest('.lg-content') ||
                    e.target.closest('.fancybox-image') ||
                    e.target.closest('.fancybox__image') ||
                    e.target.closest('.fancybox-content');
    
    if (isImage && !infoPanelHidden) {
      console.log('🖱️ Image clicked - hiding info panel');
      hideInfoPanel();
    }
  }

  // Set up click handler
  document.addEventListener('click', handleImageClick, true);

  // LightGallery Events
  document.addEventListener('lgAfterOpen', function() {
    showInfoPanel();
    console.log('🎬 LightGallery opened - info panel visible');
  });

  document.addEventListener('lgAfterSlide', function() {
    showInfoPanel();
    console.log('🔄 LightGallery slide changed - info panel visible');
  });

  document.addEventListener('lgAfterAppendSubHtml', function() {
    showInfoPanel();
    console.log('📝 LightGallery sub-html appended - info panel visible');
  });

  document.addEventListener('lgAfterClose', function() {
    infoPanelHidden = false;
    console.log('🚪 LightGallery closed');
  });

  // Fancybox Events (if Fancybox is used)
  document.addEventListener('fancybox:ready', function() {
    showInfoPanel();
    console.log('🎬 Fancybox opened - caption visible');
  });

  document.addEventListener('fancybox:slide', function() {
    showInfoPanel();
    console.log('🔄 Fancybox slide changed - caption visible');
  });

  document.addEventListener('fancybox:close', function() {
    infoPanelHidden = false;
    console.log('🚪 Fancybox closed');
  });

  // Also listen for Fancybox v5 events
  document.addEventListener('fancybox5:ready', function() {
    showInfoPanel();
    console.log('🎬 Fancybox5 opened - caption visible');
  });

  document.addEventListener('fancybox5:slide', function() {
    showInfoPanel();
    console.log('🔄 Fancybox5 slide changed - caption visible');
  });

  document.addEventListener('fancybox5:close', function() {
    infoPanelHidden = false;
    console.log('🚪 Fancybox5 closed');
  });

})();
