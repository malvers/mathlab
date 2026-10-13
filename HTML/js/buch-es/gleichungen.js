/* js/buch-es/gleichungen.js — Spanish for the widgets of js/buch-gleichungen.js.
 * Loaded by the Spanish editions right after js/buch-gleichungen.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 */
window.BuchES && BuchES.add('gleichungen', {
    word: {
        // book es-1 mathe11-es: waage, binom, koerper
        'z. B. −3 oder :4 oder −2x': 'p. ej. −3 o :4 o −2x', 'Anwenden': 'Aplicar', 'Neue Gleichung': 'Nueva ecuación',
        'Länge $a$': 'Longitud $a$', 'Länge $b$': 'Longitud $b$', 'Quadrat mit Seitenlänge a + b': 'Cuadrado de lado a + b',
        'Zylinder': 'Cilindro', 'Kegel': 'Cono', 'Kugel': 'Esfera', 'Körper': 'Cuerpo', 'Radius $r$ in cm': 'Radio $r$ en cm',
        'Höhe $h$ in cm': 'Altura $h$ en cm', 'Skizze des Körpers': 'Esquema del cuerpo',

        // book es mathegy7-es (Einstein)

        // book es mathegy8-es (Curie)
        // ungleichung
        'Relationszeichen': 'Signo de desigualdad', '$a$ (Zahl vor dem $x$)': '$a$ (número delante de $x$)', '$c$ (rechte Seite)': '$c$ (segundo miembro)',
        'durch eine negative Zahl: Das Zeichen dreht sich um!': 'entre un número negativo: ¡el signo se invierte!',
        'Zahlenstrahl mit der Lösungsmenge': 'Recta numérica con el conjunto solución', 'Probe': 'Prueba', 'wahr': 'verdadero', 'falsch': 'falso',

        // book es mathegy9-es (Curie)

        // book es mathefos11-es (Lovelace)

    },
    phrase: [
        // book es-1 mathe11-es: waage
        ['Gelöst: $x = ', 'Resuelto: $x = '], ['$. Mach die Probe: Setz den Wert in die erste Zeile ein.', '$. Haz la comprobación: sustituye el valor en la primera línea.'],
        ['Beide Seiten sind gleich: Jede Zahl ist Lösung, ', 'Los dos lados son iguales: todo número es solución, '],
        ['Widerspruch: Es gibt keine Lösung, ', 'Contradicción: no hay solución, '],
        ['Schreib die Umformung, die du auf <b>beide</b> Seiten anwenden willst.', 'Escribe la transformación que quieres aplicar a <b>los dos</b> lados.'],
        ['Das verstehe ich nicht. Beispiele: ', 'No lo entiendo. Ejemplos: '], ['Hinter dem Rechenzeichen fehlt eine Zahl.', 'Falta un número detrás del signo de operación.'],
        ['Mit $x$ multiplizieren oder durch $x$ teilen ist keine sichere Umformung, $x$ könnte $0$ sein.', 'Multiplicar por $x$ o dividir entre $x$ no es una transformación segura: $x$ podría ser $0$.'],
        ['Durch $0$ darf man nicht teilen.', 'No se puede dividir entre $0$.'],
        ['Mit $0$ multiplizieren macht aus jeder Gleichung $0 = 0$, dabei geht die Information verloren.', 'Multiplicar por $0$ convierte cualquier ecuación en $0 = 0$ y se pierde la información.'],
        ['Bring alle $x$ auf eine Seite: ', 'Pasa todas las $x$ a un lado: '], ['Bring die Zahl auf die andere Seite: ', 'Pasa el número al otro lado: '],
        ['Teile durch die Zahl vor dem $x$: ', 'Divide entre el número que multiplica a $x$: '],
        // book es-1 mathe11-es: binom, koerper ($M$ and $O$ stay as in the chapter text of lb2)
        ['Der häufigste Fehler: ', 'El error más frecuente: '], ['. Im Bild fehlen dann die beiden blauen Rechtecke, hier ', '. En la figura faltan entonces los dos rectángulos azules, aquí '],
        ['Mantellinie $s = ', 'Generatriz $s = '],

        // book es mathegy7-es (Einstein)

        // book es mathegy8-es (Curie)
        // ungleichung
        ['heißt $', 'significa $'], ['Das stimmt für jede Zahl: ', 'Se cumple para todo número: '], ['Das stimmt für keine Zahl: ', 'No se cumple para ningún número: '],
        ['Zieh die <b>Probe</b> über den Zahlenstrahl. $x = ', 'Arrastra la <b>prueba</b> por la recta numérica. $x = '], ['$ ist ', '$ es '],
        [': Die Zahl gehört zur Lösungsmenge.', ': el número pertenece al conjunto solución.'], [': Die Zahl gehört nicht dazu.', ': el número no pertenece a él.'],

        // book es mathegy9-es (Curie)

        // book es mathefos11-es (Lovelace)

    ],
    rule: [

        // book es mathegy7-es (Einstein)

        // book es mathegy8-es (Curie)

        // book es mathegy9-es (Curie)

        // book es mathefos11-es (Lovelace)

    ]
});
