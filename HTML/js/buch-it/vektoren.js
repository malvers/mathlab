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
 * Round 2 (20.10.2026): six books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
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
        'Parameter $t$': 'Parametro $t$',
        'Ebene und Normalenvektor': 'Piano e vettore normale',
        'Liegt der Punkt in E?': 'Il punto giace in E?',
        'Gerade schneidet Ebene': 'Una retta taglia un piano',
        'identisch': 'coincidenti',
        'schneidend': 'incidenti',
        'windschief': 'sghembe',
        'Pyramide': 'Piramide',
        'Prisma (schief möglich)': 'Prisma (anche obliquo)',
        'Körper': 'Solido',
        'Grundkante $a$': 'Spigolo di base $a$',
        'Höhe $h$': 'Altezza $h$',
        'Verschiebung der Spitze in $x$': 'Spostamento del vertice in $x$',
        // book it-5 mathefos12-it:
        // kreuzprodukt
        'zwei Vektoren': 'due vettori', 'Dachfläche': 'falda del tetto', 'in der x-y-Ebene': 'nel piano x-y', 'Dreieck': 'Triangolo', 'Welche Fläche?': 'Quale superficie?',
        // lot3d
        'Punkt über E': 'Punto sopra E', 'Ursprung': 'Origine', 'Punkt unter E': 'Punto sotto E', 'Punkt in E': 'Punto in E',
        'Spiegelpunkt P′ zeigen': 'Mostra il punto simmetrico P′', 'Konstante $d$ in $\\vec{n} \\circ \\vec{x} = d$': 'Costante $d$ in $\\vec{n} \\circ \\vec{x} = d$',
        // zentralprojektion
        'Abstand des Auges $a$': 'Distanza dell’occhio $a$', 'Fluchtlinien zeigen': 'Mostra le linee di fuga', 'Horizont': 'Orizzonte',
        'Zieh den Fluchtpunkt V. Er liegt auf dem Horizont in Augenhöhe.': 'Trascina il punto di fuga V. Sta sull’orizzonte, all’altezza degli occhi.',
        'Zentralprojektion eines Quaders und einer Pfostenreihe mit Fluchtpunkt': 'Proiezione centrale di un parallelepipedo e di una fila di pali con il punto di fuga',

        // book it-6 mathegy11-it:

        // book it-7 mathegy11lk-it:

        // book it-8 mathegy12-it:
        // kreuzprodukt, lot3d, winkel3d
        'zwei Vektoren': 'due vettori', 'Dachfläche': 'falda del tetto', 'in der x-y-Ebene': 'nel piano x-y', 'Dreieck': 'Triangolo', 'Welche Fläche?': 'Quale area?',
        'Punkt über E': 'Punto sopra E', 'Ursprung': 'Origine', 'Punkt unter E': 'Punto sotto E', 'Punkt in E': 'Punto in E',
        'Spiegelpunkt P′ zeigen': 'Mostra il punto simmetrico P′', 'Konstante $d$ in $\\vec{n} \\circ \\vec{x} = d$': 'Costante $d$ in $\\vec{n} \\circ \\vec{x} = d$',
        'Gerade – Gerade': 'retta – retta', 'Gerade – Ebene': 'retta – piano', 'Ebene – Ebene': 'piano – piano', 'Welcher Winkel?': 'Quale angolo?',
        'spitz': 'acuto', 'stumpfe Vektoren': 'vettori con angolo ottuso', 'senkrecht': 'perpendicolare', 'schräg': 'obliquo', 'Dach und Boden': 'tetto e pavimento',

        // book it-9 mathegy12lk-it:
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
        ['Der Richtungsvektor darf nicht der Nullvektor sein.', 'Il vettore direzione non può essere il vettore nullo.'],
        ['Punktprobe für $Q(', 'Verifica di appartenenza per $Q('],
        ['Alle Zeilen liefern $t = ', 'Tutte le righe danno $t = '],
        ['$, also <b>$Q \\in g$</b>.', '$, quindi <b>$Q \\in g$</b>.'],
        ['Die Zeilen liefern verschiedene Werte für $t$, also <b>$Q \\notin g$</b>.', 'Le righe danno valori diversi di $t$, quindi <b>$Q \\notin g$</b>.'],
        ['Spurpunkte: keine', 'Punti traccia: nessuno'],
        ['Spurpunkte: ', 'Punti traccia: '],
        ['$\\vec{u}$ und $\\vec{v}$ sind parallel, sie spannen keine Ebene auf.', '$\\vec{u}$ e $\\vec{v}$ sono paralleli, non individuano un piano.'],
        ['$ · Koordinatenform: $', '$ · equazione cartesiana: $'],
        ['Spurpunkte mit den Achsen: ', 'Punti traccia con gli assi: '],
        ['Punktprobe: $', 'Verifica di appartenenza: $'],
        ['$: <b>$Q$ liegt in $E$</b>.', '$: <b>$Q$ giace in $E$</b>.'],
        ['$: <b>$Q$ liegt nicht in $E$</b>. Abstand $\\approx ', '$: <b>$Q$ non giace in $E$</b>. Distanza $\\approx '],
        ['$: Die Gerade ist parallel zur Ebene ', '$: la retta è parallela al piano '],
        ['und liegt in ihr.', 'e giace in esso.'],
        ['und schneidet sie nicht.', 'e non lo interseca.'],
        ['Einsetzen von $g$ in $E$: $t = ', 'Sostituendo $g$ in $E$: $t = '],
        ['$, Schnittpunkt $S(', '$, punto di intersezione $S('],
        ['Richtungsvektoren dürfen nicht der Nullvektor sein.', 'I vettori direzione non possono essere il vettore nullo.'],
        ['Die Richtungsvektoren sind parallel ($\\vec{v} = ', 'I vettori direzione sono paralleli ($\\vec{v} = '],
        ['Der Stützpunkt $Q$ liegt auf $g$: <b>identisch</b>.', 'Il punto d’appoggio $Q$ sta su $g$: <b>coincidenti</b>.'],
        ['Der Stützpunkt $Q$ liegt nicht auf $g$: <b>echt parallel</b>.', 'Il punto d’appoggio $Q$ non sta su $g$: <b>parallele distinte</b>.'],
        ['Nicht parallel. Gleichsetzen ergibt $t = ', 'Non parallele. Uguagliando si ottiene $t = '],
        ['$: <b>schneidend</b> im Punkt $S(', '$: <b>incidenti</b> nel punto $S('],
        ['Nicht parallel und das Gleichungssystem hat keine Lösung: <b>windschief</b>. Kürzester Abstand (rot gestrichelt) $\\approx ', 'Non parallele e il sistema di equazioni non ha soluzione: <b>sghembe</b>. Distanza minima (rosso tratteggiato) $\\approx '],
        ['Grundfläche $G', 'Area di base $G'],
        ['$, Spitze $S(', '$, vertice $S('],
        ['$, Höhe $h = ', '$, altezza $h = '],
        ['Volumen $V', 'Volume $V'],
        ['Oberfläche $O = ', 'Superficie totale $O = '],
        [' · Verschiebst du die Spitze waagerecht, bleibt das Volumen gleich, der Mantel nicht.', ' · Se sposti il vertice orizzontalmente, il volume resta uguale, la superficie laterale no.'],
        ['$, Verschiebung der Deckfläche $\\vec{w} = ', '$, traslazione della base superiore $\\vec{w} = '],
        [' · Mantel (4 Parallelogramme, je $', ' · superficie laterale (4 parallelogrammi, ciascuno $'],
        [' (Prinzip von Cavalieri: auch schief)', ' (principio di Cavalieri: anche obliquo)'],
        // book it-5 mathefos12-it:
        // kreuzprodukt
        ['$\\vec{u}$ und $\\vec{v}$ sind parallel: Das Vektorprodukt ist der Nullvektor, sie spannen keine Fläche auf.',
            '$\\vec{u}$ e $\\vec{v}$ sono paralleli: il prodotto vettoriale è il vettore nullo e non generano alcuna superficie.'],
        ['$: Das Vektorprodukt steht senkrecht auf beiden Vektoren', '$: il prodotto vettoriale è perpendicolare a entrambi i vettori'],
        [' (im Bild verkürzt gezeichnet)', ' (nella figura disegnato più corto)'], ['Dreieck: $A = ', 'Triangolo: $A = '], ['Parallelogramm: $A = ', 'Parallelogramma: $A = '],
        [' Flächeneinheiten', ' unità di superficie'], ['$ und $(\\vec{u} \\times \\vec{v}) \\circ \\vec{v} = ', '$ e $(\\vec{u} \\times \\vec{v}) \\circ \\vec{v} = '],
        // lot3d
        ['Der Normalenvektor darf nicht der Nullvektor sein.', 'Il vettore normale non può essere il vettore nullo.'],
        ['$ · Lotfußpunkt $F(', '$ · piede della perpendicolare $F('],
        ['$t = 0$: Der Punkt $P$ liegt selbst in der Ebene, sein Abstand ist $0$.', '$t = 0$: il punto $P$ giace esso stesso nel piano, la sua distanza è $0$.'],
        ['$ · ohne Lotfußpunkt: $', '$ · senza il piede della perpendicolare: $'],
        ['Spiegelpunkt: $t$ verdoppeln, $', 'Punto simmetrico: raddoppiare $t$, $'],
        // zentralprojektion
        ['Fluchtpunkt $V(', 'Punto di fuga $V('], [')$ · Bildebene vor dem Quader, Auge im Abstand $a = ', ')$ · piano del quadro davanti al parallelepipedo, occhio alla distanza $a = '],
        ['$ davor', '$ davanti a esso'],
        ['Alle Kanten, die in die Tiefe laufen, treffen sich in $V$. Kanten parallel zur Bildebene bleiben parallel und behalten ihr Verhältnis.',
            'Tutti gli spigoli che vanno in profondità si incontrano in $V$. Gli spigoli paralleli al piano del quadro restano paralleli e mantengono le loro proporzioni.'],
        ['Ein Pfosten in der Tiefe $z$ erscheint mit dem Faktor $\\dfrac{a}{a + z}$: bei $z = 8$ also $\\dfrac{', 'Un palo alla profondità $z$ appare con il fattore $\\dfrac{a}{a + z}$: con $z = 8$ quindi $\\dfrac{'],
        ['$ so hoch wie vorn.', '$ volte l’altezza che avrebbe davanti.'],
        ['Abstand: $|', 'Distanza: $|'],
        // the 3D widgets shared with BGY 12/13 (raum3d, skalarprodukt, ebene3d, pyramide, lot3d): pieces the it-2/it-3 blocks do not have yet
        ['Ortsvektoren $', 'Vettori posizione $'], ['$ · Verbindungsvektor $', '$ · vettore congiungente $'], ['$ multipliziert: $', '$: $'],
        ['<b>orthogonal</b>', '<b>ortogonali</b>'], ['Normalenvektor $\\vec{n}', 'Vettore normale $\\vec{n}'], ['$ · Schnittwinkel: $', '$ · angolo di intersezione: $'],
        ['$ (rot)', '$ (in rosso)'], [' · Mantel (4 Dreiecke, je $', ' · superficie laterale (4 triangoli, ciascuno $'],
        ['$ · Lotgerade $l\\colon', '$ · retta perpendicolare $l\\colon'], ['$l$ in $E$ einsetzen: $', 'Sostituire $l$ in $E$: $'],

        // book it-6 mathegy11-it:

        // book it-7 mathegy11lk-it:

        // book it-8 mathegy12-it:
        // kreuzprodukt
        ['$\\vec{u}$ und $\\vec{v}$ sind parallel: Das Vektorprodukt ist der Nullvektor, sie spannen keine Fläche auf.',
            '$\\vec{u}$ e $\\vec{v}$ sono paralleli: il prodotto vettoriale è il vettore nullo, non individuano nessuna area.'],
        ['$: Das Vektorprodukt steht senkrecht auf beiden Vektoren', '$: il prodotto vettoriale è perpendicolare a entrambi i vettori'],
        [' (im Bild verkürzt gezeichnet)', ' (nella figura disegnato più corto)'], ['Dreieck: $A = ', 'Triangolo: $A = '], ['Parallelogramm: $A = ', 'Parallelogramma: $A = '],
        [' Flächeneinheiten', ' unità di area'], ['$ und $(\\vec{u} \\times \\vec{v}) \\circ \\vec{v} = ', '$ e $(\\vec{u} \\times \\vec{v}) \\circ \\vec{v} = '],
        ['Probe: $(\\vec{u} \\times \\vec{v}) \\circ \\vec{u} = ', 'Verifica: $(\\vec{u} \\times \\vec{v}) \\circ \\vec{u} = '],
        // lot3d
        ['Der Normalenvektor darf nicht der Nullvektor sein.', 'Il vettore normale non può essere il vettore nullo.'],
        ['$ · Lotgerade $l\\colon', '$ · retta perpendicolare $l\\colon'], ['$l$ in $E$ einsetzen: $', 'Sostituire $l$ in $E$: $'], ['$ · Lotfußpunkt $F(', '$ · piede della perpendicolare $F('],
        ['$t = 0$: Der Punkt $P$ liegt selbst in der Ebene, sein Abstand ist $0$.', '$t = 0$: il punto $P$ stesso giace nel piano, la sua distanza è $0$.'],
        ['Abstand: $|', 'Distanza: $|'], ['$ · ohne Lotfußpunkt: $', '$ · senza piede della perpendicolare: $'],
        ['Spiegelpunkt: $t$ verdoppeln, $', 'Punto simmetrico: raddoppiare $t$, $'], ['$, also $P\'(', '$, quindi $P\'('],
        // winkel3d
        ['Der Nullvektor hat keine Richtung, er liefert keinen Winkel.', 'Il vettore nullo non ha direzione, non fornisce nessun angolo.'],
        ['$, also $\\varphi \\approx ', '$, quindi $\\varphi \\approx '],
        ['Die Richtungsvektoren sind parallel: Die Geraden sind parallel oder identisch, sie schneiden sich nicht unter einem Winkel.',
            'I vettori direzione sono paralleli: le rette sono parallele o coincidenti, non si intersecano formando un angolo.'],
        ['Die Vektoren selbst schließen $', 'I vettori stessi formano $'],
        ['$ ein, also einen stumpfen Winkel. Die Geraden bilden den spitzen Nebenwinkel $180^\\circ - ', '$, cioè un angolo ottuso. Le rette formano l’angolo acuto supplementare $180^\\circ - '],
        ['$; dafür steht der Betrag im Zähler.', '$; per questo al numeratore c’è il valore assoluto.'],
        ['Das Skalarprodukt ist $0$: Die Geraden schneiden sich senkrecht.', 'Il prodotto scalare è $0$: le rette si intersecano perpendicolarmente.'],
        ['Das Skalarprodukt ist positiv, der Winkel zwischen den Vektoren ist schon spitz.', 'Il prodotto scalare è positivo, l’angolo tra i vettori è già acuto.'],
        ['Winkel zwischen $\\vec{u}$ und dem Normalenvektor: $\\cos\\alpha = ', 'Angolo tra $\\vec{u}$ e il vettore normale: $\\cos\\alpha = '],
        ['Der Winkel zur Ebene ergänzt ihn zu $90^\\circ$: $', 'L’angolo con il piano è il suo complementare a $90^\\circ$: $'],
        ['. Das Skalarprodukt ist $0$: $g$ ist parallel zu $E$ oder liegt in $E$.', '. Il prodotto scalare è $0$: $g$ è parallela a $E$ o giace in $E$.'],
        ['. $\\vec{u}$ ist ein Vielfaches von $\\vec{n}$: $g$ steht senkrecht auf $E$.', '. $\\vec{u}$ è un multiplo di $\\vec{n}$: $g$ è perpendicolare a $E$.'],
        ['. Gelb gestrichelt: die Projektion von $g$ in die Ebene.', '. Tratteggiata in giallo: la proiezione di $g$ sul piano.'],
        ['Die Normalenvektoren sind parallel: Die Ebenen sind parallel oder identisch.', 'I vettori normali sono paralleli: i piani sono paralleli o coincidenti.'],
        ['Weiß: die Schnittgerade $s$ mit dem Richtungsvektor $', 'In bianco: la retta di intersezione $s$ con il vettore direzione $'],
        ['$. Gemessen wird der Winkel senkrecht zu ihr, zwischen den beiden farbigen Linien in den Ebenen.', '$. L’angolo si misura perpendicolarmente a essa, tra le due linee colorate nei piani.'],

        // book it-9 mathegy12lk-it:
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
        // geradenlage: the preset "parallel" means two lines (parallele); a global word would also hit the vectors
        [/(data-p="par">)parallel</g, '$1parallele<'],
        // book it-5 mathefos12-it:

        // book it-6 mathegy11-it:

        // book it-7 mathegy11lk-it:

        // book it-8 mathegy12-it:
        // winkel3d: the preset "parallel" for a line and a plane (paralleli; the vectors of skalarprodukt and kreuzprodukt have the rule of it-2 above)
        [/(data-p="flach">)parallel</g, '$1paralleli<'],

        // book it-9 mathegy12lk-it:
    ]
});
