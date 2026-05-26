/**
 * Toast Notification System
 * Best practice implementation for user feedback
 * WCAG compliant, accessible, and performant
 */

(function() {
  'use strict';

  // Create toast container if it doesn't exist
  function getOrCreateToastContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'false');
      container.setAttribute('role', 'status');
      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * Show a toast notification
   * @param {string} message - The message to display
   * @param {string} type - Type: 'success', 'error', 'info', 'warning'
   * @param {number} duration - Duration in milliseconds (0 = no auto-close)
   * @returns {HTMLElement} The toast element
   */
  function showToast(message, type = 'info', duration = 5000) {
    const container = getOrCreateToastContainer();
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-notification-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
    
    // Icons mapping
    const icons = {
      success: '<i class="bx bx-check-circle" aria-hidden="true"></i>',
      error: '<i class="bx bx-error-circle" aria-hidden="true"></i>',
      warning: '<i class="bx bx-error" aria-hidden="true"></i>',
      info: '<i class="bx bx-info-circle" aria-hidden="true"></i>'
    };
    
    // Build toast HTML
    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Close notification" type="button">
        <span aria-hidden="true">&times;</span>
      </button>
    `;
    
    // Add to container
    container.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('toast-show');
    });
    
    // Close button handler
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      removeToast(toast);
    });
    
    // Auto-remove after duration
    if (duration > 0) {
      const timeoutId = setTimeout(() => {
        removeToast(toast);
      }, duration);
      
      // Store timeout ID for potential cancellation
      toast.dataset.timeoutId = timeoutId;
    }
    
    // Announce to screen readers
    announceToScreenReader(message, type);
    
    return toast;
  }

  /**
   * Remove toast with animation
   */
  function removeToast(toast) {
    if (!toast || !toast.parentNode) return;
    
    // Clear timeout if exists
    if (toast.dataset.timeoutId) {
      clearTimeout(parseInt(toast.dataset.timeoutId));
    }
    
    // Add exit animation
    toast.classList.add('toast-hide');
    
    // Remove after animation
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  }

  /**
   * Announce to screen readers
   */
  function announceToScreenReader(message, type) {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      const announcement = type === 'error' 
        ? `Error: ${message}`
        : type === 'success'
        ? `Success: ${message}`
        : message;
      liveRegion.textContent = announcement;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  // Expose to global scope
  window.showToast = showToast;
  
  // Also expose convenience methods
  window.showSuccessToast = (message, duration) => showToast(message, 'success', duration);
  window.showErrorToast = (message, duration) => showToast(message, 'error', duration);
  window.showWarningToast = (message, duration) => showToast(message, 'warning', duration);
  window.showInfoToast = (message, duration) => showToast(message, 'info', duration);

  // Initialize container on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', getOrCreateToastContainer);
  } else {
    getOrCreateToastContainer();
  }
})();

