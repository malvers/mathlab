/* kapitel.js — the chapters of the English edition of "Mathematik · Gymnasium 8" (buch/mathegy8/), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathegy8.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 3; 4 Ustd./week, 104 + 8 Ustd.).
 * Doc, 11.10.2026: book 12 of the English editions (forloop-71 orchestrates, Newton translates).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathematics · Grammar School 8',
    short: 'Mathematics GY 8',
    lang: 'en',
    druck: false,
    description: 'Interactive mathematics textbook for the Gymnasium (grammar school), Year 8 (Saxony): terms and calculation trees, binomial formulae, equations and inequalities, random experiments, probability and tree diagrams, functions and linear functions, systems of linear equations, central dilation and similarity, heuristic strategies and simulation with random numbers, with labs, simulations and self-checks with instant feedback.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Learning area 1', k: '1.1', title: 'Variables and terms',
          sub: 'Name, value and meaning, calculation trees, collecting like terms, multiplying out, factorising', when: 'August · September', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Learning area 1', k: '1.2', title: 'Binomial formulae and equations',
          sub: 'The three binomial formulae, linear equations, CAS, inequalities', when: 'September', ustd: 12 },
        { file: 'lb2-1.html', lb: 'Learning area 2', k: '2.1', title: 'Random experiments and probability',
          sub: 'Outcomes and events, Venn diagrams, relative frequency, Laplace experiments', when: 'November', ustd: 16 },
        { file: 'lb2-2.html', lb: 'Learning area 2', k: '2.2', title: 'Multi-stage random experiments and counting',
          sub: 'Urn model, tree diagram, path rules, product rule, simulation', when: 'December', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Learning area 3', k: '3.1', title: 'Functions and their properties',
          sub: 'Unique assignments, forms of representation, domain and range, monotonicity, extrema, symmetry', when: 'January', ustd: 8 },
        { file: 'lb3-2.html', lb: 'Learning area 3', k: '3.2', title: 'Linear functions',
          sub: 'Gradient and difference quotient, zeros, equations of lines, linear regression', when: 'January · February', ustd: 12 },
        { file: 'lb3-3.html', lb: 'Learning area 3', k: '3.3', title: 'Systems of linear equations',
          sub: 'Solving graphically and by calculation, solvability, modelling', when: 'March', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Learning area 4', k: '4.1', title: 'Central dilation',
          sub: 'Centre and scale factor, construction, preservation of angles, ratios of lengths', when: 'April', ustd: 8 },
        { file: 'lb4-2.html', lb: 'Learning area 4', k: '4.2', title: 'Similarity',
          sub: 'Main similarity theorem, auxiliary figures, measuring heights, lengths, areas and volumes', when: 'April · May', ustd: 12 },
        { file: 'lb5.html', lb: 'Learning area 5', k: '5', title: 'Heuristic strategies',
          sub: 'Working forwards and backwards, solution plans, presenting solutions', when: 'May', ustd: 4 },
        { file: 'wb.html', lb: 'Elective 3', k: 'E', title: 'Simulation with random numbers',
          sub: 'Random numbers, the Monte Carlo method, the Monty Hall problem, collecting stickers', when: 'May · June', ustd: 8 }
    ]
};
