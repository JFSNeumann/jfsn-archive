/**
 * Mobile Swipe Gestures for Navigation
 * Left/Right swipes for page navigation
 */

class SwipeGestures {
  constructor(options = {}) {
    this.threshold = options.threshold || 100; // Min distance for swipe
    this.restraint = options.restraint || 100; // Max perpendicular distance
    this.allowedTime = options.allowedTime || 500; // Max time for swipe
    
    this.startX = 0;
    this.startY = 0;
    this.startTime = 0;
    this.distX = 0;
    this.distY = 0;
    
    this.init();
  }
  
  init() {
    // Only enable on touch devices
    if (!('ontouchstart' in window)) return;
    
    // Create swipe indicator
    this.createIndicator();
    
    document.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
    document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: true });
  }
  
  createIndicator() {
    this.indicator = document.createElement('div');
    this.indicator.className = 'swipe-indicator';
    this.indicator.style.cssText = `
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
      z-index: 9999;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 20px;
      border-radius: 50%;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    `;
    
    document.body.appendChild(this.indicator);
  }
  
  onTouchStart(e) {
    // Ignore if target is a link or button
    const target = e.target;
    if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
      return;
    }
    
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
    this.startTime = Date.now();
  }
  
  onTouchMove(e) {
    if (!this.startX || !this.startY) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    this.distX = currentX - this.startX;
    this.distY = currentY - this.startY;
    
    // Show indicator if horizontal swipe
    if (Math.abs(this.distX) > 50 && Math.abs(this.distY) < this.restraint) {
      if (this.distX > 0) {
        // Swiping right
        this.indicator.textContent = '→';
        this.indicator.style.left = '20px';
        this.indicator.style.right = 'auto';
      } else {
        // Swiping left
        this.indicator.textContent = '←';
        this.indicator.style.right = '20px';
        this.indicator.style.left = 'auto';
      }
      this.indicator.style.opacity = Math.min(Math.abs(this.distX) / 150, 1);
    }
  }
  
  onTouchEnd(e) {
    if (!this.startX || !this.startY) return;
    
    const elapsedTime = Date.now() - this.startTime;
    
    // Check if valid swipe
    if (elapsedTime <= this.allowedTime) {
      // Check if horizontal swipe
      if (Math.abs(this.distX) >= this.threshold && Math.abs(this.distY) <= this.restraint) {
        if (this.distX > 0) {
          // Swipe right - go back
          this.onSwipeRight();
        } else {
          // Swipe left - go forward/next
          this.onSwipeLeft();
        }
      }
    }
    
    // Reset
    this.indicator.style.opacity = '0';
    this.startX = 0;
    this.startY = 0;
    this.distX = 0;
    this.distY = 0;
  }
  
  onSwipeRight() {
    // Show feedback
    this.showFeedback('→ Back');
    
    // Navigate back
    setTimeout(() => {
      if (window.history.length > 1) {
        window.history.back();
      }
    }, 200);
  }
  
  onSwipeLeft() {
    // Show feedback
    this.showFeedback('View Gallery →');
    
    // Navigate to art gallery
    setTimeout(() => {
      // Check current page and navigate accordingly
      const currentPath = window.location.pathname;
      if (currentPath.endsWith('index.html') || currentPath === '/') {
        window.location.href = 'art.html';
      } else if (window.history.length > 1) {
        window.history.forward();
      }
    }, 200);
  }
  
  showFeedback(text) {
    // Create temporary feedback
    const feedback = document.createElement('div');
    feedback.textContent = text;
    feedback.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10000;
      background: rgba(99, 102, 241, 0.95);
      color: white;
      padding: 15px 30px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
      animation: feedbackPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    // Add animation
    if (!document.getElementById('swipe-feedback-style')) {
      const style = document.createElement('style');
      style.id = 'swipe-feedback-style';
      style.textContent = `
        @keyframes feedbackPop {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(feedback);
    
    setTimeout(() => feedback.remove(), 500);
  }
}

// Initialize on mobile devices
if ('ontouchstart' in window) {
  document.addEventListener('DOMContentLoaded', () => {
    new SwipeGestures();
  });
}

// Export
window.SwipeGestures = SwipeGestures;

