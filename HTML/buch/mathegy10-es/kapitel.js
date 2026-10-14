/* kapitel.js — the chapters of the Spanish edition of "Mathematik · Gymnasium 10" (buch/mathegy10/), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathegy10.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich; 4 Ustd./week, 112 Ustd.).
 * Doc, 13.10.2026: Spanish round 2 (Lovelace orchestrates and translates GY 10). Terms as in tools/buch-es/glosario.md.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matemáticas · Gymnasium 10',
    short: 'Matemáticas GY 10',
    lang: 'es',
    druck: false,
    description: 'Libro de texto interactivo de matemáticas para el Gymnasium (enseñanza secundaria alemana que prepara para el Abitur), 10.º curso, Sajonia: crecimiento y funciones exponenciales, procesos periódicos y la función seno, variables aleatorias, esperanza y juegos justos, teoremas del seno y del coseno, logaritmo y ecuaciones exponenciales, tangente, panorama de las funciones, sucesiones y límites, cálculo de intereses y números complejos, con laboratorios, simulaciones y autoevaluaciones con respuesta inmediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Área de aprendizaje 1', k: '1.1', title: 'Crecimiento y funciones exponenciales',
          sub: 'Lineal, exponencial, limitado, recursivo y explícito, parámetros y regresión', when: 'Agosto · septiembre', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Área de aprendizaje 1', k: '1.2', title: 'Procesos periódicos y la función seno',
          sub: 'Período, amplitud, línea media, grados y radianes, parámetros de la función seno', when: 'Septiembre · octubre', ustd: 10 },
        { file: 'lb2-1.html', lb: 'Área de aprendizaje 2', k: '2.1', title: 'Variables aleatorias y reglas de las ramas',
          sub: 'Distribuciones de probabilidad, diagrama de barras, «exactamente k», «al menos k», «como máximo k»', when: 'Noviembre', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Área de aprendizaje 2', k: '2.2', title: 'Esperanza y juegos justos',
          sub: 'Esperanza, varianza y desviación típica, juegos justos e injustos', when: 'Noviembre', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Área de aprendizaje 3', k: '3.1', title: 'Teorema del seno, teorema del coseno y área',
          sub: 'Triángulos cualesquiera, el caso ambiguo, Pitágoras como caso particular, fórmula del área con el seno', when: 'Diciembre', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Área de aprendizaje 3', k: '3.2', title: 'Cálculos en triángulos y cuerpos',
          sub: 'Plan de resolución, topografía, pirámide y cono, problemas realistas', when: 'Enero', ustd: 8 },
        { file: 'lb4-1.html', lb: 'Área de aprendizaje 4', k: '4.1', title: 'Función inversa y logaritmo',
          sub: 'Invertibilidad, reflexión respecto a y = x, el logaritmo, propiedades de los logaritmos', when: 'Enero · febrero', ustd: 12 },
        { file: 'lb4-2.html', lb: 'Área de aprendizaje 4', k: '4.2', title: 'Funciones logarítmicas y ecuaciones exponenciales',
          sub: 'Gráfica y propiedades, ecuaciones exponenciales, tiempo de duplicación y período de semidesintegración', when: 'Marzo', ustd: 8 },
        { file: 'lb4-3.html', lb: 'Área de aprendizaje 4', k: '4.3', title: 'Operar, componer y la función tangente',
          sub: 'Suma, producto, cociente, función interior y exterior, tangente con polos', when: 'Marzo', ustd: 8 },
        { file: 'lb4-4.html', lb: 'Área de aprendizaje 4', k: '4.4', title: 'Panorama de las funciones',
          sub: 'Ordenar las clases de funciones, fichas de identidad, esbozar gráficas sin calculadora', when: 'Abril', ustd: 8 },
        { file: 'lb4-5.html', lb: 'Área de aprendizaje 4', k: '4.5', title: 'Sucesiones numéricas y límites',
          sub: 'Explícitas y recursivas, monotonía, cotas, límite, circunferencia en forma paramétrica', when: 'Abril', ustd: 6 },
        { file: 'lb5.html', lb: 'Área de aprendizaje 5', k: '5', title: 'Cálculo de intereses',
          sub: 'Interés simple e interés compuesto, préstamo y cuadro de amortización, lo que cuesta de verdad un préstamo', when: 'Mayo', ustd: 4 },
        { file: 'wb.html', lb: 'Optativa', k: 'OP', title: 'Números complejos',
          sub: 'Unidad imaginaria, operaciones en ℂ, plano de Gauss, módulo y argumento', when: 'Mayo · junio', ustd: 8 }
    ]
};
