/**
 * Smart Preloading Strategies
 * Intelligently preload resources for better performance
 */

class PreloadOptimizer {
  constructor() {
    this.preloadedResources = new Set();
    this.prefetchQueue = [];
    this.isOnline = navigator.onLine;
    this.connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    this.init();
  }
  
  init() {
    // Detect connection quality
    this.detectConnectionQuality();
    
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Prefetch likely next pages
    this.prefetchLikelyPages();
    
    // Listen for link hovers
    this.setupLinkHoverPrefetch();
    
    // Monitor visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.resumePrefetching();
      }
    });
    
    // Monitor online/offline
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.resumePrefetching();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }
  
  detectConnectionQuality() {
    if (!this.connection) return 'good';
    
    const effectiveType = this.connection.effectiveType;
    const saveData = this.connection.saveData;
    
    // Don't prefetch on save-data mode
    if (saveData) {
      this.shouldPrefetch = false;
      return 'save-data';
    }
    
    // Adjust based on connection
    if (effectiveType === '4g') {
      this.shouldPrefetch = true;
      this.prefetchDelay = 0;
    } else if (effectiveType === '3g') {
      this.shouldPrefetch = true;
      this.prefetchDelay = 1000;
    } else {
      this.shouldPrefetch = false;
    }
  }
  
  preloadCriticalResources() {
    // Preload fonts (only if they exist on page)
    if (document.fonts) {
      this.preloadFont('/fonts/Manrope-Variable.woff2', 'font/woff2');
    }
    
    // Preload hero image if it exists on the page
    const heroImg = document.querySelector('.hero-image-static img');
    if (heroImg && heroImg.src) {
      this.preloadImage(heroImg.src);
    }
    
    // Don't preload CSS if it's already loaded
    // Most CSS is already inline or loaded via <link> tags
  }
  
  prefetchLikelyPages() {
    if (!this.shouldPrefetch || !this.isOnline) return;
    
    // Determine likely next pages based on current page
    const currentPath = window.location.pathname;
    let likelyPages = [];
    
    if (currentPath.endsWith('index.html') || currentPath === '/') {
      likelyPages = ['art.html', 'about.html'];
    } else if (currentPath.endsWith('art.html')) {
      likelyPages = ['index.html'];
    } else if (currentPath.endsWith('about.html')) {
      likelyPages = ['art.html', 'portfolio.html'];
    }
    
    // Prefetch with delay
    setTimeout(() => {
      likelyPages.forEach(page => {
        this.prefetchPage(page);
      });
    }, this.prefetchDelay || 2000);
  }
  
  setupLinkHoverPrefetch() {
    // Prefetch on link hover (desktop only)
    if ('ontouchstart' in window) return; // Skip on touch devices
    
    document.addEventListener('mouseover', (e) => {
      const link = e.target.closest('a');
      if (!link || !this.shouldPrefetch || !this.isOnline) return;
      
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
      
      // Only prefetch internal links
      if (href.startsWith('http') && !href.includes(window.location.hostname)) return;
      
      // Prefetch after short delay (user might just be passing by)
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = setTimeout(() => {
        this.prefetchPage(href);
      }, 100);
    });
  }
  
  preloadFont(url, type) {
    if (this.preloadedResources.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = 'font';
    link.type = type;
    link.crossOrigin = 'anonymous';
    
    document.head.appendChild(link);
    this.preloadedResources.add(url);
    
  }
  
  preloadImage(url) {
    if (this.preloadedResources.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = 'image';
    
    document.head.appendChild(link);
    this.preloadedResources.add(url);
    
  }
  
  preloadStylesheet(url) {
    if (this.preloadedResources.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = 'style';
    
    document.head.appendChild(link);
    this.preloadedResources.add(url);
    
  }
  
  prefetchPage(url) {
    if (this.preloadedResources.has(url)) return;
    if (!this.shouldPrefetch || !this.isOnline) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    
    document.head.appendChild(link);
    this.preloadedResources.add(url);
    
  }
  
  resumePrefetching() {
    if (this.prefetchQueue.length > 0 && this.shouldPrefetch && this.isOnline) {
      this.prefetchQueue.forEach(url => this.prefetchPage(url));
      this.prefetchQueue = [];
    }
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PreloadOptimizer();
  });
} else {
  new PreloadOptimizer();
}

// Export
window.PreloadOptimizer = PreloadOptimizer;

