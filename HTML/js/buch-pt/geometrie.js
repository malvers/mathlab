/* js/buch-pt/geometrie.js — Portuguese for the widgets of js/buch-geometrie.js.
 * Loaded by the Portuguese editions right after js/buch-geometrie.js; the engine and the shared words are in js/buch-pt.js.
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
window.BuchPT && BuchPT.add('geometrie', {
    word: {
        // pt0: the helpers of the module (outside every widget; check.mjs geometrie/*)
        // book pt-10 mathegy6-pt:
        // book pt-11 mathegy7-pt:
        // book pt-12 mathegy8-pt:
        // book pt-13 mathegy9-pt:
        // titelbildgy9 (the cover of GY 9)
        'Titelbild: rechtwinkliges Dreieck mit den Quadraten über seinen Seiten, ein goldenes Rechteck mit Spirale, ein Kreis zwischen zwei Sechsecken und eine Parabel':
            'Capa: um triângulo retângulo com os quadrados construídos sobre os seus lados, um retângulo de ouro com uma espiral, um círculo entre dois hexágonos e uma parábola',
        // kreisteil (chapter 2): the arc length is ℓ and the perimeter P (German b, u; the phrases below)
        'Radius $r$': 'Raio $r$', 'Mittelpunktswinkel $\\alpha$': 'Ângulo ao centro $\\alpha$', 'Kreis mit Kreisausschnitt und Kreisbogen': 'Círculo com um setor circular e um arco',
        'Kreisbogen': 'Arco', 'Kreisausschnitt': 'Setor circular',
        // pythagoras (chapter 3.1): teorema da altura, teorema do cateto, projeções p, q; the area labels with × (whole SVG labels)
        'Pythagoras': 'Pitágoras', 'Kathetensatz': 'Teorema do cateto', 'Höhensatz': 'Teorema da altura', 'Satz': 'Teorema', 'gleichschenklig': 'isósceles',
        'c·q': 'c×q', 'c·p': 'c×p', 'p·q': 'p×q',
        'Zieh am Punkt $C$. Er bleibt auf dem Thaleskreis über $\\overline{AB}$, deshalb ist der Winkel bei $C$ immer ein rechter.':
            'Arrasta o ponto $C$. Ele fica sobre a semicircunferência de diâmetro $[AB]$; por isso, o ângulo em $C$ é sempre reto.',
        'Rechtwinkliges Dreieck mit Quadraten über den Seiten': 'Triângulo retângulo com quadrados construídos sobre os lados',
        'Die beiden Kathetenquadrate haben zusammen genau den Flächeninhalt des Hypotenusenquadrats.':
            'Os dois quadrados dos catetos têm, juntos, exatamente a área do quadrado da hipotenusa.',
        'Jedes Kathetenquadrat ist so groß wie das Rechteck darunter.': 'Cada quadrado de um cateto tem a mesma área que o retângulo por baixo dele.',
        'Das Höhenquadrat ist so groß wie das Rechteck aus den beiden Hypotenusenabschnitten.': 'O quadrado da altura tem a mesma área que o retângulo formado pelas duas projeções.',
        // trigo (chapter 3.2): cateto oposto, cateto adjacente, hipotenusa; sen and tg (the rules below)
        'Sinus': 'Seno', 'Kosinus': 'Cosseno', 'Tangens': 'Tangente', 'Verhältnis': 'Razão', 'Winkel $\\alpha$': 'Ângulo $\\alpha$', 'Hypotenuse $c$': 'Hipotenusa $c$',
        'Gegenkathete a': 'cateto oposto a', 'Ankathete b': 'cateto adjacente b', 'Hypotenuse c': 'hipotenusa c',
        'Rechtwinkliges Dreieck mit Winkel alpha': 'Triângulo retângulo com o ângulo alfa',
        'Ändere $c$: Das Dreieck wird größer oder kleiner, die drei Verhältnisse bleiben gleich. Sie hängen nur vom Winkel ab.':
            'Altera $c$: o triângulo fica maior ou mais pequeno, mas as três razões ficam iguais. Só dependem do ângulo.',
        // vieleck (chapter 3.2): the perimeter is P
        'Ecken verdoppeln': 'Duplicar os vértices', 'Zurück auf 6': 'Voltar a 6', 'Anzahl der Ecken $n$': 'Número de vértices $n$',
        'Kreis mit einbeschriebenem und umbeschriebenem Vieleck': 'Circunferência com um polígono inscrito e um polígono circunscrito', 'innen': 'inscrito', 'außen': 'circunscrito',
        'Kreis mit $r = 1$, also $u = 2\\pi$. Umfang durch $2$:': 'Circunferência com $r = 1$, portanto $P = 2\\pi$. Perímetro a dividir por $2$:',
        // spitzkoerper (chapter 3.3): base area A_b, lateral area A_L, total area A_T, apótema a_p, aresta lateral ℓ, geratriz g
        // (as pt-1 writes the koerper widget of js/buch-gleichungen.js; the formulas are phrases, the picture labels a rule below)
        // the body button "Quadratische Pyramide" is a rule below (gy7.js has the word "Pirâmide quadrangular" for its 3D stage)
        'Kreiskegel': 'Cone', 'Körper': 'Sólido', 'Seitenhöhe': 'Apótema',
        'Seitenkante': 'Aresta lateral', 'Hilfsdreieck': 'Triângulo auxiliar', 'Grundkante $a$': 'Aresta da base $a$', 'Höhe $h$': 'Altura $h$',
        'Quadratische Pyramide im Schrägbild mit Hilfsdreieck': 'Pirâmide quadrangular regular em perspetiva cavaleira, com o triângulo auxiliar',
        'Kreiskegel im Schrägbild mit Hilfsdreieck': 'Cone em perspetiva cavaleira, com o triângulo auxiliar',
        // goldenerschnitt (chapter O): secção áurea, número de ouro Φ; the side of the pentagon is l, as in chapter 3.2
        'Ansicht': 'Vista', 'Strecke teilen': 'Dividir um segmento', 'Goldenes Rechteck': 'Retângulo de ouro', 'Pentagramm': 'Pentagrama',
        'Golden teilen': 'Dividir na secção áurea', 'Quadrate abschneiden': 'Cortar quadrados',
        'Ganzes : größerer Teil': 'todo : parte maior', 'größerer : kleinerer Teil': 'parte maior : parte menor',
        'Strecke AB mit Teilungspunkt T': 'Segmento [AB] com o ponto de divisão T',
        'Beide Verhältnisse sind gleich: goldener Schnitt, $\\Phi = \\tfrac{1 + \\sqrt{5}}{2} \\approx 1{,}618$.':
            'As duas razões são iguais: secção áurea, $\\Phi = \\tfrac{1 + \\sqrt{5}}{2} \\approx 1{,}618$.',
        'Zieh den Punkt $T$, bis beide Verhältnisse gleich sind.': 'Arrasta o ponto $T$ até as duas razões serem iguais.',
        'Goldenes Rechteck, in Quadrate zerlegt, mit Spirale': 'Retângulo de ouro decomposto em quadrados, com a espiral',
        'Seiten $1{,}618 : 1$. Schneidet man das Quadrat über der kurzen Seite ab, bleibt wieder ein goldenes Rechteck übrig, um den Faktor $\\Phi$ verkleinert.':
            'Lados $1{,}618 : 1$. Cortando o quadrado construído sobre o lado menor, fica outra vez um retângulo de ouro, reduzido pelo fator $\\Phi$.',
        'Regelmäßiges Fünfeck mit Pentagramm': 'Pentágono regular com o pentagrama', 'Seite': 'Lado',
        'größerer Teil': 'parte maior', 'kleinerer Teil': 'parte menor',
        // book pt-14 mathe5-pt:
        // book pt-15 mathe6-pt:
        // book pt-16 mathe7-pt:
        // book pt-17 mathe8-pt:
        // book pt-18 mathe9-pt:
        // book pt-19 mathe10-pt:
    },
    phrase: [
        // pt0: the helpers of the module (outside every widget; check.mjs geometrie/*)
        // book pt-10 mathegy6-pt:
        // book pt-11 mathegy7-pt:
        // book pt-12 mathegy8-pt:
        // book pt-13 mathegy9-pt:
        // kreisteil (the product is \times already: the pt0 rule runs before the phrases)
        ['Anteil am Vollkreis: $', 'Parte do círculo completo: $'],
        [' $b = \\tfrac{\\alpha}{360^\\circ} \\times 2\\pi r', ' $\\ell = \\tfrac{\\alpha}{360^\\circ} \\times 2\\pi r'],
        ['Zieh am Ende des Bogens. Zum Vergleich der ganze Kreis: $u \\approx ', 'Arrasta a extremidade do arco. Para comparar, o círculo inteiro: $P \\approx '],
        // pythagoras: "$a^2 \approx 9$ und $c \times p \approx …" (the products are \times already)
        ['$ und $c \\times p \\approx ', '$ e $c \\times p \\approx '], ['$ und $c \\times q \\approx ', '$ e $c \\times q \\approx '], ['$ und $p \\times q \\approx ', '$ e $p \\times q \\approx '],
        // trigo: the words in the fractions
        ['\\text{Gegenkathete}', '\\text{cateto oposto}'], ['\\text{Ankathete}', '\\text{cateto adjacente}'], ['\\text{Hypotenuse}', '\\text{hipotenusa}'],
        // vieleck: "Also $3{,}1… < \pi < 3{,}2…$, Abstand $…$"
        ['Also $', 'Portanto, $'], ['$, Abstand $', '$, diferença $'],
        // spitzkoerper: the formulas with the Portuguese letters (the product is \times already)
        ['$h_s = \\sqrt{h^2 + \\left(\\tfrac{a}{2}\\right)^2} \\approx ', '$a_p = \\sqrt{h^2 + \\left(\\tfrac{a}{2}\\right)^2} \\approx '],
        ['$s = \\sqrt{h^2 + \\left(\\tfrac{d}{2}\\right)^2} = \\sqrt{h^2 + \\tfrac{a^2}{2}} \\approx ', '$\\ell = \\sqrt{h^2 + \\left(\\tfrac{d}{2}\\right)^2} = \\sqrt{h^2 + \\tfrac{a^2}{2}} \\approx '],
        ['$G = a^2 = ', '$A_b = a^2 = '], ['$M = 4 \\times \\tfrac12 a\\,h_s \\approx ', '$A_L = 4 \\times \\tfrac12 a\\,a_p \\approx '],
        ['$O = G + M \\approx ', '$A_T = A_b + A_L \\approx '], ['$V = \\tfrac13\\,G\\,h \\approx ', '$V = \\tfrac13\\,A_b\\,h \\approx '],
        // goldenerschnitt
        ['$\\overline{AB} = 10$ · größerer Teil $', '$\\overline{AB} = 10$ · parte maior $'], ['$ · kleinerer Teil $', '$ · parte menor $'],
        ['\\text{Ganzes}', '\\text{todo}'], ['\\text{größerer Teil}', '\\text{parte maior}'], ['\\text{kleinerer Teil}', '\\text{parte menor}'],
        [' $s$ und Diagonale $d$ des regelmäßigen Fünfecks: $\\tfrac{d}{s} = \\Phi', ' $l$ e diagonal $d$ do pentágono regular: $\\tfrac{d}{l} = \\Phi'],
        ['Jede Diagonale wird von einer anderen im goldenen Schnitt geteilt: ', 'Cada diagonal é dividida por outra na secção áurea: '],
        ['$= \\Phi$, und der größere Teil ist genau so lang wie die Seite.', '$= \\Phi$, e a parte maior tem exatamente o comprimento do lado.'],
        ['$ so lang. Die Viertelkreise bilden die <b>goldene Spirale</b>.', '$ do comprimento inicial. Os quartos de círculo formam a <b>espiral de ouro</b>.'],
        ['$s = \\sqrt{r^2 + h^2} \\approx ', '$g = \\sqrt{r^2 + h^2} \\approx '], ['$G = \\pi r^2 \\approx ', '$A_b = \\pi r^2 \\approx '],
        ['$M = \\pi r s \\approx ', '$A_L = \\pi r g \\approx '], ['$O = \\pi r^2 + \\pi r s \\approx ', '$A_T = \\pi r^2 + \\pi r g \\approx '],
        // book pt-14 mathe5-pt:
        // book pt-15 mathe6-pt:
        // book pt-16 mathe7-pt:
        // book pt-17 mathe8-pt:
        // book pt-18 mathe9-pt:
        // book pt-19 mathe10-pt:
    ],
    rule: [
        // pt0: notation of the module, for every book
        // Portuguese school notation in the formulas the widgets write (Doc, 26.10.2026: always the local conventions), on every
        // page that loads this module (the Gymnasium 5-9 and Oberschule editions): × for the product, as in the 2.º ciclo;
        // a phrase key that contains a product must therefore be written with \times
        [/\\cdot(?![a-zA-Z])/g, '\\times'],
        // book pt-10 mathegy6-pt:
        // book pt-11 mathegy7-pt:
        // book pt-12 mathegy8-pt:
        // book pt-13 mathegy9-pt:
        // trigo, vieleck: sine and tangent as Portuguese schools write them, sen and tg (as the pt-1 sen rule of funktionen.js;
        // \operatorname{sen} and \operatorname{tg} contain no \sin or \tan, so a page that loads both modules is not changed twice)
        [/\\sin(?![a-zA-Z])/g, '\\operatorname{sen}'], [/\\tan(?![a-zA-Z])/g, '\\operatorname{tg}'],
        // spitzkoerper, the labels in its own picture (only this SVG): hₛ → aₚ (apótema), s → ℓ (aresta lateral) or g (geratriz)
        [/<svg viewBox="0 0 360 290" role="img" aria-label="(Quadratische Pyramide|Kreiskegel) im Schrägbild mit Hilfsdreieck">[\s\S]*?<\/svg>/g,
            (m, k) => m.replace(/>hₛ</g, '>aₚ<').replace(/>s<\/text>/g, k === 'Kreiskegel' ? '>g</text>' : '>ℓ</text>')],
        // spitzkoerper, the body button: «Pirâmide quadrangular regular», tied to the button so that gy7.js keeps its word
        // «Pirâmide quadrangular» for the GY 7 solids (one word per German string; merge buch7, 27.11.2026)
        [/(<button type="button" data-v="pyr">)Quadratische Pyramide(?=<\/button>)/g, '$1Pirâmide quadrangular regular'],
        // goldenerschnitt, the golden rectangle: "Nach 3 Schnitten ist die lange Seite nur noch $…$ so lang." (only this sentence)
        [/Nach (\d+) Schnitt(?:en)? ist die lange Seite nur noch \$/g, (m, n) => 'Ao fim de ' + n + (n === '1' ? ' corte' : ' cortes') + ', o lado maior mede apenas $'],
        // book pt-14 mathe5-pt:
        // book pt-15 mathe6-pt:
        // book pt-16 mathe7-pt:
        // book pt-17 mathe8-pt:
        // book pt-18 mathe9-pt:
        // book pt-19 mathe10-pt:
    ]
});
