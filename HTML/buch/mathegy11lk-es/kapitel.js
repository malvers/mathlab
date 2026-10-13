/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Gymnasium 11 · Leistungskurs" (buch/mathegy11lk/), in the order
 * of the school year (Stoffverteilungsplan of the Leistungskurs 11, 5 Ustd./week: LB 1 with LB 2 before the conditions part, Wahlbereich 2 at the end of 11/I,
 * then LB 3 → LB 4). The numbers follow the Lehrplan, so chapter 2 comes between 1.4 and 1.5.
 * Doc, 13.10.2026: "Schnappt euch die restlichen Bücher. Und übersetzt die ins Spanische" (round 2, Turing).
 * Terms as in tools/buch-es/glosario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matemáticas · Gymnasium 11 · Curso avanzado',
    short: 'Matemáticas GY 11 avanzado',
    lang: 'es',
    druck: false,
    description: 'Libro de texto interactivo de matemáticas para el Gymnasium (bachillerato alemán), 11.º curso, curso avanzado (Sajonia): límites y continuidad, derivada por definición y aproximación lineal, reglas de derivación con demostración, propiedades de las funciones, matrices con giros y producción encadenada, funciones a partir de condiciones, optimización y regresión, métodos numéricos hasta el teorema del punto fijo, vectores, rectas y planos en todas sus posiciones, concepto de probabilidad, teorema de Bayes y distribución binomial, con laboratorios, simulaciones y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizaje 1', k: '1.1', title: 'Límites y continuidad',
          sub: 'Comportamiento en el infinito, límite en un punto, propiedades de los límites, funciones definidas a trozos, continuidad', when: 'Agosto · septiembre', ustd: 15 },
        { file: 'lb1-2.html', lb: 'Área de aprendizaje 1', k: '1.2', title: 'Tasas de variación y concepto de derivada',
          sub: 'Aproximación lineal, cociente incremental y cociente diferencial, derivada por definición, derivabilidad', when: 'Septiembre', ustd: 10 },
        { file: 'lb1-3.html', lb: 'Área de aprendizaje 1', k: '1.3', title: 'Reglas de derivación',
          sub: 'Reglas con demostración, eˣ, ln x y sen x, reglas del producto y de la cadena, inversión de la derivación', when: 'Octubre', ustd: 15 },
        { file: 'lb1-4.html', lb: 'Área de aprendizaje 1', k: '1.4', title: 'Estudio de funciones',
          sub: 'Monotonía, extremos, curvatura y puntos de inflexión, simetría, polos, asíntotas oblicuas', when: 'Noviembre', ustd: 14 },
        { file: 'lb2.html', lb: 'Área de aprendizaje 2', k: '2', title: 'Matrices',
          sub: 'Ax = b, producto de matrices compatibles, método de Gauss-Jordan, giros, producción encadenada', when: 'Noviembre · diciembre', ustd: 6 },
        { file: 'lb1-5.html', lb: 'Área de aprendizaje 1', k: '1.5', title: 'Condiciones, optimización, regresión',
          sub: 'Funciones a partir de condiciones, problemas de optimización, ecuaciones de funciones por regresión', when: 'Diciembre', ustd: 12 },
        { file: 'wb2.html', lb: 'Optativa 2', k: 'OP', title: 'Métodos numéricos',
          sub: 'Solución gráfica, bisección, método de Newton, iteración de punto fijo, teorema de Banach', when: 'Enero', ustd: 10 },
        { file: 'lb3-1.html', lb: 'Área de aprendizaje 3', k: '3.1', title: 'El espacio y los vectores',
          sub: 'Sistema de coordenadas en el espacio, otros sistemas de coordenadas, operaciones con vectores, propiedades', when: 'Febrero · marzo', ustd: 10 },
        { file: 'lb3-2.html', lb: 'Área de aprendizaje 3', k: '3.2', title: 'Dependencia lineal y rectas',
          sub: 'Dependencia e independencia lineal, rectas en forma paramétrica, posición relativa de dos rectas', when: 'Marzo', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Área de aprendizaje 3', k: '3.3', title: 'Planos y posiciones relativas',
          sub: 'Forma paramétrica y ecuación general, recta y plano, plano y plano, recta de intersección', when: 'Marzo · abril', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Área de aprendizaje 4', k: '4.1', title: 'Probabilidad y recuento',
          sub: 'Estadística, Laplace, Kolmogórov, simulación, modelo de urna, reglas de las ramas, tabla de contingencia, técnicas de recuento', when: 'Abril · mayo', ustd: 13 },
        { file: 'lb4-2.html', lb: 'Área de aprendizaje 4', k: '4.2', title: 'Probabilidad condicionada y Bayes',
          sub: 'Probabilidad condicionada, teorema de Bayes con el árbol y la tabla de contingencia, independencia', when: 'Mayo', ustd: 8 },
        { file: 'lb4-3.html', lb: 'Área de aprendizaje 4', k: '4.3', title: 'La distribución binomial',
          sub: 'Procesos de Bernoulli, deducción de la fórmula, sumatorio, esperanza, varianza, modelización', when: 'Mayo · junio', ustd: 11 }
    ]
};
