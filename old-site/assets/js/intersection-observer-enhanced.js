/**
 * Enhanced Intersection Observer Utility
 * Unified Intersection Observer for lazy loading, animations, and performance
 * 
 * Features:
 * - Lazy load images
 * - Scroll-triggered animations
 * - Lazy load modules/scripts
 * - Track visibility for analytics
 * - Performance optimized
 */

(function() {
  'use strict';

  // Check support
  if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver not supported, using fallbacks');
    return;
  }

  // ===== CONFIGURATION =====
  const configs = {
    // Images: Start loading before entering viewport
    images: {
      rootMargin: '200px 0px',
      threshold: 0.01
    },
    // Animations: Trigger when element is visible
    animations: {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    },
    // Modules: Load when near viewport
    modules: {
      rootMargin: '100px 0px',
      threshold: 0.01
    },
    // Analytics: Track when element is visible
    analytics: {
      rootMargin: '0px',
      threshold: 0.5
    }
  };

  // ===== OBSERVERS =====
  const observers = {
    images: null,
    animations: null,
    modules: null,
    analytics: null
  };

  // ===== IMAGE LAZY LOADING =====
  function initImageObserver() {
    observers.images = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Load from data-src if available
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.loading = 'lazy';
          }
          
          // Load from data-srcset if available
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }
          
          // Add loaded class
          img.classList.add('image-loaded');
          
          // Remove skeleton/placeholder
          const placeholder = img.parentElement.querySelector('.image-placeholder, .skeleton');
          if (placeholder) {
            placeholder.style.display = 'none';
          }
          
          // Unobserve after loading
          observers.images.unobserve(img);
        }
      });
    }, configs.images);

    // Observe all lazy images
    const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset], img[loading="lazy"]:not(.image-loaded)');
    lazyImages.forEach(img => {
      // Add placeholder if not exists
      if (!img.parentElement.querySelector('.image-placeholder')) {
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder skeleton';
        placeholder.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:var(--skeleton-bg,#f0f0f0);';
        img.parentElement.style.position = 'relative';
        img.parentElement.appendChild(placeholder);
      }
      
      observers.images.observe(img);
    });
  }

  // ===== SCROLL ANIMATIONS =====
  function initAnimationObserver() {
    observers.animations = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const element = entry.target; // Define element outside if/else block
        
        if (entry.isIntersecting) {
          // Add animation classes
          element.classList.add('animate-in', 'visible');
          element.classList.remove('animate-out');
          
          // Trigger custom event
          element.dispatchEvent(new CustomEvent('intersect', { bubbles: true }));
          
          // If one-time animation, unobserve
          if (!element.dataset.repeat) {
            observers.animations.unobserve(element);
          }
        } else {
          // Element left viewport
          if (element.dataset.repeat) {
            element.classList.add('animate-out');
            element.classList.remove('animate-in');
          }
        }
      });
    }, configs.animations);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll(
      '.fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right, ' +
      '.slide-in-up, .slide-in-down, .scroll-reveal, [data-animate]'
    );
    animatedElements.forEach(el => {
      el.classList.add('animate-pending');
      observers.animations.observe(el);
    });
  }

  // ===== MODULE LAZY LOADING =====
  function initModuleObserver() {
    observers.modules = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const moduleName = element.dataset.module;
          
          if (moduleName && !element.dataset.moduleLoaded) {
            loadModule(moduleName, element);
            element.dataset.moduleLoaded = 'true';
            observers.modules.unobserve(element);
          }
        }
      });
    }, configs.modules);

    // Observe elements with data-module attribute
    const moduleElements = document.querySelectorAll('[data-module]');
    moduleElements.forEach(el => {
      observers.modules.observe(el);
    });
  }

  // Load module dynamically
  function loadModule(moduleName, element) {
    const moduleMap = {
      'gallery': () => {
        // Load gallery features
        if (window.loadGalleryModule) {
          window.loadGalleryModule();
        }
      },
      'comments': () => {
        // Load comments system
        if (window.loadCommentsModule) {
          window.loadCommentsModule();
        }
      },
      'analytics': () => {
        // Load analytics
        if (window.loadAnalyticsModule) {
          window.loadAnalyticsModule();
        }
      }
    };

    if (moduleMap[moduleName]) {
      try {
        moduleMap[moduleName]();
        element.dispatchEvent(new CustomEvent('moduleLoaded', { 
          detail: { module: moduleName },
          bubbles: true 
        }));
      } catch (error) {
        console.error(`Error loading module ${moduleName}:`, error);
      }
    }
  }

  // ===== ANALYTICS TRACKING =====
  function initAnalyticsObserver() {
    observers.analytics = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const trackId = element.dataset.trackId || element.id;
          
          // Track visibility
          if (trackId && window.gtag) {
            window.gtag('event', 'view_item', {
              'item_id': trackId,
              'item_name': element.textContent?.substring(0, 100) || '',
              'visibility_time': Math.floor(entry.intersectionRatio * 100)
            });
          }
          
          // Trigger custom event
          element.dispatchEvent(new CustomEvent('visible', { bubbles: true }));
          
          // Unobserve after tracking
          observers.analytics.unobserve(element);
        }
      });
    }, configs.analytics);

    // Observe elements with data-track-id
    const trackedElements = document.querySelectorAll('[data-track-id]');
    trackedElements.forEach(el => {
      observers.analytics.observe(el);
    });
  }

  // ===== INITIALIZATION =====
  function init() {
    initImageObserver();
    initAnimationObserver();
    initModuleObserver();
    initAnalyticsObserver();

    // Watch for dynamically added elements
    if (window.MutationObserver) {
      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // Check for lazy images
              if (node.tagName === 'IMG' && (node.dataset.src || node.dataset.srcset)) {
                if (observers.images) {
                  observers.images.observe(node);
                }
              }
              
              // Check for animation classes
              if (node.classList && (
                node.classList.contains('fade-in-up') ||
                node.classList.contains('scroll-reveal') ||
                node.dataset.animate
              )) {
                if (observers.animations) {
                  node.classList.add('animate-pending');
                  observers.animations.observe(node);
                }
              }
              
              // Check for module loading
              if (node.dataset && node.dataset.module) {
                if (observers.modules) {
                  observers.modules.observe(node);
                }
              }
              
              // Check for analytics tracking
              if (node.dataset && node.dataset.trackId) {
                if (observers.analytics) {
                  observers.analytics.observe(node);
                }
              }
            }
          });
        });
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  // ===== PUBLIC API =====
  window.IntersectionObserverEnhanced = {
    observe: function(element, type = 'animations', callback = null) {
      if (!element || !observers[type]) return;
      
      if (callback) {
        const wrappedCallback = (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              callback(entry);
            }
          });
        };
        
        const customObserver = new IntersectionObserver(wrappedCallback, configs[type]);
        customObserver.observe(element);
        return customObserver;
      } else {
        observers[type].observe(element);
      }
    },
    
    unobserve: function(element, type = 'animations') {
      if (!element || !observers[type]) return;
      observers[type].unobserve(element);
    },
    
    disconnect: function(type) {
      if (type && observers[type]) {
        observers[type].disconnect();
      } else {
        Object.values(observers).forEach(observer => {
          if (observer) observer.disconnect();
        });
      }
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
