/**
 * Enhanced Loading States System
 * Best practice implementation for better perceived performance
 * Features: Progressive image loading, button loading states, page transitions
 */

(function() {
  'use strict';

  // ===== PROGRESSIVE IMAGE LOADING =====
  function initProgressiveImageLoading() {
    const images = document.querySelectorAll('img[data-src], img[data-progressive]');
    
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all images immediately
      images.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
      return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadProgressiveImage(img);
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    images.forEach(img => {
      // Create wrapper if needed
      if (!img.parentElement.classList.contains('progressive-image-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'progressive-image-wrapper';
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
      }

      // Add placeholder if not exists
      if (!img.dataset.placeholderAdded) {
        const placeholder = document.createElement('img');
        placeholder.className = 'progressive-image-placeholder';
        placeholder.src = img.src || img.dataset.placeholder || createBlurDataURL();
        placeholder.alt = '';
        placeholder.setAttribute('aria-hidden', 'true');
        img.parentElement.insertBefore(placeholder, img);
        img.classList.add('progressive-image-main');
        img.dataset.placeholderAdded = 'true';
      }

      imageObserver.observe(img);
    });
  }

  function loadProgressiveImage(img) {
    const src = img.dataset.src || img.src;
    if (!src) return;

    const wrapper = img.parentElement;
    wrapper.classList.add('loading');

    const fullImage = new Image();
    fullImage.onload = () => {
      img.src = src;
      img.classList.add('loaded');
      wrapper.classList.remove('loading');
      
      // Remove placeholder after transition
      setTimeout(() => {
        const placeholder = wrapper.querySelector('.progressive-image-placeholder');
        if (placeholder) {
          placeholder.style.opacity = '0';
          setTimeout(() => placeholder.remove(), 300);
        }
      }, 500);
    };

    fullImage.onerror = () => {
      wrapper.classList.remove('loading');
      img.classList.add('error');
      if (typeof showToast === 'function') {
        showToast('Failed to load image', 'error', 3000);
      }
    };

    fullImage.src = src;
  }

  function createBlurDataURL() {
    // Create a tiny 1x1 pixel data URL as placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 1, 1);
    return canvas.toDataURL();
  }

  // ===== BUTTON LOADING STATES =====
  function initButtonLoadingStates() {
    // Auto-detect buttons with loading states
    document.addEventListener('click', (e) => {
      const button = e.target.closest('button, .btn, a.btn');
      if (!button) return;

      // Check if button should show loading state
      const shouldLoad = button.dataset.loading !== 'false' && 
                        (button.type === 'submit' || 
                         button.classList.contains('btn-submit') ||
                         button.dataset.async === 'true');

      if (shouldLoad) {
        setButtonLoading(button, true);
      }
    }, true);

    // Handle form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      const submitButton = form.querySelector('button[type="submit"], .btn-submit');
      
      if (submitButton && !submitButton.dataset.loadingDisabled) {
        setButtonLoading(submitButton, true);
      }
    });
  }

  function setButtonLoading(button, isLoading) {
    if (isLoading) {
      button.classList.add('loading', 'btn-loading');
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      
      // Store original HTML if it has icons
      if (button.innerHTML !== button.textContent) {
        button.dataset.originalHtml = button.innerHTML;
      }
    } else {
      button.classList.remove('loading', 'btn-loading');
      button.disabled = false;
      
      // Restore original content
      if (button.dataset.originalHtml) {
        button.innerHTML = button.dataset.originalHtml;
        delete button.dataset.originalHtml;
      } else if (button.dataset.originalText) {
        button.textContent = button.dataset.originalText;
        delete button.dataset.originalText;
      }
    }
  }

  // Expose globally
  window.setButtonLoading = setButtonLoading;

  // ===== PAGE TRANSITION LOADING =====
  function initPageTransitionLoading() {
    // Create overlay if it doesn't exist
    let overlay = document.getElementById('pageLoadingOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'pageLoadingOverlay';
      overlay.className = 'page-loading-overlay';
      overlay.innerHTML = `
        <div>
          <div class="page-loading-spinner"></div>
          <div class="page-loading-text">Loading...</div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    // Show loading on link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;

      const href = link.getAttribute('href');
      // Only show for same-origin links
      if (href && !href.startsWith('#') && !href.startsWith('javascript:') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        try {
          const url = new URL(href, window.location.origin);
          if (url.origin === window.location.origin) {
            showPageLoading();
          }
        } catch {
          // Invalid URL, ignore
        }
      }
    });

    // Hide loading when page is ready
    if (document.readyState === 'complete') {
      hidePageLoading();
    } else {
      window.addEventListener('load', hidePageLoading);
    }
  }

  function showPageLoading(text = 'Loading...') {
    const overlay = document.getElementById('pageLoadingOverlay');
    if (overlay) {
      const textEl = overlay.querySelector('.page-loading-text');
      if (textEl) {
        textEl.textContent = text;
      }
      overlay.classList.add('active');
    }
  }

  function hidePageLoading() {
    const overlay = document.getElementById('pageLoadingOverlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  }

  // Expose globally
  window.showPageLoading = showPageLoading;
  window.hidePageLoading = hidePageLoading;

  // ===== PROGRESS BARS =====
  function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar-container, [data-progress]');
    
    progressBars.forEach(container => {
      const fill = container.querySelector('.progress-bar-fill') || container;
      const value = container.dataset.progress || fill.dataset.value || '0';
      
      updateProgressBar(container, parseFloat(value));
    });
  }

  function updateProgressBar(container, value) {
    const fill = container.querySelector('.progress-bar-fill') || container;
    const max = parseFloat(container.dataset.max || '100');
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    fill.style.width = `${percentage}%`;
    fill.setAttribute('aria-valuenow', value);
    fill.setAttribute('aria-valuemin', 0);
    fill.setAttribute('aria-valuemax', max);
    
    const text = container.querySelector('.progress-bar-text');
    if (text) {
      text.textContent = `${Math.round(percentage)}%`;
    }
  }

  // Expose globally
  window.updateProgressBar = updateProgressBar;

  // ===== SKELETON LOADERS =====
  function createSkeletonLoader(type = 'card', count = 1) {
    const skeletons = [];
    
    for (let i = 0; i < count; i++) {
      const skeleton = document.createElement('div');
      skeleton.className = `skeleton skeleton-${type}`;
      
      if (type === 'card') {
        skeleton.innerHTML = `
          <div class="skeleton-image"></div>
          <div class="skeleton-title"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text"></div>
        `;
      } else if (type === 'text') {
        skeleton.innerHTML = `
          <div class="skeleton-text"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text"></div>
        `;
      } else if (type === 'image') {
        skeleton.className = 'skeleton skeleton-image';
      }
      
      skeletons.push(skeleton);
    }
    
    return count === 1 ? skeletons[0] : skeletons;
  }

  // Expose globally
  window.createSkeletonLoader = createSkeletonLoader;

  // ===== INITIALIZE =====
  function init() {
    initProgressiveImageLoading();
    initButtonLoadingStates();
    initPageTransitionLoading();
    initProgressBars();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for manual initialization
  window.initEnhancedLoadingStates = init;
})();

