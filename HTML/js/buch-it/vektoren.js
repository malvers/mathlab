/* js/buch-it/vektoren.js — Italian for the widgets of js/buch-vektoren.js.
 * Loaded by the Italian editions right after js/buch-vektoren.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Package IT0 (18.10.2026) put in only the block comments; every book writes only below its own comment line, each entry ending
 * with a comma, so the three books merge without a conflict. The Spanish file js/buch-es/vektoren.js shows which German
 * strings the widgets write.
 */
window.BuchIT && BuchIT.add('vektoren', {
    word: {
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        'Räumliches Koordinatensystem mit einem Punkt und seinem Ortsvektor': 'Sistema di coordinate nello spazio con un punto e il suo vettore posizione',
        'Räumliches Koordinatensystem': 'Sistema di coordinate nello spazio',
        'Ziehen zum Drehen': 'Trascina per ruotare',
        'Beispiele:': 'Esempi:',
        'Punkte und Verbindungsvektor': 'Punti e vettore congiungente',
        'Summe und Differenz': 'Somma e differenza',
        'Vielfaches': 'Multiplo',
        'Was wird gezeigt?': 'Che cosa si mostra?',
        'Summe oder Differenz': 'Somma o differenza',
        'Faktor $r$': 'Fattore $r$',
        'spitzer Winkel': 'angolo acuto',
        'stumpfer Winkel': 'angolo ottuso',
        'Parallelogramm': 'Parallelogramma',
        'Rechteck': 'Rettangolo',
        'Raute': 'Rombo',
        'Quadrat': 'Quadrato',
        'Trapez': 'Trapezio',
        // book it-3 mathe13-it:
    },
    phrase: [
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        ['Mittelpunkt M zeigen', 'Mostra il punto medio M'],
        ['Länge: $', 'Lunghezza: $'],
        ['Mittelpunkt: $', 'Punto medio: $'],
        ['$, also $', '$, cioè $'],
        ['Subtrahieren heißt: den Gegenvektor $-\\vec{b}$ anhängen.', 'Sottrarre significa: attaccare il vettore opposto $-\\vec{b}$.'],
        ['Addieren heißt: $\\vec{b}$ an die Spitze von $\\vec{a}$ hängen. Die Summe ist die Diagonale des Parallelogramms.', 'Sommare significa: attaccare $\\vec{b}$ alla punta di $\\vec{a}$. La somma è la diagonale del parallelogramma.'],
        ['Ein negativer Faktor dreht die Richtung um.', 'Un fattore negativo inverte il verso.'],
        ['Mit $r = 0$ entsteht der Nullvektor.', 'Con $r = 0$ si ottiene il vettore nullo.'],
        [' Die Länge wird mit $|r| = ', ' La lunghezza viene moltiplicata per $|r| = '],
        [' (stumpf: das Skalarprodukt ist negativ)', ' (ottuso: il prodotto scalare è negativo)'],
        [' (spitz: das Skalarprodukt ist positiv)', ' (acuto: il prodotto scalare è positivo)'],
        [' (parallel, gleiche Richtung)', ' (paralleli, stesso verso)'],
        ['Mit dem Nullvektor gibt es keinen Winkel.', 'Con il vettore nullo non c’è alcun angolo.'],
        ['kein ebenes Viereck: Die vier Punkte liegen nicht in einer Ebene.', 'non è un quadrilatero piano: i quattro punti non stanno in uno stesso piano.'],
        ['ein <b>Quadrat</b>', 'un <b>quadrato</b>'],
        ['ein <b>Rechteck</b>', 'un <b>rettangolo</b>'],
        ['eine <b>Raute</b>', 'un <b>rombo</b>'],
        ['ein <b>Parallelogramm</b>', 'un <b>parallelogramma</b>'],
        ['ein <b>Trapez</b> (ein Paar paralleler Seiten)', 'un <b>trapezio</b> (una coppia di lati paralleli)'],
        ['ein allgemeines Viereck', 'un quadrilatero qualsiasi'],
        ['$: gegenüberliegende Seiten parallel und gleich lang', '$: lati opposti paralleli e di uguale lunghezza'],
        ['$: rechter Winkel bei $A$', '$: angolo retto in $A$'],
        ['$ und $|', '$ e $|'],
        ['$: benachbarte Seiten gleich lang', '$: lati consecutivi di uguale lunghezza'],
        ['$: Diagonalen senkrecht zueinander', '$: diagonali perpendicolari tra loro'],
        ['$ABCD$ ist ', '$ABCD$ è '],
        // book it-3 mathe13-it:
    ],
    rule: [
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        // the inputs "Vektor a, x-Koordinate" → "Vettore a, coordinata x"; between the coordinate inputs a semicolon, because an
        // input may hold a decimal comma: ( 1 ; 2 ; 3 )
        [/\b(Vektor|Punkt) ([^,"]+), ([xyz])-Koordinate/g, (m, k, n, c) => (k === 'Vektor' ? 'Vettore ' : 'Punto ') + n + ', coordinata ' + c],
        [/(<span class="vk-par">)\|(<\/span>)/g, '$1;$2'],
        // skalarprodukt: the preset "parallel" means two vectors (paralleli)
        [/(data-p="para">)parallel</g, '$1paralleli<'],
        // book it-3 mathe13-it:
    ]
});
