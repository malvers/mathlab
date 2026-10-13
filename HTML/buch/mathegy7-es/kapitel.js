/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Gymnasium 7" (buch/mathegy7/), in the order of the
 * school year (Stoffverteilungsplan svp/mathe/mathegy7.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlbereich 3).
 * Doc, 13.10.2026: "Schnappt euch die restlichen Bücher. Und übersetzt die ins Spanische" (round 2, Einstein).
 * Terms as in tools/buch-es/glosario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matemáticas · Gymnasium 7',
    short: 'Matemáticas GY 7',
    lang: 'es',
    druck: false,
    description: 'Libro de texto interactivo de matemáticas para el Gymnasium (secundaria alemana que lleva al Abitur), 7.º curso, Sajonia: circunferencia y recta, circunferencias circunscrita e inscrita, el teorema de Tales y los ángulos en la circunferencia, construir y resolver problemas, números racionales y el cálculo con ellos, ecuaciones y fórmulas, porcentajes, prismas y pirámides en perspectiva caballera, desarrollo plano y dos vistas, área y volumen, diagramas y los sólidos platónicos, con desarrollos que se pliegan en 3D, construcciones paso a paso y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizaje 1', k: '1.1', title: 'Circunferencia y recta, circunscrita e inscrita',
          sub: 'Recta exterior, tangente y secante, mediatrices y bisectrices en el triángulo', when: 'Agosto · septiembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Área de aprendizaje 1', k: '1.2', title: 'Teoremas de la circunferencia',
          sub: 'Teorema de Tales, ángulo inscrito y ángulo central, cuadrilátero inscrito, teorema y demostración', when: 'Septiembre', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Área de aprendizaje 1', k: '1.3', title: 'Construir y resolver problemas',
          sub: 'Figura de análisis y plan de construcción, tangentes desde un punto, trabajar hacia delante y hacia atrás', when: 'Septiembre · octubre', ustd: 8 },
        { file: 'lb2-1.html', lb: 'Área de aprendizaje 2', k: '2.1', title: 'Números racionales',
          sub: 'Números negativos, recta numérica, valor absoluto y opuesto, conjuntos numéricos', when: 'Octubre · noviembre', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Área de aprendizaje 2', k: '2.2', title: 'Calcular con números racionales',
          sub: 'Las cuatro operaciones, reglas de los signos, propiedades, potencias y raíces cuadradas', when: 'Noviembre · diciembre', ustd: 16 },
        { file: 'lb2-3.html', lb: 'Área de aprendizaje 2', k: '2.3', title: 'Ecuaciones y fórmulas',
          sub: 'Resolver ecuaciones mentalmente y con transformaciones equivalentes, problemas, despejar fórmulas', when: 'Diciembre · enero', ustd: 16 },
        { file: 'lb2-4.html', lb: 'Área de aprendizaje 2', k: '2.4', title: 'Porcentajes',
          sub: 'Valor base, valor porcentual y tanto por ciento, descuento e IVA, aumentar en y hasta, diagramas', when: 'Febrero · marzo', ustd: 16 },
        { file: 'lb3-1.html', lb: 'Área de aprendizaje 3', k: '3.1', title: 'Representar prismas y pirámides',
          sub: 'Desarrollo plano, perspectiva caballera y dos vistas, verdadera magnitud', when: 'Abril', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Área de aprendizaje 3', k: '3.2', title: 'Área total, volumen y masa',
          sub: 'Calcular prismas y pirámides, cuerpos compuestos, el tronco de pirámide', when: 'Abril · mayo', ustd: 8 },
        { file: 'lb4.html', lb: 'Área de aprendizaje 4', k: '4', title: 'Representar datos',
          sub: 'Diagramas de barras, de líneas y de sectores, leer con espíritu crítico los diagramas de los medios', when: 'Mayo', ustd: 4 },
        { file: 'wb.html', lb: 'Optativa', k: 'OP', title: 'Sólidos platónicos',
          sub: 'Poliedros, por qué hay exactamente cinco regulares, la fórmula de Euler para poliedros, Platón y Kepler', when: 'Mayo · junio', ustd: 8 }
    ]
};
