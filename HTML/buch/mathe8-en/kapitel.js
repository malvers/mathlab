/* kapitel.js — the chapters of the English edition of "Mathematik · Oberschule 8" (Realschulbildungsgang, buch/mathe8/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe8.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → LB 6 → Wahlpflichtbereich 1; 4 Ustd./week, 100 + 8 Ustd.).
 * Doc, 13.10.2026: round 3, the Oberschule books 6–9 in English and Spanish (Lovelace orchestrates, Curie translates).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathematics · Secondary School 8',
    short: 'Mathematics OS 8',
    lang: 'en',
    druck: false,
    description: 'Interactive mathematics textbook for the Oberschule (secondary school), Year 8, intermediate track (Saxony): terms and transforming terms, linear equations and formulas, functions, linear functions and systems of equations with tariff comparisons, the circle and Thales’ theorem, the cylinder, similarity and central dilation, random experiments with tree diagrams, mathematics in everyday life with rent, electricity and building costs, and the bicycle, with widgets to try out and self-checks with instant feedback.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Learning area 1', k: '1.1', title: 'Terms and transforming terms',
          sub: 'Values of terms and formulas, collecting like terms, removing brackets, multiplying out and factorising', when: 'August · September', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Learning area 1', k: '1.2', title: 'Linear equations and formulas',
          sub: 'Equivalence transformations, no or infinitely many solutions, rearranging formulas, word problems', when: 'September', ustd: 8 },
        { file: 'lb2-1.html', lb: 'Learning area 2', k: '2.1', title: 'Functions',
          sub: 'Unique assignment, argument and function value, domain and range, proportional functions', when: 'October', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Learning area 2', k: '2.2', title: 'Linear functions',
          sub: 'y = m · x + n, gradient and y-intercept, zeros, equation from points', when: 'November', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Learning area 2', k: '2.3', title: 'Systems of linear equations',
          sub: 'Solving graphically and by calculation, solvability, comparing tariffs and prices', when: 'November · December', ustd: 10 },
        { file: 'lb3-1.html', lb: 'Learning area 3', k: '3.1', title: 'The circle',
          sub: 'Circle and line, Thales’ theorem, circumference and area, the number π, the annulus', when: 'December · January', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Learning area 3', k: '3.2', title: 'The cylinder',
          sub: 'Net, views and oblique drawing, surface area, volume and mass of cylinders and hollow cylinders', when: 'January', ustd: 6 },
        { file: 'lb4.html', lb: 'Learning area 4', k: '4', title: 'Similarity',
          sub: 'Central dilation and scale, main similarity theorem, lengths, areas and volumes, congruence', when: 'March', ustd: 14 },
        { file: 'lb5.html', lb: 'Learning area 5', k: '5', title: 'Random events',
          sub: 'Simulating, tree diagram and path rules, with and without replacement, counting', when: 'April', ustd: 14 },
        { file: 'lb6.html', lb: 'Learning area 6', k: '6', title: 'Mathematics in everyday life',
          sub: 'Rent and service charges, electricity and water bills, building costs, comparing offers and interest', when: 'May · June', ustd: 12 },
        { file: 'wb.html', lb: 'Compulsory elective area', k: 'E', title: 'The bicycle',
          sub: 'Inches and tyre size, wheel circumference, gear ratio, cadence and speed', when: 'June', ustd: 8 }
    ]
};
