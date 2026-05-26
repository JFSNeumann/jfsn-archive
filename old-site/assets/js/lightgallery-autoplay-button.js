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

