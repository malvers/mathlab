/* js/buch-pt/trigonometrie.js — Portuguese for the widgets of js/buch-trigonometrie.js.
 * Loaded by the Portuguese editions right after js/buch-trigonometrie.js; the engine and the shared words are in js/buch-pt.js.
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
window.BuchPT && BuchPT.add('trigonometrie', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs trigonometrie/*)
        // book pt-18 mathe9-pt:
        // pyramidekegel (chapters 2.1, 2.2 of OS 9): apótema a_p, aresta lateral ℓ, geratriz g, A_b, A_L, A_T as in js/buch-pt/geometrie.js pt-13
        // (spitzkoerper); "Grundkante $a$", "Radius $r$", "Höhe $h$", "Körper" are words there, the button "Quadratische Pyramide" a rule there
        'Höhe – Seitenhöhe': 'Altura – apótema', 'Höhe – Seitenkante': 'Altura – aresta lateral', 'Höhe – Mantellinie': 'Altura – geratriz',
        'Rechtwinkliges Dreieck': 'Triângulo retângulo',
        // book pt-19 mathe10-pt:
        // the helpers of the module (Geo, messkurve data), reported for every page that loads it
        'Geometrische Figur': 'Figura geométrica', 'Dreieck': 'Triângulo',
        'Ebbe und Flut': 'Marés', 'Riesenrad': 'Roda-gigante', 'EKG': 'ECG', 'Sonnenflecken': 'Manchas solares',
        'Marker auf zwei Hochpunkte': 'Marcadores em dois máximos', 'Messkurve mit zwei verschiebbaren Markern': 'Curva de medições com dois marcadores que podes arrastar',
        't in h': 't em h', 't in min': 't em min', 't in s': 't em s',
        'Wasserstand in m': 'Nível da água em m', 'Höhe in m': 'Altura em m', 'Spannung in mV': 'Tensão em mV', 'Jahr': 'Ano', 'Fleckenzahl': 'Número de manchas',
        'Wasserstand an einem Pegel an der Nordsee, bezogen auf das mittlere Niveau (vereinfachte Werte).':
            'Nível da água numa escala de marés do mar do Norte, em relação ao nível médio (valores simplificados).',
        'Höhe einer Gondel über dem Boden: Das Rad hat 50 m Durchmesser, die Achse liegt 27 m hoch, eine Umdrehung dauert 20 Minuten.':
            'Altura de uma cabina acima do chão: a roda tem 50 m de diâmetro, o eixo está a 27 m de altura e uma volta demora 20 minutos.',
        'Ein Elektrokardiogramm zeichnet die elektrische Spannung am Herzen auf (vereinfachte Kurve). Periodisch, aber keine Sinuskurve.':
            'Um eletrocardiograma regista a tensão elétrica do coração (curva simplificada). É periódica, mas não é uma sinusoide.',
        'Monatsmittel der Sonnenflecken als geglättetes Modell mit dem Zyklus von etwa 11 Jahren (vereinfachte Werte, nicht die Messreihe).':
            'Média mensal das manchas solares como modelo suavizado, com o ciclo de cerca de 11 anos (valores simplificados, não a série de medições).',
        'Mittellage': 'linha média',
        // sinussatz, kosinussatz ('Umkreis' as gy7 writes it, Circunscrita)
        'Höhe $h_c$': 'Altura $h_c$', 'Umkreis': 'Circunscrita', 'Hilfslinie': 'Linha auxiliar', 'Dreieck mit verschiebbaren Ecken': 'Triângulo com vértices que podes arrastar',
        'Dreieck mit Quadraten über den drei Seiten': 'Triângulo com quadrados construídos sobre os três lados',
        // dreieckloeser: S = side (lado), W = angle (ângulo) - the Portuguese criteria LLL, LAL, ALA, LLA as in gy6
        'SSS': 'LLL', 'SWS': 'LAL', 'WSW': 'ALA', 'SSW': 'LLA', 'Gegeben': 'Dados', 'Das berechnete Dreieck': 'O triângulo calculado',
        'Kosinussatz': 'Lei dos cossenos', 'Sinussatz': 'Lei dos senos', 'Winkelsumme': 'Soma dos ângulos',
        'KOSINUSSATZ': 'LEI DOS COSSENOS', 'SINUSSATZ': 'LEI DOS SENOS', 'WINKELSUMME': 'SOMA DOS ÂNGULOS',
        'Seite $a$': 'Lado $a$', 'Seite $b$': 'Lado $b$', 'Seite $c$': 'Lado $c$', 'Winkel $\\alpha$': 'Ângulo $\\alpha$', 'Winkel $\\beta$': 'Ângulo $\\beta$',
        'Winkel $\\alpha$ (gegenüber von $a$)': 'Ângulo $\\alpha$ (oposto a $a$)',
        // dreiecksflaeche
        'eingeschlossener Winkel $\\gamma$': 'Ângulo entre os lados $\\gamma$', 'Dreieck aus zwei Seiten und dem eingeschlossenen Winkel': 'Triângulo definido por dois lados e o ângulo por eles formado',
        // book pt-20 mathegy10-pt:
        // titelbildgy10
        'Titelbild: eine Sinuswelle, eine Exponentialkurve, ein allgemeines Dreieck mit Umkreis und eine Zahlenfolge, die sich ihrem Grenzwert nähert':
            'Capa: uma sinusoide, uma curva exponencial, um triângulo qualquer com a circunferência circunscrita e uma sucessão que se aproxima do seu limite',
        // the helpers of the module (Geo, messkurve data), sinussatz, kosinussatz, dreieckloeser, dreiecksflaeche: pt-19's above (merge
        // 27.11.2026, one Portuguese per German string); only the unit «anos» is this block's
        'Jahre': 'anos',
        // tangensfunktion
        'Einheitskreis mit Tangente an der Stelle 1': 'Círculo trigonométrico com a reta tangente no ponto de abcissa 1', 'Graph der Tangensfunktion mit Polstellen': 'Gráfico da função tangente com polos',
        // pyramidekegel: the words of js/buch-pt/geometrie.js these pages need (they do not load it; the same Portuguese), the others are
        // pt-18's above; "Kegel" is no word here (pt-18's rule below)
        'Körper': 'Sólido', 'Grundkante $a$': 'Aresta da base $a$', 'Radius $r$': 'Raio $r$', 'Höhe $h$': 'Altura $h$',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs trigonometrie/*)
        // book pt-18 mathe9-pt:
        // pyramidekegel: the pieces after the \cdot → \times and \tan → \operatorname{tg} rules of js/buch-pt/geometrie.js (loaded on these pages);
        // "$M = \pi r s \approx", "$O = \pi r^2 + \pi r s \approx" are pieces of geometrie.js (spitzkoerper)
        ['Schrägbild einer quadratischen Pyramide', 'Pirâmide quadrangular regular em perspetiva cavaleira'], ['Schrägbild eines Kegels', 'Cone em perspetiva cavaleira'],
        [' mit einem rechtwinkligen Dreieck', ', com um triângulo retângulo'],
        ['Seitenhöhe $h_s = ', 'Apótema $a_p = '], ['Neigungswinkel der Seitenfläche:', 'Ângulo de inclinação da face lateral:'],
        ['Neigungswinkel der Seitenkante:', 'Ângulo de inclinação da aresta lateral:'], ['Mantellinie $s = ', 'Geratriz $g = '],
        ['Volumen $V = \\tfrac13 ', 'Volume $V = \\tfrac13 '], ['· Oberfläche ', '· área total '], ['· Mantel ', '· superfície lateral '],
        ['$O = a^2 + 4 \\times \\tfrac12 a h_s = a^2 + 2a\\,h_s \\approx ', '$A_T = a^2 + 4 \\times \\tfrac12 a\\,a_p = a^2 + 2a\\,a_p \\approx '],
        ['halber Öffnungswinkel:', 'Semiângulo de abertura:'], ['$ · Öffnungswinkel $2', '$ · ângulo de abertura $2'],
        // book pt-19 mathe10-pt:
        // messkurve (the extreme values: pt-20's below)
        ['Abstand der Marker: <b>$', 'Distância entre os marcadores: <b>$'],
        ['</b> · Liegen beide Marker auf benachbarten Hochpunkten, ist das die <b>Periode</b>.', '</b> · Se os dois marcadores estiverem em máximos vizinhos, é o <b>período</b>.'],
        // sinussatz: short pieces without the formulas, so they match before and after the \cdot/\sin rules of geometrie.js
        ['Die Höhe aus zwei Richtungen: ', 'A altura calculada de duas maneiras: '], ['$ und $h_c = ', '$ e $h_c = '],
        ['$. Gleichsetzen und teilen ergibt $', '$. Igualando e dividindo, obtém-se $'],
        ['Alle drei Quotienten sind so groß wie der <b>Durchmesser des Umkreises</b>: $2r = ', 'Os três quocientes são iguais ao <b>diâmetro da circunferência circunscrita</b>: $2r = '],
        // kosinussatz
        ['$: Der Korrekturterm ist null, es bleibt der <b>Satz des Pythagoras</b> $c^2 = a^2 + b^2$.', '$: o termo de correção é nulo e fica o <b>teorema de Pitágoras</b> $c^2 = a^2 + b^2$.'],
        [', das Quadrat über $c$ ist <b>kleiner</b> als die beiden anderen zusammen.', ', o quadrado construído sobre $c$ é <b>menor</b> do que os outros dois juntos.'],
        [', das Quadrat über $c$ ist <b>größer</b> als die beiden anderen zusammen.', ', o quadrado construído sobre $c$ é <b>maior</b> do que os outros dois juntos.'],
        [' Zieh $C$, bis der Winkel genau $90^\\circ$ hat.', ' Arrasta $C$ até o ângulo medir exatamente $90^\\circ$.'],
        // dreieckloeser
        ['Gegeben: ', 'Dados: '], ['drei Seiten', 'três lados'], ['zwei Seiten und der eingeschlossene Winkel', 'dois lados e o ângulo por eles formado'],
        ['eine Seite und die beiden anliegenden Winkel', 'um lado e os dois ângulos adjacentes'], ['zwei Seiten und ein Winkel, der einer der Seiten gegenüberliegt', 'dois lados e um ângulo oposto a um deles'],
        ['. Die Bezeichnungen sind die üblichen: $a$ liegt $A$ gegenüber, $\\alpha$ liegt bei $A$.', '. As notações são as habituais: $a$ é o lado oposto a $A$, $\\alpha$ é o ângulo em $A$.'],
        ['Kein Dreieck: Jede Seite muss kürzer sein als die beiden anderen zusammen (Dreiecksungleichung).', 'Não há triângulo: cada lado tem de ser menor do que a soma dos outros dois (desigualdade triangular).'],
        ['Kein Dreieck: Die beiden Winkel sind zusammen schon $', 'Não há triângulo: os dois ângulos já somam $'], ['^\\circ$, für $\\gamma$ bleibt nichts übrig.', '^\\circ$ e não sobra nada para $\\gamma$.'],
        ['\\text{ zu groß, }', '\\text{ demasiado grande, }'],
        [' > 1$ ist unmöglich: Die Seite $a$ ist zu kurz, sie erreicht die andere Schenkellinie gar nicht. <b>Kein Dreieck.</b>', ' > 1$ é impossível: o lado $a$ é demasiado curto e nem chega ao outro lado do ângulo. <b>Não há triângulo.</b>'],
        ['<b>Zwei Dreiecke</b> passen zu den Angaben: Die Seite $a$ schneidet die Schenkellinie zweimal. Das ist der mehrdeutige Fall von SSW (der gegebene Winkel liegt der <b>kürzeren</b> Seite gegenüber).',
            '<b>Dois triângulos</b> correspondem aos dados: o lado $a$ interseta duas vezes o outro lado do ângulo. É o caso ambíguo LLA (o ângulo dado é oposto ao lado <b>menor</b>).'],
        ['Genau <b>ein</b> Dreieck: Der Winkel liegt der <b>längeren</b> (oder gleich langen) Seite gegenüber, dann ist SSW eindeutig.',
            'Exatamente <b>um</b> triângulo: o ângulo é oposto ao lado <b>maior</b> (ou ao lado igual), e então LLA tem uma única solução.'],
        ['Genau <b>ein</b> Dreieck: Hier berührt $a$ die Schenkellinie nur, das Dreieck ist rechtwinklig.', 'Exatamente <b>um</b> triângulo: aqui $a$ apenas toca no outro lado do ângulo e o triângulo é retângulo.'],
        // dreiecksflaeche
        ['Höhe $h = ', 'Altura $h = '], ['$ Flächeneinheiten', '$ unidades de área'],
        [' · Bei $90^\\circ$ ist die Fläche am größten.', ' · Para $90^\\circ$, a área é máxima.'], [' · Derselbe Flächeninhalt bei $', ' · A mesma área para $'],
        ['^\\circ$, denn $', '^\\circ$, porque $'],
        // book pt-20 mathegy10-pt:
        // messkurve: the extreme values, «valor máximo» / «valor mínimo» as the pages of both books say them (the rest is pt-19's above)
        ['Größter Wert $', 'Valor máximo $'], ['$, kleinster Wert $', '$, valor mínimo $'],
        // tangensfunktion (after the tg rule below)
        ['$: Hier ist $\\cos\\alpha = 0$. Der Radius läuft parallel zur Tangente, $\\operatorname{tg}\\alpha$ ist <b>nicht definiert</b>. Der Graph hat eine <b>Polstelle</b>.',
            '$: aqui $\\cos\\alpha = 0$. O raio é paralelo à reta tangente, $\\operatorname{tg}\\alpha$ <b>não está definida</b>. O gráfico tem um <b>polo</b>.'],
        ['$ · Am Kreis: die Länge des Abschnitts auf der Tangente bei $x = 1$', '$ · Na circunferência: o comprimento do segmento sobre a reta tangente em $x = 1$'],
        [' (nach unten, also negativ)', ' (para baixo, portanto negativo)'],
        // pyramidekegel: the product piece as it arrives on these pages (they do not load js/buch-pt/geometrie.js, so \cdot stays \cdot)
        // and the cone pieces of geometrie.js; the other pieces are pt-18's above
        ['$O = a^2 + 4 \\cdot \\tfrac12 a h_s = a^2 + 2a\\,h_s \\approx ', '$A_T = a^2 + 4 \\cdot \\tfrac12 a\\,a_p = a^2 + 2a\\,a_p \\approx '],
        ['$M = \\pi r s \\approx ', '$A_L = \\pi r g \\approx '], ['$O = \\pi r^2 + \\pi r s \\approx ', '$A_T = \\pi r^2 + \\pi r g \\approx '],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-18 mathe9-pt:
        // pyramidekegel, the body buttons: its markup is the same as spitzkoerper's (data-v="pyr", data-v="kegel"), only the second label differs
        // ("Kegel" here, "Kreiskegel" there, a word of geometrie.js that is already parked when the rules run) - so "Kegel" is no word in this
        // module or in os9.js. Where geometrie.js is loaded its rule has already written «Pirâmide quadrangular regular» for both widgets;
        // where it is not (GY 10 lb3-2) the pyramid becomes «Pirâmide quadrangular» as in gy7.js, and spitzkoerper keeps its own form everywhere
        [/(<button type="button" data-v="pyr">)Quadratische Pyramide(?=<\/button><button type="button" data-v="kegel">Kegel<\/button>)/g, '$1Pirâmide quadrangular'],
        [/(<button type="button" data-v="kegel">)Kegel(?=<\/button>)/g, '$1Cone'],
        // pyramidekegel: the side edge ℓ (aresta lateral, German s) with the diagonal d
        [/Seitenkante \$s = (\\sqrt\{h\^2 \+ \\left\(\\tfrac\{d\}\{2\}\\right\)\^2\})\$ mit der Diagonale \$d = a\\sqrt2 \\approx ([^$]*)\$: \$s \\approx /g,
            (m, f, d) => 'Aresta lateral $\\ell = ' + f + '$, com a diagonal $d = a\\sqrt2 \\approx ' + d + '$: $\\ell \\approx '],
        // pyramidekegel, the labels in its own picture (only this SVG): hₐ → aₚ (apótema), s → ℓ (aresta lateral) or g (geratriz)
        [/<svg viewBox="0 0 520 330" role="img" aria-label="Schrägbild (einer quadratischen Pyramide|eines Kegels) mit einem rechtwinkligen Dreieck">[\s\S]*?<\/svg>/g,
            (m, k) => m.replace(/>hₐ</g, '>aₚ<').replace(/>s<\/text>/g, k === 'eines Kegels' ? '>g</text>' : '>ℓ</text>')],
        // book pt-19 mathe10-pt:
        // book pt-20 mathegy10-pt:
        // sine and tangent as Portuguese schools write them, sen and tg (the same rules as js/buch-pt/geometrie.js pt-13 and the sen rule
        // of js/buch-pt/funktionen.js pt-1; \operatorname{sen} and \operatorname{tg} contain no \sin or \tan, so a page with both is not changed twice):
        // sinussatz, dreiecksflaeche, dreieckloeser, tangensfunktion, pyramidekegel
        [/\\sin(?![a-zA-Z])/g, '\\operatorname{sen}'], [/\\tan(?![a-zA-Z])/g, '\\operatorname{tg}'],
        // messkurve: the unit after the distance of the markers ("$11,0$ Jahre</b>")
        [/\$ Jahre<\/b>/g, '$ anos</b>'],
    ]
});
