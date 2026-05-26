/* ===========================================
   INDEX.HTML MOBILE GESTURE SUPPORT
   Swipe detection, pull to refresh, pinch to zoom, long press
   =========================================== */

(function() {
  'use strict';
  
  // Touch gesture detection
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let pullStartY = 0;
  let isPulling = false;
  
  // Swipe detection
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    pullStartY = touchStartY;
  }
  
  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    // Swipe threshold
    const minSwipeDistance = 50;
    
    // Horizontal swipe
    if (absX > absY && absX > minSwipeDistance) {
      if (deltaX > 0) {
        handleSwipeRight();
      } else {
        handleSwipeLeft();
      }
    }
    
    // Vertical swipe (pull to refresh)
    if (absY > absX && absY > minSwipeDistance && touchStartY < 100) {
      if (deltaY > 0 && window.scrollY === 0) {
        handlePullToRefresh();
      }
    }
    
    // Reset pull state
    isPulling = false;
    const pullIndicator = document.getElementById('pullToRefreshIndicator');
    if (pullIndicator) {
      pullIndicator.classList.remove('active');
    }
  }
  
  // Swipe handlers
  function handleSwipeLeft() {
    // Navigate to next artwork or close modal
    const modal = document.getElementById('quickViewModal');
    if (modal && modal.classList.contains('active')) {
      if (window.closeQuickView) window.closeQuickView();
      return;
    }
    
    // Navigate to next gallery item
    const nextLink = document.querySelector('.artwork-card:focus + .artwork-card a, .artwork-card:hover + .artwork-card a');
    if (nextLink) {
      nextLink.click();
    }
    
    showSwipeIndicator('← Swiped Left');
  }
  
  function handleSwipeRight() {
    // Navigate to previous artwork or close modal
    const modal = document.getElementById('quickViewModal');
    if (modal && modal.classList.contains('active')) {
      if (window.closeQuickView) window.closeQuickView();
      return;
    }
    
    // Navigate to previous gallery item
    const prevLink = document.querySelector('.artwork-card:focus ~ .artwork-card a, .artwork-card:hover ~ .artwork-card a');
    if (prevLink) {
      prevLink.click();
    }
    
    showSwipeIndicator('→ Swiped Right');
  }
  
  function handlePullToRefresh() {
    showSwipeIndicator('↻ Refreshing...');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
  
  function showSwipeIndicator(message) {
    let indicator = document.getElementById('swipeIndicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'swipeIndicator';
      indicator.className = 'swipe-indicator';
      document.body.appendChild(indicator);
    }
    
    indicator.textContent = message;
    indicator.classList.add('show');
    
    setTimeout(() => {
      indicator.classList.remove('show');
    }, 2000);
  }
  
  // Pull to refresh indicator
  function createPullToRefreshIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'pullToRefreshIndicator';
    indicator.className = 'pull-to-refresh-indicator';
    indicator.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(indicator);
    return indicator;
  }
  
  // Touch move handler for pull to refresh
  function handleTouchMove(e) {
    if (window.scrollY === 0 && touchStartY > 0) {
      const currentY = e.changedTouches[0].screenY;
      const deltaY = currentY - pullStartY;
      
      if (deltaY > 50 && !isPulling) {
        isPulling = true;
        let indicator = document.getElementById('pullToRefreshIndicator');
        if (!indicator) {
          indicator = createPullToRefreshIndicator();
        }
        indicator.classList.add('active');
      }
    }
  }
  
  // Long press detection
  let longPressTimer;
  function handleLongPress(element, callback) {
    element.addEventListener('touchstart', (e) => {
      longPressTimer = setTimeout(() => {
        callback(e);
        // Haptic feedback (if supported)
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }, 500);
    });
    
    element.addEventListener('touchend', () => {
      clearTimeout(longPressTimer);
    });
    
    element.addEventListener('touchmove', () => {
      clearTimeout(longPressTimer);
    });
  }
  
  // Pinch to zoom (for artwork images)
  let initialDistance = 0;
  function handlePinchStart(e) {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      initialDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
    }
  }
  
  function handlePinchMove(e) {
    if (e.touches.length === 2 && initialDistance > 0) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      const scale = currentDistance / initialDistance;
      const img = e.target.closest('img');
      
      if (img && img.classList.contains('artwork-image')) {
        img.style.transform = `scale(${Math.min(Math.max(scale, 1), 3)})`;
        img.style.transformOrigin = 'center';
      }
    }
  }
  
  function handlePinchEnd() {
    initialDistance = 0;
    const images = document.querySelectorAll('.artwork-image[style*="transform"]');
    images.forEach(img => {
      img.style.transition = 'transform 0.3s ease';
      img.style.transform = 'scale(1)';
      setTimeout(() => {
        img.style.transition = '';
      }, 300);
    });
  }
  
  // Initialize touch handlers
  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchmove', handleTouchMove, { passive: true });
  document.addEventListener('touchend', handleTouchEnd, { passive: true });
  
  // Pinch to zoom handlers
  document.addEventListener('touchstart', handlePinchStart, { passive: true });
  document.addEventListener('touchmove', handlePinchMove, { passive: true });
  document.addEventListener('touchend', handlePinchEnd, { passive: true });
  
  // Long press on artwork cards
  document.addEventListener('DOMContentLoaded', () => {
    const artworkCards = document.querySelectorAll('.artwork-card, .jfsn-artcard');
    artworkCards.forEach(card => {
      handleLongPress(card, (e) => {
        e.preventDefault();
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.innerHTML = `
          <button onclick="window.openQuickView && window.openQuickView(this.closest('.artwork-card'))">Quick View</button>
          <button onclick="this.closest('.artwork-card').querySelector('.favorite-btn')?.click()">Add to Favorites</button>
          <button onclick="navigator.share && navigator.share({title: '${card.dataset.title || 'Artwork'}'})">Share</button>
        `;
        document.body.appendChild(menu);
        menu.style.left = e.touches[0].clientX + 'px';
        menu.style.top = e.touches[0].clientY + 'px';
        
        setTimeout(() => menu.remove(), 3000);
      });
    });
  });
  
  // Swipe to dismiss modals
  function enableSwipeToDismiss(modal) {
    let startY = 0;
    let currentY = 0;
    
    modal.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    });
    
    modal.addEventListener('touchmove', (e) => {
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      
      if (deltaY > 50) {
        modal.style.transform = `translateY(${deltaY}px)`;
      }
    });
    
    modal.addEventListener('touchend', () => {
      const deltaY = currentY - startY;
      if (deltaY > 100) {
        if (window.closeQuickView) window.closeQuickView();
      } else {
        modal.style.transform = '';
      }
      startY = 0;
      currentY = 0;
    });
  }
  
  // Enable swipe to dismiss for modals
  document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.quick-view-modal, .modal');
    modals.forEach(modal => enableSwipeToDismiss(modal));
  });
})();

