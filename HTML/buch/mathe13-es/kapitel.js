/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Berufliches Gymnasium 13" (buch/mathe13/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe13.html: LB 3 → LB 4 → Wahlpflicht 1 → LB 6 → Abiturvorbereitung).
 * Doc, 12.10.2026: "übersetze bitte drei Bücher ins Spanische" (package ES0: start page and this file; the chapters: ES3).
 * Terms as in tools/buch-es/glosario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Matemáticas · Berufliches Gymnasium 13',
    short: 'Matemáticas 13',
    lang: 'es',
    description: 'Libro de texto interactivo de matemáticas para el Berufliches Gymnasium (bachillerato alemán de orientación profesional), 13.º curso, Sajonia: cálculo integral, estadística inferencial con contrastes de hipótesis, geometría analítica de rectas y planos en el espacio, otras aplicaciones y un capítulo para preparar el Abitur, con laboratorios, simulaciones y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb3-1.html', lb: 'Área de aprendizaje 3', k: '3.1', title: 'Primitivas',
          sub: 'Derivar hacia atrás, la integral indefinida, reglas de integración', when: 'Agosto · septiembre', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Área de aprendizaje 3', k: '3.2', title: 'La integral definida',
          sub: 'Cantidad reconstruida, propiedades, teorema fundamental', when: 'Septiembre', ustd: 8 },
        { file: 'lb3-3.html', lb: 'Área de aprendizaje 3', k: '3.3', title: 'Áreas',
          sub: 'Entre una gráfica y el eje x, entre dos gráficas', when: 'Finales de septiembre · octubre', ustd: 8 },
        { file: 'lb3-4.html', lb: 'Área de aprendizaje 3', k: '3.4', title: 'Integración numérica y aplicaciones',
          sub: 'Métodos de los rectángulos y de los trapecios, problemas variados', when: 'Octubre · noviembre', ustd: 8 },
        { file: 'lb4-1.html', lb: 'Área de aprendizaje 4', k: '4.1', title: 'Población y muestra',
          sub: 'Estimar y contrastar, media muestral y varianza muestral', when: 'Noviembre', ustd: 4 },
        { file: 'lb4-2.html', lb: 'Área de aprendizaje 4', k: '4.2', title: 'Contrastes de hipótesis',
          sub: 'Hipótesis, región de rechazo, errores de tipo I y de tipo II', when: 'Noviembre · diciembre', ustd: 8 },
        { file: 'wp1-1.html', lb: 'Optativa obligatoria 1', k: 'OP.1', title: 'Rectas y planos',
          sub: 'Ecuaciones paramétricas, vector normal con el producto vectorial', when: 'Diciembre', ustd: 8 },
        { file: 'wp1-2.html', lb: 'Optativa obligatoria 1', k: 'OP.2', title: 'Ecuación general y posiciones relativas',
          sub: 'Punto, recta, plano: posición, puntos de intersección, puntos de traza', when: 'Enero', ustd: 8 },
        { file: 'wp1-3.html', lb: 'Optativa obligatoria 1', k: 'OP.3', title: 'Ángulos de intersección, prismas y pirámides',
          sub: 'Ángulos entre rectas y planos, áreas totales y volúmenes', when: 'Enero', ustd: 4 },
        { file: 'lb6.html', lb: 'Área de aprendizaje 6', k: '6', title: 'Otras aplicaciones',
          sub: 'Familias de funciones, parámetros en sistemas de ecuaciones, costes y beneficio, distancias', when: 'Finales de enero · febrero', ustd: 8 },
        { file: 'abi.html', lb: 'Abitur', k: 'A', title: 'Listo para el Abitur',
          sub: 'Listas de control y ejercicios en formato de Abitur de los tres cursos', when: 'Febrero · abril', ustd: 0 }
    ]
};
