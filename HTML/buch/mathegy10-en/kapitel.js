/* kapitel.js — the chapters of the English edition of "Mathematik · Gymnasium 10" (buch/mathegy10/), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathegy10.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich; 4 Ustd./week).
 * Doc, 11.10.2026: book 10 of the English editions (forloop-71 orchestrates, Newton translates).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * No print edition yet: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathematics · Grammar School 10',
    short: 'Mathematics GY 10',
    lang: 'en',
    druck: false,
    description: 'Interactive mathematics textbook for the Gymnasium (grammar school), Year 10 (Saxony): growth and exponential functions, periodic processes and the sine function, random variables, expected value and fair games, the sine and cosine rules, logarithms and exponential equations, the tangent function, functions at a glance, sequences and limits, interest and complex numbers, with labs, simulations and self-checks with instant feedback.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Learning area 1', k: '1.1', title: 'Growth and exponential functions',
          sub: 'Linear, exponential, bounded, recursive and explicit, parameters and regression', when: 'August · September', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Learning area 1', k: '1.2', title: 'Periodic processes and the sine function',
          sub: 'Period, amplitude, mean level, degrees and radians, parameters of the sine function', when: 'September · October', ustd: 10 },
        { file: 'lb2-1.html', lb: 'Learning area 2', k: '2.1', title: 'Random variables and path rules',
          sub: 'Probability distributions, bar chart, “exactly k”, “at least k”, “at most k”', when: 'November', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Learning area 2', k: '2.2', title: 'Expected value and fair games',
          sub: 'Expected value, variance and standard deviation, fair and unfair games', when: 'November', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Learning area 3', k: '3.1', title: 'Sine rule, cosine rule and area',
          sub: 'General triangles, the ambiguous case, Pythagoras as a special case, the area formula with sine', when: 'December', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Learning area 3', k: '3.2', title: 'Calculations with triangles and solids',
          sub: 'Plan of solution, surveying, pyramid and cone, realistic problems', when: 'January', ustd: 8 },
        { file: 'lb4-1.html', lb: 'Learning area 4', k: '4.1', title: 'Inverse functions and logarithms',
          sub: 'Invertibility, reflecting in y = x, the logarithm, the laws of logarithms', when: 'January · February', ustd: 12 },
        { file: 'lb4-2.html', lb: 'Learning area 4', k: '4.2', title: 'Logarithmic functions and exponential equations',
          sub: 'Graph and properties, exponential equations, doubling time and half-life', when: 'March', ustd: 8 },
        { file: 'lb4-3.html', lb: 'Learning area 4', k: '4.3', title: 'Combining functions, composition and the tangent function',
          sub: 'Sum, product, quotient, inner and outer function, tangent with poles', when: 'March', ustd: 8 },
        { file: 'lb4-4.html', lb: 'Learning area 4', k: '4.4', title: 'Functions at a glance',
          sub: 'Sorting classes of functions, profiles, sketching graphs without aids', when: 'April', ustd: 8 },
        { file: 'lb4-5.html', lb: 'Learning area 4', k: '4.5', title: 'Sequences and limits',
          sub: 'Explicit and recursive, monotonicity, bounds, limit, the circle in parametric form', when: 'April', ustd: 6 },
        { file: 'lb5.html', lb: 'Learning area 5', k: '5', title: 'Interest',
          sub: 'Interest and compound interest, loan and repayment plan, what a loan really costs', when: 'May', ustd: 4 },
        { file: 'wb.html', lb: 'Elective area', k: 'E', title: 'Complex numbers',
          sub: 'Imaginary unit, calculating in ℂ, the complex plane, modulus and argument', when: 'May · June', ustd: 8 }
    ]
};
