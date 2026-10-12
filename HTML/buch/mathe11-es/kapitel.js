/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Berufliches Gymnasium 11" (buch/mathe11/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe11.html: LB 2 → LB 3 → LB 4 → LB 1 → Wahlbereich 3).
 * Doc, 12.10.2026: "übersetze bitte drei Bücher ins Spanische" (package ES0: start page and this file; the chapters: ES1).
 * Terms as in tools/buch-es/glosario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matemáticas · Berufliches Gymnasium 11',
    short: 'Matemáticas 11',
    lang: 'es',
    druck: false,
    description: 'Libro de texto interactivo de matemáticas para el Berufliches Gymnasium (bachillerato alemán de orientación profesional), 11.º curso, Sajonia: ecuaciones, funciones, sistemas de ecuaciones, probabilidad y métodos numéricos, con laboratorios, simulaciones y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb2.html', lb: 'Área de aprendizaje 2', k: '2', title: 'Ecuaciones, fórmulas, figuras',
          sub: 'Resolver problemas con y sin calculadora', when: 'Septiembre', ustd: 20 },
        { file: 'lb3-1.html', lb: 'Área de aprendizaje 3', k: '3.1', title: 'Las funciones y sus propiedades',
          sub: 'Dominio, ceros, monotonía, simetría', when: 'Finales de septiembre', ustd: 5 },
        { file: 'lb3-2.html', lb: 'Área de aprendizaje 3', k: '3.2', title: 'Crecimiento y decrecimiento',
          sub: 'Funciones lineales y funciones exponenciales', when: 'Octubre · noviembre', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Área de aprendizaje 3', k: '3.3', title: 'Funciones y ecuaciones cuadráticas',
          sub: 'Movimiento uniformemente acelerado', when: 'Noviembre', ustd: 15 },
        { file: 'lb3-4.html', lb: 'Área de aprendizaje 3', k: '3.4', title: 'Procesos periódicos',
          sub: 'Funciones seno', when: 'Diciembre', ustd: 10 },
        { file: 'lb3-5.html', lb: 'Área de aprendizaje 3', k: '3.5', title: 'Regresión',
          sub: 'Analizar series de medidas con herramientas digitales', when: 'Diciembre', ustd: 5 },
        { file: 'lb3-6.html', lb: 'Área de aprendizaje 3', k: '3.6', title: 'Funciones inversas y logaritmos',
          sub: 'Función raíz cuadrada, logaritmo, ecuaciones exponenciales', when: 'Enero', ustd: 15 },
        { file: 'lb3-7.html', lb: 'Área de aprendizaje 3', k: '3.7', title: 'Gráficas y parámetros',
          sub: 'Las funciones básicas sin calculadora, estirar y desplazar', when: 'Febrero · marzo', ustd: 15 },
        { file: 'lb4.html', lb: 'Área de aprendizaje 4', k: '4', title: 'Sistemas de ecuaciones lineales y matrices',
          sub: 'Método de Gauss, conjuntos solución, operaciones con matrices', when: 'Marzo · abril', ustd: 20 },
        { file: 'lb1.html', lb: 'Área de aprendizaje 1', k: '1', title: 'Probabilidades de experimentos aleatorios de varias etapas',
          sub: 'Diagramas de árbol, tablas de contingencia, simulación', when: 'Abril', ustd: 15 },
        { file: 'wb3.html', lb: 'Optativa 3', k: 'OP', title: 'Métodos numéricos y simulaciones',
          sub: 'Bisección, áreas aproximadas, el método de Montecarlo', when: 'Mayo · junio', ustd: 10 }
    ]
};
