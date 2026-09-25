// Service worker of the Vorrechnen lab (HTML/vorrechnen.html) - made from svp/sw-fahrplan.js.
//
// Why it exists at all: Doc, 25.09.2026, "Kannst du es bitte immer im Vollbild starten?" A web page
// may only go full screen on a user gesture; an INSTALLED app with "display": "fullscreen" in its
// manifest starts that way. Chrome offers "Install app" (rather than a bare shortcut) only when a
// worker's fetch handler really answers - an empty handler is ignored
// (developer.chrome.com/blog/update-install-criteria).
//
// Registered with the NARROW scope '/vorrechnen.html': no other page of the site is controlled.
// Network first: online the page is always the fresh one, so live reload keeps working; the cache
// only answers when there is no network.
const CACHE = 'vorrechnen-2026-09-25';
/* Fonts and KaTeX from outside never change under a version: the store answers them first. */
const CDN = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'];

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('vorrechnen-') && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
})()));

self.addEventListener('fetch', (e) => {
    const req = e.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    /* Live reload, the probe store and the Gemini proxy: always straight to the network. */
    if (url.pathname.startsWith('/__') || (req.headers.get('accept') || '').includes('text/event-stream')) return;
    if (url.origin === self.location.origin) { e.respondWith(netzZuerst(req)); return; }
    if (CDN.includes(url.origin)) { e.respondWith(vorratZuerst(req)); return; }
});

async function netzZuerst(req) {
    const cache = await caches.open(CACHE);
    try {
        const res = await fetch(req);
        if (res && res.ok) cache.put(req, res.clone());
        return res;
    } catch (e) {
        const hit = await cache.match(req, { ignoreSearch: true });
        if (hit) return hit;
        throw e;
    }
}

async function vorratZuerst(req) {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req);
    if (hit) return hit;
    const res = await fetch(req);
    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
    return res;
}
