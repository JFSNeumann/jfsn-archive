/**
 * Art Gallery Fancybox Integration JavaScript
 * Handles Fancybox initialization and configuration with enhanced swipe & keyboard navigation
 */

// Initialize Fancybox for artwork gallery
document.addEventListener('DOMContentLoaded', function() {
  if (window.Fancybox) {
    Fancybox.bind('[data-fancybox="artwork-gallery"]', {
      loop: true,
      
      // Enhanced keyboard navigation
      Keyboard: {
        Escape: "close",
        Delete: "close",
        Backspace: "close",
        PageUp: "next",
        PageDown: "prev",
        ArrowRight: "next",
        ArrowLeft: "prev",
        ArrowUp: "prev",
        ArrowDown: "next",
        r: "rotateCCW",  // Rotate left 90° (counter-clockwise)
        R: "rotateCW"    // Rotate right 90° (clockwise) - with Shift key
      },
      
      // Toolbar configuration
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: ["zoomIn", "zoomOut", "rotateCCW", "rotateCW"],
          right: ["flipX", "flipY", "iterateZoom", "slideshow", "fullscreen", "thumbs", "close"]
        }
      },
      
      // Image settings - Force full-res loading
      Images: {
        zoom: true,
        wheel: "zoom",
        click: "toggleZoom",
        protected: false,
        Panzoom: {
          maxScale: 4
        }
      },
      
      // Thumbnail settings
      Thumbs: {
        autoStart: false,
        hideOnClose: true
      },
      
      // Enhanced carousel with smooth transitions
      Carousel: {
        transition: "slide",
        friction: 0.8,
        preload: 3,
        infinite: true
      },
      
      // Touch/swipe gestures for mobile
      Touch: {
        vertical: true,
        momentum: true,
        drag: true,
        swipe: true
      },
      
      // Animation settings for smooth experience
      animated: true,
      hideScrollbar: true,
      
      // Event handlers for enhanced UX
      on: {
        init: (fancybox) => {
          if (typeof window.DEBUG !== 'undefined' && window.DEBUG) {
          }
          
          // Create progress indicator
          const progressContainer = document.createElement('div');
          progressContainer.className = 'fancybox-progress-indicator';
          progressContainer.innerHTML = `
            <div class="fancybox-progress-bar">
              <div class="fancybox-progress-fill"></div>
            </div>
            <div class="fancybox-progress-text">1 / ${fancybox.count || 1}</div>
          `;
          document.body.appendChild(progressContainer);
          
          // Store reference for updates
          fancybox.progressIndicator = progressContainer;
          fancybox.progressFill = progressContainer.querySelector('.fancybox-progress-fill');
          fancybox.progressText = progressContainer.querySelector('.fancybox-progress-text');
          
          // Initialize double-tap to zoom for mobile
          let lastTap = 0;
          let touchStartTime = 0;
          let touchStartX = 0;
          let touchStartY = 0;
          
          // Global touch handler for double-tap zoom
          const handleDoubleTapZoom = (e) => {
            // Only handle on touch devices
            if (!('ontouchstart' in window)) return;
            
            // Find the active slide
            const activeSlide = fancybox.getSlide();
            if (!activeSlide) return;
            
            // Find image element
            const slideEl = activeSlide.$el;
            if (!slideEl) return;
            
            const img = slideEl.querySelector('img') || slideEl.querySelector('.fancybox__content img');
            if (!img) return;
            
            // Only handle single touch
            if (e.type === 'touchstart' && e.touches.length === 1) {
              touchStartTime = Date.now();
              touchStartX = e.touches[0].clientX;
              touchStartY = e.touches[0].clientY;
            } else if (e.type === 'touchend' && e.changedTouches.length === 1) {
              const touchEndTime = Date.now();
              const touchEndX = e.changedTouches[0].clientX;
              const touchEndY = e.changedTouches[0].clientY;
              
              const timeDiff = touchEndTime - touchStartTime;
              const xDiff = Math.abs(touchEndX - touchStartX);
              const yDiff = Math.abs(touchEndY - touchStartY);
              
              // Detect tap (within 300ms and 30px movement)
              if (timeDiff < 300 && xDiff < 30 && yDiff < 30) {
                const timeSinceLastTap = touchEndTime - lastTap;
                
                if (timeSinceLastTap > 0 && timeSinceLastTap < 400) {
                  // Double-tap detected - zoom toggle
                  e.preventDefault();
                  e.stopPropagation();
                  
                  // Get panzoom instance
                  const panzoom = activeSlide.panzoom;
                  if (panzoom && typeof panzoom.zoomTo === 'function') {
                    const currentScale = panzoom.scale || 1;
                    
                    if (currentScale <= 1.1) {
                      // Zoom in to 2x at tap location
                      const rect = img.getBoundingClientRect();
                      const centerX = (touchEndX - rect.left) / rect.width;
                      const centerY = (touchEndY - rect.top) / rect.height;
                      
                      try {
                        panzoom.zoomTo(2, { x: centerX, y: centerY });
                        
                        // Haptic feedback
                        if (navigator.vibrate) {
                          navigator.vibrate(20);
                        }
                      } catch (err) {
                        if (typeof window.DEBUG !== 'undefined' && window.DEBUG) {
                          console.warn('Zoom in failed:', err);
                        }
                      }
                    } else {
                      // Zoom out
                      try {
                        panzoom.zoomTo(1, { x: 0.5, y: 0.5 });
                        
                        // Haptic feedback
                        if (navigator.vibrate) {
                          navigator.vibrate(10);
                        }
                      } catch (err) {
                        if (typeof window.DEBUG !== 'undefined' && window.DEBUG) {
                          console.warn('Zoom out failed:', err);
                        }
                      }
                    }
                  }
                  
                  lastTap = 0; // Reset to prevent triple-tap
                } else {
                  lastTap = touchEndTime;
                }
              } else {
                lastTap = 0; // Reset if not a tap
              }
            }
          };
          
          // Add global touch listeners to fancybox container
          fancybox.on('reveal', (fancybox, slide) => {
            const container = fancybox.container;
            if (container && 'ontouchstart' in window) {
              // Remove any existing listeners first
              container.removeEventListener('touchstart', handleDoubleTapZoom, { passive: true });
              container.removeEventListener('touchend', handleDoubleTapZoom, { passive: false });
              
              // Add new listeners
              container.addEventListener('touchstart', handleDoubleTapZoom, { passive: true });
              container.addEventListener('touchend', handleDoubleTapZoom, { passive: false });
            }
          });
          
          // Cleanup on close
          fancybox.on('destroy', () => {
            // Remove progress indicator
            if (progressContainer && progressContainer.parentNode) {
              progressContainer.remove();
            }
            
            // Remove touch event listeners
            const container = document.querySelector('.fancybox__container');
            if (container && 'ontouchstart' in window) {
              container.removeEventListener('touchstart', handleDoubleTapZoom);
              container.removeEventListener('touchend', handleDoubleTapZoom);
            }
          });
          
          // Add custom swipe hint for mobile users (shows once)
          if ('ontouchstart' in window && !localStorage.getItem('fancybox-swipe-hint-shown')) {
            setTimeout(() => {
              const hint = document.createElement('div');
              hint.style.cssText = `
                position: fixed;
                bottom: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 12px 24px;
                border-radius: 25px;
                font-size: 14px;
                z-index: 99999;
                pointer-events: none;
                animation: fadeInOut 3s ease-in-out;
              `;
              hint.textContent = '← Swipe to navigate | Double-tap to zoom | Press R to rotate →';
              document.body.appendChild(hint);
              
              setTimeout(() => {
                hint.remove();
              }, 3000);
              
              localStorage.setItem('fancybox-swipe-hint-shown', 'true');
            }, 500);
          }
        },
        
        // Update progress indicator on slide change
        change: (fancybox, slide) => {
          const currentIndex = slide.index + 1;
          const totalCount = fancybox.count || 1;
          const progress = (currentIndex / totalCount) * 100;
          
          // Update progress bar
          if (fancybox.progressFill) {
            fancybox.progressFill.style.width = `${progress}%`;
          }
          
          // Update progress text
          if (fancybox.progressText) {
            fancybox.progressText.textContent = `${currentIndex} / ${totalCount}`;
          }
          
        },
        
        // Smooth reveal animation with debug logging
        reveal: (fancybox, slide) => {
          slide.$el.style.animation = 'fancyboxSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          
          // Debug: Log what Fancybox is trying to load
          const trigger = slide.trigger;
            href: trigger?.href,
            dataSrc: trigger?.getAttribute('data-src'),
            dataThumb: trigger?.getAttribute('data-thumb'),
            slideType: slide.type,
            slideSrc: slide.src,
            hasImage: !!slide.$image
          });
          
          // If no src found, force it from data-src or href
          if (!slide.src && trigger) {
            const forcedSrc = trigger.getAttribute('data-src') || trigger.href;
            if (forcedSrc) {
              slide.src = forcedSrc;
              slide.type = 'image';
            }
          }
        },
        
        // Debug: Log when image successfully loads
        done: (fancybox, slide) => {
          if (slide.$image) {
              src: slide.src,
              naturalWidth: slide.$image.naturalWidth,
              naturalHeight: slide.$image.naturalHeight,
              displayWidth: slide.$image.width,
              displayHeight: slide.$image.height
            });
          } else {
            console.error('❌ No image element found in slide!', {
              type: slide.type,
              src: slide.src,
              hasContent: !!slide.$content
            });
          }
        },
        
        // Catch loading errors
        error: (fancybox, slide) => {
          console.error('❌ Fancybox error loading:', {
            src: slide.src,
            error: slide.error
          });
        }
      }
    });
    
    // Add custom CSS for slide animations and progress indicator
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fancyboxSlideIn {
        from {
          opacity: 0;
          transform: scale(0.95) translateY(20px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      
      /* Progress Indicator */
      .fancybox-progress-indicator {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 99998;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }
      
      .fancybox-progress-bar {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        position: relative;
        overflow: hidden;
      }
      
      .fancybox-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #6366f1, #818cf8, #a78bfa);
        width: 0%;
        transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 0 10px rgba(99, 102, 241, 0.6);
      }
      
      .fancybox-progress-text {
        position: absolute;
        top: 12px;
        right: 20px;
        background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        color: rgba(255, 255, 255, 0.9);
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        letter-spacing: 0.5px;
        border: 1px solid rgba(99, 102, 241, 0.3);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
      
      /* Mobile adjustments for progress indicator */
      @media (max-width: 768px) {
        .fancybox-progress-text {
          top: 8px;
          right: 12px;
          font-size: 12px;
          padding: 5px 10px;
        }
        
        .fancybox-progress-bar {
          height: 3px;
        }
      }
      
      /* Enhanced mobile touch targets */
      .fancybox__nav button {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }
      
      /* Smoother transitions on mobile */
      @media (max-width: 768px) {
        .fancybox__carousel {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        .fancybox__toolbar {
          padding: 8px;
        }
        
        .fancybox__toolbar button {
          width: 44px;
          height: 44px;
          min-width: 44px;
          min-height: 44px;
        }
        
        /* Better touch handling for double-tap zoom */
        .fancybox__content img {
          touch-action: pan-x pan-y pinch-zoom;
          -webkit-user-select: none;
          user-select: none;
        }
      }
    `;
    document.head.appendChild(style);
    
    if (typeof window.DEBUG !== 'undefined' && window.DEBUG) {
    }
  } else {
    if (typeof window.DEBUG !== 'undefined' && window.DEBUG) {
      console.warn('⚠️ Fancybox library not loaded');
    }
  }
});
