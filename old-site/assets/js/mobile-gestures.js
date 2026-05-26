/**
 * MOBILE GESTURE SUPPORT
 * Swipe navigation, pinch-to-zoom, pull-to-refresh
 */

(function() {
  'use strict';

  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let initialDistance = 0;
  let currentScale = 1;

  // Swipe detection
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }

  function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 50;

    // Horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe right - previous artwork
        navigateArtwork('prev');
      } else {
        // Swipe left - next artwork
        navigateArtwork('next');
      }
    }

    // Vertical swipe
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance) {
      if (deltaY > 0) {
        // Swipe down - could trigger pull-to-refresh
        if (window.scrollY === 0) {
          triggerPullToRefresh();
        }
      }
    }
  }

  // Navigate between artworks
  function navigateArtwork(direction) {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    const cards = Array.from(gallery.querySelectorAll('.artwork-card'));
    const currentCard = document.querySelector('.artwork-card.active');
    
    if (!currentCard && cards.length > 0) {
      cards[0].classList.add('active');
      return;
    }

    const currentIndex = cards.indexOf(currentCard);
    let nextIndex;

    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % cards.length;
    } else {
      nextIndex = (currentIndex - 1 + cards.length) % cards.length;
    }

    // Remove active class
    cards.forEach(card => card.classList.remove('active'));
    
    // Add active class to next card
    cards[nextIndex].classList.add('active');
    
    // Scroll into view
    cards[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Haptic feedback
    if (window.hapticFeedback) {
      window.hapticFeedback('light');
    }
  }

  // Pull-to-refresh
  let pullStartY = 0;
  let pullDistance = 0;
  let isPulling = false;

  function handlePullStart(e) {
    if (window.scrollY === 0) {
      pullStartY = e.touches[0].clientY;
      isPulling = true;
    }
  }

  function handlePullMove(e) {
    if (!isPulling) return;

    const currentY = e.touches[0].clientY;
    pullDistance = currentY - pullStartY;

    if (pullDistance > 0 && pullDistance < 100) {
      // Show pull indicator
      showPullIndicator(pullDistance);
    }
  }

  function handlePullEnd() {
    if (isPulling && pullDistance > 80) {
      // Trigger refresh
      refreshGallery();
    }
    
    hidePullIndicator();
    isPulling = false;
    pullDistance = 0;
  }

  function showPullIndicator(distance) {
    let indicator = document.getElementById('pull-to-refresh-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'pull-to-refresh-indicator';
      indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        padding: 1rem;
        background: rgba(99, 102, 241, 0.9);
        color: white;
        border-radius: 0 0 12px 12px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
      `;
      document.body.appendChild(indicator);
    }

    indicator.innerHTML = `
      <i class="bx bx-refresh" style="animation: spin 1s linear infinite;"></i>
      <span>Pull to refresh</span>
    `;
    indicator.style.opacity = Math.min(distance / 80, 1);
  }

  function hidePullIndicator() {
    const indicator = document.getElementById('pull-to-refresh-indicator');
    if (indicator) {
      indicator.style.opacity = '0';
      setTimeout(() => indicator.remove(), 300);
    }
  }

  function refreshGallery() {
    if (window.loadArtworkData) {
      window.loadArtworkData();
    } else if (window.location) {
      window.location.reload();
    }
  }

  // Pinch-to-zoom
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
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      const scale = currentDistance / initialDistance;
      currentScale = Math.max(1, Math.min(scale, 3)); // Limit between 1x and 3x

      const image = e.target.closest('.artwork-image-container')?.querySelector('img');
      if (image) {
        image.style.transform = `scale(${currentScale})`;
        image.style.transition = 'transform 0.1s';
      }
    }
  }

  function handlePinchEnd() {
    const images = document.querySelectorAll('.artwork-image-container img');
    images.forEach(img => {
      if (currentScale === 1) {
        img.style.transform = '';
        img.style.transition = '';
      }
    });
  }

  // Initialize
  function init() {
    // Swipe navigation
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Pull-to-refresh
    document.addEventListener('touchstart', handlePullStart, { passive: true });
    document.addEventListener('touchmove', handlePullMove, { passive: true });
    document.addEventListener('touchend', handlePullEnd, { passive: true });

    // Pinch-to-zoom
    document.addEventListener('touchstart', handlePinchStart, { passive: true });
    document.addEventListener('touchmove', handlePinchMove, { passive: true });
    document.addEventListener('touchend', handlePinchEnd, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

