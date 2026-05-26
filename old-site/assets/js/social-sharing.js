/**
 * SOCIAL SHARING & ENGAGEMENT
 * One-click sharing, social preview cards, QR codes
 */

(function() {
  'use strict';

  // Share artwork
  function shareArtwork(artworkFile, artworkData = null) {
    const artworkUrl = `${window.location.origin}/artworks/${artworkFile}`;
    const title = artworkData?.title || 'Artwork by Jeff Neumann';
    const description = artworkData?.description || 'Check out this amazing artwork!';
    const imageUrl = `${window.location.origin}/artworks/${artworkFile}`;

    // Try Web Share API first (mobile)
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: artworkUrl
      }).catch(err => {
        if (window.debugLog) window.debugLog('Share cancelled or failed:', err);
      });
      return;
    }

    // Fallback: show share menu
    showShareMenu(artworkUrl, title, description, imageUrl);
  }

  // Show share menu
  function showShareMenu(url, title, description, imageUrl) {
    const shareMenu = document.getElementById('shareMenu') || createShareMenu();
    shareMenu.dataset.url = url;
    shareMenu.dataset.title = title;
    shareMenu.dataset.description = description;
    shareMenu.dataset.imageUrl = imageUrl;
    shareMenu.classList.add('active');
  }

  // Create share menu
  function createShareMenu() {
    const menu = document.createElement('div');
    menu.id = 'shareMenu';
    menu.className = 'share-menu';
    menu.innerHTML = `
      <div class="share-menu-overlay"></div>
      <div class="share-menu-content">
        <div class="share-menu-header">
          <h3>Share Artwork</h3>
          <button class="share-menu-close" aria-label="Close">
            <i class="bx bx-x"></i>
          </button>
        </div>
        <div class="share-menu-options">
          <button class="share-option" data-platform="twitter">
            <i class="bx bxl-twitter"></i>
            <span>Twitter</span>
          </button>
          <button class="share-option" data-platform="facebook">
            <i class="bx bxl-facebook"></i>
            <span>Facebook</span>
          </button>
          <button class="share-option" data-platform="linkedin">
            <i class="bx bxl-linkedin"></i>
            <span>LinkedIn</span>
          </button>
          <button class="share-option" data-platform="pinterest">
            <i class="bx bxl-pinterest"></i>
            <span>Pinterest</span>
          </button>
          <button class="share-option" data-platform="copy">
            <i class="bx bx-link"></i>
            <span>Copy Link</span>
          </button>
          <button class="share-option" data-platform="qr">
            <i class="bx bx-qr-scan"></i>
            <span>QR Code</span>
          </button>
        </div>
      </div>
    `;

    // Close handlers
    const closeBtn = menu.querySelector('.share-menu-close');
    const overlay = menu.querySelector('.share-menu-overlay');
    
    closeBtn.addEventListener('click', () => menu.classList.remove('active'));
    overlay.addEventListener('click', () => menu.classList.remove('active'));

    // Share option handlers
    const options = menu.querySelectorAll('.share-option');
    options.forEach(option => {
      option.addEventListener('click', () => {
        const platform = option.dataset.platform;
        handleShare(platform, menu);
      });
    });

    document.body.appendChild(menu);
    return menu;
  }

  // Handle share by platform
  function handleShare(platform, menu) {
    const url = menu.dataset.url;
    const title = menu.dataset.title;
    const description = menu.dataset.description;
    const imageUrl = menu.dataset.imageUrl;

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(imageUrl)}&description=${encodedDescription}`;
        break;
      case 'copy':
        copyToClipboard(url);
        menu.classList.remove('active');
        showToast('Link copied to clipboard!');
        return;
      case 'qr':
        showQRCode(url);
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      menu.classList.remove('active');
    }
  }

  // Copy to clipboard
  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }

  // Show QR code
  function showQRCode(url) {
    // Use QR code API (you can use a library like qrcode.js)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    
    const qrModal = document.createElement('div');
    qrModal.className = 'qr-modal';
    qrModal.innerHTML = `
      <div class="qr-modal-overlay"></div>
      <div class="qr-modal-content">
        <button class="qr-modal-close" aria-label="Close">
          <i class="bx bx-x"></i>
        </button>
        <h3>Scan QR Code</h3>
        <img src="${qrUrl}" alt="QR Code" />
        <p>Scan to view artwork</p>
      </div>
    `;

    const closeBtn = qrModal.querySelector('.qr-modal-close');
    const overlay = qrModal.querySelector('.qr-modal-overlay');
    
    closeBtn.addEventListener('click', () => qrModal.remove());
    overlay.addEventListener('click', () => qrModal.remove());

    document.body.appendChild(qrModal);
  }

  // Show toast notification
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Expose to global scope
  window.shareArtwork = shareArtwork;
  window.showShareMenu = showShareMenu;
})();

