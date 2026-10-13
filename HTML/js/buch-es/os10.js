/* js/buch-es/os10.js — Spanish for the widgets of js/buch-os10.js.
 * Loaded by the Spanish editions right after js/buch-os10.js; the engine and the shared words are in js/buch-es.js.
 *   word    a whole label → its Spanish
 *   phrase  German sentence pieces exactly as the widget source writes them → Spanish
 *   rule    word order and notation (after the point rules of js/buch-es.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-es/glosario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang es
 * Each book has its own block in each section (round 2, 13.10.2026): entries go right below the book's comment line,
 * every entry ends with a comma, so books translated at the same time merge without conflicts.
 */
window.BuchES && BuchES.add('os10', {
    word: {
        // book es mathe10-es (Curie)
        // stumpfos10: segment labels
        'Körper': 'Cuerpo', 'Material': 'Material', 'Zylinder': 'Cilindro',
        // titelbildos10
        'Titelbild: ein Dreieck mit den Winkeln α, β und γ, eine Sinuskurve, eine Exponentialkurve, ein Kegelstumpf und ein Würfel':
            'Portada: un triángulo con los ángulos α, β y γ, una sinusoide, una curva exponencial, un tronco de cono y un dado',
        // stumpfos10
        'Kegelstumpf': 'Tronco de cono',
        'Radius unten $R$': 'Radio inferior $R$', 'Kante unten $a_1$': 'Arista inferior $a_1$',
        'Radius oben $r$': 'Radio superior $r$', 'Kante oben $a_2$': 'Arista superior $a_2$',
        'Holz': 'Madera', 'Beton': 'Hormigón', 'Stahl': 'Acero', 'Höhe $h$': 'Altura $h$',
        'Kegelstumpf im Achsenschnitt und als Körper': 'Tronco de cono en sección axial y como cuerpo',
        'Pyramidenstumpf im Achsenschnitt und als Körper': 'Tronco de pirámide en sección axial y como cuerpo',
        // lohnos10
        'Rentenversicherung': 'Seguro de pensiones', 'Krankenversicherung': 'Seguro de enfermedad', 'Pflegeversicherung': 'Seguro de dependencia',
        'Arbeitslosen­versicherung': 'Seguro de desempleo',
        'Bruttolohn im Monat': 'Sueldo bruto mensual', 'Lohnsteuer (angenommen)': 'Impuesto sobre la renta (supuesto)',
        'Netto': 'Neto', 'Lohnsteuer': 'Impuesto sobre la renta', 'Sozialabgaben': 'Cotizaciones sociales', 'Arbeitgeberanteil': 'Cuota empresarial',
        'Bruttolohn aufgeteilt in Netto, Lohnsteuer und Sozialabgaben, rechts der gestrichelten Linie der Anteil des Arbeitgebers':
            'Sueldo bruto dividido en neto, impuesto sobre la renta y cotizaciones sociales; a la derecha de la línea discontinua, la parte de la empresa',
        'Posten': 'Concepto', 'Prozentsatz': 'Porcentaje', 'Betrag im Monat': 'Importe mensual', 'Nettolohn': 'Sueldo neto',

    },
    phrase: [
        // book es mathe10-es (Curie)
        // stumpfos10: the pieces of "Oben und unten gleich groß: das ist ein Zylinder, …"
        ['Oben und unten gleich groß: das ist ein ', 'Arriba y abajo del mismo tamaño: es un '], ['Zylinder', 'cilindro'], ['Quader mit quadratischer Grundfläche', 'ortoedro de base cuadrada'],
        // stumpfos10: the segment button and the sentences under the drawing
        ['Pyramidenstumpf', 'Tronco de pirámide'],
        ['Als Differenz: ', 'Como diferencia: '], ['ganzer Kegel', 'cono entero'], ['ganze Pyramide', 'pirámide entera'], [' (Höhe $', ' (altura $'],
        [' minus abgeschnittene Spitze ', ' menos la punta cortada '], ['Mantellinie $s = ', 'Generatriz $s = '], ['$ cm, Mantel $M = ', '$ cm, superficie lateral $M = '],
        ['Oben und unten gleich groß: das ist ein Zylinder', 'Arriba y abajo del mismo tamaño: es un cilindro'],
        ['Oben und unten gleich groß: das ist ein Quader mit quadratischer Grundfläche', 'Arriba y abajo del mismo tamaño: es un ortoedro de base cuadrada'],
        ['Holz (', 'Madera ('], ['Beton (', 'Hormigón ('], ['Stahl (', 'Acero ('], ['): Masse ', '): masa '],
        [' im Achsenschnitt und als Körper', ' en sección axial y como cuerpo'],
        // lohnos10: the legend under the bar and the sentence under the table
        ['Netto', 'Neto'], ['Lohnsteuer', 'Impuesto sobre la renta'], ['Sozialabgaben', 'Cotizaciones sociales'], ['Arbeitgeberanteil', 'Cuota empresarial'],
        ['gestrichelt: Ende des Bruttolohns ', 'discontinua: fin del sueldo bruto '],
        ['Alle Sätze sind angenommen und vereinfacht. Abzüge zusammen ', 'Todos los porcentajes son supuestos y simplificados. Deducciones en total: '],
        [' % des Bruttolohns. ', ' % del sueldo bruto. '],
        ['Der Betrieb zahlt die Sozialabgaben noch einmal als Arbeitgeberanteil: Die Stelle kostet ihn ',
            'La empresa paga las cotizaciones sociales otra vez como cuota empresarial: el puesto le cuesta '],
        [' € im Monat.', ' € al mes.'],

    ],
    rule: [
        // book es mathe10-es (Curie)

    ]
});
