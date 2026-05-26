/**
 * Timeline Visualization for Art Gallery
 * Chronological navigation and visualization features
 */

// Initialize timeline features
function initTimelineFeatures() {
  addTimelineNavigation();
  addDecadeFilters();
  addEraNavigation();
  addFeaturedToggle();
}

// Add timeline navigation to filter bar
function addTimelineNavigation() {
  const filterBar = document.querySelector('.filter-bar');
  if (!filterBar) return;
  
  const timelineNav = document.createElement('div');
  timelineNav.className = 'timeline-navigation';
  timelineNav.style.cssText = `
    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding: 0.5rem 0;
    margin-top: 1rem;
    border-top: 1px solid rgba(99, 102, 241, 0.2);
  `;
  
  timelineNav.innerHTML = `
    <a href="timeline.html" 
       style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); transition: all 0.3s ease;"
       onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(99, 102, 241, 0.5)'"
       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(99, 102, 241, 0.3)'">
      <span>🕐</span>
      <span>View 50-Year Timeline</span>
    </a>
    <span style="color: #64748b; font-size: 0.875rem;">Explore chronologically →</span>
  `;
  
  filterBar.appendChild(timelineNav);
}

// Add decade filter chips
function addDecadeFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  if (!categoryFilter) return;
  
  // Add decade option group
  const decadeOptGroup = document.createElement('optgroup');
  decadeOptGroup.label = '📅 By Decade';
  
  const decades = ['1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];
  decades.forEach(decade => {
    const option = document.createElement('option');
    option.value = `decade:${decade}`;
    option.textContent = decade;
    decadeOptGroup.appendChild(option);
  });
  
  categoryFilter.appendChild(decadeOptGroup);
}

// Add era navigation
function addEraNavigation() {
  const categoryFilter = document.getElementById('categoryFilter');
  if (!categoryFilter) return;
  
  // Add era option group
  const eraOptGroup = document.createElement('optgroup');
  eraOptGroup.label = '🎨 By Era';
  
  const eras = [
    'Early Period (1975-1984)',
    'Evolution (1985-1994)',
    'Digital Transition (1995-2004)',
    'Mature Work (2005-2014)',
    'Recent Mastery (2015-2025)'
  ];
  
  eras.forEach(era => {
    const option = document.createElement('option');
    option.value = `era:${era}`;
    option.textContent = era;
    eraOptGroup.appendChild(option);
  });
  
  categoryFilter.appendChild(eraOptGroup);
}

// Add featured works toggle
function addFeaturedToggle() {
  const filterBar = document.querySelector('.filter-bar');
  if (!filterBar) return;
  
  const featuredToggle = document.createElement('div');
  featuredToggle.className = 'featured-toggle';
  featuredToggle.style.cssText = `
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(239, 68, 68, 0.1);
    border: 2px solid rgba(239, 68, 68, 0.3);
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 0.5rem;
  `;
  
  featuredToggle.innerHTML = `
    <input type="checkbox" id="featuredOnly" style="width: 18px; height: 18px; cursor: pointer;">
    <label for="featuredOnly" style="cursor: pointer; font-weight: 600; color: #ef4444;">⭐ Featured Only</label>
  `;
  
  featuredToggle.querySelector('#featuredOnly').addEventListener('change', (e) => {
    if (e.target.checked) {
      filterByFeatured();
      featuredToggle.style.background = 'linear-gradient(135deg, #f59e0b, #ef4444)';
      featuredToggle.querySelector('label').style.color = 'white';
    } else {
      clearFeaturedFilter();
      featuredToggle.style.background = 'rgba(239, 68, 68, 0.1)';
      featuredToggle.querySelector('label').style.color = '#ef4444';
    }
  });
  
  const timelineNav = filterBar.querySelector('.timeline-navigation');
  if (timelineNav) {
    timelineNav.appendChild(featuredToggle);
  } else {
    filterBar.appendChild(featuredToggle);
  }
}

// Filter by featured works
function filterByFeatured() {
  if (typeof window.allArtworks === 'undefined') return;
  
  const featured = window.allArtworks.filter(art => art.featured);
  window.filteredArtworks = featured;
  window.currentPage = 1;
  
  if (typeof window.renderGallery === 'function') {
    window.renderGallery();
  }
  
  // Update UI
  const count = document.getElementById('resultsCount');
  if (count) {
    count.textContent = `${featured.length} featured artworks`;
  }
}

// Clear featured filter
function clearFeaturedFilter() {
  if (typeof window.filterArtworks === 'function') {
    window.filterArtworks();
  }
}

// Enhanced filter to support decade/era filtering
const originalFilterArtworks = window.filterArtworks;
if (originalFilterArtworks) {
  window.filterArtworks = function(category) {
    const categoryFilter = document.getElementById('categoryFilter');
    const filterCategory = category || (categoryFilter ? categoryFilter.value : null);
    
    if (!filterCategory) {
      // No category filter found, call original function
      return originalFilterArtworks.apply(this, arguments);
    }
    
    // Handle decade filter
    if (filterCategory && filterCategory.startsWith('decade:')) {
      const decade = filterCategory.replace('decade:', '');
      window.filteredArtworks = window.allArtworks.filter(art => art.decade === decade);
      window.currentPage = 1;
      window.renderGallery();
      
      const count = document.getElementById('resultsCount');
      if (count) {
        count.textContent = `${window.filteredArtworks.length} artworks from ${decade}`;
      }
      return;
    }
    
    // Handle era filter
    if (filterCategory && filterCategory.startsWith('era:')) {
      const era = filterCategory.replace('era:', '');
      window.filteredArtworks = window.allArtworks.filter(art => art.era === era);
      window.currentPage = 1;
      window.renderGallery();
      
      const count = document.getElementById('resultsCount');
      if (count) {
        count.textContent = `${window.filteredArtworks.length} artworks from ${era}`;
      }
      return;
    }
    
    // Otherwise call original function with the category parameter
    return originalFilterArtworks.call(this, filterCategory);
  };
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTimelineFeatures);
} else {
  initTimelineFeatures();
}

// Export for use in other modules
window.TimelineFeatures = {
  initTimelineFeatures,
  filterByFeatured,
  clearFeaturedFilter
};

