/* kapitel.js — the chapters of the English edition of "Mathematik · Gymnasium 11" (buch/mathegy11/, Grundkurs), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathegy11.html: LB 1 with LB 2 before the conditions part, Wahlbereich 2 at the end of 11/I,
 * then LB 3 → LB 4; 4 Ustd./week). The numbers follow the Lehrplan, so chapter 2 comes between 1.4 and 1.5.
 * Doc, 11.10.2026: "ok, go on all agents" (book 8, Einstein).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Mathematics · Grammar School 11',
    short: 'Mathematics GY 11',
    lang: 'en',
    description: 'Interactive mathematics textbook for the Gymnasium (grammar school), Year 11, basic course (Saxony): limits, the derivative and the rules of differentiation, investigating functions, functions from conditions, optimisation problems and regression, matrices and the Gauss-Jordan method, numerical methods, vectors, lines and planes in space, multi-stage random experiments and the binomial distribution, with labs, simulations and self-checks with instant feedback.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Learning area 1', k: '1.1', title: 'Limits and continuity',
          sub: 'Behaviour at infinity, limit at a point, limit theorems, continuity', when: 'August · September', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Learning area 1', k: '1.2', title: 'Rates of change and the derivative',
          sub: 'Secant and tangent, difference quotient and derivative, derivative function', when: 'September', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Learning area 1', k: '1.3', title: 'Rules of differentiation',
          sub: 'Power, constant multiple and sum rules, eˣ, ln x and sin x, product and chain rules', when: 'September · October', ustd: 12 },
        { file: 'lb1-4.html', lb: 'Learning area 1', k: '1.4', title: 'Investigating functions',
          sub: 'Monotonicity, extrema, points of inflection, symmetry, poles and asymptotes', when: 'October · November', ustd: 12 },
        { file: 'lb2.html', lb: 'Learning area 2', k: '2', title: 'Matrices',
          sub: 'Matrix notation, multiplication, Gauss-Jordan method, rotations', when: 'November · December', ustd: 6 },
        { file: 'lb1-5.html', lb: 'Learning area 1', k: '1.5', title: 'Functions made to measure',
          sub: 'Functions from conditions, optimisation problems, regression', when: 'December · January', ustd: 12 },
        { file: 'wb2.html', lb: 'Elective 2', k: 'W', title: 'Numerical methods',
          sub: 'Solving equations graphically, bisection, Newton’s method', when: 'January · February', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Learning area 3', k: '3.1', title: 'Vectors in space',
          sub: 'Three-dimensional coordinate system, calculating with vectors, linear dependence', when: 'February · March', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Learning area 3', k: '3.2', title: 'Lines in space',
          sub: 'Parametric form, point test, trace points, relative positions of two lines', when: 'March', ustd: 8 },
        { file: 'lb3-3.html', lb: 'Learning area 3', k: '3.3', title: 'Planes',
          sub: 'Parametric form, coordinate form, position of a line and a plane', when: 'April', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Learning area 4', k: '4.1', title: 'Multi-stage random experiments',
          sub: 'Urn model, path rules, two-way table, stochastic independence, simulation', when: 'April · May', ustd: 6 },
        { file: 'lb4-2.html', lb: 'Learning area 4', k: '4.2', title: 'The binomial distribution',
          sub: 'Bernoulli chains, binomial coefficient, cumulative probabilities, expected value and standard deviation', when: 'May · June', ustd: 12 }
    ]
};
