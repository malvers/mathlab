/* js/buch-it/geometrie.js — Italian for the widgets of js/buch-geometrie.js.
 * Loaded by the Italian editions right after js/buch-geometrie.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 3 (20.10.2026): eleven books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/geometrie.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('geometrie', {
    word: {
        // book it-10 mathegy5-it:

        // book it-11 mathegy6-it:

        // book it-12 mathegy7-it:

        // book it-13 mathegy8-it:

        // book it-14 mathegy9-it:
        // titelbildgy9
        'Titelbild: rechtwinkliges Dreieck mit den Quadraten über seinen Seiten, ein goldenes Rechteck mit Spirale, ein Kreis zwischen zwei Sechsecken und eine Parabel':
            'Copertina: triangolo rettangolo con i quadrati sui suoi lati, un rettangolo aureo con spirale, un cerchio tra due esagoni e una parabola',
        // kreisteil
        'Radius $r$': 'Raggio $r$', 'Mittelpunktswinkel $\\alpha$': 'Angolo al centro $\\alpha$', 'Kreis mit Kreisausschnitt und Kreisbogen': 'Cerchio con settore circolare e arco',
        'Kreisbogen': 'Arco', 'Kreisausschnitt': 'Settore circolare',
        // pythagoras
        'Pythagoras': 'Pitagora', 'Kathetensatz': 'Teorema del cateto', 'Höhensatz': 'Teorema dell’altezza', 'Satz': 'Teorema', 'gleichschenklig': 'isoscele',
        'Zieh am Punkt $C$. Er bleibt auf dem Thaleskreis über $\\overline{AB}$, deshalb ist der Winkel bei $C$ immer ein rechter.':
            'Trascina il punto $C$. Resta sulla semicirconferenza di Talete costruita su $\\overline{AB}$, per questo l’angolo in $C$ è sempre retto.',
        'Rechtwinkliges Dreieck mit Quadraten über den Seiten': 'Triangolo rettangolo con i quadrati sui lati',
        'Die beiden Kathetenquadrate haben zusammen genau den Flächeninhalt des Hypotenusenquadrats.':
            'I due quadrati dei cateti hanno insieme esattamente l’area del quadrato dell’ipotenusa.',
        'Jedes Kathetenquadrat ist so groß wie das Rechteck darunter.': 'Ogni quadrato di un cateto è equivalente al rettangolo che gli sta sotto.',
        'Das Höhenquadrat ist so groß wie das Rechteck aus den beiden Hypotenusenabschnitten.': 'Il quadrato dell’altezza è equivalente al rettangolo formato dalle due proiezioni.',
        // trigo
        'Sinus': 'Seno', 'Kosinus': 'Coseno', 'Tangens': 'Tangente', 'Verhältnis': 'Rapporto', 'Winkel $\\alpha$': 'Angolo $\\alpha$', 'Hypotenuse $c$': 'Ipotenusa $c$',
        'Gegenkathete a': 'cateto opposto a', 'Ankathete b': 'cateto adiacente b', 'Hypotenuse c': 'ipotenusa c',
        'Rechtwinkliges Dreieck mit Winkel alpha': 'Triangolo rettangolo con l’angolo alfa',
        'Ändere $c$: Das Dreieck wird größer oder kleiner, die drei Verhältnisse bleiben gleich. Sie hängen nur vom Winkel ab.':
            'Cambia $c$: il triangolo diventa più grande o più piccolo, ma i tre rapporti restano uguali. Dipendono solo dall’angolo.',
        // vieleck
        'Ecken verdoppeln': 'Raddoppia i vertici', 'Zurück auf 6': 'Torna a 6', 'Anzahl der Ecken $n$': 'Numero di vertici $n$',
        'Kreis mit einbeschriebenem und umbeschriebenem Vieleck': 'Cerchio con un poligono inscritto e uno circoscritto', 'innen': 'inscritto', 'außen': 'circoscritto',
        'Kreis mit $r = 1$, also $u = 2\\pi$. Umfang durch $2$:': 'Cerchio di raggio $r = 1$, quindi $u = 2\\pi$. Perimetro diviso per $2$:',
        // spitzkoerper
        'Quadratische Pyramide': 'Piramide quadrangolare', 'Kreiskegel': 'Cono', 'Körper': 'Solido', 'Seitenhöhe': 'Apotema', 'Seitenkante': 'Spigolo laterale',
        'Hilfsdreieck': 'Triangolo ausiliario', 'Grundkante $a$': 'Spigolo di base $a$', 'Höhe $h$': 'Altezza $h$',
        'Quadratische Pyramide im Schrägbild mit Hilfsdreieck': 'Piramide quadrangolare in assonometria cavaliera con triangolo ausiliario',
        'Kreiskegel im Schrägbild mit Hilfsdreieck': 'Cono in assonometria cavaliera con triangolo ausiliario',
        // goldenerschnitt
        'Ansicht': 'Vista', 'Strecke teilen': 'Dividi il segmento', 'Goldenes Rechteck': 'Rettangolo aureo', 'Pentagramm': 'Pentagramma',
        'Golden teilen': 'Sezione aurea', 'Quadrate abschneiden': 'Taglia quadrati',
        'Ganzes : größerer Teil': 'tutto : parte maggiore', 'größerer : kleinerer Teil': 'parte maggiore : parte minore',
        'Strecke AB mit Teilungspunkt T': 'Segmento AB con il punto di divisione T',
        'Beide Verhältnisse sind gleich: goldener Schnitt, $\\Phi = \\tfrac{1 + \\sqrt{5}}{2} \\approx 1{,}618$.':
            'I due rapporti sono uguali: sezione aurea, $\\Phi = \\tfrac{1 + \\sqrt{5}}{2} \\approx 1{,}618$.',
        'Zieh den Punkt $T$, bis beide Verhältnisse gleich sind.': 'Trascina il punto $T$ finché i due rapporti sono uguali.',
        'Goldenes Rechteck, in Quadrate zerlegt, mit Spirale': 'Rettangolo aureo scomposto in quadrati, con spirale',
        'Regelmäßiges Fünfeck mit Pentagramm': 'Pentagono regolare con pentagramma', 'Seite': 'Lato',
        'größerer Teil': 'parte maggiore', 'kleinerer Teil': 'parte minore',

        // book it-16 mathe6-it:

        // book it-17 mathe7-it:

        // book it-18 mathe8-it:

        // book it-19 mathe9-it:

        // book it-20 mathe10-it:
        'Quadratische Pyramide': 'Piramide a base quadrata',
        'Kreiskegel': 'Cono',
        'Seitenhöhe': 'Apotema',
        'Seitenkante': 'Spigolo laterale',
        'Hilfsdreieck': 'Triangolo ausiliario',
        'Radius $r$': 'Raggio $r$',
        'Sinus': 'Seno',
        'Kosinus': 'Coseno',
        'Tangens': 'Tangente',
        'Verhältnis': 'Rapporto',
        'Hypotenuse $c$': 'Ipotenusa $c$',
        'Gegenkathete a': 'cateto opposto a',
        'Ankathete b': 'cateto adiacente b',
        'Hypotenuse c': 'ipotenusa c',
        'Rechtwinkliges Dreieck mit Winkel alpha': 'Triangolo rettangolo con l’angolo alfa',
        'Ändere $c$: Das Dreieck wird größer oder kleiner, die drei Verhältnisse bleiben gleich. Sie hängen nur vom Winkel ab.': 'Cambia $c$: il triangolo diventa più grande o più piccolo, ma i tre rapporti restano uguali. Dipendono solo dall’angolo.',
        'Ecken verdoppeln': 'Raddoppia i vertici',
        'Zurück auf 6': 'Torna a 6',
        'Anzahl der Ecken $n$': 'Numero di vertici $n$',
        'Kreis mit einbeschriebenem und umbeschriebenem Vieleck': 'Circonferenza con un poligono inscritto e uno circoscritto',
        'innen': 'inscritto',
        'außen': 'circoscritto',
        'Kreis mit $r = 1$, also $u = 2\\pi$. Umfang durch $2$:': 'Circonferenza con $r = 1$, quindi $u = 2\\pi$. Perimetro diviso $2$:',
        'Seite': 'Lato',
        'Pythagoras': 'Pitagora',
        'Winkel $\\alpha$': 'Angolo $\\alpha$',
        'Quadratische Pyramide im Schrägbild mit Hilfsdreieck': 'Piramide a base quadrata in prospettiva cavaliera con il triangolo ausiliario',
        'Kreiskegel im Schrägbild mit Hilfsdreieck': 'Cono in prospettiva cavaliera con il triangolo ausiliario',
        'Körper': 'Solido', 'Höhe $h$': 'Altezza $h$', 'Grundkante $a$': 'Spigolo di base $a$',

    },
    phrase: [
        // book it-10 mathegy5-it:

        // book it-11 mathegy6-it:

        // book it-12 mathegy7-it:

        // book it-13 mathegy8-it:

        // book it-14 mathegy9-it:
        // kreisteil
        ['Anteil am Vollkreis: $', 'Frazione del cerchio intero: $'],
        ['Zieh am Ende des Bogens. Zum Vergleich der ganze Kreis: $u \\approx ', 'Trascina l’estremo dell’arco. Per confronto il cerchio intero: $u \\approx '],
        // pythagoras: "$a^2 \approx 9$ und $c \cdot p \approx …" (the page loads no funktionen, so no '$ und $' from there)
        ['$ und $c \\cdot p \\approx ', '$ e $c \\cdot p \\approx '], ['$ und $c \\cdot q \\approx ', '$ e $c \\cdot q \\approx '], ['$ und $p \\cdot q \\approx ', '$ e $p \\cdot q \\approx '],
        // trigo
        ['\\text{Gegenkathete}', '\\text{cateto opposto}'], ['\\text{Ankathete}', '\\text{cateto adiacente}'], ['\\text{Hypotenuse}', '\\text{ipotenusa}'],
        // spitzkoerper
        [' im Schrägbild mit Hilfsdreieck', ' in assonometria cavaliera con triangolo ausiliario'],
        // goldenerschnitt
        ['$ · größerer Teil $', '$ · parte maggiore $'], ['$ · kleinerer Teil $', '$ · parte minore $'],
        ['\\text{Ganzes}', '\\text{tutto}'], ['\\text{größerer Teil}', '\\text{parte maggiore}'], ['\\text{kleinerer Teil}', '\\text{parte minore}'],
        [' : 1$. Schneidet man das Quadrat über der kurzen Seite ab, bleibt wieder ein goldenes Rechteck übrig, um den Faktor $\\Phi$ verkleinert.',
            ' : 1$. Se si taglia il quadrato sul lato corto, resta di nuovo un rettangolo aureo, rimpicciolito del fattore $\\Phi$.'],
        ['\\,\\%$ so lang. Die Viertelkreise bilden die <b>goldene Spirale</b>.', '\\,\\%$ della lunghezza iniziale. I quarti di cerchio formano la <b>spirale aurea</b>.'],
        [' $s$ und Diagonale $d$ des regelmäßigen Fünfecks: $', ' $s$ e diagonale $d$ del pentagono regolare: $'],
        ['Jede Diagonale wird von einer anderen im goldenen Schnitt geteilt: ', 'Ogni diagonale è divisa da un’altra secondo la sezione aurea: '],
        ['$= \\Phi$, und der größere Teil ist genau so lang wie die Seite.', '$= \\Phi$, e la parte maggiore è lunga esattamente quanto il lato.'],

        // book it-16 mathe6-it:

        // book it-17 mathe7-it:

        // book it-18 mathe8-it:

        // book it-19 mathe9-it:

        // book it-20 mathe10-it:
        [' im Schrägbild mit Hilfsdreieck', ' in prospettiva cavaliera con il triangolo ausiliario'],
        ['\\text{Gegenkathete}', '\\text{cateto opposto}'],
        ['\\text{Ankathete}', '\\text{cateto adiacente}'],
        ['\\text{Hypotenuse}', '\\text{ipotenusa}'],

    ],
    rule: [
        // book it-10 mathegy5-it:

        // book it-11 mathegy6-it:

        // book it-12 mathegy7-it:

        // book it-13 mathegy8-it:

        // book it-14 mathegy9-it:
        // vieleck: "Also $3{,}1… < \pi < 3{,}2…$, Abstand $…$" (a rule with context instead of a bare 'Also $')
        [/Also \$([^$<]*) < \\pi < ([^$<]*)\$, Abstand \$/g, (m, lo, hi) => 'Quindi $' + lo + ' < \\pi < ' + hi + '$, differenza $'],
        // goldenerschnitt: "Seiten $1{,}618 : 1$." (a rule with context instead of a bare 'Seiten $')
        [/Seiten \$(?=[\d{},]+ : 1\$)/g, 'Lati $'],
        // goldenerschnitt: "Nach 5 Schnitten ist die lange Seite nur noch $…$ so lang."
        [/Nach (\d+) Schnitt(?:en)? ist die lange Seite nur noch \$/g, (m, n) => 'Dopo ' + n + (+n > 1 ? ' tagli' : ' taglio') + ' il lato lungo misura solo il $'],

        // book it-16 mathe6-it:

        // book it-17 mathe7-it:

        // book it-18 mathe8-it:

        // book it-19 mathe9-it:

        // book it-20 mathe10-it:
        // vieleck: "Also $3,14159 < \pi < 3,21539$, Abstand $0,0738$." with its context, no bare piece "Also $"
        [/>Also \$([^$]*< \\pi < [^$]*)\$, Abstand \$/g, (m, a) => '>Quindi $' + a + '$, differenza $'],

    ]
});
