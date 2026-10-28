/* kapitel.js — the chapters of the English edition of "Mathematik · Berufliches Gymnasium 13 · Leistungskurs" (buch/mathe13lk/), in the
 * order of the school year (Lehrplan Berufliches Gymnasium Mathematik, Sachsen, 2026, Leistungskurs Jahrgangsstufe 13: LB 3 → LB 4 → LB 5 →
 * Wahlpflicht 1 or Wahlpflicht 2 (the school chooses one, the book has both) → LB 7 → Abiturvorbereitung).
 * Doc, 28.10.2026: "Die Übersetzung, die fangen wir heute an. Und ziehen es durch." (Curie orchestrates, Taussky translates).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Mathematics · Vocational Grammar School 13 · Advanced Course',
    short: 'Mathematics 13 Advanced',
    lang: 'en',
    description: 'Interactive mathematics textbook for the Berufliches Gymnasium (vocational grammar school), Year 13, advanced course (Saxony): integral calculus with the fundamental theorem and solids of revolution, normally distributed random variables, inferential statistics, both compulsory electives – lines and planes in space or matrices with the Leontief model and population models –, further applications and a chapter to prepare for the Abitur, with labs, simulations, 3D graphics and self-checks with instant feedback.',
    chapters: [
        { file: 'lb3-1.html', lb: 'Learning area 3', k: '3.1', title: 'Antiderivatives',
          sub: 'Differentiating backwards, verification, rules of integration, 1/x and ln|x|, CAS', when: 'August · September', ustd: 10 },
        { file: 'lb3-2.html', lb: 'Learning area 3', k: '3.2', title: 'The definite integral and the fundamental theorem',
          sub: 'Reconstructed total, properties, integral function, fundamental theorem with proof', when: 'September', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Learning area 3', k: '3.3', title: 'Areas',
          sub: 'Between a graph and the x-axis, between two graphs, areas with a parameter', when: 'October', ustd: 8 },
        { file: 'lb3-4.html', lb: 'Learning area 3', k: '3.4', title: 'Numerical integration and solids of revolution',
          sub: 'Rectangle and trapezium methods, volume of rotation about the x-axis', when: 'October · November', ustd: 10 },
        { file: 'lb4.html', lb: 'Learning area 4', k: '4', title: 'Normally distributed random variables',
          sub: 'Bell curve, density and distribution functions, expected value, standard deviation, σ rules', when: 'November', ustd: 12 },
        { file: 'lb5-1.html', lb: 'Learning area 5', k: '5.1', title: 'Population and sample',
          sub: 'Estimating and testing, sample mean and sample variance', when: 'December', ustd: 5 },
        { file: 'lb5-2.html', lb: 'Learning area 5', k: '5.2', title: 'Significance tests',
          sub: 'One- and two-tailed tests, rejection region, type I and type II errors, confidence level', when: 'December · January', ustd: 10 },
        { file: 'wp1-1.html', lb: 'Elective 1', k: 'E1.1', title: 'Lines and planes',
          sub: 'Parametric equations, cross product, coordinate equation, Hesse normal form', when: 'January', ustd: 9 },
        { file: 'wp1-2.html', lb: 'Elective 1', k: 'E1.2', title: 'Relative positions and angles of intersection',
          sub: 'Point, line, plane: intersections, trace points, trace lines, angles of intersection', when: 'January · February', ustd: 9 },
        { file: 'wp1-3.html', lb: 'Elective 1', k: 'E1.3', title: 'Distances, prisms and pyramids',
          sub: 'Distance point–plane, line–plane, plane–plane, surface area and volume', when: 'February', ustd: 7 },
        { file: 'wp2-1.html', lb: 'Elective 2', k: 'E2.1', title: 'Multiplying and inverting matrices',
          sub: 'Matrix product, identity matrix, inverse matrix, systems of equations with the inverse', when: 'January', ustd: 8 },
        { file: 'wp2-2.html', lb: 'Elective 2', k: 'E2.2', title: 'Interdependence and the Leontief model',
          sub: 'Gozinto graphs, multi-stage production, cost calculation, input-output analysis', when: 'January · February', ustd: 9 },
        { file: 'wp2-3.html', lb: 'Elective 2', k: 'E2.3', title: 'Population models',
          sub: 'Transition matrices, powers of matrices, limit matrix and fixed vector, cyclic development', when: 'February', ustd: 8 },
        { file: 'lb7-1.html', lb: 'Learning area 7', k: '7.1', title: 'Biquadratic equations and families of functions',
          sub: 'Substitution, families, parameters and the number of solutions, loci', when: 'February · March', ustd: 8 },
        { file: 'lb7-2.html', lb: 'Learning area 7', k: '7.2', title: 'Parameters and extreme values in space and economics',
          sub: 'Systems of equations with a parameter, rotation matrices, shortest distances, costs, revenue and profit', when: 'March', ustd: 7 },
        { file: 'abi.html', lb: 'Abitur', k: 'A', title: 'Ready for the Abitur',
          sub: 'Checklists, common pitfalls and exercises in the Abitur format of the advanced course from Years 11, 12 and 13', when: 'March · April', ustd: 0 }
    ]
};
