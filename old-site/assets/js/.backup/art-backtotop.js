/**
 * Art Gallery Back to Top JavaScript
 * Handles back to top button functionality
 */

// Back to Top Button
(function() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;
  
  // Show/hide based on scroll position
  function toggleBackToTop() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
  
  // Smooth scroll to top
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Listen for scroll events (throttled)
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(toggleBackToTop, 50);
  }, { passive: true });
  
  // Initial check
  toggleBackToTop();
})();
