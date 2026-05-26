/**
 * DEBUG UTILITIES
 * Centralized debug logging system
 * Only logs in development mode (localhost/127.0.0.1) or when explicitly enabled
 */

(function() {
  'use strict';

  // Check if DEBUG mode should be enabled
  // Can be enabled via: window.DEBUG = true, localStorage.debug = 'true', or localhost
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '';
  
  // CRITICAL: Wrap localStorage access in try/catch to prevent blocking
  // localStorage can throw errors in private mode or when storage is disabled
  let localStorageDebug = false;
  try {
    localStorageDebug = localStorage.getItem('debug') === 'true';
  } catch (e) {
    // localStorage not available (private mode, storage disabled, etc.) - continue without it
    // Don't block page load
  }
  
  const windowDebug = window.DEBUG === true;
  
  // Enable DEBUG mode if any condition is met
  window.DEBUG = windowDebug || localStorageDebug || isLocalhost;

  /**
   * Debug logger - only logs if DEBUG is enabled
   * @param {...any} args - Arguments to log
   */
  function debugLog(...args) {
    if (window.DEBUG) {
      console.log('[DEBUG]', ...args);
    }
  }

  /**
   * Debug warning - only logs if DEBUG is enabled
   * @param {...any} args - Arguments to log
   */
  function debugWarn(...args) {
    if (window.DEBUG) {
      console.warn('[DEBUG]', ...args);
    }
  }

  /**
   * Debug error - always logs (errors are important)
   * @param {...any} args - Arguments to log
   */
  function debugError(...args) {
    if (window.DEBUG) {
      console.error('[DEBUG]', ...args);
    }
  }

  /**
   * Debug info - only logs if DEBUG is enabled
   * @param {...any} args - Arguments to log
   */
  function debugInfo(...args) {
    if (window.DEBUG) {
      console.info('[DEBUG]', ...args);
    }
  }

  /**
   * Performance log - only logs if DEBUG is enabled
   * @param {string} label - Performance label
   * @param {number} duration - Duration in ms
   */
  function debugPerformance(label, duration) {
    if (window.DEBUG) {
      const status = duration > 100 ? '⚠️' : '✅';
      console.log(`[PERF] ${status} ${label}: ${duration}ms`);
    }
  }

  // Expose globally
  window.debugLog = debugLog;
  window.debugWarn = debugWarn;
  window.debugError = debugError;
  window.debugInfo = debugInfo;
  window.debugPerformance = debugPerformance;

  // Log initialization if DEBUG is enabled
  if (window.DEBUG) {
    console.log('[DEBUG] Debug mode enabled');
  }
})();

