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
  // NOTE: we deliberately do NOT skipWaiting() here. The first-ever install has no active
  // worker to wait for, so it activates at once anyway. An UPDATE, however, is left in the
  // "waiting" state on purpose → the page detects it and shows a "new version" banner; only
  // when the user taps it do we activate (see the 'message' handler below). No silent swap.
});

// The page asks us to take over (user tapped "Aktualisieren"). Activating now fires
// 'controllerchange' in the page, which reloads once onto the fresh generation.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
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
  // FEAT-19: ?_fresh= freshness probes must BYPASS the SW (hit the real network), otherwise the cache
  // would mask a dead server and the "SERVER DOWN / OFFLINE" banner could never fire.
  if (new URL(req.url).searchParams.has('_fresh')) return;

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
