/* search.js — site-wide search overlay (⌘K / Ctrl+K) + keyboard shortcuts (?)
   Injects overlay + nav trigger. Lazy-loads catalog-lite.json on first open. */
(function () {
  'use strict';

  const FAVS_KEY   = 'jfsn-favorites';
  const RECENT_KEY = 'jfsn-recently-viewed';

  let catalog     = null;
  let loading     = false;
  let selectedIdx = -1;
  let matches     = [];

  // ── Inject search overlay HTML ───────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'sse-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Search archive');
  overlay.hidden = true;
  overlay.innerHTML = `
    <div id="sse-panel">
      <div id="sse-input-row">
        <svg id="sse-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="5.25" stroke="currentColor" stroke-width="1.5"/>
          <line x1="12.5" y1="12.5" x2="17" y2="17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input id="sse-input" type="search" placeholder="Search works, themes, year…"
               autocomplete="off" spellcheck="false" aria-autocomplete="list" aria-controls="sse-results">
        <button id="sse-close" aria-label="Close search">✕</button>
      </div>
      <div id="sse-results" role="listbox" aria-label="Search results"></div>
      <div id="sse-hint">
        <kbd>↑</kbd><kbd>↓</kbd> navigate &nbsp;·&nbsp; <kbd>↵</kbd> open &nbsp;·&nbsp; <kbd>esc</kbd> close &nbsp;·&nbsp; <kbd>?</kbd> shortcuts
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const input   = document.getElementById('sse-input');
  const results = document.getElementById('sse-results');

  // ── Inject keyboard shortcuts modal ─────────────────────────────────────
  const kbModal = document.createElement('div');
  kbModal.id = 'sse-kb-modal';
  kbModal.setAttribute('role', 'dialog');
  kbModal.setAttribute('aria-modal', 'true');
  kbModal.setAttribute('aria-label', 'Keyboard shortcuts');
  kbModal.hidden = true;
  kbModal.innerHTML = `
    <div id="sse-kb-panel">
      <div id="sse-kb-head">
        <span id="sse-kb-title">Keyboard Shortcuts</span>
        <button id="sse-kb-close" aria-label="Close shortcuts">✕</button>
      </div>
      <div id="sse-kb-body">
        <div class="sse-kb-section">
          <p class="sse-kb-section-label">Global</p>
          <div class="sse-kb-row"><span class="sse-kb-desc">Open search</span><span class="sse-kb-keys"><kbd>⌘K</kbd> <span class="sse-kb-or">or</span> <kbd>Ctrl K</kbd></span></div>
          <div class="sse-kb-row"><span class="sse-kb-desc">Show shortcuts</span><span class="sse-kb-keys"><kbd>?</kbd></span></div>
          <div class="sse-kb-row"><span class="sse-kb-desc">Close overlay</span><span class="sse-kb-keys"><kbd>Esc</kbd></span></div>
        </div>
        <div class="sse-kb-section">
          <p class="sse-kb-section-label">Artwork page</p>
          <div class="sse-kb-row"><span class="sse-kb-desc">Previous work</span><span class="sse-kb-keys"><kbd>←</kbd></span></div>
          <div class="sse-kb-row"><span class="sse-kb-desc">Next work</span><span class="sse-kb-keys"><kbd>→</kbd></span></div>
          <div class="sse-kb-row"><span class="sse-kb-desc">Swipe left / right</span><span class="sse-kb-keys"><span class="sse-kb-plain">Touch nav</span></span></div>
        </div>
        <div class="sse-kb-section">
          <p class="sse-kb-section-label">Search overlay</p>
          <div class="sse-kb-row"><span class="sse-kb-desc">Move through results</span><span class="sse-kb-keys"><kbd>↑</kbd> <kbd>↓</kbd></span></div>
          <div class="sse-kb-row"><span class="sse-kb-desc">Open selected</span><span class="sse-kb-keys"><kbd>↵</kbd></span></div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(kbModal);

  // ── Nav search button ────────────────────────────────────────────────────
  const nav = document.querySelector('nav.nav');
  if (nav) {
    const btn = document.createElement('button');
    btn.className   = 'nav-search-btn';
    btn.title       = 'Search (⌘K)';
    btn.setAttribute('aria-label', 'Search');
    btn.innerHTML   = `<svg viewBox="0 0 18 18" fill="none" aria-hidden="true" width="14" height="14">
      <circle cx="7.5" cy="7.5" r="4.75" stroke="currentColor" stroke-width="1.5"/>
      <line x1="11" y1="11" x2="15.5" y2="15.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`;
    btn.addEventListener('click', open);
    nav.appendChild(btn);
  }

  // ── Open / Close search ──────────────────────────────────────────────────
  function open() {
    kbModal.hidden = true;
    document.body.style.overflow = 'hidden';
    overlay.hidden = false;
    input.focus();
    input.select();
    render(input.value);
    if (!catalog && !loading) loadCatalog();
  }

  function close() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    input.value   = '';
    results.innerHTML = '';
    selectedIdx   = -1;
    matches       = [];
  }

  window.openSiteSearch = open;

  // ── Shortcuts modal ──────────────────────────────────────────────────────
  function openShortcuts() {
    close(); // close search if open
    kbModal.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('sse-kb-close').focus();
  }

  function closeShortcuts() {
    kbModal.hidden = true;
    document.body.style.overflow = '';
  }

  document.getElementById('sse-kb-close').addEventListener('click', closeShortcuts);
  kbModal.addEventListener('click', e => { if (e.target === kbModal) closeShortcuts(); });

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    // ⌘K / Ctrl+K — toggle search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      overlay.hidden ? open() : close();
      return;
    }

    // ? — toggle shortcuts help (when search is closed and no input is focused)
    if (e.key === '?') {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (!kbModal.hidden) { closeShortcuts(); return; }
      if (overlay.hidden)  { openShortcuts();  return; }
    }

    // Esc — close whatever is open
    if (e.key === 'Escape') {
      if (!overlay.hidden)  { close();         return; }
      if (!kbModal.hidden)  { closeShortcuts(); return; }
    }

    if (overlay.hidden) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); selectIdx(selectedIdx + 1); return; }
    if (e.key === 'ArrowUp')   { e.preventDefault(); selectIdx(selectedIdx - 1); return; }
    if (e.key === 'Enter') {
      const sel = results.querySelector('[aria-selected="true"]');
      if (sel && sel.dataset.href) { close(); location.href = sel.dataset.href; }
    }
  });

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.getElementById('sse-close').addEventListener('click', close);

  input.addEventListener('input', () => {
    selectedIdx = -1;
    render(input.value);
  });

  // ── Render results ───────────────────────────────────────────────────────
  function render(q) {
    q = (q || '').trim().toLowerCase();

    if (!catalog) {
      results.innerHTML = q
        ? '<div class="sse-msg">Loading catalog…</div>'
        : emptyStateHTML();
      return;
    }

    if (!q) {
      results.innerHTML = emptyStateHTML();
      matches = [];
      bindClicks();
      return;
    }

    // Score and filter
    const scored = [];
    for (const r of catalog) {
      const artId  = r.file ? r.file.replace('.avif', '') : '';
      const title  = (r.title || '').toLowerCase();
      const themes = (r.themes || []).join(' ').toLowerCase();
      const kw     = (r.keywords || []).join(' ').toLowerCase();
      const mot    = (r.motifs  || []).join(' ').toLowerCase();
      const yr     = r.year ? String(r.year) : '';
      const hay    = `${artId} ${title} ${themes} ${kw} ${mot} ${yr}`;
      if (!hay.includes(q)) continue;
      let score = 0;
      if (artId === q)           score += 100;
      if (title.startsWith(q))   score += 50;
      if (title.includes(q))     score += 20;
      if (yr.startsWith(q))      score += 10;
      scored.push({ r, artId, score });
    }
    scored.sort((a, b) => b.score - a.score);
    matches = scored.slice(0, 8);

    if (!matches.length) {
      results.innerHTML = '<div class="sse-msg">No results</div>' + surpriseItemHTML();
      bindClicks();
      return;
    }

    results.innerHTML = matches.map((m, i) => {
      const { r, artId } = m;
      const title   = r.title || artId;
      const typeStr = (r.work_type || '').replace(/_/g, ' ');
      const meta    = [r.year, typeStr].filter(Boolean).join(' · ');
      return `<a class="sse-item" role="option" aria-selected="false"
                 data-href="artwork.html?id=${artId}" data-idx="${i}"
                 href="artwork.html?id=${artId}">
        <img class="sse-thumb" src="artworks/thumbs/${artId}.avif" alt="" loading="lazy" width="44" height="44">
        <div class="sse-info">
          <span class="sse-title">${escH(title)}</span>
          ${meta ? `<span class="sse-meta">${escH(meta)}</span>` : ''}
        </div>
      </a>`;
    }).join('');

    bindClicks();
  }

  function emptyStateHTML() {
    return surpriseItemHTML() + favsHTML() + recentHTML();
  }

  function surpriseItemHTML() {
    if (!catalog || !catalog.length) return '';
    const r     = catalog[Math.floor(Math.random() * catalog.length)];
    const artId = r.file ? r.file.replace('.avif', '') : 'art0001';
    return `<a class="sse-item sse-special" role="option" aria-selected="false"
               data-href="artwork.html?id=${artId}" href="artwork.html?id=${artId}">
      <span class="sse-surprise-icon" aria-hidden="true">↝</span>
      <div class="sse-info">
        <span class="sse-title">Surprise me</span>
        <span class="sse-meta">Random work from the archive</span>
      </div>
    </a>`;
  }

  function favsHTML() {
    try {
      const favs = JSON.parse(localStorage.getItem(FAVS_KEY) || '[]');
      if (!favs.length || !catalog) return '';
      // Resolve IDs against catalog for titles
      const catalogMap = {};
      catalog.forEach(r => {
        const id = r.file ? r.file.replace('.avif', '') : '';
        if (id) catalogMap[id] = r;
      });
      const items = favs.slice(0, 4).map(id => {
        const r     = catalogMap[id];
        const title = (r && r.title) || id;
        const meta  = r && r.year ? String(r.year) : '';
        return `<a class="sse-item" role="option" aria-selected="false"
            data-href="artwork.html?id=${id}" href="artwork.html?id=${id}">
          <img class="sse-thumb" src="artworks/thumbs/${id}.avif" alt="" loading="lazy" width="44" height="44">
          <div class="sse-info">
            <span class="sse-title">${escH(title)}</span>
            <span class="sse-meta">Saved${meta ? ' · ' + meta : ''}</span>
          </div>
        </a>`;
      }).join('');
      return `<div class="sse-section-label">Saved works</div>${items}`;
    } catch (e) { return ''; }
  }

  function recentHTML() {
    try {
      const recent = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
      if (!recent.length) return '';
      const items = recent.slice(0, 4).map(item =>
        `<a class="sse-item" role="option" aria-selected="false"
            data-href="artwork.html?id=${item.id}" href="artwork.html?id=${item.id}">
          <img class="sse-thumb" src="artworks/thumbs/${item.id}.avif" alt="" loading="lazy" width="44" height="44">
          <div class="sse-info">
            <span class="sse-title">${escH(item.title || item.id)}</span>
            <span class="sse-meta">Recently viewed${item.year ? ' · ' + item.year : ''}</span>
          </div>
        </a>`
      ).join('');
      return `<div class="sse-section-label">Recently viewed</div>${items}`;
    } catch (e) { return ''; }
  }

  function bindClicks() {
    results.querySelectorAll('.sse-item').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        if (el.dataset.href) { close(); location.href = el.dataset.href; }
      });
    });
  }

  function selectIdx(i) {
    const items = results.querySelectorAll('.sse-item');
    if (!items.length) return;
    if (i < 0)            i = items.length - 1;
    if (i >= items.length) i = 0;
    selectedIdx = i;
    items.forEach((el, idx) => el.setAttribute('aria-selected', String(idx === i)));
    items[i].scrollIntoView({ block: 'nearest' });
  }

  // ── Catalog loader ───────────────────────────────────────────────────────
  function loadCatalog() {
    loading = true;
    fetch('catalog-lite.json')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        catalog = data;
        loading = false;
        if (!overlay.hidden) render(input.value);
      })
      .catch(() => { loading = false; });
  }

  function escH(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ── Expose favorites helpers globally ───────────────────────────────────
  window.jfsnFavs = {
    get:    () => { try { return JSON.parse(localStorage.getItem(FAVS_KEY) || '[]'); } catch(e) { return []; } },
    has:    id => { try { return JSON.parse(localStorage.getItem(FAVS_KEY) || '[]').includes(id); } catch(e) { return false; } },
    toggle: id => {
      try {
        let favs = JSON.parse(localStorage.getItem(FAVS_KEY) || '[]');
        const idx = favs.indexOf(id);
        if (idx >= 0) favs.splice(idx, 1); else favs.unshift(id);
        localStorage.setItem(FAVS_KEY, JSON.stringify(favs));
        return favs.includes(id);
      } catch(e) { return false; }
    },
  };
})();
