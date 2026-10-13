/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Gymnasium 8" (buch/mathegy8/), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathegy8.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 3; 4 Ustd./week, 104 + 8 Ustd.).
 * Doc, 13.10.2026: Spanish round 2 (Lovelace orchestrates, Curie translates). Terms as in tools/buch-es/glosario.md.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matemáticas · Gymnasium 8',
    short: 'Matemáticas GY 8',
    lang: 'es',
    druck: false,
    description: 'Libro de texto interactivo de matemáticas para el Gymnasium (enseñanza secundaria alemana que prepara para el Abitur), 8.º curso, Sajonia: expresiones algebraicas y árboles de cálculo, identidades notables, ecuaciones e inecuaciones, experimentos aleatorios, probabilidad y diagramas de árbol, funciones y funciones lineales, sistemas de ecuaciones lineales, homotecia y semejanza, estrategias heurísticas y simulación con números aleatorios, con laboratorios, simulaciones y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizaje 1', k: '1.1', title: 'Variables y expresiones algebraicas',
          sub: 'Nombre, valor y significado, árboles de cálculo, simplificar, desarrollar, sacar factor común', when: 'Agosto · septiembre', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Área de aprendizaje 1', k: '1.2', title: 'Identidades notables y ecuaciones',
          sub: 'Las tres identidades notables, ecuaciones lineales, CAS, inecuaciones', when: 'Septiembre', ustd: 12 },
        { file: 'lb2-1.html', lb: 'Área de aprendizaje 2', k: '2.1', title: 'Experimentos aleatorios y probabilidad',
          sub: 'Resultados y sucesos, diagramas de Venn, frecuencia relativa, experimentos de Laplace', when: 'Noviembre', ustd: 16 },
        { file: 'lb2-2.html', lb: 'Área de aprendizaje 2', k: '2.2', title: 'Experimentos de varias etapas y recuento',
          sub: 'Modelo de urna, diagrama de árbol, reglas de las ramas, regla del producto, simulación', when: 'Diciembre', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Área de aprendizaje 3', k: '3.1', title: 'Las funciones y sus propiedades',
          sub: 'Correspondencias unívocas, formas de representación, dominio y recorrido, monotonía, extremos, simetría', when: 'Enero', ustd: 8 },
        { file: 'lb3-2.html', lb: 'Área de aprendizaje 3', k: '3.2', title: 'Funciones lineales',
          sub: 'Pendiente y cociente incremental, ceros, ecuaciones de la recta, regresión lineal', when: 'Enero · febrero', ustd: 12 },
        { file: 'lb3-3.html', lb: 'Área de aprendizaje 3', k: '3.3', title: 'Sistemas de ecuaciones lineales',
          sub: 'Resolver gráficamente y algebraicamente, número de soluciones, modelizar', when: 'Marzo', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Área de aprendizaje 4', k: '4.1', title: 'Homotecia',
          sub: 'Centro y razón de homotecia, construcción, conservación de los ángulos, razones entre segmentos', when: 'Abril', ustd: 8 },
        { file: 'lb4-2.html', lb: 'Área de aprendizaje 4', k: '4.2', title: 'Semejanza',
          sub: 'Criterio principal de semejanza, figuras auxiliares, medir alturas, longitudes, áreas y volúmenes', when: 'Abril · mayo', ustd: 12 },
        { file: 'lb5.html', lb: 'Área de aprendizaje 5', k: '5', title: 'Estrategias heurísticas',
          sub: 'Trabajar hacia delante y hacia atrás, planes de resolución, presentar soluciones', when: 'Mayo', ustd: 4 },
        { file: 'wb.html', lb: 'Optativa', k: 'OP', title: 'Simulación con números aleatorios',
          sub: 'Números aleatorios, método de Montecarlo, problema de Monty Hall, cromos', when: 'Mayo · junio', ustd: 8 }
    ]
};
