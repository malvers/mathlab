/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Oberschule 8" (buch/mathe8/, Realschulbildungsgang), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe8.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → LB 6 → Wahlpflichtbereich 1; 4 Ustd./week, 100 + 8 Ustd.).
 * Doc, 13.10.2026: round 3, the Oberschule books 6–9 in English and Spanish (Lovelace orchestrates, Curie translates). Terms as in tools/buch-es/glosario.md.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matemáticas · Oberschule 8',
    short: 'Matemáticas OS 8',
    lang: 'es',
    druck: false,
    description: 'Libro de texto interactivo de matemáticas para la Oberschule (escuela secundaria sajona), 8.º curso, itinerario de Realschule (Sajonia): expresiones algebraicas y sus transformaciones, ecuaciones lineales y fórmulas, funciones, funciones lineales y sistemas de ecuaciones con comparación de tarifas, la circunferencia y el teorema de Tales, el cilindro, semejanza y homotecia, experimentos aleatorios con diagramas de árbol, las matemáticas en la vida diaria con alquiler, luz y costes de obra, y la bicicleta, con elementos interactivos y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizaje 1', k: '1.1', title: 'Expresiones algebraicas y sus transformaciones',
          sub: 'Valores de expresiones y fórmulas, simplificar, quitar paréntesis, desarrollar y sacar factor común', when: 'Agosto · septiembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Área de aprendizaje 1', k: '1.2', title: 'Ecuaciones lineales y fórmulas',
          sub: 'Transformaciones equivalentes, ninguna o infinitas soluciones, despejar fórmulas, problemas', when: 'Septiembre', ustd: 8 },
        { file: 'lb2-1.html', lb: 'Área de aprendizaje 2', k: '2.1', title: 'Funciones',
          sub: 'Correspondencia unívoca, argumento y valor de la función, dominio y recorrido, funciones de proporcionalidad', when: 'Octubre', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Área de aprendizaje 2', k: '2.2', title: 'Funciones lineales',
          sub: 'y = m · x + n, pendiente y ordenada en el origen, ceros, ecuación a partir de dos puntos', when: 'Noviembre', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Área de aprendizaje 2', k: '2.3', title: 'Sistemas de ecuaciones lineales',
          sub: 'Resolver gráficamente y algebraicamente, número de soluciones, comparar tarifas y precios', when: 'Noviembre · diciembre', ustd: 10 },
        { file: 'lb3-1.html', lb: 'Área de aprendizaje 3', k: '3.1', title: 'La circunferencia',
          sub: 'Circunferencia y recta, teorema de Tales, longitud y área, el número π, la corona circular', when: 'Diciembre · enero', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Área de aprendizaje 3', k: '3.2', title: 'El cilindro',
          sub: 'Desarrollo plano, vistas y perspectiva caballera, área total, volumen y masa de cilindros y cilindros huecos', when: 'Enero', ustd: 6 },
        { file: 'lb4.html', lb: 'Área de aprendizaje 4', k: '4', title: 'Semejanza',
          sub: 'Homotecia y escala, criterio principal de semejanza, longitudes, áreas y volúmenes, congruencia', when: 'Marzo', ustd: 14 },
        { file: 'lb5.html', lb: 'Área de aprendizaje 5', k: '5', title: 'Sucesos aleatorios',
          sub: 'Simular, diagrama de árbol y reglas de las ramas, con y sin reemplazamiento, recuento', when: 'Abril', ustd: 14 },
        { file: 'lb6.html', lb: 'Área de aprendizaje 6', k: '6', title: 'Las matemáticas en la vida diaria',
          sub: 'Alquiler y gastos, facturas de luz y agua, costes de obra, comparar ofertas e intereses', when: 'Mayo · junio', ustd: 12 },
        { file: 'wb.html', lb: 'Optativa obligatoria', k: 'OP', title: 'La bicicleta',
          sub: 'Pulgadas y medida del neumático, longitud de la rueda, relación de transmisión, cadencia y velocidad', when: 'Junio', ustd: 8 }
    ]
};
