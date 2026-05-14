// 3D MORPH — companion to the RING diagnostic. Owns the button creation and
// the window-spawn logic for the 3D view.
//
// The button itself sits in the canvas-container (below RING) and is laid out
// by draw20-ui.js. The actual 3D rendering happens in morph3d-view.html, which
// is opened in a popup and reads data from window.opener.__morph3dData.
//
// Public API:
//   Morph3D.createMorph3DButton(host, onClick?)
//   Morph3D.openMorph3D(ringData) → opens the 3D MORPH window
(function (global) {

    const GEOM_KEY = 'draw20-morph3d-geom';

    function openMorph3D(ringData) {
        // Pass data through window so the view can pick it up.
        global.__morph3dData = ringData || null;

        // Restore persisted window size/position (saved by view.html itself).
        let geom = null;
        try { geom = JSON.parse(localStorage.getItem(GEOM_KEY) || 'null'); } catch (_) {}
        const defW = Math.min(1200, Math.round(window.screen.availWidth * 0.9));
        const defH = Math.min(900, Math.round(window.screen.availHeight * 0.9));
        const wsz = geom && geom.w > 200 ? geom.w : defW;
        const hsz = geom && geom.h > 200 ? geom.h : defH;
        // Match RING's exact feature shape — width/height (and left/top if
        // restored). Adding more flags (toolbar=no, …) confuses some Chrome
        // builds into opening a tab instead of a popup, which silently drops
        // every position/size feature.
        const features = [`width=${wsz}`, `height=${hsz}`];
        if (geom && Number.isFinite(geom.x) && Number.isFinite(geom.y)) {
            features.push(`left=${geom.x}`, `top=${geom.y}`);
        }

        const w = window.open('morph3d-view.html', 'morph3d', features.join(','));
        if (!w) return null;
        try { w.focus(); } catch (e) { /* popup might be blocked */ }
        // If the named window already existed, the inline script won't re-run on
        // window.open alone — force a reload so it picks up the fresh data.
        try {
            if (w.location && w.location.pathname && w.location.pathname.indexOf('morph3d-view.html') >= 0) {
                w.location.reload();
            }
        } catch (e) { /* cross-origin or not loaded yet — fine, fresh window will load itself */ }
        return w;
    }

    function createMorph3DButton(host, onClick) {
        const btn = document.createElement('button');
        btn.id = 'draw20-morph3d-btn';
        btn.textContent = '3D MORPH';
        btn.title = '3D-Morph-Ansicht öffnen (neues Fenster)';
        btn.addEventListener('click', () => {
            if (typeof onClick === 'function') onClick();
            else openMorph3D(null);
        });
        if (host && typeof host.appendChild === 'function') host.appendChild(btn);
        return btn;
    }

    global.Morph3D = { createMorph3DButton, openMorph3D };
})(window);
