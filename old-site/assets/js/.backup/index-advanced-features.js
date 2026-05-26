/**
 * INDEX PAGE - ADVANCED UX/UI FEATURES
 * Comprehensive implementation of all advanced features
 */

(function() {
  'use strict';

  // Check for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===========================================
     1. IMAGE LOADING OPTIMIZATION
     =========================================== */
  function initImageOptimization() {
    // Add aspect ratio containers and blur-up placeholders
    const artworkImages = document.querySelectorAll('.jfsn-artcard img, .artwork-card img');
    
    artworkImages.forEach(img => {
      // Skip if already processed
      if (img.dataset.optimized) return;
      
      const parent = img.parentElement;
      if (!parent) return;
      
      // Create wrapper with aspect ratio
      const wrapper = document.createElement('div');
      wrapper.className = 'artwork-image-wrapper';
      
      // Get image dimensions for aspect ratio
      const width = img.width || 400;
      const height = img.height || 300;
      const aspectRatio = width / height;
      wrapper.style.aspectRatio = `${width} / ${height}`;
      
      // Create blur placeholder
      const blurPlaceholder = document.createElement('img');
      blurPlaceholder.className = 'artwork-image-blur-placeholder';
      blurPlaceholder.src = img.src;
      blurPlaceholder.alt = '';
      blurPlaceholder.setAttribute('aria-hidden', 'true');
      
      // Update main image
      img.className = (img.className || '') + ' artwork-image-main';
      
      // Add srcset if not present
      if (!img.srcset && img.src.includes('/thumbs/')) {
        const fullSize = img.src.replace('/thumbs/', '/');
        img.srcset = `${img.src} 400w, ${fullSize} 800w`;
        img.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
      }
      
      // Wrap image
      parent.insertBefore(wrapper, img);
      wrapper.appendChild(blurPlaceholder);
      wrapper.appendChild(img);
      
      // Load handlers
      img.addEventListener('load', () => {
        img.classList.add('loaded');
        wrapper.classList.add('loaded');
        setTimeout(() => {
          blurPlaceholder.classList.add('loaded');
        }, 100);
      });
      
      img.dataset.optimized = 'true';
    });
  }

  /* ===========================================
     2. SEARCH FUNCTIONALITY
     =========================================== */
  function initSearch() {
    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
      <div class="search-input-wrapper">
        <input type="text" 
               class="search-input" 
               placeholder="Search artworks, collections..." 
               id="globalSearchInput"
               aria-label="Search">
        <i class="bx bx-search search-icon"></i>
        <span class="search-shortcut-hint">⌘K</span>
      </div>
      <div class="search-results" id="searchResults"></div>
    `;
    
    // Insert search (you can customize where to place it)
    const navbar = document.querySelector('.navbar-nav');
    if (navbar) {
      const navItem = document.createElement('li');
      navItem.className = 'nav-item';
      navItem.appendChild(searchContainer);
      navbar.appendChild(navItem);
    }
    
    const searchInput = document.getElementById('globalSearchInput');
    const searchResults = document.getElementById('searchResults');
    
    // Early return if elements don't exist
    if (!searchInput || !searchResults) {
      console.warn('Search elements not found, skipping search initialization');
      return;
    }
    
    let searchTimeout;
    let currentFocus = -1;
    
    // Search function
    function performSearch(query) {
      if (!query || query.length < 2) {
        searchResults.classList.remove('active');
        return;
      }
      
      // Simple search implementation (extend with actual data)
      const results = searchArtworks(query);
      displaySearchResults(results);
    }
    
    function searchArtworks(query) {
      // This would search your actual artwork data
      // For now, return mock results
      const artworks = document.querySelectorAll('.jfsn-artcard, .artwork-card');
      const results = [];
      
      artworks.forEach((card, index) => {
        const title = card.querySelector('.jfsn-artcard-title, .artwork-title')?.textContent || '';
        const meta = card.querySelector('.jfsn-artcard-meta, .artwork-meta')?.textContent || '';
        const img = card.querySelector('img');
        
        if (title.toLowerCase().includes(query.toLowerCase()) || 
            meta.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            title: title,
            meta: meta,
            image: img?.src || '',
            element: card
          });
        }
      });
      
      return results;
    }
    
    function displaySearchResults(results) {
      if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
        searchResults.classList.add('active');
        return;
      }
      
      searchResults.innerHTML = results.map((result, index) => `
        <div class="search-result-item" data-index="${index}" tabindex="0">
          ${result.image ? `<img src="${result.image}" alt="" class="search-result-thumb">` : ''}
          <div class="search-result-info">
            <div class="search-result-title">${result.title}</div>
            <div class="search-result-meta">${result.meta}</div>
          </div>
        </div>
      `).join('');
      
      searchResults.classList.add('active');
      
      // Add click handlers
      searchResults.querySelectorAll('.search-result-item').forEach((item, index) => {
        item.addEventListener('click', () => {
          results[index].element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          searchResults.classList.remove('active');
          searchInput.value = '';
        });
      });
    }
    
    // Search input handler
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        performSearch(e.target.value);
      }, 300);
    });
    
    // Keyboard shortcut (Cmd/Ctrl + K)
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!searchContainer.contains(e.target)) {
        searchResults.classList.remove('active');
      }
    });
  }

  /* ===========================================
     3. KEYBOARD SHORTCUTS OVERLAY
     =========================================== */
  function initKeyboardShortcuts() {
    const shortcuts = [
      { keys: ['?'], description: 'Show keyboard shortcuts', category: 'General' },
      { keys: ['⌘', 'K'], description: 'Open search', category: 'Navigation' },
      { keys: ['Esc'], description: 'Close modals/overlays', category: 'Navigation' },
      { keys: ['Home'], description: 'Scroll to top', category: 'Navigation' },
      { keys: ['End'], description: 'Scroll to bottom', category: 'Navigation' },
      { keys: ['↑', '↓'], description: 'Navigate cards (when focused)', category: 'Navigation' },
      { keys: ['Enter'], description: 'Activate focused element', category: 'Navigation' },
    ];
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'keyboard-shortcuts-overlay';
    overlay.innerHTML = `
      <div class="keyboard-shortcuts-modal">
        <div class="keyboard-shortcuts-header">
          <h2 class="keyboard-shortcuts-title">Keyboard Shortcuts</h2>
          <button class="keyboard-shortcuts-close" aria-label="Close">×</button>
        </div>
        <div class="keyboard-shortcuts-content"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    
    const content = overlay.querySelector('.keyboard-shortcuts-content');
    const groups = {};
    
    // Group shortcuts by category
    shortcuts.forEach(shortcut => {
      if (!groups[shortcut.category]) {
        groups[shortcut.category] = [];
      }
      groups[shortcut.category].push(shortcut);
    });
    
    // Render shortcuts
    Object.keys(groups).forEach(category => {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'keyboard-shortcut-group';
      groupDiv.innerHTML = `
        <div class="keyboard-shortcut-group-title">${category}</div>
        ${groups[category].map(shortcut => `
          <div class="keyboard-shortcut-item">
            <span class="keyboard-shortcut-description">${shortcut.description}</span>
            <div class="keyboard-shortcut-keys">
              ${shortcut.keys.map(key => `<span class="keyboard-key">${key}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      `;
      content.appendChild(groupDiv);
    });
    
    // Toggle overlay
    function toggleOverlay() {
      overlay.classList.toggle('active');
    }
    
    // Show on ? key
    document.addEventListener('keydown', (e) => {
      if (e.key === '?' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        toggleOverlay();
      }
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        toggleOverlay();
      }
    });
    
    // Close button
    overlay.querySelector('.keyboard-shortcuts-close').addEventListener('click', toggleOverlay);
    
    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        toggleOverlay();
      }
    });
  }

  /* ===========================================
     4. CONTENT PREVIEWS & TOOLTIPS
     =========================================== */
  function initTooltips() {
    const artworkCards = document.querySelectorAll('.jfsn-artcard, .artwork-card');
    
    artworkCards.forEach(card => {
      const tooltip = document.createElement('div');
      tooltip.className = 'artwork-tooltip';
      
      const title = card.querySelector('.jfsn-artcard-title, .artwork-title')?.textContent || 'Artwork';
      const meta = card.querySelector('.jfsn-artcard-meta, .artwork-meta')?.textContent || '';
      const year = card.dataset.year || '';
      const category = card.dataset.category || '';
      
      tooltip.innerHTML = `
        <div class="artwork-tooltip-title">${title}</div>
        <div class="artwork-tooltip-meta">
          ${year ? `<span class="artwork-tooltip-year">${year}</span>` : ''}
          ${category ? `<span class="artwork-tooltip-category">${category}</span>` : ''}
        </div>
        ${meta ? `<div class="artwork-tooltip-description">${meta}</div>` : ''}
      `;
      
      card.style.position = 'relative';
      card.appendChild(tooltip);
      
      let tooltipTimeout;
      
      card.addEventListener('mouseenter', () => {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
          tooltip.classList.add('visible');
        }, 500);
      });
      
      card.addEventListener('mouseleave', () => {
        clearTimeout(tooltipTimeout);
        tooltip.classList.remove('visible');
      });
    });
  }

  /* ===========================================
     5. SOCIAL SHARING
     =========================================== */
  function initSocialSharing() {
    // Add share buttons to artwork cards
    const artworkCards = document.querySelectorAll('.jfsn-artcard, .artwork-card');
    
    artworkCards.forEach(card => {
      const shareContainer = document.createElement('div');
      shareContainer.className = 'share-buttons';
      shareContainer.style.display = 'none';
      shareContainer.innerHTML = `
        <button class="share-button share-button-facebook" data-platform="facebook" aria-label="Share on Facebook">
          <i class="bx bxl-facebook"></i>
          <span>Facebook</span>
        </button>
        <button class="share-button share-button-twitter" data-platform="twitter" aria-label="Share on Twitter">
          <i class="bx bxl-twitter"></i>
          <span>Twitter</span>
        </button>
        <button class="share-button share-button-linkedin" data-platform="linkedin" aria-label="Share on LinkedIn">
          <i class="bx bxl-linkedin"></i>
          <span>LinkedIn</span>
        </button>
        <button class="share-button share-button-copy" data-platform="copy" aria-label="Copy link">
          <i class="bx bx-link"></i>
          <span>Copy Link</span>
        </button>
      `;
      
      card.appendChild(shareContainer);
      
      // Show on hover
      card.addEventListener('mouseenter', () => {
        shareContainer.style.display = 'flex';
      });
      
      card.addEventListener('mouseleave', () => {
        shareContainer.style.display = 'none';
      });
      
      // Share handlers
      shareContainer.querySelectorAll('.share-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          shareArtwork(card, btn.dataset.platform);
        });
      });
    });
  }
  
  function shareArtwork(card, platform) {
    const title = card.querySelector('.jfsn-artcard-title, .artwork-title')?.textContent || 'Artwork';
    const url = window.location.href;
    const text = `Check out this artwork: ${title}`;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        showShareToast('Link copied to clipboard!');
      });
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    } else if (navigator.share) {
      navigator.share({
        title: title,
        text: text,
        url: url
      });
    }
  }
  
  function showShareToast(message) {
    const toast = document.createElement('div');
    toast.className = 'share-toast';
    toast.innerHTML = `<i class="bx bx-check-circle"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('visible'), 100);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /* ===========================================
     6. EMPTY STATES & ERROR HANDLING
     =========================================== */
  function initErrorHandling() {
    // Image error handling
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function() {
        this.dataset.error = 'true';
        this.alt = 'Image failed to load';
        
        // Show retry option
        const retryBtn = document.createElement('button');
        retryBtn.className = 'error-retry-button';
        retryBtn.textContent = 'Retry';
        retryBtn.addEventListener('click', () => {
          this.src = this.src;
          this.dataset.error = 'false';
          retryBtn.remove();
        });
        
        this.parentElement.appendChild(retryBtn);
      });
    });
  }

  /* ===========================================
     7. CONTENT FILTERING & SORTING
     =========================================== */
  function initFiltering() {
    // This would be implemented based on your actual data structure
    // For now, create the UI structure
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-sort-container';
    filterContainer.innerHTML = `
      <div class="filter-chips" id="filterChips"></div>
      <div class="sort-dropdown">
        <button class="sort-button" id="sortButton">
          Sort <i class="bx bx-chevron-down"></i>
        </button>
        <div class="sort-menu" id="sortMenu">
          <div class="sort-menu-item" data-sort="newest">Newest First</div>
          <div class="sort-menu-item" data-sort="oldest">Oldest First</div>
          <div class="sort-menu-item" data-sort="alphabetical">Alphabetical</div>
          <div class="sort-menu-item" data-sort="category">By Category</div>
        </div>
      </div>
    `;
    
    // Add filter chips (example categories)
    const categories = ['Guernica', 'Mr. Snowmann', 'Studio Works', 'Art School'];
    const chipsContainer = filterContainer.querySelector('#filterChips');
    
    categories.forEach(category => {
      const chip = document.createElement('button');
      chip.className = 'filter-chip';
      chip.textContent = category;
      chip.dataset.category = category;
      chip.addEventListener('click', () => {
        chip.classList.toggle('active');
        applyFilters();
      });
      chipsContainer.appendChild(chip);
    });
    
    // Sort menu toggle
    const sortButton = filterContainer.querySelector('#sortButton');
    const sortMenu = filterContainer.querySelector('#sortMenu');
    
    sortButton.addEventListener('click', () => {
      sortMenu.classList.toggle('active');
    });
    
    sortMenu.querySelectorAll('.sort-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        sortMenu.querySelectorAll('.sort-menu-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        sortButton.textContent = `Sort: ${item.textContent}`;
        sortMenu.classList.remove('active');
        applySorting(item.dataset.sort);
      });
    });
    
    function applyFilters() {
      const activeFilters = Array.from(chipsContainer.querySelectorAll('.filter-chip.active'))
        .map(chip => chip.dataset.category);
      // Implement filtering logic
    }
    
    function applySorting(sortType) {
      // Implement sorting logic
    }
  }

  /* ===========================================
     8. RELATED CONTENT
     =========================================== */
  function initRelatedContent() {
    // This would show related artworks based on category, style, etc.
    // Implementation depends on your data structure
  }

  /* ===========================================
     9. ENHANCED ARTWORK CARDS
     =========================================== */
  function initEnhancedCards() {
    const artworkCards = document.querySelectorAll('.jfsn-artcard, .artwork-card');
    
    artworkCards.forEach(card => {
      // Add action buttons
      const actions = document.createElement('div');
      actions.className = 'artwork-card-actions';
      actions.innerHTML = `
        <button class="artwork-card-action-btn favorite" aria-label="Add to favorites">
          <i class="bx bx-heart"></i>
        </button>
        <button class="artwork-card-action-btn quick-view" aria-label="Quick view">
          <i class="bx bx-zoom-in"></i>
        </button>
        <button class="artwork-card-action-btn share" aria-label="Share">
          <i class="bx bx-share-alt"></i>
        </button>
      `;
      
      card.classList.add('artwork-card-enhanced');
      card.appendChild(actions);
      
      // Favorite button
      const favoriteBtn = actions.querySelector('.favorite');
      favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        favoriteBtn.classList.toggle('active');
        favoriteBtn.querySelector('i').classList.toggle('bxs-heart');
        favoriteBtn.querySelector('i').classList.toggle('bx-heart');
      });
      
      // Quick view button
      const quickViewBtn = actions.querySelector('.quick-view');
      quickViewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showQuickView(card);
      });
      
      // Share button
      const shareBtn = actions.querySelector('.share');
      shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        shareArtwork(card, 'copy');
      });
    });
  }
  
  function showQuickView(card) {
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
      <div class="quick-view-content">
        <button class="quick-view-close" aria-label="Close">
          <i class="bx bx-x"></i>
        </button>
        <img src="${card.querySelector('img')?.src.replace('/thumbs/', '/') || card.querySelector('img')?.src}" 
             alt="${card.querySelector('.jfsn-artcard-title, .artwork-title')?.textContent || 'Artwork'}" 
             class="quick-view-image">
        <div class="quick-view-info">
          <h3>${card.querySelector('.jfsn-artcard-title, .artwork-title')?.textContent || 'Artwork'}</h3>
          <p>${card.querySelector('.jfsn-artcard-meta, .artwork-meta')?.textContent || ''}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
    
    modal.querySelector('.quick-view-close').addEventListener('click', () => {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
      }
    });
  }

  /* ===========================================
     10. MOBILE GESTURES
     =========================================== */
  function initMobileGestures() {
    if (window.innerWidth > 768) return; // Desktop only
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    // Swipe detection
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    });
    
    function handleSwipe() {
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const minSwipeDistance = 50;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            // Swipe right
            handleSwipeRight();
          } else {
            // Swipe left
            handleSwipeLeft();
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            // Swipe down
            handleSwipeDown();
          } else {
            // Swipe up
            handleSwipeUp();
          }
        }
      }
    }
    
    function handleSwipeLeft() {
      // Navigate to next artwork/card
    }
    
    function handleSwipeRight() {
      // Navigate to previous artwork/card
    }
    
    function handleSwipeDown() {
      // Close modals
      const modals = document.querySelectorAll('.quick-view-modal.active, .keyboard-shortcuts-overlay.active');
      modals.forEach(modal => {
        modal.classList.remove('active');
      });
    }
    
    function handleSwipeUp() {
      // Open collections/expand content
    }
    
    // Pull to refresh
    let pullStartY = 0;
    let pullDistance = 0;
    
    window.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        pullStartY = e.touches[0].clientY;
      }
    });
    
    window.addEventListener('touchmove', (e) => {
      if (window.scrollY === 0 && pullStartY > 0) {
        pullDistance = e.touches[0].clientY - pullStartY;
        if (pullDistance > 0) {
          // Show pull to refresh indicator
        }
      }
    });
    
    window.addEventListener('touchend', () => {
      if (pullDistance > 100) {
        // Trigger refresh
        location.reload();
      }
      pullStartY = 0;
      pullDistance = 0;
    });
  }

  /* ===========================================
     INITIALIZATION
     =========================================== */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    // Initialize all features
    initImageOptimization();
    initSearch();
    initKeyboardShortcuts();
    initTooltips();
    initSocialSharing();
    initErrorHandling();
    initFiltering();
    initRelatedContent();
    initEnhancedCards();
    initMobileGestures();
  }
  
  // Start initialization
  init();
})();

