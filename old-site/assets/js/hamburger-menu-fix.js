/**
 * Hamburger Menu Fix
 * Ensures hamburger menu works reliably across all pages
 * Works even if navbar.js fails or conflicts
 */

(function() {
  'use strict';
  
  let menuInitialized = false;
  
  // Force hamburger lines to be BLACK
function forceBlackHamburgerLines() {
  const toggleIcon = document.querySelector('.editorial-navbar-toggle-icon');
  if (toggleIcon) {
    const spans = toggleIcon.querySelectorAll('span');
    spans.forEach(span => {
      span.style.background = '#000000';
      span.style.backgroundColor = '#000000';
      span.style.color = '#000000';
      span.style.setProperty('-webkit-text-fill-color', '#000000', 'important');
    });
  }
}

// Run immediately and on DOM ready
forceBlackHamburgerLines();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', forceBlackHamburgerLines);
}

function initHamburgerMenu() {
    const toggle = document.getElementById('editorialNavToggle');
    const overlay = document.getElementById('editorialNavOverlay');
    const close = document.getElementById('editorialNavClose');
    
    if (!toggle || !overlay) {
      // Retry if elements not found yet (but only if not initialized)
      if (!menuInitialized) {
        setTimeout(initHamburgerMenu, 200);
      }
      return;
    }
    
    // Always ensure button is clickable
    toggle.style.pointerEvents = 'auto';
    toggle.style.cursor = 'pointer';
    toggle.style.zIndex = '10001';
    toggle.style.position = 'relative';
    
    // Ensure overlay is in body for proper z-index
    if (overlay.parentElement !== document.body) {
      document.body.appendChild(overlay);
    }
    
    // Define toggle functions
    function openMenu() {
      if (window.debugLog) window.debugLog('Opening hamburger menu...');
      overlay.classList.add('active');
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      overlay.setAttribute('aria-hidden', 'false');
      overlay.style.opacity = '1';
      overlay.style.visibility = 'visible';
      overlay.style.pointerEvents = 'auto';
      overlay.style.display = 'block';
      overlay.style.zIndex = '999999';
      // Force semi-transparent background - override navbar.css rgba(0, 0, 0, 0.98)
      overlay.style.background = 'rgba(0, 0, 0, 0.4)';
      // Add blur like live site
      overlay.style.backdropFilter = 'blur(20px) brightness(0.9)';
      overlay.style.webkitBackdropFilter = 'blur(20px) brightness(0.9)';
      // Don't hide body overflow - allow page to be visible underneath
      // document.body.style.overflow = 'hidden';
      if (window.debugLog) window.debugLog('Menu opened, overlay classes:', overlay.className);
    }
    
    function closeMenu() {
      if (window.debugLog) window.debugLog('Closing hamburger menu...');
      overlay.classList.remove('active');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
      overlay.style.pointerEvents = 'none';
      document.body.style.overflow = '';
      if (window.debugLog) window.debugLog('Menu closed');
    }
    
    function toggleMenu(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      if (window.debugLog) window.debugLog('Toggle clicked, current state:', overlay.classList.contains('active'));
      
      if (overlay.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    }
    
    // Check if we've already attached our handler
    const handlerKey = '_hamburgerMenuHandler';
    if (toggle[handlerKey]) {
      // Handler already attached, but ensure overlay state is correct
      if (overlay.parentElement !== document.body) {
        document.body.appendChild(overlay);
      }
      return;
    }
    
    // Mark as initialized
    toggle.setAttribute('data-hamburger-init', 'true');
    menuInitialized = true;
    
    // Ensure overlay has proper initial state - CLOSED by default
    overlay.style.position = 'fixed';
    overlay.style.zIndex = '999999';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    // CRITICAL: Start CLOSED, not open
    overlay.style.display = 'block';
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    overlay.style.pointerEvents = 'none';
    overlay.classList.remove('active'); // Ensure not active
    overlay.setAttribute('aria-hidden', 'true');
    
    // Create handler function
    const toggleMenuHandler = function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (window.debugLog) window.debugLog('Hamburger menu clicked - toggling menu');
      toggleMenu(e);
    };
    
    // Remove any existing onclick handlers first
    const originalOnclick = toggle.onclick;
    toggle.onclick = null;
    
    // Add event listeners with high priority (capture phase first)
    toggle.addEventListener('click', toggleMenuHandler, { capture: true });
    toggle.addEventListener('click', toggleMenuHandler, { capture: false });
    
    // Set onclick as backup (will override navbar.js if it sets one)
    toggle.onclick = function(e) {
      // Call original if it exists (navbar.js handler)
      if (originalOnclick && originalOnclick !== toggleMenuHandler) {
        try {
          originalOnclick.call(this, e);
        } catch(err) {
          if (window.debugWarn) window.debugWarn('Error calling original onclick:', err);
        }
      }
      // Always call our handler
      toggleMenuHandler(e);
    };
    
    // Store handler reference to prevent duplicate attachments
    toggle[handlerKey] = toggleMenuHandler;
    
    // Close button handler
    if (close) {
      close.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
      });
    }
    
    // Close on Escape key
    function handleEscape(e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeMenu();
      }
    }
    document.addEventListener('keydown', handleEscape);
    
    // Close on outside click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeMenu();
      }
    });
    
    // Close on link click
    const navLinks = overlay.querySelectorAll('.editorial-nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        setTimeout(closeMenu, 100);
      });
    });
    
    if (window.debugLog) window.debugLog('Hamburger menu initialized successfully');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initHamburgerMenu();
      forceBlackHamburgerLines(); // Force black lines after menu init
    });
  } else {
    initHamburgerMenu();
    forceBlackHamburgerLines(); // Force black lines after menu init
  }
  
  // Also force black lines periodically to override any dynamic changes
  // CRITICAL: Use setTimeout recursion instead of setInterval to prevent conflicts
  // Only run if page is still responsive
  function scheduleBlackLinesCheck() {
    if (document.readyState !== 'uninitialized') {
      forceBlackHamburgerLines();
      setTimeout(scheduleBlackLinesCheck, 500);
    }
  }
  scheduleBlackLinesCheck();
  
  // Also try after navbar loads (for dynamically loaded navbars)
  // Re-initialize multiple times to catch navbar when it loads
  setTimeout(function() {
    initHamburgerMenu();
  }, 500);
  
  setTimeout(function() {
    initHamburgerMenu();
  }, 1000);
  
  setTimeout(function() {
    initHamburgerMenu();
  }, 2000);
  
  // Watch for navbar being added dynamically
  // CRITICAL: Add debounce and limit to prevent infinite loops
  let observerTimeout;
  let reinitCount = 0;
  const MAX_REINIT_ATTEMPTS = 5; // Prevent infinite re-initialization
  
  const observer = new MutationObserver(function(mutations) {
    // Debounce rapid mutations
    clearTimeout(observerTimeout);
    
    observerTimeout = setTimeout(function() {
      const hasNavbarChanges = mutations.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => 
          node.id === 'editorialNavToggle' || 
          node.id === 'editorialNavOverlay' ||
          (node.querySelector && (
            node.querySelector('#editorialNavToggle') || 
            node.querySelector('#editorialNavOverlay')
          ))
        );
      });
      
      if (hasNavbarChanges && reinitCount < MAX_REINIT_ATTEMPTS) {
        reinitCount++;
        menuInitialized = false; // Reset to allow re-initialization
        setTimeout(initHamburgerMenu, 100);
      } else if (reinitCount >= MAX_REINIT_ATTEMPTS) {
        if (window.debugWarn) window.debugWarn('⚠️ Maximum re-initialization attempts reached - stopping observer');
        observer.disconnect(); // Stop observing to prevent infinite loops
      }
    }, 200); // 200ms debounce
  });
  
  // Only observe if document.body exists
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    // Wait for body to exist
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        if (document.body) {
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
        }
      });
    }
  }
  // Check if Boxicons font loaded - if not, show text fallback for close button
  function checkBoxiconsFont() {
    const closeIcon = document.querySelector('.editorial-nav-overlay-close i.bx-x');
    if (closeIcon) {
      // Method 1: Check if Boxicons font is loaded by testing computed style
      const testEl = document.createElement('span');
      testEl.className = 'bx bx-x';
      testEl.style.position = 'absolute';
      testEl.style.visibility = 'hidden';
      testEl.style.fontSize = '16px';
      document.body.appendChild(testEl);
      
      const computedStyle = window.getComputedStyle(testEl, '::before');
      const content = computedStyle.getPropertyValue('content');
      
      // Method 2: Check if the actual icon element has visible content
      const iconComputed = window.getComputedStyle(closeIcon, '::before');
      const iconContent = iconComputed.getPropertyValue('content');
      const iconWidth = iconComputed.getPropertyValue('width');
      const iconDisplay = iconComputed.getPropertyValue('display');
      
      // If content is empty, just quotes, or 'none', Boxicons didn't load
      const contentEmpty = !content || content === '""' || content === "''" || content === 'none' || content === 'normal';
      const iconContentEmpty = !iconContent || iconContent === '""' || iconContent === "''" || iconContent === 'none' || iconContent === 'normal';
      
      if (contentEmpty || iconContentEmpty || iconDisplay === 'none') {
        closeIcon.classList.add('no-boxicons');
        closeIcon.classList.remove('boxicons-loaded');
        if (window.debugLog) window.debugLog('Boxicons font not detected, using text fallback for close button');
      } else {
        // Font appears to be loaded
        closeIcon.classList.remove('no-boxicons');
        closeIcon.classList.add('boxicons-loaded');
      }
      
      document.body.removeChild(testEl);
      
      // Also check after a delay to catch late-loading fonts
      setTimeout(function() {
        const finalCheck = window.getComputedStyle(closeIcon, '::before');
        const finalContent = finalCheck.getPropertyValue('content');
        const finalDisplay = finalCheck.getPropertyValue('display');
        if (!finalContent || finalContent === '""' || finalContent === "''" || finalContent === 'none' || finalContent === 'normal' || finalDisplay === 'none') {
          if (!closeIcon.classList.contains('no-boxicons')) {
            closeIcon.classList.add('no-boxicons');
            closeIcon.classList.remove('boxicons-loaded');
            if (window.debugLog) window.debugLog('Boxicons font still not loaded after delay, using text fallback');
          }
        } else {
          // Font loaded successfully, add boxicons-loaded class and remove no-boxicons
          closeIcon.classList.remove('no-boxicons');
          closeIcon.classList.add('boxicons-loaded');
          if (window.debugLog) window.debugLog('Boxicons font loaded successfully, hiding text fallback');
        }
      }, 1000);
    }
  }
  
  // Check after DOM loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(checkBoxiconsFont, 500);
    });
  } else {
    setTimeout(checkBoxiconsFont, 500);
  }
  
  // Also check when overlay opens
  const overlayCheck = document.getElementById('editorialNavOverlay');
  if (overlayCheck) {
    overlayCheck.addEventListener('transitionend', function() {
      if (overlayCheck.classList.contains('active')) {
        checkBoxiconsFont();
      }
    });
    
    // Also check when overlay is opened (immediately)
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (overlayCheck.classList.contains('active')) {
            setTimeout(checkBoxiconsFont, 100);
          }
        }
      });
    });
    observer.observe(overlayCheck, { attributes: true });
  }
})();
