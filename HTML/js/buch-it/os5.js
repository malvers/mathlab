/* js/buch-it/os5.js — Italian for the widgets of js/buch-os5.js.
 * Loaded by the Italian editions right after js/buch-os5.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Doc, 26.10.2026: OS 5 in four languages at the same time (Italian: Castelnuovo, block it-21). Each book has its own
 * comment line in word, phrase and rule - write only right below your book's line, every entry ending with a comma.
 * The pages of mathe5-it also load js/buch-it/gy5.js, geometrie.js and os6.js: their words ("Zähler", "Nächster Schritt",
 * "Von vorn", "Neue Zahl", "Ergänzen", the rule for "Zahl" in a range label …) are not repeated here.
 */
window.BuchIT && BuchIT.add('os5', {
    word: {
        // book it-21 mathe5-it:
        // titelbildos5
        'Titelbild: ein Würfel im Schrägbild und sein Netz, ein Kreis mit zwei farbigen Dritteln, ein gespiegelter Schmetterling, babylonische Keilschrift-Zahlen und ein Zahlenstrahl':
            'Copertina: un cubo in assonometria cavaliera e il suo sviluppo, un cerchio con due terzi colorati, una farfalla riflessa, numeri babilonesi in caratteri cuneiformi e una retta numerica',
        // shared helpers: the answer row, the stepper
        'noch nicht': 'non ancora', 'Ganzes': 'Intero',
        // zahlenstrahlos5
        'Erkunden': 'Esplora', 'Ablesen': 'Leggi', 'Einteilung': 'Suddivisione', 'Welche Zahl ist markiert?': 'Quale numero è segnato?',
        'Neue Aufgabe': 'Nuovo esercizio',
        'Zähle die Striche ab der linken Zahl. Wie groß ist ein Schritt von Strich zu Strich?':
            'Conta le tacche a partire dal numero di sinistra. Quanto vale un passo da una tacca all’altra?',
        'Zieh den Punkt über den Zahlenstrahl. Je weiter rechts, desto größer die Zahl.':
            'Trascina il punto lungo la retta numerica. Più è a destra, più grande è il numero.',
        // schriftlichos5
        'Addieren': 'Addizione', 'Subtrahieren': 'Sottrazione', 'Multiplizieren': 'Moltiplicazione', 'Dividieren': 'Divisione',
        'Rechenart': 'Operazione', 'Entbündeln': 'Cambia', 'Verfahren': 'Metodo', 'Alles zeigen': 'Mostra tutto',
        'Bitte zwei Zahlen eingeben, zum Beispiel 4738 und 1296.': 'Scrivi due numeri, per esempio 4738 e 1296.',
        'Bitte höchstens drei Stellen nach dem Komma.': 'Al massimo tre cifre dopo la virgola, per favore.',
        'Bitte Zahlen mit höchstens neun Stellen vor dem Komma.': 'Numeri con al massimo nove cifre prima della virgola, per favore.',
        'Die zweite Zahl ist größer als die erste. In den natürlichen Zahlen geht diese Subtraktion nicht.':
            'Il secondo numero è maggiore del primo. Con i numeri naturali questa sottrazione non si può fare.',
        'Der zweite Faktor muss hier eine natürliche Zahl sein. Tausche die Faktoren, wenn nötig.':
            'Qui il secondo fattore deve essere un numero naturale. Se serve, scambia i fattori.',
        'Bitte höchstens sieben Ziffern im ersten und drei im zweiten Faktor.': 'Al massimo sette cifre nel primo fattore e tre nel secondo, per favore.',
        'Hier teilst du durch eine einstellige Zahl von 1 bis 9.': 'Qui dividi per un numero di una cifra, da 1 a 9.',
        'Bitte höchstens acht Ziffern.': 'Al massimo otto cifre, per favore.',
        'Schreibe die Zahlen stellengerecht untereinander: Einer unter Einer. Gerechnet wird von rechts nach links.':
            'Scrivi i numeri in colonna, ogni cifra sotto quella dello stesso posto: unità sotto unità. Si calcola da destra verso sinistra.',
        'Schreibe die Zahlen stellengerecht untereinander: Einer unter Einer, Komma unter Komma. Fehlende Stellen hinter dem Komma füllst du mit Nullen auf. Gerechnet wird von rechts nach links.':
            'Scrivi i numeri in colonna, ogni cifra sotto quella dello stesso posto: unità sotto unità, virgola sotto virgola. Le cifre che mancano dopo la virgola le completi con degli zeri. Si calcola da destra verso sinistra.',
        'Schreibe die Zahlen stellengerecht untereinander. Gerechnet wird von rechts nach links, beim Ergänzen fragst du: Wie viel fehlt von der unteren bis zur oberen Zahl?':
            'Scrivi i numeri in colonna, ogni cifra sotto quella dello stesso posto. Si calcola da destra verso sinistra; completando ti chiedi: quanto manca dal numero sotto a quello sopra?',
        'Schreibe die Zahlen stellengerecht untereinander, Komma unter Komma. Gerechnet wird von rechts nach links, beim Ergänzen fragst du: Wie viel fehlt von der unteren bis zur oberen Zahl?':
            'Scrivi i numeri in colonna, ogni cifra sotto quella dello stesso posto, virgola sotto virgola. Si calcola da destra verso sinistra; completando ti chiedi: quanto manca dal numero sotto a quello sopra?',
        'Schreibe die Zahlen stellengerecht untereinander. Gerechnet wird von rechts nach links, beim Entbündeln tauschst du 1 der nächsten Stelle gegen 10.':
            'Scrivi i numeri in colonna, ogni cifra sotto quella dello stesso posto. Si calcola da destra verso sinistra; con il cambio scambi 1 del posto successivo con 10.',
        'Schreibe die Zahlen stellengerecht untereinander, Komma unter Komma. Gerechnet wird von rechts nach links, beim Entbündeln tauschst du 1 der nächsten Stelle gegen 10.':
            'Scrivi i numeri in colonna, ogni cifra sotto quella dello stesso posto, virgola sotto virgola. Si calcola da destra verso sinistra; con il cambio scambi 1 del posto successivo con 10.',
        'Schreibe die Aufgabe nebeneinander. Du nimmst den ersten Faktor nacheinander mit jeder Ziffer des zweiten Faktors mal.':
            'Scrivi l’operazione su una riga. Moltiplichi il primo fattore per ogni cifra del secondo fattore, una dopo l’altra.',
        'Schreibe die Aufgabe nebeneinander. Du nimmst den ersten Faktor nacheinander mit jeder Ziffer des zweiten Faktors mal, zuerst ohne auf das Komma zu achten.':
            'Scrivi l’operazione su una riga. Moltiplichi il primo fattore per ogni cifra del secondo fattore, una dopo l’altra, prima senza badare alla virgola.',
        // vorrangos5
        'Eigener Term': 'La tua espressione', 'Alle Schritte': 'Tutti i passi',
        'Erlaubt sind natürliche Zahlen, + − · : und Klammern. Für · darfst du auch * tippen, für : auch /.':
            'Puoi usare numeri naturali, + − · : e parentesi. Al posto di · puoi scrivere anche *, al posto di : anche /.',
        'Das ist kein vollständiger Term. Prüfe Zahlen, Rechenzeichen und Klammern.':
            'Questa non è un’espressione completa. Controlla numeri, segni delle operazioni e parentesi.',
        'Unterstrichen ist, was als Nächstes gerechnet wird.': 'È sottolineato ciò che si calcola subito dopo.',
        'Durch 0 kann man nicht teilen.': 'Non si può dividere per 0.',
        'Klammer zuerst': 'Prima le parentesi', 'Klammer zuerst, von links nach rechts': 'Prima le parentesi, da sinistra a destra',
        'Klammer zuerst, darin Punkt vor Strich': 'Prima le parentesi, dentro prima per e diviso',
        'Klammer zuerst, darin Punkt vor Strich, von links nach rechts': 'Prima le parentesi, dentro prima per e diviso, da sinistra a destra',
        'Punkt vor Strich': 'Prima per e diviso', 'Punkt vor Strich, von links nach rechts': 'Prima per e diviso, da sinistra a destra',
        'von links nach rechts': 'Da sinistra a destra', 'die letzte Rechnung': 'L’ultimo calcolo', 'Ergebnis': 'Risultato',
        // zehnerpotenzos5
        'Zehnerpotenzen': 'Potenze di dieci', 'Nullen abtrennen': 'Separa gli zeri', 'Hochzahl': 'Esponente',
        'Bitte eine natürliche Zahl mit höchstens 15 Stellen eingeben, zum Beispiel 4 700 000.':
            'Scrivi un numero naturale con al massimo 15 cifre, per esempio 4 700 000.',
        'Die Zahl hat keine Endnull. Hier kann man keine Zehnerpotenz abtrennen.':
            'Il numero non finisce con uno zero. Qui non si può separare nessuna potenza di dieci.',
        'Vor dem Malpunkt steht keine Endnull mehr: Das ist die kürzeste Schreibweise.':
            'Prima del punto della moltiplicazione non c’è più nessuno zero finale: è la scrittura più breve.',
        'So zeigt ein Taschenrechner mit 10 Stellen die Zahl:': 'Così una calcolatrice a 10 cifre mostra il numero:',
        'Anzeige des Taschenrechners': 'Display della calcolatrice', 'Die Zahl passt in die Anzeige.': 'Il numero entra nel display.',
        // quadratos5
        'Quadrieren': 'Al quadrato', 'Wurzel ziehen': 'Radice quadrata', 'Richtung': 'Direzione', 'Seitenlänge n': 'Lato n',
        'Anzahl Plättchen': 'Numero di tessere', 'Bitte eine Zahl von 1 bis 440 eingeben.': 'Scrivi un numero da 1 a 440.',
        // probierenos5
        'Aufgabe': 'Problema', 'Einsetzen': 'Sostituisci', 'Alle Zahlen prüfen': 'Verifica tutti i numeri',
        'Zahlenstrahl mit den eingesetzten Zahlen': 'Retta numerica con i numeri sostituiti',
        'stimmt!': 'è giusto!', 'Nimm eine größere Zahl.': 'Prendi un numero più grande.', 'Nimm eine kleinere Zahl.': 'Prendi un numero più piccolo.',
        'erfüllt die Ungleichung.': 'soddisfa la disequazione.', 'erfüllt sie nicht.': 'non la soddisfa.',
        // teilbarkeitos5
        'Die 1 hat nur einen Teiler. Sie ist keine Primzahl.': 'L’1 ha un solo divisore. Non è un numero primo.',
        // bruchteilos5
        'Das Ganze lässt sich nur in gleich große Gruppen teilen, wenn es ein Vielfaches des Nenners ist. Darum springt es in Schritten.':
            'L’intero si può dividere in gruppi uguali solo se è un multiplo del denominatore. Per questo cambia a salti.',
        'Alle Gruppen: Das ist das Ganze.': 'Tutti i gruppi: è l’intero.', 'Genau die Hälfte.': 'Esattamente la metà.',
        // halbesos5
        'Zwei Bruchstreifen untereinander, mit der Marke für ein Halbes': 'Due strisce di frazioni una sotto l’altra, con il segno per un mezzo',
        'Die gefärbten Längen sind genau gleich: zwei Namen für dieselbe Zahl.': 'Le lunghezze colorate sono esattamente uguali: due nomi per lo stesso numero.',
        'Hier hilft das Bild: Der längere gefärbte Streifen gehört zum größeren Bruch. Genau nachrechnen kannst du das in Klasse 6, wenn du Brüche erweiterst.':
            'Qui aiuta la figura: la striscia colorata più lunga appartiene alla frazione più grande. Potrai verificarlo con il calcolo in 6ª classe, quando imparerai ad amplificare le frazioni.',
        // rundenos5
        'auf Ganze': 'all’unità', 'auf Zehntel': 'ai decimi', 'auf Hundertstel': 'ai centesimi', 'Runden': 'Arrotonda',
        'Der Zahlenstrahl zeigt nur den Ausschnitt zwischen den beiden möglichen Ergebnissen, wie unter einer Lupe. Zieh den Punkt.':
            'La retta numerica mostra solo il tratto tra i due risultati possibili, come sotto una lente d’ingrandimento. Trascina il punto.',
        // wuerfelnetzos5
        'Zufälliges Netz': 'Sviluppo a caso', 'Alles löschen': 'Cancella tutto',
        'Tippe Quadrate an, um sie hinzuzufügen oder wegzunehmen. Sechs zusammenhängende Quadrate werden sofort geprüft.':
            'Tocca i quadrati per aggiungerli o toglierli. Sei quadrati collegati tra loro vengono verificati subito.',
        'Ein Würfel hat 6 Flächen, also besteht jedes Würfelnetz aus 6 Quadraten.': 'Un cubo ha 6 facce, quindi ogni sviluppo del cubo è formato da 6 quadrati.',
        'Die Quadrate hängen nicht alle zusammen.': 'I quadrati non sono tutti collegati.',
        'Jedes Quadrat muss mit einer ganzen Kante an ein anderes stoßen.': 'Ogni quadrato deve toccarne un altro lungo un lato intero.',
        'Kein Würfelnetz.': 'Non è uno sviluppo del cubo.', 'Ein Würfelnetz!': 'È uno sviluppo del cubo!',
        'Beim Falten würden die rot markierten Quadrate aufeinanderliegen, und eine Fläche des Würfels bliebe offen.':
            'Piegando, i quadrati segnati in rosso finirebbero uno sopra l’altro e una faccia del cubo resterebbe aperta.',
        'Die Zahlen zeigen, wie ein Spielwürfel beschriftet wäre: Gegenüberliegende Flächen haben dieselbe Farbe und ergeben zusammen 7.':
            'I numeri mostrano come sarebbe numerato un dado da gioco: le facce opposte hanno lo stesso colore e insieme fanno 7.',
        // bandos5
        'Fahne': 'Bandiera', 'Schlüssel': 'Chiave', 'Blume': 'Fiore', 'Motiv': 'Motivo', 'Verschieben': 'Trasla',
        'Spiegeln, senkrechte Achsen': 'Rifletti, assi verticali', 'Spiegeln, waagerechte Achse': 'Rifletti, asse orizzontale',
        'Verschiebungspfeil': 'freccia di traslazione',
        // zahlzeichenos5
        'Kerbholz und Strichliste': 'Bastone a tacche e stanghette', 'Babylonische Keilschrift': 'Cuneiforme babilonese',
        'Zahlzeichen': 'Simboli numerici', 'Auf 0': 'Torna a 0',
        'Auf dem Kerbholz ist jede fünfte Kerbe länger. So muss man nicht jede einzelne Kerbe zählen, sondern nur die Bündel.':
            'Sul bastone ogni quinta tacca è più lunga. Così non bisogna contare ogni singola tacca, ma solo i gruppi.',
        'Ein senkrechter Keil zählt 1, ein Winkelhaken 10. Jede Stelle nach links ist 60-mal so viel wert.':
            'Un cuneo verticale vale 1, un uncino 10. Ogni posizione verso sinistra vale 60 volte tanto.',
        'Ein senkrechter Keil zählt 1, ein Winkelhaken 10. Jede Stelle nach links ist 60-mal so viel wert. Eine leere Stelle hatte lange kein eigenes Zeichen: Man sah nur eine Lücke.':
            'Un cuneo verticale vale 1, un uncino 10. Ogni posizione verso sinistra vale 60 volte tanto. Per molto tempo una posizione vuota non ebbe un simbolo proprio: si vedeva solo uno spazio.',

    },
    phrase: [
        // book it-21 mathe5-it:
        // zahlenstrahlos5
        ['Ein Schritt von Strich zu Strich ist ', 'Un passo da una tacca all’altra vale '],
        // schriftlichos5
        [' (Übertrag)', ' (riporto)'], [' (gemerkt)', ' (riporto)'], ['Übertrag 1 in die nächste Spalte.', 'Riporto 1 nella colonna successiva.'],
        [' Eine Null ganz vorn schreibt man nicht.', ' Uno zero all’inizio non si scrive.'],
        ['Überschlag: ', 'Stima: '], ['Probe: ', 'Verifica: '],
        [' Hinten hängst du Nullen an, das ändert den Wert nicht.', ' In fondo aggiungi degli zeri: il valore non cambia.'],
        ['Es bleibt nichts übrig.', 'Non resta niente.'], [' Hier kommt das Komma: Setze es auch im Ergebnis.', ' Qui arriva la virgola: mettila anche nel risultato.'],
        // vorrangos5
        [' geht in den natürlichen Zahlen nicht.', ' non si può calcolare con i numeri naturali.'],
        [' geht nicht ohne Rest auf. Wähle andere Zahlen.', ' non dà un risultato senza resto. Scegli altri numeri.'],
        // zehnerpotenzos5
        ['Alle Schreibweisen: $', 'Tutte le scritture: $'], ['Die Zahl ist zu lang. Der Rechner zeigt $', 'Il numero è troppo lungo. La calcolatrice mostra $'],
        // quadratos5, probierenos5
        ['Umgekehrt: $', 'Al contrario: $'], ['$, denn $', '$, perché $'], ['$ ist zu klein', '$ è troppo piccolo'], ['$ ist zu groß', '$ è troppo grande'],
        ['Einsetzen: $', 'Sostituendo: $'], ['Lösung: $', 'Soluzione: $'], ['$. Mit der Umkehraufgabe geht es direkt: $', '$. Con l’operazione inversa si arriva subito: $'],
        ['Alle Lösungen: ', 'Tutte le soluzioni: '], [', … und jede größere Zahl.', ', … e ogni numero più grande.'],
        ['Bisher gefundene Lösungen: ', 'Soluzioni trovate finora: '], ['Noch keine Lösung gefunden.', 'Nessuna soluzione trovata finora.'],
        [' Eine Ungleichung hat oft viele Lösungen.', ' Una disequazione ha spesso molte soluzioni.'],
        // teilbarkeitos5 (the reason for 6, after "<b>durch 6:</b>")
        ['Durch 2 und durch 3 teilbar.', 'Divisibile per 2 e per 3.'], ['Durch 2, aber nicht durch 3 teilbar.', 'Divisibile per 2, ma non per 3.'],
        ['Durch 3, aber nicht durch 2 teilbar.', 'Divisibile per 3, ma non per 2.'], ['Weder durch 2 noch durch 3 teilbar.', 'Non divisibile né per 2 né per 3.'],
        ['<b>Alle Teiler</b> (', '<b>Tutti i divisori</b> ('],
        // halbesos5
        ['<b>Vergleich mit 1:</b> $', '<b>Confronto con 1:</b> $'], ['<b>Vergleich mit einem Halben:</b> $', '<b>Confronto con un mezzo:</b> $'],
        // bandos5
        ['<b>Verschiebung:</b> Jedes Motiv entsteht aus dem vorigen durch dieselbe Verschiebung nach rechts, um eine Kästchenbreite. Alle Motive zeigen in dieselbe Richtung.',
            '<b>Traslazione:</b> ogni motivo nasce dal precedente con la stessa traslazione verso destra, di una casella. Tutti i motivi sono rivolti nella stessa direzione.'],
        ['<b>Spiegelung an senkrechten Achsen:</b> Jedes Motiv ist das Spiegelbild seines Nachbarn. Die grünen Linien sind die Spiegelachsen. Jedes zweite Motiv ist umgeklappt.',
            '<b>Riflessione rispetto ad assi verticali:</b> ogni motivo è l’immagine speculare del suo vicino. Le linee verdi sono gli assi di simmetria. Un motivo sì e uno no è ribaltato.'],
        ['<b>Spiegelung an einer waagerechten Achse:</b> Die untere Reihe ist das Spiegelbild der oberen. Oben und unten ist vertauscht, links und rechts nicht.',
            '<b>Riflessione rispetto a un asse orizzontale:</b> la fila in basso è l’immagine speculare di quella in alto. Alto e basso sono scambiati, sinistra e destra no.'],
        ['Alle Motive sind deckungsgleich: gleiche Form, gleiche Größe.', 'Tutti i motivi sono congruenti: stessa forma, stessa grandezza.'],

    ],
    rule: [
        // book it-21 mathe5-it:
        ...(() => {
            // a whole number as the widgets write it, in groups of three with a narrow no-break space: 4 738 216
            const G = '\\d(?:[\\d\\u202f ]*\\d)?';
            const R = (src, to, fl) => [new RegExp(src, fl || ''), to];
            // the places of the written calculation (js/buch-os5.js PLACE): heading, plural and singular
            const PL = { 'Tausendstel': 'millesimi', 'Hundertstel': 'centesimi', 'Zehntel': 'decimi', 'Einer': 'unità', 'Zehner': 'decine', 'Hunderter': 'centinaia',
                'Tausender': 'migliaia', 'Zehntausender': 'decine di migliaia', 'Hunderttausender': 'centinaia di migliaia', 'Millionen': 'milioni',
                'Zehnmillionen': 'decine di milioni', 'Hundertmillionen': 'centinaia di milioni', 'Milliarden': 'miliardi' };
            const SG = { 'Tausendstel': 'millesimo', 'Hundertstel': 'centesimo', 'Zehntel': 'decimo', 'Einer': 'unità', 'Zehner': 'decina', 'Hunderter': 'centinaio',
                'Tausender': 'migliaio', 'Zehntausender': 'decina di migliaia', 'Hunderttausender': 'centinaio di migliaia', 'Million': 'milione',
                // the widget turns every "…millionen" into "…million": "1 Zehnmillion", and leaves "1 Milliarden"
                'Zehnmillion': 'decina di milioni', 'Hundertmillion': 'centinaio di milioni', 'Milliarden': 'miliardo' };
            const PLACES = Object.keys(PL).sort((a, b) => b.length - a.length).join('|');
            const ONE = Object.keys(SG).sort((a, b) => b.length - a.length).join('|');
            const cap = s => s[0].toUpperCase() + s.slice(1);
            // a digit with its article: il 7, l’8, lo 0
            const art = d => (d === '1' || d === '8' ? 'l’' : d === '0' ? 'lo ' : 'il ') + d;
            const inn = d => (d === '1' || d === '8' ? 'nell’' : 'nel ') + d;
            // fractions: the plural and singular nouns of js/buch-os5.js NTH
            const NTH = { 'Ganze': ['interi', 'intero'], 'Halbe': ['mezzi', 'mezzo'], 'Drittel': ['terzi', 'terzo'], 'Viertel': ['quarti', 'quarto'],
                'Fünftel': ['quinti', 'quinto'], 'Sechstel': ['sesti', 'sesto'], 'Siebtel': ['settimi', 'settimo'], 'Achtel': ['ottavi', 'ottavo'],
                'Neuntel': ['noni', 'nono'], 'Zehntel': ['decimi', 'decimo'], 'Elftel': ['undicesimi', 'undicesimo'], 'Zwölftel': ['dodicesimi', 'dodicesimo'] };
            const N = Object.keys(NTH).join('|');
            const the = w => (/^[aeiou]/.test(w) ? 'gli ' : 'i ') + w, of = w => (/^[aeiou]/.test(w) ? 'degli ' : 'dei ') + w;
            const part = (n, w) => n + ' ' + NTH[w][+n === 1 ? 1 : 0];
            const TEN = { 'eins': 'uno', 'zehn': 'dieci', 'hundert': 'cento', 'tausend': 'mille', 'zehntausend': 'diecimila', 'hunderttausend': 'centomila',
                'eine Million': 'un milione', 'zehn Millionen': 'dieci milioni', 'hundert Millionen': 'cento milioni', 'eine Milliarde': 'un miliardo',
                'zehn Milliarden': 'dieci miliardi', 'hundert Milliarden': 'cento miliardi', 'eine Billion': 'un bilione (mille miliardi)' };
            const ROUND = { 'Ganze': 'all’unità', 'Zehntel': 'ai decimi', 'Hundertstel': 'ai centesimi' };
            const MOTIF = { 'Fahne': 'bandiera', 'Schlüssel': 'chiave', 'Blume': 'fiore' };
            return [
                // the label "Zahl" of a text field (zehnerpotenzos5, teilbarkeitos5, rundenos5; "Zahl" alone is a coin side elsewhere)
                [/(<label class="b-ctrl" for="os5-[a-z]+-\d+">)Zahl(<\/label>)/g, '$1Numero$2'],
                // the stepper: "Zähler kleiner" → "Diminuisci il numeratore" (halbesos5: "Zähler A kleiner")
                [/^(Zähler|Nenner|Ganzes)( [AB])? (kleiner|größer)$/, (m, w, ab, d) => (d === 'kleiner' ? 'Diminuisci ' : 'Aumenta ') +
                    { 'Zähler': 'il numeratore', 'Nenner': 'il denominatore', 'Ganzes': 'l’intero' }[w] + (ab || '')],
                // zahlenstrahlos5
                [/(data-v="\d+">)Schritt /g, '$1Passo '],
                [/^Zahlenstrahl von (.+) bis (.+)$/, 'Retta numerica da $1 a $2'],
                [/(<p class="g-ok">)Richtig: /, '$1Giusto: '],
                R('Von (' + G + ') bis (' + G + ') sind es 10 Schritte, einer ist (' + G + ') groß\\.', 'Da $1 a $2 ci sono 10 passi, ognuno vale $3.'),
                R('Links steht (' + G + '), rechts (' + G + ')\\. Dazwischen liegen 10 gleich große Schritte\\.', 'A sinistra c’è $1, a destra $2. In mezzo ci sono 10 passi uguali.'),
                R('Der Punkt liegt (\\d+) Schritte rechts von (' + G + ')\\.', (m, k, a) => 'Il punto si trova ' + k + (k === '1' ? ' passo' : ' passi') + ' a destra di ' + a + '.'),
                R('Vorgänger ([^,<]+), Nachfolger (' + G + ')\\.', 'Precedente $1, successivo $2.'),
                R('Die Zahl liegt zwischen (' + G + ') und (' + G + ')\\.', 'Il numero è compreso tra $1 e $2.'),
                // schriftlichos5: the place in front of every step, the steps
                [new RegExp('<b>(' + PLACES + '):</b>', 'g'), (m, p) => '<b>' + cap(PL[p]) + ':</b>'],
                [/Schritt (\d+) von (\d+)/, 'Passo $1 di $2'],
                [/\. Schreibe (\d+) und übertrage (\d+) in die nächste Spalte\./, '. Scrivi $1 e riporta $2 nella colonna successiva.'],
                [/\. Schreibe (\d+), merke (\d+)\./, '. Scrivi $1 e riporta $2.'],
                [/\. Das ist die letzte Ziffer: Schreibe (\d+) ganz hin\./, '. È l’ultima cifra: scrivi $1 per intero.'],
                [/\. Schreibe (\d+)\./, '. Scrivi $1.'],
                [/Der letzte Übertrag (\d+) kommt vorn ins Ergebnis\./, 'L’ultimo riporto, $1, va davanti nel risultato.'],
                // right after the place ("<b>Decine:</b> da 4 a 7 mancano 3.") in lower case
                [/(<\/b> )?Von (\d+) bis (\d+) sind (\d+)\./, (m, b, x, y, r) => (b ? b + 'da ' : 'Da ') + x + ' a ' + y + ' mancano ' + r + '.'],
                [new RegExp('(\\d+) ist kleiner als (\\d+)\\. Entbündle: ((?:1 (?:' + ONE + ') → 10 (?:' + PLACES + ')(?:, dann )?)+)\\. '),
                    (m, a, b, chain) => a + ' è minore di ' + b + '. Fai il cambio: ' + chain.split(', dann ').map(c => {
                        const [, one, ten] = new RegExp('^1 (' + ONE + ') → 10 (' + PLACES + ')$').exec(c);
                        return '1 ' + SG[one] + ' → 10 ' + PL[ten];
                    }).join(', poi ') + '. '],
                [/\. Die letzte Ziffer steht genau unter der (\d) des zweiten Faktors\./, '. L’ultima cifra va esattamente sotto la cifra $1 del secondo fattore.'],
                R('Addiere die Teilprodukte stellengerecht, so wie sie stehen\\. Das ergibt (' + G + ')\\.', 'Somma i prodotti parziali in colonna, così come sono scritti. Si ottiene $1.'),
                [/Der erste Faktor hat (\d+) Stellen? nach dem Komma, also auch das Ergebnis: ([^<]+)\./,
                    (m, n, x) => 'Il primo fattore ha ' + n + (n === '1' ? ' cifra' : ' cifre') + ' dopo la virgola, quindi anche il risultato: ' + x + '.'],
                [/Teile von links nach rechts\. Frage bei jeder Stelle: Wie oft passt die (\d) hinein\?/,
                    (m, y) => 'Dividi da sinistra verso destra. A ogni cifra chiediti: quante volte ci sta ' + art(y) + '?'],
                [/Hole die (\d) herunter: (\d+)\. /, (m, d, c) => 'Abbassa ' + art(d) + ': ' + c + '. '],
                [/In die (\d) passt die (\d) nicht, nimm die ersten (\d+) Ziffern: (\d+)\. /,
                    (m, d, y, k, c) => cap(art(y)) + ' ' + inn(d) + ' non ci sta: prendi le prime ' + k + ' cifre: ' + c + '. '],
                [/(\d+) : (\d) = (\d+), denn (\d+) · (\d) = (\d+)\. /, '$1 : $2 = $3, perché $4 · $5 = $6. '],
                [/Es bleibt (\d+)\./, 'Resta $1.'],
                [/(\d) Rest (\d+)/g, '$1 resto $2'],
                [/Die Division geht nicht auf\. Nach (\d+) Stellen hinter dem Komma wird abgebrochen\./, 'La divisione non è esatta. Ci si ferma dopo $1 cifre dopo la virgola.'],
                // zehnerpotenzos5
                [new RegExp('Die Hochzahl (\\d+) sagt: \\d+ Faktoren 10, also (?:eine Null|\\d+ Nullen)\\. Das ist <b>(' + Object.keys(TEN).join('|') + ')</b>\\.'),
                    (m, n, t) => 'L’esponente ' + n + ' dice: ' + (n === '1' ? '1 fattore 10, quindi uno zero' : n + ' fattori 10, quindi ' + n + ' zeri') + '. È <b>' + TEN[t] + '</b>.'],
                [/Du kannst noch (\d+) (?:Nullen|Null) mehr abtrennen\./, (m, n) => 'Puoi separare ancora ' + (n === '1' ? 'uno zero' : n + ' zeri') + '.'],
                [/\$: Rücke das Komma um (\d+) Stellen nach rechts, dann hast du die Zahl\./, (m, n) => '$: sposta la virgola di ' + n + ' posti verso destra e ottieni il numero.'],
                // quadratos5
                [/^(\d+) mal (\d+) Plättchen(?: und (\d+) weitere)?$/, (m, a, b, e) => a + ' per ' + b + ' tessere' + (e ? ' e altre ' + e : '')],
                [/(\d+) Reihen mit je (\d+) Plättchen ergeben ein Quadrat aus (\d+) Plättchen\./,
                    (m, a, b, v) => a === '1' ? '1 fila con 1 tessera forma un quadrato di 1 tessera.' : a + ' file da ' + b + ' tessere formano un quadrato di ' + v + ' tessere.'],
                [/(\d+) ist eine Quadratzahl: Die Plättchen bilden ein Quadrat mit der Seite (\d+)\./, '$1 è un quadrato perfetto: le tessere formano un quadrato di lato $2.'],
                [/(\d+) ist keine Quadratzahl\./, '$1 non è un quadrato perfetto.'],
                [/Es bleiben (\d+) Plättchen übrig, zum nächsten Quadrat fehlen (\d+)\./,
                    (m, e, f) => (e === '1' ? 'Avanza 1 tessera' : 'Avanzano ' + e + ' tessere') + '; per il quadrato successivo ' + (f === '1' ? 'ne manca 1.' : 'ne mancano ' + f + '.')],
                [/\$ liegt zwischen (\d+) und (\d+)\./, '$ è compreso tra $1 e $2.'],
                // probierenos5
                [/ \((\d+) Zahlen\)\./, ' ($1 numeri).'],
                // teilbarkeitos5
                [/Bitte eine natürliche Zahl von 1 bis (999 999 999) eingeben\./, 'Scrivi un numero naturale da 1 a $1.'],
                [/<b>durch (\d+)( nicht)?:<\/b>/g, (m, d, n) => '<b>' + (n ? 'non divisibile per ' : 'divisibile per ') + d + ':</b>'],
                [/Die letzte Ziffer (\d) ist (gerade|ungerade)\./g, (m, d, g) => 'L’ultima cifra, ' + d + ', è ' + (g === 'gerade' ? 'pari' : 'dispari') + '.'],
                [/Quersumme ([\d +=]+?) ist (nicht )?durch (\d) teilbar\./g, (m, q, n, d) => 'La somma delle cifre ' + q + (n ? ' non è' : ' è') + ' divisibile per ' + d + '.'],
                [/Die letzten zwei Ziffern bilden (\d+), das ist (nicht )?durch 4 teilbar\./g, (m, x, n) => 'Le ultime due cifre formano ' + x + ', che' + (n ? ' non è' : ' è') + ' divisibile per 4.'],
                [/Die letzte Ziffer ist (\d)(?:, nicht (0 oder 5|0))?\./g, (m, d, x) => 'L’ultima cifra è ' + d + (x ? ', non ' + x.replace(' oder ', ' o ') : '') + '.'],
                R('(' + G + ') ist eine Primzahl: genau zwei Teiler\\.', '$1 è un numero primo: esattamente due divisori.'),
                R('(' + G + ') ist keine Primzahl\\.', '$1 non è un numero primo.'),
                // bruchteilos5
                [/^(\d+) von (\d+) Gruppen zu je (\d+) sind gefärbt$/, (m, z, n, k) => z + (z === '1' ? ' gruppo' : ' gruppi') + ' su ' + n + ', da ' + k + ' ciascuno, ' + (z === '1' ? 'è colorato' : 'sono colorati')],
                [/\$ von (\d+) sind (\d+)\./, '$ di $1 sono $2.'],
                [/\$ von (\d+)<\/p>/, '$ di $1</p>'],
                [/1\. Teile das Ganze in (\d+) gleich große Gruppen: /, '1. Dividi l’intero in $1 gruppi uguali: '],
                [/2\. Nimm (\d+) (?:Gruppe|Gruppen): /, (m, z) => '2. Prendi ' + z + (z === '1' ? ' gruppo: ' : ' gruppi: ')],
                // halbesos5: the reasons
                [new RegExp('<b>Gleicher Nenner:</b> Beide Male sind es (' + N + '), also gleich große Stücke\\. Es kommt nur darauf an, wie viele: '),
                    (m, w) => '<b>Stesso denominatore:</b> in entrambi i casi sono ' + NTH[w][0] + ', cioè pezzi uguali. Conta solo quanti sono: '],
                [new RegExp('<b>Gleicher Zähler:</b> Beide Male sind es (\\d+) (?:Stück|Stücke)\\. (' + N + ') sind größer als (' + N + '): Je größer der Nenner, desto kleiner die Stücke\\.'),
                    (m, z, a, b) => '<b>Stesso numeratore:</b> in entrambi i casi ' + (z === '1' ? 'è 1 pezzo' : 'sono ' + z + ' pezzi') + '. ' + cap(the(NTH[a][0])) + ' sono più grandi ' +
                        of(NTH[b][0]) + ': più grande è il denominatore, più piccoli sono i pezzi.'],
                [/\$ ist (weniger als|mehr als|genau) ein Ganzes/g, (m, x) => '$ è ' + { 'weniger als': 'meno di', 'mehr als': 'più di', 'genau': 'esattamente' }[x] + ' un intero'],
                [/\$ ist (weniger als|mehr als|genau) ein Halbes/g, (m, x) => '$ è ' + { 'weniger als': 'meno di', 'mehr als': 'più di', 'genau': 'esattamente' }[x] + ' un mezzo'],
                [/, denn (\d+) ist (weniger|mehr|genau) als die Hälfte von (\d+)\./, (m, a, x, n) => ', perché ' + a + ' è ' +
                    { 'weniger': 'meno della', 'mehr': 'più della', 'genau': 'esattamente la' }[x] + ' metà di ' + n + '.'],
                [new RegExp('<b>Was fehlt zum Ganzen\\?</b> Bei A fehlen (\\d+) (' + N + '), bei B (\\d+) (' + N + ')\\. (' + N + ') sind kleiner, also fehlt bei (A|B) weniger\\.'),
                    (m, a, wa, b, wb, w, x) => '<b>Quanto manca all’intero?</b> Ad A ' + (a === '1' ? 'manca ' : 'mancano ') + part(a, wa) + ', a B ' + part(b, wb) + '. ' +
                        cap(the(NTH[w][0])) + ' sono più piccoli, quindi ' + (x === 'A' ? 'ad A' : 'a B') + ' manca meno.'],
                // rundenos5
                [/(<text[^>]*>)Mitte (?=\d)/, '$1metà '],
                [/^Zahlenstrahl zwischen (.+) und (.+)$/, 'Retta numerica tra $1 e $2'],
                [/Gerundet auf (Ganze|Zehntel|Hundertstel)\. Entscheidend ist die Ziffer der (Zehntel|Hundertstel|Tausendstel): /,
                    (m, a, b) => 'Arrotondato ' + ROUND[a] + '. Decide la cifra ' + of(PL[b]) + ': '],
                [/Die Null am Ende bleibt stehen: Sie zeigt, dass auf (Ganze|Zehntel|Hundertstel) gerundet wurde\./,
                    (m, a) => 'Lo zero finale resta: mostra che si è arrotondato ' + ROUND[a] + '.'],
                // wuerfelnetzos5
                [/^Gitter mit (\d+) ausgewählten Quadraten$/, (m, n) => 'Griglia con ' + n + (n === '1' ? ' quadrato scelto' : ' quadrati scelti')],
                [/Wähle 6 Quadrate aus(?:, es fehlen noch (\d))?\./, (m, k) => 'Scegli 6 quadrati' + (k ? (k === '1' ? ': ne manca ancora 1' : ': ne mancano ancora ' + k) : '') + '.'],
                [/Das sind (\d+) Quadrate\. Ein Würfel hat nur 6 Flächen\./, 'Sono $1 quadrati. Un cubo ha solo 6 facce.'],
                [/Gefunden: (\d+) von 11 verschiedenen Würfelnetzen\./, 'Trovati: $1 degli 11 sviluppi diversi del cubo.'],
                // bandos5
                [/^Bandornament aus dem Motiv (Fahne|Schlüssel|Blume)$/, (m, k) => 'Fregio con il motivo ' + MOTIF[k]],
                // zahlzeichenos5
                [/^Kerbholz und Strichliste mit (\d+) Strichen$/, (m, n) => 'Bastone a tacche e stanghette con ' + n + (n === '1' ? ' segno' : ' segni')],
                [/(\d+) Fünferbündel(?: und (\d+) (?:einzelner Strich|einzelne Striche))?/,
                    (m, b, r) => b + (b === '1' ? ' gruppo da cinque' : ' gruppi da cinque') + (r ? ' e ' + r + (r === '1' ? ' segno singolo' : ' segni singoli') : '')],
                [/(\d+) (?:einzelner Strich|einzelne Striche)/, (m, r) => r + (r === '1' ? ' segno singolo' : ' segni singoli')],
                [/^Die Zahl (\d+) in babylonischer Keilschrift$/, 'Il numero $1 in caratteri cuneiformi babilonesi'],
            ];
        })(),

    ]
});
