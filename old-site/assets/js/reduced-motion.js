/**
 * Reduced Motion JavaScript Support
 * Detects prefers-reduced-motion and disables JavaScript animations
 */

(function() {
  'use strict';

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Add class to html element
  if (prefersReducedMotion) {
    document.documentElement.classList.add('reduced-motion');
  }

  // Listen for changes
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', (e) => {
      if (e.matches) {
        document.documentElement.classList.add('reduced-motion');
      } else {
        document.documentElement.classList.remove('reduced-motion');
      }
    });
  }

  // Disable JavaScript animations if reduced motion is preferred
  if (prefersReducedMotion) {
    // Override common animation functions
    const originalAnimate = Element.prototype.animate;
    Element.prototype.animate = function(keyframes, options) {
      if (prefersReducedMotion) {
        // Return a minimal animation
        return originalAnimate.call(this, keyframes, {
          ...options,
          duration: 0,
          delay: 0
        });
      }
      return originalAnimate.call(this, keyframes, options);
    };

    // Disable scroll animations
    window.addEventListener('scroll', () => {
      // Cancel any scroll-based animations
      document.querySelectorAll('[data-scroll-animate]').forEach(el => {
        el.style.transform = 'none';
        el.style.opacity = '1';
      });
    }, { passive: true });

    // Disable Intersection Observer animations
    if (window.IntersectionObserverEnhanced) {
      const originalObserve = window.IntersectionObserverEnhanced.observe;
      window.IntersectionObserverEnhanced.observe = function(element, type, callback) {
        if (type === 'animations' && prefersReducedMotion) {
          // Skip animation observer
          element.classList.add('visible', 'animate-in');
          element.classList.remove('animate-pending');
          return;
        }
        return originalObserve.call(this, element, type, callback);
      };
    }
  }

  // Export preference
  window.prefersReducedMotion = prefersReducedMotion;

})();
