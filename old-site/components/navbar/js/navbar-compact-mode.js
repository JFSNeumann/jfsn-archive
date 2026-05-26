/**
 * COMPACT MODE TOGGLE
 * User can toggle compact/expanded navbar
 */

(function() {
  'use strict';
  
  function initCompactMode() {
    const navbar = document.querySelector('.editorial-navbar, .navbar-enhanced, .header.navbar');
    if (!navbar) return;
    
    // Check localStorage for saved preference
    const savedMode = localStorage.getItem('navbar-compact-mode');
    if (savedMode === 'true') {
      navbar.classList.add('compact');
    }
    
    // Create toggle button
    const toggle = document.createElement('button');
    toggle.className = 'navbar-compact-toggle d-none d-lg-flex';
    toggle.setAttribute('aria-label', 'Toggle compact mode');
    toggle.setAttribute('aria-pressed', savedMode === 'true' ? 'true' : 'false');
    toggle.innerHTML = '<i class="bx bx-chevron-up"></i>';
    
    // Find where to insert toggle (after search button, before hamburger)
    const searchToggle = document.getElementById('navbarSearchToggle');
    const hamburgerToggle = document.getElementById('editorialNavToggle');
    
    if (searchToggle && hamburgerToggle) {
      searchToggle.parentNode.insertBefore(toggle, hamburgerToggle);
    } else if (hamburgerToggle) {
      hamburgerToggle.parentNode.insertBefore(toggle, hamburgerToggle);
    }
    
    // Toggle functionality
    toggle.addEventListener('click', function() {
      const isCompact = navbar.classList.contains('compact');
      
      if (isCompact) {
        navbar.classList.remove('compact');
        toggle.setAttribute('aria-pressed', 'false');
        toggle.querySelector('i').classList.remove('bx-chevron-down');
        toggle.querySelector('i').classList.add('bx-chevron-up');
        localStorage.setItem('navbar-compact-mode', 'false');
      } else {
        navbar.classList.add('compact');
        toggle.setAttribute('aria-pressed', 'true');
        toggle.querySelector('i').classList.remove('bx-chevron-up');
        toggle.querySelector('i').classList.add('bx-chevron-down');
        localStorage.setItem('navbar-compact-mode', 'true');
      }
      
      // Update body padding
      const navbarHeight = navbar.offsetHeight;
      document.documentElement.style.setProperty('--navbar-height', navbarHeight + 'px');
    });
    
    // Update icon based on current state
    if (navbar.classList.contains('compact')) {
      toggle.querySelector('i').classList.remove('bx-chevron-up');
      toggle.querySelector('i').classList.add('bx-chevron-down');
    }
    
    // Update body padding on load
    const navbarHeight = navbar.offsetHeight;
    document.documentElement.style.setProperty('--navbar-height', navbarHeight + 'px');
  }
  
  // DISABLED: Compact mode toggle removed per user request
  // Initialize when DOM is ready
  // if (document.readyState === 'loading') {
  //   document.addEventListener('DOMContentLoaded', initCompactMode);
  // } else {
  //   setTimeout(initCompactMode, 500);
  // }
  
  // Re-initialize if navbar is loaded dynamically
  // const observer = new MutationObserver(() => {
  //   const navbar = document.querySelector('.editorial-navbar, .navbar-enhanced, .header.navbar');
  //   const toggle = document.querySelector('.navbar-compact-toggle');
  //   if (navbar && !toggle) {
  //     initCompactMode();
  //   }
  // });
  
  // observer.observe(document.body, {
  //   childList: true,
  //   subtree: true
  // });
  
  // Expose globally
  // window.navbarCompactMode = {
  //   init: initCompactMode,
  //   toggle: function() {
  //     const navbar = document.querySelector('.editorial-navbar, .navbar-enhanced, .header.navbar');
  //     const toggle = document.querySelector('.navbar-compact-toggle');
  //     if (toggle) {
  //       toggle.click();
  //     }
  //   }
  // };
  
})();

