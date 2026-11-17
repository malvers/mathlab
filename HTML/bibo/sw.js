// DocBibo - service worker (scope /bibo/). It makes the app installable and lets the app shell start offline.
// Own files: from the network when it answers (so a new version, and live reload on Doc's Mac, always win), else
// the stored copy. The fonts and the ZXing scan library (fixed version, iPhone path) are stored after the first load.
// The loans themselves live in localStorage, not here.
const VERSION = '2026-11-17-1';
const SHELL = 'docbibo-shell-' + VERSION;
const FILES = ['./', 'bibo.css', 'bibo.js', 'bibo-demo.js', 'manifest.webmanifest', 'icons/icon.svg',
    'icons/app-192.png', 'icons/app-512.png', 'icons/apple-touch-icon.png', '../svp/svp-tokens.css', '../js/solita-listen.js'];
const ZXING = 'https://cdn.jsdelivr.net/npm/@zxing/browser@0.2.1/umd/zxing-browser.min.js';
const FONTS = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;
const OWN = new Set(FILES.map(f => new URL(f, self.registration.scope).pathname));

self.addEventListener('install', e => e.waitUntil((async () => {
    const c = await caches.open(SHELL);
    await c.addAll(FILES);
    try { await c.add(new Request(ZXING, { mode: 'cors' })); } catch (_) { /* the CDN can come later */ }
    await self.skipWaiting();
})()));

self.addEventListener('activate', e => e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('docbibo-shell-') && k !== SHELL) await caches.delete(k);
    await self.clients.claim();
})()));

// network first with a short wait, then the stored copy
async function fresh(req, key) {
    const c = await caches.open(SHELL);
    try {
        const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 3000);
        const res = await fetch(req, { signal: ctl.signal });
        clearTimeout(t);
        if (res.ok) c.put(key || req, res.clone());
        return res;
    } catch (_) {
        return (await c.match(key || req, { ignoreSearch: true })) || Response.error();
    }
}
// stored first (fixed versions), fetched and stored once otherwise
async function stored(req) {
    const c = await caches.open(SHELL), hit = await c.match(req);
    if (hit) return hit;
    const res = await fetch(req);
    if (res.ok || res.type === 'opaque') c.put(req, res.clone());
    return res;
}

self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (url.origin === location.origin) {
        if (req.mode === 'navigate' && url.pathname.startsWith(new URL('./', self.registration.scope).pathname)) {
            e.respondWith(fresh(req, './'));
        } else if (OWN.has(url.pathname)) {
            e.respondWith(fresh(req));
        }
        // everything else (live reload's polling, other pages) goes past untouched
    } else if (req.url === ZXING || FONTS.test(req.url)) {
        e.respondWith(stored(req));
    }
});
