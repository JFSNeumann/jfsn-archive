/**
 * Art Gallery Quick View Modal JavaScript
 * Handles quick view modal functionality
 */

// Quick view functionality
function quickView(artworkId) {
  const artwork = allArtworks.find(art => art.file === artworkId);
  if (!artwork) return;
  
  const modal = document.createElement('div');
  modal.className = 'quick-view-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 2rem;
    animation: fadeIn 0.3s ease-out;
  `;
  
  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(30px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `;
  if (!document.getElementById('quickview-animations')) {
    style.id = 'quickview-animations';
    document.head.appendChild(style);
  }
  
  modal.innerHTML = `
    <div class="quick-view-content" style="
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fb 100%);
      border-radius: 24px;
      max-width: 900px;
      max-height: 92vh;
      overflow: auto;
      position: relative;
      box-shadow: 
        0 30px 80px rgba(0, 0, 0, 0.35),
        0 10px 30px rgba(99, 102, 241, 0.2),
        0 0 0 1px rgba(255,255,255,0.1);
      animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    ">
      <button class="close-btn" style="
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(239, 68, 68, 0.95);
        color: white;
        border: none;
        border-radius: 50%;
        width: 44px;
        height: 44px;
        font-size: 1.25rem;
        font-weight: 700;
        cursor: pointer;
        z-index: 10;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        transition: all 0.2s ease;
      " onmouseover="this.style.transform='scale(1.1) rotate(90deg)'" onmouseout="this.style.transform='scale(1)'">&times;</button>
      <img src="index/artworks/${artwork.file}" alt="${artwork.title}" style="
        width: 100%;
        height: auto;
        max-height: 60vh;
        object-fit: contain;
      ">
      <div class="quick-view-info" style="padding: 2.5rem;">
        <div style="display: inline-block; background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1)); padding: 0.5rem 1rem; border-radius: 20px; margin-bottom: 1rem; font-size: 0.875rem; font-weight: 600; color: #6366f1;">
          ${artwork.category || 'Artwork'}
        </div>
        <h2 style="margin: 0 0 1.25rem 0; color: #1e293b; font-size: 2rem; font-weight: 800; line-height: 1.2;">${artwork.title}</h2>
        ${artwork.extended_description ? `
        <div style="
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.06) 0%, rgba(139, 92, 246, 0.06) 100%);
          border-left: 4px solid #6366f1;
          padding: 1.25rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.25rem;
        ">
          <p style="
            font-size: 1.15rem;
            line-height: 1.85;
            color: #374151;
            margin: 0;
            font-style: italic;
            font-weight: 500;
          ">"${artwork.extended_description}"</p>
        </div>
        ` : ''}
        <p style="margin: 0 0 2rem 0; color: #475569; line-height: 1.7; font-size: 1.05rem;">${artwork.description || 'A powerful visual narrative exploring form, color, and meaning.'}</p>
        <div class="quick-view-actions" style="display: flex; gap: 0.875rem; flex-wrap: wrap;">
          <button onclick="openInFancybox('${artwork.file}')" style="
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
          ">View Full Size</button>
          <button onclick="openCollectorInquiry('${artwork.file}', '${artwork.title}', '${artwork.category || 'Art'}')" style="
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
            color: #059669;
            border: 2px solid #10b981;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          ">💎 Inquire About This Piece</button>
          <button onclick="toggleFavorite('${artwork.file}')" style="
            background: #f8f9fa;
            color: #6366f1;
            border: 2px solid #6366f1;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
          ">Add to Favorites</button>
        </div>
        
        <!-- Share This Artwork Section -->
        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb;">
          <h4 style="font-size: 0.875rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">
            Share This Artwork
          </h4>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button onclick="shareToFacebook('${artwork.file}', '${artwork.title}')" title="Share on Facebook" style="
              background: #1877f2;
              color: white;
              border: none;
              width: 42px;
              height: 42px;
              border-radius: 50%;
              cursor: pointer;
              font-size: 1.2rem;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
            " onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 4px 12px rgba(24, 119, 242, 0.4)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'">📘</button>
            
            <button onclick="shareToTwitter('${artwork.file}', '${artwork.title}')" title="Share on Twitter/X" style="
              background: #1da1f2;
              color: white;
              border: none;
              width: 42px;
              height: 42px;
              border-radius: 50%;
              cursor: pointer;
              font-size: 1.2rem;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
            " onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 4px 12px rgba(29, 161, 242, 0.4)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'">🐦</button>
            
            <button onclick="shareToPinterest('${artwork.file}', '${artwork.title}')" title="Share on Pinterest" style="
              background: #e60023;
              color: white;
              border: none;
              width: 42px;
              height: 42px;
              border-radius: 50%;
              cursor: pointer;
              font-size: 1.2rem;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
            " onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 4px 12px rgba(230, 0, 35, 0.4)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'">📌</button>
            
            <button onclick="shareToEmail('${artwork.file}', '${artwork.title}')" title="Share via Email" style="
              background: #6b7280;
              color: white;
              border: none;
              width: 42px;
              height: 42px;
              border-radius: 50%;
              cursor: pointer;
              font-size: 1.2rem;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
            " onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 4px 12px rgba(107, 114, 128, 0.4)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'">✉️</button>
            
            <button onclick="copyShareLink('${artwork.file}', '${artwork.title}')" title="Copy Link" style="
              background: #10b981;
              color: white;
              border: none;
              width: 42px;
              height: 42px;
              border-radius: 50%;
              cursor: pointer;
              font-size: 1.2rem;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
            " onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.4)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'">🔗</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close modal functionality
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('close-btn')) {
      document.body.removeChild(modal);
    }
  });
  
  // Open in Fancybox function
  window.openInFancybox = function(file) {
    document.body.removeChild(modal);
    const fancyboxLink = document.querySelector(`[href="index/artworks/${file}"]`);
    if (fancyboxLink) {
      fancyboxLink.click();
    }
  };
}

// Make function globally available
window.quickView = quickView;

// Share Functions
window.shareToFacebook = function(file, title) {
  const url = `${window.location.origin}/art.html?artwork=${file}`;
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(shareUrl, 'facebook-share-dialog', 'width=626,height=436');
};

window.shareToTwitter = function(file, title) {
  const url = `${window.location.origin}/art.html?artwork=${file}`;
  const text = `Check out "${title}" by Jeff Neumann`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(shareUrl, 'twitter-share-dialog', 'width=626,height=436');
};

window.shareToPinterest = function(file, title) {
  const url = `${window.location.origin}/art.html?artwork=${file}`;
  const imageUrl = `${window.location.origin}/index/artworks/${file}`;
  const description = `${title} by Jeff Neumann`;
  const shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(description)}`;
  window.open(shareUrl, 'pinterest-share-dialog', 'width=750,height=550');
};

window.shareToEmail = function(file, title) {
  const url = `${window.location.origin}/art.html?artwork=${file}`;
  const subject = `Check out "${title}" by Jeff Neumann`;
  const body = `I thought you might enjoy this artwork:\n\n"${title}" by Jeff Neumann\n\n${url}\n\n50 years of visual rebellion. View the complete archive at ${window.location.origin}`;
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

window.copyShareLink = function(file, title) {
  const url = `${window.location.origin}/art.html?artwork=${file}`;
  
  // Try modern clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showCopyNotification('Link copied to clipboard!');
    }).catch(() => {
      // Fallback to old method
      copyToClipboardFallback(url);
    });
  } else {
    copyToClipboardFallback(url);
  }
};

function copyToClipboardFallback(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showCopyNotification('Link copied to clipboard!');
  } catch (err) {
    showCopyNotification('Failed to copy link', true);
  }
  document.body.removeChild(textarea);
}

function showCopyNotification(message, isError = false) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: ${isError ? '#ef4444' : '#10b981'};
    color: white;
    padding: 0.875rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10002;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    animation: slideUp 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(-50%) translateY(20px)';
    notification.style.transition = 'all 0.3s ease';
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 2000);
}

// Collector Inquiry Modal - Quiet, Classy Pipeline
function openCollectorInquiry(artworkFile, artworkTitle, artworkCategory) {
  // Close any existing modals first
  const existingModals = document.querySelectorAll('.quick-view-modal, .collector-inquiry-modal');
  existingModals.forEach(m => m.remove());
  
  const modal = document.createElement('div');
  modal.className = 'collector-inquiry-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    padding: 2rem;
    animation: fadeIn 0.3s ease-out;
  `;
  
  modal.innerHTML = `
    <div class="collector-inquiry-content" style="
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fb 100%);
      border-radius: 24px;
      max-width: 600px;
      width: 100%;
      max-height: 92vh;
      overflow: auto;
      position: relative;
      box-shadow: 
        0 30px 80px rgba(0, 0, 0, 0.35),
        0 10px 30px rgba(16, 185, 129, 0.2),
        0 0 0 1px rgba(255,255,255,0.1);
      animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    ">
      <button class="close-btn" style="
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(239, 68, 68, 0.95);
        color: white;
        border: none;
        border-radius: 50%;
        width: 44px;
        height: 44px;
        font-size: 1.25rem;
        font-weight: 700;
        cursor: pointer;
        z-index: 10;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        transition: all 0.2s ease;
      " onmouseover="this.style.transform='scale(1.1) rotate(90deg)'" onmouseout="this.style.transform='scale(1)'">&times;</button>
      
      <div style="padding: 2.5rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.1)); padding: 0.75rem 1.5rem; border-radius: 50px; margin-bottom: 1rem; border: 2px solid #10b981;">
            <span style="font-size: 1.5rem;">💎</span>
            <span style="font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.875rem;">Private Viewing Request</span>
          </div>
          <h2 style="margin: 0 0 0.5rem 0; color: #1e293b; font-size: 1.75rem; font-weight: 800; line-height: 1.2;">Inquire About This Piece</h2>
          <p style="margin: 0; color: #64748b; font-size: 0.95rem;">Interested in purchasing, commissioning, or learning more about this artwork? Let's start a conversation.</p>
        </div>
        
        <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05)); border-left: 4px solid #6366f1; padding: 1rem 1.25rem; border-radius: 12px; margin-bottom: 2rem;">
          <p style="margin: 0; font-size: 0.95rem; color: #475569;"><strong>Artwork:</strong> ${artworkTitle || artworkFile}</p>
          <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #64748b;">${artworkCategory} • ID: ${artworkFile.replace('.avif', '')}</p>
        </div>
        
        <form id="collectorInquiryForm" class="premium-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div class="form-group">
            <div class="form-floating-enhanced">
              <input type="text" class="form-control" id="collectorName" name="name" required maxlength="100" autocomplete="name">
              <label for="collectorName">Your Name *</label>
              <div class="invalid-feedback">Please provide your name.</div>
            </div>
          </div>
          
          <div class="form-group">
            <div class="form-floating-enhanced">
              <input type="email" class="form-control" id="collectorEmail" name="email" required maxlength="255" autocomplete="email">
              <label for="collectorEmail">Email Address *</label>
              <div class="invalid-feedback">Please provide a valid email.</div>
            </div>
          </div>
          
          <div class="form-group">
            <div class="form-floating-enhanced">
              <input type="tel" class="form-control" id="collectorPhone" name="phone" maxlength="20" autocomplete="tel">
              <label for="collectorPhone">Phone (Optional)</label>
            </div>
          </div>
          
          <div class="form-group">
            <div class="form-floating-enhanced">
              <select class="form-control" id="collectorInterest" name="interest" required>
                <option value="">Select your interest...</option>
                <option value="purchase">💰 Purchase Original</option>
                <option value="print">🖼️ Purchase Print/Reproduction</option>
                <option value="commission">🎨 Commission Custom Work</option>
                <option value="licensing">📄 Licensing/Rights</option>
                <option value="exhibition">🏛️ Exhibition/Display</option>
                <option value="inquiry">❓ General Inquiry</option>
              </select>
              <label for="collectorInterest">Interest *</label>
              <div class="invalid-feedback">Please select your interest.</div>
            </div>
          </div>
          
          <div class="form-group">
            <div class="form-floating-enhanced">
              <textarea class="form-control" id="collectorMessage" name="message" required rows="5" maxlength="2000"></textarea>
              <label for="collectorMessage">Message *</label>
              <div class="invalid-feedback">Please provide a message.</div>
            </div>
          </div>
          
          <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
            <button type="submit" class="btn btn-primary btn-premium form-submit-button" style="flex: 1;">
              <span class="btn-text">💎 Send Inquiry</span>
            </button>
            <button type="button" class="btn btn-outline-secondary btn-premium cancel-btn" style="flex: 0 0 auto;">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Initialize floating labels for select dropdowns
  setTimeout(() => {
    const selectDropdowns = modal.querySelectorAll('.form-floating-enhanced select');
    selectDropdowns.forEach(select => {
      function updateSelectLabel() {
        if (select.value && select.value !== '') {
          select.classList.add('has-value');
          select.setAttribute('data-has-value', 'true');
        } else {
          select.classList.remove('has-value');
          select.removeAttribute('data-has-value');
        }
      }
      
      updateSelectLabel();
      select.addEventListener('change', updateSelectLabel);
      select.addEventListener('focus', updateSelectLabel);
      select.addEventListener('blur', updateSelectLabel);
    });
  }, 100);

  // Handle form submission
  const form = modal.querySelector('#collectorInquiryForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      interest: formData.get('interest'),
      message: formData.get('message'),
      artwork: artworkTitle || artworkFile,
      artworkId: artworkFile.replace('.avif', ''),
      category: artworkCategory
    };
    
    // Build mailto link with pre-filled data
    const subject = encodeURIComponent(`Private Viewing Request: ${data.artwork}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\n` +
      `Email: ${data.email}\n` +
      `Phone: ${data.phone || 'Not provided'}\n` +
      `Interest: ${data.interest}\n` +
      `Artwork: ${data.artwork} (${data.artworkId})\n` +
      `Category: ${data.category}\n\n` +
      `Message:\n${data.message}`
    );
    
    // Open mailto link
    window.location.href = `mailto:jeff@jfsn.com?subject=${subject}&body=${body}`;
    
    // Show success message
    modal.querySelector('.collector-inquiry-content').innerHTML = `
      <div style="padding: 4rem 2rem; text-align: center;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
        <h2 style="margin: 0 0 1rem 0; color: #059669; font-size: 2rem; font-weight: 800;">Inquiry Sent!</h2>
        <p style="margin: 0 0 2rem 0; color: #64748b; font-size: 1.05rem; max-width: 400px; margin-left: auto; margin-right: auto;">
          Your email client has opened with your inquiry pre-filled. Simply review and send to complete your request.
        </p>
        <button onclick="this.closest('.collector-inquiry-modal').remove()" style="
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        ">Close</button>
      </div>
    `;
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      modal.remove();
    }, 5000);
  });
  
  // Close handlers
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  modal.querySelector('.close-btn').addEventListener('click', () => {
    modal.remove();
  });
  
  modal.querySelector('.cancel-btn').addEventListener('click', () => {
    modal.remove();
  });
}

// Make collector inquiry globally available
window.openCollectorInquiry = openCollectorInquiry;
