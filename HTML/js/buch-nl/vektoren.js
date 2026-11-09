/* js/buch-nl/vektoren.js — Dutch for the widgets of js/buch-vektoren.js.
 * Loaded by the Dutch editions right after js/buch-vektoren.js; the engine and the shared words are in js/buch-nl.js.
 *   word    a whole label → its Dutch
 *   phrase  German sentence pieces exactly as the widget source writes them → Dutch
 *   rule    word order and notation (after the point rules of js/buch-nl.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package nl2-prep (08.11.2026): the module's helpers (outside every widget) go below the nl0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-nl/*.js).
 * Terms: tools/buch-nl/woordenlijst.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang nl
 */
window.BuchNL && BuchNL.add('vektoren', {
    word: {
        // nl0: the helpers of the module (outside every widget; check.mjs vektoren/*)
        // book nl-2 mathe12-nl:
        // the 3D stage and the coordinate inputs: Vektor = vector, Punkt = punt, points with commas as in Dutch schools, also the
        // bars between the inputs "( 2 | -1 | 1 )"
        'Räumliches Koordinatensystem': 'Assenstelsel in de ruimte', 'Ziehen zum Drehen': 'Sleep om te draaien', 'Beispiele:': 'Voorbeelden:', '|': ',',
        // raum-hero, raum3d (lb5-1): Ortsvektor = plaatsvector, Verbindungsvektor = verbindingsvector, Betrag = lengte,
        // Mittelpunkt = midden M, Nullvektor = nulvector, Vielfaches = veelvoud
        'Räumliches Koordinatensystem mit einem Punkt und seinem Ortsvektor': 'Assenstelsel in de ruimte met een punt en zijn plaatsvector',
        'Punkte und Verbindungsvektor': 'Punten en verbindingsvector', 'Summe und Differenz': 'Som en verschil', 'Vielfaches': 'Veelvoud',
        'Was wird gezeigt?': 'Wat wordt er getoond?', 'Mittelpunkt M zeigen': 'Midden M tonen', 'Summe oder Differenz': 'Som of verschil',
        'Faktor $r$': 'Factor $r$',
        // skalarprodukt, viereck3d (lb5-2): Skalarprodukt = inproduct (written a · b, rule below), orthogonal = loodrecht, spitz /
        // stumpf = scherp / stomp, Raute = ruit, Viereck = vierhoek
        'spitzer Winkel': 'scherpe hoek', 'orthogonal': 'loodrecht', 'stumpfer Winkel': 'stompe hoek', 'parallel': 'evenwijdig',
        'Parallelogramm': 'Parallellogram', 'Rechteck': 'Rechthoek', 'Raute': 'Ruit', 'Quadrat': 'Vierkant', 'Trapez': 'Trapezium',
        // book nl-3 mathe13-nl:
    },
    phrase: [
        // nl0: the helpers of the module (outside every widget; check.mjs vektoren/*)
        // book nl-2 mathe12-nl:
        // raum3d
        ['Ortsvektoren $\\vec{OA} = ', 'Plaatsvectoren $\\vec{OA} = '], ['$ · Verbindungsvektor $\\vec{AB}', '$ · verbindingsvector $\\vec{AB}'],
        ['Länge: $|\\vec{AB}|', 'Lengte: $|\\vec{AB}|'],
        ['Mittelpunkt: $\\vec{OM} = \\tfrac12\\,(\\vec{OA} + \\vec{OB})$, also $', 'Midden: $\\vec{OM} = \\tfrac12\\,(\\vec{OA} + \\vec{OB})$, dus $'],
        ['Subtrahieren heißt: den Gegenvektor $-\\vec{b}$ anhängen.', 'Aftrekken betekent: de tegengestelde vector $-\\vec{b}$ erachter zetten.'],
        ['Addieren heißt: $\\vec{b}$ an die Spitze von $\\vec{a}$ hängen. Die Summe ist die Diagonale des Parallelogramms.',
            'Optellen betekent: $\\vec{b}$ aan de punt van $\\vec{a}$ zetten. De som is de diagonaal van het parallellogram.'],
        ['Ein negativer Faktor dreht die Richtung um.', 'Een negatieve factor keert de richting om.'], ['Mit $r = 0$ entsteht der Nullvektor.', 'Met $r = 0$ ontstaat de nulvector.'],
        [' Die Länge wird mit $|r| = ', ' De lengte wordt vermenigvuldigd met $|r| = '], ['$ multipliziert: $|r', '$: $|r'],
        // skalarprodukt, viereck3d
        ['$ und $', '$ en $'], [', also $', ', dus $'], [' (stumpf: das Skalarprodukt ist negativ)', ' (stomp: het inproduct is negatief)'],
        [' (spitz: das Skalarprodukt ist positiv)', ' (scherp: het inproduct is positief)'], [' (parallel, gleiche Richtung)', ' (evenwijdig, dezelfde richting)'],
        ['Mit dem Nullvektor gibt es keinen Winkel.', 'Met de nulvector is er geen hoek.'],
        ['kein ebenes Viereck: Die vier Punkte liegen nicht in einer Ebene.', 'geen vlakke vierhoek: de vier punten liggen niet in één vlak.'],
        ['ein <b>Quadrat</b>', 'een <b>vierkant</b>'], ['ein <b>Rechteck</b>', 'een <b>rechthoek</b>'], ['eine <b>Raute</b>', 'een <b>ruit</b>'],
        ['ein <b>Parallelogramm</b>', 'een <b>parallellogram</b>'], ['ein <b>Trapez</b> (ein Paar paralleler Seiten)', 'een <b>trapezium</b> (één paar evenwijdige zijden)'],
        ['ein allgemeines Viereck', 'een willekeurige vierhoek'], ['$: gegenüberliegende Seiten parallel und gleich lang', '$: overstaande zijden evenwijdig en even lang'],
        ['$: rechter Winkel bei $A$', '$: rechte hoek bij $A$'], ['$: benachbarte Seiten gleich lang', '$: aanliggende zijden even lang'],
        ['$: Diagonalen senkrecht zueinander', '$: diagonalen loodrecht op elkaar'], ['$ABCD$ ist ', '$ABCD$ is '],
        // book nl-3 mathe13-nl:
    ],
    rule: [
        // nl0: notation of the module, for every book
        // book nl-2 mathe12-nl:
        // the coordinate inputs: aria-label "Vektor a, x-Koordinate" / "Punkt A, y-Koordinate"
        [/^(Vektor|Punkt) (\S+), ([xyz])-Koordinate$/, (m, w, n, ax) => (w === 'Vektor' ? 'Vector ' : 'Punt ') + n + ', ' + ax + '-coördinaat'],
        // the inner product is a · b in Dutch schools, German a ∘ b: every " \circ " between two terms; degrees "^\circ" have no
        // space before and stay
        [/ \\circ /g, ' \\cdot '],
        // book nl-3 mathe13-nl:
    ]
});
