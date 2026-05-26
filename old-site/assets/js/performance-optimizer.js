/**
 * PERFORMANCE OPTIMIZER
 * Eliminates forced reflow by batching DOM reads/writes
 * Created: 2025-11-06
 */

(function() {
  'use strict';

  // ===== BATCH LAYOUT OPERATIONS =====
  // Prevents forced reflow by separating reads and writes

  let scheduledReads = [];
  let scheduledWrites = [];
  let isScheduled = false;

  function scheduleLayoutUpdate() {
    if (isScheduled) return;
    isScheduled = true;

    requestAnimationFrame(() => {
      // Phase 1: Execute all reads
      const readResults = scheduledReads.map(fn => fn());

      // Phase 2: Execute all writes with read results
      scheduledWrites.forEach((fn, index) => fn(readResults[index]));

      // Clear queues
      scheduledReads = [];
      scheduledWrites = [];
      isScheduled = false;
    });
  }

  // Public API
  window.performanceOptimizer = {
    read: function(readFn) {
      scheduledReads.push(readFn);
      scheduleLayoutUpdate();
    },

    write: function(writeFn) {
      scheduledWrites.push(writeFn);
      scheduleLayoutUpdate();
    },

    // Combined read/write (batched properly)
    measure: function(readFn, writeFn) {
      scheduledReads.push(readFn);
      scheduledWrites.push(writeFn);
      scheduleLayoutUpdate();
    }
  };

  // ===== CACHE LAYOUT MEASUREMENTS =====
  const layoutCache = {
    heroHeight: 0,
    navbarHeight: 0,
    windowHeight: 0,
    scrollY: 0
  };

  // Update cache on resize/scroll (throttled)
  let cacheTimeout;
  function updateLayoutCache() {
    clearTimeout(cacheTimeout);
    cacheTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        // Batch all reads together
        const heroSection = document.getElementById('hero-section');
        const navbar = document.querySelector('.navbar');

        layoutCache.heroHeight = heroSection ? heroSection.offsetHeight : 0;
        layoutCache.navbarHeight = navbar ? navbar.offsetHeight : 0;
        layoutCache.windowHeight = window.innerHeight;
        layoutCache.scrollY = window.scrollY;
      });
    }, 100);
  }

  window.addEventListener('resize', updateLayoutCache, { passive: true });
  window.addEventListener('scroll', () => {
    layoutCache.scrollY = window.scrollY;
  }, { passive: true });

  // Initial cache
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateLayoutCache);
  } else {
    updateLayoutCache();
  }

  // Export cache
  window.layoutCache = layoutCache;


})();

