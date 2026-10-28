/* kapitel.js — the chapters of the English edition of "Mathematik · Berufliches Gymnasium 12 · Leistungskurs" (buch/mathe12lk/), in the
 * order of the school year (Lehrplan Berufliches Gymnasium Mathematik, Sachsen, 2026, Leistungskurs: LB 1 → LB 2 → LB 6 in Jahrgangsstufe 12).
 * Doc, 28.10.2026: "Die Übersetzung, die fangen wir heute an. Und ziehen es durch." (Curie orchestrates, Cartwright translates).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Mathematics · Vocational Grammar School 12 · Advanced Course',
    short: 'Mathematics 12 Advanced',
    lang: 'en',
    description: 'Interactive mathematics textbook for the Berufliches Gymnasium (vocational grammar school), Year 12, advanced course (Saxony): discrete random variables with the distribution function and the binomial distribution, differential calculus from limits and continuity via the product and chain rules to regression and optimisation problems, vector geometry in space, with proofs, labs, 3D graphics and self-checks with instant feedback.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Learning area 1', k: '1.1', title: 'Conditional probability',
          sub: 'Tree diagrams, two-way tables, Bayes’ theorem, independence', when: 'August · September', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Learning area 1', k: '1.2', title: 'Random variables',
          sub: 'Probability distribution and distribution function, expected value, variance', when: 'September · October', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Learning area 1', k: '1.3', title: 'The binomial distribution',
          sub: 'Bernoulli chains, sigma notation, finding n and p, parameters', when: 'October · November', ustd: 20 },
        { file: 'lb2-1.html', lb: 'Learning area 2', k: '2.1', title: 'Limits and continuity',
          sub: 'Behaviour at infinity, limit at a point, points of discontinuity', when: 'November · December', ustd: 10 },
        { file: 'lb2-2.html', lb: 'Learning area 2', k: '2.2', title: 'The derivative',
          sub: 'Rates of change, differential quotient, linear approximation', when: 'December · January', ustd: 12 },
        { file: 'lb2-3.html', lb: 'Learning area 2', k: '2.3', title: 'Rules of differentiation',
          sub: 'Power, constant multiple and sum rules, eˣ, ln x, sin x, cos x', when: 'January', ustd: 12 },
        { file: 'lb2-4.html', lb: 'Learning area 2', k: '2.4', title: 'Product and chain rules',
          sub: 'Differentiating products and compositions, roots and exponential functions', when: 'February', ustd: 12 },
        { file: 'lb2-5.html', lb: 'Learning area 2', k: '2.5', title: 'Monotonicity, extrema, points of inflection',
          sub: 'Necessary and sufficient conditions, global extrema', when: 'February · March', ustd: 14 },
        { file: 'lb2-6.html', lb: 'Learning area 2', k: '2.6', title: 'Investigating graphs',
          sub: 'Symmetry, asymptotes, tangents and normals, problems in context', when: 'March · April', ustd: 14 },
        { file: 'lb2-7.html', lb: 'Learning area 2', k: '2.7', title: 'Function profiles and regression',
          sub: 'Functions from conditions, regression models with technology', when: 'April', ustd: 9 },
        { file: 'lb2-8.html', lb: 'Learning area 2', k: '2.8', title: 'Optimisation problems',
          sub: 'Modelling, extrema at the boundary, case distinctions', when: 'May', ustd: 12 },
        { file: 'lb6-1.html', lb: 'Learning area 6', k: '6.1', title: 'Vectors in space',
          sub: 'Position and connecting vectors, linear combinations, centroids', when: 'May · June', ustd: 12 },
        { file: 'lb6-2.html', lb: 'Learning area 6', k: '6.2', title: 'Scalar product and angles',
          sub: 'Orthogonality, angles, verifications and proofs with vectors', when: 'June · July', ustd: 8 }
    ]
};
