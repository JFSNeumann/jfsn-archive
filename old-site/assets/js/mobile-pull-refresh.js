/**
 * Pull-to-Refresh for Mobile
 * Native-like refresh experience on touch devices
 */

class PullToRefresh {
  constructor(options = {}) {
    this.threshold = options.threshold || 80; // Distance to trigger refresh
    this.maxDistance = options.maxDistance || 150;
    this.onRefresh = options.onRefresh || this.defaultRefresh;
    
    this.startY = 0;
    this.currentY = 0;
    this.isDragging = false;
    this.isRefreshing = false;
    
    this.init();
  }
  
  init() {
    // Only enable on touch devices
    if (!('ontouchstart' in window)) return;
    
    // Create refresh indicator
    this.createIndicator();
    
    // Attach touch listeners
    document.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
    document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: true });
  }
  
  createIndicator() {
    this.indicator = document.createElement('div');
    this.indicator.className = 'pull-refresh-indicator';
    this.indicator.innerHTML = `
      <div class="pull-refresh-spinner"></div>
      <div class="pull-refresh-text">Pull to refresh</div>
    `;
    
    // Add styles
    this.indicator.style.cssText = `
      position: fixed;
      top: -100px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 15px 30px;
      border-radius: 50px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 10px;
      transition: top 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    const spinner = this.indicator.querySelector('.pull-refresh-spinner');
    spinner.style.cssText = `
      width: 20px;
      height: 20px;
      border: 3px solid #e2e8f0;
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      opacity: 0;
      transition: opacity 0.3s;
    `;
    
    const text = this.indicator.querySelector('.pull-refresh-text');
    text.style.cssText = `
      font-size: 14px;
      font-weight: 600;
      color: #64748b;
    `;
    
    // Add spinner animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      [data-bs-theme="dark"] .pull-refresh-indicator {
        background: rgba(30, 41, 59, 0.95);
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(this.indicator);
  }
  
  onTouchStart(e) {
    // Only trigger if scrolled to top
    if (window.scrollY === 0 && !this.isRefreshing) {
      this.startY = e.touches[0].clientY;
      this.isDragging = true;
    }
  }
  
  onTouchMove(e) {
    if (!this.isDragging || this.isRefreshing) return;
    
    this.currentY = e.touches[0].clientY;
    const distance = Math.min(this.currentY - this.startY, this.maxDistance);
    
    if (distance > 0) {
      // Prevent default scroll
      e.preventDefault();
      
      // Update indicator position
      const progress = Math.min(distance / this.threshold, 1);
      this.indicator.style.top = `${distance * 0.5}px`;
      
      // Update text
      const text = this.indicator.querySelector('.pull-refresh-text');
      if (distance >= this.threshold) {
        text.textContent = 'Release to refresh';
        text.style.color = '#6366f1';
      } else {
        text.textContent = 'Pull to refresh';
        text.style.color = '#64748b';
      }
    }
  }
  
  onTouchEnd(e) {
    if (!this.isDragging || this.isRefreshing) return;
    
    const distance = this.currentY - this.startY;
    
    if (distance >= this.threshold) {
      // Trigger refresh
      this.refresh();
    } else {
      // Reset
      this.reset();
    }
    
    this.isDragging = false;
  }
  
  async refresh() {
    this.isRefreshing = true;
    
    // Show spinner
    const spinner = this.indicator.querySelector('.pull-refresh-spinner');
    const text = this.indicator.querySelector('.pull-refresh-text');
    spinner.style.opacity = '1';
    text.textContent = 'Refreshing...';
    text.style.color = '#6366f1';
    
    this.indicator.style.top = '20px';
    
    // Call refresh callback
    await this.onRefresh();
    
    // Reset after delay
    setTimeout(() => {
      this.reset();
      this.isRefreshing = false;
    }, 500);
  }
  
  reset() {
    this.indicator.style.top = '-100px';
    const spinner = this.indicator.querySelector('.pull-refresh-spinner');
    spinner.style.opacity = '0';
  }
  
  defaultRefresh() {
    return new Promise(resolve => {
      // Reload page
      setTimeout(() => {
        window.location.reload();
        resolve();
      }, 800);
    });
  }
}

// Initialize on mobile devices
if ('ontouchstart' in window) {
  document.addEventListener('DOMContentLoaded', () => {
    new PullToRefresh({
      onRefresh: () => {
        return new Promise(resolve => {
          // You can customize what happens on refresh
          setTimeout(() => {
            window.location.reload();
            resolve();
          }, 800);
        });
      }
    });
  });
}

// Export
window.PullToRefresh = PullToRefresh;

