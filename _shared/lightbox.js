/* lightbox.js — Simple image modal with keyboard navigation
   Click any artwork thumbnail to enlarge in modal
   Keyboard: ← → to navigate, ESC to close
   Features: Prev/Next arrows, keyboard nav, close button, click-outside to close */

const Lightbox = {
  currentImageIndex: 0,
  images: [],
  isOpen: false,

  init() {
    // Collect all zoomable images: thumbnails + artwork heroes
    const thumbLinks = Array.from(document.querySelectorAll('.thumb__link'));
    const heroImages = Array.from(document.querySelectorAll('[data-zoomable], .artwork-hero img'));

    // Create virtual links for hero images
    const heroLinks = heroImages.map(img => {
      const link = document.createElement('a');
      link.href = img.getAttribute('href') || `?id=${img.getAttribute('data-work-id') || 'unknown'}`;

      // Create wrapper with img
      const wrapper = document.createElement('div');
      wrapper.style.display = 'none';
      const imgClone = document.createElement('img');
      imgClone.src = img.src;
      imgClone.alt = img.alt || 'Artwork';
      wrapper.appendChild(imgClone);
      link.appendChild(wrapper);

      return { link, img };
    });

    this.images = thumbLinks;
    this.heroImages = heroLinks;

    if (this.images.length === 0 && this.heroImages.length === 0) return;

    // Inject modal HTML
    this.createModal();

    // Attach click listeners to thumbnails
    this.images.forEach((link, index) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.open(index);
      });
    });

    // Attach click listeners to hero images
    this.heroImages.forEach(({ img }, index) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', (e) => {
        e.preventDefault();
        this.openHero(index);
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
      if (e.key === 'Escape') this.close();
    });
  },

  createModal() {
    const html = `
      <div id="lightbox-overlay" class="lightbox-overlay">
        <div class="lightbox-container">
          <button class="lightbox-close" aria-label="Close image viewer">×</button>
          <button class="lightbox-prev" aria-label="Previous image">‹</button>
          <div class="lightbox-image-wrapper">
            <img id="lightbox-image" src="" alt="" />
          </div>
          <button class="lightbox-next" aria-label="Next image">›</button>
          <div class="lightbox-info">
            <span id="lightbox-counter">1 / 1</span>
            <button id="lightbox-copy-id" class="lightbox-copy-btn" aria-label="Copy artwork ID">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </button>
            <a id="lightbox-link" href="" target="_blank" rel="noopener" class="lightbox-open-btn">Open</a>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    // Attach event listeners
    document.getElementById('lightbox-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'lightbox-overlay') this.close();
    });
    document.querySelector('.lightbox-close').addEventListener('click', () => this.close());
    document.querySelector('.lightbox-prev').addEventListener('click', () => this.prev());
    document.querySelector('.lightbox-next').addEventListener('click', () => this.next());
    document.getElementById('lightbox-copy-id').addEventListener('click', (e) => {
      e.preventDefault();
      this.copyWorkId();
    });
  },

  open(index) {
    this.currentImageIndex = index;
    this.isOpen = true;

    const link = this.images[index];
    const img = link.querySelector('img');
    const href = link.getAttribute('href');

    document.getElementById('lightbox-image').src = img.src;
    document.getElementById('lightbox-image').alt = img.alt;
    document.getElementById('lightbox-link').href = href;
    document.getElementById('lightbox-counter').textContent = `${index + 1} / ${this.images.length}`;

    document.getElementById('lightbox-overlay').classList.add('lightbox-open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    this.isOpen = false;
    document.getElementById('lightbox-overlay').classList.remove('lightbox-open');
    document.body.style.overflow = '';
  },

  prev() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.open(this.currentImageIndex);
  },

  next() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.open(this.currentImageIndex);
  },

  copyWorkId() {
    const link = this.images[this.currentImageIndex];
    const href = link.getAttribute('href');
    const match = href.match(/[?&]id=([^&]+)/);
    const workId = match ? match[1] : '';

    if (workId) {
      navigator.clipboard.writeText(workId).then(() => {
        // Show toast if available
        if (typeof Toast !== 'undefined') {
          Toast.success(`Copied: ${workId}`);
        }
      }).catch(() => {
        if (typeof Toast !== 'undefined') {
          Toast.error('Failed to copy');
        }
      });
    }
  },

  openHero(index) {
    this.currentImageIndex = index;
    this.isOpen = true;
    this.isHeroMode = true;

    const { link, img } = this.heroImages[index];
    const href = link.getAttribute('href');

    document.getElementById('lightbox-image').src = img.src;
    document.getElementById('lightbox-image').alt = img.alt;
    document.getElementById('lightbox-link').href = href;
    document.getElementById('lightbox-counter').textContent = `${index + 1} / ${this.heroImages.length}`;

    document.getElementById('lightbox-overlay').classList.add('lightbox-open');
    document.body.style.overflow = 'hidden';
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Lightbox.init());
} else {
  Lightbox.init();
}
