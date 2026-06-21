// js/cyber-select.js — theme-styled replacement for a native <select>.
//
// Why: a native <select>'s OPEN option list is rendered by the OS and CANNOT be styled with CSS, so
// on Android it shows a plain grey system list that clashes with the cyber theme. CyberSelect keeps
// the underlying <select> as the (hidden) data model and renders its own trigger + option panel.
// Picking an option writes select.value and dispatches a 'change' event, so any existing listener on
// the <select> keeps working unchanged. Pure progressive enhancement — if this never runs, the native
// control still works.
//
// Usage:  CyberSelect.enhance(document.getElementById('fuel-type'))
// Call AFTER you've set the select's initial .value, so the trigger shows the right label.
(function () {
    'use strict';

    let openCleanup = null;
    function closeOpen() { if (openCleanup) { const c = openCleanup; openCleanup = null; c(); } }

    function enhance(sel) {
        if (!sel || sel.__cyber) return;
        sel.__cyber = true;
        sel.style.display = 'none'; // keep as the data model; our trigger stands in for it visually

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'cyber-sel-trigger';
        trigger.setAttribute('aria-haspopup', 'listbox');
        const aria = sel.getAttribute('aria-label');
        if (aria) trigger.setAttribute('aria-label', aria);
        sel.parentNode.insertBefore(trigger, sel.nextSibling);

        const labelOf = (v) => { const o = Array.from(sel.options).find((x) => x.value === v); return o ? o.textContent : v; };
        function syncLabel() { trigger.textContent = labelOf(sel.value); }
        syncLabel();

        function open() {
            closeOpen();
            const panel = document.createElement('div');
            panel.className = 'cyber-sel-panel';
            panel.setAttribute('role', 'listbox');
            Array.from(sel.options).forEach((o) => {
                const opt = document.createElement('div');
                opt.className = 'cyber-sel-opt' + (o.value === sel.value ? ' sel' : '');
                opt.setAttribute('role', 'option');
                const lbl = document.createElement('span'); lbl.className = 'lbl'; lbl.textContent = o.textContent;
                const tick = document.createElement('span'); tick.className = 'tick'; tick.textContent = '✓';
                opt.appendChild(lbl); opt.appendChild(tick);
                opt.addEventListener('click', () => {
                    if (sel.value !== o.value) {
                        sel.value = o.value;
                        sel.dispatchEvent(new Event('change', { bubbles: true })); // existing listeners fire
                    }
                    syncLabel();
                    closeOpen();
                });
                panel.appendChild(opt);
            });
            document.body.appendChild(panel);

            // Position under the trigger; flip above if there isn't room below. Panel is position:fixed
            // (appended to <body>) so it escapes any scrollable/overflow-clipped dialog.
            const r = trigger.getBoundingClientRect();
            panel.style.minWidth = r.width + 'px';
            const pw = panel.offsetWidth, ph = panel.offsetHeight;
            let top = r.bottom + 4;
            if (top + ph > window.innerHeight - 8) top = Math.max(8, r.top - ph - 4);
            panel.style.left = Math.max(8, Math.min(r.left, window.innerWidth - pw - 8)) + 'px';
            panel.style.top = top + 'px';
            trigger.classList.add('open');

            const onDoc = (e) => { if (!panel.contains(e.target) && e.target !== trigger) closeOpen(); };
            const onKey = (e) => { if (e.key === 'Escape') closeOpen(); };
            const onAway = () => closeOpen(); // any scroll/resize → close (fixed panel would otherwise detach)
            setTimeout(() => document.addEventListener('click', onDoc), 0);
            document.addEventListener('keydown', onKey);
            window.addEventListener('resize', onAway);
            window.addEventListener('scroll', onAway, true);
            openCleanup = () => {
                document.removeEventListener('click', onDoc);
                document.removeEventListener('keydown', onKey);
                window.removeEventListener('resize', onAway);
                window.removeEventListener('scroll', onAway, true);
                trigger.classList.remove('open');
                panel.remove();
            };
        }

        trigger.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            if (openCleanup) closeOpen(); else open();
        });
        // Keep the trigger label correct if code changes the value programmatically (it dispatches change).
        sel.addEventListener('change', syncLabel);
    }

    function enhanceAll(root) {
        (root || document).querySelectorAll('select[data-cyber]').forEach(enhance);
    }

    window.CyberSelect = { enhance, enhanceAll };
})();
