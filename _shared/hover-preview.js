/* hover-preview.js — Metadata tooltip on artwork hover */

const HoverPreview = {
  preview: null,
  currentWork: null,
  hideTimeout: null,

  init() {
    this.createPreview();
    this.attachListeners();
  },

  createPreview() {
    const html = `
      <div id="hover-preview-tooltip" class="hover-preview" aria-hidden="true" role="tooltip">
        <div class="hover-preview-content">
          <div class="hover-preview-title"></div>
          <div class="hover-preview-meta">
            <span class="hover-preview-medium"></span>
            <span class="hover-preview-year"></span>
          </div>
          <div class="hover-preview-id"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    this.preview = document.getElementById('hover-preview-tooltip');
  },

  attachListeners() {
    // Attach to all thumbnails
    document.addEventListener('mouseover', (e) => {
      const thumb = e.target.closest('.thumb__link, [data-work-id]');
      if (thumb) {
        this.show(thumb, e);
      }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
      const thumb = e.target.closest('.thumb__link, [data-work-id]');
      if (thumb) {
        this.scheduleHide();
      }
    }, { passive: true });

    // Hide when preview is left
    this.preview.addEventListener('mouseenter', () => {
      clearTimeout(this.hideTimeout);
    });

    this.preview.addEventListener('mouseleave', () => {
      this.hide();
    });
  },

  show(element, event) {
    clearTimeout(this.hideTimeout);

    // Get work data
    const workId = element.getAttribute('data-work-id') || this.getWorkIdFromElement(element);
    if (!workId) return;

    // Fetch work data (from catalog or data attribute)
    const workData = this.getWorkData(workId);
    if (!workData) return;

    // Update preview content. The title is already visible beneath every
    // thumbnail, so the card never repeats it — it shows medium/year when
    // known, otherwise only the ID. Empty rows collapse entirely so no
    // stray separators render.
    const titleEl = this.preview.querySelector('.hover-preview-title');
    titleEl.textContent = '';
    titleEl.style.display = 'none';
    const medium = workData.work_type || '';
    const year = workData.year_display || workData.year || '';
    this.preview.querySelector('.hover-preview-medium').textContent = medium;
    this.preview.querySelector('.hover-preview-year').textContent = year;
    this.preview.querySelector('.hover-preview-meta').style.display = (medium || year) ? '' : 'none';
    this.preview.querySelector('.hover-preview-content').classList.toggle('has-meta', !!(medium || year));
    this.preview.querySelector('.hover-preview-id').textContent = `ID: ${workId}`;

    // Position near cursor
    this.positionPreview(event);

    // Show preview
    this.preview.classList.add('hover-preview-show');
  },

  positionPreview(event) {
    const x = event.clientX;
    const y = event.clientY;

    // Position 12px offset from cursor
    this.preview.style.left = (x + 12) + 'px';
    this.preview.style.top = (y + 12) + 'px';

    // Adjust if preview goes off-screen
    requestAnimationFrame(() => {
      const rect = this.preview.getBoundingClientRect();

      if (rect.right > window.innerWidth) {
        this.preview.style.left = (x - rect.width - 12) + 'px';
      }

      if (rect.bottom > window.innerHeight) {
        this.preview.style.top = (y - rect.height - 12) + 'px';
      }
    });
  },

  scheduleHide() {
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, 200); // 200ms grace period for moving between elements
  },

  hide() {
    clearTimeout(this.hideTimeout);
    this.preview.classList.remove('hover-preview-show');
  },

  getWorkIdFromElement(element) {
    // Try to extract work ID from href (e.g., ?id=art0001)
    const href = element.getAttribute('href');
    if (href) {
      const match = href.match(/[?&]id=([^&]+)/);
      if (match) return match[1];
    }
    // Try to get from img src
    const img = element.querySelector('img');
    if (img) {
      const src = img.getAttribute('src');
      const match = src.match(/(\w+)\./);
      if (match) return match[1];
    }
    return null;
  },

  getWorkData(workId) {
    // Try to find in window.allWorks (if available from archive.html)
    if (window.allWorks) {
      return window.allWorks.find(w => w.id === workId);
    }

    // Try to find in window.CATALOG (if available)
    if (window.CATALOG) {
      return window.CATALOG.find(w => w.id === workId);
    }

    // Fallback: return minimal data
    return { id: workId };
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => HoverPreview.init());
} else {
  HoverPreview.init();
}
