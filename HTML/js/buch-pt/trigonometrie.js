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
        // book pt-19 mathe10-pt:
        // book pt-20 mathegy10-pt:
        // titelbildgy10
        'Titelbild: eine Sinuswelle, eine Exponentialkurve, ein allgemeines Dreieck mit Umkreis und eine Zahlenfolge, die sich ihrem Grenzwert nähert':
            'Capa: uma sinusoide, uma curva exponencial, um triângulo qualquer com a circunferência circunscrita e uma sucessão que se aproxima do seu limite',
        // the helpers of the module (Geo, messkurve data), reported for every page that loads it
        'Geometrische Figur': 'Figura geométrica', 'Dreieck': 'Triângulo',
        'Ebbe und Flut': 'Marés', 'Riesenrad': 'Roda gigante', 'EKG': 'ECG', 'Sonnenflecken': 'Manchas solares',
        'Marker auf zwei Hochpunkte': 'Marcadores em dois máximos', 'Messkurve mit zwei verschiebbaren Markern': 'Curva de medições com dois marcadores deslocáveis',
        't in h': 't em h', 't in min': 't em min', 't in s': 't em s',
        'Wasserstand in m': 'Nível da água em m', 'Höhe in m': 'Altura em m', 'Spannung in mV': 'Tensão em mV', 'Jahr': 'Ano', 'Fleckenzahl': 'Número de manchas', 'Jahre': 'anos',
        'Wasserstand an einem Pegel an der Nordsee, bezogen auf das mittlere Niveau (vereinfachte Werte).':
            'Nível da água num marégrafo do mar do Norte, em relação ao nível médio (valores simplificados).',
        'Höhe einer Gondel über dem Boden: Das Rad hat 50 m Durchmesser, die Achse liegt 27 m hoch, eine Umdrehung dauert 20 Minuten.':
            'Altura de uma cabine acima do solo: a roda tem 50 m de diâmetro, o eixo está a 27 m de altura, uma volta demora 20 minutos.',
        'Ein Elektrokardiogramm zeichnet die elektrische Spannung am Herzen auf (vereinfachte Kurve). Periodisch, aber keine Sinuskurve.':
            'Um eletrocardiograma regista a tensão elétrica no coração (curva simplificada). Periódica, mas não é uma sinusoide.',
        'Monatsmittel der Sonnenflecken als geglättetes Modell mit dem Zyklus von etwa 11 Jahren (vereinfachte Werte, nicht die Messreihe).':
            'Média mensal das manchas solares como modelo suavizado com o ciclo de cerca de 11 anos (valores simplificados, não a série de medições).',
        'Mittellage': 'linha média',
        // sinussatz, kosinussatz
        'Höhe $h_c$': 'Altura $h_c$', 'Umkreis': 'Circunscrita', 'Hilfslinie': 'Linha auxiliar', 'Dreieck mit verschiebbaren Ecken': 'Triângulo com vértices deslocáveis',
        'Dreieck mit Quadraten über den drei Seiten': 'Triângulo com quadrados construídos sobre os três lados',
        // dreieckloeser: S = side (lado), W = angle (ângulo), as the criteria LLL, LAL, ALA, LLA of js/buch-pt/gy6.js
        'SSS': 'LLL', 'SWS': 'LAL', 'WSW': 'ALA', 'SSW': 'LLA', 'Gegeben': 'Dados', 'Das berechnete Dreieck': 'O triângulo calculado',
        'Kosinussatz': 'Lei dos cossenos', 'Sinussatz': 'Lei dos senos', 'Winkelsumme': 'Soma dos ângulos',
        'KOSINUSSATZ': 'LEI DOS COSSENOS', 'SINUSSATZ': 'LEI DOS SENOS', 'WINKELSUMME': 'SOMA DOS ÂNGULOS',
        'Seite $a$': 'Lado $a$', 'Seite $b$': 'Lado $b$', 'Seite $c$': 'Lado $c$', 'Winkel $\\alpha$': 'Ângulo $\\alpha$', 'Winkel $\\beta$': 'Ângulo $\\beta$',
        'Winkel $\\alpha$ (gegenüber von $a$)': 'Ângulo $\\alpha$ (oposto a $a$)',
        'Kein Dreieck: Jede Seite muss kürzer sein als die beiden anderen zusammen (Dreiecksungleichung).':
            'Não há triângulo: cada lado tem de ser menor do que a soma dos outros dois (desigualdade triangular).',
        '$\\sin\\beta > 1$ ist unmöglich: Die Seite $a$ ist zu kurz, sie erreicht die andere Schenkellinie gar nicht. <b>Kein Dreieck.</b>':
            '$\\operatorname{sen}\\beta > 1$ é impossível: o lado $a$ é demasiado curto, nem sequer chega ao outro lado do ângulo. <b>Não há triângulo.</b>',
        // dreiecksflaeche
        'eingeschlossener Winkel $\\gamma$': 'Ângulo formado $\\gamma$', 'Dreieck aus zwei Seiten und dem eingeschlossenen Winkel': 'Triângulo definido por dois lados e o ângulo por eles formado',
        // tangensfunktion
        'Einheitskreis mit Tangente an der Stelle 1': 'Círculo trigonométrico com a reta tangente no ponto de abcissa 1', 'Graph der Tangensfunktion mit Polstellen': 'Gráfico da função tangente com polos',
        // pyramidekegel: the same words as pt-18 (and as js/buch-pt/geometrie.js, which these pages do not load)
        'Kegel': 'Cone', 'Höhe – Seitenhöhe': 'Altura – apótema', 'Höhe – Seitenkante': 'Altura – aresta lateral', 'Höhe – Mantellinie': 'Altura – geratriz',
        'Rechtwinkliges Dreieck': 'Triângulo retângulo', 'Körper': 'Sólido', 'Grundkante $a$': 'Aresta da base $a$', 'Radius $r$': 'Raio $r$', 'Höhe $h$': 'Altura $h$',
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs trigonometrie/*)
        // book pt-18 mathe9-pt:
        // book pt-19 mathe10-pt:
        // book pt-20 mathegy10-pt:
        // messkurve
        ['Abstand der Marker: <b>$', 'Distância entre os marcadores: <b>$'],
        ['</b> · Liegen beide Marker auf benachbarten Hochpunkten, ist das die <b>Periode</b>.', '</b> · Se os dois marcadores estiverem em máximos vizinhos, esta distância é o <b>período</b>.'],
        ['Größter Wert $', 'Valor máximo $'], ['$, kleinster Wert $', '$, valor mínimo $'],
        // sinussatz (after the sen rule below)
        ['Die Höhe aus zwei Richtungen: $h_c = b \\cdot \\operatorname{sen}\\alpha = ', 'A altura calculada de dois lados: $h_c = b \\cdot \\operatorname{sen}\\alpha = '],
        ['$ und $h_c = a \\cdot \\operatorname{sen}\\beta \\approx ', '$ e $h_c = a \\cdot \\operatorname{sen}\\beta \\approx '],
        ['$. Gleichsetzen und teilen ergibt $\\tfrac{a}{\\operatorname{sen}\\alpha} = \\tfrac{b}{\\operatorname{sen}\\beta}$.', '$. Igualando e dividindo obtém-se $\\tfrac{a}{\\operatorname{sen}\\alpha} = \\tfrac{b}{\\operatorname{sen}\\beta}$.'],
        ['Alle drei Quotienten sind so groß wie der <b>Durchmesser des Umkreises</b>: $2r = ', 'Os três quocientes são iguais ao <b>diâmetro da circunferência circunscrita</b>: $2r = '],
        // kosinussatz
        ['$\\gamma = 90^\\circ$: Der Korrekturterm ist null, es bleibt der <b>Satz des Pythagoras</b> $c^2 = a^2 + b^2$.', '$\\gamma = 90^\\circ$: o termo de correção é zero e fica o <b>teorema de Pitágoras</b> $c^2 = a^2 + b^2$.'],
        ['$\\gamma < 90^\\circ$: $\\cos\\gamma > 0$, das Quadrat über $c$ ist <b>kleiner</b> als die beiden anderen zusammen.', '$\\gamma < 90^\\circ$: $\\cos\\gamma > 0$, o quadrado sobre $c$ é <b>menor</b> do que os outros dois juntos.'],
        ['$\\gamma > 90^\\circ$: $\\cos\\gamma < 0$, das Quadrat über $c$ ist <b>größer</b> als die beiden anderen zusammen.', '$\\gamma > 90^\\circ$: $\\cos\\gamma < 0$, o quadrado sobre $c$ é <b>maior</b> do que os outros dois juntos.'],
        [' Zieh $C$, bis der Winkel genau $90^\\circ$ hat.', ' Puxa $C$ até o ângulo ter exatamente $90^\\circ$.'],
        // dreieckloeser
        ['Gegeben: ', 'Dados: '], ['drei Seiten', 'três lados'], ['zwei Seiten und der eingeschlossene Winkel', 'dois lados e o ângulo por eles formado'],
        ['eine Seite und die beiden anliegenden Winkel', 'um lado e os dois ângulos adjacentes'], ['zwei Seiten und ein Winkel, der einer der Seiten gegenüberliegt', 'dois lados e um ângulo oposto a um desses lados'],
        ['. Die Bezeichnungen sind die üblichen: $a$ liegt $A$ gegenüber, $\\alpha$ liegt bei $A$.', '. As designações são as habituais: $a$ é o lado oposto a $A$, $\\alpha$ é o ângulo em $A$.'],
        ['Kein Dreieck: Die beiden Winkel sind zusammen schon $', 'Não há triângulo: os dois ângulos juntos já somam $'], ['^\\circ$, für $\\gamma$ bleibt nichts übrig.', '^\\circ$, não sobra nada para $\\gamma$.'],
        ['\\text{ zu groß, }', '\\text{ demasiado grande, }'],
        ['<b>Zwei Dreiecke</b> passen zu den Angaben: Die Seite $a$ schneidet die Schenkellinie zweimal. Das ist der mehrdeutige Fall von SSW (der gegebene Winkel liegt der <b>kürzeren</b> Seite gegenüber).',
            '<b>Dois triângulos</b> satisfazem os dados: o lado $a$ interseta duas vezes o outro lado do ângulo. É o caso ambíguo de LLA (o ângulo dado é oposto ao lado <b>menor</b>).'],
        ['Genau <b>ein</b> Dreieck: Der Winkel liegt der <b>längeren</b> (oder gleich langen) Seite gegenüber, dann ist SSW eindeutig.',
            'Exatamente <b>um</b> triângulo: o ângulo é oposto ao lado <b>maior</b> (ou de igual comprimento), e então LLA tem solução única.'],
        ['Genau <b>ein</b> Dreieck: Hier berührt $a$ die Schenkellinie nur, das Dreieck ist rechtwinklig.', 'Exatamente <b>um</b> triângulo: aqui $a$ apenas toca o outro lado do ângulo, o triângulo é retângulo.'],
        // dreiecksflaeche
        ['Höhe $h = b \\cdot \\operatorname{sen}\\gamma = ', 'Altura $h = b \\cdot \\operatorname{sen}\\gamma = '], ['$ Flächeneinheiten', '$ unidades de área'],
        [' · Bei $90^\\circ$ ist die Fläche am größten.', ' · Com $90^\\circ$ a área é máxima.'], [' · Derselbe Flächeninhalt bei $', ' · A mesma área com $'],
        ['^\\circ$, denn $\\operatorname{sen}(180^\\circ - \\gamma) = \\operatorname{sen}\\gamma$.', '^\\circ$, porque $\\operatorname{sen}(180^\\circ - \\gamma) = \\operatorname{sen}\\gamma$.'],
        // tangensfunktion (after the tg rule below)
        ['$: Hier ist $\\cos\\alpha = 0$. Der Radius läuft parallel zur Tangente, $\\operatorname{tg}\\alpha$ ist <b>nicht definiert</b>. Der Graph hat eine <b>Polstelle</b>.',
            '$: aqui $\\cos\\alpha = 0$. O raio é paralelo à reta tangente, $\\operatorname{tg}\\alpha$ <b>não está definida</b>. O gráfico tem um <b>polo</b>.'],
        ['$ · Am Kreis: die Länge des Abschnitts auf der Tangente bei $x = 1$', '$ · Na circunferência: o comprimento do segmento sobre a reta tangente em $x = 1$'],
        [' (nach unten, also negativ)', ' (para baixo, portanto negativo)'],
        // pyramidekegel: the pieces of pt-18 (keys without a product, identical), the two product pieces as they arrive here
        // (these pages do not load js/buch-pt/geometrie.js, so \cdot stays \cdot), and the cone pieces of geometrie.js
        ['Schrägbild einer quadratischen Pyramide', 'Pirâmide quadrangular regular em perspetiva cavaleira'], ['Schrägbild eines Kegels', 'Cone em perspetiva cavaleira'],
        [' mit einem rechtwinkligen Dreieck', ', com um triângulo retângulo'],
        ['Seitenhöhe $h_s = ', 'Apótema $a_p = '], ['Neigungswinkel der Seitenfläche:', 'Ângulo de inclinação da face lateral:'],
        ['Neigungswinkel der Seitenkante:', 'Ângulo de inclinação da aresta lateral:'], ['Mantellinie $s = ', 'Geratriz $g = '],
        ['Volumen $V = \\tfrac13 ', 'Volume $V = \\tfrac13 '], ['· Oberfläche ', '· área total '], ['· Mantel ', '· superfície lateral '],
        ['$O = a^2 + 4 \\cdot \\tfrac12 a h_s = a^2 + 2a\\,h_s \\approx ', '$A_T = a^2 + 4 \\cdot \\tfrac12 a\\,a_p = a^2 + 2a\\,a_p \\approx '],
        ['halber Öffnungswinkel:', 'Semiângulo de abertura:'], ['$ · Öffnungswinkel $2', '$ · ângulo de abertura $2'],
        ['$M = \\pi r s \\approx ', '$A_L = \\pi r g \\approx '], ['$O = \\pi r^2 + \\pi r s \\approx ', '$A_T = \\pi r^2 + \\pi r g \\approx '],
        // pyramidekegel: the body button (js/buch-pt/geometrie.js turns it with a rule into the same words; gy7.js is not loaded here)
        ['Quadratische Pyramide', 'Pirâmide quadrangular regular'],
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-18 mathe9-pt:
        // book pt-19 mathe10-pt:
        // book pt-20 mathegy10-pt:
        // sine and tangent as Portuguese schools write them, sen and tg (the same rules as js/buch-pt/geometrie.js pt-13 and the sen rule
        // of js/buch-pt/funktionen.js pt-1; \operatorname{sen} and \operatorname{tg} contain no \sin or \tan, so a page with both is not changed twice):
        // sinussatz, dreiecksflaeche, dreieckloeser, tangensfunktion, pyramidekegel
        [/\\sin(?![a-zA-Z])/g, '\\operatorname{sen}'], [/\\tan(?![a-zA-Z])/g, '\\operatorname{tg}'],
        // messkurve: the unit after the distance of the markers ("$11,0$ Jahre</b>")
        [/\$ Jahre<\/b>/g, '$ anos</b>'],
        // pyramidekegel: the two rules of pt-18, word for word (the merge keeps one copy)
        [/Seitenkante \$s = (\\sqrt\{h\^2 \+ \\left\(\\tfrac\{d\}\{2\}\\right\)\^2\})\$ mit der Diagonale \$d = a\\sqrt2 \\approx ([^$]*)\$: \$s \\approx /g,
            (m, f, d) => 'Aresta lateral $\\ell = ' + f + '$, com a diagonal $d = a\\sqrt2 \\approx ' + d + '$: $\\ell \\approx '],
        [/<svg viewBox="0 0 520 330" role="img" aria-label="Schrägbild (einer quadratischen Pyramide|eines Kegels) mit einem rechtwinkligen Dreieck">[\s\S]*?<\/svg>/g,
            (m, k) => m.replace(/>hₐ</g, '>aₚ<').replace(/>s<\/text>/g, k === 'eines Kegels' ? '>g</text>' : '>ℓ</text>')],
    ]
});
