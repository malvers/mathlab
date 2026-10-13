/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Gymnasium 9" (buch/mathegy9/), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathegy9.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich; 4 Ustd./week, 104 + 8 Ustd.).
 * Doc, 13.10.2026: Spanish round 2 (Lovelace orchestrates, Curie translates). Terms as in tools/buch-es/glosario.md.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matemáticas · Gymnasium 9',
    short: 'Matemáticas GY 9',
    lang: 'es',
    druck: false,
    description: 'Libro de texto interactivo de matemáticas para el Gymnasium (enseñanza secundaria alemana que prepara para el Abitur), 9.º curso, Sajonia: potencias y raíces, funciones potencia, funciones y ecuaciones cuadráticas, problemas de optimización, círculo, cilindro y esfera, el grupo de teoremas de Pitágoras, trigonometría en el triángulo rectángulo, pirámide y cono, análisis de datos y la proporción áurea, con laboratorios, simulaciones y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizaje 1', k: '1.1', title: 'Potencias y raíces',
          sub: 'Potenciar y extraer raíces, propiedades de las potencias con exponentes racionales, ecuaciones con radicales', when: 'Agosto · septiembre', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Área de aprendizaje 1', k: '1.2', title: 'Funciones potencia',
          sub: 'Exponentes enteros y racionales, simetría, ceros y polos, asíntotas', when: 'Septiembre', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Área de aprendizaje 1', k: '1.3', title: 'Parámetros y funciones cuadráticas',
          sub: 'Estirar, desplazar, reflejar, forma normal y forma canónica, completar el cuadrado', when: 'Octubre', ustd: 8 },
        { file: 'lb1-4.html', lb: 'Área de aprendizaje 1', k: '1.4', title: 'Ecuaciones cuadráticas y valores extremos',
          sub: 'Fórmula de resolución, discriminante, teorema de Vieta, problemas de optimización con el vértice', when: 'Noviembre', ustd: 16 },
        { file: 'lb2.html', lb: 'Área de aprendizaje 2', k: '2', title: 'Círculo, cilindro y esfera',
          sub: 'Arco y sector circular, área total, volumen y masa, Arquímedes', when: 'Diciembre', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Área de aprendizaje 3', k: '3.1', title: 'El grupo de teoremas de Pitágoras',
          sub: 'Teorema y demostración, segmentos en el plano y en el espacio, teorema de la altura y del cateto, recíproco', when: 'Enero · febrero', ustd: 16 },
        { file: 'lb3-2.html', lb: 'Área de aprendizaje 3', k: '3.2', title: 'Trigonometría en el triángulo rectángulo',
          sub: 'Seno, coseno y tangente, lados y ángulos, áreas, polígonos regulares y π', when: 'Febrero · marzo', ustd: 12 },
        { file: 'lb3-3.html', lb: 'Área de aprendizaje 3', k: '3.3', title: 'Pirámide y cono',
          sub: 'Área total y volumen, proyecto de topografía', when: 'Marzo', ustd: 4 },
        { file: 'lb4.html', lb: 'Área de aprendizaje 4', k: '4', title: 'Análisis de datos',
          sub: 'Moda, mediana, media, dispersión, histogramas, trucos estadísticos', when: 'Abril', ustd: 12 },
        { file: 'lb5.html', lb: 'Área de aprendizaje 5', k: '5', title: 'Las matemáticas y la tecnología de cálculo moderna',
          sub: 'Resolver un problema real con hoja de cálculo y CAS', when: 'Mayo', ustd: 4 },
        { file: 'wb.html', lb: 'Optativa', k: 'OP', title: 'La proporción áurea',
          sub: 'Deducción, construcción, pentagrama, arte y arquitectura', when: 'Mayo · junio', ustd: 8 }
    ]
};
