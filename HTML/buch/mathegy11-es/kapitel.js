/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Gymnasium 11" (buch/mathegy11/, Grundkurs), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathegy11.html: LB 1 with LB 2 before the conditions part, Wahlbereich 2 at the end of 11/I,
 * then LB 3 → LB 4; 4 Ustd./week). The numbers follow the Lehrplan, so chapter 2 comes between 1.4 and 1.5.
 * Doc, 13.10.2026: "Schnappt euch die restlichen Bücher. Und übersetzt die ins Spanische" (round 2, Turing).
 * Terms as in tools/buch-es/glosario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matemáticas · Gymnasium 11',
    short: 'Matemáticas GY 11',
    lang: 'es',
    druck: false,
    description: 'Libro de texto interactivo de matemáticas para el Gymnasium (bachillerato alemán), 11.º curso, curso básico (Sajonia): límites, la derivada y las reglas de derivación, estudio de funciones, funciones a partir de condiciones, problemas de optimización y regresión, matrices y el método de Gauss-Jordan, métodos numéricos, vectores, rectas y planos en el espacio, experimentos aleatorios de varias etapas y la distribución binomial, con laboratorios, simulaciones y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizaje 1', k: '1.1', title: 'Límites y continuidad',
          sub: 'Comportamiento en el infinito, límite en un punto, propiedades de los límites, continuidad', when: 'Agosto · septiembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Área de aprendizaje 1', k: '1.2', title: 'Tasas de variación y derivada',
          sub: 'Secante y tangente, cociente incremental y cociente diferencial, función derivada', when: 'Septiembre', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Área de aprendizaje 1', k: '1.3', title: 'Reglas de derivación',
          sub: 'Reglas de la potencia, del factor constante y de la suma, eˣ, ln x y sen x, reglas del producto y de la cadena', when: 'Septiembre · octubre', ustd: 12 },
        { file: 'lb1-4.html', lb: 'Área de aprendizaje 1', k: '1.4', title: 'Estudio de funciones',
          sub: 'Monotonía, extremos, puntos de inflexión, simetría, polos y asíntotas', when: 'Octubre · noviembre', ustd: 12 },
        { file: 'lb2.html', lb: 'Área de aprendizaje 2', k: '2', title: 'Matrices',
          sub: 'Notación matricial, multiplicación, método de Gauss-Jordan, giros', when: 'Noviembre · diciembre', ustd: 6 },
        { file: 'lb1-5.html', lb: 'Área de aprendizaje 1', k: '1.5', title: 'Funciones a medida',
          sub: 'Funciones a partir de condiciones, problemas de optimización, regresión', when: 'Diciembre · enero', ustd: 12 },
        { file: 'wb2.html', lb: 'Optativa 2', k: 'OP', title: 'Métodos numéricos',
          sub: 'Resolver ecuaciones gráficamente, bisección, método de Newton', when: 'Enero · febrero', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Área de aprendizaje 3', k: '3.1', title: 'Vectores en el espacio',
          sub: 'Sistema de coordenadas en el espacio, operaciones con vectores, dependencia lineal', when: 'Febrero · marzo', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Área de aprendizaje 3', k: '3.2', title: 'Rectas en el espacio',
          sub: 'Forma paramétrica, prueba de pertenencia, puntos de traza, posición relativa de dos rectas', when: 'Marzo', ustd: 8 },
        { file: 'lb3-3.html', lb: 'Área de aprendizaje 3', k: '3.3', title: 'Planos',
          sub: 'Forma paramétrica, ecuación general, posición relativa de una recta y un plano', when: 'Abril', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Área de aprendizaje 4', k: '4.1', title: 'Experimentos aleatorios de varias etapas',
          sub: 'Modelo de urna, reglas de las ramas, tabla de contingencia, independencia, simulación', when: 'Abril · mayo', ustd: 6 },
        { file: 'lb4-2.html', lb: 'Área de aprendizaje 4', k: '4.2', title: 'La distribución binomial',
          sub: 'Procesos de Bernoulli, coeficiente binomial, probabilidades acumuladas, esperanza y dispersión', when: 'Mayo · junio', ustd: 12 }
    ]
};
