/**
 * Navbar Loader for Index Page
 * Loads navbar.js and navbar-enhancements-bundle.js after navbar HTML is in DOM
 * CSP-compliant (no inline scripts)
 * 
 * This file replaces the inline script that was causing CSP violations
 */

(function() {
  'use strict';
  
  // Load navbar.js after navbar HTML is in DOM
  if (!document.querySelector('script[src*="navbar.js"]')) {
    const navbarScript = document.createElement('script');
    navbarScript.src = '/components/navbar/js/navbar.js';
    navbarScript.addEventListener('load', function() {
      if (typeof window.initNavbar === 'function') {
        setTimeout(() => {
          try {
            window.initNavbar();
          } catch (e) {
            console.error('Error calling initNavbar:', e);
          }
        }, 100);
      }
    });
    navbarScript.addEventListener('error', function() {
      console.warn('⚠️ Failed to load navbar.js - hamburger-menu-fix.js will handle menu');
    });
    document.body.appendChild(navbarScript);
  }
  
  // Load navbar enhancements bundle
  if (!document.querySelector('script[src*="navbar-enhancements-bundle.js"]')) {
    const enhancementsScript = document.createElement('script');
    enhancementsScript.src = '/components/navbar/js/navbar-enhancements-bundle.js';
    enhancementsScript.defer = true;
    enhancementsScript.addEventListener('error', function() {
      console.warn('Failed to load navbar-enhancements-bundle.js');
    });
    document.head.appendChild(enhancementsScript);
  }
})();
