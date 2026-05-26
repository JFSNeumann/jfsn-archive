/**
 * Art Gallery Infinite Scroll JavaScript
 * Handles infinite scroll with Intersection Observer
 */

// Infinite Scroll with Intersection Observer
function setupInfiniteScroll() {
  // Create a sentinel element to observe
  const sentinel = document.createElement('div');
  sentinel.id = 'scroll-sentinel';
  sentinel.style.height = '20px';
  sentinel.style.margin = '2rem 0';
  
  const gallery = document.getElementById('gallery');
  const infiniteLoader = document.getElementById('infiniteLoading');
  gallery.parentNode.insertBefore(sentinel, infiniteLoader);
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && filteredArtworks.length > currentPage * itemsPerPage) {
        // Show loading indicator
        infiniteLoader.classList.add('visible');
        
        // Simulate loading delay for smooth UX
        setTimeout(() => {
          currentPage++;
          renderGallery(true);
          setTimeout(loadFavoriteStates, 100);
          
          // Hide loading indicator
          infiniteLoader.classList.remove('visible');
        }, 300);
      }
    });
  }, {
    rootMargin: '200px' // Load more when sentinel is 200px from viewport
  });
  
  observer.observe(sentinel);
}

// Initialize infinite scroll after first render
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    setupInfiniteScroll();
  }, 500);
});
