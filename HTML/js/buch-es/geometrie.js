/* js/buch-es/geometrie.js — Spanish for the widgets of js/buch-geometrie.js.
 * Loaded by the Spanish editions right after js/buch-geometrie.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('geometrie', {
    word: {
        // book es mathegy5-es (Einstein)

        // book es mathegy6-es (Einstein)

        // book es mathegy7-es (Einstein)

        // book es mathegy8-es (Curie)

        // book es mathe10-es (Curie)
        // spitzkoerper
        'Quadratische Pyramide': 'Pirámide cuadrangular', 'Kreiskegel': 'Cono', 'Körper': 'Cuerpo', 'Seitenhöhe': 'Apotema', 'Seitenkante': 'Arista lateral',
        'Hilfsdreieck': 'Triángulo auxiliar', 'Grundkante $a$': 'Arista de la base $a$', 'Höhe $h$': 'Altura $h$', 'Radius $r$': 'Radio $r$',
        'Quadratische Pyramide im Schrägbild mit Hilfsdreieck': 'Pirámide cuadrangular en perspectiva caballera con triángulo auxiliar',
        'Kreiskegel im Schrägbild mit Hilfsdreieck': 'Cono en perspectiva caballera con triángulo auxiliar',
        // trigo
        'Sinus': 'Seno', 'Kosinus': 'Coseno', 'Tangens': 'Tangente', 'Verhältnis': 'Razón', 'Winkel $\\alpha$': 'Ángulo $\\alpha$', 'Hypotenuse $c$': 'Hipotenusa $c$',
        'Gegenkathete a': 'cateto opuesto a', 'Ankathete b': 'cateto contiguo b', 'Hypotenuse c': 'hipotenusa c',
        'Rechtwinkliges Dreieck mit Winkel alpha': 'Triángulo rectángulo con el ángulo alfa',
        'Ändere $c$: Das Dreieck wird größer oder kleiner, die drei Verhältnisse bleiben gleich. Sie hängen nur vom Winkel ab.':
            'Cambia $c$: el triángulo se hace más grande o más pequeño, pero las tres razones no cambian. Solo dependen del ángulo.',
        // vieleck
        'Ecken verdoppeln': 'Duplicar los vértices', 'Zurück auf 6': 'Volver a 6', 'Anzahl der Ecken $n$': 'Número de vértices $n$',
        'Kreis mit einbeschriebenem und umbeschriebenem Vieleck': 'Circunferencia con un polígono inscrito y otro circunscrito', 'innen': 'inscrito', 'außen': 'circunscrito',
        'Kreis mit $r = 1$, also $u = 2\\pi$. Umfang durch $2$:': 'Circunferencia con $r = 1$, por tanto $u = 2\\pi$. Perímetro dividido entre $2$:',

        // book es mathegy9-es (Curie)

    },
    phrase: [
        // book es mathegy5-es (Einstein)

        // book es mathegy6-es (Einstein)

        // book es mathegy7-es (Einstein)

        // book es mathegy8-es (Curie)

        // book es mathe10-es (Curie)
        // spitzkoerper
        [' im Schrägbild mit Hilfsdreieck', ' en perspectiva caballera con triángulo auxiliar'],
        // trigo
        ['\\text{Gegenkathete}', '\\text{cateto opuesto}'], ['\\text{Ankathete}', '\\text{cateto contiguo}'], ['\\text{Hypotenuse}', '\\text{hipotenusa}'],
        // vieleck
        ['Also $', 'Por tanto $'], ['$, Abstand $', '$, diferencia $'],

        // book es mathegy9-es (Curie)

    ],
    rule: [
        // book es mathegy5-es (Einstein)

        // book es mathegy6-es (Einstein)

        // book es mathegy7-es (Einstein)

        // book es mathegy8-es (Curie)

        // book es mathe10-es (Curie)

        // book es mathegy9-es (Curie)

    ]
});
