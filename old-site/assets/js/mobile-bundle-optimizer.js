/**
 * Mobile JavaScript Bundle Optimizer
 * Defers non-critical scripts and batches loading for better mobile performance
 */

(function() {
  'use strict';
  
  // Detect mobile device
  const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (!isMobile) return;
  
  // List of scripts to defer on mobile (non-critical enhancements)
  const deferrableScripts = [
    'art-quickview.js',
    'art-viewmode.js',
    'art-swipe.js',
    'art-backtotop.js',
    'components/back-to-top.js'
  ];
  
  // Critical scripts that must load immediately
  const criticalScripts = [
    'art-gallery.js',
    'art-favorites.js',
    'art-fancybox.js',
    'art-infinitescroll.js'
  ];
  
  // Function to load scripts in batches after idle time
  function loadBatch(scripts, delay = 0) {
    if (scripts.length === 0) return;
    
    const script = scripts.shift();
    const scriptElement = document.querySelector(`script[src*="${script}"]`);
    
    if (!scriptElement) {
      // Script not found, continue with next
      if (scripts.length > 0) {
        requestIdleCallback(() => loadBatch(scripts, delay), { timeout: 1000 });
      }
      return;
    }
    
    // Check if already loaded
    if (scriptElement.hasAttribute('data-loaded')) {
      if (scripts.length > 0) {
        requestIdleCallback(() => loadBatch(scripts, delay), { timeout: 1000 });
      }
      return;
    }
    
    // Mark as loaded
    scriptElement.setAttribute('data-loaded', 'true');
    
    // Load next script after a delay
    setTimeout(() => {
      if (scripts.length > 0) {
        requestIdleCallback(() => loadBatch(scripts, delay), { timeout: 1000 });
      }
    }, delay);
  }
  
  // Wait for page load, then batch load non-critical scripts
  if (document.readyState === 'complete') {
    // Use requestIdleCallback or setTimeout as fallback
    const loadDeferred = () => {
      const deferred = Array.from(document.querySelectorAll('script[src][defer]'))
        .filter(script => {
          const src = script.getAttribute('src');
          return deferrableScripts.some(name => src.includes(name));
        });
      
      if (deferred.length > 0) {
        // Add delay between loads to prevent blocking
        deferred.forEach((script, index) => {
          setTimeout(() => {
            if (!script.hasAttribute('data-loaded')) {
              script.setAttribute('data-loaded', 'true');
            }
          }, index * 100); // Stagger by 100ms
        });
      }
    };
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadDeferred, { timeout: 3000 });
    } else {
      setTimeout(loadDeferred, 2000);
    }
  } else {
    window.addEventListener('load', () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          // Mark deferred scripts as loaded in batches
          const deferred = Array.from(document.querySelectorAll('script[src][defer]'))
            .filter(script => {
              const src = script.getAttribute('src');
              return deferrableScripts.some(name => src.includes(name));
            });
          
          deferred.forEach((script, index) => {
            setTimeout(() => {
              script.setAttribute('data-mobile-deferred', 'true');
            }, index * 150);
          });
        }, { timeout: 3000 });
      }
    });
  }
  
  // Reduce animation complexity on mobile
  const reduceAnimations = () => {
    const style = document.createElement('style');
    style.id = 'mobile-animation-reduction';
    style.textContent = `
      @media (max-width: 768px) {
        /* Reduce animation complexity */
        * {
          animation-duration: calc(var(--animation-duration, 1s) * 1.2) !important;
          transition-duration: calc(var(--transition-duration, 0.3s) * 1.2) !important;
        }
        
        /* Simplify transforms */
        .artwork-card:hover,
        .category-card:hover {
          transform: translateY(-2px) !important;
        }
        
        /* Disable expensive effects */
        .ken-burns-animation,
        .parallax-bg {
          animation: none !important;
          transform: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  };
  
  // Run optimizations
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', reduceAnimations);
  } else {
    reduceAnimations();
  }
  
  // Log only in debug mode
  if (typeof window.DEBUG !== 'undefined' && window.DEBUG) {
  }
})();

