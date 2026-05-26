/**
 * Mobile Navigation Active Page Indicator
 * Highlights current page in mobile menu
 */

(function() {
  'use strict';
  
  function setActiveNavItem() {
    // Get current page path
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Remove any existing active classes
    document.querySelectorAll('.mobile-nav-link, .mobile-nav-sub').forEach(link => {
      link.classList.remove('active');
    });
    
    // Find and highlight matching nav items
    document.querySelectorAll('.mobile-nav-link, .mobile-nav-sub').forEach(link => {
      const href = link.getAttribute('href');
      
      if (!href) return;
      
      // Skip external links and links that open in new tabs (Misc. section)
      if (link.getAttribute('target') === '_blank') return;
      
      // Skip old/ directory links (Sebastian projects, Mr.Snowmann)
      if (href.includes('old/') || href.includes('sebastian')) return;
      
      // Extract filename from href
      const linkPage = href.split('/').pop().split('?')[0].split('#')[0];
      
      // Check for exact match
      if (linkPage === currentPage) {
        link.classList.add('active');
        return;
      }
      
      // Special case: index.html or root
      if ((currentPage === 'index.html' || currentPage === '' || currentPath === '/') && 
          (linkPage === 'index.html' || href === '/' || href === './')) {
        link.classList.add('active');
        return;
      }
      
      // Special case: art.html variations
      if (currentPage === 'art.html' && linkPage === 'art.html') {
        link.classList.add('active');
        return;
      }
    });
  }
  
  // Set active on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setActiveNavItem);
  } else {
    setActiveNavItem();
  }
  
  // Update on navigation (for SPAs or dynamic loading)
  window.addEventListener('popstate', setActiveNavItem);
  
})();

