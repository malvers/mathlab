/* js/buch-pt/numerik.js — Portuguese for the widgets of js/buch-numerik.js.
 * Loaded by the Portuguese editions right after js/buch-numerik.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3 (08.11.2026): what every book needs goes below the pt0 line, what one book needs below its own comment
 * line, every entry ending with a comma. Search the dictionaries before writing a string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('numerik', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs numerik/*)
        // book pt-1 mathe11-pt:
        // bisektion, flaeche, mc-flaeche
        'Bisektionsverfahren': 'Método da bissecção', 'Intervall halbieren': 'Dividir o intervalo ao meio', '5 Schritte': '5 passos',
        'Schritt': 'Passo', 'Mitte $m$': 'Ponto médio $m$', 'Breite': 'Amplitude',
        'x² auf [0; 2]': 'x² em [0, 2]', '√x auf [0; 4]': '√x em [0, 4]', 'sin x auf [0; π]': 'sen x em [0, π]',
        'Rechtecke links': 'Retângulos à esquerda', 'Rechtecke Mitte': 'Retângulos ao centro', 'Trapeze': 'Trapézios', 'Verfahren': 'Método',
        'Anzahl der Streifen $n$': 'Número de faixas $n$', 'Flächeninhalt mit Streifen angenähert': 'Área aproximada por faixas',
        '+100 Punkte': '+100 pontos', '+1 000 Punkte': '+1 000 pontos', '+10 000 Punkte': '+10 000 pontos',   // narrow space as the widget writes it
        'Zufallspunkte im Rechteck, Treffer unter der Parabel': 'Pontos aleatórios no retângulo, acertos abaixo da parábola',
        // book pt-3 mathe13-pt:
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs numerik/*)
        // book pt-1 mathe11-pt:
        // bisektion, flaeche, mc-flaeche
        [' · Startintervall $', ' · intervalo inicial $'], ['$ mit $f(', '$ com $f('], ['$ und $f(', '$ e $f('],
        ['Näherung mit $n = ', 'Aproximação com $n = '], [' · genauer Wert $', ' · valor exato $'], [' · Fehler $', ' · erro $'],
        ['$ · genauer Wert $', '$ · valor exato $'], ['$ · Fehler $', '$ · erro $'],
        ['$ unter der Parabel. Rechteck: ', '$ estão abaixo da parábola. Retângulo: '],
        ['Schätzwert: $A', 'Estimativa: $A'], [' · genau: $', ' · exato: $'], ['Wirf Zufallspunkte in das Rechteck ', 'Lança pontos aleatórios no retângulo '],
        ['. Der Anteil der Treffer unter ', '. A proporção de acertos abaixo de '], [' schätzt den Anteil der Fläche.', ' estima a proporção da área.'],
        // book pt-3 mathe13-pt:
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-1 mathe11-pt:
        // mc-flaeche "Von $500$ Punkten liegen $160$ unter …" → "Dos $500$ pontos, $160$ estão abaixo …"
        [/Von \$(\d+)\$ Punkten liegen \$/g, (m, n) => 'Dos $' + n + '$ pontos, $'],
        // book pt-3 mathe13-pt:
    ]
});
