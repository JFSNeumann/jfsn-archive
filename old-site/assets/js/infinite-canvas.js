/**
 * INFINITE CANVAS GALLERY
 * Zoomable, Pannable Canvas View with WebGL/Canvas Rendering
 */

(function() {
  'use strict';

  let scale = 1;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let artworks = [];
  let canvas = null;
  let ctx = null;

  // Initialize canvas gallery
  function initCanvasGallery() {
    const container = document.getElementById('canvasGallery');
    if (!container) return;
    
    // Check if already initialized
    if (container.dataset.initialized === 'true') return;
    container.dataset.initialized = 'true';

    createCanvasHTML(container);
    setupCanvas();
    loadArtworks();
    setupControls();
    setupEventListeners();
  }
  
  // Export for external use
  window.initCanvasGallery = initCanvasGallery;

  // Create canvas HTML structure
  function createCanvasHTML(container) {
    container.innerHTML = `
      <div class="canvas-gallery" id="canvasGalleryContent">
        <!-- Artworks will be added here -->
      </div>
      <div class="canvas-controls">
        <button class="canvas-control-btn" id="zoomIn" aria-label="Zoom in">
          <i class="bx bx-zoom-in"></i>
        </button>
        <button class="canvas-control-btn" id="zoomOut" aria-label="Zoom out">
          <i class="bx bx-zoom-out"></i>
        </button>
        <button class="canvas-control-btn" id="resetView" aria-label="Reset view">
          <i class="bx bx-reset"></i>
        </button>
      </div>
      <div class="canvas-zoom-indicator" id="zoomIndicator">
        <span id="zoomPercent">100%</span>
      </div>
    `;
  }

  // Setup canvas
  function setupCanvas() {
    const container = document.getElementById('canvasGallery');
    const content = document.getElementById('canvasGalleryContent');
    
    if (!container || !content) return;

    // Use Canvas API for better performance with many artworks
    canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    ctx = canvas.getContext('2d');
    
    container.appendChild(canvas);
  }

  // Load artworks
  async function loadArtworks() {
    try {
      // Try root path first, fallback to index subdirectory
      let response = await fetch('metadata.json').catch(() => fetch('index/metadata.json'));
      const data = await response.json();
      artworks = data.slice(0, 200); // Limit for performance
      
      renderArtworks();
    } catch (error) {
      console.error('Error loading artworks:', error);
    }
  }

  // Render artworks on canvas
  function renderArtworks() {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const spacing = 300;
    const cols = Math.ceil(Math.sqrt(artworks.length));
    const startX = (canvas.width - (cols * spacing)) / 2;
    const startY = 100;

    artworks.forEach((artwork, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const x = startX + (col * spacing) + panX;
      const y = startY + (row * spacing) + panY;

      // Draw artwork thumbnail
      const img = new Image();
      // Use thumbs on mobile, full images on desktop
      const imagePath = (window.MobileArtworkPathConverter && window.MobileArtworkPathConverter.isMobile())
        ? `artworks/thumbs/${artwork.file}`
        : `artworks/${artwork.file}`;
      img.src = imagePath;
      // CSP compliant - use addEventListener instead of onload
      img.addEventListener('load', function() {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        
        // Draw image
        const size = 200;
        ctx.drawImage(img, -size/2, -size/2, size, size);
        
        // Draw border
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(-size/2, -size/2, size, size);
        
        ctx.restore();
      });
    });
  }

  // Setup controls
  function setupControls() {
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    const resetView = document.getElementById('resetView');
    const zoomIndicator = document.getElementById('zoomIndicator');

    if (zoomIn) {
      zoomIn.addEventListener('click', () => {
        scale = Math.min(scale * 1.2, 5);
        updateZoom();
      });
    }

    if (zoomOut) {
      zoomOut.addEventListener('click', () => {
        scale = Math.max(scale / 1.2, 0.2);
        updateZoom();
      });
    }

    if (resetView) {
      resetView.addEventListener('click', () => {
        scale = 1;
        panX = 0;
        panY = 0;
        updateZoom();
        renderArtworks();
      });
    }

    function updateZoom() {
      const content = document.getElementById('canvasGalleryContent');
      if (content) {
        content.style.transform = `scale(${scale}) translate(${panX}px, ${panY}px)`;
      }
      
      const zoomPercent = document.getElementById('zoomPercent');
      if (zoomPercent) {
        zoomPercent.textContent = Math.round(scale * 100) + '%';
      }
      
      if (zoomIndicator) {
        zoomIndicator.classList.add('active');
        setTimeout(() => {
          zoomIndicator.classList.remove('active');
        }, 2000);
      }
      
      renderArtworks();
    }
  }

  // Setup event listeners
  function setupEventListeners() {
    const container = document.getElementById('canvasGallery');
    if (!container) return;

    // Mouse drag
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX - panX;
      startY = e.clientY - panY;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      panX = e.clientX - startX;
      panY = e.clientY - startY;
      renderArtworks();
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support
    let touchStartX = 0;
    let touchStartY = 0;

    container.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX - panX;
      touchStartY = touch.clientY - panY;
    });

    container.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      panX = touch.clientX - touchStartX;
      panY = touch.clientY - touchStartY;
      renderArtworks();
    });

    // Zoom with mouse wheel
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      scale = Math.max(0.2, Math.min(5, scale * delta));
      
      const zoomPercent = document.getElementById('zoomPercent');
      if (zoomPercent) {
        zoomPercent.textContent = Math.round(scale * 100) + '%';
      }
      
      const zoomIndicator = document.getElementById('zoomIndicator');
      if (zoomIndicator) {
        zoomIndicator.classList.add('active');
        setTimeout(() => {
          zoomIndicator.classList.remove('active');
        }, 2000);
      }
      
      renderArtworks();
    }, { passive: false });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCanvasGallery);
  } else {
    initCanvasGallery();
  }
})();

