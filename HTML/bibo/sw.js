// TEMPORARY until Mon 23.11.2026 – remove /bibo/ then.
// Kill switch for the old DocBibo service worker (scope /bibo/): the app is called DocBib now and lives at /bib/.
// Installed copies fetch this file on their next start (byte change = update), take over at once, delete only the
// old shell caches 'docbibo-shell-*' (the new app keeps its own 'docbib-shell-*'), unregister themselves and send
// every open /bibo/ window to /bib/ with its query and hash. No fetch handler: everything goes to the network.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('docbibo-shell-')) await caches.delete(k);
    await self.registration.unregister();
    for (const c of await self.clients.matchAll({ type: 'window' })) {
        const u = new URL(c.url);
        if (u.pathname.startsWith('/bibo/')) try { await c.navigate('/bib/' + u.search + u.hash); } catch (_) { }
    }
})()));
