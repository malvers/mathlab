// js/radial-menu.js — reusable radial / half-circle fan-out menu.
//
// A "stack" <div> holding child buttons (.mini-btn by default) fans out around an anchor. THIS widget
// owns the duplicated, bug-prone MECHANICS — open/close/toggle, hamburger tap, right-click,
// long-press (with move-cancel), close-on-outside, close-on-button-tap. Each lab keeps its OWN look by
// supplying a `layout(stack, btns)` callback (positions the stack + buttons) and an optional `onOpen()`
// to refresh button states before the fan opens.
//
// Deduped from three hand-copied implementations: tracker.js, worldclock-menus.js, voicerecorder/js/popup.js.
//
// Usage:
//   const menu = RadialMenu({
//     stack: document.getElementById('mini-stack'),   // required
//     hamburger: document.getElementById('menu-btn'), // optional: tap toggles
//     layout(stack, btns) { ... position stack + each button ... },   // required for a fan
//     onOpen() { ...refresh labels / grey-out / show-hide buttons... },// optional
//     shouldOpen(e) { return true/false; },           // optional guard for right-click + long-press
//     buttonsSelector: '.mini-btn',  visibleOnly: true,  longPress: 550,
//     contextMenu: true,  closeOnOutside: true,  closeOnButtonTap: true,  onClose() {},
//   });
//   menu.open(); menu.close(); menu.toggle(); menu.isOpen(); menu.refresh();
(function (global) {
    'use strict';
    function RadialMenu(opts) {
        opts = opts || {};
        const stack = opts.stack;
        const noop = { open() {}, close() {}, toggle() {}, isOpen() { return false; }, refresh() {} };
        if (!stack) return noop;

        const sel = opts.buttonsSelector || '.mini-btn';
        const visibleOnly = opts.visibleOnly !== false;
        const longPressMs = (typeof opts.longPress === 'number') ? opts.longPress : 550;
        const ham = opts.hamburger || null;
        const allow = (e) => !opts.shouldOpen || opts.shouldOpen(e);
        let lastInfo = null; // { x, y, event } of the trigger — passed to layout (cursor-anchored menus)

        function buttons() {
            let b = Array.prototype.slice.call(stack.querySelectorAll(sel));
            if (visibleOnly) b = b.filter((x) => x.style.display !== 'none');
            return b;
        }
        function isOpen() { return stack.classList.contains('popup'); }
        function open(info) {
            lastInfo = info || null;             // trigger coords (right-click / long-press point), for cursor-anchored layouts
            if (opts.onOpen) opts.onOpen();
            stack.classList.add('popup');
            if (ham) ham.classList.add('open');
            if (opts.layout) opts.layout(stack, buttons(), lastInfo);
        }
        function close() {
            stack.classList.remove('popup');
            if (ham) ham.classList.remove('open');
            stack.querySelectorAll(sel).forEach((b) => { b.style.left = ''; b.style.top = ''; });
            if (opts.onClose) opts.onClose();
        }
        function toggle() { isOpen() ? close() : open(); }
        // re-run onOpen + layout while open (e.g. after a button shows/hides or the viewport resizes)
        function refresh() { if (isOpen()) { if (opts.onOpen) opts.onOpen(); if (opts.layout) opts.layout(stack, buttons(), lastInfo); } }

        if (ham) ham.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });

        if (opts.contextMenu !== false) {
            window.addEventListener('contextmenu', (e) => {
                e.preventDefault();          // always suppress the native menu (e.g. Android "save image")
                if (isOpen()) return;
                if (allow(e)) open({ x: e.clientX, y: e.clientY, event: e });
            });
        }

        if (longPressMs > 0) {
            let t = null, x = 0, y = 0;
            const cancel = () => { if (t) { clearTimeout(t); t = null; } };
            document.addEventListener('touchstart', (e) => {
                if (isOpen()) return;
                const tg = e.target;
                if (tg && tg.closest && tg.closest('button, input, label, textarea')) return;
                if (!allow(e)) return;
                const p = e.touches[0]; x = p.clientX; y = p.clientY;
                cancel(); t = setTimeout(() => { t = null; open({ x: x, y: y, event: e }); }, longPressMs);
            }, { passive: true });
            document.addEventListener('touchmove', (e) => {
                const p = e.touches[0];
                if (Math.abs(p.clientX - x) > 10 || Math.abs(p.clientY - y) > 10) cancel();
            }, { passive: true });
            document.addEventListener('touchend', cancel);
            document.addEventListener('touchcancel', cancel);
        }

        if (opts.closeOnOutside !== false) {
            document.addEventListener('mousedown', (e) => {
                if (!isOpen()) return;
                if (stack.contains(e.target)) return;
                if (ham && ham.contains(e.target)) return;   // the hamburger toggles itself
                close();
            });
        }

        if (opts.closeOnButtonTap !== false) {
            // a tap on a child <button> closes; a toggle that wants to stay open calls
            // e.stopPropagation() in its own handler (so this listener never sees the click).
            stack.addEventListener('click', (e) => { if (e.target.closest('button')) close(); });
        }

        return { open, close, toggle, isOpen, refresh };
    }
    global.RadialMenu = RadialMenu;
})(typeof window !== 'undefined' ? window : this);
