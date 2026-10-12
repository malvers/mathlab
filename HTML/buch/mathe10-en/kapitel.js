/* kapitel.js — the chapters of the English edition of "Mathematik · Oberschule 10" (Realschulbildungsgang, buch/mathe10/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe10.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlpflichtbereich 3; 4 Ustd./week, 80 + 8 Ustd.).
 * Doc, 11.10.2026: book 16 of the English editions (forloop-71 orchestrates, Newton translates).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathematics · Secondary School 10',
    short: 'Mathematics OS 10',
    lang: 'en',
    druck: false,
    description: 'Interactive mathematics textbook for the Oberschule (secondary school), Year 10, intermediate track (Saxony): triangles and polygons with the sine and cosine rules, power, exponential and sine functions, random variables and expected value, wages, saving and credit, solids with frustums of pyramids and cones, problem solving for the final exam and surveying, with labs, simulations and self-checks with instant feedback.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Learning area 1', k: '1.1', title: 'Triangles, quadrilaterals and trigonometry',
          sub: 'Family of quadrilaterals, angle sums, sine, cosine and tangent in figures', when: 'August · September', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Learning area 1', k: '1.2', title: 'Sine rule and cosine rule',
          sub: 'Sides and angles in any triangle, finding distances', when: 'September', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Learning area 1', k: '1.3', title: 'Areas of triangles and polygons',
          sub: 'Area with the sine, regular polygons, calculating plots of land', when: 'September · October', ustd: 4 },
        { file: 'lb2-1.html', lb: 'Learning area 2', k: '2.1', title: 'Power functions',
          sub: 'Parabolas and hyperbolas, symmetry, asymptotes, inverse proportion', when: 'November', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Learning area 2', k: '2.2', title: 'Exponential functions',
          sub: 'Growth and decay, growth factor, compound interest, half-life', when: 'November', ustd: 4 },
        { file: 'lb2-3.html', lb: 'Learning area 2', k: '2.3', title: 'The sine function',
          sub: 'Radians, unit circle, amplitude and period, functions at a glance', when: 'November · December', ustd: 8 },
        { file: 'lb3.html', lb: 'Learning area 3', k: '3', title: 'Random variables and expected value',
          sub: 'Probability distribution, expected value, fair games, simulation and risk', when: 'December · January', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Learning area 4', k: '4.1', title: 'Money in everyday life',
          sub: 'Wages and deductions, household budget, saving, credit and the debt trap', when: 'January', ustd: 8 },
        { file: 'lb4-2.html', lb: 'Learning area 4', k: '4.2', title: 'Solids and frustums',
          sub: 'Prism, cylinder, pyramid, cone and sphere, frustums of pyramids and cones, mass and costs', when: 'February · March', ustd: 8 },
        { file: 'lb4-3.html', lb: 'Learning area 4', k: '4.3', title: 'Solving problems',
          sub: 'Probability and functions in everyday life, basic knowledge without aids, ready for the exam', when: 'March', ustd: 12 },
        { file: 'wb.html', lb: 'Compulsory elective area 3', k: 'E', title: 'Surveying problems',
          sub: 'Forester’s triangle, shadow method, intercept theorems, triangulation, surveying at school', when: 'May', ustd: 8 }
    ]
};
