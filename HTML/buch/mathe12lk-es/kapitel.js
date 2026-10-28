/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Berufliches Gymnasium 12 · Leistungskurs" (buch/mathe12lk/),
 * in the order of the school year (Lehrplan Berufliches Gymnasium Mathematik, Sachsen, 2026, Leistungskurs: LB 1 → LB 2 → LB 6 in 12).
 * Doc, 28.10.2026: "Die Übersetzung, die fangen wir heute an. Und ziehen es durch." (Casamayor, for Curie).
 * Terms as in tools/buch-es/glosario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Matemáticas · Berufliches Gymnasium 12 · Curso avanzado',
    short: 'Matemáticas 12 avanzado',
    lang: 'es',
    description: 'Libro de texto interactivo de matemáticas para el Berufliches Gymnasium (bachillerato alemán de orientación profesional), 12.º curso, curso avanzado (Sajonia): variables aleatorias discretas con función de distribución y distribución binomial, cálculo diferencial desde los límites y la continuidad, pasando por las reglas del producto y de la cadena, hasta la regresión y los problemas de optimización, y geometría vectorial en el espacio, con demostraciones, laboratorios, gráficos 3D y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizaje 1', k: '1.1', title: 'Probabilidad condicionada',
          sub: 'Diagramas de árbol, tablas de contingencia, teorema de Bayes, independencia', when: 'Agosto · septiembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Área de aprendizaje 1', k: '1.2', title: 'Variables aleatorias',
          sub: 'Función de probabilidad y función de distribución, esperanza, varianza', when: 'Septiembre · octubre', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Área de aprendizaje 1', k: '1.3', title: 'La distribución binomial',
          sub: 'Procesos de Bernoulli, símbolo de sumatorio, n y p buscados, parámetros', when: 'Octubre · noviembre', ustd: 20 },
        { file: 'lb2-1.html', lb: 'Área de aprendizaje 2', k: '2.1', title: 'Límites y continuidad',
          sub: 'Comportamiento en el infinito, límite en un punto, discontinuidades', when: 'Noviembre · diciembre', ustd: 10 },
        { file: 'lb2-2.html', lb: 'Área de aprendizaje 2', k: '2.2', title: 'La derivada',
          sub: 'Tasas de variación, cociente diferencial, aproximación lineal', when: 'Diciembre · enero', ustd: 12 },
        { file: 'lb2-3.html', lb: 'Área de aprendizaje 2', k: '2.3', title: 'Reglas de derivación',
          sub: 'Reglas de la potencia, del factor constante y de la suma, eˣ, ln x, sen x, cos x', when: 'Enero', ustd: 12 },
        { file: 'lb2-4.html', lb: 'Área de aprendizaje 2', k: '2.4', title: 'Reglas del producto y de la cadena',
          sub: 'Derivar productos y composiciones, raíces y funciones exponenciales', when: 'Febrero', ustd: 12 },
        { file: 'lb2-5.html', lb: 'Área de aprendizaje 2', k: '2.5', title: 'Monotonía, extremos, puntos de inflexión',
          sub: 'Condiciones necesarias y suficientes, extremos globales', when: 'Febrero · marzo', ustd: 14 },
        { file: 'lb2-6.html', lb: 'Área de aprendizaje 2', k: '2.6', title: 'Estudio de gráficas',
          sub: 'Simetría, asíntotas, tangentes y normales, problemas en contexto', when: 'Marzo · abril', ustd: 14 },
        { file: 'lb2-7.html', lb: 'Área de aprendizaje 2', k: '2.7', title: 'Buscar la función y regresión',
          sub: 'Funciones a partir de condiciones, modelos de regresión con herramientas digitales', when: 'Abril', ustd: 9 },
        { file: 'lb2-8.html', lb: 'Área de aprendizaje 2', k: '2.8', title: 'Problemas de optimización',
          sub: 'Modelizar, extremos en la frontera, distinción de casos', when: 'Mayo', ustd: 12 },
        { file: 'lb6-1.html', lb: 'Área de aprendizaje 6', k: '6.1', title: 'Vectores en el espacio',
          sub: 'Vectores de posición y vectores que unen dos puntos, combinación lineal, baricentros', when: 'Mayo · junio', ustd: 12 },
        { file: 'lb6-2.html', lb: 'Área de aprendizaje 6', k: '6.2', title: 'Producto escalar y ángulos',
          sub: 'Ortogonalidad, ángulos, comprobaciones y demostraciones con vectores', when: 'Junio · julio', ustd: 8 }
    ]
};
