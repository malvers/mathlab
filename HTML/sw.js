// Minimal service worker — required so the browser offers "Install app" (PWA).
// KISS: NO offline caching. Every request goes straight to the network, so HTML/JS are always fresh.
// (The chat needs Supabase anyway, so caching message data would be pointless.)
//
// SW_VERSION: bump this string whenever you need every browser to drop stale caches. Changing the
// file's bytes makes the browser fetch+install this SW as a NEW version → activate() runs → it purges
// ANY caches left behind by older SW versions that used to serve stale pages.
const SW_VERSION = '2026-10-29-kontakt-1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => e.waitUntil((async () => {
  // Delete every cache from older SW versions (these were serving stale HTML in some browsers).
  const keys = await caches.keys();
  await Promise.all(keys.map(k => caches.delete(k)));
  await self.clients.claim(); // take control of open pages immediately
})()));

// A fetch handler must exist for installability. We do NOTHING here → the browser performs the
// normal network fetch, so nothing is ever served from a cache.
self.addEventListener('fetch', () => {});

// --- VGP Web Push ---------------------------------------------------------------------------------
// Content-less ping (the server can't read E2E messages). Show a generic notification; an optional
// JSON payload may override title, body, tag and the page a tap opens - the Kontakt ping carries
// "Nachricht vom Stundenplan" and its own tag, so it never replaces a family notification.
// VGP-only; other labs never subscribe, so this never fires for them.
self.addEventListener('push', (e) => {
  let title = 'VGP', body = 'Neue Nachricht', tag = 'vgp-msg', url = '';
  if (e.data) { try { const d = e.data.json(); title = d.title || title; body = d.body || body; tag = d.tag || tag; url = d.url || ''; } catch (_) {} }
  e.waitUntil(self.registration.showNotification(title, {
    body, icon: '/vgp/icons/icon-192.png', badge: '/vgp/icons/icon-192.png', tag, renotify: true, data: { url }
  }));
});

// Tap a notification → its own page (Kontakt) if it names one, else focus an open VGP window, else open the chat.
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '';
  e.waitUntil((async () => {
    const wins = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (url) {
      for (const w of wins) { if (w.url.includes(url) && 'focus' in w) return w.focus(); }
      if (clients.openWindow) return clients.openWindow(url);
      return;
    }
    for (const w of wins) { if (w.url.includes('/vgp/') && 'focus' in w) return w.focus(); }
    if (clients.openWindow) return clients.openWindow('/vgp/vgpchat.html');
  })());
});
