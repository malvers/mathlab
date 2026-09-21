// Dropdown-Knopf fuer SVP-Seiten: ein Knopf, darunter ein Menue aus Knoepfen.
//
// Dieselbe Mechanik stand bis zum 21.09.2026 viermal in der Gegend (Export,
// Vortraege und Gruppenwahl in svp-plan-menus.js, Gruppenwahl in
// informatik/vortraege.js) - jedesmal derselbe Vierklang aus Aufklappen,
// Klick daneben, Escape und aria-expanded. Ab jetzt zentral (Doc, 21.09.2026:
// "zentral"). Optik und Klassennamen bleiben, wie sie waren: .export-drop /
// .export-toggle / .export-menu / .export-item stehen in svp-dialogs.css, so
// dass jedes Menue der Seite gleich aussieht.
//
//   <script src="svp-drop.js"></script>      (root)  oder "../svp-drop.js"
//
//   const d = svpDrop({ label: 'Aktionen', title: '…' });
//   d.item({ id: 'btn-edit', text: '✎ Bearbeiten', onClick: fn });
//   bar.appendChild(d.el);
//
// `d.sync()` blendet den ganzen Knopf aus, solange jeder Eintrag versteckt
// ist - ein Menue, das sich leer oeffnet, sieht kaputt aus.
(function (global) {
    'use strict';

    function svpDrop(opts) {
        const o = opts || {};

        const drop = document.createElement('div');
        drop.className = 'export-drop' + (o.className ? ' ' + o.className : '');

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'action export-toggle' + (o.toggleClass ? ' ' + o.toggleClass : '');
        toggle.setAttribute('aria-haspopup', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        if (o.title) toggle.title = o.title;
        const label = document.createElement('span');
        label.textContent = o.label || '';
        const caret = document.createElement('span');
        caret.className = 'export-caret';
        caret.textContent = '▾';
        toggle.appendChild(label);
        toggle.appendChild(document.createTextNode(' '));
        toggle.appendChild(caret);

        const menu = document.createElement('div');
        menu.className = 'export-menu';
        menu.hidden = true;

        drop.appendChild(toggle);
        drop.appendChild(menu);

        function open(on) {
            menu.hidden = !on;
            toggle.setAttribute('aria-expanded', on ? 'true' : 'false');
            toggle.classList.toggle('on', !!on);
        }

        toggle.addEventListener('click', function (e) { e.stopPropagation(); open(menu.hidden); });
        /* ein Klick auf einen Eintrag macht das Menue zu - auch wenn der
           Eintrag selbst die Seite umbaut */
        menu.addEventListener('click', function () { open(false); });
        document.addEventListener('click', function (e) { if (!drop.contains(e.target)) open(false); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });

        /* einen fertigen Knopf ins Menue haengen - so wandern bestehende
           Knoepfe samt ihrer Handler hinein, ohne neu gebaut zu werden */
        function add(btn) {
            btn.classList.add('action', 'export-item');
            menu.appendChild(btn);
            return btn;
        }

        function item(spec) {
            const s = spec || {};
            const b = document.createElement('button');
            b.type = 'button';
            if (s.id) b.id = s.id;
            if (s.className) b.className = s.className;
            if (s.html) b.innerHTML = s.html; else b.textContent = s.text || '';
            if (s.title) b.title = s.title;
            if (s.hidden) b.hidden = true;
            if (s.onClick) b.addEventListener('click', s.onClick);
            return add(b);
        }

        function sync() {
            const any = [...menu.children].some(function (b) { return !b.hidden; });
            drop.hidden = !any;
            if (!any) open(false);
            return any;
        }

        return {
            el: drop,
            toggle: toggle,
            menu: menu,
            open: open,
            add: add,
            item: item,
            sync: sync,
            setLabel: function (t) { label.textContent = t; }
        };
    }

    global.svpDrop = svpDrop;
})(window);
