// Shared quick-nav for all svp pages: pill shortcuts (badge design) injected
// at the top of the page header. Include on every page with
// <script src="svp-nav.js"></script> (root) or "../svp-nav.js" (subdirs) —
// the svp root is derived from this script's own src, so links always resolve.
(function () {
    const script = document.currentScript;
    if (!script || !script.src) return;
    const base = script.src.replace(/svp-nav\.js.*$/, '');

    // [href relative to svp root, label, badge color class]
    const LINKS = [
        ['index.html', 'Start', 'b-grey'],
        ['mathe/mathe11.html', 'MA 11', 'b-orange'],
        ['mathe/mathe12.html', 'MA 12', 'b-orange'],
        ['mathe/mathe13.html', 'MA 13', 'b-orange'],
        ['mathe/uebung.html', 'Üben', 'b-orange'],
        ['wr/wr11.html', 'W/R 11', 'b-teal'],
        ['informatik/informatik9.html', 'INF 9', 'b-green'],
        ['informatik/inf11.html', 'INF 11', 'b-green'],
        ['informatik/inf12.html', 'INF 12', 'b-green'],
        ['informatik/inf13.html', 'INF 13', 'b-green'],
        ['informatik/informatik11.html', 'IS 11', 'b-pink'],
        ['informatik/informatik12.html', 'IS 12', 'b-pink'],
        ['informatik/informatik13.html', 'IS 13', 'b-pink'],
        ['informatik/fos11.html', 'FOS 11', 'b-cyan'],
        ['informatik/fos12.html', 'FOS 12', 'b-cyan'],
        ['notes.html', 'Notizen', 'b-cyan'],
        ['konzepte.html', 'Konzepte', 'b-violet'],
    ];

    // These open in a new tab so the current plan stays put.
    const NEW_TAB = new Set(['notes.html', 'konzepte.html']);

    // '/svp/' and '/svp/index.html' are the same page.
    function norm(path) { return path.replace(/index\.html$/, ''); }

    // Per-browser pill visibility, keyed by href (stable across label changes).
    const STORE_KEY = 'svp-nav-hidden';
    let hidden;
    try { hidden = new Set(JSON.parse(localStorage.getItem(STORE_KEY) || '[]')); }
    catch (e) { hidden = new Set(); }
    hidden.delete('index.html'); // Start can never be hidden (cleans up old stored state)
    function saveHidden() {
        try { localStorage.setItem(STORE_KEY, JSON.stringify([...hidden])); } catch (e) { }
    }

    const header = document.querySelector('header.page-head') || document.body;
    const nav = document.createElement('nav');
    nav.className = 'quick-nav';

    // Back button left of the Start pill — pill design like the rest.
    const back = document.createElement('a');
    back.className = 'badge b-grey nav-back';
    back.href = '#';
    back.textContent = '←';
    back.title = 'zurück';
    back.addEventListener('click', function (e) { e.preventDefault(); history.back(); });
    nav.appendChild(back);

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
        nav.appendChild(a);
    }

    // Pencil at the right end of the pill row: opens a panel to choose which
    // pills are visible (stored in localStorage, per browser).
    const editWrap = document.createElement('div');
    editWrap.className = 'nav-edit-wrap';
    const pencil = document.createElement('a');
    pencil.className = 'badge b-grey nav-edit';
    pencil.href = '#';
    pencil.textContent = '✎';
    pencil.title = 'Pillen ein-/ausblenden';
    editWrap.appendChild(pencil);

    const panel = document.createElement('div');
    panel.className = 'nav-edit-panel';
    const panelTitle = document.createElement('div');
    panelTitle.className = 'ep-title';
    panelTitle.textContent = 'Sichtbare Pillen — Klick schaltet ein/aus';
    panel.appendChild(panelTitle);
    const grid = document.createElement('div');
    grid.className = 'ep-grid';
    for (const [href, label, cls] of LINKS) {
        if (href === 'index.html') continue; // Start is always visible, not toggleable
        const t = document.createElement('span');
        t.className = 'badge ' + cls + (hidden.has(href) ? '' : ' on');
        t.textContent = label;
        t.addEventListener('click', function () {
            if (hidden.has(href)) hidden.delete(href); else hidden.add(href);
            t.classList.toggle('on', !hidden.has(href));
            const pill = pills[href];
            pill.classList.toggle('nav-hidden',
                hidden.has(href) && !pill.classList.contains('active'));
            applyCardVisibility();
            saveHidden();
        });
        grid.appendChild(t);
    }
    panel.appendChild(grid);

    // Colour scheme switch below the pill toggles. svp-gate.js applies the
    // stored choice in <head>, so a reload never flashes the wrong scheme.
    const themeTitle = document.createElement('div');
    themeTitle.className = 'ep-title ep-title-2';
    themeTitle.textContent = 'Farbschema';
    panel.appendChild(themeTitle);

    const themeRow = document.createElement('div');
    themeRow.className = 'ep-grid';
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
        const t = document.createElement('span');
        t.className = 'badge b-grey';
        t.textContent = label;
        t.addEventListener('click', function () { applyTheme(key); });
        themeBtns[key] = t;
        themeRow.appendChild(t);
    }
    themeBtns[theme].classList.add('on');
    panel.appendChild(themeRow);

    editWrap.appendChild(panel);
    nav.appendChild(editWrap);

    // Link cards on the overview pages follow the pill choice: a card whose
    // target has its pill hidden is hidden too.
    const pathToHref = {};
    for (const [href] of LINKS) pathToHref[norm(new URL(base + href).pathname)] = href;

    function applyCardVisibility() {
        for (const card of document.querySelectorAll('a.link-card')) {
            const href = pathToHref[norm(card.pathname)];
            if (href) card.classList.toggle('nav-hidden', hidden.has(href));
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
