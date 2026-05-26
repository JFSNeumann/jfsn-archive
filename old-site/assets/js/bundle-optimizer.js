/**
 * Bundle Size Optimizer
 * Dynamic code splitting and lazy loading for reduced initial bundle
 */

class BundleOptimizer {
  constructor() {
    this.loadedModules = new Set();
    this.moduleCache = new Map();
    
    this.init();
  }
  
  init() {
    // Defer non-critical scripts
    this.deferNonCriticalScripts();
    
    // Lazy load modules based on viewport
    this.setupIntersectionObserver();
    
    // Setup dynamic imports
    this.setupDynamicImports();
    
  }
  
  deferNonCriticalScripts() {
    // Move non-critical scripts to end of queue
    const nonCriticalScripts = [
      'fancybox',
      'swipe',
      'backtotop',
      'quickview'
    ];
    
    // These will load after page is interactive
    if (document.readyState === 'complete') {
      this.loadNonCriticalModules();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.loadNonCriticalModules(), 1000);
      });
    }
  }
  
  loadNonCriticalModules() {
    // Load analytics, social sharing, etc. after page load
    
    // Example: Load analytics after delay
    if (typeof gtag === 'undefined' && window.GA_MEASUREMENT_ID) {
      this.loadScript(`https://www.googletagmanager.com/gtag/js?id=${window.GA_MEASUREMENT_ID}`);
    }
  }
  
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          // Load module for this section
          const moduleId = element.dataset.module;
          if (moduleId && !this.loadedModules.has(moduleId)) {
            this.loadModule(moduleId);
          }
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    // Observe sections that need lazy-loaded modules
    document.querySelectorAll('[data-module]').forEach(el => {
      observer.observe(el);
    });
  }
  
  setupDynamicImports() {
    // Setup dynamic imports for heavy features
    window.loadGalleryModule = () => this.loadGalleryFeatures();
    window.load3DModule = () => this.load3DFeatures();
    window.loadChartModule = () => this.loadChartFeatures();
  }
  
  async loadModule(moduleId) {
    if (this.loadedModules.has(moduleId)) {
      return this.moduleCache.get(moduleId);
    }
    
    
    try {
      let module;
      
      switch (moduleId) {
        case 'gallery':
          module = await this.loadGalleryFeatures();
          break;
        case '3d':
          module = await this.load3DFeatures();
          break;
        case 'charts':
          module = await this.loadChartFeatures();
          break;
        default:
          console.warn(`Unknown module: ${moduleId}`);
          return null;
      }
      
      this.loadedModules.add(moduleId);
      this.moduleCache.set(moduleId, module);
      
      return module;
    } catch (error) {
      console.error(`Failed to load module ${moduleId}:`, error);
      return null;
    }
  }
  
  async loadGalleryFeatures() {
    // Dynamically load heavy gallery features only when needed
    const features = [
      '/assets/js/art-fancybox.js',
      '/assets/js/art-quickview.js'
    ];
    
    return Promise.all(features.map(src => this.loadScript(src)));
  }
  
  async load3DFeatures() {
    // Load Three.js or other 3D libraries only if needed
    return this.loadScript('https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.min.js');
  }
  
  async loadChartFeatures() {
    // Load charting library only if needed
    return this.loadScript('https://cdn.jsdelivr.net/npm/chart.js@4.0.0/dist/chart.umd.min.js');
  }
  
  loadScript(src) {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        console.error(`❌ Failed to load: ${src}`);
        reject(new Error(`Failed to load ${src}`));
      };
      
      document.body.appendChild(script);
    });
  }
  
  // Resource hints for better performance
  addResourceHints() {
    // DNS prefetch for external domains
    this.addDNSPrefetch('https://cdn.jsdelivr.net');
    this.addDNSPrefetch('https://fonts.googleapis.com');
    this.addDNSPrefetch('https://www.googletagmanager.com');
    
    // Preconnect to important origins
    this.addPreconnect('https://cdn.jsdelivr.net');
  }
  
  addDNSPrefetch(url) {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = url;
    document.head.appendChild(link);
  }
  
  addPreconnect(url) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }
  
  // Monitor and report bundle stats
  reportBundleStats() {
    if (window.performance && window.performance.getEntriesByType) {
      const resources = window.performance.getEntriesByType('resource');
      
      let totalSize = 0;
      let jsSize = 0;
      let cssSize = 0;
      let imgSize = 0;
      
      resources.forEach(resource => {
        const size = resource.transferSize || 0;
        totalSize += size;
        
        if (resource.name.endsWith('.js')) jsSize += size;
        else if (resource.name.endsWith('.css')) cssSize += size;
        else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/)) imgSize += size;
      });
      
    }
  }
}

// Initialize
const bundleOptimizer = new BundleOptimizer();

// Report stats after load
window.addEventListener('load', () => {
  setTimeout(() => {
    bundleOptimizer.reportBundleStats();
    bundleOptimizer.addResourceHints();
  }, 2000);
});

// Export
window.BundleOptimizer = BundleOptimizer;
window.bundleOptimizer = bundleOptimizer;

