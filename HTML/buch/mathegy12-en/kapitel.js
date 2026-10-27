/* kapitel.js — the chapters of the English edition of "Mathematik · Gymnasium 12" (buch/mathegy12/, Grundkurs), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathegy12.html: LB 5 → Wahlbereich 5 → LB 6 → LB 7 → LB 8 → Abitur).
 * Doc, 11.10.2026: "macht gemeinsam noch 2 Bücher" (book 6; Newton and Turing, book 5 mathefos12-en is Einstein's and Lovelace's).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Mathematics · Grammar School 12',
    short: 'Mathematics GY 12',
    lang: 'en',
    description: 'Interactive mathematics textbook for the Gymnasium (grammar school), Year 12, basic course (Saxony): integral calculus from finding antiderivatives to areas between graphs, numerical integration, estimating and significance tests, distances and angles in space in real 3D, extremal distances, reflections, families of functions and lines and training for the Abitur, with labs, simulations and self-checks with instant feedback.',
    chapters: [
        { file: 'lb5-1.html', lb: 'Learning area 5', k: '5.1', title: 'Antiderivatives and integration',
          sub: 'Reversing differentiation, basic integrals, rules of integration, linear substitution, CAS', when: 'August · September', ustd: 12 },
        { file: 'lb5-2.html', lb: 'Learning area 5', k: '5.2', title: 'The definite integral',
          sub: 'Total from rates of change, upper and lower sums, properties, fundamental theorem, integral function', when: 'September', ustd: 8 },
        { file: 'lb5-3.html', lb: 'Learning area 5', k: '5.3', title: 'Areas',
          sub: 'Area between a graph and the x-axis, between two graphs, unknown limits, applications', when: 'September · October', ustd: 8 },
        { file: 'wb5.html', lb: 'Elective area 5', k: 'E', title: 'Numerical integration',
          sub: 'History of integral calculus, rectangle and trapezium rules, accuracy', when: 'October · November', ustd: 8 },
        { file: 'lb6.html', lb: 'Learning area 6', k: '6', title: 'Inferential statistics',
          sub: 'Samples, estimating proportions, mean and variance, one- and two-tailed significance tests', when: 'November', ustd: 12 },
        { file: 'lb7-1.html', lb: 'Learning area 7', k: '7.1', title: 'Scalar product, vector product and normal form',
          sub: 'Angle and projection, perpendicular vector and area, normal and coordinate form', when: 'December', ustd: 8 },
        { file: 'lb7-2.html', lb: 'Learning area 7', k: '7.2', title: 'Angles of intersection',
          sub: 'Line and line, line and plane, plane and plane, inclinations on solids', when: 'January', ustd: 8 },
        { file: 'lb7-3.html', lb: 'Learning area 7', k: '7.3', title: 'Distances',
          sub: 'Point and point, foot of the perpendicular, distance from a point to a plane, Hesse normal form, applications', when: 'January', ustd: 8 },
        { file: 'lb8-1.html', lb: 'Learning area 8', k: '8.1', title: 'Extremal distances and reflections',
          sub: 'Distance function, point and line, point and curve, reflection in a point and a plane, shortest paths', when: 'February', ustd: 8 },
        { file: 'lb8-2.html', lb: 'Learning area 8', k: '8.2', title: 'Areas and families',
          sub: 'Areas in three ways, families of functions and loci, families of lines, connected exercises', when: 'March', ustd: 12 },
        { file: 'abi.html', lb: 'Examination', k: 'A', title: 'Ready for the Abitur',
          sub: 'Checklists, typical mistakes and exercises in Abitur format from Years 11 and 12', when: 'April', ustd: 0 }
    ]
};
