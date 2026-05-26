/**
 * Art Gallery Main JavaScript
 * Handles artwork loading, filtering, and gallery rendering
 */

// Use state from core module if available, otherwise create fallback
if (!window.ArtGallery || !window.ArtGallery.state) {
  window.ArtGallery = window.ArtGallery || {};
  window.ArtGallery.state = {
    allArtworks: [],
    filteredArtworks: [],
    currentPage: 1,
    itemsPerPage: 24,
    isLoading: false,
    hasMoreItems: true,
    showingCategoryReps: false,
    hasUserInteracted: false
  };
}

// Convenience aliases for backward compatibility (reference the state object)
const allArtworks = window.ArtGallery.state.allArtworks;
const filteredArtworks = window.ArtGallery.state.filteredArtworks;
let currentPage = window.ArtGallery.state.currentPage;
const itemsPerPage = window.ArtGallery.state.itemsPerPage;
let isLoading = window.ArtGallery.state.isLoading;
let hasMoreItems = window.ArtGallery.state.hasMoreItems;
let showingCategoryReps = window.ArtGallery.state.showingCategoryReps;
let hasUserInteracted = window.ArtGallery.state.hasUserInteracted;

function getUrlCategoryParam() {
  const urlParams = new URLSearchParams(window.location.search);
  let value = urlParams.get('category') || urlParams.get('filter') || urlParams.get('series');
  if (value) return value;

  const rawSearch = window.location.search || '';
  const trimmed = rawSearch.startsWith('?') ? rawSearch.slice(1) : rawSearch;
  if (!trimmed) return null;

  const decodedSearch = decodeURIComponent(trimmed);
  if (decodedSearch === trimmed) return null;

  const decodedParams = new URLSearchParams(decodedSearch);
  return decodedParams.get('category') || decodedParams.get('filter') || decodedParams.get('series');
}

function normalizeCategoryParam(value) {
  if (!value) return '';
  const decoded = decodeURIComponent(String(value).replace(/\+/g, ' ')).trim();
  return decoded.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').toLowerCase();
}

// Load artwork metadata with proper HTTP caching and chunked processing
// NOTE: This function is now in art-gallery-core.js, but kept here for backward compatibility
// If core module already loaded, skip this
function loadArtworkData() {
  // If core module already loaded data, skip entirely - core module handles rendering
  if (window.ArtGallery && window.ArtGallery.state && window.ArtGallery.state.allArtworks.length > 0) {
    // Core module already loaded and will handle rendering via tryRender
    // Don't trigger another render here to prevent double rendering
    if (window.debugWarn) window.debugWarn('⚠️ Core module already loaded data, skipping duplicate loadArtworkData');
    return;
  }
  // Load metadata (cached for 1 hour, then revalidated)
  // Try root path first, fallback to index subdirectory
  fetch('metadata.json')
  .catch(() => fetch('index/metadata.json'))
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(async data => {
    
    // Performance optimization: Process initial batch immediately for fast first render
    const INITIAL_BATCH_SIZE = 100; // Process first 100 immediately
    
    // Get all categories from full dataset
    const allCategories = [...new Set(data.map(art => art.category).filter(Boolean))];
    
    // Create a set to find one artwork from each category (for representative view)
    const categoryRepresentatives = new Map();
    const seenCategories = new Set();
    
    // First pass: Find one artwork from each category
    for (let artwork of data) {
      if (artwork.category && !seenCategories.has(artwork.category)) {
        const orientations = ['horizontal', 'vertical', 'square'];
        const sizes = ['small', 'medium', 'large', 'extra-large'];
        const index = categoryRepresentatives.size;
        
        categoryRepresentatives.set(artwork.category, {
          ...artwork,
          width: 800 + (index % 500),
          height: 600 + (index % 400),
          aspectRatio: 1.33,
          orientation: orientations[index % orientations.length],
          sizeCategory: sizes[index % sizes.length],
          dimensionsProcessed: false
        });
        seenCategories.add(artwork.category);
        
        // If we have all categories, we can stop searching
        if (seenCategories.size === allCategories.length) {
          break;
        }
      }
    }
    
    // Store category representatives globally for later use
    window.categoryRepresentatives = Array.from(categoryRepresentatives.values());
    
    // Process initial batch for immediate display
    const initialBatch = data.slice(0, INITIAL_BATCH_SIZE).map((artwork, index) => {
      const orientations = ['horizontal', 'vertical', 'square'];
      const sizes = ['small', 'medium', 'large', 'extra-large'];
      
      return {
        ...artwork,
        width: 800 + (index % 500),
        height: 600 + (index % 400),
        aspectRatio: 1.33,
        orientation: orientations[index % orientations.length],
        sizeCategory: sizes[index % sizes.length],
        dimensionsProcessed: false
      };
    });
    
    // Start with initial batch for immediate render
    window.ArtGallery.state.allArtworks = initialBatch;
    window.ArtGallery.state.filteredArtworks = initialBatch;
    
    // Process remaining artworks in background chunks (non-blocking)
    if (data.length > INITIAL_BATCH_SIZE) {
      processRemainingArtworks(data, INITIAL_BATCH_SIZE, allCategories);
    }
    
    // Populate categories (use all categories from full dataset)
    const categories = allCategories;
    const categorySelect = document.getElementById('categoryFilter');
    
    // Safety check: ensure categorySelect exists before using it
    if (!categorySelect) {
      if (window.debugWarn) window.debugWarn('⚠️ categoryFilter element not found - will render gallery anyway');
      // Don't return early - continue to render gallery even without filter dropdown
      // Just skip the category dropdown population
    } else {
      // Clear existing options except "All Categories"
      const allCategoriesOption = categorySelect.querySelector('option[value="all"]');
      categorySelect.innerHTML = '';
      if (allCategoriesOption) {
        categorySelect.appendChild(allCategoriesOption);
      }
      
      // Add categories to dropdown
      categories.sort().forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
      });
      
      // Populate mobile category chips
      const mobileChips = document.getElementById('mobileCategoryChips');
      if (mobileChips && window.innerWidth <= 768) {
      mobileChips.innerHTML = '';
      
      // Add "All Categories" chip
      const allChip = document.createElement('button');
      allChip.className = 'mobile-category-chip active';
      allChip.setAttribute('data-category', 'all');
      allChip.setAttribute('aria-label', 'All Categories');
      allChip.setAttribute('title', 'All Categories');
      allChip.innerHTML = `
        <span class="filter-text">All</span>
        <span class="filter-count">${data.length}</span>
      `;
      allChip.onclick = () => {
        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
        categorySelect.value = 'all';
        categorySelect.dispatchEvent(new Event('change'));
      };
      mobileChips.appendChild(allChip);
      
      // Category icons mapping - all unique, no duplicates
      const categoryIcons = {
        'Guernica': '💥',
        'Mr. Snowmann': '⛄',
        'Torsos & Faces': '👤',
        'Studio': '🏢',
        'Work in Progress': '🚧',
        'Misc': '📁',
        '2000s': '🎯',
        'Art School': '🎓',
        'Collaboration': '🤝',
        'Framed Galleries': '🖼️',
        'Gallery': '🎭',
        'New': '✨',
        'Tracing': '✏️',
        'Memory': '🧠',
        'Elephants': '🐘',
        'Gorillas': '🦍',
        'Dragons': '🐉',
        'Echoes': '🌊',
        'Abstract': '🎨',
        'Portraits': '🖌️',
        'Painting': '🖍️',
        'Digital': '💻'
      };
      
      // Add category chips
      categories.sort().forEach(cat => {
        const chip = document.createElement('button');
        chip.className = 'mobile-category-chip';
        chip.setAttribute('data-category', cat);
        chip.setAttribute('aria-label', cat);
        chip.setAttribute('title', cat);
        
        // Count artworks in this category
        const categoryCount = data.filter(art => art.category === cat).length;
        
        // Show category name and count (no icon)
        chip.innerHTML = `
          <span class="filter-text">${cat}</span>
          <span class="filter-count">${categoryCount}</span>
        `;
        
        chip.onclick = () => {
          // Haptic feedback
          if (navigator.vibrate) {
            navigator.vibrate(10);
          }
          categorySelect.value = cat;
          categorySelect.dispatchEvent(new Event('change'));
        };
        mobileChips.appendChild(chip);
      });
      
      // Show chips on mobile
      mobileChips.style.display = 'flex';
      
      // Update active state when filter changes
      const updateChipActiveState = () => {
        const selectedCategory = categorySelect.value;
        mobileChips.querySelectorAll('.mobile-category-chip').forEach(chip => {
            if (chip.getAttribute('data-category') === selectedCategory) {
              chip.classList.add('active');
              // Auto-scroll removed - let user control their scroll position
            } else {
            chip.classList.remove('active');
          }
        });
      };
      
      categorySelect.addEventListener('change', updateChipActiveState);
      updateChipActiveState(); // Initial state
      }
    }
    
    // Dispatch event to notify other scripts that categories are populated
    window.dispatchEvent(new Event('categoriesPopulated'));
    
    // NOTE: URL parameter handling is done by art-gallery-core.js
    // Don't duplicate here to avoid conflicts - core module sets window.pendingCategoryFilter
    // This code only runs if core module didn't already handle it
    if (!window.pendingCategoryFilter) {
      let categoryParam = getUrlCategoryParam();
      
      // Normalize URL-encoded category names (e.g., "Art%20School" -> "Art School")
      if (categoryParam) {
        const normalizedParam = normalizeCategoryParam(categoryParam);
        const categoryMatch = allCategories.find(cat => normalizeCategoryParam(cat) === normalizedParam);
        
        if (categoryMatch) {
          // Use the actual category name from metadata (case-sensitive)
          window.pendingCategoryFilter = categoryMatch;
          console.log('🔍 [art-gallery.js] Set pendingCategoryFilter (fallback):', categoryMatch);
        }
      }
    }
    
    // If no URL filter, show category representatives
    if (!window.pendingCategoryFilter) {
      // Default view: Show one artwork from each category
      // Don't call renderGallery here - core module will handle it via tryRender
      if (window.ArtGallery && window.ArtGallery.showCategoryRepresentatives) {
        window.ArtGallery.showCategoryRepresentatives();
      }
    }
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
      loadingEl.style.display = 'none';
    }
    
    // Show gallery containers when artworks are loaded
    const gallery = document.getElementById('gallery');
    const galleryContainer = document.getElementById('galleryContainer');
    if (gallery) {
      gallery.classList.remove('display-none');
      gallery.style.display = '';
    }
    if (galleryContainer) {
      galleryContainer.classList.remove('display-none');
      galleryContainer.style.display = '';
    }
    
    // CRITICAL: Render gallery after data loads
    // Check if core module already rendered, otherwise render here
    if (window.ArtGallery && window.ArtGallery.renderGallery) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (window.ArtGallery.state.filteredArtworks && window.ArtGallery.state.filteredArtworks.length > 0) {
          if (window.debugLog) window.debugLog('🎨 Rendering gallery after data load');
          window.ArtGallery.renderGallery(false, false);
        }
      }, 100);
    } else if (window.renderGallery) {
      setTimeout(() => {
        if (window.ArtGallery && window.ArtGallery.state.filteredArtworks && window.ArtGallery.state.filteredArtworks.length > 0) {
          if (window.debugLog) window.debugLog('🎨 Rendering gallery after data load (fallback)');
          window.renderGallery(false, false);
        }
      }, 100);
    }
    
    // Now process real image dimensions in the background
    await processRealImageDimensions();
  })
  .catch(error => {
    if (window.debugError) window.debugError('Error loading artworks:', error);
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
      loadingEl.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #666;">
          <h3>Error loading artworks</h3>
          <p>${error.message}</p>
          <p>Please refresh the page or check the console for more details.</p>
          <button data-action="reload-page" style="background: #6366f1; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">Refresh Page</button>
        </div>
      `;
    }
  });
}

// Process remaining artworks in background chunks (non-blocking)
async function processRemainingArtworks(fullData, startIndex, allCategories) {
  const CHUNK_SIZE = 200; // Process 200 at a time
  const remainingData = fullData.slice(startIndex);
  const totalChunks = Math.ceil(remainingData.length / CHUNK_SIZE);
  
  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const chunkStart = chunkIndex * CHUNK_SIZE;
    const chunkEnd = Math.min(chunkStart + CHUNK_SIZE, remainingData.length);
    const chunk = remainingData.slice(chunkStart, chunkEnd);
    
    // Process chunk
    const processedChunk = chunk.map((artwork, index) => {
      const globalIndex = startIndex + chunkStart + index;
      const orientations = ['horizontal', 'vertical', 'square'];
      const sizes = ['small', 'medium', 'large', 'extra-large'];
      
      return {
        ...artwork,
        width: 800 + (globalIndex % 500),
        height: 600 + (globalIndex % 400),
        aspectRatio: 1.33,
        orientation: orientations[globalIndex % orientations.length],
        sizeCategory: sizes[globalIndex % sizes.length],
        dimensionsProcessed: false
      };
    });
    
    // Append to allArtworks array
    allArtworks.push(...processedChunk);
    
    // Re-apply current filters to include newly loaded artworks
    // This ensures filters work correctly as more data loads
    const categoryFilter = document.getElementById('categoryFilter');
    const activeCategory = categoryFilter ? categoryFilter.value : 'all';
    const urlCategory = getUrlCategoryParam();
    const hasUrlFilter = !!urlCategory || !!window.pendingCategoryFilter || !!window.urlCategoryFilterActive;
    
    // Only auto-update if viewing "all" category AND no URL-driven filter is active
    if (activeCategory === 'all' && !hasUrlFilter) {
      window.ArtGallery.state.filteredArtworks = [...window.ArtGallery.state.allArtworks];
      // Update count
      const count = document.getElementById('resultsCount');
      if (count) {
        count.textContent = `${allArtworks.length} artworks`;
      }
    }
    // For filtered views, new artworks matching the filter will appear
    // when user changes filter or searches (filterArtworks handles this)
    
    // Yield to browser every chunk to keep UI responsive
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

// Run the loading function immediately
loadArtworkData();

// Also run on pageshow to handle bfcache navigation
window.addEventListener('pageshow', function(event) {
  // If data isn't loaded, load it
  if (!window.allArtworks || window.allArtworks.length === 0) {
    loadArtworkData();
  }
});

// Function to classify image by dimensions
function classifyImage(width, height) {
  const aspectRatio = width / height;
  const totalPixels = width * height;
  
  // Determine orientation
  let orientation;
  if (Math.abs(aspectRatio - 1) < 0.1) {
    orientation = 'square';
  } else if (aspectRatio > 1.2) {
    orientation = 'horizontal';
  } else if (aspectRatio < 0.8) {
    orientation = 'vertical';
  } else {
    orientation = 'square'; // Near-square
  }
  
  // Determine size category
  let sizeCategory;
  if (totalPixels < 500000) {
    sizeCategory = 'small';
  } else if (totalPixels < 1500000) {
    sizeCategory = 'medium';
  } else if (totalPixels < 3000000) {
    sizeCategory = 'large';
  } else {
    sizeCategory = 'extra-large';
  }
  
  return { orientation, sizeCategory };
}

// Function to get image dimensions and classify
function getImageDimensions(artwork) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function() {
      const classification = classifyImage(this.naturalWidth, this.naturalHeight);
      resolve({
        ...artwork,
        width: this.naturalWidth,
        height: this.naturalHeight,
        aspectRatio: (this.naturalWidth / this.naturalHeight).toFixed(2),
        orientation: classification.orientation,
        sizeCategory: classification.sizeCategory,
        dimensionsProcessed: true
      });
    };
    img.onerror = function() {
      // Keep existing data if image fails to load
      resolve({
        ...artwork,
        dimensionsProcessed: true // Mark as processed even if failed
      });
    };
    img.src = `artworks/thumbs/${artwork.file}`;
  });
}

// Process real image dimensions in batches
async function processRealImageDimensions() {
  const batchSize = 20; // Process 20 images at a time
  const totalBatches = Math.ceil(allArtworks.length / batchSize);
  
  
  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const startIndex = batchIndex * batchSize;
    const endIndex = Math.min(startIndex + batchSize, allArtworks.length);
    const batch = allArtworks.slice(startIndex, endIndex);
    
    
    // Process batch in parallel
    const processedBatch = await Promise.all(
      batch.map(artwork => getImageDimensions(artwork))
    );
    
    // Update the artworks array with real dimensions
    processedBatch.forEach((processedArtwork, index) => {
      const originalIndex = startIndex + index;
      window.ArtGallery.state.allArtworks[originalIndex] = processedArtwork;
    });
    
    // Update filtered artworks if needed
    if (window.ArtGallery.state.filteredArtworks === window.ArtGallery.state.allArtworks) {
      window.ArtGallery.state.filteredArtworks = window.ArtGallery.state.allArtworks;
    }
    
    // Small delay between batches to not overwhelm the browser
    if (batchIndex < totalBatches - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  
  // Only re-apply filters if user has active filters
  // Don't re-render if showing category representatives (default view)
  // BUT: Only skip if we're actually showing category reps AND no filters are active
  
  // CRITICAL: Check URL parameter first - if URL has category, use that
  const urlCategory = getUrlCategoryParam();
  const activeCategory = window.pendingCategoryFilter || (urlCategory ? decodeURIComponent(urlCategory) : null);
  
  const categoryFilter = document.getElementById('categoryFilter');
  const sizeFilter = document.getElementById('sizeFilter');
  const orientationFilter = document.getElementById('orientationFilter');
  const colorFilter = document.getElementById('colorFilter');
  const searchInput = document.getElementById('searchInput') || document.getElementById('artworkSearch');
  
  // Check if filters are active - use URL/pending category if available
  const categoryValue = activeCategory || categoryFilter?.value || 'all';
  const hasActiveFilters = categoryValue !== 'all' ||
                          sizeFilter?.value !== 'all' ||
                          orientationFilter?.value !== 'all' ||
                          colorFilter?.value !== 'all' ||
                          searchInput?.value?.trim();
  
  // Only call filterArtworks if filters are active AND not showing category reps
  // If showing category reps with no filters, skip to avoid re-render
  // CRITICAL: Pass category parameter explicitly to prevent reading 'all' from DOM
  if (hasActiveFilters && !window.ArtGallery.state.showingCategoryReps) {
    console.log('🔄 [processRealImageDimensions] Re-applying filter with category:', categoryValue);
    // Pass explicit parameters to prevent reading 'all' from DOM
    filterArtworks(
      categoryValue !== 'all' ? categoryValue : null,
      sizeFilter?.value !== 'all' ? sizeFilter.value : null,
      orientationFilter?.value !== 'all' ? orientationFilter.value : null,
      colorFilter?.value !== 'all' ? colorFilter.value : null,
      searchInput?.value?.trim() || null
    );
  }
  // Otherwise, just update the filtered artworks array reference (no re-render)
  // The dimensions are already updated in the state arrays
}

// Show one representative artwork from each category (for default view)
function showCategoryRepresentatives() {
  // Use pre-loaded category representatives if available
  const representatives = window.categoryRepresentatives || [];
  
  if (representatives.length === 0) {
    if (window.debugWarn) window.debugWarn('⚠️ No category representatives found, using all artworks');
    window.ArtGallery.state.filteredArtworks = window.ArtGallery.state.allArtworks;
    return;
  }
  
  // Sort representatives: "New" first, then alphabetically
  representatives.sort((a, b) => {
    const catA = a.category || '';
    const catB = b.category || '';
    
    // "New" always comes first
    if (catA === 'New') return -1;
    if (catB === 'New') return 1;
    
    // Sort rest alphabetically
    return catA.localeCompare(catB);
  });
  
  // Set filtered artworks to show only category representatives
  window.ArtGallery.state.filteredArtworks = representatives;
  window.ArtGallery.state.currentPage = 1;
  window.ArtGallery.state.showingCategoryReps = true; // Set flag to prevent filterArtworks from overriding
  
  // Ensure the global variable is also set for compatibility
  if (typeof showingCategoryReps !== 'undefined') {
    showingCategoryReps = true;
  }
  
  // CRITICAL: Render gallery after setting category representatives
  if (window.ArtGallery && window.ArtGallery.renderGallery) {
    setTimeout(() => {
      window.ArtGallery.renderGallery(false, false);
    }, 50);
  } else if (window.renderGallery) {
    setTimeout(() => {
      window.renderGallery(false, false);
    }, 50);
  }
}

// Filter function with smooth animations
// Track last filter call to prevent duplicates
let lastFilterCall = null;
let filterCallTimeout = null;

function filterArtworks(categoryParam = null, sizeParam = null, orientationParam = null, colorParam = null, searchParam = null) {
  // Debounce rapid filter calls to prevent flickering
  const filterKey = `${categoryParam}-${sizeParam}-${orientationParam}-${colorParam}-${searchParam}`;
  if (lastFilterCall === filterKey && filterCallTimeout) {
    console.log('⏸️ [filterArtworks] Duplicate filter call prevented:', filterKey);
    return;
  }
  
  lastFilterCall = filterKey;
  clearTimeout(filterCallTimeout);
  filterCallTimeout = setTimeout(() => {
    lastFilterCall = null;
  }, 100);
  
  // CRITICAL: If pendingCategoryFilter exists and no explicit categoryParam was passed,
  // use the pending filter instead of reading from DOM (which might be 'all' by default)
  if (categoryParam === null && window.pendingCategoryFilter) {
    console.log('🔄 [filterArtworks] Using pendingCategoryFilter instead of DOM value:', window.pendingCategoryFilter);
    categoryParam = window.pendingCategoryFilter;
  }
  
  // Get filter values - use parameters if provided, otherwise get from DOM
  const categorySelect = document.getElementById('categoryFilter');
  const sizeSelect = document.getElementById('sizeFilter');
  const orientationSelect = document.getElementById('orientationFilter');
  const colorSelect = document.getElementById('colorFilter');
  const searchInput = document.getElementById('searchInput') || document.getElementById('artworkSearch');
  
  const category = categoryParam !== null ? categoryParam : (categorySelect ? categorySelect.value : 'all');
  const size = sizeParam !== null ? sizeParam : (sizeSelect ? sizeSelect.value : 'all');
  const orientation = orientationParam !== null ? orientationParam : (orientationSelect ? orientationSelect.value : 'all');
  const color = colorParam !== null ? colorParam : (colorSelect ? colorSelect.value : 'all');
  const search = searchParam !== null ? searchParam : (searchInput ? searchInput.value.trim().toLowerCase() : '');
  
  // Log active filters
  
  // Check if any filters are active
  const hasActiveFilters = category !== 'all' || size !== 'all' || orientation !== 'all' || color !== 'all' || search;
  
  // CRITICAL: If a category parameter was explicitly passed (from URL), always allow filtering
  const isExplicitCategoryFilter = categoryParam !== null && categoryParam !== 'all';
  
  // If user explicitly selects "All" category, clear the category representatives flag
  // This allows users to see all artworks instead of just category representatives
  if (category === 'all' && size === 'all' && orientation === 'all' && color === 'all' && !search) {
    window.ArtGallery.state.showingCategoryReps = false;
  }
  
  // If user is actively filtering OR filtering via URL parameter, clear the category representatives flag
  if (hasActiveFilters || isExplicitCategoryFilter) {
    window.ArtGallery.state.showingCategoryReps = false;
  }
  
  // If showing category representatives and no filters are active, preserve that view
  // BUT: Always allow override if filtering via URL parameter (categoryParam passed explicitly)
  if (window.ArtGallery.state.showingCategoryReps && !hasActiveFilters && category !== 'all' && !isExplicitCategoryFilter) {
    return; // Don't override the representative view - prevents re-render
  }
  
  // Allow filtering even if rendering is in progress - update state first, then render
  // This allows users to click multiple filters quickly without being blocked
  if (window.artGalleryRendering) {
    if (window.debugLog) window.debugLog('⚠️ filterArtworks called while rendering - will update state and queue render');
    // Continue to update filtered artworks state - renderGallery will handle rendering when ready
  }
  
  // CRITICAL: Use full dataset if available for filtering, otherwise use allArtworks
  // This ensures we filter ALL artworks, not just the initially loaded batch
  const datasetToFilter = window.ArtGallery.fullDataset && window.ArtGallery.fullDataset.length > 0 
    ? window.ArtGallery.fullDataset 
    : allArtworks;
  
  // Debug logging for category filtering
  if (categoryParam !== null && categoryParam !== 'all') {
    if (window.debugLog) window.debugLog('[filterArtworks] Filtering by category:', categoryParam, {
      datasetSize: datasetToFilter.length,
      allArtworksSize: allArtworks.length,
      usingFullDataset: window.ArtGallery.fullDataset && window.ArtGallery.fullDataset.length > 0
    });
  }
  
  const newFilteredArtworks = datasetToFilter.filter(art => {
    const matchesCategory = category === 'all' || art.category === category;
    const matchesSize = size === 'all' || (art.sizeCategory && art.sizeCategory === size);
    const matchesOrientation = orientation === 'all' || (art.orientation && art.orientation === orientation);
    const matchesColor = color === 'all' || matchesColorPalette(art, color);
    const matchesSearch = !search || 
      art.title?.toLowerCase().includes(search) ||
      art.description?.toLowerCase().includes(search) ||
      art.keywords?.some(k => k.toLowerCase().includes(search));
    
    return matchesCategory && matchesSize && matchesOrientation && matchesColor && matchesSearch;
  });
  
  // Debug logging after filtering
  if (categoryParam !== null && categoryParam !== 'all') {
    if (window.debugLog) window.debugLog('[filterArtworks] After filtering:', {
      category: categoryParam,
      totalArtworks: allArtworks.length,
      filteredCount: newFilteredArtworks.length,
      sampleCategories: [...new Set(newFilteredArtworks.slice(0, 10).map(a => a.category))]
    });
  }
  
  
  // Update the filtered artworks FIRST (before updating display)
  window.ArtGallery.state.filteredArtworks = newFilteredArtworks;
  window.ArtGallery.state.currentPage = 1; // Reset to page 1
  
  // Update filter status display (now reads correct filteredArtworks.length)
  updateFilterStatusDisplay(category, orientation, color, search);
  
  // Update category subtitle and description
  console.log('📝 [filterArtworks] Updating subtitle/description for category:', category);
  updateCategorySubtitleAndDescription(category);
  
  // Animate the filter transition (only if not already rendering)
  if (!window.artGalleryRendering) {
    console.log('🎬 [filterArtworks] Starting filter transition animation');
    animateFilterTransition();
  } else {
    console.log('⏸️ [filterArtworks] Skipping animation - already rendering');
    // Queue render for after current render completes
    setTimeout(() => {
      if (!window.artGalleryRendering) {
        animateFilterTransition();
      }
    }, 500);
  }
}

// Animate filter transition with smooth fade
function animateFilterTransition() {
  // If already rendering, wait for it to complete before starting new transition
  if (window.artGalleryRendering) {
    if (window.debugLog) window.debugLog('⚠️ animateFilterTransition - rendering in progress, will retry');
    // Retry after a short delay
    setTimeout(() => {
      animateFilterTransition();
    }, 100);
    return;
  }
  
  // filteredArtworks already updated in filterArtworks()
  // No longer needs parameter
  
  // Fade out existing cards
  const gallery = document.getElementById('gallery');
  const galleryContainer = document.getElementById('galleryContainer');
  const targetGallery = galleryContainer || gallery;
  let fadeOutDelay = 200; // Default delay
  
  if (targetGallery) {
    const existingCards = targetGallery.querySelectorAll('.artwork-card');
    existingCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95) translateY(-10px)';
      }, index * 15); // Stagger the fade out
    });
    fadeOutDelay = existingCards.length * 15 + 200;
  }
  
  // Wait for fade out, then render new filtered results with fade in
  setTimeout(() => {
    renderGallery(false, true); // Render from start with fade-in animation
  }, fadeOutDelay); // Wait for all cards to fade out
}

// Update filter status display
function updateFilterStatusDisplay(category, orientation, color, search) {
  const display = document.getElementById('activeFiltersDisplay');
  const resultsCount = document.getElementById('loadingStatusText'); // Updated to match HTML
  const filtersList = document.getElementById('activeFiltersList');
  const clearAllBtn = document.getElementById('clearAllFilters');
  
  // ALWAYS update results count if element exists
  if (resultsCount) {
    const count = filteredArtworks.length;
    const total = allArtworks.length;
    resultsCount.textContent = `Showing ${count.toLocaleString()} of ${total.toLocaleString()} artworks`;
  }
  
  // Return early if filter badge elements don't exist (optional feature)
  if (!display || !filtersList) return;
  
  // Clear existing filter badges
  filtersList.innerHTML = '';
  
  // Build filter badges
  const activeFilters = [];
  
  if (category !== 'all') {
    activeFilters.push({ type: 'category', label: category, value: category });
  }
  if (orientation !== 'all') {
    activeFilters.push({ type: 'orientation', label: `📐 ${orientation}`, value: orientation });
  }
  if (color !== 'all') {
    const colorLabel = color.replace('🎨 ', '').replace(' & ', ' ');
    activeFilters.push({ type: 'color', label: colorLabel, value: color });
  }
  if (search) {
    activeFilters.push({ type: 'search', label: `"${search}"`, value: search });
  }
  
  // Show/hide display
  if (activeFilters.length > 0) {
    display.style.display = 'flex';
    
    // Create filter badges
    activeFilters.forEach(filter => {
      const badge = document.createElement('div');
      badge.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.4rem 0.75rem;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
        transition: all 0.2s ease;
        cursor: pointer;
      `;
      
      badge.innerHTML = `
        <span>${filter.label}</span>
        <span style="cursor: pointer; opacity: 0.8; hover: opacity: 1;" data-filter-type="${filter.type}">✕</span>
      `;
      
      // Add hover effect
      badge.onmouseenter = () => {
        badge.style.transform = 'translateY(-2px)';
        badge.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
      };
      badge.onmouseleave = () => {
        badge.style.transform = 'translateY(0)';
        badge.style.boxShadow = '0 2px 6px rgba(99, 102, 241, 0.3)';
      };
      
      // Add click handler to remove filter
      const removeBtn = badge.querySelector('span[data-filter-type]');
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          removeFilter(filter.type);
        });
      }
      
      filtersList.appendChild(badge);
    });
    
    // Show/hide clear all button
    if (clearAllBtn) {
      clearAllBtn.style.display = activeFilters.length > 1 ? 'block' : 'none';
    }
  } else {
    display.style.display = 'none';
  }
}

// Category descriptions for subtitle and description display
const categoryDescriptions = {
  'all': {
    subtitle: '',
    description: 'Explore 1,084 artworks spanning 50 years—rebellion, innovation, unapologetic expression'
  },
  'Guernica': {
    subtitle: 'Guernica Series',
    description: 'Powerful narratives inspired by Picasso\'s masterpiece, exploring themes of conflict, humanity, and artistic rebellion through contemporary lens'
  },
  'Torsos & Faces': {
    subtitle: 'Torsos & Faces',
    description: 'Intimate studies of human form and expression, capturing the essence of emotion and physicality through bold strokes and nuanced detail'
  },
  'Mr. Snowmann': {
    subtitle: 'Mr. Snowmann',
    description: 'Whimsical and thought-provoking character studies that blend humor with deeper commentary on identity, society, and the human condition'
  },
  'Art School': {
    subtitle: 'Art School Works',
    description: 'Early foundational pieces from formal training, showcasing the evolution of technique and artistic vision during formative years'
  },
  'Tracings': {
    subtitle: 'Tracings',
    description: 'Precise line work and detailed studies exploring form, composition, and the relationship between observation and interpretation'
  },
  'Galleries': {
    subtitle: 'Gallery Collections',
    description: 'Curated selections representing diverse themes and styles, showcasing the breadth and depth of artistic exploration'
  },
  'Collaboration': {
    subtitle: 'Collaborative Works',
    description: 'Artistic partnerships and joint creations that blend multiple perspectives, techniques, and creative visions into unified expressions'
  },
  'Framed': {
    subtitle: 'Framed Artworks',
    description: 'Completed pieces presented in their final form, ready for display and appreciation in gallery and collection settings'
  },
  'Studio': {
    subtitle: 'Studio Works',
    description: 'Works created in the controlled environment of the studio, allowing for experimentation, refinement, and focused artistic development'
  },
  'Misc': {
    subtitle: 'Miscellaneous',
    description: 'Diverse collection of works that defy easy categorization, representing unique explorations and experimental approaches'
  },
  '2000s': {
    subtitle: '2000s Collection',
    description: 'Artworks from the turn of the millennium, capturing the spirit of a transformative era in art and culture'
  },
  'Work in Progress': {
    subtitle: 'Work in Progress',
    description: 'Artworks in various stages of development, offering insight into the creative process and artistic evolution'
  },
  'New': {
    subtitle: 'New Artworks',
    description: 'Recent additions to the collection, featuring the latest creative explorations and contemporary artistic expressions'
  },
  'favorites': {
    subtitle: 'My Favorites',
    description: 'Curated selection of personally selected artworks that resonate most deeply with artistic vision and emotional connection'
  },
  'orientation-horizontal': {
    subtitle: 'Horizontal Orientation',
    description: 'Landscape-format artworks that utilize the wide canvas to create expansive compositions and panoramic visual narratives'
  },
  'orientation-vertical': {
    subtitle: 'Vertical Orientation',
    description: 'Portrait-format artworks that emphasize height and vertical movement, creating dynamic compositions with upward energy'
  },
  'orientation-square': {
    subtitle: 'Square Format',
    description: 'Perfectly balanced compositions in square format, creating harmonious and focused visual experiences with equal emphasis on all dimensions'
  }
};

// Update category subtitle and description based on selected category
function updateCategorySubtitleAndDescription(category) {
  console.log('📝 [updateCategorySubtitleAndDescription] Called with category:', category);
  
  // CRITICAL: Check URL parameter - if URL has category filter, ALWAYS use that instead of 'all'
  const urlCategory = getUrlCategoryParam();
  
  // Also check pendingCategoryFilter as backup
  const activeCategory = window.pendingCategoryFilter || urlCategory;
  const resolvedActiveCategory = activeCategory
    ? (Object.keys(categoryDescriptions).find(key =>
        normalizeCategoryParam(key) === normalizeCategoryParam(activeCategory)
      ) || activeCategory)
    : null;
  
  if (resolvedActiveCategory && resolvedActiveCategory !== 'all') {
    // If URL has a category filter OR pending filter exists, use that instead of 'all'
    if (category === 'all') {
      const categoryToUse = resolvedActiveCategory;
      console.log('🚫 [updateCategorySubtitleAndDescription] Blocked override to "all" - Active filter:', categoryToUse);
      // Use active category instead
      category = categoryToUse;
      console.log('🔄 [updateCategorySubtitleAndDescription] Using active category instead:', category);
    }
  }
  
  // CRITICAL: Final check BEFORE getting elements - if URL has category, NEVER show 'all'
  // This must happen early to prevent any 'all' from being processed
  if (category === 'all') {
    // Check URL parameter first
    if (urlCategory && urlCategory !== 'all') {
      const normalizedUrlCategory = normalizeCategoryParam(urlCategory);
      const matchedUrlCategory = Object.keys(categoryDescriptions).find(key =>
        normalizeCategoryParam(key) === normalizedUrlCategory
      );
      const urlCategoryInfo = matchedUrlCategory ? categoryDescriptions[matchedUrlCategory] : null;
      if (urlCategoryInfo && urlCategoryInfo.subtitle) {
        console.log('🔄 [updateCategorySubtitleAndDescription] EARLY CHECK - Force using URL category:', matchedUrlCategory);
        category = matchedUrlCategory;
      }
    }
    // Also check pendingCategoryFilter
    else if (window.pendingCategoryFilter && window.pendingCategoryFilter !== 'all') {
      const pendingCategoryInfo = categoryDescriptions[window.pendingCategoryFilter];
      if (pendingCategoryInfo && pendingCategoryInfo.subtitle) {
        console.log('🔄 [updateCategorySubtitleAndDescription] EARLY CHECK - Force using pendingCategoryFilter:', window.pendingCategoryFilter);
        category = window.pendingCategoryFilter;
      }
    }
  }
  
  const subtitleEl = document.getElementById('galleryCategorySubtitle');
  const descriptionEl = document.getElementById('galleryCategoryDescription');
  const mainDescriptionEl = document.getElementById('galleryMainDescription');

  if (!subtitleEl || !descriptionEl || !mainDescriptionEl) {
    console.warn('⚠️ [updateCategorySubtitleAndDescription] Elements not found:', {
      subtitleEl: !!subtitleEl,
      descriptionEl: !!descriptionEl,
      mainDescriptionEl: !!mainDescriptionEl
    });
    return;
  }

  const categoryInfo = categoryDescriptions[category] || categoryDescriptions['all'];
  console.log('📝 [updateCategorySubtitleAndDescription] Category info:', categoryInfo, 'for category:', category);
  
  // FINAL CHECK: If URL has category and we're trying to show 'all', force URL category
  if (category === 'all' && urlCategory && urlCategory !== 'all') {
    const decodedUrlCategory = decodeURIComponent(urlCategory);
    const urlCategoryInfo = categoryDescriptions[decodedUrlCategory];
    if (urlCategoryInfo && urlCategoryInfo.subtitle) {
      console.log('🔄 [updateCategorySubtitleAndDescription] FINAL CHECK - Force using URL category:', decodedUrlCategory);
      category = decodedUrlCategory;
      const finalCategoryInfo = categoryDescriptions[category] || categoryDescriptions['all'];
      // Show category-specific subtitle and description
      subtitleEl.textContent = finalCategoryInfo.subtitle;
      subtitleEl.classList.remove('display-none');
      descriptionEl.textContent = finalCategoryInfo.description;
      descriptionEl.classList.remove('display-none');
      mainDescriptionEl.classList.add('display-none');
      console.log('✅ [updateCategorySubtitleAndDescription] Forced URL category display - FINAL');
      return;
    }
  }
  
  if (category === 'all' || !categoryInfo.subtitle) {
    // Show default description, hide subtitle
    console.log('📝 [updateCategorySubtitleAndDescription] Showing default (all) description');
    subtitleEl.classList.add('display-none');
    descriptionEl.classList.add('display-none');
    // Show main description - remove display-none if it exists
    mainDescriptionEl.classList.remove('display-none');
  } else {
    // Show category-specific subtitle and description, hide default
    console.log('📝 [updateCategorySubtitleAndDescription] Showing category-specific:', {
      subtitle: categoryInfo.subtitle,
      description: categoryInfo.description
    });
    subtitleEl.textContent = categoryInfo.subtitle;
    subtitleEl.classList.remove('display-none');
    descriptionEl.textContent = categoryInfo.description;
    descriptionEl.classList.remove('display-none');
    // Hide main description
    mainDescriptionEl.classList.add('display-none');
    console.log('📝 [updateCategorySubtitleAndDescription] Elements updated:', {
      subtitleText: subtitleEl.textContent,
      descriptionText: descriptionEl.textContent,
      subtitleVisible: !subtitleEl.classList.contains('display-none'),
      descriptionVisible: !descriptionEl.classList.contains('display-none')
    });
  }
}

// Remove individual filter
function removeFilter(filterType) {
  switch(filterType) {
    case 'category':
      document.getElementById('categoryFilter').value = 'all';
      break;
    case 'orientation':
      document.getElementById('orientationFilter').value = 'all';
      break;
    case 'color':
      document.getElementById('colorFilter').value = 'all';
      break;
    case 'search':
      document.getElementById('searchInput').value = '';
      break;
  }
  filterArtworks();
}

// Color palette matching function
function matchesColorPalette(artwork, palette) {
  // Extract color keywords from artwork metadata
  const keywords = (artwork.keywords || []).map(k => k.toLowerCase());
  const title = (artwork.title || '').toLowerCase();
  const description = (artwork.description || '').toLowerCase();
  const extendedDesc = (artwork.extended_description || '').toLowerCase();
  const allText = [...keywords, title, description, extendedDesc].join(' ');
  
  // Color palette definitions
  const colorMappings = {
    reds: ['red', 'crimson', 'scarlet', 'burgundy', 'maroon', 'coral', 'orange', 'rust', 'vermillion', 'rose', 'pink', 'magenta', 'warm'],
    blues: ['blue', 'azure', 'cyan', 'teal', 'turquoise', 'navy', 'indigo', 'cobalt', 'sapphire', 'aqua', 'cool', 'ice'],
    greens: ['green', 'lime', 'olive', 'forest', 'emerald', 'jade', 'mint', 'sage', 'chartreuse', 'nature'],
    yellows: ['yellow', 'gold', 'amber', 'lemon', 'canary', 'golden', 'saffron', 'bright', 'sunny', 'butter'],
    purples: ['purple', 'violet', 'magenta', 'lavender', 'plum', 'mauve', 'orchid', 'amethyst', 'lilac', 'pink'],
    earths: ['brown', 'tan', 'beige', 'ochre', 'sienna', 'umber', 'sepia', 'khaki', 'sand', 'earth', 'wood', 'copper', 'bronze'],
    monochrome: ['black', 'white', 'gray', 'grey', 'silver', 'charcoal', 'ebony', 'ivory', 'monochrome', 'noir'],
    vibrant: ['vibrant', 'colorful', 'rainbow', 'multi', 'bright', 'vivid', 'bold', 'intense', 'brilliant', 'chromatic']
  };
  
  // Check if any color keywords match the selected palette
  const paletteColors = colorMappings[palette] || [];
  return paletteColors.some(color => allText.includes(color));
}

// Render gallery
function renderGallery(append = false, fadeIn = false) {
  // Debug logging
  if (window.debugLog) window.debugLog('🎨 renderGallery called', {
    append,
    fadeIn,
    isRendering: window.artGalleryRendering,
    filteredArtworks: window.ArtGallery.state.filteredArtworks?.length,
    allArtworks: window.ArtGallery.state.allArtworks?.length
  });
  
  // TEMPORARILY DISABLED: Prevent multiple simultaneous renders - but allow if stuck
  // Check if flag is stuck (set for more than 2 seconds)
  if (window.artGalleryRendering) {
    if (!window.artGalleryRenderingStartTime) {
      window.artGalleryRenderingStartTime = Date.now();
    }
    const timeSinceStart = Date.now() - window.artGalleryRenderingStartTime;
    if (timeSinceStart > 2000) {
      if (window.debugWarn) window.debugWarn('⚠️ Rendering flag stuck for >2s, clearing it and allowing render');
      window.artGalleryRendering = false;
      window.artGalleryRenderingStartTime = null;
    } else {
      if (window.debugLog) window.debugLog('⏸️ renderGallery skipped - already rendering (not stuck)');
      return;
    }
  }
  
  // Set start time
  window.artGalleryRenderingStartTime = Date.now();
  
  const gallery = document.getElementById('gallery');
  const galleryContainer = document.getElementById('galleryContainer');
  const count = document.getElementById('resultsCount');
  
  if (window.debugLog) window.debugLog('🔍 renderGallery checks', {
    isLoading: window.ArtGallery.state.isLoading,
    galleryExists: !!gallery,
    galleryContainerExists: !!galleryContainer
  });
  
  // TEMPORARILY DISABLE isLoading check - it's blocking rendering
  // Force isLoading to false if we have data
  if (window.ArtGallery.state.isLoading) {
    const hasData = (window.ArtGallery.state.filteredArtworks && window.ArtGallery.state.filteredArtworks.length > 0) ||
                    (window.ArtGallery.state.allArtworks && window.ArtGallery.state.allArtworks.length > 0);
    if (hasData) {
      if (window.debugWarn) window.debugWarn('⚠️ isLoading is true but we have data - forcing it to false');
      window.ArtGallery.state.isLoading = false;
    } else {
      if (window.debugWarn) window.debugWarn('⏸️ renderGallery stopped - isLoading is true and no data');
      window.artGalleryRendering = false; // Clear flag on early return
      return;
    }
  }
  
  // Use galleryContainer if available, otherwise fall back to gallery
  const targetGallery = galleryContainer || gallery;
  if (!targetGallery) {
    if (window.DEBUG) console.error('❌ renderGallery stopped - no targetGallery found');
    window.artGalleryRendering = false; // Clear flag on early return
    return; // Safety check
  }
  
  // Ensure the OTHER gallery container is hidden and empty to prevent duplicate rendering
  if (galleryContainer && gallery) {
    // If using galleryContainer, hide and clear gallery
    gallery.classList.add('display-none');
    gallery.style.display = 'none';
    gallery.innerHTML = '';
  } else if (gallery && !galleryContainer) {
    // If using gallery, ensure galleryContainer doesn't exist or is hidden
    const otherContainer = document.getElementById('galleryContainer');
    if (otherContainer) {
      otherContainer.classList.add('display-none');
      otherContainer.style.display = 'none';
      otherContainer.innerHTML = '';
    }
  }
  
  if (window.debugLog) window.debugLog('✅ targetGallery found', { id: targetGallery.id });
  
  // Set rendering flag BEFORE any DOM operations
  window.artGalleryRendering = true;
  
  // Show gallery when rendering
  if (targetGallery.classList.contains('display-none')) {
    targetGallery.classList.remove('display-none');
    targetGallery.style.display = '';
  }

  enforceGalleryGridColumns(targetGallery);
  
  // ALWAYS use state directly - get fresh reference
  let filteredArtworks = window.ArtGallery.state.filteredArtworks;
  
  if (window.debugLog) window.debugLog('📊 Data check', {
    filteredArtworksLength: filteredArtworks?.length,
    allArtworksLength: window.ArtGallery.state.allArtworks?.length,
    isArray: Array.isArray(filteredArtworks)
  });
  
  // Safety check: Ensure filteredArtworks is defined and has data
  // If empty, try to use allArtworks as fallback
  if (!filteredArtworks || !Array.isArray(filteredArtworks) || filteredArtworks.length === 0) {
    if (window.debugLog) window.debugLog('⚠️ filteredArtworks empty, trying allArtworks fallback');
    // Try to use allArtworks as fallback
    if (window.ArtGallery.state.allArtworks && window.ArtGallery.state.allArtworks.length > 0) {
      window.ArtGallery.state.filteredArtworks = window.ArtGallery.state.allArtworks;
      filteredArtworks = window.ArtGallery.state.filteredArtworks;
      if (window.debugLog) window.debugLog('✅ Using allArtworks as fallback', { length: filteredArtworks.length });
    }
    
    // Final check after fallback
    if (!filteredArtworks || !Array.isArray(filteredArtworks) || filteredArtworks.length === 0) {
      if (window.DEBUG) console.error('❌ renderGallery stopped - no artworks data', {
        filteredArtworks,
        allArtworks: window.ArtGallery.state.allArtworks?.length
      });
      window.artGalleryRendering = false; // Clear flag on early return
      return;
    }
  }
  
  if (window.debugLog) window.debugLog('✅ Data ready', { filteredArtworksLength: filteredArtworks.length });
  
  if (count) {
    count.textContent = `${filteredArtworks.length} artworks`;
  }
  
  const startIndex = append ? (window.ArtGallery.state.currentPage - 1) * itemsPerPage : 0;
  const endIndex = Math.min(window.ArtGallery.state.currentPage * itemsPerPage, filteredArtworks.length);
  const artworksToRender = filteredArtworks.slice(startIndex, endIndex);
  
  // Check if we have more items to load
  window.ArtGallery.state.hasMoreItems = endIndex < filteredArtworks.length;
  
  // Build enhanced caption HTML
  const buildCaptionHTML = (art) => {
    const hasExtended = art.extended_description && art.extended_description.trim().length > 0;
    const keywords = art.keywords && art.keywords.length > 0 ? art.keywords : [];
    
    let captionHTML = '';
    
    // Category badge
    if (art.category) {
      captionHTML += `<span class="caption-category">${art.category}</span>`;
    }
    
    // Title
    captionHTML += `<div class="caption-title">${art.title}</div>`;
    
    // Main description
    if (art.description) {
      captionHTML += `<p>${art.description}</p>`;
    }
    
    // Extended description with expand/collapse
    if (hasExtended) {
      const safeId = art.file.replace(/[^a-z0-9]/gi, '-');
      captionHTML += `
        <div class="extended-description collapsed" id="extended-${safeId}">
          <div class="extended-description-text">${art.extended_description.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</div>
        </div>
        <button class="read-more-toggle" data-action="toggle-extended-description" data-target-id="${safeId}" aria-label="Read more">
          <span>Read more</span>
          <i class="fas fa-chevron-down"></i>
        </button>
      `;
    }
    
    // Keywords
    if (keywords.length > 0) {
      captionHTML += '<div class="caption-keywords">';
      keywords.slice(0, 5).forEach(keyword => {
        captionHTML += `<span class="caption-keyword">${keyword}</span>`;
      });
      if (keywords.length > 5) {
        captionHTML += `<span class="caption-keyword">+${keywords.length - 5}</span>`;
      }
      captionHTML += '</div>';
    }
    
    // Art-Informed Design Consultation CTA
    captionHTML += `
      <div class="caption-cta" style="margin-top: 1.5rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%); border-radius: 12px; border: 2px solid rgba(99, 102, 241, 0.3);">
        <h4 style="font-size: 1.1rem; font-weight: 700; color: #6366f1; margin-bottom: 0.75rem;">Want Design Work with This Visual Intensity?</h4>
        <p style="font-size: 0.95rem; color: #4b5563; margin-bottom: 1rem;">Let's translate this aesthetic into interfaces that challenge users to think—not just click.</p>
        <a href="contact.html?subject=Art-Informed%20Design%20Consultation&artwork=${art.file}" 
           style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); transition: all 0.3s ease;"
           onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(99, 102, 241, 0.5)'"
           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(99, 102, 241, 0.3)'"
           target="_blank">
          <i class="fas fa-magic"></i>
          Book Art-Informed Design Consultation
        </a>
      </div>
    `;
    
    return captionHTML;
  };
  
  // Helper function to determine aspect ratio category
  const getAspectRatioCategory = (art) => {
    const ratio = art.aspectRatio || (art.width / art.height) || 1;
    if (ratio >= 3) return 'ultra-wide'; // 3:1 or wider (panoramic)
    if (ratio >= 2) return 'wide';        // 2:1 or wider
    if (ratio >= 1.5) return 'panorama';  // 1.5:1 or wider
    return 'normal';                       // Square or portrait
  };
  
  // Helper function to escape HTML for data attributes
  const escapeHtml = (str) => String(str || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Helper function to clean artwork title (remove ID number if it's just the ID)
  const cleanArtworkTitle = (art, artworkId) => {
    let cleanTitle = art.title || 'Untitled';
    if (artworkId) {
      // Remove ID pattern from beginning of title (e.g., "0101 Title" -> "Title")
      const idPattern = new RegExp(`^0?${artworkId}\\s*[-:]?\\s*`, 'i');
      cleanTitle = cleanTitle.replace(idPattern, '').trim();
      
      // If title was just the ID number (or becomes empty after cleaning), use alternative
      if (cleanTitle === '' || cleanTitle === artworkId || cleanTitle.match(/^\d{4}$/)) {
        // Use description first line, or generate creative title, or fallback
        if (art.description && art.description.length > 0) {
          // Use first part of description as title
          const descFirstLine = art.description.split(/[.!?]/)[0].trim();
          cleanTitle = descFirstLine.length > 60 ? descFirstLine.substring(0, 60) + '...' : descFirstLine;
        } else {
          // Generate creative title based on category
          cleanTitle = generateArtTitle(art);
        }
      }
    }
    return cleanTitle;
  };

  // Build LightGallery sub-html caption with enhanced formatting
  const buildSubHtml = (art) => {
    let html = `<div class="lg-artwork-details">`;
    
    // Extract artwork ID from filename (e.g., "art0681.avif" -> "0681")
    let artworkId = '';
    if (art.file) {
      const match = art.file.match(/art(\d{4})/);
      if (match) {
        artworkId = match[1];
      }
    }
    
    // Artwork ID badge
    if (artworkId) {
      html += `<div class="lg-artwork-id">Artwork #${artworkId}</div>`;
    }
    
    // Title (cleaned to remove duplicate ID number)
    const cleanTitle = cleanArtworkTitle(art, artworkId);
    html += `<h4 class="lg-artwork-title">${escapeHtml(cleanTitle)}</h4>`;
    
    // Category badge
    if (art.category) {
      html += `<span class="lg-artwork-category">${escapeHtml(art.category)}</span>`;
    }
    
    // Description
    if (art.description) {
      html += `<p class="lg-artwork-description">${escapeHtml(art.description)}</p>`;
    }
    
    // Extended description (if different)
    if (art.extended_description && art.extended_description !== art.description) {
      html += `<p class="lg-artwork-extended"><em>${escapeHtml(art.extended_description)}</em></p>`;
    }
    
    // Keywords as badges
    if (art.keywords && art.keywords.length > 0) {
      html += `<div class="lg-artwork-keywords">`;
      html += art.keywords.map(k => `<span class="lg-keyword-badge">${escapeHtml(k)}</span>`).join('');
      html += `</div>`;
    }
    
    html += `</div>`;
    return html;
  };
  
  const artworkHTML = artworksToRender.map(art => {
    // Build and escape sub-html for data attribute
    const subHtml = buildSubHtml(art);
    const escapedSubHtml = escapeHtml(subHtml);
    
    // Extract artwork ID from filename (e.g., "art0681.avif" -> "0681")
    let artworkId = '';
    if (art.file) {
      const match = art.file.match(/art(\d{4})/);
      if (match) {
        artworkId = match[1];
      }
    }
    
    // Clean title to remove ID number if present
    // If title IS just the ID number (e.g., "0101"), use description or generate creative title
    let cleanTitle = art.title || 'Untitled';
    
    // Initialize description variables (must be outside if block)
    let fullDescription = art.description || 'No description available';
    let shortDescription = '';
    let hasLongDescription = false;
    let titleFromDescription = false;
    
    if (artworkId) {
      // Remove ID pattern from beginning of title (e.g., "0101 Title" -> "Title")
      const idPattern = new RegExp(`^0?${artworkId}\\s*[-:]?\\s*`, 'i');
      cleanTitle = cleanTitle.replace(idPattern, '').trim();
      
      // If title was just the ID number (or becomes empty after cleaning), use alternative
      if (cleanTitle === '' || cleanTitle === artworkId || cleanTitle.match(/^\d{4}$/)) {
        // Use description first line, or generate creative title, or fallback
        if (art.description && art.description.length > 0) {
          // Use first part of description as title
          const descFirstLine = art.description.split(/[.!?]/)[0].trim();
          cleanTitle = descFirstLine.length > 60 ? descFirstLine.substring(0, 60) + '...' : descFirstLine;
          titleFromDescription = true;
        } else {
          // Generate creative title based on category
          cleanTitle = generateArtTitle(art);
        }
      }
      
      // Prepare description with expand functionality
      // If title came from description, skip description or use remaining part
      if (titleFromDescription && art.description) {
        // Title is from description, so skip showing description to avoid duplication
        fullDescription = '';
        shortDescription = '';
        hasLongDescription = false;
      } else {
        // Normal case: show description
        shortDescription = fullDescription.length > 120 ? fullDescription.substring(0, 120) + '...' : fullDescription;
        hasLongDescription = fullDescription.length > 120;
      }
    } else {
      // No artworkId - use normal description handling
      shortDescription = fullDescription.length > 120 ? fullDescription.substring(0, 120) + '...' : fullDescription;
      hasLongDescription = fullDescription.length > 120;
    }
    const safeId = art.file ? art.file.replace(/[^a-z0-9]/gi, '-') : `art-${startIndex}`;
    
    return `
    <a href="artworks/${art.file}" 
       data-src="artworks/${art.file}"
       data-sub-html="${escapedSubHtml}"
       data-title="${escapeHtml(cleanTitle)}"
       data-category="${escapeHtml(art.category || 'Uncategorized')}"
       data-extended="${escapeHtml(art.extended_description || art.description || '')}"
       data-keywords="${(art.keywords || []).map(k => escapeHtml(k)).join(', ')}"
       class="text-decoration-none lightgallery-item">
      <div class="artwork-card loading" 
           data-file="${art.file}"
           data-category="${art.category || 'Uncategorized'}" 
           data-year="${art.year || 'Unknown'}"
           data-aspect-ratio="${getAspectRatioCategory(art)}">
        ${artworkId ? `<div class="artwork-id">${artworkId}</div>` : ''}
        <div class="artwork-image-container loading" data-image-src="artworks/thumbs/${art.file}">
          <!-- Skeleton Loader -->
          <div class="skeleton-loader">
            <div class="skeleton-shimmer"></div>
          </div>
          <!-- Progressive Image -->
          <img src="artworks/thumbs/${art.file}" 
               data-full-src="artworks/${art.file}"
               data-file="${art.file}"
               alt="${escapeHtml((art.description || cleanTitle) + ' - ' + (art.category || 'Art') + ' by Jeff Neumann')}" 
               title="${escapeHtml(art.extended_description || art.description || cleanTitle)}"
               loading="${startIndex < 6 && append === false ? 'eager' : 'lazy'}"
               decoding="async"
               fetchpriority="${startIndex === 0 && append === false ? 'high' : startIndex < 6 ? 'auto' : 'low'}"
               width="400"
               height="300"
               class="loading progressive-image">
          <!-- Error State -->
          <div class="image-error-state" style="display: none;">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Failed to load image</p>
            <button class="retry-image-btn" data-action="retry-image" data-file="${art.file}" aria-label="Retry loading image">
              <i class="fas fa-redo"></i> Retry
            </button>
          </div>
          <div class="artwork-overlay">
            <button class="quick-view-btn" 
                    data-action="quick-view"
                    data-file="${art.file}"
                    aria-label="Quick view"
                    title="Quick view">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
        <button class="favorites-btn" 
                data-action="toggle-favorite"
                data-file="${art.file}"
                aria-label="Add to favorites"
                title="Add to favorites">
          <i class="far fa-heart"></i>
        </button>
        <!-- Quick Actions Bar -->
        <div class="quick-actions-bar">
          <button class="action-btn quick-view-action" 
                  data-action="quick-view"
                  data-file="${art.file}"
                  aria-label="Quick view"
                  title="Quick view">
            <i class="fas fa-eye"></i>
            <span class="action-label">View</span>
          </button>
          <button class="action-btn favorite-action" 
                  data-action="toggle-favorite"
                  data-file="${art.file}"
                  aria-label="Add to favorites"
                  title="Add to favorites">
            <i class="far fa-heart"></i>
            <span class="action-label">Favorite</span>
          </button>
          <button class="action-btn share-action" 
                  data-action="share-artwork"
                  data-file="${art.file}"
                  data-title="${escapeHtml(cleanTitle)}"
                  aria-label="Share artwork"
                  title="Share artwork">
            <i class="fas fa-share-alt"></i>
            <span class="action-label">Share</span>
          </button>
        </div>
        <div class="artwork-info loading">
          <h3 class="artwork-title">${escapeHtml(cleanTitle)}</h3>
          <div class="artwork-meta">
            <span class="artwork-category">${escapeHtml(art.category || 'Uncategorized')}</span>
          </div>
          <div class="artwork-description-wrapper">
            <div class="artwork-description" id="desc-${safeId}">${escapeHtml(shortDescription)}</div>
            ${hasLongDescription ? `
              <button class="read-more-btn" data-action="toggle-description" data-target-id="${safeId}" data-full-text="${escapeHtml(fullDescription)}" data-short-text="${escapeHtml(shortDescription)}" aria-label="Read more">
                <span class="read-more-text">Read more</span>
                <i class="fas fa-chevron-down read-more-icon"></i>
              </button>
            ` : ''}
          </div>
          ${art.keywords && art.keywords.length > 0 ? `
            <div class="artwork-keywords">
              ${art.keywords.slice(0, 3).map(keyword => `<span class="keyword-tag clickable-keyword" data-keyword="${escapeHtml(keyword)}" role="button" tabindex="0" aria-label="Filter by ${escapeHtml(keyword)}">${escapeHtml(keyword)}</span>`).join('')}
              ${art.keywords.length > 3 ? `<span class="more-keywords" title="${art.keywords.slice(3).map(k => escapeHtml(k)).join(', ')}">+${art.keywords.length - 3}</span>` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    </a>
  `;
  }).join('');
  
  // Debug logging
  if (window.debugLog) window.debugLog('📝 Setting innerHTML', {
    append,
    artworkHTMLLength: artworkHTML.length,
    artworksToRender: artworksToRender.length,
    targetGallery: targetGallery.id,
    hasHTML: artworkHTML.length > 0
  });
  
  // Use targetGallery for all operations
  // CRITICAL: Set flag BEFORE clearing innerHTML to prevent MutationObserver from triggering re-render
  if (append) {
    targetGallery.innerHTML += artworkHTML;
  } else {
    // Clear and set in one operation to minimize mutation events
    targetGallery.innerHTML = artworkHTML;
    window.ArtGallery.state.currentPage = 1;
  }

  // Attach image handlers immediately after render
  attachGalleryImageHandlers(targetGallery);
  
  // Verify HTML was set
  const cardCount = targetGallery.querySelectorAll('.artwork-card').length;
  if (window.debugLog) window.debugLog('✅ innerHTML set', {
    cardCount,
    galleryHTML: targetGallery.innerHTML.substring(0, 200)
  });
  
  // Ensure gallery is visible after setting content
  // Force visibility with multiple methods
  targetGallery.classList.remove('display-none', 'd-none');
  targetGallery.style.display = 'grid'; // Use grid display for gallery
  targetGallery.style.visibility = 'visible';
  targetGallery.style.opacity = '1';
  targetGallery.style.pointerEvents = 'auto';
  
  // Double-check visibility after a brief delay
  setTimeout(() => {
    const computedStyle = window.getComputedStyle(targetGallery);
    if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
      targetGallery.style.cssText = 'display: grid !important; visibility: visible !important; opacity: 1 !important; pointer-events: auto !important;';
      targetGallery.classList.remove('display-none', 'd-none');
    }
  }, 50);
  
  // Apply fade-in animation if requested
  if (fadeIn) {
    const newCards = targetGallery.querySelectorAll('.artwork-card');
    newCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.9) translateY(30px)';
      setTimeout(() => {
        card.classList.add('filtering-in');
        card.style.opacity = '1';
        card.style.transform = '';
      }, index * 30); // Stagger the fade-in
    });
  } else {
    // Ensure cards are visible by default - force visibility
    const newCards = targetGallery.querySelectorAll('.artwork-card');
    newCards.forEach((card) => {
      card.style.opacity = '1';
      card.style.visibility = 'visible';
      card.style.display = 'flex'; // Ensure display is set
      // Force animation to complete immediately
      card.style.animation = 'none';
      card.style.transform = 'none';
    });
  }
  
  // Initialize LightGallery after rendering - ALWAYS initialize, not just on initial render
  // Delay initialization to ensure DOM is ready
  setTimeout(() => {
    if (window.debugLog) window.debugLog('🎬 Checking LightGallery availability...', {
      lightGallery: typeof lightGallery,
      gallery: !!targetGallery,
      links: targetGallery.querySelectorAll('a[data-src]').length,
      append: append
    });
    
    // Always attach click handlers first to prevent navigation
    const artworkLinks = targetGallery.querySelectorAll('a[data-src]');
    if (window.debugLog) window.debugLog('🔗 Attaching click handlers to', artworkLinks.length, 'artwork links');
    artworkLinks.forEach((link, index) => {
      // Remove existing onclick to avoid conflicts
      link.removeAttribute('onclick');
      
      // Remove any existing listeners by cloning
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
      
      // Add click handler to prevent navigation
      newLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (window.debugLog) window.debugLog('🖱️ Artwork link clicked (index', index, '), preventing navigation');
        
        // Try to open LightGallery
        if (window.lightGalleryInstance) {
          if (window.debugLog) window.debugLog('🎬 Opening LightGallery at index', index);
          try {
            window.lightGalleryInstance.openGallery(index);
          } catch(err) {
            if (window.DEBUG) console.error('❌ Error opening LightGallery:', err);
            // Fallback: reinitialize
            initializeLightGallery();
            setTimeout(() => {
              if (window.lightGalleryInstance) {
                window.lightGalleryInstance.openGallery(index);
              }
            }, 100);
          }
        } else {
          if (window.debugWarn) window.debugWarn('⚠️ LightGallery instance not found, initializing...');
          initializeLightGallery();
          setTimeout(() => {
            if (window.lightGalleryInstance) {
              window.lightGalleryInstance.openGallery(index);
            }
          }, 200);
        }
      }, { capture: true, passive: false });
    });
    
    // Initialize LightGallery if available
    if (typeof lightGallery !== 'undefined') {
      if (window.debugLog) window.debugLog('✅ LightGallery available, initializing...');
      initializeLightGallery();
    } else {
      if (window.debugWarn) window.debugWarn('⚠️ LightGallery not available yet, will retry...');
      // Retry after a delay
      setTimeout(() => {
        if (typeof lightGallery !== 'undefined') {
          if (window.debugLog) window.debugLog('✅ LightGallery now available, initializing...');
          initializeLightGallery();
        } else {
          if (window.DEBUG) console.error('❌ LightGallery still not available');
        }
      }, 500);
    }
  }, 300);
  
  // Show category description and CTA sections after initial render (only once)
  if (!append) {
    setTimeout(() => {
      const descSection = document.getElementById('categoryDescSection');
      const ctaSection = document.getElementById('commissionCTA');
      if (descSection) descSection.style.display = 'block';
      if (ctaSection) ctaSection.style.display = 'flex';
    }, 100);
  }
  
  // Update progressive loading UI
  updateProgressiveLoadingUI();
  
  // Clear rendering flag AFTER everything is complete
  // Use setTimeout to ensure DOM has settled and prevent immediate re-renders
  setTimeout(() => {
    // Double-check gallery has content before clearing flag
    const gallery = document.getElementById('galleryContainer') || document.getElementById('gallery');
    const hasContent = gallery && gallery.innerHTML && gallery.innerHTML.trim() !== '';
    const cardCount = gallery ? gallery.querySelectorAll('.artwork-card').length : 0;
    
    if (window.debugLog) window.debugLog('🏁 Clearing rendering flag', {
      hasContent,
      cardCount,
      galleryExists: !!gallery,
      innerHTMLLength: gallery?.innerHTML?.length || 0
    });
    
    if (hasContent && cardCount > 0) {
      window.artGalleryRendering = false;
      window.artGalleryRenderingStartTime = null;
      if (window.debugLog) window.debugLog('✅ Rendering flag cleared - gallery has content');
    } else {
      // If gallery is empty, clear flag anyway (might be CSS issue)
      if (window.debugWarn) window.debugWarn('⚠️ Gallery appears empty but clearing flag anyway', {
        cardCount,
        innerHTML: gallery?.innerHTML?.substring(0, 100)
      });
      window.artGalleryRendering = false;
      window.artGalleryRenderingStartTime = null;
    }
  }, 150);
}

function enforceGalleryGridColumns(targetGallery) {
  if (!targetGallery) return;

  const width = Math.round(targetGallery.getBoundingClientRect().width || 0);
  let columns = 1;
  if (width >= 1200) {
    columns = 4;
  } else if (width >= 992) {
    columns = 3;
  } else if (width >= 768) {
    columns = 2;
  }

  targetGallery.classList.remove('gallery-masonry');
  targetGallery.dataset.layout = 'grid';
  targetGallery.style.display = 'grid';
  targetGallery.style.columnCount = 'unset';
  targetGallery.style.columnGap = '0';
  targetGallery.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
}

// Initialize LightGallery for artwork slideshow
function initializeLightGallery() {
  // Destroy existing instance if any
  if (window.lightGalleryInstance) {
    try {
      window.lightGalleryInstance.destroy();
      window.lightGalleryInstance = null;
    } catch(e) {
      if (window.debugWarn) window.debugWarn('Error destroying existing lightGallery instance:', e);
    }
  }
  
  // Also try to destroy by container
  const existingGallery = document.querySelector('.lg-container');
  if (existingGallery) {
    try {
      const existingInstance = existingGallery.lightGalleryInstance;
      if (existingInstance) {
        existingInstance.destroy();
      }
      existingGallery.remove(); // Remove the container
    } catch(e) {
      // Ignore destroy errors
    }
  }
  
  // Get gallery container
  const gallery = document.getElementById('galleryContainer') || document.getElementById('gallery');
  if (!gallery) return;
  
  // Watch for gallery opening and inject controls immediately
  const watchForGalleryOpen = () => {
    const observer = new MutationObserver((mutations) => {
      const container = document.querySelector('.lg-container.lg-show, .lg-container');
      if (container && !container.hasAttribute('data-controls-injected')) {
        container.setAttribute('data-controls-injected', 'true');
        if (window.debugLog) window.debugLog('🔍 Gallery opened, checking for controls...');
        
        const injectControls = () => {
          const outer = container.querySelector('.lg-outer');
          if (!outer) {
            if (window.debugWarn) window.debugWarn('⚠️ No outer found, retrying...');
            return false;
          }
          
          if (window.debugLog) window.debugLog('✅ Outer found, checking for toolbar...');
          
          // Check/create toolbar
          let toolbar = container.querySelector('.lg-toolbar');
          if (!toolbar) {
            if (window.debugLog) window.debugLog('🔧 Injecting toolbar...');
            toolbar = document.createElement('div');
            toolbar.className = 'lg-toolbar lg-group';
            outer.appendChild(toolbar);
            if (window.debugLog) window.debugLog('✅ Toolbar injected');
          } else {
            if (window.debugLog) window.debugLog('✅ Toolbar exists');
          }
          
          // Check/create close button
          let closeBtn = toolbar.querySelector('.lg-close');
          if (!closeBtn) {
            if (window.debugLog) window.debugLog('🔧 Injecting close button...');
            closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.setAttribute('aria-label', 'Close gallery');
            closeBtn.className = 'lg-close lg-icon';
            toolbar.appendChild(closeBtn);
            if (window.debugLog) window.debugLog('✅ Close button injected');
            
            if (window.lightGalleryInstance) {
              closeBtn.addEventListener('click', () => {
                window.lightGalleryInstance.closeGallery();
              });
            }
          } else {
            if (window.debugLog) window.debugLog('✅ Close button exists');
          }
          
          // Check/create navigation buttons
          const content = container.querySelector('.lg-content');
          if (content && window.lightGalleryInstance) {
            let prevBtn = content.querySelector('.lg-prev');
            if (!prevBtn) {
              if (window.debugLog) window.debugLog('🔧 Injecting prev button...');
              prevBtn = document.createElement('button');
              prevBtn.type = 'button';
              prevBtn.setAttribute('aria-label', 'Previous');
              prevBtn.className = 'lg-prev lg-icon';
              content.appendChild(prevBtn);
              if (window.debugLog) window.debugLog('✅ Prev button injected');
              
              prevBtn.addEventListener('click', () => {
                window.lightGalleryInstance.goToPrevSlide();
              });
            } else {
              if (window.debugLog) window.debugLog('✅ Prev button exists');
            }
            
            let nextBtn = content.querySelector('.lg-next');
            if (!nextBtn) {
              if (window.debugLog) window.debugLog('🔧 Injecting next button...');
              nextBtn = document.createElement('button');
              nextBtn.type = 'button';
              nextBtn.setAttribute('aria-label', 'Next');
              nextBtn.className = 'lg-next lg-icon';
              content.appendChild(nextBtn);
              if (window.debugLog) window.debugLog('✅ Next button injected');
              
              nextBtn.addEventListener('click', () => {
                window.lightGalleryInstance.goToNextSlide();
              });
            } else {
              if (window.debugLog) window.debugLog('✅ Next button exists');
            }
          } else {
            if (window.debugWarn) window.debugWarn('⚠️ Content or lightGalleryInstance not found');
          }
          
          // Force visibility
          if (window.forceLightGalleryControlsVisible) {
            if (window.debugLog) window.debugLog('✅ Calling forceLightGalleryControlsVisible');
            window.forceLightGalleryControlsVisible();
          }
          
          return true;
        };
        
        // Try immediately and retry multiple times
        if (!injectControls()) {
          setTimeout(() => injectControls(), 50);
          setTimeout(() => injectControls(), 100);
          setTimeout(() => injectControls(), 200);
          setTimeout(() => injectControls(), 500);
        }
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
    
    return observer;
  };
  
  const galleryObserver = watchForGalleryOpen();
  
  // Initialize new gallery with enhanced UX/UI
  setTimeout(() => {
    try {
      if (window.debugLog) window.debugLog('🎬 initializeLightGallery: Starting initialization', {
        gallery: !!gallery,
        lightGallery: typeof lightGallery,
        links: gallery.querySelectorAll('a[data-src]').length
      });
      
      // Build plugins array dynamically
      const plugins = [];
      if (typeof lgThumbnail !== 'undefined') plugins.push(lgThumbnail);
      if (typeof lgZoom !== 'undefined') plugins.push(lgZoom);
      if (typeof lgFullscreen !== 'undefined') plugins.push(lgFullscreen);
      if (typeof lgRotate !== 'undefined') plugins.push(lgRotate);
      if (typeof lgHash !== 'undefined') plugins.push(lgHash);
      if (typeof lgAutoplay !== 'undefined') plugins.push(lgAutoplay);
      
      // Store instance globally to prevent duplicates
      window.lightGalleryInstance = lightGallery(gallery, {
        selector: 'a[data-src]',
        plugins: plugins,
        
        // Force controls visible when gallery initializes
        onInit: function() {
          if (window.debugLog) window.debugLog('🎬 LightGallery onInit - creating/forcing controls visible');
          
          // Create controls immediately if they don't exist
          setTimeout(() => {
            const container = document.querySelector('.lg-container') || document.querySelector('[class*="lg-container"]');
            if (!container) {
              if (window.debugWarn) window.debugWarn('⚠️ No container in onInit');
              return;
            }
            
            if (window.debugLog) window.debugLog('✅ Container found in onInit:', container.className);
            
            const outer = container.querySelector('.lg-outer');
            if (!outer) {
              if (window.debugWarn) window.debugWarn('⚠️ No outer in onInit');
              return;
            }
            
            // Ensure toolbar exists
            let toolbar = container.querySelector('.lg-toolbar');
            if (!toolbar) {
              if (window.debugLog) window.debugLog('🔧 Creating toolbar in onInit...');
              toolbar = document.createElement('div');
              toolbar.className = 'lg-toolbar lg-group';
              outer.appendChild(toolbar);
            } else {
              if (window.debugLog) window.debugLog('✅ Toolbar exists in onInit');
            }
            
            // Ensure close button exists
            let closeBtn = toolbar.querySelector('.lg-close');
            if (!closeBtn) {
              if (window.debugLog) window.debugLog('🔧 Creating close button in onInit...');
              closeBtn = document.createElement('button');
              closeBtn.type = 'button';
              closeBtn.setAttribute('aria-label', 'Close gallery');
              closeBtn.className = 'lg-close lg-icon';
              toolbar.appendChild(closeBtn);
              
              if (window.lightGalleryInstance) {
                closeBtn.addEventListener('click', () => {
                  window.lightGalleryInstance.closeGallery();
                });
              }
            } else {
              if (window.debugLog) window.debugLog('✅ Close button exists in onInit');
            }
            
            // Ensure prev/next buttons exist
            const content = container.querySelector('.lg-content');
            if (content) {
              let prevBtn = content.querySelector('.lg-prev');
              if (!prevBtn && window.lightGalleryInstance) {
                if (window.debugLog) window.debugLog('🔧 Creating prev button in onInit...');
                prevBtn = document.createElement('button');
                prevBtn.type = 'button';
                prevBtn.setAttribute('aria-label', 'Previous');
                prevBtn.className = 'lg-prev lg-icon';
                content.appendChild(prevBtn);
                
                prevBtn.addEventListener('click', () => {
                  window.lightGalleryInstance.goToPrevSlide();
                });
              } else if (prevBtn) {
                if (window.debugLog) window.debugLog('✅ Prev button exists in onInit');
              }
              
              let nextBtn = content.querySelector('.lg-next');
              if (!nextBtn && window.lightGalleryInstance) {
                if (window.debugLog) window.debugLog('🔧 Creating next button in onInit...');
                nextBtn = document.createElement('button');
                nextBtn.type = 'button';
                nextBtn.setAttribute('aria-label', 'Next');
                nextBtn.className = 'lg-next lg-icon';
                content.appendChild(nextBtn);
                
                nextBtn.addEventListener('click', () => {
                  window.lightGalleryInstance.goToNextSlide();
                });
              } else if (nextBtn) {
                if (window.debugLog) window.debugLog('✅ Next button exists in onInit');
              }
            }
            
            // Force visibility
            if (window.forceLightGalleryControlsVisible) {
              window.forceLightGalleryControlsVisible();
            }
          }, 100);
        },
        
        // Force controls visible after gallery opens
        onAfterOpen: function() {
          if (window.debugLog) window.debugLog('🎬 LightGallery onAfterOpen - forcing controls visible');
          
          // Force visibility function with detailed logging
          const forceControls = () => {
            // Try multiple selectors to find container
            let container = document.querySelector('.lg-container.lg-show') || 
                           document.querySelector('.lg-container') ||
                           document.querySelector('[class*="lg-container"]');
            
            if (!container) {
              if (window.debugWarn) window.debugWarn('⚠️ No LightGallery container found');
              return;
            }
            
            if (window.debugLog) window.debugLog('✅ Container found:', container.className);
            if (window.debugLog) window.debugLog('🔍 Inspecting container HTML:', container.innerHTML.substring(0, 500));
            
            // Remove hide-items class from outer
            const outer = container.querySelector('.lg-outer') || document.querySelector('.lg-outer');
            if (outer) {
              outer.classList.remove('lg-hide-items');
              outer.style.setProperty('opacity', '1', 'important');
              if (window.debugLog) window.debugLog('✅ Outer forced visible');
            }
            
            // Force toolbar visible - try multiple selectors
            let toolbar = container.querySelector('.lg-toolbar') || 
                         document.querySelector('.lg-toolbar') ||
                         document.querySelector('[class*="lg-toolbar"]');
            
            if (toolbar) {
              toolbar.classList.remove('lg-toolbar-hide', 'lg-hide');
              toolbar.style.cssText = 'opacity: 1 !important; visibility: visible !important; display: block !important; z-index: 10001 !important; position: absolute !important; top: 0 !important; left: 0 !important; right: 0 !important; width: 100% !important; height: auto !important; min-height: 47px !important; background: rgba(0, 0, 0, 0.85) !important; backdrop-filter: blur(10px) !important; -webkit-backdrop-filter: blur(10px) !important; pointer-events: auto !important; padding: 0.5rem !important;';
              if (window.debugLog) window.debugLog('✅ Toolbar forced visible:', toolbar);
              if (window.debugLog) window.debugLog('🔍 Toolbar HTML:', toolbar.innerHTML.substring(0, 300));
            } else {
              if (window.debugWarn) window.debugWarn('⚠️ Toolbar not found - LightGallery may not have created it');
              if (window.debugWarn) window.debugWarn('🔍 Available elements in container:', Array.from(container.children).map(el => el.className));
              
              // MANUALLY CREATE TOOLBAR IF MISSING
              if (window.debugLog) window.debugLog('🔧 Creating toolbar manually...');
              const outer = container.querySelector('.lg-outer') || document.querySelector('.lg-outer');
              if (outer) {
                const toolbar = document.createElement('div');
                toolbar.className = 'lg-toolbar lg-group';
                toolbar.innerHTML = '<button type="button" aria-label="Close gallery" class="lg-close lg-icon"></button>';
                outer.appendChild(toolbar);
                if (window.debugLog) window.debugLog('✅ Toolbar created manually');
                
                // Force it visible
                toolbar.style.cssText = 'opacity: 1 !important; visibility: visible !important; display: block !important; z-index: 10001 !important; position: absolute !important; top: 0 !important; left: 0 !important; right: 0 !important; width: 100% !important; height: auto !important; min-height: 47px !important; background: rgba(0, 0, 0, 0.85) !important; backdrop-filter: blur(10px) !important; -webkit-backdrop-filter: blur(10px) !important; pointer-events: auto !important; padding: 0.5rem !important;';
                
                // Attach close handler
                const closeBtn = toolbar.querySelector('.lg-close');
                if (closeBtn && window.lightGalleryInstance) {
                  closeBtn.addEventListener('click', () => {
                    window.lightGalleryInstance.closeGallery();
                  });
                }
              }
            }
            
            // Force close button - try multiple selectors
            let closeBtn = container.querySelector('.lg-close') || 
                          document.querySelector('.lg-close') ||
                          document.querySelector('[class*="lg-close"]');
            
            if (closeBtn) {
              closeBtn.classList.remove('lg-hide', 'disabled');
              closeBtn.style.cssText = 'opacity: 1 !important; visibility: visible !important; display: block !important; color: #ffffff !important; z-index: 10002 !important; pointer-events: auto !important; cursor: pointer !important; width: 50px !important; height: 47px !important; font-size: 24px !important; line-height: 47px !important;';
              if (window.debugLog) window.debugLog('✅ Close button forced visible:', closeBtn);
            } else {
              if (window.debugWarn) window.debugWarn('⚠️ Close button not found');
              
              // Try to find toolbar and create close button
              const toolbar = container.querySelector('.lg-toolbar');
              if (toolbar) {
                if (window.debugLog) window.debugLog('🔧 Creating close button manually...');
                const closeBtn = document.createElement('button');
                closeBtn.type = 'button';
                closeBtn.setAttribute('aria-label', 'Close gallery');
                closeBtn.className = 'lg-close lg-icon';
                toolbar.appendChild(closeBtn);
                
                // Force visible
                closeBtn.style.cssText = 'opacity: 1 !important; visibility: visible !important; display: block !important; color: #ffffff !important; z-index: 10002 !important; pointer-events: auto !important; cursor: pointer !important; width: 50px !important; height: 47px !important; font-size: 24px !important; line-height: 47px !important;';
                
                // Attach handler
                if (window.lightGalleryInstance) {
                  closeBtn.addEventListener('click', () => {
                    window.lightGalleryInstance.closeGallery();
                  });
                }
                if (window.debugLog) window.debugLog('✅ Close button created manually');
              }
            }
            
            // Force navigation buttons - try multiple selectors
            let prevBtn = container.querySelector('.lg-prev') || 
                         document.querySelector('.lg-prev') ||
                         document.querySelector('[class*="lg-prev"]');
            let nextBtn = container.querySelector('.lg-next') || 
                         document.querySelector('.lg-next') ||
                         document.querySelector('[class*="lg-next"]');
            
            if (prevBtn) {
              prevBtn.classList.remove('lg-hide', 'disabled');
              prevBtn.style.cssText = 'opacity: 1 !important; visibility: visible !important; display: block !important; color: #ffffff !important; z-index: 10000 !important; pointer-events: auto !important; cursor: pointer !important; position: absolute !important; left: 20px !important; top: 50% !important; transform: translateY(-50%) !important; width: 50px !important; height: 50px !important; font-size: 22px !important;';
              if (window.debugLog) window.debugLog('✅ Prev button forced visible:', prevBtn);
            } else {
              if (window.debugWarn) window.debugWarn('⚠️ Prev button not found');
              
              // MANUALLY CREATE PREV BUTTON
              const content = container.querySelector('.lg-content') || document.querySelector('.lg-content');
              if (content && window.lightGalleryInstance) {
                if (window.debugLog) window.debugLog('🔧 Creating prev button manually...');
                const prevBtn = document.createElement('button');
                prevBtn.type = 'button';
                prevBtn.setAttribute('aria-label', 'Previous');
                prevBtn.className = 'lg-prev lg-icon';
                content.appendChild(prevBtn);
                
                prevBtn.style.cssText = 'opacity: 1 !important; visibility: visible !important; display: block !important; color: #ffffff !important; z-index: 10000 !important; pointer-events: auto !important; cursor: pointer !important; position: absolute !important; left: 20px !important; top: 50% !important; transform: translateY(-50%) !important; width: 50px !important; height: 50px !important; font-size: 22px !important; background: rgba(0, 0, 0, 0.85) !important; border-radius: 4px !important;';
                
                prevBtn.addEventListener('click', () => {
                  window.lightGalleryInstance.goToPrevSlide();
                });
                if (window.debugLog) window.debugLog('✅ Prev button created manually');
              }
            }
            
            if (nextBtn) {
              nextBtn.classList.remove('lg-hide', 'disabled');
              nextBtn.style.cssText = 'opacity: 1 !important; visibility: visible !important; display: block !important; color: #ffffff !important; z-index: 10000 !important; pointer-events: auto !important; cursor: pointer !important; position: absolute !important; right: 20px !important; top: 50% !important; transform: translateY(-50%) !important; width: 50px !important; height: 50px !important; font-size: 22px !important;';
              if (window.debugLog) window.debugLog('✅ Next button forced visible:', nextBtn);
            } else {
              if (window.debugWarn) window.debugWarn('⚠️ Next button not found');
              
              // MANUALLY CREATE NEXT BUTTON
              const content = container.querySelector('.lg-content') || document.querySelector('.lg-content');
              if (content && window.lightGalleryInstance) {
                if (window.debugLog) window.debugLog('🔧 Creating next button manually...');
                const nextBtn = document.createElement('button');
                nextBtn.type = 'button';
                nextBtn.setAttribute('aria-label', 'Next');
                nextBtn.className = 'lg-next lg-icon';
                content.appendChild(nextBtn);
                
                nextBtn.style.cssText = 'opacity: 1 !important; visibility: visible !important; display: block !important; color: #ffffff !important; z-index: 10000 !important; pointer-events: auto !important; cursor: pointer !important; position: absolute !important; right: 20px !important; top: 50% !important; transform: translateY(-50%) !important; width: 50px !important; height: 50px !important; font-size: 22px !important; background: rgba(0, 0, 0, 0.85) !important; border-radius: 4px !important;';
                
                nextBtn.addEventListener('click', () => {
                  window.lightGalleryInstance.goToNextSlide();
                });
                if (window.debugLog) window.debugLog('✅ Next button created manually');
              }
            }
            
            // Force all icons visible
            const allIcons = container.querySelectorAll('.lg-icon') || document.querySelectorAll('.lg-icon');
            allIcons.forEach(icon => {
              icon.style.cssText += 'opacity: 1 !important; visibility: visible !important; display: block !important; color: #ffffff !important; pointer-events: auto !important;';
            });
            if (allIcons.length > 0) {
              if (window.debugLog) window.debugLog('✅ Forced', allIcons.length, 'icons visible');
            } else {
              if (window.debugWarn) window.debugWarn('⚠️ No icons found in container');
            }
            
            // Call global fix function if available
            if (window.forceLightGalleryControlsVisible) {
              if (window.debugLog) window.debugLog('✅ Calling window.forceLightGalleryControlsVisible');
              window.forceLightGalleryControlsVisible();
            } else {
              if (window.debugWarn) window.debugWarn('⚠️ window.forceLightGalleryControlsVisible not available');
            }
          };
          
          // Call immediately and repeatedly
          forceControls();
          setTimeout(forceControls, 10);
          setTimeout(forceControls, 50);
          setTimeout(forceControls, 100);
          setTimeout(forceControls, 200);
          setTimeout(forceControls, 500);
          setTimeout(forceControls, 1000);
          
          // Monitor and force every 100ms for 3 seconds
          let checkCount = 0;
          const monitorInterval = setInterval(() => {
            checkCount++;
            if (checkCount >= 30) {
              clearInterval(monitorInterval);
              return;
            }
            forceControls();
          }, 100);
        },
        
        // Ensure scrolling is restored when gallery closes
        onCloseAfter: function() {
          // Immediately restore visibility
          const restoreVisibility = () => {
            // Restore scroll
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.overflowY = 'auto';
            document.documentElement.style.overflowY = 'auto';
            
            // Get elements
            const gallery = document.getElementById('galleryContainer') || document.getElementById('gallery');
            const loadingEl = document.getElementById('loading');
            const mainContent = document.getElementById('main-content-section');
            const filterSection = document.querySelector('.filter-section, #filterSection');
            
            // Aggressively hide loading
            if (loadingEl) {
              loadingEl.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;';
              loadingEl.classList.remove('show');
              loadingEl.classList.add('d-none');
            }
            
            // Aggressively show gallery
            if (gallery) {
              gallery.classList.remove('display-none', 'd-none');
              gallery.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; pointer-events: auto !important;';
            }
            
            // Aggressively show main content
            if (mainContent) {
              mainContent.classList.remove('display-none', 'd-none');
              mainContent.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; pointer-events: auto !important;';
            }
            
            // Show filter section
            if (filterSection) {
              filterSection.style.cssText = 'display: block !important; visibility: visible !important;';
            }
            
            // If gallery is empty but we have artworks, re-render (only if not already rendering)
            if (gallery && (!gallery.innerHTML || gallery.innerHTML.trim() === '') && 
                window.ArtGallery && window.ArtGallery.state && 
                window.ArtGallery.state.filteredArtworks.length > 0 &&
                !window.artGalleryRendering) {
              if (window.ArtGallery.renderGallery) {
                window.ArtGallery.renderGallery();
              }
            }
          };
          
          // Run immediately
          restoreVisibility();
          
          // Run again after short delay
          setTimeout(restoreVisibility, 10);
          setTimeout(restoreVisibility, 50);
          setTimeout(restoreVisibility, 100);
          setTimeout(restoreVisibility, 200);
          setTimeout(restoreVisibility, 500);
          
          // Start continuous monitoring for 2 seconds
          let checkCount = 0;
          const maxChecks = 40; // 2 seconds at 50ms intervals
          const monitorInterval = setInterval(() => {
            checkCount++;
            if (checkCount >= maxChecks) {
              clearInterval(monitorInterval);
              return;
            }
            
            const loadingEl = document.getElementById('loading');
            const gallery = document.getElementById('galleryContainer') || document.getElementById('gallery');
            
            // If loading is visible, hide it
            if (loadingEl && (loadingEl.style.display !== 'none' || !loadingEl.classList.contains('d-none'))) {
              loadingEl.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
              loadingEl.classList.add('d-none');
            }
            
            // If gallery is hidden, show it
            if (gallery && (gallery.classList.contains('display-none') || gallery.style.display === 'none' || gallery.classList.contains('d-none'))) {
              gallery.classList.remove('display-none', 'd-none');
              gallery.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important;';
            }
          }, 50);
          
          // Clean up LightGallery containers
          setTimeout(() => {
            const lgContainers = document.querySelectorAll('.lg-container.lg-closing, .lg-container.lg-closed, .lg-backdrop.lg-closing, .lg-outer.lg-closing');
            lgContainers.forEach(el => {
              if (el && (el.classList.contains('lg-closing') || el.classList.contains('lg-closed'))) {
                setTimeout(() => {
                  if (el && !el.classList.contains('lg-show')) {
                    el.remove();
                  }
                }, 300);
              }
            });
          }, 100);
        },
        
        // CRITICAL: Ensure controls are always visible and CREATED
        hideBarsDelay: 0, // Never hide bars
        showBarsAfter: 0, // Show bars immediately
        showCloseIcon: true, // MUST be true to create close button
        closable: true, // MUST be true to create close button
        closeIcon: true, // MUST be true to create close button
        controls: true, // MUST be true to create prev/next buttons
        download: true,
        counter: true,
        
        // Mobile settings - ensure controls show on mobile too
        mobileSettings: {
          controls: true,
          showCloseIcon: true,
          closable: true,
          download: true,
          hideBarsDelay: 0,
          showBarsAfter: 0,
        },
        
        // Animation & Transitions
        speed: 400,
        mode: 'lg-fade',
        cssEasing: 'cubic-bezier(0.25, 0, 0.25, 1)',
        easing: 'easeInOutQuart',
        useLeft: true,
        
        // Zoom Settings
        zoomFromOrigin: true,
        actualSize: true,
        showZoomInOutIcons: true,
        actualSizeIcons: {
          zoomIn: 'Zoom in',
          zoomOut: 'Zoom out'
        },
        scale: 1,
        enableZoomAfter: 300,
        zoomPluginStrings: {
          zoomIn: 'Zoom in',
          zoomOut: 'Zoom out',
          viewActualSize: 'View actual size'
        },
        
        // Thumbnail Settings
        thumbnail: true,
        animateThumb: true,
        currentPagerPosition: 'middle',
        thumbWidth: 100,
        thumbHeight: '80px',
        thumbMargin: 5,
        thumbContHeight: 100,
        toggleThumb: true,
        
        // Fullscreen
        fullScreen: true,
        fullScreenPluginStrings: {
          toggleFullscreen: 'Toggle fullscreen'
        },
        
        // Rotate
        rotate: true,
        rotatePluginStrings: {
          rotateLeft: 'Rotate left',
          rotateRight: 'Rotate right'
        },
        
        // Autoplay
        autoplay: false,
        autoplayPluginStrings: {
          toggleAutoplay: 'Toggle autoplay'
        },
        slideDelay: 3000,
        progressBar: true,
        
        // Hash (URL deep linking) - DISABLED to prevent scrolling
        hash: false,
        galleryId: 'artwork-gallery',
        
        // General Settings
        download: true,
        counter: true,
        controls: true,
        showCloseIcon: true,
        closeIcon: true,
        closable: true,
        
        // Touch & Gesture Settings - Enhanced
        enableDrag: true,
        enableSwipe: true,
        swipeToClose: true,
        closeOnTap: true,
        loop: true,
        swipeThreshold: 50,
        slideEndAnimation: true,
        
        // Keyboard Settings - Enhanced
        escKey: true,
        keyPress: true,
        trapFocus: true,
        
        // Mouse Settings
        mousewheel: true,
        hideControlOnEnd: false,
        hideScrollbar: true,
        showAfterLoad: true,
        hideBarsDelay: 0, // Don't auto-hide toolbar (0 = never hide)
        
        // Share
        share: true,
        sharePluginStrings: {
          share: 'Share',
          fb: 'Facebook',
          twitter: 'Twitter',
          pinterest: 'Pinterest'
        },
        
        // Accessibility
        ariaLabelledby: 'lg-item-title',
        ariaDescribedby: 'lg-item-desc',
        
        // Performance - Enhanced
        preload: 3,
        appendSubHtmlTo: '.lg-item',
        subHtmlSelectorRelative: true,
        progressiveLoading: true,
        
        // Custom strings
        strings: {
          closeGallery: 'Close gallery',
          toggleMaximize: 'Toggle maximize',
          previousSlide: 'Previous slide',
          nextSlide: 'Next slide',
          download: 'Download',
          share: 'Share',
          playVideo: 'Play video',
          close: 'Close'
        }
      });
      
      // CRITICAL: Ensure scrolling is restored when gallery closes
      if (!window.lightGalleryCloseHandler) {
        window.lightGalleryCloseHandler = function() {
          // Use setTimeout to ensure this runs after LightGallery's internal cleanup
          setTimeout(() => {
            // Restore scroll
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.overflowY = 'auto';
            document.documentElement.style.overflowY = 'auto';
            
            // Only clean up LightGallery containers if they're actually closed (have lg-closing or lg-closed class)
            // Don't remove containers that are opening or open
            const lgContainers = document.querySelectorAll('.lg-container.lg-closing, .lg-container.lg-closed, .lg-backdrop.lg-closing, .lg-outer.lg-closing');
            lgContainers.forEach(el => {
              if (el && (el.classList.contains('lg-closing') || el.classList.contains('lg-closed'))) {
                setTimeout(() => {
                  if (el && !el.classList.contains('lg-show')) {
                    el.style.display = 'none';
                    el.style.visibility = 'hidden';
                    el.style.opacity = '0';
                    el.style.pointerEvents = 'none';
                    el.remove();
                  }
                }, 300);
              }
            });
            
            // Ensure gallery content is visible
            const gallery = document.getElementById('galleryContainer') || document.getElementById('gallery');
            const loadingEl = document.getElementById('loading');
            
            if (gallery) {
              gallery.classList.remove('display-none');
              gallery.style.display = '';
              gallery.style.visibility = 'visible';
              gallery.style.opacity = '1';
              gallery.style.pointerEvents = 'auto';
            }
            
            // Hide loading spinner if it's showing
            if (loadingEl) {
              loadingEl.style.display = 'none';
              loadingEl.style.visibility = 'hidden';
              loadingEl.style.opacity = '0';
            }
            
            // Ensure main content is visible
            const mainContent = document.getElementById('main-content-section');
            if (mainContent) {
              mainContent.style.display = '';
              mainContent.style.visibility = 'visible';
              mainContent.style.opacity = '1';
              mainContent.style.pointerEvents = 'auto';
            }
            
            // Ensure filter section is visible
            const filterSection = document.querySelector('.filter-section, #filterSection');
            if (filterSection) {
              filterSection.style.display = '';
              filterSection.style.visibility = 'visible';
            }
            
            // CRITICAL: Ensure loading is hidden before checking gallery
            const checkLoading = document.getElementById('loading');
            if (checkLoading) {
              checkLoading.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;';
              checkLoading.classList.remove('show');
              checkLoading.classList.add('d-none');
            }
            
            // If gallery is empty but we have artworks, re-render (only if not already rendering)
            if (gallery && (!gallery.innerHTML || gallery.innerHTML.trim() === '') && 
                window.ArtGallery && window.ArtGallery.state && 
                window.ArtGallery.state.filteredArtworks.length > 0 &&
                !window.artGalleryRendering) {
              // Ensure loading is hidden before re-rendering
              if (checkLoading) {
                checkLoading.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;';
                checkLoading.classList.add('d-none');
              }
              if (window.ArtGallery.renderGallery) {
                window.ArtGallery.renderGallery();
              }
            }
            
            // Force a reflow to ensure styles are applied
            if (gallery) {
              gallery.offsetHeight; // Trigger reflow
            }
            
            // Double-check: if loading is still showing, force hide it
            const stillLoading = document.getElementById('loading');
            if (stillLoading && stillLoading.style.display !== 'none') {
              stillLoading.style.display = 'none';
              stillLoading.style.visibility = 'hidden';
              stillLoading.style.opacity = '0';
            }
            
            // Double-check: if gallery is still hidden, force show it
            const stillGallery = document.getElementById('galleryContainer') || document.getElementById('gallery');
            if (stillGallery && (stillGallery.classList.contains('display-none') || stillGallery.style.display === 'none')) {
              stillGallery.classList.remove('display-none');
              stillGallery.style.display = '';
              stillGallery.style.visibility = 'visible';
              stillGallery.style.opacity = '1';
            }
            
            // Clean up instance reference
            if (window.lightGalleryInstance) {
              window.lightGalleryInstance = null;
            }
            
            // Final aggressive check: ensure everything is visible
            setTimeout(() => {
              const finalLoading = document.getElementById('loading');
              const finalGallery = document.getElementById('galleryContainer') || document.getElementById('gallery');
              const finalMainContent = document.getElementById('main-content-section');
              
              // Force hide loading
              if (finalLoading) {
                finalLoading.style.display = 'none';
                finalLoading.style.visibility = 'hidden';
                finalLoading.style.opacity = '0';
                finalLoading.style.pointerEvents = 'none';
                finalLoading.classList.remove('show');
                finalLoading.classList.add('d-none');
              }
              
              // Force show gallery
              if (finalGallery) {
                finalGallery.classList.remove('display-none', 'd-none');
                finalGallery.style.display = '';
                finalGallery.style.visibility = 'visible';
                finalGallery.style.opacity = '1';
                finalGallery.style.pointerEvents = 'auto';
              }
              
              // Force show main content
              if (finalMainContent) {
                finalMainContent.style.display = '';
                finalMainContent.style.visibility = 'visible';
                finalMainContent.style.opacity = '1';
                finalMainContent.style.pointerEvents = 'auto';
                finalMainContent.classList.remove('display-none', 'd-none');
              }
            }, 100);
          }, 50);
        };
      }
      
      // Remove old listeners and add new one
      document.removeEventListener('lgAfterClose', window.lightGalleryCloseHandler);
      document.addEventListener('lgAfterClose', window.lightGalleryCloseHandler, { once: false });
      
      // Also listen for beforeClose to prepare
      document.addEventListener('lgBeforeClose', function() {
        // Ensure gallery will be visible after close
        const gallery = document.getElementById('galleryContainer') || document.getElementById('gallery');
        if (gallery) {
          gallery.style.display = '';
          gallery.style.visibility = 'visible';
        }
      }, { once: false });
      
      // Watch for loading element being re-shown AFTER gallery closes (not during open)
      if (!window.lightGalleryLoadingWatcher) {
        let isLightGalleryOpen = false;
        
        // Track when LightGallery opens/closes
        document.addEventListener('lgAfterOpen', function() {
          isLightGalleryOpen = true;
        }, { once: false });
        
        document.addEventListener('lgAfterClose', function() {
          isLightGalleryOpen = false;
          
          // Immediately ensure content is visible after close
          setTimeout(() => {
            const loadingEl = document.getElementById('loading');
            const gallery = document.getElementById('galleryContainer') || document.getElementById('gallery');
            const mainContent = document.getElementById('main-content-section');
            
            if (loadingEl) {
              loadingEl.style.display = 'none';
              loadingEl.style.visibility = 'hidden';
              loadingEl.style.opacity = '0';
              loadingEl.style.pointerEvents = 'none';
              loadingEl.classList.remove('show');
              loadingEl.classList.add('d-none');
            }
            
            if (gallery) {
              gallery.classList.remove('display-none', 'd-none');
              gallery.style.display = '';
              gallery.style.visibility = 'visible';
              gallery.style.opacity = '1';
              gallery.style.pointerEvents = 'auto';
            }
            
            if (mainContent) {
              mainContent.style.display = '';
              mainContent.style.visibility = 'visible';
              mainContent.style.opacity = '1';
              mainContent.style.pointerEvents = 'auto';
              mainContent.classList.remove('display-none', 'd-none');
            }
          }, 10);
        }, { once: false });
        
        // PERMANENT MutationObserver - never stops, watches entire document
        // Debounce to prevent rapid-fire triggers
        let mutationDebounceTimer;
        window.lightGalleryLoadingWatcher = new MutationObserver(function(mutations) {
          // Only act if LightGallery is NOT open - don't interfere with opening
          if (isLightGalleryOpen) return;
          
          // Skip if already rendering
          if (window.artGalleryRendering) return;
          
          // Debounce: clear previous timer and set new one
          clearTimeout(mutationDebounceTimer);
          mutationDebounceTimer = setTimeout(() => {
            // Double-check rendering flag after debounce
            if (window.artGalleryRendering) return;
            
            const loadingEl = document.getElementById('loading');
            const gallery = document.getElementById('galleryContainer') || document.getElementById('gallery');
            const mainContent = document.getElementById('main-content-section');
            
            // Skip if gallery is empty (might be mid-render)
            if (gallery && (!gallery.innerHTML || gallery.innerHTML.trim() === '')) {
              return;
            }
          
          // PERMANENTLY hide loading element using computed styles
          if (loadingEl) {
            const computedStyle = window.getComputedStyle(loadingEl);
            const isVisible = computedStyle.display !== 'none' && 
                             computedStyle.visibility !== 'hidden' &&
                             computedStyle.opacity !== '0' &&
                             !loadingEl.classList.contains('d-none');
            
            if (isVisible) {
              loadingEl.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;';
              loadingEl.classList.remove('show');
              loadingEl.classList.add('d-none');
            }
          }
          
          // PERMANENTLY show gallery if it has content but is hidden
          if (gallery && gallery.innerHTML && gallery.innerHTML.trim() !== '') {
            const computedStyle = window.getComputedStyle(gallery);
            const isHidden = gallery.classList.contains('display-none') || 
                            gallery.classList.contains('d-none') ||
                            computedStyle.display === 'none' ||
                            computedStyle.visibility === 'hidden' ||
                            computedStyle.opacity === '0';
            
            if (isHidden) {
              gallery.classList.remove('display-none', 'd-none');
              gallery.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; pointer-events: auto !important;';
            }
          }
          
          // PERMANENTLY show main content if hidden
          if (mainContent) {
            const computedStyle = window.getComputedStyle(mainContent);
            const isHidden = mainContent.classList.contains('display-none') || 
                            mainContent.classList.contains('d-none') ||
                            computedStyle.display === 'none' ||
                            computedStyle.visibility === 'hidden' ||
                            computedStyle.opacity === '0';
            
            if (isHidden) {
              mainContent.classList.remove('display-none', 'd-none');
              mainContent.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; pointer-events: auto !important;';
            }
          }
          }, 100); // Debounce delay: 100ms
        });
        
        // Start watching PERMANENTLY - observe entire document body
        window.lightGalleryLoadingWatcher.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['style', 'class']
        });
      }
    } catch(e) {
      if (window.debugWarn) window.debugWarn('LightGallery initialization error:', e);
      window.lightGalleryInstance = null;
    }
  }, 100);
}

// Update progressive loading status and controls
function updateProgressiveLoadingUI() {
  const loadingStatus = document.getElementById('loadingStatus');
  const loadingStatusText = document.getElementById('loadingStatusText');
  const scrollHint = document.getElementById('scrollHint');
  const remainingCount = document.getElementById('remainingCount');
  const loadingControls = document.getElementById('loadingControls');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const viewAllBtn = document.getElementById('viewAllBtn');
  const loadMoreCount = document.getElementById('loadMoreCount');
  const viewAllCount = document.getElementById('viewAllCount');
  
  const displayedCount = Math.min(currentPage * itemsPerPage, filteredArtworks.length);
  const totalCount = filteredArtworks.length;
  const remaining = totalCount - displayedCount;
  
  // Show/hide status display
  if (totalCount > 0 && loadingStatus) {
    loadingStatus.style.display = 'block';
    if (loadingStatusText) {
      loadingStatusText.textContent = `Showing ${displayedCount} of ${totalCount} artworks`;
    }
    
    // Show scroll hint if more items available
    if (remaining > 0 && scrollHint && remainingCount) {
      scrollHint.style.display = 'inline';
      remainingCount.textContent = remaining;
    } else if (scrollHint) {
      scrollHint.style.display = 'none';
    }
  } else if (loadingStatus) {
    loadingStatus.style.display = 'none';
  }
  
  // Show/hide loading controls
  if (remaining > 0 && loadingControls) {
    loadingControls.style.display = 'block';
    
    // Show Load More button
    if (loadMoreBtn && loadMoreCount) {
      loadMoreBtn.style.display = 'block';
      loadMoreCount.textContent = remaining;
      
      // Update button text based on remaining count
      const loadMoreText = document.getElementById('loadMoreText');
      if (loadMoreText) {
        const nextBatch = Math.min(itemsPerPage, remaining);
        loadMoreText.textContent = `Load ${nextBatch} More Artworks ⬇️`;
      }
    }
    
    // Show View All button only if more than one page remaining
    if (viewAllBtn && viewAllCount && remaining > itemsPerPage) {
      viewAllBtn.style.display = 'block';
      viewAllCount.textContent = totalCount;
    } else if (viewAllBtn) {
      viewAllBtn.style.display = 'none';
    }
  } else if (loadingControls) {
    loadingControls.style.display = 'none';
  }
}

// Load More Artworks - incremental loading
function loadMoreArtworks() {
  currentPage++;
  renderGallery(true, true); // append = true, fadeIn = true
  
  // Auto-scroll removed - let user control their scroll position
}

// Load All Artworks - batch loading with progress
async function loadAllArtworks() {
  const viewAllBtn = document.getElementById('viewAllBtn');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const progressDiv = document.getElementById('batchLoadingProgress');
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.getElementById('progressPercent');
  
  // Hide buttons and show progress
  if (viewAllBtn) viewAllBtn.style.display = 'none';
  if (loadMoreBtn) loadMoreBtn.style.display = 'none';
  if (progressDiv) progressDiv.style.display = 'block';
  
  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
  const batchSize = 2; // Load 2 pages at a time for smooth rendering
  
  for (let i = currentPage + 1; i <= totalPages; i += batchSize) {
    // Update progress
    const progress = Math.round((i / totalPages) * 100);
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressPercent) progressPercent.textContent = progress;
    
    // Load batch of pages
    for (let j = 0; j < batchSize && (currentPage + 1) <= totalPages; j++) {
      currentPage++;
      renderGallery(true, false); // append = true, fadeIn = false (faster)
    }
    
    // Small delay between batches for smooth rendering
    if (window.ArtGallery.state.currentPage < totalPages) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  // Complete - hide progress and update UI
  if (progressDiv) {
    setTimeout(() => {
      progressDiv.style.display = 'none';
      if (progressBar) progressBar.style.width = '0%';
      if (progressPercent) progressPercent.textContent = '0';
    }, 500);
  }
  
  updateProgressiveLoadingUI();
  
  // Auto-scroll removed - let user control their scroll position
}

// Toggle description expand/collapse
function toggleDescription(id, fullText, shortText) {
  const descEl = document.getElementById(`desc-${id}`);
  const btnEl = descEl?.nextElementSibling;
  const iconEl = btnEl?.querySelector('.read-more-icon');
  const textEl = btnEl?.querySelector('.read-more-text');
  
  if (!descEl || !btnEl) return;
  
  const isExpanded = descEl.getAttribute('data-expanded') === 'true';
  
  if (isExpanded) {
    // Collapse
    descEl.textContent = shortText;
    descEl.setAttribute('data-expanded', 'false');
    if (textEl) textEl.textContent = 'Read more';
    if (iconEl) {
      iconEl.classList.remove('fa-chevron-up');
      iconEl.classList.add('fa-chevron-down');
    }
    descEl.classList.remove('expanded');
  } else {
    // Expand
    descEl.textContent = fullText;
    descEl.setAttribute('data-expanded', 'true');
    if (textEl) textEl.textContent = 'Read less';
    if (iconEl) {
      iconEl.classList.remove('fa-chevron-down');
      iconEl.classList.add('fa-chevron-up');
    }
    descEl.classList.add('expanded');
  }
}

// Filter by keyword
function filterByKeyword(keyword) {
  const searchInput = document.getElementById('artworkSearch');
  if (searchInput) {
    searchInput.value = keyword;
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    // Also trigger search
    if (typeof filterArtworks === 'function') {
      filterArtworks(null, null, null, null, keyword);
    }
    // Auto-scroll removed - let user control their scroll position
  }
}

// Enhanced Image Loading Functions
function handleImageError(img, fallbackFile) {
  const container = img.closest('.artwork-image-container');
  if (!container) return;
  
  // Hide skeleton loader
  const skeleton = container.querySelector('.skeleton-loader');
  if (skeleton) skeleton.style.display = 'none';
  
  // Show error state
  const errorState = container.querySelector('.image-error-state');
  if (errorState) {
    errorState.style.display = 'flex';
    container.classList.add('has-error');
  }
  
  // Try fallback
  if (fallbackFile && img.src !== `artworks/${fallbackFile}`) {
    img.src = `artworks/${fallbackFile}`;
  }

  // Track missing images for debugging
  if (fallbackFile) {
    window.missingArtworks = window.missingArtworks || new Set();
    window.missingArtworks.add(fallbackFile);
    if (window.debugWarn) {
      window.debugWarn('⚠️ Image failed to load:', fallbackFile, img.src);
    } else {
      console.warn('Image failed to load:', fallbackFile, img.src);
    }
  }
}

// Attach load/error handlers to gallery images (CSP-safe)
function attachGalleryImageHandlers(container) {
  if (!container) return;

  const images = container.querySelectorAll('img.progressive-image');
  images.forEach(img => {
    if (img.dataset.handlerBound === 'true') return;
    img.dataset.handlerBound = 'true';

    const fallbackFile = img.dataset.file || (img.dataset.fullSrc ? img.dataset.fullSrc.split('/').pop() : '');

    img.addEventListener('error', () => handleImageError(img, fallbackFile), { once: true });
    img.addEventListener('load', () => {
      if (!img.classList.contains('loaded')) {
        handleImageLoad(img);
      }
    }, { once: true });

    // If the image already loaded before handlers attached
    if (img.complete && img.naturalHeight !== 0) {
      if (!img.classList.contains('loaded')) {
        handleImageLoad(img);
      }
    } else if (img.complete && img.naturalWidth === 0) {
      // If the image already failed before handlers attached
      handleImageError(img, fallbackFile);
    }
  });
}

// Ensure filters render under breadcrumb nav
function moveFiltersUnderBreadcrumb() {
  const filterSection = document.getElementById('filter-section');
  const breadcrumbNav = document.querySelector('nav[aria-label="Breadcrumb"]');

  if (!filterSection || !breadcrumbNav) return;
  if (filterSection.dataset.movedUnderBreadcrumb === 'true') return;

  breadcrumbNav.insertAdjacentElement('afterend', filterSection);
  filterSection.dataset.movedUnderBreadcrumb = 'true';
}

function retryImageLoad(btn, file) {
  const container = btn.closest('.artwork-image-container');
  if (!container) return;
  
  const img = container.querySelector('img');
  const errorState = container.querySelector('.image-error-state');
  const skeleton = container.querySelector('.skeleton-loader');
  
  // Hide error, show skeleton
  if (errorState) errorState.style.display = 'none';
  if (skeleton) skeleton.style.display = 'block';
  container.classList.remove('has-error');
  container.classList.add('loading');
  
  // Reset image
  if (img) {
    img.src = '';
    img.src = `artworks/thumbs/${file}`;
    img.classList.add('loading');
    img.classList.remove('loaded', 'error');
    img.addEventListener('error', () => handleImageError(img, file), { once: true });
  }

  // Re-initialize progressive loading for this image
  if (typeof initProgressiveImageLoading === 'function') {
    initProgressiveImageLoading();
  }
}

let progressiveImageObserver = null;
let progressiveImageObserverRoot = null;

function getProgressiveScrollRoot() {
  const candidates = [
    document.getElementById('main-content-section'),
    document.getElementById('galleryContainer'),
    document.getElementById('gallery'),
    document.body
  ].filter(Boolean);

  for (const el of candidates) {
    const styles = window.getComputedStyle(el);
    const overflowY = styles.overflowY;
    const isScrollable = (overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight;
    if (isScrollable) {
      return el;
    }
  }

  return null;
}

function getProgressiveImageObserver() {
  const desiredRoot = getProgressiveScrollRoot();
  if (progressiveImageObserver && progressiveImageObserverRoot === desiredRoot) {
    return progressiveImageObserver;
  }
  if (progressiveImageObserver) {
    progressiveImageObserver.disconnect();
  }
  if (!('IntersectionObserver' in window)) return null;
  progressiveImageObserverRoot = desiredRoot;
  progressiveImageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      if (typeof img._requestFullImage === 'function') {
        img._requestFullImage();
      }
      observer.unobserve(img);
    });
  }, {
    root: progressiveImageObserverRoot,
    rootMargin: '300px 0px',
    threshold: 0.01
  });
  return progressiveImageObserver;
}

// Progressive Image Loading
function initProgressiveImageLoading() {
  const images = document.querySelectorAll('.progressive-image');
  
  images.forEach(img => {
    const requestFullImage = () => {
      if (img.dataset.fullLoaded === 'true' || img.dataset.fullLoading === 'true') return;
      const fullSrc = img.dataset.fullSrc || img.src.replace('/thumbs/', '/');
      if (!fullSrc || fullSrc === img.src) {
        handleImageLoad(img);
        img.dataset.fullLoaded = 'true';
        return;
      }

      img.dataset.fullLoading = 'true';
      const fullImg = new Image();
      fullImg.onload = () => {
        img.src = fullSrc;
        img.classList.add('loaded');
        handleImageLoad(img);
        img.dataset.fullLoaded = 'true';
        img.dataset.fullLoading = 'false';
      };
      fullImg.onerror = () => {
        img.dataset.fullLoading = 'false';
        // Keep thumbnail if full image fails
        handleImageLoad(img);
      };
      fullImg.src = fullSrc;
    };

    img._requestFullImage = requestFullImage;
    img._forceRevealTimer = img._forceRevealTimer || setTimeout(() => {
      if (!img.complete || img.naturalHeight === 0) {
        img.loading = 'eager';
        img.fetchPriority = 'high';
        img.decoding = 'sync';
        img.src = img.src;
      }
    }, 1500);

    if (img.complete && img.naturalHeight !== 0) {
      // Thumb may be cached/loaded before handlers attach
      handleImageLoad(img);
      requestFullImage();
      return;
    }

    // Ensure errors are handled without inline handlers
    img.addEventListener('error', () => {
      const fallbackFile = img.dataset.file || (img.dataset.fullSrc ? img.dataset.fullSrc.split('/').pop() : '');
      handleImageError(img, fallbackFile);
    }, { once: true });
    
    const observer = getProgressiveImageObserver();
    if (observer) {
      observer.observe(img);
    } else {
      setTimeout(requestFullImage, 50);
    }

    // Once thumbnail loads, load full image
    img.addEventListener('load', function onThumbLoad() {
      img.removeEventListener('load', onThumbLoad);
      if (img._forceRevealTimer) {
        clearTimeout(img._forceRevealTimer);
        img._forceRevealTimer = null;
      }
      // Reveal thumbnail immediately; swap to full when available
      handleImageLoad(img);
      requestFullImage();
    }, { once: true });
  });
}

// CSP-safe gallery action handlers (replaces inline onclick usage)
function setupGalleryActionHandlers() {
  if (window.galleryActionHandlersInitialized) return;
  window.galleryActionHandlersInitialized = true;

  document.addEventListener('click', function(e) {
    const actionElement = e.target.closest('[data-action]');
    if (!actionElement) return;

    const action = actionElement.getAttribute('data-action');
    if (!action) return;

    // Prevent anchor navigation and LightGallery conflicts for action buttons
    e.preventDefault();
    e.stopPropagation();

    const file = actionElement.getAttribute('data-file') || '';
    const title = actionElement.getAttribute('data-title') || '';

    switch (action) {
      case 'retry-image':
        retryImageLoad(actionElement, file);
        break;
      case 'reload-page':
        location.reload();
        break;
      case 'quick-view':
        if (typeof window.quickView === 'function') {
          window.quickView(file);
        }
        break;
      case 'toggle-favorite':
        if (typeof window.toggleFavorite === 'function') {
          window.toggleFavorite(file);
        }
        break;
      case 'share-artwork':
        shareArtwork(file, title);
        break;
      case 'toggle-description': {
        const targetId = actionElement.getAttribute('data-target-id') || '';
        const fullText = actionElement.getAttribute('data-full-text') || '';
        const shortText = actionElement.getAttribute('data-short-text') || '';
        toggleDescription(targetId, fullText, shortText);
        break;
      }
      case 'toggle-extended-description': {
        const targetId = actionElement.getAttribute('data-target-id') || '';
        toggleExtendedDescription(targetId);
        break;
      }
      default:
        break;
    }
  });
}

// Share Artwork Function
function shareArtwork(file, title) {
  const url = `${window.location.origin}/artworks/${file}`;
  const text = `Check out "${title}" by Jeffrey F. S. Neumann`;
  
  if (navigator.share) {
    navigator.share({
      title: title,
      text: text,
      url: url
    }).catch(err => {
      if (window.debugLog) window.debugLog('Share cancelled or failed:', err);
      fallbackShare(url, title, text);
    });
  } else {
    fallbackShare(url, title, text);
  }
}

function fallbackShare(url, title, text) {
  // Copy to clipboard
  const shareText = `${text}\n${url}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareText).then(() => {
      // Show toast notification if available
      if (typeof showToast === 'function') {
        showToast('Link copied to clipboard!', 'success', 2000);
      } else {
        alert('Link copied to clipboard!');
      }
    });
  } else {
    // Fallback: show share dialog
    prompt('Share this artwork:', shareText);
  }
}

// Make functions and variables globally available
window.filterArtworks = filterArtworks;
window.renderGallery = renderGallery;
window.loadMoreArtworks = loadMoreArtworks;
window.loadAllArtworks = loadAllArtworks;
window.animateFilterTransition = animateFilterTransition;
window.updateProgressiveLoadingUI = updateProgressiveLoadingUI;
window.toggleDescription = toggleDescription;
window.filterByKeyword = filterByKeyword;
window.handleImageError = handleImageError;
window.retryImageLoad = retryImageLoad;
window.shareArtwork = shareArtwork;
window.initProgressiveImageLoading = initProgressiveImageLoading;
window.setupGalleryActionHandlers = setupGalleryActionHandlers;

// Initialize progressive loading after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initProgressiveImageLoading, 100);
    setupGalleryActionHandlers();
    moveFiltersUnderBreadcrumb();
    const galleryContainer = document.getElementById('galleryContainer') || document.getElementById('gallery');
    if (galleryContainer) {
      enforceGalleryGridColumns(galleryContainer);
      attachGalleryImageHandlers(galleryContainer);
    }
  });
} else {
  setTimeout(initProgressiveImageLoading, 100);
  setupGalleryActionHandlers();
  moveFiltersUnderBreadcrumb();
  const galleryContainer = document.getElementById('galleryContainer') || document.getElementById('gallery');
  if (galleryContainer) {
    enforceGalleryGridColumns(galleryContainer);
    attachGalleryImageHandlers(galleryContainer);
  }
}

// Re-initialize after gallery updates
document.addEventListener('galleryUpdated', () => {
  setTimeout(initProgressiveImageLoading, 100);
  const galleryContainer = document.getElementById('galleryContainer') || document.getElementById('gallery');
  if (galleryContainer) {
    enforceGalleryGridColumns(galleryContainer);
    attachGalleryImageHandlers(galleryContainer);
  }
});

window.addEventListener('resize', () => {
  const galleryContainer = document.getElementById('galleryContainer') || document.getElementById('gallery');
  if (galleryContainer) {
    enforceGalleryGridColumns(galleryContainer);
  }
});

// Mobile Swipe Gestures
function initMobileSwipeGestures() {
  if (!('ontouchstart' in window)) return; // Only on touch devices
  
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  
  document.addEventListener('touchstart', (e) => {
    const card = e.target.closest('.artwork-card');
    if (!card) return;
    
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    card.classList.add('touch-active');
  }, { passive: true });
  
  document.addEventListener('touchend', (e) => {
    const card = e.target.closest('.artwork-card');
    if (!card) return;
    
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 50;
    
    // Swipe up: Quick view
    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < -minSwipeDistance) {
      const quickViewBtn = card.querySelector('.quick-view-action, .quick-view-btn');
      if (quickViewBtn) {
        quickViewBtn.click();
      }
    }
    // Swipe right: Favorite
    else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > minSwipeDistance) {
      const favoriteBtn = card.querySelector('.favorite-action, .favorites-btn');
      if (favoriteBtn) {
        favoriteBtn.click();
      }
    }
    // Swipe left: Share
    else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < -minSwipeDistance) {
      const shareBtn = card.querySelector('.share-action');
      if (shareBtn) {
        shareBtn.click();
      }
    }
    
    setTimeout(() => {
      card.classList.remove('touch-active');
    }, 200);
  }, { passive: true });
}

// Initialize mobile gestures
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileSwipeGestures);
} else {
  initMobileSwipeGestures();
}

// Export to ArtGallery namespace for core module compatibility
if (!window.ArtGallery) window.ArtGallery = {};
window.ArtGallery.renderGallery = renderGallery;
window.ArtGallery.showCategoryRepresentatives = showCategoryRepresentatives;

// Expose key variables for debugging
Object.defineProperty(window, 'filteredArtworks', {
  get: () => filteredArtworks,
  set: (val) => { window.ArtGallery.state.filteredArtworks = val; }
});
Object.defineProperty(window, 'currentPage', {
  get: () => window.ArtGallery.state.currentPage,
  set: (val) => { window.ArtGallery.state.currentPage = val; }
});

// Infinite scroll function (redirects to progressive loading)
function loadMoreArtworksInfinite() {
  if (isLoading || !hasMoreItems) return;
  
  window.ArtGallery.state.isLoading = true;
  
  // Haptic feedback on load start (only after user interaction to avoid browser intervention)
  if (hasUserInteracted && navigator.vibrate) {
    try {
      navigator.vibrate(15);
    } catch (e) {
      // Vibration blocked - ignore silently
    }
  }
  
  // Show loading indicator
  const loadingEl = document.getElementById('infiniteLoading');
  const loadingText = document.querySelector('.infinite-loading-text');
  if (loadingEl) {
    loadingEl.style.display = 'flex';
    if (loadingText) {
      loadingText.textContent = `Loading more artworks...`;
    }
  }
  
  // Simulate loading delay for smooth UX
  setTimeout(() => {
    loadMoreArtworks(); // Call the new progressive loading function
    window.ArtGallery.state.isLoading = false;
    
    // Hide loading indicator
    if (loadingEl) loadingEl.style.display = 'none';
    
    // Preload next batch of images
    preloadNextBatch();
  }, 400);
}

// Preload next batch of images for smoother experience
function preloadNextBatch() {
  const nextBatchStart = currentPage * itemsPerPage;
  const nextBatchEnd = nextBatchStart + itemsPerPage;
  const nextBatch = filteredArtworks.slice(nextBatchStart, nextBatchEnd);
  
  nextBatch.forEach(art => {
    const img = new Image();
    img.src = `artworks/thumbs/${art.file}`;
  });
}

// Intersection Observer for infinite scroll
function setupInfiniteScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && hasMoreItems && !isLoading) {
        loadMoreArtworksInfinite();
      }
    });
  }, {
    rootMargin: '200px' // Start loading 200px before reaching the bottom
  });
  
  // Observe the gallery container
  const gallery = document.getElementById('gallery');
  const galleryContainer = document.getElementById('galleryContainer');
  const targetGallery = galleryContainer || gallery;
  if (targetGallery) {
    observer.observe(targetGallery);
  }
}

// Debounce helper function for better performance
function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Enhanced debounced search function with visual feedback
const debouncedFilter = debounce((e) => {
  const searchInput = e?.target || document.getElementById('artworkSearch');
  const searchValue = searchInput?.value || '';
  
  // Add loading state to search input
  if (searchInput) {
    searchInput.classList.add('search-loading');
  }
  
  // Show search result count if available
  const resultCountEl = document.getElementById('searchResultCount');
  if (resultCountEl && searchValue) {
    resultCountEl.classList.add('display-none');
  }
  
  // Call filter function
  filterArtworks(null, null, null, null, searchValue);
  
  // Remove loading state after a short delay
  setTimeout(() => {
    if (searchInput) {
      searchInput.classList.remove('search-loading');
    }
  }, 300);
}, 400); // Increased to 400ms for better UX

// Track user interaction for haptic feedback (prevents browser intervention warnings)
['click', 'touchstart', 'keydown', 'scroll'].forEach(eventType => {
  document.addEventListener(eventType, function() {
    window.ArtGallery.state.hasUserInteracted = true;
  }, { once: true, passive: true });
});

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize category subtitle and description with default 'all' state
  // BUT: Don't override if URL filter is pending (will be set when filter is applied)
  if (!window.pendingCategoryFilter) {
    updateCategorySubtitleAndDescription('all');
  } else {
    console.log('⏸️ [DOMContentLoaded] Skipping default subtitle/description - URL filter pending:', window.pendingCategoryFilter);
  }
  
  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterArtworks);
  }
  const sizeFilter = document.getElementById('sizeFilter');
  if (sizeFilter) {
    sizeFilter.addEventListener('change', filterArtworks);
  }
  const orientationFilter = document.getElementById('orientationFilter');
  if (orientationFilter) {
    orientationFilter.addEventListener('change', filterArtworks);
  }
  const colorFilter = document.getElementById('colorFilter');
  if (colorFilter) {
    colorFilter.addEventListener('change', filterArtworks);
  }
  
  // Clear All Filters button
  const clearAllBtn = document.getElementById('clearAllFilters');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      document.getElementById('categoryFilter').value = 'all';
      if (orientationFilter) orientationFilter.value = 'all';
      if (colorFilter) colorFilter.value = 'all';
      const searchInput = document.getElementById('searchInput');
      if (searchInput) searchInput.value = '';
      filterArtworks();
    });
  }
  
  // Use debounced version for search input (if it exists)
  const searchInput = document.getElementById('searchInput') || document.getElementById('artworkSearch');
  if (searchInput) {
    // Enhanced search input handler with debouncing
    searchInput.addEventListener('input', debouncedFilter);
    
    // Add visual feedback on typing
    searchInput.addEventListener('input', function() {
      this.classList.add('search-typing');
      setTimeout(() => {
        this.classList.remove('search-typing');
      }, 100);
    });
    
    // Handle Enter key for immediate search
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        debouncedFilter.cancel?.(); // Cancel pending debounce
        const searchValue = this.value;
        filterArtworks(null, null, null, null, searchValue);
      }
    });
  }
  
  // Expand filter buttons container by default
  const filterButtonsContainer = document.getElementById('filterButtonsContainer');
  const filtersRow = document.getElementById('filtersRow');
  if (filterButtonsContainer) {
    filterButtonsContainer.classList.add('expanded');
  }
  
  // Setup toggle filters button
  const toggleFiltersBtn = document.getElementById('toggleFiltersBtn');
  const showFiltersBtn = document.getElementById('showFiltersBtn');
  const updateFiltersToggleState = () => {
    const isExpanded = filtersRow
      ? filtersRow.style.display !== 'none'
      : !!filterButtonsContainer?.classList.contains('expanded');
    if (toggleFiltersBtn) {
      toggleFiltersBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      const icon = document.getElementById('toggleFiltersIcon');
      if (icon) icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
    }
    if (showFiltersBtn) {
      showFiltersBtn.classList.toggle('visible', !isExpanded);
    }
  };

  if (toggleFiltersBtn) {
    toggleFiltersBtn.addEventListener('click', function() {
      const isExpanded = filtersRow
        ? filtersRow.style.display !== 'none'
        : !!filterButtonsContainer?.classList.contains('expanded');
      if (isExpanded) {
        if (filtersRow) {
          filtersRow.style.display = 'none';
        }
        if (filterButtonsContainer) {
          filterButtonsContainer.classList.remove('expanded');
        }
      } else {
        if (filtersRow) {
          filtersRow.style.display = '';
        }
        if (filterButtonsContainer) {
          filterButtonsContainer.classList.add('expanded');
        }
      }
      updateFiltersToggleState();
    });
  }

  if (showFiltersBtn) {
    showFiltersBtn.addEventListener('click', function() {
      if (filtersRow) {
        filtersRow.style.display = '';
      }
      if (filterButtonsContainer) {
        filterButtonsContainer.classList.add('expanded');
      }
      updateFiltersToggleState();
    });
  }

  updateFiltersToggleState();
  
  // Setup filter button click handlers
  const filterButtons = document.querySelectorAll('.filter-btn[data-category]');
  filterButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const category = this.getAttribute('data-category');
      
      // Remove active class from all filter buttons
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      
      // Add active class to clicked button
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');
      
      // Handle special categories
      if (category === 'favorites') {
        // Filter by favorites
        const favorites = JSON.parse(localStorage.getItem('favoriteArtworks') || '[]');
        window.ArtGallery.state.filteredArtworks = window.ArtGallery.state.allArtworks.filter(art => favorites.includes(art.file));
        updateCategorySubtitleAndDescription('favorites');
        renderGallery();
        return;
      }
      
      if (category.startsWith('orientation-')) {
        // Handle orientation filters
        const orientation = category.replace('orientation-', '');
        const searchInput = document.getElementById('artworkSearch');
        const search = searchInput ? searchInput.value : '';
        // Update subtitle/description with orientation category format
        updateCategorySubtitleAndDescription(category);
        filterArtworks('all', 'all', orientation, 'all', search);
        return;
      }
      
      // Regular category filter
      const searchInput = document.getElementById('artworkSearch');
      const search = searchInput ? searchInput.value : '';
      filterArtworks(category, 'all', 'all', 'all', search);
    });
  });
  
  // Apply pending category filter when buttons are ready
  // Prevent multiple simultaneous applications
  let isApplyingFilter = false;
  const applyPendingFilter = () => {
    // Prevent multiple simultaneous filter applications
    if (isApplyingFilter) {
      console.log('⏸️ [art-gallery] Filter application already in progress, skipping');
      return false;
    }
    
    if (!window.pendingCategoryFilter) {
      console.log('⏸️ [art-gallery] No pendingCategoryFilter');
      return false;
    }
    
    if (!window.filterArtworks) {
      console.log('⏳ [art-gallery] filterArtworks not ready yet');
      return false;
    }
    
    if (!window.ArtGallery || !window.ArtGallery.state || !window.ArtGallery.state.allArtworks || window.ArtGallery.state.allArtworks.length === 0) {
      console.log('⏳ [art-gallery] Artworks not loaded yet', {
        hasArtGallery: !!window.ArtGallery,
        hasState: !!(window.ArtGallery && window.ArtGallery.state),
        artworkCount: window.ArtGallery?.state?.allArtworks?.length || 0
      });
      return false;
    }
    
    // Set flag to prevent duplicate calls
    isApplyingFilter = true;
    const categoryParam = window.pendingCategoryFilter;
    console.log('✅ [art-gallery] Applying pending category filter:', categoryParam);
    console.log('🔍 [art-gallery] Checking for filter button with category:', categoryParam);
    
    // CRITICAL: Clear the showingCategoryReps flag BEFORE filtering
    window.ArtGallery.state.showingCategoryReps = false;
    
    // Try to find and activate the button first (for UI consistency)
    // Try exact match first, then case-insensitive match
    let filterButton = document.querySelector(`.filter-btn[data-category="${categoryParam}"]`);
    if (!filterButton) {
      // Try case-insensitive match
      const allButtons = document.querySelectorAll('.filter-btn[data-category]');
      filterButton = Array.from(allButtons).find(btn => {
        const btnCategory = btn.getAttribute('data-category');
        return btnCategory && btnCategory.toLowerCase() === categoryParam.toLowerCase();
      });
    }
    
    if (filterButton) {
      // Update button states manually first
      document.querySelectorAll('.filter-btn[data-category]').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      filterButton.classList.add('active');
      filterButton.setAttribute('aria-pressed', 'true');
      console.log('✅ [art-gallery] Activated filter button:', categoryParam);
    } else {
      console.warn('⚠️ [art-gallery] Filter button not found for category:', categoryParam);
      const availableButtons = Array.from(document.querySelectorAll('.filter-btn[data-category]')).map(btn => btn.getAttribute('data-category'));
      console.log('Available buttons:', availableButtons);
      console.log('Looking for:', categoryParam);
      // Try to find similar category names
      const similar = availableButtons.filter(cat => cat && (cat.toLowerCase().includes(categoryParam.toLowerCase()) || categoryParam.toLowerCase().includes(cat.toLowerCase())));
      if (similar.length > 0) {
        console.log('Similar categories found:', similar);
      }
    }
    
    // CRITICAL: Set categoryFilter value to match the filter
    // Temporarily remove change listener to prevent triggering filterArtworks
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      // Check if the option exists before setting value
      const optionExists = Array.from(categoryFilter.options).some(opt => opt.value === categoryParam);
      console.log('🔍 [art-gallery] categoryFilter option exists for', categoryParam, ':', optionExists);
      
      if (optionExists && categoryFilter.value !== categoryParam) {
        categoryFilter.removeEventListener('change', filterArtworks);
        categoryFilter.value = categoryParam;
        console.log('✅ [art-gallery] Set categoryFilter value to:', categoryParam);
        // Re-add listener after a short delay
        setTimeout(() => {
          if (!categoryFilter.onchange) {
            categoryFilter.addEventListener('change', filterArtworks);
          }
        }, 100);
      } else if (!optionExists) {
        console.warn('⚠️ [art-gallery] categoryFilter option does not exist for:', categoryParam);
        console.log('Available options:', Array.from(categoryFilter.options).map(opt => opt.value));
      }
    } else {
      console.warn('⚠️ [art-gallery] categoryFilter element not found');
    }
    
    // Apply the filter
    try {
      console.log('🎯 [art-gallery] Calling filterArtworks with category:', categoryParam);
      console.log('🔍 [art-gallery] Category exists in descriptions?', !!categoryDescriptions[categoryParam]);
      
      // Verify category exists in descriptions
      if (!categoryDescriptions[categoryParam]) {
        console.warn('⚠️ [art-gallery] Category not found in categoryDescriptions:', categoryParam);
        console.log('Available categories:', Object.keys(categoryDescriptions));
      }
      
      window.filterArtworks(categoryParam, null, null, null, null);
      // Don't clear pendingCategoryFilter immediately - delay to prevent race conditions
      // This ensures if filterArtworks is called again without parameters, it uses the pending filter
      setTimeout(() => {
        const hasUrlCategory = getUrlCategoryParam();
        // Keep URL-driven filter active; only clear if no URL category is present
        if (!hasUrlCategory && !window.urlCategoryFilterActive) {
          window.pendingCategoryFilter = null;
        }
        if (!hasUrlCategory) {
          window.urlCategoryFilterActive = false;
        }
        isApplyingFilter = false; // Clear flag
      }, 2000); // Increased delay to ensure filter stays applied
      console.log('✅ [art-gallery] Filter applied successfully:', categoryParam);
      return true;
    } catch (error) {
      console.error('❌ [art-gallery] Error applying filter:', error);
      console.error('Error stack:', error.stack);
      isApplyingFilter = false; // Clear flag on error
      return false;
    }
  };
  
  // Dispatch event to notify that filter buttons are ready
  window.dispatchEvent(new CustomEvent('filterButtonsReady'));
  
  // Listen for filterButtonsReady event (in case it was dispatched before this code ran)
  window.addEventListener('filterButtonsReady', () => {
    applyPendingFilter();
  });
  
  // Try immediately
  if (!applyPendingFilter()) {
    // Retry with delays - give time for data to load
    setTimeout(() => {
      if (!applyPendingFilter()) {
        setTimeout(() => {
          if (!applyPendingFilter()) {
            setTimeout(() => applyPendingFilter(), 1000);
          }
        }, 500);
      }
    }, 200);
  }
  
  // Update filter button counts dynamically
  if (allArtworks && allArtworks.length > 0) {
    const categoryCounts = {};
    allArtworks.forEach(art => {
      const cat = art.category || 'Uncategorized';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    
    filterButtons.forEach(button => {
      const category = button.getAttribute('data-category');
      if (category && category !== 'all' && category !== 'favorites' && !category.startsWith('orientation-')) {
        const countEl = button.querySelector('.artwork-count');
        if (countEl && categoryCounts[category]) {
          countEl.textContent = categoryCounts[category].toLocaleString();
        }
      }
    });
  }
  
  // Setup infinite scroll after initial load
  setTimeout(setupInfiniteScroll, 1000);
  
  // Setup 3D tilt effect for gallery cards
  setup3DTiltEffect();
  
  // Setup staggered scroll entrance animations
  setupScrollEntranceAnimations();
  
  // Setup interactive keyword tag handlers
  setupKeywordTagHandlers();
  
  // Setup clear filters button in no results state
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', function() {
      const searchInput = document.getElementById('artworkSearch') || document.getElementById('searchInput');
      if (searchInput) searchInput.value = '';
      
      // Reset all filter buttons
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      
      // Activate "All Artworks" button
      const allBtn = document.querySelector('.filter-btn[data-category="all"]');
      if (allBtn) {
        allBtn.classList.add('active');
        allBtn.setAttribute('aria-pressed', 'true');
      }
      
      // Clear filters and show all artworks
      filterArtworks('all', 'all', 'all', 'all', '');
    });
  }
});

// ===== GENERATE CREATIVE ART TITLES =====
function generateArtTitle(art) {
  // Title templates based on category
  const titlesByCategory = {
    'Guernica': [
      'War Echoes in Silence', 'Silent Scream of Peace', 'Chaos Theory Unleashed', 'Broken Peace Fragments', 'Rebel Heart Burns Bright',
      'Dark Memory Lingers', 'Fractured Time Stands Still', 'Lost Voice Calls Out', 'Burning Truth Revealed', 'Shattered Light Remains'
    ],
    'Mr. Snowmann': [
      'Winter Soul Awakens', 'Frozen Dance Begins', 'Cold Embrace of Night', 'Ice Dreams Melting', 'Snow Spirit Watching',
      'Chill Factor Rising', 'White Shadow Moves', 'Frost Bite of Winter', 'Crystal Form Takes Shape', 'Arctic Muse Whispers'
    ],
    'Torsos & Faces': [
      'Human Form Revealed', 'Body Language Speaks Volumes', 'Portrait Study in Progress', 'Face Value Examined', 'Flesh & Bone Exposed',
      'Identity Crisis Moment', 'Figure Eight in Motion', 'Skin Deep Thoughts', 'Raw Beauty Unfiltered', 'Soul Canvas Unveiled'
    ],
    'Studio': [
      'Studio Session in Progress', 'Work in Progress Continues', 'Creative Chaos Unfolds', 'Process Art Takes Form', 'Raw Vision Emerges',
      'Sketch Notes from Studio', 'Workshop Experiment Begins', 'Practice Run Through', 'Behind the Scenes Moment', 'Studio Light Catches'
    ],
    'Art School': [
      'First Sketch Ever Made', 'Learning Curve Steep Climb', 'Study Hall Late Night', 'Foundation Building Blocks', 'Early Work Shows Promise',
      'Student Days Long Gone', 'Class Project Due Soon', 'Training Ground for Artists', 'Academic Form Takes Shape', 'Lesson One Never Forgotten'
    ],
    'Galleries': [
      'Exhibition Opening Night', 'Gallery View from Distance', 'On Display for All', 'Public Face Forward', 'Show Time Approaches',
      'Curated with Great Care', 'Wall Piece Stands Proud', 'Installation Takes Space', 'Featured Work of Month', 'Gallery Light Illuminates'
    ],
    'Tracings': [
      'Line Work in Detail', 'Trace Elements of Form', 'Contour Study Continues', 'Edge Finder at Work', 'Line Dance Across Page',
      'Drawing Board Session', 'Pencil Lines Define Shape', 'Sketch Map of Form', 'Outline Form Takes Shape', 'Boundary Lines Drawn'
    ],
    'Collaboration': [
      'Joint Effort Pays Off', 'Team Work Makes Dreams', 'Shared Vision Realized', 'Partner Piece Created', 'Duo Works Together',
      'Collective Mind at Work', 'Together We Create', 'United Front Standing Strong', 'Merged Minds Think Alike', 'Combined Force Unstoppable'
    ],
    'Framed': [
      'Finished Piece at Last', 'Ready to Hang High', 'Frame Study Complete', 'Border Control Established', 'Enclosed and Protected',
      'Boxed In with Care', 'Final Form Achieved', 'Presentation Ready Now', 'Mounted on the Wall', 'Wall Ready and Waiting'
    ],
    'New': [
      'Fresh Paint Still Wet', 'Recent Work Just Finished', 'New Vision Takes Form', 'Latest Creation Unveiled', 'Just Made This Morning',
      'Brand New Work Begins', 'Current Project Ongoing', 'Today\'s Work Done', 'Now Creating Something', 'Modern Times Call'
    ],
    'Misc': [
      'Untitled Work in Progress', 'Experiment Gone Right', 'Mixed Bag of Ideas', 'Curiosity Leads the Way', 'Free Form Takes Shape',
      'Wild Card in Hand', 'Mystery Piece Unfolds', 'Oddity Worth Exploring', 'Unique Vision Emerges', 'Off Script and Free'
    ],
    '2000s': [
      'Digital Age Dawns', 'Millennium Moment Captured', 'Tech Art Takes Over', 'New Century Begins Now', 'Y2K Survived Strong',
      'Modern Era Art Form', '21st Century Vision', 'Digital Dreams Come True', 'Pixel Perfect Creation', 'Screen Time Art'
    ]
  };
  
  // Get category-specific titles or generic ones
  const category = art.category || 'Misc';
  const titles = titlesByCategory[category] || titlesByCategory['Misc'];
  
  // Use artwork ID to consistently assign same title to same artwork
  const artId = parseInt(art.title.replace(/\D/g, '')) || 0;
  const titleIndex = artId % titles.length;
  
  return titles[titleIndex];
}

// ===== SMART SKELETON LOADING HANDLER =====
function handleImageLoad(imgElement) {
  // Remove loading class from image
  imgElement.classList.remove('loading');
  imgElement.classList.add('loaded');
  
  // Remove loading classes from parent containers with a slight delay for smooth transition
  const container = imgElement.closest('.artwork-image-container');
  const card = imgElement.closest('.artwork-card');
  const info = card?.querySelector('.artwork-info');
  
  // Hide skeleton loader
  if (container) {
    const skeleton = container.querySelector('.skeleton-loader');
    if (skeleton) {
      skeleton.style.opacity = '0';
      setTimeout(() => {
        skeleton.style.display = 'none';
      }, 300);
    }
  }
  
  setTimeout(() => {
    if (container) {
      container.classList.remove('loading');
      container.classList.add('loaded');
    }
    if (card) card.classList.remove('loading');
    if (info) info.classList.remove('loading');
    
    // Extract dominant color for card accent
    extractDominantColor(imgElement, card);
  }, 100);
}

// ===== DYNAMIC COLOR EXTRACTION FOR CARD ACCENTS =====
function extractDominantColor(imgElement, card) {
  if (!imgElement || !card) return;
  
  try {
    // Create a small canvas to analyze the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Use a small size for performance
    canvas.width = 50;
    canvas.height = 50;
    
    // Draw the image onto the canvas
    ctx.drawImage(imgElement, 0, 0, 50, 50);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, 50, 50);
    const data = imageData.data;
    
    // Calculate average color
    let r = 0, g = 0, b = 0;
    let count = 0;
    
    // Sample every 4th pixel for performance
    for (let i = 0; i < data.length; i += 16) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
    
    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);
    
    // Enhance saturation and brightness for better visual effect
    const enhancedColor = enhanceColor(r, g, b);
    
    // Apply color to card using CSS custom properties
    card.style.setProperty('--card-accent-color', `rgb(${enhancedColor.r}, ${enhancedColor.g}, ${enhancedColor.b})`);
    card.style.setProperty('--card-accent-color-alpha', `rgba(${enhancedColor.r}, ${enhancedColor.g}, ${enhancedColor.b}, 0.3)`);
    
    // Add class to enable accent styling
    card.classList.add('has-accent-color');
    
  } catch (error) {
    // Silently fail if color extraction fails (e.g., CORS issues)
    if (window.debugLog) window.debugLog('Color extraction skipped for image:', error.message);
  }
}

function enhanceColor(r, g, b) {
  // Convert to HSL for easier manipulation
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  // Enhance saturation and brightness
  s = Math.min(s * 1.4, 1);
  l = Math.min(Math.max(l * 1.1, 0.4), 0.7);
  
  // Convert back to RGB
  let r2, g2, b2;
  
  if (s === 0) {
    r2 = g2 = b2 = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r2 = hue2rgb(p, q, h + 1/3);
    g2 = hue2rgb(p, q, h);
    b2 = hue2rgb(p, q, h - 1/3);
  }
  
  return {
    r: Math.round(r2 * 255),
    g: Math.round(g2 * 255),
    b: Math.round(b2 * 255)
  };
}

// Make function globally available
window.handleImageLoad = handleImageLoad;

// ===== AWARD-WINNING 3D TILT EFFECT =====
function setup3DTiltEffect() {
  // Use event delegation for dynamically loaded cards
  document.addEventListener('mousemove', function(e) {
    const card = e.target.closest('.artwork-card');
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate percentage position
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    // Calculate tilt angles (range: -15 to 15 degrees)
    const tiltX = ((yPercent - 50) / 50) * 15;
    const tiltY = ((xPercent - 50) / 50) * -15;
    
    // Apply 3D transform
    card.style.transform = `
      translateY(-12px) 
      scale(1.02) 
      rotateX(${tiltX}deg) 
      rotateY(${tiltY}deg)
    `;
    
    // Update spotlight position using CSS custom properties
    card.style.setProperty('--mouse-x', `${xPercent}%`);
    card.style.setProperty('--mouse-y', `${yPercent}%`);
  });
  
  // Reset transform on mouse leave
  document.addEventListener('mouseout', function(e) {
    const card = e.target.closest('.artwork-card');
    if (!card) return;
    
    // Smooth reset to default hover state
    card.style.transform = '';
    card.style.removeProperty('--mouse-x');
    card.style.removeProperty('--mouse-y');
  });
  
}

// ===== STAGGERED SCROLL ENTRANCE ANIMATIONS =====
function setupScrollEntranceAnimations() {
  // Create IntersectionObserver for card entrance animations
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add revealed class with a slight delay based on order
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, index * 30); // 30ms stagger between each card in viewport
        
        // Stop observing once revealed (animation only plays once)
        cardObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of card is visible
    rootMargin: '0px 0px -50px 0px' // Start animation slightly before card enters viewport
  });
  
  // Observe all artwork cards (use MutationObserver to catch dynamically added cards)
  const observeCards = () => {
    const cards = document.querySelectorAll('.artwork-card:not(.revealed)');
    cards.forEach(card => {
      cardObserver.observe(card);
    });
  };
  
  // Initial observation
  observeCards();
  
  // Watch for new cards being added (infinite scroll, filters, etc.)
  const galleryMutationObserver = new MutationObserver(() => {
    observeCards();
  });
  
  const gallery = document.getElementById('gallery');
  const galleryContainer = document.getElementById('galleryContainer');
  const targetGallery = galleryContainer || gallery;
  if (targetGallery) {
    galleryMutationObserver.observe(targetGallery, {
      childList: true,
      subtree: true
    });
  }
  
}

// ===== INTERACTIVE KEYWORD TAG HANDLERS =====
function setupKeywordTagHandlers() {
  // Use event delegation for dynamically loaded keyword tags
  document.addEventListener('click', function(e) {
    const keywordTag = e.target.closest('.keyword-tag');
    if (!keywordTag) return;
    
    // Prevent default link behavior
    e.preventDefault();
    e.stopPropagation();
    
    // Get the keyword text
    const keyword = keywordTag.textContent.trim();
    
    // Visual feedback - pulse animation
    keywordTag.style.animation = 'keywordClickPulse 0.4s ease-out';
    setTimeout(() => {
      keywordTag.style.animation = '';
    }, 400);
    
    // Update search input with the keyword
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = keyword;
      searchInput.focus();
      
      // Add a highlight effect to search input
      searchInput.style.background = 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
      searchInput.style.borderColor = '#f59e0b';
      
      setTimeout(() => {
        searchInput.style.background = '';
        searchInput.style.borderColor = '';
      }, 1000);
      
      // Trigger filter
      filterArtworks();
    }
    
  });
  
  // Add hover sound effect (optional) - visual feedback only for now
  document.addEventListener('mouseenter', function(e) {
    // Ensure e.target is an Element before calling .closest()
    if (!e.target || !e.target.closest) return;
    
    const keywordTag = e.target.closest('.keyword-tag');
    if (!keywordTag) return;
    
    // Add cursor pointer
    keywordTag.style.cursor = 'pointer';
  }, true);
  
}

// Add CSS animation for keyword click pulse
const style = document.createElement('style');
style.textContent = `
  @keyframes keywordClickPulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2) rotate(5deg);
      box-shadow: 0 8px 20px rgba(147, 51, 234, 0.5);
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }
  
  .keyword-tag {
    cursor: pointer;
    user-select: none;
  }
  
  .keyword-tag:active {
    transform: scale(0.95);
  }
`;
document.head.appendChild(style);

// ========================================
// STICKY FILTER BAR SCROLL BEHAVIOR
// ========================================
function initStickyFilterBar() {
  const filterBar = document.querySelector('.filter-bar');
  if (!filterBar) return;
  
  let lastScrollTop = 0;
  const scrollThreshold = 100;
  
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add 'scrolled' class when past threshold
    if (scrollTop > scrollThreshold) {
      filterBar.classList.add('scrolled');
    } else {
      filterBar.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
  }
  
  // Use passive event listener for better performance
  // Optimized scroll handler using RAF for better performance
  let scrollTicking = false;
  const optimizedScrollHandler = () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        handleScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  };
  window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
  
  // Initial check
  handleScroll();
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStickyFilterBar);
} else {
  initStickyFilterBar();
}

// Auto-hide filter bar on scroll down (mobile only)
function initMobileFilterBarAutoHide() {
  if (window.innerWidth > 768) return; // Mobile only
  
  const filterBar = document.querySelector('.filter-bar');
  if (!filterBar) return;
  
  let lastScrollTop = 0;
  let scrollTimeout;
  const scrollThreshold = 100;
  
  const handleScroll = () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > scrollThreshold) {
        // Scrolling down - hide filter bar
        if (scrollTop > lastScrollTop) {
          filterBar.classList.add('hidden');
        } else {
          // Scrolling up - show filter bar
          filterBar.classList.remove('hidden');
        }
      } else {
        // Near top - always show
        filterBar.classList.remove('hidden');
      }
      
      lastScrollTop = scrollTop;
    }, 50);
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
}

// Initialize mobile filter bar auto-hide
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileFilterBarAutoHide);
} else {
  initMobileFilterBarAutoHide();
}

// ========================================
// ENHANCED SMOOTH CATEGORY TRANSITIONS
// ========================================
// NOTE: This function is intentionally removed to prevent duplicate event listeners
// The filtering animations are now handled by the main filterArtworks() and animateFilterTransition() functions

// ========================================
// BLUR-UP IMAGE LOADING
// ========================================
// Note: Blur-up loading is handled by existing handleImageLoad function
// and CSS transitions. The IntersectionObserver approach was conflicting
// with the existing lazy loading system, so it's been removed.
// The CSS blur-up styles remain active and work with the existing system.

// ========================================
// EXTENDED DESCRIPTION TOGGLE
// ========================================
function toggleExtendedDescription(id) {
  const extendedDiv = document.getElementById('extended-' + id);
  const toggleBtn = extendedDiv ? extendedDiv.nextElementSibling : null;
  
  if (!extendedDiv || !toggleBtn) return;
  
  const isCollapsed = extendedDiv.classList.contains('collapsed');
  
  if (isCollapsed) {
    // Expand
    extendedDiv.classList.remove('collapsed');
    toggleBtn.classList.add('expanded');
    const span = toggleBtn.querySelector('span');
    if (span) span.textContent = 'Read less';
    
    // Auto-scroll removed - let user control their scroll position
  } else {
    // Collapse
    extendedDiv.classList.add('collapsed');
    toggleBtn.classList.remove('expanded');
    const span = toggleBtn.querySelector('span');
    if (span) span.textContent = 'Read more';
  }
}
