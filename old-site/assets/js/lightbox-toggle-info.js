/**
 * Lightbox Info Panel Toggle
 * Works with LightGallery and Fancybox
 * Shows all content in .lg-sub-html and hides it when clicking on the image
 */

(function() {
  'use strict';

  let infoPanelHidden = false;

  function hideInfoPanel() {
    // LightGallery
    const lgSubHtml = document.querySelector('.lg-sub-html');
    if (lgSubHtml) {
      lgSubHtml.classList.add('lg-info-hidden');
      infoPanelHidden = true;
      console.log('✅ LightGallery info panel hidden');
    }

    // Fancybox (if used)
    const fancyboxCaption = document.querySelector('.fancybox-caption, .fancybox__caption');
    if (fancyboxCaption) {
      fancyboxCaption.style.display = 'none';
      fancyboxCaption.style.visibility = 'hidden';
      fancyboxCaption.style.opacity = '0';
      console.log('✅ Fancybox caption hidden');
    }
  }

  function showInfoPanel() {
    // LightGallery
    const lgSubHtml = document.querySelector('.lg-sub-html');
    if (lgSubHtml) {
      lgSubHtml.classList.remove('lg-info-hidden');
      infoPanelHidden = false;
      console.log('✅ LightGallery info panel shown');
    }

    // Fancybox (if used)
    const fancyboxCaption = document.querySelector('.fancybox-caption, .fancybox__caption');
    if (fancyboxCaption) {
      fancyboxCaption.style.display = '';
      fancyboxCaption.style.visibility = '';
      fancyboxCaption.style.opacity = '';
      console.log('✅ Fancybox caption shown');
    }
  }

  function handleImageClick(e) {
    // Check if we're inside LightGallery
    const lgContainer = document.querySelector('.lg-container.lg-show');
    const fancyboxContainer = document.querySelector('.fancybox-container, .fancybox__container');
    
    if (!lgContainer && !fancyboxContainer) {
      return;
    }

    const container = lgContainer || fancyboxContainer;
    if (!container.contains(e.target)) {
      return;
    }

    // Don't hide if clicking on controls or info panel itself
    if (e.target.closest('.lg-close') || 
        e.target.closest('.lg-prev') || 
        e.target.closest('.lg-next') ||
        e.target.closest('.lg-toolbar') ||
        e.target.closest('.lg-thumb-outer') ||
        e.target.closest('.lg-sub-html') ||
        e.target.closest('.lg-counter') ||
        e.target.closest('.lg-autoplay-button') ||
        e.target.closest('.fancybox-button') ||
        e.target.closest('.fancybox__button') ||
        e.target.closest('.fancybox-caption') ||
        e.target.closest('.fancybox__caption') ||
        e.target.closest('button') ||
        e.target.closest('a[href]')) {
      return;
    }

    // Check if clicking on ANY image element (more comprehensive)
    const isImage = e.target.tagName === 'IMG' || 
                    e.target.tagName === 'PICTURE' ||
                    e.target.closest('img') ||
                    e.target.closest('picture') ||
                    e.target.closest('.lg-image') ||
                    e.target.closest('.lg-img-wrap') ||
                    e.target.closest('.lg-item') ||
                    e.target.closest('.lg-content') ||
                    e.target.closest('.fancybox-image') ||
                    e.target.closest('.fancybox__image') ||
                    e.target.closest('.fancybox-content');
    
    if (isImage && !infoPanelHidden) {
      console.log('🖱️ Image clicked - hiding info panel');
      hideInfoPanel();
    }
  }

  // Set up click handler
  document.addEventListener('click', handleImageClick, true);

  // LightGallery Events
  document.addEventListener('lgAfterOpen', function() {
    showInfoPanel();
    console.log('🎬 LightGallery opened - info panel visible');
  });

  document.addEventListener('lgAfterSlide', function() {
    showInfoPanel();
    console.log('🔄 LightGallery slide changed - info panel visible');
  });

  document.addEventListener('lgAfterAppendSubHtml', function() {
    showInfoPanel();
    console.log('📝 LightGallery sub-html appended - info panel visible');
  });

  document.addEventListener('lgAfterClose', function() {
    infoPanelHidden = false;
    console.log('🚪 LightGallery closed');
  });

  // Fancybox Events (if Fancybox is used)
  document.addEventListener('fancybox:ready', function() {
    showInfoPanel();
    console.log('🎬 Fancybox opened - caption visible');
  });

  document.addEventListener('fancybox:slide', function() {
    showInfoPanel();
    console.log('🔄 Fancybox slide changed - caption visible');
  });

  document.addEventListener('fancybox:close', function() {
    infoPanelHidden = false;
    console.log('🚪 Fancybox closed');
  });

  // Also listen for Fancybox v5 events
  document.addEventListener('fancybox5:ready', function() {
    showInfoPanel();
    console.log('🎬 Fancybox5 opened - caption visible');
  });

  document.addEventListener('fancybox5:slide', function() {
    showInfoPanel();
    console.log('🔄 Fancybox5 slide changed - caption visible');
  });

  document.addEventListener('fancybox5:close', function() {
    infoPanelHidden = false;
    console.log('🚪 Fancybox5 closed');
  });

})();
