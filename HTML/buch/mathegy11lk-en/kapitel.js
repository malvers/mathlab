/* kapitel.js — the chapters of the English edition of "Mathematik · Gymnasium 11 · Leistungskurs" (buch/mathegy11lk/), in the order
 * of the school year (Stoffverteilungsplan of the Leistungskurs 11, 5 Ustd./week: LB 1 with LB 2 before the conditions part, Wahlbereich 2
 * at the end of 11/I, then LB 3 → LB 4). The numbers follow the Lehrplan, so chapter 2 comes between 1.4 and 1.5.
 * Doc, 11.10.2026: "Dann fangt an" (book 9; forloop-71 orchestrates, Einstein, Turing and both Newtons translate).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathematics · Grammar School 11 · Advanced Course',
    short: 'Mathematics GY 11 Advanced',
    lang: 'en',
    druck: false,
    description: 'Interactive mathematics textbook for the Gymnasium (grammar school), Year 11, advanced course (Saxony): limits and continuity, the derivative from its definition and linear approximation, rules of differentiation with proofs, investigating functions, matrices with rotations and input-output tables, functions from conditions, optimisation and regression, numerical methods up to the fixed-point theorem, vectors, lines and planes in all positions, the concept of probability, Bayes’ theorem and the binomial distribution, with labs, simulations and self-checks with instant feedback.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Learning area 1', k: '1.1', title: 'Limits and continuity',
          sub: 'Behaviour at infinity, limit at a point, limit theorems, piecewise-defined functions, continuity', when: 'August · September', ustd: 15 },
        { file: 'lb1-2.html', lb: 'Learning area 1', k: '1.2', title: 'Rates of change and the derivative',
          sub: 'Linear approximation, difference and differential quotient, derivative from the definition, differentiability', when: 'September', ustd: 10 },
        { file: 'lb1-3.html', lb: 'Learning area 1', k: '1.3', title: 'Rules of differentiation',
          sub: 'Rules with proofs, eˣ, ln x and sin x, product and chain rules, reversing differentiation', when: 'October', ustd: 15 },
        { file: 'lb1-4.html', lb: 'Learning area 1', k: '1.4', title: 'Investigating functions',
          sub: 'Monotonicity, extrema, curvature and points of inflection, symmetry, poles, oblique asymptotes', when: 'November', ustd: 14 },
        { file: 'lb2.html', lb: 'Learning area 2', k: '2', title: 'Matrices',
          sub: 'Ax = b, product of chained matrices, Gauss-Jordan method, rotations, input-output tables', when: 'November · December', ustd: 6 },
        { file: 'lb1-5.html', lb: 'Learning area 1', k: '1.5', title: 'Functions from conditions, extrema, regression',
          sub: 'Functions from conditions, optimisation problems, equations of functions by regression', when: 'December', ustd: 12 },
        { file: 'wb2.html', lb: 'Elective area 2', k: 'E', title: 'Numerical methods',
          sub: 'Graphical solution, bisection, Newton’s method, fixed-point iteration, Banach’s theorem', when: 'January', ustd: 10 },
        { file: 'lb3-1.html', lb: 'Learning area 3', k: '3.1', title: 'Space and vectors',
          sub: 'Three-dimensional coordinate system, other coordinate systems, calculating with vectors, laws of arithmetic', when: 'February · March', ustd: 10 },
        { file: 'lb3-2.html', lb: 'Learning area 3', k: '3.2', title: 'Linear dependence and lines',
          sub: 'Linear dependence and independence, lines in parametric form, relative position of two lines', when: 'March', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Learning area 3', k: '3.3', title: 'Planes and relative positions',
          sub: 'Parametric and coordinate form, line and plane, plane and plane, line of intersection', when: 'March · April', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Learning area 4', k: '4.1', title: 'Probability and counting',
          sub: 'Statistical, Laplace, Kolmogorov, simulation, urn model, path rules, two-way table, counting methods', when: 'April · May', ustd: 13 },
        { file: 'lb4-2.html', lb: 'Learning area 4', k: '4.2', title: 'Conditional probability and Bayes',
          sub: 'Conditional probability, Bayes’ theorem with tree and two-way table, stochastic independence', when: 'May', ustd: 8 },
        { file: 'lb4-3.html', lb: 'Learning area 4', k: '4.3', title: 'The binomial distribution',
          sub: 'Bernoulli chains, deriving the formula, sigma notation, expected value, variance, modelling', when: 'May · June', ustd: 11 }
    ]
};
