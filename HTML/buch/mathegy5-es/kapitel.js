/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Gymnasium 5" (buch/mathegy5/), in the order of the
 * school year (Stoffverteilungsplan svp/mathe/mathegy5.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 3).
 * Doc, 13.10.2026: "Schnappt euch die restlichen Bücher. Und übersetzt die ins Spanische" (round 2, Einstein).
 * Terms as in tools/buch-es/glosario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matemáticas · Gymnasium 5',
    short: 'Matemáticas GY 5',
    lang: 'es',
    druck: false,
    description: 'Libro de texto interactivo de matemáticas para el Gymnasium (secundaria alemana que lleva al Abitur), 5.º curso, Sajonia: números grandes, redondeo, propiedades de las operaciones, potencias, divisores y números primos, fracciones, números decimales y porcentajes, coordenadas, ángulos, simetría y reflexión, rectángulos y ortoedros, magnitudes en la vida cotidiana y los números de los egipcios, los romanos y los mayas, con laboratorios, simulaciones y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizaje 1', k: '1.1', title: 'Números grandes',
          sub: 'Tabla de valores posicionales, recta numérica, estimar, redondear, comparar y ordenar', when: 'Agosto · septiembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Área de aprendizaje 1', k: '1.2', title: 'Calcular con números naturales',
          sub: 'Propiedades de las operaciones y trucos de cálculo, estimación, potencias, dividir', when: 'Septiembre', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Área de aprendizaje 1', k: '1.3', title: 'Divisores y números primos',
          sub: 'Divisores y múltiplos, criterios de divisibilidad, la criba de Eratóstenes, factores primos', when: 'Septiembre · octubre', ustd: 3 },
        { file: 'lb2-1.html', lb: 'Área de aprendizaje 2', k: '2.1', title: 'Fracciones',
          sub: 'Representar partes, simplificar y amplificar, fracciones propias e impropias, comparar', when: 'Noviembre', ustd: 12 },
        { file: 'lb2-2.html', lb: 'Área de aprendizaje 2', k: '2.2', title: 'Números decimales y porcentajes',
          sub: 'Décimas, centésimas, milésimas, convertir, porcentaje, ordenar y redondear', when: 'Noviembre · diciembre', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Área de aprendizaje 2', k: '2.3', title: 'Calcular con números decimales',
          sub: 'Sumar y restar, desplazar la coma, multiplicar y dividir, media', when: 'Diciembre', ustd: 7 },
        { file: 'lb3-1.html', lb: 'Área de aprendizaje 3', k: '3.1', title: 'Coordenadas y ángulos',
          sub: 'Sistema de coordenadas, paralelas y perpendiculares, medir ángulos, tipos de ángulos, pares de ángulos', when: 'Enero · febrero', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Área de aprendizaje 3', k: '3.2', title: 'Simetría y reflexión',
          sub: 'Patrones, simetría axial y central, traslación, giro, reflexión respecto a una recta', when: 'Febrero · marzo', ustd: 10 },
        { file: 'lb4-1.html', lb: 'Área de aprendizaje 4', k: '4.1', title: 'Rectángulos',
          sub: 'Perímetro y área, unidades de superficie, figuras compuestas', when: 'Marzo · abril', ustd: 8 },
        { file: 'lb4-2.html', lb: 'Área de aprendizaje 4', k: '4.2', title: 'Ortoedros',
          sub: 'Vistas, perspectiva caballera, desarrollo plano, volumen, unidades de capacidad, área total, proyecto envases', when: 'Abril · mayo', ustd: 14 },
        { file: 'lb5.html', lb: 'Área de aprendizaje 5', k: '5', title: 'Matemáticas en la vida cotidiana',
          sub: 'Convertir magnitudes, valores aproximados, horarios, problemas de Fermi, un proyecto', when: 'Mayo · junio', ustd: 10 },
        { file: 'wb.html', lb: 'Optativa', k: 'OP', title: 'Contar y calcular, antes y ahora',
          sub: 'Egipcios, romanos y mayas, Adam Ries, el sistema binario', when: 'Junio', ustd: 8 }
    ]
};
