/**
 * ACCESSIBILITY ENHANCEMENTS
 * Skip links, keyboard shortcuts overlay, high contrast mode
 */

(function() {
  'use strict';

  // Create skip to content link
  function createSkipLink() {
    if (document.getElementById('skipToContent')) return;

    const skipLink = document.createElement('a');
    skipLink.id = 'skipToContent';
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to main content';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Keyboard shortcuts overlay
  function createKeyboardShortcutsOverlay() {
    if (document.getElementById('keyboardShortcutsOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'keyboardShortcutsOverlay';
    overlay.className = 'keyboard-shortcuts-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'keyboard-shortcuts-title');
    
    overlay.innerHTML = `
      <div class="keyboard-shortcuts-content">
        <div class="keyboard-shortcuts-header">
          <h2 id="keyboard-shortcuts-title">Keyboard Shortcuts</h2>
          <button class="keyboard-shortcuts-close" aria-label="Close keyboard shortcuts">
            <i class="bx bx-x"></i>
          </button>
        </div>
        <div class="keyboard-shortcut-group">
          <div class="keyboard-shortcut-group-title">Navigation</div>
          <div class="keyboard-shortcut-item">
            <span class="keyboard-shortcut-label">Go to Home</span>
            <div class="keyboard-shortcut-keys">
              <kbd class="keyboard-key">H</kbd>
            </div>
          </div>
          <div class="keyboard-shortcut-item">
            <span class="keyboard-shortcut-label">Go to Art Gallery</span>
            <div class="keyboard-shortcut-keys">
              <kbd class="keyboard-key">A</kbd>
            </div>
          </div>
          <div class="keyboard-shortcut-item">
            <span class="keyboard-shortcut-label">Go to Portfolio</span>
            <div class="keyboard-shortcut-keys">
              <kbd class="keyboard-key">P</kbd>
            </div>
          </div>
          <div class="keyboard-shortcut-item">
            <span class="keyboard-shortcut-label">Go to Contact</span>
            <div class="keyboard-shortcut-keys">
              <kbd class="keyboard-key">C</kbd>
            </div>
          </div>
        </div>
        <div class="keyboard-shortcut-group">
          <div class="keyboard-shortcut-group-title">Actions</div>
          <div class="keyboard-shortcut-item">
            <span class="keyboard-shortcut-label">Open Search</span>
            <div class="keyboard-shortcut-keys">
              <kbd class="keyboard-key">⌘</kbd>
              <kbd class="keyboard-key">K</kbd>
            </div>
          </div>
          <div class="keyboard-shortcut-item">
            <span class="keyboard-shortcut-label">Show Shortcuts</span>
            <div class="keyboard-shortcut-keys">
              <kbd class="keyboard-key">?</kbd>
            </div>
          </div>
          <div class="keyboard-shortcut-item">
            <span class="keyboard-shortcut-label">Scroll to Top</span>
            <div class="keyboard-shortcut-keys">
              <kbd class="keyboard-key">↑</kbd>
            </div>
          </div>
          <div class="keyboard-shortcut-item">
            <span class="keyboard-shortcut-label">Close Overlays</span>
            <div class="keyboard-shortcut-keys">
              <kbd class="keyboard-key">Esc</kbd>
            </div>
          </div>
        </div>
      </div>
    `;

    // Close handlers
    const closeBtn = overlay.querySelector('.keyboard-shortcuts-close');
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    document.body.appendChild(overlay);
  }

  // Show keyboard shortcuts overlay
  function showKeyboardShortcuts() {
    const overlay = document.getElementById('keyboardShortcutsOverlay');
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Focus close button
      const closeBtn = overlay.querySelector('.keyboard-shortcuts-close');
      if (closeBtn) closeBtn.focus();
    }
  }

  // High contrast mode toggle
  function createHighContrastToggle() {
    if (document.getElementById('highContrastToggle')) return;

    const toggle = document.createElement('button');
    toggle.id = 'highContrastToggle';
    toggle.className = 'high-contrast-toggle';
    toggle.setAttribute('aria-label', 'Toggle high contrast mode');
    toggle.innerHTML = '<i class="bx bx-contrast"></i>';
    
    // Check saved preference
    const savedPreference = localStorage.getItem('highContrast');
    if (savedPreference === 'true') {
      document.body.classList.add('high-contrast');
      toggle.setAttribute('aria-pressed', 'true');
    }

    toggle.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      const isActive = document.body.classList.contains('high-contrast');
      toggle.setAttribute('aria-pressed', isActive);
      localStorage.setItem('highContrast', isActive);
    });

    document.body.appendChild(toggle);
  }

  // Keyboard shortcuts handler
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Don't trigger if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }

      // Show shortcuts overlay (press ?)
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        showKeyboardShortcuts();
        return;
      }

      // Navigation shortcuts
      if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'h':
            e.preventDefault();
            window.location.href = 'index.html';
            break;
          case 'a':
            e.preventDefault();
            window.location.href = 'art.html';
            break;
          case 'p':
            e.preventDefault();
            window.location.href = 'portfolio.html';
            break;
          case 'c':
            e.preventDefault();
            window.location.href = 'contact.html';
            break;
        }
      }

      // Close overlays with Escape
      if (e.key === 'Escape') {
        const overlay = document.getElementById('keyboardShortcutsOverlay');
        if (overlay && overlay.classList.contains('active')) {
          overlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  }

  // Initialize
  function init() {
    createSkipLink();
    createKeyboardShortcutsOverlay();
    createHighContrastToggle();
    initKeyboardShortcuts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose to global scope
  window.showKeyboardShortcuts = showKeyboardShortcuts;
})();

