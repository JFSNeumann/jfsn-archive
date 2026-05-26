/**
 * Web Share API Enhancement
 * Native sharing for mobile devices with fallback to social platforms
 * 
 * Features:
 * - Native Web Share API (mobile)
 * - Fallback to social platform URLs
 * - Share artwork, pages, and content
 * - Copy to clipboard fallback
 */

(function() {
  'use strict';

  // Check if Web Share API is supported
  const isWebShareSupported = () => {
    return navigator.share && typeof navigator.share === 'function';
  };

  /**
   * Share content using Web Share API or fallback
   * @param {Object} options - Share options
   * @param {string} options.title - Share title
   * @param {string} options.text - Share text/description
   * @param {string} options.url - URL to share
   * @param {string} options.image - Optional image URL
   * @param {Function} options.onSuccess - Success callback
   * @param {Function} options.onError - Error callback
   */
  async function shareContent(options = {}) {
    const {
      title = document.title,
      text = '',
      url = window.location.href,
      image = '',
      onSuccess = null,
      onError = null
    } = options;

    // Try Web Share API first (mobile)
    if (isWebShareSupported()) {
      try {
        const shareData = {
          title: title,
          text: text || title,
          url: url
        };

        // Add image if supported (some browsers support files)
        if (image && navigator.canShare && navigator.canShare({ files: [image] })) {
          shareData.files = [image];
        }

        await navigator.share(shareData);
        
        if (onSuccess) onSuccess('shared');
        return true;
      } catch (error) {
        // User cancelled or error occurred
        if (error.name !== 'AbortError' && onError) {
          onError(error);
        }
        return false;
      }
    }

    // Fallback: Copy to clipboard
    return fallbackShare(title, text, url, onSuccess, onError);
  }

  /**
   * Fallback share method (copy to clipboard)
   */
  async function fallbackShare(title, text, url, onSuccess, onError) {
    try {
      const shareText = text ? `${title}\n\n${text}\n\n${url}` : `${title}\n\n${url}`;
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
        
        // Show toast notification
        if (window.showToast) {
          window.showToast('Link copied to clipboard!', 'success', 3000);
        }
        
        if (onSuccess) onSuccess('copied');
        return true;
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
          document.execCommand('copy');
          document.body.removeChild(textarea);
          
          if (window.showToast) {
            window.showToast('Link copied to clipboard!', 'success', 3000);
          }
          
          if (onSuccess) onSuccess('copied');
          return true;
        } catch (err) {
          document.body.removeChild(textarea);
          throw err;
        }
      }
    } catch (error) {
      if (onError) onError(error);
      return false;
    }
  }

  /**
   * Share artwork with image
   * @param {string} artworkId - Artwork ID or filename
   * @param {Object} artworkData - Artwork metadata
   */
  async function shareArtwork(artworkId, artworkData = {}) {
    const artworkUrl = `${window.location.origin}/artworks/${artworkId}`;
    const title = artworkData.title || artworkData.name || 'Artwork by Jeffrey F. S. Neumann';
    const description = artworkData.description || 'Check out this amazing artwork!';
    const imageUrl = artworkData.image || artworkUrl;

    return shareContent({
      title: title,
      text: description,
      url: artworkUrl,
      image: imageUrl,
      onSuccess: () => {
        if (window.debugLog) window.debugLog('Artwork shared:', artworkId);
      },
      onError: (error) => {
        if (window.debugLog) window.debugLog('Share error:', error);
      }
    });
  }

  /**
   * Share current page
   */
  async function sharePage() {
    const metaDescription = document.querySelector('meta[name="description"]');
    const description = metaDescription ? metaDescription.content : '';
    
    return shareContent({
      title: document.title,
      text: description,
      url: window.location.href
    });
  }

  /**
   * Add share button to element
   * @param {HTMLElement} element - Element to add share button to
   * @param {Object} options - Share options
   */
  function addShareButton(element, options = {}) {
    if (!element) return;

    // Create share button
    const shareButton = document.createElement('button');
    shareButton.className = 'web-share-button';
    shareButton.setAttribute('aria-label', 'Share');
    shareButton.setAttribute('title', 'Share');
    
    // Add icon (use existing icon library or SVG)
    shareButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
      <span class="web-share-label">Share</span>
    `;

    // Add click handler
    shareButton.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      shareButton.disabled = true;
      await shareContent(options);
      shareButton.disabled = false;
    });

    element.appendChild(shareButton);
    return shareButton;
  }

  // Initialize share buttons on page load
  function initShareButtons() {
    // Add share button to artwork cards
    const artworkCards = document.querySelectorAll('.artwork-card, .jfsn-artcard, .gallery-item');
    artworkCards.forEach(card => {
      const artworkId = card.dataset.artworkId || card.dataset.id;
      const artworkTitle = card.querySelector('.artwork-title, .jfsn-artcard-title')?.textContent || '';
      const artworkImage = card.querySelector('img')?.src || '';
      
      if (artworkId) {
        addShareButton(card, {
          title: artworkTitle || 'Artwork',
          text: 'Check out this artwork!',
          url: `${window.location.origin}/artworks/${artworkId}`,
          image: artworkImage
        });
      }
    });

    // Add share button to lightbox (if exists)
    const lightboxContainer = document.querySelector('.lg-container, .lightbox-container');
    if (lightboxContainer) {
      // Wait for lightbox to open
      document.addEventListener('lightboxOpened', (e) => {
        const artworkData = e.detail;
        if (artworkData) {
          // Add share button to lightbox toolbar
          const toolbar = lightboxContainer.querySelector('.lg-toolbar, .lightbox-toolbar');
          if (toolbar) {
            const existingShareBtn = toolbar.querySelector('.web-share-button');
            if (!existingShareBtn) {
              addShareButton(toolbar, {
                title: artworkData.title || 'Artwork',
                text: artworkData.description || '',
                url: artworkData.url || window.location.href,
                image: artworkData.image || ''
              });
            }
          }
        }
      });
    }
  }

  // Export to global scope
  window.WebShareAPI = {
    share: shareContent,
    shareArtwork: shareArtwork,
    sharePage: sharePage,
    addShareButton: addShareButton,
    isSupported: isWebShareSupported
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShareButtons);
  } else {
    initShareButtons();
  }

  // Re-initialize on dynamic content load
  if (window.MutationObserver) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          // Check if new artwork cards were added
          const newCards = Array.from(mutation.addedNodes).filter(node => 
            node.nodeType === 1 && 
            (node.classList.contains('artwork-card') || 
             node.classList.contains('jfsn-artcard') ||
             node.classList.contains('gallery-item'))
          );
          if (newCards.length) {
            newCards.forEach(card => {
              const artworkId = card.dataset.artworkId || card.dataset.id;
              if (artworkId) {
                const artworkTitle = card.querySelector('.artwork-title')?.textContent || '';
                const artworkImage = card.querySelector('img')?.src || '';
                addShareButton(card, {
                  title: artworkTitle || 'Artwork',
                  text: 'Check out this artwork!',
                  url: `${window.location.origin}/artworks/${artworkId}`,
                  image: artworkImage
                });
              }
            });
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

})();
