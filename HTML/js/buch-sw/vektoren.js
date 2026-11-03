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
        'Räumliches Koordinatensystem': 'Mfumo wa viwianishi wa nafasi', 'Ziehen zum Drehen': 'Buruta ili kuzungusha', 'Beispiele:': 'Mifano:', '|': ',',
        // book sw-2 mathe12-sw:
        // raum-hero, raum3d (lb5-1): Ortsvektor = vekta ya mahali, Verbindungsvektor = vekta ya kuunganisha, Betrag = ukubwa,
        // Mittelpunkt = nukta ya kati M, Nullvektor = vekta sifuri, Vielfaches = kizidisho
        'Räumliches Koordinatensystem mit einem Punkt und seinem Ortsvektor': 'Mfumo wa viwianishi wa nafasi wenye nukta moja na vekta yake ya mahali',
        'Punkte und Verbindungsvektor': 'Nukta na vekta ya kuunganisha', 'Summe und Differenz': 'Jumla na tofauti', 'Vielfaches': 'Kizidisho',
        'Was wird gezeigt?': 'Nini kinaonyeshwa?', 'Mittelpunkt M zeigen': 'Onyesha nukta ya kati M', 'Summe oder Differenz': 'Jumla au tofauti',
        'Faktor $r$': 'Kizidishi $r$',
        // skalarprodukt, viereck3d (lb5-2): Skalarprodukt = zao la skala (written a · b, rule below), orthogonal = wima, spitz /
        // stumpf = kali / butu, Raute = rombasi, Viereck = pembenne
        'spitzer Winkel': 'pembe kali', 'orthogonal': 'wima', 'stumpfer Winkel': 'pembe butu', 'parallel': 'sambamba',
        'Parallelogramm': 'Msambamba', 'Rechteck': 'Mstatili', 'Raute': 'Rombasi', 'Quadrat': 'Mraba', 'Trapez': 'Trapeza',
        // (sw-2 above, sw-3 below)
        // book sw-3 mathe13-sw:
        // the 3D stage and raum-hero (helpers of the module, BGY 12 has them too)
        // gerade3d
        'Parameter $t$': 'Kigezo $t$', 'Der Richtungsvektor darf nicht der Nullvektor sein.': 'Vekta ya mwelekeo haiwezi kuwa vekta sifuri.',
        // ebene3d
        'Ebene und Normalenvektor': 'Bapa na vekta ya normali', 'Liegt der Punkt in E?': 'Je, nukta iko ndani ya E?', 'Gerade schneidet Ebene': 'Mstari unakata bapa',
        '$\\vec{u}$ und $\\vec{v}$ sind parallel, sie spannen keine Ebene auf.': '$\\vec{u}$ na $\\vec{v}$ ni sambamba, haziundi bapa.',
        // geradenlage
        'schneidend': 'inakatana',  'identisch': 'inaambatana', 'windschief': 'inapitana bila kukutana',
        'Richtungsvektoren dürfen nicht der Nullvektor sein.': 'Vekta za mwelekeo haziwezi kuwa vekta sifuri.',
        // pyramide
        'Pyramide': 'Piramidi', 'Prisma (schief möglich)': 'Prizimu (inaweza kuinama)', 'Körper': 'Umbo', 'Grundkante $a$': 'Ukingo wa kitako $a$',
        'Höhe $h$': 'Kimo $h$', 'Verschiebung der Spitze in $x$': 'Kuhamisha kilele kwa mwelekeo wa $x$',
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
        // skalarprodukt, viereck3d
        ['$ und $', '$ na $'], [', also $', ', kwa hiyo $'], [' (stumpf: das Skalarprodukt ist negativ)', ' (butu: zao la skala ni hasi)'],
        [' (spitz: das Skalarprodukt ist positiv)', ' (kali: zao la skala ni chanya)'], [' (parallel, gleiche Richtung)', ' (sambamba, mwelekeo ule ule)'],
        ['Mit dem Nullvektor gibt es keinen Winkel.', 'Kwa vekta sifuri hakuna pembe.'],
        ['kein ebenes Viereck: Die vier Punkte liegen nicht in einer Ebene.', 'si pembenne bapa: nukta nne haziko katika bapa moja.'],
        ['ein <b>Quadrat</b>', '<b>mraba</b>'], ['ein <b>Rechteck</b>', '<b>mstatili</b>'], ['eine <b>Raute</b>', '<b>rombasi</b>'],
        ['ein <b>Parallelogramm</b>', '<b>msambamba</b>'], ['ein <b>Trapez</b> (ein Paar paralleler Seiten)', '<b>trapeza</b> (jozi moja ya pande sambamba)'],
        ['ein allgemeines Viereck', 'pembenne ya kawaida'], ['$: gegenüberliegende Seiten parallel und gleich lang', '$: pande zinazokabiliana ni sambamba na zina urefu sawa'],
        ['$: rechter Winkel bei $A$', '$: pembe mraba kwenye $A$'], ['$: benachbarte Seiten gleich lang', '$: pande jirani zina urefu sawa'],
        ['$: Diagonalen senkrecht zueinander', '$: viulalo ni wima kwa kila kimoja'], ['$ABCD$ ist ', '$ABCD$ ni '],
        // (sw-2 above, sw-3 below)
        // book sw-3 mathe13-sw:
        // gerade3d
        ['Punktprobe für $Q(', 'Jaribio la nukta kwa $Q('], ['Alle Zeilen liefern $t = ', 'Safu mlalo zote zinatoa $t = '], ['$, also <b>$Q \\in g$</b>.', '$, kwa hiyo <b>$Q \\in g$</b>.'],
        ['Die Zeilen liefern verschiedene Werte für $t$, also <b>$Q \\notin g$</b>.', 'Safu mlalo zinatoa thamani tofauti za $t$, kwa hiyo <b>$Q \\notin g$</b>.'],
        ['Spurpunkte: keine', 'Nukta za kukata: hakuna'], ['Spurpunkte: ', 'Nukta za kukata: '],
        // ebene3d
        ['Normalenvektor $\\vec{n}', 'Vekta ya normali $\\vec{n}'], ['$ · Koordinatenform: $', '$ · mlinganyo wa kartesia: $'],
        ['Spurpunkte mit den Achsen: ', 'Nukta za kukata mihimili: '], ['Punktprobe: $', 'Jaribio la nukta: $'],
        ['$: <b>$Q$ liegt in $E$</b>.', '$: <b>$Q$ iko ndani ya $E$</b>.'], ['$: <b>$Q$ liegt nicht in $E$</b>. Abstand $\\approx ', '$: <b>$Q$ haiko ndani ya $E$</b>. Umbali $\\approx '],
        ['$: Die Gerade ist parallel zur Ebene ', '$: Mstari ni sambamba na bapa '], ['und liegt in ihr.', 'na uko ndani yake.'], ['und schneidet sie nicht.', 'na haulikati.'],
        ['Einsetzen von $g$ in $E$: $t = ', 'Kuweka $g$ ndani ya $E$: $t = '], ['$, Schnittpunkt $S(', '$, nukta ya makutano $S('], ['$ · Schnittwinkel: $', '$ · pembe ya makutano: $'],
        // geradenlage
        ['Die Richtungsvektoren sind parallel ($\\vec{v} = ', 'Vekta za mwelekeo ni sambamba ($\\vec{v} = '],
        ['Der Stützpunkt $Q$ liegt auf $g$: <b>identisch</b>.', 'Nukta ya msingi $Q$ iko kwenye $g$: <b>inaambatana</b>.'],
        ['Der Stützpunkt $Q$ liegt nicht auf $g$: <b>echt parallel</b>.', 'Nukta ya msingi $Q$ haiko kwenye $g$: <b>sambamba na tofauti</b>.'],
        ['Nicht parallel. Gleichsetzen ergibt $t = ', 'Si sambamba. Kulinganisha kunatoa $t = '], ['$: <b>schneidend</b> im Punkt $S(', '$: <b>inakatana</b> kwenye nukta $S('],
        ['Nicht parallel und das Gleichungssystem hat keine Lösung: <b>windschief</b>. Kürzester Abstand (rot gestrichelt) $\\approx ',
            'Si sambamba na mfumo wa milinganyo hauna suluhisho: <b>inapitana bila kukutana</b>. Umbali mfupi zaidi (mstari mwekundu wa vistari) $\\approx '],
        // pyramide
        ['Grundfläche $G', 'Eneo la kitako $G'], ['$, Spitze $S(', '$, kilele $S('], ['$, Höhe $h = ', '$, kimo $h = '], ['$ (rot)', '$ (nyekundu)'],
        ['Volumen $V', 'Ujazo $V'], [' · Mantel (4 Dreiecke, je $', ' · uso wa pembeni (pembetatu 4, kila moja $'],
        [' · Mantel (4 Parallelogramme, je $', ' · uso wa pembeni (misambamba 4, kila mmoja $'],
        ['Oberfläche $O = ', 'Eneo la uso wote $A_J = '], [' (Prinzip von Cavalieri: auch schief)', ' (kanuni ya Cavalieri: hata ikiinama)'],
        [' · Verschiebst du die Spitze waagerecht, bleibt das Volumen gleich, der Mantel nicht.', ' · Ukihamisha kilele kwa mlalo, ujazo unabaki ule ule, uso wa pembeni haubaki.'],
        ['$, Verschiebung der Deckfläche $\\vec{w} = ', '$, kuhamishwa kwa uso wa juu $\\vec{w} = '],
    ],
    rule: [
        // book sw-2 mathe12-sw:
        // the coordinate inputs: aria-label "Vektor a, x-Koordinate" / "Punkt A, y-Koordinate"
        [/^(Vektor|Punkt) (\S+), ([xyz])-Koordinate$/, (m, w, n, ax) => (w === 'Vektor' ? 'Vekta ' : 'Nukta ') + n + ', kiwianishi cha ' + ax],
        // the scalar product is a · b in Kenyan (and English) schools, German a ∘ b: every " \circ " between two terms; degrees "^\circ"
        // have no space before and stay
        [/ \\circ /g, ' \\cdot '],
        // skalarprodukt: a number times a bracket is a product of two numbers too, "2 \cdot (-1)" → "2 \times (-1)", as the
        // engine writes "1 \times 2"
        [/(\d) ?\\cdot ?(?=\(-?\d)/g, '$1 \\times '],
        // (sw-2 above, sw-3 below)
        // book sw-3 mathe13-sw:
        // vectors the Kenyan (English) way, in every widget of the module: the plane E: r = a + λu + μv (German r, s, which
        // would clash with the vector r), the position vector r instead of x (r = p + tu), the dot product a · b instead of
        // a ∘ b (not the degree sign ^\circ)
        [/(E\\colon \\vec\{x\} = \\begin\{pmatrix\}[^$]*?\\end\{pmatrix\}) \+ r \\cdot (\\begin\{pmatrix\}[^$]*?\\end\{pmatrix\}) \+ s \\cdot /g, '$1 + \\lambda \\cdot $2 + \\mu \\cdot '],
        [/\\vec\{x\}/g, '\\vec{r}'], [/(?<!\^)\\circ(?![A-Za-z])/g, '\\cdot'],
        // the coordinate inputs: "Vektor u, x-Koordinate" → "Vekta u, kiwianishi cha x", and the bars between them are commas
        [/\b(Vektor|Punkt) ([^,"]+), ([xyz])-Koordinate/g, (m, k, n, c) => (k === 'Vektor' ? 'Vekta ' : 'Nukta ') + n + ', kiwianishi cha ' + c],
        [/<span class="vk-par">\|<\/span>/g, '<span class="vk-par">,</span>'],
    ]
});
