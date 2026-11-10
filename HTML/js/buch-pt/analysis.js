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
        // kurve (lb2-4): Hochpunkt / Tiefpunkt = máximo / mínimo relativo, Wendepunkt = ponto de inflexão I, Sattelpunkt = ponto de sela;
        // the letters on the canvas by the rule below
        '$a$ (vor $x^3$)': '$a$ (coeficiente de $x^3$)', '$b$ (vor $x^2$)': '$b$ (coeficiente de $x^2$)', '$c$ (vor $x$)': '$c$ (coeficiente de $x$)',
        'Zeige auch:': 'Mostrar também:', 'nur f': 'só f', 'f′ und f″': 'f′ e f″', 'Ableitungen zeigen': 'Mostrar as derivadas',
        'Graph einer Funktion dritten Grades mit Extrem- und Wendepunkten': 'Gráfico de uma função de 3.º grau com extremos e pontos de inflexão',
        'Intervall': 'Intervalo', 'konstant': 'constante', 'steigt ↗': 'cresce ↗', 'fällt ↘': 'decresce ↘',
        // tangente (lb2-5): Normale = reta normal, Berührpunkt = ponto de tangência
        'Tangente und Normale an einen Graphen': 'Tangente e normal a um gráfico',
        // steckbrief, optimieren (lb2-6): Steckbrief = função a partir de condições, Ansatz = forma geral, Zielfunktion = função objetivo,
        // Nebenbedingung = condição ("Zaun an der Mauer" is in funktionen: "Vedação junto a um muro"); the surface of the tin is A
        // (área total) in Portuguese schools, German O (rule below)
        'Parabel durch 3 Punkte': 'Parábola por 3 pontos', 'Kubisch: Extrempunkt + 2 Punkte': '3.º grau: extremo + 2 pontos',
        'Kubisch: Wendepunkt mit Tangente + Punkt': '3.º grau: ponto de inflexão com tangente + ponto', 'Bedingungen': 'Condições',
        'Steigung im Wendepunkt $m$': 'Declive no ponto de inflexão $m$', 'Funktion aus Bedingungen': 'Função a partir de condições',
        'Schachtel': 'Caixa', 'Dose': 'Lata', 'Problem': 'Problema', 'Zielfunktion': 'Função objetivo',
        'Lösung mit der Ableitung': 'Solução com a derivada', 'x in cm': 'x em cm', 'V in cm³': 'V em cm³', 'r in cm': 'r em cm',
        'O in cm²': 'A em cm²', 'x in m': 'x em m', 'A in m²': 'A em m²',
        // book pt-3 mathe13-pt:
        // schar, gewinn (lb6): Funktionenschar = família de funções, Ortskurve = lugar geométrico, Erlös = receita, Gewinn = lucro,
        // Gewinnschwelle = limiar de rendibilidade, Gewinngrenze = limite do lucro; the letters K, E, G stay (canvas labels, explained on the page)
        'Funktionenschar': 'Família de funções', 'Funktionenschar mit Ortskurve': 'Família de funções com o lugar geométrico dos extremos',
        'Parameter $a$': 'Parâmetro $a$', 'Verkaufspreis $p$ (€ pro Stück)': 'Preço de venda $p$ (€ por unidade)', 'x in Stück': 'x em unidades',
        'Kosten, Erlös und Gewinn': 'Custos, receita e lucro',
        // book pt-4 mathe12lk-pt:
        // book pt-5 mathe13lk-pt:
        // integrieren (lb3-1): primitivar; the parser of the widget reads "sin", not "sen" (the help on the page shows -cos(x))
        'eˣ, 1/x, sin, cos': 'eˣ, 1/x, sen, cos', 'Lineare Verkettung': 'Composição afim',
        'z. B. x^3/3 - 2x oder -cos(2x)/2': 'p. ex. x^3/3 - 2x ou -cos(2x)/2',
        // schar (lb7-1): Funktionenschar = família de funções, Ortskurve = lugar geométrico; Hoch-/Tiefpunkt without letters (phrases below)
        'Funktionenschar': 'Família de funções', 'Ortskurve der Extrempunkte zeigen': 'Mostrar o lugar geométrico dos extremos',
        'Funktionenschar mit Ortskurve': 'Família de funções com o lugar geométrico', 'Parameter $a$': 'Parâmetro $a$',
        // gewinn (lb7-2): Kosten K, Erlös E, Gewinn G stay as letters (explained on the page); Stück = unidade
        'Verkaufspreis $p$ (€ pro Stück)': 'Preço de venda $p$ (€ por unidade)', 'x in Stück': 'x em unidades', 'Kosten, Erlös und Gewinn': 'Custo, receita e lucro',
        'Bei diesem Preis wird nie Gewinn gemacht.': 'A este preço nunca há lucro.', 'Kein positives Gewinnmaximum.': 'Não há lucro máximo positivo.',
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
        // kurve (the point rule has already written H(1, 4); Portuguese names the extremes without a letter)
        ['Hochpunkt $H', 'Máximo relativo $'], ['Tiefpunkt $T', 'Mínimo relativo $'], ['keine Extrempunkte', 'não há extremos'],
        [' · Sattelpunkt bei $x = ', ' · ponto de sela em $x = '], ['Wendepunkt $W', 'Ponto de inflexão $I'],
        ['$: Dort ist $f\'\'(x) = 0$ und die Steigung am kleinsten.', '$: aí $f\'\'(x) = 0$ e o declive é mínimo.'],
        ['$: Dort ist $f\'\'(x) = 0$ und die Steigung am größten.', '$: aí $f\'\'(x) = 0$ e o declive é máximo.'],
        ['Für $a = 0$ ist $f$ eine Parabel (oder Gerade) ohne Wendepunkt.', 'Para $a = 0$, $f$ é uma parábola (ou uma reta) sem ponto de inflexão.'],
        // tangente
        ['$ · Berührpunkt $P', '$ · ponto de tangência $P'], ['Tangente: $', 'Tangente: $'],
        ['Normale (senkrecht zur Tangente, $m_n = -\\tfrac{1}{m_t}$): $', 'Normal (perpendicular à tangente, $m_n = -\\tfrac{1}{m_t}$): $'],
        // steckbrief
        ['Lösung: $f(x) = ', 'Solução: $f(x) = '], ['Ansatz: $f(x) = ', 'Forma geral: $f(x) = '], ['Probe: $', 'Verificação: $'],
        ['Achtung: Bei $E$ ist $f\'\'(x) = 0$, das ist ein Sattelpunkt, kein Extrempunkt.', 'Atenção: em $E$ tem-se $f\'\'(x) = 0$; é um ponto de sela, não um extremo.'],
        ['< 0$, also ein Hochpunkt.', '< 0$, logo é um máximo.'], ['> 0$, also ein Tiefpunkt.', '> 0$, logo é um mínimo.'],
        ['Mit diesen Bedingungen hat das Gleichungssystem keine eindeutige Lösung. Zwei Punkte mit gleichem $x$?',
            'Com estas condições, o sistema de equações não tem uma solução única. Dois pontos com o mesmo $x$?'],
        // optimieren
        ['Aus einem Karton von 30 cm × 20 cm werden an den Ecken Quadrate mit der Seite $x$ ausgeschnitten und die Ränder hochgeklappt. Für welches $x$ wird das Volumen der offenen Schachtel am größten?',
            'Num cartão de 30 cm × 20 cm recortam-se, nos cantos, quadrados de lado $x$ e dobram-se as abas para cima. Para que valor de $x$ é máximo o volume da caixa aberta?'],
        ['Eine zylindrische Dose soll 1 Liter fassen ($V = \\pi r^2 h = 1000\\,\\text{cm}^3$). Für welchen Radius $r$ braucht man am wenigsten Blech?',
            'Uma lata cilíndrica deve levar 1 litro ($V = \\pi r^2 h = 1000\\,\\text{cm}^3$). Para que raio $r$ é precisa menos chapa?'],
        ['Mit 60 m Zaun soll an einer Mauer ein rechteckiges Gehege abgesteckt werden. Die Mauer bildet eine Seite. Wie groß wird die Fläche höchstens?',
            'Com 60 m de rede quer-se vedar um cercado retangular junto a um muro. O muro forma um dos lados. Qual é a maior área possível?'],
        ['Bei $', 'Para $'], ['$ ergibt $', '$ dá $'], ['$ mit $', '$, com $'], ['(Maximum)', '(máximo)'], ['(Minimum)', '(mínimo)'],
        [' Die zweite Lösung $x \\approx ', ' A segunda solução, $x \\approx '], ['$ liegt außerhalb von $0 < x < 10$.', '$, fica fora de $0 < x < 10$.'],
        [' Dann ist $h = ', ' Então $h = '], ['\\,\\text{cm} = 2r$: Die beste Dose ist so hoch wie breit.', '\\,\\text{cm} = 2r$: a melhor lata é tão alta como larga.'],
        [' Die Seite parallel zur Mauer ist dann $60 - 2 \\cdot 15 = 30\\,\\text{m}$ lang.', ' O lado paralelo ao muro mede então $60 - 2 \\cdot 15 = 30\\,\\text{m}$.'],
        // book pt-3 mathe13-pt:
        // schar (the point rules have already written the extrema as (x, y))
        [' Ortskurve der Extrempunkte zeigen', ' Mostrar o lugar geométrico dos extremos'],
        ['Hochpunkt $(', 'máximo relativo em $('], ['Tiefpunkt $(', 'mínimo relativo em $('],
        ['Ortskurve aller Extrempunkte (violett): $', 'Lugar geométrico de todos os extremos (a violeta): $'],
        ['Für $a \\le 0$ gibt es keine Extrempunkte: $f_a\'(x) = 3x^2 - a$ hat dann keine Nullstelle mit Vorzeichenwechsel.',
            'Para $a \\le 0$ não há extremos: $f_a\'(x) = 3x^2 - a$ não tem então nenhum zero com mudança de sinal.'],
        ['Jede Parabel der Schar geht durch den Ursprung, denn $f_a(0) = 0$ für alle $a$.', 'Todas as parábolas da família passam pela origem, porque $f_a(0) = 0$ para todo o $a$.'],
        // gewinn
        ['Gewinnschwelle bei $x \\approx ', 'Limiar de rendibilidade em $x \\approx '], ['$, Gewinngrenze bei $x \\approx ', '$, limite do lucro em $x \\approx '],
        ['$ Stück, $G \\approx ', '$ unidades, $G \\approx '], ['$ Stück.', '$ unidades.'], ['Gewinn ab $x \\approx ', 'Lucro a partir de $x \\approx '],
        ['Bei diesem Preis wird nie Gewinn gemacht.', 'A este preço nunca há lucro.'],
        ['Gewinnmaximum: $G\'(x) = 0$ bei $x \\approx ', 'Lucro máximo: $G\'(x) = 0$ em $x \\approx '], ['Kein positives Gewinnmaximum.', 'Não há lucro máximo positivo.'],
        // book pt-4 mathe12lk-pt:
        // book pt-5 mathe13lk-pt:
        // integrieren ("· 3 von 5 gelöst" by the rule of pt-2)
        ['Bestimme eine Stammfunktion: $f(x) = ', 'Determina uma primitiva: $f(x) = '],
        ['Noch nicht. Leite deine Lösung zur Probe ab. Tipp: ', 'Ainda não. Deriva a tua solução para a verificares. Dica: '],
        // schar
        [' · Hochpunkt $(', ' · máximo relativo em $('], [' · Tiefpunkt $(', ' · mínimo relativo em $('],
        ['Ortskurve aller Extrempunkte (violett): $', 'Lugar geométrico de todos os extremos (a violeta): $'],
        ['Für $a \\le 0$ gibt es keine Extrempunkte: $f_a\'(x) = 3x^2 - a$ hat dann keine Nullstelle mit Vorzeichenwechsel.',
            'Para $a \\le 0$ não há extremos: $f_a\'(x) = 3x^2 - a$ não tem então nenhum zero com mudança de sinal.'],
        ['Jede Parabel der Schar geht durch den Ursprung, denn $f_a(0) = 0$ für alle $a$.', 'Todas as parábolas da família passam pela origem, porque $f_a(0) = 0$ para todo o $a$.'],
        // gewinn
        ['Gewinnschwelle bei $x \\approx ', 'Limiar de rentabilidade em $x \\approx '], ['$, Gewinngrenze bei $x \\approx ', '$, limite do lucro em $x \\approx '], ['$ Stück.', '$ unidades.'],
        ['Gewinn ab $x \\approx ', 'Lucro a partir de $x \\approx '], ['Gewinnmaximum: $G\'(x) = 0$ bei $x \\approx ', 'Lucro máximo: $G\'(x) = 0$ em $x \\approx '], ['$ Stück, $G \\approx ', '$ unidades, $G \\approx '],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-2 mathe12-pt:
        // grenzwert: Portuguese schools write x → +∞ (never a bare ∞ after an arrow)
        [/\\to \\infty/g, '\\to +\\infty'],
        // ableiten: "· 3 von 5 gelöst" → "· 3 de 5 resolvidos"
        [/ · (\d+) von (\d+) gelöst/g, ' · $1 de $2 resolvidos'],
        // kurve: the letters drawn alone on the canvas, H/T/W (Hochpunkt, Tiefpunkt, Wendepunkt) → Máx/Mín/I; only a string that is
        // nothing but the letter (no widget sentence is), the sentences have their phrases; the sign table ends at +∞
        [/^H$/, 'Máx'], [/^T$/, 'Mín'], [/^W$/, 'I'], [/(< )\\infty/g, '$1+\\infty'],
        // optimieren: the surface of the tin is A in Portuguese schools (German O): "$O(r)", "$O'(r)", "$O \approx"
        [/(^|\$)O('?\(r\)| \\approx)/g, '$1A$2'],
        // book pt-3 mathe13-pt:
        // book pt-4 mathe12lk-pt:
        // book pt-5 mathe13lk-pt:
    ]
});
