/* advanced-interactions.js — Drag-drop, long-press, and other advanced patterns */

const AdvancedInteractions = {
  dragState: {
    isDragging: false,
    draggedElement: null,
    offsetX: 0,
    offsetY: 0
  },

  init() {
    this.setupDragDrop();
    this.setupLongPress();
    this.setupContextMenu();
  },

  /* ═══════════════════════════════════════════════════════════════ */
  /* DRAG & DROP */
  /* ═══════════════════════════════════════════════════════════════ */

  setupDragDrop() {
    document.addEventListener('mousedown', (e) => this.handleDragStart(e));
    document.addEventListener('mousemove', (e) => this.handleDragMove(e), { passive: true });
    document.addEventListener('mouseup', (e) => this.handleDragEnd(e));

    // Touch support
    document.addEventListener('touchstart', (e) => this.handleDragStart(e), { passive: true });
    document.addEventListener('touchmove', (e) => this.handleDragMove(e), { passive: true });
    document.addEventListener('touchend', (e) => this.handleDragEnd(e));
  },

  handleDragStart(e) {
    const draggable = e.target.closest('[data-draggable]');
    if (!draggable) return;

    const rect = draggable.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    this.dragState.isDragging = true;
    this.dragState.draggedElement = draggable;
    this.dragState.offsetX = clientX - rect.left;
    this.dragState.offsetY = clientY - rect.top;

    draggable.classList.add('dragging');
    document.body.classList.add('dragging-active');

    // Emit drag start event
    this.emitEvent('drag-start', draggable);
  },

  handleDragMove(e) {
    if (!this.dragState.isDragging) return;

    const el = this.dragState.draggedElement;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    el.style.position = 'fixed';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9999';
    el.style.left = (clientX - this.dragState.offsetX) + 'px';
    el.style.top = (clientY - this.dragState.offsetY) + 'px';

    // Check for drop zones
    this.checkDropZones(clientX, clientY);
  },

  handleDragEnd(e) {
    if (!this.dragState.isDragging) return;

    const el = this.dragState.draggedElement;

    el.classList.remove('dragging');
    el.style.position = '';
    el.style.pointerEvents = '';
    el.style.zIndex = '';
    el.style.left = '';
    el.style.top = '';

    document.body.classList.remove('dragging-active');

    // Emit drag end event
    this.emitEvent('drag-end', el);

    this.dragState.isDragging = false;
    this.dragState.draggedElement = null;
  },

  checkDropZones(x, y) {
    const dropZones = document.querySelectorAll('[data-drop-zone]');

    dropZones.forEach(zone => {
      const rect = zone.getBoundingClientRect();
      const isOver = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

      if (isOver) {
        zone.classList.add('drop-over');
        this.emitEvent('drag-over', zone);
      } else {
        zone.classList.remove('drop-over');
      }
    });
  },

  /* ═══════════════════════════════════════════════════════════════ */
  /* LONG PRESS */
  /* ═══════════════════════════════════════════════════════════════ */

  setupLongPress() {
    document.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    document.addEventListener('pointerup', () => this.handlePointerUp());
    document.addEventListener('pointercancel', () => this.handlePointerUp());
  },

  handlePointerDown(e) {
    const longPressEl = e.target.closest('[data-long-press]');
    if (!longPressEl) return;

    longPressEl.pressTimer = setTimeout(() => {
      if (longPressEl.pressTimer) {
        longPressEl.classList.add('long-pressed');
        this.emitEvent('long-press', longPressEl);

        const handler = longPressEl.getAttribute('data-long-press');
        if (typeof window[handler] === 'function') {
          window[handler](longPressEl);
        }

        // Haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }, 500);

    longPressEl.addEventListener('contextmenu', (e) => e.preventDefault(), { once: true });
  },

  handlePointerUp() {
    document.querySelectorAll('[data-long-press]').forEach(el => {
      clearTimeout(el.pressTimer);
      el.classList.remove('long-pressed');
    });
  },

  /* ═══════════════════════════════════════════════════════════════ */
  /* CONTEXT MENU */
  /* ═══════════════════════════════════════════════════════════════ */

  setupContextMenu() {
    document.addEventListener('contextmenu', (e) => {
      const contextEl = e.target.closest('[data-context-menu]');
      if (!contextEl) return;

      e.preventDefault();
      this.showContextMenu(contextEl, e.clientX, e.clientY);
    });

    // Close context menu on click elsewhere
    document.addEventListener('click', () => {
      document.querySelectorAll('.context-menu.open').forEach(menu => {
        menu.classList.remove('open');
      });
    });
  },

  showContextMenu(element, x, y) {
    const menuId = element.getAttribute('data-context-menu');
    let menu = document.getElementById(menuId);

    if (!menu) {
      // Create menu from data
      menu = this.createContextMenu(element);
    }

    menu.classList.add('open');
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';

    this.emitEvent('context-menu-open', element);
  },

  createContextMenu(element) {
    const menuId = element.getAttribute('data-context-menu');
    const items = element.getAttribute('data-context-items');

    if (!items) return null;

    const menu = document.createElement('div');
    menu.id = menuId;
    menu.className = 'context-menu';

    const itemList = items.split('|');
    itemList.forEach(item => {
      const [label, action] = item.split(':');
      const btn = document.createElement('button');
      btn.className = 'context-menu-item';
      btn.textContent = label.trim();
      btn.addEventListener('click', () => {
        if (typeof window[action.trim()] === 'function') {
          window[action.trim()](element);
        }
        menu.classList.remove('open');
      });
      menu.appendChild(btn);
    });

    document.body.appendChild(menu);
    return menu;
  },

  /* ═══════════════════════════════════════════════════════════════ */
  /* UTILITY METHODS */
  /* ═══════════════════════════════════════════════════════════════ */

  emitEvent(eventName, target) {
    const event = new CustomEvent(eventName, {
      detail: { target }
    });
    target.dispatchEvent(event);
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AdvancedInteractions.init());
} else {
  AdvancedInteractions.init();
}
