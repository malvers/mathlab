/* kapitel.js — the chapters of the English edition of "Mathematik · Oberschule 6" (buch/mathe6/), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathe6.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 2; 5 Ustd./week, 125 + 10 Ustd.).
 * Round 3 of the English editions (Lovelace Orchestration coordinates, Turing translates).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathematics · Secondary School 6',
    short: 'Mathematics OS 6',
    lang: 'en',
    druck: false,
    description: 'Interactive mathematics textbook for the Oberschule (secondary school), Year 6 (Saxony): representing, converting and comparing fractions, calculating with fractions and decimals, assignments and the rule of three, angles and triangles, area and perimeter, solids and their nets, maths in everyday life and mathematical games, with labs, simulations and self-checks with instant feedback.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Learning area 1', k: '1.1', title: 'Representing fractions',
          sub: 'Sets, number line, expanding and simplifying, fraction and decimal, comparing', when: 'August · September', ustd: 20 },
        { file: 'lb1-2.html', lb: 'Learning area 1', k: '1.2', title: 'Calculating with fractions',
          sub: 'Adding and subtracting, multiplying and dividing, mental arithmetic and estimating', when: 'September · October', ustd: 10 },
        { file: 'lb1-3.html', lb: 'Learning area 1', k: '1.3', title: 'Laws of arithmetic, mean and word problems',
          sub: 'Order of operations and shortcuts, arithmetic mean, solving equations by thinking', when: 'October', ustd: 5 },
        { file: 'lb2-1.html', lb: 'Learning area 2', k: '2.1', title: 'Representing assignments',
          sub: 'Single-valued, one-to-one, many-valued, in words, table, arrows, graph and equation', when: 'November', ustd: 10 },
        { file: 'lb2-2.html', lb: 'Learning area 2', k: '2.2', title: 'Proportionality and the rule of three',
          sub: 'Directly and inversely proportional, quotient and product, rule of three, word problems', when: 'November · December', ustd: 15 },
        { file: 'lb3-1.html', lb: 'Learning area 3', k: '3.1', title: 'Angles and triangles',
          sub: 'Angles at lines, angle sum theorem, types of triangle, congruence theorems and triangle inequality', when: 'January', ustd: 15 },
        { file: 'lb3-2.html', lb: 'Learning area 3', k: '3.2', title: 'Area and perimeter',
          sub: 'Triangle, parallelogram, kite and trapezium, composite shapes, problem solving', when: 'January · February', ustd: 15 },
        { file: 'lb4.html', lb: 'Learning area 4', k: '4', title: 'Geometric solids',
          sub: 'Describing solids, views, oblique drawing and net, composite solids, right prisms', when: 'March · April', ustd: 20 },
        { file: 'lb5.html', lb: 'Learning area 5', k: '5', title: 'Maths in everyday life',
          sub: 'Problem-solving strategies, random experiments and frequencies, if–then and the more–the more', when: 'April · May', ustd: 15 },
        { file: 'wb.html', lb: 'Elective area', k: 'W', title: 'Mathematical games',
          sub: 'Tangram and Soma cube, Tower of Hanoi, Nim games, dice games, a game of your own', when: 'June', ustd: 10 }
    ]
};
