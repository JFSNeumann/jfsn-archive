/**
 * Art Gallery View Mode Toggle JavaScript
 * Handles grid/list view switching
 */

// View Mode Toggle
let currentViewMode = 'grid'; // Default to grid view

function initializeViewModeToggle() {
  const viewModeToggle = document.getElementById('viewModeToggle');
  const gallery = document.getElementById('gallery');
  
  if (!viewModeToggle || !gallery) return;
  
  viewModeToggle.addEventListener('click', () => {
    if (currentViewMode === 'grid') {
      // Switch to list view
      currentViewMode = 'list';
      gallery.classList.add('list-view');
      viewModeToggle.innerHTML = '<i class="fas fa-list"></i><span>List</span>';
      localStorage.setItem('artGalleryViewMode', 'list');
    } else {
      // Switch to grid view
      currentViewMode = 'grid';
      gallery.classList.remove('list-view');
      viewModeToggle.innerHTML = '<i class="fas fa-th"></i><span>Grid</span>';
      localStorage.setItem('artGalleryViewMode', 'grid');
    }
  });
  
  // Load saved view mode preference
  const savedViewMode = localStorage.getItem('artGalleryViewMode');
  if (savedViewMode === 'list') {
    currentViewMode = 'list';
    gallery.classList.add('list-view');
    viewModeToggle.innerHTML = '<i class="fas fa-list"></i><span>List</span>';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeViewModeToggle);
