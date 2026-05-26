/**
 * Emergency Timeout Protection
 * Detects if page is hanging and shows emergency message
 * CSP compliant - external file instead of inline script
 */

(function() {
  'use strict';
  
  let pageLoaded = false;
  let timeoutShown = false;
  
  // Mark page as loaded after DOM is ready and some content exists
  function checkPageLoaded() {
    if (document.body && document.body.innerHTML.trim().length > 500) {
      pageLoaded = true;
    }
  }
  
  // Check immediately
  checkPageLoaded();
  
  // Check after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(checkPageLoaded, 1000);
    });
  } else {
    setTimeout(checkPageLoaded, 1000);
  }
  
  // Emergency timeout - show message if page is stuck after 10 seconds
  setTimeout(function() {
    if (!pageLoaded && !timeoutShown) {
      timeoutShown = true;
      
      // Show emergency message
      if (document.body) {
        const emergencyMsg = document.createElement('div');
        emergencyMsg.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);color:#fff;z-index:9999999;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:20px;font-family:Arial,sans-serif;text-align:center;';
        emergencyMsg.innerHTML = '<h1 style="color:#ff6b6b;margin-bottom:20px;">⚠️ Page Loading Slowly</h1>' +
          '<p style="font-size:18px;margin-bottom:20px;">The page is taking longer than expected to load.</p>' +
          '<p style="margin-bottom:30px;">This may be caused by JavaScript blocking the page.</p>' +
          '<div style="display:flex;gap:15px;flex-wrap:wrap;justify-content:center;">' +
          '<a href="/art-no-scripts.html" style="background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Test Without Scripts</a>' +
          '<a href="/index.html" style="background:#10b981;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Go to Homepage</a>' +
          '<button onclick="location.reload()" style="background:#f59e0b;color:#fff;padding:12px 24px;border-radius:8px;border:none;cursor:pointer;font-weight:bold;">Reload Page</button>' +
          '</div>' +
          '<p style="margin-top:30px;font-size:14px;color:#9ca3af;">If this message persists, try clearing your browser cache or using a different browser.</p>';
        document.body.appendChild(emergencyMsg);
        
        // Also try to log to console if possible
        try {
          console.error('⚠️ Page timeout detected - page may be hanging');
        } catch(e) {
          // Console not available
        }
      }
    }
  }, 10000); // 10 second timeout
  
  // Clear timeout message if page loads successfully
  setInterval(function() {
    if (pageLoaded && timeoutShown) {
      const emergencyMsg = document.querySelector('div[style*="position:fixed"][style*="z-index:9999999"]');
      if (emergencyMsg) {
        emergencyMsg.style.display = 'none';
      }
    }
  }, 1000);
})();
