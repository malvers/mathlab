/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Fachoberschule 12" (buch/mathefos12/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathefos12.html: LB 1 → LB 2 → LB 3 → LB 4 → FHR-Prüfung → Wahlbereich 3; 4 Ustd./week).
 * Doc, 13.10.2026: "Schnappt euch die restlichen Bücher. Und übersetzt die ins Spanische" (round 2, tools/buch-es/auftrag.md section 7).
 * Terms as in tools/buch-es/glosario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matemáticas · Fachoberschule 12',
    short: 'Matemáticas FOS 12',
    lang: 'es',
    druck: false,
    description: 'Libro de texto interactivo de matemáticas para la Fachoberschule (escuela técnica superior alemana), 12.º curso, Sajonia: vectores, rectas y planos en el espacio en 3D de verdad, cálculo diferencial desde los límites hasta los problemas de optimización, cálculo integral, funciones racionales y exponenciales, entrenamiento para el examen de la Fachhochschulreife y una optativa con CAS, con laboratorios, simulaciones y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizaje 1', k: '1.1', title: 'Vectores y producto escalar',
          sub: 'Flechas en el espacio, módulo, operaciones con vectores, ángulo y ortogonalidad', when: 'Agosto · septiembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Área de aprendizaje 1', k: '1.2', title: 'Rectas en el espacio',
          sub: 'Ecuación paramétrica, prueba de pertenencia, puntos de traza, posiciones relativas, ángulo de intersección', when: 'Septiembre', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Área de aprendizaje 1', k: '1.3', title: 'Planos en el espacio',
          sub: 'Ecuación paramétrica y ecuación general, producto vectorial, recta y plano', when: 'Septiembre · octubre', ustd: 8 },
        { file: 'lb1-4.html', lb: 'Área de aprendizaje 1', k: '1.4', title: 'Perpendicular, distancia y áreas',
          sub: 'Pie de la perpendicular, distancia de un punto a un plano, áreas, aplicaciones variadas', when: 'Octubre · noviembre', ustd: 6 },
        { file: 'lb2-1.html', lb: 'Área de aprendizaje 2', k: '2.1', title: 'Límites y tasas de variación',
          sub: 'Sucesiones numéricas, comportamiento en el infinito, continuidad, velocidad media e instantánea', when: 'Noviembre', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Área de aprendizaje 2', k: '2.2', title: 'La derivada',
          sub: 'Cociente diferencial, reglas de derivación, regla de la cadena, tangente y normal', when: 'Noviembre · diciembre', ustd: 12 },
        { file: 'lb2-3.html', lb: 'Área de aprendizaje 2', k: '2.3', title: 'Estudio de funciones',
          sub: 'Ceros, simetría, monotonía, extremos y puntos de inflexión, el esquema completo', when: 'Diciembre · enero', ustd: 8 },
        { file: 'lb2-4.html', lb: 'Área de aprendizaje 2', k: '2.4', title: 'Familias, reconstrucción y optimización',
          sub: 'Puntos de intersección y de tangencia, familias de funciones, funciones a partir de condiciones, optimizar', when: 'Enero', ustd: 7 },
        { file: 'lb3.html', lb: 'Área de aprendizaje 3', k: '3', title: 'Cálculo integral',
          sub: 'Primitivas, integral definida, teorema fundamental, áreas entre gráficas', when: 'Febrero · marzo', ustd: 10 },
        { file: 'lb4-1.html', lb: 'Área de aprendizaje 4', k: '4.1', title: 'Funciones racionales',
          sub: 'Polos y huecos, asíntotas, regla del cociente, estudio completo', when: 'Marzo', ustd: 12 },
        { file: 'lb4-2.html', lb: 'Área de aprendizaje 4', k: '4.2', title: 'Funciones exponenciales de base e',
          sub: 'El número e, ecuaciones exponenciales, derivar con la regla de la cadena y la del producto, crecimiento', when: 'Abril', ustd: 13 },
        { file: 'fhr.html', lb: 'Examen', k: 'P', title: 'En forma para el examen de la FHR',
          sub: 'Listas de control y ejercicios en el formato del examen de todas las áreas de aprendizaje', when: 'Mayo', ustd: 0 },
        { file: 'wb3.html', lb: 'Optativa 3', k: 'OP', title: 'Cálculo diferencial e integral con CAS',
          sub: 'Familias con dos parámetros, funciones definidas a trozos, regresión, perspectiva: proyección central', when: 'Junio', ustd: 8 }
    ]
};
