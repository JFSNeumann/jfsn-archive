/* GENERATED FILE — do not edit directly.
   Bundle: nav.bundle.js — sitewide nav block, 37 stamped pages
   Source: each section below is copied verbatim from its own file in
   _shared/ (or repo root). To change behavior, edit that source file,
   then regenerate with `npm run build:js`. Hand-editing this file will
   be silently overwritten on the next build.
   See BUNDLE_PLAN.md for why this exact file list and order. */

/* ===== search.js ===== */
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
.sse-item{display:flex;align-items:center;gap:.875rem;padding:.625rem 1rem;color:var(--sse-muted);transition:background .15s ease,color .15s ease;cursor:pointer;border-left:2px solid transparent;position:relative}
.sse-item::after{content:'';position:absolute;bottom:-1px;left:1rem;width:calc(100% - 2rem);height:1px;background:var(--sse-accent);transform:scaleX(0);transform-origin:left center;transition:transform .2s ease}
.sse-item:hover{background:rgba(243,240,234,.04);color:var(--sse-text)}
.sse-item:hover::after{transform:scaleX(1)}
.sse-item[aria-selected=true]{background:rgba(243,240,234,.08);border-left-color:var(--sse-accent);color:var(--sse-text);font-weight:500}
#sse-overlay img.sse-thumb{width:44px;height:44px;object-fit:cover;flex-shrink:0;background:#1e1e1e;display:block}
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
#sse-kb-modal.sse-kb-hidden{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
#sse-kb-modal[hidden]{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}
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
    kbModal.classList.remove('sse-kb-hidden');
    kbModal.hidden = false;
    document.body.style.overflow = 'hidden';
    const closeBtn = document.getElementById('sse-kb-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeShortcuts() {
    kbModal.classList.add('sse-kb-hidden');
    kbModal.hidden = true;
    kbModal.setAttribute('hidden', '');
    kbModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  const closeBtn = document.getElementById('sse-kb-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeShortcuts();
    });
  }
  kbModal.addEventListener('click', e => { if (e.target === kbModal) closeShortcuts(); });

  // Safeguard: ensure modal starts hidden
  if (typeof window !== 'undefined') {
    kbModal.classList.add('sse-kb-hidden');
    setTimeout(function() {
      kbModal.hidden = true;
      kbModal.setAttribute('hidden', '');
    }, 10);

    // CRITICAL: Remove all old broken keyboard shortcuts modals
    ['shortcuts-modal', 'close-shortcuts', 'keyboard-shortcuts-modal', 'keyboard-shortcuts-overlay'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
    document.querySelectorAll('[class*="shortcuts"], [class*="keyboard-shortcuts"]').forEach(el => {
      if (el.id !== 'sse-kb-modal' && el.id !== 'sse-kb-panel' && el.id !== 'sse-kb-close' && el.id !== 'sse-kb-head' && el.id !== 'sse-kb-body') {
        el.style.display = 'none !important';
      }
    });
  }

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
      const yearDisplay = r.year_display || r.year; // Use decade estimates when available
      const meta    = [yearDisplay, typeStr].filter(Boolean).join(' · ');
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
        const yearDisplay = r && (r.year_display || r.year) ? String(r.year_display || r.year) : ''; // Use decade estimates
        const meta  = yearDisplay;
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
      const items = recent.slice(0, 4).map(item => {
        const r = catalogMap[item.id]; // Look up in catalog for year_display
        const yearDisplay = r && (r.year_display || r.year) ? String(r.year_display || r.year) : item.year || '';
        return `<a class="sse-item" role="option" aria-selected="false"
            data-href="artwork.html?id=${item.id}" href="artwork.html?id=${item.id}">
          <img class="sse-thumb" src="artworks/thumbs/${item.id}.avif" alt="" loading="lazy" width="44" height="44">
          <div class="sse-info">
            <span class="sse-title">${escH(item.title || item.id)}</span>
            <span class="sse-meta">Recently viewed${yearDisplay ? ' · ' + yearDisplay : ''}</span>
          </div>
        </a>`;
      }).join('');
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


/* ===== _shared/jfsn-interactions.js ===== */
/* jfsn-interactions.js — living museum interaction layer
   Covers: progress bar, custom cursor, film grain, kinetic typography,
   view transitions, serendipity mode (S key / shake).
   All features respect prefers-reduced-motion.
   Loads deferred — safe to place anywhere in the document. */

(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch   = window.matchMedia('(hover: none)').matches;

  /* ─── Inject styles ──────────────────────────────────────────────────── */
  if (!document.getElementById('jfsn-ix-styles')) {
    const s = document.createElement('style');
    s.id = 'jfsn-ix-styles';
    s.textContent = `
#jfsn-progress{position:fixed;top:0;left:0;height:2px;width:0%;background:#FF6600;z-index:9999;pointer-events:none;transition:width .1s ease,opacity .3s ease;}
/* Custom cursor — hide native cursor sitewide when active */
body.jfsn-custom-cursor,body.jfsn-custom-cursor *{cursor:none!important;}
#jfsn-cursor-dot{position:fixed;top:0;left:0;width:6px;height:6px;background:#FF6600;border-radius:50%;pointer-events:none;z-index:9998;opacity:0;transition:opacity .2s ease;will-change:transform;}
#jfsn-cursor-ring{position:fixed;top:0;left:0;width:32px;height:32px;border:1.5px solid rgba(255,102,0,.55);border-radius:50%;pointer-events:none;z-index:9997;opacity:0;transition:opacity .2s ease,width .15s ease,height .15s ease,border-color .15s ease;will-change:transform;}
#jfsn-cursor-ring.jfsn-cursor-expanded{width:48px;height:48px;border-color:rgba(255,102,0,.85);}
#jfsn-cursor-ring.jfsn-cursor-clicked{width:20px;height:20px;border-color:#FF6600;opacity:.8!important;}
#jfsn-grain{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9996;opacity:.028;mix-blend-mode:multiply;}
@keyframes letter-settle{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.ls-ready .ls-char{opacity:0;animation:letter-settle .32s cubic-bezier(.22,1,.36,1) forwards;}
@keyframes artwork-develop{from{filter:brightness(.6) saturate(.35)}to{filter:brightness(1) saturate(1)}}
.artwork-developing{animation:artwork-develop .5s ease-out forwards;}
#jfsn-ser{position:fixed;inset:0;z-index:9990;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .35s ease;}
#jfsn-ser.jfsn-ser-open{opacity:1;pointer-events:auto;}
#jfsn-ser-bg{position:absolute;inset:0;background:#fcf9f3;}
#jfsn-ser-img{position:relative;max-width:min(94vw,860px);max-height:80vh;object-fit:contain;display:block;cursor:pointer!important;opacity:0;transition:opacity .5s ease;z-index:1;box-shadow:0 0 0 1px rgba(11,11,11,.08);}
@media(min-width:600px){#jfsn-ser-img{max-width:min(80vw,860px);max-height:85vh;}}
#jfsn-ser-img.jfsn-ser-img-in{opacity:1;}
#jfsn-ser-meta{position:absolute;bottom:48px;left:50%;transform:translateX(-50%);font-family:'Inter',sans-serif;font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#575757;white-space:nowrap;opacity:0;transition:opacity .4s ease;z-index:2;pointer-events:none;}
#jfsn-ser-meta.jfsn-ser-meta-in{opacity:1;}
#jfsn-ser-close{position:absolute;top:24px;right:24px;background:none;border:1px solid #c4c7c7;font-family:'Inter',sans-serif;font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#575757;padding:6px 12px;cursor:pointer!important;z-index:3;transition:color .15s ease,border-color .15s ease;}
#jfsn-ser-close:hover{color:#FF6600;border-color:#FF6600;}
#jfsn-ser-hint{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);font-family:'Inter',sans-serif;font-size:10px;letter-spacing:.1em;color:#c4c7c7;white-space:nowrap;z-index:2;pointer-events:none;}
#jfsn-ser-hint kbd{font-family:inherit;border:1px solid #c4c7c7;padding:1px 5px;font-size:9px;}
@media(prefers-reduced-motion:reduce){#jfsn-progress,#jfsn-cursor-dot,#jfsn-cursor-ring,#jfsn-grain{display:none!important;}.ls-ready .ls-char{opacity:1;animation:none;}.artwork-developing{animation:none;filter:none;}#jfsn-ser,#jfsn-ser-img,#jfsn-ser-meta{transition:none;}}
/* Cross-document view transition — clicked artwork morphs into its page (no-op where unsupported) */
@view-transition{navigation:auto;}
@media(prefers-reduced-motion:reduce){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important;}}
/* Touch device feedback (Phase 3) — brief background flash on tap */
@keyframes tap-feedback{from{background-color:rgba(255,102,0,.12)}to{background-color:transparent}}
@media(hover:none) and (prefers-reduced-motion:no-preference){button:active,a:active,.thumb__link:active{animation:tap-feedback .1s ease-out forwards}}
    `;
    document.head.appendChild(s);
  }

  /* ─── 1. Page load progress bar ──────────────────────────────────────── */
  if (!reduced) {
    const bar = document.createElement('div');
    bar.id = 'jfsn-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    let w = 0;
    const step = function () {
      w = Math.min(w + (100 - w) * 0.09, 92);
      bar.style.width = w + '%';
    };
    bar.style.opacity = '1';
    const iv = setInterval(step, 70);
    window.addEventListener('load', function () {
      clearInterval(iv);
      bar.style.width = '100%';
      setTimeout(function () { bar.style.opacity = '0'; }, 300);
      setTimeout(function () { if (bar.parentNode) bar.parentNode.removeChild(bar); }, 700);
    }, { once: true });
  }

  /* ─── 2. Custom cursor (desktop / hover-capable devices only) ─────────── */
  if (!reduced && !touch) {
    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.id  = 'jfsn-cursor-dot';
    ring.id = 'jfsn-cursor-ring';
    dot.setAttribute('aria-hidden', 'true');
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    // Hide native cursor sitewide
    document.body.classList.add('jfsn-custom-cursor');

    const DOT_R  = 3;
    const RING_R = 16;
    const RING_R_EXP = 24; // half of expanded 48px

    var mx = -200, my = -200, rx = -200, ry = -200;
    var prevMx = -200, prevMy = -200;
    var expanded = false, hidden = true;

    document.addEventListener('mousemove', function (e) {
      prevMx = mx; prevMy = my;
      mx = e.clientX; my = e.clientY;
      if (hidden) {
        hidden = false;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    });
    document.addEventListener('mouseleave', function () {
      hidden = true;
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    });

    function lerp(a, b, t) { return a + (b - a) * t; }

    (function animCursor() {
      // Velocity-scaled lerp: fast mouse = ring snaps tighter
      var speed = Math.sqrt((mx - prevMx) * (mx - prevMx) + (my - prevMy) * (my - prevMy));
      var lerpT = Math.min(0.13 + speed * 0.004, 0.38);

      rx = lerp(rx, mx, lerpT);
      ry = lerp(ry, my, lerpT);

      dot.style.transform  = 'translate(' + (mx - DOT_R) + 'px,' + (my - DOT_R) + 'px)';
      var r = expanded ? RING_R_EXP : RING_R;
      ring.style.transform = 'translate(' + (rx - r) + 'px,' + (ry - r) + 'px)';
      requestAnimationFrame(animCursor);
    })();

    document.addEventListener('mouseover', function (e) {
      var over = e.target.closest('.thumb__link, .card-img, [data-cursor-expand], a, button');
      if (over && !expanded) {
        expanded = true;
        ring.classList.add('jfsn-cursor-expanded');
      } else if (!over && expanded) {
        expanded = false;
        ring.classList.remove('jfsn-cursor-expanded');
      }
    });

    document.addEventListener('mousedown', function () {
      ring.classList.add('jfsn-cursor-clicked');
      setTimeout(function () { ring.classList.remove('jfsn-cursor-clicked'); }, 180);
    });
  }

  /* ─── 3. Film grain ambient layer (desktop only — skip on touch for battery) */
  if (!reduced && !touch) {
    var grain = document.createElement('canvas');
    grain.id = 'jfsn-grain';
    grain.setAttribute('aria-hidden', 'true');
    document.body.appendChild(grain);

    var gctx = grain.getContext('2d');
    var gw, gh, gdata;

    function resizeGrain() {
      gw = grain.width  = window.innerWidth;
      gh = grain.height = window.innerHeight;
      gdata = gctx.createImageData(gw, gh);
    }
    resizeGrain();
    window.addEventListener('resize', resizeGrain, { passive: true });

    var grainPaused = false;
    document.addEventListener('visibilitychange', function () {
      grainPaused = document.hidden;
    });

    var gframe = 0;
    (function tickGrain() {
      if (!grainPaused) {
        gframe++;
        if (gframe % 3 === 0) {
          var d = gdata.data;
          for (var i = 0; i < d.length; i += 4) {
            var v = (Math.random() * 255) | 0;
            d[i] = d[i + 1] = d[i + 2] = v;
            d[i + 3] = 16;
          }
          gctx.putImageData(gdata, 0, 0);
        }
      }
      requestAnimationFrame(tickGrain);
    })();
  }

  /* ─── 4. Kinetic letter-settle — fires on scroll-into-view ───────────── */
  var settleTargets = document.querySelectorAll('.decade-heading, [data-letter-settle]');
  if (settleTargets.length) {
    settleTargets.forEach(function (el) {
      var text = el.textContent;
      if (!text.trim()) return;
      var chars = text.split('');
      el.setAttribute('aria-label', text);
      if (reduced) return;

      // Cap total stagger so even long headings finish in ≤300ms
      var maxDelay = 260;
      var step = chars.length > 1 ? maxDelay / (chars.length - 1) : 0;

      el.innerHTML = chars.map(function (c, i) {
        var escaped = c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c;
        var sp = c === ' ' ? '&nbsp;' : escaped;
        var delay = Math.round(i * step);
        return '<span class="ls-char" style="animation-delay:' + delay + 'ms;animation-play-state:paused" aria-hidden="true">' + sp + '</span>';
      }).join('');

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            el.querySelectorAll('.ls-char').forEach(function (span) {
              span.style.animationPlayState = 'running';
            });
            el.classList.add('ls-ready');
            io.unobserve(el);
          }
        });
      }, { threshold: 0.2 });
      io.observe(el);
    });
  }

  /* ─── 5. Cross-document view transition — clicked artwork → its page ──
     Stamps the shared name on the clicked thumbnail; the artwork page's main
     image carries the same name, so the browser morphs one into the other.
     (Replaced the old same-document startViewTransition code, which never
     survived the navigation and delayed every thumb click by 80ms.) */
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href*="artwork.html?id="], a[href*="/pages/art"]');
    if (!link) return;
    var img = link.querySelector('img');
    if (img) img.style.viewTransitionName = 'artwork-hero';
  }, true);

  /* ─── 6. Serendipity mode (S key / shake) ────────────────────────────── */
  (function () {
    var active   = false;
    var works    = null;
    var current  = 0;
    var timer    = null;
    var preloadImg = new Image();
    var overlay, serImg, serMeta;
    var focusTrap = null;

    var serendipityCatalogPath = (function () {
      var base = document.querySelector('base');
      if (base && base.href) return new URL('catalog-lite.json', base.href).href;
      var parts = location.pathname.replace(/\/[^/]*$/, '').split('/').filter(Boolean);
      var prefix = parts.length ? '../'.repeat(parts.length) : '';
      return prefix + 'catalog-lite.json';
    })();

    var catalogBase = serendipityCatalogPath.replace('catalog-lite.json', '');

    function buildOverlay() {
      overlay = document.createElement('div');
      overlay.id = 'jfsn-ser';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Serendipity — press Escape to close');
      var hintHTML = touch
        ? 'Tap to open &nbsp;·&nbsp; Swipe left to advance'
        : 'Click to open &nbsp;·&nbsp; <kbd>→</kbd> next &nbsp;·&nbsp; <kbd>S</kbd> or <kbd>Esc</kbd> to close';
      overlay.innerHTML =
        '<div id="jfsn-ser-bg" aria-hidden="true"></div>' +
        '<img id="jfsn-ser-img" alt="" />' +
        '<div id="jfsn-ser-meta" aria-live="polite"></div>' +
        '<button id="jfsn-ser-close" aria-label="Close serendipity mode">ESC</button>' +
        '<div id="jfsn-ser-hint">' + hintHTML + '</div>';
      document.body.appendChild(overlay);
      serImg  = document.getElementById('jfsn-ser-img');
      serMeta = document.getElementById('jfsn-ser-meta');

      var closeBtn = document.getElementById('jfsn-ser-close');
      closeBtn.addEventListener('click', closeMode);
      document.getElementById('jfsn-ser-bg').addEventListener('click', closeMode);
      serImg.addEventListener('click', function () {
        if (!works) return;
        var id = works[current].file ? works[current].file.replace('.avif', '') : null;
        if (!id) return;
        closeMode();
        window.location.href = catalogBase + 'artwork.html?id=' + id;
      });

      // Swipe left on overlay to advance (mobile)
      var swipeStartX = null;
      overlay.addEventListener('touchstart', function (e) {
        swipeStartX = e.touches[0].clientX;
      }, { passive: true });
      overlay.addEventListener('touchend', function (e) {
        if (swipeStartX === null) return;
        var dx = e.changedTouches[0].clientX - swipeStartX;
        swipeStartX = null;
        if (Math.abs(dx) < 40) return;
        if (dx < 0) {
          clearInterval(timer);
          advance();
          timer = setInterval(advance, 4800);
        }
      }, { passive: true });

      // Focus trap — keep Tab inside the dialog
      focusTrap = function (e) {
        if (e.key !== 'Tab') return;
        var focusable = overlay.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
        var first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      };
    }

    function preloadNext() {
      if (!works || works.length < 2) return;
      var next = works[(current + 1) % works.length];
      var src = catalogBase + 'artworks/' + next.file;
      preloadImg.src = src;
    }

    function showWork(w) {
      serImg.classList.remove('jfsn-ser-img-in');
      serMeta.classList.remove('jfsn-ser-meta-in');
      var fullSrc  = catalogBase + 'artworks/' + w.file;
      var thumbSrc = catalogBase + 'artworks/thumbs/' + w.file;
      serImg.src = fullSrc;
      serImg.alt = w.title || '';
      serImg.onerror = function () {
        if (serImg.src.indexOf('thumbs') === -1) serImg.src = thumbSrc;
      };
      serImg.onload = function () {
        serImg.classList.add('jfsn-ser-img-in');
        setTimeout(function () { serMeta.classList.add('jfsn-ser-meta-in'); }, 1400);
        preloadNext();
      };
      serMeta.innerHTML = (w.title || 'Untitled') + (w.year ? ' &nbsp;·&nbsp; ' + w.year : '');
    }

    function advance() {
      if (!works || !works.length) return;
      current = (current + 1) % works.length;
      showWork(works[current]);
    }

    function openMode() {
      if (active) return;
      var ae = document.activeElement;
      if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) return;
      active = true;
      if (!overlay) buildOverlay();
      overlay.classList.add('jfsn-ser-open');
      document.body.style.overflow = 'hidden';
      // Move focus into dialog, trap it
      setTimeout(function () {
        var closeBtn = document.getElementById('jfsn-ser-close');
        if (closeBtn) closeBtn.focus();
      }, 50);
      document.addEventListener('keydown', focusTrap);

      function startSlide() {
        current = Math.floor(Math.random() * works.length);
        showWork(works[current]);
        timer = setInterval(advance, 4800);
      }

      if (works) {
        startSlide();
      } else {
        fetch(serendipityCatalogPath)
          .then(function (r) { return r.json(); })
          .then(function (data) {
            works = data.slice();
            for (var i = works.length - 1; i > 0; i--) {
              var j = (Math.random() * (i + 1)) | 0;
              var tmp = works[i]; works[i] = works[j]; works[j] = tmp;
            }
            startSlide();
          })
          .catch(closeMode);
      }
    }

    function closeMode() {
      if (!active) return;
      active = false;
      clearInterval(timer);
      if (overlay) overlay.classList.remove('jfsn-ser-open');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', focusTrap);
    }

    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Escape' && active) { closeMode(); return; }
      if (active && (e.key === 'ArrowRight' || e.key === ' ')) {
        e.preventDefault();
        clearInterval(timer);
        advance();
        timer = setInterval(advance, 4800);
        return;
      }
      if (e.key === 's' || e.key === 'S') {
        if (active) closeMode(); else openMode();
      }
    });

    if (typeof DeviceMotionEvent !== 'undefined') {
      var lastShake = 0;
      window.addEventListener('devicemotion', function (e) {
        var acc = e.accelerationIncludingGravity;
        if (!acc) return;
        var mag = Math.abs(acc.x || 0) + Math.abs(acc.y || 0) + Math.abs(acc.z || 0);
        var now = Date.now();
        if (mag > 45 && now - lastShake > 2000) {
          lastShake = now;
          if (!active) openMode();
        }
      }, { passive: true });
    }
  })();

})();


/* ===== _shared/accent-transition.js ===== */
/* accent-transition.js — Color-cued page transitions
   When a link carries the destination work's own accent color
   (data-accent-color, set from chromatic.json's per-work bg), a wash of
   that color covers the screen before navigating, and fades back out on
   arrival — ties ordinary navigation into the sitewide chromatic motif
   instead of a colorless cut. Links without that attribute are completely
   untouched: this never invents a color where the page has no real data.
*/

(function () {
  'use strict';

  var STORE_KEY = 'jfsn-accent-transition';
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var overlay = null;

  function getOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'accent-transition-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;opacity:0;pointer-events:none;';
    document.body.appendChild(overlay);
    return overlay;
  }

  /* ── Arrival: if a color was staged just before this page loaded, wash it back out ── */
  if (!prefersReduced) {
    try {
      var staged = sessionStorage.getItem(STORE_KEY);
      if (staged) {
        sessionStorage.removeItem(STORE_KEY);
        var ov = getOverlay();
        ov.style.background = staged;
        ov.style.opacity = '1';
        if (window.anime) {
          anime({ targets: ov, opacity: [1, 0], duration: 380, easing: 'easeOutQuad', delay: 60 });
        } else {
          ov.style.opacity = '0';
        }
      }
    } catch (_) { /* sessionStorage unavailable — skip arrival fade */ }
  } else {
    try { sessionStorage.removeItem(STORE_KEY); } catch (_) {}
  }

  /* ── Departure: clicking a link with a known accent color washes the screen
     in that color, then navigates — capture phase so it pre-empts the
     site's other nav-interception scripts for these specific links only. ── */
  document.addEventListener('click', function (e) {
    if (prefersReduced) return;
    if (e.target.closest('.fc-peek')) return; // quick-preview button wins inside cards

    var link = e.target.closest('a[data-accent-color]');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href || link.target === '_blank' || link.hasAttribute('download') || link.hasAttribute('data-no-transition')) return;

    var color = link.getAttribute('data-accent-color');
    if (!color) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    try { sessionStorage.setItem(STORE_KEY, color); } catch (_) {}

    var ov = getOverlay();
    ov.style.background = color;

    if (window.anime) {
      var navigated = false;
      function go() {
        if (navigated) return;
        navigated = true;
        window.location.href = href;
      }
      anime.set(ov, { opacity: 0 });
      anime({ targets: ov, opacity: [0, 1], duration: 260, easing: 'easeOutQuad', complete: go });
      // anime's completion relies on requestAnimationFrame, which browsers
      // can suspend (e.g. the tab gets backgrounded right after the click) —
      // a plain setTimeout fallback can't stall the same way, so navigation
      // never hangs waiting on a tick that may not come for a while.
      setTimeout(go, 400);
    } else {
      ov.style.opacity = '1';
      window.location.href = href;
    }
  }, true);
})();


/* ===== _shared/chromatic-accent-wire.js ===== */
/* chromatic-accent-wire.js — Wires every artwork-bound link to that work's
   own chromatic color, sitewide.

   accent-transition.js already washes the screen in a work's real color
   before navigating to it, but only acts on links carrying
   data-accent-color. This script is what sets that attribute: it reads
   chromatic.json (each work's own extracted dominant color — no invented
   color, ever) and tags every <a href="artwork.html?id=..."> on the page,
   so the wash follows from wherever you click into the archive, not just
   artwork.html's prev/next links.

   Reuses window.__chromaticBgById if another script on the page already
   fetched chromatic.json (archive.html, artwork.html do); otherwise fetches
   it itself. A MutationObserver catches grids that render after this script
   runs (archive.html, index.html, favorites.html, wall.html,
   curatorial-map.html all build cards from an async catalog fetch).
*/

(function () {
  'use strict';

  function wire(map) {
    document.querySelectorAll('a[href*="artwork.html?id="]:not([data-accent-color])').forEach(function (a) {
      var m = a.getAttribute('href').match(/[?&]id=([^&]+)/);
      var color = m && map[m[1]];
      if (color) a.setAttribute('data-accent-color', color);
    });
  }

  function start(map) {
    wire(map);
    // MutationObserver callbacks already batch every mutation from a single
    // render pass into one call — wiring directly here (no rAF/setTimeout
    // debounce) avoids the throttling browsers apply to those timers in
    // background tabs, so a card someone opens without ever foregrounding
    // the tab still gets its accent color before they click it.
    new MutationObserver(function () { wire(map); })
      .observe(document.body, { childList: true, subtree: true });
  }

  if (window.__chromaticBgById) {
    start(window.__chromaticBgById);
    return;
  }

  fetch('/chromatic.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var map = window.__chromaticBgById || {};
      data.forEach(function (w) { if (w.id && w.bg) map[w.id] = w.bg; });
      window.__chromaticBgById = map;
      start(map);
    })
    .catch(function () { /* no chromatic data — links stay untouched, accent-transition.js no-ops gracefully */ });
})();


/* ===== _shared/ambient-chromatic-tint.js ===== */
/* ambient-chromatic-tint.js — A faint wash behind the page, tinted to the
   real average color of whichever works are currently scrolled into view.

   section-tints.css already gives each page type a fixed identity-color
   gradient, but it's a static, hand-picked color that fades out 320px down
   and never changes again. This is a second, independent layer: as you
   scroll from one decade or medium to the next, the room itself shifts
   through that span's true chromatic.json colors — the archive's own
   palette, not an invented mood color. Sits behind everything (z-index -1),
   low alpha, additive — it never replaces or fights the existing tint.

   Self-scoping: does nothing visible on pages with no artwork.html?id=
   links (about.html, editorial pages) since there's nothing real to
   average — no allowlist needed.
*/
(function () {
  'use strict';

  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
  }

  function averageColor(hexes) {
    var sum = { r: 0, g: 0, b: 0 }, n = 0;
    hexes.forEach(function (h) {
      var c = hexToRgb(h);
      if (!c) return;
      sum.r += c.r; sum.g += c.g; sum.b += c.b; n++;
    });
    if (!n) return null;
    return { r: Math.round(sum.r / n), g: Math.round(sum.g / n), b: Math.round(sum.b / n) };
  }

  function idFromHref(href) {
    var m = href && href.match(/[?&]id=([^&]+)/);
    return m && m[1];
  }

  function start(map) {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var overlay = document.createElement('div');
    overlay.id = 'ambient-chromatic-tint';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;' +
      'transition:background-color ' + (reduced ? '0.3s' : '1.4s') + ' ease;';
    document.body.insertBefore(overlay, document.body.firstChild);

    // The OS/browser chrome (mobile address bar) reads this meta tag — keep
    // it in sync with the same blend so the tint isn't confined to the page
    // itself. Stored once: each update blends from the page's true base
    // color, never from a previous (already-blended) value.
    var themeMeta = document.querySelector('meta[name="theme-color"]');
    var baseColor = themeMeta && hexToRgb(themeMeta.getAttribute('content'));

    var visible = new Set();

    function applyTint() {
      var hexes = [];
      visible.forEach(function (id) { if (map[id]) hexes.push(map[id]); });
      var avg = averageColor(hexes);
      var isDark = document.documentElement.classList.contains('dark');
      var alpha = isDark ? 0.06 : 0.1;
      overlay.style.backgroundColor = avg
        ? 'rgba(' + avg.r + ',' + avg.g + ',' + avg.b + ',' + alpha + ')'
        : 'transparent';

      if (themeMeta && baseColor) {
        var c = avg ? {
          r: Math.round(baseColor.r * (1 - alpha) + avg.r * alpha),
          g: Math.round(baseColor.g * (1 - alpha) + avg.g * alpha),
          b: Math.round(baseColor.b * (1 - alpha) + avg.b * alpha)
        } : baseColor;
        themeMeta.setAttribute('content', 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')');
      }
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = idFromHref(entry.target.getAttribute('href'));
        if (!id) return;
        if (entry.isIntersecting) visible.add(id); else visible.delete(id);
      });
      applyTint();
    }, { threshold: 0.2 });

    function observeAll() {
      document.querySelectorAll('a[href*="artwork.html?id="]').forEach(function (a) {
        if (a.__ambientObserved) return;
        a.__ambientObserved = true;
        io.observe(a);
      });
    }
    observeAll();

    // Catch grids that render after this script runs (archive.html,
    // index.html, wall.html etc. all build cards from an async catalog
    // fetch) — wiring directly here, no rAF/setTimeout debounce, so it
    // isn't subject to the throttling browsers apply to those timers in
    // background tabs.
    new MutationObserver(observeAll).observe(document.body, { childList: true, subtree: true });
  }

  if (window.__chromaticBgById) {
    start(window.__chromaticBgById);
    return;
  }

  fetch('/chromatic.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var map = window.__chromaticBgById || {};
      data.forEach(function (w) { if (w.id && w.bg) map[w.id] = w.bg; });
      window.__chromaticBgById = map;
      start(map);
    })
    .catch(function () { /* no chromatic data — overlay never colors, stays fully transparent */ });
})();


/* ===== _shared/chromatic-position-strip.js ===== */
/* chromatic-position-strip.js — A slim, fixed color strip (reusing
   chromatic.json) showing where the works on THIS page fall across
   1974-present, with a marker that tracks whichever works are currently
   scrolled into view. Click a point to jump to that decade in the full
   archive.

   Sitewide companion to archive.html's own archive-river.js, which has
   richer in-page filter integration this generic version doesn't need.
   Self-scoping: skips entirely if archive-river-bar already exists (i.e.
   on archive.html), or if the page has no dated works to map.
*/
(function () {
  'use strict';

  if (document.getElementById('archive-river-bar')) return; // archive.html has its own, richer version

  function decadeOf(year) { return Math.floor(year / 10) * 10; }

  function idFromHref(href) {
    var m = href && href.match(/[?&]id=([^&]+)/);
    return m && m[1];
  }

  function buildStyles() {
    if (document.getElementById('cps-styles')) return;
    var s = document.createElement('style');
    s.id = 'cps-styles';
    s.textContent =
      '#cps-bar{position:fixed;left:0;right:0;z-index:35;background:#fcf9f3;border-bottom:1px solid #c4c7c7;}' +
      '#cps-wrap{position:relative;cursor:pointer;}' +
      '#cps-canvas{display:block;width:100%;height:20px;}' +
      '#cps-marker{position:absolute;top:0;height:100%;border:2px solid rgba(11,11,11,0.55);box-sizing:border-box;pointer-events:none;mix-blend-mode:difference;}' +
      '#cps-label{position:absolute;top:100%;transform:translateX(-50%);font-family:Inter,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#575757;background:#fcf9f3;border:1px solid #c4c7c7;padding:2px 6px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity 0.15s ease;margin-top:2px;}' +
      '#cps-label.cps-label--visible{opacity:1;}' +
      '@media(prefers-reduced-motion:reduce){#cps-marker,#cps-label{transition:none;}}' +
      '@media(max-width:768px){#cps-bar{display:none;}}' +
      'html.dark #cps-bar,html.dark #cps-label{background:#1a1a1a;border-color:#404040;color:#a8a8a8;}';
    document.head.appendChild(s);
  }

  function buildBar() {
    var header = document.querySelector('header');
    var bcBar  = document.getElementById('breadcrumb-navigation');
    var anchor = bcBar || header;
    if (!anchor) return null;

    var bar = document.createElement('div');
    bar.id = 'cps-bar';
    bar.innerHTML =
      '<div id="cps-wrap" role="img" aria-label="Chromatic position map of works on this page across 1974 to present. Click a point to view that decade in the archive.">' +
        '<canvas id="cps-canvas"></canvas>' +
        '<div id="cps-marker"></div>' +
        '<div id="cps-label"></div>' +
      '</div>';
    anchor.insertAdjacentElement('afterend', bar);

    var topOffset = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
    if (bcBar) topOffset += Math.ceil(bcBar.getBoundingClientRect().height);
    bar.style.top = topOffset + 'px';

    var main = document.querySelector('main');
    if (main) {
      var currentPaddingTop = window.getComputedStyle(main).paddingTop;
      main.style.paddingTop = 'calc(' + currentPaddingTop + ' + 32px)';
    }
    return bar;
  }

  function init(data) {
    var sorted = data.filter(function (w) { return w.year; }).sort(function (a, b) { return a.year - b.year; });
    var total = sorted.length;
    if (!total) return;

    var byId = {};
    sorted.forEach(function (w) { byId[w.id] = w; });

    var decadeRanges = {};
    sorted.forEach(function (w, i) {
      var d = decadeOf(w.year);
      if (!decadeRanges[d]) decadeRanges[d] = { start: i, end: i, decade: d };
      decadeRanges[d].end = i;
    });

    buildStyles();
    var bar = buildBar();
    if (!bar) return;

    var wrap   = document.getElementById('cps-wrap');
    var canvas = document.getElementById('cps-canvas');
    var marker = document.getElementById('cps-marker');
    var label  = document.getElementById('cps-label');

    function draw() {
      var W = wrap.clientWidth;
      var dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, W * dpr);
      canvas.height = 20 * dpr;
      canvas.style.width = W + 'px';
      var ctx = canvas.getContext('2d');
      var sliceW = canvas.width / total;
      sorted.forEach(function (w, i) {
        ctx.fillStyle = w.bg || '#8e7164';
        ctx.fillRect(Math.floor(i * sliceW), 0, Math.ceil(sliceW) + 1, canvas.height);
      });
    }
    draw();
    window.addEventListener('resize', draw, { passive: true });

    function rangeToPct(range) {
      return {
        left: (range.start / total) * 100,
        width: Math.max((((range.end - range.start + 1) / total) * 100), (1 / total) * 100)
      };
    }

    var currentLabelDecade = null;
    function showLabel(decade, pct) {
      currentLabelDecade = decade;
      label.textContent = decade + 's';
      label.style.left = (pct.left + pct.width / 2) + '%';
      label.classList.add('cps-label--visible');
    }

    // The one decade with nothing documented (master-notes §20/§23/§24):
    // instead of arriving the same as every other smooth, confident
    // transition, the marker hesitates and dims partway through whenever
    // it crosses into or out of the gap.
    var GAP_DECADE = 1980;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var activeDecade = null;

    function moveMarkerTo(range) {
      var pct = rangeToPct(range);
      var isGap = range.decade === GAP_DECADE;
      var wasGap = activeDecade === GAP_DECADE;

      if (reducedMotion || typeof anime === 'undefined') {
        marker.style.left = pct.left + '%';
        marker.style.width = pct.width + '%';
      } else if (isGap || wasGap) {
        var curLeft = parseFloat(marker.style.left) || pct.left;
        var midLeft = curLeft + (pct.left - curLeft) * 0.55;
        anime.timeline({ easing: 'easeInOutQuad' })
          .add({ targets: marker, left: midLeft + '%', width: pct.width + '%', duration: 260 })
          .add({ targets: marker, opacity: [1, 0.3, 1], duration: 260 })
          .add({ targets: marker, left: pct.left + '%', duration: 240 });
      } else {
        anime({ targets: marker, left: pct.left + '%', width: pct.width + '%', duration: 420, easing: 'easeOutCubic' });
      }

      activeDecade = range.decade;
      if (range.decade != null && range.decade !== currentLabelDecade) showLabel(range.decade, pct);
      // Live nav accent — same data, no invented color. CSS eases the change.
      var repColor = sorted[range.start] && sorted[range.start].bg;
      if (repColor) document.documentElement.style.setProperty('--nav-accent', repColor);
    }

    canvas.addEventListener('click', function (e) {
      var rect = canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var idx = Math.max(0, Math.min(total - 1, Math.floor((x / rect.width) * total)));
      var d = decadeOf(sorted[idx].year);
      window.location.href = 'archive.html?decade=' + d + 's';
    });

    // ── Track which works on THIS page are currently scrolled into view ──
    var visibleYears = new Map();

    function updateFromVisible() {
      if (!visibleYears.size) return;
      // Mode, not mean — see archive-river.js for why averaging raw years is wrong here.
      var counts = {};
      visibleYears.forEach(function (y) {
        var d = decadeOf(y);
        counts[d] = (counts[d] || 0) + 1;
      });
      var bestDecade = null, bestCount = -1;
      Object.keys(counts).forEach(function (d) {
        if (counts[d] > bestCount) { bestCount = counts[d]; bestDecade = parseInt(d, 10); }
      });
      var r = decadeRanges[bestDecade];
      if (r) moveMarkerTo({ start: r.start, end: r.end, decade: bestDecade });
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = idFromHref(entry.target.getAttribute('href'));
        var w = id && byId[id];
        if (!w) return;
        if (entry.isIntersecting) visibleYears.set(entry.target, w.year);
        else visibleYears.delete(entry.target);
      });
      updateFromVisible();
    }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });

    function observeAll() {
      document.querySelectorAll('a[href*="artwork.html?id="]').forEach(function (a) {
        if (a.__cpsObserved) return;
        a.__cpsObserved = true;
        io.observe(a);
      });
    }
    observeAll();
    new MutationObserver(observeAll).observe(document.body, { childList: true, subtree: true });

    // Initial state — full-range until scroll-tracking finds something in view.
    moveMarkerTo({ start: 0, end: total - 1, decade: null });
  }

  fetch('/chromatic.json')
    .then(function (r) { return r.json(); })
    .then(init)
    .catch(function () { /* no chromatic data — strip never appears */ });
})();


/* ===== _shared/chromatic-lazy-tint.js ===== */
/* chromatic-lazy-tint.js — Replaces the generic shimmer placeholder with
   each work's own chromatic.json color, so the "loading" state is already
   a true (if blurred-by-absence) preview of the work's tone instead of a
   content-free shimmer. Matches the convention already baked into decade
   pages at build time (.thumb__link style="background-color:#xxxxxx") —
   this just brings it, live, to every other page that doesn't have it
   pre-rendered (archive.html, index.html, theme pages, wall.html,
   favorites.html, series.html, curatorial-map.html).

   Sets --lazy-tint as a CSS custom property on each <img> inside an
   artwork.html?id= link; _shared/lazy-load.css's shimmer reads it with a
   transparent fallback, so untagged images are pixel-identical to before.
*/
(function () {
  'use strict';

  function idFromHref(href) {
    var m = href && href.match(/[?&]id=([^&]+)/);
    return m && m[1];
  }

  function tint(map) {
    document.querySelectorAll('a[href*="artwork.html?id="] img').forEach(function (img) {
      if (img.style.getPropertyValue('--lazy-tint')) return;
      var a = img.closest('a[href*="artwork.html?id="]');
      var id = a && idFromHref(a.getAttribute('href'));
      var color = id && map[id];
      if (color) img.style.setProperty('--lazy-tint', color);
    });
  }

  function start(map) {
    tint(map);
    new MutationObserver(function () { tint(map); })
      .observe(document.body, { childList: true, subtree: true });
  }

  if (window.__chromaticBgById) {
    start(window.__chromaticBgById);
    return;
  }

  fetch('/chromatic.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var map = window.__chromaticBgById || {};
      data.forEach(function (w) { if (w.id && w.bg) map[w.id] = w.bg; });
      window.__chromaticBgById = map;
      start(map);
    })
    .catch(function () { /* no chromatic data — placeholders stay generic */ });
})();


/* ===== _shared/click-feedback.js ===== */
/* click-feedback.js — A tactile scale-pulse on click for controls that
   currently rely on hover-only CSS transitions and otherwise give no
   feedback at the moment of the click itself: bracket-links
   ("[ Back to Archive ]" etc.), the footer back-to-top controls, and the
   floating home button.

   Reuses the exact pulse already established for archive's filter chips
   (scale 1→1.05→1, 300ms easeOutQuad — see _shared/archive-animations.js)
   rather than inventing a third click-feedback mechanism.
*/
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SELECTOR = '.bracket-link, #back-to-top, #btt-float, #floating-home-btn';

  document.addEventListener('click', function (e) {
    if (typeof anime === 'undefined') return;
    var el = e.target.closest(SELECTOR);
    if (!el) return;
    anime({ targets: el, scale: [1, 1.05, 1], duration: 300, easing: 'easeOutQuad' });
  });
})();


/* ===== _shared/micro-interactions.js ===== */
/* micro-interactions.js — Phase 3: Delighter animations and feedback
   - Grid entrance stagger
   - Filter chip pulse feedback
   - Button press feedback
   - Copy-to-clipboard toast
   - Related works auto-scroll
*/

(function() {
  'use strict';

  /* ─── Grid Entrance Stagger ─────────────────────────────────────────────── */
  function setupGridStagger() {
    var grids = [
      document.getElementById('works-grid'),
      document.getElementById('series-grid'),
      document.getElementById('collage-grid'),
      document.getElementById('sculpture-grid'),
      document.getElementById('photography-grid'),
      document.getElementById('painting-grid')
    ];

    grids.forEach(function(grid) {
      if (!grid) return;

      // Set stagger index on each child
      var children = grid.querySelectorAll('.thumb, [class*="card"]');
      children.forEach(function(child, index) {
        child.style.setProperty('--stagger-index', index);
      });
    });
  }

  /* ─── Filter Chip Pulse Feedback ────────────────────────────────────────── */
  function setupFilterChipFeedback() {
    var filterChips = document.querySelectorAll('.filter-chip button');
    filterChips.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var chip = btn.closest('.filter-chip');
        if (chip) {
          chip.classList.add('applying');
          setTimeout(function() {
            chip.classList.remove('applying');
          }, 400);
        }
      });
    });
  }

  /* ─── Copy to Clipboard Toast ────────────────────────────────────────────── */
  function showToast(message) {
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function() {
      toast.classList.add('exiting');
      setTimeout(function() {
        toast.remove();
      }, 300);
    }, 2000);
  }

  window.showToast = showToast; // Expose for artwork.html

  // Setup copy-to-clipboard on artwork pages
  function setupArtworkShare() {
    var shareBtn = document.getElementById('artwork-share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function() {
            showToast('Copied to clipboard');
          }).catch(function() {
            showToast('Failed to copy');
          });
        } else {
          // Fallback for older browsers
          var input = document.createElement('input');
          input.value = url;
          document.body.appendChild(input);
          input.select();
          try {
            document.execCommand('copy');
            showToast('Copied to clipboard');
          } catch (err) {
            showToast('Failed to copy');
          }
          document.body.removeChild(input);
        }
      });
    }
  }

  /* ─── Related Works on Artwork Pages ────────────────────────────────────── */
  function setupRelatedWorks() {
    var relatedGrid = document.getElementById('related-works-grid');
    if (!relatedGrid) return;

    // Get current artwork ID from URL
    var url = new URL(window.location);
    var currentId = url.searchParams.get('id');
    if (!currentId) return;

    // Fetch catalog to find related works
    fetch('/catalog-lite.json')
      .then(function(r) { return r.json(); })
      .then(function(works) {
        // Find current work
        var current = works.find(function(w) { return w.file === currentId; });
        if (!current) return;

        // Find related works: same series, medium, or decade
        var related = works.filter(function(w) {
          if (w.file === currentId) return false; // Exclude self
          if (current.series && w.series === current.series) return true; // Same series
          if (w.work_type === current.work_type) return true; // Same medium
          if (w.year === current.year) return true; // Same decade
          return false;
        }).slice(0, 8); // Limit to 8

        // Populate grid
        relatedGrid.innerHTML = '';
        related.forEach(function(work, idx) {
          var img = work.file + '.avif';
          var html = '<a href="artwork.html?id=' + work.file + '" class="thumb" style="--stagger-index:' + idx + ';">' +
            '<div class="thumb__link" style="display:block;position:relative;cursor:zoom-in;"> ' +
            '<img src="artworks/medium/' + img + '" alt="' + (work.title || 'Untitled') + '" loading="lazy" style="width:100%;height:auto;display:block;"> ' +
            '</div>' +
            '<div class="thumb__caption" style="padding:8px;font-family:Inter,sans-serif;font-size:13px;color:#0B0B0B;"> ' +
            '<a href="artwork.html?id=' + work.file + '" style="color:inherit;text-decoration:none;">' + (work.title || 'Untitled') + '</a>' +
            '<br><span style="color:#575757;font-size:11px;">' + (work.year_display || work.year) + '</span>' +
            '</div>' +
            '</a>';
          var li = document.createElement('li');
          li.innerHTML = html;
          li.style.listStyle = 'none';
          relatedGrid.appendChild(li);
        });

        // Re-setup stagger for related works
        setupGridStagger();
      })
      .catch(function(e) {
        console.log('Related works load error:', e);
        relatedGrid.style.display = 'none';
      });
  }

  /* ─── Phase 5: Scroll-Reveal Animations ────────────────────────────────────── */
  function setupScrollReveal() {
    var revealElements = document.querySelectorAll('.reveal-section');
    if (revealElements.length === 0) return;

    // Resilience fallback: the hidden state is JS-gated (.js .reveal-section in
    // ui.css), so if IntersectionObserver is unavailable we must reveal
    // everything immediately or the content would stay permanently hidden.
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function(el) { el.classList.add('revealed'); });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  /* ─── Phase 5: Hero Parallax Effect ────────────────────────────────────── */
  function setupHeroParallax() {
    var heroImages = document.querySelectorAll('.hero-parallax-image');
    if (heroImages.length === 0) return;

    window.addEventListener('scroll', function() {
      heroImages.forEach(function(img) {
        var scrolled = window.pageYOffset;
        var parent = img.closest('.hero-parallax');
        if (!parent) return;

        var rect = parent.getBoundingClientRect();
        var offset = rect.top / 10; // Subtle parallax: 1/10 of scroll
        img.style.transform = 'translateY(' + offset + 'px) scale(1.05)';
      });
    }, { passive: true });
  }

  /* ─── Phase 5: Search Result Highlighting ────────────────────────────────── */
  function setupSearchHighlighting() {
    var searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
      var query = this.value.toLowerCase();
      var results = document.querySelectorAll('[data-searchable]');

      results.forEach(function(result) {
        var text = result.textContent.toLowerCase();
        if (query && !text.includes(query)) {
          result.classList.add('search-result-nomatch');
          result.classList.remove('search-result-glow');
        } else if (query) {
          result.classList.remove('search-result-nomatch');
          result.classList.add('search-result-glow');
        } else {
          result.classList.remove('search-result-nomatch', 'search-result-glow');
        }
      });
    });
  }

  /* ─── Phase 5: Page Transition Fade ────────────────────────────────────── */
  function setupPageTransitions() {
    var navLinks = document.querySelectorAll('a[href*=".html"]');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (link.target === '_blank' || link.hasAttribute('download')) return;

        var href = this.href;
        if (href.includes('#')) return; // Skip anchor links

        e.preventDefault();
        document.documentElement.classList.add('page-transition');

        setTimeout(function() {
          window.location.href = href;
        }, 300);
      });
    });
  }

  /* ─── Phase 5: Lazy Load Image Fade-In ────────────────────────────────── */
  function setupLazyLoadFadeIn() {
    var images = document.querySelectorAll('img[loading="lazy"]');

    images.forEach(function(img) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var image = entry.target;
            image.classList.add('lazy-loaded');

            // Fade in on load
            image.addEventListener('load', function() {
              this.style.opacity = '0';
              this.style.transition = 'opacity 0.4s ease';
              setTimeout(function() {
                image.style.opacity = '1';
              }, 50);
            }, { once: true });

            observer.unobserve(image);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(img);
    });
  }

  /* ─── Phase 5: Bookmark Management (LocalStorage) ────────────────────────── */
  window.toggleBookmark = function(workId) {
    var bookmarks = JSON.parse(localStorage.getItem('jfsn-bookmarks') || '[]');
    var idx = bookmarks.indexOf(workId);

    if (idx > -1) {
      bookmarks.splice(idx, 1);
      showToast('Removed from bookmarks');
    } else {
      bookmarks.push(workId);
      showToast('Added to bookmarks');
    }

    localStorage.setItem('jfsn-bookmarks', JSON.stringify(bookmarks));
    updateBookmarkUI(workId);
  };

  function updateBookmarkUI(workId) {
    var bookmarks = JSON.parse(localStorage.getItem('jfsn-bookmarks') || '[]');
    var btn = document.querySelector('[data-bookmark-id="' + workId + '"]');
    if (btn) {
      if (bookmarks.includes(workId)) {
        btn.classList.add('bookmarked');
        btn.innerHTML = '♥';
      } else {
        btn.classList.remove('bookmarked');
        btn.innerHTML = '♡';
      }
    }
  }

  /* ─── Phase 6: Collapsible Filter Sections ────────────────────────────────── */
  function setupCollapsibleFilters() {
    var headers = document.querySelectorAll('.filter-section-header');
    headers.forEach(function(header) {
      header.addEventListener('click', function() {
        var section = this.closest('.filter-section');
        var toggle = section.querySelector('.filter-section-toggle');
        var content = section.querySelector('.filter-section-content');

        if (content.classList.contains('collapsed')) {
          content.classList.remove('collapsed');
          toggle.classList.remove('collapsed');
        } else {
          content.classList.add('collapsed');
          toggle.classList.add('collapsed');
        }
      });
    });
  }

  /* ─── Phase 6: View Mode Toggle ────────────────────────────────────────── */
  window.switchViewMode = function(mode) {
    var grid = document.getElementById('works-grid');
    if (!grid) return;

    grid.classList.remove('grid-view', 'list-view', 'masonry-view');
    grid.classList.add(mode + '-view');

    // Update button states
    var buttons = document.querySelectorAll('.view-toggle button');
    buttons.forEach(function(btn) {
      btn.classList.remove('active');
      if (btn.dataset.mode === mode) {
        btn.classList.add('active');
      }
    });

    localStorage.setItem('jfsn-view-mode', mode);
  };

  // Restore view mode from localStorage
  function restoreViewMode() {
    var mode = localStorage.getItem('jfsn-view-mode') || 'grid';
    window.switchViewMode(mode);
  }

  /* ─── Phase 6: Color Filter Tags ───────────────────────────────────────── */
  window.toggleColorFilter = function(colorValue) {
    var swatch = document.querySelector('[data-color="' + colorValue + '"]');
    if (swatch) {
      swatch.classList.toggle('active');
      var colors = [];
      document.querySelectorAll('.color-swatch.active').forEach(function(s) {
        colors.push(s.dataset.color);
      });
      localStorage.setItem('jfsn-color-filters', JSON.stringify(colors));
      filterByColor(colors);
    }
  };

  function filterByColor(colors) {
    if (colors.length === 0) {
      document.querySelectorAll('[data-work-color]').forEach(function(el) {
        el.style.display = '';
      });
      return;
    }

    document.querySelectorAll('[data-work-color]').forEach(function(el) {
      var workColor = el.getAttribute('data-work-color');
      el.style.display = colors.includes(workColor) ? '' : 'none';
    });
  }

  /* ─── Phase 6: Smart Shortcuts Hint ────────────────────────────────────── */
  function setupShortcutsHint() {
    var hint = document.querySelector('.shortcuts-hint');
    if (!hint) return;

    // Hide hint after 5 seconds, show on hover
    var hideTimer;
    function autoHide() {
      hideTimer = setTimeout(function() {
        hint.style.opacity = '0.5';
      }, 5000);
    }

    hint.addEventListener('mouseenter', function() {
      clearTimeout(hideTimer);
      this.style.opacity = '1';
    });

    hint.addEventListener('mouseleave', function() {
      autoHide();
    });

    autoHide();
  }

  /* ─── Phase 7: Reading History ────────────────────────────────────────────── */
  window.addToViewingHistory = function(workId, title) {
    var history = JSON.parse(localStorage.getItem('jfsn-viewing-history') || '[]');

    // Remove if already in history
    history = history.filter(function(item) { return item.id !== workId; });

    // Add to front
    history.unshift({
      id: workId,
      title: title,
      timestamp: new Date().toISOString()
    });

    // Keep last 20
    history = history.slice(0, 20);

    localStorage.setItem('jfsn-viewing-history', JSON.stringify(history));
  };

  function getViewingHistory() {
    return JSON.parse(localStorage.getItem('jfsn-viewing-history') || '[]');
  }

  /* ─── Phase 7: Enhanced Keyboard Shortcuts ──────────────────────────────── */
  function setupEnhancedShortcuts() {
    // DISABLED: Keyboard shortcuts modal has critical bug (auto-opens, won't close)
    // Feature disabled in Session 67 pending proper consolidation
    // See: session67_critical_fix.md for details
    //
    // Remaining: Previous work (P), Next work (N), Toggle view mode (V), Bookmark (B)
    // Disabled: Show shortcuts (? key) — modal had no close functionality

    document.addEventListener('keydown', function(e) {
      if (e.key === 'p' || e.key === 'P') {
        var prevLink = document.getElementById('prev-link');
        if (prevLink) prevLink.click();
      }

      // Next work (N key)
      if (e.key === 'n' || e.key === 'N') {
        var nextLink = document.getElementById('next-link');
        if (nextLink) nextLink.click();
      }

      // Toggle view mode (V key on archive)
      if (e.key === 'v' || e.key === 'V') {
        var modes = ['grid', 'list', 'masonry'];
        var current = localStorage.getItem('jfsn-view-mode') || 'grid';
        var idx = modes.indexOf(current);
        var next = modes[(idx + 1) % modes.length];
        window.switchViewMode(next);
      }

      // Bookmark (B key on artwork)
      if (e.key === 'b' || e.key === 'B') {
        var url = new URL(window.location);
        var workId = url.searchParams.get('id');
        if (workId) window.toggleBookmark(workId);
      }

      // DISABLED: Show shortcuts (? key) — incomplete implementation
      // if (e.shiftKey && e.key === '?') {
      //   e.preventDefault();
      //   var modal = document.getElementById('shortcuts-modal');
      //   if (modal) modal.style.display = 'block';
      // }
    });
  }

  /* ─── Phase 7: Touch Gestures ────────────────────────────────────────────── */
  function setupTouchGestures() {
    var touchStartX = 0;
    var touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, false);

    function handleSwipe() {
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) < 50) return; // Minimum swipe distance

      if (diff > 0) {
        // Swiped left → next
        var nextLink = document.getElementById('next-link');
        if (nextLink) nextLink.click();
      } else {
        // Swiped right → previous
        var prevLink = document.getElementById('prev-link');
        if (prevLink) prevLink.click();
      }
    }
  }

  /* ─── Phase 7: ARIA Live Announcements ──────────────────────────────────── */
  window.announceToScreenReader = function(message) {
    var announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-9999px';
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(function() {
      document.body.removeChild(announcement);
    }, 1000);
  };

  /* ─── Phase 8: Scroll-to-Top Button ────────────────────────────────────── */
  function setupScrollToTop() {
    var btn = document.getElementById('scroll-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ─── Phase 8: Animated Counters ────────────────────────────────────────── */
  window.animateCounter = function(element, target, duration) {
    duration = duration || 2000;
    var start = parseInt(element.textContent) || 0;
    var increment = (target - start) / (duration / 16);
    var current = start;

    var timer = setInterval(function() {
      current += increment;
      if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toLocaleString();
    }, 16);
  };

  // Auto-animate counters on page load
  function setupAnimatedCounters() {
    var counters = document.querySelectorAll('.counter[data-count]');
    counters.forEach(function(counter) {
      var target = parseInt(counter.getAttribute('data-count'));
      animateCounter(counter, target);
    });
  }

  /* ─── Phase 8: Progress Bar Manager ────────────────────────────────────── */
  window.showProgress = function(percentage) {
    var fill = document.querySelector('.progress-fill');
    if (!fill) return;
    fill.style.width = percentage + '%';
  };

  window.completeProgress = function() {
    var fill = document.querySelector('.progress-fill');
    if (!fill) return;
    fill.style.width = '100%';
    fill.classList.add('complete');
  };

  /* ─── Phase 8: Sticky Footer Actions ────────────────────────────────────── */
  window.showStickyFooter = function(show) {
    var footer = document.querySelector('.sticky-footer-actions');
    if (!footer) return;
    if (show) {
      footer.classList.add('visible');
    } else {
      footer.classList.remove('visible');
    }
  };

  /* ─── Phase 8: Form Input Enhancement ────────────────────────────────────── */
  function setupFormEnhancements() {
    var inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach(function(input) {
      // Show success state on valid input
      input.addEventListener('input', function() {
        if (this.hasAttribute('required') && this.value.trim()) {
          this.removeAttribute('aria-invalid');
        }
      });

      // Validation on blur
      input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
          this.setAttribute('aria-invalid', 'true');
        }
      });
    });
  }

  /* ─── Phase 9: Real-time Search Suggestions ────────────────────────────────── */
  function setupSearchSuggestions() {
    var searchInput = document.querySelector('.search-input');
    var suggestionsBox = document.querySelector('.search-suggestions');
    if (!searchInput || !suggestionsBox) return;

    var works = []; // Will be populated from catalog-lite.json
    fetch('/catalog-lite.json')
      .then(function(res) { return res.json(); })
      .then(function(data) { works = data; })
      .catch(function() {});

    searchInput.addEventListener('input', function() {
      var query = this.value.toLowerCase().trim();
      if (query.length < 2) {
        suggestionsBox.classList.remove('visible');
        return;
      }

      var matches = works.filter(function(work) {
        return work.title.toLowerCase().includes(query) ||
               work.keywords.toLowerCase().includes(query);
      }).slice(0, 8);

      if (matches.length === 0) {
        suggestionsBox.classList.remove('visible');
        return;
      }

      suggestionsBox.innerHTML = matches.map(function(work) {
        return '<div class="search-suggestion-item" data-id="' + work.file + '">' +
               work.title.replace(new RegExp(query, 'gi'), '<strong>$&</strong>') +
               '</div>';
      }).join('');

      suggestionsBox.querySelectorAll('.search-suggestion-item').forEach(function(item) {
        item.addEventListener('click', function() {
          window.location.href = '/artwork.html?id=' + this.dataset.id;
        });
      });

      suggestionsBox.classList.add('visible');
    });

    document.addEventListener('click', function(e) {
      if (e.target !== searchInput) {
        suggestionsBox.classList.remove('visible');
      }
    });
  }

  /* ─── Phase 9: Filter Persistence ──────────────────────────────────────────── */
  function setupFilterPersistence() {
    var filters = document.querySelectorAll('.filter-chip input[type="checkbox"]');
    var filterKey = 'jfsn-active-filters';

    // Load saved filters
    var saved = JSON.parse(localStorage.getItem(filterKey) || '{}');
    filters.forEach(function(checkbox) {
      if (saved[checkbox.value]) {
        checkbox.checked = true;
      }
    });

    // Save on change
    filters.forEach(function(checkbox) {
      checkbox.addEventListener('change', function() {
        saved[this.value] = this.checked;
        localStorage.setItem(filterKey, JSON.stringify(saved));
      });
    });

    // Quick preset buttons
    var presetBtns = document.querySelectorAll('.filter-preset-btn');
    presetBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var preset = this.dataset.preset;
        filters.forEach(function(checkbox) {
          checkbox.checked = false;
        });
        if (preset !== 'all') {
          filters.forEach(function(checkbox) {
            if (checkbox.value === preset) checkbox.checked = true;
          });
        }
        // Update localStorage
        var newFilters = {};
        filters.forEach(function(checkbox) {
          if (checkbox.checked) newFilters[checkbox.value] = true;
        });
        localStorage.setItem(filterKey, JSON.stringify(newFilters));
        presetBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });
  }

  /* ─── Phase 9: Quick Preview Modal ────────────────────────────────────────── */
  function setupQuickPreview() {
    var thumbs = document.querySelectorAll('.thumb, [data-artwork-id]');
    var modal = document.querySelector('.quick-preview-modal');
    var closeBtn = document.querySelector('.quick-preview-close');
    var content = document.querySelector('.quick-preview-content');
    if (!modal) return;

    thumbs.forEach(function(thumb) {
      thumb.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        var workId = this.dataset.artworkId || this.querySelector('img').src.match(/art(\d+)/)?.[1];
        if (!workId) return;

        fetch('/catalog-lite.json')
          .then(function(res) { return res.json(); })
          .then(function(data) {
            var work = data.find(function(w) { return w.file === 'art' + workId; });
            if (work) {
              content.innerHTML = '<div class="quick-preview-header"><h3>' + work.title + '</h3>' +
                '<p>' + work.year + ' · ' + work.work_type + '</p>' +
                '<p>' + work.dimensions + '</p></div>' +
                '<img src="/artworks/thumb/' + work.file + '.avif" style="width:100%; height:auto;" />' +
                '<p style="padding:16px;">' + work.description + '</p>' +
                '<a href="/artwork.html?id=' + work.file + '" style="display:block; padding:12px 16px; background:#FF6600; color:#fcf9f3; text-decoration:none; text-align:center;">View Full</a>';
              modal.classList.add('visible');
            }
          })
          .catch(function() {});
      });
    });

    closeBtn?.addEventListener('click', function() {
      modal.classList.remove('visible');
    });

    modal?.addEventListener('click', function(e) {
      if (e.target === this) this.classList.remove('visible');
    });
  }

  /* ─── Phase 9: Dominant Color Backdrop ────────────────────────────────────── */
  function setupDominantColorBackdrops() {
    var images = document.querySelectorAll('.image-with-backdrop img');
    images.forEach(function(img) {
      img.addEventListener('load', function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = 1;
        canvas.height = 1;
        ctx.drawImage(this, 0, 0, 1, 1);
        var imageData = ctx.getImageData(0, 0, 1, 1).data;
        var color = 'rgb(' + imageData[0] + ', ' + imageData[1] + ', ' + imageData[2] + ')';
        this.parentElement.style.backgroundColor = color;
      });
    });
  }

  /* ─── Phase 9: Sort Options Manager ────────────────────────────────────────── */
  function setupSortOptions() {
    var sortBtns = document.querySelectorAll('.sort-btn');
    var grid = document.getElementById('works-grid');
    if (!grid) return;

    sortBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        sortBtns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');

        var sortBy = this.dataset.sort;
        var items = Array.from(grid.querySelectorAll('.thumb'));

        items.sort(function(a, b) {
          switch(sortBy) {
            case 'recent': return b.dataset.year - a.dataset.year;
            case 'oldest': return a.dataset.year - b.dataset.year;
            case 'title-az': return a.dataset.title.localeCompare(b.dataset.title);
            case 'title-za': return b.dataset.title.localeCompare(a.dataset.title);
            default: return 0;
          }
        });

        items.forEach(function(item) { grid.appendChild(item); });
        setupGridStagger(); // Re-stagger after sort
      });
    });
  }

  /* ─── Phase 10: Statistics Dashboard ────────────────────────────────────── */
  function setupStatisticsDashboard() {
    var dashboard = document.querySelector('.stats-dashboard');
    if (!dashboard) return;

    fetch('/catalog-lite.json')
      .then(function(res) { return res.json(); })
      .then(function(works) {
        var decades = {};
        var mediums = {};
        works.forEach(function(work) {
          var decade = work.year || 'Unknown';
          decades[decade] = (decades[decade] || 0) + 1;
          var medium = work.work_type || 'Other';
          mediums[medium] = (mediums[medium] || 0) + 1;
        });

        var html = '<div class="stat-card">' +
          '<div class="stat-value stat-number">' + works.length + '</div>' +
          '<span class="stat-label">Total Works</span></div>' +
          '<div class="stat-card">' +
          '<div class="stat-value stat-number">' + Object.keys(decades).length + '</div>' +
          '<span class="stat-label">Time Periods</span></div>' +
          '<div class="stat-card">' +
          '<div class="stat-value stat-number">' + Object.keys(mediums).length + '</div>' +
          '<span class="stat-label">Media Types</span></div>' +
          '<div class="stat-card">' +
          '<div class="stat-value stat-number">' + (works.filter(function(w) { return w.favorite; }).length || 0) + '</div>' +
          '<span class="stat-label">Favorites</span></div>';

        dashboard.innerHTML = html;

        // Animate stat numbers on scroll
        var statCards = dashboard.querySelectorAll('.stat-card');
        statCards.forEach(function(card) {
          var observer = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) {
              var num = card.querySelector('.stat-number');
              if (num) {
                num.classList.add('stat-pulse');
                var target = parseInt(num.textContent);
                animateCounter(num, target, 1500);
              }
              observer.unobserve(card);
            }
          });
          observer.observe(card);
        });
      })
      .catch(function() {});
  }

  /* ─── Phase 10: Timeline Interactive View ────────────────────────────────── */
  function setupTimeline() {
    var timeline = document.querySelector('.timeline-container');
    if (!timeline) return;

    fetch('/catalog-lite.json')
      .then(function(res) { return res.json(); })
      .then(function(works) {
        var byDecade = {};
        works.forEach(function(work) {
          var decade = work.year || 'Unknown';
          if (!byDecade[decade]) byDecade[decade] = [];
          byDecade[decade].push(work);
        });

        var decades = Object.keys(byDecade).sort().reverse();
        var html = '';

        decades.forEach(function(decade, idx) {
          html += '<div class="timeline-year-group" data-decade="' + decade + '">' +
            '<div class="timeline-year-label">' + decade + '</div>' +
            '<div class="timeline-year-works">' + byDecade[decade].length + ' works</div>' +
            '</div>';
        });

        timeline.innerHTML = html;

        timeline.querySelectorAll('.timeline-year-group').forEach(function(group) {
          group.addEventListener('click', function() {
            var decade = this.dataset.decade;
            // Filter works by decade
            window.location.href = '/archive.html?decade=' + decade;
          });
        });
      })
      .catch(function() {});
  }

  /* ─── Phase 10: Lazy Image Loading with Fade ────────────────────────────── */
  function setupLazyImageFade() {
    var images = document.querySelectorAll('img[loading="lazy"]');
    var imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.classList.remove('lazy-placeholder');
          img.addEventListener('load', function() {
            this.classList.add('loaded');
          });
          img.addEventListener('error', function() {
            this.classList.add('loaded');
          });
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(function(img) {
      img.classList.add('lazy-placeholder');
      imageObserver.observe(img);
    });
  }

  /* ─── Phase 10: Export/Share Modal ────────────────────────────────────────── */
  function setupExportModal() {
    var exportBtns = document.querySelectorAll('.export-btn-trigger');
    var modal = document.querySelector('.export-modal');
    if (!modal) return;

    exportBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        modal.classList.add('visible');
      });
    });

    var closeBtn = modal.querySelector('.export-close');
    closeBtn?.addEventListener('click', function() {
      modal.classList.remove('visible');
    });

    var confirmBtn = modal.querySelector('.export-btn');
    confirmBtn?.addEventListener('click', function() {
      var selected = modal.querySelector('input[type="radio"]:checked');
      if (!selected) return;

      var format = selected.value;
      var url = new URL(window.location);
      var workId = url.searchParams.get('id');

      if (workId) {
        switch(format) {
          case 'json':
            fetch('/catalog-lite.json')
              .then(function(res) { return res.json(); })
              .then(function(works) {
                var work = works.find(function(w) { return w.file === workId; });
                downloadJSON(work);
              });
            break;
          case 'csv':
            downloadCSV([workId]);
            break;
          case 'image':
            var img = document.querySelector('.artwork-display img');
            if (img) downloadImage(img.src);
            break;
        }
      }

      modal.classList.remove('visible');
    });
  }

  window.downloadJSON = function(data) {
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (data.file || 'export') + '.json';
    a.click();
  };

  window.downloadCSV = function(ids) {
    var csv = 'ID,Title,Year,Type\n';
    csv += ids.map(function(id) { return id + ',work data'; }).join('\n');
    var blob = new Blob([csv], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'works.csv';
    a.click();
  };

  window.downloadImage = function(src) {
    var a = document.createElement('a');
    a.href = src;
    a.download = src.split('/').pop();
    a.click();
  };

  /* ─── Phase 11: Audio Player ───────────────────────────────────────────────── */
  function setupAudioPlayer() {
    var players = document.querySelectorAll('.audio-player');
    players.forEach(function(player) {
      var audio = player.querySelector('audio');
      var playBtn = player.querySelector('.audio-play-btn');
      var progressBar = player.querySelector('.audio-progress');
      var progressFill = player.querySelector('.audio-progress-fill');
      var timeDisplay = player.querySelector('.audio-time');
      var speedBtns = player.querySelectorAll('.speed-btn');

      if (!audio || !playBtn) return;

      playBtn.addEventListener('click', function() {
        if (audio.paused) {
          audio.play();
          playBtn.classList.add('playing');
        } else {
          audio.pause();
          playBtn.classList.remove('playing');
        }
      });

      audio.addEventListener('timeupdate', function() {
        var percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = percent + '%';
        var mins = Math.floor(audio.currentTime / 60);
        var secs = Math.floor(audio.currentTime % 60);
        if (timeDisplay) {
          timeDisplay.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
        }
      });

      audio.addEventListener('ended', function() {
        playBtn.classList.remove('playing');
      });

      progressBar?.addEventListener('click', function(e) {
        var rect = this.getBoundingClientRect();
        var percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
      });

      speedBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var speed = parseFloat(this.dataset.speed);
          audio.playbackRate = speed;
          speedBtns.forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
        });
      });
    });
  }

  /* ─── Phase 11: Transcription Sync ──────────────────────────────────────────– */
  function setupTranscriptionSync() {
    var panels = document.querySelectorAll('.transcription-panel');
    panels.forEach(function(panel) {
      var timestamps = panel.querySelectorAll('.transcription-timestamp');
      var audio = document.querySelector('.audio-player audio');

      timestamps.forEach(function(ts) {
        ts.addEventListener('click', function() {
          if (!audio) return;
          var timeStr = this.dataset.time || '0:00';
          var parts = timeStr.split(':');
          var seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
          audio.currentTime = seconds;
          audio.play();
        });
      });
    });
  }

  /* ─── Phase 11: Related Stories Navigation ────────────────────────────────── */
  function setupRelatedStories() {
    var cards = document.querySelectorAll('.story-card');
    cards.forEach(function(card) {
      card.addEventListener('click', function() {
        var storyId = this.dataset.storyId;
        if (storyId) {
          window.location.href = '/stories.html?story=' + storyId;
        }
      });
    });
  }

  /* ─── Phase 11: Chapter Navigation ────────────────────────────────────────── */
  function setupChapterNavigation() {
    var chapters = document.querySelectorAll('.chapter-item');
    chapters.forEach(function(chapter) {
      chapter.addEventListener('click', function() {
        var chapterId = this.dataset.chapterId;
        var audio = document.querySelector('.audio-player audio');
        if (audio && chapterId) {
          var startTime = parseFloat(this.dataset.startTime) || 0;
          audio.currentTime = startTime;
          audio.play();
        }
        chapters.forEach(function(ch) { ch.classList.remove('active'); });
        chapter.classList.add('active');
      });
    });
  }

  /* ─── Phase 11: Waveform Animation ────────────────────────────────────────── */
  function setupWaveformAnimation() {
    var waveforms = document.querySelectorAll('.audio-waveform');
    waveforms.forEach(function(wf) {
      var audio = wf.closest('.audio-player')?.querySelector('audio');
      if (!audio) return;

      audio.addEventListener('play', function() {
        var bars = wf.querySelectorAll('.waveform-bar');
        var interval = setInterval(function() {
          if (!audio.playing) {
            clearInterval(interval);
            return;
          }
          var barIndex = Math.floor((audio.currentTime / audio.duration) * bars.length);
          bars.forEach(function(bar, idx) {
            if (idx < barIndex) {
              bar.classList.add('playing');
            } else {
              bar.classList.remove('playing');
            }
          });
        }, 50);
      });
    });
  }

  /* ─── Phase 12: Fullscreen Gallery Mode ────────────────────────────────────– */
  window.openFullscreenGallery = function(imageUrl, title) {
    var gallery = document.querySelector('.fullscreen-gallery');
    if (!gallery) return;
    gallery.querySelector('.fullscreen-gallery-image').src = imageUrl;
    gallery.querySelector('.fullscreen-gallery-info').textContent = title || '';
    gallery.classList.add('active');
  };

  function setupFullscreenGallery() {
    var gallery = document.querySelector('.fullscreen-gallery');
    var closeBtn = gallery?.querySelector('.fullscreen-gallery-close');
    var thumbnails = document.querySelectorAll('.thumb img, .artwork-display img');

    thumbnails.forEach(function(thumb) {
      thumb.style.cursor = 'pointer';
      thumb.addEventListener('click', function() {
        window.openFullscreenGallery(this.src, this.alt);
      });
    });

    closeBtn?.addEventListener('click', function() {
      gallery.classList.remove('active');
    });

    gallery?.addEventListener('click', function(e) {
      if (e.target === this) this.classList.remove('active');
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        gallery?.classList.remove('active');
      }
    });
  }

  /* ─── Phase 12: Keyboard Shortcuts Reference ────────────────────────────── */
  /* DISABLED: Keyboard shortcuts modal has critical bug (auto-opens, won't close)
     Consolidation + proper close functionality needed (Session 67+) */
  function setupShortcutsDialog() {
    // Feature disabled — see setupEnhancedShortcuts() comment
    return;
  }

  /* ─── Phase 12: User Preferences ────────────────────────────────────────────– */
  function setupPreferencesPanel() {
    var panel = document.querySelector('.preferences-panel');
    var toggleBtn = document.querySelector('.preferences-toggle-btn');
    var closeBtn = panel?.querySelector('.preferences-close');
    if (!panel) return;

    toggleBtn?.addEventListener('click', function() {
      panel.classList.toggle('open');
    });

    closeBtn?.addEventListener('click', function() {
      panel.classList.remove('open');
    });

    var toggles = panel.querySelectorAll('.preference-toggle');
    toggles.forEach(function(toggle) {
      var key = toggle.dataset.key;
      var saved = localStorage.getItem('pref-' + key);
      if (saved === 'true') toggle.classList.add('active');

      toggle.addEventListener('click', function() {
        this.classList.toggle('active');
        localStorage.setItem('pref-' + key, this.classList.contains('active'));

        if (key === 'focus-mode') {
          document.body.classList.toggle('focus-mode');
        }
      });
    });
  }

  /* ─── Phase 12: Floating Action Buttons ────────────────────────────────────– */
  function setupFloatingActionButtons() {
    var fabs = document.querySelectorAll('.fab');
    fabs.forEach(function(fab) {
      fab.addEventListener('click', function() {
        var action = this.dataset.action;
        switch(action) {
          case 'search':
            var searchInput = document.querySelector('.search-input');
            if (searchInput) searchInput.focus();
            break;
          case 'filters':
            var drawer = document.querySelector('.filters-drawer');
            drawer?.classList.toggle('open');
            break;
          case 'preferences':
            var panel = document.querySelector('.preferences-panel');
            panel?.classList.toggle('open');
            break;
        }
      });
    });
  }

  /* ─── Phase 12: Filters Drawer ────────────────────────────────────────────– */
  function setupFiltersDrawer() {
    var drawer = document.querySelector('.filters-drawer');
    var applyBtn = drawer?.querySelector('.filters-apply-btn');
    if (!drawer) return;

    applyBtn?.addEventListener('click', function() {
      drawer.classList.remove('open');
      // Trigger filter update
      var event = new CustomEvent('filtersApplied');
      document.dispatchEvent(event);
    });
  }

  /* ─── Phase 12: Context Menu ───────────────────────────────────────────── */
  function setupContextMenu() {
    var menu = document.querySelector('.context-menu');
    if (!menu) return;

    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      menu.style.top = e.clientY + 'px';
      menu.style.left = e.clientX + 'px';
      menu.classList.add('visible');
    });

    document.addEventListener('click', function() {
      menu.classList.remove('visible');
    });
  }

  /* ─── Phase 12: Notification System ────────────────────────────────────────– */
  window.showNotification = function(message, duration) {
    duration = duration || 3000;
    var notification = document.createElement('div');
    notification.className = 'notification-badge';
    notification.textContent = '✓';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = '#FF6600';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.color = '#fcf9f3';
    notification.style.fontSize = '14px';
    notification.style.zIndex = '10003';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(function() {
      notification.remove();
    }, duration);
  };

  /* ─── Initialize All ────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function() {
    setupGridStagger();
    setupFilterChipFeedback();
    setupArtworkShare();
    setupRelatedWorks();
    setupScrollReveal();
    setupHeroParallax();
    setupSearchHighlighting();
    setupPageTransitions();
    setupLazyLoadFadeIn();
    setupCollapsibleFilters();
    restoreViewMode();
    setupShortcutsHint();
    setupEnhancedShortcuts();
    setupTouchGestures();
    setupScrollToTop();
    setupAnimatedCounters();
    setupFormEnhancements();
    setupSearchSuggestions();
    setupFilterPersistence();
    setupQuickPreview();
    setupDominantColorBackdrops();
    setupSortOptions();
    setupStatisticsDashboard();
    setupTimeline();
    setupLazyImageFade();
    setupExportModal();
    setupAudioPlayer();
    setupTranscriptionSync();
    setupRelatedStories();
    setupChapterNavigation();
    setupWaveformAnimation();
    setupFullscreenGallery();
    setupShortcutsDialog();
    setupPreferencesPanel();
    setupFloatingActionButtons();
    setupFiltersDrawer();
    setupContextMenu();
  });

  // Re-setup grid stagger when filter changes
  var observer = new MutationObserver(function() {
    setupGridStagger();
  });

  var config = { childList: true, subtree: false };
  var gridsToObserve = [
    'works-grid',
    'series-grid',
    'collage-grid',
    'sculpture-grid',
    'photography-grid',
    'painting-grid'
  ];

  gridsToObserve.forEach(function(gridId) {
    var grid = document.getElementById(gridId);
    if (grid) {
      observer.observe(grid, config);
    }
  });
})();


/* ===== _shared/scroll-choreography.js ===== */
/* scroll-choreography.js — Unified navbar/footer scroll orchestration
   Coordinates entrance animations + scroll-responsive header/footer behavior
   Master timeline system for site-wide motion + parallax + gesture-responsive animations

   Enhancements:
   - Parallax choreography: hero/footer layers move at different rates
   - Gesture-responsive: mobile swipe velocity triggers animations
   - Scroll-section reveals: nav items + content light up as sections enter viewport
*/

(function() {
  'use strict';

  // Check if animations are disabled
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // anime.js (this bundled build) doesn't expose `anime.getEasing` — calling
  // it threw on every scroll event, silently aborting updateHeaderOnScroll()
  // before it ever animated anything. This is a standalone easeOutQuad
  // clamped to [0,1], used the same way the missing helper would have been:
  // as a velocity-responsive starting opacity.
  function easeOutQuad(t) {
    t = Math.min(Math.max(t, 0), 1);
    return 1 - (1 - t) * (1 - t);
  }

  // Color palette per page section — maps section class/data-* to accent color
  const sectionAccents = {
    'archive': '#e05900',      // Archive orange
    'guernica': '#c41e3a',     // Guernica red
    'targets': '#f4a259',      // Targets warm orange
    'framed': '#9d7e5d',       // Framed brown
    'torsos': '#7b5a6e',       // Torsos purple
    'crosses': '#4a6fa5',      // Crosses blue
    'snowmann': '#2d5a3d',     // Snowmann green
    'gallery': '#d4a574',      // Gallery gold
    'collaboration': '#8b6f47',// Collab brown
    'default': '#FF6600'       // Default core orange
  };

  // Chromatic decade colors (from chromatic.json era)
  const decadeColors = {
    '1970s': '#8B4513',
    '1980s': '#CD853F',
    '1990s': '#DAA520',
    '2000s': '#FF8C00',
    '2010s': '#FF6347',
    '2020s': '#DC143C'
  };

  /* ─── State Tracking ─────────────────────────────────────────────────────── */
  let state = {
    scrollY: 0,
    scrollDir: 'down',
    scrollVel: 0,
    lastScrollY: 0,
    lastScrollTime: 0,
    isReading: false,      // Slow scroll = reading state
    currentSection: 'default',
    headerCompact: false
  };

  /* ─── Entrance Animation (Page Load) ────────────────────────────────────── */
  function animateEntrance() {
    if (prefersReducedMotion) return;

    const header = document.querySelector('header');
    const logo = document.querySelector('.jfsn-wordmark');
    const navLinks = document.querySelectorAll('header nav a');
    const sideButtons = document.querySelectorAll('header button');
    const footer = document.querySelector('footer');
    const footerLinks = document.querySelectorAll('footer a');

    if (!header) return;

    // Logo + wordmark entrance
    if (logo) {
      anime.set(logo, { opacity: 0, scale: 0.9 });
      anime({
        targets: logo,
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 400,
        easing: 'easeOutCubic',
        delay: 0
      });
    }

    // Desktop nav links stagger from above
    if (navLinks.length > 0) {
      anime.set(navLinks, { opacity: 0, translateY: -8 });
      anime({
        targets: navLinks,
        opacity: [0, 1],
        translateY: [-8, 0],
        duration: 350,
        easing: 'easeOutCubic',
        delay: anime.stagger(80, { start: 200 })
      });
    }

    // Side buttons (search, theme) fade in
    if (sideButtons.length > 0) {
      anime.set(sideButtons, { opacity: 0 });
      anime({
        targets: sideButtons,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad',
        delay: 300
      });
    }

    // Footer mirror choreography (stagger from below on scroll-into-view)
    if (footer) {
      const footerObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              anime.set(footerLinks, { opacity: 0, translateY: 8 });
              anime({
                targets: footerLinks,
                opacity: [0, 1],
                translateY: [8, 0],
                duration: 350,
                easing: 'easeOutCubic',
                delay: anime.stagger(60)
              });
              footerObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      footerObserver.observe(footer);
    }
  }

  /* ─── Scroll Direction & Velocity Detection ──────────────────────────────── */
  function updateScrollState() {
    const now = Date.now();
    const dy = state.scrollY - state.lastScrollY;
    const dt = Math.max(now - state.lastScrollTime, 1);

    state.scrollDir = dy > 0 ? 'down' : dy < 0 ? 'up' : state.scrollDir;
    state.scrollVel = Math.abs(dy / dt); // pixels per ms
    state.isReading = state.scrollVel < 0.3; // Slow scroll = reading
    state.lastScrollY = state.scrollY;
    state.lastScrollTime = now;
  }

  /* ─── Detect Current Section (for accent color mapping) ──────────────────── */
  function detectCurrentSection() {
    // Check for data-section attribute on body or main sections
    const main = document.querySelector('main');
    if (main) {
      const sections = main.querySelectorAll('[data-section]');
      for (let section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
          const sectionName = section.getAttribute('data-section');
          if (sectionName) state.currentSection = sectionName;
        }
      }
    }

    // Fallback: detect from page class or current page
    const body = document.body;
    for (let [key, color] of Object.entries(sectionAccents)) {
      if (body.classList.contains(`page-${key}`) || window.location.pathname.includes(key)) {
        state.currentSection = key;
        break;
      }
    }
  }

  /* ─── Header Scroll Response ─────────────────────────────────────────────── */
  function updateHeaderOnScroll() {
    if (prefersReducedMotion) return;

    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('header nav a');
    if (!header) return;

    // Reading state: nav links fade to 60%, blur intensifies
    if (state.isReading && state.scrollY > 80) {
      if (navLinks.length > 0) {
        anime({
          targets: navLinks,
          opacity: [easeOutQuad(state.scrollVel / 0.5), 0.6],
          duration: 200,
          easing: 'easeOutQuad'
        });
      }
    } else if (state.scrollY > 80 && !state.isReading) {
      // Skimming: nav links brighten
      if (navLinks.length > 0) {
        anime({
          targets: navLinks,
          opacity: [easeOutQuad(state.scrollVel / 0.5), 1],
          duration: 200,
          easing: 'easeOutQuad'
        });
      }
    }
  }

  /* ─── Accent Color Transition ────────────────────────────────────────────── */
  function updateAccentColor() {
    if (prefersReducedMotion) return;

    const targetColor = sectionAccents[state.currentSection] || sectionAccents.default;
    const butterfly = document.querySelector('.jfsn-wordmark img');

    if (butterfly) {
      // Get current color from computed style or animate from current
      anime({
        targets: butterfly,
        filter: getFilterForColor(targetColor),
        duration: 600,
        easing: 'easeInOutQuad'
      });
    }
  }

  // Helper: map accent color to SVG filter
  function getFilterForColor(hexColor) {
    // Core orange (#FF6600) is the default filter state
    // Interpolate hue-rotate based on target color
    const colorMap = {
      '#FF6600': 'invert(63%) sepia(72%) saturate(1500%) hue-rotate(-30deg) brightness(105%) contrast(101%)',
      '#e05900': 'invert(53%) sepia(85%) saturate(1200%) hue-rotate(-10deg) brightness(100%) contrast(110%)',
      '#c41e3a': 'invert(45%) sepia(90%) saturate(1400%) hue-rotate(340deg) brightness(95%) contrast(115%)',
      '#f4a259': 'invert(70%) sepia(60%) saturate(1000%) hue-rotate(0deg) brightness(105%) contrast(100%)',
      '#2d5a3d': 'invert(35%) sepia(40%) saturate(800%) hue-rotate(120deg) brightness(95%) contrast(110%)',
      'default': 'invert(63%) sepia(72%) saturate(1500%) hue-rotate(-30deg) brightness(105%) contrast(101%)'
    };
    return colorMap[hexColor] || colorMap.default;
  }

  /* ─── Parallax Choreography ──────────────────────────────────────────────── */
  function setupParallax() {
    if (prefersReducedMotion) return;

    const footer = document.querySelector('footer');

    // NOTE: this used to also parallax #hero-slides-d (the hero artwork image
    // container) at 0.25x scroll — removed because it violated CLAUDE.md's
    // hard rail that the artwork plane must stay locked at 1.0x scroll.
    // depth-hero.js now carries the index.html hero's motion budget instead,
    // via the surrounding headline (#dh-word), never the artwork itself.

    // Footer gradient parallax (drifts upward on scroll)
    if (footer) {
      const footerGradient = footer.querySelector('[class*="gradient"], [class*="fade"]');
      if (footerGradient) {
        window.addEventListener('scroll', function() {
          const footerRect = footer.getBoundingClientRect();
          if (footerRect.top < window.innerHeight) {
            const visibleProgress = 1 - (footerRect.top / window.innerHeight);
            const driftOffset = Math.min(visibleProgress * 30, 30);
            footerGradient.style.transform = `translateY(-${driftOffset}px)`;
          }
        }, { passive: true });
      }
    }
  }

  /* ─── Scroll-Section Nav Reveals ──────────────────────────────────────────── */
  function setupSectionReveals() {
    if (prefersReducedMotion) return;

    const navLinks = document.querySelectorAll('header nav a');
    if (navLinks.length === 0) return;

    // Map nav links to sections (by href)
    const linkMap = {};
    navLinks.forEach((link, idx) => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http')) {
        const page = href.split('/').pop().replace('.html', '');
        linkMap[page] = link;
      }
    });

    // Observe main sections for visibility
    const sections = document.querySelectorAll('[data-section], main > section, main > article');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionName = entry.target.getAttribute('data-section') ||
                           entry.target.id ||
                           entry.target.className.split(' ')[0];

        if (entry.isIntersecting) {
          // Section entered viewport — highlight corresponding nav link
          navLinks.forEach(link => {
            const linkHref = link.getAttribute('href').replace('.html', '');
            if (linkHref.includes(sectionName) || sectionName.includes('main')) {
              // Gentle highlight
              anime({
                targets: link,
                color: '#FF6600',
                duration: 300,
                easing: 'easeOutQuad'
              });
            }
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
  }

  /* ─── Gesture Velocity Detection (Mobile) ────────────────────────────────── */
  function setupGestureResponsive() {
    if (prefersReducedMotion) return;

    let lastTouchY = 0;
    let lastTouchTime = 0;
    let swipeVelocity = 0;

    document.addEventListener('touchstart', (e) => {
      lastTouchY = e.touches[0].clientY;
      lastTouchTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      const currentY = e.touches[0].clientY;
      const currentTime = Date.now();
      const deltaY = currentY - lastTouchY;
      const deltaTime = currentTime - lastTouchTime;

      swipeVelocity = Math.abs(deltaY / deltaTime);
      lastTouchY = currentY;
      lastTouchTime = currentTime;

      // High-velocity swipe (fling): compress header, brighten nav
      const header = document.querySelector('header');
      if (header && swipeVelocity > 1.0) {
        const navLinks = header.querySelectorAll('nav a');
        anime({
          targets: navLinks,
          opacity: [easeOutQuad(swipeVelocity / 2), 0.8],
          duration: 150,
          easing: 'easeOutQuad'
        });
      }
    }, { passive: true });

    document.addEventListener('touchend', () => {
      // Reset nav opacity back to normal on touch end
      const header = document.querySelector('header');
      if (header) {
        const navLinks = header.querySelectorAll('nav a');
        anime({
          targets: navLinks,
          opacity: [0.8, 1],
          duration: 200,
          easing: 'easeOutQuad'
        });
      }
    }, { passive: true });
  }

  /* ─── Back-to-Top Pulse Beacon ──────────────────────────────────────────── */
  function setupBTTBeacon() {
    if (prefersReducedMotion) return;

    const bttFloat = document.getElementById('btt-float');
    if (!bttFloat) return;

    // Observe visibility changes
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // BTT is visible — pulse entrance
          anime.set(bttFloat, { opacity: 0, scale: 0.8 });
          anime({
            targets: bttFloat,
            opacity: [0, 1],
            scale: [0.8, 1],
            duration: 400,
            easing: 'easeOutElastic(1, 0.6)'
          });

          // Then start breathing loop
          anime({
            targets: bttFloat,
            scale: [1, 1.08, 1],
            duration: 3000,
            easing: 'easeInOutQuad',
            loop: true
          });

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(bttFloat);
  }

  /* ─── Scroll Event Handler ───────────────────────────────────────────────── */
  function onScroll() {
    state.scrollY = window.scrollY;
    updateScrollState();
    detectCurrentSection();
    updateHeaderOnScroll();
    updateAccentColor();
  }

  /* ─── Init ──────────────────────────────────────────────────────────────── */
  function init() {
    if (!window.anime) {
      // anime.js not loaded; exit gracefully
      return;
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Run entrance animation
    animateEntrance();

    // Setup enhancements
    setupBTTBeacon();
    setupParallax();
    setupSectionReveals();
    setupGestureResponsive();

    // Add scroll listener (passive for performance)
    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial state
    onScroll();
  }

  // Start when anime.js is available
  if (window.anime) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  } else {
    // Wait for anime.js to load
    document.addEventListener('DOMContentLoaded', init);
  }
})();


/* ===== _shared/floating-home-button.js ===== */
/* floating-home-button.js — Persistent "Home" button for 70+ UX safety
   Always visible, gives users confidence they can return to homepage
   Reduces "lost" anxiety. Positioned alongside back-to-top button.
*/

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Create Floating Home Button ──────────────────────────────────────── */
  function createHomeButton() {
    const btn = document.createElement('button');
    btn.id = 'floating-home-btn';
    btn.setAttribute('aria-label', 'Return to home');
    btn.setAttribute('title', 'Return to home');
    btn.innerHTML = '⌂'; // House icon

    btn.style.cssText = `
      position: fixed;
      bottom: 28px;
      right: calc(28px + 64px); /* Right of back-to-top button (48px + 16px gap) */
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fcf9f3;
      border: 1px solid #c4c7c7;
      cursor: pointer;
      font-size: 20px;
      color: #575757;
      z-index: 401;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.22s ease, transform 0.22s ease, color 0.15s ease, border-color 0.15s ease;
      pointer-events: none;
      border-radius: 2px;
    `;

    document.body.appendChild(btn);

    // Show on scroll past hero
    window.addEventListener('scroll', () => {
      const isVisible = window.scrollY > 300;
      btn.classList.toggle('home-visible', isVisible);

      if (isVisible && btn.style.opacity === '0') {
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
        btn.style.pointerEvents = 'auto';
      } else if (!isVisible && btn.style.opacity === '1') {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(8px)';
        btn.style.pointerEvents = 'none';
      }
    }, { passive: true });

    // Hover state
    btn.addEventListener('mouseenter', () => {
      btn.style.color = '#FF6600';
      btn.style.borderColor = '#FF6600';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.color = '#575757';
      btn.style.borderColor = '#c4c7c7';
    });

    // Click to go home
    btn.addEventListener('click', () => {
      window.location.href = '/';
    });

    // Adjust for mobile (position above bottom nav bar if present)
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const adjustPosition = () => {
      if (mediaQuery.matches) {
        btn.style.bottom = '88px'; // Above mobile nav
        btn.style.right = '16px';
      } else {
        btn.style.bottom = '28px';
        btn.style.right = 'calc(28px + 64px)';
      }
    };

    adjustPosition();
    mediaQuery.addEventListener('change', adjustPosition);
  }

  /* ─── Animate Entrance (if anime.js available) ────────────────────────── */
  function setupEntrance() {
    if (!window.anime || prefersReducedMotion) return;

    const btn = document.getElementById('floating-home-btn');
    if (!btn) return;

    // One-time entrance animation when button first becomes visible
    let hasAnimated = false;
    const checkScroll = () => {
      if (window.scrollY > 300 && !hasAnimated) {
        hasAnimated = true;
        anime({
          targets: btn,
          scale: [0.8, 1],
          duration: 300,
          easing: 'easeOutElastic(1, 0.6)'
        });
        window.removeEventListener('scroll', checkScroll);
      }
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
  }

  /* ─── Init ──────────────────────────────────────────────────────────────– */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    createHomeButton();
    setupEntrance();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
