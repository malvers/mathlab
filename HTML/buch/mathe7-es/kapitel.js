/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Oberschule 7" (buch/mathe7/, Realschulbildungsgang), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe7.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlbereich 3; 4 Ustd./week, 100 + 8 Ustd.).
 * Doc, 14.10.2026: Spanish round 3 (Lovelace orchestrates, Einstein translates). Terms as in tools/buch-es/glosario.md.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matemáticas · Oberschule 7',
    short: 'Matemáticas OS 7',
    lang: 'es',
    druck: false,
    description: 'Libro de texto interactivo de matemáticas para la Oberschule (escuela secundaria sajona), 7.º curso, itinerario de Realschule (Sajonia): porcentajes e interés, azar y frecuencias, números racionales, expresiones algebraicas y ecuaciones, cuadriláteros, polígonos y prismas con masa y densidad, teselaciones a la manera de Escher, con laboratorios, simulaciones y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizaje 1', k: '1.1', title: 'Porcentajes',
          sub: 'El tanto por ciento como centésima, valor base, valor porcentual y tanto por ciento, los tres problemas básicos, diagramas de sectores', when: 'Agosto · septiembre', ustd: 16 },
        { file: 'lb1-2.html', lb: 'Área de aprendizaje 1', k: '1.2', title: 'Porcentajes en la vida diaria e interés',
          sub: 'Subida y bajada de precios, descuento e IVA, interés anual y por días, interés compuesto con la hoja de cálculo', when: 'Septiembre · octubre', ustd: 12 },
        { file: 'lb2.html', lb: 'Área de aprendizaje 2', k: '2', title: 'Elementos de probabilidad y estadística',
          sub: 'Experimentos aleatorios, resultados y sucesos, frecuencias y simulación, probabilidad, leer estadísticas con espíritu crítico', when: 'Noviembre', ustd: 12 },
        { file: 'lb3-1.html', lb: 'Área de aprendizaje 3', k: '3.1', title: 'Números racionales',
          sub: 'Números negativos, recta numérica, opuesto y valor absoluto, conjuntos numéricos, coordenadas en los cuatro cuadrantes', when: 'Noviembre · diciembre', ustd: 8 },
        { file: 'lb3-2.html', lb: 'Área de aprendizaje 3', k: '3.2', title: 'Calcular con números racionales',
          sub: 'Sumar y restar, multiplicar, dividir y elevar a potencias, propiedades de las operaciones y jerarquía de las operaciones', when: 'Diciembre · enero', ustd: 12 },
        { file: 'lb3-3.html', lb: 'Área de aprendizaje 3', k: '3.3', title: 'Expresiones algebraicas y ecuaciones',
          sub: 'Valor numérico, plantear y resolver ecuaciones, despejar en fórmulas, proporciones', when: 'Enero', ustd: 8 },
        { file: 'lb4-1.html', lb: 'Área de aprendizaje 4', k: '4.1', title: 'Cuadriláteros y polígonos',
          sub: 'Cuadriláteros en el entorno, construir cuadriláteros, área y perímetro, descomponer y comparar polígonos', when: 'Febrero · marzo', ustd: 16 },
        { file: 'lb4-2.html', lb: 'Área de aprendizaje 4', k: '4.2', title: 'Prismas',
          sub: 'Perspectiva caballera y desarrollo plano, área total y volumen, masa y densidad, cuerpos compuestos y envases', when: 'Abril · mayo', ustd: 16 },
        { file: 'wb.html', lb: 'Optativa', k: 'OP', title: 'Teselaciones',
          sub: 'Teselaciones con polígonos regulares, los ángulos en un vértice, teselaciones a la manera de M. C. Escher', when: 'Junio', ustd: 8 }
    ]
};
