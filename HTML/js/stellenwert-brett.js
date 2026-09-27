/* The place value board (Stellenwert-Brett) - the lab behind maya.html and babylon.html, and the one every
 * further number system lab builds on. A number is laid on places, the decimal number above counts along,
 * the arrow between them says who leads, and the die sets tasks.
 *
 * A lab page brings only what is its own, in a classic script BEFORE this one:
 *
 *     const BOARD = {
 *         key: 'maya',                 // localStorage + i18n prefix ('maya.places', 'maya.title', ...)
 *         subtitle: 'MAYA-ZAHLEN',     // the branding line
 *         digits: 20,                  // digits per place, 0 .. digits-1 - the panel has one cell each
 *         defaultPlaces: 4,
 *         typedDigits: 7,              // how many decimal digits the number above takes
 *         rollFitsDecimals: true,      // a roll has as many decimal digits as there are places
 *         systems: { key: { values: [1, 20, ...], limits: [20, 18, ...], label, note }, ... },
 *         defaultSystem: 'kalender',
 *         arrange: { flat: '...', upright: '...' },          // the two radio labels
 *         panelCaption: 'Die zwanzig Ziffern',
 *         panelFlat(blockW)  -> { cols, cellRatio, share }  // the panel under the flat board
 *         upright: { panel: [min, share, max], board: [...], num: [...], cols, byColumn },
 *         fitTerms: true,              // flat: long terms shrink until they fit their column
 *         power(place)       -> { pre, base, exp }          // the label at the top of a place
 *         paintDigit(d, cx, cy, bw, bh, place, colOverride) // draws one digit, d === null draws nothing
 *         digitBox(x, y, w, h, upright) -> [cx, cy, bw, bh] // optional: where a digit sits in its card
 *         shownDigit(place)  -> digit | null                // optional: what a place shows
 *         paletteCell(k, x, y, w, h, panelCol, upright)     // optional: one cell of the digit panel
 *         placeColors: [...]           // optional: the colours of colour mode (C), one per place
 *         onReady()                    // optional: wire the lab's own controls, before the first draw
 *     };
 *
 * A lab's own popup section goes into <template id="board-dlg-extra">, above the FERTIG button.
 *
 * This stays a classic top-level script on purpose: the lab's digit painters use its helpers (ctx, COL,
 * roundRect, placeColor, glyphs, draw, T), and the live tour (tours/maya.js) reaches its state and functions
 * (digits, task, flow, layout, setFlow, changed, ...) through the page's globals.
 */

const BOARD_SCRIPT = document.currentScript ? document.currentScript.src : location.href;

const T = (k, fb) => (typeof CyberI18n !== 'undefined' && CyberI18n.getOr)
    ? CyberI18n.getOr(BOARD.key + '.' + k, fb)
    : fb;

function dbg(m) { if (window.DebugWindow) DebugWindow.log('[' + BOARD.key + '] ' + m); }

// ------------------------------------------------------------------ markup ---
// The stage is the same in every lab, so it is built here: the die, the number with its two pairs of
// triangles, the arrow, the sum, the canvas - and the popup behind the gear.
(function buildBoard() {
    const tri = (dir) => '<svg viewBox="0 0 18 11" aria-hidden="true"><path d="'
        + (dir === 'up' ? 'M9 0 18 11 0 11Z' : 'M9 11 0 0 18 0Z') + '" /></svg>';
    const spin = (cls, id, upTitle, downTitle) =>
        '<div class="board-spin' + cls + '"' + (id ? ' id="' + id + '"' : '') + '>'
        + '<button type="button" class="spin-up" tabindex="-1" title="' + upTitle + '">' + tri('up') + '</button>'
        + '<button type="button" class="spin-down" tabindex="-1" title="' + downTitle + '">' + tri('down') + '</button>'
        + '</div>';

    document.getElementById('canvas-container').insertAdjacentHTML('beforeend',
        '<div id="board-dice" class="board-card" title="Würfeln: neue Aufgabe"><div id="die-stage"></div></div>'
        + '<span id="font-probe">0123456789</span>'
        + '<div id="board-head" class="board-card">'
        + '<div class="board-num" id="board-num" role="textbox" tabindex="0" inputmode="numeric"'
        + ' title="Zahl antippen und neu eingeben"></div>'
        + spin(' left', 'board-places', 'eine Stelle mehr', 'eine Stelle weniger')
        + spin('', '', 'eins mehr (Pfeil hoch)', 'eins weniger (Pfeil runter)')
        + '</div>'
        + '<button id="board-link" class="board-link" type="button"'
        + ' title="Unten bestimmt oben — klicken dreht die Richtung um">'
        + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.5V19" /><path d="M5.8 13.2 12 19.4l6.2-6.2" /></svg>'
        + '</button>'
        + '<div id="board-solution" class="board-card"><div id="board-formula"></div></div>'
        + '<canvas id="canvas"></canvas>');

    document.body.insertAdjacentHTML('beforeend',
        '<div id="board-dlg" class="board-dlg" hidden>'
        + '<div class="board-dlg-card" role="dialog" aria-modal="true" aria-labelledby="board-dlg-title">'
        + '<h2 id="board-dlg-title">STELLENWERTE</h2>'
        + '<div id="board-system"></div>'
        + '<div class="board-note" id="board-system-note"></div>'
        + '<h2 class="board-dlg-h2">ANORDNUNG</h2>'
        + '<div id="board-arrange"></div>'
        + '<button type="button" class="cyber-btn" id="board-dlg-close">FERTIG</button>'
        + '</div></div>');
    const extra = document.getElementById('board-dlg-extra');
    if (extra) {
        const close = document.getElementById('board-dlg-close');
        close.parentNode.insertBefore(extra.content.cloneNode(true), close);
    }

    // the gear on top of the rail opens the place values
    const rail = document.getElementById('mini-rail');
    if (rail) {
        rail.insertAdjacentHTML('afterbegin',
            '<div class="nav-btn" title="Stellenwerte">'
            + '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"'
            + ' stroke-linecap="round" stroke-linejoin="round">'
            + '<circle cx="12" cy="12" r="3.2"></circle>'
            + '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>'
            + '</svg></div>');
        rail.firstElementChild.addEventListener('click', () => openSystem());
    }
})();

CyberBranding.init({
    useExternalStyles: true,
    title: CyberI18n.get('ui.coach_title'),
    subtitle: T('title', BOARD.subtitle),
});
CyberUI.init();

if (window.CyberLeftChrome && typeof CyberLeftChrome.configure === 'function') {
    CyberLeftChrome.configure({ viewportOnlyZoom: true });
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('canvas-container');

// ---------------------------------------------------------------- palette ---
const COL = {
    glyph: 'rgb(245, 194, 66)',   // the signs of a digit
    zero: 'rgb(245, 194, 66)',    // the sign for an empty place - like the other signs
    ok: 'rgb(121, 158, 49)',      // right answer, carry done
    cyan: 'rgb(0, 210, 255)',
    warn: 'rgb(176, 36, 24)',
    dim: 'rgba(245, 194, 66, 0.55)',
    mute: 'rgba(255, 255, 255, 0.3)',   // the grey of the open link - out of play
    line: 'rgba(255, 255, 255, 0.13)',
    fill: 'rgba(255, 255, 255, 0.03)'
};

// ------------------------------------------------------------ number system ---
// Every system of a lab has its place values and, per place, the digit at which it rolls over. They are
// the same length in every system of a lab - that length is how many places the board can have.
const MAX_PLACES = Object.values(BOARD.systems)[0].values.length;
const emptyDigits = () => new Array(MAX_PLACES).fill(0);

// Settings survive a reload. Storage can be blocked or empty, so every touch is guarded
// and the lab works exactly the same when it gives nothing back.
const store = {
    get(key, fallback) {
        try { const v = localStorage.getItem(BOARD.key + '.' + key); return v === null ? fallback : v; }
        catch (e) { return fallback; }
    },
    set(key, value) {
        try { localStorage.setItem(BOARD.key + '.' + key, value); } catch (e) { }
    }
};

// C gives every place its own colour - ours plus the cyan of the lab. A lab with more places
// brings its own list (binaer.html colours by nibble, the four bits of one hex digit).
let colorMode = store.get('colour', '0') === '1';
const PLACE_COLORS = BOARD.placeColors || [
    'rgb(245, 194, 66)', 'rgb(0, 210, 255)', 'rgb(121, 158, 49)',
    'rgb(176, 36, 24)', 'rgb(157, 80, 187)'   // the fifth its own, not the cyan again
];
const placeColor = (place) =>
    (colorMode && place !== null && place !== undefined) ? PLACE_COLORS[place % PLACE_COLORS.length] : COL.glyph;

let sysKey = (() => {
    const k = store.get('system', BOARD.defaultSystem);
    return BOARD.systems[k] ? k : BOARD.defaultSystem;
})();
let digits = emptyDigits();       // index 0 = ones, the lowest place
let task = null;                  // { target, done }
// Which way the arrow points, and whether it has been followed yet:
//   'up'   - the board leads, the number above says what lies there
//   'down' - the number above leads, the board is its picture in the lab's digits
//   'task' - the arrow points down but grey: a number stands above, the board is
//            empty, and laying it is yours. One click lays it - that is the answer.
// Whoever is worked on leads, so the arrow turns by itself.
let flow = 'up';
let editing = false;              // the big number is being typed over
let before = null;                // what lay on the board before it was typed over
let blank = false;                // nothing lies on the board - not even a zero
// how many places stand there - the lab's default unless it is set otherwise, and never fewer
// than the number needs
let placeCount = Math.min(MAX_PLACES, Math.max(1,
    parseInt(store.get('places', String(BOARD.defaultPlaces)), 10) || BOARD.defaultPlaces));
// two ways to stand: flat, the places side by side, or upright - a column with the highest place on top
// Inside a slide (an iframe in a deck) the lab gets a wide, flat strip - that is exactly
// the upright layout, so it takes that there without touching the saved choice, and it
// drops its title, because the slide has its own.
const EMBEDDED = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
if (EMBEDDED) document.documentElement.classList.add('lab-embedded');
let upright = EMBEDDED || store.get('upright', '0') === '1';
let flashes = [];                 // { place, color, until }
let cards = [];                   // the places, side by side
let glyphs = [];                  // every sign of every digit, for taking them away
let palette = [];                 // the digits to drag from
let drag = null;                  // { digit, x, y, moved }
let picked = null;                // digit tapped in the panel, waiting for a place
let hoverPlace = null;            // the place a dragged digit is over

const sys = () => BOARD.systems[sysKey];
const value = () => digits.reduce((sum, d, i) => sum + d * sys().values[i], 0);
const de = (n) => n.toLocaleString('de-DE');

function places() {
    let top = placeCount - 1;     // as many as are set, more if the number needs them
    for (let i = digits.length - 1; i >= 0; i--) {
        if (digits[i] > 0) { top = Math.max(top, i); break; }
    }
    return top + 1;
}

// What a place shows - the lab may say otherwise (babylon.html: an empty place at the end stays empty)
function placeShows(place) {
    if (BOARD.shownDigit) return BOARD.shownDigit(place);
    return blank ? null : digits[place];
}

// the left pair of triangles: one place more, one place less. Fewer than the number
// needs is not possible - those places hold something.
function setPlaces(n) {
    placeCount = Math.min(MAX_PLACES, Math.max(1, n));
    store.set('places', String(placeCount));
    // a number that no longer fits has nowhere to go, so it goes: empty board, empty
    // number, and the arrow back up. Whatever fits simply stays.
    const room = maxValue(placeCount);
    if (value() > room || (task && task.target > room)) {
        digits = emptyDigits();
        blank = true;
        task = null;
        setFlow('up', true);
        say(T('places_clear', 'Zu wenig Stellen für diese Zahl - das Brett ist leer.'), COL.glyph);
    }
    changed();
}

// the largest number that fits into n places
function maxValue(n) {
    const v = sys().values, lim = sys().limits;
    let m = 0;
    for (let i = 0; i < n; i++) m += (lim[i] - 1) * v[i];
    return m;
}

// Lay a decimal number out over the places, highest first.
function layout(n) {
    const v = sys().values, last = v.length - 1;
    const maxValue = v[last] * (sys().limits[last] - 1) + v[last] - 1;
    n = Math.max(0, Math.min(Math.floor(n), maxValue));
    const out = emptyDigits();
    for (let i = v.length - 1; i >= 0; i--) {
        out[i] = Math.floor(n / v[i]);
        n -= out[i] * v[i];
    }
    digits = out;
    blank = false;
}

// ------------------------------------------------------------------ drawing ---
function roundRect(x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
}

// the place value label at the top of a card (drawn at 6-8 px, 12 px Orbitron plus its
// exponent) - the digit below keeps clear of this strip
const LABEL_H = 24;

// The place value as a power, drawn small at the top of its card - what it reads is the lab's
function drawPower(place, cx, y) {
    const { pre = '', base, exp } = BOARD.power(place);
    const label = pre + base;
    ctx.save();
    ctx.fillStyle = colorMode ? placeColor(place) : 'rgba(255, 255, 255, 0.45)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = "600 12px 'Orbitron', sans-serif";
    const bw = ctx.measureText(label).width;
    ctx.font = "600 9px 'Orbitron', sans-serif";
    const ew = ctx.measureText(String(exp)).width;
    const x = cx - (bw + 1 + ew) / 2;
    ctx.font = "600 12px 'Orbitron', sans-serif";
    ctx.fillText(label, x, y);
    ctx.font = "600 9px 'Orbitron', sans-serif";
    ctx.fillText(String(exp), x + bw + 1, y - 3);
    ctx.restore();
}

// Where a digit sits in its card: below the place value label, so a big digit never covers it.
// A lab may give its digits the whole card instead.
function digitBox(x, y, w, h, isUpright) {
    if (BOARD.digitBox) return BOARD.digitBox(x, y, w, h, isUpright);
    return [x + w / 2, y + (LABEL_H + h - 6) / 2, w, h - LABEL_H - 6];
}

// One cell of the digit panel: its number on top, the digit below. A lab may draw its own.
function drawCell(k, cx0, cy0, cellW, cellH, panelCol, isUpright) {
    if (BOARD.paletteCell) {
        BOARD.paletteCell(k, cx0, cy0, cellW, cellH, panelCol, isUpright);
        return;
    }
    const on = picked === k || (drag && drag.digit === k);

    roundRect(cx0 + 3, cy0 + 2, cellW - 6, cellH - 4, 10,
        on ? 'rgba(245, 194, 66, 0.12)' : 'rgba(255, 255, 255, 0.02)',
        on ? COL.glyph : 'rgba(255, 255, 255, 0.07)');

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = "600 12px 'Orbitron', sans-serif";
    ctx.fillStyle = on ? COL.glyph : 'rgba(255, 255, 255, 0.45)';
    ctx.fillText(String(k), cx0 + cellW / 2, cy0 + (isUpright ? 5 : 6));

    BOARD.paintDigit(k, cx0 + cellW / 2, cy0 + cellH * 0.62, cellW - 14, cellH * (isUpright ? 0.58 : 0.6), null, panelCol);
    palette.push({ digit: k, x: cx0, y: cy0, w: cellW, h: cellH });
}

function flashColor(place) {
    const now = performance.now();
    const f = flashes.find(f => f.place === place && f.until > now);
    return f ? f.color : null;
}

function draw() {
    const rect = container.getBoundingClientRect();
    const W = rect.width, H = rect.height;
    ctx.clearRect(0, 0, W, H);
    cards = [];
    glyphs = [];
    palette = [];
    if (W < 200 || H < 200) return;     // the chrome has not settled yet
    if (upright) { drawUpright(rect, W, H); return; }

    const pad = 16;
    const n = places();

    // places and panel share one width, so their edges line up. That width is fixed -
    // it is always the one four places take - so setting the number of places does not
    // move the number, the sum or the panel. Only the places themselves get wider or
    // narrower to fill it.
    const REF_PLACES = 4;
    const blockW = Math.min(W - 2 * pad, REF_PLACES * 200 + (REF_PLACES - 1) * 14);
    const blockX = (W - blockW) / 2;

    // where the places will stand - the sum's terms line up with these columns
    const cardW = (blockW - (n - 1) * 14) / n;
    const colCenter = (col) => blockX + col * (cardW + 14) + cardW / 2;

    // the number and the sum sit above the board as HTML cards -
    // measure them, then give the board what is left
    const diceEl = document.getElementById('board-dice');
    const headEl = document.getElementById('board-head');
    const solEl = document.getElementById('board-solution');
    const linkEl = document.getElementById('board-link');
    const titleEl = document.getElementById('lab-title');
    let top = 14, stackTopMin = 14, dH = 0, hH = 0, sH = 0, tH = 0;
    if (headEl && solEl) {
        for (const el of [diceEl, headEl, solEl]) {
            if (!el) continue;
            el.style.left = blockX + 'px';
            el.style.width = blockW + 'px';
        }
        // the branding sits in the top right corner of the stage - stay below it
        const brand = document.querySelector('.canvas-branding');
        if (brand) {
            const b = brand.getBoundingClientRect();
            if (b.width && b.left - rect.left < blockX + blockW) {
                stackTopMin = Math.max(stackTopMin, b.bottom - rect.top + 12);
            }
        }
        solEl.classList.remove('column');
        headEl.classList.remove('column');
        if (linkEl) linkEl.classList.remove('sideways');
        solEl.style.height = '';
        solEl.querySelectorAll('.board-term').forEach(el => {
            const col = Number(el.dataset.col);
            el.style.top = '';
            el.style.right = '';
            el.style.left = (colCenter(col) - blockX) + 'px';
            // in colour mode every term takes the colour of its own place
            el.style.color = colorMode ? placeColor(n - 1 - col) : '';
        });
        solEl.querySelectorAll('.board-plus').forEach(el => {
            const g = Number(el.dataset.gap);
            el.style.top = '';
            el.style.right = '';
            el.style.left = ((colCenter(g) + colCenter(g + 1)) / 2 - blockX) + 'px';
        });
        solEl.style.fontSize = '';        // the upright mode sizes the whole card - not here
        // five places make narrow columns and long terms (0 · 144.000): the sum gets
        // smaller until every term is no wider than the digits in its card. Measured from
        // the CSS size every time, so it does not creep.
        if (BOARD.fitTerms) {
            const formEl = document.getElementById('board-formula');
            if (formEl) {
                formEl.style.fontSize = '';
                const terms = [...formEl.querySelectorAll('.board-term')];
                const widest = Math.max(0, ...terms.map(el => el.offsetWidth));
                const room = Math.min(cardW * 0.78, 132 + 20);
                if (widest > room) {
                    formEl.style.fontSize = (parseFloat(getComputedStyle(formEl).fontSize) * room / widest) + 'px';
                    let fh = 0;
                    formEl.querySelectorAll('span').forEach(el => { fh = Math.max(fh, el.offsetHeight); });
                    formEl.style.height = (fh || 22) + 'px';
                }
            }
        }
        if (titleEl) {
            titleEl.style.left = blockX + 'px';
            titleEl.style.width = blockW + 'px';
            tH = titleEl.offsetHeight ? titleEl.offsetHeight + 14 : 0;
        }
        // the die's box is exactly as high as the number's, the die fills it
        headEl.style.top = stackTopMin + 'px';
        hH = headEl.offsetHeight;
        if (diceEl) {
            diceEl.style.height = hH + 'px';
            diceEl.style.top = stackTopMin + 'px';
            dH = hH + 14;
            headEl.style.top = (stackTopMin + dH) + 'px';
        }
        solEl.style.top = (stackTopMin + dH + hH + 14) + 'px';
        sH = solEl.offsetHeight;
        top = stackTopMin + tH + dH + hH + 14 + sH + 14;
    }

    const avail = H - top - pad;
    if (avail < 200) return;

    // the panel under the places: as many digits in a row as the lab says
    const { cols, cellRatio, share } = BOARD.panelFlat(blockW);
    const rows = BOARD.digits / cols;
    const cellW = blockW / cols;
    const cellH = Math.min(cellW * cellRatio, (avail * share - 26) / rows);
    const panelH = rows * cellH + 26;

    // the places above it
    const cardsH = Math.min(avail - panelH - 16, 280);
    const cardH = Math.max(90, cardsH - 24);
    const rowX = blockX;

    const gapH = 22, captionH = 28;
    const blockH = cardH + gapH + rows * cellH + captionH;

    // die, number, sum and board keep the same gap the places and the panel keep,
    // and the whole stack stands centred on the stage
    const stackGap = gapH;
    const diceH = diceEl ? diceEl.offsetHeight : 0;
    const titleH = titleEl && titleEl.offsetHeight ? titleEl.offsetHeight + stackGap : 0;
    const stackH = titleH + (diceEl ? diceH + stackGap : 0) + hH + stackGap + sH + stackGap + blockH;
    const DROP = 28;            // the whole block sits a little lower than centred
    const lowest = Math.max(stackTopMin, H - pad - stackH);
    const stackTop = Math.min(
        Math.max(stackTopMin, Math.min((H - stackH) / 2, H - pad - stackH)) + DROP,
        lowest);
    let y = stackTop;
    if (titleEl) { titleEl.style.top = y + 'px'; y += titleH; }
    if (diceEl) { diceEl.style.top = y + 'px'; y += diceH + stackGap; }
    if (headEl) headEl.style.top = y + 'px';
    y += hH + stackGap;
    if (solEl) solEl.style.top = y + 'px';
    if (linkEl) {
        const seam = y - stackGap / 2;        // the gap between the number and the sum
        linkEl.style.top = (seam - linkEl.offsetHeight / 2) + 'px';
        linkEl.style.left = (blockX + blockW / 2 - linkEl.offsetWidth / 2) + 'px';
    }
    const cardY = y + sH + stackGap;
    const panelY = cardY + cardH + gapH;

    // what the stage was measured to be, for the debug window
    window.__layout = { W, H, n, stackTopMin, top, avail, hH, sH, diceH, cellH, cardH, panelH, blockH, stackH, stackTop };

    for (let col = 0; col < n; col++) {
        const place = n - 1 - col;              // the highest place stands on the left
        const x = rowX + col * (cardW + 14);
        const flash = flashColor(place);
        const hot = hoverPlace === place;
        // the moment a digit is picked up, every place that cannot hold it goes grey -
        // the answer is there before it is carried anywhere (the Maya calendar's twenties
        // place only runs to 17: 18 x 20 makes the 360 above it)
        const blocked = drag && drag.digit >= sys().limits[place];

        ctx.lineWidth = (flash || hot || colorMode) ? 2 : 1;
        roundRect(x, cardY, cardW, cardH, 16,
            blocked ? 'rgba(255, 255, 255, 0.04)'
                : (hot ? 'rgba(245, 194, 66, 0.10)' : (flash ? 'rgba(121, 158, 49, 0.10)' : COL.fill)),
            blocked ? COL.mute
                : (hot ? COL.glyph : (flash || (colorMode ? placeColor(place) : COL.line))));

        const [dx, dy, dw, dh] = digitBox(x, cardY, cardW, cardH, false);
        BOARD.paintDigit(placeShows(place), dx, dy, dw, dh, place, blocked ? COL.mute : null);

        drawPower(place, x + cardW / 2, cardY + 8);

        cards.push({ place, x, y: cardY, w: cardW, h: cardH });
    }

    // ---- the panel of all digits ----
    const gridX = blockX;

    // with the link set the number lays the board, so the digits are nothing
    // but a key down there - they step back into grey
    const panelCol = flow === 'down' ? COL.mute : null;

    for (let k = 0; k < BOARD.digits; k++) {
        const cx0 = gridX + (k % cols) * cellW;
        const cy0 = panelY + Math.floor(k / cols) * cellH;
        drawCell(k, cx0, cy0, cellW, cellH, panelCol, false);
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = "400 13px 'Outfit', sans-serif";
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText(T('panel', BOARD.panelCaption),
        blockX + blockW / 2, panelY + rows * cellH + 8);

    // the digit being dragged hangs on the finger
    if (drag) {
        ctx.save();
        ctx.globalAlpha = 0.9;
        BOARD.paintDigit(drag.digit, drag.x, drag.y, Math.min(cardW, 150), Math.min(cardH, 130), null);
        ctx.restore();
    }
}

// The upright board: the places stand in a column, the highest on top, and every term of the sum
// stands beside its own place. The digits move beside it, because the column is tall. Nothing is
// rotated - every sign and every word stays heads up.
function drawUpright(rect, W, H) {
    const pad = 16;
    const n = places();

    const diceEl = document.getElementById('board-dice');
    const headEl = document.getElementById('board-head');
    const solEl = document.getElementById('board-solution');
    const linkEl = document.getElementById('board-link');
    if (!diceEl || !headEl || !solEl) return;

    solEl.classList.add('column');
    headEl.classList.add('column');
    if (linkEl) linkEl.classList.add('sideways');

    // five columns from left to right: the digits, the board, its sum, the
    // decimal number and the die - the whole stage turned on its side, but every
    // word, glyph and number still standing upright
    const gap = 18;
    const clamp = (lo, v, hi) => Math.max(lo, Math.min(hi, v));
    const groupW = Math.min(W - 2 * pad, 1500);
    const groupX = (W - groupW) / 2;
    const U = BOARD.upright;
    const panelW = clamp(U.panel[0], groupW * U.panel[1], U.panel[2]);
    const boardW = clamp(U.board[0], groupW * U.board[1], U.board[2]);
    const termW = boardW;                       // the sum box is as wide as the board
    const dieW = clamp(80, groupW * 0.096, 152);   // a fifth narrower than it was
    const numW = clamp(U.num[0], groupW * U.num[1], U.num[2]);

    // everything together, centred on the stage
    const usedW = panelW + boardW + termW + numW + dieW + 4 * gap;
    const groupX2 = (W - usedW) / 2;

    const panelX = groupX2;
    const boardX = panelX + panelW + gap;
    const termX = boardX + boardW + gap;
    const numX = termX + termW + gap;
    const dieX = numX + numW + gap;

    headEl.style.left = numX + 'px';
    headEl.style.width = numW + 'px';
    diceEl.style.left = dieX + 'px';
    diceEl.style.width = dieW + 'px';

    let stackTopMin = 14;
    const brand = document.querySelector('.canvas-branding');
    if (brand) {
        const b = brand.getBoundingClientRect();
        if (b.width && b.left - rect.left < groupX + groupW) {
            stackTopMin = Math.max(stackTopMin, b.bottom - rect.top + 12);
        }
    }

    // number and die stand on the right, halfway up the stage
    headEl.style.top = stackTopMin + 'px';
    const hH = headEl.offsetHeight;
    const midTop = Math.max(stackTopMin, (H - hH) / 2);
    headEl.style.top = midTop + 'px';
    diceEl.style.height = hH + 'px';
    diceEl.style.top = midTop + 'px';
    const titleUp = document.getElementById('lab-title');
    if (titleUp) {
        titleUp.style.left = numX + 'px';
        titleUp.style.width = (numW + gap + dieW) + 'px';
        titleUp.style.top = (midTop - titleUp.offsetHeight - gap) + 'px';
    }

    const colTop = stackTopMin;
    const boardBottom = H - pad;
    const availH = boardBottom - colTop;
    if (availH < 120) return;

    // board, sum and digits start and end on the same lines - flush top and bottom
    const rowGap = 10;
    const cardH = Math.max(40, (availH - (n - 1) * rowGap) / n);
    const boardH = availH;
    const boardTop = colTop;

    if (linkEl) {
        // on the seam between the sum and the number beside it
        linkEl.style.left = (numX - gap / 2 - linkEl.offsetWidth / 2) + 'px';
        linkEl.style.top = (midTop + hH / 2 - linkEl.offsetHeight / 2) + 'px';
    }

    // the sum stands beside the board, one term per place
    solEl.style.left = termX + 'px';
    solEl.style.width = termW + 'px';
    solEl.style.top = boardTop + 'px';
    solEl.style.height = boardH + 'px';
    const rowCenter = (col) => col * (cardH + rowGap) + cardH / 2;
    solEl.querySelectorAll('.board-term').forEach(el => {
        const col = Number(el.dataset.col);
        el.style.top = rowCenter(col) + 'px';
        el.style.left = '0';
        el.style.right = 'auto';
        el.style.color = colorMode ? placeColor(n - 1 - col) : '';
    });
    solEl.querySelectorAll('.board-plus').forEach(el => {
        const g = Number(el.dataset.gap);
        el.style.top = ((rowCenter(g) + rowCenter(g + 1)) / 2) + 'px';
        el.style.left = '0';
        el.style.right = 'auto';
    });

    // the terms take as much type as the box allows: measure the widest one at the
    // stylesheet's size, then scale everything to fit - always from the same base, so
    // the result does not creep from one draw to the next
    solEl.style.fontSize = '';
    let widest = 0;
    solEl.querySelectorAll('.board-term').forEach(el => {
        widest = Math.max(widest, el.scrollWidth);
    });
    if (widest > 0) {
        const base = parseFloat(getComputedStyle(solEl).fontSize) || 18;
        const inner = termW - 32;
        solEl.style.fontSize = clamp(14, base * inner / widest, 40) + 'px';
    }

    // the places, highest on top
    for (let row = 0; row < n; row++) {
        const place = n - 1 - row;
        const y = boardTop + row * (cardH + rowGap);
        const flash = flashColor(place);
        const hot = hoverPlace === place;
        const blocked = drag && drag.digit >= sys().limits[place];

        ctx.lineWidth = (flash || hot || colorMode) ? 2 : 1;
        roundRect(boardX, y, boardW, cardH, 14,
            blocked ? 'rgba(255, 255, 255, 0.04)'
                : (hot ? 'rgba(245, 194, 66, 0.10)' : (flash ? 'rgba(121, 158, 49, 0.10)' : COL.fill)),
            blocked ? COL.mute
                : (hot ? COL.glyph : (flash || (colorMode ? placeColor(place) : COL.line))));

        drawPower(place, boardX + boardW / 2, y + 6);
        const [dx, dy, dw, dh] = digitBox(boardX, y, boardW, cardH, true);
        BOARD.paintDigit(placeShows(place), dx, dy, dw, dh, place, blocked ? COL.mute : null);

        cards.push({ place, x: boardX, y, w: boardW, h: cardH });
    }

    // the digits beside the board, over the whole height - row by row, or column by column
    // when the lab counts down the columns
    const cols = U.cols, rows = BOARD.digits / cols;
    const cellW = panelW / cols;
    const cellH = availH / rows;                 // flush with the board, top and bottom
    const panelTop = colTop;
    const panelCol = flow === 'down' ? COL.mute : null;

    for (let k = 0; k < BOARD.digits; k++) {
        const cx0 = panelX + (U.byColumn ? Math.floor(k / rows) : k % cols) * cellW;
        const cy0 = panelTop + (U.byColumn ? k % rows : Math.floor(k / cols)) * cellH;
        drawCell(k, cx0, cy0, cellW, cellH, panelCol, true);
    }

    if (drag) {
        ctx.save();
        ctx.globalAlpha = 0.9;
        BOARD.paintDigit(drag.digit, drag.x, drag.y, Math.min(boardW, 150), Math.min(cardH, 130), null);
        ctx.restore();
    }

    window.__layout = { modus: 'hochkant', W, H, n, boardW, termW, panelW, cardH, boardH, boardTop };
}

// ------------------------------------------------------------- interaction ---
function inRect(p, r) {
    return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
}

function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
}

// What a message used to say on the stage - the board says it now by flashing,
// so this only goes into the debug window.
function say(text) {
    if (text) dbg(text);
}

function flashPlace(place, color) {
    flashes.push({ place, color: color || COL.ok, until: performance.now() + 900 });
    setTimeout(draw, 950);
}

// Adding beyond the last digit of a place carries into the place above — that is the
// whole point of a place value system, so it gets said out loud.
function addOne(place) {
    handBelow();
    blank = false;
    const lim = sys().limits;
    let k = place;
    digits[k]++;
    while (digits[k] >= lim[k]) {
        if (k + 1 >= digits.length) {
            digits[k] = lim[k] - 1;
            say(T('full', 'Das Brett ist voll — höher geht es hier nicht.'), COL.warn);
            break;
        }
        digits[k] = 0;
        digits[k + 1]++;
        flashPlace(k + 1);
        say(lim[k] + ' × ' + de(sys().values[k]) + ' = ' + de(sys().values[k + 1])
            + ' — ' + T('carry', 'das wandert eine Stelle nach oben.'));
        k++;
    }
    changed();
}

function removeGlyph(g) {
    handBelow();
    digits[g.place] = Math.max(0, digits[g.place] - (g.type === 'bar' ? 5 : 1));
    changed();
}

// A whole digit dropped on a place - a place that rolls over earlier (the Maya calendar's
// twenties place runs to 17) refuses what it cannot hold.
function applyDigit(place, d) {
    const lim = sys().limits[place];
    if (d >= lim) {
        flashPlace(place, COL.warn);
        say(T('too_big', 'Diese Stelle fasst nur bis ') + (lim - 1) + '.', COL.warn);
        draw();
        return false;
    }
    handBelow();
    blank = false;
    digits[place] = d;
    flashPlace(place, COL.ok);
    say('');
    changed();
    return true;
}

// A digit is dragged out of the panel onto a place - that is the one thing the mouse
// does on the board. The places themselves take nothing: no sign on a tap, no sign
// taken away, and while a number is being typed the board is out of play altogether.
canvas.addEventListener('pointerdown', (e) => {
    if (editing) return;
    const p = pos(e);
    const pal = palette.find(h => inRect(p, h));
    if (!pal) return;
    drag = { digit: pal.digit, x: p.x, y: p.y, moved: false };
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { }
    draw();
});

canvas.addEventListener('pointermove', (e) => {
    if (editing || !drag) return;
    const p = pos(e);
    if (Math.abs(p.x - drag.x) > 4 || Math.abs(p.y - drag.y) > 4) drag.moved = true;
    drag.x = p.x;
    drag.y = p.y;
    const card = cards.find(h => inRect(p, h));
    hoverPlace = card ? card.place : null;
    draw();
});

function endDrag(e) {
    if (!drag) return;
    const p = pos(e);
    const card = cards.find(h => inRect(p, h));
    const d = drag.digit;
    drag = null;
    hoverPlace = null;
    if (card) {
        applyDigit(card.place, d);
        dbg('dropped ' + d + ' on place ' + card.place);
    }
    draw();
}

canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', () => { drag = null; hoverPlace = null; draw(); });

// The right button belongs to the lab, not to the browser: it opens the place values
// instead of "Save Image As".
container.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    openSystem();
});

// ------------------------------------------------------------------ readout ---
// The sum stands column by column: every term over its place, every plus over
// the gap between two places. draw() puts them where the cards are.
function renderFormula() {
    const host = document.getElementById('board-formula');
    if (!host) return;
    const n = places();
    let html = '';
    for (let i = 0; i < n; i++) {
        html += '<span class="board-term" data-col="' + i + '"></span>';
        if (i < n - 1) html += '<span class="board-plus" data-gap="' + i + '">+</span>';
    }
    host.innerHTML = html;
    host.querySelectorAll('.board-term').forEach(el => {
        const place = n - 1 - Number(el.dataset.col);
        el.textContent = digits[place] + ' · ' + de(sys().values[place]);
    });
    if (upright) { host.style.height = ''; return; }
    let h = 0;
    host.querySelectorAll('span').forEach(el => { h = Math.max(h, el.offsetHeight); });
    host.style.height = (h || 22) + 'px';
}

// A rolled number does not arrive in one piece: the ones come first, then the tens,
// then the hundreds - each digit rides in from the right, a thousands dot with the
// digit on its left.
function updateHead(animate) {
    const num = document.getElementById('board-num');
    const head = document.getElementById('board-head');
    if (!num || !head) return;
    if (editing) return;              // what is being typed stays where it is
    head.classList.toggle('solved', !!(task && task.done));

    // a task shows its goal, otherwise the number says what lies on the board
    const text = de(flow === 'task' && task ? task.target : value());
    if (!animate && num.dataset.text === text && num.children.length) return;

    num.dataset.text = text;
    num.innerHTML = '';
    const cells = [...text].map(ch => {
        const el = document.createElement('span');
        el.className = 'num-ch cyber-bignum-gold';
        el.textContent = ch;
        if (animate) el.style.display = 'none';   // no placeholder: what is there stays centred
        num.appendChild(el);
        return el;
    });
    if (!animate) return;
    // the last digit lands as the die comes to rest: four digits keep the old
    // 0.5 s / 1.0 s / 1.5 s / 2.0 s, a longer number simply counts in faster
    const nDigits = text.replace(/\D/g, '').length || 1;
    const DIGIT_STEP = Math.max(140, Math.round(ROLL_IN_MS / nDigits));
    let wait = DIGIT_STEP;
    for (let i = cells.length - 1; i >= 0; i--) {
        const el = cells[i];
        setTimeout(() => {
            el.style.display = 'inline-block';
            el.classList.add('rolled-in');
        }, wait);
        if (/[0-9]/.test(el.textContent)) wait += DIGIT_STEP;   // a separator comes along
    }
}

// ------------------------------------------------------------------ typing ---
// The big number can be typed over. Every keystroke rebuilds it as the same gold
// characters - the gradient has to sit on each one, a gradient over the whole line
// leaves ghosts behind - and the caret goes back to the end, where typing runs.
const MAX_TYPED = Math.pow(10, BOARD.typedDigits) - 1;

function renderTyped() {
    const num = document.getElementById('board-num');
    const raw = num.textContent.replace(/\D/g, '').slice(0, BOARD.typedDigits);
    const text = raw === '' ? '' : de(parseInt(raw, 10));
    num.innerHTML = '';
    for (const ch of text) {
        const el = document.createElement('span');
        el.className = 'num-ch cyber-bignum-gold';
        el.textContent = ch;
        num.appendChild(el);
    }
    const sel = window.getSelection();
    const r = document.createRange();
    r.selectNodeContents(num);
    r.collapse(false);
    sel.removeAllRanges();
    sel.addRange(r);

    // typing works on the number above, so the board follows at once
    task = null;
    layout(raw === '' ? 0 : parseInt(raw, 10));
    changed();
}

// One step on the number above - the two triangles on the right and the arrow keys.
// Outside of typing it works just the same: the number is what is being worked on, so
// the arrow turns down and the board follows.
function stepTyped(delta) {
    if (!editing) {
        const shown = (flow === 'task' && task) ? task.target : value();
        const n = Math.min(MAX_TYPED, Math.max(0, shown + delta));
        task = null;
        setFlow('down', true);
        layout(n);
        changed();
        return;
    }
    const num = document.getElementById('board-num');
    const raw = num.textContent.replace(/\D/g, '');
    const n = Math.min(MAX_TYPED, Math.max(0, (raw === '' ? 0 : parseInt(raw, 10)) + delta));
    num.textContent = String(n);
    num.classList.add('no-caret');      // stepped, not typed - the caret stays away
    renderTyped();
    num.focus();
}

function startEdit() {
    const num = document.getElementById('board-num');
    if (!num || editing) return;
    editing = true;
    before = { digits: digits.slice(), task, blank, flow };   // Escape puts this back
    task = null;                  // typing replaces whatever was set
    setFlow('down', true);        // the number is being worked on: it leads now
    document.getElementById('board-head').classList.add('editing');
    updateDice();
    num.classList.remove('no-caret');
    try { num.contentEditable = 'plaintext-only'; } catch (e) { }
    if (num.contentEditable !== 'plaintext-only') num.contentEditable = 'true';
    num.focus();
    // no selection band over the number - the caret simply stands at its end
    const sel = window.getSelection();
    const r = document.createRange();
    r.selectNodeContents(num);
    r.collapse(false);
    sel.removeAllRanges();
    sel.addRange(r);
    say(T('edit_hint', 'Tipp eine Zahl ein — Enter übernimmt sie.'), COL.glyph);
}

// Enter takes the number: it lies down on the board at once, because typing turned
// the arrow down. Escape puts back what was there before.
function endEdit(commit) {
    const num = document.getElementById('board-num');
    if (!num || !editing) return;
    const raw = num.textContent.replace(/\D/g, '');
    editing = false;
    document.getElementById('board-head').classList.remove('editing');
    updateDice();
    num.contentEditable = 'false';
    num.dataset.text = '';           // whatever stands there now, draw it fresh
    try { window.getSelection().removeAllRanges(); } catch (e) { }
    const n = parseInt(raw, 10);
    if (!commit || isNaN(n)) {
        if (before) {
            digits = before.digits;
            task = before.task;
            blank = before.blank;
            setFlow(before.flow, true);
        }
        say('');
        changed();
        return;
    }
    task = null;                 // the board has been following all along
    layout(n);
    say('');
    changed();
}

function changed() {
    updateHead();
    renderFormula();
    // laid by hand and it matches: the task is done, and both sides now agree
    if (task && !task.done && !task.shown && !blank && value() === task.target) {
        task.done = true;
        setFlow('down', true);
        say(T('task_correct', 'Richtig! ') + de(task.target) + T('task_lies', ' liegt auf dem Brett.'));
        for (let i = 0; i < places(); i++) flashPlace(i);
        updateHead();
    }
    draw();
}

// Turn the arrow. keep = something else is doing the laying already, so lay nothing
// here. Turning it down on a task is what shows the answer.
function setFlow(next, keep) {
    flow = next;
    const el = document.getElementById('board-link');
    if (el) {
        el.classList.toggle('down', flow !== 'up');
        el.classList.toggle('pending', flow === 'task');
        el.title = flow === 'task'
            ? T('flow_task', 'Aufgabe — klicken legt die Zahl hin')
            : (flow === 'down'
                ? T('flow_down', 'Oben bestimmt unten — klicken dreht die Richtung um')
                : T('flow_up', 'Unten bestimmt oben — klicken dreht die Richtung um'));
    }
    updateDice();
    if (flow === 'down' && !keep) {
        if (task) {
            task.shown = true;      // shown is shown, this one no longer turns green
            layout(task.target);
            say(T('flow_show', 'Die Zahl liegt jetzt auf dem Brett.'), COL.glyph);
        } else {
            layout(value());        // an empty board fills up: its zeros are laid too
        }
    }
    changed();
}

// One click on the arrow. Grey and pointing down, it lays the number - that is the
// answer. Orange and pointing down, it takes the answer away again: the number stays
// up there, the board is cleared, and that is a task to lay by hand. Pointing up, the
// number lays itself. So the arrow shows and hides the board's picture of what stands above.
function turnFlow() {
    if (flow === 'down') {
        task = { target: value(), done: false };   // the number stays, as the goal
        digits = emptyDigits();
        blank = true;
        setFlow('task', true);
        say(T('flow_hide', 'Weg damit - leg die Zahl selbst.'), COL.glyph);
        return;
    }
    setFlow('down');
}

// whoever acts, leads: anything laid below turns the arrow up, and from then on the
// number says what lies there. A rolled task stays alive in the background - lay it
// right and it still turns green, you just have to keep the number in your head.
function handBelow() {
    if (flow !== 'up') setFlow('up', true);
}

// The die names the number above, so it is awake wherever that number counts: while a
// task stands and while the arrow points down. Pointing up the board leads and the die
// has nothing to say - grey, though a tap still rolls. Typing takes it out altogether.
function updateDice() {
    const el = document.getElementById('board-dice');
    if (!el) return;
    el.classList.toggle('dimmed', flow === 'up' || editing);
    el.classList.toggle('locked', editing);
}

// A roll always fills the top place and fits the places there are. Where the lab wants it
// (Maya), it also has as many decimal digits as there are places - one place 1..9, two 20..99,
// three 360..999, four 7200..9999. Both at once only works while the top place value has
// fewer decimal digits than there are places; beyond that the roll takes what the places hold.
const rollNumber = () => {
    const lo = placeCount === 1 ? 1 : sys().values[placeCount - 1];
    let hi = maxValue(placeCount);
    if (BOARD.rollFitsDecimals) {
        const digitCap = Math.pow(10, placeCount) - 1;
        if (digitCap > lo) hi = Math.min(hi, digitCap);
    }
    return lo + Math.floor(Math.random() * (hi - lo + 1));
};
const ROLL_IN_MS = 2000;     // the number is in when the die stops rolling

// A roll sets a task: the number counts itself in above while the die is still
// tumbling, the board stays empty, and the arrow points down but grey. Laying it is
// yours from here - or one click on the grey arrow and it lays itself.
function newTask(target) {
    const n = target || rollNumber();
    task = { target: n, done: false };
    digits = emptyDigits();
    blank = true;
    setFlow('task', true);
    say(T('task_hint', 'Lege die Zahl - zieh die Ziffern aus dem Panel auf die Stellen.'), COL.glyph);
    changed();
    updateHead(true);                      // ones first, one digit every half second
}

// ------------------------------------------------------------------- popup ---
// The number itself is the field, the die makes the tasks. Only the place value system and the
// arrangement are left, and they live in the popup behind the gear.
function buildUI() {
    // one system alone is no choice - then only its note stands under the heading
    if (Object.keys(BOARD.systems).length > 1) {
        CyberUI.createRadioGroup('board-system', null,
            Object.keys(BOARD.systems).map(k => ({ value: k, label: T('sys_' + k, BOARD.systems[k].label) })),
            sysKey, (v) => {
                sysKey = v;
                store.set('system', v);
                dbg('system ' + v + ': ' + de(value()));
                document.getElementById('board-system-note').textContent = noteFor(v);
                changed();
            });
    }
    document.getElementById('board-system-note').textContent = noteFor(sysKey);

    CyberUI.createRadioGroup('board-arrange', null, [
        { value: 'flat', label: T('arr_flat', BOARD.arrange.flat) },
        { value: 'upright', label: T('arr_upright', BOARD.arrange.upright) }
    ], upright ? 'upright' : 'flat', (v) => {
        upright = v === 'upright';
        store.set('upright', upright ? '1' : '0');
        renderFormula();          // the terms are placed differently in each mode
        init();
    });
    document.getElementById('board-dlg-close').onclick = closeSystem;
    document.getElementById('board-dlg').addEventListener('pointerdown', (e) => {
        if (e.target.id === 'board-dlg') closeSystem();     // a click beside the card closes it
    });

    const numEl = document.getElementById('board-num');
    numEl.addEventListener('pointerdown', (e) => {
        if (!editing) { e.preventDefault(); startEdit(); }
    });
    numEl.addEventListener('input', () => {
        numEl.classList.remove('no-caret');   // a key was pressed, the caret is back
        renderTyped();
    });
    numEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); endEdit(true); }
        else if (e.key === 'Escape') { e.preventDefault(); endEdit(false); }
        else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            stepTyped((e.key === 'ArrowUp' ? 1 : -1) * (e.shiftKey ? 10 : 1));
        }
    });
    numEl.addEventListener('blur', () => endEdit(true));

    document.querySelectorAll('#board-places button').forEach((b) => {
        b.addEventListener('pointerdown', (e) => e.preventDefault());
        b.addEventListener('click', () => setPlaces(placeCount + (b.classList.contains('spin-up') ? 1 : -1)));
    });

    document.querySelectorAll('#board-head > .board-spin:not(.left) button').forEach((b) => {
        // the number has to keep the caret, so the triangle never takes the focus
        b.addEventListener('pointerdown', (e) => e.preventDefault());
        b.addEventListener('click', () => stepTyped(b.classList.contains('spin-up') ? 1 : -1));
    });

    const linkBtn = document.getElementById('board-link');
    linkBtn.onclick = turnFlow;
    setFlow(flow, true);
}

function openSystem() {
    if (editing) endEdit(true);
    document.getElementById('board-dlg').hidden = false;
}

function closeSystem() {
    document.getElementById('board-dlg').hidden = true;
}

function noteFor(key) {
    return T('note_' + key, BOARD.systems[key].note);
}

// ---------------------------------------------------------------------- run ---
function resizeCanvasToContainer() {
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
}

function init() {
    resizeCanvasToContainer();
    draw();
}

window.addEventListener('keydown', (e) => {
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.key === 'Escape' && !document.getElementById('board-dlg').hidden) {
        closeSystem();
        return;
    }
    if (e.key === 'c' || e.key === 'C') {
        colorMode = !colorMode;
        store.set('colour', colorMode ? '1' : '0');
        dbg('colour mode ' + (colorMode ? 'on' : 'off'));
        draw();
    }
});

window.addEventListener('resize', init);

// The left chrome settles a moment after load and the coach box grows with the sum -
// measure the stage again whenever that happens instead of trusting a timeout.
// The branding in the top right corner counts too: the stack stands below it, and it
// grows by about three pixels when Orbitron swaps in. Without watching it, that late
// growth sits in nobody's measurement until the first click redraws - and then the
// whole stage jumps down. It is injected after this script, so wait for it.
if (window.ResizeObserver) {
    new ResizeObserver(() => init()).observe(container);
}

// The stack stands below the branding in the top right corner, and that branding keeps
// moving for a while after load: branding.js throws it away and builds it again, its
// font swaps in, and the left chrome scales it. A ResizeObserver does not catch all of
// that - a transform changes where the thing sits without changing the box it reports.
// So watch the measurement that actually matters until it stops moving. Without this
// the last draw of the load keeps a branding that has since grown, and the whole stage
// jumps down at the first redraw - the first click.
function brandingBottom() {
    const brand = document.querySelector('.canvas-branding');
    if (!brand) return -1;
    const r = brand.getBoundingClientRect();
    return r.width ? Math.round(r.bottom * 100) / 100 : -1;
}

let lastBranding = brandingBottom();
let brandingSteady = 0;
(function settleBranding() {
    const now = brandingBottom();
    if (now !== lastBranding) { lastBranding = now; brandingSteady = 0; init(); }
    else brandingSteady++;
    if (brandingSteady < 15) setTimeout(settleBranding, 100);   // 1.5 s quiet = it stands
})();

window.addEventListener('cyber-left-chrome-zoom', () => init());
window.addEventListener('load', () => init());

buildUI();
// the lab's own controls (a checkbox in its popup section, a key) - the board stands, nothing is drawn yet
if (BOARD.onReady) BOARD.onReady();
// an empty board and the arrow pointing up: lay something and the number counts it,
// or roll and the die names one
blank = true;
say(T('start', 'Zieh Ziffern aus dem Panel auf die Stellen - oder würfle eine Aufgabe.'), COL.glyph);
init();
changed();
document.fonts.ready.then(() => { init(); changed(); });
dbg('lab ready');

// -------------------------------------------------------------------- die ---
// The die of the Würfelspiel, not a copy of it: js/dice3d.js, the same module
// wuerfelspiel.html and wuerfel3d.html use. A tap rolls it and the roll sets a
// new task; dragging turns it (the shared SGI trackball). It needs the page's import map for three.
import(new URL('dice3d.js', BOARD_SCRIPT).href).then(({ DieView, refreshAllFaces }) => {
    // Six faces, ten digits: at every roll the faces are given the next digits of the
    // 0..9 round, while the die tumbles and nobody can read them. So the die shows any
    // digit from 0 to 9, although it only ever carries six at a time.
    const faces = [0, 1, 2, 3, 4, 5];
    let nextDigit = 6;
    // pastel faces, the light style of the Würfelspiel deck
    const tints = ['#FBEBBF', '#E6ECF8', '#DDE8C6', '#F3D2CE', '#CFEAF6', '#F1E3F6'];
    const ROLL_MS = 2000;      // the number counts itself in while the die is still rolling
    const st = { idx: 0, fin: 0, t0: 0 };

    function roll() {
        const target = rollNumber();
        const lead = Number(String(target)[0]);       // the die lands on the leading digit
        st.fin = Math.floor(Math.random() * 6);
        st.t0 = performance.now();
        for (let i = 0; i < faces.length; i++) {
            if (i === st.fin) { faces[i] = lead; continue; }
            while (nextDigit % 10 === lead) nextDigit++;   // no second copy of it on the die
            faces[i] = nextDigit % 10;
            nextDigit++;
        }
        refreshAllFaces();
        newTask(target);
    }

    function source() {
        const now = performance.now();
        const rolling = st.t0 > 0 && now - st.t0 < ROLL_MS;
        if (!rolling && st.t0 > 0) { st.idx = st.fin; st.t0 = 0; }
        return {
            faces, tints,
            idx: rolling ? st.fin : st.idx,
            fin: st.fin,
            rolling,
            p: rolling ? (now - st.t0) / ROLL_MS : 1,
            anim: st.t0
        };
    }

    try {
        const view = new DieView(document.getElementById('die-stage'), { style: 'light', fill: true, source, onTap: roll });
        // the box is as high as the number's box, so a tighter lens is what makes the die big
        view.camera.fov = 24;
        view.camera.updateProjectionMatrix();
    } catch (err) {
        dbg('kein WebGL: ' + err.message);
    }
    document.fonts.load('300px KaTeX_Main').then(refreshAllFaces).catch(() => { });
}).catch((err) => dbg('Würfel nicht geladen: ' + err.message));
