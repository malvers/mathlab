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
        'KOSINUSSATZ': 'LEI DOS COSSENOS', 'SINUSSATZ': 'LEI DOS SENOS', 'WINKELSUMME': 'SOMA DOS ÂNGULOS',
        'Seite $a$': 'Lado $a$', 'Seite $b$': 'Lado $b$', 'Seite $c$': 'Lado $c$', 'Winkel $\\alpha$': 'Ângulo $\\alpha$', 'Winkel $\\beta$': 'Ângulo $\\beta$',
        'Winkel $\\alpha$ (gegenüber von $a$)': 'Ângulo $\\alpha$ (oposto a $a$)',
        // dreiecksflaeche
        'eingeschlossener Winkel $\\gamma$': 'Ângulo entre os lados $\\gamma$', 'Dreieck aus zwei Seiten und dem eingeschlossenen Winkel': 'Triângulo definido por dois lados e o ângulo por eles formado',
        // book pt-20 mathegy10-pt:
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs trigonometrie/*)
        // book pt-18 mathe9-pt:
        // book pt-19 mathe10-pt:
        // messkurve
        ['Abstand der Marker: <b>$', 'Distância entre os marcadores: <b>$'],
        ['</b> · Liegen beide Marker auf benachbarten Hochpunkten, ist das die <b>Periode</b>.', '</b> · Se os dois marcadores estiverem em máximos vizinhos, é o <b>período</b>.'],
        ['Größter Wert $', 'Maior valor $'], ['$, kleinster Wert $', '$, menor valor $'],
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
    ],
    rule: [
        // pt0: notation of the module, for every book
        // book pt-18 mathe9-pt:
        // book pt-19 mathe10-pt:
        // book pt-20 mathegy10-pt:
    ]
});
