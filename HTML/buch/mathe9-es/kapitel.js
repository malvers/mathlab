/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Oberschule 9" (buch/mathe9/, Realschulbildungsgang), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe9.html: LB 1 → LB 2 → LB 3 → Wahlpflichtbereich 1 → LB 4; 4 Ustd./week, 100 + 8 Ustd.).
 * Doc, 14.10.2026: Spanish round 3 (Lovelace orchestrates, Einstein translates). Terms as in tools/buch-es/glosario.md.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Matemáticas · Oberschule 9',
    short: 'Matemáticas OS 9',
    lang: 'es',
    description: 'Libro de texto interactivo de matemáticas para la Oberschule (escuela secundaria sajona), 9.º curso, itinerario de Realschule (Sajonia): el teorema de Pitágoras y su recíproco, seno, coseno y tangente, triángulos rectángulos en la vida diaria, pirámide, cono y esfera, cuerpos compuestos, funciones y ecuaciones de segundo grado con la fórmula general, la proporción áurea y estadística descriptiva con un proyecto propio, con elementos interactivos para probar y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizaje 1', k: '1.1', title: 'El teorema de Pitágoras',
          sub: 'Hipotenusa y catetos, calcular lados y alturas, distancias en el sistema de coordenadas, recíproco y cuerda de nudos', when: 'Agosto · septiembre', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Área de aprendizaje 1', k: '1.2', title: 'Seno, coseno y tangente',
          sub: 'Razones entre los lados de un triángulo rectángulo, calcular lados y ángulos con la calculadora', when: 'Septiembre', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Área de aprendizaje 1', k: '1.3', title: 'Triángulos rectángulos en la vida diaria',
          sub: 'Pendiente en porcentaje y ángulo de inclinación, escalera, tejado y cable tensor, dividir en problemas parciales', when: 'Septiembre · octubre', ustd: 8 },
        { file: 'lb2-1.html', lb: 'Área de aprendizaje 2', k: '2.1', title: 'La pirámide',
          sub: 'Desarrollo plano, perspectiva caballera y representación en dos vistas, altura, apotema y arista lateral, área total, volumen y masa', when: 'Noviembre', ustd: 12 },
        { file: 'lb2-2.html', lb: 'Área de aprendizaje 2', k: '2.2', title: 'Cono y esfera',
          sub: 'Generatriz, la superficie lateral como sector circular, área total y volumen del cono y de la esfera, raíz cúbica', when: 'Diciembre', ustd: 12 },
        { file: 'lb2-3.html', lb: 'Área de aprendizaje 2', k: '2.3', title: 'Cuerpos compuestos',
          sub: 'Descomponer torres, silos, piezas y depósitos, volumen, área total y material necesario', when: 'Enero', ustd: 4 },
        { file: 'lb3-1.html', lb: 'Área de aprendizaje 3', k: '3.1', title: 'Funciones cuadráticas',
          sub: 'Parábola normal, y = a · x² + c, forma canónica y = (x + d)² + e, forma general y completar el cuadrado', when: 'Enero · febrero · marzo', ustd: 16 },
        { file: 'lb3-2.html', lb: 'Área de aprendizaje 3', k: '3.2', title: 'Ecuaciones de segundo grado',
          sub: 'Resolver razonando, la fórmula general y el número de soluciones, ceros, puntos de corte y problemas', when: 'Marzo', ustd: 12 },
        { file: 'wb.html', lb: 'Optativa obligatoria 1', k: 'OP', title: 'La proporción áurea',
          sub: 'La razón de la división y el número Φ, construcción, números de Fibonacci, arte, arquitectura y naturaleza', when: 'Abril', ustd: 8 },
        { file: 'lb4.html', lb: 'Área de aprendizaje 4', k: '4', title: 'Estadística descriptiva',
          sub: 'Datos en los medios, media, mediana y moda, rango, un proyecto estadístico propio', when: 'Mayo · junio', ustd: 16 }
    ]
};
