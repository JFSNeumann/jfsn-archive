/**
 * PERFORMANCE MONITORING
 * Track Core Web Vitals and performance metrics
 * Only logs in development mode (DEBUG)
 */

(function() {
  'use strict';

  // Debug mode - only log in development
  const DEBUG = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // Performance budget thresholds
  const BUDGETS = {
    LCP: 2500,  // Largest Contentful Paint (ms)
    FID: 100,   // First Input Delay (ms)
    CLS: 0.1,   // Cumulative Layout Shift
    FCP: 1800,  // First Contentful Paint (ms)
    TTFB: 800,  // Time to First Byte (ms)
    TTI: 3800   // Time to Interactive (ms)
  };

  // Performance metrics storage
  const metrics = {
    LCP: null,
    FID: null,
    CLS: null,
    FCP: null,
    TTFB: null,
    TTI: null,
    timings: {}
  };

  // Helper: Log performance metric
  function logMetric(name, value, unit = 'ms') {
    if (!DEBUG) return;
    
    const budget = BUDGETS[name];
    const status = budget && value > budget ? '⚠️ OVER BUDGET' : '✅ OK';
    const budgetInfo = budget ? ` (Budget: ${budget}${unit})` : '';
    
    if (window.debugLog) {
      window.debugLog(`📊 ${name}: ${value}${unit} ${status}${budgetInfo}`);
    }
    
    metrics[name] = value;
  }

  // Helper: Log performance warning
  function logWarning(message) {
    if (!DEBUG) return;
    if (window.debugWarn) {
      window.debugWarn(`⚠️ Performance: ${message}`);
    }
  }

  // Track Largest Contentful Paint (LCP)
  function trackLCP() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        // LCP is the last entry
        const lcpValue = Math.round(lastEntry.renderTime || lastEntry.loadTime);
        logMetric('LCP', lcpValue);
        
        // Check if over budget
        if (lcpValue > BUDGETS.LCP) {
          logWarning(`LCP is ${lcpValue}ms, over budget of ${BUDGETS.LCP}ms`);
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      if (DEBUG && window.debugWarn) window.debugWarn('LCP tracking not supported:', e);
    }
  }

  // Track First Input Delay (FID)
  function trackFID() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fidValue = Math.round(entry.processingStart - entry.startTime);
          logMetric('FID', fidValue);
          
          if (fidValue > BUDGETS.FID) {
            logWarning(`FID is ${fidValue}ms, over budget of ${BUDGETS.FID}ms`);
          }
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      if (DEBUG && window.debugWarn) window.debugWarn('FID tracking not supported:', e);
    }
  }

  // Track Cumulative Layout Shift (CLS)
  function trackCLS() {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          // Only count layout shifts without recent user input
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        logMetric('CLS', clsValue.toFixed(3), '');
        
        if (clsValue > BUDGETS.CLS) {
          logWarning(`CLS is ${clsValue.toFixed(3)}, over budget of ${BUDGETS.CLS}`);
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      if (DEBUG && window.debugWarn) window.debugWarn('CLS tracking not supported:', e);
    }
  }

  // Track First Contentful Paint (FCP)
  function trackFCP() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            const fcpValue = Math.round(entry.startTime);
            logMetric('FCP', fcpValue);
            
            if (fcpValue > BUDGETS.FCP) {
              logWarning(`FCP is ${fcpValue}ms, over budget of ${BUDGETS.FCP}ms`);
            }
          }
        });
      });

      observer.observe({ entryTypes: ['paint'] });
    } catch (e) {
      if (DEBUG && window.debugWarn) window.debugWarn('FCP tracking not supported:', e);
    }
  }

  // Track Time to First Byte (TTFB)
  function trackTTFB() {
    if (!('performance' in window) || !('timing' in window.performance)) return;

    try {
      const timing = window.performance.timing;
      const ttfbValue = timing.responseStart - timing.requestStart;
      
      logMetric('TTFB', Math.round(ttfbValue));
      
      if (ttfbValue > BUDGETS.TTFB) {
        logWarning(`TTFB is ${Math.round(ttfbValue)}ms, over budget of ${BUDGETS.TTFB}ms`);
      }
    } catch (e) {
      if (DEBUG && window.debugWarn) window.debugWarn('TTFB tracking not supported:', e);
    }
  }

  // Track Time to Interactive (TTI)
  function trackTTI() {
    if (!('performance' in window) || !('timing' in window.performance)) return;

    try {
      const timing = window.performance.timing;
      const domInteractive = timing.domInteractive;
      const domContentLoaded = timing.domContentLoadedEventEnd;
      const domComplete = timing.domComplete;
      
      // TTI is when DOM is interactive and scripts have loaded
      const ttiValue = domComplete - timing.navigationStart;
      
      logMetric('TTI', Math.round(ttiValue));
      
      if (ttiValue > BUDGETS.TTI) {
        logWarning(`TTI is ${Math.round(ttiValue)}ms, over budget of ${BUDGETS.TTI}ms`);
      }
    } catch (e) {
      if (DEBUG && window.debugWarn) window.debugWarn('TTI tracking not supported:', e);
    }
  }

  // Track resource loading performance
  function trackResources() {
    if (!('performance' in window) || !('getEntriesByType' in window.performance)) return;

    try {
      const resources = window.performance.getEntriesByType('resource');
      const slowResources = resources.filter(resource => {
        const duration = resource.responseEnd - resource.startTime;
        return duration > 1000; // Over 1 second
      });

      if (slowResources.length > 0 && DEBUG && window.debugLog) {
        window.debugLog('🐌 Slow Resources (>1s):', slowResources.map(resource => {
          const duration = Math.round(resource.responseEnd - resource.startTime);
          return `${resource.name}: ${duration}ms`;
        }).join(', '));
      }
    } catch (e) {
      if (DEBUG && window.debugWarn) window.debugWarn('Resource tracking not supported:', e);
    }
  }

  // Get performance summary
  function getPerformanceSummary() {
    return {
      metrics: metrics,
      budgets: BUDGETS,
      allGood: Object.keys(BUDGETS).every(key => {
        const value = metrics[key];
        return value === null || value <= BUDGETS[key];
      })
    };
  }

  // Initialize all tracking
  function init() {
    // Wait for page load to track TTFB and TTI
    if (document.readyState === 'complete') {
      trackTTFB();
      trackTTI();
      trackResources();
    } else {
      window.addEventListener('load', () => {
        trackTTFB();
        trackTTI();
        trackResources();
      });
    }

    // Track Core Web Vitals
    trackLCP();
    trackFID();
    trackCLS();
    trackFCP();

    if (DEBUG && window.debugLog) {
      window.debugLog('📊 Performance monitoring initialized');
      window.debugLog('💡 Performance budgets:', BUDGETS);
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API
  window.performanceMonitor = {
    getSummary: getPerformanceSummary,
    metrics: metrics,
    budgets: BUDGETS
  };

})();

