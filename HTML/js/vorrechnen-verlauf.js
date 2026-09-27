// Vorrechnen (vorrechnen.html), part 7 of 12: the rows glide up at a task change; the day's history under two fingers.
// One of the classic scripts js/vorrechnen-*.js, split from the page's single inline block (27.09.2026).
// They share ONE global scope (top-level let/const/function), so the order of their <script> tags in
// vorrechnen.html matters: code that runs while the files load must not reach into a later file, and
// a callback that can fire in between (a resolved promise, a timer) must not either.

function rechenwegHochScrollen() {
    const teile = ['vorlage-schicht', 'rechenweg-schicht'].map(id => document.getElementById(id)).filter(Boolean);
    if (!teile.length) return;
    // a window over the board, and in it the copy that moves
    const fenster = document.createElement('div');
    fenster.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:4';
    const zug = document.createElement('div');
    zug.style.cssText = 'position:absolute;inset:0';
    teile.forEach(el => zug.appendChild(el.cloneNode(true)));
    zug.querySelectorAll('[id]').forEach(e => e.removeAttribute('id'));
    fenster.appendChild(zug);
    container.appendChild(fenster);
    const zwilling = anzeigeZwilling(fenster);
    // up by whole lines, until the last line of the working has left
    const hoch = (rechenwegLinie + 1) * ZEILE;
    verlaufMerken(zug.innerHTML, hoch);       // it waits above, for two fingers pulling down
    [fenster, zwilling].forEach(f => {
        if (!f) return;
        try {
            const z = f.firstElementChild;
            z.getBoundingClientRect();
            z.style.transition = `transform ${WECHSEL_MS}ms cubic-bezier(0.45, 0, 0.25, 1)`;
            z.style.transform = `translateY(${-hoch}px)`;
        } catch (_) {}
    });
    setTimeout(() => {
        fenster.remove();
        if (zwilling) try { zwilling.remove(); } catch (_) {}
    }, WECHSEL_MS + 100);
}
// Doc, 26.09.: "wie kann ich da hoch?" - "Zwei Finger": two fingers pulled
// down scroll back up to the tasks done before, as in an exercise book;
// two fingers up scroll back down (no line is sent up then). ▶, a line
// sent up, or VERLAUF_RUHE without a touch bring the board back. The lined
// part moves, whole lines when let go, cut at the squares; the squares
// stay. Each task done waits above as it stood when it left (kept for
// this tab: a live reload keeps it, the next day starts clean).
// Doc, 27.09.: "dass man die vergangenen Aufgaben sehen kann" - kept for the day in
// localStorage (a new tab or a fresh start of the page lost them in sessionStorage:
// 33 in the morning, 1 after a new start); the next day starts clean
const VERLAUF_SCHLUESSEL = 'vorrechnen-verlauf-tag';
const verlaufBloecke = [];         // { html, hoehe } per task done, oldest first
try {
    const d = JSON.parse(localStorage.getItem(VERLAUF_SCHLUESSEL) || 'null');
    const alt = d && d.tag === tagIso(new Date()) ? d.bloecke
        : JSON.parse(sessionStorage.getItem('vorrechnen-verlauf') || '[]');    // this tab's, from before
    if (Array.isArray(alt)) alt.forEach(b => { if (b && b.html && b.hoehe > 0) verlaufBloecke.push(b); });
} catch (_) {}
const VERLAUF_RUHE = 8000;         // ms without a touch, then back to the task
let verlaufY = 0, verlaufUhr = null, verlaufZug = false, verlaufStartY = 0;
const VERLAUF_EBENEN = ['verlauf-schicht', 'vorlage-schicht', 'rechenweg-schicht'];
const verlaufMax = () => verlaufBloecke.reduce((s, b) => s + b.hoehe, 0);
function verlaufMerken(html, hoehe) {
    verlaufBloecke.push({ html, hoehe });
    if (verlaufBloecke.length > 60) verlaufBloecke.shift();
    try { localStorage.setItem(VERLAUF_SCHLUESSEL, JSON.stringify({ tag: tagIso(new Date()), bloecke: verlaufBloecke })); } catch (_) {}
    zeigeVerlauf();
}
// the tasks done, stacked upwards from the top of the board
// Doc, 27.09.: the steps' numbers "bei den anderen überall" - the tasks done before the numbers came are
// pictures of the board as it stood (verlaufMerken keeps the html): their steps get them here, flush right
// behind the widest step of the task, on each row's baseline, in the look zeigeRechenweg gives them (0.7
// of the row, 1.5 em of air). A picture that has them already stays as it is.
let verlaufWartet = false;
function nummernNachtragen(block, breite) {
    if (block.querySelector('.rw-nummer')) return;
    const gruppen = new Map();
    block.querySelectorAll('[data-schritt]').forEach(z => {
        const k = z.dataset.schritt;
        if (!/^\d+$/.test(k) || !z.querySelector('.katex')) return;       // not the task, not an underline
        if (!gruppen.has(k)) gruppen.set(k, []);
        gruppen.get(k).push(z);
    });
    if (!gruppen.size) return;
    // a row's column is its "=": the right cell starts there (zeigeRechenweg) - two columns, two ends
    const zeilen = [...gruppen].map(([k, zellen]) => {
        const z0 = zellen[zellen.length - 1], sonde = z0.lastElementChild;       // the probe on the baseline
        return { nr: +k + 1, eltern: z0.parentElement, basis: parseFloat(z0.style.top) + (sonde ? sonde.offsetTop : 0),
            fs: parseFloat(getComputedStyle(z0).fontSize), spalte: Math.round(parseFloat(z0.style.left)),
            rechts: Math.max(...zellen.map(z => parseFloat(z.style.left) + z.offsetWidth)) };
    });
    const nummern = zeilen.map(z => {
        const d = document.createElement('div');
        d.className = 'rw-nummer';
        d.style.cssText = `position:absolute;left:0;top:0;white-space:nowrap;line-height:normal;font-size:${(NUMMER_GROESSE * z.fs).toFixed(2)}px`;
        try { katex.render(alsDisplay('(' + z.nr + ')'), d, { throwOnError: false }); } catch (_) { d.textContent = '(' + z.nr + ')'; }
        const sonde = document.createElement('span');
        sonde.style.cssText = 'display:inline-block;width:0;height:0';
        d.appendChild(sonde);
        z.eltern.appendChild(d);
        return d;
    });
    const spalten = new Map();
    zeilen.forEach((z, i) => {
        if (!spalten.has(z.spalte)) spalten.set(z.spalte, []);
        spalten.get(z.spalte).push(i);
    });
    spalten.forEach(idx => {
        const luft = Math.max(...idx.map(i => NUMMER_LUFT * 1.21 * zeilen[i].fs));     // KaTeX's em is 1.21 of the cell's size
        const ende = Math.min(breite - 16, Math.max(...idx.map(i => zeilen[i].rechts)) + luft + Math.max(...idx.map(i => nummern[i].offsetWidth)));
        idx.forEach(i => {
            nummern[i].style.left = (ende - nummern[i].offsetWidth) + 'px';
            nummern[i].style.top = (zeilen[i].basis - nummern[i].lastElementChild.offsetTop) + 'px';
        });
    });
}
function zeigeVerlauf() {
    if (anzeigeModus) return;
    let v = document.getElementById('verlauf-schicht');
    if (!v) {
        v = document.createElement('div');
        v.id = 'verlauf-schicht';
        v.style.cssText = 'position:absolute;left:0;right:0;top:0;height:0;pointer-events:none';
        container.appendChild(v);
    }
    v.innerHTML = '';
    let y = 0;
    for (let i = verlaufBloecke.length - 1; i >= 0; i--) {
        y -= verlaufBloecke[i].hoehe;
        const d = document.createElement('div');
        d.style.cssText = `position:absolute;left:0;right:0;top:${y}px;height:${verlaufBloecke[i].hoehe}px`;
        d.innerHTML = verlaufBloecke[i].html;
        v.appendChild(d);
        nummernNachtragen(d, container.getBoundingClientRect().width);
    }
    // measured with a stand-in font the numbers would miss: once more when KaTeX's fonts are in
    if (document.fonts && document.fonts.status === 'loading' && !verlaufWartet) {
        verlaufWartet = true;
        document.fonts.ready.then(() => { verlaufWartet = false; if (document.getElementById('verlauf-schicht')) zeigeVerlauf(); });
    }
    verlaufSetzen(verlaufY);
}
// the lined part moved down by y px, cut at the squares (dauer: ms of
// gliding, 0 for following the fingers, left out to keep what runs)
function verlaufSetzen(y, dauer) {
    verlaufY = Math.max(0, Math.min(verlaufMax(), y));
    const grenze = papierGrenze(container.getBoundingClientRect().height);
    VERLAUF_EBENEN.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (dauer !== undefined) el.style.transition = dauer
            ? `transform ${dauer}ms cubic-bezier(0.3, 0.7, 0.3, 1), clip-path ${dauer}ms cubic-bezier(0.3, 0.7, 0.3, 1)` : 'none';
        el.style.transform = verlaufY ? `translateY(${verlaufY}px)` : '';
        const t0 = el.offsetTop, h = el.offsetHeight;
        el.style.clipPath = verlaufY ? `inset(${-(t0 + verlaufY)}px -100vw ${h - (grenze - t0 - verlaufY)}px -100vw)` : '';
    });
    clearTimeout(verlaufUhr);
    if (verlaufY > 0 && !verlaufZug) verlaufUhr = setTimeout(() => verlaufSetzen(0, 600), VERLAUF_RUHE);
}
// two fingers on the board: from where the scrolling starts
function verlaufGesteBeginnt() {
    verlaufStartY = verlaufY;
    verlaufZug = verlaufY > 0;             // already back in time: every move scrolls
    clearTimeout(verlaufUhr);
}
// the fingers move: pulled down far enough (or already scrolled), the board follows
function verlaufZiehen(fingerListe) {
    const aktiv = fingerListe.filter(g => !g.weg);
    if (aktiv.length < 2) return;
    const dx = aktiv.reduce((s, g) => s + g.x - g.x0, 0) / aktiv.length;
    const dy = aktiv.reduce((s, g) => s + g.y - g.y0, 0) / aktiv.length;
    if (!verlaufZug) {
        if (!verlaufBloecke.length || dy < 12 || dy < Math.abs(dx)) return;
        verlaufZug = true;
        if (!document.getElementById('verlauf-schicht')) zeigeVerlauf();
    }
    verlaufSetzen(verlaufStartY + dy, 0);
}
// let go: onto whole lines
function verlaufLoslassen() {
    verlaufZug = false;
    verlaufSetzen(Math.round(verlaufY / ZEILE) * ZEILE, 250);
}
// back to the task at once (▶, a line sent up)
function verlaufZurueck() {
    if (verlaufY) verlaufSetzen(0, 0);
}
// a touch holds the board where it is; letting go starts the wait again
container.addEventListener('pointerdown', () => clearTimeout(verlaufUhr), true);
container.addEventListener('pointerup', () => {
    if (verlaufY > 0 && !verlaufZug) { clearTimeout(verlaufUhr); verlaufUhr = setTimeout(() => verlaufSetzen(0, 600), VERLAUF_RUHE); }
}, true);
// the new task out of the dark: dark at once, then (once the beamer has
// that too) fading in while the old one leaves
function aufgabeEinblenden() {
    const teile = ['vorlage-schicht', 'rechenweg-schicht'].map(id => document.getElementById(id)).filter(Boolean);
    teile.forEach(el => { el.style.transition = 'none'; el.style.opacity = '0'; });
    setTimeout(() => teile.forEach(el => {
        el.style.transition = `opacity ${WECHSEL_MS}ms ease-in`;
        el.style.opacity = '';
    }), WECHSEL_MS / 2);
}
// The paper (light and dark): lines down to about two thirds, ending on a
// line, squares below - Doc's writing field
function papierGrenze(h) { return Math.round(h * 2 / 3 / ZEILE) * ZEILE; }
function zeigePapier() {
    if (anzeigeModus) return;
    let p = document.getElementById('papier');
    if (!p) {
        p = document.createElement('div');
        p.id = 'papier';
        p.innerHTML = '<div class="linien"></div><div class="karo"></div>';
        container.insertBefore(p, container.firstChild);
    }
    zeileMessen();
    p.style.setProperty('--zeile', ZEILE + 'px');       // inline: the beamer's copy takes it along
    const grenze = papierGrenze(container.getBoundingClientRect().height);
    p.firstChild.style.height = grenze + 'px';
    p.firstChild.style.visibility = linienZeigen ? '' : 'hidden';   // inline: the beamer's copy takes it along
    p.lastChild.style.top = grenze + 'px';
}
