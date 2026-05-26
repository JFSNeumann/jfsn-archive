/**
 * FAB Menu Functionality
 * Floating Action Button with quick actions menu
 */

(function() {
  'use strict';
  
  function setupFABMenu() {
    const fabButton = document.getElementById('fabButton');
    const fabMenu = document.getElementById('fabMenu');
    const fabBackdrop = document.getElementById('fabBackdrop');
    
    if (!fabButton || !fabMenu) return;
    
    fabButton.addEventListener('click', () => {
      const isActive = fabMenu.classList.contains('active');
      
      if (isActive) {
        fabMenu.classList.remove('active');
        fabButton.classList.remove('active');
        if (fabBackdrop) fabBackdrop.classList.remove('active');
        fabButton.setAttribute('aria-expanded', 'false');
      } else {
        fabMenu.classList.add('active');
        fabButton.classList.add('active');
        if (fabBackdrop) fabBackdrop.classList.add('active');
        fabButton.setAttribute('aria-expanded', 'true');
      }
    });
    
    if (fabBackdrop) {
      fabBackdrop.addEventListener('click', () => {
        fabMenu.classList.remove('active');
        fabButton.classList.remove('active');
        fabBackdrop.classList.remove('active');
        fabButton.setAttribute('aria-expanded', 'false');
      });
    }
    
    // Close on menu item click
    fabMenu.querySelectorAll('.fab-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        setTimeout(() => {
          fabMenu.classList.remove('active');
          fabButton.classList.remove('active');
          if (fabBackdrop) fabBackdrop.classList.remove('active');
          fabButton.setAttribute('aria-expanded', 'false');
        }, 300);
      });
    });
  }
  
  // Share current page function
  function shareCurrentPage() {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: 'Check out this page',
        url: window.location.href
      }).catch(() => {
        // Fallback to clipboard
        copyToClipboard(window.location.href);
      });
    } else {
      copyToClipboard(window.location.href);
    }
  }
  
  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        if (window.announceToScreenReader) {
          window.announceToScreenReader('Link copied to clipboard', 'polite');
        }
      });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      if (window.announceToScreenReader) {
        window.announceToScreenReader('Link copied to clipboard', 'polite');
      }
    }
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFABMenu);
  } else {
    setupFABMenu();
  }
  
  // Export for global use
  window.setupFABMenu = setupFABMenu;
  window.shareCurrentPage = shareCurrentPage;
  window.copyToClipboard = copyToClipboard;
})();

