// In-app APK self-update for the Tracker (sideloaded app, no Play Store). On start, compares the
// installed versionCode (native AppUpdate.getInfo) with version.json next to tracker.html; if the
// server has a newer build, shows a one-tap banner → AppUpdate.installApk(url) downloads the APK and
// launches Android's installer. Browser / non-native → no-op (the web is always live via Plan A).
//
// IIFE global like the other tracker modules; the native plugin is reached via the Capacitor bridge.
(function (global) {
    'use strict';

    function plugin() {
        const C = global.Capacitor;
        return (C && C.isNativePlatform && C.isNativePlatform() && C.Plugins && C.Plugins.AppUpdate)
            ? C.Plugins.AppUpdate : null;
    }

    const VERSION_URL = 'version.json'; // served next to tracker.html (docalvers.de/tracker/)
    let shown = false;

    function injectStyle() {
        if (document.getElementById('appupd-style')) return;
        const s = document.createElement('style');
        s.id = 'appupd-style';
        s.textContent =
            '#appupd-banner{position:fixed;left:50%;bottom:max(16px,env(safe-area-inset-bottom));' +
            'transform:translateX(-50%);z-index:100001;display:none;align-items:center;gap:10px;' +
            'max-width:min(94vw,460px);padding:10px 10px 10px 16px;border-radius:14px;' +
            'background:rgba(8,20,42,0.96);border:1px solid rgba(245,194,66,0.55);' +
            'box-shadow:0 12px 40px rgba(0,0,0,0.5);backdrop-filter:blur(8px);' +
            'font-family:Arial,Helvetica,sans-serif;color:#fff;font-size:0.9rem;}' +
            '#appupd-banner.show{display:flex;}' +
            '#appupd-banner .au-txt{flex:1 1 auto;line-height:1.3;}' +
            '#appupd-banner .au-txt b{color:var(--orange,rgb(245,194,66));font-weight:600;}' +
            '#appupd-banner button{flex:0 0 auto;border:none;border-radius:10px;cursor:pointer;' +
            'font-family:Arial,Helvetica,sans-serif;font-size:0.86rem;}' +
            '#appupd-install{background:rgb(121,158,49);color:#fff;padding:8px 13px;}' +
            '#appupd-x{background:transparent;color:rgba(255,255,255,0.6);padding:8px 4px;font-size:1.05rem;}';
        document.head.appendChild(s);
    }

    function showBanner(latest, AU) {
        if (shown) return;
        shown = true;
        injectStyle();
        const el = document.createElement('div');
        el.id = 'appupd-banner';
        el.setAttribute('role', 'status');
        el.innerHTML =
            '<span class="au-txt"><b>Neue Version verfügbar</b>' +
            (latest.versionName ? ' (' + latest.versionName + ')' : '') + '. Installieren?</span>' +
            '<button id="appupd-install" type="button">Installieren</button>' +
            '<button id="appupd-x" type="button" aria-label="Später">✕</button>';
        document.body.appendChild(el);
        document.getElementById('appupd-x').onclick = function () { el.classList.remove('show'); };
        document.getElementById('appupd-install').onclick = function () {
            const btn = this;
            btn.disabled = true; btn.textContent = 'Lädt …';
            AU.installApk({ url: latest.url }).then(function () {
                btn.textContent = 'Installer …'; // Android's installer takes over from here
            }).catch(function (e) {
                btn.disabled = false; btn.textContent = 'Installieren';
                const msg = (e && (e.message || e)) || 'Fehler';
                if (global.DebugWindow) DebugWindow.log('Update-Fehler: ' + msg);
                if (typeof global.toast === 'function') global.toast('Update fehlgeschlagen: ' + msg);
            });
        };
        el.classList.add('show');
    }

    async function check() {
        const AU = plugin();
        if (!AU) return; // browser → web is always live (Plan A), nothing to install
        let info;
        try { info = await AU.getInfo(); } catch (e) { return; }
        let latest;
        try {
            const bust = (global.Date && Date.now) ? Date.now() : '';
            const r = await fetch(VERSION_URL + '?t=' + bust, { cache: 'no-store' });
            if (!r.ok) return;
            latest = await r.json();
        } catch (e) { return; }
        const have = Number(info && info.versionCode) || 0;
        const want = Number(latest && latest.versionCode) || 0;
        if (want > have && latest && latest.url) showBanner(latest, AU);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', check);
    else check();

    global.AppUpdate = { check: check };
})(window);
