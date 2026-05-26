/**
 * EMERGENCY OVERLAY FIX
 * Force-closes stuck overlay that's blocking page interaction
 * Run this from browser address bar: javascript:(function(){var s=document.createElement('script');s.src='https://jfsn.com/assets/js/emergency-overlay-fix.js';document.head.appendChild(s);})();
 */

(function() {
  'use strict';
  
  console.log('🚨 EMERGENCY OVERLAY FIX - Running...');
  
  // Force close overlay
  function forceCloseOverlay() {
    const overlay = document.getElementById('editorialNavOverlay');
    const toggle = document.getElementById('editorialNavToggle');
    
    if (overlay) {
      console.log('Found overlay, forcing close...');
      
      // Remove active class
      overlay.classList.remove('active');
      
      // Force hide with inline styles
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
      overlay.style.pointerEvents = 'none';
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
      
      // Reset toggle button
      if (toggle) {
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
      
      // Restore body scroll
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      
      console.log('✅ Overlay force-closed');
    } else {
      console.log('⚠️ Overlay not found');
    }
  }
  
  // Run immediately
  forceCloseOverlay();
  
  // Also remove any overlay elements that might be blocking
  const allOverlays = document.querySelectorAll('.editorial-nav-overlay, [id*="overlay"], [class*="overlay"]');
  allOverlays.forEach(overlay => {
    if (overlay.id === 'editorialNavOverlay') return; // Already handled
    
    const computedStyle = window.getComputedStyle(overlay);
    if (computedStyle.position === 'fixed' && 
        computedStyle.zIndex > 1000 &&
        overlay.classList.contains('active')) {
      console.log('Found blocking overlay:', overlay.id || overlay.className);
      overlay.style.display = 'none';
      overlay.classList.remove('active');
    }
  });
  
  // Ensure body is scrollable
  document.body.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto';
  
  console.log('✅ Emergency fix complete');
  
  // Show alert to user
  alert('Overlay force-closed! Page should be accessible now.');
})();
