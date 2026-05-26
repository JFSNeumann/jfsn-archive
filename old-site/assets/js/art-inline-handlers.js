/**
 * Art Page Inline Event Handlers
 * Replaces onclick handlers with CSP-compliant event listeners
 */

(function() {
  'use strict';
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHandlers);
  } else {
    initHandlers();
  }
  
  function initHandlers() {
    // Handle "Show All" buttons (onclick="document.querySelector('[data-category=all]').click()")
    document.querySelectorAll('button[data-action="show-all"]').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const allButton = document.querySelector('[data-category="all"]');
        if (allButton) {
          allButton.click();
        }
      });
    });
    
    // Handle FAB menu filter button (onclick="document.getElementById('filter-section').focus()")
    const filterFabButton = document.querySelector('.fab-menu-item[data-action="filter"]');
    if (filterFabButton) {
      filterFabButton.addEventListener('click', function(e) {
        e.preventDefault();
        const filterSection = document.getElementById('filter-section');
        if (filterSection) {
          filterSection.focus();
        }
      });
    }
    
    // Handle FAB menu share button (onclick="shareCurrentPage()")
    const shareFabButton = document.querySelector('.fab-menu-item[data-action="share"]');
    if (shareFabButton) {
      shareFabButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (typeof window.shareCurrentPage === 'function') {
          window.shareCurrentPage();
        }
      });
    }
    
    // Handle FAB menu theme button (onclick="document.getElementById('themeToggle').click()")
    const themeFabButton = document.querySelector('.fab-menu-item[data-action="theme"]');
    if (themeFabButton) {
      themeFabButton.addEventListener('click', function(e) {
        e.preventDefault();
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
          themeToggle.click();
        }
      });
    }
  }
})();
