/**
 * Art Share Functionality
 * Handles social media sharing for individual artworks
 */

// Share artwork function
window.shareArtwork = async function(artworkId, artworkTitle, artworkCategory) {
  const artworkUrl = `${window.location.origin}/art.html?artwork=${artworkId}`;
  const artworkImageUrl = `${window.location.origin}/index/artworks/${artworkId}`;
  
  const shareData = {
    title: `${artworkTitle} - JFSN Art Archive`,
    text: `Check out "${artworkTitle}" by Jeffrey F. S. Neumann - ${artworkCategory || 'Art'}`,
    url: artworkUrl
  };
  
  // Check if Web Share API is supported
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([10, 5, 10]);
      }
      
      // Success toast
      showToast('✨ Shared successfully!', 'success');
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
        fallbackShare(artworkId, artworkTitle, artworkUrl);
      }
    }
  } else {
    // Fallback to custom share modal
    fallbackShare(artworkId, artworkTitle, artworkUrl);
  }
};

// Fallback share modal with social links
function fallbackShare(artworkId, artworkTitle, artworkUrl) {
  // Create share modal
  const modal = document.createElement('div');
  modal.id = 'shareModal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  `;
  
  const encodedTitle = encodeURIComponent(artworkTitle);
  const encodedUrl = encodeURIComponent(artworkUrl);
  
  modal.innerHTML = `
    <div style="
      background: white;
      border-radius: 24px;
      padding: 2rem;
      max-width: 500px;
      width: calc(100% - 4rem);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin: 0;">Share Artwork</h3>
        <button onclick="document.getElementById('shareModal').remove()" style="
          background: rgba(239, 68, 68, 0.1);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          cursor: pointer;
          font-size: 1.2rem;
          color: #ef4444;
          transition: all 0.2s ease;
        " onmouseover="this.style.transform='scale(1.1) rotate(90deg)'" onmouseout="this.style.transform='scale(1)'">✕</button>
      </div>
      
      <p style="color: #64748b; margin-bottom: 1.5rem; font-size: 0.95rem;">"${artworkTitle}"</p>
      
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
        <a href="https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}" target="_blank" class="share-btn" style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: #1DA1F2;
          color: white;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(29, 161, 242, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
          Twitter
        </a>
        
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" class="share-btn" style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: #1877F2;
          color: white;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(24, 119, 242, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Facebook
        </a>
        
        <a href="https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}" target="_blank" class="share-btn" style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: #E60023;
          color: white;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(230, 0, 35, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0a12 12 0 00-4.37 23.17c-.18-1.62-.03-3.57.41-5.33l3.18-13.48s-.81-1.62-.81-4.02c0-3.77 2.18-6.58 4.9-6.58 2.31 0 3.43 1.74 3.43 3.82 0 2.33-1.48 5.81-2.24 9.03-.64 2.7 1.35 4.9 4.01 4.9 4.81 0 8.03-6.18 8.03-13.49 0-5.57-3.75-9.74-10.55-9.74-7.69 0-12.43 5.74-12.43 12.12 0 2.2.65 3.75 1.67 4.95.47.56.54 1.04.4 1.65-.09.45-.3 1.2-.39 1.54-.12.44-.49.6-.9.44-3.37-1.38-4.94-5.1-4.94-9.27 0-6.89 5.8-15.21 17.24-15.21 9.16 0 15.2 6.62 15.2 13.74 0 9.45-5.26 16.56-13 16.56-2.61 0-5.07-1.41-5.91-3.02l-1.57 6.18c-.57 2.16-1.69 4.35-2.77 6.07A12 12 0 0012 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/></svg>
          Pinterest
        </a>
        
        <button onclick="copyToClipboard('${artworkUrl.replace(/'/g, "\\'")}', 'Artwork link copied!')" class="share-btn" style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(99, 102, 241, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          Copy Link
        </button>
      </div>
      
      <div style="text-align: center; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
        <p style="font-size: 0.8rem; color: #94a3b8; margin: 0;">Share this artwork with the world!</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close on backdrop click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Copy to clipboard helper
window.copyToClipboard = async function(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(message || '✅ Copied to clipboard!', 'success');
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  } catch (error) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    showToast(message || '✅ Copied!', 'success');
  }
};

// Toast notification system
window.showToast = function(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'jfsn-toast';
  
  const colors = {
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    info: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  };
  
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: ${colors[type] || colors.info};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    z-index: 10001;
    font-weight: 600;
    font-size: 0.95rem;
    transform: translateX(400px);
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    max-width: 300px;
  `;
  
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Slide in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 10);
  
  // Slide out and remove after 3s
  setTimeout(() => {
    toast.style.transform = 'translateX(400px)';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
};

// Add share button to Fancybox toolbar
document.addEventListener('DOMContentLoaded', function() {
  // Wait for Fancybox to initialize
  setTimeout(() => {
    if (window.Fancybox) {
      // Add custom share button to Fancybox
      Fancybox.defaults = Fancybox.defaults || {};
      Fancybox.defaults.on = Fancybox.defaults.on || {};
      
      const originalReady = Fancybox.defaults.on.ready;
      Fancybox.defaults.on.ready = function(fancybox) {
        if (originalReady) originalReady.call(this, fancybox);
        
        // Add share button to toolbar
        const toolbar = document.querySelector('.fancybox__toolbar');
        if (toolbar) {
          const shareBtn = document.createElement('button');
          shareBtn.className = 'fancybox__button';
          shareBtn.title = 'Share artwork';
          shareBtn.innerHTML = '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';
          shareBtn.onclick = () => {
            const currentSlide = fancybox.getSlide();
            if (currentSlide) {
              const img = currentSlide.$trigger;
              const title = img?.alt || 'Artwork';
              const file = img?.src?.split('/').pop() || '';
              shareArtwork(file, title, '');
            }
          };
          toolbar.appendChild(shareBtn);
        }
      };
    }
  }, 1000);
});


