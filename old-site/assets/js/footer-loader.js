/**
 * Footer Loader - Loads footer component dynamically
 * External file to comply with CSP (no inline scripts)
 */

(function loadFooter() {
  'use strict';
  
  // Timeout protection - prevent infinite hangs
  const TIMEOUT_MS = 10000; // 10 seconds
  let timeoutId;
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
    return;
  }
  
  const footerSection = document.getElementById('footer-section');
  if (!footerSection) {
    console.error('Footer container not found');
    return;
  }
  
  // Set timeout to prevent hanging
  timeoutId = setTimeout(function() {
    console.error('Footer load timeout after', TIMEOUT_MS, 'ms');
    const errorFallback = footerSection.querySelector('.footer-error-fallback');
    if (errorFallback) {
      errorFallback.classList.remove('visually-hidden');
    }
  }, TIMEOUT_MS);
  
  fetch('components/footer.html', { cache: 'no-cache' })
    .then(response => {
      clearTimeout(timeoutId); // Clear timeout on success
      if (!response.ok) {
        throw new Error('Footer not found: ' + response.status);
      }
      return response.text();
    })
    .then(html => {
      footerSection.innerHTML = html;
      
      // Load footer.js
      if (!document.querySelector('script[src*="footer.js"]')) {
        const script = document.createElement('script');
        script.src = 'components/footer.js';
        script.defer = true;
        document.body.appendChild(script);
      }
      
      console.log('Footer loaded successfully');
    })
    .catch(error => {
      clearTimeout(timeoutId); // Clear timeout on error
      console.error('Footer load error:', error);
      const errorFallback = footerSection.querySelector('.footer-error-fallback');
      if (errorFallback) {
        errorFallback.classList.remove('visually-hidden');
      }
    });
})();
