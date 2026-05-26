/**
 * PULL-TO-REFRESH - Native mobile pattern
 * Elastic pull animation with haptic feedback
 */

(function() {
  'use strict';

  // Only run on mobile
  if (window.innerWidth > 992) return;

  const CONFIG = {
    threshold: 80, // Pull distance to trigger refresh
    maxPull: 120, // Maximum pull distance
    resistance: 0.4 // Pull resistance factor
  };

  let touchStartY = 0;
  let isPulling = false;
  let isRefreshing = false;
  let currentPullDistance = 0;

  // Create UI elements
  const createRefreshUI = () => {
    // Indicator
    const indicator = document.createElement('div');
    indicator.className = 'pull-to-refresh-indicator';
    indicator.innerHTML = '<i class="bi bi-arrow-down-circle-fill pull-refresh-icon"></i>';
    document.body.appendChild(indicator);
    
    // Text
    const text = document.createElement('div');
    text.className = 'pull-refresh-text';
    text.textContent = 'Pull to refresh';
    document.body.appendChild(text);
    
    return { indicator, text };
  };

  const { indicator, text } = createRefreshUI();

  /**
   * Start refresh
   */
  const startRefresh = () => {
    if (isRefreshing) return;
    
    isRefreshing = true;
    indicator.classList.add('refreshing');
    text.textContent = 'Refreshing...';
    
    // Heavy haptic feedback
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([30, 50, 30]);
    }
    
    // Simulate refresh (reload page after delay)
    setTimeout(() => {
      // Show success message
      showSuccess();
      
      // Actually refresh
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }, 1000);
  };

  /**
   * Show success message
   */
  const showSuccess = () => {
    const success = document.createElement('div');
    success.className = 'refresh-success';
    success.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Updated!';
    document.body.appendChild(success);
    
    setTimeout(() => success.classList.add('show'), 10);
    setTimeout(() => success.classList.remove('show'), 1500);
    setTimeout(() => success.remove(), 2000);
  };

  /**
   * Reset pull state
   */
  const resetPull = () => {
    isPulling = false;
    currentPullDistance = 0;
    indicator.classList.remove('pulling');
    text.classList.remove('show');
    text.textContent = 'Pull to refresh';
    
    // Reset any transforms
    if (document.body.style.transform) {
      document.body.style.transform = '';
    }
  };

  // Touch events
  document.addEventListener('touchstart', (e) => {
    // Only trigger at top of page
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 10) return;
    
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (isRefreshing) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 10) {
      resetPull();
      return;
    }
    
    const touchCurrentY = e.touches[0].clientY;
    const pullDistance = (touchCurrentY - touchStartY) * CONFIG.resistance;
    
    if (pullDistance > 0 && pullDistance < CONFIG.maxPull) {
      isPulling = true;
      currentPullDistance = pullDistance;
      
      // Update indicator position
      const progress = Math.min(pullDistance / CONFIG.threshold, 1);
      indicator.style.top = `${-80 + (pullDistance * 0.8)}px`;
      indicator.style.transform = `translateX(-50%) scale(${0.8 + progress * 0.4})`;
      
      // Show text when pulling
      if (pullDistance > 30) {
        text.classList.add('show');
        text.style.top = `${90 + (pullDistance * 0.3)}px`;
      }
      
      // Change text when threshold reached
      if (pullDistance >= CONFIG.threshold) {
        text.textContent = 'Release to refresh';
        indicator.classList.add('pulling');
        
        // Medium haptic feedback
        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(15);
        }
      } else {
        text.textContent = 'Pull to refresh';
        indicator.classList.remove('pulling');
      }
    }
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (!isPulling) return;
    
    if (currentPullDistance >= CONFIG.threshold) {
      startRefresh();
    } else {
      resetPull();
    }
  }, { passive: true });

  // Reset on scroll
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 10 && !isRefreshing) {
      resetPull();
    }
  }, { passive: true });

})();

