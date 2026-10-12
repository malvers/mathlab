/* js/buch-es/numerik.js — Spanish for the widgets of js/buch-numerik.js.
 * Loaded by the Spanish editions right after js/buch-numerik.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 */
window.BuchES && BuchES.add('numerik', {
    word: {
        // book es-1 mathe11-es: bisektion, flaeche, mc-flaeche
        'Bisektionsverfahren': 'Método de bisección', 'Intervall halbieren': 'Partir el intervalo', '5 Schritte': '5 pasos',
        'Schritt': 'Paso', 'Mitte $m$': 'Punto medio $m$', 'Breite': 'Anchura',
        'x² auf [0; 2]': 'x² en [0, 2]', '√x auf [0; 4]': '√x en [0, 4]', 'sin x auf [0; π]': 'sin x en [0, π]',
        'Rechtecke links': 'Rectángulos izq.', 'Rechtecke Mitte': 'Rectángulos centro', 'Trapeze': 'Trapecios', 'Verfahren': 'Método',
        'Anzahl der Streifen $n$': 'Número de franjas $n$', 'Flächeninhalt mit Streifen angenähert': 'Área aproximada con franjas',
        '+100 Punkte': '+100 puntos', '+1\u202f000 Punkte': '+1\u202f000 puntos', '+10\u202f000 Punkte': '+10\u202f000 puntos',   // narrow space as the widget writes it
        'Zufallspunkte im Rechteck, Treffer unter der Parabel': 'Puntos aleatorios en el rectángulo y los que quedan bajo la parábola',
    },
    phrase: [
        // book es-1 mathe11-es: bisektion, flaeche, mc-flaeche
        [' · Startintervall $', ' · intervalo inicial $'], ['$ mit $f(', '$ con $f('], ['$ und $f(', '$ y $f('],
        ['Näherung mit $n = ', 'Aproximación con $n = '], [' · genauer Wert $', ' · valor exacto $'], [' · Fehler $', ' · error $'],
        ['$ unter der Parabel. Rechteck: ', '$ quedan bajo la parábola. Rectángulo: '],
        ['Schätzwert: $A', 'Estimación: $A'], [' · genau: $', ' · exacto: $'], ['Wirf Zufallspunkte in das Rechteck ', 'Lanza puntos aleatorios en el rectángulo '],
        ['. Der Anteil der Treffer unter ', '. La proporción de puntos bajo '], [' schätzt den Anteil der Fläche.', ' estima la proporción del área.'],
    ],
    rule: [
        // book es-1 mathe11-es: mc-flaeche "Von $500$ Punkten liegen $160$ unter …" → "De $500$ puntos, $160$ quedan bajo …"
        [/Von \$(\d+)\$ Punkten liegen \$/g, (m, n) => 'De $' + n + '$ puntos, $'],
    ]
});
