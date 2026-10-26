/* js/buch-fr/daten.js — French for the widgets of js/buch-daten.js.
 * Loaded by the French editions right after js/buch-daten.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * French school notation (Doc, 26.10.2026: always the conventions of the target language) - see js/buch-fr/gy5.js.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * Each book has its own comment line in word, phrase and rule - write only right below your book's line, every entry
 * ending with a comma. Before translating a string, search the other French dictionaries for it. The Italian file
 * js/buch-it/daten.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('daten', {
    word: {
        // book fr-14 mathegy7-fr:
        // book fr-16 mathegy9-fr:
        // the French school letters: étendue e, variance V, écart type σ (German R, s², s); effectif / fréquence for absolute / relative Häufigkeit
        // mittelwerte
        'Ausreißer dazu (75 min)': 'Ajouter la valeur aberrante (75 min)', 'Ausreißer weg': 'Retirer la valeur aberrante', 'Fahrzeit in min': 'Durée du trajet en min',
        'Median': 'Médiane', 'Mittelwert': 'Moyenne', 'Modalwert': 'Mode',
        'Punktdiagramm der Fahrzeiten mit Median und Mittelwert': 'Diagramme en points des durées de trajet, avec la médiane et la moyenne',
        'Zieh die Punkte. Ein einzelner weiter Weg verschiebt den Mittelwert deutlich, den Median kaum.':
            'Déplace les points. Un seul long trajet déplace nettement la moyenne, mais presque pas la médiane.',
        // streuung
        'Streuung von B': 'Dispersion de B', 'Monatsmittel in °C': 'Moyenne mensuelle en °C',
        'Stadt am Meer': 'Ville au bord de la mer', 'Stadt im Binnenland': 'Ville à l’intérieur des terres',
        'A · STADT AM MEER': 'A · VILLE AU BORD DE LA MER', 'B · STADT IM BINNENLAND': 'B · VILLE À L’INTÉRIEUR DES TERRES',
        'Zwei Datenreihen mit gleichem Mittelwert und unterschiedlicher Streuung': 'Deux séries de données de même moyenne et de dispersions différentes',
        'Spannweite': 'Étendue $e$', 'Varianz $s^2$': 'Variance $V$',
        'Gleiches Jahresmittel, ganz anderes Klima. Der helle Streifen reicht von $\\bar{x} - s$ bis $\\bar{x} + s$. Modellwerte, keine Messdaten.':
            'Même moyenne annuelle, climat tout à fait différent. La bande claire va de $\\bar{x} - \\sigma$ à $\\bar{x} + \\sigma$. Valeurs de modèle, pas des mesures.',
        // histogramm
        'absolute Häufigkeit': 'Effectif', 'relative Häufigkeit': 'Fréquence', 'Häufigkeit': 'Effectif ou fréquence',
        'Klassenbreite': 'Amplitude des classes', 'Erste Klasse ab': 'Première classe à partir de', 'Körpergröße in cm': 'Taille en cm',
        'Histogramm der Körpergrößen': 'Histogramme des tailles',
        'Sehr schmale Klassen zeigen fast nur Einzelwerte, sehr breite verwischen alles. Dazwischen erkennt man die Form der Verteilung.':
            'Des classes très étroites ne montrent presque que des valeurs isolées, des classes très larges brouillent tout. Entre les deux, on reconnaît la forme de la distribution.',
        // achsentrick (GY 7, block fr-14, uses it too - one copy is kept when merging)
        'Abgeschnittene Achse': 'Axe tronqué', 'Bild statt Balken': 'Image au lieu de barres', 'Achse beginnt bei': 'L’axe commence à', 'Trick': 'Astuce',
        'Säulendiagramm Mitglieder eines Sportvereins': 'Diagramme en colonnes : membres d’un club de sport',
        'Die Achse beginnt nicht bei null. Bei Säulen täuscht das immer, denn das Auge vergleicht ihre Höhen. In Liniendiagrammen ist ein späterer Achsenbeginn üblich, dann aber mit deutlichem Bruchzeichen.':
            'L’axe ne commence pas à zéro. Avec des colonnes, cela trompe toujours, car l’œil compare leurs hauteurs. Dans les graphiques en courbes, il est courant de faire commencer l’axe plus haut, mais alors avec un signe de coupure bien visible.',
        'Achse ab null: Die Höhen sind ehrlich vergleichbar.': 'Axe à partir de zéro : les hauteurs se comparent honnêtement.',
        '2020: 100 Mio. €': '2020 : 100 M€', '2025: 200 Mio. €': '2025 : 200 M€',
        'Zwei Geldsymbole, das zweite doppelt so hoch und doppelt so breit': 'Deux symboles monétaires, le second deux fois plus haut et deux fois plus large',
        'Der Umsatz hat sich <b>verdoppelt</b>. Das rechte Bild ist doppelt so hoch, aber auch doppelt so breit.':
            'Le chiffre d’affaires a <b>doublé</b>. L’image de droite est deux fois plus haute, mais aussi deux fois plus large.',
        'Das Auge vergleicht Flächen: $2 \\cdot 2 = 4$, das Bild wirkt <b>viermal</b> so groß. Als Körper gezeichnet sogar $2^3 = 8$-mal.':
            'L’œil compare des aires : $2 \\times 2 = 4$, l’image paraît <b>quatre fois</b> plus grande. Dessinée comme un solide, même $2^3 = 8$ fois.',
    },
    phrase: [
        // book fr-14 mathegy7-fr:
        // book fr-16 mathegy9-fr:
        // mittelwerte
        ['keiner (jeder Wert kommt nur einmal vor)', 'aucun (chaque valeur n’apparaît qu’une fois)'],
        // achsentrick
        ['Tatsächlich: $', 'En réalité : $'], ['$, also ein Plus von ', '$, soit une hausse de '],
    ],
    rule: [
        // book fr-14 mathegy7-fr:
        // book fr-16 mathegy9-fr:
        // mittelwerte: "Geordnet ($n = 9$): …" and several modes "15 und 18 min"
        [/Geordnet \(\$n = (\d+)\$\): /g, (m, n) => 'Dans l’ordre ($n = ' + n + '$) : '],
        [/(\d) und (?=\d+(?: und \d+)* min\b)/g, '$1 et '],
        // streuung: the last head of the table, s → σ (a rule with its context, not a word '$s$' for every label of the page)
        [/<th>\$s\$<\/th><\/tr>/g, '<th>$$\\sigma$$</th></tr>'],
        // histogramm: "8 Klassen der Breite 5 cm · häufigste Klasse $[165;\\,170)$ mit 10 von 40 Werten (25 %)" - French classes [165 ; 170[
        [/(\d+) Klassen der Breite (\d+) cm · häufigste Klasse \$\[(\d+);\\,(\d+)\)\$ mit (\d+) von (\d+) Werten \(/g,
            (m, k, w, a, b, c, n) => k + ' classes d’amplitude ' + w + ' cm · classe la plus fréquente $[' + a + '\\,;\\,' + b + '[$ avec ' + c + ' valeurs sur ' + n + ' ('],
        // achsentrick: "Die letzte Säule wirkt 3,7-mal so hoch wie die erste."
        [/Mitglieder eines Sportvereins\. Die letzte Säule <b>wirkt<\/b> ([\d,]+)-mal so hoch wie die erste\./g,
            'Membres d’un club de sport. La dernière colonne <b>paraît</b> $1 fois plus haute que la première.'],
    ]
});
