/* js/buch-sw/numerik.js — Swahili for the widgets of js/buch-numerik.js.
 * Loaded by the Swahili editions right after js/buch-numerik.js; the engine and the shared words are in js/buch-sw.js.
 *   word    a whole label → its Swahili
 *   phrase  German sentence pieces exactly as the widget source writes them → Swahili
 *   rule    word order and notation (after the number and point rules of js/buch-sw.js, before its header rules)
 * Intervals the Kenyan (English) way: [0, 2].
 * Terms: tools/buch-sw/istilahi.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang sw
 */
window.BuchSW && BuchSW.add('numerik', {
    word: {
        // book sw-1 mathe11-sw:
        // bisektion, flaeche, mc-flaeche
        'Bisektionsverfahren': 'Mbinu ya kugawanya nusu', 'Intervall halbieren': 'Gawanya muda nusu', '5 Schritte': 'Hatua 5',
        'Schritt': 'Hatua', 'Mitte $m$': 'Katikati $m$', 'Breite': 'Upana',
        'x² auf [0; 2]': 'x² kwenye [0, 2]', '√x auf [0; 4]': '√x kwenye [0, 4]', 'sin x auf [0; π]': 'sin x kwenye [0, π]',
        'Rechtecke links': 'Mistatili ya kushoto', 'Rechtecke Mitte': 'Mistatili ya katikati', 'Trapeze': 'Trapeza', 'Verfahren': 'Mbinu',
        'Anzahl der Streifen $n$': 'Idadi ya vipande $n$', 'Flächeninhalt mit Streifen angenähert': 'Eneo limekadiriwa kwa vipande',
        'Zufallspunkte im Rechteck, Treffer unter der Parabel': 'Nukta za nasibu ndani ya mstatili, zile zilizo chini ya parabola',
        // book sw-3 mathe13-sw:
    },
    phrase: [
        // book sw-1 mathe11-sw:
        // bisektion, flaeche, mc-flaeche
        [' · Startintervall $', ' · muda wa mwanzo $'], ['$ mit $f(', '$ ambapo $f('], ['$ und $f(', '$ na $f('],
        ['Näherung mit $n = ', 'Makadirio kwa $n = '], [' · genauer Wert $', ' · thamani kamili $'], [' · Fehler $', ' · kosa $'],
        ['$ · genauer Wert $', '$ · thamani kamili $'], ['$ · Fehler $', '$ · kosa $'],
        ['$ unter der Parabel. Rechteck: ', '$ ziko chini ya parabola. Mstatili: '],
        ['Schätzwert: $A', 'Makadirio: $A'], [' · genau: $', ' · kamili: $'], ['Wirf Zufallspunkte in das Rechteck ', 'Tupa nukta za nasibu ndani ya mstatili '],
        ['. Der Anteil der Treffer unter ', '. Sehemu ya nukta zilizo chini ya '], [' schätzt den Anteil der Fläche.', ' inakadiria sehemu ya eneo.'],
        // book sw-3 mathe13-sw:
    ],
    rule: [
        // book sw-1 mathe11-sw:
        // the buttons "+1 000 Punkte" (narrow space as the widget writes it, the number rule of js/buch-sw.js has made it
        // "+1,000 Punkte" already) → "Nukta +1,000"
        [/\+([\d,]+) Punkte(?=<|$)/g, 'Nukta +$1'],
        // mc-flaeche "Von $500$ Punkten liegen $160$ unter …" → "Kati ya nukta $500$, $160$ ziko chini ya …"
        [/Von \$(\d+)\$ Punkten liegen \$/g, (m, n) => 'Kati ya nukta $' + n + '$, $'],
        // book sw-3 mathe13-sw:
    ]
});
