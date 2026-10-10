/* kapitel.js — the chapters of the English edition of "Mathematik · Berufliches Gymnasium 11" (buch/mathe11/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe11.html: LB 2 → LB 3 → LB 4 → LB 1 → Wahlbereich 3).
 * Doc, 10.10.2026: "übersetz unser 1. Buch ins EN ... mach auf das cover oben rechts die british flag".
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet (Doc: "Druck lassen wir erstmal"): druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathematics · Vocational Grammar School 11',
    short: 'Mathematics 11',
    lang: 'en',
    druck: false,
    description: 'Interactive mathematics textbook for the Berufliches Gymnasium (vocational grammar school), Year 11, Saxony: equations, functions, linear systems, probability and numerical methods, with labs, simulations and self-checks with instant feedback.',
    chapters: [
        { file: 'lb2.html', lb: 'Learning area 2', k: '2', title: 'Equations, formulas, figures',
          sub: 'Solving problems with and without a calculator', when: 'September', ustd: 20 },
        { file: 'lb3-1.html', lb: 'Learning area 3', k: '3.1', title: 'Functions and their properties',
          sub: 'Domain, zeros, monotonicity, symmetry', when: 'End of September', ustd: 5 },
        { file: 'lb3-2.html', lb: 'Learning area 3', k: '3.2', title: 'Growth and decay',
          sub: 'Linear functions and exponential functions', when: 'October · November', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Learning area 3', k: '3.3', title: 'Quadratic functions and equations',
          sub: 'Uniformly accelerated motion', when: 'November', ustd: 15 },
        { file: 'lb3-4.html', lb: 'Learning area 3', k: '3.4', title: 'Periodic processes',
          sub: 'Sine functions', when: 'December', ustd: 10 },
        { file: 'lb3-5.html', lb: 'Learning area 3', k: '3.5', title: 'Regression',
          sub: 'Analysing measurements with digital tools', when: 'December', ustd: 5 },
        { file: 'lb3-6.html', lb: 'Learning area 3', k: '3.6', title: 'Inverse functions and logarithms',
          sub: 'Square root function, logarithm, exponential equations', when: 'January', ustd: 15 },
        { file: 'lb3-7.html', lb: 'Learning area 3', k: '3.7', title: 'Graphs and parameters',
          sub: 'The basic functions without a calculator, stretching and shifting', when: 'February · March', ustd: 15 },
        { file: 'lb4.html', lb: 'Learning area 4', k: '4', title: 'Systems of linear equations and matrices',
          sub: 'Gaussian elimination, solution sets, matrix operations', when: 'March · April', ustd: 20 },
        { file: 'lb1.html', lb: 'Learning area 1', k: '1', title: 'Probabilities of multi-stage random experiments',
          sub: 'Tree diagrams, two-way tables, simulation', when: 'April', ustd: 15 },
        { file: 'wb3.html', lb: 'Elective 3', k: 'E', title: 'Numerical methods and simulations',
          sub: 'Bisection, approximating areas, the Monte Carlo method', when: 'May · June', ustd: 10 }
    ]
};
