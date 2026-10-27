/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Gymnasium 12" (buch/mathegy12/, Grundkurs), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathegy12.html: LB 5 → Wahlbereich 5 → LB 6 → LB 7 → LB 8 → Abitur; 4 Ustd./week).
 * Doc, 13.10.2026: "Schnappt euch die restlichen Bücher. Und übersetzt die ins Spanische" (round 2, Turing).
 * Terms as in tools/buch-es/glosario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Matemáticas · Gymnasium 12',
    short: 'Matemáticas GY 12',
    lang: 'es',
    description: 'Libro de texto interactivo de matemáticas para el Gymnasium (bachillerato alemán), 12.º curso, curso básico (Sajonia): el cálculo integral desde la búsqueda de primitivas hasta el área entre dos gráficas, integración numérica, estimación y contrastes de hipótesis, distancias y ángulos en el espacio en 3D real, distancias extremas, simetrías, familias de funciones y de rectas y entrenamiento para el Abitur, con laboratorios, simulaciones y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb5-1.html', lb: 'Área de aprendizaje 5', k: '5.1', title: 'Primitivas e integración',
          sub: 'La derivación al revés, integrales inmediatas, reglas de integración, composiciones lineales, CAS', when: 'Agosto · septiembre', ustd: 12 },
        { file: 'lb5-2.html', lb: 'Área de aprendizaje 5', k: '5.2', title: 'La integral definida',
          sub: 'Cantidad a partir de tasas de variación, sumas superiores e inferiores, propiedades, teorema fundamental, función integral', when: 'Septiembre', ustd: 8 },
        { file: 'lb5-3.html', lb: 'Área de aprendizaje 5', k: '5.3', title: 'Áreas',
          sub: 'Área entre la gráfica y el eje x, entre dos gráficas, límites desconocidos, problemas de aplicación', when: 'Septiembre · octubre', ustd: 8 },
        { file: 'wb5.html', lb: 'Optativa 5', k: 'OP', title: 'Integración numérica',
          sub: 'Historia del cálculo integral, método de los rectángulos y de los trapecios, precisión', when: 'Octubre · noviembre', ustd: 8 },
        { file: 'lb6.html', lb: 'Área de aprendizaje 6', k: '6', title: 'Estadística inferencial',
          sub: 'Muestras, estimación de proporciones, media y varianza, contrastes de hipótesis unilaterales y bilaterales', when: 'Noviembre', ustd: 12 },
        { file: 'lb7-1.html', lb: 'Área de aprendizaje 7', k: '7.1', title: 'Producto escalar, producto vectorial y forma normal',
          sub: 'Ángulo y proyección, vector perpendicular y área, forma normal y ecuación general', when: 'Diciembre', ustd: 8 },
        { file: 'lb7-2.html', lb: 'Área de aprendizaje 7', k: '7.2', title: 'Ángulos de intersección',
          sub: 'Recta y recta, recta y plano, plano y plano, inclinaciones en cuerpos', when: 'Enero', ustd: 8 },
        { file: 'lb7-3.html', lb: 'Área de aprendizaje 7', k: '7.3', title: 'Distancias',
          sub: 'Punto y punto, pie de la perpendicular, distancia de un punto a un plano, forma normal de Hesse, aplicaciones', when: 'Enero', ustd: 8 },
        { file: 'lb8-1.html', lb: 'Área de aprendizaje 8', k: '8.1', title: 'Distancias extremas y simetrías',
          sub: 'Función distancia, punto y recta, punto y curva, simetría respecto a un punto y a un plano, caminos más cortos', when: 'Febrero', ustd: 8 },
        { file: 'lb8-2.html', lb: 'Área de aprendizaje 8', k: '8.2', title: 'Áreas y familias',
          sub: 'Áreas por tres caminos, familias de funciones y lugares geométricos, familias de rectas, problemas relacionados', when: 'Marzo', ustd: 12 },
        { file: 'abi.html', lb: 'Abitur', k: 'A', title: 'Listo para el Abitur',
          sub: 'Listas de control, errores típicos y ejercicios en formato de Abitur de 11.º y 12.º curso', when: 'Abril', ustd: 0 }
    ]
};
