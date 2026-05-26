/**
 * Animated Count-up for Category Artwork Numbers
 * Numbers count up from 0 when scrolled into view
 */

function animateCount(element, target, duration = 1500) {
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out cubic)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * easeOut);
    
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target; // Ensure final value is exact
    }
  }
  
  requestAnimationFrame(update);
}

function initCategoryCountAnimation() {
  const counts = document.querySelectorAll('.category-count');
  
  // Create Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        const target = parseInt(entry.target.textContent, 10);
        
        // Mark as animated to prevent re-triggering
        entry.target.dataset.animated = 'true';
        
        // Start from 0
        entry.target.textContent = '0';
        
        // Animate after small delay
        setTimeout(() => {
          animateCount(entry.target, target);
        }, 100);
        
        // Stop observing this element
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5, // Trigger when 50% visible
    rootMargin: '50px'
  });
  
  // Observe all count elements
  counts.forEach(count => observer.observe(count));
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initCategoryCountAnimation);

// Export
window.initCategoryCountAnimation = initCategoryCountAnimation;

