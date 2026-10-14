/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Oberschule 6" (buch/mathe6/), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathe6.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 2; 5 Ustd./week, 125 + 10 Ustd.).
 * Spanish round 3 (Lovelace Orchestration coordinates, Turing translates). Terms as in tools/buch-es/glosario.md.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matemáticas · Oberschule 6',
    short: 'Matemáticas OS 6',
    lang: 'es',
    druck: false,
    description: 'Libro de texto interactivo de matemáticas para la Oberschule (escuela secundaria sajona), 6.º curso (Sajonia): representar, convertir y comparar números fraccionarios, cálculo con fracciones y decimales, correspondencias y regla de tres, ángulos y triángulos, área y perímetro, cuerpos y sus desarrollos, matemáticas en la vida cotidiana y juegos matemáticos, con laboratorios, simulaciones y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizaje 1', k: '1.1', title: 'Representar números fraccionarios',
          sub: 'Conjuntos, recta numérica, amplificar y simplificar, fracción y número decimal, comparar', when: 'Agosto · Septiembre', ustd: 20 },
        { file: 'lb1-2.html', lb: 'Área de aprendizaje 1', k: '1.2', title: 'Calcular con números fraccionarios',
          sub: 'Sumar y restar, multiplicar y dividir, cálculo mental y estimación', when: 'Septiembre · Octubre', ustd: 10 },
        { file: 'lb1-3.html', lb: 'Área de aprendizaje 1', k: '1.3', title: 'Leyes del cálculo, media y problemas',
          sub: 'Prioridad de las operaciones y trucos de cálculo, media aritmética, resolver ecuaciones razonando', when: 'Octubre', ustd: 5 },
        { file: 'lb2-1.html', lb: 'Área de aprendizaje 2', k: '2.1', title: 'Representar correspondencias',
          sub: 'Unívocas, biunívocas, no unívocas, con palabras, tabla, flechas, gráfica y ecuación', when: 'Noviembre', ustd: 10 },
        { file: 'lb2-2.html', lb: 'Área de aprendizaje 2', k: '2.2', title: 'Proporcionalidad y regla de tres',
          sub: 'Directa e inversamente proporcional, cociente y producto, regla de tres, problemas', when: 'Noviembre · Diciembre', ustd: 15 },
        { file: 'lb3-1.html', lb: 'Área de aprendizaje 3', k: '3.1', title: 'Ángulos y triángulos',
          sub: 'Ángulos en rectas, suma de los ángulos interiores, tipos de triángulos, criterios de congruencia y desigualdad triangular', when: 'Enero', ustd: 15 },
        { file: 'lb3-2.html', lb: 'Área de aprendizaje 3', k: '3.2', title: 'Área y perímetro',
          sub: 'Triángulo, paralelogramo, deltoide y trapecio, figuras compuestas, resolución de problemas', when: 'Enero · Febrero', ustd: 15 },
        { file: 'lb4.html', lb: 'Área de aprendizaje 4', k: '4', title: 'Cuerpos geométricos',
          sub: 'Describir cuerpos, vistas, perspectiva caballera y desarrollo, cuerpos compuestos, prismas rectos', when: 'Marzo · Abril', ustd: 20 },
        { file: 'lb5.html', lb: 'Área de aprendizaje 5', k: '5', title: 'Matemáticas en la vida cotidiana',
          sub: 'Estrategias de resolución de problemas, experimentos aleatorios y frecuencias, si – entonces y cuanto más – más', when: 'Abril · Mayo', ustd: 15 },
        { file: 'wb.html', lb: 'Optativa', k: 'OP', title: 'Juegos matemáticos',
          sub: 'Tangram y cubo Soma, torre de Hanói, juegos de Nim, juegos de dados, un juego propio', when: 'Junio', ustd: 10 }
    ]
};
