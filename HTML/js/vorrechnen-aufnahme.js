// Vorrechnen (vorrechnen.html): recording a lesson's handwriting, for the live tour (tours/vorrechnen.js).
// Doc, 03.10.2026: the tour shall write with his own hand, not with painted strokes - "ich hole dann das HP, damit ich
// dann mit dem Stift schreiben kann", and since the HP has no server of ours: "du packst es ins Download und ich
// schicke mir das per E-Mail". Only with ?aufnahme in the address (vorrechnen.html?aufgaben=einmaleins&aufnahme):
// every line swiped up (rechenwegHoch) is kept with its strokes, the task and the step it becomes, on this device
// (localStorage, a reload keeps it). SPEICHERN downloads all of it as one JSON file; NEU starts over (two taps).
// Nothing is sent anywhere. The bar sits outside the board, so the beamer never shows it.
// One of the classic scripts js/vorrechnen-*.js (one global scope), loaded after js/vorrechnen-flug.js.

const AUFNAHME = new URLSearchParams(location.search).has('aufnahme');
const AUFNAHME_KEY = 'vorrechnen-aufnahme';
let aufnahme = [];
if (AUFNAHME) {
    try { aufnahme = JSON.parse(localStorage.getItem(AUFNAHME_KEY) || '[]'); } catch (_) { aufnahme = []; }
}

// called by rechenwegHoch with the lines about to go up, while their strokes are still on the page
function aufnahmeZeilen(zeilen) {
    if (!AUFNAHME || anzeigeModus) return;
    const r = canvas.getBoundingClientRect();
    const aufgabe = aufgabenModus && AUFGABEN[aufgabeIdx] ? AUFGABEN[aufgabeIdx] : null;
    zeilen.forEach((l, k) => {
        const idxs = [...new Set(l.symbols.flatMap(sy => sy.strokeIdxs))].sort((a, b) => a - b);
        const erg = zeilenErgebnis[l.lineIdx];
        aufnahme.push({
            zeit: new Date().toISOString(),
            aufgabe: aufgabe ? aufgabe[0] : null,         // the task's slug (AUFGABEN)
            formel: aufgabe ? aufgabe[1] : null,
            schritt: rechenweg.length + k,               // the step this line becomes (0 = the first under the task)
            latex: erg && erg.latex || null,              // recognised already, if it was
            flaeche: { w: Math.round(r.width), h: Math.round(r.height), zeile: ZEILE, dpr: devicePixelRatio },
            // as the page keeps them: x, y in the canvas' CSS px, t in ms (performance.now)
            striche: idxs.map(i => ({ width: strokes[i].width, farbe: strokes[i].farbe, pointerType: strokes[i].pointerType,
                points: strokes[i].points.map(q => ({ x: Math.round(q.x * 10) / 10, y: Math.round(q.y * 10) / 10, t: Math.round(q.t) })) }))
        });
    });
    aufnahmeMerken();
}

function aufnahmeMerken() {
    try { localStorage.setItem(AUFNAHME_KEY, JSON.stringify(aufnahme)); } catch (_) { /* full: the download still has it */ }
    aufnahmeLeiste();
}

function aufnahmeSpeichern() {
    const data = { version: 1, erstellt: new Date().toISOString(), geraet: navigator.userAgent, zeilen: aufnahme };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'vorrechnen-aufnahme-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// the bar: a red dot, how many lines, SPEICHERN, NEU (a second tap within 3 s empties it)
let aufnahmeNeuScharf = null;
function aufnahmeLeiste() {
    if (!AUFNAHME || anzeigeModus) return;
    let el = document.getElementById('aufnahme-leiste');
    if (!el) {
        el = document.createElement('div');
        el.id = 'aufnahme-leiste';
        el.setAttribute('role', 'group');
        el.setAttribute('aria-label', 'Aufnahme der Handschrift');
        el.innerHTML = '<span class="an-punkt" aria-hidden="true"></span><span class="an-zahl"></span>' +
            '<button type="button" class="an-speichern">SPEICHERN</button><button type="button" class="an-neu">NEU</button>';
        document.body.appendChild(el);
        el.querySelector('.an-speichern').addEventListener('click', aufnahmeSpeichern);
        el.querySelector('.an-neu').addEventListener('click', () => {
            const b = el.querySelector('.an-neu');
            if (!aufnahmeNeuScharf) {
                b.textContent = 'WIRKLICH?';
                aufnahmeNeuScharf = setTimeout(() => { aufnahmeNeuScharf = null; b.textContent = 'NEU'; }, 3000);
                return;
            }
            clearTimeout(aufnahmeNeuScharf);
            aufnahmeNeuScharf = null;
            b.textContent = 'NEU';
            aufnahme = [];
            aufnahmeMerken();
        });
    }
    const n = aufnahme.length;
    el.querySelector('.an-zahl').textContent = 'AUFNAHME · ' + n + (n === 1 ? ' ZEILE' : ' ZEILEN');
    el.querySelector('.an-speichern').disabled = !n;
}

if (AUFNAHME) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', aufnahmeLeiste, { once: true });
    else aufnahmeLeiste();
}
