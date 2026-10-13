/* js/buch-es/gy12.js — Spanish for the widgets of js/buch-gy12.js.
 * Loaded by the Spanish editions right after js/buch-gy12.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('gy12', {
    word: {
        // book es mathegy12-es (Turing)
        // schaetzen
        'Stichprobenumfang $n$': 'Tamaño de la muestra $n$', 'Neue Stichprobe': 'Nueva muestra', '+1000 Stichproben': '+1000 muestras', 'Anzahl': 'Número',
        'Füllmengen der Stichprobe als Punktdiagramm mit ihrem Mittelwert und dem Sollwert': 'Cantidades de llenado de la muestra como diagrama de puntos, con su media y el valor nominal',
        'Sollwert': 'valor nominal',
        // summen: the same words as js/buch-es/numerik.js (widget flaeche)
        'f(x) = sin x': 'f(x) = sen x',
        'Rechtecke links': 'Rect. por la izquierda', 'Rechtecke rechts': 'Rect. por la derecha', 'Rechtecke Mitte': 'Rect. del punto medio', 'Trapeze': 'Trapecios',
        'Verfahren': 'Método', 'Anzahl der Streifen $n$': 'Número de franjas $n$', 'Streifen unter einem Funktionsgraphen': 'Franjas bajo la gráfica de una función',
        'Näherung': 'Aproximación', 'Fehler': 'Error', 'Hier ist das Verfahren schon exakt.': 'Aquí el método ya es exacto.',

        // book es mathegy12lk-es (Turing)

    },
    phrase: [
        // book es mathegy12-es (Turing)
        // schaetzen
        [' Werte)', ' valores)'], ['Stichprobe: ', 'Muestra: '], ['Im Mittel über ', 'Como media de '], [' Stichproben: $', ' muestras: $'], ['(wahr: ', '(real: '],
        ['$s^2$ mit $\\tfrac{1}{n-1}$: $', '$s^2$ con $\\tfrac{1}{n-1}$: $'], ['$, mit $\\tfrac1n$: $', '$, con $\\tfrac1n$: $'],
        ['Die Division durch $n$ liegt im Mittel um den Faktor $\\tfrac{n-1}{n} = ', 'Al dividir entre $n$ se obtiene, de media, un valor demasiado bajo en el factor $\\tfrac{n-1}{n} = '],
        ['$ zu tief.', '$.'],
        ['Die Anlage füllt im Mittel $\\mu = ', 'La máquina llena de media $\\mu = '], ['$ ml mit der Standardabweichung $\\sigma = ', '$ ml con la desviación típica $\\sigma = '],
        ['$ ml ab. Das weiß die Prüferin aber nicht: Sie schätzt beides aus der Stichprobe.', '$ ml. Pero la inspectora no lo sabe: estima las dos cosas a partir de la muestra.'],
        // summen: the letters U_n and O_n stay as in the German book
        ['Untersumme (grün) $U_{', 'Suma inferior (verde) $U_{'], ['$ · Obersumme (rot, darüber) $O_{', '$ · suma superior (roja, encima) $O_{'], ['$ · Unterschied $', '$ · diferencia $'],
        ['Dazwischen liegt immer $', 'Entre las dos está siempre $'],
        ['$. Je mehr Streifen, desto näher rücken $U_n$ und $O_n$ zusammen; ihr gemeinsamer Grenzwert ist das Integral.',
            '$. Cuantas más franjas, más se acercan $U_n$ y $O_n$; su límite común es la integral.'],
        ['Rechtecke links mit $n = ', 'Rectángulos por la izquierda con $n = '], ['Rechtecke rechts mit $n = ', 'Rectángulos por la derecha con $n = '],
        ['Rechtecke Mitte mit $n = ', 'Rectángulos del punto medio con $n = '], ['Trapeze mit $n = ', 'Trapecios con $n = '], ['$ · genauer Wert $', '$ · valor exacto $'],
        [' (ohne Stammfunktion, nur numerisch)', ' (sin primitiva, solo numéricamente)'],
        ['Doppelt so viele Streifen: Der Fehler wird etwa um den Faktor $', 'Con el doble de franjas, el error se divide aproximadamente entre $'], ['$ kleiner.', '$.'],

        // book es mathegy12lk-es (Turing)

    ],
    rule: [
        // book es mathegy12-es (Turing)

        // book es mathegy12lk-es (Turing)

    ]
});
