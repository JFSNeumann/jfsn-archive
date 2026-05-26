/**
 * Category Card 3D Parallax Effect
 * Mouse tracking for immersive hover interactions
 */

function initCategoryCardParallax() {
  const cards = document.querySelectorAll('.category-card');
  
  cards.forEach(card => {
    // Enable 3D transforms
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'transform 0.1s ease-out';
    
    // Get inner elements for layered parallax
    const image = card.querySelector('.category-card-image');
    const body = card.querySelector('.card-body');
    const footer = card.querySelector('.card-footer-cta');
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation (-15deg to +15deg)
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      // Apply 3D transform to card
      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(1.02, 1.02, 1.02)
      `;
      
      // Layered parallax effect on inner elements
      if (image) {
        const imageDepth = 20;
        const imgX = ((x - centerX) / centerX) * imageDepth;
        const imgY = ((y - centerY) / centerY) * imageDepth;
        image.style.transform = `translateZ(30px) translateX(${imgX}px) translateY(${imgY}px)`;
      }
      
      if (body) {
        const bodyDepth = 10;
        const bodyX = ((x - centerX) / centerX) * bodyDepth;
        const bodyY = ((y - centerY) / centerY) * bodyDepth;
        body.style.transform = `translateZ(50px) translateX(${bodyX}px) translateY(${bodyY}px)`;
      }
      
      if (footer) {
        footer.style.transform = 'translateZ(70px)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      // Reset transforms
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      
      if (image) image.style.transform = 'translateZ(0px) translateX(0px) translateY(0px)';
      if (body) body.style.transform = 'translateZ(0px) translateX(0px) translateY(0px)';
      if (footer) footer.style.transform = 'translateZ(0px)';
    });
    
    // Add transition to inner elements
    if (image) image.style.transition = 'transform 0.1s ease-out';
    if (body) body.style.transition = 'transform 0.1s ease-out';
    if (footer) footer.style.transition = 'transform 0.1s ease-out';
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initCategoryCardParallax);

// Re-initialize when cards are updated
document.addEventListener('cardsUpdated', initCategoryCardParallax);

// Export
window.initCategoryCardParallax = initCategoryCardParallax;

