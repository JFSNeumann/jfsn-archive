/**
 * Service Worker Registration
 * Registers the service worker for PWA support
 */

(function() {
  'use strict';
  
  if ('serviceWorker' in navigator) {
    const params = new URLSearchParams(window.location.search);
    if (params.get('nosw') === '1') {
      return;
    }
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/pwa/service-worker.js')
        .then((registration) => {
          console.log('[SW] Service Worker registered:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[SW] New service worker available');
              }
            });
          });
        })
        .catch((error) => {
          console.log('[SW] Service Worker registration failed:', error);
        });
    });
  }
})();
