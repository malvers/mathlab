/* js/buch-it/trigonometrie.js — Italian for the widgets of js/buch-trigonometrie.js.
 * Loaded by the Italian editions right after js/buch-trigonometrie.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 3 (20.10.2026): eleven books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/trigonometrie.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('trigonometrie', {
    word: {
        // book it-15 mathegy10-it:
        // the helpers of the module (Geo, messkurve data), reported for every page that loads it
        'Geometrische Figur': 'Figura geometrica', 'Dreieck': 'Triangolo',
        'Ebbe und Flut': 'Maree', 'Riesenrad': 'Ruota panoramica', 'EKG': 'ECG', 'Sonnenflecken': 'Macchie solari', 'Messreihe': 'Serie di misure',
        'Marker auf zwei Hochpunkte': 'Indicatori su due massimi', 'Messkurve mit zwei verschiebbaren Markern': 'Curva di misura con due indicatori spostabili',
        't in h': 't in h', 't in min': 't in min', 't in s': 't in s',
        'Wasserstand in m': 'Livello dell’acqua in m', 'Höhe in m': 'Altezza in m', 'Spannung in mV': 'Tensione in mV', 'Jahr': 'Anno', 'Fleckenzahl': 'Numero di macchie',
        'Wasserstand an einem Pegel an der Nordsee, bezogen auf das mittlere Niveau (vereinfachte Werte).':
            'Livello dell’acqua a un mareografo del Mare del Nord, rispetto al livello medio (valori semplificati).',
        'Höhe einer Gondel über dem Boden: Das Rad hat 50 m Durchmesser, die Achse liegt 27 m hoch, eine Umdrehung dauert 20 Minuten.':
            'Altezza di una cabina dal suolo: la ruota ha 50 m di diametro, l’asse è a 27 m di altezza, un giro dura 20 minuti.',
        'Ein Elektrokardiogramm zeichnet die elektrische Spannung am Herzen auf (vereinfachte Kurve). Periodisch, aber keine Sinuskurve.':
            'Un elettrocardiogramma registra la tensione elettrica del cuore (curva semplificata). Periodica, ma non una sinusoide.',
        'Monatsmittel der Sonnenflecken als geglättetes Modell mit dem Zyklus von etwa 11 Jahren (vereinfachte Werte, nicht die Messreihe).':
            'Media mensile delle macchie solari come modello livellato con il ciclo di circa 11 anni (valori semplificati, non la serie di misure).',
        'Mittellage': 'linea mediana',
        // sinussatz, kosinussatz
        'Höhe $h_c$': 'Altezza $h_c$', 'Umkreis': 'Circonferenza circoscritta', 'Hilfslinie': 'Linea ausiliaria', 'Dreieck mit verschiebbaren Ecken': 'Triangolo con vertici trascinabili',
        'Dreieck mit Quadraten über den drei Seiten': 'Triangolo con i quadrati costruiti sui tre lati',
        // dreieckloeser: S = side (lato), W = angle (angolo)
        'SSS': 'LLL', 'SWS': 'LAL', 'WSW': 'ALA', 'SSW': 'LLA', 'Gegeben': 'Dati', 'Das berechnete Dreieck': 'Il triangolo calcolato',
        'Kosinussatz': 'Teorema del coseno', 'Sinussatz': 'Teorema dei seni', 'Winkelsumme': 'Somma degli angoli',
        'KOSINUSSATZ': 'TEOREMA DEL COSENO', 'SINUSSATZ': 'TEOREMA DEI SENI', 'WINKELSUMME': 'SOMMA DEGLI ANGOLI',
        'Seite $a$': 'Lato $a$', 'Seite $b$': 'Lato $b$', 'Seite $c$': 'Lato $c$', 'Winkel $\\alpha$': 'Angolo $\\alpha$', 'Winkel $\\beta$': 'Angolo $\\beta$',
        'Winkel $\\alpha$ (gegenüber von $a$)': 'Angolo $\\alpha$ (opposto ad $a$)',
        'Kein Dreieck: Jede Seite muss kürzer sein als die beiden anderen zusammen (Dreiecksungleichung).':
            'Nessun triangolo: ogni lato deve essere più corto degli altri due insieme (disuguaglianza triangolare).',
        '$\\sin\\beta > 1$ ist unmöglich: Die Seite $a$ ist zu kurz, sie erreicht die andere Schenkellinie gar nicht. <b>Kein Dreieck.</b>':
            '$\\sin\\beta > 1$ è impossibile: il lato $a$ è troppo corto e non raggiunge nemmeno l’altro lato dell’angolo. <b>Nessun triangolo.</b>',
        // dreiecksflaeche
        'eingeschlossener Winkel $\\gamma$': 'angolo compreso $\\gamma$', 'Dreieck aus zwei Seiten und dem eingeschlossenen Winkel': 'Triangolo da due lati e l’angolo compreso',
        // titelbildgy10
        'Titelbild: eine Sinuswelle, eine Exponentialkurve, ein allgemeines Dreieck mit Umkreis und eine Zahlenfolge, die sich ihrem Grenzwert nähert':
            'Copertina: un’onda sinusoidale, una curva esponenziale, un triangolo qualsiasi con la circonferenza circoscritta e una successione che si avvicina al suo limite',
        // tangensfunktion
        'Einheitskreis mit Tangente an der Stelle 1': 'Circonferenza goniometrica con la retta tangente nel punto 1', 'Graph der Tangensfunktion mit Polstellen': 'Grafico della funzione tangente con i poli',
        // pyramidekegel
        'Quadratische Pyramide': 'Piramide quadrata', 'Kegel': 'Cono', 'Körper': 'Solido', 'Höhe – Seitenhöhe': 'Altezza – apotema', 'Höhe – Seitenkante': 'Altezza – spigolo laterale',
        'Höhe – Mantellinie': 'Altezza – generatrice', 'Rechtwinkliges Dreieck': 'Triangolo rettangolo', 'Grundkante $a$': 'Spigolo di base $a$', 'Radius $r$': 'Raggio $r$', 'Höhe $h$': 'Altezza $h$',

        // book it-19 mathe9-it:

        // book it-20 mathe10-it:

    },
    phrase: [
        // book it-15 mathegy10-it:
        // messkurve
        ['Abstand der Marker: <b>$', 'Distanza tra gli indicatori: <b>$'],
        ['</b> · Liegen beide Marker auf benachbarten Hochpunkten, ist das die <b>Periode</b>.', '</b> · Se i due indicatori stanno su massimi vicini, questa è il <b>periodo</b>.'],
        ['Größter Wert $', 'Valore massimo $'], ['$, kleinster Wert $', '$, valore minimo $'], [' · Amplitude $', ' · Ampiezza $'],
        // sinussatz
        ['Die Höhe aus zwei Richtungen: $h_c = b \\cdot \\sin\\alpha = ', 'L’altezza per due vie: $h_c = b \\cdot \\sin\\alpha = '],
        ['$ und $h_c = a \\cdot \\sin\\beta \\approx ', '$ e $h_c = a \\cdot \\sin\\beta \\approx '],
        ['$. Gleichsetzen und teilen ergibt $\\tfrac{a}{\\sin\\alpha} = \\tfrac{b}{\\sin\\beta}$.', '$. Uguagliando e dividendo si ottiene $\\tfrac{a}{\\sin\\alpha} = \\tfrac{b}{\\sin\\beta}$.'],
        ['Alle drei Quotienten sind so groß wie der <b>Durchmesser des Umkreises</b>: $2r = ', 'Tutti e tre i quozienti sono uguali al <b>diametro della circonferenza circoscritta</b>: $2r = '],
        // kosinussatz
        ['$\\gamma = 90^\\circ$: Der Korrekturterm ist null, es bleibt der <b>Satz des Pythagoras</b> $c^2 = a^2 + b^2$.', '$\\gamma = 90^\\circ$: il termine di correzione è nullo e resta il <b>teorema di Pitagora</b> $c^2 = a^2 + b^2$.'],
        ['$\\gamma < 90^\\circ$: $\\cos\\gamma > 0$, das Quadrat über $c$ ist <b>kleiner</b> als die beiden anderen zusammen.', '$\\gamma < 90^\\circ$: $\\cos\\gamma > 0$, il quadrato su $c$ è <b>minore</b> degli altri due insieme.'],
        ['$\\gamma > 90^\\circ$: $\\cos\\gamma < 0$, das Quadrat über $c$ ist <b>größer</b> als die beiden anderen zusammen.', '$\\gamma > 90^\\circ$: $\\cos\\gamma < 0$, il quadrato su $c$ è <b>maggiore</b> degli altri due insieme.'],
        [' Zieh $C$, bis der Winkel genau $90^\\circ$ hat.', ' Trascina $C$ finché l’angolo misura esattamente $90^\\circ$.'],
        // dreieckloeser
        ['Gegeben: ', 'Dati: '], ['drei Seiten', 'tre lati'], ['zwei Seiten und der eingeschlossene Winkel', 'due lati e l’angolo compreso'],
        ['eine Seite und die beiden anliegenden Winkel', 'un lato e i due angoli adiacenti'], ['zwei Seiten und ein Winkel, der einer der Seiten gegenüberliegt', 'due lati e un angolo opposto a uno dei due'],
        ['. Die Bezeichnungen sind die üblichen: $a$ liegt $A$ gegenüber, $\\alpha$ liegt bei $A$.', '. Le lettere sono quelle consuete: $a$ è opposto ad $A$, $\\alpha$ sta in $A$.'],
        ['Kein Dreieck: Die beiden Winkel sind zusammen schon $', 'Nessun triangolo: i due angoli insieme fanno già $'], ['^\\circ$, für $\\gamma$ bleibt nichts übrig.', '^\\circ$, per $\\gamma$ non resta nulla.'],
        ['\\text{ zu groß, }', '\\text{ troppo grande, }'],
        ['<b>Zwei Dreiecke</b> passen zu den Angaben: Die Seite $a$ schneidet die Schenkellinie zweimal. Das ist der mehrdeutige Fall von SSW (der gegebene Winkel liegt der <b>kürzeren</b> Seite gegenüber).',
            '<b>Due triangoli</b> corrispondono ai dati: il lato $a$ interseca due volte l’altro lato dell’angolo. È il caso ambiguo di LLA (l’angolo dato è opposto al lato <b>più corto</b>).'],
        ['Genau <b>ein</b> Dreieck: Der Winkel liegt der <b>längeren</b> (oder gleich langen) Seite gegenüber, dann ist SSW eindeutig.',
            'Esattamente <b>un</b> triangolo: l’angolo è opposto al lato <b>più lungo</b> (o lungo uguale), e allora LLA ha una sola soluzione.'],
        ['Genau <b>ein</b> Dreieck: Hier berührt $a$ die Schenkellinie nur, das Dreieck ist rechtwinklig.', 'Esattamente <b>un</b> triangolo: qui $a$ tocca soltanto l’altro lato dell’angolo, il triangolo è rettangolo.'],
        // dreiecksflaeche
        ['Höhe $h = b \\cdot \\sin\\gamma = ', 'Altezza $h = b \\cdot \\sin\\gamma = '], ['$ Flächeneinheiten', '$ unità di superficie'],
        [' · Bei $90^\\circ$ ist die Fläche am größten.', ' · Con $90^\\circ$ l’area è massima.'], [' · Derselbe Flächeninhalt bei $', ' · La stessa area con $'],
        ['^\\circ$, denn $\\sin(180^\\circ - \\gamma) = \\sin\\gamma$.', '^\\circ$, perché $\\sin(180^\\circ - \\gamma) = \\sin\\gamma$.'],
        // tangensfunktion
        ['$: Hier ist $\\cos\\alpha = 0$. Der Radius läuft parallel zur Tangente, $\\tan\\alpha$ ist <b>nicht definiert</b>. Der Graph hat eine <b>Polstelle</b>.',
            '$: qui $\\cos\\alpha = 0$. Il raggio è parallelo alla retta tangente, $\\tan\\alpha$ <b>non è definita</b>. Il grafico ha un <b>polo</b>.'],
        ['$ · Am Kreis: die Länge des Abschnitts auf der Tangente bei $x = 1$', '$ · Sulla circonferenza: la lunghezza del segmento sulla retta tangente in $x = 1$'],
        [' (nach unten, also negativ)', ' (verso il basso, quindi negativa)'],
        // pyramidekegel
        ['Schrägbild einer quadratischen Pyramide', 'Assonometria cavaliera di una piramide quadrata'], ['Schrägbild eines Kegels', 'Assonometria cavaliera di un cono'], [' mit einem rechtwinkligen Dreieck', ' con un triangolo rettangolo'],
        ['Seitenhöhe $h_a', 'Apotema $h_a'], ['Neigungswinkel der Seitenfläche:', 'Angolo di inclinazione della faccia laterale:'],
        ['Seitenkante $s', 'Spigolo laterale $s'], ['$ mit der Diagonale $d', '$ con la diagonale $d'], ['Neigungswinkel der Seitenkante:', 'Angolo di inclinazione dello spigolo laterale:'],
        ['$ · Oberfläche $O', '$ · superficie totale $O'], ['Mantellinie $s', 'Generatrice $s'], ['Volumen $V', 'Volume $V'],
        ['halber Öffnungswinkel:', 'metà dell’angolo di apertura:'], ['$ · Öffnungswinkel $2', '$ · angolo di apertura $2'], ['$ · Mantel $M', '$ · superficie laterale $M'],

        // book it-19 mathe9-it:

        // book it-20 mathe10-it:

    ],
    rule: [
        // book it-15 mathegy10-it:
        // messkurve: the unit after the distance of the markers ("$11,0$ Jahre</b>")
        [/\$ Jahre<\/b>/g, '$ anni</b>'],

        // book it-19 mathe9-it:

        // book it-20 mathe10-it:

    ]
});
