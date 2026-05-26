/**
 * Art Gallery Mobile Swipe Gestures JavaScript
 * Handles swipe gestures for mobile navigation
 */

// Swipe Gestures for Mobile Gallery Navigation
function setupSwipeGestures() {
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  const swipeThreshold = 50; // Minimum distance for swipe
  const timeThreshold = 300; // Maximum time for swipe
  
  document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTime = Date.now();
  }, { passive: true });
  
  document.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const endTime = Date.now();
    
    const diffX = startX - endX;
    const diffY = startY - endY;
    const diffTime = endTime - startTime;
    
    // Only trigger swipe if it's horizontal and within time threshold
    if (Math.abs(diffX) > Math.abs(diffY) && 
        Math.abs(diffX) > swipeThreshold && 
        diffTime < timeThreshold) {
      
      if (diffX > 0) {
        // Swipe left - scroll to next section (if implemented)
      } else {
        // Swipe right - scroll to previous section (if implemented)
      }
    }
    
    // Swipe down to refresh (pull to refresh simulation)
    if (diffY < -100 && Math.abs(diffX) < 50 && window.scrollY < 10) {
      showRefreshIndicator();
      setTimeout(() => {
        location.reload();
      }, 800);
    }
  }, { passive: true });
}

// Refresh indicator for pull-to-refresh
function showRefreshIndicator() {
  const indicator = document.createElement('div');
  indicator.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    padding: 1rem 2rem;
    border-radius: 25px;
    z-index: 10000;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    animation: fadeInDown 0.3s ease-out;
  `;
  indicator.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Refreshing...';
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(indicator);
}

// Initialize swipe gestures on mobile
document.addEventListener('DOMContentLoaded', function() {
  if (window.innerWidth <= 768) {
    setupSwipeGestures();
  }
});
