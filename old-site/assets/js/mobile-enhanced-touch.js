/**
 * Enhanced Mobile Touch Interactions
 * Haptic feedback, enhanced touch states, long press, swipe gestures
 */

(function() {
  'use strict';

  const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
  if (!isMobile) return;

  // ===== HAPTIC FEEDBACK =====
  const haptic = {
    light: () => {
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    },
    medium: () => {
      if ('vibrate' in navigator) {
        navigator.vibrate(20);
      }
    },
    heavy: () => {
      if ('vibrate' in navigator) {
        navigator.vibrate(30);
      }
    },
    pattern: (pattern) => {
      if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    }
  };

  // ===== ENHANCED TOUCH FEEDBACK =====
  function setupTouchFeedback() {
    const touchTargets = document.querySelectorAll(
      'button, .btn, .nav-link, .artwork-card, .category-card, a[role="button"], .touch-target'
    );

    touchTargets.forEach(element => {
      element.addEventListener('touchstart', handleTouchStart, { passive: true });
      element.addEventListener('touchend', handleTouchEnd, { passive: true });
      element.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    });
  }

  function handleTouchStart(e) {
    const element = e.currentTarget;
    element.classList.add('touch-active');
    haptic.light();
  }

  function handleTouchEnd(e) {
    const element = e.currentTarget;
    setTimeout(() => {
      element.classList.remove('touch-active');
    }, 150);
  }

  // ===== LONG PRESS DETECTION =====
  function setupLongPress() {
    let pressTimer = null;
    const longPressTargets = document.querySelectorAll('.artwork-card, .category-card, [data-long-press]');

    longPressTargets.forEach(element => {
      element.addEventListener('touchstart', (e) => {
        pressTimer = setTimeout(() => {
          element.classList.add('long-press-active');
          haptic.medium();
          
          // Trigger long press event
          const event = new CustomEvent('longpress', {
            bubbles: true,
            detail: { element }
          });
          element.dispatchEvent(event);
        }, 500);
      }, { passive: true });

      element.addEventListener('touchend', () => {
        clearTimeout(pressTimer);
        element.classList.remove('long-press-active');
      }, { passive: true });

      element.addEventListener('touchmove', () => {
        clearTimeout(pressTimer);
        element.classList.remove('long-press-active');
      }, { passive: true });
    });
  }

  // ===== SWIPE GESTURES =====
  function setupSwipeGestures() {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let isSwiping = false;
    const threshold = 50;
    const restraint = 100;
    const allowedTime = 500;

    const swipeIndicator = createSwipeIndicator();

    document.addEventListener('touchstart', (e) => {
      // Ignore if target is interactive
      if (e.target.closest('button, a, input, textarea, select')) return;
      
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
      isSwiping = false;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!startX || !startY) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - startX;
      const diffY = currentY - startY;

      // Check if horizontal swipe
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
        isSwiping = true;
        
        // Show indicator
        if (diffX > 0) {
          swipeIndicator.textContent = '←';
          swipeIndicator.className = 'swipe-indicator left show';
        } else {
          swipeIndicator.textContent = '→';
          swipeIndicator.className = 'swipe-indicator right show';
        }
        
        swipeIndicator.style.opacity = Math.min(Math.abs(diffX) / 150, 1);
      }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const elapsedTime = Date.now() - startTime;
      
      const diffX = endX - startX;
      const diffY = endY - startY;

      // Hide indicator
      swipeIndicator.classList.remove('show');

      // Check if valid swipe
      if (elapsedTime <= allowedTime && 
          Math.abs(diffX) >= threshold && 
          Math.abs(diffY) <= restraint) {
        
        haptic.medium();
        
        if (diffX > 0) {
          // Swipe right - go back
          handleSwipeRight();
        } else {
          // Swipe left - go forward
          handleSwipeLeft();
        }
      }

      // Reset
      startX = 0;
      startY = 0;
      isSwiping = false;
    }, { passive: true });
  }

  function createSwipeIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'swipe-indicator';
    document.body.appendChild(indicator);
    return indicator;
  }

  function handleSwipeLeft() {
    // Navigate forward if possible
    const nextLink = document.querySelector('[rel="next"]');
    if (nextLink) {
      window.location.href = nextLink.href;
    } else {
      // Custom action or do nothing
    }
  }

  function handleSwipeRight() {
    // Navigate back if possible
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Custom action or do nothing
    }
  }

  // ===== PULL TO REFRESH =====
  function setupPullToRefresh() {
    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    const threshold = 80;
    const indicator = createPullToRefreshIndicator();

    document.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (startY === 0) return;
      
      currentY = e.touches[0].clientY;
      const diffY = currentY - startY;

      if (diffY > 0 && window.scrollY === 0) {
        isPulling = true;
        e.preventDefault();
        
        const progress = Math.min(diffY / threshold, 1);
        indicator.style.opacity = progress;
        
        if (diffY >= threshold) {
          indicator.classList.add('show');
        } else {
          indicator.classList.remove('show');
        }
      }
    }, { passive: false });

    document.addEventListener('touchend', () => {
      if (isPulling && currentY - startY >= threshold) {
        haptic.heavy();
        indicator.classList.add('show');
        
        // Refresh page
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        indicator.classList.remove('show');
        indicator.style.opacity = '0';
      }
      
      startY = 0;
      currentY = 0;
      isPulling = false;
    }, { passive: true });
  }

  function createPullToRefreshIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'pull-to-refresh-indicator';
    indicator.innerHTML = '<div class="spinner"></div><span>Refreshing...</span>';
    document.body.appendChild(indicator);
    return indicator;
  }

  // ===== DOUBLE TAP TO ZOOM (for images) =====
  function setupDoubleTapZoom() {
    let lastTap = 0;
    const images = document.querySelectorAll('.artwork-card img, .gallery img');

    images.forEach(img => {
      img.addEventListener('touchend', (e) => {
        const currentTime = Date.now();
        const tapLength = currentTime - lastTap;

        if (tapLength < 300 && tapLength > 0) {
          // Double tap detected
          e.preventDefault();
          haptic.medium();
          
          if (img.style.transform === 'scale(2)') {
            img.style.transform = 'scale(1)';
            img.style.transition = 'transform 0.3s ease';
          } else {
            img.style.transform = 'scale(2)';
            img.style.transition = 'transform 0.3s ease';
          }
        }

        lastTap = currentTime;
      }, { passive: false });
    });
  }

  // ===== INITIALIZE =====
  function init() {
    if (!isMobile) return;
    
    setupTouchFeedback();
    setupLongPress();
    setupSwipeGestures();
    setupPullToRefresh();
    setupDoubleTapZoom();
    
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for debugging
  window.mobileTouch = {
    haptic,
    isMobile
  };

})();

