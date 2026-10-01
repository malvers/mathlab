/* Klappuhr in the school-year box (Doc, 01.10.2026). svp-nav.js builds the
   empty .ny-datum / .ny-uhr columns and loads this file; here the flap cards
   are made and kept up to date. Look and flip animation: svp-klappuhr.css. */
(function () {
    const year = document.querySelector('.nav-year');
    const datum = year && year.querySelector('.ny-datum');
    const uhr = year && year.querySelector('.ny-uhr');
    const mitte = year && year.querySelector('.ny-mitte');
    if (!datum || !uhr || !mitte) return;

    const ZAHLEN = ['00', '11', '22', '33', '44', '55', '66', '77', '88', '99'];
    const ruhig = window.matchMedia('(prefers-reduced-motion: reduce)');

    function el(cls, text) {
        const e = document.createElement('span');
        e.className = cls;
        if (text != null) e.textContent = text;
        return e;
    }

    function half(pos, text) {
        const h = el('kl-halb ' + pos);
        h.appendChild(el('kl-txt', text));
        return h;
    }

    // One flap card. `muster` lists every value it may show, for its width.
    function karte(muster) {
        const k = el('kl-karte');
        const mass = el('kl-mass');
        muster.forEach(m => mass.appendChild(el('', m)));
        const oben = half('kl-oben', '');
        const unten = half('kl-unten', '');
        k.append(mass, oben, unten);
        k._wert = '';
        k._oben = oben.firstChild;
        k._unten = unten.firstChild;
        return k;
    }

    // A flip still running is cut short: its leaves go, the halves show its
    // end value, and the new flip starts from there.
    function aufraeumen(k) {
        k.querySelectorAll('.kl-blatt').forEach(b => b.remove());
        k._unten.textContent = k._wert;
    }

    function setze(k, wert, animiert) {
        if (k._wert === wert) return;
        aufraeumen(k);
        const alt = k._wert;
        k._wert = wert;
        // The new upper half waits behind the falling leaf; the old lower half
        // stays until the new leaf has landed on it.
        k._oben.textContent = wert;
        if (!animiert || ruhig.matches || document.hidden) {
            k._unten.textContent = wert;
            return;
        }
        const fallOben = half('kl-oben kl-blatt', alt);
        const fallUnten = half('kl-unten kl-blatt', wert);
        fallUnten.addEventListener('animationend', function (e) {
            if (e.target !== fallUnten || e.animationName !== 'kl-fall-unten') return;
            if (k._wert === wert) aufraeumen(k);
        });
        k.append(fallOben, fallUnten);
    }

    const zwei = n => String(n).padStart(2, '0');

    // Day and month only - no weekday card (Doc, 01.10.2026).
    const kTagNr = karte(ZAHLEN);
    const kMonat = karte(ZAHLEN);
    datum.append(kTagNr, el('kl-trenner', '.'), kMonat);

    const kStunde = karte(ZAHLEN);
    const kMinute = karte(ZAHLEN);
    uhr.append(kStunde, el('kl-trenner', ':'), kMinute);

    function tick(animiert) {
        const d = new Date();
        setze(kTagNr, zwei(d.getDate()), animiert);
        setze(kMonat, zwei(d.getMonth() + 1), animiert);
        setze(kStunde, zwei(d.getHours()), animiert);
        setze(kMinute, zwei(d.getMinutes()), animiert);
        // Spelled out for the tooltip and for screen readers.
        datum.title = d.toLocaleDateString('de-DE',
            { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        uhr.title = zwei(d.getHours()) + ':' + zwei(d.getMinutes()) + ' Uhr';
        datum.setAttribute('aria-label', datum.title);
        uhr.setAttribute('aria-label', uhr.title);
    }
    datum.setAttribute('role', 'img');
    uhr.setAttribute('role', 'img');
    tick(false);
    // Checked every second, flipped only when a value changes.
    setInterval(() => tick(true), 1000);

    /* Wide box: date | title | clock in one row. Too narrow for that (the
       title on one line plus the wider flap group on both sides): .ny-eng puts
       the flaps in a row under the title. Measured, not a fixed breakpoint -
       the title width depends on the font and on the viewport. */
    let breite = -1;
    function passe() {
        const w = year.clientWidth;
        if (!w) return;                       // box hidden on this page
        year.classList.remove('ny-eng');
        year.classList.add('ny-messen');
        const cs = getComputedStyle(year);
        const innen = w - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        const gap = parseFloat(cs.columnGap) || 0;
        const seite = Math.max(datum.offsetWidth, uhr.offsetWidth);
        const passt = mitte.offsetWidth + 2 * (seite + gap) <= innen;
        year.classList.remove('ny-messen');
        year.classList.toggle('ny-eng', !passt);
    }
    if (window.ResizeObserver) {
        new ResizeObserver(function () {
            if (year.clientWidth === breite) return;
            breite = year.clientWidth;
            passe();
        }).observe(year);
    }
    passe();
    // Orbitron may arrive after the first measurement and widens the title.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(passe);
})();
