/* swipe-gestures.js — Touch swipe and gesture detection */

const SwipeGestures = {
  touchStartX: 0,
  touchStartY: 0,
  touchEndX: 0,
  touchEndY: 0,
  minSwipeDistance: 50,
  handlers: new Map(),

  init() {
    this.attachToElements();
  },

  attachToElements() {
    // Attach to elements with swipe attributes
    document.querySelectorAll('[data-swipe-left], [data-swipe-right], [data-swipe-up], [data-swipe-down]').forEach(el => {
      this.registerElement(el);
    });
  },

  registerElement(element) {
    // Store handler function references
    const left = element.getAttribute('data-swipe-left');
    const right = element.getAttribute('data-swipe-right');
    const up = element.getAttribute('data-swipe-up');
    const down = element.getAttribute('data-swipe-down');

    element.addEventListener('touchstart', (e) => this.handleTouchStart(e, element), false);
    element.addEventListener('touchend', (e) => this.handleTouchEnd(e, element, { left, right, up, down }), false);

    // Also support mouse drag for desktop testing
    element.addEventListener('mousedown', (e) => this.handleMouseStart(e, element), false);
    element.addEventListener('mouseup', (e) => this.handleMouseEnd(e, element, { left, right, up, down }), false);
  },

  handleTouchStart(e, element) {
    this.touchStartX = e.changedTouches[0].screenX;
    this.touchStartY = e.changedTouches[0].screenY;
  },

  handleTouchEnd(e, element, handlers) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.touchEndY = e.changedTouches[0].screenY;
    this.detectSwipe(element, handlers);
  },

  handleMouseStart(e, element) {
    if (e.button !== 0) return; // Only left click
    this.touchStartX = e.screenX;
    this.touchStartY = e.screenY;
  },

  handleMouseEnd(e, element, handlers) {
    if (e.button !== 0) return;
    this.touchEndX = e.screenX;
    this.touchEndY = e.screenY;
    this.detectSwipe(element, handlers);
  },

  detectSwipe(element, handlers) {
    const diffX = this.touchStartX - this.touchEndX;
    const diffY = this.touchStartY - this.touchEndY;

    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);

    // Must swipe at least minSwipeDistance pixels
    if (Math.max(absDiffX, absDiffY) < this.minSwipeDistance) return;

    // Determine primary direction
    if (absDiffX > absDiffY) {
      // Horizontal swipe
      if (diffX > 0) {
        this.handleSwipe('left', element, handlers.left);
      } else {
        this.handleSwipe('right', element, handlers.right);
      }
    } else {
      // Vertical swipe
      if (diffY > 0) {
        this.handleSwipe('up', element, handlers.up);
      } else {
        this.handleSwipe('down', element, handlers.down);
      }
    }
  },

  handleSwipe(direction, element, handler) {
    if (!handler) return;

    // Emit custom event
    const event = new CustomEvent('swipe', {
      detail: { direction, target: element }
    });
    element.dispatchEvent(event);

    // Call handler function if it's a global function
    if (typeof window[handler] === 'function') {
      window[handler](element, direction);
    }
  },

  // Utility: register custom swipe handler
  on(element, direction, callback) {
    element.addEventListener('swipe', (e) => {
      if (e.detail.direction === direction) {
        callback(element);
      }
    });
  },

  // Utility: set minimum swipe distance
  setMinDistance(pixels) {
    this.minSwipeDistance = pixels;
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SwipeGestures.init());
} else {
  SwipeGestures.init();
}
