/* js/buch-en/daten.js — English for the widgets of js/buch-daten.js:
 *   mittelwerte, streuung, histogramm, achsentrick (book 11, mathegy9-en)
 * Loaded by the English editions right after js/buch-daten.js; the engine and the shared words are in js/buch-en.js.
 *   word    a whole label → its English
 *   phrase  German sentence pieces exactly as the widget source writes them → English
 *   rule    word order and notation (after the number rules of js/buch-en.js, before its header rules)
 * After changing a German widget sentence: node tools/buch-en/check.mjs
 */
window.BuchEN && BuchEN.add('daten', {
    word: {
        // book 11 mathegy9-en: mittelwerte
        'Ausreißer dazu (75 min)': 'Add outlier (75 min)', 'Ausreißer weg': 'Remove outlier', 'Fahrzeit in min': 'Journey time in min',
        'Mittelwert': 'Mean', 'Modalwert': 'Mode',
        'Punktdiagramm der Fahrzeiten mit Median und Mittelwert': 'Dot plot of the journey times with median and mean',
        'Zieh die Punkte. Ein einzelner weiter Weg verschiebt den Mittelwert deutlich, den Median kaum.':
            'Drag the points. A single long journey shifts the mean clearly, the median hardly at all.',
        // book 11 mathegy9-en: streuung
        'Streuung von B': 'Spread of B', 'Monatsmittel in °C': 'Monthly mean in °C',
        'Zwei Datenreihen mit gleichem Mittelwert und unterschiedlicher Streuung': 'Two data sets with the same mean and different spread',
        'Spannweite': 'Range', 'Varianz $s^2$': 'Variance $s^2$',
        'Gleiches Jahresmittel, ganz anderes Klima. Der helle Streifen reicht von $\\bar{x} - s$ bis $\\bar{x} + s$. Modellwerte, keine Messdaten.':
            'Same annual mean, completely different climate. The light strip goes from $\\bar{x} - s$ to $\\bar{x} + s$. Model values, not measured data.',
        // book 11 mathegy9-en: histogramm
        'absolute Häufigkeit': 'absolute frequency', 'relative Häufigkeit': 'relative frequency', 'Häufigkeit': 'Frequency',
        'Klassenbreite': 'Class width', 'Erste Klasse ab': 'First class from', 'Körpergröße in cm': 'Height in cm',
        'Histogramm der Körpergrößen': 'Histogram of the body heights',
        'Sehr schmale Klassen zeigen fast nur Einzelwerte, sehr breite verwischen alles. Dazwischen erkennt man die Form der Verteilung.':
            'Very narrow classes show almost only single values, very wide ones blur everything. In between you can see the shape of the distribution.',
        // book 11 mathegy9-en: achsentrick
        'Abgeschnittene Achse': 'Truncated axis', 'Bild statt Balken': 'Picture instead of bar', 'Achse beginnt bei': 'Axis starts at',
        'Säulendiagramm Mitglieder eines Sportvereins': 'Bar chart of the members of a sports club',
        'Die Achse beginnt nicht bei null. Bei Säulen täuscht das immer, denn das Auge vergleicht ihre Höhen. In Liniendiagrammen ist ein späterer Achsenbeginn üblich, dann aber mit deutlichem Bruchzeichen.':
            'The axis does not start at zero. With bars this is always misleading, because the eye compares their heights. In line charts a later start of the axis is common, but then with a clear break symbol.',
        'Achse ab null: Die Höhen sind ehrlich vergleichbar.': 'Axis from zero: the heights can be compared honestly.',
        '2020: 100 Mio. €': '2020: €100 million', '2025: 200 Mio. €': '2025: €200 million',
        'Zwei Geldsymbole, das zweite doppelt so hoch und doppelt so breit': 'Two money symbols, the second twice as high and twice as wide',
        'Der Umsatz hat sich <b>verdoppelt</b>. Das rechte Bild ist doppelt so hoch, aber auch doppelt so breit.':
            'Turnover has <b>doubled</b>. The picture on the right is twice as high, but also twice as wide.',
        'Das Auge vergleicht Flächen: $2 \\cdot 2 = 4$, das Bild wirkt <b>viermal</b> so groß. Als Körper gezeichnet sogar $2^3 = 8$-mal.':
            'The eye compares areas: $2 \\cdot 2 = 4$, so the picture looks <b>four times</b> as large. Drawn as a solid, even $2^3 = 8$ times.'
    },
    phrase: [
        // book 11 mathegy9-en: mittelwerte
        ['Geordnet ($n = ', 'Ordered ($n = '], [' und ', ' and '], ['keiner (jeder Wert kommt nur einmal vor)', 'none (every value occurs only once)'],
        // book 11 mathegy9-en: streuung (the names are written in capitals in the picture)
        ['Stadt am Meer', 'City by the sea'], ['Stadt im Binnenland', 'Inland city'], ['STADT AM MEER', 'CITY BY THE SEA'], ['STADT IM BINNENLAND', 'INLAND CITY'],
        // book 11 mathegy9-en: histogramm
        [' Klassen der Breite ', ' classes of width '], [' cm · häufigste Klasse $[', ' cm · most frequent class $['], [')$ mit ', ')$ with '],
        [' von ', ' of '], [' Werten (', ' values ('],
        // book 11 mathegy9-en: achsentrick
        ['Mitglieder eines Sportvereins. Die letzte Säule <b>wirkt</b> ', 'Members of a sports club. The last bar <b>looks</b> '],
        ['-mal so hoch wie die erste.', ' times as tall as the first.'], ['Tatsächlich: $', 'In fact: $'], ['$, also ein Plus von ', '$, so an increase of ']
    ],
    rule: [
        // book 11 mathegy9-en: histogramm, half-open class [150;\,155) → [150, 155)
        [/\[(-?[\d.]+);\\,(-?[\d.]+)\)/g, '[$1, $2)']
    ]
});
