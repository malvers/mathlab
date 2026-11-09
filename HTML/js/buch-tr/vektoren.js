/* js/buch-tr/vektoren.js — Turkish for the widgets of js/buch-vektoren.js.
 * Loaded by the Turkish editions right after js/buch-vektoren.js; the engine and the shared words are in js/buch-tr.js.
 *   word    a whole label → its Turkish
 *   phrase  German sentence pieces exactly as the widget source writes them → Turkish
 *   rule    word order and notation (after the point rules of js/buch-tr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package tr2-prep (08.11.2026): the module's helpers (outside every widget) go below the tr0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-tr/*.js).
 * Terms: tools/buch-tr/sozluk.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang tr
 */
window.BuchTR && BuchTR.add('vektoren', {
    word: {
        // tr0: the helpers of the module (outside every widget; check.mjs vektoren/*)
        // the 3D stage and the coordinate inputs: Vektor = vektör, Punkt = nokta; points with commas as in Turkish schools, also the
        // bars between the inputs "( 2 | -1 | 1 )"
        'Räumliches Koordinatensystem': 'Uzay koordinat sistemi', 'Ziehen zum Drehen': 'Döndürmek için sürükle', 'Beispiele:': 'Örnekler:', '|': ',',
        // book tr-2 mathe12-tr:
        // raum-hero, raum3d (lb5-1): Ortsvektor = konum vektörü, Verbindungsvektor = birleştiren vektör, Betrag = uzunluk,
        // Mittelpunkt = orta nokta M, Nullvektor = sıfır vektörü, Vielfaches = kat
        'Räumliches Koordinatensystem mit einem Punkt und seinem Ortsvektor': 'Bir nokta ve konum vektörüyle uzay koordinat sistemi',
        'Punkte und Verbindungsvektor': 'Noktalar ve birleştiren vektör', 'Summe und Differenz': 'Toplam ve fark', 'Vielfaches': 'Kat',
        'Was wird gezeigt?': 'Ne gösteriliyor?', 'Mittelpunkt M zeigen': 'Orta nokta M\'yi göster', 'Summe oder Differenz': 'Toplam ya da fark',
        'Faktor $r$': 'Çarpan $r$',
        // skalarprodukt, viereck3d (lb5-2): Skalarprodukt = iç çarpım (written a · b, rule below), orthogonal = dik, spitz /
        // stumpf = dar / geniş, Raute = eşkenar dörtgen, Viereck = dörtgen
        'spitzer Winkel': 'dar açı', 'orthogonal': 'dik', 'stumpfer Winkel': 'geniş açı', 'parallel': 'paralel',
        'Parallelogramm': 'Paralelkenar', 'Rechteck': 'Dikdörtgen', 'Raute': 'Eşkenar dörtgen', 'Quadrat': 'Kare', 'Trapez': 'Yamuk',
        // book tr-3 mathe13-tr:
    },
    phrase: [
        // tr0: the helpers of the module (outside every widget; check.mjs vektoren/*)
        // book tr-2 mathe12-tr:
        // raum3d
        ['Ortsvektoren $\\vec{OA} = ', 'Konum vektörleri $\\vec{OA} = '], ['$ · Verbindungsvektor $\\vec{AB}', '$ · birleştiren vektör $\\vec{AB}'],
        ['Länge: $|\\vec{AB}|', 'Uzunluk: $|\\vec{AB}|'],
        ['Mittelpunkt: $\\vec{OM} = \\tfrac12\\,(\\vec{OA} + \\vec{OB})$, also $', 'Orta nokta: $\\vec{OM} = \\tfrac12\\,(\\vec{OA} + \\vec{OB})$, yani $'],
        ['Subtrahieren heißt: den Gegenvektor $-\\vec{b}$ anhängen.', 'Çıkarmak, ters vektör $-\\vec{b}$\'yi uca eklemek demektir.'],
        ['Addieren heißt: $\\vec{b}$ an die Spitze von $\\vec{a}$ hängen. Die Summe ist die Diagonale des Parallelogramms.',
            'Toplamak, $\\vec{b}$\'yi $\\vec{a}$\'nın ucuna eklemek demektir. Toplam, paralelkenarın köşegenidir.'],
        ['Ein negativer Faktor dreht die Richtung um.', 'Negatif bir çarpan yönü tersine çevirir.'], ['Mit $r = 0$ entsteht der Nullvektor.', '$r = 0$ ile sıfır vektörü oluşur.'],
        [' Die Länge wird mit $|r| = ', ' Uzunluk $|r| = '], ['$ multipliziert: $|r', '$ ile çarpılır: $|r'],
        // skalarprodukt, viereck3d
        ['$ und $', '$ ve $'], [', also $', ', yani $'], [' (stumpf: das Skalarprodukt ist negativ)', ' (geniş: iç çarpım negatif)'],
        [' (spitz: das Skalarprodukt ist positiv)', ' (dar: iç çarpım pozitif)'], [' (parallel, gleiche Richtung)', ' (paralel, aynı yön)'],
        ['Mit dem Nullvektor gibt es keinen Winkel.', 'Sıfır vektörüyle açı yoktur.'],
        ['kein ebenes Viereck: Die vier Punkte liegen nicht in einer Ebene.', 'düzlemsel bir dörtgen değil: Dört nokta aynı düzlemde değil.'],
        ['ein <b>Quadrat</b>', 'bir <b>kare</b>'], ['ein <b>Rechteck</b>', 'bir <b>dikdörtgen</b>'], ['eine <b>Raute</b>', 'bir <b>eşkenar dörtgen</b>'],
        ['ein <b>Parallelogramm</b>', 'bir <b>paralelkenar</b>'], ['ein <b>Trapez</b> (ein Paar paralleler Seiten)', 'bir <b>yamuk</b> (bir çift paralel kenar)'],
        ['ein allgemeines Viereck', 'genel bir dörtgen'], ['$: gegenüberliegende Seiten parallel und gleich lang', '$: karşılıklı kenarlar paralel ve eşit uzunlukta'],
        ['$: rechter Winkel bei $A$', '$: $A$\'da dik açı'], ['$: benachbarte Seiten gleich lang', '$: komşu kenarlar eşit uzunlukta'],
        ['$: Diagonalen senkrecht zueinander', '$: köşegenler birbirine dik'], ['$ABCD$ ist ', '$ABCD$: '],
        // book tr-3 mathe13-tr:
    ],
    rule: [
        // tr0: notation of the module, for every book
        // book tr-2 mathe12-tr:
        // the coordinate inputs: aria-label "Vektor a, x-Koordinate" / "Punkt A, y-Koordinate"
        [/^(Vektor|Punkt) (\S+), ([xyz])-Koordinate$/, (m, w, n, ax) => (w === 'Vektor' ? 'Vektör ' : 'Nokta ') + n + ', ' + ax + ' koordinatı'],
        // the scalar product is a · b in Turkish schools (iç çarpım), German a ∘ b: every " \circ " between two terms; degrees "^\circ"
        // have no space before and stay
        [/ \\circ /g, ' \\cdot '],
        // book tr-3 mathe13-tr:
    ]
});
