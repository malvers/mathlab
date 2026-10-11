/* kapitel.js — the chapters of the English edition of "Mathematik · Gymnasium 9" (buch/mathegy9/), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathegy9.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich; 4 Ustd./week, 104 + 8 Ustd.).
 * Book 11 of the English editions (forloop-71 orchestrates, Einstein translates).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathematics · Grammar School 9',
    short: 'Mathematics GY 9',
    lang: 'en',
    druck: false,
    description: 'Interactive mathematics textbook for the Gymnasium (grammar school), Year 9 (Saxony): powers and roots, power functions, quadratic functions and equations, optimisation problems, circle, cylinder and sphere, Pythagoras’ theorem and its relatives, trigonometry in right-angled triangles, pyramid and cone, analysing data and the golden ratio, with labs, simulations and self-checks with instant feedback.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Learning area 1', k: '1.1', title: 'Powers and roots',
          sub: 'Raising to powers and taking roots, laws of indices with rational exponents, equations with roots', when: 'August · September', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Learning area 1', k: '1.2', title: 'Power functions',
          sub: 'Integer and rational exponents, symmetry, zeros and poles, asymptotes', when: 'September', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Learning area 1', k: '1.3', title: 'Parameters and quadratic functions',
          sub: 'Stretching, shifting, reflecting, standard and vertex form, completing the square', when: 'October', ustd: 8 },
        { file: 'lb1-4.html', lb: 'Learning area 1', k: '1.4', title: 'Quadratic equations and extreme values',
          sub: 'Quadratic formula, discriminant, Vieta’s theorem, optimisation via the vertex', when: 'November', ustd: 16 },
        { file: 'lb2.html', lb: 'Learning area 2', k: '2', title: 'Circle, cylinder and sphere',
          sub: 'Arc and sector, surface area, volume and mass, Archimedes', when: 'December', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Learning area 3', k: '3.1', title: 'Pythagoras’ theorem and its relatives',
          sub: 'Theorem and proof, distances in the plane and in space, altitude and leg theorems, converse', when: 'January · February', ustd: 16 },
        { file: 'lb3-2.html', lb: 'Learning area 3', k: '3.2', title: 'Trigonometry in right-angled triangles',
          sub: 'Sine, cosine and tangent, sides and angles, areas, regular polygons and π', when: 'February · March', ustd: 12 },
        { file: 'lb3-3.html', lb: 'Learning area 3', k: '3.3', title: 'Pyramid and cone',
          sub: 'Surface area and volume, land surveying project', when: 'March', ustd: 4 },
        { file: 'lb4.html', lb: 'Learning area 4', k: '4', title: 'Analysing data',
          sub: 'Mode, median, mean, spread, histograms, statistical tricks', when: 'April', ustd: 12 },
        { file: 'lb5.html', lb: 'Learning area 5', k: '5', title: 'Mathematics and modern computing',
          sub: 'Solving a real-world problem with a spreadsheet and a CAS', when: 'May', ustd: 4 },
        { file: 'wb.html', lb: 'Elective area', k: 'W', title: 'The golden ratio',
          sub: 'Derivation, construction, pentagram, art and architecture', when: 'May · June', ustd: 8 }
    ]
};
