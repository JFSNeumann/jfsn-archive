/**
 * PICTURE ELEMENT GENERATOR
 * Generates <picture> elements with AVIF/WebP/JPEG fallbacks
 * Automatically converts existing <img> tags for better compatibility
 * Created: 2025-11-06
 */

(function() {
  'use strict';

  // ===== CONFIG =====
  const config = {
    enableAutoConversion: true,
    preferAVIF: true,
    preferWebP: true,
    lazyLoad: true,
    addPlaceholders: true,
    placeholderBlur: 20,
    respectReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  // ===== BROWSER SUPPORT DETECTION =====
  const support = {
    avif: false,
    webp: false,
    lazyLoading: 'loading' in HTMLImageElement.prototype
  };

  // Check AVIF support
  async function checkAVIFSupport() {
    try {
      const avifTest = new Image();
      avifTest.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
      await avifTest.decode();
      support.avif = true;
    } catch {
      support.avif = false;
    }
  }

  // Check WebP support
  function checkWebPSupport() {
    const webpTest = new Image();
    webpTest.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
    webpTest.onload = webpTest.onerror = function() {
      support.webp = (webpTest.height === 1);
    };
  }

  // ===== GENERATE PICTURE ELEMENT =====
  /**
   * Generate a <picture> element with multiple format fallbacks
   * @param {Object} options - Configuration options
   * @param {string} options.src - Original image source (JPEG/PNG)
   * @param {string} [options.avif] - AVIF source (if different)
   * @param {string} [options.webp] - WebP source (if different)
   * @param {string} [options.alt] - Alt text
   * @param {string} [options.class] - CSS class names
   * @param {boolean} [options.lazy] - Enable lazy loading
   * @param {string} [options.sizes] - Sizes attribute
   * @param {string} [options.placeholder] - Placeholder image
   * @returns {HTMLPictureElement}
   */
  function createPictureElement(options) {
    const {
      src,
      avif = null,
      webp = null,
      alt = '',
      class: className = '',
      lazy = config.lazyLoad,
      sizes = '100vw',
      placeholder = null,
      width = null,
      height = null
    } = options;

    // Create picture element
    const picture = document.createElement('picture');
    picture.className = className;

    // Auto-generate format variations if not provided
    const avifSrc = avif || generateFormatPath(src, 'avif');
    const webpSrc = webp || generateFormatPath(src, 'webp');

    // Add AVIF source (best compression, newest format)
    if (config.preferAVIF) {
      const avifSource = document.createElement('source');
      avifSource.type = 'image/avif';
      avifSource.srcset = lazy ? '' : avifSrc;
      if (lazy) avifSource.dataset.srcset = avifSrc;
      if (sizes) avifSource.sizes = sizes;
      picture.appendChild(avifSource);
    }

    // Add WebP source (good compression, wide support)
    if (config.preferWebP) {
      const webpSource = document.createElement('source');
      webpSource.type = 'image/webp';
      webpSource.srcset = lazy ? '' : webpSrc;
      if (lazy) webpSource.dataset.srcset = webpSrc;
      if (sizes) webpSource.sizes = sizes;
      picture.appendChild(webpSource);
    }

    // Add fallback img (JPEG/PNG, universal support)
    const img = document.createElement('img');
    img.alt = alt;
    img.className = className;
    
    if (lazy && support.lazyLoading) {
      img.loading = 'lazy';
      img.src = placeholder || generatePlaceholder(width, height);
      img.dataset.src = src;
    } else {
      img.src = placeholder || src;
      if (lazy) img.dataset.src = src;
    }

    if (width) img.width = width;
    if (height) img.height = height;

    // Add intersection observer for lazy loading
    if (lazy && !support.lazyLoading) {
      img.classList.add('lazy-load');
      observeImage(img, picture);
    }

    picture.appendChild(img);

    return picture;
  }

  // ===== AUTO-GENERATE FORMAT PATH =====
  function generateFormatPath(originalSrc, format) {
    // If already has the format extension, return as is
    if (originalSrc.endsWith(`.${format}`)) {
      return originalSrc;
    }

    // Replace extension with new format
    return originalSrc.replace(/\.(jpg|jpeg|png|gif)$/i, `.${format}`);
  }

  // ===== GENERATE PLACEHOLDER =====
  function generatePlaceholder(width, height) {
    // Create tiny SVG placeholder with correct aspect ratio
    const w = width || 100;
    const h = height || 100;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
        <rect width="${w}" height="${h}" fill="#e2e8f0"/>
        <text x="50%" y="50%" font-family="system-ui" font-size="14" fill="#94a3b8" text-anchor="middle" dominant-baseline="middle">Loading...</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  // ===== LAZY LOADING WITH INTERSECTION OBSERVER =====
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const picture = entry.target;
        const img = picture.querySelector('img');
        const sources = picture.querySelectorAll('source');

        // Load sources
        sources.forEach(source => {
          if (source.dataset.srcset) {
            source.srcset = source.dataset.srcset;
            delete source.dataset.srcset;
          }
        });

        // Load image
        if (img && img.dataset.src) {
          img.src = img.dataset.src;
          delete img.dataset.src;
          img.classList.add('loaded');
        }

        observer.unobserve(picture);
      }
    });
  }, {
    rootMargin: '50px'
  });

  function observeImage(img, picture) {
    imageObserver.observe(picture);
  }

  // ===== CONVERT EXISTING IMG TAGS TO PICTURE =====
  function convertExistingImages() {
    if (!config.enableAutoConversion) return;

    const images = document.querySelectorAll('img[data-convert-to-picture]');

    images.forEach(img => {
      const picture = createPictureElement({
        src: img.src || img.dataset.src,
        alt: img.alt,
        class: img.className,
        lazy: img.loading === 'lazy' || img.classList.contains('lazy'),
        width: img.width || parseInt(img.getAttribute('width')),
        height: img.height || parseInt(img.getAttribute('height'))
      });

      img.replaceWith(picture);
    });

  }

  // ===== PUBLIC API =====
  window.PictureGenerator = {
    create: createPictureElement,
    convertExisting: convertExistingImages,
    support: support,
    config: config
  };

  // ===== AUTO-INITIALIZE =====
  async function init() {
    // Check format support
    await checkAVIFSupport();
    checkWebPSupport();

    // Auto-convert images on DOMContentLoaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', convertExistingImages);
    } else {
      convertExistingImages();
    }

  }

  init();

})();

// ===== USAGE EXAMPLES =====
/*

// Example 1: Create picture element programmatically
const picture = window.PictureGenerator.create({
  src: 'artworks/art1005.jpg',
  alt: 'Guernica-inspired artwork',
  class: 'artwork-image',
  lazy: true,
  width: 800,
  height: 600
});
document.body.appendChild(picture);

// Example 2: Convert existing image
<img 
  src="artworks/art1005.jpg"
  alt="Artwork"
  data-convert-to-picture
  loading="lazy"
>

// Example 3: Manual conversion
window.PictureGenerator.convertExisting();

// Example 4: Check browser support
// { avif: true, webp: true, lazyLoading: true }

*/

