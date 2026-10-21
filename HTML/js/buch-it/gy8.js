/* js/buch-it/gy8.js — Italian for the widgets of js/buch-gy8.js.
 * Loaded by the Italian editions right after js/buch-gy8.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 3 (20.10.2026): eleven books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/gy8.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('gy8', {
    word: {
        // book it-13 mathegy8-it:
        // titelbildgy8
        'Titelbild: ein Dreieck wird von einem Zentrum aus gestreckt, ein Quadrat aus a², zweimal ab und b², zwei Geraden mit ihrem Schnittpunkt und ein Baumdiagramm':
            'Copertina: un triangolo ingrandito a partire da un centro, un quadrato fatto di a², due volte ab e b², due rette con il loro punto di intersezione e un diagramma ad albero',
        // termbaum8
        'Term': 'Espressione', 'Wert für $x$': 'Valore di $x$',
        'Tipp auf einen Knoten: Dann leuchtet sein Teilterm auf.': 'Tocca un nodo: si illumina la sua sottoespressione.',
        // binomformeln8
        '1. Formel': '1ª formula', '2. Formel': '2ª formula', '3. Formel': '3ª formula', 'Binomische Formel': 'Prodotto notevole',
        'Länge $a$': 'Lunghezza $a$', 'Länge $b$': 'Lunghezza $b$', 'Binomische Formel als Flächenbild': 'Prodotto notevole come figura di aree',
        'Das große Quadrat besteht aus vier Teilen: $a^2$, zweimal $ab$ und $b^2$. Wer nur $a^2 + b^2$ rechnet, vergisst die beiden blauen Rechtecke.':
            'Il quadrato grande è formato da quattro parti: $a^2$, due volte $ab$ e $b^2$. Chi calcola solo $a^2 + b^2$ dimentica i due rettangoli blu.',
        'Vom Quadrat $a^2$ nimmst du die beiden roten Streifen $ab$ weg. Das grüne Eckquadrat $b^2$ steckt in beiden Streifen, du hast es also zweimal weggenommen. Einmal kommt es zurück: $+\\,b^2$.':
            'Dal quadrato $a^2$ togli le due strisce rosse $ab$. Il quadratino verde nell’angolo, $b^2$, sta in entrambe le strisce, quindi l’hai tolto due volte. Una volta lo rimetti: $+\\,b^2$.',
        'Aus dem Quadrat $a^2$ wird die Ecke $b^2$ herausgeschnitten. Das blaue Stück wird gedreht und rechts angelegt: Es entsteht ein Rechteck mit den Seiten $a + b$ und $a - b$.':
            'Dal quadrato $a^2$ si ritaglia l’angolo $b^2$. Il pezzo blu viene ruotato e accostato a destra: si ottiene un rettangolo di lati $a + b$ e $a - b$.',
        // gluecksrad8
        'Felder': 'Settori', 'ein Feld weniger': 'un settore in meno', 'ein Feld mehr': 'un settore in più',
        'gleich groß': 'uguali', 'verschieden groß': 'diversi', 'Größe der Felder': 'Ampiezza dei settori', 'Drehen': 'Gira',
        'Tippe Felder im Rad an: Sie bilden das Ereignis $E$ (gelb). Dann dreh das Rad.': 'Tocca i settori della ruota: formano l’evento $E$ (in giallo). Poi gira la ruota.',
        // wegzeit8
        'Zeit $t$ in min': 'Tempo $t$ in min', 'Weg-Zeit-Diagramm des Schulwegs': 'Diagramma spazio-tempo del tragitto casa-scuola',
        'Zuhause': 'Casa', 'Haltestelle': 'Fermata', 'Schule': 'Scuola',
        'Der Schulweg als Strecke, der Punkt zeigt, wo Mia gerade ist': 'Il tragitto casa-scuola come segmento; il punto mostra dove si trova Mia in questo momento',
        'Mia ist in der Schule angekommen.': 'Mia è arrivata a scuola.',
        // lgs8
        'Einsetzungsverfahren': 'Sostituzione', 'Gleichsetzungsverfahren': 'Confronto', 'Additionsverfahren': 'Riduzione', 'Verfahren': 'Metodo',
        'Nächster Schritt': 'Passo successivo', 'Alle Schritte': 'Tutti i passi', 'Neues Gleichungssystem': 'Nuovo sistema',
        'Die beiden Geraden des Gleichungssystems und ihr Schnittpunkt': 'Le due rette del sistema e il loro punto di intersezione',
        'Klammer auflösen und zusammenfassen.': 'Togli le parentesi e riduci i termini simili.',
        'Löse beide Gleichungen nach $y$ auf.': 'Ricava $y$ da entrambe le equazioni.',
        'Die rechten Seiten sind beide gleich $y$, also sind sie gleich: Gleichsetzen.': 'I secondi membri sono entrambi uguali a $y$, quindi sono uguali tra loro: si confrontano.',
        'Alle $x$ nach links, alle Zahlen nach rechts, dann teilen.': 'Tutte le $x$ a sinistra, tutti i numeri a destra, poi dividi.',
        'Multipliziere so, dass die Zahlen vor $y$ entgegengesetzt gleich werden.': 'Moltiplica in modo che i coefficienti di $y$ diventino opposti.',
        'Addiere die beiden Gleichungen: $y$ fällt weg.': 'Somma le due equazioni: $y$ sparisce.',
        'Nach $x$ auflösen.': 'Ricava $x$.', 'Nach $y$ auflösen.': 'Ricava $y$.',
        // streckung8
        'Streckfaktor $k$': 'Rapporto di omotetia $k$', 'Original': 'Originale', 'Verhältnis': 'Rapporto', 'Winkel bei $A$': 'Angolo in $A$', 'gleich': 'uguale',
        'Zieh an $Z$, $A$, $B$ und $C$. Die gestrichelten Strahlen beginnen in $Z$ und gehen durch Punkt und Bildpunkt.':
            'Trascina $Z$, $A$, $B$ e $C$. Le semirette tratteggiate partono da $Z$ e passano per ogni punto e per la sua immagine.',
        // aehnlich8
        'Ein Beispiel zeigen': 'Mostra un esempio', 'gegeben': 'dato', 'dein Dreieck': 'il tuo triangolo',
        'Ein gegebenes Dreieck und ein zweites Dreieck zum Vergleichen': 'Un triangolo dato e un secondo triangolo da confrontare',
        'klein': 'piccolo', 'mittel': 'medio', 'groß': 'grande', 'Winkel, gegeben': 'Angoli del dato', 'Winkel bei dir': 'I tuoi angoli', 'Seiten­verhältnis': 'Rapporto tra i lati',
        'Zieh die gelben Ecken auf die Gitterpunkte. Schaffst du ein Dreieck, das ähnlich zum gegebenen ist, aber anders liegt?':
            'Trascina i vertici gialli sui punti della griglia. Riesci a costruire un triangolo simile a quello dato, ma in un’altra posizione?',
        // gulliver8
        'Streckfaktor': 'Rapporto di omotetia', 'großer Würfel': 'Cubo grande', 'Faktor': 'Fattore',
        'Kantenlänge': 'Spigolo', 'Oberfläche': 'Superficie totale', 'Volumen': 'Volume',
        'Gulliver ist 12-mal so groß wie ein Liliputaner. Seine Haut hat also die $144$-fache Fläche, sein Körper das $1728$-fache Volumen. Bei Jonathan Swift rechnen die Mathematiker des Kaisers genau so und geben ihm jeden Tag Essen für 1724 Liliputaner, vier weniger als $12^3$.':
            'Gulliver è 12 volte più alto di un lillipuziano. La sua pelle ha quindi un’area $144$ volte più grande, il suo corpo un volume $1728$ volte più grande. Nel libro di Jonathan Swift i matematici dell’imperatore fanno proprio questo calcolo e gli danno ogni giorno cibo per 1724 lillipuziani, quattro in meno di $12^3$.',
        // schatten8
        'Schattenmethode': 'Metodo dell’ombra', 'Försterdreieck': 'Triangolo del forestale', 'Methode': 'Metodo', 'Sonnenhöhe': 'Altezza del sole',
        'Abstand $d$ zum Baum': 'Distanza $d$ dall’albero', 'Höhe ausrechnen': 'Calcola l’altezza', 'Neuer Baum': 'Nuovo albero', 'Stab 2 m': 'Asta 2 m',
        'Baum und Stab mit ihren Schatten': 'Albero e asta con le loro ombre', 'Höhenmessung mit dem Försterdreieck': 'Misura dell’altezza con il triangolo del forestale',
        'Die Sonnenstrahlen fallen parallel ein. Das blaue und das gelbe Dreieck sind deshalb ähnlich: $\\dfrac{H}{2\\,\\text{m}} = \\dfrac{S}{s}$.':
            'I raggi del sole arrivano paralleli. Per questo il triangolo blu e quello giallo sono simili: $\\dfrac{H}{2\\,\\text{m}} = \\dfrac{S}{s}$.',
        // rueckwaerts8
        'Rückwärts: ein Schritt': 'A ritroso: un passo', 'Neues Rätsel': 'Nuovo rompicapo', 'Startzahl': 'Numero iniziale', 'Richtig!': 'Giusto!',
        'Probier eine Zahl im ersten Kästchen, oder rechne rückwärts: Jede Rechnung wird durch ihre Umkehrung ersetzt, plus durch minus, mal durch geteilt.':
            'Prova un numero nella prima casella oppure calcola a ritroso: ogni operazione si sostituisce con la sua inversa, più con meno, per con diviso.',
        // sammel8
        'Größe des Albums': 'Dimensione dell’album', 'Eine Tüte öffnen': 'Apri una bustina', 'Bis das Album voll ist': 'Fino ad album completo',
        '1000 Alben': '1000 album', 'Neues Album': 'Nuovo album', 'Mittelwert': 'Media', 'Voll!': 'Completo!',
        'Anzahl der Tüten bis zum vollen Album': 'Numero di bustine fino all’album completo',
        'Histogramm: wie viele Tüten 1000 Alben gebraucht haben': 'Istogramma: quante bustine sono servite per 1000 album',
        // mcpi8
        'Zufallspunkte in einem Quadrat, Treffer im Viertelkreis gelb': 'Punti casuali in un quadrato, quelli nel quarto di cerchio in giallo',
        'Noch keine Punkte. Lass es regnen!': 'Ancora nessun punto. Fai piovere!',
        // ziffern8
        'als Münze': 'come moneta', 'als Würfel': 'come dado', 'Lesart': 'Lettura', 'Neue Tabelle': 'Nuova tabella',
        'Gerade Ziffer (0, 2, 4, 6, 8) = Wappen, ungerade = Zahl. Jede Ziffer ist ein Münzwurf.': 'Cifra pari (0, 2, 4, 6, 8) = testa, dispari = croce. Ogni cifra è un lancio di moneta.',
        'Augenzahl': 'Punteggio', 'absolut': 'assoluta', 'relativ': 'relativa',

        // book it-16 mathe6-it:
        // rueckwaerts8
        'Rückwärts: ein Schritt': 'All’indietro: un passo', 'Alle Schritte': 'Tutti i passi', 'Neues Rätsel': 'Nuovo indovinello', 'Startzahl': 'Numero iniziale',
        'Richtig!': 'Giusto!',
        'Probier eine Zahl im ersten Kästchen, oder rechne rückwärts: Jede Rechnung wird durch ihre Umkehrung ersetzt, plus durch minus, mal durch geteilt.':
            'Prova un numero nella prima casella, oppure calcola all’indietro: ogni operazione si sostituisce con la sua inversa, più con meno, per con diviso.',

        // book it-17 mathe7-it:
        // termbaum8
        'Term': 'Espressione', 'Wert für $x$': 'Valore di $x$',
        'Tipp auf einen Knoten: Dann leuchtet sein Teilterm auf.': 'Tocca un nodo: si illumina la sua sottoespressione.',
        // gluecksrad8
        'Felder': 'Settori', 'ein Feld weniger': 'un settore in meno', 'ein Feld mehr': 'un settore in più',
        'gleich groß': 'uguali', 'verschieden groß': 'diversi', 'Größe der Felder': 'Ampiezza dei settori', 'Drehen': 'Gira',
        'Tippe Felder im Rad an: Sie bilden das Ereignis $E$ (gelb). Dann dreh das Rad.': 'Tocca dei settori della ruota: formano l’evento $E$ (in giallo). Poi gira la ruota.',

        // book it-18 mathe8-it:
        // termbaum8 (OS 8 chapter 1.1)
        'Wert für $x$': 'Valore di $x$',
        'Tipp auf einen Knoten: Dann leuchtet sein Teilterm auf.': 'Tocca un nodo: si illumina la sua sottoespressione.',
        // rueckwaerts8 (OS 8 chapter 1.2)
        'Rückwärts: ein Schritt': 'All’indietro: un passo', 'Neues Rätsel': 'Nuovo indovinello', 'Startzahl': 'Numero di partenza',
        'Probier eine Zahl im ersten Kästchen, oder rechne rückwärts: Jede Rechnung wird durch ihre Umkehrung ersetzt, plus durch minus, mal durch geteilt.':
            'Prova un numero nella prima casella, oppure calcola all’indietro: ogni operazione viene sostituita dalla sua inversa, il più con il meno, il per con il diviso.',
        // wegzeit8
        'Zeit $t$ in min': 'Tempo $t$ in min', 't in min': 't in min', 's in m': 's in m',
        'Weg-Zeit-Diagramm des Schulwegs': 'Diagramma spazio-tempo del tragitto verso scuola',
        'Zuhause': 'Casa', 'Haltestelle': 'Fermata', 'Schule': 'Scuola',
        'Der Schulweg als Strecke, der Punkt zeigt, wo Mia gerade ist': 'Il tragitto verso scuola come segmento: il punto mostra dove si trova Mia in questo momento',
        'Mia ist in der Schule angekommen.': 'Mia è arrivata a scuola.',
        // lgs8
        'Einsetzungsverfahren': 'Sostituzione', 'Gleichsetzungsverfahren': 'Confronto', 'Additionsverfahren': 'Riduzione', 'Verfahren': 'Metodo',
        'Neues Gleichungssystem': 'Nuovo sistema',
        'Die beiden Geraden des Gleichungssystems und ihr Schnittpunkt': 'Le due rette del sistema e il loro punto di intersezione',
        'Klammer auflösen und zusammenfassen.': 'Togli le parentesi e semplifica.',
        'Löse beide Gleichungen nach $y$ auf.': 'Ricava $y$ da entrambe le equazioni.',
        'Die rechten Seiten sind beide gleich $y$, also sind sie gleich: Gleichsetzen.': 'I secondi membri sono entrambi uguali a $y$, quindi sono uguali tra loro: si confrontano.',
        'Alle $x$ nach links, alle Zahlen nach rechts, dann teilen.': 'Tutte le $x$ a sinistra, tutti i numeri a destra, poi dividi.',
        'Multipliziere so, dass die Zahlen vor $y$ entgegengesetzt gleich werden.': 'Moltiplica in modo che i numeri davanti a $y$ diventino opposti.',
        'Addiere die beiden Gleichungen: $y$ fällt weg.': 'Somma le due equazioni: $y$ sparisce.',
        'Nach $x$ auflösen.': 'Ricava $x$.', 'Nach $y$ auflösen.': 'Ricava $y$.',
        // streckung8
        'Streckfaktor $k$': 'Rapporto di omotetia $k$', 'Original': 'Originale', 'Verhältnis': 'Rapporto', 'Winkel bei $A$': 'Angolo in $A$', 'gleich': 'uguale',
        'Zieh an $Z$, $A$, $B$ und $C$. Die gestrichelten Strahlen beginnen in $Z$ und gehen durch Punkt und Bildpunkt.':
            'Trascina $Z$, $A$, $B$ e $C$. Le semirette tratteggiate partono da $Z$ e passano per ogni punto e la sua immagine.',
        // aehnlich8
        'Ein Beispiel zeigen': 'Mostra un esempio', 'gegeben': 'dato', 'dein Dreieck': 'il tuo triangolo',
        'Ein gegebenes Dreieck und ein zweites Dreieck zum Vergleichen': 'Un triangolo dato e un secondo triangolo da confrontare',
        'klein': 'piccolo', 'mittel': 'medio', 'groß': 'grande', 'Winkel, gegeben': 'Angoli del triangolo dato', 'Winkel bei dir': 'I tuoi angoli', 'Seiten­verhältnis': 'Rapporto tra i lati',
        'Zieh die gelben Ecken auf die Gitterpunkte. Schaffst du ein Dreieck, das ähnlich zum gegebenen ist, aber anders liegt?':
            'Trascina i vertici gialli sui punti della griglia. Riesci a fare un triangolo simile a quello dato, ma in un’altra posizione?',
        // gulliver8
        'k = 12 (Gulliver)': 'k = 12 (Gulliver)', 'Streckfaktor': 'Rapporto di omotetia', 'großer Würfel': 'Cubo grande', 'Faktor': 'Fattore', 'Kantenlänge': 'Spigolo',
        // schatten8
        'Schattenmethode': 'Metodo dell’ombra', 'Försterdreieck': 'Triangolo della guardia forestale', 'Methode': 'Metodo', 'Sonnenhöhe': 'Altezza del sole',
        'Abstand $d$ zum Baum': 'Distanza $d$ dall’albero', 'Höhe ausrechnen': 'Calcola l’altezza', 'Neuer Baum': 'Nuovo albero', 'Stab 2 m': 'Bastone 2 m',
        'Baum und Stab mit ihren Schatten': 'Albero e bastone con le loro ombre', 'Höhenmessung mit dem Försterdreieck': 'Misurare un’altezza con il triangolo della guardia forestale',
        'Die Sonnenstrahlen fallen parallel ein. Das blaue und das gelbe Dreieck sind deshalb ähnlich: $\\dfrac{H}{2\\,\\text{m}} = \\dfrac{S}{s}$.':
            'I raggi del sole arrivano paralleli. Per questo il triangolo blu e quello giallo sono simili: $\\dfrac{H}{2\\,\\text{m}} = \\dfrac{S}{s}$.',
        'Deine Peillinie geht über die Spitze hinweg: Geh näher heran.': 'La tua linea di mira passa sopra la cima: avvicinati.',
        // gluecksrad8
        'Felder': 'Settori', 'ein Feld weniger': 'un settore in meno', 'ein Feld mehr': 'un settore in più',
        'gleich groß': 'uguali', 'verschieden groß': 'diversi', 'Größe der Felder': 'Grandezza dei settori', 'Drehen': 'Gira',
        'Tippe Felder im Rad an: Sie bilden das Ereignis $E$ (gelb). Dann dreh das Rad.': 'Tocca i settori della ruota: formano l’evento $E$ (in giallo). Poi gira la ruota.',
        // sammel8
        'Größe des Albums': 'Grandezza dell’album', 'Eine Tüte öffnen': 'Apri una bustina', 'Bis das Album voll ist': 'Fino all’album completo',
        '1000 Alben': '1000 album', 'Neues Album': 'Nuovo album', 'Mittelwert': 'Media', 'Anzahl der Tüten bis zum vollen Album': 'Numero di bustine fino all’album completo',
        'Histogramm: wie viele Tüten 1000 Alben gebraucht haben': 'Istogramma: quante bustine sono servite per 1000 album', 'Voll!': 'Completo!',

        // book it-20 mathe10-it:
        'gleich': 'uguale',
        'Schattenmethode': 'Metodo dell’ombra',
        'Försterdreieck': 'Triangolo del guardaboschi',
        'Methode': 'Metodo',
        'Sonnenhöhe': 'Altezza del sole',
        'Abstand $d$ zum Baum': 'Distanza $d$ dall’albero',
        'Höhe ausrechnen': 'Calcola l’altezza',
        'Neuer Baum': 'Nuovo albero',
        'Stab 2 m': 'Asta 2 m',
        'Baum und Stab mit ihren Schatten': 'Albero e asta con le loro ombre',
        'Höhenmessung mit dem Försterdreieck': 'Misura dell’altezza con il triangolo del guardaboschi',
        'Die Sonnenstrahlen fallen parallel ein. Das blaue und das gelbe Dreieck sind deshalb ähnlich: $\\dfrac{H}{2\\,\\text{m}} = \\dfrac{S}{s}$.': 'I raggi del sole arrivano paralleli. Per questo il triangolo blu e quello giallo sono simili: $\\dfrac{H}{2\\,\\text{m}} = \\dfrac{S}{s}$.',

    },
    phrase: [
        // book it-13 mathegy8-it:
        // pieces that are long enough to be unique; the sentences with numbers in them are rules below
        // lgs8 (a sentence that starts with <b> is no whole label for the engine)
        ['<b>Probe</b> in beiden Gleichungen, dann die Lösungsmenge.', '<b>Verifica</b> in entrambe le equazioni, poi l’insieme delle soluzioni.'],
        // termbaum8
        ['Rechenbaum des Terms ', 'Albero di calcolo dell’espressione '], ['. Gerechnet wird von unten nach oben.', '. Si calcola dal basso verso l’alto.'],
        // gluecksrad8
        ['Alle Felder sind gleich groß: ein <b>Laplace-Versuch</b>. ', 'Tutti i settori sono uguali: un <b>esperimento di Laplace</b>. '],
        ['Die Felder sind <b>verschieden groß</b>: Das ist <b>kein</b> Laplace-Versuch. ', 'I settori hanno <b>ampiezze diverse</b>: <b>non</b> è un esperimento di Laplace. '],
        ['}$ wäre falsch. ', '}$ sarebbe sbagliato. '], ['Es zählt der Anteil am ganzen Rad: ', 'Conta la parte dell’intera ruota: '],
        ['Zuletzt: Feld <b>', 'Ultimo giro: settore <b>'], [', $E$ ist eingetreten.', ', $E$ si è verificato.'], [', $E$ ist nicht eingetreten.', ', $E$ non si è verificato.'],
        [' · Wahrscheinlichkeit $P(E) \\approx ', ' · probabilità $P(E) \\approx '],
        // wegzeit8
        ['Der Graph steigt gleichmäßig.', 'Il grafico sale in modo uniforme.'],
        ['Der Graph verläuft waagerecht: Die Zeit läuft, der Weg bleibt gleich.', 'Il grafico è orizzontale: il tempo passa, la distanza resta la stessa.'],
        ['Hier steigt der Graph am steilsten.', 'Qui il grafico sale nel modo più ripido.'], ['Der Graph steigt flacher als beim ersten Fußweg.', 'Il grafico sale meno ripido che nel primo tratto a piedi.'],
        // streckung8
        ['Zentrische Streckung des Dreiecks ABC am Zentrum Z mit dem Faktor ', 'Omotetia del triangolo ABC con centro Z e rapporto '],
        ['Mit $k = 0$ fallen alle Bildpunkte auf $Z$: Das Bild ist nur noch ein Punkt.', 'Con $k = 0$ tutti i punti immagine cadono su $Z$: l’immagine è soltanto un punto.'],
        ['Mit $k = 1$ bleibt jeder Punkt, wo er ist.', 'Con $k = 1$ ogni punto resta dov’è.'],
        ['Mit $k = -1$ ist die Streckung eine Punktspiegelung an $Z$.', 'Con $k = -1$ l’omotetia è una simmetria centrale rispetto a $Z$.'],
        [' Alle Winkel bleiben gleich.', ' Tutti gli angoli restano uguali.'],
        // aehnlich8
        ['Die drei Punkte liegen auf einer Geraden: Das ist kein Dreieck.', 'I tre punti stanno su una retta: non è un triangolo.'],
        [' Mit $k = 1$ sind die Dreiecke sogar kongruent.', ' Con $k = 1$ i triangoli sono perfino congruenti.'],
        ['Noch nicht ähnlich: ', 'Non ancora simili: '], ['Nur ein Winkel stimmt.', 'coincide un solo angolo.'], ['Kein Winkel stimmt.', 'non coincide nessun angolo.'],
        [' Die Seitenverhältnisse sind verschieden.', ' I rapporti tra i lati sono diversi.'],
        // gulliver8 (two literals in the widget source)
        ['Gulliver ist 12-mal so groß wie ein Liliputaner. Seine Haut hat also die $144$-fache Fläche, sein Körper das $1728$-fache Volumen. ',
            'Gulliver è 12 volte più alto di un lillipuziano. La sua pelle ha quindi un’area $144$ volte più grande, il suo corpo un volume $1728$ volte più grande. '],
        ['Bei Jonathan Swift rechnen die Mathematiker des Kaisers genau so und geben ihm jeden Tag Essen für 1724 Liliputaner, vier weniger als $12^3$.',
            'Nel libro di Jonathan Swift i matematici dell’imperatore fanno proprio questo calcolo e gli danno ogni giorno cibo per 1724 lillipuziani, quattro in meno di $12^3$.'],
        // schatten8
        ['Du hältst ein gleichschenklig-rechtwinkliges Dreieck vor das Auge (Augenhöhe $1{,}6$ m) und peilst an seiner langen Seite entlang. Diese Linie steigt unter $45^\\circ$: ',
            'Tieni davanti all’occhio un triangolo rettangolo isoscele (occhio a $1{,}6$ m di altezza) e miri lungo il suo lato più lungo. Questa linea sale con un angolo di $45^\\circ$: '],
        ['Treffer!</b> Du siehst genau die Spitze. ', 'Centrato!</b> Vedi esattamente la cima. '],
        ['Deine Peillinie geht über die Spitze hinweg: Geh näher heran.', 'La tua linea di mira passa sopra la cima: avvicinati.'],
        // rueckwaerts8
        ['$. Welche Zahl war es?', '$. Qual era il numero?'], ['Das passt nicht.', 'Non torna.'],
        // sammel8
        ['Man kann es auch ausrechnen, mit Mitteln aus der Oberstufe: $', 'Lo si può anche calcolare, con strumenti delle classi superiori: $'],
        // mcpi8
        ['Der Viertelkreis bedeckt $\\tfrac{\\pi}{4}$ des Quadrats, also ist ', 'Il quarto di cerchio copre $\\tfrac{\\pi}{4}$ del quadrato, quindi '], ['(Abweichung $', '(scarto $'],

        // book it-16 mathe6-it:
        // rueckwaerts8
        ['$. Welche Zahl war es?', '$. Quale numero era?'], ['Das passt nicht.', 'Non torna.'],
        ['Rückwärts von $', 'All’indietro da $'], ['$ aus, mit den Umkehrrechnungen: Die Startzahl ist <b>', '$, con le operazioni inverse: il numero iniziale è <b>'],

        // book it-17 mathe7-it:
        // termbaum8
        ['Rechenbaum des Terms ', 'Albero di calcolo dell’espressione '],
        ['Für $x = ', 'Per $x = '], ['$ hat er den Wert ', '$ ha il valore '], ['. Gerechnet wird von unten nach oben.', '. Si calcola dal basso verso l’alto.'],
        ['die Variable $x$ mit dem Wert $', 'la variabile $x$ con il valore $'], ['Ausgewählt: ', 'Selezione: '], ['die Zahl $', 'il numero $'],
        // the pieces of the sentences that a rule below translates as a whole (so tools/buch-en/check.mjs sees them translated, too)
        ['Summanden', 'Addendi'], ['Minuend und Subtrahend', 'Minuendo e sottraendo'], ['Faktoren', 'Fattori'], ['Dividend und Divisor', 'Dividendo e divisore'],
        ['Der Term $', 'L’espressione $'], ['</b>: Zuletzt wird ', '</b>: l’ultima operazione è '], ['der Teilterm $', 'la sottoespressione $'], [' mit dem Wert $', ' con il valore $'],
        // gluecksrad8
        ['Alle Felder sind gleich groß: ein <b>Laplace-Versuch</b>. ', 'Tutti i settori sono uguali: un <b>esperimento di Laplace</b>. '],
        ['Die Felder sind <b>verschieden groß</b>: Das ist <b>kein</b> Laplace-Versuch. ', 'I settori hanno <b>ampiezze diverse</b>: <b>non</b> è un esperimento di Laplace. '],
        ['}$ wäre falsch. ', '}$ sarebbe sbagliato. '], ['Es zählt der Anteil am ganzen Rad: ', 'Conta la parte dell’intera ruota: '],
        ['Zuletzt: Feld <b>', 'Ultimo: settore <b>'], [', $E$ ist eingetreten.', ', $E$ si è verificato.'], [', $E$ ist nicht eingetreten.', ', $E$ non si è verificato.'],
        [' · Wahrscheinlichkeit $P(E)', ' · probabilità $P(E)'],

        // book it-18 mathe8-it:
        // termbaum8
        ['Rechenbaum des Terms ', 'Albero di calcolo dell’espressione '],
        ['$ hat er den Wert ', '$ ha il valore '], ['. Gerechnet wird von unten nach oben.', '. Si calcola dal basso verso l’alto.'],
        // rueckwaerts8
        ['Richtig!</b>', 'Giusto!</b>'], ['Das passt nicht.', 'Non torna.'],
        // wegzeit8
        [' von zu Hause entfernt.', ' da casa.'],
        ['Der Graph steigt gleichmäßig.', 'Il grafico sale in modo uniforme.'],
        ['Der Graph verläuft waagerecht: Die Zeit läuft, der Weg bleibt gleich.', 'Il grafico è orizzontale: il tempo passa, la distanza resta la stessa.'],
        ['Hier steigt der Graph am steilsten.', 'Qui il grafico sale in modo più ripido.'],
        ['Der Graph steigt flacher als beim ersten Fußweg.', 'Il grafico sale meno ripido che nel primo tratto a piedi.'],
        ['geht zu Fuß zur Haltestelle', 'va a piedi alla fermata'], ['wartet an der Haltestelle', 'aspetta alla fermata'],
        ['fährt mit dem Bus', 'va in autobus'], ['geht das letzte Stück zur Schule', 'percorre a piedi l’ultimo tratto fino a scuola'],
        // lgs8 (a sentence that starts with <b> is no whole label for the engine)
        ['<b>Probe</b> in beiden Gleichungen, dann die Lösungsmenge.', '<b>Verifica</b> in entrambe le equazioni, poi l’insieme delle soluzioni.'],
        // streckung8
        ['Zentrische Streckung des Dreiecks ABC am Zentrum Z mit dem Faktor ', 'Omotetia del triangolo ABC con centro Z e rapporto '],
        ['Mit $k = 0$ fallen alle Bildpunkte auf $Z$: Das Bild ist nur noch ein Punkt.', 'Con $k = 0$ tutti i punti immagine cadono in $Z$: l’immagine è solo un punto.'],
        ['Mit $k = 1$ bleibt jeder Punkt, wo er ist.', 'Con $k = 1$ ogni punto resta dov’è.'],
        ['Mit $k = -1$ ist die Streckung eine Punktspiegelung an $Z$.', 'Con $k = -1$ l’omotetia è una simmetria centrale rispetto a $Z$.'],
        [' Alle Winkel bleiben gleich.', ' Tutti gli angoli restano uguali.'],
        // aehnlich8
        ['Die drei Punkte liegen auf einer Geraden: Das ist kein Dreieck.', 'I tre punti stanno su una retta: non è un triangolo.'],
        [' Mit $k = 1$ sind die Dreiecke sogar kongruent.', ' Con $k = 1$ i triangoli sono addirittura congruenti.'],
        // gulliver8
        ['Gulliver ist 12-mal so groß wie ein Liliputaner. Seine Haut hat also die $144$-fache Fläche, sein Körper das $1728$-fache Volumen. ',
            'Gulliver è 12 volte più alto di un lillipuziano. La sua pelle ha quindi una superficie $144$ volte più grande, il suo corpo un volume $1728$ volte più grande. '],
        ['Bei Jonathan Swift rechnen die Mathematiker des Kaisers genau so und geben ihm jeden Tag Essen für 1724 Liliputaner, vier weniger als $12^3$.',
            'In Jonathan Swift i matematici dell’imperatore calcolano proprio così e gli danno ogni giorno cibo per 1724 lillipuziani, quattro in meno di $12^3$.'],
        // schatten8
        ['Du hältst ein gleichschenklig-rechtwinkliges Dreieck vor das Auge (Augenhöhe $1{,}6$ m) und peilst an seiner langen Seite entlang. Diese Linie steigt unter $45^\\circ$: ',
            'Tieni un triangolo rettangolo isoscele davanti all’occhio (altezza degli occhi $1{,}6$ m) e guardi lungo il suo lato lungo. Questa linea sale con un angolo di $45^\\circ$: '],
        // gluecksrad8
        ['Alle Felder sind gleich groß: ein <b>Laplace-Versuch</b>. ', 'Tutti i settori sono uguali: un <b>esperimento di Laplace</b>. '],
        ['Die Felder sind <b>verschieden groß</b>: Das ist <b>kein</b> Laplace-Versuch. ', 'I settori hanno <b>grandezze diverse</b>: <b>non</b> è un esperimento di Laplace. '],
        // sammel8
        ['Man kann es auch ausrechnen, mit Mitteln aus der Oberstufe: $', 'Si può anche calcolare, con gli strumenti degli ultimi anni delle superiori: $'],

        // book it-20 mathe10-it:
        ['Gemessen: Der Stab ist $2$ m hoch, sein Schatten ist $s \\approx ', 'Misurato: l’asta è alta $2$ m, la sua ombra è $s \\approx '],
        ['$ m lang. Der Schatten des Baums ist $S \\approx ', '$ m. L’ombra dell’albero è $S \\approx '],
        ['$ m lang.', '$ m.'],
        ['. Tatsächlich ist der Baum $', '. In realtà l’albero è alto $'],
        ['$ m hoch.', '$ m.'],
        ['Du hältst ein gleichschenklig-rechtwinkliges Dreieck vor das Auge (Augenhöhe $1{,}6$ m) und peilst an seiner langen Seite entlang. Diese Linie steigt unter $45^\\circ$: ', 'Tieni un triangolo rettangolo isoscele davanti all’occhio (altezza degli occhi $1{,}6$ m) e guardi lungo il suo lato lungo. Questa linea sale con un angolo di $45^\\circ$: '],
        ['Auf $d = ', 'Su $d = '],
        ['$ m steigt sie um $', '$ m sale di $'],
        ['Treffer!', 'Centro!'],
        ['</b> Du siehst genau die Spitze. ', '</b> Vedi esattamente la cima. '],
        ['Du siehst den Baum in $', 'Vedi l’albero a $'],
        ['$ m Höhe, unter der Spitze: Geh weiter zurück.', '$ m di altezza, sotto la cima: allontanati ancora.'],
        ['Deine Peillinie geht über die Spitze hinweg: Geh näher heran.', 'La tua linea di mira passa sopra la cima: avvicinati.'],

    ],
    rule: [
        // book it-13 mathegy8-it:
        // streckung8, gulliver8: "Bild", "Fläche", "Einheitswürfel" by their place (in other widgets "Bild" and "Fläche" mean something else)
        [/<th>Bild<\/th>/g, '<th>Immagine</th>'], [/<td>Fläche<\/td>/g, '<td>Area</td>'], [/>Einheitswürfel</g, '>Cubo unitario<'],
        // lgs8: the solution set is S in the Italian books ($L = \{…\}$, $L = \mathbb{R}$), sets of whole numbers with a comma
        [/\$L = (?=\\mathbb\{R\}|\\\{)/g, '$S = '],
        [/\\\{([^$]*?)\\\}/g, (m, s) => /\d(?:,|\{,\})\d/.test(s) ? m : '\\{' + s.replace(/;\\,|; /g, ', ') + '\\}'],
        // termbaum8: "Der Term $3x + 4$ ist eine <b>Summe</b>: Zuletzt wird addiert. Summanden: $3x$ und $4$."
        [/Der Term \$([^$]*)\$ ist eine? <b>(Summe|Differenz|Produkt|Quotient|Potenz)<\/b>: Zuletzt wird (?:addiert|subtrahiert|multipliziert|dividiert|potenziert)\. /g,
            (m, t, k) => 'L’espressione $' + t + '$ è ' + ({ Summe: 'una <b>somma</b>', Differenz: 'una <b>differenza</b>', Produkt: 'un <b>prodotto</b>', Quotient: 'un <b>quoziente</b>', Potenz: 'una <b>potenza</b>' })[k] +
                ': ' + ({ Summe: 'per ultima si esegue l’addizione', Differenz: 'per ultima si esegue la sottrazione', Produkt: 'per ultima si esegue la moltiplicazione', Quotient: 'per ultima si esegue la divisione', Potenz: 'per ultimo si esegue l’elevamento a potenza' })[k] + '. '],
        [/(Summanden|Minuend und Subtrahend|Faktoren|Dividend und Divisor): \$([^$]*)\$ und \$([^$]*)\$\./g,
            (m, p, a, b) => ({ 'Summanden': 'Addendi', 'Minuend und Subtrahend': 'Minuendo e sottraendo', 'Faktoren': 'Fattori', 'Dividend und Divisor': 'Dividendo e divisore' })[p] + ': $' + a + '$ e $' + b + '$.'],
        [/Basis \$([^$]*)\$, Exponent \$([^$]*)\$\./g, (m, a, b) => 'Base $' + a + '$, esponente $' + b + '$.'],
        [/Für \$x = (-?\d+)\$ hat er den Wert /g, (m, x) => 'Per $x = ' + x + '$ ha il valore '],
        [/Ausgewählt: der Teilterm \$([^$]*)\$, eine? (Summe|Differenz|Produkt|Quotient|Potenz) mit dem Wert \$/g,
            (m, t, k) => 'Selezione: la sottoespressione $' + t + '$, ' + ({ Summe: 'una somma', Differenz: 'una differenza', Produkt: 'un prodotto', Quotient: 'un quoziente', Potenz: 'una potenza' })[k] + ', con il valore $'],
        [/Ausgewählt: die Variable \$x\$ mit dem Wert \$([^$]*)\$\./g, (m, v) => 'Selezione: la variabile $x$ con il valore $' + v + '$.'],
        [/Ausgewählt: die Zahl \$([^$]*)\$\./g, (m, v) => 'Selezione: il numero $' + v + '$.'],
        // gluecksrad8: the aria label and "Gedreht: $12$-mal · $E$ eingetreten: $5$-mal · relative Häufigkeit …"
        [/Glücksrad mit (\d+) Feldern/g, 'Ruota della fortuna con $1 settori'],
        [/Gedreht: \$([^$]*)\$-mal · \$E\$ eingetreten: \$([^$]*)\$-mal · relative Häufigkeit /g,
            (m, a, b) => 'Giri: $' + a + '$ · $E$ si è verificato $' + b + '$ ' + (b === '1' ? 'volta' : 'volte') + ' · frequenza relativa '],
        // wegzeit8: "Nach $t = 5$ min ist Mia <span class="b-res">$400$ m</span> von zu Hause entfernt." and "Sie fährt mit dem Bus: $300$ m pro Minute. "
        [/Nach \$t = ([^$]*)\$ min ist Mia (<span class="b-res">\$[^$]*\$ m<\/span>) von zu Hause entfernt\./g, (m, t, d) => 'Dopo $t = ' + t + '$ min Mia si trova a ' + d + ' da casa.'],
        [/Sie (geht zu Fuß zur Haltestelle|wartet an der Haltestelle|fährt mit dem Bus|geht das letzte Stück zur Schule)(?:: \$(\d+)\$ m pro Minute\. |\. )/g,
            (m, d, v) => ({ 'geht zu Fuß zur Haltestelle': 'Va a piedi alla fermata', 'wartet an der Haltestelle': 'Aspetta alla fermata', 'fährt mit dem Bus': 'Va in autobus',
                'geht das letzte Stück zur Schule': 'Percorre a piedi l’ultimo tratto fino a scuola' })[d] + (v ? ': $' + v + '$ m al minuto. ' : '. ')],
        // lgs8: the steps with a variable or a number in them
        [/Löse Gleichung I nach \$([xy])\$ auf\./g, (m, v) => 'Ricava $' + v + '$ dall’equazione I.'],
        [/Setze das für \$([xy])\$ in Gleichung II ein\./g, (m, v) => 'Sostituisci questa espressione al posto di $' + v + '$ nell’equazione II.'],
        [/Setze \$([xy] = -?\d+)\$ in die umgestellte Gleichung ein\./g, (m, v) => 'Sostituisci $' + v + '$ nell’equazione ricavata.'],
        [/Setze \$(x = -?\d+)\$ in Gleichung I \(umgestellt\) ein\./g, (m, v) => 'Sostituisci $' + v + '$ nell’equazione I (ricavata).'],
        [/Setze \$(x = -?\d+)\$ in Gleichung I ein\./g, (m, v) => 'Sostituisci $' + v + '$ nell’equazione I.'],
        [/Schritt (\d+) von (\d+): erst selbst überlegen, dann aufdecken\./g, 'Passo $1 di $2: prima pensaci tu, poi scoprilo.'],
        // streckung8: the sentences with k
        [/Bei negativem \$k\$ liegt jeder Bildpunkt auf der anderen Seite von \$Z\$\. Die Bildstrecken sind \$\|k\| = ([^$]*)\$-mal so lang\./g,
            (m, k) => 'Con $k$ negativo ogni punto immagine sta dall’altra parte di $Z$. Le lunghezze delle immagini si moltiplicano per $|k| = ' + k + '$.'],
        [/(Eine <b>Vergrößerung<\/b>|<b>Eine Verkleinerung<\/b>): Jede Strecke wird \$([^$]*)\$-mal so lang, die Fläche \$k\^2 = ([^$]*)\$-mal so groß\./g,
            (m, w, a, b) => (/Vergr/.test(w) ? 'Un <b>ingrandimento</b>' : '<b>Una riduzione</b>') + ': ogni lunghezza si moltiplica per $' + a + '$, l’area per $k^2 = ' + b + '$.'],
        // aehnlich8: "Ähnlich! Alle Winkel stimmen überein, …"
        [/Ähnlich!<\/b> Alle Winkel stimmen überein, und alle Seiten sind mit demselben Faktor \$k \\approx ([^$]*)\$ gestreckt\./g,
            (m, k) => 'Simili!</b> Tutti gli angoli coincidono e tutti i lati sono moltiplicati per lo stesso fattore $k \\approx ' + k + '$.'],
        // gulliver8: k = 1 changes nothing, the other k, and the aria label
        [/Alle Längen werden \$1\$-mal so groß, jede Fläche \$1\^2 = 1\$-mal so groß, das Volumen \$1\^3 = 1\$-mal so groß\./g,
            'Con $k = 1$ lunghezze, aree e volumi non cambiano.'],
        [/Alle Längen werden \$(\d+)\$-mal so groß, jede Fläche \$(\d+)\^2 = (\d+)\$-mal so groß, das Volumen \$(\d+)\^3 = (\d+)\$-mal so groß\./g,
            (m, k, k2, a, k3, v) => 'Tutte le lunghezze si moltiplicano per $' + k + '$, ogni area per $' + k + '^2 = ' + a + '$, il volume per $' + k + '^3 = ' + v + '$.'],
        [/Ein Einheitswürfel und ein Würfel aus (\d+) hoch drei Einheitswürfeln/g, 'Un cubo unitario e un cubo fatto di $1 × $1 × $1 cubi unitari'],
        // schatten8: the measured lengths and the forester's triangle
        [/Gemessen: Der Stab ist \$2\$ m hoch, sein Schatten ist \$s \\approx ([^$]*)\$ m lang\. Der Schatten des Baums ist \$S \\approx ([^$]*)\$ m lang\./g,
            (m, s, S) => 'Misure: l’asta è alta $2$ m, la sua ombra è lunga $s \\approx ' + s + '$ m. L’ombra dell’albero è lunga $S \\approx ' + S + '$ m.'],
        [/\. Tatsächlich ist der Baum \$([^$]*)\$ m hoch\./g, (m, h) => '. In realtà l’albero è alto $' + h + '$ m.'],
        [/Auf \$d = ([^$]*)\$ m steigt sie um \$([^$]*)\$ m\./g, (m, a, b) => 'Su $d = ' + a + '$ m sale di $' + b + '$ m.'],
        [/Du siehst den Baum in \$([^$]*)\$ m Höhe, unter der Spitze: Geh weiter zurück\./g, (m, h) => 'Vedi l’albero a $' + h + '$ m di altezza, sotto la cima: allontanati ancora.'],
        // rueckwaerts8: the puzzle in words and the try
        [/Ich denke mir eine Zahl und rechne: (.+?)\. Heraus kommt \$/g,
            (m, ops) => 'Penso un numero e calcolo: ' + ops.replace(/geteilt durch/g, 'diviso').replace(/\bmal\b/g, 'per').replace(/\bplus\b/g, 'più').replace(/\bminus\b/g, 'meno').replace(/, dann /g, ', poi ') + '. Il risultato è $'],
        [/Mit \$([^$]*)\$ kommt \$([^$]*)\$ heraus\. /g, (m, a, b) => 'Con $' + a + '$ si ottiene $' + b + '$. '],
        [/Rückwärts von \$([^$]*)\$ aus, mit den Umkehrrechnungen: Die Startzahl ist <b>/g, (m, e) => 'A ritroso da $' + e + '$, con le operazioni inverse: il numero iniziale è <b>'],
        // sammel8: the album in numbers (the sentence rules before the album sizes "10 Bilder")
        [/Jede Tüte enthält ein Bild\. Alle (\d+) Bilder sind gleich häufig\. Wie viele Tüten brauchst du, bis das Album voll ist\?/g,
            'Ogni bustina contiene una figurina. Le $1 figurine sono tutte ugualmente frequenti. Quante bustine ti servono per completare l’album?'],
        [/Geöffnet: \$(\d+)\$ Tüten · im Album: \$(\d+)\$ von \$(\d+)\$ Bildern · doppelt: \$/g,
            (m, p, g, n) => 'Aperte: $' + p + '$ ' + (p === '1' ? 'bustina' : 'bustine') + ' · nell’album: $' + g + '$ su $' + n + '$ figurine · doppie: $'],
        [/1000 Alben: Im Mittel brauchte man (<span class="b-res">\$[^$]*\$) Tüten<\/span> \(am wenigsten \$([^$]*)\$, am meisten \$([^$]*)\$\)\. /g,
            (m, a, lo, hi) => '1000 album: in media sono servite ' + a + ' bustine</span> (al minimo $' + lo + '$, al massimo $' + hi + '$). '],
        [/(\d+) Bilder\b/g, '$1 figurine'], [/title="Bild (\d+)"/g, 'title="Figurina $1"'],
        // mcpi8: the buttons and "Von $1.000$ Punkten liegen $791$ im Viertelkreis, das ist der Anteil $…"
        [/\+(\d[\d.\s]*?) Punkte</g, '+$1 punti<'],
        [/Von \$([^$]*)\$ Punkten liegen \$([^$]*)\$ im Viertelkreis, das ist der Anteil \$/g,
            (m, a, b) => 'Su $' + a + '$ punti, $' + b + '$ cadono nel quarto di cerchio: è la frazione $'],
        // ziffern8: the coin count and the dice
        [/Wappen: \$(\d+)\$ · Zahl: \$(\d+)\$ · relative Häufigkeit von Wappen: \$/g, (m, a, b) => 'Testa: $' + a + '$ · croce: $' + b + '$ · frequenza relativa di testa: $'],
        [/Ziffern 1 bis 6 sind Augenzahlen, 0, 7, 8 und 9 werden übersprungen \(grau\)\. So entstehen (\d+) Würfe\./g,
            'Le cifre da 1 a 6 sono punteggi, 0, 7, 8 e 9 si saltano (in grigio). Così si ottengono $1 lanci.'],

        // book it-16 mathe6-it:
        // rueckwaerts8: the puzzle in words and the try
        [/Ich denke mir eine Zahl und rechne: (.+?)\. Heraus kommt \$/g,
            (m, ops) => 'Penso un numero e calcolo: ' + ops.replace(/geteilt durch/g, 'diviso').replace(/\bmal\b/g, 'per').replace(/\bplus\b/g, 'più').replace(/\bminus\b/g, 'meno').replace(/, dann /g, ', poi ') + '. Viene $'],
        [/Mit \$([^$]*)\$ kommt \$([^$]*)\$ heraus\. /g, (m, a, b) => 'Con $' + a + '$ viene $' + b + '$. '],

        // book it-17 mathe7-it:
        // termbaum8: "Der Term $3x + 4$ ist eine <b>Summe</b>: Zuletzt wird addiert. Summanden: $3x$ und $4$."
        [/Der Term \$([^$]*)\$ ist eine? <b>(Summe|Differenz|Produkt|Quotient|Potenz)<\/b>: Zuletzt wird (?:addiert|subtrahiert|multipliziert|dividiert|potenziert)\. /g,
            (m, t, k) => 'L’espressione $' + t + '$ è ' + ({ Summe: 'una <b>somma</b>', Differenz: 'una <b>differenza</b>', Produkt: 'un <b>prodotto</b>', Quotient: 'un <b>quoziente</b>', Potenz: 'una <b>potenza</b>' })[k] +
                ': l’ultima operazione è ' + ({ Summe: 'l’addizione', Differenz: 'la sottrazione', Produkt: 'la moltiplicazione', Quotient: 'la divisione', Potenz: 'l’elevamento a potenza' })[k] + '. '],
        [/(Summanden|Minuend und Subtrahend|Faktoren|Dividend und Divisor): \$([^$]*)\$ und \$([^$]*)\$\./g,
            (m, p, a, b) => ({ 'Summanden': 'Addendi', 'Minuend und Subtrahend': 'Minuendo e sottraendo', 'Faktoren': 'Fattori', 'Dividend und Divisor': 'Dividendo e divisore' })[p] + ': $' + a + '$ e $' + b + '$.'],
        [/Basis \$([^$]*)\$, Exponent \$([^$]*)\$\./g, (m, a, b) => 'Base $' + a + '$, esponente $' + b + '$.'],
        [/Ausgewählt: der Teilterm \$([^$]*)\$, eine? (Summe|Differenz|Produkt|Quotient|Potenz) mit dem Wert \$/g,
            (m, t, k) => 'Selezione: la sottoespressione $' + t + '$, ' + ({ Summe: 'una somma', Differenz: 'una differenza', Produkt: 'un prodotto', Quotient: 'un quoziente', Potenz: 'una potenza' })[k] + ', con il valore $'],
        // gluecksrad8: the aria label and "Gedreht: $12$-mal · $E$ eingetreten: $5$-mal · relative Häufigkeit …"
        [/Glücksrad mit (\d+) Feldern/g, 'Ruota della fortuna con $1 settori'],
        [/Gedreht: \$([^$]*)\$-mal · \$E\$ eingetreten: \$([^$]*)\$-mal · relative Häufigkeit /g,
            (m, a, b) => 'Giri: $' + a + '$ · $E$ si è verificato $' + b + '$ ' + (b === '1' ? 'volta' : 'volte') + ' · frequenza relativa '],
        // gluecksrad8: the sets of whole numbers with commas, as the Italian books write them: \{1; 2; \ldots; 8\} → \{1, 2, \ldots, 8\}
        [/\\\{((?:\d+|\\ldots)(?:; (?:\d+|\\ldots))+)\\\}/g, (m, l) => '\\{' + l.replace(/; /g, ', ') + '\\}'],

        // book it-18 mathe8-it:
        // termbaum8: "Der Term $3x + 4$ ist eine <b>Summe</b>: Zuletzt wird addiert. Summanden: $3x$ und $4$." and the selected node
        [/Der Term \$([^$]*)\$ ist eine? <b>(Summe|Differenz|Produkt|Quotient|Potenz)<\/b>: Zuletzt wird (?:addiert|subtrahiert|multipliziert|dividiert|potenziert)\. /g,
            (m, t, k) => 'L’espressione $' + t + '$ è ' + ({ Summe: 'una <b>somma</b>', Differenz: 'una <b>differenza</b>', Produkt: 'un <b>prodotto</b>', Quotient: 'un <b>quoziente</b>', Potenz: 'una <b>potenza</b>' })[k] +
                ': per ultima si esegue ' + ({ Summe: 'l’addizione', Differenz: 'la sottrazione', Produkt: 'la moltiplicazione', Quotient: 'la divisione', Potenz: 'l’elevamento a potenza' })[k] + '. '],
        [/(Summanden|Minuend und Subtrahend|Faktoren|Dividend und Divisor): \$([^$]*)\$ und \$([^$]*)\$\./g,
            (m, p, a, b) => ({ 'Summanden': 'Addendi', 'Minuend und Subtrahend': 'Minuendo e sottraendo', 'Faktoren': 'Fattori', 'Dividend und Divisor': 'Dividendo e divisore' })[p] + ': $' + a + '$ e $' + b + '$.'],
        [/Basis \$([^$]*)\$, Exponent \$([^$]*)\$\./g, (m, a, b) => 'Base $' + a + '$, esponente $' + b + '$.'],
        [/Für \$x = ([^$]*)\$ hat er den Wert /g, (m, v) => 'Per $x = ' + v + '$ ha il valore '],
        [/Ausgewählt: der Teilterm \$([^$]*)\$, eine? (Summe|Differenz|Produkt|Quotient|Potenz) mit dem Wert \$/g,
            (m, t, k) => 'Selezionata: la sottoespressione $' + t + '$, ' + ({ Summe: 'una somma', Differenz: 'una differenza', Produkt: 'un prodotto', Quotient: 'un quoziente', Potenz: 'una potenza' })[k] + ', con il valore $'],
        [/Ausgewählt: die Variable \$x\$ mit dem Wert \$/g, () => 'Selezionata: la variabile $x$ con il valore $'],
        [/Ausgewählt: die Zahl \$/g, () => 'Selezionato: il numero $'],
        // rueckwaerts8: the puzzle in words, the try and the backward solution
        [/Ich denke mir eine Zahl und rechne: (.+?)\. Heraus kommt \$([^$]*)\$\. Welche Zahl war es\?/g,
            (m, ops, e) => 'Penso un numero e calcolo: ' + ops.replace(/geteilt durch/g, 'diviso').replace(/\bmal\b/g, 'per').replace(/\bplus\b/g, 'più').replace(/\bminus\b/g, 'meno').replace(/, dann /g, ', poi ') +
                '. Il risultato è $' + e + '$. Che numero era?'],
        [/Mit \$([^$]*)\$ kommt \$([^$]*)\$ heraus\. /g, (m, a, b) => 'Con $' + a + '$ viene $' + b + '$. '],
        [/Rückwärts von \$([^$]*)\$ aus, mit den Umkehrrechnungen: Die Startzahl ist <b>/g, (m, e) => 'All’indietro da $' + e + '$, con le operazioni inverse: il numero di partenza è <b>'],
        // wegzeit8: "Nach $t = 3$ min ist Mia <span …>$240$ m</span> von zu Hause entfernt." and "Sie fährt mit dem Bus: $300$ m pro Minute. "
        [/Nach \$t = ([^$]+)\$ min ist Mia /g, 'Dopo $t = $1$ min Mia si trova a '],
        [/Sie (geht zu Fuß zur Haltestelle|wartet an der Haltestelle|fährt mit dem Bus|geht das letzte Stück zur Schule)(?:: \$(\d+)\$ m pro Minute\. |\. )/g,
            (m, d, v) => ({ 'geht zu Fuß zur Haltestelle': 'Va a piedi alla fermata', 'wartet an der Haltestelle': 'Aspetta alla fermata', 'fährt mit dem Bus': 'Va in autobus',
                'geht das letzte Stück zur Schule': 'Percorre a piedi l’ultimo tratto fino a scuola' })[d] + (v ? ': $' + v + '$ m al minuto. ' : '. ')],
        // lgs8: the steps with a variable or a number in them
        [/Löse Gleichung I nach \$([xy])\$ auf\./g, (m, v) => 'Ricava $' + v + '$ dall’equazione I.'],
        [/Setze das für \$([xy])\$ in Gleichung II ein\./g, (m, v) => 'Sostituisci questa espressione al posto di $' + v + '$ nell’equazione II.'],
        [/Setze \$([xy] = -?\d+)\$ in die umgestellte Gleichung ein\./g, (m, v) => 'Sostituisci $' + v + '$ nell’equazione trasformata.'],
        [/Setze \$(x = -?\d+)\$ in Gleichung I \(umgestellt\) ein\./g, (m, v) => 'Sostituisci $' + v + '$ nell’equazione I (trasformata).'],
        [/Setze \$(x = -?\d+)\$ in Gleichung I ein\./g, (m, v) => 'Sostituisci $' + v + '$ nell’equazione I.'],
        [/Schritt (\d+) von (\d+): erst selbst überlegen, dann aufdecken\./g, 'Passo $1 di $2: prima ragionaci tu, poi scopri la soluzione.'],
        // streckung8, gulliver8: "Bild", "Fläche", "Einheitswürfel" by their place
        [/<th>Bild<\/th>/g, '<th>Immagine</th>'], [/<td>Fläche<\/td>/g, '<td>Area</td>'], [/>Einheitswürfel</g, '>Cubo unitario<'],
        // streckung8: the sentence with k
        [/Bei negativem \$k\$ liegt jeder Bildpunkt auf der anderen Seite von \$Z\$\. Die Bildstrecken sind \$\|k\| = ([^$]+)\$-mal so lang\./g,
            (m, v) => 'Con $k$ negativo ogni punto immagine sta dall’altra parte di $Z$. I segmenti immagine vengono moltiplicati per $|k| = ' + v + '$.'],
        [/(Eine <b>Vergrößerung<\/b>|<b>Eine Verkleinerung<\/b>): Jede Strecke wird \$([^$]+)\$-mal so lang, die Fläche \$k\^2 = ([^$]+)\$-mal so groß\./g,
            (m, w, a, b) => (w.indexOf('Vergr') >= 0 ? 'Un <b>ingrandimento</b>' : '<b>Una riduzione</b>') + ': ogni segmento viene moltiplicato per $' + a + '$, l’area per $k^2 = ' + b + '$.'],
        // aehnlich8: the verdict
        [/<b class="g-ok">Ähnlich!<\/b> Alle Winkel stimmen überein, und alle Seiten sind mit demselben Faktor \$k \\approx ([^$]+)\$ gestreckt\./g,
            (m, v) => '<b class="g-ok">Simili!</b> Tutti gli angoli coincidono e tutti i lati sono moltiplicati per lo stesso fattore $k \\approx ' + v + '$.'],
        [/Noch nicht ähnlich: (Nur ein Winkel stimmt|Kein Winkel stimmt)\. Die Seitenverhältnisse sind verschieden\./g,
            (m, w) => 'Non ancora simili: ' + (w.charAt(0) === 'N' ? 'coincide solo un angolo' : 'non coincide nessun angolo') + '. I rapporti tra i lati sono diversi.'],
        // gulliver8: k = 1 changes nothing, the other k, and the aria label
        [/Alle Längen werden \$1\$-mal so groß, jede Fläche \$1\^2 = 1\$-mal so groß, das Volumen \$1\^3 = 1\$-mal so groß\./g, 'Con $k = 1$ lunghezze, aree e volumi non cambiano.'],
        [/Alle Längen werden \$(\d+)\$-mal so groß, jede Fläche \$(\d+\^2 = \d+)\$-mal so groß, das Volumen \$(\d+\^3 = \d+)\$-mal so groß\./g,
            (m, a, b, c) => 'Tutte le lunghezze vengono moltiplicate per $' + a + '$, ogni area per $' + b + '$, il volume per $' + c + '$.'],
        [/Ein Einheitswürfel und ein Würfel aus (\d+) hoch drei Einheitswürfeln/g, 'Un cubo unitario e un cubo di $1 × $1 × $1 cubi unitari'],
        // schatten8: the measured shadows, the result and the forester's triangle
        [/Gemessen: Der Stab ist \$2\$ m hoch, sein Schatten ist \$s \\approx ([^$]+)\$ m lang\. Der Schatten des Baums ist \$S \\approx ([^$]+)\$ m lang\./g,
            (m, a, b) => 'Misurato: il bastone è alto $2$ m, la sua ombra è lunga $s \\approx ' + a + '$ m. L’ombra dell’albero è lunga $S \\approx ' + b + '$ m.'],
        [/\. Tatsächlich ist der Baum \$([^$]+)\$ m hoch\./g, (m, a) => '. In realtà l’albero è alto $' + a + '$ m.'],
        [/Auf \$d = ([^$]+)\$ m steigt sie um \$([^$]+)\$ m\./g, (m, a, b) => 'su $d = ' + a + '$ m sale di $' + b + '$ m.'],
        [/<b class="g-ok">Treffer!<\/b> Du siehst genau die Spitze\. /g, '<b class="g-ok">Centro!</b> Vedi proprio la cima. '],
        [/Du siehst den Baum in \$([^$]+)\$ m Höhe, unter der Spitze: Geh weiter zurück\./g, (m, a) => 'Vedi l’albero a $' + a + '$ m di altezza, sotto la cima: allontanati ancora.'],
        // gluecksrad8: the aria label, "wäre falsch", the last spin and the counts
        [/Glücksrad mit (\d+) Feldern/g, 'Ruota della fortuna con $1 settori'],
        [/\}\$ wäre falsch\. Es zählt der Anteil am ganzen Rad: /g, () => '}$ sarebbe sbagliato. Conta la parte di tutta la ruota: '],
        [/Zuletzt: Feld <b>(\d+)<\/b>, \$E\$ ist (nicht )?eingetreten\./g, (m, f, n) => 'Ultimo giro: settore <b>' + f + '</b>, $E$ ' + (n ? 'non si è verificato.' : 'si è verificato.')],
        [/Gedreht: \$([^$]*)\$-mal · \$E\$ eingetreten: \$([^$]*)\$-mal · relative Häufigkeit /g,
            (m, a, b) => 'Giri: $' + a + '$ · $E$ si è verificato $' + b + '$ ' + (b === '1' ? 'volta' : 'volte') + ' · frequenza relativa '],
        [/ · Wahrscheinlichkeit \$P\(E\) \\approx /g, () => ' · probabilità $P(E) \\approx '],
        // sammel8: the album in numbers (before the album sizes "10 Bilder")
        [/Jede Tüte enthält ein Bild\. Alle (\d+) Bilder sind gleich häufig\. Wie viele Tüten brauchst du, bis das Album voll ist\?/g,
            'Ogni bustina contiene una figurina. Tutte le $1 figurine sono ugualmente frequenti. Quante bustine ti servono per completare l’album?'],
        [/Geöffnet: \$(\d+)\$ Tüten · im Album: \$(\d+)\$ von \$(\d+)\$ Bildern · doppelt: \$/g,
            (m, p, g, n) => 'Aperte: $' + p + '$ ' + (p === '1' ? 'bustina' : 'bustine') + ' · nell’album: $' + g + '$ di $' + n + '$ figurine · doppie: $'],
        [/1000 Alben: Im Mittel brauchte man <span class="b-res">\$([^$]+)\$ Tüten<\/span> \(am wenigsten \$(\d+)\$, am meisten \$(\d+)\$\)\. /g,
            (m, a, b, c) => '1000 album: in media sono servite <span class="b-res">$' + a + '$ bustine</span> (al minimo $' + b + '$, al massimo $' + c + '$). '],
        [/(\d+) Bilder\b/g, '$1 figurine'], [/title="Bild (\d+)"/g, 'title="Figurina $1"'],

        // book it-20 mathe10-it:

    ]
});
