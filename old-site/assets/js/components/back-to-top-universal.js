/**
 * Universal Back to Top Button
 * Works with #backToTopBtn on all pages
 * Simple, reliable implementation
 */

(function() {
  'use strict';
  
  function initBackToTop() {
    const btn = document.getElementById('backToTopBtn');
    if (!btn) {
      // Retry if button not found yet
      setTimeout(initBackToTop, 200);
      return;
    }
    
    // Ensure button is visible and styled
    btn.style.cssText = `
      position: fixed !important;
      bottom: 2rem !important;
      right: 2rem !important;
      width: 3rem !important;
      height: 3rem !important;
      background: #6366f1 !important;
      color: #fff !important;
      border: none !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      z-index: 999999 !important;
      font-size: 1.25rem !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
      pointer-events: auto !important;
      opacity: 1 !important;
      visibility: visible !important;
      transition: background-color 0.2s ease, transform 0.2s ease !important;
    `;
    
    // Hover effect
    btn.addEventListener('mouseenter', function() {
      this.style.background = '#4f46e5';
      this.style.transform = 'translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.background = '#6366f1';
      this.style.transform = 'translateY(0)';
    });
    
    // Click handler
    function scrollToTop(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    
    // Add multiple event handlers for reliability
    btn.onclick = scrollToTop;
    btn.addEventListener('click', scrollToTop, true);
    btn.addEventListener('touchend', scrollToTop, true);
    
    // Keyboard support
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        scrollToTop(e);
      }
    });
    
    // Mobile adjustments
    if (window.matchMedia('(max-width: 768px)').matches) {
      btn.style.bottom = '1.5rem';
      btn.style.right = '1.5rem';
      btn.style.width = '2.75rem';
      btn.style.height = '2.75rem';
    }
  }
  
  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackToTop);
  } else {
    initBackToTop();
  }
  
  // Also try after a delay for dynamically loaded content
  setTimeout(initBackToTop, 500);
  setTimeout(initBackToTop, 1000);
  
})();

