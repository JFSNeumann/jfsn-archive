/* sw.js — Service Worker for jfsn.com
   Strategy:
   - AVIF images       → cache-first (thumbnails/full/mini)
   - Catalog JSON      → stale-while-revalidate (serve cached, update in bg)
   - Other JSON        → network-first (API/config updates)
   - HTML/CSS/JS       → network-first (always fresh; fall back to cache if offline)

   Stale-while-revalidate: Users get instant cached data, we update it in background.
   Benefits: Perceived performance (instant load) + data freshness (always up to date)

   To invalidate all caches: bump CACHE_V below, then deploy. */

const CACHE_V  = 'jfsn-1782265013'; // Sitewide click-feedback pulse (bracket-links, back-to-top, floating home button)
const PRECACHE = [
  '/',
  '/index.html',
  '/archive.html',
  '/artwork.html',
  '/about.html',
  '/series-index.html',
  '/lost.html',
  '/collage.html',
  '/photography.html',
  '/sculpture.html',
  '/painting.html',
  '/api.html',
  '/changes.html',
  '/chromatic.html',
  '/wall.html',
  '/privacy.html',
  '/series.html',
  '/404.html',
  '/guernica.html',
  '/targets.html',
  '/framed.html',
  '/torsos-faces.html',
  '/gallery-images.html',
  '/mr-snowmann.html',
  '/crosses.html',
  '/collaboration.html',
  '/start-here.html',
  '/favorites.html',
  '/stories.html',
  '/why-i-made-things.html',
  '/timeline.html',
  '/site.min.css',
  '/search.js',
  '/catalog-home.json',
  '/artworks/full/art0953.avif',
  '/_shared/ui.css',
  '/_shared/ui.js',
  '/_shared/nav-active.js',
  '/_shared/anime.min.js',
];

/* ── Install: precache core shell ─────────────────────────────────────────── */
self.addEventListener('install', e =>
  e.waitUntil(
    caches.open(CACHE_V)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  )
);

/* ── Activate: prune old caches ───────────────────────────────────────────── */
self.addEventListener('activate', e =>
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_V).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
);

/* ── Fetch ────────────────────────────────────────────────────────────────── */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  /* Images (AVIF) — cache-first; populate cache on miss */
  if (url.pathname.match(/\/artworks\/.*\.avif$/)) {
    e.respondWith(
      caches.match(e.request).then(hit => {
        if (hit) return hit;
        return fetch(e.request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_V).then(c => c.put(e.request, clone));
          }
          return res;
        }).catch(() => hit || new Response('', { status: 503 }));
      })
    );
    return;
  }

  /* JSON catalog (catalog*, chromatic, dims, colors) — stale-while-revalidate
     Serve cached immediately for perceived performance, update in background */
  if (url.pathname.match(/(catalog|chromatic|dims|colors).*\.json$/)) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        // 1. Always return cached version immediately (stale)
        const fetchPromise = fetch(e.request).then(res => {
          // 2. Update cache in background (while user sees stale)
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_V).then(c => c.put(e.request, clone));
          }
          return res;
        });
        // Return cached immediately, or wait for network if not cached
        return cached || fetchPromise;
      })
    );
    return;
  }

  /* Other JSON (API, config, etc.) — network-first for immediate updates */
  if (url.pathname.endsWith('.json')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_V).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request)
          .then(cached => cached || new Response('', { status: 503 })))
    );
    return;
  }

  /* HTML / CSS / JS — network-first; cache as offline fallback */
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_V).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(async () => {
        // Offline: serve the exact cached response if we have it.
        const cached = await caches.match(e.request);
        if (cached) return cached;
        // Never blank a navigation — fall back to the cached app shell, then a
        // small branded offline page. (Old behaviour returned an empty 503,
        // which painted a white screen for any uncached page offline.)
        if (e.request.mode === 'navigate') {
          const shell = (await caches.match('/index.html')) || (await caches.match('/'));
          if (shell) return shell;
          return new Response(
            '<!doctype html><html lang="en"><meta charset="utf-8">' +
            '<meta name="viewport" content="width=device-width,initial-scale=1">' +
            '<title>Offline — JFSN Archive</title>' +
            '<body style="margin:0;font-family:Inter,system-ui,sans-serif;background:#fcf9f3;color:#0B0B0B;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:2rem">' +
            '<div><p style="font-size:18px;margin:0 0 8px">You’re offline.</p>' +
            '<p style="color:#575757;margin:0">This page isn’t cached yet — reconnect and reload.</p></div>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 503 }
          );
        }
        // Non-navigation (CSS/JS/etc.) with no cache — nothing useful to give.
        return new Response('', { status: 503 });
      })
  );
});
