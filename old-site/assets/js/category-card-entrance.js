/**
 * Smooth Entrance Animations for Category Cards
 * Staggered fade-in and slide-up effect
 */

function initCategoryCardEntrance() {
  const cards = document.querySelectorAll('.category-card-wrapper');
  
  // Initially hide all cards
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  });
  
  // Create Intersection Observer for entrance animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        // Mark as animated
        entry.target.dataset.animated = 'true';
        
        // Calculate stagger delay based on index
        const cards = Array.from(document.querySelectorAll('.category-card-wrapper'));
        const cardIndex = cards.indexOf(entry.target);
        const delay = cardIndex * 80; // 80ms stagger
        
        // Animate after delay
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
        
        // Stop observing
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15, // Trigger when 15% visible
    rootMargin: '0px 0px -50px 0px' // Slightly before entering viewport
  });
  
  // Observe all cards
  cards.forEach(card => observer.observe(card));
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initCategoryCardEntrance, 100);
});

// Export
window.initCategoryCardEntrance = initCategoryCardEntrance;

