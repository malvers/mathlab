/* js/buch-it/daten.js — Italian for the widgets of js/buch-daten.js.
 * Loaded by the Italian editions right after js/buch-daten.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 3 (20.10.2026): eleven books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/daten.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('daten', {
    word: {
        // book it-12 mathegy7-it:
        // achsentrick (also used by GY 9)
        'Abgeschnittene Achse': 'Asse tagliato', 'Bild statt Balken': 'Figura invece di barra', 'Achse beginnt bei': 'L’asse comincia da', 'Trick': 'Trucco',
        'Säulendiagramm Mitglieder eines Sportvereins': 'Diagramma a colonne: soci di una società sportiva',
        'Die Achse beginnt nicht bei null. Bei Säulen täuscht das immer, denn das Auge vergleicht ihre Höhen. In Liniendiagrammen ist ein späterer Achsenbeginn üblich, dann aber mit deutlichem Bruchzeichen.':
            'L’asse non comincia da zero. Con le colonne questo inganna sempre, perché l’occhio confronta le loro altezze. Nei grafici a linee è normale far cominciare l’asse più in alto, ma allora con un segno di interruzione ben visibile.',
        'Achse ab null: Die Höhen sind ehrlich vergleichbar.': 'Asse da zero: le altezze si possono confrontare onestamente.',
        '2020: 100 Mio. €': '2020: 100 mln €', '2025: 200 Mio. €': '2025: 200 mln €',
        'Zwei Geldsymbole, das zweite doppelt so hoch und doppelt so breit': 'Due simboli del denaro; il secondo è alto il doppio e largo il doppio',
        'Der Umsatz hat sich <b>verdoppelt</b>. Das rechte Bild ist doppelt so hoch, aber auch doppelt so breit.':
            'Il fatturato è <b>raddoppiato</b>. La figura di destra è alta il doppio, ma anche larga il doppio.',
        'Das Auge vergleicht Flächen: $2 \\cdot 2 = 4$, das Bild wirkt <b>viermal</b> so groß. Als Körper gezeichnet sogar $2^3 = 8$-mal.':
            'L’occhio confronta le aree: $2 \\cdot 2 = 4$, la figura sembra <b>quattro volte</b> più grande. Disegnata come solido, addirittura $2^3 = 8$ volte.',

        // book it-14 mathegy9-it:
        // mittelwerte
        'Ausreißer dazu (75 min)': 'Aggiungi il valore anomalo (75 min)', 'Ausreißer weg': 'Togli il valore anomalo', 'Fahrzeit in min': 'Tempo di percorrenza in min',
        'Median': 'Mediana', 'Mittelwert': 'Media', 'Modalwert': 'Moda',
        'Punktdiagramm der Fahrzeiten mit Median und Mittelwert': 'Diagramma a punti dei tempi di percorrenza con mediana e media',
        'Zieh die Punkte. Ein einzelner weiter Weg verschiebt den Mittelwert deutlich, den Median kaum.':
            'Trascina i punti. Un solo tragitto lungo sposta molto la media e quasi per niente la mediana.',
        // streuung
        'Streuung von B': 'Dispersione di B', 'Monatsmittel in °C': 'Media mensile in °C',
        'Stadt am Meer': 'Città di mare', 'Stadt im Binnenland': 'Città dell’entroterra',
        'A · STADT AM MEER': 'A · CITTÀ DI MARE', 'B · STADT IM BINNENLAND': 'B · CITTÀ DELL’ENTROTERRA',
        'Zwei Datenreihen mit gleichem Mittelwert und unterschiedlicher Streuung': 'Due serie di dati con la stessa media e dispersione diversa',
        'Spannweite': 'Campo di variazione', 'Varianz $s^2$': 'Varianza $s^2$',
        'Gleiches Jahresmittel, ganz anderes Klima. Der helle Streifen reicht von $\\bar{x} - s$ bis $\\bar{x} + s$. Modellwerte, keine Messdaten.':
            'Stessa media annua, clima completamente diverso. La striscia chiara va da $\\bar{x} - s$ a $\\bar{x} + s$. Valori di modello, non dati misurati.',
        // histogramm
        'absolute Häufigkeit': 'Frequenza assoluta', 'relative Häufigkeit': 'Frequenza relativa', 'Häufigkeit': 'Frequenza',
        'Klassenbreite': 'Ampiezza delle classi', 'Erste Klasse ab': 'Prima classe da', 'Körpergröße in cm': 'Statura in cm',
        'Histogramm der Körpergrößen': 'Istogramma delle stature',
        'Sehr schmale Klassen zeigen fast nur Einzelwerte, sehr breite verwischen alles. Dazwischen erkennt man die Form der Verteilung.':
            'Classi molto strette mostrano quasi solo valori singoli, classi molto ampie confondono tutto. In mezzo si riconosce la forma della distribuzione.',
        // achsentrick (GY 7, block it-12, uses it too - keep one copy when merging)
        'Abgeschnittene Achse': 'Asse tagliato', 'Bild statt Balken': 'Immagine al posto della barra', 'Achse beginnt bei': 'L’asse parte da', 'Trick': 'Trucco',
        'Säulendiagramm Mitglieder eines Sportvereins': 'Diagramma a colonne: soci di una società sportiva',
        'Die Achse beginnt nicht bei null. Bei Säulen täuscht das immer, denn das Auge vergleicht ihre Höhen. In Liniendiagrammen ist ein späterer Achsenbeginn üblich, dann aber mit deutlichem Bruchzeichen.':
            'L’asse non parte da zero. Con le colonne questo inganna sempre, perché l’occhio ne confronta le altezze. Nei diagrammi a linee è normale che l’asse parta più in alto, ma allora con un segno di interruzione ben visibile.',
        'Achse ab null: Die Höhen sind ehrlich vergleichbar.': 'Asse da zero: le altezze si possono confrontare onestamente.',
        '2020: 100 Mio. €': '2020: 100 mln €', '2025: 200 Mio. €': '2025: 200 mln €',
        'Zwei Geldsymbole, das zweite doppelt so hoch und doppelt so breit': 'Due simboli di denaro, il secondo alto il doppio e largo il doppio',
        'Der Umsatz hat sich <b>verdoppelt</b>. Das rechte Bild ist doppelt so hoch, aber auch doppelt so breit.':
            'Il fatturato è <b>raddoppiato</b>. L’immagine di destra è alta il doppio, ma anche larga il doppio.',
        'Das Auge vergleicht Flächen: $2 \\cdot 2 = 4$, das Bild wirkt <b>viermal</b> so groß. Als Körper gezeichnet sogar $2^3 = 8$-mal.':
            'L’occhio confronta le aree: $2 \\cdot 2 = 4$, l’immagine sembra <b>quattro volte</b> più grande. Disegnata come solido, addirittura $2^3 = 8$ volte.',

        // book it-17 mathe7-it:

        // book it-19 mathe9-it:

    },
    phrase: [
        // book it-12 mathegy7-it:
        // achsentrick
        ['Mitglieder eines Sportvereins. Die letzte Säule <b>wirkt</b> ', 'Soci di una società sportiva. L’ultima colonna <b>sembra</b> '],
        ['-mal so hoch wie die erste.', ' volte più alta della prima.'], ['Tatsächlich: $', 'In realtà: $'], ['$, also ein Plus von ', '$, cioè un aumento del '],

        // book it-14 mathegy9-it:
        // mittelwerte
        ['Geordnet ($n = ', 'Ordinati ($n = '], ['keiner (jeder Wert kommt nur einmal vor)', 'nessuna (ogni valore compare una sola volta)'],
        // achsentrick
        ['Mitglieder eines Sportvereins. Die letzte Säule <b>wirkt</b> ', 'Soci di una società sportiva. L’ultima colonna <b>sembra</b> alta '],
        ['-mal so hoch wie die erste.', ' volte la prima.'], ['Tatsächlich: $\\tfrac{437}{412}', 'In realtà: $\\tfrac{437}{412}'], ['$, also ein Plus von ', '$, cioè un aumento del '],

        // book it-17 mathe7-it:

        // book it-19 mathe9-it:

    ],
    rule: [
        // book it-12 mathegy7-it:

        // book it-14 mathegy9-it:
        // mittelwerte: several modes "15 und 18 min" (only before "min", so "zwischen 2 und 3" of other books stays untouched)
        [/(\d) und (?=\d+(?: und \d+)* min\b)/g, '$1 e '],
        // histogramm: "8 Klassen der Breite 5 cm · häufigste Klasse $[165;\,170)$ mit 10 von 40 Werten (25,0 %)"
        [/(\d+) Klassen der Breite (\d+) cm · häufigste Klasse \$\[(\d+)(?:;\\,|, )(\d+)\)\$ mit (\d+) von (\d+) Werten \(/g,
            '$1 classi di ampiezza $2 cm · classe più frequente $[$3, $4)$ con $5 valori su $6 ('],

        // book it-17 mathe7-it:

        // book it-19 mathe9-it:

    ]
});
