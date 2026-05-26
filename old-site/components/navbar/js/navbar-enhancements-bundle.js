/* =========================================== */
/* NAVBAR ENHANCEMENTS BUNDLE (JavaScript) */
/* Generated: 2025-12-04T02:50:22.391Z */
/* Combines 7 navbar enhancement JS files */
/* =========================================== */

/* =========================================== */
/* 1. components/navbar/js/navbar-focus-trap.js */
/* =========================================== */

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



/* =========================================== */
/* 2. components/navbar/js/navbar-lazy-load.js */
/* =========================================== */

/**
 * LAZY LOAD MENU ITEMS
 * Load menu content progressively for better performance
 */

(function() {
  'use strict';
  
  function lazyLoadMenuItems() {
    const menu = document.querySelector('.editorial-nav-overlay-menu');
    if (!menu) return;
    
    const menuItems = menu.querySelectorAll('li');
    const observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          
          // Add loaded class
          item.classList.add('menu-item-loaded');
          
          // Load icon if not already loaded
          const icon = item.querySelector('i');
          if (icon && !icon.classList.contains('loaded')) {
            icon.classList.add('loaded');
            // Trigger icon animation
            setTimeout(() => {
              icon.style.opacity = '1';
              icon.style.transform = 'scale(1)';
            }, 100);
          }
          
          // Load link text
          const link = item.querySelector('a');
          if (link && !link.classList.contains('loaded')) {
            link.classList.add('loaded');
            setTimeout(() => {
              link.style.opacity = '1';
              link.style.transform = 'translateX(0)';
            }, 150);
          }
          
          // Unobserve after loading
          observer.unobserve(item);
        }
      });
    }, observerOptions);
    
    // Observe all menu items
    menuItems.forEach(item => {
      // Set initial state
      item.style.opacity = '0';
      item.style.transform = 'translateY(10px)';
      item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      const icon = item.querySelector('i');
      if (icon) {
        icon.style.opacity = '0';
        icon.style.transform = 'scale(0.8)';
        icon.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      }
      
      const link = item.querySelector('a');
      if (link) {
        link.style.opacity = '0';
        link.style.transform = 'translateX(-10px)';
        link.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      }
      
      observer.observe(item);
    });
  }
  
  // Initialize when overlay opens
  function initLazyLoad() {
    const overlay = document.getElementById('editorialNavOverlay');
    if (!overlay) return;
    
    // Watch for overlay opening
    const overlayObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (overlay.classList.contains('active')) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
              lazyLoadMenuItems();
            }, 100);
          }
        }
      });
    });
    
    overlayObserver.observe(overlay, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    // Also check if overlay is already open
    if (overlay.classList.contains('active')) {
      setTimeout(() => {
        lazyLoadMenuItems();
      }, 100);
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoad);
  } else {
    initLazyLoad();
  }
  
  // Expose globally
  window.navbarLazyLoad = {
    init: initLazyLoad,
    loadItems: lazyLoadMenuItems
  };
  
})();



/* =========================================== */
/* 3. components/navbar/js/navbar-swipe-gestures.js */
/* =========================================== */

/**
 * SWIPE GESTURES FOR NAVBAR OVERLAY
 * Swipe to open/close overlay on mobile devices
 */

(function() {
  'use strict';
  
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let minSwipeDistance = 50;
  let maxVerticalDistance = 100; // Prevent vertical scrolling from triggering swipe
  
  function initSwipeGestures() {
    const overlay = document.getElementById('editorialNavOverlay');
    const toggle = document.getElementById('editorialNavToggle');
    
    if (!overlay) return;
    
    // Swipe right from left edge to open
    document.addEventListener('touchstart', function(e) {
      // Only trigger from left edge (first 20px)
      if (e.touches[0].clientX < 20 && !overlay.classList.contains('active')) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
      if (touchStartX === 0) return;
      
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = Math.abs(touchEndY - touchStartY);
      
      // Swipe right to open
      if (deltaX > minSwipeDistance && deltaY < maxVerticalDistance && !overlay.classList.contains('active')) {
        if (typeof window.toggleNavbarOverlay === 'function') {
          window.toggleNavbarOverlay();
        } else if (toggle) {
          toggle.click();
        }
      }
      
      touchStartX = 0;
      touchStartY = 0;
    }, { passive: true });
    
    // Swipe left to close when overlay is open
    overlay.addEventListener('touchstart', function(e) {
      if (overlay.classList.contains('active')) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });
    
    overlay.addEventListener('touchend', function(e) {
      if (!overlay.classList.contains('active') || touchStartX === 0) return;
      
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchStartX - touchEndX; // Negative for left swipe
      const deltaY = Math.abs(touchEndY - touchStartY);
      
      // Swipe left to close
      if (deltaX > minSwipeDistance && deltaY < maxVerticalDistance) {
        if (typeof window.toggleNavbarOverlay === 'function') {
          window.toggleNavbarOverlay();
        } else {
          const closeBtn = document.getElementById('editorialNavClose');
          if (closeBtn) {
            closeBtn.click();
          }
        }
      }
      
      touchStartX = 0;
      touchStartY = 0;
    }, { passive: true });
    
    // Visual feedback during swipe
    let currentSwipeX = 0;
    overlay.addEventListener('touchmove', function(e) {
      if (!overlay.classList.contains('active')) return;
      
      currentSwipeX = e.touches[0].clientX;
      const deltaX = touchStartX - currentSwipeX;
      
      // Only apply visual feedback for left swipes
      if (deltaX > 0 && deltaX < 300) {
        const content = overlay.querySelector('.editorial-nav-overlay-content');
        if (content) {
          const translateX = Math.max(0, -deltaX);
          content.style.transform = `translateX(${translateX}px)`;
          overlay.style.opacity = String(1 - (deltaX / 300));
        }
      }
    }, { passive: true });
    
    // Reset transform on touch end
    overlay.addEventListener('touchend', function() {
      const content = overlay.querySelector('.editorial-nav-overlay-content');
      if (content) {
        content.style.transform = '';
        overlay.style.opacity = '';
      }
    }, { passive: true });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwipeGestures);
  } else {
    // Wait for navbar to load
    setTimeout(initSwipeGestures, 500);
  }
  
  // Re-initialize if navbar is loaded dynamically
  const observer = new MutationObserver(() => {
    const overlay = document.getElementById('editorialNavOverlay');
    if (overlay && !overlay.hasAttribute('data-swipe-initialized')) {
      overlay.setAttribute('data-swipe-initialized', 'true');
      initSwipeGestures();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Expose globally
  window.navbarSwipeGestures = {
    init: initSwipeGestures
  };
  
})();



/* =========================================== */
/* 4. components/navbar/js/navbar-haptic-feedback.js */
/* =========================================== */

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



/* =========================================== */
/* 5. components/navbar/js/navbar-pull-to-refresh.js */
/* =========================================== */

/**
 * PULL-TO-REFRESH INTEGRATION
 * Pull down to refresh page from navbar area
 */

(function() {
  'use strict';
  
  let pullStartY = 0;
  let pullCurrentY = 0;
  let pullDistance = 0;
  let isPulling = false;
  let pullThreshold = 80;
  let maxPullDistance = 120;
  
  function initPullToRefresh() {
    const navbar = document.querySelector('.editorial-navbar');
    if (!navbar) return;
    
    // Only enable on mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) return;
    
    // Only enable when at top of page
    function isAtTop() {
      return window.scrollY === 0 || window.pageYOffset === 0;
    }
    
    // Create pull indicator
    const pullIndicator = document.createElement('div');
    pullIndicator.className = 'navbar-pull-indicator';
    pullIndicator.innerHTML = '<i class="bx bx-refresh"></i><span>Pull to refresh</span>';
    pullIndicator.style.cssText = `
      position: fixed;
      top: -60px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(99, 102, 241, 0.95);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0 0 12px 12px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      z-index: 10001;
      transition: top 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    document.body.appendChild(pullIndicator);
    
    // Touch start
    document.addEventListener('touchstart', function(e) {
      if (!isAtTop()) return;
      
      pullStartY = e.touches[0].clientY;
      isPulling = true;
    }, { passive: true });
    
    // Touch move
    document.addEventListener('touchmove', function(e) {
      if (!isPulling || !isAtTop()) return;
      
      pullCurrentY = e.touches[0].clientY;
      pullDistance = Math.max(0, pullCurrentY - pullStartY);
      
      if (pullDistance > 0 && pullDistance <= maxPullDistance) {
        // Show indicator
        const progress = Math.min(pullDistance / pullThreshold, 1);
        pullIndicator.style.top = `${-60 + (pullDistance * 0.5)}px`;
        pullIndicator.style.opacity = String(progress);
        
        // Rotate icon
        const icon = pullIndicator.querySelector('i');
        if (icon) {
          icon.style.transform = `rotate(${pullDistance * 3}deg)`;
        }
        
        // Update text
        const text = pullIndicator.querySelector('span');
        if (text) {
          if (pullDistance >= pullThreshold) {
            text.textContent = 'Release to refresh';
            pullIndicator.style.background = 'rgba(99, 102, 241, 1)';
          } else {
            text.textContent = 'Pull to refresh';
            pullIndicator.style.background = 'rgba(99, 102, 241, 0.95)';
          }
        }
        
        // Prevent default scrolling if pulling
        if (pullDistance > 10) {
          e.preventDefault();
        }
      }
    }, { passive: false });
    
    // Touch end
    document.addEventListener('touchend', function() {
      if (!isPulling) return;
      
      isPulling = false;
      
      if (pullDistance >= pullThreshold) {
        // Trigger refresh
        pullIndicator.querySelector('i').style.animation = 'spin 1s linear infinite';
        pullIndicator.querySelector('span').textContent = 'Refreshing...';
        
        // Reload page
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        // Reset indicator
        pullIndicator.style.top = '-60px';
        pullIndicator.style.opacity = '0';
        pullIndicator.querySelector('i').style.transform = 'rotate(0deg)';
        pullIndicator.style.background = 'rgba(99, 102, 241, 0.95)';
      }
      
      pullDistance = 0;
      pullStartY = 0;
      pullCurrentY = 0;
    }, { passive: true });
    
    // Add spin animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPullToRefresh);
  } else {
    setTimeout(initPullToRefresh, 500);
  }
  
  // Expose globally
  window.navbarPullToRefresh = {
    init: initPullToRefresh
  };
  
})();



/* =========================================== */
/* 6. components/navbar/js/navbar-page-transitions.js */
/* =========================================== */

/**
 * SMOOTH PAGE TRANSITIONS
 * Navbar coordinates with page transitions
 */

(function() {
  'use strict';
  
  function initPageTransitions() {
    // Intercept link clicks
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (!link) return;
      
      // Only handle internal links
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }
      
      // Check if it's a same-origin link
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) {
          return; // External link, don't intercept
        }
      } catch (e) {
        // Relative URL, proceed
      }
      
      // Don't intercept if modifier keys are pressed
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
        return;
      }
      
      // Add transitioning class
      document.documentElement.classList.add('transitioning');
      
      // Remove transitioning and add transitioned after delay
      setTimeout(() => {
        document.documentElement.classList.remove('transitioning');
        document.documentElement.classList.add('transitioned');
        
        // Remove transitioned class after animation
        setTimeout(() => {
          document.documentElement.classList.remove('transitioned');
        }, 400);
      }, 100);
    }, true);
    
    // Handle browser back/forward
    window.addEventListener('popstate', function() {
      document.documentElement.classList.add('transitioned');
      setTimeout(() => {
        document.documentElement.classList.remove('transitioned');
      }, 400);
    });
    
    // Initial load
    document.documentElement.classList.add('transitioned');
    setTimeout(() => {
      document.documentElement.classList.remove('transitioned');
    }, 400);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageTransitions);
  } else {
    initPageTransitions();
  }
  
  // Expose globally
  window.navbarPageTransitions = {
    init: initPageTransitions
  };
  
})();



/* =========================================== */
/* 7. components/navbar/js/navbar-compact-mode.js */
/* =========================================== */

/**
 * COMPACT MODE TOGGLE
 * User can toggle compact/expanded navbar
 */

(function() {
  'use strict';
  
  function initCompactMode() {
    const navbar = document.querySelector('.editorial-navbar, .navbar-enhanced, .header.navbar');
    if (!navbar) return;
    
    // Check localStorage for saved preference
    const savedMode = localStorage.getItem('navbar-compact-mode');
    if (savedMode === 'true') {
      navbar.classList.add('compact');
    }
    
    // Create toggle button
    const toggle = document.createElement('button');
    toggle.className = 'navbar-compact-toggle d-none d-lg-flex';
    toggle.setAttribute('aria-label', 'Toggle compact mode');
    toggle.setAttribute('aria-pressed', savedMode === 'true' ? 'true' : 'false');
    toggle.innerHTML = '<i class="bx bx-chevron-up"></i>';
    
    // Find where to insert toggle (after search button, before hamburger)
    const searchToggle = document.getElementById('navbarSearchToggle');
    const hamburgerToggle = document.getElementById('editorialNavToggle');
    
    if (searchToggle && hamburgerToggle) {
      searchToggle.parentNode.insertBefore(toggle, hamburgerToggle);
    } else if (hamburgerToggle) {
      hamburgerToggle.parentNode.insertBefore(toggle, hamburgerToggle);
    }
    
    // Toggle functionality
    toggle.addEventListener('click', function() {
      const isCompact = navbar.classList.contains('compact');
      
      if (isCompact) {
        navbar.classList.remove('compact');
        toggle.setAttribute('aria-pressed', 'false');
        toggle.querySelector('i').classList.remove('bx-chevron-down');
        toggle.querySelector('i').classList.add('bx-chevron-up');
        localStorage.setItem('navbar-compact-mode', 'false');
      } else {
        navbar.classList.add('compact');
        toggle.setAttribute('aria-pressed', 'true');
        toggle.querySelector('i').classList.remove('bx-chevron-up');
        toggle.querySelector('i').classList.add('bx-chevron-down');
        localStorage.setItem('navbar-compact-mode', 'true');
      }
      
      // Update body padding
      const navbarHeight = navbar.offsetHeight;
      document.documentElement.style.setProperty('--navbar-height', navbarHeight + 'px');
    });
    
    // Update icon based on current state
    if (navbar.classList.contains('compact')) {
      toggle.querySelector('i').classList.remove('bx-chevron-up');
      toggle.querySelector('i').classList.add('bx-chevron-down');
    }
    
    // Update body padding on load
    const navbarHeight = navbar.offsetHeight;
    document.documentElement.style.setProperty('--navbar-height', navbarHeight + 'px');
  }
  
  // DISABLED: Compact mode toggle removed per user request
  // Initialize when DOM is ready
  // if (document.readyState === 'loading') {
  //   document.addEventListener('DOMContentLoaded', initCompactMode);
  // } else {
  //   setTimeout(initCompactMode, 500);
  // }
  
  // Re-initialize if navbar is loaded dynamically
  // const observer = new MutationObserver(() => {
  //   const navbar = document.querySelector('.editorial-navbar, .navbar-enhanced, .header.navbar');
  //   const toggle = document.querySelector('.navbar-compact-toggle');
  //   if (navbar && !toggle) {
  //     initCompactMode();
  //   }
  // });
  
  // observer.observe(document.body, {
  //   childList: true,
  //   subtree: true
  // });
  
  // Expose globally
  // window.navbarCompactMode = {
  //   init: initCompactMode,
  //   toggle: function() {
  //     const navbar = document.querySelector('.editorial-navbar, .navbar-enhanced, .header.navbar');
  //     const toggle = document.querySelector('.navbar-compact-toggle');
  //     if (toggle) {
  //       toggle.click();
  //     }
  //   }
  // };
  
})();



