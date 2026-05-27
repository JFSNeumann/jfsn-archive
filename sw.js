/* sw.js — Service Worker for jfsn.com
   Strategy:
   - AVIF images  → cache-first  (thumbnails/full/mini)
   - JSON files   → network-first (catalog updates propagate immediately)
   - HTML/CSS/JS  → stale-while-revalidate
   To invalidate all caches: bump CACHE_V below, then deploy. */

const CACHE_V  = 'jfsn-20260527190947';
const PRECACHE = [
  '/',
  '/index.html',
  '/archive.html',
  '/about.html',
  '/series-index.html',
  '/site.css',
  '/search.js',
  '/catalog-home.json',
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

  /* JSON catalog — network-first so updates propagate immediately */
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

  /* HTML / CSS / JS — stale-while-revalidate */
  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_V).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
