/* js/buch-it/gy12lk.js — Italian for the widgets of js/buch-gy12lk.js.
 * Loaded by the Italian editions right after js/buch-gy12lk.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 2 (20.10.2026): six books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/gy12lk.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('gy12lk', {
    word: {
        // book it-9 mathegy12lk-it:
        // titelbildgy12lk
        'Titelbild: ein Rotationskörper mit Kreisscheiben, ein Binomialhistogramm unter der Glockenkurve, zwei windschiefe Geraden mit ihrem kürzesten Verbindungsstück':
            'Copertina: un solido di rotazione con dischi, un istogramma binomiale sotto la curva a campana, due rette sghembe con il loro segmento di minima distanza',
        // normalverteilung
        'Erwartungswert $\\mu$': 'Valore atteso $\\mu$', 'Standardabweichung $\\sigma$': 'Deviazione standard $\\sigma$', '$\\sigma$-Regeln': 'Regole $\\sigma$',
        'Was wird berechnet?': 'Che cosa si calcola?', 'Dichte': 'Densità', 'Verteilungsfunktion': 'Funzione di ripartizione', 'Ansicht': 'Vista',
        'Dichtefunktion der Normalverteilung mit markierter Fläche': 'Funzione di densità della distribuzione normale con un’area evidenziata',
        // moivre
        'Anzahl der Versuche $n$': 'Numero di prove $n$', 'Trefferwahrscheinlichkeit $p$': 'Probabilità di successo $p$', 'Histogramm': 'Istogramma', 'standardisiert': 'standardizzato',
        'Histogramm der Binomialverteilung mit der Glockenkurve gleichen Erwartungswerts und gleicher Standardabweichung':
            'Istogramma della distribuzione binomiale con la curva a campana di uguale valore atteso e uguale deviazione standard',
        'erfüllt': 'soddisfatta', 'nicht erfüllt': 'non soddisfatta',
        // rotation
        'Kegel': 'Cono', 'Kugel': 'Sfera', 'Paraboloid': 'Paraboloide', 'Fass': 'Botte', 'Welcher Körper?': 'Quale solido?', 'Kreisscheiben $n$': 'Dischi $n$', 'aus': 'nessuno',
        'Ziehen zum Drehen': 'Trascina per ruotare',
        'Rotationskörper im räumlichen Koordinatensystem, durch Ziehen drehbar': 'Solido di rotazione in un sistema di coordinate nello spazio, si ruota trascinando',
        'Schalte Kreisscheiben zu: Jede Scheibe hat das Volumen $\\pi \\, r^2 \\, \\Delta x$ mit $r = f(x)$.':
            'Aggiungi i dischi: ogni disco ha il volume $\\pi \\, r^2 \\, \\Delta x$ con $r = f(x)$.',
        // integralfunktion, uneigentlich
        'Welche Funktion?': 'Quale funzione?', 'untere Grenze $a$': 'estremo inferiore $a$', 'obere Grenze $b$': 'estremo superiore $b$', 'Grenze': 'Estremo',
        'Graph von f mit der Fläche von a bis x': 'Grafico di f con l’area da a a x', 'Graph der Integralfunktion mit Tangente': 'Grafico della funzione integrale con la tangente',
        '1/√x bei 0': '1/√x in 0', 'Fläche unter einer Kurve bis zu einer verschiebbaren Grenze': 'Area sotto una curva fino a un estremo spostabile',
        // hesse2d
        'Richtung des Normalenvektors': 'Direzione del vettore normale',
        'Gerade mit Normaleneinheitsvektor, ein Punkt P und sein Lot auf die Gerade': 'Retta con il versore normale, un punto P e la sua perpendicolare alla retta',
        // simpson ("Trapez" as in js/buch-it/vektoren.js)
        'Anzahl der Streifen $n$ (gerade)': 'Numero di strisce $n$ (pari)', 'Graph mit Parabelbögen über je zwei Streifen': 'Grafico con archi di parabola su ogni coppia di strisce',
        'Trapez': 'Trapezio', 'Fehler': 'Errore',
        // abstand3d
        'Das 3D-Modul fehlt.': 'Manca il modulo 3D.', 'Beispiel 3': 'Esempio 3', 'Ursprungsgerade': 'Retta per l’origine', 'P auf g': 'P su g',

    },
    phrase: [
        // book it-9 mathegy12lk-it:
        // normalverteilung
        ['$ mit $\\mu = ', '$ con $\\mu = '], ['$ und $\\sigma = ', '$ e $\\sigma = '],
        ['Standardisieren: $Z = \\dfrac{X - \\mu}{\\sigma}$ ist standardnormalverteilt.', 'Standardizzare: $Z = \\dfrac{X - \\mu}{\\sigma}$ ha distribuzione normale standard.'],
        ['. Das ist die gelbe Fläche.', '. È l’area gialla.'], ['. Das ist der gelbe Anstieg der Verteilungsfunktion.', '. È la salita gialla della funzione di ripartizione.'],
        // moivre
        ['Erwartungswert $\\mu = n', 'Valore atteso $\\mu = n'], ['$, Standardabweichung $\\sigma = \\sqrt{', '$, deviazione standard $\\sigma = \\sqrt{'],
        ['Laplace-Bedingung $\\sigma > 3$: ', 'Condizione di Laplace $\\sigma > 3$: '],
        ['Standardisiert: Jede Säule wird um $\\mu$ verschoben, in der Breite durch $\\sigma$ geteilt und in der Höhe mit $\\sigma$ multipliziert. Für großes $n$ legen sich alle Histogramme auf dieselbe Kurve $\\varphi$.',
            'Standardizzato: ogni colonna viene traslata di $\\mu$, la sua larghezza viene divisa per $\\sigma$ e la sua altezza moltiplicata per $\\sigma$. Per $n$ grande tutti gli istogrammi si dispongono sulla stessa curva $\\varphi$.'],
        ['Größte Abweichung zwischen $P(X = k)$ und der Glockenkurve an der Stelle $k$: $', 'Scarto massimo tra $P(X = k)$ e la curva a campana nel punto $k$: $'],
        // rotation
        ['$ auf $[', '$ su $['], [']$ dreht sich um die $x$-Achse: ', ']$ ruota attorno all’asse $x$: '], ['Summe der ', 'Somma dei '],
        [' Kreisscheiben (Radius in der Mitte jedes Streifens): $', ' dischi (raggio al centro di ogni striscia): $'], ['$, Abweichung $', '$, scarto $'],
        // integralfunktion
        [' (x links von a: das Integral zählt rückwärts)', ' (x a sinistra di a: l’integrale conta all’indietro)'], ['An der Stelle $x = ', 'Nel punto $x = '],
        ['Die pinke Tangente an $I$ hat die Steigung $', 'La tangente rosa a $I$ ha la pendenza $'], ['$, und das ist genau $f(', '$, ed è proprio $f('],
        [')$. Das ist der Hauptsatz: $I_a\'(x) = f(x)$.', ')$. È il teorema fondamentale: $I_a\'(x) = f(x)$.'],
        // hesse2d
        ['Hessesche Normalform: $', 'Forma normale di Hesse: $'], ['mit $|\\vec n_0| = 1$.', 'con $|\\vec n_0| = 1$.'], ['Punkt einsetzen: $', 'Sostituire il punto: $'],
        ['Abstand $d(P, g) \\approx ', 'Distanza $d(P, g) \\approx '], ['P liegt auf der Geraden.', 'P giace sulla retta.'],
        ['Positiv: P liegt auf der Seite, in die $\\vec n_0$ zeigt.', 'Positivo: P sta dalla parte verso cui punta $\\vec n_0$.'], ['Negativ: P liegt auf der anderen Seite.', 'Negativo: P sta dall’altra parte.'],
        // simpson
        ['$. Simpson mit $n = ', '$. Simpson con $n = '],
        ['Doppelt so viele Streifen: Trapezfehler etwa durch $', 'Con il doppio delle strisce l’errore dei trapezi si divide circa per $'], ['$, Simpsonfehler etwa durch $', '$, quello di Simpson circa per $'],
        ['$ geteilt. ', '$. '],
        ['Abbruchregel „zwei Simpson-Werte unterscheiden sich um weniger als $10^{-6}$“: ', 'Criterio di arresto «due valori di Simpson differiscono di meno di $10^{-6}$»: '],
        ['erfüllt ab $n = ', 'soddisfatto da $n = '], ['erst sehr spät erfüllt.', 'soddisfatto solo molto tardi.'],
        // abstand3d
        ['Lotfußpunkt: $\\big(', 'Piede della perpendicolare: $\\big('], ['$ gibt $t = ', '$ dà $t = '], ['$, also $F(', '$, quindi $F('], [')$ und $d(P, g) = ', ')$ e $d(P, g) = '],
        ['Kontrolle mit dem Vektorprodukt: $', 'Controllo con il prodotto vettoriale: $'], ['. $P$ liegt auf $g$.', '. $P$ giace su $g$.'],
        ['$: Die Geraden sind parallel. Dann ist ihr Abstand der Abstand des Punktes $Q$ von $g$: $d ', '$: le rette sono parallele. Allora la loro distanza è la distanza del punto $Q$ da $g$: $d '],
        [', sie sind identisch.', ': sono coincidenti.'],
        ['$ steht auf beiden Geraden senkrecht, $|\\vec{n}| ', '$ è perpendicolare a entrambe le rette, $|\\vec{n}| '],
        ['. Abstand $0$: Die Geraden <b>schneiden</b> sich in $S(', '. Distanza $0$: le rette si <b>intersecano</b> in $S('],
        ['. <b>Windschief</b>; das kürzeste Verbindungsstück (pink) verbindet $F(', '. <b>Sghembe</b>: il segmento di minima distanza (rosa) unisce $F('], [')$ und $G(', ')$ e $G('],
        // uneigentlich
        [' (die Grenze liegt weit rechts außerhalb des Bildes)', ' (l’estremo è molto a destra, fuori dalla figura)'], ['Grenzwert: $', 'Limite: $'],
        [': Die Fläche ist unbegrenzt, obwohl der Graph sich der Achse nähert.', ': l’area è infinita, anche se il grafico si avvicina all’asse.'],
        [': Die unbegrenzte Fläche hat einen endlichen Inhalt.', ': la regione illimitata ha un’area finita.'],

    ],
    rule: [
        // book it-9 mathegy12lk-it:
        // normalverteilung: N(\mu;\ \sigma^2) → N(\mu, \sigma^2) · rotation: [0;\ 4] → [0, 4] (whole numbers only; with a decimal comma the semicolon stays)
        [/N\(\\mu;\\ \\sigma\^2\)/g, 'N(\\mu, \\sigma^2)'],
        [/\[(-?\d+);\\ (-?\d+)\]/g, '[$1, $2]'],

    ]
});
