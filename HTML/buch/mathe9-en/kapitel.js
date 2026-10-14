/* kapitel.js — the chapters of the English edition of "Mathematik · Oberschule 9" (Realschulbildungsgang, buch/mathe9/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe9.html: LB 1 → LB 2 → LB 3 → Wahlpflichtbereich 1 → LB 4; 4 Ustd./week, 100 + 8 Ustd.).
 * Doc, 13.10.2026: round 3 of the English editions (Lovelace orchestrates, Einstein translates).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathematics · Secondary School 9',
    short: 'Mathematics OS 9',
    lang: 'en',
    druck: false,
    description: 'Interactive mathematics textbook for the Oberschule (secondary school), Year 9, intermediate track (Saxony): Pythagoras’ theorem and its converse, sine, cosine and tangent, right triangles in everyday life, pyramid, cone and sphere, composite solids, quadratic functions and equations with the formula, the golden ratio and descriptive statistics with a project of your own, with widgets to try out and self-checks with instant feedback.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Learning area 1', k: '1.1', title: 'Pythagoras’ theorem',
          sub: 'Hypotenuse and legs, finding sides and heights, distances in the coordinate system, converse and knotted rope', when: 'August · September', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Learning area 1', k: '1.2', title: 'Sine, cosine and tangent',
          sub: 'Ratios of sides in a right triangle, finding sides and angles with the calculator', when: 'September', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Learning area 1', k: '1.3', title: 'Right triangles in everyday life',
          sub: 'Gradient in percent and angle of inclination, ladder, roof and guy rope, splitting into smaller problems', when: 'September · October', ustd: 8 },
        { file: 'lb2-1.html', lb: 'Learning area 2', k: '2.1', title: 'The pyramid',
          sub: 'Net, oblique drawing and two-view drawing, height, slant height and lateral edge, surface area, volume and mass', when: 'November', ustd: 12 },
        { file: 'lb2-2.html', lb: 'Learning area 2', k: '2.2', title: 'Cone and sphere',
          sub: 'Slant height, the curved surface as a sector, surface area and volume of cone and sphere, cube root', when: 'December', ustd: 12 },
        { file: 'lb2-3.html', lb: 'Learning area 2', k: '2.3', title: 'Composite solids',
          sub: 'Splitting up towers, silos, workpieces and containers, volume, surface area and material needed', when: 'January', ustd: 4 },
        { file: 'lb3-1.html', lb: 'Learning area 3', k: '3.1', title: 'Quadratic functions',
          sub: 'Standard parabola, y = a · x² + c, vertex form y = (x + d)² + e, normal form and completing the square', when: 'January · February · March', ustd: 16 },
        { file: 'lb3-2.html', lb: 'Learning area 3', k: '3.2', title: 'Quadratic equations',
          sub: 'Solving by reasoning, the formula and the number of solutions, zeros, points of intersection and word problems', when: 'March', ustd: 12 },
        { file: 'wb.html', lb: 'Compulsory elective area 1', k: 'E', title: 'The golden ratio',
          sub: 'The ratio of division and the number Φ, construction, Fibonacci numbers, art, architecture and nature', when: 'April', ustd: 8 },
        { file: 'lb4.html', lb: 'Learning area 4', k: '4', title: 'Descriptive statistics',
          sub: 'Data in the media, mean, median and mode, range, a statistics project of your own', when: 'May · June', ustd: 16 }
    ]
};
