/* js/buch-it/gy5.js — Italian for the widgets of js/buch-gy5.js.
 * Loaded by the Italian editions right after js/buch-gy5.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 3 (20.10.2026): eleven books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/gy5.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('gy5', {
    word: {
        // book it-10 mathegy5-it:
        // the same Italian as in the dictionaries of the upper-school books, which these pages do not load
        'Nächster Schritt': 'Passo successivo', 'Rechteck': 'Rettangolo', 'Symmetrie': 'Simmetria', 'Ansicht': 'Vista', 'Leeren': 'Svuota',
        // titelbildgy5
        'Titelbild: ein Quader aus Einheitswürfeln, ein Kreis mit drei Achteln, ein Winkel mit Skala, ein gespiegelter Drachen, ein Zahlenstrahl und Maya-Ziffern':
            'Illustrazione di copertina: un parallelepipedo fatto di cubetti unitari, un cerchio con tre ottavi, un angolo con la scala graduata, un aquilone ribaltato, una retta numerica e cifre maya',
        // stellenwert5
        'MRD.': 'MLD.', 'MILLIONEN': 'MILIONI', 'TAUSENDER': 'MIGLIAIA', 'EINER': 'UNITÀ',
        'Zufallszahl': 'Numero a caso', 'Alles auf 0': 'Tutto a 0',
        'Tippe auf ▲ oder ▼, um eine Ziffer zu ändern. Jede Stelle ist zehnmal so viel wert wie die Stelle rechts daneben.':
            'Tocca ▲ o ▼ per cambiare una cifra. Ogni posizione vale dieci volte la posizione alla sua destra.',
        // zahlenstrahl5
        'Zehner': 'Decine', 'Hunderter': 'Centinaia', 'Tausender': 'Migliaia', 'Zehntausender': 'Decine di migliaia',
        'Hunderttausender': 'Centinaia di migliaia', 'Millionen': 'Milioni', 'Runden auf': 'Arrotonda a', 'Neue Zahl': 'Nuovo numero', 'Mitte': 'Metà',
        'Zieh den Punkt. Liegt er genau in der Mitte oder rechts davon, wird aufgerundet, sonst abgerundet.':
            'Trascina il punto. Se sta esattamente a metà o alla sua destra, si arrotonda per eccesso, altrimenti per difetto.',
        // sieb5
        'Von vorn': 'Ricomincia',
        'Tippe auf eine Zahl: Du siehst alle ihre Teiler und ihre Zerlegung in Primfaktoren.': 'Tocca un numero: vedrai tutti i suoi divisori e la sua scomposizione in fattori primi.',
        'Die 1 hat nur sich selbst als Teiler.': 'L’1 ha come divisore solo se stesso.',
        'Zerlegung in Primfaktoren': 'Scomposizione in fattori primi',
        // bruch5
        'Kreis': 'Cerchio', 'Streifen': 'Striscia', 'Bild': 'Figura', 'Zähler': 'Numeratore', 'Nenner': 'Denominatore',
        'Erweitern mit 2': 'Amplifica per 2', 'mit 3': 'per 3', 'Kürzen': 'Semplifica', 'weniger': 'meno', 'mehr': 'più',
        // bruchstrahl5
        'Gib Brüche wie 3/4 oder Dezimalzahlen wie 0,7 ein, auch Zahlen größer als 1 bis 3.':
            'Scrivi frazioni come 3/4 o numeri decimali come 0,7, anche numeri maggiori di 1, fino a 3.',
        'Zahlenstrahl mit zwei Zahlen': 'Retta numerica con due numeri',
        'Bitte zwei Zahlen zwischen 0 und 3 eingeben, zum Beispiel 3/4 oder 0,7.': 'Scrivi due numeri tra 0 e 3, per esempio 3/4 o 0,7.',
        // winkel5
        'Messen': 'Misura', 'Schätzen': 'Stima', 'Modus': 'Modalità', 'Deine Schätzung': 'La tua stima', 'Schätzung in Grad': 'Stima in gradi',
        'Neuer Winkel': 'Nuovo angolo',
        'Zieh am Ende des zweiten Schenkels. Gemessen wird gegen den Uhrzeigersinn, vom liegenden Schenkel aus.':
            'Trascina l’estremo del secondo lato. Si misura in senso antiorario, a partire dal lato orizzontale.',
        'Wie groß ist dieser Winkel? Schätze, ohne zu messen, und tippe auf „Prüfen“.': 'Quanto misura questo angolo? Stima senza misurare e tocca «Verifica».',
        'Bitte eine Zahl eingeben.': 'Scrivi un numero, per favore.', 'Ausgezeichnet': 'Eccellente',
        // winkelpaare5
        'Scheitelwinkel': 'Opposti al vertice', 'Nebenwinkel': 'Adiacenti', 'Stufenwinkel': 'Corrispondenti', 'Wechselwinkel': 'Alterni',
        'Winkelpaar': 'Coppia di angoli', 'Anderes Paar': 'Altra coppia', 'h kippen': 'Inclina h',
        'Zieh am Punkt auf der Geraden s, um sie zu drehen. Mit „h kippen“ sind g und h nicht mehr parallel.':
            'Trascina il punto sulla retta s per ruotarla. Con «Inclina h», g e h non sono più parallele.',
        'Zwei Geraden g und h, geschnitten von s': 'Due rette g e h tagliate da s',
        // spiegel5
        'Spiegelung': 'Riflessione', 'Verschiebung': 'Traslazione', 'Drehung': 'Rotazione', 'Rätsel': 'Rompicapo', 'Bewegung': 'Movimento',
        'Achse senkrecht': 'Asse verticale', 'waagerecht': 'orizzontale', 'Achse': 'Asse', 'Drehwinkel': 'Angolo di rotazione',
        'Neues Rätsel': 'Nuovo rompicapo',
        'Zieh an der Spiegelachse. Jeder Bildpunkt liegt auf der Senkrechten zur Achse, gleich weit von ihr entfernt.':
            'Trascina l’asse di simmetria. Ogni punto immagine sta sulla perpendicolare all’asse, alla stessa distanza da esso.',
        'Zieh an der Pfeilspitze: Jeder Punkt wird um denselben Pfeil verschoben.': 'Trascina la punta della freccia: ogni punto viene spostato secondo la stessa freccia.',
        'Stell den Drehwinkel ein. Gedreht wird gegen den Uhrzeigersinn um den Punkt Z.':
            'Imposta l’angolo di rotazione. Si ruota in senso antiorario attorno al punto Z.',
        'Welche Bewegung bringt die gelbe Figur auf die grüne?': 'Quale movimento porta la figura gialla su quella verde?',
        'Figur und Bildfigur im Koordinatensystem': 'Figura e figura immagine nel sistema di coordinate',
        'Tippe auf deine Antwort.': 'Tocca la tua risposta.',
        // rechteck5
        'Zusammengesetzte Figur': 'Figura composta', 'Figur': 'Figura', 'Zerlegen': 'Scomponi', 'Ergänzen': 'Completa', 'Weg': 'Metodo',
        'Zieh an der Ecke. Ein Kästchen ist 1 cm lang und 1 cm breit, also 1 cm² groß.':
            'Trascina il vertice. Un quadretto è lungo 1 cm e largo 1 cm, quindi la sua area è 1 cm².',
        // quader5
        'Schrägbild': 'Assonometria', 'Netz': 'Sviluppo', 'Einheitswürfel': 'Cubetti unitari',
        'Länge a (cm)': 'Lunghezza a (cm)', 'Breite b (cm)': 'Larghezza b (cm)', 'Höhe c (cm)': 'Altezza c (cm)',
        'hinten': 'dietro', 'oben': 'sopra', 'vorn': 'davanti', 'unten': 'sotto', 'links': 'sinistra', 'rechts': 'destra',
        // einheiten5
        'Länge': 'Lunghezza', 'Masse': 'Massa', 'Zeit': 'Tempo', 'Fläche': 'Superficie', 'Volumen': 'Volume', 'Größe': 'Grandezza',
        'Wert': 'Valore', 'von Einheit': 'dall’unità', 'in Einheit': 'all’unità',
        'Bitte eine Zahl eingeben, zum Beispiel 3,5.': 'Scrivi un numero, per esempio 3,5.',
        // zahlschrift5
        'Ägypten': 'Egitto', 'Rom': 'Roma', 'Maya': 'Maya', 'Zweiersystem': 'Sistema binario', 'Zahlschrift': 'Numerazione',
        'eins weniger': 'uno in meno', 'eins mehr': 'uno in più',
        // komma5
        'Neu': 'Nuovo',
        'Beim Multiplizieren mit 10 rückt jede Ziffer eine Stelle nach links, beim Dividieren nach rechts. Man sagt kurz: Das Komma wandert.':
            'Quando si moltiplica per 10 ogni cifra si sposta di un posto verso sinistra, quando si divide verso destra. In breve si dice: la virgola si sposta.',
        'nicht möglich: Die Ziffern würden aus der Tafel fallen.': 'non è possibile: le cifre uscirebbero dalla tabella.',
        // mittel5
        'Ausgleichen': 'Pareggia', 'Neue Werte': 'Nuovi valori', 'Mittelwert': 'Media', 'Säulen mit dem Mittelwert': 'Colonne con la media',
        'Zieh die Säulen höher oder niedriger. „Ausgleichen“ verteilt alles gerecht: Jede Säule bekommt gleich viel.':
            'Trascina le colonne più in alto o più in basso. «Pareggia» distribuisce tutto in modo giusto: ogni colonna riceve la stessa quantità.',
        // koord5
        'Geraden ein/aus': 'Rette sì/no', 'Finde den Punkt': 'Trova il punto', 'Koordinatensystem mit vier Punkten': 'Sistema di coordinate con quattro punti',
        'Zieh die Punkte. Sie rasten auf den Gitterpunkten ein. Erst nach rechts (x), dann nach oben (y).':
            'Trascina i punti. Si agganciano ai punti della griglia. Prima verso destra (x), poi verso l’alto (y).',
        // symmetrie5
        'Achse waagerecht': 'Asse orizzontale', 'zwei Achsen': 'due assi', 'Punkt': 'Punto',
        'Muster-Werkstatt': 'Laboratorio dei motivi',
        'Tippe auf Kästchen, um sie zu färben. Die gespiegelten Kästchen färben sich von selbst mit.':
            'Tocca i quadretti per colorarli. I quadretti simmetrici si colorano da soli.',
        // linien5
        'erste Zahl': 'primo numero', 'zweite Zahl': 'secondo numero',
        // stellenwert5 (aria-labels of ▲ ▼), linien5 ("plus" between the two inputs)
        'plus': 'più', 'minus': 'meno',
        'Legen': 'Metti', 'Dazulegen': 'Aggiungi', 'Bündeln': 'Raggruppa', 'Alles bündeln': 'Raggruppa tutto',
        'Fünf Pfennige auf einer Linie werden zu einem Pfennig im Feld darüber, zwei Pfennige in einem Feld zu einem auf der nächsten Linie. So rechnete man vor 500 Jahren.':
            'Cinque gettoni su una linea diventano un gettone nello spazio sopra, due gettoni in uno spazio diventano uno sulla linea successiva. Così si calcolava 500 anni fa.',
        'Fertig gebündelt. Jetzt kann man das Ergebnis ablesen.': 'Tutto raggruppato. Ora si può leggere il risultato.',
        'Rot markiert: Hier muss noch gebündelt werden.': 'Segnato in rosso: qui bisogna ancora raggruppare.',
        'Linienbrett mit Rechenpfennigen': 'Tavola a linee con gettoni da calcolo',

        // book it-16 mathe6-it:
        // bruch5
        'Kreis': 'Cerchio', 'Rechteck': 'Rettangolo', 'Streifen': 'Striscia', 'Bild': 'Figura', 'Zähler': 'Numeratore', 'Nenner': 'Denominatore',
        'Erweitern mit 2': 'Amplifica per 2', 'mit 3': 'per 3', 'Kürzen': 'Semplifica', 'weniger': 'meno', 'mehr': 'più',
        // bruchstrahl5
        'Gib Brüche wie 3/4 oder Dezimalzahlen wie 0,7 ein, auch Zahlen größer als 1 bis 3.':
            'Scrivi frazioni come 3/4 o numeri decimali come 0,7, anche numeri maggiori di 1, fino a 3.',
        'Zahlenstrahl mit zwei Zahlen': 'Retta numerica con due numeri',
        'Bitte zwei Zahlen zwischen 0 und 3 eingeben, zum Beispiel 3/4 oder 0,7.': 'Scrivi due numeri tra 0 e 3, per esempio 3/4 o 0,7.',
        // komma5
        'Neu': 'Nuovo',
        'Beim Multiplizieren mit 10 rückt jede Ziffer eine Stelle nach links, beim Dividieren nach rechts. Man sagt kurz: Das Komma wandert.':
            'Moltiplicando per 10 ogni cifra si sposta di un posto verso sinistra, dividendo verso destra. In breve si dice: la virgola si sposta.',
        'nicht möglich: Die Ziffern würden aus der Tafel fallen.': 'non è possibile: le cifre uscirebbero dalla tabella.',
        // mittel5
        'Ausgleichen': 'Pareggia', 'Neue Werte': 'Nuovi valori', 'Mittelwert': 'Media', 'Säulen mit dem Mittelwert': 'Colonne con la media',
        'Zieh die Säulen höher oder niedriger. „Ausgleichen“ verteilt alles gerecht: Jede Säule bekommt gleich viel.':
            'Trascina le colonne più in alto o più in basso. «Pareggia» distribuisce tutto in modo equo: ogni colonna riceve la stessa quantità.',
        // winkelpaare5
        'Scheitelwinkel': 'Opposti al vertice', 'Nebenwinkel': 'Adiacenti', 'Stufenwinkel': 'Corrispondenti', 'Wechselwinkel': 'Alterni',
        'Winkelpaar': 'Coppia di angoli', 'Anderes Paar': 'Altra coppia', 'h kippen': 'Inclina h',
        'Zieh am Punkt auf der Geraden s, um sie zu drehen. Mit „h kippen“ sind g und h nicht mehr parallel.':
            'Trascina il punto sulla retta s per ruotarla. Con «Inclina h» g e h non sono più parallele.',
        'Zwei Geraden g und h, geschnitten von s': 'Due rette g e h tagliate da s',
        // rechteck5
        'Zusammengesetzte Figur': 'Figura composta', 'Figur': 'Figura', 'Zerlegen': 'Scomponi', 'Ergänzen': 'Completa', 'Weg': 'Metodo',
        'Zieh an der Ecke. Ein Kästchen ist 1 cm lang und 1 cm breit, also 1 cm² groß.':
            'Trascina l’angolo. Un quadretto è lungo 1 cm e largo 1 cm, quindi ha un’area di 1 cm².',

    },
    phrase: [
        // book it-10 mathegy5-it:
        // stellenwert5
        ['Als Zehnerbruch: ', 'Come frazione decimale: '], ['Eine natürliche Zahl, keine Stelle nach dem Komma.', 'Un numero naturale, nessuna cifra dopo la virgola.'],
        // zahlenstrahl5
        ['Bei 5, 6, 7, 8 oder 9 wird <b>aufgerundet</b>.', 'Con 5, 6, 7, 8 o 9 si arrotonda <b>per eccesso</b>.'],
        ['Bei 0, 1, 2, 3 oder 4 wird <b>abgerundet</b>.', 'Con 0, 1, 2, 3 o 4 si arrotonda <b>per difetto</b>.'],
        // sieb5
        ['Starte das Sieb mit „Nächster Schritt“.', 'Avvia il crivello con «Passo successivo».'],
        ['Die 1 ist <b>keine Primzahl</b>: Sie hat nur einen einzigen Teiler.', 'L’1 <b>non è un numero primo</b>: ha un solo divisore.'],
        ['Die 2 ist die erste Primzahl. Alle ihre Vielfachen 4, 6, 8, … sind gestrichen.', 'Il 2 è il primo numero primo. Tutti i suoi multipli 4, 6, 8, … sono cancellati.'],
        ['Die 3 ist die nächste Primzahl. Ihre Vielfachen 6, 9, 12, … sind gestrichen.', 'Il 3 è il numero primo successivo. I suoi multipli 6, 9, 12, … sono cancellati.'],
        ['Die 5 ist die nächste Primzahl. Gestrichen: 10, 15, 20, …', 'Il 5 è il numero primo successivo. Cancellati: 10, 15, 20, …'],
        ['Die 7 ist die nächste Primzahl. Neu gestrichen: 49, 77, 91 und die anderen Vielfachen.', 'Il 7 è il numero primo successivo. Nuovi cancellati: 49, 77, 91 e gli altri multipli.'],
        ['Fertig! Die nächste Zahl wäre 11, aber 11 · 11 = 121 liegt schon über 100. Alle übrigen Zahlen sind <b>Primzahlen</b>: Es sind 25 Stück.',
            'Fatto! Il numero successivo sarebbe l’11, ma 11 · 11 = 121 è già oltre 100. Tutti i numeri rimasti sono <b>numeri primi</b>: sono 25.'],
        // bruch5
        ['Null Teile: der Bruch hat den Wert 0.', 'Zero parti: la frazione vale 0.'],
        ['Ein <b>echter Bruch</b>: weniger als ein Ganzes.', 'Una <b>frazione propria</b>: meno di un intero.'],
        ['Genau <b>ein Ganzes</b>.', 'Esattamente <b>un intero</b>.'],
        ['Ein <b>unechter Bruch</b>: mehr als ein Ganzes', 'Una <b>frazione impropria</b>: più di un intero'],
        [', als gemischte Zahl $', ', come numero misto $'],
        ['Der Bruch lässt sich nicht weiter kürzen.', 'La frazione non si può semplificare ulteriormente.'],
        ['Als Dezimalzahl: ', 'Come numero decimale: '], [' · in Prozent: ', ' · in percentuale: '],
        ['Als Dezimalzahl ungefähr ', 'Come numero decimale circa '],
        ['. Der Nenner hat einen anderen Primfaktor als 2 und 5, deshalb hört die Dezimalzahl nicht auf.',
            '. Il denominatore ha un fattore primo diverso da 2 e da 5, perciò il numero decimale non finisce.'],
        // bruchstrahl5
        ['$ und $', '$ e $'],
        ['Jetzt vergleicht man nur die Zähler: ', 'Ora si confrontano solo i numeratori: '],
        ['Als Dezimalzahlen: ', 'Come numeri decimali: '], ['. Weiter rechts auf dem Zahlenstrahl heißt größer.', '. Più a destra sulla retta numerica vuol dire più grande.'],
        // winkel5
        ['Deine Schätzung: ', 'La tua stima: '],
        // winkelpaare5
        ['Scheitelwinkel liegen sich am selben Schnittpunkt gegenüber. Sie sind <b>immer gleich groß</b>.',
            'Gli angoli opposti al vertice stanno uno di fronte all’altro nello stesso punto di intersezione. Sono <b>sempre uguali</b>.'],
        ['Nebenwinkel liegen am selben Schnittpunkt nebeneinander und bilden zusammen einen gestreckten Winkel: Sie ergänzen sich <b>immer zu 180°</b>.',
            'Gli angoli adiacenti stanno uno accanto all’altro nello stesso punto di intersezione e insieme formano un angolo piatto: <b>la loro somma è sempre 180°</b>.'],
        ['Stufenwinkel liegen an verschiedenen Schnittpunkten auf derselben Seite von s und derselben Seite der Geraden. ',
            'Gli angoli corrispondenti stanno in punti di intersezione diversi, dalla stessa parte di s e dalla stessa parte delle rette. '],
        ['Wechselwinkel liegen an verschiedenen Schnittpunkten auf verschiedenen Seiten von s und zwischen den Geraden. ',
            'Gli angoli alterni interni stanno in punti di intersezione diversi, da parti opposte di s e tra le due rette. '],
        ['An <b>parallelen</b> Geraden sind sie <b>gleich groß</b>.', 'Se le rette sono <b>parallele</b>, sono <b>uguali</b>.'],
        ['Weil g und h <b>nicht parallel</b> sind, sind sie verschieden groß.', 'Poiché g e h <b>non sono parallele</b>, non sono uguali.'],
        // spiegel5
        ['Spiegelachse ', 'Asse di simmetria '], ['schräg durch ', 'obliquo per '],
        ['Die Bildfigur ist gleich groß, aber <b>umgeklappt</b>: Der Umlaufsinn A → B → C → D dreht sich um.',
            'La figura immagine è grande uguale, ma <b>ribaltata</b>: il verso di percorrenza A → B → C → D si inverte.'],
        ['Jeder Punkt bleibt gleich weit von Z entfernt. Die Figur wird nicht umgeklappt.', 'Ogni punto resta alla stessa distanza da Z. La figura non viene ribaltata.'],
        ['Tipp: Ist die Figur umgeklappt, ist es eine Spiegelung. Zeigen alle Seiten in dieselbe Richtung wie vorher, ist es eine Verschiebung.',
            'Suggerimento: se la figura è ribaltata, è una riflessione. Se tutti i lati puntano nella stessa direzione di prima, è una traslazione.'],
        // rechteck5
        ['Ein Quadrat: alle vier Seiten gleich lang.', 'Un quadrato: tutti e quattro i lati sono lunghi uguali.'],
        ['Zerlegen in zwei Rechtecke:', 'Scomporre in due rettangoli:'],
        ['Zum großen Rechteck ergänzen und das fehlende Stück abziehen:', 'Completare il rettangolo grande e togliere il pezzo che manca:'],
        ['Erstaunlich: Der Umfang ist so groß wie beim ganzen Rechteck, weil die Stufe genauso lang ist wie die fehlenden Seiten.',
            'Sorprendente: il perimetro è lo stesso del rettangolo intero, perché lo scalino è lungo esattamente quanto i lati che mancano.'],
        // quader5
        ['Gegenüberliegende Flächen haben dieselbe Farbe: Sie sind gleich groß.', 'Le facce opposte hanno lo stesso colore: sono uguali.'],
        ['Alle 12 Kanten zusammen: ', 'Tutti i 12 spigoli insieme: '], ['Alle Kanten gleich lang: ein Würfel.', 'Tutti gli spigoli sono lunghi uguali: un cubo.'],
        // einheiten5
        ['Rechnung: ', 'Calcolo: '],
        ['Treppe hinunter zur kleineren Einheit: Die Maßzahl wird größer, man <b>multipliziert</b>.', 'Si scende la scala verso l’unità più piccola: il numero diventa più grande, si <b>moltiplica</b>.'],
        ['Treppe hinauf zur größeren Einheit: Die Maßzahl wird kleiner, man <b>dividiert</b>.', 'Si sale la scala verso l’unità più grande: il numero diventa più piccolo, si <b>divide</b>.'],
        ['Gleiche Einheit, nichts zu tun.', 'Stessa unità: non c’è niente da fare.'],
        ['Bei Flächen ist die Umrechnungszahl immer 100.', 'Per le superfici il fattore di conversione è sempre 100.'],
        ['Bei Volumen ist die Umrechnungszahl immer 1000.', 'Per i volumi il fattore di conversione è sempre 1000.'],
        ['Achtung: Bei der Zeit gibt es keine Zehnerschritte.', 'Attenzione: per il tempo non si va di dieci in dieci.'],
        // zahlschrift5
        ['Jedes Zeichen wird so oft hingeschrieben, wie es gebraucht wird. Die Reihenfolge ist egal, eine Null braucht man nicht. Strich 1, Fessel 10, Seil 100, Lotus 1000.',
            'Ogni simbolo si scrive tante volte quante servono. L’ordine non conta e lo zero non serve. Bastoncino 1, ansa 10, corda 100, fiore di loto 1000.'],
        ['I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. Steht ein kleineres Zeichen vor einem größeren, wird es abgezogen: IV = 4, XC = 90, CM = 900.',
            'I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. Se un simbolo più piccolo sta davanti a uno più grande, si sottrae: IV = 4, XC = 90, CM = 900.'],
        ['Die Maya zählten mit Zwanzigern. Punkt = 1, Strich = 5. Von unten nach oben ist jede Stufe zwanzigmal so viel wert. Für eine leere Stufe hatten sie ein Zeichen für die Null, die Muschel.',
            'I maya contavano a gruppi di venti. Punto = 1, barra = 5. Dal basso verso l’alto ogni livello vale venti volte di più. Per un livello vuoto avevano un simbolo per lo zero: la conchiglia.'],
        ['Im Zweiersystem gibt es nur die Ziffern 0 und 1. Jede Stelle ist doppelt so viel wert wie die rechts daneben. So rechnen Computer.',
            'Nel sistema binario esistono solo le cifre 0 e 1. Ogni posizione vale il doppio di quella alla sua destra. Così calcolano i computer.'],
        // mittel5
        ['Mittelwert', 'Media'], ['Summe: ', 'Somma: '], ['Geteilt durch die Anzahl: ', 'Diviso per il numero dei valori: '],
        ['Was über der Linie war (gestrichelt grau), füllt genau die Lücken (gelb).', 'Quello che stava sopra la linea (grigio tratteggiato) riempie esattamente i vuoti (giallo).'],
        // koord5
        ['g ∥ h: Die Geraden sind <b>parallel</b>, sie schneiden sich nie.', 'g ∥ h: le rette sono <b>parallele</b>, non si incontrano mai.'],
        ['g ⊥ h: Die Geraden stehen <b>senkrecht</b> aufeinander.', 'g ⊥ h: le rette sono <b>perpendicolari</b>.'],
        ['g und h sind weder parallel noch senkrecht. Versuche, sie parallel oder senkrecht zu stellen.', 'g e h non sono né parallele né perpendicolari. Prova a metterle parallele o perpendicolari.'],

        // book it-16 mathe6-it:
        // bruch5
        ['Null Teile: der Bruch hat den Wert 0.', 'Zero parti: la frazione vale 0.'],
        ['Ein <b>echter Bruch</b>: weniger als ein Ganzes.', 'Una <b>frazione propria</b>: meno di un intero.'],
        ['Genau <b>ein Ganzes</b>.', 'Esattamente <b>un intero</b>.'],
        ['Ein <b>unechter Bruch</b>: mehr als ein Ganzes', 'Una <b>frazione impropria</b>: più di un intero'],
        [', als gemischte Zahl $', ', come numero misto $'],
        ['Der Bruch lässt sich nicht weiter kürzen.', 'La frazione non si può semplificare ulteriormente.'],
        ['Als Dezimalzahl: ', 'Come numero decimale: '], [' · in Prozent: ', ' · in percentuale: '],
        ['Als Dezimalzahl ungefähr ', 'Come numero decimale circa '],
        ['. Der Nenner hat einen anderen Primfaktor als 2 und 5, deshalb hört die Dezimalzahl nicht auf.',
            '. Il denominatore ha un fattore primo diverso da 2 e da 5, perciò il numero decimale non finisce.'],
        // bruchstrahl5
        ['Jetzt vergleicht man nur die Zähler: ', 'Ora si confrontano solo i numeratori: '],
        ['Als Dezimalzahlen: ', 'Come numeri decimali: '], ['. Weiter rechts auf dem Zahlenstrahl heißt größer.', '. Più a destra sulla retta numerica vuol dire più grande.'],
        // mittel5
        ['Mittelwert', 'Media'], ['Summe: ', 'Somma: '], ['Geteilt durch die Anzahl: ', 'Diviso per il numero dei valori: '],
        ['Was über der Linie war (gestrichelt grau), füllt genau die Lücken (gelb).', 'Ciò che stava sopra la linea (grigio tratteggiato) riempie esattamente i vuoti (giallo).'],
        // winkelpaare5
        ['Scheitelwinkel liegen sich am selben Schnittpunkt gegenüber. Sie sind <b>immer gleich groß</b>.',
            'Gli angoli opposti al vertice stanno uno di fronte all’altro nello stesso punto di intersezione. Sono <b>sempre uguali</b>.'],
        ['Nebenwinkel liegen am selben Schnittpunkt nebeneinander und bilden zusammen einen gestreckten Winkel: Sie ergänzen sich <b>immer zu 180°</b>.',
            'Gli angoli adiacenti stanno uno accanto all’altro nello stesso punto di intersezione e insieme formano un angolo piatto: sommati fanno <b>sempre 180°</b>.'],
        ['Stufenwinkel liegen an verschiedenen Schnittpunkten auf derselben Seite von s und derselben Seite der Geraden. ',
            'Gli angoli corrispondenti stanno in punti di intersezione diversi, dalla stessa parte di s e dalla stessa parte delle rette. '],
        ['Wechselwinkel liegen an verschiedenen Schnittpunkten auf verschiedenen Seiten von s und zwischen den Geraden. ',
            'Gli angoli alterni stanno in punti di intersezione diversi, da parti diverse di s e tra le rette. '],
        ['An <b>parallelen</b> Geraden sind sie <b>gleich groß</b>.', 'Su rette <b>parallele</b> sono <b>uguali</b>.'],
        ['Weil g und h <b>nicht parallel</b> sind, sind sie verschieden groß.', 'Poiché g e h <b>non sono parallele</b>, sono diversi.'],
        // rechteck5
        ['Ein Quadrat: alle vier Seiten gleich lang.', 'Un quadrato: tutti e quattro i lati sono uguali.'],
        ['Zerlegen in zwei Rechtecke:', 'Scomporre in due rettangoli:'],
        ['Zum großen Rechteck ergänzen und das fehlende Stück abziehen:', 'Completare fino al rettangolo grande e sottrarre il pezzo che manca:'],
        ['Erstaunlich: Der Umfang ist so groß wie beim ganzen Rechteck, weil die Stufe genauso lang ist wie die fehlenden Seiten.',
            'Sorprendente: il perimetro è uguale a quello del rettangolo intero, perché il gradino è lungo esattamente quanto i lati che mancano.'],

    ],
    rule: [
        // book it-10 mathegy5-it:
        // plain-text points: A(2 | 1) → A(2, 1), A(1,5 | 2) → A(1,5; 2)
        [/\((-?\d+(?:,\d+)?) \| (-?\d+(?:,\d+)?)\)/g, (m, a, b) => '(' + a + (/,/.test(a + b) ? '; ' : ', ') + b + ')'],
        // place value tables: Italian column heads (u, da, h; uk, dak, hk; uM, daM, hM; uG; after the comma d, c, m)
        [/<table class="g5-sw[\s\S]*?<\/table>/g, (() => {
            const PLACE = { Mrd: 'uG', HM: 'hM', ZM: 'daM', M: 'uM', HT: 'hk', ZT: 'dak', T: 'uk', H: 'h', Z: 'da', E: 'u', z: 'd', h: 'c', t: 'm' };
            return t => t.replace(/<th( class="[^"]*")?>(Mrd|HM|ZM|M|HT|ZT|T|H|Z|E|z|h|t)<\/th>/g, (m, c, k) => '<th' + (c || '') + '>' + PLACE[k] + '</th>');
        })()],
        // stellenwert5: the number in words, read from the number above it (Italian number words, written together up to
        // the thousands: 4 738 216 → quattro milioni settecentotrentottomiladuecentosedici; 3 017 008 000 → tre miliardi
        // diciassette milioni ottomila; ventuno, ventotto, centottanta; a compound ending in -tre gets the accent: ventitré)
        ...(() => {
            const ONE = ['', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci', 'undici', 'dodici', 'tredici',
                'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove'];
            const TEN = ['', '', 'venti', 'trenta', 'quaranta', 'cinquanta', 'sessanta', 'settanta', 'ottanta', 'novanta'];
            const DIGIT = ['zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove'];
            const u100 = n => n < 20 ? ONE[n] : (n % 10 === 1 || n % 10 === 8 ? TEN[Math.floor(n / 10)].slice(0, -1) : TEN[Math.floor(n / 10)]) + ONE[n % 10];
            const u1000 = n => { const h = Math.floor(n / 100), r = u100(n % 100); const c = h ? (h === 1 ? 'cento' : ONE[h] + 'cento') : ''; return (c && /^o/.test(r) ? c.slice(0, -1) : c) + r; };
            const u1e6 = n => { const t = Math.floor(n / 1000); return (t ? (t === 1 ? 'mille' : u1000(t) + 'mila') : '') + u1000(n % 1000); };
            const acc = w => /.tre$/.test(w) ? w.slice(0, -1) + 'é' : w;
            const big = (n, one, many) => n === 1 ? one : acc(u1000(n)) + ' ' + many;
            const words = n => {
                if (!n) return 'zero';
                const g = Math.floor(n / 1e9), m = Math.floor(n / 1e6) % 1000, r = n % 1e6;
                return [g ? big(g, 'un miliardo', 'miliardi') : '', m ? big(m, 'un milione', 'milioni') : '', r ? acc(u1e6(r)) : ''].filter(Boolean).join(' ');
            };
            const num = s => +s.replace(/[\s .]/g, '');
            const G = '\\d[\\d\\u202f]*';
            return [
                [new RegExp('(<p class="g5-big">)(' + G + ')(</p><p class="g5-word">)[^<]*'), (m, a, n, b) => a + n + b + words(num(n))],
                [new RegExp('(<p class="g5-big">)(' + G + '(?:,\\d+)?)(</p>[\\s\\S]*?<p class="g5-dim">)Gesprochen: [^<]*'), (m, a, n, b) => {
                    const [i, f] = n.split(',');
                    return a + n + b + 'Si legge: ' + words(num(i)) + (f ? ' virgola ' + [...f].map(d => DIGIT[+d]).join(' ') : '');
                }],
            ];
        })(),
        [/Das sind (\d+) Stellen\./, 'Il numero ha $1 cifre.'],
        [/Das ist 1 Stelle\./, 'Il numero ha 1 cifra.'],
        // zahlenstrahl5
        [/Gerundet auf (Zehner|Hunderter|Tausender|Zehntausender|Hunderttausender|Millionen)\. Entscheidend ist die Ziffer rechts davon: /,
            (m, p) => 'Arrotondato ' + { Zehner: 'alle decine', Hunderter: 'alle centinaia', Tausender: 'alle migliaia', Zehntausender: 'alle decine di migliaia',
                Hunderttausender: 'alle centinaia di migliaia', Millionen: 'ai milioni' }[p] + '. Decide la cifra alla sua destra: '],
        [/^Zahlenstrahl mit der Zahl (.+) zwischen (.+) und (.+)$/, 'Retta numerica con il numero $1 tra $2 e $3'],
        // sieb5
        [/<b>Teiler von (\d+):<\/b> (.*?) \((\d+) Stück\)/, (m, n, l, k) => '<b>Divisori di ' + n + ':</b> ' + l + ' (' + k + (+k === 1 ? ' divisore' : ' divisori') + ')'],
        [/(\d+) ist eine Primzahl<\/span>: genau zwei Teiler, 1 und (\d+)\./, '$1 è un numero primo</span>: esattamente due divisori, 1 e $2.'],
        // bruch5
        [/^(Kreis|Streifen|Rechteck)bild des Bruchs (\d+)\/(\d+)$/, (m, f, z, n) => 'La frazione ' + z + '/' + n + ' rappresentata con ' + { Kreis: 'un cerchio', Streifen: 'una striscia', Rechteck: 'un rettangolo' }[f]],
        [/, genau (\d+) Ganze\./, ', esattamente $1 interi.'],
        [/Kürzen mit (\d+) ergibt /, 'Semplificando per $1 si ottiene '],
        // bruchstrahl5
        [/^Zahl ([A-Z])$/, 'Numero $1'],
        [/Auf denselben Nenner (\d+) gebracht: /, 'Con lo stesso denominatore $1: '],
        // winkel5: the kinds of angle
        ...(() => {
            const KIND = { 'Nullwinkel': 'angolo nullo', 'spitzer Winkel': 'angolo acuto', 'rechter Winkel': 'angolo retto', 'stumpfer Winkel': 'angolo ottuso',
                'gestreckter Winkel': 'angolo piatto', 'überstumpfer Winkel': 'angolo concavo', 'Vollwinkel': 'angolo giro' };
            const KINDS = Object.keys(KIND).join('|');
            return [
                [new RegExp('<p>Ein <b>(' + KINDS + ')</b>'), (m, k) => '<p>Un <b>' + KIND[k] + '</b>'],
                [new RegExp('Es ist ein (' + KINDS + ')\\.'), (m, k) => 'È un ' + KIND[k] + '.'],
            ];
        })(),
        [/Tipp zum Messen: Miss den Rest bis zum Vollwinkel, (\d+)°, und rechne 360° − (\d+)°\./,
            'Suggerimento per misurare: misura quello che manca all’angolo giro, $1°, e calcola 360° − $2°.'],
        [/, nur (\d+)° daneben!/, ': solo $1° di differenza!'], [/Gut, (\d+)° daneben\./, 'Bene, $1° di differenza.'],
        [/(\d+)° daneben\. Vergleiche mit 90° und 180°: Wo liegt der Winkel dazwischen\?/, '$1° di differenza. Confronta con 90° e 180°: dove si trova l’angolo rispetto a questi?'],
        [/^Winkel von (\d+) Grad$/, 'Angolo di $1 gradi'],
        // the vertex S (Scheitel) is V (vertice)
        [/(<text class="g-pt"[^>]*>)S(<\/text>)/, '$1V$2'],
        // winkelpaare5
        [/g und h sind (nicht )?parallel\./, (m, n) => 'g e h ' + (n ? 'non sono' : 'sono') + ' parallele.'],
        // spiegel5
        [/Jeder Punkt wandert (\d+) nach (links|rechts) und (\d+) nach (unten|oben)\./,
            (m, a, lr, b, du) => 'Ogni punto si sposta di ' + a + ' verso ' + (lr === 'links' ? 'sinistra' : 'destra') + ' e di ' + b + ' verso ' + (du === 'oben' ? 'l’alto' : 'il basso') + '.'],
        [/Drehung um Z(\([^)]*\)) um (\d+)°\./, 'Rotazione di $2° attorno a Z$1.'],
        [/(data-v="schraeg">)schräg</, '$1obliquo<'],
        [/(Richtig, es ist|Nicht ganz\. Es ist) eine (Spiegelung|Verschiebung|Drehung)\./,
            (m, p, k) => (p[0] === 'R' ? 'Giusto, è ' : 'Non proprio. È ') + { Spiegelung: 'una riflessione', Verschiebung: 'una traslazione', Drehung: 'una rotazione' }[k] + '.'],
        // rechteck5
        [/^Rechteck aus (\d+) Einheitsquadraten$/, 'Rettangolo formato da $1 quadretti unitari'],
        [/Das ist 1 Reihe mit (\d+) Kästchen\./, (m, k) => 'È 1 fila di ' + k + (+k === 1 ? ' quadretto' : ' quadretti') + '.'],
        [/Das sind (\d+) Reihen mit je (\d+) Kästchen\./, (m, r, k) => (+r === 1 ? 'È 1 fila' : 'Sono ' + r + ' file') + ' di ' + k + (+k === 1 ? ' quadretto' : ' quadretti') + ' ciascuna.'],
        [/<p>Zusammen (\d+) cm²/, '<p>In tutto $1 cm²'],
        // quader5
        [/^Quader (\d+) mal (\d+) mal (\d+)$/, 'Parallelepipedo $1 per $2 per $3'],
        [/(\d+) Schicht(en)? mit je (.+?) Würfeln\./, (m, c, en, x) => c + (+c === 1 ? ' strato' : ' strati') + ' di ' + x + ' cubetti ciascuno.'],
        // einheiten5
        [/^Einheitentreppe (Länge|Masse|Zeit|Fläche|Volumen)$/, (m, k) => 'Scala delle unità di ' + { 'Länge': 'lunghezza', Masse: 'massa', Zeit: 'tempo', 'Fläche': 'superficie', Volumen: 'volume' }[k]],
        // zahlschrift5 ("Zahl" alone is a coin side elsewhere)
        [/^Die Zahl (\d+) in (aegypten|rom|maya|binaer)$/, (m, v, k) => 'Il numero ' + v + ' ' + { aegypten: 'nella numerazione egizia', rom: 'nella numerazione romana', maya: 'nella numerazione maya', binaer: 'nel sistema binario' }[k]],
        [/(<label for="[^"]*">)Zahl(<\/label>)/, '$1Numero$2'], [/^Zahl$/, 'Numero'],
        // symmetrie5
        [/^Farbe (\d)$/, 'Colore $1'],
        // koord5
        [/<\/span> geht durch A und B, (<span[^>]*>h<\/span>) durch C und D\./, '</span> passa per A e B, $1 per C e D.'],
        [/Getroffen! A liegt auf /, 'Centrato! A si trova in '], [/<b>Aufgabe:<\/b> Zieh A auf den Punkt /, '<b>Compito:</b> trascina A sul punto '],
        // linien5
        [/(<span class="b-ctrl">)Zahl (?=<input)/, '$1Numero '],
        [/Fünf Pfennige auf der Linie (\d[\d ]*) werden zu einem im Feld (\d[\d ]*)\./, 'Cinque gettoni sulla linea $1 diventano uno nello spazio $2.'],
        [/Zwei Pfennige im Feld (\d[\d ]*) werden zu einem auf der Linie (\d[\d ]*)\./, 'Due gettoni nello spazio $1 diventano uno sulla linea $2.'],
        [/(\d[\d ]*) ist gelegt\./, '$1 è sistemato.'],
        [/(\d[\d ]*) dazugelegt\. Jetzt muss gebündelt werden\./, 'Aggiunto $1. Ora bisogna raggruppare.'],

        // book it-16 mathe6-it:
        // bruch5
        [/^(Kreis|Streifen|Rechteck)bild des Bruchs (\d+)\/(\d+)$/, (m, f, z, n) => 'La frazione ' + z + '/' + n + ' come ' + ({ Kreis: 'cerchio', Streifen: 'striscia', Rechteck: 'rettangolo' })[f]],
        [/, genau (\d+) Ganze\./, ', esattamente $1 interi.'],
        [/Kürzen mit (\d+) ergibt /, 'Semplificando per $1 si ottiene '],
        // bruchstrahl5
        [/^Zahl ([A-Z])$/, 'Numero $1'],
        [/Auf denselben Nenner (\d+) gebracht: (\$[^$]*\$) und (\$[^$]*\$)/, 'Con il denominatore comune $1: $2 e $3'],
        // komma5 (and stellenwert5): the column heads of the place value tables, u, da, h, k …; d, c, m after the comma
        [/<table class="g5-sw[\s\S]*?<\/table>/g, t => t.replace(/<th( class="[^"]*")?>(Mrd|HM|ZM|M|HT|ZT|T|H|Z|E|z|h|t)<\/th>/g, (m, c, k) => '<th' + (c || '') + '>' +
            ({ Mrd: 'G', HM: 'hM', ZM: 'daM', M: 'M', HT: 'hk', ZT: 'dak', T: 'k', H: 'h', Z: 'da', E: 'u', z: 'd', h: 'c', t: 'm' })[k] + '</th>')],
        // winkelpaare5
        [/g und h sind (nicht )?parallel\./, (m, n) => 'g e h ' + (n ? 'non sono' : 'sono') + ' parallele.'],
        // rechteck5
        [/^Rechteck aus (\d+) Einheitsquadraten$/, 'Rettangolo formato da $1 quadrati unitari'],
        [/Das ist 1 Reihe mit (\d+) Kästchen\./, (m, k) => 'È 1 fila di ' + k + (k === '1' ? ' quadretto.' : ' quadretti.')],
        [/Das sind (\d+) Reihen mit je (\d+) Kästchen\./, (m, r, k) => 'Sono ' + r + ' file di ' + k + (k === '1' ? ' quadretto' : ' quadretti') + ' ciascuna.'],
        [/<p>Zusammen (\d+) cm²/, '<p>In tutto $1 cm²'],

    ]
});
