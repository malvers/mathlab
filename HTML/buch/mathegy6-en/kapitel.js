/* kapitel.js — the chapters of the English edition of "Mathematik · Gymnasium 6" (buch/mathegy6/), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathegy6.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 3; 4 Ustd./week, 104 + 8 Ustd.).
 * Book 14 of the English editions (Lovelace Orchestration coordinates, Einstein translates).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathematics · Grammar School 6',
    short: 'Mathematics GY 6',
    lang: 'en',
    druck: false,
    description: 'Interactive mathematics textbook for the Gymnasium (grammar school), Year 6 (Saxony): fractions, decimals and percentages, calculating with fractions and decimals, equations and word problems, assignments and the rule of three, triangles and quadrilaterals with angle sums, congruence and area, prisms, parts of a whole and prime numbers, with labs, simulations and self-checks with instant feedback.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Learning area 1', k: '1.1', title: 'Representing fractions',
          sub: 'Fractions, decimals and percentages, terminating or recurring, sets and number ranges', when: 'August · September', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Learning area 1', k: '1.2', title: 'Calculating with fractions and decimals',
          sub: 'Adding, subtracting, multiplying and dividing fractions and decimals', when: 'September', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Learning area 1', k: '1.3', title: 'Laws of arithmetic, equations and word problems',
          sub: 'Order of operations and shortcuts, solving equations and inequalities by reasoning, word problems with a plan', when: 'October · November', ustd: 10 },
        { file: 'lb2-1.html', lb: 'Learning area 2', k: '2.1', title: 'Assignments',
          sub: 'Many-valued, single-valued, one-to-one, table, chart and equation, absolute and relative frequencies', when: 'November · December', ustd: 12 },
        { file: 'lb2-2.html', lb: 'Learning area 2', k: '2.2', title: 'Proportional assignments',
          sub: 'Direct and inverse proportion, equal quotients and equal products, graphs, the rule of three', when: 'December · January', ustd: 12 },
        { file: 'lb3-1.html', lb: 'Learning area 3', k: '3.1', title: 'Angle sum and congruence',
          sub: 'Interior angle theorem with proof, definition and theorem, congruence theorems, constructing triangles', when: 'January · February', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Learning area 3', k: '3.2', title: 'Theorems and special lines in the triangle',
          sub: 'Base angle theorem, sides and angles, triangle inequality, perpendicular bisectors, angle bisectors, altitudes, medians', when: 'March', ustd: 8 },
        { file: 'lb3-3.html', lb: 'Learning area 3', k: '3.3', title: 'Area and the house of quadrilaterals',
          sub: 'Parallelogram, triangle, trapezium and kite, composite figures, ordering quadrilaterals', when: 'March · April', ustd: 10 },
        { file: 'lb4.html', lb: 'Learning area 4', k: '4', title: 'Prisms',
          sub: 'Properties, oblique drawing and net, surface area and volume, packaging waste project', when: 'April · May', ustd: 12 },
        { file: 'lb5.html', lb: 'Learning area 5', k: '5', title: 'Connections: parts of a whole',
          sub: 'Fraction and percentage, pie charts, parts of areas and volumes', when: 'May', ustd: 4 },
        { file: 'wb.html', lb: 'Elective area', k: 'W', title: 'Prime numbers',
          sub: 'Sieve of Eratosthenes, prime factorisation, infinitely many primes, cryptography', when: 'May · June', ustd: 8 }
    ]
};
