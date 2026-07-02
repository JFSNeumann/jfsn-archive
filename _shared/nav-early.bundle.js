/* GENERATED FILE — do not edit directly.
   Bundle: nav-early.bundle.js — runs before the inline header/dark-mode scripts, 37 stamped pages
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
               autocomplete="off" spellcheck="false" aria-label="Search works, themes, year…" aria-autocomplete="list" aria-controls="sse-results">
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
        '<canvas id="cps-canvas" aria-hidden="true"></canvas>' +
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
