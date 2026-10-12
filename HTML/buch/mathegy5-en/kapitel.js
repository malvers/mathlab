/* kapitel.js — the chapters of the English edition of "Mathematik · Gymnasium 5" (buch/mathegy5/), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathegy5.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 3; 4 Ustd./week, 104 + 8 Ustd.).
 * Doc, 11.10.2026: book 15 of the English editions (forloop-71 orchestrates, Turing translates).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathematics · Grammar School 5',
    short: 'Mathematics GY 5',
    lang: 'en',
    druck: false,
    description: 'Interactive mathematics textbook for the Gymnasium (grammar school), Year 5 (Saxony): large numbers, rounding, laws of arithmetic, powers, factors and prime numbers, fractions, decimals and percentages, coordinates, angles, symmetry and reflection, rectangles and cuboids, quantities in everyday life and the numbers of the Egyptians, Romans and Maya, with labs, simulations and self-checks with instant feedback.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Learning area 1', k: '1.1', title: 'Large numbers',
          sub: 'Place value table, number ray, estimating, rounding, comparing and ordering', when: 'August · September', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Learning area 1', k: '1.2', title: 'Calculating with natural numbers',
          sub: 'Laws of arithmetic and shortcuts, estimating, powers, dividing', when: 'September', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Learning area 1', k: '1.3', title: 'Factors and prime numbers',
          sub: 'Factors and multiples, divisibility rules, the sieve of Eratosthenes, prime factors', when: 'September · October', ustd: 3 },
        { file: 'lb2-1.html', lb: 'Learning area 2', k: '2.1', title: 'Fractions',
          sub: 'Showing parts, simplifying and expanding, proper and improper fractions, comparing', when: 'November', ustd: 12 },
        { file: 'lb2-2.html', lb: 'Learning area 2', k: '2.2', title: 'Decimals and percentages',
          sub: 'Tenths, hundredths, thousandths, converting, per cent, ordering and rounding', when: 'November · December', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Learning area 2', k: '2.3', title: 'Calculating with decimals',
          sub: 'Adding and subtracting, moving the decimal point, multiplying and dividing, the mean', when: 'December', ustd: 7 },
        { file: 'lb3-1.html', lb: 'Learning area 3', k: '3.1', title: 'Coordinates and angles',
          sub: 'Coordinate system, parallel and perpendicular, measuring angles, types of angle, pairs of angles', when: 'January · February', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Learning area 3', k: '3.2', title: 'Symmetry and reflection',
          sub: 'Patterns, line and point symmetry, translation, rotation, reflection in a line', when: 'February · March', ustd: 10 },
        { file: 'lb4-1.html', lb: 'Learning area 4', k: '4.1', title: 'Rectangles',
          sub: 'Perimeter and area, units of area, composite shapes', when: 'March · April', ustd: 8 },
        { file: 'lb4-2.html', lb: 'Learning area 4', k: '4.2', title: 'Cuboids',
          sub: 'Views, oblique drawing, net, volume, units of capacity, surface area, packaging project', when: 'April · May', ustd: 14 },
        { file: 'lb5.html', lb: 'Learning area 5', k: '5', title: 'Mathematics in everyday life',
          sub: 'Converting quantities, approximate values, timetables, Fermi problems, a project', when: 'May · June', ustd: 10 },
        { file: 'wb.html', lb: 'Elective area', k: 'W', title: 'Counting and calculating – then and now',
          sub: 'Egyptians, Romans and Maya, Adam Ries, the binary system', when: 'June', ustd: 8 }
    ]
};
