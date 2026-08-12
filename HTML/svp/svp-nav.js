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
        ['notes.html', 'Notizen', 'b-cyan'],
        ['konzepte.html', 'Konzepte', 'b-violet'],
    ];

    // '/svp/' and '/svp/index.html' are the same page.
    function norm(path) { return path.replace(/index\.html$/, ''); }

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

    for (const [href, label, cls] of LINKS) {
        const a = document.createElement('a');
        a.className = 'badge ' + cls;
        a.href = base + href;
        a.textContent = label;
        if (norm(a.pathname) === norm(location.pathname)) a.classList.add('active');
        nav.appendChild(a);
    }
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
