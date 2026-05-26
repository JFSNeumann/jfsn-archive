/**
 * Parallax Animation System using Unified Observer Manager
 * Provides smooth scroll-based animations for elements
 */

(function() {
  'use strict';
  
  // Wait for unified observer manager to be available
  function initParallaxSystem() {
    if (!window.ObserverManager) {
      setTimeout(initParallaxSystem, 50);
      return;
    }
    
    var ParallaxAnimator = {
      /**
       * Add parallax animation to an element
       * @param {string|HTMLElement} selector - CSS selector or element
       * @param {Object} options - Animation options
       */
      animate: function(selector, options) {
        var element = typeof selector === 'string' ? 
          window.DOMCache.get(selector) : selector;
        
        if (!element) return;
        
        // Default options
        var config = {
          direction: 'left',        // 'left', 'right', 'up', 'down'
          distance: 150,            // Distance to translate (px)
          scale: 0.9,               // Initial scale (0-1)
          duration: 1000,           // Animation duration (ms)
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          threshold: 0.2,           // Visibility threshold (0-1)
          delay: 100,               // Delay before animation starts (ms)
          once: true                // Animate only once
        };
        
        // Merge user options
        for (var key in options) {
          if (options.hasOwnProperty(key)) {
            config[key] = options[key];
          }
        }
        
        // Calculate initial transform based on direction
        var initialTransform = '';
        switch(config.direction) {
          case 'left':
            initialTransform = 'translateX(-' + config.distance + 'px)';
            break;
          case 'right':
            initialTransform = 'translateX(' + config.distance + 'px)';
            break;
          case 'up':
            initialTransform = 'translateY(-' + config.distance + 'px)';
            break;
          case 'down':
            initialTransform = 'translateY(' + config.distance + 'px)';
            break;
        }
        
        if (config.scale !== 1) {
          initialTransform += ' scale(' + config.scale + ')';
        }
        
        // Only hide and animate if threshold is > 0 (not immediate)
        // If threshold is 0, element should be visible immediately
        var shouldHideInitially = config.threshold > 0;
        
        if (shouldHideInitially) {
          // Set initial hidden state only if we're waiting for scroll
          element.style.setProperty('opacity', '0', 'important');
          element.style.setProperty('transform', initialTransform, 'important');
        } else {
          // For immediate animations (threshold: 0), start visible but with initial transform
          element.style.setProperty('transform', initialTransform, 'important');
        }
        
        element.style.setProperty('transition', 
          'opacity ' + (config.duration / 1000) + 's ' + config.easing + ', ' +
          'transform ' + (config.duration / 1000) + 's ' + config.easing, 
          'important'
        );
        
        var hasAnimated = false;
        
        // If threshold is 0, animate immediately without observer
        if (config.threshold === 0) {
          setTimeout(function() {
            element.style.setProperty('opacity', '1', 'important');
            element.style.setProperty('transform', 'translateX(0) translateY(0) scale(1)', 'important');
            hasAnimated = true;
          }, config.delay);
          return; // Don't use observer for immediate animations
        }
        
        // Use unified observer manager for scroll-triggered animations
        window.ObserverManager.observe(element, function(entry) {
          if (entry.isIntersecting && !hasAnimated) {
            // Animate in
            setTimeout(function() {
              element.style.setProperty('opacity', '1', 'important');
              element.style.setProperty('transform', 'translateX(0) translateY(0) scale(1)', 'important');
              hasAnimated = true;
            }, config.delay);
            
            // Stop observing if once is true
            if (config.once) {
              window.ObserverManager.unobserve(element);
            }
          } else if (!entry.isIntersecting && !config.once && hasAnimated) {
            // Reset animation if repeatable
            element.style.setProperty('opacity', '0', 'important');
            element.style.setProperty('transform', initialTransform, 'important');
            hasAnimated = false;
          }
        }, {
          threshold: config.threshold,
          rootMargin: '0px'
        });
      },
      
      /**
       * Batch animate multiple elements
       * @param {Array} animations - Array of {selector, options} objects
       */
      animateAll: function(animations) {
        var self = this;
        animations.forEach(function(anim) {
          self.animate(anim.selector, anim.options);
        });
      }
    };
    
    // Make globally accessible
    window.ParallaxAnimator = ParallaxAnimator;
    
    // Initialize animations when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        // Only animate elements that exist - don't hide hero if elements don't exist
        var heroHeadline = window.DOMCache.get('.editorial-hero-headline') || window.DOMCache.get('.hero-title-optimized');
        if (heroHeadline) {
          ParallaxAnimator.animate(heroHeadline, {
            direction: 'up',
            distance: 80,
            scale: 0.9,
            duration: 1200,
            delay: 300,
            threshold: 0 // Trigger immediately on page load
          });
        }
        
        var heroSubheadline = window.DOMCache.get('.editorial-hero-subheadline') || window.DOMCache.get('.hero-subtitle-optimized');
        if (heroSubheadline) {
          ParallaxAnimator.animate(heroSubheadline, {
            direction: 'up',
            distance: 60,
            scale: 0.95,
            duration: 1000,
            delay: 500,
            threshold: 0 // Trigger immediately
          });
        }
        
        // Hero Stats - Cascade from bottom
        var heroStats = window.DOMCache.getAll('.hero-stat');
        heroStats.forEach(function(stat, index) {
          ParallaxAnimator.animate(stat, {
            direction: 'up',
            distance: 70,
            scale: 0.85,
            duration: 900,
            delay: 700 + (index * 120),
            threshold: 0 // Trigger immediately
          });
        });
        
        // Hero CTA Buttons - Final entrance
        var heroCtaBtns = window.DOMCache.getAll('.hero-cta-btn');
        heroCtaBtns.forEach(function(btn, index) {
          ParallaxAnimator.animate(btn, {
            direction: 'up',
            distance: 50,
            scale: 0.9,
            duration: 800,
            delay: 1400 + (index * 150),
            threshold: 0 // Trigger immediately
          });
        });
        
        // Hero Scroll Indicator - Subtle bounce in
        var scrollIndicator = window.DOMCache.get('.hero-scroll-indicator');
        if (scrollIndicator) {
          ParallaxAnimator.animate(scrollIndicator, {
            direction: 'down',
            distance: 30,
            scale: 0.85,
            duration: 900,
            delay: 1800,
            threshold: 0 // Trigger immediately
          });
        }
      });
    } else {
      // DOM already ready
      setTimeout(function() {
        if (window.ParallaxAnimator && window.DOMCache) {
          // Only animate elements that exist - don't hide hero if elements don't exist
          var heroHeadline = window.DOMCache.get('.editorial-hero-headline') || window.DOMCache.get('.hero-title-optimized');
          if (heroHeadline) {
            ParallaxAnimator.animate(heroHeadline, {
              direction: 'up',
              distance: 80,
              scale: 0.9,
              duration: 1200,
              delay: 300,
              threshold: 0
            });
          }
          
          var heroSubheadline = window.DOMCache.get('.editorial-hero-subheadline') || window.DOMCache.get('.hero-subtitle-optimized');
          if (heroSubheadline) {
            ParallaxAnimator.animate(heroSubheadline, {
              direction: 'up',
              distance: 60,
              scale: 0.95,
              duration: 1000,
              delay: 500,
              threshold: 0
            });
          }
          
          var heroStats = window.DOMCache.getAll('.hero-stat');
          heroStats.forEach(function(stat, index) {
            ParallaxAnimator.animate(stat, {
              direction: 'up',
              distance: 70,
              scale: 0.85,
              duration: 900,
              delay: 700 + (index * 120),
              threshold: 0
            });
          });
          
          var heroCtaBtns = window.DOMCache.getAll('.hero-cta-btn');
          heroCtaBtns.forEach(function(btn, index) {
            ParallaxAnimator.animate(btn, {
              direction: 'up',
              distance: 50,
              scale: 0.9,
              duration: 800,
              delay: 1400 + (index * 150),
              threshold: 0
            });
          });
          
          var scrollIndicator = window.DOMCache.get('.hero-scroll-indicator');
          if (scrollIndicator) {
            ParallaxAnimator.animate(scrollIndicator, {
              direction: 'down',
              distance: 30,
              scale: 0.85,
              duration: 900,
              delay: 1800,
              threshold: 0
            });
          }
        }
      }, 100);
    }
  }
  
  // Start initialization
  initParallaxSystem();
})();

