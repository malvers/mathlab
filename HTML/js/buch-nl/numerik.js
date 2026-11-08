/* js/buch-nl/numerik.js — Dutch for the widgets of js/buch-numerik.js.
 * Loaded by the Dutch editions right after js/buch-numerik.js; the engine and the shared words are in js/buch-nl.js.
 *   word    a whole label → its Dutch
 *   phrase  German sentence pieces exactly as the widget source writes them → Dutch
 *   rule    word order and notation (after the point rules of js/buch-nl.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3 (08.11.2026): what every book needs goes below the nl0 line, what one book needs below its own comment
 * line, every entry ending with a comma. Search the dictionaries before writing a string (grep -n "<German>" HTML/js/buch-nl/*.js).
 * Terms: tools/buch-nl/woordenlijst.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang nl
 */
window.BuchNL && BuchNL.add('numerik', {
    word: {
        // nl0: the helpers of the module (outside every widget; check.mjs numerik/*)
        // book nl-1 mathe11-nl:
        // bisektion, flaeche, mc-flaeche (intervals the Dutch way: [0, 2])
        'Bisektionsverfahren': 'Bisectiemethode', 'Intervall halbieren': 'Interval halveren', '5 Schritte': '5 stappen',
        'Schritt': 'Stap', 'Mitte $m$': 'Midden $m$', 'Breite': 'Breedte',
        'x² auf [0; 2]': 'x² op [0, 2]', '√x auf [0; 4]': '√x op [0, 4]', 'sin x auf [0; π]': 'sin x op [0, π]',
        'Rechtecke links': 'Rechthoeken links', 'Rechtecke Mitte': 'Rechthoeken midden', 'Trapeze': 'Trapezia', 'Verfahren': 'Methode',
        'Anzahl der Streifen $n$': 'Aantal stroken $n$', 'Flächeninhalt mit Streifen angenähert': 'Oppervlakte benaderd met stroken',
        'Zufallspunkte im Rechteck, Treffer unter der Parabel': 'Willekeurige punten in de rechthoek, treffers onder de parabool',
    },
    phrase: [
        // nl0: the helpers of the module (outside every widget; check.mjs numerik/*)
        // book nl-1 mathe11-nl:
        [' · Startintervall $', ' · startinterval $'], ['$ mit $f(', '$ met $f('], ['$ und $f(', '$ en $f('],
        ['Näherung mit $n = ', 'Benadering met $n = '], [' · genauer Wert $', ' · precieze waarde $'], [' · Fehler $', ' · fout $'],
        ['$ · genauer Wert $', '$ · precieze waarde $'], ['$ · Fehler $', '$ · fout $'],
        ['$ unter der Parabel. Rechteck: ', '$ onder de parabool. Rechthoek: '],
        ['Schätzwert: $A', 'Schatting: $A'], [' · genau: $', ' · precies: $'], ['Wirf Zufallspunkte in das Rechteck ', 'Gooi willekeurige punten in de rechthoek '],
        ['. Der Anteil der Treffer unter ', '. Het aandeel treffers onder '], [' schätzt den Anteil der Fläche.', ' schat het aandeel van de oppervlakte.'],
    ],
    rule: [
        // nl0: notation of the module, for every book
        // book nl-1 mathe11-nl:
        // the buttons "+1 000 Punkte" → "+1.000 punten"
        [/\+([\d.\u00a0\u202f ]+) Punkte(?=<|$)/g, '+$1 punten'],
        // mc-flaeche "Von $500$ Punkten liegen $160$ unter …" → "Van de $500$ punten liggen er $160$ onder …"
        [/Von \$(\d+)\$ Punkten liegen \$/g, (m, n) => 'Van de $' + n + '$ punten liggen er $'],
    ]
});
