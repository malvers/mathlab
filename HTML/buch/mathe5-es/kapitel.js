/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Oberschule 5" (buch/mathe5/), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathe5.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlbereich 1; Lehrplan Oberschule 2019:
 * 100 Ustd. Pflicht + 8 Ustd. Wahlbereich). Doc, 26.10.2026: OS 5 in four languages at once (Wonenburger translates).
 * Terms as in tools/buch-es/glosario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Matemáticas · Oberschule 5',
    short: 'Matemáticas OS 5',
    lang: 'es',
    description: 'Libro de texto interactivo de matemáticas para la Oberschule (escuela secundaria sajona), 5.º curso (Sajonia): números grandes, cálculo por escrito, propiedades de las operaciones y jerarquía de las operaciones, cuadrados, ecuaciones y divisibilidad, fracciones, números decimales, porcentajes y magnitudes, coordenadas y ángulos, rectángulo y cubo, simetría y traslación, y los signos numéricos de los babilonios, los egipcios y los romanos, con laboratorios, simulaciones y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizaje 1', k: '1.1', title: 'Números grandes',
          sub: 'Recta numérica, tabla de valores posicionales, millones y miles de millones, redondear, estimar, comparar', when: 'Agosto · septiembre', ustd: 7 },
        { file: 'lb1-2.html', lb: 'Área de aprendizaje 1', k: '1.2', title: 'Calcular con números naturales',
          sub: 'Sumar, restar, multiplicar y dividir por escrito, estimación, propiedades de las operaciones, jerarquía de las operaciones', when: 'Septiembre · octubre', ustd: 15 },
        { file: 'lb1-3.html', lb: 'Área de aprendizaje 1', k: '1.3', title: 'Potencias, ecuaciones y divisores',
          sub: 'Potencias de diez, cuadrados, resolver ecuaciones probando, criterios de divisibilidad, números primos', when: 'Octubre · noviembre', ustd: 12 },
        { file: 'lb2-1.html', lb: 'Área de aprendizaje 2', k: '2.1', title: 'Fracciones',
          sub: 'Representar partes, fracciones en la recta numérica, fracciones de magnitudes, comparar y estimar', when: 'Diciembre · enero', ustd: 11 },
        { file: 'lb2-2.html', lb: 'Área de aprendizaje 2', k: '2.2', title: 'Números decimales y porcentajes',
          sub: 'Décimas, centésimas, milésimas, convertir, comparar, redondear, notación en porcentaje', when: 'Enero', ustd: 9 },
        { file: 'lb2-3.html', lb: 'Área de aprendizaje 2', k: '2.3', title: 'Calcular con números decimales y magnitudes',
          sub: 'Sumar y restar, multiplicar y dividir, media, dinero, longitud, masa y tiempo', when: 'Enero · marzo', ustd: 14 },
        { file: 'lb3-1.html', lb: 'Área de aprendizaje 3', k: '3.1', title: 'Coordenadas, rectas y ángulos',
          sub: 'Sistema de coordenadas, paralelas y perpendiculares, medir, dibujar y estimar ángulos, tipos de ángulos', when: 'Marzo · abril', ustd: 9 },
        { file: 'lb3-2.html', lb: 'Área de aprendizaje 3', k: '3.2', title: 'Rectángulo y cubo',
          sub: 'Perspectiva caballera y desarrollo del cubo, perímetro y área, área total y volumen', when: 'Abril · mayo', ustd: 11 },
        { file: 'lb4.html', lb: 'Área de aprendizaje 4', k: '4', title: 'Simetría y figuras congruentes',
          sub: 'Ejes de simetría, reflexión respecto a una recta, traslación, figura original e imagen, frisos', when: 'Mayo · junio', ustd: 12 },
        { file: 'wb.html', lb: 'Optativa', k: 'OP', title: 'Cómo aprendió la humanidad a contar y a calcular',
          sub: 'Palo de tarja, babilonios, egipcios y romanos, calcular en las líneas, una presentación', when: 'Junio · julio', ustd: 8 }
    ]
};
