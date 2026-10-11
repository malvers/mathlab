/* kapitel.js — the chapters of the English edition of "Mathematik · Fachoberschule 11" (buch/mathefos11/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathefos11.html: LB 1 → LB 2 → Wahlbereich 2, then the outlooks of Wahlbereich 1 and 3; 3 Ustd./week).
 * Doc, 11.10.2026: the next books in English, in parallel (book 4).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathematics · Technical College 11',
    short: 'Mathematics FOS 11',
    lang: 'en',
    druck: false,
    description: 'Interactive mathematics textbook for the Fachoberschule (technical college), Year 11, Saxony: terms and formulas, linear and quadratic functions, equations, inequalities and systems of equations, polynomial functions, probabilities, counting and Bernoulli chains, financial mathematics and outlooks on complex numbers and switching algebra, with labs, simulations and self-checks with instant feedback.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Learning area 1', k: '1.1', title: 'Numbers, terms and formulas',
          sub: 'Number sets, rearranging formulas, absolute value, binomial formulas, percentages, powers', when: 'August · September', ustd: 6 },
        { file: 'lb1-2.html', lb: 'Learning area 1', k: '1.2', title: 'Functions and linear functions',
          sub: 'The idea of a function, gradient and intercept, equations of lines, angle of inclination', when: 'September', ustd: 9 },
        { file: 'lb1-3.html', lb: 'Learning area 1', k: '1.3', title: 'Linear equations and inequalities',
          sub: 'Equivalence transformations, solution sets, equations with fractions', when: 'October', ustd: 6 },
        { file: 'lb1-4.html', lb: 'Learning area 1', k: '1.4', title: 'Lines and systems of linear equations',
          sub: 'Parameters, relative positions, three methods of solution, applications', when: 'November', ustd: 9 },
        { file: 'lb1-5.html', lb: 'Learning area 1', k: '1.5', title: 'Quadratic functions and equations',
          sub: 'Vertex form and standard form, the quadratic formula, Vieta’s theorem', when: 'December', ustd: 6 },
        { file: 'lb1-6.html', lb: 'Learning area 1', k: '1.6', title: 'Parabolas made to measure',
          sub: 'Linear factors, equations of functions from conditions, parameters with case analysis', when: 'January', ustd: 6 },
        { file: 'lb1-7.html', lb: 'Learning area 1', k: '1.7', title: 'Polynomial functions',
          sub: 'Factorising into linear factors, substitution, multiplicity, shape of the graph', when: 'January', ustd: 3 },
        { file: 'lb2-1.html', lb: 'Learning area 2', k: '2.1', title: 'Chance and probability',
          sub: 'Outcomes and events, law of large numbers, Laplace, combining events', when: 'February · March', ustd: 9 },
        { file: 'lb2-2.html', lb: 'Learning area 2', k: '2.2', title: 'Multi-stage random experiments',
          sub: 'Independence, tree diagrams and path rules, applications', when: 'March', ustd: 9 },
        { file: 'lb2-3.html', lb: 'Learning area 2', k: '2.3', title: 'Counting, the urn model and Bernoulli chains',
          sub: 'Counting principle, permutations, variations, combinations, Bernoulli’s formula', when: 'April', ustd: 12 },
        { file: 'wb2.html', lb: 'Elective 2', k: 'W', title: 'Financial mathematics',
          sub: 'Compound interest, savings plans, instalment and annuity repayment', when: 'May', ustd: 6 },
        { file: 'exkurse.html', lb: 'Outlooks', k: 'E', title: 'Complex numbers and switching algebra',
          sub: 'Electives 1 and 3 as excursions: the complex plane, truth tables, circuits', when: 'June', ustd: 0 }
    ]
};
