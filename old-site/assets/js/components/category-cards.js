/**
 * Category Cards
 * Handles category card interactions and fixes
 */
document.addEventListener('DOMContentLoaded', function() {
  
  // Fix for category card vertical expansion
  // Remove card-hover class immediately on click to prevent expansion
  document.querySelectorAll('.category-card-wrapper a').forEach(link => {
    link.addEventListener('mousedown', function(e) {
      // Remove card-hover class from the card inside this link
      const card = this.querySelector('.category-card');
      if (card) {
        card.classList.remove('card-hover');
        // Also remove from any premium-card elements
        const premiumCards = card.querySelectorAll('.premium-card');
        premiumCards.forEach(pc => pc.classList.remove('card-hover'));
      }
    });
  });
  
  // Initialize tooltips for social buttons and other elements
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

