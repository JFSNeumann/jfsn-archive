/**
 * Back to Top Button
 * Smart button that only appears when needed
 * Only shows on pages with enough content to scroll
 */
(function() {
  'use strict';
  
  let backToTopBtn = null;
  let ticking = false;
  
  // Check if page has enough content to require scroll
  function pageNeedsBackToTop() {
    const pageHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    // Always return true - show button if scrolled down
    return true; // Changed: Always show button if scrolled
  }
  
  // Create button if it doesn't exist
  function createBackToTopButton() {
    let btn = document.querySelector('.back-to-top');
    if (!btn) {
      // Always create button, but only show if page needs it
      btn = document.createElement('button');
      btn.className = 'back-to-top';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Back to top');
      btn.setAttribute('title', 'Back to top');
      btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>';
      document.body.appendChild(btn);
    }
    return btn;
  }
  
  // Throttled scroll handler
  function toggleBackToTop() {
    if (!backToTopBtn) return;
    if (!ticking) {
      window.requestAnimationFrame(function() {
        const scrolled = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        
        // Show button if scrolled more than 300px
        if (scrolled > 300) {
          backToTopBtn.classList.add('visible');
          // Force visible styles
          backToTopBtn.style.display = 'flex';
          backToTopBtn.style.visibility = 'visible';
          backToTopBtn.style.opacity = '1';
          backToTopBtn.style.pointerEvents = 'auto';
        } else {
          backToTopBtn.classList.remove('visible');
          backToTopBtn.style.opacity = '0';
          backToTopBtn.style.pointerEvents = 'none';
        }
        
        ticking = false;
      });
      ticking = true;
    }
  }
  
  // Initialize - wait for DOM to be ready
  function init() {
    backToTopBtn = createBackToTopButton();
    if (!backToTopBtn) {
      // Retry if DOM not ready
      setTimeout(init, 100);
      return;
    }
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    });
    
    // Listen for scroll events (throttled via requestAnimationFrame)
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    
    // Check on resize (page might become scrollable)
    window.addEventListener('resize', function() {
      if (backToTopBtn) {
        if (!pageNeedsBackToTop()) {
          backToTopBtn.classList.remove('visible');
        } else {
          toggleBackToTop();
        }
      }
    }, { passive: true });
    
    // Initial check
    toggleBackToTop();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
