/**
 * Art Gallery Favorites JavaScript
 * Handles favorites functionality and localStorage
 */

// Favorites functionality
let favorites = JSON.parse(localStorage.getItem('artworkFavorites') || '[]');

function toggleFavorite(artworkId) {
  const index = favorites.indexOf(artworkId);
  const heartBtn = document.querySelector(`[onclick*="toggleFavorite('${artworkId}')"]`);
  const heartIcon = heartBtn ? heartBtn.querySelector('i') : null;
  
  if (!heartBtn || !heartIcon) {
    return;
  }
  
  if (index === -1) {
    // Add to favorites
    favorites.push(artworkId);
    heartIcon.className = 'fas fa-heart'; // Filled heart
    heartBtn.classList.add('active');
    
    // Force visibility
    heartBtn.style.opacity = '1';
    heartBtn.style.transform = 'scale(1)';
    
  } else {
    // Remove from favorites
    favorites.splice(index, 1);
    heartIcon.className = 'far fa-heart'; // Empty heart
    heartBtn.classList.remove('active');
    
  }
  
  // Save to localStorage
  localStorage.setItem('artworkFavorites', JSON.stringify(favorites));
  
  // Update favorites count if exists
  updateFavoritesCount();
}

function updateFavoritesCount() {
  const countElement = document.querySelector('.favorites-count');
  if (countElement) {
    countElement.textContent = favorites.length;
    if (favorites.length > 0) {
      countElement.style.display = 'inline-block';
    } else {
      countElement.style.display = 'none';
    }
  }
}

function loadFavoriteStates() {
  // Set initial heart states based on saved favorites
  favorites.forEach(artworkId => {
    const heartBtn = document.querySelector(`[onclick*="toggleFavorite('${artworkId}')"]`);
    if (heartBtn) {
      const heartIcon = heartBtn.querySelector('i');
      if (heartIcon) {
        heartIcon.className = 'fas fa-heart';
        heartBtn.classList.add('active');
      }
    }
  });
}

// Auto-load favorite states when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for gallery to render
  setTimeout(loadFavoriteStates, 500);
  updateFavoritesCount();
});

// Also load after gallery updates (for infinite scroll)
document.addEventListener('galleryUpdated', () => {
  loadFavoriteStates();
});

// Make functions globally available
window.toggleFavorite = toggleFavorite;
window.loadFavoriteStates = loadFavoriteStates;
window.updateFavoritesCount = updateFavoritesCount;
