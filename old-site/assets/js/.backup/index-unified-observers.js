/**
 * Unified IntersectionObserver Manager
 * Consolidates multiple IntersectionObserver instances for better performance
 */

(function() {
  'use strict';
  
  // Unified Observer Manager
  const ObserverManager = {
    observers: new Map(),
    defaultOptions: {
      threshold: 0.1,
      rootMargin: '0px'
    },
    
    /**
     * Create or reuse an observer with specific options
     */
    getObserver(options = {}) {
      const key = JSON.stringify(options);
      
      if (!this.observers.has(key)) {
        const mergedOptions = { ...this.defaultOptions, ...options };
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const callback = entry.target._observerCallback;
            if (callback) {
              callback(entry);
            }
          });
        }, mergedOptions);
        
        this.observers.set(key, observer);
      }
      
      return this.observers.get(key);
    },
    
    /**
     * Observe an element with a callback
     */
    observe(element, callback, options = {}) {
      const observer = this.getObserver(options);
      element._observerCallback = callback;
      observer.observe(element);
      return observer;
    },
    
    /**
     * Unobserve an element
     */
    unobserve(element) {
      this.observers.forEach(observer => {
        observer.unobserve(element);
      });
      delete element._observerCallback;
    }
  };
  
  // Unified Scroll Handler with Debouncing
  const ScrollManager = {
    handlers: [],
    ticking: false,
    
    /**
     * Add a scroll handler with optional debounce
     */
    addHandler(callback, debounceMs = 16) {
      const handler = {
        callback,
        debounceMs,
        lastCall: 0
      };
      
      this.handlers.push(handler);
      
      // Initialize scroll listener if this is the first handler
      if (this.handlers.length === 1) {
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
      }
      
      return handler;
    },
    
    /**
     * Remove a scroll handler
     */
    removeHandler(handler) {
      const index = this.handlers.indexOf(handler);
      if (index > -1) {
        this.handlers.splice(index, 1);
      }
      
      // Remove scroll listener if no handlers remain
      if (this.handlers.length === 0) {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
      }
    },
    
    /**
     * Unified scroll handler
     */
    handleScroll() {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const now = performance.now();
          
          this.handlers.forEach(handler => {
            if (now - handler.lastCall >= handler.debounceMs) {
              handler.callback(scrollY);
              handler.lastCall = now;
            }
          });
          
          this.ticking = false;
        });
        
        this.ticking = true;
      }
    }
  };
  
  // DOM Query Cache
  const DOMCache = {
    cache: new Map(),
    
    /**
     * Get element with caching
     */
    get(selector, force = false) {
      if (!force && this.cache.has(selector)) {
        return this.cache.get(selector);
      }
      
      const element = document.querySelector(selector);
      if (element) {
        this.cache.set(selector, element);
      }
      return element;
    },
    
    /**
     * Get all elements with caching
     */
    getAll(selector, force = false) {
      const cacheKey = selector + '_all';
      if (!force && this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }
      
      const elements = Array.from(document.querySelectorAll(selector));
      if (elements.length > 0) {
        this.cache.set(cacheKey, elements);
      }
      return elements;
    },
    
    /**
     * Clear cache
     */
    clear() {
      this.cache.clear();
    },
    
    /**
     * Clear specific cache entry
     */
    clearEntry(selector) {
      this.cache.delete(selector);
      this.cache.delete(selector + '_all');
    }
  };
  
  // Make globally accessible
  window.ObserverManager = ObserverManager;
  window.ScrollManager = ScrollManager;
  window.DOMCache = DOMCache;
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Clear cache on DOM mutations to prevent stale references
      const mutationObserver = new MutationObserver(() => {
        DOMCache.clear();
      });
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
})();

