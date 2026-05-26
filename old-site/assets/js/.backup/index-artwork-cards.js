/* ===========================================
   INDEX.HTML ARTWORK CARD ENHANCEMENTS
   Quick view modal, hover details, card interactions
   =========================================== */

(function() {
  'use strict';
  
  // Quick View Modal
  function createQuickViewModal() {
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.id = 'quickViewModal';
    modal.innerHTML = `
      <div class="quick-view-content">
        <div class="quick-view-header">
          <h3 class="quick-view-title"></h3>
          <button class="quick-view-close" aria-label="Close">×</button>
        </div>
        <div class="quick-view-body">
          <img class="quick-view-image" src="" alt="">
          <div class="quick-view-details"></div>
        </div>
        <div class="quick-view-actions">
          <button class="btn btn-primary view-full-btn">View Full Size</button>
          <button class="btn btn-outline-secondary favorite-quick-btn">
            <i class="bx bx-heart"></i> Favorite
          </button>
          <button class="btn btn-outline-secondary share-quick-btn">
            <i class="bx bx-share-alt"></i> Share
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Close handlers
    modal.querySelector('.quick-view-close').addEventListener('click', closeQuickView);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeQuickView();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeQuickView();
      }
    });
    
    return modal;
  }
  
  function openQuickView(artworkCard) {
    let modal = document.getElementById('quickViewModal');
    if (!modal) modal = createQuickViewModal();
    
    const title = artworkCard.dataset.title || artworkCard.querySelector('img')?.alt || 'Artwork';
    const imageSrc = artworkCard.dataset.src || artworkCard.querySelector('img')?.src || '';
    const category = artworkCard.dataset.category || '';
    const year = artworkCard.dataset.year || '';
    const description = artworkCard.dataset.description || artworkCard.dataset.extendedDescription || '';
    
    modal.querySelector('.quick-view-title').textContent = title;
    modal.querySelector('.quick-view-image').src = imageSrc;
    modal.querySelector('.quick-view-image').alt = title;
    
    const details = modal.querySelector('.quick-view-details');
    details.innerHTML = `
      ${category ? `<div><strong>Category:</strong> ${category}</div>` : ''}
      ${year ? `<div><strong>Year:</strong> ${year}</div>` : ''}
      ${description ? `<p>${description}</p>` : ''}
    `;
    
    // Set full view link
    const fullViewBtn = modal.querySelector('.view-full-btn');
    const fullViewLink = artworkCard.querySelector('a[data-fancybox]')?.href || artworkCard.querySelector('a')?.href || '';
    if (fullViewLink) {
      fullViewBtn.onclick = () => {
        closeQuickView();
        window.location.href = fullViewLink;
      };
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  // Add hover details to artwork cards
  function enhanceArtworkCards() {
    const cards = document.querySelectorAll('.artwork-card, .jfsn-artcard');
    
    cards.forEach(card => {
      // Skip if already enhanced
      if (card.querySelector('.artwork-card-hover-details')) return;
      
      const img = card.querySelector('img');
      const imageContainer = img?.closest('.artwork-image-container, .jfsn-artcard-img-wrap') || img?.parentElement;
      
      if (!imageContainer) return;
      
      const title = card.dataset.title || img?.alt || 'Artwork';
      const category = card.dataset.category || '';
      const year = card.dataset.year || '';
      
      const hoverDetails = document.createElement('div');
      hoverDetails.className = 'artwork-card-hover-details';
      hoverDetails.innerHTML = `
        <div class="artwork-card-hover-title">${title}</div>
        <div class="artwork-card-hover-meta">
          ${category ? `<span>${category}</span>` : ''}
          ${year ? `<span>${year}</span>` : ''}
        </div>
      `;
      
      imageContainer.appendChild(hoverDetails);
      
      // Add quick view on click
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking a button or link
        if (e.target.closest('button, a')) return;
        
        e.preventDefault();
        openQuickView(card);
      });
    });
  }
  
  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceArtworkCards);
  } else {
    enhanceArtworkCards();
  }
  
  // Re-enhance when gallery updates
  const observer = new MutationObserver(() => {
    enhanceArtworkCards();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Expose globally
  window.openQuickView = openQuickView;
  window.closeQuickView = closeQuickView;
})();

