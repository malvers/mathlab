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
        // book sw-2 mathe12-sw:
        // (sw-2 above, sw-3 below)
        // book sw-3 mathe13-sw:
        // the 3D stage and raum-hero (helpers of the module, BGY 12 has them too)
        'Räumliches Koordinatensystem': 'Mfumo wa viwianishi wa pande tatu', 'Ziehen zum Drehen': 'Buruta ili kuzungusha',
        'Räumliches Koordinatensystem mit einem Punkt und seinem Ortsvektor': 'Mfumo wa viwianishi wa pande tatu wenye nukta moja na vekta yake ya nafasi',
        // gerade3d
        'Parameter $t$': 'Kigezo $t$', 'Der Richtungsvektor darf nicht der Nullvektor sein.': 'Vekta ya mwelekeo haiwezi kuwa vekta sifuri.',
        // ebene3d
        'Ebene und Normalenvektor': 'Bapa na vekta ya normali', 'Liegt der Punkt in E?': 'Je, nukta iko ndani ya E?', 'Gerade schneidet Ebene': 'Mstari unakata bapa',
        'Was wird gezeigt?': 'Kinaonyeshwa nini?',
        '$\\vec{u}$ und $\\vec{v}$ sind parallel, sie spannen keine Ebene auf.': '$\\vec{u}$ na $\\vec{v}$ ni sambamba, haziundi bapa.',
        'Beispiele:': 'Mifano:',
    },
    phrase: [
        // sw0: the helpers of the module (outside every widget)
        // book sw-2 mathe12-sw:
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
    ],
    rule: [
        // book sw-2 mathe12-sw:
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
