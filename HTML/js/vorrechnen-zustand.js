// Vorrechnen (vorrechnen.html), part 1 of 12: setup (side panel toggle, branding, canvas) and the state - plus the three modes.
// One of the classic scripts js/vorrechnen-*.js, split from the page's single inline block (27.09.2026).
// They share ONE global scope (top-level let/const/function), so the order of their <script> tags in
// vorrechnen.html matters: code that runs while the files load must not reach into a later file, and
// a callback that can fire in between (a resolved promise, a timer) must not either.

function toggleSidebar() {
    const panel = document.getElementById('side-panel');
    panel.classList.toggle('collapsed');
    // Doc, 26.09.: "persist sidebar visible" - as in batman.html
    try { localStorage.setItem('vorrechnen-seitenleiste-zu', panel.classList.contains('collapsed') ? '1' : '0'); } catch (_) {}
    if (window.CyberLeftChrome && typeof CyberLeftChrome.publishResolvedScale === 'function') {
        CyberLeftChrome.publishResolvedScale();
    }
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        if (typeof init === 'function') init();
        if (window.CyberLeftChrome && typeof CyberLeftChrome.publishResolvedScale === 'function') {
            CyberLeftChrome.publishResolvedScale();
        }
    }, 400);
}
// Restore it before the chrome renders, so the panel does not show and
// then fold away a frame later
try {
    if (localStorage.getItem('vorrechnen-seitenleiste-zu') === '1') {
        const zu = () => { const panel = document.getElementById('side-panel'); if (panel) panel.classList.add('collapsed'); };
        if (document.getElementById('side-panel')) zu();
        else document.addEventListener('DOMContentLoaded', zu, { once: true });
    }
} catch (_) {}

// Doc, 25.09.: "Branding rechts oben auskommentieren" - the pad needs the
// room. The central switch, so navigation and the rest stay as they are.
// CyberBranding.init({ useExternalStyles: true, title: 'Vorrechnen', subtitle: 'Lab' });
CyberBranding.init({ useExternalStyles: true, title: 'Vorrechnen', subtitle: 'Lab', skipCanvasBranding: true });
CyberUI.init();

if (window.CyberLeftChrome && typeof CyberLeftChrome.configure === 'function') {
    CyberLeftChrome.configure({ viewportOnlyZoom: true });
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
// Beamer (see "Beamer" further down): this window is either mission
// control (opened with ?steuerung, Doc writes here) or, while it projects,
// the board on the beamer that only shows what mission control sends.
const STEUERUNG = new URLSearchParams(location.search).has('steuerung');
let anzeigeModus = false;
const container = document.getElementById('canvas-container');

// ── State ───────────────────────────────────────────────────────────
// A stroke is { points: [{x, y, t}], width }. The time is what morpheus
// never kept, and it is the only thing that separates two glyphs written
// close together from one glyph drawn in two parts.
const strokes = [];
let current = null;
let analysis = { symbols: [], lines: [] };

const opts = Object.assign({}, StrokeSymbols.DEFAULTS);
// Recognition result per row: { latex, tokens, zuordnung, fehler }
const zeilenErgebnis = [];
let erkennenLaeuft = false;
let flugLiest = 0;                 // lines in the air that Gemini is reading right now
let erkennenStand = 0;             // bumped by every change a result could miss
// Morph state: 0 = pure handwriting, 1 = fully typeset. Per row, the
// prepared point pairs; morphT is shared so a row moves as a whole.
const morphVorbereitet = [];
let morphT = 0;
let morphAnim = null;
// The working under the task: one LaTeX line per step, top to bottom.
// Kept on the device - live reload must not eat a lesson's board.
const rechenweg = [];
try {
    const d = JSON.parse(localStorage.getItem('vorrechnen-rechenweg') || '[]');
    if (Array.isArray(d)) d.forEach(l => {
        if (typeof l === 'string') rechenweg.push({ latex: l, farbe: null });
        else if (l && typeof l.latex === 'string') rechenweg.push({ latex: l.latex, farbe: l.farbe || null });
    });
} catch (_) {}
// formelUnten: the typeset formula under the handwriting - Doc first: "lass
// die unten weg", then: "zeig bitte doch die erkannte Formel unten x mittig
// etwas dunkler" (25.09.)
const view = { boxes: false, numbers: true, rows: true, penOnly: false, formelUnten: true, handballen: true };
// Doc: boxes off by default, and the choice is remembered on the device.
// Doc, 26.09.: "Boxen zeigen weg" - with the switch gone a stored "on"
// would stay for good, so the boxes are off
// try { view.boxes = localStorage.getItem('vorrechnen-boxen') === '1'; } catch (_) {}
// the row bands are the same kind of calibration aid - Doc: "komische Box"
view.rows = view.boxes;

// The corpus, easy to hard. Doc copies each one by hand, ERKENNEN saves
// the probe, and the grouping is then tuned against all of them. Roots
// and tall brackets come late on purpose - KaTeX draws those as SVG, so
// they show where the morph still stops.
const VORLAGEN = [
    ['linear',        '2x+3=11'],
    ['gerade',        'y=mx+b'],
    ['quadrat',       'x^2-4=0'],
    ['pythagoras',    'a^2+b^2=c^2'],
    ['binom',         '(a+b)^2=a^2+2ab+b^2'],
    ['funktion',      'f(x)=x^3-2x'],
    ['brueche',       '\\frac{1}{2}+\\frac{1}{3}=\\frac{5}{6}'],
    ['log',           '\\log_2 8=3'],
    ['ableitung',     "f'(x)=2x"],
    ['euler',         'e^{i\\pi}+1=0'],
    ['trig',          '\\sin^2\\alpha+\\cos^2\\alpha=1'],
    ['wahrsch',       'P(A\\cap B)=P(A)\\cdot P(B)'],
    ['summe',         '\\sum_{k=1}^{n}k=\\frac{n(n+1)}{2}'],
    ['limes',         '\\lim_{x\\to\\infty}\\frac{1}{x}=0'],
    ['ableitung2',    '\\frac{d}{dx}\\sin x=\\cos x'],
    ['integral',      '\\int_0^1 x^2\\,dx=\\frac{1}{3}'],
    ['vektor',        '\\vec{a}\\cdot\\vec{b}=|a||b|\\cos\\varphi'],
    ['wurzel',        '\\sqrt{16}=4'],
    ['pq',            'x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}'],
    ['reihe',         '\\sum_{i=1}^{\\infty}\\frac{1}{2^i}=1'],
    // Doc, 25.09.: the formulas of the old morpheus/equationocr lab
    // (morpheus/formulas.js) - there only as pictures of his hand, which
    // carry no strokes. Written once more on the pad they become examples
    // too. The five complex ones first.
    ['riemann',       '\\zeta(s)=\\sum_{n=1}^{\\infty}\\frac{1}{n^s}'],
    ['dirac',         '(i\\hbar\\gamma^\\mu\\partial_\\mu - mc)\\psi=0'],
    ['cauchy',        'f(a)=\\frac{1}{2\\pi i}\\oint_\\gamma\\frac{f(z)}{z-a}\\,dz'],
    ['einstein',      'R_{\\mu\\nu}-\\tfrac{1}{2}g_{\\mu\\nu}R+\\Lambda g_{\\mu\\nu}=\\frac{8\\pi G}{c^4}T_{\\mu\\nu}'],
    ['navier',        '\\rho\\!\\left(\\frac{\\partial\\mathbf{v}}{\\partial t}+\\mathbf{v}\\!\\cdot\\!\\nabla\\mathbf{v}\\right)=-\\nabla p+\\mu\\nabla^2\\mathbf{v}+\\mathbf{f}'],
    ['emc2',          'E=mc^2'],
    ['taylor',        'e^x=\\sum_{n=0}^{\\infty}\\frac{x^n}{n!}'],
    ['gauss',         '\\int_{-\\infty}^{\\infty}e^{-x^2}dx=\\sqrt{\\pi}'],
    ['binomko',       '\\binom{n}{k}=\\frac{n!}{k!(n-k)!}'],
    ['potenzregel',   '\\frac{d}{dx}x^n=nx^{n-1}'],
    ['integral-ab',   '\\int_a^b f(x)\\,dx'],
    ['gravitation',   'F=G\\frac{m_1 m_2}{r^2}'],
    ['schroedinger',  'i\\hbar\\frac{\\partial}{\\partial t}\\Psi=\\hat{H}\\Psi'],
    ['maxwell-gauss', '\\nabla\\cdot E=\\frac{\\rho}{\\varepsilon_0}'],
    ['maxwell-ampere','\\nabla\\times B=\\mu_0 J+\\mu_0\\varepsilon_0\\frac{\\partial E}{\\partial t}'],
];
let vorlageIdx = 0;
try { vorlageIdx = Math.min(VORLAGEN.length - 1, parseInt(localStorage.getItem('vorrechnen-vorlage') || '0', 10) || 0); } catch (_) {}

// The tasks, their blocks (aufgabenBlock) and their solutions: js/vorrechnen-aufgaben.js,
// shared with the deck of all tasks (decks/tafel.html?aufgaben).
// Doc, 26.09.: "einen Button mit P der bedeutet Preview und der soll die grauen
// Vorhersagen ... wegbringen. Und also Toggle" - the grey step and its operation
// on or off (P on the right rail), remembered
let vorschau = true;
try { vorschau = localStorage.getItem('vorrechnen-vorschau') !== '0'; } catch (_) {}
// Doc, 27.09.: "mache den Abstand der Zeilen bitte etwas größer. Und lass die Zeilen mal eigentlich weg ...
// und versuche den Abstand zwischen allen Formeln gleich zu lassen ... ich will das mal probieren" - no
// ruled lines, every two rows the same gap; the old look stays one tick away (Einstellungen: Linien)
let linienZeigen = false;
try { linienZeigen = localStorage.getItem('vorrechnen-linien') === '1'; } catch (_) {}
let aufgabeIdx = 0;
try { aufgabeIdx = Math.min(AUFGABEN.length - 1, parseInt(localStorage.getItem('vorrechnen-aufgabe') || '0', 10) || 0); } catch (_) {}
// Doc, 30.09.2026: "noch nicht richtig oder?" - a task put in front of the one on the board had moved the stored
// number onto the new task, under the old one's working. The task is kept by its slug too and found by it; the
// number is the fallback. Stored before there was a slug (once per device): a working whose first line is a step of
// exactly one task's solution says whose it is - ↑ and the recognition put the solution's own LaTeX there.
try {
    const slug = localStorage.getItem('vorrechnen-aufgabe-slug');
    let j = slug ? AUFGABEN.findIndex(a => a[0] === slug) : -1;
    if (!slug && rechenweg.length) {
        const passt = AUFGABEN.map((a, k) => k)
            .filter(k => (LOESUNGEN[AUFGABEN[k][0]] || []).some(s => s[0] === rechenweg[0].latex));
        if (passt.length === 1) j = passt[0];
    }
    if (j >= 0) aufgabeIdx = j;
} catch (_) {}
function merkeAufgabe() {
    try {
        localStorage.setItem('vorrechnen-aufgabe', String(aufgabeIdx));
        localStorage.setItem('vorrechnen-aufgabe-slug', AUFGABEN[aufgabeIdx][0]);
    } catch (_) {}
}
// Doc, 28.09.2026: "wenn ich pro Woche andere Aufgaben will" - a block can carry the calendar week it
// is for (BLOECKE kw, the week number the Stoffverteilungsplan counts by). The first start in that week
// opens its first task, once per device - after that the lab stays where Doc went (live reload, ◀ ▶, panel).
// The working on the board belongs to the task before: it does not come along (30.09.).
try {
    const kw = svpIsoWeek(new Date()), b = BLOECKE.find(x => x.kw === kw);
    if (b && localStorage.getItem('vorrechnen-woche') !== String(kw)) {
        if (aufgabeIdx !== b.ab) { rechenweg.length = 0; localStorage.setItem('vorrechnen-rechenweg', '[]'); }
        aufgabeIdx = b.ab;
        localStorage.setItem('vorrechnen-woche', String(kw));
    }
} catch (_) {}
merkeAufgabe();
// Does the server take probes? Checked once at load; otherwise the probe
// is offered as a download, the way SICHERN does it.
let speichernApi = false;

// Doc, 25.09.: "irgendwie lenkt das grün ab ... mach mal fast weiß" - ink,
// template and morph share this one colour
const INK = '#eaf0f7';
// Doc, 26.09.: "oben: Farben", "klar! Unsere" - the ink plus the palette
// of CLAUDE.md, exact. A stroke keeps its colour through the morph into
// LaTeX and up into the working.
const FARBEN = [
    ['Weiß', INK],
    ['Orange', 'rgb(245, 194, 66)'],     // lambda
    ['Rot', 'rgb(176, 36, 24)'],         // Upsilon
    ['Grün', 'rgb(121, 158, 49)'],       // phi
];
let stiftFarbe = INK;
try { const f = localStorage.getItem('vorrechnen-farbe'); if (FARBEN.some(x => x[1] === f)) stiftFarbe = f; } catch (_) {}
// Light mode: sand paper, and the white pen writes in royal blue ink. A
// stroke keeps "white" - only its look changes, so toggling repaints all.
const TINTE = 'rgb(25, 52, 130)';            // royal blue, like a school fountain pen - a touch darker (Doc, 01.10.2026: "ein kleines bisschen dunkler", was rgb(31, 64, 150)); decks/deck.css --formel matches
let hell = false;
try { hell = localStorage.getItem('vorrechnen-hell') === '1'; } catch (_) {}
container.classList.toggle('hell', hell);
function anzeige(f) { return (!f || f === INK) ? (hell ? TINTE : INK) : f; }
// a line's colour: the one most of its strokes carry
function linienFarbe(line, striche = strokes) {
    const n = new Map();
    (line.symbols || []).forEach(sy => sy.strokeIdxs.forEach(i => {
        const f = (striche[i] && striche[i].farbe) || INK;
        n.set(f, (n.get(f) || 0) + 1);
    }));
    let beste = INK, max = 0;
    n.forEach((k, f) => { if (k > max) { max = k; beste = f; } });
    return beste;
}
// Symbol colours: Doc's palette first, then neon blue, cycling. Red-free
// on purpose so it never reads as an error marker.
const SYM_COLORS = ['#00d2ff', 'rgb(245,194,66)', 'rgb(121,158,49)', '#c77dff', '#ff9e64'];

// The three modes live with the state (they used to open the test-mode section): a
// fonts.ready callback in the "flug" part reads them and may run before the later files load.
// Doc, 26.09.: "Meine Beispiele ist off dennoch erscheinen sie oben ...
// wir brauchen einen Aufgaben Modus" - three modes instead of one
// switch: frei (nothing on top), aufgaben (the tasks, for class),
// beispiele (the templates with Doc's own handwriting, for testing)
const MODI = ['frei', 'aufgaben', 'beispiele'];
let modus = 'aufgaben';
try {
    const m = localStorage.getItem('vorrechnen-modus');
    if (MODI.includes(m)) modus = m;
    else if (localStorage.getItem('vorrechnen-testmodus') === '1') modus = 'beispiele';
} catch (_) {}
let testModus = modus === 'beispiele', aufgabenModus = modus === 'aufgaben';
// Doc, 30.09.2026 (the blackboard left of the week's tabs in the plan): "gib mir da das Tafelicon. Wenn click: zeig
// Vorrechnen - das Tool mit den Aufgaben!" - vorrechnen.html?kw=44 opens the tasks on that week's block, its first
// task (svp/svp-plan-tafel.js); the working of the task before stays behind, as at the week's first start above. The
// parameter leaves the address at once, so a live reload stays where Doc went.
// Doc, 01.10.2026 (the plan's Aufgabensammlung: "ich brauche den Button fürs Vorrechnen" - for the decks by theme as
// well): ?aufgaben=knobeln opens the first task of that theme (SAMMLUNGEN, js/vorrechnen-aufgaben.js), ?aufgaben alone
// the levels - the blocks without a week that no other theme claims, as decks/tafel.html takes them.
function themaBlock(key) {
    const s = typeof SAMMLUNGEN !== 'undefined' && SAMMLUNGEN[key];
    if (!s) return null;
    const anderes = b => Object.keys(SAMMLUNGEN).some(k => SAMMLUNGEN[k].block && SAMMLUNGEN[k].block.test(b.titel));
    return BLOECKE.find(b => b.kw === undefined && (s.block ? s.block.test(b.titel) : !anderes(b))) || null;
}
try {
    const p = new URLSearchParams(location.search), kw = p.get('kw');
    const thema = p.has('aufgaben') ? String(p.get('aufgaben') || '').toLowerCase() : null;
    const b = kw ? BLOECKE.find(x => String(x.kw) === kw) : thema !== null ? themaBlock(thema) : null;
    if (b) {
        modus = 'aufgaben'; testModus = false; aufgabenModus = true;
        localStorage.setItem('vorrechnen-modus', modus);
        if (aufgabeIdx !== b.ab) { rechenweg.length = 0; localStorage.setItem('vorrechnen-rechenweg', '[]'); }
        aufgabeIdx = b.ab;
        merkeAufgabe();
    }
    if (kw || thema !== null) {
        p.delete('kw'); p.delete('aufgaben');
        history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : '') + location.hash);
    }
} catch (_) {}
