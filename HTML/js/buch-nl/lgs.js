/* js/buch-nl/lgs.js — Dutch for the widgets of js/buch-lgs.js.
 * Loaded by the Dutch editions right after js/buch-lgs.js; the engine and the shared words are in js/buch-nl.js.
 *   word    a whole label → its Dutch
 *   phrase  German sentence pieces exactly as the widget source writes them → Dutch
 *   rule    word order and notation (after the point rules of js/buch-nl.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3 (08.11.2026): what every book needs goes below the nl0 line, what one book needs below its own comment
 * line, every entry ending with a comma. Search the dictionaries before writing a string (grep -n "<German>" HTML/js/buch-nl/*.js).
 * Terms: tools/buch-nl/woordenlijst.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang nl
 */
window.BuchNL && BuchNL.add('lgs', {
    word: {
        // nl0: the helpers of the module (outside every widget; check.mjs lgs/*)
        // book nl-1 mathe11-nl:
        // gauss, geraden, matrizen, pagerank (a line of the system is "rij" I, II, III, as in lb4)
        'Ausführen': 'Uitvoeren', 'Nächster Schritt': 'Volgende stap', 'Neues LGS': 'Nieuw stelsel',
        'Zeile + k · Zeile': 'rij + k · rij', 'Zeile · k': 'rij · k', 'tauschen': 'verwisselen', 'Zielzeile': 'Doelrij', 'zweite Zeile': 'Tweede rij', 'Faktor k': 'Factor k',
        'Ziel I': 'doel I', 'Ziel II': 'doel II', 'Ziel III': 'doel III', 'mit I': 'met I', 'mit II': 'met II', 'mit III': 'met III',
        'eine Lösung': 'één oplossing', 'keine Lösung': 'geen oplossing', 'unendlich viele': 'oneindig veel', 'Zwei Geraden': 'Twee lijnen',
        'mit $r =$': 'met $r =$', 'Neue Matrizen': 'Nieuwe matrices', 'Wähle eine Rechnung.': 'Kies een berekening.',
        '1 Schritt': '1 stap', '10 Schritte': '10 stappen', 'Vier Webseiten und ihre Links': 'Vier webpagina\u2019s en hun links',
        // book nl-3 mathe13-nl:
    },
    phrase: [
        // nl0: the helpers of the module (outside every widget; check.mjs lgs/*)
        // book nl-1 mathe11-nl:
        ['Fertig: $x = ', 'Klaar: $x = '],
        ['Stufenform erreicht. Jetzt kannst du von unten nach oben einsetzen oder mit „Nächster Schritt“ weiter umformen (Gauß-Jordan).',
            'Trapvorm bereikt. Nu kun je van onder naar boven invullen of met „Volgende stap” verder vegen (Gauss-Jordan).'],
        ['Wähle eine Umformung und führe sie aus, oder lass dir mit „Nächster Schritt“ helfen.', 'Kies een bewerking en voer haar uit, of laat je helpen met „Volgende stap”.'],
        ['Wähle zwei verschiedene Zeilen.', 'Kies twee verschillende rijen.'], ['Gib für $k$ eine Zahl ein, z. B. -2 oder 1/3.', 'Voer voor $k$ een getal in, bijv. -2 of 1/3.'],
        ['Mit $0$ multiplizieren ist keine Äquivalenzumformung.', 'Vermenigvuldigen met $0$ is geen equivalente bewerking.'],
        ['Eine Zeile zu sich selbst zu addieren ändert die Lösungsmenge. Wähle eine andere Zeile.', 'Een rij bij zichzelf optellen verandert de oplossingsverzameling. Kies een andere rij.'],
        ['Gleichung I ist fest: ', 'Vergelijking I ligt vast: '], ['. Verändere Gleichung II: ', '. Verander vergelijking II: '],
        ['Gleichung II lautet $0 = 0$, sie schränkt nichts ein.', 'Vergelijking II luidt $0 = 0$, ze legt niets vast.'], ['Gleichung II lautet $0 = ', 'Vergelijking II luidt $0 = '],
        ['$: ein Widerspruch, keine Lösung.', '$: een tegenspraak, geen oplossing.'],
        ['<b>Genau eine Lösung</b>: Die Geraden schneiden sich in $S(', '<b>Precies één oplossing</b>: de lijnen snijden elkaar in $S('],
        ['<b>Unendlich viele Lösungen</b>: Beide Gleichungen beschreiben dieselbe Gerade.', '<b>Oneindig veel oplossingen</b>: beide vergelijkingen beschrijven dezelfde lijn.'],
        ['<b>Keine Lösung</b>: Die Geraden sind parallel und verschieden.', '<b>Geen oplossing</b>: de lijnen zijn evenwijdig en verschillend.'],
        ['Gleiche Stellen werden addiert.', 'Elementen op dezelfde plaats worden opgeteld.'], ['Gleiche Stellen werden subtrahiert.', 'Elementen op dezelfde plaats worden afgetrokken.'],
        ['Jeder Eintrag wird mit $r$ multipliziert.', 'Elk element wordt met $r$ vermenigvuldigd.'],
        ['Aus Zeilen werden Spalten: aus einer $2 \\times 3$- wird eine $3 \\times 2$-Matrix.', 'Rijen worden kolommen: van een $2 \\times 3$-matrix wordt een $3 \\times 2$-matrix.'],
        ['Summe: $', 'Som: $'],
        // book nl-3 mathe13-nl:
    ],
    rule: [
        // nl0: notation of the module, for every book
        // book nl-1 mathe11-nl:
        [/In Spalte (\d) gibt es keinen Pivot mehr: Das LGS hat keine oder unendlich viele Lösungen\./g,
            'In kolom $1 is er geen spil meer: het stelsel heeft geen of oneindig veel oplossingen.'],
        [/Schritt (\d+):/g, 'Stap $1:'],
        // book nl-3 mathe13-nl:
    ]
});
