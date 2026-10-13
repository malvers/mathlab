/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Oberschule 10" (buch/mathe10/, Realschulbildungsgang), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe10.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlpflichtbereich 3; 4 Ustd./week, 80 + 8 Ustd.).
 * Doc, 13.10.2026: Spanish round 2 (Lovelace orchestrates, Curie translates). Terms as in tools/buch-es/glosario.md.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matemáticas · Oberschule 10',
    short: 'Matemáticas OS 10',
    lang: 'es',
    druck: false,
    description: 'Libro de texto interactivo de matemáticas para la Oberschule (escuela secundaria sajona), 10.º curso, itinerario de Realschule (Sajonia): triángulos y polígonos con el teorema del seno y el del coseno, funciones potencia, exponenciales y seno, variables aleatorias y esperanza, sueldo, ahorro y crédito, cuerpos con troncos de pirámide y de cono, resolución de problemas para el examen final y topografía, con laboratorios, simulaciones y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizaje 1', k: '1.1', title: 'Triángulos, cuadriláteros y trigonometría',
          sub: 'La casa de los cuadriláteros, sumas de ángulos, seno, coseno y tangente en figuras', when: 'Agosto · septiembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Área de aprendizaje 1', k: '1.2', title: 'Teorema del seno y teorema del coseno',
          sub: 'Lados y ángulos en triángulos cualesquiera, determinar distancias', when: 'Septiembre', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Área de aprendizaje 1', k: '1.3', title: 'Áreas de triángulos y polígonos',
          sub: 'El área con el seno, polígonos regulares, calcular terrenos', when: 'Septiembre · octubre', ustd: 4 },
        { file: 'lb2-1.html', lb: 'Área de aprendizaje 2', k: '2.1', title: 'Funciones potencia',
          sub: 'Parábolas e hipérbolas, simetría, asíntotas, proporcionalidad inversa', when: 'Noviembre', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Área de aprendizaje 2', k: '2.2', title: 'Funciones exponenciales',
          sub: 'Crecimiento y decrecimiento, factor de crecimiento, interés compuesto, semivida', when: 'Noviembre', ustd: 4 },
        { file: 'lb2-3.html', lb: 'Área de aprendizaje 2', k: '2.3', title: 'La función seno',
          sub: 'Radianes, circunferencia goniométrica, amplitud y período, las funciones de un vistazo', when: 'Noviembre · diciembre', ustd: 8 },
        { file: 'lb3.html', lb: 'Área de aprendizaje 3', k: '3', title: 'Variables aleatorias y esperanza',
          sub: 'Distribución de probabilidad, esperanza, juegos justos, simulación y riesgo', when: 'Diciembre · enero', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Área de aprendizaje 4', k: '4.1', title: 'El dinero en la vida diaria',
          sub: 'Sueldo y deducciones, presupuesto doméstico, ahorro, crédito y la trampa de las deudas', when: 'Enero', ustd: 8 },
        { file: 'lb4-2.html', lb: 'Área de aprendizaje 4', k: '4.2', title: 'Cuerpos y troncos',
          sub: 'Prisma, cilindro, pirámide, cono y esfera, troncos de pirámide y de cono, masa y costes', when: 'Febrero · marzo', ustd: 8 },
        { file: 'lb4-3.html', lb: 'Área de aprendizaje 4', k: '4.3', title: 'Resolver problemas',
          sub: 'Probabilidad y funciones en la vida diaria, conocimientos básicos sin calculadora, en forma para el examen', when: 'Marzo', ustd: 12 },
        { file: 'wb.html', lb: 'Optativa obligatoria 3', k: 'OP', title: 'Problemas de topografía',
          sub: 'Triángulo del guardabosques, método de la sombra, teorema de Tales, triangulación, medir en el colegio', when: 'Mayo', ustd: 8 }
    ]
};
