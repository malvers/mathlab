/* kapitel.js — the chapters of the English edition of "Mathematik · Berufliches Gymnasium 13" (buch/mathe13/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe13.html: LB 3 → LB 4 → Wahlpflicht 1 → LB 6 → Abiturvorbereitung).
 * Doc, 11.10.2026: "das nächste parallel mit Einstein" (book 3; Einstein does book 4, mathefos11-en).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathematics · Vocational Grammar School 13',
    short: 'Mathematics 13',
    lang: 'en',
    druck: false,
    description: 'Interactive mathematics textbook for the Berufliches Gymnasium (vocational grammar school), Year 13, Saxony: integral calculus, inferential statistics with significance tests, analytic geometry of lines and planes in 3D, further applications and a chapter to prepare for the Abitur, with labs, simulations and self-checks with instant feedback.',
    chapters: [
        { file: 'lb3-1.html', lb: 'Learning area 3', k: '3.1', title: 'Antiderivatives',
          sub: 'Differentiating backwards, the indefinite integral, rules of integration', when: 'August · September', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Learning area 3', k: '3.2', title: 'The definite integral',
          sub: 'Reconstructed total, properties, fundamental theorem', when: 'September', ustd: 8 },
        { file: 'lb3-3.html', lb: 'Learning area 3', k: '3.3', title: 'Areas',
          sub: 'Between a graph and the x-axis, between two graphs', when: 'End of September · October', ustd: 8 },
        { file: 'lb3-4.html', lb: 'Learning area 3', k: '3.4', title: 'Numerical integration and applications',
          sub: 'Rectangle and trapezium methods, mixed problems', when: 'October · November', ustd: 8 },
        { file: 'lb4-1.html', lb: 'Learning area 4', k: '4.1', title: 'Population and sample',
          sub: 'Estimating and testing, sample mean and sample variance', when: 'November', ustd: 4 },
        { file: 'lb4-2.html', lb: 'Learning area 4', k: '4.2', title: 'Significance tests',
          sub: 'Hypotheses, rejection region, type I and type II errors', when: 'November · December', ustd: 8 },
        { file: 'wp1-1.html', lb: 'Elective 1', k: 'E.1', title: 'Lines and planes',
          sub: 'Parametric equations, normal vector with the cross product', when: 'December', ustd: 8 },
        { file: 'wp1-2.html', lb: 'Elective 1', k: 'E.2', title: 'Coordinate equation and relative positions',
          sub: 'Point, line, plane: position, intersection points, trace points', when: 'January', ustd: 8 },
        { file: 'wp1-3.html', lb: 'Elective 1', k: 'E.3', title: 'Angles of intersection, prisms and pyramids',
          sub: 'Angles between lines and planes, surface areas and volumes', when: 'January', ustd: 4 },
        { file: 'lb6.html', lb: 'Learning area 6', k: '6', title: 'Further applications',
          sub: 'Families of functions, parameters in systems of equations, costs and profit, distances', when: 'End of January · February', ustd: 8 },
        { file: 'abi.html', lb: 'Abitur', k: 'A', title: 'Ready for the Abitur',
          sub: 'Checklists and exercises in the Abitur format from all three years', when: 'February · April', ustd: 0 }
    ]
};
