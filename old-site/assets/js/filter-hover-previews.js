/**
 * Filter Hover Previews
 * Shows 2-3 thumbnail previews when hovering over filter buttons
 */

(function() {
  'use strict';

  let hoverTimeout;
  let currentPreview = null;
  const PREVIEW_DELAY = 300; // Delay before showing preview (ms)
  const PREVIEW_SAMPLE_COUNT = 3; // Number of thumbnails to show

  // Get sample artworks for a category
  function getSampleArtworks(category) {
    const artworks = window.ArtGallery?.state?.allArtworks || 
                     window.galleryData || 
                     [];
    
    if (!artworks || artworks.length === 0) {
      return [];
    }

    let filtered = [];
    
    if (category === 'all') {
      // Get random samples from all artworks
      filtered = artworks.slice(0, PREVIEW_SAMPLE_COUNT);
    } else if (category === 'favorites') {
      // Get favorites from localStorage
      const favorites = JSON.parse(localStorage.getItem('artworkFavorites') || '[]');
      filtered = artworks.filter(art => favorites.includes(art.id?.toString()));
    } else if (category.startsWith('orientation-')) {
      // Handle orientation filters
      const orientation = category.replace('orientation-', '');
      filtered = artworks.filter(art => art.orientation === orientation);
    } else {
      // Filter by category
      filtered = artworks.filter(art => {
        const artCategory = art.category?.toLowerCase() || '';
        const filterCategory = category.toLowerCase();
        return artCategory === filterCategory || 
               artCategory.includes(filterCategory) ||
               (art.keywords && art.keywords.some(kw => 
                 kw.toLowerCase().includes(filterCategory)
               ));
      });
    }

    // Return up to PREVIEW_SAMPLE_COUNT samples
    return filtered.slice(0, PREVIEW_SAMPLE_COUNT);
  }

  // Create preview tooltip HTML
  function createPreviewHTML(artworks, category) {
    if (!artworks || artworks.length === 0) {
      return '<div class="filter-preview-empty">No preview available</div>';
    }

    const thumbnails = artworks.map(art => {
      const imageUrl = art.image || 
                       (art.artworkNumber ? `artworks/thumbs/art${art.artworkNumber}.avif` : '') ||
                       'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjM2NmYxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BcnR3b3JrPC90ZXh0Pjwvc3ZnPg==';
      
      return `
        <div class="filter-preview-thumbnail">
          <img src="${imageUrl}" 
               alt="${art.title || 'Artwork'}" 
               loading="lazy"
               onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjM2NmYxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BcnR3b3JrPC90ZXh0Pjwvc3ZnPg=='">
        </div>
      `;
    }).join('');

    return `
      <div class="filter-preview-content">
        <div class="filter-preview-thumbnails">
          ${thumbnails}
        </div>
        <div class="filter-preview-count">${artworks.length} ${artworks.length === 1 ? 'artwork' : 'artworks'}</div>
      </div>
    `;
  }

  // Show preview tooltip
  function showPreview(button, category) {
    // Hide any existing preview
    hidePreview();

    const artworks = getSampleArtworks(category);
    
    // Create preview element
    const preview = document.createElement('div');
    preview.className = 'filter-preview';
    preview.innerHTML = createPreviewHTML(artworks, category);
    
    document.body.appendChild(preview);
    currentPreview = preview;

    // Position preview
    positionPreview(button, preview);

    // Animate in
    requestAnimationFrame(() => {
      preview.classList.add('visible');
    });
  }

  // Position preview relative to button
  function positionPreview(button, preview) {
    const rect = button.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    // Position above button by default
    let top = rect.top + scrollY - preview.offsetHeight - 10;
    let left = rect.left + scrollX + (rect.width / 2) - (preview.offsetWidth / 2);

    // Adjust if too close to top
    if (rect.top < preview.offsetHeight + 20) {
      top = rect.bottom + scrollY + 10;
    }

    // Adjust if too close to left edge
    if (left < 10) {
      left = 10;
    }

    // Adjust if too close to right edge
    const maxLeft = window.innerWidth - preview.offsetWidth - 10;
    if (left > maxLeft) {
      left = maxLeft;
    }

    preview.style.top = `${top}px`;
    preview.style.left = `${left}px`;
  }

  // Hide preview tooltip
  function hidePreview() {
    if (currentPreview) {
      currentPreview.classList.remove('visible');
      setTimeout(() => {
        if (currentPreview && currentPreview.parentNode) {
          currentPreview.parentNode.removeChild(currentPreview);
        }
        currentPreview = null;
      }, 200);
    }
  }

  // Initialize hover previews
  function initHoverPreviews() {
    const filterButtons = document.querySelectorAll('.filter-btn[data-category]');
    
    filterButtons.forEach(button => {
      const category = button.getAttribute('data-category');
      
      if (!category || category === 'all') {
        return; // Skip "all" button or buttons without category
      }

      // Mouse enter
      button.addEventListener('mouseenter', () => {
        hoverTimeout = setTimeout(() => {
          showPreview(button, category);
        }, PREVIEW_DELAY);
      });

      // Mouse leave
      button.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
        hidePreview();
      });

      // Keep preview visible when hovering over it
      document.addEventListener('mouseenter', (e) => {
        if (e.target && e.target instanceof Element && e.target.closest('.filter-preview')) {
          clearTimeout(hoverTimeout);
        }
      }, true);

      document.addEventListener('mouseleave', (e) => {
        if (e.target && e.target instanceof Element && e.target.closest('.filter-preview')) {
          hidePreview();
        }
      }, true);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Wait for artwork data to load
      setTimeout(initHoverPreviews, 1000);
    });
  } else {
    setTimeout(initHoverPreviews, 1000);
  }

  // Re-initialize when artwork data loads
  document.addEventListener('artworkDataLoaded', () => {
    setTimeout(initHoverPreviews, 500);
  });

})();

