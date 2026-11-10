/* js/buch-pt/gy12.js — Portuguese for the widgets of js/buch-gy12.js.
 * Loaded by the Portuguese editions right after js/buch-gy12.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package pt2-prep (08.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('gy12', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs gy12/*)
        // book pt-5 mathe13lk-pt:
        // summen (lb3-2): Untersumme / Obersumme = soma inferior / superior (the letters U_n, O_n stay as the widget draws them);
        // the methods as in numerik.js (pt-1), which lb3-2 does not load
        'f(x) = sin x': 'f(x) = sen x', 'Rechtecke links': 'Retângulos à esquerda', 'Rechtecke rechts': 'Retângulos à direita',
        'Rechtecke Mitte': 'Retângulos ao centro', 'Trapeze': 'Trapézios', 'Verfahren': 'Método', 'Anzahl der Streifen $n$': 'Número de faixas $n$',
        'Streifen unter einem Funktionsgraphen': 'Faixas sob o gráfico de uma função', 'Näherung': 'Aproximação', 'Fehler': 'Erro',
        'Hier ist das Verfahren schon exakt.': 'Aqui o método já é exato.',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs gy12/*)
        // book pt-5 mathe13lk-pt:
        // summen
        ['Untersumme (grün) $U_{', 'Soma inferior (verde) $U_{'], ['$ · Obersumme (rot, darüber) $O_{', '$ · soma superior (vermelho, por cima) $O_{'],
        ['$ · Unterschied $', '$ · diferença $'], ['Dazwischen liegt immer $', 'Entre as duas está sempre $'],
        ['$. Je mehr Streifen, desto näher rücken $U_n$ und $O_n$ zusammen; ihr gemeinsamer Grenzwert ist das Integral.',
            '$. Quanto mais faixas, mais próximas ficam $U_n$ e $O_n$; o seu limite comum é o integral.'],
        ['Rechtecke links mit $n = ', 'Retângulos à esquerda com $n = '], ['Rechtecke rechts mit $n = ', 'Retângulos à direita com $n = '],
        ['Rechtecke Mitte mit $n = ', 'Retângulos ao centro com $n = '], ['Trapeze mit $n = ', 'Trapézios com $n = '],
        ['$ · genauer Wert $', '$ · valor exato $'], [' (ohne Stammfunktion, nur numerisch)', ' (sem primitiva, só numericamente)'],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-5 mathe13lk-pt:
        // summen: "Doppelt so viele Streifen: Der Fehler wird etwa um den Faktor $2{,}0$ kleiner."
        [/Doppelt so viele Streifen: Der Fehler wird etwa um den Faktor \$([^$]*)\$ kleiner\./g, 'Com o dobro das faixas, o erro fica cerca de $$$1$$ vezes menor.'],
    ]
});
