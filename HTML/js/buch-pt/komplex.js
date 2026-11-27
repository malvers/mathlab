/* js/buch-pt/komplex.js — Portuguese for the widgets of js/buch-komplex.js.
 * Loaded by the Portuguese editions right after js/buch-komplex.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3-18-prep (27.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('komplex', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs komplex/*)
        // book pt-20 mathegy10-pt:
        // quadkomplex (the widget keeps the German form x² + px + q and D = (p/2)² − q; the page explains it next to Δ)
        'Parabel y = x² + px + q': 'Parábola y = x² + px + q', 'Die beiden Lösungen in der Gaußschen Zahlenebene': 'As duas soluções no plano de Argand',
        // zeiger ("Betrag" of a complex number: módulo)
        'Betrag und Argument': 'Módulo e argumento', 'mal $\\mathrm{i}$': 'vezes $\\mathrm{i}$', 'Quadrat $z^2$': 'Quadrado $z^2$', 'Ansicht': 'Vista',
        'Komplexe Zahl als Pfeil in der Gaußschen Zahlenebene': 'Número complexo representado por uma seta no plano de Argand',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs komplex/*)
        // book pt-20 mathegy10-pt:
        // quadkomplex
        ['$ · Diskriminante $D = \\left(\\tfrac{p}{2}\\right)^2 - q = ', '$ · discriminante $D = \\left(\\tfrac{p}{2}\\right)^2 - q = '],
        ['$D > 0$: zwei reelle Lösungen $x_{1,2} = ', '$D > 0$: duas soluções reais $x_{1,2} = '], ['$, die Parabel schneidet die $x$-Achse zweimal.', '$, a parábola interseta o eixo $Ox$ duas vezes.'],
        ['$D = 0$: genau eine Lösung $x = ', '$D = 0$: exatamente uma solução $x = '], ['$, die Parabel berührt die $x$-Achse.', '$, a parábola toca o eixo $Ox$.'],
        ['$D < 0$: keine reelle Lösung, die Parabel bleibt über der $x$-Achse. In $\\mathbb{C}$: $z_{1,2} = ', '$D < 0$: nenhuma solução real, a parábola fica acima do eixo $Ox$. Em $\\mathbb{C}$: $z_{1,2} = '],
        ['\\,\\mathrm{i}$, zwei <b>konjugiert komplexe</b> Zahlen, gespiegelt an der reellen Achse.', '\\,\\mathrm{i}$, dois números complexos <b>conjugados</b>, simétricos em relação ao eixo real.'],
        ['Vieta stimmt auch hier: $z_1 + z_2 = ', 'As relações de Viète também valem aqui: $z_1 + z_2 = '], [' = -p$ und $z_1 \\cdot z_2 = ', ' = -p$ e $z_1 \\cdot z_2 = '],
        // zeiger
        ['$ · Realteil $', '$ · parte real $'], ['$, Imaginärteil $', '$, parte imaginária $'], ['Betrag $|z| = \\sqrt{', 'Módulo $|z| = \\sqrt{'],
        ['$ (Pythagoras) · Argument $\\varphi \\approx ', '$ (Pitágoras) · argumento $\\varphi \\approx '], ['^\\circ$, der Winkel zur positiven reellen Achse', '^\\circ$, o ângulo com o semieixo real positivo'],
        ['Wegen $\\mathrm{i}^2 = -1$ wird der Pfeil um $90^\\circ$ <b>gegen den Uhrzeigersinn gedreht</b>, der Betrag bleibt $',
            'Como $\\mathrm{i}^2 = -1$, a seta <b>roda</b> $90^\\circ$ <b>no sentido contrário ao dos ponteiros do relógio</b>; o módulo mantém-se $'],
        ['$. Viermal mal $\\mathrm{i}$ ergibt eine volle Drehung: $\\mathrm{i}^4 = 1$.', '$. Multiplicar quatro vezes por $\\mathrm{i}$ dá uma volta completa: $\\mathrm{i}^4 = 1$.'],
        ['Der Betrag wird quadriert ($', 'O módulo é elevado ao quadrado ($'], ['$), das Argument verdoppelt ($\\approx ', '$), o argumento duplica ($\\approx '],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-20 mathegy10-pt:
    ]
});
