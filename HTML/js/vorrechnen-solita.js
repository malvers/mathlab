// Vorrechnen (vorrechnen.html): Solita at the board. Doc, 30.09.2026: "Bau bitte auch hier SolitaDoc ein wie im Lab und
// in den Decks links in die Ecke über der Trennlinie sichtbar für alle". Her picture sits in a button like the board's
// others (Doc: "sie so wie Dr. Hut") - since 30.09. midday in the writing field's bottom left corner, right above the
// arrow that sends the grey step up (Doc: "doch da runter"); a tap opens the central question box (js/solita-frage.js):
// its line to the right of her picture, as her picture leads the line in the decks' presenter, and above it the whole
// talk in ONE bubble, question and answer, as in the decks ("so wie in Decks ... alles in einer Blase (sollen alle
// sehen)"). Solita or Doc: the box's right-click menu (its voices); the corner follows.
// The layer is mirrored to the beamer (SPIEGEL_SCHICHTEN in js/vorrechnen-beamer.js), so the class sees her, the
// question and the answer. With every question she gets the task, the rows on the board, the solution and the task's
// explanation. Only functions here: zeigeRechenweg places the corner (solitaEcke), the beamer gets the mirrored copy.
// One of the classic scripts js/vorrechnen-*.js (one global scope), loaded after js/vorrechnen-werkzeuge.js.

const SOLITA_BILD = { Solita: 'resources/solita-avatar.png', Doc: 'resources/team/alvers_avatar.jpg' };
const SOLITA_SYSTEM = 'DAS LABOR. Im Vorrechnen-Labor rechnet die Klasse an der Tafel vor: Oben steht die Aufgabe, ' +
    'darunter wachsen die Schritte. Jede Zeile hat rechts ihre Nummer in Klammern und grau hinter einem senkrechten Strich ' +
    'die Umformung, die als Nächstes auf sie angewendet wird; das Ergebnis ist doppelt unterstrichen. Die Aufgaben stehen in ' +
    'Blöcken: Gleichungen umstellen in drei Levels, Wurzeln, Ziffernrätsel und Kopfrechentricks ohne Taschenrechner. ' +
    'Deine Antwort sieht die ganze Klasse auf dem Beamer.\n' +
    'SO ANTWORTEST DU. Mit jeder Frage bekommst du die Aufgabe, die Zeilen, die schon an der Tafel stehen, und die ' +
    'Musterlösung. Erkläre den Schritt, nach dem gefragt wird, gründlicher und langsamer als die Tafel, mit konkreten ' +
    'Zahlen. Verrate keine Schritte, die noch nicht an der Tafel stehen, und nicht das Ergebnis – außer jemand fragt ' +
    'ausdrücklich danach; gib lieber einen Tipp für den nächsten Schritt. Höchstens sechs Sätze.';

let solita = null, solitaAufgabe = null;
const ohneText = s => String(s).replace(/\\text\{([^}]*)\}/g, '$1');

// what is on the board right now - it travels with every question
function solitaKontext() {
    if (!aufgabenModus) {
        return 'Freies Rechnen an der Tafel, ohne Aufgabe aus den Blöcken. ' + (rechenweg.length
            ? 'An der Tafel stehen diese Zeilen:\n' + rechenweg.map((e, i) => '(' + (i + 1) + ') $' + e.latex + '$').join('\n')
            : 'An der Tafel steht noch nichts.');
    }
    const [slug, tex, nach] = AUFGABEN[aufgabeIdx], b = aufgabenBlock(aufgabeIdx), l = LOESUNGEN[slug] || [];
    const teile = [
        'Block „' + b.titel + '“, Aufgabe ' + (aufgabeIdx - b.ab + 1) + ' von ' + (b.bis - b.ab) + '.',
        'Die Aufgabe: $' + tex + '$ – ' + (aufgabenKopf(tex, nach, KOEPFE[slug] || b.kopf) || 'umstellen nach $' + nach + '$') + '.',
    ];
    if (QUELLEN[slug]) teile.push(QUELLEN[slug] + '.');
    teile.push(rechenweg.length
        ? 'An der Tafel stehen schon diese Zeilen:\n' + rechenweg.map((e, i) => '(' + (i + 1) + ') $' + e.latex + '$').join('\n')
        : 'An der Tafel steht noch kein Schritt, nur die Aufgabe.');
    if (l.length) teile.push('Die Musterlösung (nur für dich), jeder Schritt mit der Umformung, die zu ihm führt:\n' +
        l.map((s, i) => (i + 1) + '. $' + s[0] + '$ (' + ohneText(s[1]) + ')').join('\n'));
    if (ERKLAERUNGEN[slug]) teile.push('Die Erklärung zur Aufgabe: ' + ERKLAERUNGEN[slug]);
    return teile.join('\n\n');
}

function solitaSchicht() {
    let s = document.getElementById('solita-schicht');
    if (s) return s;
    s = document.createElement('div');
    s.id = 'solita-schicht';
    s.innerHTML =
        '<div class="vs-karte" role="dialog" aria-label="Frag Solita"><div class="vs-sf"></div></div>' +
        '<button type="button" class="vs-knopf" id="solita-knopf" title="Frag Solita" aria-label="Frag Solita" aria-expanded="false">' +
        '<img alt="" src="' + SOLITA_BILD.Solita + '"></button>';
    container.appendChild(s);
    const knopf = s.querySelector('.vs-knopf');
    // Solita or Doc - the corner shows who answers; heard before the box is built, which says it once at the start
    document.addEventListener('solita-wer', e => {
        const img = knopf.querySelector('img'), wer = e.detail && e.detail.name === 'Doc' ? 'Doc' : 'Solita';
        img.src = SOLITA_BILD[wer];
        knopf.title = 'Frag ' + wer;
        knopf.setAttribute('aria-label', 'Frag ' + wer);
    });
    if (window.SolitaFrage) {
        solita = SolitaFrage.mount(s.querySelector('.vs-sf'), {
            kontext: solitaKontext, system: SOLITA_SYSTEM, platzhalter: 'Frag {name} zur Aufgabe',   // no heading, no chips
            blase: true,                 // question and answer in one bubble, as in the decks (30.09.)
            // a spoken question sends itself after 2 s of quiet, as in the decks (Doc, 30.09.2026: "Ja, nach zwei
            // Sekunden Stille abschicken") - it waited in the field for Enter
            mic: { stille: 2000, selbst: true },
            beiEscape: () => solitaOffen(false),   // Esc in the field closes her line - the field keeps its keys to itself
        });
        // the beamer shows the part of her answers Doc scrolled to (anzeigeEmpfang reads data-scroll)
        const out = s.querySelector('.sf-out');
        if (out) out.addEventListener('scroll', () => { out.dataset.scroll = String(Math.round(out.scrollTop)); }, { passive: true });
    }
    // a click or tap opens her line, and with the line open switches between Solita and Doc - the box does it, as in the
    // decks (Doc, 30.09.2026: "click auf Avatar switch Doc Solita (zentral bitte)"). Esc closes. Without the box the
    // button still opens and closes.
    if (solita) solita.bild(knopf, { offen: () => s.classList.contains('offen'), oeffnen: () => solitaOffen(true) });
    else knopf.addEventListener('click', () => solitaOffen(!s.classList.contains('offen')));
    // Space is the mic's key, the box's own (Doc, 30.09.2026: "shift Space Mic (zentral bitte wie im Deck)", then
    // "nur mit Space"): it opens her line first; not under a dialog (the tasks' panel, the buzzer, the Tafel)
    if (solita) solita.sprechtaste({
        offen: () => s.classList.contains('offen'), oeffnen: () => solitaOffen(true), innen: s,
        wenn: () => !document.querySelector('.cyber-overlay.open'),
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && s.classList.contains('offen')) solitaOffen(false); });
    return s;
}
function solitaOffen(auf) {
    const s = solitaSchicht();
    s.classList.toggle('offen', auf);
    s.querySelector('.vs-knopf').setAttribute('aria-expanded', String(auf));
    if (auf) { const i = s.querySelector('.sf-in'); if (i) i.focus({ preventScroll: true }); }
    else if (solita) solita.stop();
}
// the corner (called by zeigeRechenweg, which the beamer skips): her line reaches up to the notes' column on the right
// (--vs-platz, js/vorrechnen.css) and her answers up to the line above the writing field (--vs-feld: the field's
// height); a new task starts a new talk
function solitaEcke() {
    if (anzeigeModus) return;
    const s = solitaSchicht();
    const r = container.getBoundingClientRect();
    const platz = Math.round(notizX(r.width)) + 'px';
    if (s.style.getPropertyValue('--vs-platz') !== platz) s.style.setProperty('--vs-platz', platz);
    const feld = Math.round(r.height - papierGrenze(r.height)) + 'px';
    if (s.style.getPropertyValue('--vs-feld') !== feld) s.style.setProperty('--vs-feld', feld);
    const aufgabe = aufgabenModus ? AUFGABEN[aufgabeIdx][0] : null;
    if (aufgabe !== solitaAufgabe) {
        if (solitaAufgabe !== null && solita) solita.leeren();
        solitaAufgabe = aufgabe;
    }
}
