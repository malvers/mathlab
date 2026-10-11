/* kapitel.js — the chapters of the English edition of "Mathematik · Gymnasium 7" (buch/mathegy7/), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathegy7.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlbereich 3; 4 Ustd./week, 104 + 8 Ustd.).
 * Doc, 11.10.2026: book 13 of the English editions (forloop-71 orchestrates, Turing translates).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathematics · Grammar School 7',
    short: 'Mathematics GY 7',
    lang: 'en',
    druck: false,
    description: 'Interactive mathematics textbook for the Gymnasium (grammar school), Year 7 (Saxony): circle and line, circumcircle and incircle, Thales’ theorem and the angles in a circle, constructions and problem solving, rational numbers and calculating with them, equations and formulas, percentages, prisms and pyramids in oblique drawing, net and two-view drawing, surface area and volume, charts and the Platonic solids, with nets that fold in 3D, constructions to click through and self-checks with instant feedback.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Learning area 1', k: '1.1', title: 'Circle and line, circumcircle and incircle',
          sub: 'External line, tangent and secant, perpendicular bisectors and angle bisectors in the triangle', when: 'August · September', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Learning area 1', k: '1.2', title: 'Circle theorems',
          sub: 'Thales’ theorem, inscribed angle and central angle, cyclic quadrilateral, theorem and proof', when: 'September', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Learning area 1', k: '1.3', title: 'Constructions and problem solving',
          sub: 'Sketch and construction plan, tangents from a point, working forwards and backwards', when: 'September · October', ustd: 8 },
        { file: 'lb2-1.html', lb: 'Learning area 2', k: '2.1', title: 'Rational numbers',
          sub: 'Negative numbers, number line, absolute value and opposite number, number sets', when: 'October · November', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Learning area 2', k: '2.2', title: 'Calculating with rational numbers',
          sub: 'The four operations, sign rules, laws of arithmetic, powers and square roots', when: 'November · December', ustd: 16 },
        { file: 'lb2-3.html', lb: 'Learning area 2', k: '2.3', title: 'Equations and formulas',
          sub: 'Solving equations mentally and with equivalence transformations, word problems, rearranging formulas', when: 'December · January', ustd: 16 },
        { file: 'lb2-4.html', lb: 'Learning area 2', k: '2.4', title: 'Percentages',
          sub: 'Base value, percentage amount and percentage rate, discount and VAT, increase by and to, charts', when: 'February · March', ustd: 16 },
        { file: 'lb3-1.html', lb: 'Learning area 3', k: '3.1', title: 'Drawing prisms and pyramids',
          sub: 'Net, oblique drawing and two-view drawing, true length and true shape', when: 'April', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Learning area 3', k: '3.2', title: 'Surface area, volume and mass',
          sub: 'Calculating prisms and pyramids, composite solids, the frustum of a pyramid', when: 'April · May', ustd: 8 },
        { file: 'lb4.html', lb: 'Learning area 4', k: '4', title: 'Presenting data',
          sub: 'Bar chart, line graph and pie chart, reading charts in the media critically', when: 'May', ustd: 4 },
        { file: 'wb.html', lb: 'Elective area', k: 'W', title: 'Platonic solids',
          sub: 'Polyhedra, why there are exactly five regular ones, Euler’s polyhedron formula, Plato and Kepler', when: 'May · June', ustd: 8 }
    ]
};
