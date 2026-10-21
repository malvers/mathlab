/* js/buch-it/os9.js — Italian for the widgets of js/buch-os9.js.
 * Loaded by the Italian editions right after js/buch-os9.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 3 (20.10.2026): eleven books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/os9.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('os9', {
    word: {
        // book it-19 mathe9-it:
        // titelbildos9
        'Titelbild: ein rechtwinkliges Dreieck mit Quadraten über den Seiten, eine Wurfparabel, ein Kegel und eine Kugel':
            'Copertina: un triangolo rettangolo con i quadrati sui lati, la parabola di un lancio, un cono e una sfera',
        // steigungos9
        'Steigung in Prozent': 'Pendenza in percentuale', '100 m waagerecht': '100 m in orizzontale',
        '100 % sind genau $45^\\circ$: Es geht so weit hoch wie nach vorn.': 'Il 100 % corrisponde esattamente a $45^\\circ$: si sale tanto quanto si avanza.',
        'Mehr als 100 % ist steiler als $45^\\circ$, das gibt es nur bei Treppen und Bergbahnen.':
            'Più del 100 % è più ripido di $45^\\circ$: succede solo con le scale e con le funicolari.',
        'Die Prozentzahl wächst nicht im gleichen Maß wie der Winkel: Doppelte Prozent sind nicht doppelter Winkel.':
            'La percentuale non cresce nella stessa misura dell’angolo: una percentuale doppia non è un angolo doppio.',
        // parabelos9
        'Streckfaktor $a$': 'Fattore di dilatazione $a$', 'Verschiebung $c$': 'Traslazione $c$',
        '$d$ (nach links, wenn positiv)': '$d$ (verso sinistra, se positivo)', '$e$ (nach oben, wenn positiv)': '$e$ (verso l’alto, se positivo)',
        'Graph einer quadratischen Funktion mit Scheitelpunkt': 'Grafico di una funzione quadratica con il vertice',
        // quadglos9
        'Drei Parabeln mit zwei, einer und keiner Nullstelle': 'Tre parabole con due zeri, uno e nessuno',
        'Parabel y = x² + p x + q mit ihren Nullstellen': 'Parabola y = x² + p x + q con i suoi zeri',
        // kugelos9
        'Radius gegeben': 'Raggio dato', 'Volumen gegeben': 'Volume dato', 'Gegeben': 'Dati', 'Volumen $V$': 'Volume $V$', 'Radius $r$': 'Raggio $r$',
        'Eine Kugel in einem Zylinder, der genau um sie passt': 'Una sfera in un cilindro che la contiene esattamente',
        'Radius': 'Raggio', 'Oberfläche': 'Superficie', 'Volumen': 'Volume', 'Zylinder darum': 'Cilindro circoscritto',
        'Die Kugel füllt immer genau $\\tfrac{2}{3}$ des Zylinders, der um sie passt. Das hat Archimedes entdeckt.':
            'La sfera riempie sempre esattamente $\\tfrac{2}{3}$ del cilindro circoscritto. Lo scoprì Archimede.',
        // turmos9
        'Turm: Zylinder + Kegel': 'Torre: cilindro + cono', 'Silo: Zylinder + Halbkugel': 'Silo: cilindro + semisfera', 'Körper': 'Solido',
        'Höhe des Zylinders $h$': 'Altezza del cilindro $h$', 'Höhe des Kegels $h_K$': 'Altezza del cono $h_K$',
        'Turm aus einem Zylinder mit einem Kegeldach': 'Torre formata da un cilindro con un tetto conico',
        'Silo aus einem Zylinder mit einer Halbkugel als Dach': 'Silo formato da un cilindro con una semisfera come tetto',
        'Zylinder': 'Cilindro', 'Kegel': 'Cono', 'Halbkugel': 'Semisfera', 'Mantellinie': 'Apotema',
        'Zur Oberfläche gehören nur die Außenflächen: Der Deckkreis des Zylinders liegt innen und zählt nicht mit.':
            'Alla superficie appartengono solo le facce esterne: il cerchio superiore del cilindro sta all’interno e non conta.',
        // spannweiteos9
        'Ausreißer zu A (5,8 m)': 'Valore anomalo in A (5,8 m)', 'Ausreißer weg': 'Togli il valore anomalo', 'Streuung von B': 'Dispersione di B',
        'GRUPPE A': 'GRUPPO A', 'GRUPPE B': 'GRUPPO B',
        'kleinster Wert': 'valore minimo', 'größter Wert': 'valore massimo', 'Spannweite': 'Campo di variazione', 'Mittelwert': 'Media', 'Zentralwert': 'Mediana',
        'Weitsprungweiten zweier Gruppen mit Mittelwert und Spannweite': 'Misure del salto in lungo di due gruppi con media e campo di variazione',
        'Weiße Linie: Mittelwert. Die Klammer unter den Punkten reicht vom kleinsten bis zum größten Wert, ihre Länge ist die Spannweite. Ausgedachte Werte.':
            'Linea bianca: media. La parentesi sotto i punti va dal valore minimo al valore massimo, la sua lunghezza è il campo di variazione. Valori inventati.',
        // fibonaccios9
        'Anzahl der Fibonacci-Zahlen $n$': 'Quantità di numeri di Fibonacci $n$', 'Quotient': 'Quoziente', 'Wert': 'Valore',
        'Quotienten benachbarter Fibonacci-Zahlen nähern sich der Zahl 1,618': 'I quozienti di numeri di Fibonacci consecutivi si avvicinano al numero 1,618',
        'Jede Zahl ist die Summe der beiden davor. Die Quotienten springen abwechselnd über und unter die grüne Linie $\\Phi \\approx 1{,}618$ und kommen ihr immer näher.':
            'Ogni numero è la somma dei due precedenti. I quozienti saltano alternativamente sopra e sotto la linea verde $\\Phi \\approx 1{,}618$ e le si avvicinano sempre di più.',
        // abstandos9
        'Zwei verschiebbare Punkte und ihr Abstand als Hypotenuse': 'Due punti trascinabili e la loro distanza come ipotenusa',
        'Die Strecke ist die Hypotenuse eines rechtwinkligen Dreiecks, die Katheten laufen parallel zu den Achsen.':
            'Il segmento è l’ipotenusa di un triangolo rettangolo, i cateti sono paralleli agli assi.',
        // umkehros9
        'Seite $a$': 'Lato $a$', 'Seite $b$': 'Lato $b$', 'Seite $c$': 'Lato $c$',
        'Kein Dreieck möglich': 'Nessun triangolo possibile', 'Aus diesen Seiten entsteht kein Dreieck.': 'Con questi lati non si forma nessun triangolo.',
        'Zwei Seiten zusammen müssen länger sein als die dritte.': 'Due lati insieme devono essere più lunghi del terzo.',
        'Gleich: Nach der Umkehrung des Satzes von Pythagoras hat das Dreieck bei $C$ einen rechten Winkel.':
            'Uguali: per l’inverso del teorema di Pitagora il triangolo ha un angolo retto in $C$.',
        'Ganze Zahlen mit $a^2 + b^2 = c^2$ heißen pythagoreische Zahlentripel.': 'I numeri interi con $a^2 + b^2 = c^2$ si chiamano terne pitagoriche.',
        // rwdreieckos9: what is given ("$c$ und $\alpha$"), whole labels
        'Winkel $\\alpha$': 'Angolo $\\alpha$',
        '$c$ und $\\alpha$': '$c$ e $\\alpha$', '$b$ und $\\alpha$': '$b$ e $\\alpha$', '$a$ und $\\alpha$': '$a$ e $\\alpha$', '$a$ und $b$': '$a$ e $b$', '$a$ und $c$': '$a$ e $c$',
        'Die Kathete $a$ muss kürzer sein als die Hypotenuse $c$.': 'Il cateto $a$ deve essere più corto dell’ipotenusa $c$.',
        'Rechtwinkliges Dreieck mit dem rechten Winkel bei C': 'Triangolo rettangolo con l’angolo retto in C',
        'Gegenkathete von $\\alpha$ ist $a$, Ankathete ist $b$, Hypotenuse ist $c$. Der Taschenrechner steht auf DEG.':
            'Il cateto opposto ad $\\alpha$ è $a$, il cateto adiacente è $b$, l’ipotenusa è $c$. La calcolatrice è impostata su DEG.',
        // dachos9
        'Hausbreite $b$': 'Larghezza della casa $b$', 'Dachneigung $\\alpha$': 'Inclinazione del tetto $\\alpha$', 'Hauslänge $l$': 'Lunghezza della casa $l$',
        'Firsthöhe': 'Altezza del colmo', 'Sparrenlänge': 'Lunghezza dei puntoni',
        'Die Höhe teilt den Giebel in zwei gleiche rechtwinklige Dreiecke. Dachüberstände sind hier nicht mitgerechnet.':
            'L’altezza divide il timpano in due triangoli rettangoli uguali. Le sporgenze del tetto qui non sono considerate.',
        // parabelos9: the aria of the form buttons
        'Form': 'Forma',

    },
    phrase: [
        // book it-19 mathe9-it:
        // steigungos9: "$12\,\%$ Steigung: auf 100 m waagerecht 12 m höher, also $\tan\alpha = …$" and the angle under it
        ['$ Steigung: auf 100 m waagerecht ', '$ di pendenza: su 100 m in orizzontale si sale di '], [' m höher, also ', ' m, quindi '],
        ['Steigungswinkel: ', 'Angolo di inclinazione: '],
        // parabelos9: the sentences under the graph
        [' · Scheitelpunkt ', ' · vertice '], ['Quadratische Ergänzung: ', 'Completamento del quadrato: '],
        ['Die Parabel ist nach oben geöffnet und ', 'La parabola è rivolta verso l’alto ed è '], ['Die Parabel ist nach unten geöffnet und ', 'La parabola è rivolta verso il basso ed è '],
        ['so weit wie die Normalparabel', 'larga quanto la parabola normale'], ['enger als die Normalparabel (gestreckt)', 'più stretta della parabola normale (dilatata)'],
        ['weiter als die Normalparabel (gestaucht)', 'più larga della parabola normale (compressa)'],
        ['. Der Scheitelpunkt ist ein <b>Minimum</b>.', '. Il vertice è un <b>minimo</b>.'], ['. Der Scheitelpunkt ist ein <b>Maximum</b>.', '. Il vertice è un <b>massimo</b>.'],
        ['Wertebereich: ', 'Insieme immagine: '], ['Fallend für ', 'Decrescente per '], ['Steigend für ', 'Crescente per '],
        ['steigend für ', 'crescente per '], ['fallend für ', 'decrescente per '],
        ['Nullstellen (türkis): ', 'Zeri (turchese): '], ['keine, die Parabel trifft die x-Achse nicht', 'nessuno, la parabola non tocca l’asse x'],
        [': Für $a = 0$ ist der Graph keine Parabel mehr, sondern eine waagerechte Gerade.', ': per $a = 0$ il grafico non è più una parabola, ma una retta orizzontale.'],
        // quadglos9: the equation, the formula and the number of solutions
        ['$ &nbsp; mit $p = ', '$ &nbsp; con $p = '],
        ['<b>Zwei Lösungen</b>, weil die Diskriminante ', '<b>Due soluzioni</b>, perché il discriminante è '],
        ['<b>Genau eine Lösung</b>, weil $D = 0$ ist: ', '<b>Esattamente una soluzione</b>, perché $D = 0$: '],
        ['. Der Scheitelpunkt liegt auf der x-Achse.', '. Il vertice sta sull’asse x.'],
        ['<b>Keine Lösung</b>, weil ', '<b>Nessuna soluzione</b>, perché '],
        [' &lt; 0$ ist: Aus einer negativen Zahl zieht man keine Wurzel. Die Parabel liegt ganz über der x-Achse.',
            ' &lt; 0$: da un numero negativo non si estrae la radice. La parabola sta tutta sopra l’asse x.'],
        // fibonaccios9
        ['Fibonacci-Zahlen: ', 'Numeri di Fibonacci: '],
        // umkehros9
        ['$ und $c^2 = ', '$ e $c^2 = '],
        ['Nicht gleich: Der Winkel bei $C$ ist kleiner als ', 'Non uguali: l’angolo in $C$ è minore di '],
        ['Nicht gleich: Der Winkel bei $C$ ist größer als ', 'Non uguali: l’angolo in $C$ è maggiore di '], [', nämlich etwa ', ', cioè circa '],

    ],
    rule: [
        // book it-19 mathe9-it:
        // aria labels with a number in the middle
        [/^Steigungsdreieck einer Straße mit (\d+) Prozent Steigung$/, 'Triangolo della pendenza di una strada: pendenza $1 per cento'],
        [/^Dreieck mit den Seiten (\d+), (\d+) und (\d+)$/, 'Triangolo con i lati $1, $2 e $3'],
        [/^Querschnitt eines Satteldachs mit Neigung (\d+) Grad$/, 'Sezione di un tetto a due falde con inclinazione di $1 gradi'],
        // parabelos9: "Scheitelpunkt (weiß)" and the zeros "genau eine, …" with their context (rules run before the phrases)
        [/\(weiß\)/g, '(bianco)'], [/Nullstellen \(türkis\): genau eine, /g, 'Zeri (turchese): esattamente uno, '],
        // quadglos9: "… > 0$ ist: " after the discriminant
        [/( &gt; 0)\$ ist: /g, '$1$: '],
        // dachos9: the table cell (a bare word would also hit other labels)
        [/<td>Dachfläche<\/td>/g, '<td>Superficie del tetto</td>'],

    ]
});
