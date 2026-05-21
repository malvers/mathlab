// Minimal service worker — required so the browser offers "Install app" (PWA).
// KISS: no offline caching. Requests pass straight through to the network.
// (The chat needs Supabase anyway, so caching message data would be pointless.)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
// A fetch handler must exist for installability; this one just lets the network handle it.
self.addEventListener('fetch', () => {});
