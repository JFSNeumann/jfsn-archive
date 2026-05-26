/**
 * Keyboard Shortcuts Overlay
 * Help modal accessible via ? key
 */

(function() {
  'use strict';

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
    
    // Close button
    if (closeBtn) {
      closeBtn.onclick = closeOverlay;
    }

    // Close on backdrop click
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        closeOverlay();
      }
    };
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupKeyboardShortcuts);
  } else {
    setupKeyboardShortcuts();
  }

  // Export for global use
  window.setupKeyboardShortcuts = setupKeyboardShortcuts;
  window.showKeyboardShortcutsHelp = showKeyboardShortcutsHelp;
})();
