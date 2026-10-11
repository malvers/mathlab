/* kapitel.js — the chapters of the English edition of "Mathematik · Berufliches Gymnasium 12" (buch/mathe12/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe12.html: LB 1 → LB 2 → LB 5; Grundkurs, Kurshalbjahre 12/I and 12/II).
 * Doc, 11.10.2026: "mach das zweite Buch in EN".
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathematics · Vocational Grammar School 12',
    short: 'Mathematics 12',
    lang: 'en',
    druck: false,
    description: 'Interactive mathematics textbook for the Berufliches Gymnasium (vocational grammar school), Year 12, Saxony: discrete random variables and the binomial distribution, differential calculus from limits to optimisation problems, and vectors in space, with labs, simulations, 3D graphics and self-checks with instant feedback.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Learning area 1', k: '1.1', title: 'Conditional probability',
          sub: 'Tree diagrams, two-way tables, stochastic independence', when: 'August · September', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Learning area 1', k: '1.2', title: 'Random variables',
          sub: 'Probability distribution, expected value, variance, fair games', when: 'September', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Learning area 1', k: '1.3', title: 'The binomial distribution',
          sub: 'Bernoulli chains, binomial coefficient, cumulative probabilities', when: 'October · November', ustd: 20 },
        { file: 'lb2-1.html', lb: 'Learning area 2', k: '2.1', title: 'Limits',
          sub: 'Behaviour at infinity, asymptotes, continuity', when: 'November · December', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Learning area 2', k: '2.2', title: 'The derivative',
          sub: 'Rates of change, from the secant to the tangent, sketching the derivative', when: 'December', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Learning area 2', k: '2.3', title: 'Rules of differentiation',
          sub: 'Power, sum and constant multiple rules, eˣ and sin x, simple products', when: 'January', ustd: 12 },
        { file: 'lb2-4.html', lb: 'Learning area 2', k: '2.4', title: 'Monotonicity, extrema, points of inflection',
          sub: 'What f′ and f″ reveal about the graph', when: 'January · March', ustd: 12 },
        { file: 'lb2-5.html', lb: 'Learning area 2', k: '2.5', title: 'Investigating graphs',
          sub: 'Symmetry, asymptotes, tangents and normals, functions in context', when: 'March', ustd: 12 },
        { file: 'lb2-6.html', lb: 'Learning area 2', k: '2.6', title: 'Function profiles and optimisation problems',
          sub: 'Functions from conditions, finding the best', when: 'April · May', ustd: 20 },
        { file: 'lb5-1.html', lb: 'Learning area 5', k: '5.1', title: 'Vectors in space',
          sub: 'Points and vectors, calculating with vectors, length, midpoint', when: 'May · June', ustd: 12 },
        { file: 'lb5-2.html', lb: 'Learning area 5', k: '5.2', title: 'Scalar product and angles',
          sub: 'Orthogonality, the angle between vectors, proofs with quadrilaterals', when: 'June · July', ustd: 8 }
    ]
};
