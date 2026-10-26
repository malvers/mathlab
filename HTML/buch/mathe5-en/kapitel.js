/* kapitel.js — the chapters of the English edition of "Mathematik · Oberschule 5" (buch/mathe5/), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathe5.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlbereich 1; Lehrplan Oberschule 2019:
 * 100 Ustd. + 8 Ustd. Wahlbereich). Doc, 26.10.2026: the four translations of OS 5 (Somerville translates the English one).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathematics · Secondary School 5',
    short: 'Mathematics OS 5',
    lang: 'en',
    druck: false,
    description: 'Interactive mathematics textbook for the Oberschule (secondary school), Year 5 (Saxony): large numbers, written calculation, laws of arithmetic and the order of operations, square numbers, equations and divisibility, fractions, decimals, percentages and quantities, coordinates and angles, rectangles and cubes, symmetry and translation, and the numerals of the Babylonians, Egyptians and Romans, with labs, simulations and self-checks with instant feedback.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Learning area 1', k: '1.1', title: 'Large numbers',
          sub: 'Number line, place value table, millions and billions, rounding, estimating, comparing', when: 'August · September', ustd: 7 },
        { file: 'lb1-2.html', lb: 'Learning area 1', k: '1.2', title: 'Calculating with natural numbers',
          sub: 'Written addition, subtraction, multiplication and division, estimating, laws of arithmetic, order of operations', when: 'September · October', ustd: 15 },
        { file: 'lb1-3.html', lb: 'Learning area 1', k: '1.3', title: 'Powers, equations and factors',
          sub: 'Powers of ten, square numbers, solving equations by trying, divisibility rules, prime numbers', when: 'October · November', ustd: 12 },
        { file: 'lb2-1.html', lb: 'Learning area 2', k: '2.1', title: 'Fractions',
          sub: 'Showing parts, fractions on the number line, fractions of quantities, comparing and estimating', when: 'December · January', ustd: 11 },
        { file: 'lb2-2.html', lb: 'Learning area 2', k: '2.2', title: 'Decimals and percentages',
          sub: 'Tenths, hundredths, thousandths, converting, comparing, rounding, writing percentages', when: 'January', ustd: 9 },
        { file: 'lb2-3.html', lb: 'Learning area 2', k: '2.3', title: 'Calculating with decimals and quantities',
          sub: 'Adding and subtracting, multiplying and dividing, the mean, money, length, mass and time', when: 'January · March', ustd: 14 },
        { file: 'lb3-1.html', lb: 'Learning area 3', k: '3.1', title: 'Coordinates, lines and angles',
          sub: 'Coordinate system, parallel and perpendicular, measuring, drawing and estimating angles, types of angle', when: 'March · April', ustd: 9 },
        { file: 'lb3-2.html', lb: 'Learning area 3', k: '3.2', title: 'Rectangles and cubes',
          sub: 'Oblique drawing and net of a cube, perimeter and area, surface area and volume', when: 'April · May', ustd: 11 },
        { file: 'lb4.html', lb: 'Learning area 4', k: '4', title: 'Symmetry and congruent figures',
          sub: 'Lines of symmetry, reflection in a line, translation, original and image, frieze patterns', when: 'May · June', ustd: 12 },
        { file: 'wb.html', lb: 'Elective area', k: 'W', title: 'How people learned to count and calculate',
          sub: 'Tally sticks, Babylonians, Egyptians and Romans, calculating on the lines, a presentation', when: 'June · July', ustd: 8 }
    ]
};
