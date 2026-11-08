/* js/buch-pt/analysis.js — Portuguese for the widgets of js/buch-analysis.js.
 * Loaded by the Portuguese editions right after js/buch-analysis.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package pt2-prep (08.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('analysis', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs analysis/*)
        // the pictures of the optimisation problems (optimieren): box, tin, pen at a wall
        'Karton mit ausgeschnittenen Ecken': 'Cartão com os cantos recortados', 'Zylindrische Dose': 'Lata cilíndrica',
        'Gehege an einer Mauer': 'Cercado junto a um muro', 'Mauer': 'Muro',
        // book pt-2 mathe12-pt:
        // the cover of the start page (BGY 12)
        'Titelbild: Kurve mit Wendetangente und Ableitung, Binomialverteilung und ein Vektor im Raum':
            'Imagem da capa: curva com a tangente no ponto de inflexão e a derivada, distribuição binomial e um vetor no espaço',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs analysis/*)
        // the derivative tasks (TASKS of ableiten): derivar, a derivada, regra da potência / da soma / do fator constante / do produto,
        // regra da cadeia; the rules have already turned \sin into \operatorname{sen} (js/buch-pt/funktionen.js)
        ['$ und $', '$ e $'], ['$, und $', '$ e $'], [', also $', ', logo $'],
        ['Potenzregel $(x^n)\' = n\\,x^{n-1}$ und Faktorregel: Der Faktor bleibt stehen.', 'Regra da potência $(x^n)\' = n\\,x^{n-1}$ e regra do fator constante: o fator mantém-se.'],
        ['Summenregel: Jeder Summand wird einzeln abgeleitet. Ein konstanter Summand fällt weg.', 'Regra da soma: cada parcela é derivada separadamente. Uma parcela constante desaparece.'],
        ['Die Potenzregel gilt auch für rationale Exponenten: ', 'A regra da potência também vale para expoentes racionais: '],
        ['Summenregel; $\\mathrm{e}^x$ bleibt beim Ableiten $\\mathrm{e}^x$.', 'Regra da soma; a derivada de $\\mathrm{e}^x$ é $\\mathrm{e}^x$.'],
        ['Produktregel $(u \\cdot v)\' = u\'v + uv\'$ mit ', 'Regra do produto $(u \\cdot v)\' = u\'v + uv\'$ com '], ['Produktregel mit $u = ', 'Regra do produto com $u = '],
        // the antiderivative tasks (TASKS of integrieren, BGY 13): Stammfunktion = primitiva, integrieren = primitivar
        ['Potenzregel rückwärts: Exponent um 1 erhöhen, durch den neuen Exponenten teilen, ', 'Regra da potência ao contrário: aumentar o expoente em 1 e dividir pelo novo expoente, '],
        ['Summen- und Faktorregel: Jeder Summand wird einzeln integriert, ein Faktor bleibt stehen. Eine Konstante $a$ hat die Stammfunktion $ax$.',
            'Regras da soma e do fator constante: cada parcela é primitivada separadamente e o fator mantém-se. Uma constante $a$ tem a primitiva $ax$.'],
        ['$: Exponent $\\tfrac12 + 1 = \\tfrac32$, durch $\\tfrac32$ teilen heißt mit $\\tfrac23$ malnehmen.', '$: expoente $\\tfrac12 + 1 = \\tfrac32$; dividir por $\\tfrac32$ é multiplicar por $\\tfrac23$.'],
        ['$: Exponent $-1$, durch $-1$ teilen, also $', '$: expoente $-1$, dividir por $-1$, logo $'],
        ['$: Exponent $\\tfrac12$, durch $\\tfrac12$ teilen heißt verdoppeln.', '$: expoente $\\tfrac12$; dividir por $\\tfrac12$ é multiplicar por 2.'],
        ['Die Potenzregel gilt für jeden Exponenten $r \\neq -1$: ', 'A regra da potência vale para qualquer expoente $r \\neq -1$: '],
        ['$ ist seine eigene Ableitung, also auch seine eigene Stammfunktion.', '$ é a sua própria derivada e, por isso, também a sua própria primitiva.'],
        ['Die Lücke der Potenzregel: ', 'A exceção à regra da potência: '], ['. Für $x > 0$ reicht $\\ln x$.', '. Para $x > 0$ basta $\\ln x$.'],
        ['Lineare Verkettung: ', 'Composição com uma função afim: '], ['. Probe: Die Kettenregel liefert den Faktor $a$, $\\tfrac1a$ hebt ihn auf.', '. Verificação: a regra da cadeia dá o fator $a$, que $\\tfrac1a$ anula.'],
        ['$: erst die Stammfunktion von $\\operatorname{sen}$, dann durch die innere Ableitung $a$ teilen.', '$: primeiro a primitiva de $\\operatorname{sen}$, depois dividir pela derivada interior $a$.'],
        ['$: erst die Stammfunktion von $\\sin$, dann durch die innere Ableitung $a$ teilen.', '$: primeiro a primitiva de $\\operatorname{sen}$, depois dividir pela derivada interior $a$.'],
        ['$: Potenzregel für die Klammer, dann durch die innere Ableitung teilen.', '$: regra da potência para o parêntese, depois dividir pela derivada interior.'],
        // book pt-2 mathe12-pt:
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-2 mathe12-pt:
    ]
});
