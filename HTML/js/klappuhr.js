/* Klappuhr - a flip clock like the old Copal / Twemco ones (Doc, 01.10.2026:
   "eine Digitaluhr wie sie frueher waren. So mit halben Plastikblaettchen die
   nach unten klappen"). Born in the SVP school-year box, pulled out the same
   day so any page can have it ("Vielleicht braucht man die ja nochmal
   woanders"). Look and flip animation: klappuhr.css.

   Usage - in the HTML, filled automatically once this script has loaded:
     <span data-klappuhr="uhr"></span>        [14]:[27]
     <span data-klappuhr="sekunden"></span>   [14]:[27]:[05]
     <span data-klappuhr="datum"></span>      [01].[10]
     <span data-klappuhr="uhrzehn"></span>    [14]:[27]:[00] seconds in tens
     <span data-klappuhr="datumjahr"></span>  [01].[10].[2026]
     <span data-klappuhr="datumkurz"></span>  [01].[10].[26]
   or from script (repeat calls on the same element do nothing):
     Klappuhr.mount(el, 'uhr');

   Size: the cards follow the element's font-size. Colours: the --kl-*
   variables in klappuhr.css, overridable per page. */
(function () {
    if (window.Klappuhr) return;

    const ZAHLEN = ['00', '11', '22', '33', '44', '55', '66', '77', '88', '99'];
    const JAHRE = ZAHLEN.map(z => z + z);
    const ruhig = window.matchMedia('(prefers-reduced-motion: reduce)');

    function el(cls, text) {
        const e = document.createElement('span');
        e.className = cls;
        if (text != null) e.textContent = text;
        return e;
    }

    /* The separator dots as SVG circles (Doc, 01.10.2026: "keine Quadrate,
       sondern schoene Punkte", then for the small SVP box "SVG zeichnen"):
       Orbitron's glyphs are square, and small CSS circles snap to whole
       pixels and turn square as well. Units: 1/100 of the digit size, the
       box 1 em tall and centred on the cards. Diameter 13; the colon's dots
       sit symmetric about the split (+-18), the date's on the digits'
       baseline - measured in the browser at 0.38 em below the middle of a
       card (Doc: "sieht aus, als waeren die zu hoch" with a guessed 0.36). */
    const SVGNS = 'http://www.w3.org/2000/svg';
    const PUNKTE = { 'kl-doppelpunkt': [32, 68], 'kl-punkt': [81.5] };

    function trenner(art) {
        const t = el('kl-trenner ' + art);
        const svg = document.createElementNS(SVGNS, 'svg');
        svg.setAttribute('viewBox', '0 0 13 100');
        svg.setAttribute('aria-hidden', 'true');
        PUNKTE[art].forEach(function (cy) {
            const c = document.createElementNS(SVGNS, 'circle');
            c.setAttribute('cx', '6.5');
            c.setAttribute('cy', String(cy));
            c.setAttribute('r', '6.5');
            svg.appendChild(c);
        });
        t.appendChild(svg);
        return t;
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

    /* The faces: one card per value with a separator between them (see
       trenner()), and the spelled-out text for tooltip and screen readers. Day and month only -
       no weekday card (Doc, 01.10.2026). */
    const ARTEN = {
        uhr: {
            trenner: 'kl-doppelpunkt',
            werte: d => [zwei(d.getHours()), zwei(d.getMinutes())],
            text: d => zwei(d.getHours()) + ':' + zwei(d.getMinutes()) + ' Uhr'
        },
        // For the big clock page (klappuhr.html): something moves every second.
        sekunden: {
            trenner: 'kl-doppelpunkt',
            werte: d => [zwei(d.getHours()), zwei(d.getMinutes()), zwei(d.getSeconds())],
            text: d => zwei(d.getHours()) + ':' + zwei(d.getMinutes()) + ':' +
                zwei(d.getSeconds()) + ' Uhr'
        },
        /* The SVP box (Doc, 01.10.2026): "rechts neben der Uhr die
           Sekunden. Aber die sollen bitte alle zehn Sekunden klappen", and
           the date with a two-digit year - three cards on either side of
           the title, "dann sieht das alles schoen symmetrisch aus". */
        uhrzehn: {
            trenner: 'kl-doppelpunkt',
            werte: d => [zwei(d.getHours()), zwei(d.getMinutes()),
                zwei(Math.floor(d.getSeconds() / 10) * 10)],
            text: d => zwei(d.getHours()) + ':' + zwei(d.getMinutes()) + ' Uhr'
        },
        datumkurz: {
            trenner: 'kl-punkt',
            werte: d => [zwei(d.getDate()), zwei(d.getMonth() + 1),
                zwei(d.getFullYear() % 100)],
            text: d => d.toLocaleDateString('de-DE',
                { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        },
        datum: {
            trenner: 'kl-punkt',
            werte: d => [zwei(d.getDate()), zwei(d.getMonth() + 1)],
            text: d => d.toLocaleDateString('de-DE',
                { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        },
        // Doc, 01.10.2026, on the big clock page: "hinter erster Zehnter
        // noch 2026 schreiben". The year card is four digits wide.
        datumjahr: {
            trenner: 'kl-punkt',
            werte: d => [zwei(d.getDate()), zwei(d.getMonth() + 1), String(d.getFullYear())],
            muster: [ZAHLEN, ZAHLEN, JAHRE],
            text: d => d.toLocaleDateString('de-DE',
                { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        }
    };

    const uhren = [];
    let takt = 0;

    function zeige(u, d, animiert) {
        const werte = u.art.werte(d);
        u.karten.forEach((k, i) => setze(k, werte[i], animiert));
        const text = u.art.text(d);
        u.el.title = text;
        u.el.setAttribute('aria-label', text);
    }

    function tick() {
        const d = new Date();
        uhren.forEach(u => zeige(u, d, true));
    }

    // One timer for every clock on the page, set to just after each full
    // second - an interval drifts and would now and then skip a second.
    function plane() {
        takt = setTimeout(function () {
            tick();
            plane();
        }, 1000 - (Date.now() % 1000) + 15);
    }

    function mount(ziel, art) {
        if (!ziel || ziel._klappuhr) return ziel;
        art = ARTEN[art || ziel.dataset.klappuhr] || ARTEN.uhr;
        ziel.classList.add('klappuhr');
        ziel.setAttribute('role', 'img');
        const karten = art.werte(new Date())
            .map((w, i) => karte((art.muster && art.muster[i]) || ZAHLEN));
        karten.forEach((k, i) => {
            if (i) ziel.append(trenner(art.trenner));
            ziel.append(k);
        });
        const u = { el: ziel, art: art, karten: karten };
        ziel._klappuhr = u;
        uhren.push(u);
        zeige(u, new Date(), false);
        if (!takt) plane();
        return ziel;
    }

    function scan(root) {
        (root || document).querySelectorAll('[data-klappuhr]').forEach(e => mount(e));
    }

    window.Klappuhr = { mount: mount, scan: scan };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => scan());
    } else {
        scan();
    }
})();
