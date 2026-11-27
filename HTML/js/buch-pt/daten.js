/* js/buch-pt/daten.js — Portuguese for the widgets of js/buch-daten.js.
 * Loaded by the Portuguese editions right after js/buch-daten.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3-11-prep (27.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('daten', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs daten/*)
        // book pt-11 mathegy7-pt:
        // achsentrick (also on the GY 9 pages)
        'Abgeschnittene Achse': 'Eixo cortado', 'Bild statt Balken': 'Imagem em vez de barras', 'Achse beginnt bei': 'O eixo começa em', 'Trick': 'Truque',
        'Säulendiagramm Mitglieder eines Sportvereins': 'Gráfico de barras: sócios de um clube desportivo',
        'Die Achse beginnt nicht bei null. Bei Säulen täuscht das immer, denn das Auge vergleicht ihre Höhen. In Liniendiagrammen ist ein späterer Achsenbeginn üblich, dann aber mit deutlichem Bruchzeichen.':
            'O eixo não começa no zero. Com barras, isso engana sempre, porque o olho compara as alturas. Nos gráficos de linhas é habitual o eixo começar mais acima, mas então com um sinal de corte bem visível.',
        'Achse ab null: Die Höhen sind ehrlich vergleichbar.': 'Eixo a partir do zero: as alturas podem comparar-se honestamente.',
        '2020: 100 Mio. €': '2020: 100 M€', '2025: 200 Mio. €': '2025: 200 M€',
        'Zwei Geldsymbole, das zweite doppelt so hoch und doppelt so breit': 'Dois símbolos de dinheiro, o segundo com o dobro da altura e o dobro da largura',
        'Der Umsatz hat sich <b>verdoppelt</b>. Das rechte Bild ist doppelt so hoch, aber auch doppelt so breit.':
            'As vendas <b>duplicaram</b>. A imagem da direita tem o dobro da altura, mas também o dobro da largura.',
        'Das Auge vergleicht Flächen: $2 \\cdot 2 = 4$, das Bild wirkt <b>viermal</b> so groß. Als Körper gezeichnet sogar $2^3 = 8$-mal.':
            'O olho compara áreas: $2 \\times 2 = 4$, a imagem parece <b>quatro vezes</b> maior. Desenhada como um sólido, até $2^3 = 8$ vezes.',
        // book pt-13 mathegy9-pt:
        // mittelwerte (chapter 4): moda, mediana, média; valor atípico (achsentrick is translated by pt-11, not here)
        'Ausreißer dazu (75 min)': 'Juntar um valor atípico (75 min)', 'Ausreißer weg': 'Retirar o valor atípico', 'Fahrzeit in min': 'Tempo de caminho em min',
        'Median': 'Mediana', 'Mittelwert': 'Média', 'Modalwert': 'Moda',
        'Punktdiagramm der Fahrzeiten mit Median und Mittelwert': 'Diagrama de pontos dos tempos de caminho, com a mediana e a média',
        'Zieh die Punkte. Ein einzelner weiter Weg verschiebt den Mittelwert deutlich, den Median kaum.':
            'Arrasta os pontos. Um único caminho longo desloca bastante a média e quase nada a mediana.',
        // streuung: amplitude, variância s², desvio padrão s
        'Streuung von B': 'Dispersão de B', 'Monatsmittel in °C': 'Média mensal em °C',
        'Stadt am Meer': 'Cidade à beira-mar', 'Stadt im Binnenland': 'Cidade do interior',
        'A · STADT AM MEER': 'A · CIDADE À BEIRA-MAR', 'B · STADT IM BINNENLAND': 'B · CIDADE DO INTERIOR',
        'Zwei Datenreihen mit gleichem Mittelwert und unterschiedlicher Streuung': 'Duas séries de dados com a mesma média e dispersões diferentes',
        'Spannweite': 'Amplitude', 'Varianz $s^2$': 'Variância $s^2$',
        'Gleiches Jahresmittel, ganz anderes Klima. Der helle Streifen reicht von $\\bar{x} - s$ bis $\\bar{x} + s$. Modellwerte, keine Messdaten.':
            'A mesma média anual, um clima completamente diferente. A faixa clara vai de $\\bar{x} - s$ a $\\bar{x} + s$. Valores de um modelo, não medições.',
        // histogramm: classes [150, 155[ (the sentence below is a rule)
        'absolute Häufigkeit': 'Frequência absoluta', 'relative Häufigkeit': 'Frequência relativa', 'Häufigkeit': 'Frequência',
        'Klassenbreite': 'Amplitude das classes', 'Erste Klasse ab': 'Primeira classe a partir de', 'Körpergröße in cm': 'Altura em cm',
        'Histogramm der Körpergrößen': 'Histograma das alturas',
        'Sehr schmale Klassen zeigen fast nur Einzelwerte, sehr breite verwischen alles. Dazwischen erkennt man die Form der Verteilung.':
            'Classes muito estreitas mostram quase só valores isolados, classes muito largas apagam tudo. Entre umas e outras reconhece-se a forma da distribuição.',
        // book pt-16 mathe7-pt:
        // book pt-18 mathe9-pt:
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs daten/*)
        // book pt-11 mathegy7-pt:
        // achsentrick
        ['Tatsächlich: $', 'Na realidade: $'], ['$, also ein Plus von ', '$, ou seja, um aumento de '],
        // book pt-13 mathegy9-pt:
        // mittelwerte: "Geordnet ($n = 9$): …", "keiner …" (several modes "15 und 18 min": a rule below)
        ['Geordnet ($n = ', 'Ordenados ($n = '], ['keiner (jeder Wert kommt nur einmal vor)', 'nenhuma (cada valor aparece só uma vez)'],
        // book pt-16 mathe7-pt:
        // book pt-18 mathe9-pt:
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-11 mathegy7-pt:
        // achsentrick: "Die letzte Säule wirkt 3,7-mal so hoch wie die erste."
        [/Mitglieder eines Sportvereins\. Die letzte Säule <b>wirkt<\/b> ([\d,]+)-mal so hoch wie die erste\./g,
            'Sócios de um clube desportivo. A última barra <b>parece</b> $1 vezes mais alta do que a primeira.'],
        // book pt-13 mathegy9-pt:
        // mittelwerte: several modes "15 und 18 min", "8 und 15 und 30 min" (only numbers followed by min)
        [/(\d) und (?=\d+(?: und \d+)* min\b)/g, '$1 e '],
        // histogramm: "8 Klassen der Breite 5 cm · häufigste Klasse $[165;\,170)$ mit 10 von 40 Werten (" - Portuguese classes [165, 170[
        [/(\d+) Klassen der Breite (\d+) cm · häufigste Klasse \$\[(\d+);\\,(\d+)\)\$ mit (\d+) von (\d+) Werten \(/g,
            (m, k, w, a, b, c, n) => k + ' classes de amplitude ' + w + ' cm · classe mais frequente $[' + a + ', ' + b + '[$ com ' + c + ' de ' + n + ' valores ('],
        // book pt-16 mathe7-pt:
        // book pt-18 mathe9-pt:
    ]
});
