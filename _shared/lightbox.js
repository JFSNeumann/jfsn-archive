/* lightbox.js — Simple image modal with keyboard navigation
   Click any artwork thumbnail to enlarge in modal
   Keyboard: ← → to navigate, ESC to close
   Features: Prev/Next arrows, keyboard nav, close button, click-outside to close */

const Lightbox = {
  currentImageIndex: 0,
  images: [],
  isOpen: false,

  init() {
    this.images = Array.from(document.querySelectorAll('.thumb__link'));
    if (this.images.length === 0) return;

    // Inject modal HTML
    this.createModal();

    // Attach click listeners
    this.images.forEach((link, index) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.open(index);
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
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Lightbox.init());
} else {
  Lightbox.init();
}
