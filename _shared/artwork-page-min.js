// Minimal toast + favorite implementation for the 1,084 generated artwork pages
// (artworks/pages/artNNNN.html). These pages intentionally don't load core.bundle.js
// or the animation layer — see ENGINEERING_ROADMAP.md R2 decision (2026-06-30).
// Kept in sync by hand with the equivalent block in core.bundle.js / _shared/ui.js.
(function () {
  window.showToast = function (message, duration, type) {
    duration = duration || 3000;
    type = type || 'info';
    var container = document.getElementById('jfsn-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'jfsn-toast-container';
      container.style.cssText = 'pointer-events:none;';
      document.body.appendChild(container);
    }
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      toast.style.animation = 'none';
    }
    container.appendChild(toast);
    setTimeout(function () {
      toast.classList.add('exit');
      setTimeout(function () { toast.remove(); }, 200);
    }, duration);
  };

  window.toggleFavorite = function (artId) {
    var favorites = JSON.parse(localStorage.getItem('jfsn-favorites') || '[]');
    var btn = document.querySelector('.favorite-btn');
    var isFavorited = favorites.indexOf(artId) !== -1;
    var action = isFavorited ? 'remove' : 'add';

    if (isFavorited) {
      favorites = favorites.filter(function (id) { return id !== artId; });
      if (btn) btn.classList.remove('is-favorited');
    } else {
      favorites.push(artId);
      if (btn) {
        btn.classList.add('is-favorited');
        btn.classList.add('pulse');
        setTimeout(function () { btn.classList.remove('pulse'); }, 400);
      }
    }
    localStorage.setItem('jfsn-favorites', JSON.stringify(favorites));
    window.showToast(action === 'add' ? 'Added to favorites' : 'Removed from favorites');
  };

  var favBtn = document.querySelector('.favorite-btn');
  if (favBtn) {
    var artId = favBtn.dataset.artId;
    var favorites = JSON.parse(localStorage.getItem('jfsn-favorites') || '[]');
    if (favorites.indexOf(artId) !== -1) favBtn.classList.add('is-favorited');
  }
})();
