/* js/buch-it/gy6.js — Italian for the widgets of js/buch-gy6.js.
 * Loaded by the Italian editions right after js/buch-gy6.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 3 (20.10.2026): eleven books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/gy6.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('gy6', {
    word: {
        // book it-11 mathegy6-it:
        // titelbildgy6
        'Titelbild: ein Kreis mit drei farbigen Achteln, die Primzahlen bis 30 als leuchtende Punkte, ein Dreieck mit seinen drei Winkeln und der Parallelen durch die Spitze, ein Dreiecksprisma im Schrägbild':
            'Illustrazione di copertina: un cerchio con tre ottavi colorati, i numeri primi fino a 30 come punti luminosi, un triangolo con i suoi tre angoli e la parallela per il vertice in alto, un prisma triangolare in assonometria cavaliera',
        // bruchbild6
        'Zähler': 'Numeratore', 'Nenner': 'Denominatore', 'Kreis': 'Cerchio', 'Streifen': 'Striscia', 'Bild': 'Figura',
        'Der Bruch ist eine natürliche Zahl.': 'La frazione è un numero naturale.',
        // mengen6
        'Mengendiagramm: die natürlichen Zahlen liegen innerhalb der gebrochenen Zahlen': 'Diagramma di Eulero-Venn: i numeri naturali stanno dentro i numeri frazionari',
        'Richtig.': 'Giusto.', 'Noch nicht.': 'Non ancora.', 'Noch einmal': 'Ancora una volta',
        'Rechne den Wert aus: Ist das eine ganze Zahl ohne Rest?': 'Calcola il valore: è un numero intero, senza resto?',
        'Liegt die Zahl vielleicht zwischen zwei natürlichen Zahlen?': 'Il numero sta forse tra due numeri naturali?',
        'in $\\mathbb{N}$ (und damit auch in $\\mathbb{Q}^+$)': 'in $\\mathbb{N}$ (e quindi anche in $\\mathbb{Q}^+$)',
        'nur in $\\mathbb{Q}^+$': 'solo in $\\mathbb{Q}^+$',
        // bruchop6
        'plus': 'più', 'minus': 'meno', 'mal': 'per', 'durch': 'diviso', 'Rechenart': 'Operazione',
        'Zähler 1': 'Numeratore 1', 'Nenner 1': 'Denominatore 1', 'Zähler 2': 'Numeratore 2', 'Nenner 2': 'Denominatore 2',
        'erster Zähler': 'primo numeratore', 'erster Nenner': 'primo denominatore', 'zweiter Zähler': 'secondo numeratore', 'zweiter Nenner': 'secondo denominatore',
        'Das Ergebnis wäre kleiner als null.': 'Il risultato sarebbe minore di zero.',
        'Für das Bild sind die Zahlen zu groß.': 'Per la figura i numeri sono troppo grandi.',
        'Das Bild zeigt nur Brüche bis 1.': 'La figura mostra solo frazioni fino a 1.',
        'Mal null ist null.': 'Per zero fa zero.', 'Durch null kann man nicht teilen.': 'Non si può dividere per zero.',
        '1. Bruch': '1ª frazione', '2. Bruch': '2ª frazione', 'Ergebnis': 'Risultato',
        'Streifenbild der Rechnung': 'Il calcolo come striscia', 'Rechteckbild: ein Teil von einem Teil': 'Rettangolo: una parte di una parte',
        'Wie oft passt der zweite Bruch in den ersten?': 'Quante volte sta la seconda frazione nella prima?',
        'Grün': 'Verde',
        'Zähler mal Zähler, Nenner mal Nenner. Vorher kürzen spart Arbeit.': 'Numeratore per numeratore, denominatore per denominatore. Semplificare prima fa risparmiare lavoro.',
        'Durch einen Bruch teilt man, indem man mit seinem Kehrwert malnimmt.': 'Per dividere per una frazione si moltiplica per la sua reciproca.',
        // vorrang6
        'Punkt vor Strich': 'Prima per e diviso', 'Klammern zuerst': 'Prima le parentesi', 'Mit Komma': 'Con la virgola',
        'Von links nach rechts': 'Da sinistra a destra', 'Rechenvorteil': 'Trucco di calcolo', 'Aufgabe': 'Esercizio',
        'Nächster Schritt': 'Passo successivo', 'Von vorn': 'Ricomincia', 'Jetzt:': 'Ora:', 'Fertig.': 'Fatto.',
        'Jetzt die Strichrechnung.': 'Ora le addizioni e le sottrazioni.',
        // probieren6
        'Einsetzen': 'Sostituisci', 'Alle Werte prüfen': 'Controlla tutti i valori',
        'Zahlenstrahl: grün erfüllt, rot nicht': 'Retta numerica: in verde i valori che vanno bene, in rosso quelli che no',
        'Passt.': 'Va bene.', 'Passt nicht.': 'Non va bene.',
        'Probe: Einsetzen ergibt eine wahre Aussage.': 'Verifica: sostituendo si ottiene un’uguaglianza vera.',
        'Die linke Seite ist zu klein.': 'Il primo membro è troppo piccolo.', 'kleiner': 'minore', 'größer': 'maggiore',
        'Die linke Seite ist zu groß.': 'Il primo membro è troppo grande.',
        // pfeile6
        'Schüler → Vorname': 'Alunno → nome', 'Vorname → Schüler': 'Nome → alunno', 'Schüler → Sitzplatz': 'Alunno → posto',
        'Zahl → Teiler': 'Numero → divisore', 'Zahl → Doppeltes': 'Numero → doppio', 'Zahl → Rest bei : 3': 'Numero → resto nella divisione per 3',
        'Zuordnung': 'Corrispondenza', 'Platz 1': 'Posto 1', 'Platz 2': 'Posto 2', 'Platz 3': 'Posto 3', 'Platz 4': 'Posto 4',
        'Welche Art von Zuordnung ist das?': 'Che tipo di corrispondenza è?',
        'mehrdeutig': 'non univoca', 'eindeutig': 'univoca', 'eineindeutig': 'biunivoca', 'eindeutig, aber nicht eineindeutig': 'univoca, ma non biunivoca',
        'Richtig:': 'Giusto.', 'Nicht ganz.': 'Non proprio.',
        // zufall6 ("Würfel" and "Glücksrad" by a rule below: "Würfel" is also the cube)
        'Münze': 'Moneta', 'Versuch': 'Esperimento',
        'Kopf': 'Testa', 'Zahl': 'Croce', 'Rot': 'Rosso',
        '1-mal': '1 volta', '10-mal': '10 volte', '100-mal': '100 volte', 'Löschen': 'Cancella',
        'Säulendiagramm der relativen Häufigkeiten': 'Diagramma a colonne delle frequenze relative',
        'absolut': 'assoluta', 'relativ': 'relativa',
        // darstellung6
        'Kerze': 'Candela', 'Temperatur': 'Temperatura', 'Fahrradverleih': 'Noleggio bici', 'Zeile wählen': 'Scegli un valore',
        'Zeit in h': 'Tempo in h', 'Höhe in cm': 'Altezza in cm', 'Uhrzeit': 'Ora', 'Temperatur in °C': 'Temperatura in °C',
        'Leihzeit in h': 'Durata del noleggio in h', 'Preis in €': 'Prezzo in €',
        'Wortform:': 'A parole:', 'Tabelle:': 'Tabella:', 'Gleichung:': 'Equazione:',
        'Keine. Die Temperatur kann man nur messen, nicht ausrechnen.': 'Nessuna. La temperatura si può solo misurare, non calcolare.',
        // proportional6
        'Äpfel': 'Mele', 'Kuchen': 'Torta', 'Taxi': 'Taxi',
        'direkt proportional': 'direttamente proporzionale', 'indirekt proportional': 'inversamente proporzionale', 'keins von beiden': 'nessuna delle due',
        'Masse in kg': 'Massa in kg', 'Personen': 'Persone', 'Stück pro Person': 'Fette a persona', 'Strecke in km': 'Distanza in km',
        'Der Quotient $y : x$ ist immer $2{,}5$: <b>direkt proportional</b>. Der Graph ist eine Gerade durch den Ursprung.':
            'Il quoziente $y : x$ è sempre $2{,}5$: <b>direttamente proporzionale</b>. Il grafico è una retta che passa per l’origine.',
        'Das Produkt $x \\cdot y$ ist immer $24$: <b>indirekt proportional</b>. Doppelt so viele Personen, halb so viel Kuchen.':
            'Il prodotto $x \\cdot y$ è sempre $24$: <b>inversamente proporzionale</b>. Il doppio delle persone, metà della torta a testa.',
        'Je mehr Kilometer, desto teurer. Aber der Quotient ändert sich: <b>nicht proportional</b>. Die Gerade geht nicht durch den Ursprung.':
            'Più chilometri, più si paga. Ma il quoziente cambia: <b>non è proporzionale</b>. La retta non passa per l’origine.',
        // dreisatz6
        'Pumpen': 'Pompe', 'Hefte': 'Quaderni', 'Futter': 'Mangime', 'Kaninchen': 'Conigli', 'Tage': 'giorni', 'Antwort:': 'Risposta:',
        'Schritt 1: Schreib auf, was du weißt.': 'Passo 1: scrivi quello che sai.',
        'Schritt 3: Rechne auf die gesuchte Menge hoch.': 'Passo 3: calcola la quantità cercata.',
        // winkelsumme6
        'Beweisfigur': 'Figura della dimostrazione', 'Ansicht': 'Vista',
        'Dreieck mit seinen Innenwinkeln': 'Triangolo con i suoi angoli interni',
        'Dreieck mit seinen Innenwinkeln und der Parallelen durch C': 'Triangolo con i suoi angoli interni e la parallela per C',
        'Zieh an den Ecken. Die Winkel ändern sich, ihre Summe bleibt. Die Werte sind auf ganze Grad gerundet.':
            'Trascina i vertici. Gli angoli cambiano, la loro somma resta. I valori sono arrotondati al grado.',
        // konstruktion6: L = lato, A = angolo; LlA = two sides and the angle opposite the longer one (German SsW)
        'sss': 'LLL', 'sws': 'LAL', 'wsw': 'ALA', 'SsW': 'LlA', 'www': 'AAA', 'Gegeben': 'Dati',
        'Seite $a$': 'Lato $a$', 'Seite $b$': 'Lato $b$', 'Seite $c$': 'Lato $c$',
        'Winkel $\\alpha$': 'Angolo $\\alpha$', 'Winkel $\\beta$': 'Angolo $\\beta$', 'Seite $a$ gegenüber $\\alpha$': 'Lato $a$ opposto ad $\\alpha$',
        'Genau ein Dreieck.': 'Esattamente un triangolo.', 'Kein Dreieck.': 'Nessun triangolo.', 'Zwei Dreiecke.': 'Due triangoli.',
        'Unendlich viele Dreiecke.': 'Infiniti triangoli.',
        'Die Kreise um $A$ mit $r = b$ und um $B$ mit $r = a$ schneiden sich oberhalb von $c$ in genau einem Punkt.':
            'Le circonferenze di centro $A$ con $r = b$ e di centro $B$ con $r = a$ si intersecano sopra $c$ in un solo punto.',
        'Auf dem Schenkel von $\\alpha$ trägt man $b$ ab. Der Endpunkt ist $C$.': 'Sul lato di $\\alpha$ si riporta $b$. L’estremo è $C$.',
        'Der Kreis um $B$ schneidet den Schenkel zweimal. Die Angaben legen das Dreieck nicht fest.':
            'La circonferenza di centro $B$ interseca il lato due volte. I dati non determinano il triangolo.',
        'Die gegenüberliegende Seite $a$ ist die größere: $a \\geq c$.': 'Il lato opposto $a$ è il maggiore: $a \\geq c$.',
        'Der Kreis berührt den Schenkel nur.': 'La circonferenza tocca soltanto il lato.',
        'Der Kreis um $B$ erreicht den Schenkel nicht.': 'La circonferenza di centro $B$ non raggiunge il lato.',
        'Alle haben dieselbe Form, aber verschiedene Größen. Drei Winkel legen kein Dreieck fest.':
            'Hanno tutti la stessa forma, ma grandezze diverse. Tre angoli non determinano un triangolo.',
        'Den dritten Winkel kennt man ohnehin: $\\gamma = 180^\\circ - \\alpha - \\beta$. Es fehlt eine Länge.':
            'Il terzo angolo si conosce comunque: $\\gamma = 180^\\circ - \\alpha - \\beta$. Manca una lunghezza.',
        // seitenwinkel6
        'Dreieck aus drei Stäben': 'Triangolo di tre bastoncini', 'Die Stäbe ergeben kein Dreieck': 'I bastoncini non formano un triangolo',
        // linien6
        'Winkelhalbierende': 'Bisettrici', 'Höhen': 'Altezze', 'Seitenhalbierende': 'Mediane', 'Linien': 'Linee',
        // flaeche6
        'Parallelogramm': 'Parallelogramma', 'Dreieck': 'Triangolo', 'Trapez': 'Trapezio', 'Drachenviereck': 'Deltoide', 'Figur': 'Figura',
        'Zerlegen und verschieben': 'Scomporre e spostare', 'Grundseite $g$': 'Base $g$', 'Höhe $h$': 'Altezza $h$',
        'Diagonale $e$': 'Diagonale $e$', 'Diagonale $f$': 'Diagonale $f$',
        // vierecke6 ("gleichschenkliges" / "Trapez" in two lines: a rule below puts them in Italian order)
        'Quadrat': 'Quadrato', 'Rechteck': 'Rettangolo', 'Raute': 'Rombo', 'Viereck': 'Quadrilatero',
        'gleichschenkliges Trapez': 'Trapezio isoscele', 'Haus der Vierecke': 'Casa dei quadrilateri',
        'parallele Seiten': 'lati paralleli', 'gleich lange Seiten': 'lati uguali', 'rechte Winkel': 'angoli retti', 'Symmetrieachsen': 'assi di simmetria',
        'Diagonalen halbieren sich': 'le diagonali si dividono a metà', 'Diagonalen senkrecht': 'diagonali perpendicolari', 'Diagonalen gleich lang': 'diagonali uguali',
        '2 Paare': '2 coppie', '1 Paar': '1 coppia', 'alle vier': 'tutti e quattro', 'je zwei gegenüber': 'quelli opposti, a due a due', 'keine nötig': 'non servono',
        'keins nötig': 'non servono', 'die beiden Schenkel': 'i due lati obliqui', 'je zwei benachbarte': 'quelli consecutivi, a due a due',
        'nur eine die andere': 'solo una l’altra', 'mindestens 1': 'almeno 1', 'ja': 'sì', 'nein': 'no',
        'Das <b>Viereck</b> steht ganz unten: Es braucht nur vier Ecken und vier Seiten, sonst nichts.':
            'Il <b>quadrilatero</b> sta in fondo: gli bastano quattro vertici e quattro lati, nient’altro.',
        'Tipp auf ein Viereck im Haus. Was weiter unten steht, ist allgemeiner, was weiter oben steht, hat mehr Eigenschaften.':
            'Tocca un quadrilatero della casa. Quello che sta più in basso è più generale, quello che sta più in alto ha più proprietà.',
        // prisma6
        'Dreiecksprisma': 'Prisma triangolare', 'Quader': 'Parallelepipedo', 'Trapezprisma': 'Prisma trapezoidale', 'Sechseckprisma': 'Prisma esagonale',
        'Prisma': 'Prisma', 'Schrägbild': 'Assonometria', 'Netz': 'Sviluppo',
        'Grundkante $a$': 'Spigolo di base $a$', 'Höhe $h$ des Prismas': 'Altezza $h$ del prisma',
        'Kavalierperspektive: Die Grundfläche liegt vorn in wahrer Größe. Die Kanten nach hinten laufen unter $45^\\circ$ und sind halb so lang. Verdeckte Kanten sind gestrichelt.':
            'Assonometria cavaliera: la base sta davanti in vera grandezza. Gli spigoli che vanno all’indietro formano un angolo di $45^\\circ$ e sono lunghi la metà. Gli spigoli nascosti sono tratteggiati.',
        'Das Netz besteht aus den beiden Grundflächen und dem Mantel. Der Mantel ist ein Rechteck: so breit wie der Umfang $u$, so hoch wie $h$.':
            'Lo sviluppo è formato dalle due basi e dalla superficie laterale. La superficie laterale è un rettangolo: largo quanto il perimetro $u$, alto quanto $h$.',
        // kreisdiagramm6
        'zu Fuß': 'a piedi', 'Fahrrad': 'bici', 'Bus oder Bahn': 'autobus o treno', 'Auto': 'auto',
        'Kreisdiagramm: Wie kommst du zur Schule?': 'Diagramma circolare: come vai a scuola?',
        'Anzahl': 'Numero', 'Prozent': 'Percentuale', 'Winkel': 'Angolo', 'zusammen': 'totale',
        'Umfrage in einer Klasse: Wie kommst du zur Schule?': 'Sondaggio in una classe: come vai a scuola?',
        // sieb6
        'Nächste Primzahl': 'Primo successivo', 'Alle Schritte': 'Tutti i passi',
        '1 ist keine Primzahl: Sie hat nur einen Teiler. Tipp auf „Nächste Primzahl“.': '1 non è un numero primo: ha un solo divisore. Tocca «Primo successivo».',
        'Sieb des Eratosthenes: die Zahlen von 1 bis 100': 'Crivello di Eratostene: i numeri da 1 a 100',
        'Vielfache von 2': 'multipli di 2', 'von 3': 'di 3', 'von 5': 'di 5', 'von 7': 'di 7',
        // primfaktor6
        'Zahl $a$': 'Numero $a$', 'Zahl $b$': 'Numero $b$', 'ggT': 'MCD', 'kgV': 'mcm',
        'Gib für $a$ eine natürliche Zahl von 2 bis 9999 ein.': 'Scrivi per $a$ un numero naturale da 2 a 9999.',

        // book it-16 mathe6-it:
        // bruchbild6
        'Zähler': 'Numeratore', 'Nenner': 'Denominatore', 'Kreis': 'Cerchio', 'Streifen': 'Striscia', 'Bild': 'Figura',
        'Der Bruch ist eine natürliche Zahl.': 'La frazione è un numero naturale.',
        // mengen6
        'Mengendiagramm: die natürlichen Zahlen liegen innerhalb der gebrochenen Zahlen': 'Diagramma di Venn: i numeri naturali stanno dentro i numeri frazionari',
        'Richtig.': 'Giusto.', 'Noch nicht.': 'Non ancora.', 'Noch einmal': 'Ancora una volta',
        'Rechne den Wert aus: Ist das eine ganze Zahl ohne Rest?': 'Calcola il valore: è un numero intero, senza resto?',
        'Liegt die Zahl vielleicht zwischen zwei natürlichen Zahlen?': 'Il numero sta forse tra due numeri naturali?',
        'in $\\mathbb{N}$ (und damit auch in $\\mathbb{Q}^+$)': 'in $\\mathbb{N}$ (e quindi anche in $\\mathbb{Q}^+$)',
        'nur in $\\mathbb{Q}^+$': 'solo in $\\mathbb{Q}^+$',
        // bruchop6
        'plus': 'più', 'minus': 'meno', 'mal': 'per', 'durch': 'diviso', 'Rechenart': 'Operazione',
        'Zähler 1': 'Numeratore 1', 'Nenner 1': 'Denominatore 1', 'Zähler 2': 'Numeratore 2', 'Nenner 2': 'Denominatore 2',
        'erster Zähler': 'primo numeratore', 'erster Nenner': 'primo denominatore', 'zweiter Zähler': 'secondo numeratore', 'zweiter Nenner': 'secondo denominatore',
        'Das Ergebnis wäre kleiner als null.': 'Il risultato sarebbe minore di zero.',
        'Für das Bild sind die Zahlen zu groß.': 'Per la figura i numeri sono troppo grandi.',
        'Das Bild zeigt nur Brüche bis 1.': 'La figura mostra solo frazioni fino a 1.',
        'Mal null ist null.': 'Per zero fa zero.', 'Durch null kann man nicht teilen.': 'Non si può dividere per zero.',
        '1. Bruch': '1ª frazione', '2. Bruch': '2ª frazione', 'Ergebnis': 'Risultato',
        'Streifenbild der Rechnung': 'Il calcolo come striscia', 'Rechteckbild: ein Teil von einem Teil': 'Rettangolo: una parte di una parte',
        'Wie oft passt der zweite Bruch in den ersten?': 'Quante volte sta la seconda frazione nella prima?',
        'Grün': 'Verde',
        'Zähler mal Zähler, Nenner mal Nenner. Vorher kürzen spart Arbeit.': 'Numeratore per numeratore, denominatore per denominatore. Semplificare prima fa risparmiare lavoro.',
        'Durch einen Bruch teilt man, indem man mit seinem Kehrwert malnimmt.': 'Per dividere per una frazione si moltiplica per la sua reciproca.',
        // vorrang6
        'Punkt vor Strich': 'Prima per e diviso', 'Klammern zuerst': 'Prima le parentesi', 'Mit Komma': 'Con i decimali',
        'Von links nach rechts': 'Da sinistra a destra', 'Rechenvorteil': 'Trucco di calcolo', 'Aufgabe': 'Esercizio',
        'Nächster Schritt': 'Passo successivo', 'Von vorn': 'Da capo', 'Jetzt:': 'Ora:', 'Fertig.': 'Fatto.',
        'Jetzt die Strichrechnung.': 'Ora addizioni e sottrazioni.',
        // probieren6
        'Einsetzen': 'Sostituisci', 'Alle Werte prüfen': 'Verifica tutti i valori',
        'Zahlenstrahl: grün erfüllt, rot nicht': 'Retta numerica: in verde i valori che vanno bene, in rosso quelli no',
        'Passt.': 'Va bene.', 'Passt nicht.': 'Non va bene.',
        'Probe: Einsetzen ergibt eine wahre Aussage.': 'Verifica: sostituendo si ottiene un’uguaglianza vera.',
        'Die linke Seite ist zu klein.': 'Il primo membro è troppo piccolo.', 'kleiner': 'minore', 'größer': 'maggiore',
        'Die linke Seite ist zu groß.': 'Il primo membro è troppo grande.',
        // pfeile6
        'Schüler → Vorname': 'Alunno → nome', 'Vorname → Schüler': 'Nome → alunno', 'Schüler → Sitzplatz': 'Alunno → posto',
        'Zahl → Teiler': 'Numero → divisore', 'Zahl → Doppeltes': 'Numero → doppio', 'Zahl → Rest bei : 3': 'Numero → resto nella divisione per 3',
        'Zuordnung': 'Corrispondenza', 'Platz 1': 'Posto 1', 'Platz 2': 'Posto 2', 'Platz 3': 'Posto 3', 'Platz 4': 'Posto 4',
        'Welche Art von Zuordnung ist das?': 'Che tipo di corrispondenza è?',
        'mehrdeutig': 'non univoca', 'eindeutig': 'univoca', 'eineindeutig': 'biunivoca', 'eindeutig, aber nicht eineindeutig': 'univoca, ma non biunivoca',
        'Richtig:': 'Giusto:', 'Nicht ganz.': 'Non proprio.',
        // darstellung6
        'Kerze': 'Candela', 'Temperatur': 'Temperatura', 'Fahrradverleih': 'Noleggio bici', 'Zeile wählen': 'Scegli una riga',
        'Zeit in h': 'Tempo in h', 'Höhe in cm': 'Altezza in cm', 'Uhrzeit': 'Ora', 'Temperatur in °C': 'Temperatura in °C',
        'Leihzeit in h': 'Noleggio in h', 'Preis in €': 'Prezzo in €',
        'Wortform:': 'A parole:', 'Tabelle:': 'Tabella:', 'Gleichung:': 'Equazione:',
        'Keine. Die Temperatur kann man nur messen, nicht ausrechnen.': 'Nessuna. La temperatura si può solo misurare, non calcolare.',
        // proportional6
        'Äpfel': 'Mele', 'Kuchen': 'Torta', 'Taxi': 'Taxi',
        'direkt proportional': 'direttamente proporzionale', 'indirekt proportional': 'inversamente proporzionale', 'keins von beiden': 'nessuna delle due',
        'Masse in kg': 'Massa in kg', 'Personen': 'Persone', 'Stück pro Person': 'Pezzi a persona', 'Strecke in km': 'Percorso in km',
        'Der Quotient $y : x$ ist immer $2{,}5$: <b>direkt proportional</b>. Der Graph ist eine Gerade durch den Ursprung.':
            'Il quoziente $y : x$ è sempre $2{,}5$: <b>direttamente proporzionale</b>. Il grafico è una retta che passa per l’origine.',
        'Das Produkt $x \\cdot y$ ist immer $24$: <b>indirekt proportional</b>. Doppelt so viele Personen, halb so viel Kuchen.':
            'Il prodotto $x \\cdot y$ è sempre $24$: <b>inversamente proporzionale</b>. Il doppio delle persone, la metà della torta.',
        'Je mehr Kilometer, desto teurer. Aber der Quotient ändert sich: <b>nicht proportional</b>. Die Gerade geht nicht durch den Ursprung.':
            'Più chilometri, più si spende. Ma il quoziente cambia: <b>non proporzionale</b>. La retta non passa per l’origine.',
        // dreisatz6
        'Pumpen': 'Pompe', 'Hefte': 'Quaderni', 'Futter': 'Mangime', 'Kaninchen': 'Conigli', 'Tage': 'giorni', 'Antwort:': 'Risposta:',
        'Schritt 1: Schreib auf, was du weißt.': 'Passo 1: scrivi ciò che sai.',
        'Schritt 3: Rechne auf die gesuchte Menge hoch.': 'Passo 3: calcola fino alla quantità cercata.',

        // book it-17 mathe7-it:

        // book it-18 mathe8-it:

    },
    phrase: [
        // book it-11 mathegy6-it:
        // bruchbild6
        ['Bruch: $', 'Frazione: $'], ['Bild des Bruches ', 'Figura della frazione '], ['Dezimalzahl: $', 'Numero decimale: $'], ['Prozent: $', 'Percentuale: $'],
        ['Null Teile von ', 'Zero parti di '], [' sind nichts: $0$.', ' non sono niente: $0$.'],
        ['Der gekürzte Nenner ', 'Il denominatore ridotto '],
        [' hat nur die Primfaktoren 2 und 5. Erweitern mit $', ' ha solo i fattori primi 2 e 5. Amplifica per $'],
        ['. Die Dezimalzahl <b>bricht ab</b>.', '. Il numero decimale <b>è limitato</b>.'],
        ['$ enthält den Primfaktor $', '$ contiene il fattore primo $'],
        ['$. Auf 10, 100, 1000 … kann man nicht erweitern: Die Dezimalzahl ist <b>periodisch</b>.',
            '$. Non si può amplificare fino a 10, 100, 1000 …: il numero decimale è <b>periodico</b>.'],
        // mengen6
        ['5 ist eine natürliche Zahl, und jede natürliche Zahl ist auch eine gebrochene Zahl: ', '5 è un numero naturale, e ogni numero naturale è anche un numero frazionario: '],
        [' liegt zwischen 0 und 1. Das ist keine natürliche Zahl.', ' sta tra 0 e 1. Non è un numero naturale.'],
        [' liegt zwischen 0 und 1.', ' sta tra 0 e 1.'], [' liegt zwischen 2 und 3.', ' sta tra 2 e 3.'],
        [' liegt zwischen 4 und 5.', ' sta tra 4 e 5.'],
        ['. Der Bruch sieht nur anders aus als die 3.', '. La frazione è il 3, solo scritto in un altro modo.'],
        ['In der Schule zählt die 0 zu den natürlichen Zahlen.', 'A scuola lo 0 conta come numero naturale.'],
        ['. Die Null nach dem Komma ändert nichts.', '. Lo zero dopo la virgola non cambia niente.'],
        ['$ und $', '$ e $'], [' und $', ' e $'], [', aber $', ', ma $'],
        [': die natürlichen Zahlen $', ': i numeri naturali $'],
        [': die gebrochenen Zahlen, also alle Zahlen, die man als Bruch $', ': i numeri frazionari, cioè tutti i numeri che si possono scrivere come frazione $'],
        ['$ schreiben kann.', '$.'],
        ['Jede natürliche Zahl ist auch eine gebrochene Zahl: $', 'Ogni numero naturale è anche un numero frazionario: $'],
        // bruchop6
        ['$: Bei den gebrochenen Zahlen geht diese Subtraktion nicht. Negative Zahlen lernst du in Klasse 7 kennen.',
            '$: con i numeri frazionari questa sottrazione non si può fare. I numeri negativi li conoscerai nella 7ª classe.'],
        ['Hauptnenner: $', 'Minimo comune denominatore: $'], ['$ (das kleinste gemeinsame Vielfache von $', '$ (il minimo comune multiplo di $'],
        ['Erst gleichnamig machen, dann die Zähler addieren. Der Nenner bleibt.', 'Prima si riduce allo stesso denominatore, poi si sommano i numeratori. Il denominatore resta.'],
        ['Erst gleichnamig machen, dann die Zähler subtrahieren. Der Nenner bleibt.', 'Prima si riduce allo stesso denominatore, poi si sottraggono i numeratori. Il denominatore resta.'],
        ['$ von $', '$ di $'], ['$ Kästchen. Das ist $', '$ quadretti. Cioè $'],
        ['$: Wie oft passt nichts in etwas? Diese Frage hat keine Antwort. Durch $0$ teilt man nie.',
            '$: quante volte sta il niente in qualcosa? Questa domanda non ha risposta. Per $0$ non si divide mai.'],
        ['$ passt $', '$ sta $'], ['$-mal in $', '$ volte in $'],
        // vorrang6
        ['Punktrechnung zuerst: $', 'Prima moltiplicazioni e divisioni: $'], ['Hauptnenner 4: $', 'Denominatore comune 4: $'],
        ['Die Klammer zuerst: $', 'Prima la parentesi: $'],
        ['Fertig. Mit der Klammer kommt etwas anderes heraus als ohne.', 'Fatto. Con la parentesi viene un risultato diverso che senza.'],
        ['Punkt vor Strich: $', 'Prima moltiplicazioni e divisioni, poi addizioni e sottrazioni: $'],
        ['Fertig. Wer von links rechnet, erhält falsch $6$.', 'Fatto. Chi calcola da sinistra ottiene, sbagliando, $6$.'],
        ['Zwei Punktrechnungen: die linke zuerst. $', 'Due moltiplicazioni o divisioni: prima quella a sinistra. $'],
        ['Distributivgesetz: $', 'Proprietà distributiva: si raccoglie $'], ['$ ausklammern.', '$ a fattor comune.'],
        ['Fertig. Ohne Ausklammern: $', 'Fatto. Senza raccogliere: $'], ['$, mehr Arbeit.', '$, più lavoro.'],
        // probieren6
        ['$, und $', '$, e $'], ['Es passen: ', 'Vanno bene: '], ['Bisher passt keiner.', 'Finora non ne va bene nessuno.'],
        // pfeile6
        ['Pfeildarstellung: ', 'Diagramma a frecce: '],
        ['Schüler → Vorname', 'Alunno → nome'], ['Vorname → Schüler', 'Nome → alunno'], ['Schüler → Sitzplatz', 'Alunno → posto'],
        ['Zahl → Teiler', 'Numero → divisore'], ['Zahl → Doppeltes', 'Numero → doppio'], ['Zahl → Rest bei : 3', 'Numero → resto nella divisione per 3'],
        ['Die Zuordnung ist mehrdeutig. ', 'La corrispondenza non è univoca. '],
        ['Die Zuordnung ist eindeutig, aber nicht eineindeutig. ', 'La corrispondenza è univoca, ma non biunivoca. '],
        ['Die Zuordnung ist eineindeutig. ', 'La corrispondenza è biunivoca. '],
        ['Von jedem Element links geht genau ein Pfeil aus, und rechts kommt bei jedem genau ein Pfeil an. Auch rückwärts ist die Zuordnung eindeutig.',
            'Da ogni elemento a sinistra parte esattamente una freccia, e a ogni elemento a destra ne arriva esattamente una. Anche al contrario la corrispondenza è univoca.'],
        ['Von jedem Element links geht genau ein Pfeil aus. ', 'Da ogni elemento a sinistra parte esattamente una freccia. '],
        // zufall6
        ['Relative Häufigkeit = absolute Häufigkeit : Anzahl der Versuche. Die gestrichelte Linie zeigt die Chance',
            'Frequenza relativa = frequenza assoluta : numero di prove. La linea tratteggiata mostra la probabilità'],
        [' (Rot ist das halbe Rad, Blau ein Drittel, Grün ein Sechstel)', ' (il rosso è metà ruota, il blu un terzo, il verde un sesto)'],
        ['. Je mehr Versuche, desto näher kommen die Säulen meistens heran.', '. Più prove fai, più le colonne di solito si avvicinano.'],
        // darstellung6
        ['Eine Kerze ist 20 cm hoch. Jede Stunde brennt sie 2,5 cm herunter.', 'Una candela è alta 20 cm. Ogni ora si consuma di 2,5 cm.'],
        ['An einem Herbsttag wird alle zwei Stunden die Temperatur gemessen.', 'In un giorno d’autunno si misura la temperatura ogni due ore.'],
        ['Ein Fahrrad kostet 3 € pro Stunde Leihzeit.', 'Noleggiare una bici costa 3 € all’ora.'],
        ['Diagramm: ', 'Grafico: '], ['Gewählt: ', 'Scelto: '],
        ['Die Kerze brennt gleichmäßig, auch zwischen den vollen Stunden. Darum darf man die Punkte mit einer Linie verbinden.',
            'La candela si consuma in modo regolare, anche tra un’ora piena e l’altra. Per questo si possono unire i punti con una linea.'],
        ['Die gestrichelte Linie verbindet nur die Messpunkte. Was dazwischen geschah, weiß man nicht genau.',
            'La linea tratteggiata unisce solo i punti misurati. Che cosa sia successo nel frattempo non si sa con esattezza.'],
        ['Abgerechnet wird nur nach ganzen Stunden, darum gibt es nur einzelne Punkte.', 'Si pagano solo ore intere, per questo ci sono solo punti isolati.'],
        // proportional6
        ['Äpfel: 1 kg kostet 2,50 €', 'Mele: 1 kg costa 2,50 €'], ['24 Stück Kuchen werden gerecht verteilt', '24 fette di torta vengono divise in parti uguali'],
        ['Taxi: 3 € Grundgebühr und 2 € pro km', 'Taxi: 3 € di quota fissa e 2 € al km'],
        ['Graph der Zuordnung ', 'Grafico della corrispondenza: '], ['. Zieh den gelben Punkt.', '. Trascina il punto giallo.'],
        // dreisatz6
        ['3 kg Äpfel kosten 7,50 €. Wie viel kosten 5 kg?', '3 kg di mele costano 7,50 €. Quanto costano 5 kg?'],
        ['4 Pumpen leeren ein Becken in 6 Stunden. Wie lange brauchen 3 Pumpen?', '4 pompe svuotano una vasca in 6 ore. Quanto tempo ci mettono 3 pompe?'],
        ['5 Hefte kosten 4 €. Wie viel kosten 8 Hefte?', '5 quaderni costano 4 €. Quanto costano 8 quaderni?'],
        ['Ein Futtervorrat reicht für 12 Kaninchen 10 Tage. Wie lange reicht er für 8 Kaninchen?', 'Una scorta di mangime basta a 12 conigli per 10 giorni. Quanto dura per 8 conigli?'],
        ['5 kg Äpfel kosten 12,50 €.', '5 kg di mele costano 12,50 €.'], ['3 Pumpen brauchen 8 Stunden.', '3 pompe ci mettono 8 ore.'],
        ['8 Hefte kosten 6,40 €.', '8 quaderni costano 6,40 €.'], ['Für 8 Kaninchen reicht das Futter 15 Tage.', 'Per 8 conigli il mangime basta 15 giorni.'],
        ['Schritt 2: Rechne auf eins zurück. ', 'Passo 2: riduci all’unità. '],
        ['direkt proportional: Beide Seiten werden mit derselben Zahl gerechnet.', 'direttamente proporzionale: entrambi i lati si calcolano con lo stesso numero.'],
        ['indirekt proportional: Rechts wird umgekehrt gerechnet. Aus „: 4“ links wird „· 4“ rechts.',
            'inversamente proporzionale: a destra si fa l’operazione inversa. «: 4» a sinistra diventa «· 4» a destra.'],
        // konstruktion6
        ['<b>Kongruenzsatz sss:</b> Wenn zwei Dreiecke in allen drei Seiten übereinstimmen, dann sind sie kongruent.',
            '<b>Criterio LLL:</b> se due triangoli hanno uguali tutti e tre i lati, allora sono congruenti.'],
        ['<b>Kongruenzsatz sws:</b> Wenn zwei Dreiecke in zwei Seiten und dem eingeschlossenen Winkel übereinstimmen, dann sind sie kongruent.',
            '<b>Criterio LAL:</b> se due triangoli hanno uguali due lati e l’angolo compreso tra essi, allora sono congruenti.'],
        ['<b>Kongruenzsatz wsw:</b> Wenn zwei Dreiecke in einer Seite und den beiden anliegenden Winkeln übereinstimmen, dann sind sie kongruent.',
            '<b>Criterio ALA:</b> se due triangoli hanno uguali un lato e i due angoli adiacenti a esso, allora sono congruenti.'],
        ['<b>Kongruenzsatz SsW:</b> Wenn zwei Dreiecke in zwei Seiten und dem Winkel übereinstimmen, der der <b>größeren</b> Seite gegenüberliegt, dann sind sie kongruent.',
            '<b>Criterio LlA:</b> se due triangoli hanno uguali due lati e l’angolo opposto al lato <b>maggiore</b>, allora sono congruenti.'],
        ['<b>mehrdeutig:</b> von einem Element gehen mehrere Pfeile aus. <b>eindeutig:</b> von jedem genau einer. <b>eineindeutig:</b> eindeutig, und auch rückwärts eindeutig.',
            '<b>non univoca:</b> da un elemento partono più frecce. <b>univoca:</b> da ognuno ne parte esattamente una. <b>biunivoca:</b> univoca, e univoca anche al contrario.'],
        ['Die freien Schenkel der Winkel schneiden sich in $C$. ', 'I lati liberi degli angoli si intersecano in $C$. '],
        ['. Für $\\gamma$ bleibt nichts übrig, die Schenkel laufen auseinander.', '. Per $\\gamma$ non resta niente, i lati si allontanano.'],
        ['$ ist schon $', '$ fa già $'],
        ['Die beiden kürzeren Seiten sind zusammen ', 'I due lati più corti insieme misurano '], [' cm lang, die längste ', ' cm, il più lungo '],
        [' cm. Die Kreise treffen sich nicht.', ' cm. Le circonferenze non si incontrano.'], ['Die Kreise treffen sich nicht.', 'Le circonferenze non si incontrano.'],
        ['Die Kreise berühren sich nur auf der längsten Seite.', 'Le circonferenze si toccano solo sul lato più lungo.'], ['Konstruktion aus ', 'Costruzione a partire da '],
        // winkelsumme6
        ['Die gestrichelte Linie ist parallel zu $\\overline{AB}$. $\\alpha\'$ und $\\alpha$ sind Wechselwinkel an Parallelen, also gleich groß. Ebenso $\\beta\'$ und $\\beta$. ',
            'La linea tratteggiata è parallela ad $\\overline{AB}$. $\\alpha\'$ e $\\alpha$ sono angoli alterni tra rette parallele, quindi sono uguali. Lo stesso vale per $\\beta\'$ e $\\beta$. '],
        ['Zusammen mit $\\gamma$ bilden $\\alpha\'$ und $\\beta\'$ einen gestreckten Winkel: $180^\\circ$.',
            'Insieme a $\\gamma$, $\\alpha\'$ e $\\beta\'$ formano un angolo piatto: $180^\\circ$.'],
        [' und der Parallelen durch C', ' e la parallela per C'],
        // seitenwinkel6
        ['Alle Seiten gleich lang: alle Winkel $60^\\circ$. ', 'Tutti i lati uguali: tutti gli angoli misurano $60^\\circ$. '],
        ['Zwei Seiten sind gleich lang: Das Dreieck ist gleichschenklig, und die Basiswinkel sind gleich groß.',
            'Due lati sono uguali: il triangolo è isoscele e gli angoli alla base sono uguali.'],
        ['Die beiden kürzeren Stäbe sind zusammen genau so lang wie der längste: Sie liegen flach auf ihm. Das ist kein Dreieck.',
            'I due bastoncini più corti insieme sono lunghi esattamente quanto il più lungo: restano distesi su di esso. Questo non è un triangolo.'],
        ['Die beiden kürzeren Stäbe reichen nicht bis zueinander, egal wie man sie dreht.', 'I due bastoncini più corti non arrivano a toccarsi, comunque li si giri.'],
        [' <b>Dreiecksungleichung:</b> Zwei Seiten zusammen müssen immer länger sein als die dritte.', ' <b>Disuguaglianza triangolare:</b> due lati insieme devono essere sempre più lunghi del terzo.'],
        // linien6
        ['Jeder Punkt der Mittelsenkrechten ist von den beiden Ecken gleich weit entfernt. Ihr Schnittpunkt $U$ ist von <b>allen drei Ecken</b> gleich weit entfernt: der Mittelpunkt des Umkreises.',
            'Ogni punto dell’asse di un lato è equidistante dai due vertici. Il punto d’intersezione $U$ degli assi è equidistante da <b>tutti e tre i vertici</b>: è il centro della circonferenza circoscritta.'],
        [' Bei einem stumpfwinkligen Dreieck liegt $U$ außerhalb.', ' In un triangolo ottusangolo $U$ sta fuori.'],
        [' Beim rechtwinkligen Dreieck liegt $U$ genau auf der längsten Seite.', ' Nel triangolo rettangolo $U$ sta proprio sul lato più lungo.'],
        [' Bei einem spitzwinkligen Dreieck liegt $U$ innen.', ' In un triangolo acutangolo $U$ sta dentro.'],
        ['Jeder Punkt einer Winkelhalbierenden ist von den beiden Schenkeln gleich weit entfernt. Ihr Schnittpunkt $I$ ist von <b>allen drei Seiten</b> gleich weit entfernt: der Mittelpunkt des Inkreises. Er liegt immer innen.',
            'Ogni punto di una bisettrice è equidistante dai due lati dell’angolo. Il punto d’intersezione $I$ delle bisettrici è equidistante da <b>tutti e tre i lati</b>: è il centro della circonferenza inscritta. Sta sempre dentro.'],
        ['Eine Höhe ist das Lot von einer Ecke auf die gegenüberliegende Seite. Die drei Höhen schneiden sich in einem Punkt $H$.',
            'Un’altezza è il segmento perpendicolare condotto da un vertice al lato opposto. Le tre altezze si intersecano in un punto $H$.'],
        [' Beim stumpfwinkligen Dreieck liegt $H$ außerhalb: Man muss die Seiten verlängern (gestrichelt).', ' Nel triangolo ottusangolo $H$ sta fuori: bisogna prolungare i lati (tratteggiati).'],
        [' Beim rechtwinkligen Dreieck ist $H$ die Ecke mit dem rechten Winkel.', ' Nel triangolo rettangolo $H$ è il vertice dell’angolo retto.'],
        ['Eine Seitenhalbierende verbindet eine Ecke mit der Mitte der gegenüberliegenden Seite. Ihr Schnittpunkt $S$ ist der Schwerpunkt: Ein Dreieck aus Pappe kann man dort auf einer Nadelspitze balancieren.',
            'Una mediana unisce un vertice con il punto medio del lato opposto. Il punto d’intersezione $S$ delle mediane è il baricentro: lì un triangolo di cartone si può tenere in equilibrio sulla punta di un ago.'],
        [' · Schnittpunkt $', ' · punto d’intersezione $'], ['Umkreismittelpunkt', 'circocentro'], ['Inkreismittelpunkt', 'incentro'],
        ['Höhenschnittpunkt', 'ortocentro'], ['Schwerpunkt', 'baricentro'],
        // flaeche6
        ['Das abgeschnittene Dreieck rückt nach rechts. Aus dem Parallelogramm wird ein Rechteck mit derselben Grundseite und derselben Höhe.',
            'Il triangolo ritagliato si sposta a destra. Il parallelogramma diventa un rettangolo con la stessa base e la stessa altezza.'],
        ['Eine Kopie des Dreiecks dreht sich um die Mitte einer Seite. Zusammen ergeben beide ein Parallelogramm. Das Dreieck ist die Hälfte davon.',
            'Una copia del triangolo ruota intorno al punto medio di un lato. Insieme formano un parallelogramma. Il triangolo ne è la metà.'],
        ['Eine Kopie des Trapezes dreht sich um die Mitte eines Schenkels. Zusammen ergeben beide ein Parallelogramm mit der Grundseite $a + c$.',
            'Una copia del trapezio ruota intorno al punto medio di un lato obliquo. Insieme formano un parallelogramma con la base $a + c$.'],
        ['Die vier Dreiecke im Drachen klappen nach außen. Sie füllen das Rechteck aus den beiden Diagonalen genau zur Hälfte.',
            'I quattro triangoli del deltoide si ribaltano verso l’esterno. Riempiono esattamente metà del rettangolo formato dalle due diagonali.'],
        // prisma6
        ['Grundfläche $G', 'Area di base $G'], ['$, Umfang der Grundfläche $u', '$, perimetro di base $u'], ['Mantel $M', 'Superficie laterale $M'],
        ['Oberfläche $O', 'Superficie totale $O'], ['Volumen $V', 'Volume $V'],
        // kreisdiagramm6
        ['Winkel = Anteil · 360°. ', 'Angolo = parte · 360°. '], ['Eine Person entspricht hier $', 'Qui una persona corrisponde a $'],
        // sieb6 ("Schon $…$ ist größer als 100", "Gefunden: …" and "Die $p$ ist nicht gestrichen" by rules below)
        [' Kleinere Vielfache wie $', ' I multipli più piccoli, come $'], ['$ waren schon weg.', '$, erano già stati cancellati.'],
        // primfaktor6
        ['$ ist eine <b>Primzahl</b>.', '$ è un <b>numero primo</b>.'], ['Faktorbaum von ', 'Albero dei fattori di '],
        ['Der ggT besteht aus den Primfaktoren, die in <b>beiden</b> Zerlegungen vorkommen. Das kgV enthält jeden Primfaktor so oft, wie er <b>höchstens</b> vorkommt. ',
            'Il MCD è formato dai fattori primi che compaiono in <b>entrambe</b> le scomposizioni. Il mcm contiene ogni fattore primo tante volte quante compare <b>al massimo</b>. '],
        ['Damit kürzt man: $', 'Con il MCD si semplifica: $'],
        ['Die beiden Zahlen haben keinen gemeinsamen Teiler außer 1.', 'I due numeri non hanno divisori comuni oltre a 1.'],

        // book it-16 mathe6-it:
        // bruchbild6
        ['Bruch: $', 'Frazione: $'], ['Bild des Bruches ', 'Figura della frazione '], ['Dezimalzahl: $', 'Numero decimale: $'], ['Prozent: $', 'Percentuale: $'],
        ['Null Teile von ', 'Zero parti su '], [' sind nichts: $0$.', ' non sono niente: $0$.'],
        ['Der gekürzte Nenner ', 'Il denominatore semplificato '],
        [' hat nur die Primfaktoren 2 und 5. Erweitern mit $', ' ha solo i fattori primi 2 e 5. Amplificare per $'],
        ['. Die Dezimalzahl <b>bricht ab</b>.', '. Il numero decimale è <b>limitato</b>.'],
        ['$ enthält den Primfaktor $', '$ contiene il fattore primo $'],
        ['$. Auf 10, 100, 1000 … kann man nicht erweitern: Die Dezimalzahl ist <b>periodisch</b>.',
            '$. Non si può amplificare fino a 10, 100, 1000 …: il numero decimale è <b>periodico</b>.'],
        // mengen6
        ['5 ist eine natürliche Zahl, und jede natürliche Zahl ist auch eine gebrochene Zahl: ', '5 è un numero naturale, e ogni numero naturale è anche un numero frazionario: '],
        [' liegt zwischen 0 und 1. Das ist keine natürliche Zahl.', ' sta tra 0 e 1. Non è un numero naturale.'],
        [' liegt zwischen 0 und 1.', ' sta tra 0 e 1.'], [' liegt zwischen 2 und 3.', ' sta tra 2 e 3.'],
        [' liegt zwischen 4 und 5.', ' sta tra 4 e 5.'],
        ['. Der Bruch sieht nur anders aus als die 3.', '. La frazione è il 3, solo scritto in un altro modo.'],
        ['In der Schule zählt die 0 zu den natürlichen Zahlen.', 'A scuola lo 0 conta tra i numeri naturali.'],
        ['. Die Null nach dem Komma ändert nichts.', '. Lo zero dopo la virgola non cambia niente.'],
        [': die natürlichen Zahlen $', ': i numeri naturali $'],
        [': die gebrochenen Zahlen, also alle Zahlen, die man als Bruch $', ': i numeri frazionari, cioè tutti i numeri che si possono scrivere come frazione $'],
        ['$ schreiben kann.', '$.'],
        ['Jede natürliche Zahl ist auch eine gebrochene Zahl: $', 'Ogni numero naturale è anche un numero frazionario: $'],
        // bruchop6
        ['$: Bei den gebrochenen Zahlen geht diese Subtraktion nicht. Negative Zahlen lernst du in Klasse 7 kennen.',
            '$: con i numeri frazionari questa sottrazione non è possibile. I numeri negativi li conoscerai in 7ª classe.'],
        ['Hauptnenner: $', 'Minimo comune denominatore: $'],
        ['Erst gleichnamig machen, dann die Zähler addieren. Der Nenner bleibt.', 'Prima si porta allo stesso denominatore, poi si sommano i numeratori. Il denominatore resta uguale.'],
        ['Erst gleichnamig machen, dann die Zähler subtrahieren. Der Nenner bleibt.', 'Prima si porta allo stesso denominatore, poi si sottraggono i numeratori. Il denominatore resta uguale.'],
        ['$: Wie oft passt nichts in etwas? Diese Frage hat keine Antwort. Durch $0$ teilt man nie.',
            '$: quante volte sta il niente in qualcosa? Questa domanda non ha risposta. Per $0$ non si divide mai.'],
        // vorrang6
        ['Punktrechnung zuerst: $', 'Prima la moltiplicazione: $'], ['Hauptnenner 4: $', 'Denominatore comune 4: $'],
        ['Die Klammer zuerst: $', 'Prima la parentesi: $'],
        ['Fertig. Mit der Klammer kommt etwas anderes heraus als ohne.', 'Fatto. Con la parentesi viene un risultato diverso che senza.'],
        ['Punkt vor Strich: $', 'Prima per e diviso, poi più e meno: $'],
        ['Fertig. Wer von links rechnet, erhält falsch $6$.', 'Fatto. Chi calcola semplicemente da sinistra ottiene il risultato sbagliato $6$.'],
        ['Zwei Punktrechnungen: die linke zuerst. $', 'Due moltiplicazioni o divisioni: prima quella a sinistra. $'],
        ['Distributivgesetz: $\\tfrac25$ ausklammern.', 'Proprietà distributiva: raccogliere $\\tfrac25$ a fattor comune.'],
        ['Fertig. Ohne Ausklammern: $\\tfrac{14}{5} + \\tfrac65 = \\tfrac{20}{5} = 4$, mehr Arbeit.', 'Fatto. Senza raccogliere: $\\tfrac{14}{5} + \\tfrac65 = \\tfrac{20}{5} = 4$, più lavoro.'],
        // probieren6 (the sentences with a number inside are rules below)
        ['Gesucht sind alle Zahlen, für die die linke Seite kleiner als $', 'Si cercano tutti i numeri per cui il primo membro è minore di $'],
        ['Gesucht sind alle Zahlen, für die die linke Seite größer als $', 'Si cercano tutti i numeri per cui il primo membro è maggiore di $'],
        ['Es passen: ', 'Vanno bene: '], ['Bisher passt keiner.', 'Finora non va bene nessuno.'],
        // pfeile6
        ['Pfeildarstellung: ', 'Diagramma a frecce: '],
        ['Schüler → Vorname', 'Alunno → nome'], ['Vorname → Schüler', 'Nome → alunno'], ['Schüler → Sitzplatz', 'Alunno → posto'],
        ['Zahl → Teiler', 'Numero → divisore'], ['Zahl → Doppeltes', 'Numero → doppio'], ['Zahl → Rest bei : 3', 'Numero → resto nella divisione per 3'],
        ['Die Zuordnung ist mehrdeutig. ', 'La corrispondenza non è univoca. '],
        ['Die Zuordnung ist eindeutig, aber nicht eineindeutig. ', 'La corrispondenza è univoca, ma non biunivoca. '],
        ['Die Zuordnung ist eineindeutig. ', 'La corrispondenza è biunivoca. '],
        ['Die Zuordnung ist ', 'La corrispondenza è '],
        ['Von jedem Element links geht genau ein Pfeil aus, und rechts kommt bei jedem genau ein Pfeil an. Auch rückwärts ist die Zuordnung eindeutig.',
            'Da ogni elemento a sinistra parte esattamente una freccia, e a destra a ognuno arriva esattamente una freccia. Anche all’indietro la corrispondenza è univoca.'],
        ['Von jedem Element links geht genau ein Pfeil aus. ', 'Da ogni elemento a sinistra parte esattamente una freccia. '],
        ['<b>mehrdeutig:</b> von einem Element gehen mehrere Pfeile aus. <b>eindeutig:</b> von jedem genau einer. <b>eineindeutig:</b> eindeutig, und auch rückwärts eindeutig.',
            '<b>non univoca:</b> da un elemento partono più frecce. <b>univoca:</b> da ognuno ne parte esattamente una. <b>biunivoca:</b> univoca, e univoca anche all’indietro.'],
        // darstellung6
        ['Eine Kerze ist 20 cm hoch. Jede Stunde brennt sie 2,5 cm herunter.', 'Una candela è alta 20 cm. Ogni ora si consuma di 2,5 cm.'],
        ['An einem Herbsttag wird alle zwei Stunden die Temperatur gemessen.', 'In un giorno d’autunno si misura la temperatura ogni due ore.'],
        ['Ein Fahrrad kostet 3 € pro Stunde Leihzeit.', 'Noleggiare una bici costa 3 € all’ora.'],
        ['Diagramm: ', 'Grafico: '], ['Gewählt: ', 'Selezionato: '],
        ['Die Kerze brennt gleichmäßig, auch zwischen den vollen Stunden. Darum darf man die Punkte mit einer Linie verbinden.',
            'La candela si consuma in modo regolare, anche tra un’ora e l’altra. Per questo si possono collegare i punti con una linea.'],
        ['Die gestrichelte Linie verbindet nur die Messpunkte. Was dazwischen geschah, weiß man nicht genau.',
            'La linea tratteggiata collega solo i punti misurati. Che cosa sia successo nel frattempo non si sa con precisione.'],
        ['Abgerechnet wird nur nach ganzen Stunden, darum gibt es nur einzelne Punkte.', 'Si pagano solo ore intere, perciò ci sono solo punti isolati.'],
        // proportional6
        ['Äpfel: 1 kg kostet 2,50 €', 'Mele: 1 kg costa 2,50 €'], ['24 Stück Kuchen werden gerecht verteilt', '24 pezzi di torta vengono divisi in modo equo'],
        ['Taxi: 3 € Grundgebühr und 2 € pro km', 'Taxi: 3 € di quota fissa e 2 € al km'],
        ['Graph der Zuordnung ', 'Grafico della corrispondenza: '], ['. Zieh den gelben Punkt.', '. Trascina il punto giallo.'],
        // dreisatz6
        ['3 kg Äpfel kosten 7,50 €. Wie viel kosten 5 kg?', '3 kg di mele costano 7,50 €. Quanto costano 5 kg?'],
        ['4 Pumpen leeren ein Becken in 6 Stunden. Wie lange brauchen 3 Pumpen?', '4 pompe svuotano una vasca in 6 ore. Quanto tempo impiegano 3 pompe?'],
        ['5 Hefte kosten 4 €. Wie viel kosten 8 Hefte?', '5 quaderni costano 4 €. Quanto costano 8 quaderni?'],
        ['Ein Futtervorrat reicht für 12 Kaninchen 10 Tage. Wie lange reicht er für 8 Kaninchen?', 'Una scorta di mangime basta a 12 conigli per 10 giorni. Quanto dura per 8 conigli?'],
        ['5 kg Äpfel kosten 12,50 €.', '5 kg di mele costano 12,50 €.'], ['3 Pumpen brauchen 8 Stunden.', '3 pompe impiegano 8 ore.'],
        ['8 Hefte kosten 6,40 €.', '8 quaderni costano 6,40 €.'], ['Für 8 Kaninchen reicht das Futter 15 Tage.', 'Per 8 conigli il mangime basta 15 giorni.'],
        ['Schritt 2: Rechne auf eins zurück. ', 'Passo 2: riduci all’unità. '],
        ['direkt proportional: Beide Seiten werden mit derselben Zahl gerechnet.', 'direttamente proporzionale: entrambi i lati si calcolano con lo stesso numero.'],
        ['indirekt proportional: Rechts wird umgekehrt gerechnet. Aus „: 4“ links wird „· 4“ rechts.',
            'inversamente proporzionale: a destra si fa l’operazione inversa. «: 4» a sinistra diventa «· 4» a destra.'],

        // book it-17 mathe7-it:

        // book it-18 mathe8-it:

    ],
    rule: [
        // book it-11 mathegy6-it:
        // the steppers' aria-labels: "Zähler kleiner" → "Numeratore: meno"
        [/^(.+) (kleiner|größer)$/, (m, w, d) => {
            const S = { 'Zähler': 'Numeratore', 'Nenner': 'Denominatore', 'erster Zähler': 'Primo numeratore', 'erster Nenner': 'Primo denominatore',
                'zweiter Zähler': 'Secondo numeratore', 'zweiter Nenner': 'Secondo denominatore', 'zu Fuß': 'A piedi', 'Fahrrad': 'Bici',
                'Bus oder Bahn': 'Autobus o treno', 'Auto': 'Auto' };
            return S[w] ? S[w] + (d === 'kleiner' ? ': meno' : ': più') : m;
        }],
        // bruchbild6
        [/^Bild des Bruches (\d+) durch (\d+)$/, 'Figura della frazione $1/$2'],
        // mengen6
        [/Zahl (\d+) von (\d+): Wohin gehört <b>(\$[^$]*\$)<\/b>\?/g, 'Numero $1 di $2: dove va <b>$3</b>?'],
        [/Alle Zahlen sind einsortiert(?:, (\d+) von (\d+) gleich beim ersten Versuch richtig)?\./g,
            (m, a, b) => 'Tutti i numeri sono al loro posto' + (a ? ': ' + a + ' su ' + b + ' giusti al primo tentativo' : '') + '.'],
        // bruchop6: "… dann die Zähler addieren / subtrahieren." (the whole sentences are phrases; this is the joined form)
        [/Erst gleichnamig machen, dann die Zähler (addieren|subtrahieren)\. Der Nenner bleibt\./g,
            (m, v) => 'Prima si riduce allo stesso denominatore, poi si ' + (v === 'addieren' ? 'sommano' : 'sottraggono') + ' i numeratori. Il denominatore resta.'],
        // probieren6
        [/Gesucht sind alle Zahlen, für die die linke Seite (kleiner|größer) als \$([^$]*)\$ ist\./g,
            (m, r, t) => 'Si cercano tutti i numeri per cui il primo membro è ' + (r === 'kleiner' ? 'minore' : 'maggiore') + ' di $' + t + '$.'],
        [/Geprüft: (\d+) von (\d+) Werten\. /g, (m, a, b) => 'Controllati: ' + a + (a === '1' ? ' valore' : ' valori') + ' su ' + b + '. '],
        // pfeile6
        [/Von „([^“]+)“ gehen (\d+) Pfeile aus\./g, 'Da «$1» partono $2 frecce.'],
        [/Bei „([^“]+)“ kommen aber (\d+) Pfeile an, rückwärts ist die Zuordnung also nicht eindeutig\./g,
            'Ma a «$1» arrivano $2 frecce, quindi al contrario la corrispondenza non è univoca.'],
        // zufall6: the die and the spinner (glossary: dado, ruota della fortuna; "Würfel" alone is also the cube)
        [/>(\d+) Versuche</g, (m, n) => '>' + n + (n === '1' ? ' prova' : ' prove') + '<'],
        [/(data-v="wuerfel">)Würfel</g, '$1Dado<'], [/>Glücksrad</g, '>Ruota della fortuna<'],
        // kreisdiagramm6: the column of the table
        [/>Anteil</g, '>Parte<'],
        // darstellung6: "Gewählt: Uhrzeit 12 → Temperatur 14."
        [/Gewählt: Uhrzeit /g, 'Scelto: ora '], [/ → Temperatur /g, ' → temperatura '],
        // dreisatz6: "4 Pumpen" → "4 pompe", "1 Tage" → "1 giorno"
        [/>([\d.,]+) (Pumpen|Hefte|Kaninchen|Tage)</g, (m, n, u) => {
            const U = { Pumpen: ['pompa', 'pompe'], Hefte: ['quaderno', 'quaderni'], Kaninchen: ['coniglio', 'conigli'], Tage: ['giorno', 'giorni'] };
            return '>' + n + ' ' + U[u][n === '1' ? 0 : 1] + '<';
        }],
        // konstruktion6
        [/^Konstruktion aus (sss|sws|wsw|SsW|www)$/, (m, k) => 'Costruzione a partire da ' + { sss: 'LLL', sws: 'LAL', wsw: 'ALA', SsW: 'LlA', www: 'AAA' }[k]],
        // seitenwinkel6: the largest angle lies opposite the longest side
        [/Der <span class="g-lam">längsten Seite \$([abc])\$<\/span> liegt der <span class="g-lam">größte Winkel \$(\\[a-z]+)\$<\/span> gegenüber, der <span class="g-cy">kürzesten \$([abc])\$<\/span> der kleinste\. /g,
            (m, s1, w, s2) => 'Di fronte al <span class="g-lam">lato più lungo $' + s1 + '$</span> sta l’<span class="g-lam">angolo maggiore $' + w + '$</span>, di fronte al <span class="g-cy">più corto $' + s2 + '$</span> il minore. '],
        // linien6
        [/>Mittelsenkrechten</g, '>Assi<'],
        [/^Dreieck mit seinen (Mittelsenkrechten|Winkelhalbierende|Höhen|Seitenhalbierende)$/,
            (m, l) => 'Triangolo con ' + { Mittelsenkrechten: 'i suoi assi', Winkelhalbierende: 'le sue bisettrici', Höhen: 'le sue altezze', Seitenhalbierende: 'le sue mediane' }[l]],
        // flaeche6
        [/^(Parallelogramm|Dreieck|Trapez|Drachenviereck): zerlegen und verschieben$/,
            (m, s) => ({ Parallelogramm: 'Parallelogramma', Dreieck: 'Triangolo', Trapez: 'Trapezio', Drachenviereck: 'Deltoide' })[s] + ': scomporre e spostare'],
        // vierecke6: the two-line label "gleichschenkliges / Trapez" (the second line may already be a translated label)
        [/(<text class="g6-nodetxt"[^>]*>)gleichschenkliges(<\/text>[^<]*<text class="g6-nodetxt"[^>]*>)(?:Trapez|\u0003\d+\u0004)(<\/text>)/g, '$1Trapezio$2isoscele$3'],
        // vierecke6: "Jedes <b>Quadrat</b> ist auch ein Rechteck, eine Raute, …." - every Italian name is masculine ("ogni", "un")
        [/Jede[s]? <b>([^<]+)<\/b> ist auch ([^<]+)\.<\/p>/g, (m, s, list) => {
            const S = { 'Quadrat': 'quadrato', 'Rechteck': 'rettangolo', 'Raute': 'rombo', 'Parallelogramm': 'parallelogramma', 'gleichschenkliges Trapez': 'trapezio isoscele',
                'gleichschenklige Trapez': 'trapezio isoscele', 'Drachenviereck': 'deltoide', 'Trapez': 'trapezio', 'Viereck': 'quadrilatero' };
            return 'Ogni <b>' + (S[s] || s) + '</b> è anche ' + list.split(', ').map(x => { const k = x.replace(/^eine? /, ''); return S[k] ? 'un ' + S[k] : x; }).join(', ') + '.</p>';
        }],
        // prisma6
        [/^(Dreiecksprisma|Quader|Trapezprisma|Sechseckprisma) im Schrägbild: Grundfläche vorn in wahrer Größe, Tiefe unter 45 Grad und halb so lang$/,
            (m, s) => ({ Dreiecksprisma: 'Prisma triangolare', Quader: 'Parallelepipedo', Trapezprisma: 'Prisma trapezoidale', Sechseckprisma: 'Prisma esagonale' })[s] +
                ' in assonometria cavaliera: la base davanti in vera grandezza, la profondità a 45 gradi e lunga la metà'],
        [/^Netz des (Dreiecksprisma|Quader|Trapezprisma|Sechseckprisma)s: zwei Grundflächen und der Mantel aus Rechtecken$/,
            (m, s) => 'Sviluppo del ' + { Dreiecksprisma: 'prisma triangolare', Quader: 'parallelepipedo', Trapezprisma: 'prisma trapezoidale', Sechseckprisma: 'prisma esagonale' }[s] +
                ': due basi e la superficie laterale fatta di rettangoli'],
        // sieb6
        [/Schon \$([^$]+)\$ ist größer als 100\. Alles, was noch übrig ist, ist eine Primzahl\. <b>Fertig: 25 Primzahlen bis 100\.<\/b>/g,
            (m, t) => 'Già $' + t + '$ è maggiore di 100. Tutto quello che resta è un numero primo. <b>Fatto: 25 numeri primi fino a 100.</b>'],
        [/Die \$(\d+)\$ ist nicht gestrichen, also eine Primzahl\. Gestrichen werden ihre Vielfachen ab \$([^$]+)\$: (\d+) Zahlen \(/g,
            (m, p, q, n) => 'Il $' + p + '$ non è cancellato, quindi è un numero primo. Si cancellano i suoi multipli a partire da $' + q + '$: ' + n + ' numeri ('],
        [/Gefunden: (\d+) Primzahlen\. Gestrichen: /g, (m, n) => (n === '1' ? 'Trovato: 1 numero primo' : 'Trovati: ' + n + ' numeri primi') + '. Cancellati: '],

        // book it-16 mathe6-it:
        // the steppers' aria-labels: "Zähler kleiner" → "Numeratore: meno"
        [/^(Zähler|Nenner|erster Zähler|erster Nenner|zweiter Zähler|zweiter Nenner|zu Fuß|Fahrrad|Bus oder Bahn|Auto) (kleiner|größer)$/, (m, w, d) => ({
            'Zähler': 'Numeratore', 'Nenner': 'Denominatore', 'erster Zähler': 'Primo numeratore', 'erster Nenner': 'Primo denominatore',
            'zweiter Zähler': 'Secondo numeratore', 'zweiter Nenner': 'Secondo denominatore',
            'zu Fuß': 'A piedi', 'Fahrrad': 'Bici', 'Bus oder Bahn': 'Autobus o treno', 'Auto': 'Auto' })[w] + (d === 'kleiner' ? ': meno' : ': più')],
        // bruchbild6
        [/^Bild des Bruches (\d+) durch (\d+)$/, 'Figura della frazione $1/$2'],
        // mengen6
        [/Zahl (\d+) von (\d+): Wohin gehört <b>(\$[^$]*\$)<\/b>\?/g, 'Numero $1 di $2: dove va <b>$3</b>?'],
        [/Alle Zahlen sind einsortiert(?:, (\d+) von (\d+) gleich beim ersten Versuch richtig)?\./g,
            (m, a, b) => 'Tutti i numeri sono al loro posto' + (a ? ': ' + a + ' su ' + b + ' giusti al primo tentativo' : '') + '.'],
        [/(\\in \\mathbb\{Q\}\^\+\$) und \$/g, '$1 e $'], [/(\\in \\mathbb\{Q\}\^\+\$), aber \$/g, '$1, ma $'],
        // bruchop6: "… dann die Zähler addieren / subtrahieren." (the whole sentences are phrases; this is the joined form)
        [/Erst gleichnamig machen, dann die Zähler (addieren|subtrahieren)\. Der Nenner bleibt\./g,
            (m, v) => 'Prima si porta allo stesso denominatore, poi si ' + (v === 'addieren' ? 'sommano' : 'sottraggono') + ' i numeratori. Il denominatore resta uguale.'],
        [/\(das kleinste gemeinsame Vielfache von \$(\d+)\$ und \$(\d+)\$\)/g, (m, a, b) => '(il minimo comune multiplo di $' + a + '$ e $' + b + '$)'],
        [/\$(\d+)\$ von \$(\d+)\$ Kästchen\. Das ist (\$[^$]*\$) von (\$[^$]*\$)\./g, (m, a, b, x, y) => '$' + a + '$ quadretti su $' + b + '$. Sono ' + x + ' di ' + y + '.'],
        [/(\$[^$]*\$) passt (\$[^$]*\$)-mal in (\$[^$]*\$)\./g, (m, x, k, y) => x + ' sta ' + k + ' volte in ' + y + '.'],
        // probieren6
        [/Gesucht sind alle Zahlen, für die die linke Seite (kleiner|größer) als (\$[^$]*\$) ist\./g,
            (m, r, x) => 'Si cercano tutti i numeri per cui il primo membro è ' + (r === 'kleiner' ? 'minore' : 'maggiore') + ' di ' + x + '.'],
        [/(\$[^$]*\$), und (\$[^$]*\$)<\/p>/g, '$1, e $2</p>'],
        [/Geprüft: (\d+) von (\d+) Werten\. /g, (m, a, b) => (a === '1' ? 'Verificato: 1 valore su ' : 'Verificati: ' + a + ' valori su ') + b + '. '],
        // pfeile6
        [/Von „([^“]+)“ gehen (\d+) Pfeile aus\./g, 'Da «$1» partono $2 frecce.'],
        [/Bei „([^“]+)“ kommen aber (\d+) Pfeile an, rückwärts ist die Zuordnung also nicht eindeutig\./g,
            'Ma a «$1» arrivano $2 frecce, quindi all’indietro la corrispondenza non è univoca.'],
        // darstellung6: "Gewählt: Uhrzeit 12 → Temperatur 14."
        [/Gewählt: Uhrzeit /g, 'Gewählt: ora '], [/ → Temperatur /g, ' → temperatura '],
        // dreisatz6: "4 Pumpen" → "4 pompe", "1 Tage" → "1 giorno"
        [/>([\d.,]+) (Pumpen|Hefte|Kaninchen|Tage)</g, (m, n, u) => '>' + n + ' ' +
            ({ Pumpen: ['pompa', 'pompe'], Hefte: ['quaderno', 'quaderni'], Kaninchen: ['coniglio', 'conigli'], Tage: ['giorno', 'giorni'] })[u][n === '1' ? 0 : 1] + '<'],

        // book it-17 mathe7-it:

        // book it-18 mathe8-it:

    ]
});
