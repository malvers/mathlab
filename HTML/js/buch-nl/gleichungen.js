/* js/buch-nl/gleichungen.js — Dutch for the widgets of js/buch-gleichungen.js.
 * Loaded by the Dutch editions right after js/buch-gleichungen.js; the engine and the shared words are in js/buch-nl.js.
 *   word    a whole label → its Dutch
 *   phrase  German sentence pieces exactly as the widget source writes them → Dutch
 *   rule    word order and notation (after the point rules of js/buch-nl.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3 (08.11.2026): what every book needs goes below the nl0 line, what one book needs below its own comment
 * line, every entry ending with a comma. Search the dictionaries before writing a string (grep -n "<German>" HTML/js/buch-nl/*.js).
 * Terms: tools/buch-nl/woordenlijst.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang nl
 */
window.BuchNL && BuchNL.add('gleichungen', {
    word: {
        // nl0: the helpers of the module (outside every widget; check.mjs gleichungen/*)
        // book nl-1 mathe11-nl:
        // waage, binom, koerper
        'z. B. −3 oder :4 oder −2x': 'bijv. −3 of :4 of −2x', 'Anwenden': 'Toepassen', 'Neue Gleichung': 'Nieuwe vergelijking',
        'Länge $a$': 'Lengte $a$', 'Länge $b$': 'Lengte $b$', 'Quadrat mit Seitenlänge a + b': 'Vierkant met zijde a + b',
        'Zylinder': 'Cilinder', 'Kegel': 'Kegel', 'Kugel': 'Bol', 'Körper': 'Ruimtefiguur', 'Radius $r$ in cm': 'Straal $r$ in cm',
        'Höhe $h$ in cm': 'Hoogte $h$ in cm', 'Skizze des Körpers': 'Schets van de ruimtefiguur',
    },
    phrase: [
        // nl0: the helpers of the module (outside every widget; check.mjs gleichungen/*)
        // book nl-1 mathe11-nl:
        // waage
        ['Gelöst: $x = ', 'Opgelost: $x = '], ['$. Mach die Probe: Setz den Wert in die erste Zeile ein.', '$. Controleer: vul de waarde in in de eerste regel.'],
        ['Beide Seiten sind gleich: Jede Zahl ist Lösung, ', 'Beide kanten zijn gelijk: elk getal is een oplossing, '],
        ['Widerspruch: Es gibt keine Lösung, ', 'Tegenspraak: er is geen oplossing, '],
        ['Schreib die Umformung, die du auf <b>beide</b> Seiten anwenden willst.', 'Schrijf de bewerking die je op <b>beide</b> kanten wilt toepassen.'],
        ['Das verstehe ich nicht. Beispiele: ', 'Dat begrijp ik niet. Voorbeelden: '], ['Hinter dem Rechenzeichen fehlt eine Zahl.', 'Achter het rekenteken ontbreekt een getal.'],
        ['Mit $x$ multiplizieren oder durch $x$ teilen ist keine sichere Umformung, $x$ könnte $0$ sein.', 'Vermenigvuldigen met $x$ of delen door $x$ is geen veilige bewerking, $x$ zou $0$ kunnen zijn.'],
        ['Durch $0$ darf man nicht teilen.', 'Door $0$ mag je niet delen.'],
        ['Mit $0$ multiplizieren macht aus jeder Gleichung $0 = 0$, dabei geht die Information verloren.', 'Vermenigvuldigen met $0$ maakt van elke vergelijking $0 = 0$, en dan gaat de informatie verloren.'],
        ['Bring alle $x$ auf eine Seite: ', 'Breng alle $x$ naar één kant: '], ['Bring die Zahl auf die andere Seite: ', 'Breng het getal naar de andere kant: '],
        ['Teile durch die Zahl vor dem $x$: ', 'Deel door het getal voor de $x$: '],
        // binom, koerper
        ['Der häufigste Fehler: ', 'De meest gemaakte fout: '], ['. Im Bild fehlen dann die beiden blauen Rechtecke, hier ', '. In het plaatje ontbreken dan de twee blauwe rechthoeken, hier '],
        ['Mantellinie $s = ', 'Apothema $s = '],
    ],
    rule: [
        // nl0: notation of the module, for every book
        [/\$L = (?=\\mathbb\{R\}|\\\{)/g, '$V = '],
        // book nl-1 mathe11-nl:
    ]
});
