/**
 * Navbar Loader - Loads navbar component dynamically
 * External file to comply with CSP (no inline scripts)
 */

(function loadNavbar() {
  'use strict';
  
  // CRITICAL: Timeout protection - prevent infinite hangs
  const TIMEOUT_MS = 15000; // Allow slow networks on live
  let timeoutId;
  let fetchAborted = false;
  
  // CRITICAL: Don't run if DOM isn't ready - wait for it
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
    return;
  }
  
  // CRITICAL: Ensure navbar-section exists before proceeding
  const navbarSection = document.getElementById('navbar-section');
  if (!navbarSection) {
    // Retry once after short delay, then give up
    setTimeout(function() {
      const retrySection = document.getElementById('navbar-section');
      if (!retrySection) {
        console.error('Navbar container not found after retry - page may not have navbar section');
        return;
      }
      // Retry with existing section
      loadNavbar();
    }, 100);
    return;
  }
  
  // Use navbar-unified.html which has all the hamburger menu fixes
  const navbarPath = '/components/navbar-unified.html?v=' + Date.now();
  
  console.log('Loading navbar from:', navbarPath);
  
  // CRITICAL: Use AbortController to cancel the fetch on timeout
  const controller = new AbortController();
  const signal = controller.signal;
  
  // Single timeout: abort fetch and show warning
  timeoutId = setTimeout(function() {
    fetchAborted = true;
    controller.abort();
    console.error('⚠️ Navbar load timeout after', TIMEOUT_MS, 'ms - continuing without navbar');
    if (navbarSection && !navbarSection.innerHTML.includes('navbar')) {
      navbarSection.innerHTML = '<div class="alert alert-warning m-3">Navigation loading slowly. Page will continue to load.</div>';
    }
    // Don't block page - continue loading
  }, TIMEOUT_MS);
  
  fetch(navbarPath, { 
    cache: 'no-store', 
    headers: { 'Cache-Control': 'no-cache' },
    signal: signal // CRITICAL: Allow fetch to be aborted
  })
    .then(response => {
      clearTimeout(timeoutId);
      console.log('Navbar fetch response:', response.status, response.statusText);
      if (!response.ok) {
        throw new Error('Navbar file not found: ' + response.status + ' ' + response.statusText);
      }
      return response.text();
    })
    .then(html => {
      clearTimeout(timeoutId);
      console.log('✅ Navbar HTML loaded, length:', html.length);
      console.log('✅ Loading from: navbar-unified.html (CORRECT)');
      
      if (!html || html.trim().length === 0) {
        throw new Error('Navbar HTML is empty');
      }
      
      navbarSection.innerHTML = html;
      
      // CRITICAL: Move overlay to body immediately after loading
      // This ensures proper z-index stacking and prevents CSS conflicts
      const overlay = document.getElementById('editorialNavOverlay');
      if (overlay && overlay.parentElement !== document.body) {
        document.body.appendChild(overlay);
      }
      
      // Remove loading indicator
      const loadingIndicator = document.getElementById('navbar-loading');
      if (loadingIndicator) {
        loadingIndicator.remove();
      }
      
      // Load navbar enhancements bundle (combines 7 enhancement files)
      if (!document.querySelector('script[src*="navbar-enhancements-bundle.js"]')) {
        const enhancementsBundleScript = document.createElement('script');
        enhancementsBundleScript.src = '/components/navbar/js/navbar-enhancements-bundle.js';
        enhancementsBundleScript.defer = true;
        enhancementsBundleScript.addEventListener('error', function() {
          console.error('Failed to load navbar-enhancements-bundle.js');
        });
        document.head.appendChild(enhancementsBundleScript);
      }
      
      // Load navbar.js if not already loaded
      // CRITICAL: Add timeout protection to prevent infinite hangs
      let navbarScriptTimeout;
      if (!document.querySelector('script[src*="navbar.js"]')) {
        const navbarScript = document.createElement('script');
        navbarScript.src = '/components/navbar/js/navbar.js';
        
        // Set timeout for navbar.js load (5 seconds max)
        navbarScriptTimeout = setTimeout(function() {
          console.warn('⚠️ navbar.js load timeout - continuing without it');
          // Don't block page - hamburger-menu-fix.js will handle menu initialization
        }, 5000);
        
        // Use addEventListener instead of onload/onerror (CSP compliant)
        navbarScript.addEventListener('load', function() {
          clearTimeout(navbarScriptTimeout); // Clear timeout on success
          console.log('navbar.js loaded');
          // Wait for navbar HTML to be fully inserted into DOM
          setTimeout(() => {
            // Verify toggle button exists
            const toggle = document.getElementById('editorialNavToggle');
            console.log('Toggle button found:', !!toggle);
            
            // Initialize navbar after script loads and DOM is ready
            // CRITICAL: Only call if function exists - don't retry indefinitely
            if (typeof window.initNavbar === 'function') {
              console.log('Calling initNavbar...');
              try {
                window.initNavbar();
              } catch (e) {
                console.error('Error calling initNavbar:', e);
                // Don't retry - let hamburger-menu-fix.js handle it
              }
            } else {
              console.warn('initNavbar function not available - hamburger-menu-fix.js will handle menu');
              // Don't retry - hamburger-menu-fix.js will initialize menu
            }
            
            // Ensure active page highlighting runs after navbar is fully loaded
            setTimeout(() => {
              if (window.navbar && typeof window.navbar.updateActivePage === 'function') {
                try {
                  window.navbar.updateActivePage();
                } catch (e) {
                  console.error('Error updating active page:', e);
                }
              }
            }, 600);
          }, 300);
        });
        navbarScript.addEventListener('error', function() {
          clearTimeout(navbarScriptTimeout); // Clear timeout on error
          console.warn('⚠️ Failed to load navbar.js - hamburger-menu-fix.js will handle menu initialization');
          // Don't block - hamburger-menu-fix.js will handle menu
        });
        document.body.appendChild(navbarScript);
      } else {
        // Script already loaded, just initialize (with timeout protection)
        const initTimeout = setTimeout(function() {
          console.warn('⚠️ initNavbar timeout - continuing');
        }, 2000);
        
        setTimeout(() => {
          if (typeof window.initNavbar === 'function') {
            clearTimeout(initTimeout);
            try {
              window.initNavbar();
            } catch (e) {
              console.error('Error calling initNavbar:', e);
            }
          } else {
            clearTimeout(initTimeout);
            console.warn('initNavbar not available - hamburger-menu-fix.js will handle menu');
          }
        }, 200);
      }
      
      console.log('Navbar loaded successfully');
    })
    .catch(error => {
      clearTimeout(timeoutId); // Clear timeout on error
      
      // CRITICAL: Don't log errors if fetch was intentionally aborted
      if (error.name !== 'AbortError' && !fetchAborted) {
        console.error('Navbar loading error:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          path: navbarPath
        });
      }
      
      // CRITICAL: Don't show error message if timeout - just continue
      if (!fetchAborted && navbarSection && !navbarSection.innerHTML.includes('navbar')) {
        navbarSection.innerHTML = '<div class="alert alert-warning m-3">Navigation unavailable. Page will continue to load.</div>';
      }
      
      // CRITICAL: Don't block page - continue loading even if navbar fails
    });
})();
