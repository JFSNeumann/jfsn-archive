/**
 * High Contrast Mode Toggle
 * Best practice accessibility feature - WCAG AAA compliance
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'highContrastMode';
  const CLASS_NAME = 'high-contrast-mode';

  /**
   * Initialize high contrast mode
   */
  function initHighContrastMode() {
    // Load saved preference
    const savedPreference = localStorage.getItem(STORAGE_KEY);
    if (savedPreference === 'enabled') {
      enableHighContrast();
    }

    // Create toggle button if it doesn't exist
    createToggleButton();

    // Keyboard shortcut: Alt + H
    document.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 'h' || e.key === 'H')) {
        if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          e.preventDefault();
          toggleHighContrast();
        }
      }
    });
  }

  /**
   * Create toggle button
   */
  function createToggleButton() {
    // Check if button already exists
    if (document.getElementById('highContrastToggle')) {
      return;
    }

    const button = document.createElement('button');
    button.id = 'highContrastToggle';
    button.className = 'high-contrast-toggle';
    button.setAttribute('aria-label', 'Toggle high contrast mode');
    button.setAttribute('aria-pressed', document.documentElement.classList.contains(CLASS_NAME) ? 'true' : 'false');
    button.innerHTML = '<i class="bx bx-contrast" aria-hidden="true"></i><span class="sr-only">High Contrast</span>';
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      toggleHighContrast();
    });

    // Add to accessibility toolbar or navbar
    const accessibilityToolbar = document.getElementById('accessibility-toolbar');
    if (accessibilityToolbar) {
      accessibilityToolbar.appendChild(button);
    } else {
      // Add to body as floating button
      button.style.cssText = 'position: fixed; bottom: 1rem; left: 1rem; z-index: 9999; background: #6366f1; color: white; border: none; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.3s ease;';
      document.body.appendChild(button);
    }
  }

  /**
   * Enable high contrast mode
   */
  function enableHighContrast() {
    document.documentElement.classList.add(CLASS_NAME);
    localStorage.setItem(STORAGE_KEY, 'enabled');
    updateToggleButton(true);
    announceToScreenReader('High contrast mode enabled');
  }

  /**
   * Disable high contrast mode
   */
  function disableHighContrast() {
    document.documentElement.classList.remove(CLASS_NAME);
    localStorage.setItem(STORAGE_KEY, 'disabled');
    updateToggleButton(false);
    announceToScreenReader('High contrast mode disabled');
  }

  /**
   * Toggle high contrast mode
   */
  function toggleHighContrast() {
    const isEnabled = document.documentElement.classList.contains(CLASS_NAME);
    if (isEnabled) {
      disableHighContrast();
    } else {
      enableHighContrast();
    }
  }

  /**
   * Update toggle button state
   */
  function updateToggleButton(enabled) {
    const button = document.getElementById('highContrastToggle');
    if (button) {
      button.setAttribute('aria-pressed', enabled ? 'true' : 'false');
      button.classList.toggle('active', enabled);
    }
  }

  /**
   * Announce to screen readers
   */
  function announceToScreenReader(message) {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHighContrastMode);
  } else {
    initHighContrastMode();
  }

  // Expose to global scope
  window.toggleHighContrast = toggleHighContrast;
  window.enableHighContrast = enableHighContrast;
  window.disableHighContrast = disableHighContrast;
})();

