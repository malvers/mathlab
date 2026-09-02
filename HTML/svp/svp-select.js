// Pretty dropdowns for svp pages.
//
// A native <select> is drawn by the operating system, so no CSS of ours ever
// reaches it: it sits in the page as a grey macOS menu in the wrong font
// (Doc, 02.09.2026). This file replaces every <select> on a page with a real
// element in the house style and keeps the original <select> around, hidden
// and in sync — so existing handlers, .value reads and form submits all keep
// working unchanged.
//
//   <script src="svp-select.js"></script>     (root)  or "../svp-select.js"
//
// Opt out for a single element with  <select data-native>.
// New options added later are picked up by calling  SvpSelect.refresh(el).
(function (global) {
    'use strict';

    let styled = false;

    function injectStyle() {
        if (styled) return;
        styled = true;
        const css = [
            '.svp-sel { position: relative; }',
            '.svp-sel > select { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }',
            '.svp-sel-btn {',
            '  width: 100%; display: flex; align-items: center; gap: 10px;',
            '  font: inherit; font-size: 0.95rem; color: inherit; text-align: left;',
            '  background: var(--card); border: 1px solid var(--line); border-radius: 8px;',
            '  padding: 8px 10px; cursor: pointer;',
            '}',
            '.svp-sel-btn:hover { border-color: var(--phi); }',
            '.svp-sel-btn:focus-visible { outline: 2px solid var(--lambda); outline-offset: 2px; }',
            '.svp-sel-btn .svp-sel-val { flex: 1 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
            '.svp-sel-btn .svp-sel-caret { flex: 0 0 auto; opacity: 0.7; font-size: 0.75em; transition: transform 0.15s; }',
            '.svp-sel.open .svp-sel-btn { border-color: var(--lambda); }',
            '.svp-sel.open .svp-sel-caret { transform: rotate(180deg); }',
            '.svp-sel-menu {',
            '  position: absolute; z-index: 60; left: 0; right: 0; top: calc(100% + 4px);',
            '  background: var(--card); border: 1px solid var(--line); border-radius: 10px;',
            '  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.34); padding: 4px;',
            '  max-height: 320px; overflow-y: auto;',
            '}',
            '.svp-sel-menu[hidden] { display: none; }',
            /* the menu may open upwards when there is no room below */
            '.svp-sel.up .svp-sel-menu { top: auto; bottom: calc(100% + 4px); }',
            '.svp-sel-opt {',
            '  display: block; width: 100%; text-align: left; font: inherit; font-size: 0.93rem;',
            '  color: inherit; background: none; border: 0; border-radius: 7px;',
            '  padding: 7px 10px; cursor: pointer;',
            '}',
            '.svp-sel-opt:hover, .svp-sel-opt.here { background: rgba(245, 194, 66, 0.16); }',
            '.svp-sel-opt.on { color: var(--lambda); }',
            '.svp-sel-opt[disabled] { opacity: 0.45; cursor: default; }',
            '@media print { .svp-sel-menu { display: none !important; } }'
        ].join('\n');
        const el = document.createElement('style');
        el.setAttribute('data-svp-select', '');
        el.textContent = css;
        document.head.appendChild(el);
    }

    /* one open menu at a time */
    let openBox = null;
    function closeOpen() {
        if (!openBox) return;
        openBox.el.classList.remove('open', 'up');
        openBox.menu.hidden = true;
        openBox.btn.setAttribute('aria-expanded', 'false');
        openBox = null;
    }
    document.addEventListener('click', closeOpen);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeOpen(); });

    function build(sel) {
        if (sel.dataset.svpSel === '1' || 'native' in sel.dataset) return;
        sel.dataset.svpSel = '1';
        injectStyle();

        const box = document.createElement('div');
        box.className = 'svp-sel';
        sel.parentNode.insertBefore(box, sel);
        box.appendChild(sel);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'svp-sel-btn';
        btn.setAttribute('aria-haspopup', 'listbox');
        btn.setAttribute('aria-expanded', 'false');
        /* the <select> carries the accessible name (its <label for=…>), and the
           button must not lose it */
        const lab = sel.id && document.querySelector('label[for="' + sel.id + '"]');
        btn.setAttribute('aria-label', (sel.getAttribute('aria-label') ||
            (lab ? lab.textContent.trim() : '') || 'Auswahl'));
        btn.innerHTML = '<span class="svp-sel-val"></span><span class="svp-sel-caret">▾</span>';

        const menu = document.createElement('div');
        menu.className = 'svp-sel-menu';
        menu.setAttribute('role', 'listbox');
        menu.hidden = true;

        box.appendChild(btn);
        box.appendChild(menu);

        const state = { el: box, btn: btn, menu: menu, sel: sel };

        function label() {
            const o = sel.options[sel.selectedIndex];
            return o ? o.textContent : '';
        }

        function paint() {
            btn.querySelector('.svp-sel-val').textContent = label();
            menu.querySelectorAll('.svp-sel-opt').forEach(function (b) {
                b.classList.toggle('on', b.dataset.i === String(sel.selectedIndex));
                b.setAttribute('aria-selected', b.dataset.i === String(sel.selectedIndex) ? 'true' : 'false');
            });
        }

        function fill() {
            menu.innerHTML = '';
            Array.prototype.forEach.call(sel.options, function (o, i) {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'svp-sel-opt';
                b.dataset.i = String(i);
                b.textContent = o.textContent;
                b.setAttribute('role', 'option');
                if (o.disabled) b.disabled = true;
                b.addEventListener('click', function (e) {
                    e.stopPropagation();
                    pick(i);
                });
                menu.appendChild(b);
            });
            paint();
        }

        /* Changing .value in code must reach the page too, so the change event
           is dispatched exactly as the native element would. */
        function pick(i) {
            closeOpen();
            if (i === sel.selectedIndex) return;
            sel.selectedIndex = i;
            paint();
            sel.dispatchEvent(new Event('input', { bubbles: true }));
            sel.dispatchEvent(new Event('change', { bubbles: true }));
        }

        function open() {
            const wasOpen = openBox === state;
            closeOpen();
            if (wasOpen) return;
            menu.hidden = false;
            box.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
            /* flip upwards when the menu would run off the bottom */
            const r = menu.getBoundingClientRect();
            box.classList.toggle('up', r.bottom > window.innerHeight - 8 && r.height < box.getBoundingClientRect().top);
            openBox = state;
            const cur = menu.querySelector('.svp-sel-opt.on') || menu.firstChild;
            if (cur) cur.focus({ preventScroll: true });
        }

        btn.addEventListener('click', function (e) { e.stopPropagation(); open(); });
        menu.addEventListener('click', function (e) { e.stopPropagation(); });

        /* keyboard: the button behaves like the native control */
        btn.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open();
            }
        });
        menu.addEventListener('keydown', function (e) {
            const opts = Array.prototype.slice.call(menu.querySelectorAll('.svp-sel-opt:not([disabled])'));
            const at = opts.indexOf(document.activeElement);
            if (e.key === 'ArrowDown') { e.preventDefault(); (opts[at + 1] || opts[0]).focus(); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); (opts[at - 1] || opts[opts.length - 1]).focus(); }
            else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (at >= 0) pick(Number(opts[at].dataset.i)); btn.focus(); }
            else if (e.key === 'Escape') { closeOpen(); btn.focus(); }
        });

        /* code elsewhere may set .value — keep the face in step */
        sel.addEventListener('change', paint);
        box.svpRefresh = fill;
        fill();
    }

    function upgradeAll(root) {
        (root || document).querySelectorAll('select').forEach(build);
    }

    global.SvpSelect = {
        upgrade: upgradeAll,
        refresh: function (sel) {
            const box = sel && sel.closest ? sel.closest('.svp-sel') : null;
            if (box && box.svpRefresh) box.svpRefresh();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { upgradeAll(); });
    } else {
        upgradeAll();
    }
})(window);
