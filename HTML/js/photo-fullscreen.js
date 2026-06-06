// Photo lightbox fullscreen helper — shared, single source of truth.
//
// Goal: when a photo is opened in the lightbox on a NATIVE ANDROID build
// (Capacitor WebView), switch to true immersive fullscreen so the Android
// status bar AND navigation bar both hide (edge-to-edge), and restore them
// when the lightbox closes.
//
// Approach: WEB-ONLY via the standard Fullscreen API. Requesting fullscreen on
// an element inside an Android WebView triggers the WebView's immersive mode,
// hiding both system bars — no native plugin and no APK rebuild required, so
// the app keeps updating live over the web.
//
// On desktop / mobile web we deliberately do NOTHING: the lightbox is already a
// full-viewport overlay there, and triggering the browser Fullscreen API would
// only add an unwanted permission/escape prompt. We gate strictly on native
// Android via Capacitor.isNativePlatform().
//
// Exposes a single global: window.PhotoFullscreen with enter(el) / exit().

(function (global) {
    'use strict';

    // Lightweight logger — routes to the shared DebugWindow if present, never throws.
    function dbg(msg) {
        try {
            if (typeof DebugWindow !== 'undefined' && DebugWindow && DebugWindow.log) {
                DebugWindow.log(msg);
            }
        } catch (_) {}
    }

    // Only act inside a native Capacitor (Android) shell. In a plain browser
    // window.Capacitor is undefined, so this is false and every method no-ops.
    function isNativeAndroid() {
        try {
            return !!(global.Capacitor
                && typeof global.Capacitor.isNativePlatform === 'function'
                && global.Capacitor.isNativePlatform());
        } catch (_) {
            return false;
        }
    }

    // Is the document currently in fullscreen (standard or WebKit-prefixed)?
    function fullscreenElement() {
        return document.fullscreenElement || document.webkitFullscreenElement || null;
    }

    // OPTIONAL, fully guarded: if the @capacitor/status-bar plugin happens to be
    // present at runtime we also toggle the status bar through it. It is NOT a
    // dependency of this app, so this is a best-effort no-op when absent — we add
    // nothing and never throw. The Fullscreen API alone already does the job.
    function statusBarPlugin() {
        try {
            return (global.Capacitor && global.Capacitor.Plugins && global.Capacitor.Plugins.StatusBar) || null;
        } catch (_) {
            return null;
        }
    }

    function hideStatusBar() {
        const sb = statusBarPlugin();
        if (!sb || typeof sb.hide !== 'function') return;
        try { sb.hide(); } catch (_) {}
    }

    function showStatusBar() {
        const sb = statusBarPlugin();
        if (!sb || typeof sb.show !== 'function') return;
        try { sb.show(); } catch (_) {}
    }

    // Enter immersive fullscreen on the given element (the lightbox container).
    // No-op unless running on native Android.
    function enter(el) {
        if (!isNativeAndroid()) return;
        if (!el) return;
        try {
            const req = el.requestFullscreen || el.webkitRequestFullscreen;
            if (typeof req === 'function') {
                // .call so the right element is the receiver for either spelling.
                const r = req.call(el);
                // Some implementations return a promise; swallow rejections so a
                // denied request can never bubble up and break the lightbox.
                if (r && typeof r.catch === 'function') {
                    r.catch((err) => dbg('PhotoFullscreen: enter rejected — ' + err));
                }
                dbg('PhotoFullscreen: requested fullscreen on lightbox');
            } else {
                dbg('PhotoFullscreen: no requestFullscreen available on element');
            }
        } catch (err) {
            dbg('PhotoFullscreen: enter failed — ' + err);
        }
        hideStatusBar();
    }

    // Leave fullscreen and restore the system bars. No-op unless on native
    // Android and only when something is actually in fullscreen.
    function exit() {
        if (!isNativeAndroid()) return;
        try {
            if (fullscreenElement()) {
                const ex = document.exitFullscreen || document.webkitExitFullscreen;
                if (typeof ex === 'function') {
                    const r = ex.call(document);
                    if (r && typeof r.catch === 'function') {
                        r.catch((err) => dbg('PhotoFullscreen: exit rejected — ' + err));
                    }
                    dbg('PhotoFullscreen: exited fullscreen');
                }
            }
        } catch (err) {
            dbg('PhotoFullscreen: exit failed — ' + err);
        }
        showStatusBar();
    }

    // Keep state consistent if the user leaves fullscreen via a system gesture
    // (back swipe / nav gesture) instead of the lightbox close button. We only
    // log here; restoring the bars is handled by the WebView itself when the
    // fullscreen element is dropped. Must never throw.
    function onFullscreenChange() {
        try {
            if (!fullscreenElement()) {
                // Left fullscreen externally — make sure the status bar is back.
                showStatusBar();
                dbg('PhotoFullscreen: fullscreen exited (system gesture or close)');
            }
        } catch (_) {}
    }

    try {
        document.addEventListener('fullscreenchange', onFullscreenChange);
        document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    } catch (_) {}

    global.PhotoFullscreen = { enter: enter, exit: exit };
})(window);
