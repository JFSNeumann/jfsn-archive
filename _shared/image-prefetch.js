/* image-prefetch.js — Prefetch next/prev artwork images for instant navigation */

const ImagePrefetch = {
  prefetchedImages: new Map(),

  init() {
    this.prefetchAdjacent();
  },

  prefetchAdjacent() {
    // Get current work ID
    const params = new URLSearchParams(window.location.search);
    const currentId = params.get('id');

    if (!currentId) return;

    // Try to find next/prev links in DOM
    const nextLink = document.querySelector('a[rel="next"]');
    const prevLink = document.querySelector('a[rel="prev"]');

    if (nextLink) {
      const nextId = new URLSearchParams(nextLink.search).get('id');
      this.prefetch(nextId);
    }

    if (prevLink) {
      const prevId = new URLSearchParams(prevLink.search).get('id');
      this.prefetch(prevId);
    }

    // Also prefetch from global catalog if available
    if (window.allWorks && currentId) {
      const currentIndex = window.allWorks.findIndex(w => w.id === currentId);
      if (currentIndex !== -1) {
        if (currentIndex < window.allWorks.length - 1) {
          const nextWork = window.allWorks[currentIndex + 1];
          this.prefetch(nextWork.id);
        }
        if (currentIndex > 0) {
          const prevWork = window.allWorks[currentIndex - 1];
          this.prefetch(prevWork.id);
        }
      }
    }
  },

  prefetch(workId) {
    if (!workId || this.prefetchedImages.has(workId)) return;

    // Construct image URL (adjust path as needed)
    const heroUrl = `/artworks/${workId}-hero.avif`;
    const thumbUrl = `/artworks/thumbs/${workId}.jpg`;

    // Preload hero image
    const heroImg = new Image();
    heroImg.src = heroUrl;
    heroImg.onerror = () => {
      // Fallback to regular image
      const img = new Image();
      img.src = thumbUrl;
    };

    this.prefetchedImages.set(workId, true);
  },

  // Utility: preload specific image
  preloadImage(src) {
    if (this.prefetchedImages.has(src)) return;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.prefetchedImages.set(src, true);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ImagePrefetch.init());
} else {
  ImagePrefetch.init();
}
