/* js/buch-it/numerik.js — Italian for the widgets of js/buch-numerik.js.
 * Loaded by the Italian editions right after js/buch-numerik.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Package IT0 (18.10.2026) put in only the block comments; every book writes only below its own comment line, each entry ending
 * with a comma, so the three books merge without a conflict. The Spanish file js/buch-es/numerik.js shows which German
 * strings the widgets write.
 * Round 2 (20.10.2026): six books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 */
window.BuchIT && BuchIT.add('numerik', {
    word: {
        // book it-1 mathe11-it:
        // bisektion, flaeche, mc-flaeche
        'Bisektionsverfahren': 'Metodo di bisezione', 'Intervall halbieren': 'Dimezza l’intervallo', '5 Schritte': '5 passi',
        'Schritt': 'Passo', 'Mitte $m$': 'Punto medio $m$', 'Breite': 'Larghezza',
        'x² auf [0; 2]': 'x² in [0, 2]', '√x auf [0; 4]': '√x in [0, 4]', 'sin x auf [0; π]': 'sin x in [0, π]',
        'Rechtecke links': 'Rettangoli a sinistra', 'Rechtecke Mitte': 'Rettangoli al centro', 'Trapeze': 'Trapezi', 'Verfahren': 'Metodo',
        'Anzahl der Streifen $n$': 'Numero di strisce $n$', 'Flächeninhalt mit Streifen angenähert': 'Area approssimata con strisce',
        '+100 Punkte': '+100 punti', '+1\u202f000 Punkte': '+1\u202f000 punti', '+10\u202f000 Punkte': '+10\u202f000 punti',   // narrow space as the widget writes it
        'Zufallspunkte im Rechteck, Treffer unter der Parabel': 'Punti casuali nel rettangolo, centri sotto la parabola',
        // book it-2 mathe12-it:
        // book it-3 mathe13-it:
        'x² auf [0; 2]': 'x² in [0, 2]',
        '√x auf [0; 4]': '√x in [0, 4]',
        'sin x auf [0; π]': 'sin x in [0, π]',
        'Rechtecke links': 'Rettangoli a sinistra',
        'Rechtecke Mitte': 'Rettangoli punto medio',
        'Trapeze': 'Trapezi',
        'Verfahren': 'Metodo',
        'Anzahl der Streifen $n$': 'Numero di strisce $n$',
        'Flächeninhalt mit Streifen angenähert': 'Area approssimata con strisce',
        // book it-5 mathefos12-it:

        // book it-6 mathegy11-it:

        // book it-7 mathegy11lk-it:

        // book it-8 mathegy12-it:

        // book it-9 mathegy12lk-it:
    },
    phrase: [
        // book it-1 mathe11-it:
        // bisektion, flaeche, mc-flaeche
        [' · Startintervall $', ' · intervallo iniziale $'], ['$ mit $f(', '$ con $f('], ['$ und $f(', '$ e $f('],
        ['Näherung mit $n = ', 'Approssimazione con $n = '], [' · genauer Wert $', ' · valore esatto $'], [' · Fehler $', ' · errore $'],
        ['$ · genauer Wert $', '$ · valore esatto $'], ['$ · Fehler $', '$ · errore $'],
        ['$ unter der Parabel. Rechteck: ', '$ cadono sotto la parabola. Rettangolo: '],
        ['Schätzwert: $A', 'Stima: $A'], [' · genau: $', ' · esatto: $'], ['Wirf Zufallspunkte in das Rechteck ', 'Lancia punti casuali nel rettangolo '],
        ['. Der Anteil der Treffer unter ', '. La frazione di centri sotto '], [' schätzt den Anteil der Fläche.', ' stima la frazione dell’area.'],
        // book it-2 mathe12-it:
        // book it-3 mathe13-it:
        ['Näherung mit $n = ', 'Approssimazione con $n = '],
        ['$ · genauer Wert $', '$ · valore esatto $'],
        [' · genauer Wert $', ' · valore esatto $'],
        ['$ · Fehler $', '$ · errore $'],
        [' · Fehler $', ' · errore $'],
        // book it-5 mathefos12-it:

        // book it-6 mathegy11-it:

        // book it-7 mathegy11lk-it:

        // book it-8 mathegy12-it:

        // book it-9 mathegy12lk-it:
    ],
    rule: [
        // book it-1 mathe11-it:
        // mc-flaeche "Von $500$ Punkten liegen $160$ unter …" → "Di $500$ punti, $160$ cadono sotto …"
        [/Von \$(\d+)\$ Punkten liegen \$/g, (m, n) => 'Di $' + n + '$ punti, $'],
        // book it-2 mathe12-it:
        // book it-3 mathe13-it:
        // book it-5 mathefos12-it:

        // book it-6 mathegy11-it:

        // book it-7 mathegy11lk-it:

        // book it-8 mathegy12-it:

        // book it-9 mathegy12lk-it:
    ]
});
