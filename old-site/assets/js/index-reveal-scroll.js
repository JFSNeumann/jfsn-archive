/**
 * Scroll Reveal Animation for reveal-on-scroll elements
 * Adds 'revealed' class when elements enter viewport
 */

(function() {
  'use strict';
  
  function initScrollReveal() {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Show all elements immediately
      document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        el.classList.add('revealed');
      });
      return;
    }
    
    const observerOptions = {
      threshold: 0.01, // Lower threshold to trigger sooner
      rootMargin: '100px 0px -50px 0px' // Start revealing 100px before entering viewport
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Check and reveal elements already in viewport
    function checkInitialViewport() {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) {
          el.classList.add('revealed');
        } else {
          observer.observe(el);
        }
      });
    }
    
    // Observe all reveal-on-scroll elements
    checkInitialViewport();
    
    // Also check on scroll for any missed elements
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        document.querySelectorAll('.reveal-on-scroll:not(.revealed)').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
            el.classList.add('revealed');
            observer.unobserve(el);
          }
        });
      }, 100);
    }, { passive: true });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }
  
  // Fallback: Show all elements after a delay if script fails
  setTimeout(() => {
    document.querySelectorAll('.reveal-on-scroll:not(.revealed)').forEach(el => {
      el.classList.add('revealed');
    });
  }, 2000);
})();

