/* js/buch-sw/vektoren.js — Swahili for the widgets of js/buch-vektoren.js.
 * Loaded by the Swahili editions right after js/buch-vektoren.js; the engine and the shared words are in js/buch-sw.js.
 *   word    a whole label → its Swahili
 *   phrase  German sentence pieces exactly as the widget source writes them → Swahili
 *   rule    word order and notation (after the number and point rules of js/buch-sw.js, before its header rules)
 * Terms: tools/buch-sw/istilahi.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang sw
 * Package sw2-prep (03.11.2026): the module's helpers (outside every widget) go below the sw0 line, everything a
 * book needs below its own comment line, every entry ending with a comma.
 */
window.BuchSW && BuchSW.add('vektoren', {
    word: {
        // sw0: the helpers of the module (outside every widget)
        // the 3D stage and the coordinate inputs: Vektor = vekta, Punkt = nukta, points with commas as in Kenyan schools, also the
        // bars between the inputs "( 2 | -1 | 1 )"
        'Räumliches Koordinatensystem': 'Mfumo wa koodineti wa nafasi', 'Ziehen zum Drehen': 'Vuta ili kuzungusha', 'Beispiele:': 'Mifano:', '|': ',',
        // book sw-2 mathe12-sw:
        // raum-hero, raum3d (lb5-1): Ortsvektor = vekta ya mahali, Verbindungsvektor = vekta ya kuunganisha, Betrag = ukubwa,
        // Mittelpunkt = nukta ya kati M, Nullvektor = vekta sifuri, Vielfaches = kizidisho
        'Räumliches Koordinatensystem mit einem Punkt und seinem Ortsvektor': 'Mfumo wa koodineti wa nafasi wenye nukta moja na vekta yake ya mahali',
        'Punkte und Verbindungsvektor': 'Nukta na vekta ya kuunganisha', 'Summe und Differenz': 'Jumla na tofauti', 'Vielfaches': 'Kizidisho',
        'Was wird gezeigt?': 'Nini kinaonyeshwa?', 'Mittelpunkt M zeigen': 'Onyesha nukta ya kati M', 'Summe oder Differenz': 'Jumla au tofauti',
        'Faktor $r$': 'Kizidishi $r$',
        // (sw-2 above, sw-3 below)
        // book sw-3 mathe13-sw:
    },
    phrase: [
        // sw0: the helpers of the module (outside every widget)
        // book sw-2 mathe12-sw:
        // raum3d
        ['Ortsvektoren $\\vec{OA} = ', 'Vekta za mahali $\\vec{OA} = '], ['$ · Verbindungsvektor $\\vec{AB}', '$ · vekta ya kuunganisha $\\vec{AB}'],
        ['Länge: $|\\vec{AB}|', 'Urefu: $|\\vec{AB}|'],
        ['Mittelpunkt: $\\vec{OM} = \\tfrac12\\,(\\vec{OA} + \\vec{OB})$, also $', 'Nukta ya kati: $\\vec{OM} = \\tfrac12\\,(\\vec{OA} + \\vec{OB})$, kwa hiyo $'],
        ['Subtrahieren heißt: den Gegenvektor $-\\vec{b}$ anhängen.', 'Kutoa maana yake ni kuunganisha vekta kinyume $-\\vec{b}$.'],
        ['Addieren heißt: $\\vec{b}$ an die Spitze von $\\vec{a}$ hängen. Die Summe ist die Diagonale des Parallelogramms.',
            'Kujumlisha maana yake ni kuunganisha $\\vec{b}$ kwenye ncha ya $\\vec{a}$. Jumla ni kiulalo cha msambamba.'],
        ['Ein negativer Faktor dreht die Richtung um.', 'Kizidishi hasi kinageuza mwelekeo.'], ['Mit $r = 0$ entsteht der Nullvektor.', 'Kwa $r = 0$ tunapata vekta sifuri.'],
        [' Die Länge wird mit $|r| = ', ' Urefu unazidishwa kwa $|r| = '], ['$ multipliziert: $|r', '$: $|r'],
        // (sw-2 above, sw-3 below)
        // book sw-3 mathe13-sw:
    ],
    rule: [
        // book sw-2 mathe12-sw:
        // the coordinate inputs: aria-label "Vektor a, x-Koordinate" / "Punkt A, y-Koordinate"
        [/^(Vektor|Punkt) (\S+), ([xyz])-Koordinate$/, (m, w, n, ax) => (w === 'Vektor' ? 'Vekta ' : 'Nukta ') + n + ', koodineti ya ' + ax],
        // (sw-2 above, sw-3 below)
        // book sw-3 mathe13-sw:
    ]
});
