// Service worker of the Fahrplan app (HTML/svp/fahrplan.html).
//
// Registered with the NARROW scope '/svp/fahrplan.html' - the plan pages next to it must NOT be
// controlled by a worker: they are edited live, and anything served from a cache there would be a
// yesterday's plan. Which client a worker controls is decided by its scope; what it may cache is
// not, so the app's stylesheets and scripts under /svp/ are kept here all the same.
//
// The rule is network first: online the page is always the fresh one (and live reload keeps
// working), offline it comes out of the cache - the run of a lesson is read in a classroom, and
// there is no signal in every classroom. The bullets themselves already survive offline in
// localStorage; this is what makes the shell around them survive too.
//
// A fetch handler that really answers is also what makes Chrome offer "Install app" rather than a
// bare shortcut (an empty handler is ignored - developer.chrome.com/blog/update-install-criteria).
const CACHE = 'fahrplan-2026-09-24';
/* Fonts and KaTeX come from outside; they never change under a version, so the store answers them
   first and the network is only asked once. */
const CDN = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'];

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('fahrplan-') && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
})()));

self.addEventListener('fetch', (e) => {
    const req = e.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    /* Live reload holds a request open for as long as nothing changes - never through here
       (/__live/, and an event stream wherever it comes from). */
    if (url.pathname.startsWith('/__') || (req.headers.get('accept') || '').includes('text/event-stream')) return;
    if (url.origin === self.location.origin) { e.respondWith(netzZuerst(req)); return; }
    if (CDN.includes(url.origin)) { e.respondWith(vorratZuerst(req)); return; }
    /* Supabase: always the network. A cached answer would be an old Fahrplan, and the token in
       the header belongs to one request only. */
});

async function netzZuerst(req) {
    const cache = await caches.open(CACHE);
    try {
        const res = await fetch(req);
        if (res && res.ok) cache.put(req, res.clone());
        return res;
    } catch (e) {
        /* ignoreSearch: the page may be opened as fahrplan.html?utm=... from the app icon */
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
    /* opaque = a no-cors answer (a font): it cannot be read, but it can be kept and replayed */
    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
    return res;
}
