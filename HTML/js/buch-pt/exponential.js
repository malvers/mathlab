/* js/buch-pt/exponential.js — Portuguese for the widgets of js/buch-exponential.js.
 * Loaded by the Portuguese editions right after js/buch-exponential.js; the engine and the shared words are in js/buch-pt.js.
 *   word    a whole label → its Portuguese
 *   phrase  German sentence pieces exactly as the widget source writes them → Portuguese
 *   rule    word order and notation (after the point rules of js/buch-pt.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3-7-prep (22.11.2026): the module's helpers (outside every widget) go below the pt0 line, everything a
 * book needs below its own comment line, every entry ending with a comma. Search the dictionaries before writing a
 * string (grep -n "<German>" HTML/js/buch-pt/*.js).
 * Terms: tools/buch-pt/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang pt
 */
window.BuchPT && BuchPT.add('exponential', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs exponential/*)
        // book pt-9 mathegy11-pt:
        // book pt-19 mathe10-pt:
        // the helpers of the module (MODELS, CLASSES, the sketches and the applications), reported for every page that loads it
        // wachstumsmodell: the models are masculine, as "crescimento" (limitado, logístico)
        'beschränkt': 'limitado', 'logistisch': 'logístico',
        'Sparschwein: 50 € am Anfang, jede Woche kommen 20 € dazu.': 'Mealheiro: 50 € no início e, todas as semanas, juntam-se 20 €.',
        'Bakterienkultur: 200 Bakterien, jede Stunde 30 % mehr.': 'Cultura de bactérias: 200 bactérias e, a cada hora, mais 30 %.',
        'Ein Getränk aus dem Kühlschrank (6 °C) erwärmt sich auf Raumtemperatur (22 °C). Pro Minute schrumpft der Abstand zur Raumtemperatur um 15 %.':
            'Uma bebida tirada do frigorífico (6 °C) aquece até à temperatura ambiente (22 °C). Em cada minuto, a diferença para a temperatura ambiente diminui 15 %.',
        'Ein Gerücht an einer Schule mit 800 Schülerinnen und Schülern: Am Anfang kennen es 10.': 'Um boato numa escola com 800 alunos: no início, 10 conhecem-no.',
        'Betrag in €': 'Montante em €', 'Anzahl': 'Número', 'Temperatur in °C': 'Temperatura em °C', 'kennen es': 'conhecem-no',
        'Zunahme $d$ pro Schritt': 'Aumento $d$ por passo', 'Wachstumsfaktor $q$': 'Fator de crescimento $q$',
        'Anteil $k$ des Abstands pro Schritt': 'Fração $k$ da diferença por passo', 'Wachstumskonstante $k$': 'Constante de crescimento $k$',
        'Anfangsbestand $B_0$': 'Valor inicial $B_0$', 'Schranke $S$': 'Limite $S$', 'Anzahl der Schritte': 'Número de passos',
        'Bestand Schritt für Schritt': 'A quantidade passo a passo',
        'Die <b>Differenz</b> aufeinanderfolgender Werte ist konstant.': 'A <b>diferença</b> entre valores consecutivos é constante.',
        'Wochen': 'semanas', 'Minuten': 'minutos',
        // expanwendung (data)
        'Medikament': 'Medicamento', 'Bakterien': 'Bactérias',
        '2000 € werden mit 3 % pro Jahr verzinst.': 'Aplicam-se 2000 € a uma taxa de juro de 3 % ao ano.',
        'Kohlenstoff-14 zerfällt mit einer Halbwertszeit von 5730 Jahren.': 'O carbono-14 decai com uma meia-vida de 5730 anos.',
        '400 mg eines Wirkstoffs, der Körper baut pro Stunde 20 % ab.': '400 mg de uma substância ativa; o corpo elimina 20 % por hora.',
        '500 Bakterien, die Anzahl verdoppelt sich alle 3 Stunden.': '500 bactérias; o número duplica a cada 3 horas.',
        // funktionsklassen (the table rows; sen and tg as Portuguese schools write them)
        'Term': 'Expressão', 'Verlauf': 'Comportamento', 'Besonderheit': 'Particularidade', 'Asymptote': 'Assíntota', 'Nullstelle und Asymptote': 'Zero e assíntota',
        '$a_n x^n + \\ldots + a_1 x + a_0$, zum Beispiel $x^2$ oder $x^3 - 3x$': '$a_n x^n + \\ldots + a_1 x + a_0$, por exemplo $x^2$ ou $x^3 - 3x$',
        'alle reellen Zahlen': 'todos os números reais', 'höchstens $n$ Stück (Grad $n$)': 'no máximo $n$ (grau $n$)',
        'für große $|x|$ bestimmt der Summand mit dem höchsten Exponenten den Verlauf, keine Asymptoten':
            'para $|x|$ grande, o termo de maior expoente determina o comportamento; não há assíntotas',
        'nur gerade Exponenten: achsensymmetrisch zur $y$-Achse, nur ungerade: punktsymmetrisch zum Ursprung':
            'só expoentes pares: simétrico em relação ao eixo $Oy$; só ímpares: simétrico em relação à origem',
        'ein Bruch mit $x$ im Nenner, zum Beispiel $\\tfrac{1}{x}$ oder $\\tfrac{2}{x - 1} + 1$':
            'uma fração com $x$ no denominador, por exemplo $\\tfrac{1}{x}$ ou $\\tfrac{2}{x - 1} + 1$',
        'alle reellen Zahlen außer den Nullstellen des Nenners': 'todos os números reais exceto os zeros do denominador',
        'Fahrzeit $t = \\tfrac{s}{v}$ bei fester Strecke': 'tempo de viagem $t = \\tfrac{d}{v}$ para uma distância fixa',
        '$\\sqrt{x}$, verschoben oder gestreckt': '$\\sqrt{x}$, transladada ou dilatada',
        '$x \\geq 0$ (beim Grundtyp)': '$x \\geq 0$ (na função de referência)', '$y \\geq 0$ (beim Grundtyp)': '$y \\geq 0$ (na função de referência)',
        'Umkehrfunktion von $y = x^2$ für $x \\geq 0$, keine Asymptote': 'função inversa de $y = x^2$ para $x \\geq 0$; não há assíntota',
        '$a \\cdot b^x$ mit $b > 0$, $b \\neq 1$': '$a \\times b^x$ com $b > 0$, $b \\neq 1$',
        '$y > 0$ (für $a > 0$), also keine Nullstelle': '$y > 0$ (para $a > 0$), logo não há zeros',
        'die $x$-Achse, alle Graphen $b^x$ gehen durch $(0 \\mid 1)$': 'o eixo $Ox$; todos os gráficos de $b^x$ passam por $(0, 1)$',
        'Wachstum und Zerfall, Zinseszins': 'crescimento e decaimento, juro composto',
        '$\\log_a x$ mit $a > 0$, $a \\neq 1$': '$\\log_a x$ com $a > 0$, $a \\neq 1$',
        'Nullstelle $x = 1$, senkrechte Asymptote: die $y$-Achse': 'zero $x = 1$; assíntota vertical: o eixo $Oy$',
        'Richterskala, Dezibel, pH-Wert': 'escala de Richter, decibéis, pH',
        '$\\sin x$, $\\cos x$, $\\tan x$, auch $a \\cdot \\sin(b(x - c)) + d$': '$\\operatorname{sen} x$, $\\cos x$, $\\operatorname{tg} x$ e também $a \\times \\operatorname{sen}(b(x - c)) + d$',
        'Sinus und Kosinus: alle reellen Zahlen; Tangens: ohne $\\tfrac{\\pi}{2} + k\\pi$': 'seno e cosseno: todos os números reais; tangente: exceto $\\tfrac{\\pi}{2} + k\\pi$',
        'Sinus und Kosinus: $-1 \\leq y \\leq 1$; Tangens: alle reellen Zahlen': 'seno e cosseno: $-1 \\leq y \\leq 1$; tangente: todos os números reais',
        'Schwingungen, Gezeiten, Tageslänge': 'oscilações, marés, duração do dia',
        // skizze (data): the steps, with the vertex V and the Portuguese points
        'Grundfunktion $2^x$, um 4 nach <b>unten</b> verschoben: waagerechte Asymptote $y = -4$.': 'Função de referência $2^x$, transladada 4 unidades para <b>baixo</b>: assíntota horizontal $y = -4$.',
        'Schnittpunkt mit der $y$-Achse: $f(0) = 1 - 4 = -3$.': 'Interseção com o eixo $Oy$: $f(0) = 1 - 4 = -3$.',
        'Nullstelle: $2^x = 4 \\Rightarrow x = 2$.': 'Zero: $2^x = 4 \\Rightarrow x = 2$.',
        'Ein Punkt mehr: $f(3) = 8 - 4 = 4$. Streng monoton steigend.': 'Mais um ponto: $f(3) = 8 - 4 = 4$. Estritamente crescente.',
        'Scheitelpunktform: Scheitel $S(1 \\mid 4)$, nach <b>unten</b> geöffnet, so breit wie die Normalparabel.':
            'Forma canónica: vértice $V(1, 4)$, concavidade voltada para <b>baixo</b>, com a mesma abertura que a parábola $y = x^2$.',
        'Nullstellen: $(x - 1)^2 = 4 \\Rightarrow x - 1 = \\pm 2$, also $x = -1$ und $x = 3$.': 'Zeros: $(x - 1)^2 = 4 \\Rightarrow x - 1 = \\pm 2$, logo $x = -1$ e $x = 3$.',
        'Schnittpunkt mit der $y$-Achse: $f(0) = -1 + 4 = 3$, gespiegelt an $x = 1$ auch $(2 \\mid 3)$.':
            'Interseção com o eixo $Oy$: $f(0) = -1 + 4 = 3$ e, por simetria em relação a $x = 1$, também $(2, 3)$.',
        'Grundfunktion $\\tfrac1x$, um 2 nach rechts verschoben: <b>Polstelle</b> $x = 2$ mit senkrechter Asymptote.':
            'Função de referência $\\tfrac1x$, transladada 2 unidades para a direita: <b>polo</b> $x = 2$ com assíntota vertical.',
        'Um 1 nach oben verschoben: waagerechte Asymptote $y = 1$.': 'Transladada 1 unidade para cima: assíntota horizontal $y = 1$.',
        'Nullstelle: $\\tfrac{1}{x - 2} = -1 \\Rightarrow x - 2 = -1 \\Rightarrow x = 1$.': 'Zero: $\\tfrac{1}{x - 2} = -1 \\Rightarrow x - 2 = -1 \\Rightarrow x = 1$.',
        '$y$-Achse: $f(0) = -\\tfrac12 + 1 = \\tfrac12$; rechts der Polstelle zum Beispiel $f(3) = 2$.': 'Eixo $Oy$: $f(0) = -\\tfrac12 + 1 = \\tfrac12$; à direita do polo, por exemplo, $f(3) = 2$.',
        'Grundfunktion $\\log_2 x$, um 1 nach <b>links</b> verschoben: Definitionsbereich $x > -1$, senkrechte Asymptote $x = -1$.':
            'Função de referência $\\log_2 x$, transladada 1 unidade para a <b>esquerda</b>: domínio $x > -1$, assíntota vertical $x = -1$.',
        'Nullstelle: $x + 1 = 1 \\Rightarrow x = 0$. Sie ist zugleich der Schnittpunkt mit der $y$-Achse.': 'Zero: $x + 1 = 1 \\Rightarrow x = 0$. É também o ponto de interseção com o eixo $Oy$.',
        'Weitere Punkte an Zweierpotenzen: $f(1) = 1$, $f(3) = 2$, $f(7) = 3$.': 'Mais pontos onde $x + 1$ é uma potência de 2: $f(1) = 1$, $f(3) = 2$, $f(7) = 3$.',
        'Mittellinie $y = 1$, Amplitude 2: Die Werte liegen zwischen $-1$ und $3$.': 'Linha média $y = 1$, amplitude 2: os valores estão entre $-1$ e $3$.',
        'Periode $2\\pi$ wie beim Sinus. Hochpunkt bei $\\tfrac{\\pi}{2}$, Tiefpunkt bei $\\tfrac{3\\pi}{2}$.': 'Período $2\\pi$, como no seno. Máximo em $\\tfrac{\\pi}{2}$, mínimo em $\\tfrac{3\\pi}{2}$.',
        'Auf der Mittellinie bei $0$, $\\pi$ und $2\\pi$.': 'Na linha média em $0$, $\\pi$ e $2\\pi$.',
        'Ausklammern: $x(x^2 - 4) = x(x - 2)(x + 2)$, Nullstellen $-2$, $0$ und $2$.': 'Pôr em evidência: $x(x^2 - 4) = x(x - 2)(x + 2)$, zeros $-2$, $0$ e $2$.',
        'Nur ungerade Exponenten: <b>punktsymmetrisch</b> zum Ursprung. Für große $x$ entscheidet $x^3$: rechts nach oben, links nach unten.':
            'Só expoentes ímpares: <b>simétrico em relação à origem</b>. Para $x$ grande decide $x^3$: à direita para cima, à esquerda para baixo.',
        'Zwei Punkte: $f(1) = -3$ und, symmetrisch, $f(-1) = 3$.': 'Dois pontos: $f(1) = -3$ e, por simetria, $f(-1) = 3$.',
        // book pt-20 mathegy10-pt:
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs exponential/*)
        // book pt-9 mathegy11-pt:
        // book pt-19 mathe10-pt:
        // wachstumsmodell
        ['rekursiv: $B_0 = ', 'forma recursiva: $B_0 = '], ['explizit: $', 'forma explícita: $'],
        ['Der <b>Quotient</b> aufeinanderfolgender Werte ist konstant: ', 'O <b>quociente</b> entre valores consecutivos é constante: '],
        [' % pro Schritt (Abnahme).', ' % por passo (diminuição).'], [' % pro Schritt.', ' % por passo.'], ['Der Bestand bleibt gleich.', 'A quantidade mantém-se.'],
        ['Der <b>Abstand zur Schranke</b> schrumpft mit dem Faktor $1 - k = ', 'A <b>diferença para o limite</b> diminui com o fator $1 - k = '],
        ['$, der Bestand kommt $S$ immer näher, ohne sie zu überschreiten.', '$; a quantidade aproxima-se cada vez mais de $S$, sem o ultrapassar.'],
        ['Am Anfang wächst der Bestand fast exponentiell, in der Nähe von $\\tfrac{S}{2} = ', 'No início, a quantidade cresce quase exponencialmente; perto de $\\tfrac{S}{2} = '],
        ['$ am schnellsten, dann bremst ihn die Schranke. Eine einfache explizite Formel gibt es für diese schrittweise Rechnung nicht, man rechnet Schritt für Schritt, am besten mit einer Tabellenkalkulation.',
            '$ cresce mais depressa e depois o limite trava-a. Para este cálculo passo a passo não há uma fórmula explícita simples: calcula-se passo a passo, de preferência numa folha de cálculo.'],
        [' <b>Achtung:</b> Bei so großem $k$ springt der Bestand über die Schranke und schwingt.', ' <b>Atenção:</b> com um $k$ tão grande, a quantidade salta por cima do limite e oscila.'],
        // funktionsklassen: cells that begin with <b>
        ['<b>Polstellen</b> mit senkrechten Asymptoten, oft eine waagerechte Asymptote', '<b>polos</b> com assíntotas verticais, muitas vezes uma assíntota horizontal'],
        ['<b>periodisch</b>: Periode $2\\pi$ bei Sinus und Kosinus, $\\pi$ beim Tangens', '<b>periódica</b>: período $2\\pi$ no seno e no cosseno, $\\pi$ na tangente'],
        // verkettung (data)
        ['Unter der Wurzel darf keine negative Zahl stehen.', 'Debaixo da raiz não pode haver um número negativo.'], ['Ein Nenner darf nicht null werden.', 'Um denominador não pode ser zero.'],
        // expanwendung: the questions in the Portuguese word order ("Quando é que o capital chega a 3000 €?")
        ['Wann ist das Kapital auf', 'Quando é que o capital chega a'], ['Wann ist der Anteil auf', 'Quando é que a percentagem desce para'],
        ['Wann sind nur noch', 'Quando é que restam apenas'], ['Wann sind es', 'Quando é que são'], [' übrig?', '?'],
        // book pt-20 mathegy10-pt:
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-9 mathegy11-pt:
        // book pt-19 mathe10-pt:
        // book pt-20 mathegy10-pt:
    ]
});
