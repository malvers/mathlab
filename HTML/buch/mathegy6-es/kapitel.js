/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Gymnasium 6" (buch/mathegy6/), in the order of the
 * school year (Stoffverteilungsplan svp/mathe/mathegy6.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 3).
 * Doc, 13.10.2026: "Schnappt euch die restlichen Bücher. Und übersetzt die ins Spanische" (round 2, Einstein).
 * Terms as in tools/buch-es/glosario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matemáticas · Gymnasium 6',
    short: 'Matemáticas GY 6',
    lang: 'es',
    druck: false,
    description: 'Libro de texto interactivo de matemáticas para el Gymnasium (secundaria alemana que lleva al Abitur), 6.º curso, Sajonia: fracciones, números decimales y porcentajes, cálculo con números fraccionarios, ecuaciones y problemas, correspondencias y regla de tres, triángulos y cuadriláteros con la suma de sus ángulos, congruencia y área, prismas, partes de un todo y números primos, con laboratorios, simulaciones y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizaje 1', k: '1.1', title: 'Representar números fraccionarios',
          sub: 'Fracciones, números decimales y porcentajes, exactos o periódicos, conjuntos y conjuntos numéricos', when: 'Agosto · septiembre', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Área de aprendizaje 1', k: '1.2', title: 'Calcular con números fraccionarios',
          sub: 'Sumar, restar, multiplicar y dividir con fracciones y números decimales', when: 'Septiembre', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Área de aprendizaje 1', k: '1.3', title: 'Propiedades, ecuaciones y problemas',
          sub: 'Jerarquía de las operaciones y trucos de cálculo, resolver ecuaciones e inecuaciones razonando, problemas con un plan', when: 'Octubre · noviembre', ustd: 10 },
        { file: 'lb2-1.html', lb: 'Área de aprendizaje 2', k: '2.1', title: 'Correspondencias',
          sub: 'No unívocas, unívocas, biunívocas, tabla, diagrama y ecuación, frecuencias absolutas y relativas', when: 'Noviembre · diciembre', ustd: 12 },
        { file: 'lb2-2.html', lb: 'Área de aprendizaje 2', k: '2.2', title: 'Correspondencias proporcionales',
          sub: 'Proporcionalidad directa e inversa, igualdad de cocientes y de productos, gráficas, regla de tres', when: 'Diciembre · enero', ustd: 12 },
        { file: 'lb3-1.html', lb: 'Área de aprendizaje 3', k: '3.1', title: 'Suma de ángulos y congruencia',
          sub: 'Suma de los ángulos interiores con demostración, definición y teorema, criterios de congruencia, construcción de triángulos', when: 'Enero · febrero', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Área de aprendizaje 3', k: '3.2', title: 'Teoremas y rectas notables del triángulo',
          sub: 'Ángulos de la base, lados y ángulos, desigualdad triangular, mediatrices, bisectrices, alturas, medianas', when: 'Marzo', ustd: 8 },
        { file: 'lb3-3.html', lb: 'Área de aprendizaje 3', k: '3.3', title: 'El área y la casa de los cuadriláteros',
          sub: 'Paralelogramo, triángulo, trapecio y deltoide, figuras compuestas, clasificar cuadriláteros', when: 'Marzo · abril', ustd: 10 },
        { file: 'lb4.html', lb: 'Área de aprendizaje 4', k: '4', title: 'Prismas',
          sub: 'Propiedades, perspectiva caballera y desarrollo plano, área total y volumen, proyecto residuos de envases', when: 'Abril · mayo', ustd: 12 },
        { file: 'lb5.html', lb: 'Área de aprendizaje 5', k: '5', title: 'Relacionar: partes de un todo',
          sub: 'Fracción y porcentaje, diagramas de sectores, partes de superficies y de volúmenes', when: 'Mayo', ustd: 4 },
        { file: 'wb.html', lb: 'Optativa', k: 'OP', title: 'Números primos',
          sub: 'Criba de Eratóstenes, descomposición en factores primos, infinitos números primos, criptografía', when: 'Mayo · junio', ustd: 8 }
    ]
};
