/**
 * Mobile Bottom Navigation Bar
 * Handles scroll hide/show behavior and active state management
 */

(function() {
  'use strict';
  
  // Only run on mobile devices
  const isMobile = window.innerWidth <= 991.98;
  if (!isMobile) return;
  
  const bottomNav = document.getElementById('mobileBottomNav');
  if (!bottomNav) return;
  
  let lastScrollY = window.scrollY;
  let scrollTimeout = null;
  let isScrolling = false;
  
  // Determine current page
  function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('art.html')) return 'art';
    if (path.includes('timeline.html')) return 'timeline';
    if (path.includes('about.html')) return 'about';
    if (path.includes('contact.html')) return 'contact';
    if (path.includes('portfolio.html')) return 'portfolio';
    if (path.includes('design.html')) return 'design';
    return 'home';
  }
  
  // Set active state based on current page
  function setActiveState() {
    const currentPage = getCurrentPage();
    const navItems = bottomNav.querySelectorAll('.mobile-bottom-nav-item');
    
    navItems.forEach(item => {
      const page = item.getAttribute('data-page');
      if (page === currentPage) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
  
  // Handle scroll behavior - hide on scroll down, show on scroll up
  function handleScroll() {
    if (isScrolling) return;
    
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    
    // Only hide/show if scrolled more than 10px
    if (Math.abs(scrollDelta) > 10) {
      if (scrollDelta > 0 && currentScrollY > 100) {
        // Scrolling down - hide nav
        bottomNav.classList.add('hidden');
      } else if (scrollDelta < 0) {
        // Scrolling up - show nav
        bottomNav.classList.remove('hidden');
      }
      
      lastScrollY = currentScrollY;
    }
    
    // Clear timeout
    clearTimeout(scrollTimeout);
    
    // Show nav when scrolling stops
    scrollTimeout = setTimeout(() => {
      bottomNav.classList.remove('hidden');
      isScrolling = false;
    }, 150);
    
    isScrolling = true;
  }
  
  // Optimized scroll handler with RAF
  let scrollTicking = false;
  function optimizedScrollHandler() {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        handleScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }
  
  // Initialize
  function init() {
    // Set active state
    setActiveState();
    
    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    
    // Show nav on touch start (user wants to interact)
    document.addEventListener('touchstart', () => {
      bottomNav.classList.remove('hidden');
    }, { passive: true });
    
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        lastScrollY = window.scrollY;
        bottomNav.classList.remove('hidden');
      }, 100);
    });
    
    // Show nav when at top of page
    if (window.scrollY < 100) {
      bottomNav.classList.remove('hidden');
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Re-initialize on resize (in case user rotates device)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth <= 991.98) {
        setActiveState();
      }
    }, 250);
  }, { passive: true });
  
})();

