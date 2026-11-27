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
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs daten/*)
        // book pt-11 mathegy7-pt:
        // achsentrick
        ['Tatsächlich: $', 'Na realidade: $'], ['$, also ein Plus von ', '$, ou seja, um aumento de '],
        // book pt-13 mathegy9-pt:
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-11 mathegy7-pt:
        // achsentrick: "Die letzte Säule wirkt 3,7-mal so hoch wie die erste."
        [/Mitglieder eines Sportvereins\. Die letzte Säule <b>wirkt<\/b> ([\d,]+)-mal so hoch wie die erste\./g,
            'Sócios de um clube desportivo. A última barra <b>parece</b> $1 vezes mais alta do que a primeira.'],
        // book pt-13 mathegy9-pt:
    ]
});
