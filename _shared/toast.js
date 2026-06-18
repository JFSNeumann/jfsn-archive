/* toast.js — Toast notification system for user feedback */

const Toast = {
  stack: [],
  activeToasts: new Map(),

  show(message, type = 'info', duration = 3000) {
    const id = `toast-${Date.now()}-${Math.random()}`;

    const html = `
      <div id="${id}" class="toast toast-${type}" role="alert" aria-live="polite">
        <div class="toast-content">
          <span class="toast-icon">${this.getIcon(type)}</span>
          <span class="toast-message">${this.escapeHtml(message)}</span>
        </div>
        <button class="toast-close" aria-label="Close notification" onclick="Toast.hide('${id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    // Create container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.setAttribute('aria-label', 'Notifications');
      document.body.appendChild(container);
    }

    container.insertAdjacentHTML('beforeend', html);
    const toastEl = document.getElementById(id);

    // Trigger animation
    requestAnimationFrame(() => {
      toastEl.classList.add('toast-show');
    });

    // Auto-hide after duration
    if (duration > 0) {
      const timeout = setTimeout(() => {
        this.hide(id);
      }, duration);
      this.activeToasts.set(id, timeout);
    }
  },

  hide(id) {
    const toastEl = document.getElementById(id);
    if (!toastEl) return;

    toastEl.classList.remove('toast-show');

    setTimeout(() => {
      toastEl.remove();
      if (this.activeToasts.has(id)) {
        clearTimeout(this.activeToasts.get(id));
        this.activeToasts.delete(id);
      }
    }, 300);
  },

  getIcon(type) {
    const icons = {
      'success': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      'error': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
      'warning': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
      'info': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };
    return icons[type] || icons['info'];
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  success(message, duration = 3000) {
    this.show(message, 'success', duration);
  },

  error(message, duration = 4000) {
    this.show(message, 'error', duration);
  },

  warning(message, duration = 3500) {
    this.show(message, 'warning', duration);
  },

  info(message, duration = 3000) {
    this.show(message, 'info', duration);
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Toast is ready to use
  });
}
