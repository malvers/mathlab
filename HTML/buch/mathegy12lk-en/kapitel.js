/* kapitel.js — the chapters of the English edition of "Mathematik · Gymnasium 12 · Leistungskurs" (buch/mathegy12lk/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathegy12lk.html: LB 5 → Wahlbereich 5 → LB 6 → LB 7 → LB 8 → LB 9 → Abitur).
 * Doc, 11.10.2026: "ok, go on all agents" (book 7; Newton and Turing, book 8 mathegy11-en is Einstein's).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathematics · Grammar School 12 · Advanced Course',
    short: 'Mathematics GY 12 Advanced',
    lang: 'en',
    druck: false,
    description: 'Interactive mathematics textbook for the Gymnasium (grammar school), Year 12, advanced course (Saxony): integral calculus with the integral function, the fundamental theorem and solids of revolution in real 3D, numerical integration up to Simpson, normally distributed random variables and de Moivre-Laplace, estimating and significance tests, distances and angles in space with the Hesse normal form and skew lines, extreme values, reflections, unbounded areas, families and loci and training for the Abitur, with labs, simulations and self-checks with instant feedback.',
    chapters: [
        { file: 'lb5-1.html', lb: 'Learning area 5', k: '5.1', title: 'Antiderivatives and integration',
          sub: 'Reversing differentiation, basic integrals, linear substitution, composite functions with the CAS', when: 'August · September', ustd: 15 },
        { file: 'lb5-2.html', lb: 'Learning area 5', k: '5.2', title: 'The definite integral and the fundamental theorem',
          sub: 'Total from rates of change, physical quantities, Riemann sums, properties, integral function, fundamental theorem with proof', when: 'September', ustd: 10 },
        { file: 'lb5-3.html', lb: 'Learning area 5', k: '5.3', title: 'Areas and solids of revolution',
          sub: 'Area with the x-axis and between graphs, volume of rotation about the x-axis, cone and sphere derived', when: 'October', ustd: 10 },
        { file: 'wb5.html', lb: 'Elective area 5', k: 'E', title: 'Numerical integration',
          sub: 'History of integral calculus, rectangle and trapezium rules, Kepler\'s barrel rule, Simpson, comparing the rules', when: 'November', ustd: 10 },
        { file: 'lb6.html', lb: 'Learning area 6', k: '6', title: 'Normally distributed random variables',
          sub: 'Gaussian bell curve, density and distribution function, expected value and standard deviation, σ rules, de Moivre-Laplace', when: 'November', ustd: 10 },
        { file: 'lb7.html', lb: 'Learning area 7', k: '7', title: 'Inferential statistics',
          sub: 'Samples, estimating proportions, mean and variance, one- and two-tailed significance tests, statistical certainty', when: 'December', ustd: 15 },
        { file: 'lb8-1.html', lb: 'Learning area 8', k: '8.1', title: 'Scalar product, vector product and Hesse normal form',
          sub: 'Angle and projection, perpendicular vector and area, normal and coordinate form, Hesse normal form for line and plane', when: 'January', ustd: 10 },
        { file: 'lb8-2.html', lb: 'Learning area 8', k: '8.2', title: 'Angles of intersection',
          sub: 'Line and line, line and plane, plane and plane, inclinations on solids', when: 'January', ustd: 5 },
        { file: 'lb8-3.html', lb: 'Learning area 8', k: '8.3', title: 'Distances',
          sub: 'Point and point, point and plane, line and plane, plane and plane, point and line, skew lines', when: 'February', ustd: 10 },
        { file: 'lb9-1.html', lb: 'Learning area 9', k: '9.1', title: 'Extremal distances, angles and reflections',
          sub: 'Distance function, point and curve, largest angle of view, reflection in a point and a plane, shortest paths', when: 'February · March', ustd: 10 },
        { file: 'lb9-2.html', lb: 'Learning area 9', k: '9.2', title: 'Areas, density, families and loci',
          sub: 'Areas in three ways, unbounded areas, density and probability, families of functions, loci, families of lines and planes', when: 'March', ustd: 10 },
        { file: 'abi.html', lb: 'Examination', k: 'A', title: 'Ready for the Abitur',
          sub: 'Checklists, typical mistakes and exercises in the Abitur format of the advanced course from Years 11 and 12', when: 'April', ustd: 0 }
    ]
};
