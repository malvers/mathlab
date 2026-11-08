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
        // grenzwert (lb2-1): Grenzwert = limite, waagerechte / senkrechte Asymptote = assíntota horizontal / vertical, Loch = buraco
        'Annäherung, Schritt $k$': 'Aproximação, passo $k$', 'Graph mit Annäherung an einen Grenzwert': 'Gráfico a aproximar-se de um limite',
        'Annäherung:': 'Aproximação:', 'Richtung': 'Sentido', '$x$ links': '$x$ à esquerda', '$x$ rechts': '$x$ à direita', 'sin(x)/x': 'sen(x)/x',
        // sekante, ableitungsgraph (lb2-2): Sekante = secante, Tangente = tangente, Steigung = declive, f′ = "f linha"
        'Abstand $h$ von $P$ zu $Q$': 'Distância $h$ de $P$ a $Q$', 'Tangente zeigen': 'Mostrar a tangente', 'Tangente ausblenden': 'Esconder a tangente',
        'Sekante durch P und Q nähert sich der Tangente': 'A secante que passa por P e Q aproxima-se da tangente',
        'Ganzen Graphen von f′ zeigen': 'Mostrar todo o gráfico de f′', 'Spur löschen': 'Apagar o rasto',
        'Oben: f mit Tangente. Ziehe den Punkt P. Unten: Jede Tangentensteigung wird zu einem Punkt des Graphen von f′.':
            'Em cima: f com a tangente. Arrasta o ponto P. Em baixo: cada declive da tangente torna-se um ponto do gráfico de f′.',
        'Graph von f mit Tangente': 'Gráfico de f com a tangente', 'Graph der Ableitung f Strich': 'Gráfico da derivada f linha',
        // ableiten (lb2-3): ableiten = derivar ("Deriva"); the parser of the widget reads "sin", not "sen" (the help on the page says so)
        'Potenzen': 'Potências', 'Summen': 'Somas', 'Wurzeln und Brüche': 'Raízes e frações', 'eˣ und sin x': 'eˣ e sen x', 'Produkte': 'Produtos',
        'Gemischt': 'Misto', 'Aufgabenart': 'Tipo de exercício', 'z. B. 6x^2 - 2 oder cos x': 'p. ex. 6x^2 - 2 ou cos x', 'Lösung': 'Solução',
        'Neue Aufgabe': 'Novo exercício',
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
        // grenzwert (the rule below has already written x → +∞)
        ['links gegen $-\\infty$, rechts gegen $+\\infty$: kein Grenzwert, senkrechte Asymptote $x = 1$',
            'tende para $-\\infty$ à esquerda e para $+\\infty$ à direita: não há limite, assíntota vertical $x = 1$'],
        ['wächst über alle Grenzen: $f(x) \\to +\\infty$, kein Grenzwert', 'cresce sem limite: $f(x) \\to +\\infty$, não há limite'],
        ['An der Stelle $x = 1$ ist $f$ nicht definiert, der Graph hat dort ein Loch. Der Grenzwert existiert trotzdem: Kürzen gibt $',
            'No ponto $x = 1$, $f$ não está definida e o gráfico tem aí um buraco. Mesmo assim, o limite existe: simplificando, obtém-se $'],
        ['Bei $x = 0$ ist $f$ nicht definiert. Die Werte kommen trotzdem beliebig nah an 1 heran.', 'Em $x = 0$, $f$ não está definida. Mesmo assim, os valores aproximam-se de 1 tanto quanto se queira.'],
        ['Der Graph pendelt um die $x$-Achse, die Ausschläge werden immer kleiner.', 'O gráfico oscila em torno do eixo $Ox$ e as oscilações são cada vez menores.'],
        ['$ für $', '$ para $'], ['Waagerechte Asymptote: $y = ', 'Assíntota horizontal: $y = '],
        // sekante, ableitungsgraph
        ['$ mit $h = ', '$ com $h = '], ['Sekantensteigung (Differenzenquotient): $', 'Declive da secante (razão incremental): $'],
        ['Tangentensteigung: $f', 'Declive da tangente: $f'], ['· Für $h \\to 0$ wird aus der Sekante die Tangente.', '· Para $h \\to 0$, a secante transforma-se na tangente.'],
        ['· Mach $h$ kleiner.', '· Diminui $h$.'], ['$ · Steigung in $P', '$ · declive em $P'],
        // ableiten
        ['Leite ab: $f(x) = ', 'Deriva: $f(x) = '], ['Das kann ich nicht lesen. Schreibe zum Beispiel ', 'Não consigo ler isto. Escreve, por exemplo, '],
        ['<b>Richtig!</b>', '<b>Certo!</b>'], ['Noch nicht. Tipp: ', 'Ainda não. Dica: '],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-2 mathe12-pt:
        // grenzwert: Portuguese schools write x → +∞ (never a bare ∞ after an arrow)
        [/\\to \\infty/g, '\\to +\\infty'],
        // ableiten: "· 3 von 5 gelöst" → "· 3 de 5 resolvidos"
        [/ · (\d+) von (\d+) gelöst/g, ' · $1 de $2 resolvidos'],
    ]
});
