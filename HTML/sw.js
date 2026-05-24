// Minimal service worker — required so the browser offers "Install app" (PWA).
// KISS: NO offline caching. Every request goes straight to the network, so HTML/JS are always fresh.
// (The chat needs Supabase anyway, so caching message data would be pointless.)
//
// SW_VERSION: bump this string whenever you need every browser to drop stale caches. Changing the
// file's bytes makes the browser fetch+install this SW as a NEW version → activate() runs → it purges
// ANY caches left behind by older SW versions that used to serve stale pages.
const SW_VERSION = '2026-05-24-nocache-2';

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
