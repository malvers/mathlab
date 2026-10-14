/* kapitel.js — the chapters of the English edition of "Mathematik · Oberschule 7" (Realschulbildungsgang, buch/mathe7/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe7.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlbereich 3; 4 Ustd./week, 100 + 8 Ustd.).
 * Round 3 of the English editions (Lovelace Orchestration coordinates, Turing translates).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathematics · Secondary School 7',
    short: 'Mathematics OS 7',
    lang: 'en',
    druck: false,
    description: 'Interactive mathematics textbook for the Oberschule (secondary school), Year 7, intermediate track (Saxony): percentages and interest, chance and frequencies, rational numbers, terms and equations, quadrilaterals, polygons and prisms with mass and density, tilings after Escher, with labs, simulations and self-checks with instant feedback.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Learning area 1', k: '1.1', title: 'Percentages',
          sub: 'Per cent as hundredths, base value, percentage value and percentage rate, the three basic problems, pie charts', when: 'August · September', ustd: 16 },
        { file: 'lb1-2.html', lb: 'Learning area 1', k: '1.2', title: 'Percentages in everyday life and interest',
          sub: 'Price increases and reductions, discount and VAT, interest for a year and for days, compound interest with a spreadsheet', when: 'September · October', ustd: 12 },
        { file: 'lb2.html', lb: 'Learning area 2', k: '2', title: 'Elements of probability and statistics',
          sub: 'Random experiments, outcomes and events, frequencies and simulation, probability, reading statistics critically', when: 'November', ustd: 12 },
        { file: 'lb3-1.html', lb: 'Learning area 3', k: '3.1', title: 'Rational numbers',
          sub: 'Negative numbers, number line, opposite number and absolute value, number ranges, coordinates in four quadrants', when: 'November · December', ustd: 8 },
        { file: 'lb3-2.html', lb: 'Learning area 3', k: '3.2', title: 'Calculating with rational numbers',
          sub: 'Adding and subtracting, multiplying, dividing and powers, laws of arithmetic and order of operations', when: 'December · January', ustd: 12 },
        { file: 'lb3-3.html', lb: 'Learning area 3', k: '3.3', title: 'Terms and equations',
          sub: 'Values of terms, setting up and solving equations, rearranging formulas, proportions', when: 'January', ustd: 8 },
        { file: 'lb4-1.html', lb: 'Learning area 4', k: '4.1', title: 'Quadrilaterals and polygons',
          sub: 'Quadrilaterals around us, constructing quadrilaterals, area and perimeter, splitting and comparing polygons', when: 'February · March', ustd: 16 },
        { file: 'lb4-2.html', lb: 'Learning area 4', k: '4.2', title: 'Prisms',
          sub: 'Oblique drawing and net, surface area and volume, mass and density, composite solids and packaging', when: 'April · May', ustd: 16 },
        { file: 'wb.html', lb: 'Elective area', k: 'W', title: 'Tilings',
          sub: 'Tilings with regular polygons, the angles at a vertex, tilings after M. C. Escher', when: 'June', ustd: 8 }
    ]
};
