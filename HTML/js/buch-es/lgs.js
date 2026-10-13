/* js/buch-es/lgs.js — Spanish for the widgets of js/buch-lgs.js.
 * Loaded by the Spanish editions right after js/buch-lgs.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 */
window.BuchES && BuchES.add('lgs', {
    word: {
        // book es-1 mathe11-es: gauss, geraden, matrizen, pagerank
        'Ausführen': 'Aplicar', 'Nächster Schritt': 'Siguiente paso', 'Neues LGS': 'Nuevo sistema',
        'Zeile + k · Zeile': 'fila + k · fila', 'Zeile · k': 'fila · k', 'tauschen': 'intercambiar', 'Zielzeile': 'Fila de destino', 'zweite Zeile': 'Segunda fila', 'Faktor k': 'Factor k',
        'Ziel I': 'destino I', 'Ziel II': 'destino II', 'Ziel III': 'destino III', 'mit I': 'con I', 'mit II': 'con II', 'mit III': 'con III',
        'eine Lösung': 'una solución', 'keine Lösung': 'ninguna solución', 'unendlich viele': 'infinitas', 'Zwei Geraden': 'Dos rectas',
        'mit $r =$': 'con $r =$', 'Neue Matrizen': 'Nuevas matrices', 'Wähle eine Rechnung.': 'Elige una operación.',
        '1 Schritt': '1 paso', '10 Schritte': '10 pasos', 'Vier Webseiten und ihre Links': 'Cuatro páginas web y sus enlaces',

        // book es mathegy8-es (Curie)

        // book es mathegy11-es (Turing)

        // book es mathegy11lk-es (Turing)

        // book es mathefos11-es (Lovelace)

        // book es mathefos12-es (Lovelace)

    },
    phrase: [
        // book es-1 mathe11-es: gauss, geraden, matrizen, pagerank
        ['Fertig: $x = ', 'Listo: $x = '],
        ['Stufenform erreicht. Jetzt kannst du von unten nach oben einsetzen oder mit „Nächster Schritt“ weiter umformen (Gauß-Jordan).',
            'Forma escalonada alcanzada. Ahora puedes sustituir de abajo arriba o seguir transformando con «Siguiente paso» (Gauss-Jordan).'],
        ['Wähle eine Umformung und führe sie aus, oder lass dir mit „Nächster Schritt“ helfen.', 'Elige una transformación y aplícala, o deja que «Siguiente paso» te ayude.'],
        ['Wähle zwei verschiedene Zeilen.', 'Elige dos filas distintas.'], ['Gib für $k$ eine Zahl ein, z. B. -2 oder 1/3.', 'Introduce un número para $k$, p. ej. -2 o 1/3.'],
        ['Mit $0$ multiplizieren ist keine Äquivalenzumformung.', 'Multiplicar por $0$ no es una transformación equivalente.'],
        ['Eine Zeile zu sich selbst zu addieren ändert die Lösungsmenge. Wähle eine andere Zeile.', 'Sumar una fila a sí misma cambia el conjunto solución. Elige otra fila.'],
        ['Gleichung I ist fest: ', 'La ecuación I es fija: '], ['. Verändere Gleichung II: ', '. Cambia la ecuación II: '],
        ['Gleichung II lautet $0 = 0$, sie schränkt nichts ein.', 'La ecuación II dice $0 = 0$: no impone ninguna condición.'], ['Gleichung II lautet $0 = ', 'La ecuación II dice $0 = '],
        ['$: ein Widerspruch, keine Lösung.', '$: una contradicción, no hay solución.'],
        ['<b>Genau eine Lösung</b>: Die Geraden schneiden sich in $S(', '<b>Exactamente una solución</b>: las rectas se cortan en $S('],
        ['<b>Unendlich viele Lösungen</b>: Beide Gleichungen beschreiben dieselbe Gerade.', '<b>Infinitas soluciones</b>: las dos ecuaciones describen la misma recta.'],
        ['<b>Keine Lösung</b>: Die Geraden sind parallel und verschieden.', '<b>Ninguna solución</b>: las rectas son paralelas y distintas.'],
        ['Gleiche Stellen werden addiert.', 'Se suman las entradas que ocupan la misma posición.'], ['Gleiche Stellen werden subtrahiert.', 'Se restan las entradas que ocupan la misma posición.'],
        ['Jeder Eintrag wird mit $r$ multipliziert.', 'Cada entrada se multiplica por $r$.'],
        ['Aus Zeilen werden Spalten: aus einer $2 \\times 3$- wird eine $3 \\times 2$-Matrix.', 'Las filas pasan a ser columnas: una matriz $2 \\times 3$ se convierte en una $3 \\times 2$.'],
        ['Summe: $', 'Suma: $'],

        // book es mathegy8-es (Curie)

        // book es mathegy11-es (Turing)

        // book es mathegy11lk-es (Turing)

        // book es mathefos11-es (Lovelace)

        // book es mathefos12-es (Lovelace)

    ],
    rule: [
        // book es-1 mathe11-es: gauss, pagerank
        [/In Spalte (\d) gibt es keinen Pivot mehr: Das LGS hat keine oder unendlich viele Lösungen\./g,
            'En la columna $1 ya no hay pivote: el sistema no tiene solución o tiene infinitas.'],
        [/Schritt (\d+):/g, 'Paso $1:'],

        // book es mathegy8-es (Curie)

        // book es mathegy11-es (Turing)

        // book es mathegy11lk-es (Turing)

        // book es mathefos11-es (Lovelace)

        // book es mathefos12-es (Lovelace)

    ]
});
