/**
 * LAZY LOAD MENU ITEMS
 * Load menu content progressively for better performance
 */

(function() {
  'use strict';
  
  function lazyLoadMenuItems() {
    const menu = document.querySelector('.editorial-nav-overlay-menu');
    if (!menu) return;
    
    const menuItems = menu.querySelectorAll('li');
    const observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          
          // Add loaded class
          item.classList.add('menu-item-loaded');
          
          // Load icon if not already loaded
          const icon = item.querySelector('i');
          if (icon && !icon.classList.contains('loaded')) {
            icon.classList.add('loaded');
            // Trigger icon animation
            setTimeout(() => {
              icon.style.opacity = '1';
              icon.style.transform = 'scale(1)';
            }, 100);
          }
          
          // Load link text
          const link = item.querySelector('a');
          if (link && !link.classList.contains('loaded')) {
            link.classList.add('loaded');
            setTimeout(() => {
              link.style.opacity = '1';
              link.style.transform = 'translateX(0)';
            }, 150);
          }
          
          // Unobserve after loading
          observer.unobserve(item);
        }
      });
    }, observerOptions);
    
    // Observe all menu items
    menuItems.forEach(item => {
      // Set initial state
      item.style.opacity = '0';
      item.style.transform = 'translateY(10px)';
      item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      const icon = item.querySelector('i');
      if (icon) {
        icon.style.opacity = '0';
        icon.style.transform = 'scale(0.8)';
        icon.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      }
      
      const link = item.querySelector('a');
      if (link) {
        link.style.opacity = '0';
        link.style.transform = 'translateX(-10px)';
        link.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      }
      
      observer.observe(item);
    });
  }
  
  // Initialize when overlay opens
  function initLazyLoad() {
    const overlay = document.getElementById('editorialNavOverlay');
    if (!overlay) return;
    
    // Watch for overlay opening
    const overlayObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (overlay.classList.contains('active')) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
              lazyLoadMenuItems();
            }, 100);
          }
        }
      });
    });
    
    overlayObserver.observe(overlay, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    // Also check if overlay is already open
    if (overlay.classList.contains('active')) {
      setTimeout(() => {
        lazyLoadMenuItems();
      }, 100);
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoad);
  } else {
    initLazyLoad();
  }
  
  // Expose globally
  window.navbarLazyLoad = {
    init: initLazyLoad,
    loadItems: lazyLoadMenuItems
  };
  
})();

