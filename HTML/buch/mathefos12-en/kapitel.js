/* kapitel.js — the chapters of the English edition of "Mathematik · Fachoberschule 12" (buch/mathefos12/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathefos12.html: LB 1 → LB 2 → LB 3 → LB 4 → FHR-Prüfung → Wahlbereich 3; 4 Ustd./week).
 * Doc, 11.10.2026: two more books in English, four agents (book 5).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Mathematics · Technical College 12',
    short: 'Mathematics FOS 12',
    lang: 'en',
    description: 'Interactive mathematics textbook for the Fachoberschule (technical college), Year 12, Saxony: vectors, lines and planes in space in real 3D, differential calculus from limits to optimisation problems, integral calculus, rational and exponential functions, training for the FHR exam and an elective with CAS, with labs, simulations and self-checks with instant feedback.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Learning area 1', k: '1.1', title: 'Vectors and the scalar product',
          sub: 'Arrows in space, magnitude, calculating with vectors, angles and orthogonality', when: 'August · September', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Learning area 1', k: '1.2', title: 'Lines in space',
          sub: 'Parametric equation, point test, trace points, relative positions, angle of intersection', when: 'September', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Learning area 1', k: '1.3', title: 'Planes in space',
          sub: 'Parametric and coordinate equation, cross product, line and plane', when: 'September · October', ustd: 8 },
        { file: 'lb1-4.html', lb: 'Learning area 1', k: '1.4', title: 'Perpendiculars, distances and areas',
          sub: 'Foot of the perpendicular, distance from a point to a plane, areas, mixed applications', when: 'October · November', ustd: 6 },
        { file: 'lb2-1.html', lb: 'Learning area 2', k: '2.1', title: 'Limits and rates of change',
          sub: 'Sequences, behaviour at infinity, continuity, average and instantaneous velocity', when: 'November', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Learning area 2', k: '2.2', title: 'The derivative',
          sub: 'Difference quotient and derivative, rules of differentiation, chain rule, tangent and normal', when: 'November · December', ustd: 12 },
        { file: 'lb2-3.html', lb: 'Learning area 2', k: '2.3', title: 'Curve sketching',
          sub: 'Zeros, symmetry, monotonicity, turning points and points of inflection, the complete scheme', when: 'December · January', ustd: 8 },
        { file: 'lb2-4.html', lb: 'Learning area 2', k: '2.4', title: 'Families, functions from conditions and optimisation',
          sub: 'Points of intersection and contact, families of functions, functions from conditions, optimising', when: 'January', ustd: 7 },
        { file: 'lb3.html', lb: 'Learning area 3', k: '3', title: 'Integral calculus',
          sub: 'Antiderivatives, the definite integral, the fundamental theorem, areas between graphs', when: 'February · March', ustd: 10 },
        { file: 'lb4-1.html', lb: 'Learning area 4', k: '4.1', title: 'Rational functions',
          sub: 'Poles and holes, asymptotes, quotient rule, complete investigation', when: 'March', ustd: 12 },
        { file: 'lb4-2.html', lb: 'Learning area 4', k: '4.2', title: 'Exponential functions to base e',
          sub: 'The number e, exponential equations, differentiating with the chain and product rule, growth', when: 'April', ustd: 13 },
        { file: 'fhr.html', lb: 'Exam', k: 'P', title: 'Ready for the FHR exam',
          sub: 'Checklists and exercises in exam format from all learning areas', when: 'May', ustd: 0 },
        { file: 'wb3.html', lb: 'Elective 3', k: 'W', title: 'Differential and integral calculus with CAS',
          sub: 'Families with two parameters, piecewise functions, regression, an outlook on central projection', when: 'June', ustd: 8 }
    ]
};
