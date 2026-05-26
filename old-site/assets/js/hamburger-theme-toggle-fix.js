/**
 * Hamburger Menu Theme Toggle Fix
 * Ensures theme toggle button works in hamburger menu overlay
 * Works even when menu is dynamically loaded
 */

(function() {
  'use strict';
  
  function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    if (!themeToggle) {
      // Retry if button not found yet (dynamically loaded menu)
      setTimeout(initThemeToggle, 200);
      return;
    }
    
    // Check if already initialized
    if (themeToggle.hasAttribute('data-theme-toggle-init')) {
      return;
    }
    themeToggle.setAttribute('data-theme-toggle-init', 'true');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-bs-theme', savedTheme);
    document.body.setAttribute('data-bs-theme', savedTheme);
    updateThemeIcon(savedTheme);
    updateButtonState(savedTheme);
    
    function toggleTheme() {
      const currentTheme = html.getAttribute('data-bs-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      if (window.debugLog) window.debugLog('Toggle theme called. Current:', currentTheme, 'New:', newTheme);
      
      // Set theme on html element
      html.setAttribute('data-bs-theme', newTheme);
      
      // Also set on body for compatibility
      document.body.setAttribute('data-bs-theme', newTheme);
      
      // Force set on all elements that might need it
      document.querySelectorAll('[data-bs-theme]').forEach(el => {
        el.setAttribute('data-bs-theme', newTheme);
      });
      
      // Save to localStorage
      localStorage.setItem('theme', newTheme);
      
      // Update icon and button state
      updateThemeIcon(newTheme);
      updateButtonState(newTheme);
      
      // Trigger custom event for other scripts
      const themeChangeEvent = new CustomEvent('themechange', {
        detail: { theme: newTheme },
        bubbles: true
      });
      document.dispatchEvent(themeChangeEvent);
      window.dispatchEvent(themeChangeEvent);
      
      // Call theme-switcher.js setTheme function if available
      if (window.setTheme && typeof window.setTheme === 'function') {
        try {
          window.setTheme(newTheme);
        } catch(e) {
          if (window.debugWarn) window.debugWarn('Error calling window.setTheme:', e);
        }
      }
      
      // Force refresh of CSS variables
      const root = document.documentElement;
      root.style.setProperty('--bs-theme', newTheme);
      
      // Announce to screen readers
      const announcement = document.getElementById('aria-live-region');
      if (announcement) {
        announcement.textContent = `Switched to ${newTheme} mode`;
      }
      
      if (window.debugLog) window.debugLog('Theme changed to:', newTheme, 'HTML attribute:', html.getAttribute('data-bs-theme'));
      
      // Force a repaint
      void html.offsetHeight;
    }
    
    
    function updateThemeIcon(theme) {
      // Find button fresh each time in case it was recreated
      const currentButton = document.getElementById('themeToggle');
      if (!currentButton) return;
      const icon = currentButton.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon';
      }
      const span = currentButton.querySelector('span');
      if (span) {
        span.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
      }
    }
    
    function updateButtonState(theme) {
      // Find button fresh each time in case it was recreated
      const currentButton = document.getElementById('themeToggle');
      if (!currentButton) return;
      if (theme === 'dark') {
        currentButton.classList.add('theme-active');
        currentButton.classList.remove('theme-inactive');
      } else {
        currentButton.classList.add('theme-inactive');
        currentButton.classList.remove('theme-active');
      }
    }
    
    // Create toggle function
    const toggleThemeHandler = function(e) {
      if (window.debugLog) window.debugLog('Theme toggle button clicked!', e);
      if (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
      toggleTheme();
      return false;
    };
    
    // Store handler reference to prevent duplicate attachments
    const handlerKey = '_themeToggleHandler';
    
    // Check if button already has handler - if so, remove old listeners first
    if (themeToggle[handlerKey]) {
      if (window.debugLog) window.debugLog('Theme toggle already initialized, removing old handlers and re-initializing');
      // Remove old event listeners by cloning
      const oldButton = themeToggle;
      const newButton = oldButton.cloneNode(true);
      oldButton.parentNode.replaceChild(newButton, oldButton);
      // Get the new button reference
      const themeToggleRefreshed = document.getElementById('themeToggle');
      if (themeToggleRefreshed) {
        // Re-initialize with fresh handlers
        themeToggleRefreshed[handlerKey] = toggleThemeHandler;
        themeToggleRefreshed.addEventListener('click', toggleThemeHandler, { capture: true });
        themeToggleRefreshed.addEventListener('click', toggleThemeHandler, { capture: false });
        themeToggleRefreshed.onclick = function(e) {
          if (window.debugLog) window.debugLog('onclick handler triggered');
          toggleThemeHandler(e);
          return false;
        };
        // Update icon and state
        const currentTheme = html.getAttribute('data-bs-theme') || savedTheme;
        updateThemeIcon(currentTheme);
        updateButtonState(currentTheme);
        // Ensure button is clickable
        themeToggleRefreshed.style.pointerEvents = 'auto';
        themeToggleRefreshed.style.cursor = 'pointer';
        themeToggleRefreshed.style.zIndex = '10';
        themeToggleRefreshed.style.position = 'relative';
        return;
      }
    }
    
    themeToggle[handlerKey] = toggleThemeHandler;
    
    if (window.debugLog) window.debugLog('Attaching theme toggle handlers to button:', themeToggle);
    
    // Add click handler with high priority (capture phase first)
    themeToggle.addEventListener('click', toggleThemeHandler, { capture: true });
    themeToggle.addEventListener('click', toggleThemeHandler, { capture: false });
    
    // Also set onclick as backup
    themeToggle.onclick = function(e) {
      if (window.debugLog) window.debugLog('onclick handler triggered');
      toggleThemeHandler(e);
      return false;
    };
    
    // Ensure button is clickable
    themeToggle.style.pointerEvents = 'auto';
    themeToggle.style.cursor = 'pointer';
    themeToggle.style.zIndex = '10';
    themeToggle.style.position = 'relative';
    
    // Use themeToggle directly instead of cloning
    const themeToggleFixed = themeToggle;
    
    // Test click
    if (window.debugLog) {
      window.debugLog('Theme toggle button ready. Testing click...');
      setTimeout(() => {
        window.debugLog('Button element:', themeToggleFixed);
        window.debugLog('Button onclick:', themeToggleFixed.onclick);
        window.debugLog('Button event listeners attached');
      }, 100);
    }
    
    // Update icon and button state
    updateThemeIcon(savedTheme);
    updateButtonState(savedTheme);
    
    if (window.debugLog) window.debugLog('Theme toggle initialized in hamburger menu');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }
  
  // Also try after navbar loads (for dynamically loaded navbars)
  setTimeout(function() {
    initThemeToggle();
  }, 500);
  
  setTimeout(function() {
    initThemeToggle();
  }, 1000);
  
  setTimeout(function() {
    initThemeToggle();
  }, 2000);
  
  // Watch for theme toggle button being added dynamically
  const observer = new MutationObserver(function(mutations) {
    const hasThemeToggle = mutations.some(mutation => {
      return Array.from(mutation.addedNodes).some(node => 
        node.id === 'themeToggle' || 
        (node.querySelector && node.querySelector('#themeToggle'))
      );
    });
    
    if (hasThemeToggle) {
      if (window.debugLog) window.debugLog('Theme toggle button detected in DOM, initializing...');
      setTimeout(initThemeToggle, 100);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Also watch specifically for overlay content being added
  const overlayObserver = new MutationObserver(function(mutations) {
    const overlay = document.getElementById('editorialNavOverlay');
    if (overlay) {
      const themeToggle = overlay.querySelector('#themeToggle');
      if (themeToggle && !themeToggle.hasAttribute('data-theme-toggle-init')) {
        if (window.debugLog) window.debugLog('Theme toggle found in overlay, initializing...');
        setTimeout(initThemeToggle, 100);
      }
    }
  });
  
  const overlay = document.getElementById('editorialNavOverlay');
  if (overlay) {
    overlayObserver.observe(overlay, {
      childList: true,
      subtree: true
    });
  }
})();
