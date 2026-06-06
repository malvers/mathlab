// Tracker service worker — network-first, so a fresh GitHub-Pages deploy is picked
// up on the very next load instead of waiting out the WebView's HTTP cache.
//
// Why this works: GitHub purges its Fastly edge the moment a deploy lands, so the
// live file is fresh within seconds. The only thing that kept the device "stale"
// was its own WebView HTTP cache (max-age=600). By fetching with cache:'no-store'
// we bypass that cache entirely and always get the live file.
//
// Scope is /tracker/ (this file lives there) → it CANNOT touch the other apps on
// docalvers.de. We only intercept same-origin GETs; POSTs (Supabase/Gemini) and
// cross-origin requests (map tiles, CDNs) pass straight through, untouched.
//
// The cache is an OFFLINE FALLBACK only — handy out on the trail in a dead spot.

const CACHE = 'tracker-v1';

self.addEventListener('install', () => {
  // Take over as soon as installed — no "waiting" generation lingering.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Drop any older cache versions so we never serve a stale generation.
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Leave everything that isn't our own-origin GET alone: POSTs to Supabase/Gemini,
  // map tiles, CDN libs — all go straight to the network as before.
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  // Network-first: always try the LIVE file (cache:'no-store' skips the WebView's
  // stale HTTP cache); stash a copy for offline; only fall back to that copy when
  // the network is genuinely unavailable. Online → it can never serve a stale page.
  event.respondWith((async () => {
    try {
      const fresh = await fetch(req, { cache: 'no-store' });
      if (fresh && fresh.ok) {
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone());
      }
      return fresh;
    } catch (err) {
      const cached = await caches.match(req);
      if (cached) return cached;
      throw err;
    }
  })());
});
