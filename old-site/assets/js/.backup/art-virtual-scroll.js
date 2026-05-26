/**
 * Virtual Scrolling for Massive Art Galleries
 * Only renders visible items + buffer for optimal performance
 * Handles 10,000+ artworks smoothly
 */

class VirtualScroll {
  constructor(container, items, renderItem, options = {}) {
    this.container = container;
    this.allItems = items;
    this.renderItem = renderItem;
    
    // Configuration
    this.itemHeight = options.itemHeight || 400; // Estimated card height
    this.buffer = options.buffer || 5; // Items to render above/below viewport
    this.columns = options.columns || 4;
    
    // State
    this.visibleRange = { start: 0, end: 0 };
    this.scrollContainer = null;
    this.contentWrapper = null;
    
    // Performance tracking
    this.lastScrollTime = 0;
    this.rafId = null;
    
    this.init();
  }
  
  init() {
    // Create scroll container
    this.scrollContainer = document.createElement('div');
    this.scrollContainer.className = 'virtual-scroll-container';
    this.scrollContainer.style.cssText = `
      position: relative;
      overflow-y: auto;
      height: 100%;
    `;
    
    // Create content wrapper (maintains scroll height)
    this.contentWrapper = document.createElement('div');
    this.contentWrapper.className = 'virtual-scroll-content';
    const totalHeight = Math.ceil(this.allItems.length / this.columns) * this.itemHeight;
    this.contentWrapper.style.height = `${totalHeight}px`;
    this.contentWrapper.style.position = 'relative';
    
    // Create visible items container
    this.visibleContainer = document.createElement('div');
    this.visibleContainer.className = 'virtual-scroll-visible';
    this.visibleContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    `;
    
    this.contentWrapper.appendChild(this.visibleContainer);
    this.scrollContainer.appendChild(this.contentWrapper);
    this.container.appendChild(this.scrollContainer);
    
    // Initial render
    this.updateVisibleItems();
    
    // Attach scroll listener with throttling
    this.scrollContainer.addEventListener('scroll', this.onScroll.bind(this));
    
    // Handle resize
    window.addEventListener('resize', this.onResize.bind(this));
  }
  
  onScroll() {
    // Use requestAnimationFrame for smooth scrolling
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    this.rafId = requestAnimationFrame(() => {
      this.updateVisibleItems();
    });
  }
  
  updateVisibleItems() {
    const scrollTop = this.scrollContainer.scrollTop;
    const viewportHeight = this.scrollContainer.clientHeight;
    
    // Calculate visible range
    const startRow = Math.floor(scrollTop / this.itemHeight);
    const endRow = Math.ceil((scrollTop + viewportHeight) / this.itemHeight);
    
    // Add buffer
    const startIndex = Math.max(0, (startRow - this.buffer) * this.columns);
    const endIndex = Math.min(this.allItems.length, (endRow + this.buffer) * this.columns);
    
    // Only update if range changed significantly
    if (startIndex === this.visibleRange.start && endIndex === this.visibleRange.end) {
      return;
    }
    
    this.visibleRange = { start: startIndex, end: endIndex };
    
    // Clear and render visible items
    this.visibleContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    for (let i = startIndex; i < endIndex; i++) {
      if (this.allItems[i]) {
        const itemElement = this.renderItem(this.allItems[i], i);
        fragment.appendChild(itemElement);
      }
    }
    
    // Position the visible container
    const offsetTop = Math.floor(startIndex / this.columns) * this.itemHeight;
    this.visibleContainer.style.transform = `translateY(${offsetTop}px)`;
    this.visibleContainer.appendChild(fragment);
    
    // Dispatch event for other modules
    document.dispatchEvent(new CustomEvent('galleryUpdated'));
  }
  
  onResize() {
    // Recalculate on window resize
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.updateVisibleItems();
    }, 250);
  }
  
  updateItems(newItems) {
    this.allItems = newItems;
    const totalHeight = Math.ceil(this.allItems.length / this.columns) * this.itemHeight;
    this.contentWrapper.style.height = `${totalHeight}px`;
    this.updateVisibleItems();
  }
  
  scrollToTop() {
    this.scrollContainer.scrollTop = 0;
  }
  
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.scrollContainer.remove();
  }
}

// Enable/disable virtual scrolling based on gallery size
function shouldUseVirtualScroll(itemCount) {
  // Use virtual scrolling for galleries with 500+ items
  return itemCount >= 500;
}

// Export
window.VirtualScroll = VirtualScroll;
window.shouldUseVirtualScroll = shouldUseVirtualScroll;

