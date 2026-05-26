/**
 * Replace Random Images with New Category
 * 
 * Replaces 24 random images from the initial gallery display
 * with 24 random images from the "New" category.
 */

(function() {
  'use strict';

  let hasReplaced = false; // Flag to ensure replacement only happens once

  // Fisher-Yates shuffle algorithm
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Function to replace artworks
  function replaceWithNewCategory() {
    // Only run once
    if (hasReplaced) {
      return;
    }
    // Skip if a URL category filter is active
    const urlCategory = new URLSearchParams(window.location.search).get('category');
    if (urlCategory || window.pendingCategoryFilter || window.urlCategoryFilterActive) {
      return;
    }
    // Wait for ArtGallery to be initialized
    if (!window.ArtGallery || !window.ArtGallery.fullDataset) {
      setTimeout(replaceWithNewCategory, 100);
      return;
    }

    const allData = window.ArtGallery.fullDataset;
    if (!allData || allData.length === 0) {
      setTimeout(replaceWithNewCategory, 100);
      return;
    }

    // Get all artworks with category "New"
    const newCategoryArtworks = allData.filter(item => 
      item.category && item.category.toLowerCase() === 'new'
    );

    if (newCategoryArtworks.length === 0) {
      console.warn('⚠️ No artworks found with category "New"');
      return;
    }

    // Get current artworks (first 100)
    const currentArtworks = window.ArtGallery.state.allArtworks || [];
    
    if (currentArtworks.length === 0) {
      console.warn('⚠️ No current artworks to replace');
      return;
    }

    // Create a Set of file names already in the gallery to avoid duplicates
    const existingFiles = new Set(currentArtworks.map(art => art.file));

    // Filter out "New" category artworks that are already in the gallery
    const availableNewArtworks = newCategoryArtworks.filter(item => 
      !existingFiles.has(item.file)
    );

    if (availableNewArtworks.length === 0) {
      console.warn('⚠️ All "New" category artworks are already in the gallery');
      return;
    }

    // Get 24 random artworks from "New" category that aren't already displayed
    const shuffledNew = shuffleArray(availableNewArtworks);
    const selectedNewArtworks = shuffledNew.slice(0, Math.min(24, shuffledNew.length));

    // Get 24 random indices from current artworks
    const indicesToReplace = [];
    const shuffledIndices = shuffleArray(Array.from({ length: currentArtworks.length }, (_, i) => i));
    for (let i = 0; i < Math.min(selectedNewArtworks.length, currentArtworks.length, shuffledIndices.length); i++) {
      indicesToReplace.push(shuffledIndices[i]);
    }

    // Replace artworks at selected indices, ensuring no duplicates
    const replacedFiles = new Set();
    indicesToReplace.forEach((index, i) => {
      if (selectedNewArtworks[i] && !replacedFiles.has(selectedNewArtworks[i].file)) {
        // Add dimensions and metadata like the original loading does
        const newArtwork = {
          ...selectedNewArtworks[i],
          width: 800 + (index % 500),
          height: 600 + (index % 400),
          aspectRatio: 1.33,
          orientation: ['horizontal', 'vertical', 'square'][index % 3],
          sizeCategory: ['small', 'medium', 'large', 'extra-large'][index % 4],
          dimensionsProcessed: false
        };
        
        currentArtworks[index] = newArtwork;
        replacedFiles.add(selectedNewArtworks[i].file);
        console.log(`✅ Replaced artwork at index ${index} with ${selectedNewArtworks[i].file} from "New" category`);
      }
    });

    // Deduplicate the array by file name to ensure no repeats
    const seenFiles = new Set();
    const deduplicatedArtworks = [];
    
    for (const artwork of currentArtworks) {
      if (!seenFiles.has(artwork.file)) {
        seenFiles.add(artwork.file);
        deduplicatedArtworks.push(artwork);
      }
    }

    // Update the state with deduplicated array
    window.ArtGallery.state.allArtworks = deduplicatedArtworks;
    window.ArtGallery.state.filteredArtworks = [...deduplicatedArtworks];

    hasReplaced = true; // Mark as replaced to prevent multiple runs
    
    console.log(`✅ Replaced ${indicesToReplace.length} artworks with "New" category artworks`);
    console.log(`✅ Deduplicated: ${currentArtworks.length} → ${deduplicatedArtworks.length} artworks`);
  }

  // Run when ArtGallery data is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(replaceWithNewCategory, 500);
    });
  } else {
    setTimeout(replaceWithNewCategory, 500);
  }

  // Also listen for when artwork data is loaded
  window.addEventListener('categoriesPopulated', () => {
    setTimeout(replaceWithNewCategory, 200);
  });

})();

