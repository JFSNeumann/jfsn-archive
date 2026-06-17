/* search.js — site-wide search overlay (⌘K / Ctrl+K) + keyboard shortcuts (?)
   Injects overlay + nav trigger. Lazy-loads catalog-lite.json on first open.
   Self-contained: injects its own CSS so it works on any page. */
(function () {
  'use strict';

  // ── Inject search overlay CSS (self-contained, works on any page) ────────
  if (!document.getElementById('sse-styles')) {
    const s = document.createElement('style');
    s.id = 'sse-styles';
    s.textContent = `
:root{--sse-text:#F3F0EA;--sse-muted:rgba(243,240,234,0.62);--sse-dim:rgba(243,240,234,0.12);--sse-accent:#FF6600}
#sse-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:9000;display:flex;align-items:flex-start;justify-content:center;padding-top:clamp(4rem,12vh,10rem)}
#sse-overlay[hidden]{display:none}
#sse-panel{width:min(600px,92vw);background:#161616;border:1px solid var(--sse-dim);box-shadow:0 24px 64px rgba(0,0,0,.6);overflow:hidden}
#sse-input-row{display:flex;align-items:center;gap:.75rem;padding:.875rem 1rem;border-bottom:1px solid var(--sse-dim)}
#sse-icon{width:16px;height:16px;color:var(--sse-muted);flex-shrink:0;opacity:.5}
#sse-input{flex:1;appearance:none;background:none;border:none;color:var(--sse-text);font-family:inherit;font-size:.9375rem;outline:none}
#sse-input::placeholder{color:var(--sse-muted);opacity:.5}
#sse-close{appearance:none;background:none;border:none;color:var(--sse-muted);cursor:pointer;font-size:.875rem;line-height:1;padding:.25rem;opacity:.5;transition:opacity .12s,color .12s;flex-shrink:0}
#sse-close:hover{opacity:1;color:var(--sse-text)}
#sse-results{max-height:min(60vh,420px);overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--sse-dim) transparent}
.sse-item{display:flex;align-items:center;gap:.875rem;padding:.625rem 1rem;color:var(--sse-muted);transition:background .15s ease,color .15s ease;cursor:pointer;border-left:2px solid transparent}
.sse-item:hover{background:rgba(243,240,234,.04);color:var(--sse-text)}
.sse-item[aria-selected=true]{background:rgba(243,240,234,.08);border-left-color:var(--sse-accent);color:var(--sse-text);font-weight:500}
.sse-thumb{width:44px;height:44px;object-fit:cover;flex-shrink:0;background:#1e1e1e;display:block}
.sse-info{display:flex;flex-direction:column;gap:.2rem;min-width:0}
.sse-title{font-size:.875rem;color:var(--sse-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sse-meta{font-size:.625rem;letter-spacing:.1em;text-transform:uppercase;color:var(--sse-muted);opacity:.65}
.sse-id{margin-left:auto;flex-shrink:0;align-self:center;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:.62rem;letter-spacing:.04em;color:var(--sse-muted);opacity:.55}
.sse-item[aria-selected="true"] .sse-id{color:var(--sse-accent,#FF6600);opacity:.9}
.sse-special{gap:.75rem}
.sse-surprise-icon{font-size:1.25rem;width:44px;text-align:center;color:var(--sse-accent);flex-shrink:0}
.sse-section-label{font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:rgba(243,240,234,.3);padding:.75rem 1rem .25rem;border-top:1px solid var(--sse-dim)}
.sse-msg{padding:1.5rem 1rem;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:var(--sse-muted);opacity:.5}
#sse-hint{padding:.5rem 1rem;border-top:1px solid var(--sse-dim);font-size:.625rem;letter-spacing:.08em;color:var(--sse-muted);opacity:.4}
#sse-hint kbd{font-family:inherit;border:1px solid var(--sse-dim);padding:.05rem .3rem;font-size:.6rem}
#sse-kb-modal{position:fixed;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:9000;display:flex;align-items:center;justify-content:center;padding:24px}
#sse-kb-modal[hidden]{display:none}
#sse-kb-panel{width:min(480px,92vw);background:#161616;border:1px solid var(--sse-dim);box-shadow:0 24px 64px rgba(0,0,0,.6);overflow:hidden}
#sse-kb-head{display:flex;justify-content:space-between;align-items:center;padding:.875rem 1rem;border-bottom:1px solid var(--sse-dim)}
#sse-kb-title{font-size:.6875rem;letter-spacing:.16em;text-transform:uppercase;color:var(--sse-muted)}
#sse-kb-close{appearance:none;background:none;border:none;color:var(--sse-muted);cursor:pointer;font-size:.875rem;padding:.25rem;opacity:.5;transition:opacity .12s}
#sse-kb-close:hover{opacity:1;color:var(--sse-text)}
#sse-kb-body{padding:.5rem 0 .75rem}
.sse-kb-section{padding:.5rem 0;border-bottom:1px solid var(--sse-dim)}
.sse-kb-section:last-child{border-bottom:none}
.sse-kb-section-label{font-size:.625rem;letter-spacing:.14em;text-transform:uppercase;color:rgba(243,240,234,.3);padding:.25rem 1rem .5rem}
.sse-kb-row{display:flex;justify-content:space-between;align-items:center;padding:.3rem 1rem;gap:1rem}
.sse-kb-desc{font-size:.75rem;color:var(--sse-muted)}
.sse-kb-keys{display:flex;align-items:center;gap:.3rem;flex-shrink:0}
.sse-kb-keys kbd{font-family:inherit;border:1px solid var(--sse-dim);border-radius:3px;padding:.15rem .4rem;font-size:.625rem;color:var(--sse-muted)}
.sse-kb-or{font-size:.625rem;color:rgba(243,240,234,.3)}
.sse-kb-plain{font-size:.625rem;color:var(--sse-muted)}
@media(prefers-reduced-motion:reduce){.sse-item,.sse-close,#sse-kb-close{transition:none}}
    `;
    document.head.appendChild(s);
  }

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
          <div class="sse-kb-row"><span class="sse-kb-desc">Open search</span><span class="sse-kb-keys"><kbd>⌘K</kbd> <span class="sse-kb-or">or</span> <kbd>Ctrl K</kbd> <span class="sse-kb-or">or</span> <kbd>/</kbd></span></div>
          <div class="sse-kb-row"><span class="sse-kb-desc">Show shortcuts</span><span class="sse-kb-keys"><kbd>?</kbd></span></div>
          <div class="sse-kb-row"><span class="sse-kb-desc">Close overlay</span><span class="sse-kb-keys"><kbd>Esc</kbd></span></div>
        </div>
        <div class="sse-kb-section">
          <p class="sse-kb-section-label">Artwork page</p>
          <div class="sse-kb-row"><span class="sse-kb-desc">Previous work</span><span class="sse-kb-keys"><kbd>←</kbd></span></div>
          <div class="sse-kb-row"><span class="sse-kb-desc">Next work</span><span class="sse-kb-keys"><kbd>→</kbd></span></div>
        </div>
        <div class="sse-kb-section">
          <p class="sse-kb-section-label">Search overlay</p>
          <div class="sse-kb-row"><span class="sse-kb-desc">Move through results</span><span class="sse-kb-keys"><kbd>↑</kbd> <kbd>↓</kbd></span></div>
          <div class="sse-kb-row"><span class="sse-kb-desc">Open selected</span><span class="sse-kb-keys"><kbd>↵</kbd></span></div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(kbModal);

  // ── Nav search button — wire to existing Stitch nav button ─────────────
  // New nav uses a <button aria-label="Search"> in the header; wire it directly.
  const existingBtn = document.querySelector('button[aria-label="Search"]');
  if (existingBtn) {
    existingBtn.addEventListener('click', open);
    existingBtn.title = 'Search (⌘K or /)';
  }
  // Legacy: old nav.nav pattern
  const nav = document.querySelector('nav.nav');
  if (nav && !existingBtn) {
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
  // ── Typewriter placeholder ───────────────────────────────────────────────
  const TYPEWRITER_TITLES = [
    'Untitled (Figure, Blue Ground)',
    'Cassette Torso',
    'Reliquary',
    'XXXIII Días',
    'Guernica Study',
    'Pubiern Robodt 365',
    'Search by title, year, theme…',
  ];
  let twIdx = 0, twCharIdx = 0, twDir = 1, twTimer = null;

  function typewriterTick() {
    if (document.activeElement === input) { stopTypewriter(); return; }
    const target = TYPEWRITER_TITLES[twIdx];
    if (twDir === 1) {
      twCharIdx++;
      input.placeholder = target.slice(0, twCharIdx);
      if (twCharIdx >= target.length) {
        twDir = -1;
        clearInterval(twTimer);
        twTimer = setTimeout(function () { twTimer = setInterval(typewriterTick, 60); }, 2200);
        return;
      }
    } else {
      twCharIdx--;
      input.placeholder = target.slice(0, twCharIdx);
      if (twCharIdx <= 0) {
        twDir = 1;
        twIdx = (twIdx + 1) % TYPEWRITER_TITLES.length;
        clearInterval(twTimer);
        twTimer = setTimeout(function () { twTimer = setInterval(typewriterTick, 80); }, 400);
        return;
      }
    }
  }

  function startTypewriter() {
    twIdx = 0; twCharIdx = 0; twDir = 1;
    input.placeholder = '';
    if (twTimer) clearTimeout(twTimer);
    twTimer = setInterval(typewriterTick, 80);
  }
  function stopTypewriter() {
    clearInterval(twTimer);
    clearTimeout(twTimer);
    twTimer = null;
    input.placeholder = 'Search works, themes, year…';
  }

  input.addEventListener('focus', stopTypewriter);
  input.addEventListener('blur', function () {
    if (!overlay.hidden && !input.value) startTypewriter();
  });

  function open() {
    kbModal.hidden = true;
    document.body.style.overflow = 'hidden';
    overlay.hidden = false;
    input.focus();
    input.select();
    render(input.value);
    if (!catalog && !loading) loadCatalog();
    // Start typewriter after a brief pause if input stays empty
    setTimeout(function () { if (!input.value && document.activeElement !== input) startTypewriter(); }, 1200);
  }

  function close() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    input.value   = '';
    results.innerHTML = '';
    selectedIdx   = -1;
    matches       = [];
    stopTypewriter();
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

    // / — open search (when no input is focused)
    if (e.key === '/') {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (overlay.hidden) { e.preventDefault(); open(); return; }
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
      // Zero-results voice — Jeff's voice responses
      const voices = [
        'Nothing by that name. Here\'s something from around that time.',
        'Not in the catalog. But this one has been waiting.',
        'No match found. The archive offers this instead.',
        'Nothing here by that name — though it may have been lost.',
        'That one isn\'t here. This one is.',
      ];
      const msg = voices[Math.floor(Math.random() * voices.length)];
      results.innerHTML = '<div class="sse-msg" style="font-style:italic;opacity:0.7;letter-spacing:0.04em;text-transform:none;font-size:.8rem;">' + escH(msg) + '</div>' + surpriseItemHTML();
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
        <span class="sse-id">${escH(artId)}</span>
      </a>`;
    }).join('');

    bindClicks();
  }

  function emptyStateHTML() {
    return surpriseItemHTML() + browseHTML() + favsHTML() + recentHTML();
  }

  function browseHTML() {
    const series = [
      { label: 'Guernica Series',   href: 'guernica.html',     meta: '232 works' },
      { label: 'Targets',           href: 'targets.html',      meta: '403 works' },
      { label: 'Mr. SNOWmann',      href: 'mr-snowmann.html',  meta: '72 works'  },
    ];
    const items = series.map(s =>
      `<a class="sse-item" role="option" aria-selected="false" data-href="${s.href}" href="${s.href}">
        <span class="sse-surprise-icon" style="font-size:.9rem;" aria-hidden="true">→</span>
        <div class="sse-info">
          <span class="sse-title">${s.label}</span>
          <span class="sse-meta">${s.meta}</span>
        </div>
      </a>`
    ).join('');
    return `<div class="sse-section-label">Browse by series</div>${items}`;
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
    var catalogPath = location.origin + '/catalog-lite.json';
    fetch(catalogPath)
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
