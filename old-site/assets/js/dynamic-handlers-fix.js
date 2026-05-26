/**
 * Dynamic Event Handlers Fix
 * Replaces programmatically set onclick handlers with addEventListener (CSP compliant)
 * Handles dynamically loaded components
 */

(function() {
  'use strict';
  
  function initDynamicHandlers() {
    // Handle FAB menu items from enhanced-features.html
    document.querySelectorAll('.fab-menu-item[data-action="search"]').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const searchToggle = document.getElementById('navbarSearchToggle');
        if (searchToggle) {
          searchToggle.click();
        }
      });
    });
    
    document.querySelectorAll('.fab-menu-item[data-action="filter"]').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const filterBtn = document.querySelector('.filter-btn');
        if (filterBtn) {
          filterBtn.scrollIntoView({behavior: 'smooth'});
        }
      });
    });
    
    document.querySelectorAll('.fab-menu-item[data-action="share"]').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        if (typeof window.shareCurrentPage === 'function') {
          window.shareCurrentPage();
        }
      });
    });
    
    document.querySelectorAll('.fab-menu-item[data-action="theme"]').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
          themeToggle.click();
        }
      });
    });
    
    // Handle "show all filters" button from template-filter-section.html
    document.querySelectorAll('[data-action="show-all-filters"]').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const allFilterBtn = document.querySelector('[data-filter="all"]');
        if (allFilterBtn) {
          allFilterBtn.click();
        }
      });
    });
    
    // Handle reload button from template-loader.js
    document.querySelectorAll('[data-action="reload-page"]').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        location.reload();
      });
    });
  }
  
  // Initialize immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDynamicHandlers);
  } else {
    initDynamicHandlers();
  }
  
  // Also watch for dynamically added elements
  const observer = new MutationObserver(function(mutations) {
    let shouldReinit = false;
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            if (node.matches && (
              node.matches('.fab-menu-item') ||
              node.matches('[data-action="show-all-filters"]') ||
              node.matches('[data-action="reload-page"]') ||
              node.querySelector('.fab-menu-item') ||
              node.querySelector('[data-action="show-all-filters"]') ||
              node.querySelector('[data-action="reload-page"]')
            )) {
              shouldReinit = true;
            }
          }
        });
      }
    });
    if (shouldReinit) {
      initDynamicHandlers();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
