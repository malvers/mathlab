/* js/buch-it/gy11lk.js — Italian for the widgets of js/buch-gy11lk.js.
 * Loaded by the Italian editions right after js/buch-gy11lk.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 2 (20.10.2026): six books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/gy11lk.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('gy11lk', {
    word: {
        // book it-7 mathegy11lk-it:
        // titelbildgy11lk
        'Titelbild: eine Kurve mit Tangente, der Epsilon-Delta-Streifen um einen Punkt und eine Fixpunktiteration als Spinnennetz':
            'Copertina: una curva con la sua tangente, la striscia epsilon-delta intorno a un punto e un’iterazione di punto fisso a forma di ragnatela',
        // epsdelta
        'x² bei 1': 'x² in 1', '(x² − 4)/(x − 2) bei 2': '(x² − 4)/(x − 2) in 2', 'sin x / x bei 0': 'sin x / x in 0', '√x bei 4': '√x in 4', 'Sprung bei 0': 'Salto in 0',
        'Streifenbreite $\\varepsilon$': 'Larghezza della striscia $\\varepsilon$',
        'Graph mit einem waagerechten Streifen der Breite Epsilon um den Grenzwert und einem senkrechten Streifen der Breite Delta um die Stelle':
            'Grafico con una striscia orizzontale di larghezza epsilon intorno al limite e una striscia verticale di larghezza delta intorno al punto',
        // stetigkeit
        'zwei Parabel- und Geradenstücke': 'Tratti di parabola e di retta', 'Parameter $a$': 'Parametro $a$', 'Gerade und Wurzel': 'Retta e radice', 'Lücke füllen': 'Colmare il buco',
        'Funktionswert $b$ an der Stelle 1': 'Valore della funzione $b$ nel punto 1',
        'Abschnittsweise definierte Funktion mit Übergangsstelle': 'Funzione definita a tratti con un punto di raccordo',
        // linapprox
        'eˣ bei 0': 'eˣ in 0', 'sin x bei 0': 'sin x in 0', 'ln x bei 1': 'ln x in 1',
        'Ausschnitt: halbe Breite $r$': 'Finestra: semiampiezza $r$',
        'Funktionsgraph und Tangente in einem Ausschnitt, der sich verkleinern lässt': 'Grafico della funzione e tangente in una finestra che si può rimpicciolire',
        // ablnachdef
        'Schrittweite $h = 10^{-k}$': 'Passo $h = 10^{-k}$', '$a = e$ setzen': 'Poni $a = e$', 'Tangente': 'Tangente',
        'Graph von a hoch x mit Sekante durch (0|1) und Tangente': 'Grafico di a elevato alla x con la secante per (0, 1) e la tangente',
        // produktregel
        'Zuwachs $h$ von $x$': 'Incremento $h$ di $x$',
        'Rechteck mit den Seiten u und v und seinem Zuwachs aus zwei Streifen und einer Ecke': 'Rettangolo di lati u e v con il suo incremento, fatto di due strisce e un angolo',
        // randextrema
        'Funktionsgraph mit einem Intervall, seinen lokalen und globalen Extrema': 'Grafico della funzione con un intervallo e i suoi estremi relativi e assoluti',
        'linker Rand $a$': 'estremo sinistro $a$', 'rechter Rand $b$': 'estremo destro $b$',
        'lokales Maximum': 'massimo relativo', 'lokales Minimum': 'minimo relativo', 'Rand': 'estremo dell’intervallo', 'Art': 'Tipo',
        'Globales Maximum': 'Massimo assoluto', 'globales Minimum': 'minimo assoluto',
        // drehraum
        'Dieses Bild braucht js/buch-vektoren.js.': 'Questa figura richiede js/buch-vektoren.js.',
        'Drehachse:': 'Asse di rotazione:', 'Drehachse': 'Asse di rotazione', 'x-Achse': 'asse x', 'y-Achse': 'asse y', 'z-Achse': 'asse z',
        'Ein Haus wird im Raum um eine Koordinatenachse gedreht': 'Una casa ruota nello spazio intorno a un asse coordinato',
        // verflechtung (names as in the text of chapter 2: cacao, zucchero, latte, fondente, al latte; "Classic" and "Mix" stay as product names)
        'Kakao': 'Cacao', 'Zucker': 'Zucchero', 'Milch': 'Latte', 'Zartbitter': 'Fondente', 'Vollmilch': 'Al latte',
        'Tafeln „Classic“ $e_1$': 'Tavolette «Classic» $e_1$', 'Boxen „Mix“ $e_2$': 'Scatole «Mix» $e_2$',
        'Gozinto-Graph: drei Rohstoffe, zwei Zwischenprodukte, zwei Endprodukte, an den Pfeilen die benötigten Mengen':
            'Grafo di Gozinto: tre materie prime, due semilavorati, due prodotti finiti e, sulle frecce, le quantità necessarie',
        // rettung
        'Tempo im Sand $v_1$ (m/s)': 'Velocità sulla sabbia $v_1$ (m/s)', 'Tempo im Wasser $v_2$ (m/s)': 'Velocità in acqua $v_2$ (m/s)', 'Sand': 'Sabbia', 'Wasser': 'Acqua',
        'Strand und Wasser: der Weg der Rettungsschwimmerin von A über den Punkt P an der Wasserlinie zum Schwimmer B':
            'Spiaggia e acqua: il percorso della bagnina da A, passando per il punto P sulla battigia, fino al nuotatore B',
        'Die Zeit T in Abhängigkeit vom Punkt x, an dem sie ins Wasser geht': 'Il tempo T in funzione del punto x in cui entra in acqua',
        // fixpunkt
        'Funktion φ': 'Funzione φ', 'Nächster Schritt': 'Passo successivo', '10 Schritte': '10 passi',
        'Fixpunktiteration: Spinnennetz zwischen dem Graphen von φ und der Geraden y = x': 'Iterazione di punto fisso: ragnatela tra il grafico di φ e la retta y = x',

    },
    phrase: [
        // book it-7 mathegy11lk-it:
        // epsdelta
        ['\\text{ rechts, } ', '\\text{ da destra, } '], ['\\text{ links, also } ', '\\text{ da sinistra, quindi } '],
        ['$, Behauptung: $', '$; affermazione: $'], ['$. Orange: alle $y$ mit $|y - ', '$. Arancione: tutti gli $y$ con $|y - '],
        ['Blau: Für alle $x \\neq ', 'Blu: per ogni $x \\neq '], ['$ mit $|x - ', '$ con $|x - '],
        ['| < \\delta$ liegt $f(x)$ im orangen Streifen. Das größte passende $\\delta$ ist hier etwa ', '| < \\delta$, $f(x)$ sta nella striscia arancione. Il più grande $\\delta$ che va bene qui è circa '],
        [' (exakt: $', ' (esattamente: $'],
        ['. Mach $\\varepsilon$ kleiner: Es gibt immer noch ein $\\delta > 0$. Genau das heißt „Grenzwert“.', '. Rendi $\\varepsilon$ più piccolo: c’è sempre ancora un $\\delta > 0$. È proprio questo che significa «limite».'],
        ['Kein $\\delta$ passt:', 'Nessun $\\delta$ va bene:'],
        ['So nah man der 0 von links auch kommt, dort ist $f(x) = -1$, also mindestens 2 vom behaupteten Grenzwert entfernt. Für $\\varepsilon < 2$ scheitert jede Wahl. Die Funktion hat bei 0 keinen Grenzwert, nur einseitige.',
            'Per quanto ci si avvicini a 0 da sinistra, lì $f(x) = -1$, cioè dista almeno 2 dal limite affermato. Per $\\varepsilon < 2$ ogni scelta fallisce. In 0 la funzione non ha limite, ha solo il limite sinistro e il limite destro.'],
        // stetigkeit
        ['Stetig an der Stelle ', 'Continua nel punto '],
        ['linksseitiger Grenzwert, rechtsseitiger Grenzwert und Funktionswert stimmen überein. Der Graph lässt sich ohne Absetzen zeichnen.',
            'limite sinistro, limite destro e valore della funzione coincidono. Il grafico si può disegnare senza staccare la penna dal foglio.'],
        ['Sprungstelle:</b> Die einseitigen Grenzwerte sind verschieden, der Graph springt um ', 'Punto di salto:</b> il limite sinistro e il limite destro sono diversi, il grafico salta di '],
        ['. Stetig wird $f$ nur für $', '. $f$ diventa continua solo per $'],
        ['Hebbare Unstetigkeit:</b> Der Grenzwert ', 'Discontinuità eliminabile:</b> il limite '], [' existiert, aber der Funktionswert ist ', ' esiste, ma il valore della funzione è '],
        ['. Mit $b = ', '. Con $b = '], ['$ wird die Lücke geschlossen.', '$ il buco si chiude.'],
        // linapprox
        ['$, Tangente in $x_0 = ', '$, tangente in $x_0 = '], ['$, also $f(x_0 + h) \\approx ', '$, quindi $f(x_0 + h) \\approx '],
        ['Am Rand des Ausschnitts ($h = \\pm', 'Al bordo della finestra ($h = \\pm'], ['$) weicht die Tangente höchstens um ', '$) la tangente si discosta al massimo di '],
        [' ab, das sind ', ', cioè '],
        [' pro Einheit von $h$. Verkleinere $r$: Der Fehler schrumpft schneller als $h$, die Kurve sieht im Kleinen aus wie ihre Tangente.',
            ' per unità di $h$. Rimpicciolisci $r$: l’errore diminuisce più in fretta di $h$; vista da vicino, la curva sembra la sua tangente.'],
        // ablnachdef (the point rule has already made (0 \mid 1) into (0, 1))
        [': Es genügt, den Grenzwert von $\\dfrac{a^h - 1}{h}$ für $h \\to 0$ zu kennen, den Anstieg in $(0, 1)$.',
            ': basta conoscere il limite di $\\dfrac{a^h - 1}{h}$ per $h \\to 0$, cioè la pendenza in $(0, 1)$.'],
        ['Für $a = ', 'Per $a = '], ['$ geht der Quotient gegen $\\ln a \\approx ', '$ il rapporto tende a $\\ln a \\approx '],
        ['$, also $\\left(a^x\\right)\' = \\ln a \\cdot a^x$. ', '$, quindi $\\left(a^x\\right)\' = \\ln a \\cdot a^x$. '],
        ['Für $a = e$ ist der Grenzwert genau 1: ', 'Per $a = e$ il limite è esattamente 1: '],
        ['Bei welcher Basis ist der Grenzwert genau 1?', 'Per quale base il limite è esattamente 1?'],
        // produktregel
        ['$ bei $x = 1{,}5$. Wächst $x$ um $h$, wächst die Fläche $u \\cdot v$ um zwei Streifen und eine Ecke:', '$ in $x = 1{,}5$. Se $x$ cresce di $h$, l’area $u \\cdot v$ cresce di due strisce e un angolo:'],
        ['Für $h \\to 0$ geht die Ecke $\\Delta u \\cdot \\tfrac{\\Delta v}{h}$ gegen $0 \\cdot v\'$, übrig bleibt $', 'Per $h \\to 0$ l’angolo $\\Delta u \\cdot \\tfrac{\\Delta v}{h}$ tende a $0 \\cdot v\'$ e resta $'],
        ['$: die <b>Produktregel</b>.', '$: la <b>regola del prodotto</b>.'],
        // randextrema
        ['$ auf $[', '$ su $['],
        [']$. Kandidaten: die Stellen mit $f\'(x) = 0$ und Vorzeichenwechsel im Inneren, dazu die beiden Ränder.', ']$. Candidati: i punti interni con $f\'(x) = 0$ e cambio di segno, più i due estremi dell’intervallo.'],
        [' auf dem Intervall. ', ' sull’intervallo. '],
        ['Ein globales Extremum liegt am <b>Rand</b>: Dort ist $f\'$ nicht null.', 'Un estremo assoluto sta in un <b>estremo dell’intervallo</b>: lì $f\'$ non è zero.'],
        ['Hier liegen beide globalen Extrema im Inneren.', 'Qui entrambi gli estremi assoluti stanno all’interno.'],
        // drehraum: "Drehung um die x-Achse um 90°"
        ['Drehung um die ', 'Rotazione intorno all’asse '], ['-Achse um ', ' di '],
        ['$. Die Koordinate längs der Drehachse bleibt gleich, ', '$. La coordinata lungo l’asse di rotazione resta uguale, '],
        ['die beiden anderen werden wie in der Ebene gedreht.', 'le altre due ruotano come nel piano.'],
        // verflechtung
        ['Zwischenprodukte: $', 'Semilavorati: $'], ['Rohstoffe: $', 'materie prime: $'], ['In einem Schritt: $', 'In un solo passo: $'],
        ['$ gibt den Rohstoffbedarf je Endprodukt an, und $', '$ dà il fabbisogno di materie prime per prodotto finito, e $'],
        ['Für ', 'Per '], [' Tafeln und ', ' tavolette e '], [' Boxen braucht man ', ' scatole servono '],
        [' ME Kakao, ', ' unità di cacao, '], [' ME Zucker und ', ' unità di zucchero e '], [' ME Milch', ' unità di latte'], [' ME', ' u.'],
        // rettung
        ['Bei $x = ', 'Con $x = '], ['$ m braucht sie ', '$ m impiega '], [' s, am schnellsten ist sie bei ', ' s; il tempo più breve lo ottiene con '],
        ['$ m</b> mit ', '$ m</b>: '], [' s (grün).', ' s (in verde).'],
        ['Winkel zum Lot: im Sand $\\alpha = ', 'Angoli con la normale: sulla sabbia $\\alpha = '], ['$, im Wasser $\\beta = ', '$, in acqua $\\beta = '],
        ['$. Im Optimum ist $\\dfrac{\\sin\\alpha}{v_1} = \\dfrac{\\sin\\beta}{v_2}$: ', '$. Nel punto ottimale vale $\\dfrac{\\sin\\alpha}{v_1} = \\dfrac{\\sin\\beta}{v_2}$: '],
        ['$ und $\\dfrac{\\sin ', '$ e $\\dfrac{\\sin '], ['$, das Brechungsgesetz.', '$: la legge della rifrazione.'],
        // fixpunkt
        ['Hier ist $\\varphi\'(x^*) = 0$: Die Folge konvergiert extrem schnell, die Zahl der richtigen Stellen verdoppelt sich etwa bei jedem Schritt (das ist das Newton-Verfahren für $x^2 - 2 = 0$).',
            'Qui $\\varphi\'(x^*) = 0$: la successione converge molto in fretta e il numero di cifre corrette circa raddoppia a ogni passo (è il metodo di Newton per $x^2 - 2 = 0$).'],
        ['Wegen $|\\varphi\'(x^*)| < 1$ ist der Fixpunkt <b>anziehend</b>: Nahe bei $x^*$ schrumpft der Fehler bei jedem Schritt etwa um diesen Faktor.',
            'Poiché $|\\varphi\'(x^*)| < 1$, il punto fisso è <b>attrattivo</b>: vicino a $x^*$ l’errore si riduce a ogni passo all’incirca di questo fattore.'],
        [' Weil $\\varphi\' < 0$ ist, springt die Folge um den Fixpunkt herum (Spirale).', ' Poiché $\\varphi\' < 0$, la successione salta da una parte all’altra del punto fisso (spirale).'],
        [' Weil $\\varphi\' > 0$ ist, nähert sie sich von einer Seite (Treppe).', ' Poiché $\\varphi\' > 0$, si avvicina da un solo lato (scala).'],
        ['Hier ist $|\\varphi\'(x^*)| = 1$: Der Satz sagt nichts. Bei $\\varphi(x) = \\tfrac2x$ springt die Folge ewig zwischen zwei Werten hin und her, ein Zyklus.',
            'Qui $|\\varphi\'(x^*)| = 1$: il teorema non dice nulla. Con $\\varphi(x) = \\tfrac2x$ la successione salta all’infinito avanti e indietro tra due valori: un ciclo.'],
        ['Wegen $|\\varphi\'(x^*)| > 1$ ist der Fixpunkt <b>abstoßend</b>: Selbst ganz nahe bei $x^*$ wächst der Fehler, die Folge läuft weg.',
            'Poiché $|\\varphi\'(x^*)| > 1$, il punto fisso è <b>repulsivo</b>: anche molto vicino a $x^*$ l’errore cresce e la successione si allontana.'],
        ['$ mit $\\varphi(x) = ', '$ con $\\varphi(x) = '], ['$, Fixpunkt $x^* \\approx ', '$, punto fisso $x^* \\approx '],
        ['$ (grün), $|\\varphi\'(x^*)| \\approx ', '$ (in verde), $|\\varphi\'(x^*)| \\approx '], ['\\text{sehr groß}', '\\text{molto grande}'],

    ],
    rule: [
        // book it-7 mathegy11lk-it:
        // randextrema: the interval "[-2;\, 3]" (a space after \,) → "[-2, 3]"; with a decimal comma the semicolon stays
        [/\[([-−]?\d+(?:\{,\}\d+)?);\\, ([-−]?\d+(?:\{,\}\d+)?)\]/g, (m, a, b) => /,/.test(a + b) ? m : '[' + a + ', ' + b + ']'],

    ]
});
