// Service worker of the audiobook page (generated into HTML/hoerbuch/ by pack_hoerbuch.mjs). It only keeps the page
// itself, its icons and the fonts, so the page opens on the plane. The book (text and sound) is encrypted in the R2
// bucket; the page stores those files itself, still encrypted, in the cache "hoerbuch-files".
const VERSION = '99a43bb0306f';
const SHELL = 'hoerbuch-shell-' + VERSION;
const FILES = ['./', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(SHELL).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k.startsWith('hoerbuch-shell-') && k !== SHELL) await caches.delete(k);
  await self.clients.claim();
})()));
const FONTS = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate' && url.origin === location.origin) {
    // the page: from the net when it answers quickly (a new version), else the stored one
    e.respondWith((async () => {
      const c = await caches.open(SHELL);
      try {
        const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 3000);
        const res = await fetch(req, { signal: ctl.signal }); clearTimeout(t);
        if (res.ok) { c.put('./', res.clone()); return res; }
      } catch (_) { /* offline */ }
      return (await c.match('./')) || Response.error();
    })());
  } else if (url.origin === location.origin && url.pathname.startsWith(new URL('./', self.registration.scope).pathname)) {
    e.respondWith(caches.match(req).then(r => r || fetch(req)));
  } else if (FONTS.test(req.url)) {
    e.respondWith((async () => {          // fonts: stored after the first visit
      const c = await caches.open(SHELL), hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    })());
  }
});
