/**
 * Error Handling with Retry
 * User-friendly error recovery
 */

(function() {
  'use strict';
  
  const errorContainers = new Map();
  let retryCallbacks = new Map();
  
  // Create error state container
  function createErrorContainer(id, options = {}) {
    const {
      title = 'Something went wrong',
      message = 'An error occurred. Please try again.',
      type = 'error',
      retryable = true,
      onRetry = null,
      onDismiss = null,
      showDetails = false
    } = options;
    
    const container = document.createElement('div');
    container.id = id || `error-${Date.now()}`;
    container.className = `error-state-container ${type}-error`;
    
    const iconMap = {
      error: '⚠️',
      network: '📡',
      timeout: '⏱️',
      server: '🔧'
    };
    
    container.innerHTML = `
      <div class="error-state-icon">${iconMap[type] || iconMap.error}</div>
      <h3 class="error-state-title">${title}</h3>
      <p class="error-state-message">${message}</p>
      <div class="error-state-actions">
        ${retryable ? `
          <button class="error-retry-button" data-error-id="${container.id}">
            <i class="bx bx-refresh"></i>
            <span>Retry</span>
          </button>
        ` : ''}
        ${onDismiss ? `
          <button class="error-dismiss-button" data-error-id="${container.id}">
            Dismiss
          </button>
        ` : ''}
      </div>
      ${showDetails ? `
        <button class="error-details-toggle" data-error-id="${container.id}">
          Show details
        </button>
        <div class="error-details" id="error-details-${container.id}"></div>
      ` : ''}
    `;
    
    // Store callback
    if (onRetry) {
      retryCallbacks.set(container.id, onRetry);
    }
    
    // Setup event listeners
    const retryBtn = container.querySelector('.error-retry-button');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => handleRetry(container.id));
    }
    
    const dismissBtn = container.querySelector('.error-dismiss-button');
    if (dismissBtn && onDismiss) {
      dismissBtn.addEventListener('click', () => {
        hideError(container.id);
        onDismiss();
      });
    }
    
    const detailsToggle = container.querySelector('.error-details-toggle');
    if (detailsToggle) {
      detailsToggle.addEventListener('click', () => toggleDetails(container.id));
    }
    
    errorContainers.set(container.id, container);
    return container;
  }
  
  // Show error
  function showError(containerId, targetElement = null) {
    const container = errorContainers.get(containerId);
    if (!container) return;
    
    container.classList.add('visible');
    
    if (targetElement) {
      if (typeof targetElement === 'string') {
        targetElement = document.querySelector(targetElement);
      }
      if (targetElement) {
        targetElement.insertAdjacentElement('beforebegin', container);
      }
    } else {
      document.body.appendChild(container);
    }
    
    // Announce to screen reader
    announceError(container);
  }
  
  // Hide error
  function hideError(containerId) {
    const container = errorContainers.get(containerId);
    if (!container) return;
    
    container.classList.remove('visible');
    setTimeout(() => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }, 300);
  }
  
  // Handle retry
  async function handleRetry(containerId) {
    const container = errorContainers.get(containerId);
    if (!container) return;
    
    const retryBtn = container.querySelector('.error-retry-button');
    if (!retryBtn) return;
    
    retryBtn.classList.add('loading');
    retryBtn.disabled = true;
    
    const callback = retryCallbacks.get(containerId);
    
    try {
      if (callback) {
        await callback();
      }
      
      // Hide error on success
      setTimeout(() => {
        hideError(containerId);
      }, 500);
    } catch (error) {
      // Update error message
      updateError(containerId, {
        message: `Retry failed: ${error.message}`
      });
    } finally {
      retryBtn.classList.remove('loading');
      retryBtn.disabled = false;
    }
  }
  
  // Update error
  function updateError(containerId, updates) {
    const container = errorContainers.get(containerId);
    if (!container) return;
    
    if (updates.title) {
      const titleEl = container.querySelector('.error-state-title');
      if (titleEl) titleEl.textContent = updates.title;
    }
    
    if (updates.message) {
      const messageEl = container.querySelector('.error-state-message');
      if (messageEl) messageEl.textContent = updates.message;
    }
    
    if (updates.details) {
      const detailsEl = container.querySelector('.error-details');
      if (detailsEl) {
        detailsEl.textContent = updates.details;
        detailsEl.classList.add('visible');
      }
    }
  }
  
  // Toggle details
  function toggleDetails(containerId) {
    const container = errorContainers.get(containerId);
    if (!container) return;
    
    const details = container.querySelector('.error-details');
    const toggle = container.querySelector('.error-details-toggle');
    
    if (details && toggle) {
      const isVisible = details.classList.contains('visible');
      details.classList.toggle('visible');
      toggle.textContent = isVisible ? 'Show details' : 'Hide details';
    }
  }
  
  // Announce error to screen reader
  function announceError(container) {
    const title = container.querySelector('.error-state-title')?.textContent;
    const message = container.querySelector('.error-state-message')?.textContent;
    
    if (title && window.announceToScreenReader) {
      window.announceToScreenReader(`${title}. ${message}`, 'assertive');
    }
  }
  
  // Error handler wrapper for async functions
  function withErrorHandling(fn, options = {}) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        const {
          containerId = `error-${Date.now()}`,
          targetElement = null,
          onRetry = null
        } = options;
        
        const errorContainer = createErrorContainer(containerId, {
          title: error.name || 'Error',
          message: error.message || 'An unexpected error occurred',
          type: error.name === 'NetworkError' ? 'network' : 'error',
          retryable: !!onRetry,
          onRetry: onRetry ? () => withErrorHandling(fn, options)(...args) : null,
          showDetails: true
        });
        
        updateError(containerId, {
          details: error.stack || error.toString()
        });
        
        showError(containerId, targetElement);
        throw error;
      }
    };
  }
  
  // Network error handler
  function handleNetworkError(error, options = {}) {
    const containerId = options.containerId || `network-error-${Date.now()}`;
    const errorContainer = createErrorContainer(containerId, {
      title: 'Network Error',
      message: 'Unable to connect to the server. Please check your internet connection.',
      type: 'network',
      retryable: true,
      onRetry: options.onRetry || null,
      showDetails: options.showDetails || false
    });
    
    showError(containerId, options.targetElement);
    return containerId;
  }
  
  // Timeout error handler
  function handleTimeoutError(error, options = {}) {
    const containerId = options.containerId || `timeout-error-${Date.now()}`;
    const errorContainer = createErrorContainer(containerId, {
      title: 'Request Timeout',
      message: 'The request took too long to complete. Please try again.',
      type: 'timeout',
      retryable: true,
      onRetry: options.onRetry || null,
      showDetails: options.showDetails || false
    });
    
    showError(containerId, options.targetElement);
    return containerId;
  }
  
  // Export API
  window.ErrorHandler = {
    create: createErrorContainer,
    show: showError,
    hide: hideError,
    update: updateError,
    retry: handleRetry,
    withErrorHandling,
    handleNetworkError,
    handleTimeoutError
  };
})();

