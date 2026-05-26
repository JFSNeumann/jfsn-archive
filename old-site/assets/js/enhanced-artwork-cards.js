/**
 * ENHANCED ARTWORK CARDS
 * Quick view modals, hover details, related artworks
 */

(function() {
  'use strict';

  let allArtworksData = [];
  let currentArtwork = null;

  // Initialize artwork data
  function initArtworkData() {
    // Try to get from existing gallery data
    if (window.allArtworks && Array.isArray(window.allArtworks)) {
      allArtworksData = window.allArtworks;
    } else if (window.galleryData && Array.isArray(window.galleryData)) {
      allArtworksData = window.galleryData;
    }
  }

  // Quick view function
  function quickView(artworkFile, artworkData = null) {
    // Find artwork data if not provided
    if (!artworkData) {
      artworkData = allArtworksData.find(art => art.file === artworkFile);
    }

    if (!artworkData) {
      console.warn('Artwork data not found:', artworkFile);
      return;
    }

    currentArtwork = artworkData;
    
    // Create or get modal
    let modal = document.getElementById('quickViewModal');
    if (!modal) {
      modal = createQuickViewModal();
      document.body.appendChild(modal);
    }

    // Populate modal
    populateQuickView(modal, artworkData);

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus management
    const closeBtn = modal.querySelector('.quick-view-close');
    if (closeBtn) closeBtn.focus();
  }

  // Create quick view modal HTML
  function createQuickViewModal() {
    const modal = document.createElement('div');
    modal.id = 'quickViewModal';
    modal.className = 'quick-view-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'quick-view-title');
    
    modal.innerHTML = `
      <div class="quick-view-content">
        <div class="quick-view-header">
          <h2 id="quick-view-title" class="quick-view-title"></h2>
          <button class="quick-view-close" aria-label="Close quick view" type="button">
            <i class="bx bx-x"></i>
          </button>
        </div>
        <div class="quick-view-body">
          <img class="quick-view-image" alt="" />
          <div class="quick-view-info">
            <div class="quick-view-meta"></div>
            <div class="quick-view-description"></div>
            <div class="quick-view-keywords"></div>
            <div class="quick-view-actions"></div>
            <div class="related-artworks"></div>
          </div>
        </div>
      </div>
    `;

    // Close handlers
    const closeBtn = modal.querySelector('.quick-view-close');
    closeBtn.addEventListener('click', closeQuickView);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeQuickView();
    });

    // Keyboard handler
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeQuickView();
    });

    return modal;
  }

  // Populate quick view with artwork data
  function populateQuickView(modal, artwork) {
    const title = modal.querySelector('.quick-view-title');
    const image = modal.querySelector('.quick-view-image');
    const meta = modal.querySelector('.quick-view-meta');
    const description = modal.querySelector('.quick-view-description');
    const keywords = modal.querySelector('.quick-view-keywords');
    const actions = modal.querySelector('.quick-view-actions');
    const related = modal.querySelector('.quick-view-actions').nextElementSibling;

    // Title
    title.textContent = artwork.title || 'Untitled';

    // Image - use thumbs on mobile
    let imageSrc = artwork.file 
      ? `index/artworks/${artwork.file}`
      : artwork.image || artwork.src || '';
    // Convert to thumbs on mobile
    if (window.MobileArtworkPathConverter && window.MobileArtworkPathConverter.isMobile() && imageSrc.includes('artworks/') && !imageSrc.includes('thumbs/')) {
      imageSrc = window.MobileArtworkPathConverter.convertToThumbPath(imageSrc);
    }
    image.src = imageSrc;
    image.alt = artwork.title || artwork.description || 'Artwork';

    // Meta
    meta.innerHTML = '';
    if (artwork.category) {
      meta.innerHTML += `<div class="quick-view-meta-item">
        <i class="bx bx-category"></i>
        <span>${artwork.category}</span>
      </div>`;
    }
    if (artwork.year) {
      meta.innerHTML += `<div class="quick-view-meta-item">
        <i class="bx bx-calendar"></i>
        <span>${artwork.year}</span>
      </div>`;
    }
    if (artwork.medium) {
      meta.innerHTML += `<div class="quick-view-meta-item">
        <i class="bx bx-palette"></i>
        <span>${artwork.medium}</span>
      </div>`;
    }

    // Description
    description.textContent = artwork.extended_description || artwork.description || 'No description available.';

    // Keywords
    keywords.innerHTML = '';
    if (artwork.keywords && Array.isArray(artwork.keywords)) {
      artwork.keywords.forEach(keyword => {
        const tag = document.createElement('span');
        tag.className = 'keyword-tag';
        tag.textContent = keyword;
        keywords.appendChild(tag);
      });
    }

    // Actions
    actions.innerHTML = `
      <button class="btn btn-primary" onclick="window.openFullView('${artwork.file || artwork.id}')">
        <i class="bx bx-fullscreen"></i> View Full Size
      </button>
      <button class="btn btn-outline-primary" onclick="window.shareArtwork('${artwork.file || artwork.id}')">
        <i class="bx bx-share-alt"></i> Share
      </button>
    `;

    // Related artworks
    if (related) {
      loadRelatedArtworks(related, artwork);
    }
  }

  // Load related artworks
  function loadRelatedArtworks(container, currentArtwork) {
    if (!allArtworksData.length) return;

    // Find related artworks (same category, different artwork)
    const related = allArtworksData
      .filter(art => 
        art.file !== currentArtwork.file &&
        art.category === currentArtwork.category
      )
      .slice(0, 4);

    if (related.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';
    container.innerHTML = `
      <div class="related-artworks-title">Related Artworks</div>
      <div class="related-artworks-grid">
        ${related.map(art => `
          <div class="related-artwork-item" onclick="window.quickView('${art.file}')">
            <img src="index/artworks/thumbs/${art.file}" alt="${art.title || ''}" />
          </div>
        `).join('')}
      </div>
    `;
  }

  // Close quick view
  function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Enhanced hover details
  function enhanceHoverDetails() {
    const cards = document.querySelectorAll('.artwork-card');
    
    cards.forEach(card => {
      const imgContainer = card.querySelector('.artwork-image-container');
      if (!imgContainer) return;

      // Check if hover details already exist
      if (imgContainer.querySelector('.hover-details')) return;

      // Find artwork data
      const artworkFile = card.querySelector('a')?.href?.match(/artworks\/(.+)$/)?.[1];
      const artwork = allArtworksData.find(art => art.file === artworkFile);

      if (!artwork) return;

      // Create hover details
      const hoverDetails = document.createElement('div');
      hoverDetails.className = 'hover-details';
      hoverDetails.innerHTML = `
        <div class="hover-details-title">${artwork.title || 'Untitled'}</div>
        <div class="hover-details-meta">
          ${artwork.category ? `<span>${artwork.category}</span>` : ''}
          ${artwork.year ? `<span>${artwork.year}</span>` : ''}
        </div>
        ${artwork.description ? `
          <div class="hover-details-description">${artwork.description.substring(0, 120)}${artwork.description.length > 120 ? '...' : ''}</div>
        ` : ''}
      `;

      imgContainer.appendChild(hoverDetails);
    });
  }

  // Expose to global scope
  window.quickView = quickView;
  window.closeQuickView = closeQuickView;

  // Initialize
  function init() {
    initArtworkData();
    
    // Enhance existing cards
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', enhanceHoverDetails);
    } else {
      enhanceHoverDetails();
    }

    // Re-enhance after gallery updates
    document.addEventListener('galleryUpdated', () => {
      setTimeout(enhanceHoverDetails, 100);
    });
  }

  init();
})();

