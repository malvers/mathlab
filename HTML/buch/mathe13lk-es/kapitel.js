/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Berufliches Gymnasium 13 · Leistungskurs" (buch/mathe13lk/),
 * in the order of the school year (Lehrplan Berufliches Gymnasium Mathematik, Sachsen, 2026, Leistungskurs 13: LB 3 → LB 4 → LB 5 →
 * Wahlpflicht 1 or 2 (the school chooses one, the book has both) → LB 7 → Abiturvorbereitung).
 * Doc, 28.10.2026: "Die Übersetzung, die fangen wir heute an. Und ziehen es durch." (Bayer, for Curie).
 * Terms as in tools/buch-es/glosario.md; the elective chapters W1.1 … W2.3 are OP1.1 … OP2.3 (as OP.1 in mathe13-es).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Matemáticas · Berufliches Gymnasium 13 · Curso avanzado',
    short: 'Matemáticas 13 avanzado',
    lang: 'es',
    description: 'Libro de texto interactivo de matemáticas para el Berufliches Gymnasium (bachillerato alemán de orientación profesional), 13.º curso, curso avanzado (Sajonia): cálculo integral con el teorema fundamental y sólidos de revolución, variables aleatorias con distribución normal, estadística inferencial, las dos optativas obligatorias – rectas y planos en el espacio o matrices con el modelo de Leontief y modelos de poblaciones –, otras aplicaciones y un capítulo para preparar el Abitur, con laboratorios, simulaciones, gráficos 3D y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb3-1.html', lb: 'Área de aprendizaje 3', k: '3.1', title: 'Primitivas',
          sub: 'Derivar hacia atrás, comprobación, reglas de integración, 1/x y ln|x|, CAS', when: 'Agosto · septiembre', ustd: 10 },
        { file: 'lb3-2.html', lb: 'Área de aprendizaje 3', k: '3.2', title: 'La integral definida y el teorema fundamental',
          sub: 'Cantidad reconstruida, propiedades, función integral, teorema fundamental con demostración', when: 'Septiembre', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Área de aprendizaje 3', k: '3.3', title: 'Áreas',
          sub: 'Entre una gráfica y el eje x, entre dos gráficas, áreas con parámetro', when: 'Octubre', ustd: 8 },
        { file: 'lb3-4.html', lb: 'Área de aprendizaje 3', k: '3.4', title: 'Integración numérica y sólidos de revolución',
          sub: 'Métodos de los rectángulos y de los trapecios, volumen al girar alrededor del eje x', when: 'Octubre · noviembre', ustd: 10 },
        { file: 'lb4.html', lb: 'Área de aprendizaje 4', k: '4', title: 'Variables aleatorias con distribución normal',
          sub: 'Campana de Gauss, función de densidad y de distribución, esperanza, desviación típica, reglas σ', when: 'Noviembre', ustd: 12 },
        { file: 'lb5-1.html', lb: 'Área de aprendizaje 5', k: '5.1', title: 'Población y muestra',
          sub: 'Estimar y contrastar, media muestral y varianza muestral', when: 'Diciembre', ustd: 5 },
        { file: 'lb5-2.html', lb: 'Área de aprendizaje 5', k: '5.2', title: 'Contrastes de hipótesis',
          sub: 'Contrastes unilaterales y bilaterales, región de rechazo, errores de tipo I y II, nivel de confianza', when: 'Diciembre · enero', ustd: 10 },
        { file: 'wp1-1.html', lb: 'Optativa obligatoria 1', k: 'OP1.1', title: 'Rectas y planos',
          sub: 'Ecuaciones paramétricas, producto vectorial, ecuación general, forma normal de Hesse', when: 'Enero', ustd: 9 },
        { file: 'wp1-2.html', lb: 'Optativa obligatoria 1', k: 'OP1.2', title: 'Posiciones relativas y ángulos de intersección',
          sub: 'Punto, recta, plano: intersecciones, puntos de traza, rectas de traza, ángulos de intersección', when: 'Enero · febrero', ustd: 9 },
        { file: 'wp1-3.html', lb: 'Optativa obligatoria 1', k: 'OP1.3', title: 'Distancias, prismas y pirámides',
          sub: 'Distancia punto–plano, recta–plano, plano–plano, área total y volumen', when: 'Febrero', ustd: 7 },
        { file: 'wp2-1.html', lb: 'Optativa obligatoria 2', k: 'OP2.1', title: 'Multiplicar e invertir matrices',
          sub: 'Producto de matrices, matriz identidad, matriz inversa, sistemas de ecuaciones con la inversa', when: 'Enero', ustd: 8 },
        { file: 'wp2-2.html', lb: 'Optativa obligatoria 2', k: 'OP2.2', title: 'Interdependencias y el modelo de Leontief',
          sub: 'Grafos de Gozinto, producción en varias etapas, cálculo de costes, análisis input-output', when: 'Enero · febrero', ustd: 9 },
        { file: 'wp2-3.html', lb: 'Optativa obligatoria 2', k: 'OP2.3', title: 'Modelos de poblaciones',
          sub: 'Matrices de transición, potencias de matrices, matriz límite y vector fijo, evolución cíclica', when: 'Febrero', ustd: 8 },
        { file: 'lb7-1.html', lb: 'Área de aprendizaje 7', k: '7.1', title: 'Ecuaciones bicuadradas y familias de funciones',
          sub: 'Cambio de variable, familias, parámetros y número de soluciones, lugares geométricos', when: 'Febrero · marzo', ustd: 8 },
        { file: 'lb7-2.html', lb: 'Área de aprendizaje 7', k: '7.2', title: 'Parámetros y extremos en el espacio y en la economía',
          sub: 'Sistemas de ecuaciones con parámetro, matrices de giro, distancias mínimas, costes, ingresos y beneficio', when: 'Marzo', ustd: 7 },
        { file: 'abi.html', lb: 'Abitur', k: 'A', title: 'Listo para el Abitur',
          sub: 'Listas de control, trampas habituales y ejercicios en formato de Abitur del curso avanzado de 11.º, 12.º y 13.º', when: 'Marzo · abril', ustd: 0 }
    ]
};
