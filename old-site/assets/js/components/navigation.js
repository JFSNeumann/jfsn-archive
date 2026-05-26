/**
 * Navigation & Smooth Scroll
 * Handles enhanced navigation and scroll behavior
 */
document.addEventListener('DOMContentLoaded', function() {
  
  // Enhanced smooth scroll navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        // Calculate offset for fixed navbar
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const targetPosition = target.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Add active state to navigation link
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
        });
        this.classList.add('active');
      }
    });
  });
  
  // Active navigation highlighting based on scroll position
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  // Update active nav on scroll
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav(); // Initial call
  
  // Loading states for buttons and links
  function addLoadingState(button, duration = 2000) {
    button.classList.add('loading');
    button.disabled = true;
    
    setTimeout(() => {
      button.classList.remove('loading');
      button.disabled = false;
    }, duration);
  }
  
  // Add loading states to CTA buttons
  document.querySelectorAll('.hero-cta-button, .hero-cta-button-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
      // Don't add loading state for hash links (smooth scroll)
      if (this.getAttribute('href').startsWith('#')) {
        return;
      }
      
      addLoadingState(this, 1500);
    });
  });
});

