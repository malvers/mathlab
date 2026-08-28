// Shared quick-nav for all svp pages: pill shortcuts (badge design) injected
// at the top of the page header. Include on every page with
// <script src="svp-nav.js"></script> (root) or "../svp-nav.js" (subdirs) —
// the svp root is derived from this script's own src, so links always resolve.
(function () {
    const script = document.currentScript;
    if (!script || !script.src) return;
    const base = script.src.replace(/svp-nav\.js.*$/, '');

    // [href relative to svp root, short label (pill row), badge color class,
    //  spelled-out label for the edit panel]
    const LINKS = [
        ['index.html', 'Home', 'b-grey', 'Startseite'],
        ['mathe/mathe5.html', 'MA 5', 'b-orange', 'Mathematik Klasse 5'],
        ['mathe/mathegy9.html', 'MA 9', 'b-orange', 'Mathematik Klasse 9 (Gymnasium)'],
        ['mathe/mathegy10.html', 'MA 10', 'b-orange', 'Mathematik Klasse 10 (Gymnasium)'],
        ['mathe/mathe11.html', 'MA 11', 'b-orange', 'Mathematik Klasse 11'],
        ['mathe/mathe12.html', 'MA 12', 'b-orange', 'Mathematik Klasse 12'],
        ['mathe/mathe13.html', 'MA 13', 'b-orange', 'Mathematik Klasse 13'],
        ['mathe/uebung.html', 'Üben', 'b-orange', 'Übung macht den Meister'],
        ['wr/wr11.html', 'W/R 11', 'b-teal', 'Wirtschaftslehre/Recht Klasse 11'],
        ['informatik/informatik9.html', 'INF 9', 'b-green', 'Informatik Klasse 9'],
        ['informatik/inf11.html', 'INF 11', 'b-green', 'Informatik Klasse 11'],
        ['informatik/inf12.html', 'INF 12', 'b-green', 'Informatik Klasse 12'],
        ['informatik/inf13.html', 'INF 13', 'b-green', 'Informatik Klasse 13'],
        ['informatik/informatik11.html', 'IS 11', 'b-pink', 'Informatiksysteme Klasse 11'],
        ['informatik/informatik12.html', 'IS 12', 'b-pink', 'Informatiksysteme Klasse 12'],
        ['informatik/informatik13.html', 'IS 13', 'b-pink', 'Informatiksysteme Klasse 13'],
        ['informatik/fos11.html', 'FOS 11', 'b-cyan', 'Informatik FOS Klasse 11'],
        ['informatik/fos12.html', 'FOS 12', 'b-cyan', 'Informatik FOS Klasse 12'],
        ['notes.html', 'Notizen', 'b-cyan', 'Notizen'],
        ['konzepte.html', 'Konzepte', 'b-violet', 'Konzepte'],
        ['operatoren.html', 'Operatoren', 'b-red', 'Operatoren'],
        ['stundenplan.html', 'Stundenplan', 'b-teal', 'Stundenplan der ganzen Schule (Konflikte, Optimierer)'],
    ];

    // These open in a new tab so the current plan stays put.
    const NEW_TAB = new Set(['notes.html', 'konzepte.html', 'operatoren.html', 'stundenplan.html']);

    // The pill row only carries Home, Notizen and one dropdown per Schulart —
    // everything else lives inside those. [pill label, [[caption|null, hrefs]],
    // column?] — a caption groups a subject inside the panel.
    const DROPS = [
        ['Oberschule', [
            ['Mathematik', ['mathe/mathe5.html']],
            ['Informatik', ['informatik/informatik9.html']]
        ]],
        ['Gymnasium', [
            ['Mathematik', ['mathe/mathegy9.html', 'mathe/mathegy10.html']]
        ]],
        ['Berufliches Gymnasium', [
            ['Mathematik', ['mathe/mathe11.html', 'mathe/mathe12.html', 'mathe/mathe13.html']],
            ['Informatik', ['informatik/inf11.html', 'informatik/inf12.html', 'informatik/inf13.html']],
            ['Informatiksysteme', ['informatik/informatik11.html', 'informatik/informatik12.html',
                                   'informatik/informatik13.html']],
            ['Wirtschaft/Recht', ['wr/wr11.html']]
        ]],
        ['Fachoberschule', [
            ['Informatik', ['informatik/fos11.html', 'informatik/fos12.html']]
        ]],
        /* "Mehr" is not a Schulart — it stays at the far right, next to the gear */
        ['Mehr', [
            [null, ['stundenplan.html', 'notes.html', 'mathe/uebung.html', 'konzepte.html', 'operatoren.html']]
        ], true, true]
    ];

    // every href that moved into a dropdown leaves the plain row
    const IN_DROP = new Set();
    DROPS.forEach(([, rows]) => rows.forEach(([, hrefs]) => hrefs.forEach(h => IN_DROP.add(h))));

    // '/svp/' and '/svp/index.html' are the same page.
    function norm(path) { return path.replace(/index\.html$/, ''); }

    // Per-browser pill visibility, keyed by href (stable across label changes).
    const STORE_KEY = 'svp-nav-hidden';
    let hidden;
    try { hidden = new Set(JSON.parse(localStorage.getItem(STORE_KEY) || '[]')); }
    catch (e) { hidden = new Set(); }
    // Start and the Stundenplan are always visible and not toggleable (Doc, 26.08.2026:
    // Stundenplan out of the panel); deleting cleans up old stored state.
    const ALWAYS_ON = ['index.html', 'stundenplan.html'];
    for (const h of ALWAYS_ON) hidden.delete(h);
    function saveHidden() {
        try { localStorage.setItem(STORE_KEY, JSON.stringify([...hidden])); } catch (e) { }
    }

    const header = document.querySelector('header.page-head') || document.body;
    const nav = document.createElement('nav');
    nav.className = 'quick-nav';

    const pills = {}; // href -> nav pill element, for live show/hide from the panel
    for (const [href, label, cls] of LINKS) {
        const a = document.createElement('a');
        a.className = 'badge ' + cls;
        a.href = base + href;
        a.textContent = label;
        if (NEW_TAB.has(href)) { a.target = '_blank'; a.rel = 'noopener'; }
        if (norm(a.pathname) === norm(location.pathname)) a.classList.add('active');
        // Hidden pills stay hidden — except the one for the current page.
        if (hidden.has(href) && !a.classList.contains('active')) a.classList.add('nav-hidden');
        pills[href] = a;
        if (!IN_DROP.has(href)) nav.appendChild(a);
    }

    // Rows of every dropdown, so a subject without visible pills can fold away.
    const dropRows = [];
    const dropWraps = [];
    function syncDropRows() {
        dropRows.forEach(function (r) {
            const leer = r.items.every(a => a.classList.contains('nav-hidden'));
            r.line.classList.toggle('nd-empty', leer);
            if (r.title) r.title.classList.toggle('nd-empty', leer);
        });
        /* nothing left inside? then the pill itself has nothing to offer */
        dropWraps.forEach(function (w) {
            const leer = [...w.querySelectorAll('.nd-row')]
                .every(l => l.classList.contains('nd-empty'));
            w.classList.toggle('nav-hidden', leer);
            if (leer) w.classList.remove('open');
        });
    }

    // One dropdown per Schulart (plus "Mehr"), built from the same recipe.
    function makeDrop(label, rows, column, atEnd) {
        const wrap = document.createElement('div');
        wrap.className = 'nav-drop-wrap' + (atEnd ? ' nd-right' : '');
        const pill = document.createElement('a');
        pill.className = 'badge b-grey nav-drop';
        pill.href = '#';
        pill.textContent = label + ' ▾';
        wrap.appendChild(pill);

        const panel = document.createElement('div');
        panel.className = 'nav-drop-panel' + (column ? ' nd-column' : '');
        const names = [];
        let active = false;
        rows.forEach(function (row) {
            const items = row[1].map(h => pills[h]).filter(Boolean);
            if (!items.length) return;
            if (row[0]) {
                const cap = document.createElement('div');
                cap.className = 'nd-title';
                cap.textContent = row[0];
                panel.appendChild(cap);
            }
            const line = document.createElement('div');
            line.className = 'nd-row';
            items.forEach(function (a) {
                names.push(a.textContent);
                if (a.classList.contains('active')) active = true;
                line.appendChild(a);
            });
            panel.appendChild(line);
            dropRows.push({ title: row[0] ? panel.lastElementChild.previousElementSibling : null,
                            line: line, items: items });
        });
        /* current page inside the dropdown: mark the pill, nothing gets lost */
        if (active) pill.classList.add('active');
        pill.title = names.join(' · ');
        wrap.appendChild(panel);

        pill.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const wasOpen = wrap.classList.contains('open');
            document.querySelectorAll('.nav-drop-wrap.open')
                .forEach(w => w.classList.remove('open'));
            wrap.classList.toggle('open', !wasOpen);
        });
        /* Schularten sit left of Notizen, "Mehr" at the end (the gear and the
           login pill are appended after this script block) */
        dropWraps.push(wrap);
        const before = atEnd ? null : pills['notes.html'];
        nav.insertBefore(wrap, before && before.parentNode === nav ? before : null);
    }

    DROPS.forEach(d => makeDrop(d[0], d[1], d[2], d[3]));
    syncDropRows();

    function closeDrops() {
        document.querySelectorAll('.nav-drop-wrap.open').forEach(w => w.classList.remove('open'));
    }
    document.addEventListener('click', closeDrops);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrops(); });

    // Pencil at the right end of the pill row: opens a panel to choose which
    // pills are visible (stored in localStorage, per browser).
    const editWrap = document.createElement('div');
    editWrap.className = 'nav-edit-wrap';
    const pencil = document.createElement('a');
    pencil.className = 'badge b-grey nav-edit';
    pencil.href = '#';
    pencil.textContent = '⚙';
    pencil.title = 'Pillen ein-/ausblenden';
    editWrap.appendChild(pencil);

    const panel = document.createElement('div');
    panel.className = 'nav-edit-panel';
    const panelTitle = document.createElement('div');
    panelTitle.className = 'ep-title';
    panelTitle.textContent = 'Sichtbare Pillen — Klick schaltet ein/aus';
    panel.appendChild(panelTitle);
    // One spelled-out pill per row, each with its own checkbox in front.
    const grid = document.createElement('div');
    grid.className = 'ep-grid ep-list';
    for (const [href, label, cls, longLabel] of LINKS) {
        if (ALWAYS_ON.includes(href)) continue; // Start + Stundenplan: always visible, not toggleable
        // The colour class rides on the row too — the checkbox picks it up via
        // accent-color: currentColor, so each box matches its subject.
        const row = document.createElement('label');
        row.className = 'ep-item ' + cls;

        const box = document.createElement('input');
        box.type = 'checkbox';
        box.checked = !hidden.has(href);

        const t = document.createElement('span');
        t.className = 'badge ' + cls + (hidden.has(href) ? '' : ' on');
        // Mark the current page's pill so it can carry a fatter border.
        if (pills[href].classList.contains('active')) t.classList.add('active');
        t.textContent = longLabel || label;

        box.addEventListener('change', function () {
            if (box.checked) hidden.delete(href); else hidden.add(href);
            t.classList.toggle('on', box.checked);
            const pill = pills[href];
            pill.classList.toggle('nav-hidden',
                hidden.has(href) && !pill.classList.contains('active'));
            syncDropRows();
            applyCardVisibility();
            saveHidden();
        });

        row.appendChild(box);
        row.appendChild(t);
        grid.appendChild(row);
    }
    panel.appendChild(grid);

    // Colour scheme switch: two pills in the nav row, left of the QR pill (Doc, 26.08.2026 —
    // moved out of this panel). svp-gate.js applies the stored choice in <head>, so a
    // reload never flashes the wrong scheme.
    const themeWrap = document.createElement('span');
    themeWrap.className = 'nav-theme-wrap';
    themeWrap.setAttribute('role', 'group');
    themeWrap.setAttribute('aria-label', 'Farbschema');
    const THEMES = [['dark', 'Dunkel'], ['light', 'Hell']];
    let theme = 'dark';
    try { if (localStorage.getItem('svp-theme') === 'light') theme = 'light'; } catch (e) { }
    // uebung.html has no svp-gate.js, so apply the class here as well.
    document.documentElement.classList.toggle('svp-light', theme === 'light');

    const themeBtns = {};
    function applyTheme(next) {
        theme = next;
        document.documentElement.classList.toggle('svp-light', next === 'light');
        for (const key in themeBtns) themeBtns[key].classList.toggle('on', key === next);
        try { localStorage.setItem('svp-theme', next); } catch (e) { }
    }
    for (const [key, label] of THEMES) {
        const t = document.createElement('a');
        t.className = 'badge b-grey nav-theme';
        t.href = '#';
        t.textContent = label;
        t.title = 'Farbschema: ' + label;
        t.addEventListener('click', function (e) { e.preventDefault(); applyTheme(key); });
        themeBtns[key] = t;
        themeWrap.appendChild(t);
    }
    themeBtns[theme].classList.add('on');

    editWrap.appendChild(panel);
    nav.appendChild(editWrap);

    // Separated auth pill at the right end of the row: "Login" links to the
    // notes page (shared svp-session login for all svp pages), "Logout"
    // clears the session in this browser. Reads localStorage directly so it
    // also works on pages that do not load svp-auth.js.
    const authPill = document.createElement('a');
    authPill.className = 'badge nav-auth';
    function hasSession() {
        try { return !!JSON.parse(localStorage.getItem('svp-session')); }
        catch (e) { return false; }
    }
    function renderAuthPill() {
        const on = hasSession();
        authPill.classList.toggle('b-grey', on);
        authPill.classList.toggle('b-green', !on);
        authPill.textContent = on ? 'Logout' : 'Login';
        authPill.title = on
            ? 'svp-Session in diesem Browser beenden'
            : 'Anmelden für Cloud-Sync (über die Notizen-Seite)';
        authPill.href = on ? '#' : base + 'notes.html';
    }
    authPill.addEventListener('click', function (e) {
        if (!hasSession()) return; /* logged out: follow the login link */
        e.preventDefault();
        try { localStorage.removeItem('svp-session'); } catch (e2) { }
        location.reload();
    });
    renderAuthPill();
    nav.appendChild(authPill);

    // QR pill next to Login/Logout: opens the usual white-card overlay with
    // a QR code deep-linking to this page's live URL. qrcode.min.js is only
    // loaded on first click (uebung.html already ships it — reused then).
    const qrPill = document.createElement('a');
    qrPill.className = 'badge b-grey nav-qr';
    qrPill.href = '#';
    qrPill.title = 'QR-Code zum Teilen dieser Seite';
    qrPill.setAttribute('aria-label', 'QR-Code zum Teilen dieser Seite');
    qrPill.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        + '<path d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"></path>'
        + '<path d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"></path></svg>';
    qrPill.addEventListener('click', function (e) { e.preventDefault(); showQr(); });
    nav.appendChild(themeWrap); // Dunkel | Hell, directly left of the QR pill
    nav.appendChild(qrPill);

    let qrOverlay = null;
    function renderQr() {
        // Live URL even when testing locally: strip the /HTML/ dev prefix.
        const livePath = location.pathname.replace(/^\/HTML\//, '/');
        const url = 'https://www.docalvers.de' + livePath + location.search;
        const box = qrOverlay.querySelector('.qr-box');
        if (typeof qrcode === 'undefined') {
            box.textContent = url; /* library missing: show the link instead */
        } else {
            const qr = qrcode(0, 'M');
            qr.addData(url);
            qr.make();
            box.innerHTML = qr.createSvgTag({ scalable: true });
        }
        qrOverlay.querySelector('.qr-label').textContent = document.title;
        qrOverlay.classList.add('open');
    }
    function showQr() {
        if (!qrOverlay) {
            qrOverlay = document.createElement('div');
            qrOverlay.className = 'qr-overlay';
            qrOverlay.innerHTML = '<div class="qr-card"><div class="qr-box"></div><div class="qr-label"></div></div>';
            qrOverlay.addEventListener('click', function () { qrOverlay.classList.remove('open'); });
            document.body.appendChild(qrOverlay);
        }
        if (typeof qrcode === 'undefined' && !document.querySelector('script[data-svp-qr]')) {
            const s = document.createElement('script');
            s.src = base + 'qrcode.min.js';
            s.dataset.svpQr = '1';
            s.onload = renderQr;
            s.onerror = renderQr;
            document.head.appendChild(s);
        } else renderQr();
    }

    // Link cards on the overview pages follow the pill choice: a card whose
    // target has its pill hidden is hidden too.
    // Subject cards point at a folder (mathe/, wr/, informatik/) instead of a
    // single page — those follow the folder: hidden once every pill inside it is.
    const basePath = new URL(base).pathname;
    const pathToHref = {};
    for (const [href] of LINKS) pathToHref[norm(new URL(base + href).pathname)] = href;

    function cardHidden(card) {
        /* A card may name the pills it stands for: data-nav="a.html b.html".
           Only when every one of them is switched off does the card go. */
        const named = (card.dataset.nav || '').split(/\s+/).filter(Boolean);
        if (named.length) return named.every(h => hidden.has(h));
        const path = norm(card.pathname);
        const href = pathToHref[path];
        if (href) return hidden.has(href);
        if (!path.startsWith(basePath)) return false;
        const dir = path.slice(basePath.length); // e.g. 'wr/'
        if (!dir.endsWith('/')) return false;
        const inDir = LINKS.filter(([h]) => h.startsWith(dir));
        return inDir.length > 0 && inDir.every(([h]) => hidden.has(h));
    }

    function applyCardVisibility() {
        for (const card of document.querySelectorAll('a.link-card')) {
            card.classList.toggle('nav-hidden', cardHidden(card));
        }
        /* a Schulart without a single visible card needs no heading either */
        for (const sec of document.querySelectorAll('.svp-section')) {
            const cards = [...sec.querySelectorAll('a.link-card')];
            sec.classList.toggle('nav-hidden',
                cards.length > 0 && cards.every(c => c.classList.contains('nav-hidden')));
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyCardVisibility);
    } else {
        applyCardVisibility();
    }

    function closePanel() { editWrap.classList.remove('open'); }
    pencil.addEventListener('click', function (e) {
        e.preventDefault();
        editWrap.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
        if (!editWrap.contains(e.target)) closePanel();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closePanel();
    });
    // Central school-year line above the pill row (the per-page subtitles
    // no longer repeat it).
    const year = document.createElement('div');
    year.className = 'nav-year';
    year.textContent = 'Schuljahr 2026/27 · Mo 17.08.2026 – Fr 09.07.2027';

    // Full-width blue band across the page top; year + pills are centered in it.
    const band = document.createElement('div');
    band.className = 'nav-band';
    band.appendChild(year);
    band.appendChild(nav);
    document.body.insertBefore(band, document.body.firstChild);
})();


/* The ▶ icon in the page header plays the video right here in a frame instead of sending the class
   off into a new tab — same shared player the labs use (js/video-lightbox.js, one folder up from
   the svp root). Loading fails? The plain link stays and simply opens a tab. */
(function () {
    const script = document.currentScript;
    const link = document.querySelector('.head-video');
    if (!script || !link) return;

    const wire = () => {
        if (window.VideoLightbox) window.VideoLightbox.wireLink(link, { title: 'Video zum Schuljahr' });
    };
    if (window.VideoLightbox) { wire(); return; }

    const sc = document.createElement('script');
    sc.src = new URL('../js/video-lightbox.js', script.src).href;
    sc.onload = wire;
    document.head.appendChild(sc);
})();
