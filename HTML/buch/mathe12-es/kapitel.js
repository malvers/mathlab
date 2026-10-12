/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Berufliches Gymnasium 12" (buch/mathe12/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe12.html: LB 1 → LB 2 → LB 5; Grundkurs, Kurshalbjahre 12/I and 12/II).
 * Doc, 12.10.2026: "übersetze bitte drei Bücher ins Spanische" (package ES0: start page and this file; the chapters: ES2).
 * Terms as in tools/buch-es/glosario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matemáticas · Berufliches Gymnasium 12',
    short: 'Matemáticas 12',
    lang: 'es',
    druck: false,
    description: 'Libro de texto interactivo de matemáticas para el Berufliches Gymnasium (bachillerato alemán de orientación profesional), 12.º curso, Sajonia: variables aleatorias discretas y distribución binomial, cálculo diferencial desde los límites hasta los problemas de optimización, y vectores en el espacio, con laboratorios, simulaciones, gráficos 3D y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizaje 1', k: '1.1', title: 'Probabilidad condicionada',
          sub: 'Diagramas de árbol, tablas de contingencia, independencia', when: 'Agosto · septiembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Área de aprendizaje 1', k: '1.2', title: 'Variables aleatorias',
          sub: 'Distribución de probabilidad, esperanza, varianza, juegos justos', when: 'Septiembre', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Área de aprendizaje 1', k: '1.3', title: 'La distribución binomial',
          sub: 'Procesos de Bernoulli, coeficiente binomial, probabilidades acumuladas', when: 'Octubre · noviembre', ustd: 20 },
        { file: 'lb2-1.html', lb: 'Área de aprendizaje 2', k: '2.1', title: 'Límites',
          sub: 'Comportamiento en el infinito, asíntotas, continuidad', when: 'Noviembre · diciembre', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Área de aprendizaje 2', k: '2.2', title: 'La derivada',
          sub: 'Tasas de variación, de la secante a la tangente, derivar gráficamente', when: 'Diciembre', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Área de aprendizaje 2', k: '2.3', title: 'Reglas de derivación',
          sub: 'Reglas de la potencia, de la suma y del factor constante, eˣ y sen x, productos sencillos', when: 'Enero', ustd: 12 },
        { file: 'lb2-4.html', lb: 'Área de aprendizaje 2', k: '2.4', title: 'Monotonía, extremos, puntos de inflexión',
          sub: 'Lo que f′ y f″ revelan sobre la gráfica', when: 'Enero · marzo', ustd: 12 },
        { file: 'lb2-5.html', lb: 'Área de aprendizaje 2', k: '2.5', title: 'Estudio de gráficas',
          sub: 'Simetría, asíntotas, tangentes y normales, funciones en contexto', when: 'Marzo', ustd: 12 },
        { file: 'lb2-6.html', lb: 'Área de aprendizaje 2', k: '2.6', title: 'Buscar la función y problemas de optimización',
          sub: 'Funciones a partir de condiciones, encontrar lo mejor', when: 'Abril · mayo', ustd: 20 },
        { file: 'lb5-1.html', lb: 'Área de aprendizaje 5', k: '5.1', title: 'Vectores en el espacio',
          sub: 'Puntos y vectores, operaciones con vectores, módulo, punto medio', when: 'Mayo · junio', ustd: 12 },
        { file: 'lb5-2.html', lb: 'Área de aprendizaje 5', k: '5.2', title: 'Producto escalar y ángulos',
          sub: 'Ortogonalidad, ángulo entre vectores, demostraciones con cuadriláteros', when: 'Junio · julio', ustd: 8 }
    ]
};
