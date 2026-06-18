/* keyboard-shortcuts.js — Keyboard shortcuts guide and navigation */

const KeyboardShortcuts = {
  modal: null,
  isOpen: false,
  previousActiveElement: null,

  init() {
    this.createModal();
    this.setupListeners();
    // Ensure modal is closed on init
    this.isOpen = false;
    this.modal.classList.remove('open');
    this.modal.style.display = 'none';
  },

  createModal() {
    const html = `
      <div id="keyboard-shortcuts-overlay" class="keyboard-shortcuts-overlay" role="dialog" aria-labelledby="shortcuts-title" aria-modal="true" tabindex="-1">
        <div class="keyboard-shortcuts-modal">
          <button class="shortcuts-close" aria-label="Close shortcuts guide">×</button>
          <h2 id="shortcuts-title">Keyboard Shortcuts</h2>

          <div class="shortcuts-grid">
            <div class="shortcuts-section">
              <h3>Navigation</h3>
              <div class="shortcut-item">
                <kbd>?</kbd>
                <span>Show this guide</span>
              </div>
              <div class="shortcut-item">
                <kbd>⌘ K</kbd> / <kbd>Ctrl K</kbd>
                <span>Search (when available)</span>
              </div>
              <div class="shortcut-item">
                <kbd>⌘ Shift D</kbd> / <kbd>Ctrl Shift D</kbd>
                <span>Design system reference</span>
              </div>
              <div class="shortcut-item">
                <kbd>←</kbd> / <kbd>→</kbd>
                <span>Navigate decades (1970s-2020s)</span>
              </div>
              <div class="shortcut-item">
                <kbd>Esc</kbd>
                <span>Close modals & menus</span>
              </div>
            </div>

            <div class="shortcuts-section">
              <h3>Lightbox</h3>
              <div class="shortcut-item">
                <kbd>Click thumbnail</kbd>
                <span>Open image modal</span>
              </div>
              <div class="shortcut-item">
                <kbd>←</kbd> / <kbd>→</kbd>
                <span>Previous / next image</span>
              </div>
              <div class="shortcut-item">
                <kbd>Esc</kbd>
                <span>Close lightbox</span>
              </div>
              <div class="shortcut-item">
                <kbd>Click 📋</kbd>
                <span>Copy work ID to clipboard</span>
              </div>
            </div>

            <div class="shortcuts-section">
              <h3>Interactions</h3>
              <div class="shortcut-item">
                <kbd>Scroll</kbd>
                <span>Elements fade in (scroll reveals)</span>
              </div>
              <div class="shortcut-item">
                <kbd>Swipe</kbd>
                <span>Navigate carousels on mobile</span>
              </div>
              <div class="shortcut-item">
                <kbd>Long Press</kbd>
                <span>Context menu on touch devices</span>
              </div>
              <div class="shortcut-item">
                <kbd>Drag & Drop</kbd>
                <span>Reorder items where available</span>
              </div>
            </div>

            <div class="shortcuts-section">
              <h3>Forms</h3>
              <div class="shortcut-item">
                <kbd>Tab</kbd>
                <span>Navigate form fields</span>
              </div>
              <div class="shortcut-item">
                <kbd>Enter</kbd>
                <span>Submit form</span>
              </div>
              <div class="shortcut-item">
                <kbd>Real-time validation</kbd>
                <span>Error feedback as you type</span>
              </div>
            </div>

            <div class="shortcuts-section">
              <h3>Accessibility</h3>
              <div class="shortcut-item">
                <kbd>Tab</kbd>
                <span>Navigate all interactive elements</span>
              </div>
              <div class="shortcut-item">
                <kbd>Enter / Space</kbd>
                <span>Activate buttons & links</span>
              </div>
              <div class="shortcut-item">
                <kbd>Screen Reader</kbd>
                <span>All content is readable (WCAG AAA)</span>
              </div>
            </div>
          </div>

          <p class="shortcuts-footer">
            Tip: Most interactions are discoverable through keyboard navigation.
            All features work with screen readers.
          </p>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    this.modal = document.getElementById('keyboard-shortcuts-overlay');

    // Close button
    const closeBtn = this.modal.querySelector('.shortcuts-close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
    });

    // Backdrop click to close
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        e.stopPropagation();
        this.close();
      }
    });

    // Prevent click propagation inside modal content
    this.modal.querySelector('.keyboard-shortcuts-modal').addEventListener('click', (e) => {
      e.stopPropagation();
    });
  },

  setupListeners() {
    document.addEventListener('keydown', (e) => {
      // Show shortcuts on ? (but not if another modal is open)
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const dsModal = document.getElementById('design-system-modal');
        if (!dsModal || dsModal.style.display !== 'block') {
          e.preventDefault();
          this.toggle();
        }
      }

      // Close on Escape (only if this modal is open, higher z-index = takes precedence)
      if (e.key === 'Escape' && this.isOpen) {
        e.preventDefault();
        e.stopPropagation();
        this.close();
      }
    }, true); // Use capture phase to catch before other listeners
  },

  open() {
    if (this.isOpen) return; // Prevent duplicate opens
    this.modal.style.display = 'flex'; // Ensure visible before adding class
    this.modal.classList.add('open');
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
    // Store previously focused element for restoration
    this.previousActiveElement = document.activeElement;
    // Focus the close button instead of the unfocusable div
    setTimeout(() => {
      this.modal.querySelector('.shortcuts-close')?.focus();
    }, 50);
  },

  close() {
    if (!this.isOpen) return; // Prevent duplicate closes
    this.modal.classList.remove('open');
    this.modal.style.display = 'none'; // Hide immediately
    this.isOpen = false;
    document.body.style.overflow = '';
    // Restore focus to previously focused element
    if (this.previousActiveElement && this.previousActiveElement !== document.body) {
      this.previousActiveElement.focus();
    }
  },

  toggle() {
    this.isOpen ? this.close() : this.open();
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => KeyboardShortcuts.init());
} else {
  KeyboardShortcuts.init();
}
