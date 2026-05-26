/**
 * PORTFOLIO PAGE SPECIFIC JAVASCRIPT
 * Extracted from portfolio.html inline scripts
 * Date: January 9, 2026
 * 
 * Contains all page-specific functionality for portfolio.html:
 * - Remove section navigation
 * - Hamburger menu event delegation
 * - Keyboard shortcuts overlay
 * - Screen reader announcements
 * - Intersection Observer for animations
 * - Portfolio bouncing drone animation
 * - UX/UI features component loading
 */

(function() {
  'use strict';

  // ============================================
  // 1. REMOVE SECTION NAVIGATION
  // ============================================
  (function() {
    function removeSectionNav() {
      const sectionNav = document.querySelector('.section-navigation');
      if (sectionNav) {
        sectionNav.style.cssText = 'display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;position:absolute!important;left:-9999px!important;width:0!important;height:0!important;overflow:hidden!important;';
        sectionNav.remove();
      }
    }
    
    // Run immediately
    removeSectionNav();
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', removeSectionNav);
    }
    
    // Use MutationObserver to catch dynamically created nav
    const observer = new MutationObserver(function(mutations) {
      removeSectionNav();
    });
    
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    }
    
    // Also run periodically as fallback
    setInterval(removeSectionNav, 200);
    
    // Run on window load
    window.addEventListener('load', removeSectionNav);
  })();

  // ============================================
  // 2. HAMBURGER MENU EVENT DELEGATION
  // ============================================
  (function() {
    let menuInitialized = false;
    
    // Hamburger menu is handled by navbar.js - no custom handlers needed
    // navbar.js has MutationObserver to watch for dynamically loaded navbars
    
    // Ensure toggle button is always clickable (CSS only, no event handlers)
    function ensureToggleWorks() {
      const toggle = document.getElementById('editorialNavToggle');
      const overlay = document.getElementById('editorialNavOverlay');
      
      if (toggle && overlay) {
        // Make sure button is clickable and above other content
        toggle.style.pointerEvents = 'auto';
        toggle.style.cursor = 'pointer';
        toggle.style.zIndex = '10001';
        
        // Ensure overlay is properly positioned
        if (!overlay.style.position) {
          overlay.style.position = 'fixed';
          overlay.style.zIndex = '99998';
        }
      }
    }
    
    // Try multiple times to ensure CSS properties are set
    setTimeout(ensureToggleWorks, 100);
    setTimeout(ensureToggleWorks, 500);
    setTimeout(ensureToggleWorks, 1000);
    
    // Watch for navbar being loaded and ensure CSS properties
    const observer = new MutationObserver(function() {
      ensureToggleWorks();
    });
    
    const navbarSection = document.getElementById('navbar-section');
    if (navbarSection) {
      observer.observe(navbarSection, {
        childList: true,
        subtree: true
      });
    }
  })();

  // ============================================
  // 3. ENHANCED FEATURES JAVASCRIPT
  // Keyboard Shortcuts & Screen Reader Announcements
  // ============================================
  (function() {
    // Mark body as JS-enabled immediately
    document.documentElement.classList.add('js-enabled');
  
    // ============================================
    // KEYBOARD SHORTCUTS OVERLAY
    // ============================================
    function setupKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        // Don't trigger if typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          if (e.key === 'Escape' && e.target.id === 'navbarSearchInput') {
            const searchInput = document.getElementById('navbarSearchInput');
            if (searchInput && searchInput.value) {
              searchInput.value = '';
              const clearBtn = document.getElementById('navbarSearchClear');
              if (clearBtn) clearBtn.click();
            }
          }
          return;
        }
        
        // Escape - Close shortcuts overlay or search overlay
        if (e.key === 'Escape') {
          const shortcutsOverlay = document.getElementById('keyboardShortcutsOverlay');
          if (shortcutsOverlay && shortcutsOverlay.classList.contains('active')) {
            shortcutsOverlay.classList.remove('active');
            shortcutsOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            return;
          }
          
          const searchOverlay = document.getElementById('navbarSearchOverlay');
          if (searchOverlay && searchOverlay.classList.contains('active')) {
            const closeBtn = document.getElementById('navbarSearchClose');
            if (closeBtn) closeBtn.click();
            return;
          }
        }
        
        // ? - Show shortcuts help (DISABLED - user doesn't want to see this)
        // if (e.key === '?' && !e.shiftKey) {
        //   e.preventDefault();
        //   showKeyboardShortcutsHelp();
        // }
        
        // D - Toggle dark mode
        if ((e.key === 'd' || e.key === 'D') && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const themeToggle = document.getElementById('themeToggle');
          if (themeToggle) {
            e.preventDefault();
            themeToggle.click();
          }
        }
      });
    }
    
    function showKeyboardShortcutsHelp() {
      const overlay = document.getElementById('keyboardShortcutsOverlay');
      if (!overlay) return;
      
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      // Focus close button
      const closeBtn = document.getElementById('keyboardShortcutsClose');
      if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 100);
      }
      
      // Close handlers
      const closeOverlay = () => {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      };
      
      // Close button (CSP compliant - use addEventListener)
      if (closeBtn) {
        closeBtn.addEventListener('click', closeOverlay);
      }
      
      // Close on backdrop click (CSP compliant - use addEventListener)
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeOverlay();
        }
      };
    }
    
    // ============================================
    // ENHANCED SCREEN READER ANNOUNCEMENTS
    // ============================================
    function announceToScreenReader(message, priority = 'polite') {
      let liveRegion;
      
      // Choose appropriate live region based on priority
      if (priority === 'assertive') {
        liveRegion = document.getElementById('aria-live-region-assertive');
      } else if (priority === 'status') {
        liveRegion = document.getElementById('aria-live-region-status');
      } else {
        liveRegion = document.getElementById('aria-live-region');
      }
      
      if (liveRegion) {
        // Clear previous message
        liveRegion.textContent = '';
        
        // Small delay to ensure screen reader picks up the change
        setTimeout(() => {
          liveRegion.textContent = message;
          
          // Clear after announcement (longer for assertive)
          const clearDelay = priority === 'assertive' ? 2000 : 1000;
          setTimeout(() => {
            liveRegion.textContent = '';
          }, clearDelay);
        }, 100);
      }
    }
    
    // Initialize functions
    setupKeyboardShortcuts();
    
    // Export functions globally
    window.announceToScreenReader = announceToScreenReader;
  })();

  // ============================================
  // 4. INTERSECTION OBSERVER FOR ANIMATIONS
  // ============================================
  (function() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.card, section, .timeline-item').forEach(el => {
        el.classList.add('fade-in-on-scroll');
        observer.observe(el);
      });
    });
  })();

  // ============================================
  // 5. PORTFOLIO BOUNCING DRONE ANIMATION
  // ============================================
  (function() {
    const bounceDrone = document.querySelector('.portfolio-bounce-drone');
    if (!bounceDrone) return;
    
    function shouldAnimate() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
      if (document.hidden) return false;
      return true;
    }
    
    function initDroneAnimation() {
      if (shouldAnimate()) {
        if (document.readyState === 'complete') {
          setTimeout(() => bounceDrone.classList.add('loaded'), 1500);
        } else {
          window.addEventListener('load', () => setTimeout(() => bounceDrone.classList.add('loaded'), 1500));
        }
      } else {
        bounceDrone.style.display = 'none';
      }
    }
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        bounceDrone.classList.remove('loaded');
      } else if (shouldAnimate()) {
        bounceDrone.classList.add('loaded');
      }
    });
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initDroneAnimation);
    } else {
      initDroneAnimation();
    }
  })();

  // ============================================
  // 6. LOAD UX/UI FEATURES HTML COMPONENTS
  // ============================================
  (function() {
    const container = document.getElementById('ux-ui-features-section');
    if (!container) {
      // Create container if it doesn't exist
      const div = document.createElement('div');
      div.id = 'ux-ui-features-section';
      document.body.appendChild(div);
    }
    const targetContainer = document.getElementById('ux-ui-features-section');
    if (targetContainer) {
      fetch('components/ux-ui-features-2026.html')
        .then(response => response.text())
        .then(html => {
          targetContainer.innerHTML = html;
        })
        .catch(err => console.warn('Could not load UX/UI features components:', err));
    }
  })();

})();
