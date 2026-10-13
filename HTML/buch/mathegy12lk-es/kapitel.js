/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Gymnasium 12 · Leistungskurs" (buch/mathegy12lk/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathegy12lk.html: LB 5 → Wahlbereich 5 → LB 6 → LB 7 → LB 8 → LB 9 → Abitur; 5 Ustd./week).
 * Doc, 13.10.2026: "Schnappt euch die restlichen Bücher. Und übersetzt die ins Spanische" (round 2, Turing).
 * Terms as in tools/buch-es/glosario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matemáticas · Gymnasium 12 · Curso avanzado',
    short: 'Matemáticas GY 12 avanzado',
    lang: 'es',
    druck: false,
    description: 'Libro de texto interactivo de matemáticas para el Gymnasium (bachillerato alemán), 12.º curso, curso avanzado (Sajonia): cálculo integral con función integral, teorema fundamental y cuerpos de revolución en 3D real, integración numérica hasta Simpson, variables aleatorias con distribución normal y De Moivre-Laplace, estimación y contrastes de hipótesis, distancias y ángulos en el espacio con la forma normal de Hesse y rectas que se cruzan, extremos, simetrías, regiones no acotadas, familias y lugares geométricos y entrenamiento para el Abitur, con laboratorios, simulaciones y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb5-1.html', lb: 'Área de aprendizaje 5', k: '5.1', title: 'Primitivas e integración',
          sub: 'La derivación al revés, integrales inmediatas, sustitución lineal, funciones compuestas con CAS', when: 'Agosto · septiembre', ustd: 15 },
        { file: 'lb5-2.html', lb: 'Área de aprendizaje 5', k: '5.2', title: 'La integral definida y el teorema fundamental',
          sub: 'Cantidad a partir de tasas de variación, magnitudes físicas, sumas de Riemann, propiedades, función integral, teorema fundamental con demostración', when: 'Septiembre', ustd: 10 },
        { file: 'lb5-3.html', lb: 'Área de aprendizaje 5', k: '5.3', title: 'Áreas y cuerpos de revolución',
          sub: 'Área con el eje x y entre gráficas, volumen al girar alrededor del eje x, cono y esfera deducidos', when: 'Octubre', ustd: 10 },
        { file: 'wb5.html', lb: 'Optativa 5', k: 'OP', title: 'Integración numérica',
          sub: 'Historia del cálculo integral, método de los rectángulos y de los trapecios, regla de los toneles de Kepler, Simpson, comparación de los métodos', when: 'Noviembre', ustd: 10 },
        { file: 'lb6.html', lb: 'Área de aprendizaje 6', k: '6', title: 'Variables aleatorias con distribución normal',
          sub: 'Campana de Gauss, función de densidad y de distribución, esperanza y desviación típica, reglas σ, De Moivre-Laplace', when: 'Noviembre', ustd: 10 },
        { file: 'lb7.html', lb: 'Área de aprendizaje 7', k: '7', title: 'Estadística inferencial',
          sub: 'Muestras, estimación de proporciones, media y varianza, contrastes de hipótesis unilaterales y bilaterales, seguridad estadística', when: 'Diciembre', ustd: 15 },
        { file: 'lb8-1.html', lb: 'Área de aprendizaje 8', k: '8.1', title: 'Producto escalar, producto vectorial y forma normal de Hesse',
          sub: 'Ángulo y proyección, vector perpendicular y área, forma normal y ecuación general, forma normal de Hesse para la recta y el plano', when: 'Enero', ustd: 10 },
        { file: 'lb8-2.html', lb: 'Área de aprendizaje 8', k: '8.2', title: 'Ángulos de intersección',
          sub: 'Recta y recta, recta y plano, plano y plano, inclinaciones en cuerpos', when: 'Enero', ustd: 5 },
        { file: 'lb8-3.html', lb: 'Área de aprendizaje 8', k: '8.3', title: 'Distancias',
          sub: 'Punto y punto, punto y plano, recta y plano, plano y plano, punto y recta, rectas que se cruzan', when: 'Febrero', ustd: 10 },
        { file: 'lb9-1.html', lb: 'Área de aprendizaje 9', k: '9.1', title: 'Distancias extremas, ángulos y simetrías',
          sub: 'Función distancia, punto y curva, ángulo de visión máximo, simetría respecto a un punto y a un plano, caminos más cortos', when: 'Febrero · marzo', ustd: 10 },
        { file: 'lb9-2.html', lb: 'Área de aprendizaje 9', k: '9.2', title: 'Áreas, densidad, familias y lugares geométricos',
          sub: 'Áreas por tres caminos, regiones no acotadas, densidad y probabilidad, familias de funciones, lugares geométricos, familias de rectas y de planos', when: 'Marzo', ustd: 10 },
        { file: 'abi.html', lb: 'Abitur', k: 'A', title: 'Listo para el Abitur',
          sub: 'Listas de control, errores típicos y ejercicios en formato de Abitur del curso avanzado de 11.º y 12.º curso', when: 'Abril', ustd: 0 }
    ]
};
