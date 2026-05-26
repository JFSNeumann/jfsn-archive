/**
 * SWIPE GESTURES FOR NAVBAR OVERLAY
 * Swipe to open/close overlay on mobile devices
 */

(function() {
  'use strict';
  
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let minSwipeDistance = 50;
  let maxVerticalDistance = 100; // Prevent vertical scrolling from triggering swipe
  
  function initSwipeGestures() {
    const overlay = document.getElementById('editorialNavOverlay');
    const toggle = document.getElementById('editorialNavToggle');
    
    if (!overlay) return;
    
    // Swipe right from left edge to open
    document.addEventListener('touchstart', function(e) {
      // Only trigger from left edge (first 20px)
      if (e.touches[0].clientX < 20 && !overlay.classList.contains('active')) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
      if (touchStartX === 0) return;
      
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = Math.abs(touchEndY - touchStartY);
      
      // Swipe right to open
      if (deltaX > minSwipeDistance && deltaY < maxVerticalDistance && !overlay.classList.contains('active')) {
        if (typeof window.toggleNavbarOverlay === 'function') {
          window.toggleNavbarOverlay();
        } else if (toggle) {
          toggle.click();
        }
      }
      
      touchStartX = 0;
      touchStartY = 0;
    }, { passive: true });
    
    // Swipe left to close when overlay is open
    overlay.addEventListener('touchstart', function(e) {
      if (overlay.classList.contains('active')) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });
    
    overlay.addEventListener('touchend', function(e) {
      if (!overlay.classList.contains('active') || touchStartX === 0) return;
      
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchStartX - touchEndX; // Negative for left swipe
      const deltaY = Math.abs(touchEndY - touchStartY);
      
      // Swipe left to close
      if (deltaX > minSwipeDistance && deltaY < maxVerticalDistance) {
        if (typeof window.toggleNavbarOverlay === 'function') {
          window.toggleNavbarOverlay();
        } else {
          const closeBtn = document.getElementById('editorialNavClose');
          if (closeBtn) {
            closeBtn.click();
          }
        }
      }
      
      touchStartX = 0;
      touchStartY = 0;
    }, { passive: true });
    
    // Visual feedback during swipe
    let currentSwipeX = 0;
    overlay.addEventListener('touchmove', function(e) {
      if (!overlay.classList.contains('active')) return;
      
      currentSwipeX = e.touches[0].clientX;
      const deltaX = touchStartX - currentSwipeX;
      
      // Only apply visual feedback for left swipes
      if (deltaX > 0 && deltaX < 300) {
        const content = overlay.querySelector('.editorial-nav-overlay-content');
        if (content) {
          const translateX = Math.max(0, -deltaX);
          content.style.transform = `translateX(${translateX}px)`;
          overlay.style.opacity = String(1 - (deltaX / 300));
        }
      }
    }, { passive: true });
    
    // Reset transform on touch end
    overlay.addEventListener('touchend', function() {
      const content = overlay.querySelector('.editorial-nav-overlay-content');
      if (content) {
        content.style.transform = '';
        overlay.style.opacity = '';
      }
    }, { passive: true });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwipeGestures);
  } else {
    // Wait for navbar to load
    setTimeout(initSwipeGestures, 500);
  }
  
  // Re-initialize if navbar is loaded dynamically
  const observer = new MutationObserver(() => {
    const overlay = document.getElementById('editorialNavOverlay');
    if (overlay && !overlay.hasAttribute('data-swipe-initialized')) {
      overlay.setAttribute('data-swipe-initialized', 'true');
      initSwipeGestures();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Expose globally
  window.navbarSwipeGestures = {
    init: initSwipeGestures
  };
  
})();

