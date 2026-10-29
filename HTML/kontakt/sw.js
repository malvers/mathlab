// Kontakt app - service worker (Doc, 29.10.2026). Scope /kontakt/: it makes the app installable and
// owns the app's push subscription, apart from VGP's (../sw.js). No caching: every request goes to the
// network. The push function seals "Nachricht vom Stundenplan" for this device; without a payload the
// same words are shown anyway.
const SW_VERSION = '2026-10-29-2';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// installability needs a fetch handler; doing nothing lets the browser fetch normally
self.addEventListener('fetch', () => {});

self.addEventListener('push', (e) => {
  let title = 'Nachricht vom Stundenplan', body = 'Kontakt';
  if (e.data) { try { const d = e.data.json(); title = d.title || title; body = d.body || body; } catch (_) {} }
  e.waitUntil(self.registration.showNotification(title, {
    body, icon: 'icon-192.png', badge: 'badge-96.png', tag: 'kontakt', renotify: true
  }));
});

// Tap → the open Kontakt window (inside this worker's scope: /kontakt/ here, / on doc-kontakt.pages.dev),
// else open the app.
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil((async () => {
    const wins = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const w of wins) { if (w.url.startsWith(self.registration.scope) && 'focus' in w) return w.focus(); }
    if (clients.openWindow) return clients.openWindow('./');
  })());
});
