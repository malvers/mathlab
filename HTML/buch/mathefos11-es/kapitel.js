/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Fachoberschule 11" (buch/mathefos11/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathefos11.html: LB 1 → LB 2 → Wahlbereich 2, then the outlooks of Wahlbereich 1 and 3; 3 Ustd./week).
 * Doc, 13.10.2026: "Schnappt euch die restlichen Bücher. Und übersetzt die ins Spanische" (round 2, tools/buch-es/auftrag.md section 7).
 * Terms as in tools/buch-es/glosario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Matemáticas · Fachoberschule 11',
    short: 'Matemáticas FOS 11',
    lang: 'es',
    description: 'Libro de texto interactivo de matemáticas para la Fachoberschule (escuela técnica superior alemana), 11.º curso, Sajonia: términos y fórmulas, funciones lineales y cuadráticas, ecuaciones, inecuaciones y sistemas de ecuaciones, funciones polinómicas, probabilidades, recuento y cadenas de Bernoulli, matemática financiera y perspectivas sobre los números complejos y el álgebra de circuitos, con laboratorios, simulaciones y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizaje 1', k: '1.1', title: 'Números, términos y fórmulas',
          sub: 'Conjuntos numéricos, despejar fórmulas, valor absoluto, identidades notables, porcentajes, potencias', when: 'Agosto · septiembre', ustd: 6 },
        { file: 'lb1-2.html', lb: 'Área de aprendizaje 1', k: '1.2', title: 'Funciones y funciones lineales',
          sub: 'Concepto de función, pendiente y ordenada en el origen, ecuaciones de la recta, ángulo de inclinación', when: 'Septiembre', ustd: 9 },
        { file: 'lb1-3.html', lb: 'Área de aprendizaje 1', k: '1.3', title: 'Ecuaciones e inecuaciones lineales',
          sub: 'Transformaciones equivalentes, conjuntos solución, ecuaciones con fracciones', when: 'Octubre', ustd: 6 },
        { file: 'lb1-4.html', lb: 'Área de aprendizaje 1', k: '1.4', title: 'Rectas y sistemas de ecuaciones lineales',
          sub: 'Parámetros, posiciones relativas, tres métodos de resolución, aplicaciones', when: 'Noviembre', ustd: 9 },
        { file: 'lb1-5.html', lb: 'Área de aprendizaje 1', k: '1.5', title: 'Funciones y ecuaciones cuadráticas',
          sub: 'Forma canónica y forma general, fórmula general, teorema de Vieta', when: 'Diciembre', ustd: 6 },
        { file: 'lb1-6.html', lb: 'Área de aprendizaje 1', k: '1.6', title: 'Parábolas a medida',
          sub: 'Factores lineales, ecuaciones de funciones a partir de condiciones, parámetros con distinción de casos', when: 'Enero', ustd: 6 },
        { file: 'lb1-7.html', lb: 'Área de aprendizaje 1', k: '1.7', title: 'Funciones polinómicas',
          sub: 'Factorización en factores lineales, sustitución, multiplicidad, forma de la gráfica', when: 'Enero', ustd: 3 },
        { file: 'lb2-1.html', lb: 'Área de aprendizaje 2', k: '2.1', title: 'Azar y probabilidad',
          sub: 'Resultados y sucesos, ley de los grandes números, Laplace, operaciones con sucesos', when: 'Febrero · marzo', ustd: 9 },
        { file: 'lb2-2.html', lb: 'Área de aprendizaje 2', k: '2.2', title: 'Experimentos aleatorios compuestos',
          sub: 'Independencia, diagramas de árbol y reglas de los caminos, aplicaciones', when: 'Marzo', ustd: 9 },
        { file: 'lb2-3.html', lb: 'Área de aprendizaje 2', k: '2.3', title: 'Recuento, modelo de urna y cadenas de Bernoulli',
          sub: 'Principio de multiplicación, permutación, variación, combinación, fórmula de Bernoulli', when: 'Abril', ustd: 12 },
        { file: 'wb2.html', lb: 'Optativa 2', k: 'OP', title: 'Matemática financiera',
          sub: 'Interés compuesto, planes de ahorro, amortización con cuotas constantes de capital y con anualidades', when: 'Mayo', ustd: 6 },
        { file: 'exkurse.html', lb: 'Perspectivas', k: 'E', title: 'Números complejos y álgebra de circuitos',
          sub: 'Optativas 1 y 3 como excursiones: plano de Gauss, tablas de verdad, circuitos', when: 'Junio', ustd: 0 }
    ]
};
