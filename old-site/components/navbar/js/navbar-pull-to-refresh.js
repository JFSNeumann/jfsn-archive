/**
 * PULL-TO-REFRESH INTEGRATION
 * Pull down to refresh page from navbar area
 */

(function() {
  'use strict';
  
  let pullStartY = 0;
  let pullCurrentY = 0;
  let pullDistance = 0;
  let isPulling = false;
  let pullThreshold = 80;
  let maxPullDistance = 120;
  
  function initPullToRefresh() {
    const navbar = document.querySelector('.editorial-navbar');
    if (!navbar) return;
    
    // Only enable on mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) return;
    
    // Only enable when at top of page
    function isAtTop() {
      return window.scrollY === 0 || window.pageYOffset === 0;
    }
    
    // Create pull indicator
    const pullIndicator = document.createElement('div');
    pullIndicator.className = 'navbar-pull-indicator';
    pullIndicator.innerHTML = '<i class="bx bx-refresh"></i><span>Pull to refresh</span>';
    pullIndicator.style.cssText = `
      position: fixed;
      top: -60px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(99, 102, 241, 0.95);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0 0 12px 12px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      z-index: 10001;
      transition: top 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    document.body.appendChild(pullIndicator);
    
    // Touch start
    document.addEventListener('touchstart', function(e) {
      if (!isAtTop()) return;
      
      pullStartY = e.touches[0].clientY;
      isPulling = true;
    }, { passive: true });
    
    // Touch move
    document.addEventListener('touchmove', function(e) {
      if (!isPulling || !isAtTop()) return;
      
      pullCurrentY = e.touches[0].clientY;
      pullDistance = Math.max(0, pullCurrentY - pullStartY);
      
      if (pullDistance > 0 && pullDistance <= maxPullDistance) {
        // Show indicator
        const progress = Math.min(pullDistance / pullThreshold, 1);
        pullIndicator.style.top = `${-60 + (pullDistance * 0.5)}px`;
        pullIndicator.style.opacity = String(progress);
        
        // Rotate icon
        const icon = pullIndicator.querySelector('i');
        if (icon) {
          icon.style.transform = `rotate(${pullDistance * 3}deg)`;
        }
        
        // Update text
        const text = pullIndicator.querySelector('span');
        if (text) {
          if (pullDistance >= pullThreshold) {
            text.textContent = 'Release to refresh';
            pullIndicator.style.background = 'rgba(99, 102, 241, 1)';
          } else {
            text.textContent = 'Pull to refresh';
            pullIndicator.style.background = 'rgba(99, 102, 241, 0.95)';
          }
        }
        
        // Prevent default scrolling if pulling
        if (pullDistance > 10) {
          e.preventDefault();
        }
      }
    }, { passive: false });
    
    // Touch end
    document.addEventListener('touchend', function() {
      if (!isPulling) return;
      
      isPulling = false;
      
      if (pullDistance >= pullThreshold) {
        // Trigger refresh
        pullIndicator.querySelector('i').style.animation = 'spin 1s linear infinite';
        pullIndicator.querySelector('span').textContent = 'Refreshing...';
        
        // Reload page
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        // Reset indicator
        pullIndicator.style.top = '-60px';
        pullIndicator.style.opacity = '0';
        pullIndicator.querySelector('i').style.transform = 'rotate(0deg)';
        pullIndicator.style.background = 'rgba(99, 102, 241, 0.95)';
      }
      
      pullDistance = 0;
      pullStartY = 0;
      pullCurrentY = 0;
    }, { passive: true });
    
    // Add spin animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPullToRefresh);
  } else {
    setTimeout(initPullToRefresh, 500);
  }
  
  // Expose globally
  window.navbarPullToRefresh = {
    init: initPullToRefresh
  };
  
})();

