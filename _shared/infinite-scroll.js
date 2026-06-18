/* infinite-scroll.js — Infinite scroll and load-more patterns */

const InfiniteScroll = {
  container: null,
  loadMoreBtn: null,
  sentinel: null,
  observer: null,
  isLoading: false,
  currentPage: 1,
  pageSize: 20,
  totalItems: 0,
  loadedItems: 0,

  init(options = {}) {
    this.container = options.container || document.querySelector('[data-infinite-scroll]');
    if (!this.container) return;

    this.loadMoreBtn = options.loadMoreBtn || document.querySelector('[data-load-more-btn]');
    this.pageSize = options.pageSize || this.pageSize;
    this.totalItems = parseInt(this.container.getAttribute('data-total-items')) || 0;

    this.setupSentinel();
    this.setupLoadMoreButton();
    this.setupIntersectionObserver();
  },

  setupSentinel() {
    // Create sentinel element at end of container
    this.sentinel = document.createElement('div');
    this.sentinel.className = 'infinite-scroll-sentinel';
    this.sentinel.setAttribute('aria-label', 'Loading');
    this.container.appendChild(this.sentinel);
  },

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '100px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isLoading) {
          this.loadNextPage();
        }
      });
    }, options);

    this.observer.observe(this.sentinel);
  },

  setupLoadMoreButton() {
    if (!this.loadMoreBtn) return;

    this.loadMoreBtn.addEventListener('click', () => {
      if (!this.isLoading) {
        this.loadNextPage();
      }
    });
  },

  loadNextPage() {
    if (this.isLoading) return;
    if (this.totalItems > 0 && this.loadedItems >= this.totalItems) return;

    this.isLoading = true;

    // Show loading state
    this.showLoading();

    // Emit custom event for page load
    const event = new CustomEvent('infinite-scroll:load', {
      detail: {
        page: this.currentPage,
        pageSize: this.pageSize,
        offset: (this.currentPage - 1) * this.pageSize
      }
    });

    document.dispatchEvent(event);

    // Auto-hide loading after 1s (for custom handlers)
    setTimeout(() => {
      if (this.isLoading) {
        this.hideLoading();
        this.isLoading = false;
      }
    }, 1000);
  },

  addItems(items) {
    if (!Array.isArray(items)) return;

    const fragment = document.createDocumentFragment();

    items.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'infinite-scroll-item';
      div.style.animation = `infinite-scroll-fade-in 0.4s ease-out ${index * 0.05}s backwards`;
      div.innerHTML = item;
      fragment.appendChild(div);
    });

    // Insert before sentinel
    this.container.insertBefore(fragment, this.sentinel);

    this.loadedItems += items.length;
    this.currentPage++;

    this.hideLoading();
    this.isLoading = false;

    // Check if we've loaded everything
    if (this.totalItems > 0 && this.loadedItems >= this.totalItems) {
      this.showComplete();
    }
  },

  showLoading() {
    if (!this.sentinel) return;

    this.sentinel.classList.add('loading');
    const loader = document.createElement('div');
    loader.className = 'infinite-scroll-loader';
    loader.innerHTML = `
      <div class="loader-spinner"></div>
      <p class="loader-text">Loading...</p>
    `;
    this.sentinel.appendChild(loader);
  },

  hideLoading() {
    if (!this.sentinel) return;

    this.sentinel.classList.remove('loading');
    const loader = this.sentinel.querySelector('.infinite-scroll-loader');
    if (loader) loader.remove();
  },

  showComplete() {
    if (!this.sentinel) return;

    this.sentinel.classList.add('complete');
    const complete = document.createElement('div');
    complete.className = 'infinite-scroll-complete';
    complete.innerHTML = '<p>No more items</p>';
    this.sentinel.appendChild(complete);

    if (this.loadMoreBtn) {
      this.loadMoreBtn.style.display = 'none';
    }
  },

  // Utility: reset pagination
  reset() {
    this.currentPage = 1;
    this.loadedItems = 0;
    this.isLoading = false;
    this.sentinel.classList.remove('loading', 'complete');
    const loader = this.sentinel.querySelector('.infinite-scroll-loader');
    if (loader) loader.remove();
    const complete = this.sentinel.querySelector('.infinite-scroll-complete');
    if (complete) complete.remove();
  },

  // Utility: set total items
  setTotal(total) {
    this.totalItems = total;
  }
};

// Auto-init if container exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('[data-infinite-scroll]')) {
      InfiniteScroll.init();
    }
  });
} else {
  if (document.querySelector('[data-infinite-scroll]')) {
    InfiniteScroll.init();
  }
}
