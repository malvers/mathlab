/* js/buch-tr/analysis.js — Turkish for the widgets of js/buch-analysis.js.
 * Loaded by the Turkish editions right after js/buch-analysis.js; the engine and the shared words are in js/buch-tr.js.
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
window.BuchTR && BuchTR.add('analysis', {
    word: {
        // tr0: the helpers of the module (outside every widget; check.mjs analysis/*)
        // book tr-2 mathe12-tr:
        // the cover of the start page (BGY 12)
        'Titelbild: Kurve mit Wendetangente und Ableitung, Binomialverteilung und ein Vektor im Raum':
            'Kapak resmi: büküm noktasındaki teğetiyle bir eğri ve türevi, bir binom dağılımı ve uzayda bir vektör',
        // grenzwert (lb2-1): Grenzwert = limit, waagerechte / senkrechte Asymptote = yatay / düşey asimptot, Loch = delik
        'Annäherung, Schritt $k$': 'Yaklaşma, adım $k$', 'Graph mit Annäherung an einen Grenzwert': 'Bir limite yaklaşan grafik',
        'Annäherung:': 'Yaklaşma:', 'Richtung': 'Yön',
        // sekante, ableitungsgraph (lb2-2): Sekante = kesen, Tangente = teğet, Steigung = eğim, f′ = "f üssü"
        'Abstand $h$ von $P$ zu $Q$': '$P$ ile $Q$ arasındaki uzaklık $h$', 'Tangente zeigen': 'Teğeti göster', 'Tangente ausblenden': 'Teğeti gizle',
        'Sekante durch P und Q nähert sich der Tangente': 'P ve Q noktalarından geçen kesen teğete yaklaşıyor',
        'Ganzen Graphen von f′ zeigen': 'f′ grafiğinin tamamını göster', 'Spur löschen': 'İzi sil',
        'Oben: f mit Tangente. Ziehe den Punkt P. Unten: Jede Tangentensteigung wird zu einem Punkt des Graphen von f′.':
            'Üstte: teğetiyle birlikte f. P noktasını sürükle. Altta: Her teğet eğimi, f′ grafiğinin bir noktası olur.',
        'Graph von f mit Tangente': 'Teğetiyle birlikte f grafiği', 'Graph der Ableitung f Strich': 'Türev fonksiyonu f üssünün grafiği',
    },
    phrase: [
        // tr0: the helpers of the module (outside every widget; check.mjs analysis/*)
        // book tr-2 mathe12-tr:
        // grenzwert
        ['$x$ links', '$x$ (soldan)'], ['$x$ rechts', '$x$ (sağdan)'],
        ['links gegen $-\\infty$, rechts gegen $+\\infty$: kein Grenzwert, senkrechte Asymptote $x = 1$',
            'soldan $-\\infty$\'a, sağdan $+\\infty$\'a gider: limit yok, düşey asimptot $x = 1$'],
        ['wächst über alle Grenzen: $f(x) \\to \\infty$, kein Grenzwert', 'sınırsız büyür: $f(x) \\to \\infty$, limit yok'],
        ['An der Stelle $x = 1$ ist $f$ nicht definiert, der Graph hat dort ein Loch. Der Grenzwert existiert trotzdem: Kürzen gibt $',
            '$x = 1$ noktasında $f$ tanımsızdır, grafiğin orada bir deliği vardır. Limit yine de vardır: Sadeleştirince $'],
        ['Bei $x = 0$ ist $f$ nicht definiert. Die Werte kommen trotzdem beliebig nah an 1 heran.', '$x = 0$\'da $f$ tanımsızdır. Değerler yine de 1\'e istenildiği kadar yaklaşır.'],
        ['Der Graph pendelt um die $x$-Achse, die Ausschläge werden immer kleiner.', 'Grafik $x$ ekseni etrafında salınır, salınımlar giderek küçülür.'],
        ['Waagerechte Asymptote: $y = ', 'Yatay asimptot: $y = '],
        // sekante, ableitungsgraph
        ['$ mit $h = ', '$; $h = '], ['Sekantensteigung (Differenzenquotient): $', 'Kesenin eğimi (fark oranı): $'],
        ['Tangentensteigung: $f', 'Teğetin eğimi: $f'], ['· Für $h \\to 0$ wird aus der Sekante die Tangente.', '· $h \\to 0$ için kesen teğete dönüşür.'],
        ['· Mach $h$ kleiner.', '· $h$\'yi küçült.'],
    ],
    rule: [
        // tr0: notation of the module, for every book
        // book tr-2 mathe12-tr:
        // grenzwert: "$f(x) = …$ für $x \to 1$" → "$x \to 1$ için $f(x) = …$"
        [/(<p style="margin:0 0 8px">)(\$[^$]*\$) für (\$[^$]*\$)(<\/p>)/g, '$1$3 için $2$4'],
        // ableitungsgraph: "· Steigung in $P(1 | 2)$: …" → "· $P(1, 2)$ noktasındaki eğim: …"
        [/\$ · Steigung in \$P([^$]*)\$: /g, '$ · $P$1$ noktasındaki eğim: '],
    ]
});
