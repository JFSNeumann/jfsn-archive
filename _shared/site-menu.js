/**
 * site-menu.js — the global MENU for JFSN.
 *
 * One file, injected on every production page. It renders a fixed upper-right
 * MENU button and a right-side drawer holding the full navigation hierarchy.
 * There is no per-page markup: the button, drawer, styles, and behavior all
 * live here so the menu stays identical everywhere and is maintained once.
 *
 * Include once, before </body>:
 *   <script src="/_shared/site-menu.js" defer></script>
 *
 * Theming is inherited from each page's :root palette (--room, --ink, --dim,
 * --accent, --frame, --faint), so the drawer matches whatever room it opens in.
 *
 * Accessibility: real <button> controls, aria-modal dialog, Esc + backdrop +
 * CLOSE to dismiss, focus trap, focus restore, 44px targets, scroll lock,
 * reduced-motion honored. Keydown handling stays inert unless the menu is open,
 * so it never interferes with a page's own arrow-key or first-keypress logic.
 */
(function () {
  'use strict';
  if (window.__jfsnMenuLoaded) return;      // guard against a double include
  window.__jfsnMenuLoaded = true;

  /* ---- navigation model (primary → rooms → research → utility) ---- */
  var GROUPS = [
    { label: null, items: [
      { label: 'THE MUSEUM',  href: '/' },
      { label: 'THE ARCHIVE', href: '/archive.html' }
    ] },
    { label: 'THE ROOMS', items: [
      { num: 'I',   label: 'THE CURRENT',          href: '/current.html' },
      { num: 'II',  label: 'THE GUERNICA PASSAGE', href: '/guernica-passage.html' },
      { num: 'III', label: 'THE FLOODED WING',     href: '/flooded-wing.html' },
      { num: 'IV',  label: 'THE HALL OF OPENINGS', href: '/hall-of-openings.html' },
      { num: 'V',   label: 'THE STUDIO',           href: '/the-studio.html' }
    ] },
    { label: 'RESEARCH', items: [
      { label: 'THE WORKING HISTORY', href: '/working-history.html' },
      { label: 'ABOUT JEFF',          href: '/about.html' },
      { label: 'STORIES',             href: '/stories.html' }
    ] }
  ];
  var UTILITY = [
    { label: 'PRIVACY',          href: '/privacy.html' },
    { label: 'SITEMAP',          href: '/sitemap.html' },
    { label: 'CONTACT',          href: 'mailto:jeff@jfsn.com' },
    { label: 'SOURCE ON GITHUB', href: 'https://github.com/JFSNeumann/jfsn-archive', external: true }
  ];

  /* current page → the filename we should mark active */
  var currentFile = (function () {
    var p = location.pathname;
    if (p === '/' || p === '' || p.slice(-1) === '/') return 'index.html';
    return p.split('/').pop();
  })();
  var fileOf = function (href) {
    if (href === '/') return 'index.html';
    if (href.indexOf(':') !== -1) return null;   // mailto: / external
    return href.split('/').pop();
  };

  /* ---- styles ---- */
  var CSS = [
    '#butterfly-nav{position:fixed;z-index:9998;pointer-events:none;opacity:0;width:64px;height:72px;will-change:transform,opacity}',
    '#site-menu-overlay.sm-open #butterfly-nav{animation:butterfly-flight 1.6s cubic-bezier(.34,.1,.68,.55) forwards}',
    '@keyframes butterfly-flight{',
      '0%{opacity:1;right:0%;top:calc(env(safe-area-inset-top,0px) + 80px);transform:scaleX(-1) rotate(10deg)}',
      '28%{opacity:1;right:6%;top:calc(env(safe-area-inset-top,0px) + 120px);transform:scaleX(1) rotate(-8deg)}',
      '52%{opacity:1;right:4%;top:calc(env(safe-area-inset-top,0px) + 75px);transform:scaleX(-1) rotate(6deg)}',
      '76%{opacity:1;right:5.5%;top:calc(env(safe-area-inset-top,0px) + 130px);transform:scaleX(1) rotate(2deg)}',
      '100%{opacity:0.18;right:5.5%;top:calc(env(safe-area-inset-top,0px) + 130px);transform:scaleX(1) rotate(0deg)}',
    '}',
    '@media(max-width:640px){',
      '#butterfly-nav{width:48px;height:54px}',
      '@keyframes butterfly-flight{',
        '0%{opacity:1;right:0%;top:calc(env(safe-area-inset-top,0px) + 70px);transform:scaleX(-1) rotate(12deg)}',
        '30%{opacity:1;right:5%;top:calc(env(safe-area-inset-top,0px) + 100px);transform:scaleX(1) rotate(-6deg)}',
        '60%{opacity:1;right:4%;top:calc(env(safe-area-inset-top,0px) + 65px);transform:scaleX(-1) rotate(4deg)}',
        '85%{opacity:1;right:4.5%;top:calc(env(safe-area-inset-top,0px) + 115px);transform:scaleX(1) rotate(1deg)}',
        '100%{opacity:0.16;right:4.5%;top:calc(env(safe-area-inset-top,0px) + 115px);transform:scaleX(1) rotate(0deg)}',
      '}',
    '}',
    '@media(prefers-reduced-motion:reduce){#site-menu-overlay.sm-open #butterfly-nav{animation:none;opacity:0}}',
    '#site-menu-btn{position:fixed;z-index:9999;top:calc(env(safe-area-inset-top,0px) + 14px);right:18px;',
      'display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:8px 14px;',
      'background:color-mix(in srgb,var(--room,#0c0a09) 66%,transparent);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);',
      'border:0;color:var(--ink,#f0e8dd);font:inherit;font-size:11px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;',
      'cursor:pointer;-webkit-tap-highlight-color:transparent;transition:color .2s ease,opacity .2s ease}',
    '#site-menu-btn:hover,#site-menu-btn:focus-visible{color:var(--accent,#FF6600)}',
    '#site-menu-btn:active{opacity:0.7;transform:scale(0.98)}',
    '#site-menu-btn:focus-visible{outline:2px solid var(--accent,#FF6600);outline-offset:3px}',
    '#site-menu-btn .sm-ham{font-size:15px;line-height:1;letter-spacing:0}',
    '#site-menu-btn[aria-expanded="true"]{opacity:0;pointer-events:none}',

    // The MENU button owns the top-right corner. On pages with a standard
    // header.hud we removed the old right-hand link, so cluster the remaining
    // items (name, and the centered room-name placard) to the left and keep
    // the right corner clear for the button. current.html uses div.hud tiles,
    // not header.hud, so it is untouched by this rule.
    'header.hud{justify-content:flex-start;gap:clamp(14px,3vw,26px);padding-right:132px}',
    '@media(max-width:640px){header.hud{padding-right:120px}}',

    '#site-menu-overlay{position:fixed;inset:0;z-index:9997;visibility:hidden}',
    '#site-menu-overlay.sm-open{visibility:visible}',
    '#site-menu-backdrop{position:absolute;inset:0;background:rgba(6,5,4,.55);opacity:0;transition:opacity .3s ease}',
    '#site-menu-overlay.sm-open #site-menu-backdrop{opacity:1}',

    '#site-menu-drawer{position:absolute;top:0;right:0;height:100%;height:100dvh;width:100%;',
      'background:var(--room,#0c0a09);border-left:1px solid var(--frame,#2b241e);box-shadow:-24px 0 60px rgba(0,0,0,.45);',
      'display:flex;flex-direction:column;transform:translateX(100%);transition:transform .32s cubic-bezier(.4,0,.2,1);',
      'padding:calc(env(safe-area-inset-top,0px) + 14px) 0 calc(env(safe-area-inset-bottom,0px) + 8px)}',
    '#site-menu-overlay.sm-open #site-menu-drawer{transform:translateX(0)}',
    '@media(min-width:641px){#site-menu-drawer{width:min(66vw,600px)}}',
    '@media(min-width:1025px){#site-menu-drawer{width:clamp(400px,42vw,560px)}}',

    '.sm-head{display:flex;justify-content:flex-end;padding:0 18px 10px}',
    '#site-menu-close{min-height:44px;padding:8px 14px;background:0;border:0;color:var(--dim,#b8a89a);',
      'font:inherit;font-size:11px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;cursor:pointer;transition:color .2s ease}',
    '#site-menu-close:hover,#site-menu-close:focus-visible{color:var(--accent,#FF6600)}',
    '#site-menu-close:focus-visible{outline:2px solid var(--accent,#FF6600);outline-offset:3px}',
    '#site-menu-close .sm-x{font-size:16px;line-height:1}',

    '.sm-scroll{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:6px clamp(26px,5vw,44px) 20px}',
    '.sm-group{margin-top:26px}',
    '.sm-group:first-child{margin-top:6px}',
    '.sm-group-label{font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:var(--faint,#8a7a6c);margin:0 0 12px;font-weight:600}',
    '.sm-link{display:flex;align-items:baseline;gap:12px;text-decoration:none;color:var(--ink,#f0e8dd);',
      'padding:11px 0;line-height:1.25;transition:color .18s ease}',
    '.sm-link:hover .sm-label,.sm-link:focus-visible .sm-label{color:var(--accent,#FF6600)}',
    '.sm-link:focus-visible{outline:2px solid var(--accent,#FF6600);outline-offset:3px}',
    '.sm-primary .sm-label{font-size:19px;letter-spacing:.14em}',
    '.sm-rooms .sm-link,.sm-research .sm-link{font-size:13px}',
    '.sm-num{flex:none;width:26px;font-size:10px;letter-spacing:.1em;color:var(--faint,#8a7a6c);font-variant-numeric:tabular-nums}',
    '.sm-label{font-size:13px;letter-spacing:.16em;text-transform:uppercase;color:inherit;transition:color .18s ease}',
    '.sm-link[aria-current="page"] .sm-label{color:var(--accent,#FF6600)}',
    '.sm-link[aria-current="page"]::before{content:"";flex:none;align-self:center;width:5px;height:5px;border-radius:50%;',
      'background:var(--accent,#FF6600);margin-right:-4px}',
    '.sm-primary .sm-link[aria-current="page"]::before{width:6px;height:6px}',

    '.sm-util{margin-top:30px;padding-top:20px;border-top:1px solid var(--frame,#2b241e);',
      'display:flex;flex-wrap:wrap;gap:8px 20px}',
    '.sm-util a{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim,#b8a89a);text-decoration:none;',
      'padding:8px 0;transition:color .18s ease}',
    '.sm-util a:hover,.sm-util a:focus-visible,.sm-util a[aria-current="page"]{color:var(--accent,#FF6600)}',
    '.sm-util a:focus-visible{outline:2px solid var(--accent,#FF6600);outline-offset:3px}',

    'html.sm-locked,html.sm-locked body{overflow:hidden}',

    '@media(prefers-reduced-motion:reduce){',
      '#site-menu-drawer{transition:none}#site-menu-backdrop{transition:none}#site-menu-btn{transition:none}}'
  ].join('');

  /* ---- markup ---- */
  function linkHTML(item, cls) {
    var file = fileOf(item.href);
    var active = file && file === currentFile;
    var attrs = 'class="sm-link ' + cls + '" href="' + item.href + '"';
    if (active) attrs += ' aria-current="page"';
    if (item.external) attrs += ' target="_blank" rel="noopener noreferrer"';
    var num = item.num ? '<span class="sm-num" aria-hidden="true">' + item.num + '</span>' : '';
    return '<a ' + attrs + '>' + num + '<span class="sm-label">' + item.label + '</span></a>';
  }

  var groupsHTML = GROUPS.map(function (g, i) {
    var cls = i === 0 ? 'sm-primary' : (g.label === 'THE ROOMS' ? 'sm-rooms' : 'sm-research');
    var lbl = g.label ? '<p class="sm-group-label">' + g.label + '</p>' : '';
    var links = g.items.map(function (it) { return linkHTML(it, cls); }).join('');
    return '<div class="sm-group ' + cls + '">' + lbl + links + '</div>';
  }).join('');

  var utilHTML = '<div class="sm-util">' + UTILITY.map(function (it) {
    var ext = it.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    var file = fileOf(it.href);
    var cur = file && file === currentFile ? ' aria-current="page"' : '';
    return '<a href="' + it.href + '"' + ext + cur + '>' + it.label + '</a>';
  }).join('') + '</div>';

  var style = document.createElement('style');
  style.id = 'site-menu-style';
  style.textContent = CSS;
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.id = 'site-menu-btn';
  btn.type = 'button';
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.setAttribute('aria-controls', 'site-menu-drawer');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Open site menu');
  btn.innerHTML = 'MENU <span class="sm-ham" aria-hidden="true">☰</span>';

  var overlay = document.createElement('div');
  overlay.id = 'site-menu-overlay';
  overlay.innerHTML =
    '<div id="site-menu-backdrop"></div>' +
    '<div id="butterfly-nav" aria-hidden="true"></div>' +
    '<nav id="site-menu-drawer" role="dialog" aria-modal="true" aria-label="Site menu">' +
      '<div class="sm-head">' +
        '<button id="site-menu-close" type="button" aria-label="Close site menu">CLOSE <span class="sm-x" aria-hidden="true">×</span></button>' +
      '</div>' +
      '<div class="sm-scroll">' + groupsHTML + utilHTML + '</div>' +
    '</nav>';

  document.body.appendChild(btn);
  document.body.appendChild(overlay);

  /* Load butterfly image */
  var butterfly = overlay.querySelector('#butterfly-nav');
  var img = document.createElement('img');
  img.src = '/assets/images/jfsn-butterfly-2.png';
  img.alt = '';
  img.style.cssText = 'width:100%;height:100%;object-fit:contain';
  butterfly.appendChild(img);

  /* ---- behavior ---- */
  var drawer   = overlay.querySelector('#site-menu-drawer');
  var backdrop = overlay.querySelector('#site-menu-backdrop');
  var closeBtn = overlay.querySelector('#site-menu-close');
  var isOpen = false;
  var lastFocus = null;

  function focusable() {
    return Array.prototype.slice.call(
      drawer.querySelectorAll('a[href],button:not([disabled])')
    ).filter(function (el) { return el.offsetParent !== null; });
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    lastFocus = document.activeElement;
    overlay.classList.add('sm-open');
    btn.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('sm-locked');
    closeBtn.focus();
  }

  function close(restore) {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('sm-open');
    btn.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('sm-locked');
    if (restore !== false && lastFocus && lastFocus.focus) lastFocus.focus();
    else btn.focus();
  }

  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', function () { close(); });
  backdrop.addEventListener('click', function () { close(); });

  // Keydown is inert unless the menu is open, so it never competes with a
  // page's own arrow-key navigation or first-keypress handlers.
  document.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (e.key === 'Tab') {
      var f = focusable();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, true);
})();
