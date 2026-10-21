/* js/buch-it/gy7.js — Italian for the widgets of js/buch-gy7.js.
 * Loaded by the Italian editions right after js/buch-gy7.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 3 (20.10.2026): eleven books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/gy7.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('gy7', {
    word: {
        // book it-12 mathegy7-it:
        // shared: the solids, the 3D stage ("Würfel" is a rule below: in stochastics it is a die)
        'Quader': 'Parallelepipedo', 'Dreiecksprisma': 'Prisma triangolare', 'Sechseckprisma': 'Prisma esagonale', 'Quadratische Pyramide': 'Piramide quadrangolare',
        'Quadr. Pyramide': 'Piramide quadr.', 'Dreieckspyramide': 'Piramide triangolare', 'Pyramidenstumpf': 'Tronco di piramide', 'Tetraeder': 'Tetraedro',
        'Oktaeder': 'Ottaedro', 'Dodekaeder': 'Dodecaedro', 'Ikosaeder': 'Icosaedro', 'Körper in 3D': 'Solido in 3D', 'Ziehen zum Drehen': 'Trascina per ruotare',
        'Von vorn': 'Da capo', 'Alle Schritte': 'Tutti i passi', 'weniger': 'meno', 'mehr': 'più',
        // titelbildgy7
        'Titelbild: ein Kreis mit rechtwinkligem Dreieck über dem Durchmesser, eine Pyramide im Schrägbild, ein Ikosaeder, ein Kreisdiagramm und eine Zahlengerade mit einer Zahl und ihrer Gegenzahl':
            'Illustrazione di copertina: una circonferenza con un triangolo rettangolo sul diametro, una piramide in assonometria cavaliera, un icosaedro, un diagramma circolare e una retta dei numeri con un numero e il suo opposto',
        // kreisgerade7
        'Passante': 'Retta esterna', 'Sekante': 'Secante', 'Tangente': 'Tangente',
        'Zieh an den beiden Punkten der Geraden. Kommt der Abstand $d$ nahe an den Radius $r$, rastet die Gerade als Tangente ein.':
            'Trascina i due punti della retta. Quando la distanza $d$ si avvicina al raggio $r$, la retta si aggancia come tangente.',
        'Ein Kreis mit einer Passante, einer Sekante und einer Tangente': 'Una circonferenza con una retta esterna, una secante e una tangente',
        'Kreis mit einer verschiebbaren Geraden': 'Circonferenza con una retta che si può spostare',
        // dreieckkreise7 (the two sentences "Die drei … schneiden sich" are rules: assi is masculine, bisettrici feminine)
        'Mittelsenkrechten': 'assi', 'Winkelhalbierenden': 'bisettrici',
        'Zieh an den Ecken. In der Nähe von $90^\\circ$ rastet der Winkel an der gezogenen Ecke als rechter Winkel ein.':
            'Trascina i vertici. Vicino a $90^\\circ$ l’angolo nel vertice che trascini si aggancia come angolo retto.',
        'Dreieck mit Umkreis': 'Triangolo con la circonferenza circoscritta', 'Dreieck mit Inkreis': 'Triangolo con la circonferenza inscritta',
        // kreiswinkel7
        'Thales': 'Talete', 'Peripheriewinkel': 'Angolo alla circonferenza', 'Sehnenviereck': 'Quadrilatero inscritto', 'Satz': 'Teorema', 'Zentriwinkel': 'Angolo al centro',
        'Beweisidee zeigen': 'Mostra l’idea della dimostrazione',
        'Satz des Thales: Dreieck über dem Durchmesser': 'Teorema di Talete: triangolo inscritto in una semicirconferenza',
        'Peripheriewinkel und Zentriwinkel über einem Kreisbogen': 'Angolo alla circonferenza e angolo al centro che insistono su un arco',
        'Sehnenviereck mit seinen vier Winkeln': 'Quadrilatero inscritto con i suoi quattro angoli',
        // konstruktion7
        'Tangenten von P': 'Tangenti da P', 'Dreieck aus c, α, β': 'Triangolo da c, α, β', 'Tangenten an zwei Kreise': 'Tangenti a due circonferenze', 'Konstruktion': 'Costruzione',
        '◀ Zurück': '◀ Indietro', 'Weiter ▶': 'Avanti ▶', 'Winkel $\\alpha$': 'Angolo $\\alpha$', 'Winkel $\\beta$': 'Angolo $\\beta$',
        'Konstruktion der Tangenten von einem Punkt an einen Kreis': 'Costruzione delle tangenti da un punto a una circonferenza',
        'Konstruktion eines Dreiecks aus einer Seite und zwei Winkeln': 'Costruzione di un triangolo dati un lato e due angoli',
        'Konstruktion der gemeinsamen Tangenten an zwei Kreise': 'Costruzione delle tangenti comuni a due circonferenze',
        // zahlengerade7
        'Addieren': 'Addizione', 'Subtrahieren': 'Sottrazione', 'Rechenart': 'Operazione', 'erste Zahl $a$': 'primo numero $a$', 'zweite Zahl $b$': 'secondo numero $b$',
        'Zieh die Punkte $a$ und $b$ auf der Zahlengeraden. Sie rasten in halben Schritten ein.': 'Trascina i punti $a$ e $b$ sulla retta dei numeri. Si agganciano a passi di mezza unità.',
        'Gegenzahlen': 'Opposti', 'Start': 'Partenza', 'Zahlengerade mit rationalen Zahlen': 'Retta dei numeri con numeri razionali',
        'Rechnen als Bewegung auf der Zahlengeraden': 'Calcolare come movimento sulla retta dei numeri',
        // zahlbereiche7
        'Wohin gehört die Zahl?': 'Dove va il numero?', 'Nächste Zahl': 'Numero successivo', 'DIE ZAHL': 'IL NUMERO',
        '$\\mathbb{Z}$, aber nicht $\\mathbb{N}$': '$\\mathbb{Z}$, ma non $\\mathbb{N}$', '$\\mathbb{Q}^+$, aber nicht $\\mathbb{N}$': '$\\mathbb{Q}^+$, ma non $\\mathbb{N}$',
        'nur $\\mathbb{Q}$': 'solo $\\mathbb{Q}$', 'Nur das Bild': 'Solo la figura', 'Teilmengen': 'Sottoinsiemi', 'Schnittmenge': 'Intersezione', 'Vereinigung': 'Unione', 'Mengen': 'Insiemi',
        'rationale Zahlen': 'numeri razionali', 'ganze Zahlen': 'numeri interi', 'gebrochene Zahlen': 'numeri frazionari', 'natürliche': 'naturali',
        'Mengendiagramm: natürliche, ganze, gebrochene und rationale Zahlen': 'Diagramma di Eulero-Venn: numeri naturali, interi, frazionari e razionali',
        'In welchen Teil des Bildes gehört sie? Tippe auf einen Knopf oder ins Bild.': 'In quale parte della figura va? Tocca un pulsante o la figura.',
        // vorzeichen7
        'Multiplizieren': 'Moltiplicazione', 'Potenzen': 'Potenze', 'Muster': 'Schema', 'erster Faktor': 'primo fattore', 'Nächste Zeile': 'Riga successiva',
        'positiv': 'positivo', 'negativ': 'negativo', 'Die Ergebnisse auf der Zahlengeraden': 'I risultati sulla retta dei numeri',
        // waagebild7
        'Eine Waage im Gleichgewicht: links drei Kisten x und zwei Gewichte, rechts eine Kiste x und sechs Gewichte':
            'Una bilancia in equilibrio: a sinistra tre scatole x e due pesi, a destra una scatola x e sei pesi',
        // umstellen7
        '⇄ Seiten tauschen': '⇄ scambia i membri', 'Rechteck': 'Rettangolo', 'Umfang': 'Perimetro', 'Geschwindigkeit': 'Velocità', 'Dichte': 'Densità', 'Pyramide': 'Piramide',
        'Formel': 'Formula', 'Nächster Schritt': 'Passo successivo', 'umstellen nach': 'ricava',
        // prozent7
        'Grundwert $G$': 'Valore di base $G$', 'Prozentsatz $p\\,\\%$': 'Tasso percentuale $p\\,\\%$', 'Änderung um': 'Variazione',
        'Danach um denselben Prozentsatz zurück': 'Poi torna indietro dello stesso tasso', 'Balken vor und nach der Änderung': 'Barre prima e dopo la variazione',
        'Nicht': 'Non',
        // diagramm7
        'Wie kommst du zur Schule? Umfrage in einer Klasse': 'Come vai a scuola? Sondaggio in una classe', 'Antworten': 'Risposte', 'zu Fuß': 'a piedi',
        'Fahrrad': 'bici', 'Bus, Bahn': 'autobus, treno', 'Auto': 'auto', 'Klassensprecherwahl: Stimmen': 'Elezione del rappresentante di classe: voti', 'Stimmen': 'Voti',
        'Höhe einer Sonnenblume, jede Woche gemessen': 'Altezza di un girasole, misurata ogni settimana',
        'Säulendiagramm': 'Diagramma a colonne', 'Liniendiagramm': 'Grafico a linee', 'Kreisdiagramm': 'Diagramma circolare', 'Diagramm': 'Diagramma', 'Woche': 'Settimana', 'Anteil': 'Quota', 'Winkel': 'Angolo',
        // schraegbild7 ('Körper' as in js/buch-it/gleichungen.js)
        'Fichtenholz': 'Legno di abete', 'Glas': 'Vetro', 'Stahl': 'Acciaio', 'Schrägbild': 'Assonometria', 'Zweitafelbild': 'Proiezioni ortogonali', 'Wahre Länge': 'Vera lunghezza',
        'Darstellung': 'Rappresentazione', 'Körper': 'Solido', 'Grundkante $a$': 'Spigolo di base $a$', 'Kante $b$': 'Spigolo $b$', 'Höhe $h$': 'Altezza $h$', 'Stoff': 'Materiale',
        'Deckkante $b$': 'Spigolo superiore $b$', 'Breite $b$': 'Larghezza $b$', 'AUFRISS': 'PROSPETTO', 'GRUNDRISS': 'PIANTA',
        // faltnetz7
        'Falten': 'Piegatura', '▶ Zusammenfalten': '▶ Piega', '◀ Auffalten': '◀ Apri', 'Ein Netz faltet sich zu einem Körper': 'Uno sviluppo piano si piega in un solido',
        // drittel7
        'Zusammenschieben': 'Unisci', '▶ Zusammenschieben': '▶ Unisci', '◀ Auseinander': '◀ Separa',
        'Drei gleiche Pyramiden ergeben einen Würfel': 'Tre piramidi uguali formano un cubo',
        // eckenwinkel7
        'Dreiecke': 'Triangoli', 'Quadrate': 'Quadrati', 'Fünfecke': 'Pentagoni', 'Sechsecke': 'Esagoni', 'Vieleck': 'Poligono', 'Anzahl an der Ecke': 'Numero nel vertice',
        'flach': 'piatto',

        // book it-17 mathe7-it:
        // shared: the solids, the 3D stage ("Würfel" is a die in gy6: the cube is a rule below)
        'Quader': 'Parallelepipedo', 'Dreiecksprisma': 'Prisma triangolare', 'Sechseckprisma': 'Prisma esagonale', 'Quadratische Pyramide': 'Piramide quadrangolare',
        'Quadr. Pyramide': 'Piramide quadr.', 'Dreieckspyramide': 'Piramide triangolare', 'Pyramidenstumpf': 'Tronco di piramide', 'Tetraeder': 'Tetraedro',
        'Oktaeder': 'Ottaedro', 'Dodekaeder': 'Dodecaedro', 'Ikosaeder': 'Icosaedro', 'Körper in 3D': 'Solido in 3D', 'Ziehen zum Drehen': 'Trascina per ruotare',
        'weniger': 'meno', 'mehr': 'più', 'Von vorn': 'Da capo', 'Alle Schritte': 'Tutti i passi',
        // zahlengerade7
        'Addieren': 'Addizione', 'Subtrahieren': 'Sottrazione', 'Rechenart': 'Operazione', 'erste Zahl $a$': 'primo numero $a$', 'zweite Zahl $b$': 'secondo numero $b$',
        'Zieh die Punkte $a$ und $b$ auf der Zahlengeraden. Sie rasten in halben Schritten ein.': 'Trascina i punti $a$ e $b$ sulla retta dei numeri. Scattano di mezza unità in mezza unità.',
        'Gegenzahlen': 'Opposti', 'Start': 'Partenza', 'Zahlengerade mit rationalen Zahlen': 'Retta dei numeri con numeri razionali',
        'Rechnen als Bewegung auf der Zahlengeraden': 'Calcolare come movimento sulla retta dei numeri',
        // zahlbereiche7
        'Wohin gehört die Zahl?': 'Dove va il numero?', 'Nächste Zahl': 'Numero successivo', 'DIE ZAHL': 'IL NUMERO',
        '$\\mathbb{Z}$, aber nicht $\\mathbb{N}$': '$\\mathbb{Z}$, ma non $\\mathbb{N}$', '$\\mathbb{Q}^+$, aber nicht $\\mathbb{N}$': '$\\mathbb{Q}^+$, ma non $\\mathbb{N}$',
        'nur $\\mathbb{Q}$': 'solo $\\mathbb{Q}$', 'Nur das Bild': 'Solo la figura', 'Teilmengen': 'Sottoinsiemi', 'Schnittmenge': 'Intersezione', 'Vereinigung': 'Unione', 'Mengen': 'Insiemi',
        'rationale Zahlen': 'numeri razionali', 'ganze Zahlen': 'numeri interi', 'gebrochene Zahlen': 'razionali assoluti', 'natürliche': 'naturali',
        'Mengendiagramm: natürliche, ganze, gebrochene und rationale Zahlen': 'Diagramma di Venn: numeri naturali, interi, razionali assoluti e razionali',
        'In welchen Teil des Bildes gehört sie? Tippe auf einen Knopf oder ins Bild.': 'In quale parte della figura va? Tocca un pulsante o la figura.',
        // vorzeichen7
        'Multiplizieren': 'Moltiplicazione', 'Potenzen': 'Potenze', 'Muster': 'Schema', 'erster Faktor': 'primo fattore', 'Nächste Zeile': 'Riga successiva',
        'positiv': 'positivo', 'negativ': 'negativo', 'Die Ergebnisse auf der Zahlengeraden': 'I risultati sulla retta dei numeri',
        // waagebild7
        'Eine Waage im Gleichgewicht: links drei Kisten x und zwei Gewichte, rechts eine Kiste x und sechs Gewichte':
            'Una bilancia in equilibrio: a sinistra tre scatole x e due pesi, a destra una scatola x e sei pesi',
        // umstellen7
        '⇄ Seiten tauschen': '⇄ scambia i lati', 'Rechteck': 'Rettangolo', 'Umfang': 'Perimetro', 'Geschwindigkeit': 'Velocità', 'Dichte': 'Densità', 'Pyramide': 'Piramide',
        'Formel': 'Formula', 'Nächster Schritt': 'Passo successivo', 'umstellen nach': 'ricava',
        // prozent7
        'Grundwert $G$': 'Valore di base $G$', 'Prozentsatz $p\\,\\%$': 'Tasso percentuale $p\\,\\%$', 'Änderung um': 'Variazione del',
        'Danach um denselben Prozentsatz zurück': 'Poi indietro dello stesso tasso percentuale', 'Balken vor und nach der Änderung': 'Barre prima e dopo la variazione',
        'Nicht': 'Non',
        // diagramm7
        'Wie kommst du zur Schule? Umfrage in einer Klasse': 'Come vieni a scuola? Sondaggio in una classe', 'Antworten': 'Risposte', 'zu Fuß': 'a piedi',
        'Fahrrad': 'bici', 'Bus, Bahn': 'autobus, treno', 'Auto': 'auto', 'Klassensprecherwahl: Stimmen': 'Elezione del rappresentante di classe: voti', 'Stimmen': 'Voti',
        'Höhe einer Sonnenblume, jede Woche gemessen': 'Altezza di un girasole, misurata ogni settimana',
        'Säulendiagramm': 'Diagramma a colonne', 'Liniendiagramm': 'Diagramma a linee', 'Kreisdiagramm': 'Diagramma a torta', 'Diagramm': 'Diagramma', 'Woche': 'Settimana',
        'Anteil': 'Parte', 'Winkel': 'Angolo',
        // schraegbild7
        'Fichtenholz': 'Legno di abete', 'Glas': 'Vetro', 'Stahl': 'Acciaio', 'Schrägbild': 'Assonometria', 'Zweitafelbild': 'Doppia proiezione', 'Wahre Länge': 'Vera lunghezza',
        'Darstellung': 'Rappresentazione', 'Körper': 'Solido', 'Grundkante $a$': 'Spigolo di base $a$', 'Kante $b$': 'Spigolo $b$', 'Höhe $h$': 'Altezza $h$', 'Stoff': 'Materiale',
        'Deckkante $b$': 'Spigolo superiore $b$', 'Breite $b$': 'Larghezza $b$', 'AUFRISS': 'PROSPETTO', 'GRUNDRISS': 'PIANTA',
        // faltnetz7
        'Falten': 'Piegatura', '▶ Zusammenfalten': '▶ Piega', '◀ Auffalten': '◀ Riapri', 'Ein Netz faltet sich zu einem Körper': 'Uno sviluppo si piega e diventa un solido',
        // eckenwinkel7
        'Dreiecke': 'Triangoli', 'Quadrate': 'Quadrati', 'Fünfecke': 'Pentagoni', 'Sechsecke': 'Esagoni', 'Vieleck': 'Poligono', 'Anzahl an der Ecke': 'Numero nel vertice',
        'flach': 'piatto',

        // book it-18 mathe8-it:

        // book it-19 mathe9-it:
        // shared solids and the 3D stage (OS 9 chapter 2.1: faltnetz7, schraegbild7, drittel7; "Körper" is in os9.js)
        'Quader': 'Parallelepipedo', 'Dreiecksprisma': 'Prisma triangolare', 'Sechseckprisma': 'Prisma esagonale', 'Quadratische Pyramide': 'Piramide quadrangolare',
        'Quadr. Pyramide': 'Piramide quadr.', 'Dreieckspyramide': 'Piramide triangolare', 'Pyramidenstumpf': 'Tronco di piramide', 'Tetraeder': 'Tetraedro',
        'Oktaeder': 'Ottaedro', 'Dodekaeder': 'Dodecaedro', 'Ikosaeder': 'Icosaedro', 'Körper in 3D': 'Solido in 3D', 'Ziehen zum Drehen': 'Trascina per ruotare',
        // schraegbild7
        'Fichtenholz': 'Legno di abete', 'Glas': 'Vetro', 'Stahl': 'Acciaio', 'Schrägbild': 'Assonometria', 'Zweitafelbild': 'Proiezioni ortogonali', 'Wahre Länge': 'Vera lunghezza',
        'Darstellung': 'Rappresentazione', 'Grundkante $a$': 'Spigolo di base $a$', 'Kante $b$': 'Spigolo $b$', 'Höhe $h$': 'Altezza $h$', 'Stoff': 'Materiale',
        'Deckkante $b$': 'Spigolo superiore $b$', 'Breite $b$': 'Larghezza $b$', 'AUFRISS': 'PROSPETTO', 'GRUNDRISS': 'PIANTA',
        // faltnetz7
        'Falten': 'Piegatura', '▶ Zusammenfalten': '▶ Ripiega', '◀ Auffalten': '◀ Apri', 'Ein Netz faltet sich zu einem Körper': 'Uno sviluppo si ripiega e forma un solido',
        // drittel7
        'Zusammenschieben': 'Avvicinamento', '▶ Zusammenschieben': '▶ Avvicina', '◀ Auseinander': '◀ Separa',
        'Drei gleiche Pyramiden ergeben einen Würfel': 'Tre piramidi uguali formano un cubo',
        // diagramm7 (OS 9 chapter 4; the aria "<title> als Säulendiagramm" and the sum line are rules)
        'Wie kommst du zur Schule? Umfrage in einer Klasse': 'Come vieni a scuola? Sondaggio in una classe', 'Antworten': 'Risposte', 'zu Fuß': 'a piedi',
        'Fahrrad': 'bicicletta', 'Bus, Bahn': 'autobus, treno', 'Auto': 'auto', 'Klassensprecherwahl: Stimmen': 'Elezione del rappresentante di classe: voti', 'Stimmen': 'Voti',
        'Höhe einer Sonnenblume, jede Woche gemessen': 'Altezza di un girasole, misurata ogni settimana',
        'Säulendiagramm': 'Diagramma a colonne', 'Liniendiagramm': 'Diagramma a linee', 'Kreisdiagramm': 'Diagramma a torta', 'Diagramm': 'Diagramma',
        'Woche': 'Settimana', 'Anteil': 'Percentuale', 'Winkel': 'Angolo',
        'Ein Liniendiagramm passt hier nicht: Die Kategorien haben keine Reihenfolge, und zwischen ihnen gibt es keine Zwischenwerte.':
            'Un diagramma a linee qui non è adatto: le categorie non hanno un ordine e tra di loro non ci sono valori intermedi.',
        'Ein Kreisdiagramm passt hier nicht: Es zeigt Anteile an einem Ganzen. Die Höhen der einzelnen Wochen ergeben zusammen kein sinnvolles Ganzes.':
            'Un diagramma a torta qui non è adatto: mostra le parti di un intero. Le altezze delle singole settimane insieme non formano un intero che abbia senso.',
        'Das Liniendiagramm passt: Es zeigt, wie sich ein Wert im Lauf der Zeit verändert.': 'Il diagramma a linee è adatto: mostra come cambia un valore nel corso del tempo.',
        'weniger': 'meno', 'mehr': 'più',

    },
    phrase: [
        // book it-12 mathegy7-it:
        // kreisgerade7 (the kind of line in bold is a rule)
        ['$r = 3\\,\\text{cm}$ · Abstand der Geraden vom Mittelpunkt: $d \\approx ', '$r = 3\\,\\text{cm}$ · distanza della retta dal centro: $d \\approx '],
        ['$d > r$: Die Gerade hat <b>keinen</b> Punkt mit dem Kreis gemeinsam. Sie ist eine ', '$d > r$: la retta <b>non</b> ha punti in comune con la circonferenza. È una '],
        ['$d = r$: Die Gerade hat <b>genau einen</b> Punkt $B$ mit dem Kreis gemeinsam, den Berührungspunkt. Sie ist eine ',
            '$d = r$: la retta ha <b>esattamente un</b> punto $B$ in comune con la circonferenza, il punto di tangenza. È una '],
        ['. Der Radius $\\overline{MB}$ steht senkrecht auf ihr.', '. Il raggio $\\overline{MB}$ è perpendicolare alla retta.'],
        ['$d < r$: Die Gerade schneidet den Kreis in <b>zwei</b> Punkten $S_1$ und $S_2$. Sie ist eine ', '$d < r$: la retta interseca la circonferenza in <b>due</b> punti, $S_1$ e $S_2$. È una '],
        ['. Die Strecke $\\overline{S_1S_2}$ ist eine <b>Sehne</b>, hier etwa $', '. Il segmento $\\overline{S_1S_2}$ è una <b>corda</b>, qui lunga circa $'],
        ['$ lang.', '$.'], [' Die Sekante geht durch $M$: Die Sehne ist ein Durchmesser.', ' La secante passa per $M$: la corda è un diametro.'],
        // dreieckkreise7
        ['Das Dreieck ist <b>rechtwinklig</b>: $U$ liegt genau in der Mitte der längsten Seite. Das ist der Satz des Thales von der anderen Seite gesehen.',
            'Il triangolo è <b>rettangolo</b>: $U$ sta esattamente nel punto medio del lato più lungo. È il teorema di Talete visto dall’altra parte.'],
        ['Das Dreieck ist <b>stumpfwinklig</b>: $U$ liegt <b>außerhalb</b> des Dreiecks.', 'Il triangolo è <b>ottusangolo</b>: $U$ sta <b>fuori</b> dal triangolo.'],
        ['Das Dreieck ist <b>spitzwinklig</b>: $U$ liegt <b>innerhalb</b> des Dreiecks.', 'Il triangolo è <b>acutangolo</b>: $U$ sta <b>dentro</b> il triangolo.'],
        [' Er ist von allen drei Ecken gleich weit entfernt:', ' È equidistante dai tre vertici:'],
        [' Er hat von allen drei <b>Seiten</b> denselben Abstand:', ' Ha la stessa distanza dai tre <b>lati</b>:'],
        ['Der Inkreis berührt jede Seite. $I$ liegt immer innerhalb des Dreiecks.', 'La circonferenza inscritta tocca ogni lato. $I$ sta sempre dentro il triangolo.'],
        ['Die drei Ecken liegen fast auf einer Geraden. Zieh eine Ecke weiter weg.', 'I tre vertici sono quasi allineati. Allontana un vertice.'],
        // kreiswinkel7
        ['<b>Satz des Thales:</b> Liegt $C$ auf dem Kreis über dem Durchmesser $\\overline{AB}$, so ist der Winkel bei $C$ ein rechter Winkel.',
            '<b>Teorema di Talete:</b> se $C$ sta sulla circonferenza di diametro $\\overline{AB}$, l’angolo in $C$ è un angolo retto.'],
        ['Die Strecke $\\overline{MC}$ teilt das Dreieck in zwei <b>gleichschenklige</b> Dreiecke, denn $\\overline{MA} = \\overline{MB} = \\overline{MC} = r$. ',
            'Il segmento $\\overline{MC}$ divide il triangolo in due triangoli <b>isosceli</b>, perché $\\overline{MA} = \\overline{MB} = \\overline{MC} = r$. '],
        ['Ihre Basiswinkel sind gleich: ', 'I loro angoli alla base sono uguali: '], ['$\\alpha$ bei $A$ und bei $C$', '$\\alpha$ in $A$ e in $C$'], ['$\\beta$ bei $B$ und bei $C$', '$\\beta$ in $B$ e in $C$'],
        ['Winkelsumme: $\\alpha + \\beta + (\\alpha + \\beta) = 180^\\circ$, also $\\gamma = \\alpha + \\beta = 90^\\circ$.', 'Somma degli angoli: $\\alpha + \\beta + (\\alpha + \\beta) = 180^\\circ$, quindi $\\gamma = \\alpha + \\beta = 90^\\circ$.'],
        ['<b>Zentri-Peripheriewinkelsatz:</b> Der Zentriwinkel ist doppelt so groß wie jeder Peripheriewinkel über demselben Bogen. ',
            '<b>Teorema dell’angolo al centro:</b> l’angolo al centro è il doppio di ogni angolo alla circonferenza che insiste sullo stesso arco. '],
        ['<b>Peripheriewinkelsatz:</b> Alle Peripheriewinkel über demselben Bogen sind gleich groß. Zieh $P$ auf seinem Bogen hin und her.',
            '<b>Teorema degli angoli alla circonferenza:</b> tutti gli angoli alla circonferenza che insistono sullo stesso arco sono uguali. Trascina $P$ avanti e indietro sul suo arco.'],
        ['Beweisidee: Der Durchmesser durch $P$ zerlegt die Figur in gleichschenklige Dreiecke mit der Spitze $M$. ',
            'Idea della dimostrazione: il diametro per $P$ scompone la figura in triangoli isosceli con il vertice in $M$. '],
        ['An jedem ist der Außenwinkel bei $M$ doppelt so groß wie ein Basiswinkel. Liegt $M$ nicht zwischen den Schenkeln, braucht der Beweis eine Fallunterscheidung.',
            'In ognuno l’angolo esterno in $M$ è il doppio di un angolo alla base. Se $M$ non sta tra i lati dell’angolo, la dimostrazione deve distinguere più casi.'],
        ['<b>Satz über die Gegenwinkel im Sehnenviereck:</b> In einem Viereck, dessen Ecken auf einem Kreis liegen, ergänzen sich gegenüberliegende Winkel zu $180^\\circ$.',
            '<b>Teorema del quadrilatero inscritto:</b> in un quadrilatero i cui vertici stanno su una circonferenza, gli angoli opposti sono supplementari, cioè la loro somma è $180^\\circ$.'],
        ['Beweisidee: Die vier Radien zerlegen das Viereck in vier gleichschenklige Dreiecke. Jeder Winkel des Vierecks besteht aus zwei Basiswinkeln. ',
            'Idea della dimostrazione: i quattro raggi scompongono il quadrilatero in quattro triangoli isosceli. Ogni angolo del quadrilatero è formato da due angoli alla base. '],
        ['$\\alpha + \\gamma$ enthält jeden der vier verschiedenen Basiswinkel genau einmal, ebenso $\\beta + \\delta$. Beide Summen sind also gleich, zusammen $360^\\circ$, jede $180^\\circ$. ',
            '$\\alpha + \\gamma$ contiene ognuno dei quattro diversi angoli alla base esattamente una volta, e così anche $\\beta + \\delta$. Le due somme sono quindi uguali, insieme fanno $360^\\circ$, ciascuna $180^\\circ$. '],
        ['(So einfach geht es, wenn $M$ im Viereck liegt.)', '(È così semplice quando $M$ sta dentro il quadrilatero.)'],
        // konstruktion7 ("SCHRITT 2 VON 5" is a rule)
        ['Gegeben sind ein Kreis $k$ um $M$ mit $r = 2$ cm und ein Punkt $P$ außerhalb von $k$.', 'Sono dati una circonferenza $k$ di centro $M$ e raggio $r = 2$ cm e un punto $P$ esterno a $k$.'],
        ['Verbinde $M$ und $P$.', 'Congiungi $M$ e $P$.'],
        ['Konstruiere die Mittelsenkrechte von $\\overline{MP}$: zwei Kreisbögen um $M$ und $P$ mit demselben Radius. Sie schneidet $\\overline{MP}$ im Mittelpunkt $H$.',
            'Costruisci l’asse di $\\overline{MP}$: due archi di centro $M$ e $P$ con lo stesso raggio. L’asse interseca $\\overline{MP}$ nel punto medio $H$.'],
        ['Zeichne den Kreis um $H$ durch $M$ und $P$, den Thaleskreis über $\\overline{MP}$.', 'Disegna la circonferenza di centro $H$ passante per $M$ e $P$: la circonferenza di Talete di diametro $\\overline{MP}$.'],
        ['Er schneidet $k$ in $B_1$ und $B_2$. Nach dem Satz des Thales sind die Winkel $\\angle MB_1P$ und $\\angle MB_2P$ rechte Winkel.',
            'Interseca $k$ in $B_1$ e $B_2$. Per il teorema di Talete gli angoli $\\angle MB_1P$ e $\\angle MB_2P$ sono retti.'],
        ['Die Geraden $PB_1$ und $PB_2$ stehen in $B_1$ und $B_2$ senkrecht auf dem Radius: Das sind die beiden Tangenten von $P$ an $k$.',
            'Le rette $PB_1$ e $PB_2$ sono perpendicolari al raggio in $B_1$ e $B_2$: sono le due tangenti da $P$ a $k$.'],
        ['Fertige eine Planfigur an und markiere, was gegeben ist: $c = 6$ cm, $\\alpha$ und $\\beta$. Das ist der Fall WSW.',
            'Fai una figura di analisi e segna i dati: $c = 6$ cm, $\\alpha$ e $\\beta$. È il caso ALA.'],
        ['Zeichne die Strecke $\\overline{AB}$ mit $c = 6$ cm.', 'Disegna il segmento $\\overline{AB}$ con $c = 6$ cm.'],
        ['Trage in $A$ den Winkel $\\alpha$ an.', 'Riporta in $A$ l’angolo $\\alpha$.'], ['Trage in $B$ den Winkel $\\beta$ an.', 'Riporta in $B$ l’angolo $\\beta$.'],
        ['Die freien Schenkel schneiden sich im Punkt $C$.', 'I lati liberi dei due angoli si intersecano nel punto $C$.'],
        ['Zeichne das Dreieck $ABC$. Probe: Miss $\\gamma$ und vergleiche mit $180^\\circ - \\alpha - \\beta$.', 'Disegna il triangolo $ABC$. Verifica: misura $\\gamma$ e confrontalo con $180^\\circ - \\alpha - \\beta$.'],
        ['Gegeben sind $k_1$ um $M_1$ mit $r_1 = 2$ cm und $k_2$ um $M_2$ mit $r_2 = 1$ cm. Gesucht sind die beiden gemeinsamen äußeren Tangenten.',
            'Sono date $k_1$ di centro $M_1$ e raggio $r_1 = 2$ cm e $k_2$ di centro $M_2$ e raggio $r_2 = 1$ cm. Si cercano le due tangenti comuni esterne.'],
        ['Zeichne den Hilfskreis $h$ um $M_1$ mit dem Radius $r_1 - r_2 = 1$ cm.', 'Disegna la circonferenza ausiliaria $h$ di centro $M_1$ e raggio $r_1 - r_2 = 1$ cm.'],
        ['Konstruiere die Tangenten von $M_2$ an $h$ wie bei „Tangenten von P“: Der Thaleskreis über $\\overline{M_1M_2}$ schneidet $h$ in $T_1$ und $T_2$.',
            'Costruisci le tangenti da $M_2$ a $h$ come in «Tangenti da P»: la circonferenza di Talete di diametro $\\overline{M_1M_2}$ interseca $h$ in $T_1$ e $T_2$.'],
        ['Verlängere $M_1T_1$ und $M_1T_2$ bis zum Kreis $k_1$: die Berührungspunkte $B_1$ und $B_2$.', 'Prolunga $M_1T_1$ e $M_1T_2$ fino alla circonferenza $k_1$: ottieni i punti di tangenza $B_1$ e $B_2$.'],
        ['Verschiebe die Hilfstangenten um $r_2$ nach außen: Die Parallelen durch $B_1$ und $B_2$ sind die gemeinsamen Tangenten. Sie berühren $k_2$ dort, wo der Radius senkrecht auf ihnen steht.',
            'Trasla le tangenti ausiliarie di $r_2$ verso l’esterno: le parallele per $B_1$ e $B_2$ sono le tangenti comuni. Toccano $k_2$ nel punto in cui il raggio è perpendicolare a esse.'],
        ['Die freien Schenkel schneiden sich nicht. Ein solches Dreieck gibt es nicht, denn die Winkelsumme im Dreieck beträgt $180^\\circ$.',
            'I lati liberi non si intersecano. Un triangolo così non esiste, perché la somma degli angoli di un triangolo è $180^\\circ$.'],
        ['Du kannst $P$ verschieben, in jedem Schritt.', 'Puoi spostare $P$ in ogni passo.'], ['Du kannst $M_2$ verschieben, in jedem Schritt.', 'Puoi spostare $M_2$ in ogni passo.'],
        // zahlengerade7
        ['b$, denn $', 'b$, perché $'], ['$ liegt weiter <b>links</b>.', '$ sta più a <b>sinistra</b>.'], ['Betrag: ', 'Valore assoluto: '], [', der Abstand von der Null · ', ', la distanza dallo zero · '],
        ['Gegenzahl: ', 'Opposto: '], [', gespiegelt an der Null', ', simmetrico rispetto allo zero'], ['Abstand von $a$ und $b$: $', 'Distanza tra $a$ e $b$: $'],
        ['Start bei $', 'Parti da $'], ['$, dann $', '$, poi $'], ['nach <b>rechts</b>', 'verso <b>destra</b>'], ['nach <b>links</b>', 'verso <b>sinistra</b>'],
        ['$ gar nicht.', '$: resti fermo.'],
        ['Eine Zahl subtrahieren heißt ihre <b>Gegenzahl addieren</b>. ', 'Sottrarre un numero significa <b>addizionare il suo opposto</b>. '],
        ['Minus mal minus: Wer $', 'Meno per meno: chi sottrae $'], ['$ abzieht, geht nach rechts.', '$ va verso destra.'],
        ['Eine positive Zahl addieren: nach rechts. Eine negative Zahl addieren: nach links.', 'Addizionare un numero positivo: verso destra. Addizionare un numero negativo: verso sinistra.'],
        // zahlbereiche7
        ['eine natürliche Zahl', 'un numero naturale'], [', also natürlich', ', quindi naturale'], ['der Betrag von $-4$ ist $4$', 'il valore assoluto di $-4$ è $4$'],
        ['ganz und negativ', 'intero e negativo'], ['ein Bruch ohne Minuszeichen', 'una frazione senza segno meno'], ['zwischen 2 und 3, nicht ganz', 'tra 2 e 3, non intero'],
        ['negativ und nicht ganz', 'negativo e non intero'],
        ['Die <b>ganzen</b> Zahlen $\\mathbb{Z}$ und die <b>gebrochenen</b> Zahlen $\\mathbb{Q}^+$ überlappen sich. Im Überlapp liegen die <b>natürlichen</b> Zahlen $\\mathbb{N}$. Alles zusammen liegt in den <b>rationalen</b> Zahlen $\\mathbb{Q}$.',
            'I numeri <b>interi</b> $\\mathbb{Z}$ e i numeri <b>frazionari</b> $\\mathbb{Q}^+$ si sovrappongono. Nella parte comune ci sono i numeri <b>naturali</b> $\\mathbb{N}$. Tutto insieme sta nei numeri <b>razionali</b> $\\mathbb{Q}$.'],
        ['<b>Teilmenge:</b> $\\mathbb{N} \\subset \\mathbb{Z}$, $\\mathbb{N} \\subset \\mathbb{Q}^+$, $\\mathbb{Z} \\subset \\mathbb{Q}$ und $\\mathbb{Q}^+ \\subset \\mathbb{Q}$. Jede natürliche Zahl ist auch eine ganze Zahl, aber nicht umgekehrt: $-3 \\in \\mathbb{Z}$, aber $-3 \\notin \\mathbb{N}$.',
            '<b>Sottoinsieme:</b> $\\mathbb{N} \\subset \\mathbb{Z}$, $\\mathbb{N} \\subset \\mathbb{Q}^+$, $\\mathbb{Z} \\subset \\mathbb{Q}$ e $\\mathbb{Q}^+ \\subset \\mathbb{Q}$. Ogni numero naturale è anche un numero intero, ma non viceversa: $-3 \\in \\mathbb{Z}$, ma $-3 \\notin \\mathbb{N}$.'],
        ['<b>Schnittmenge:</b> $\\mathbb{Z} \\cap \\mathbb{Q}^+ = \\mathbb{N}$. Das sind die Zahlen, die in beiden Mengen liegen: ganz <b>und</b> ohne Minuszeichen.',
            '<b>Intersezione:</b> $\\mathbb{Z} \\cap \\mathbb{Q}^+ = \\mathbb{N}$. Sono i numeri che stanno in entrambi gli insiemi: interi <b>e</b> senza segno meno.'],
        ['<b>Vereinigungsmenge:</b> $\\mathbb{Z} \\cup \\mathbb{Q}^+$ enthält alle Zahlen, die in mindestens einer der beiden Mengen liegen. Das ist noch nicht ganz $\\mathbb{Q}$: $-\\tfrac12$ liegt in keiner von beiden.',
            '<b>Unione:</b> $\\mathbb{Z} \\cup \\mathbb{Q}^+$ contiene tutti i numeri che stanno in almeno uno dei due insiemi. Non è ancora tutto $\\mathbb{Q}$: $-\\tfrac12$ non sta in nessuno dei due.'],
        ['<b>Richtig!</b> $', '<b>Giusto!</b> $'], ['Noch nicht. Tipp: ', 'Non ancora. Suggerimento: '],
        ['Hat die Zahl ein Minuszeichen, wenn du sie ausrechnest?', 'Il numero ha il segno meno, quando lo calcoli?'],
        ['Rechne die Zahl zuerst aus. Ist sie ganz?', 'Prima calcola il numero. È intero?'],
        // vorzeichen7 ("Von Zeile zu Zeile … kleiner/größer" is a rule)
        ['Gerader Exponent: positiv. Ungerader Exponent: negativ. Denn je zwei Minuszeichen heben sich auf.', 'Esponente pari: positivo. Esponente dispari: negativo. Perché ogni coppia di segni meno si annulla.'],
        ['Vorsicht: $-2^2 = -(2 \\cdot 2) = -4$, aber $(-2)^2 = 4$. Die Klammer entscheidet.', 'Attenzione: $-2^2 = -(2 \\cdot 2) = -4$, ma $(-2)^2 = 4$. Decide la parentesi.'],
        ['Wie geht das Muster weiter? Überlege, bevor du die nächste Zeile aufdeckst.', 'Come continua lo schema? Pensaci prima di scoprire la riga successiva.'],
        ['. Damit das Muster weitergeht, muss $', '. Perché lo schema continui, deve essere $'], ['$ sein.', '$.'],
        ['Plus mal minus ergibt minus.', 'Più per meno dà meno.'], ['Minus mal minus ergibt plus. Minus mal plus ergibt minus.', 'Meno per meno dà più. Meno per più dà meno.'],
        // umstellen7 (the instruction sentence is a rule: the word order changes)
        ['Probe: ', 'Verifica: '], ['Stahl, $', 'Acciaio, $'], ['Wasser, $', 'Acqua, $'], ['Fertig. Mit Zahlen: ', 'Fatto. Con i numeri: '],
        // prozent7
        [' von 100 Feldern', ' caselle su 100'], ['Hunderterfeld mit ', 'Griglia da cento con '], [' gefärbten Feldern', ' caselle colorate'], [' und Prozentstreifen', ' e striscia delle percentuali'],
        ['Grundwert $G = ', 'Valore di base $G = '], ['$ · Prozentsatz $p\\,\\% = ', '$ · tasso percentuale $p\\,\\% = '], ['Prozentwert ', 'Valore percentuale '],
        ['\\,\\% \\text{ von } ', '\\,\\% \\text{ di } '], ['Die drei Grundaufgaben:', 'I tre problemi fondamentali:'],
        ['vorher ', 'prima '], ['nachher ', 'dopo '], ['zurück ', 'ritorno '],
        ['Steigerung um $', 'Un aumento del $'], ['Senkung um $', 'Una diminuzione del $'],
        ['. Der Faktor ist $', '. Il fattore è $'], ['Neuer Wert: ', 'Nuovo valore: '], ['Zurückrechnen auf den Grundwert: $', 'Ritorno al valore di base: $'],
        [' der alte Wert! Die zweiten $', ' si torna al valore iniziale! Il secondo $'], ['\\,\\%$ beziehen sich auf einen anderen Grundwert.', '\\,\\%$ si riferisce a un altro valore di base.'],
        // diagramm7 (the aria "<title> als Säulendiagramm" is a rule)
        ['Zusammen: ', 'In tutto: '], ['Antworten', 'risposte'], ['Stimmen', 'voti'],
        // the chart titles also stand in bold inside a sentence block, where they are not whole labels
        ['Wie kommst du zur Schule? Umfrage in einer Klasse', 'Come vai a scuola? Sondaggio in una classe'], ['Klassensprecherwahl: Stimmen', 'Elezione del rappresentante di classe: voti'],
        ['Höhe einer Sonnenblume, jede Woche gemessen', 'Altezza di un girasole, misurata ogni settimana'],
        [' = 100 % = 360°. Im Kreisdiagramm gehören zu 1 % genau 3,6°.', ' = 100 % = 360°. Nel diagramma circolare all’1 % corrispondono esattamente 3,6°.'],
        ['Ein Liniendiagramm passt hier nicht: Die Kategorien haben keine Reihenfolge, und zwischen ihnen gibt es keine Zwischenwerte.',
            'Qui un grafico a linee non va bene: le categorie non hanno un ordine e tra di esse non ci sono valori intermedi.'],
        ['Ein Kreisdiagramm passt hier nicht: Es zeigt Anteile an einem Ganzen. Die Höhen der einzelnen Wochen ergeben zusammen kein sinnvolles Ganzes.',
            'Qui un diagramma circolare non va bene: mostra le parti di un tutto. Le altezze delle singole settimane, sommate, non danno un tutto che abbia senso.'],
        ['Das Liniendiagramm passt: Es zeigt, wie sich ein Wert im Lauf der Zeit verändert.', 'Il grafico a linee va bene: mostra come cambia un valore nel corso del tempo.'],
        // schraegbild7 (the aria "Quader im Schrägbild" is a rule)
        [' · Ecken $', ' · vertici $'], ['$ · Kanten $', '$ · spigoli $'], ['$ · Flächen $', '$ · facce $'],
        ['<b>Schrägbild:</b> Kanten, die nach hinten gehen, zeichnest du unter $45^\\circ$ und auf die <b>Hälfte</b> verkürzt. Alle anderen Kanten haben ihre wahre Länge. Verdeckte Kanten sind gestrichelt.',
            '<b>Assonometria cavaliera:</b> gli spigoli che vanno all’indietro li disegni inclinati di $45^\\circ$ e ridotti alla <b>metà</b>. Tutti gli altri spigoli hanno la loro vera lunghezza. Gli spigoli nascosti sono tratteggiati.'],
        ['<b>Aufriss</b> (oben): der Körper von vorn. <b>Grundriss</b> (unten): von oben. Zusammengehörige Punkte liegen auf einer <b>Ordnungslinie</b> senkrecht zur Rissachse $x_{12}$. ',
            '<b>Prospetto</b> (sopra): il solido visto di fronte. <b>Pianta</b> (sotto): visto dall’alto. I punti corrispondenti stanno su una <b>linea di richiamo</b> perpendicolare alla linea di terra $x_{12}$. '],
        ['Bezeichnung: $A\'$ im Grundriss, $A\'\'$ im Aufriss.', 'Notazione: $A\'$ nella pianta, $A\'\'$ nel prospetto.'],
        ['Die Seitenkante ', 'Lo spigolo laterale '], [' liegt schräg im Raum. In beiden Rissen erscheint sie <b>verkürzt</b>. Drehe sie im Grundriss um $S\'$, bis sie parallel zur Rissachse liegt: $B_0\'$. ',
            ' è obliquo nello spazio. In entrambe le proiezioni appare <b>accorciato</b>. Ruotalo nella pianta attorno a $S\'$ finché è parallelo alla linea di terra: $B_0\'$. '],
        ['Die Ordnungslinie führt zu $B_0\'\'$. Die Strecke ', 'La linea di richiamo porta a $B_0\'\'$. Il segmento '], [' zeigt die <b>wahre Länge</b>.', ' mostra la <b>vera lunghezza</b>.'],
        ['Gemessen: $\\overline{SB} \\approx ', 'Misurato: $\\overline{SB} \\approx '],
        ['$h_s$ ist die Höhe einer Seitenfläche, hier gemessen: $h_s \\approx ', '$h_s$ è l’altezza di una faccia laterale, qui misurata: $h_s \\approx '],
        ['$V = V_{\\text{groß}} - V_{\\text{klein}}$: Ergänze den Stumpf zur ganzen Pyramide (Höhe $', '$V = V_{\\text{grande}} - V_{\\text{piccola}}$: completa il tronco fino alla piramide intera (altezza $'],
        ['$ cm) und ziehe die kleine Spitze ab.', '$ cm) e togli la piccola piramide in cima.'],
        ['Die vier Seitenflächen sind Trapeze mit der Höhe $h_s \\approx ', 'Le quattro facce laterali sono trapezi di altezza $h_s \\approx '],
        ['Masse aus ', 'Massa in '], ['Fichtenholz', 'legno di abete'], ['Glas', 'vetro'], ['Stahl', 'acciaio'],
        // faltnetz7 (Euler: the Italian letters v, s, f - vertici, spigoli, facce; the formula is a rule)
        ['Dreiecke', 'triangoli'], ['Dreieck', 'triangolo'], ['Vierecke', 'quadrilateri'], ['Viereck', 'quadrilatero'], ['Fünfecke', 'pentagoni'], ['Fünfeck', 'pentagono'],
        ['Sechsecke', 'esagoni'], ['Sechseck', 'esagono'],
        ['Ecken $e = ', 'Vertici $v = '], ['$ · Kanten $k = ', '$ · spigoli $s = '], ['$ · Flächen $f = ', '$ · facce $f = '],
        ['Alle Flächen sind gleiche regelmäßige ', 'Tutte le facce sono '], [', an jeder Ecke stoßen ', ' regolari uguali; in ogni vertice se ne incontrano '], [' zusammen.', '.'],
        // drittel7
        ['Der Würfel hat die Kantenlänge $a$. Alle drei Pyramiden haben ihre Spitze in derselben Würfelecke. Jede hat ein Quadrat mit $G = a^2$ als Grundfläche und die Höhe $h = a$.',
            'Il cubo ha lo spigolo lungo $a$. Le tre piramidi hanno il vertice nello stesso vertice del cubo. Ognuna ha come base un quadrato con $G = a^2$ e l’altezza $h = a$.'],
        ['Drei gleiche Pyramiden füllen den Würfel: $3 \\cdot V_{\\text{Pyramide}} = a^3$, also ', 'Tre piramidi uguali riempiono il cubo: $3 \\cdot V_{\\text{piramide}} = a^3$, quindi '],
        ['$V_{\\text{Pyramide}} = \\tfrac13 \\cdot a^2 \\cdot a = \\tfrac13 \\cdot G \\cdot h$', '$V_{\\text{piramide}} = \\tfrac13 \\cdot a^2 \\cdot a = \\tfrac13 \\cdot G \\cdot h$'],
        // eckenwinkel7 ("So ist das <b>Ikosaeder</b> gebaut." and the aria are rules)
        ['Lücke ', 'spazio vuoto '], ['Jeder Innenwinkel: $', 'Ogni angolo interno: $'], ['^\\circ$ · an der Ecke: $', '^\\circ$ · nel vertice: $'],
        ['Weniger als $360^\\circ$: Klappt man die Lücke zu, entsteht eine räumliche Ecke. ', 'Meno di $360^\\circ$: se si chiude lo spazio vuoto, nasce un vertice nello spazio. '],
        ['Genau $360^\\circ$: Die Vielecke liegen flach in der Ebene, ein Parkett. Eine Ecke eines Körpers entsteht nicht.',
            'Esattamente $360^\\circ$: i poligoni restano piatti nel piano, come una pavimentazione. Non nasce il vertice di un solido.'],
        ['Mehr als $360^\\circ$: Die Vielecke überlappen sich. Daraus lässt sich keine Ecke falten.', 'Più di $360^\\circ$: i poligoni si sovrappongono. Non si può piegare nessun vertice.'],
        ['Spalten: wie viele Vielecke an einer Ecke. Genau fünf Felder haben ein Häkchen: Es gibt genau fünf platonische Körper.',
            'Colonne: quanti poligoni in un vertice. Esattamente cinque caselle hanno la spunta: esistono esattamente cinque solidi platonici.'],

        // book it-17 mathe7-it:
        // zahlengerade7
        [', denn ', ', perché '], [' liegt weiter <b>links</b>.', ' sta più a <b>sinistra</b>.'], ['Betrag: ', 'Valore assoluto: '], [', der Abstand von der Null · ', ', la distanza dallo zero · '],
        ['Gegenzahl: ', 'Opposto: '], [', gespiegelt an der Null', ', simmetrico rispetto allo zero'], ['Abstand von $a$ und $b$: $', 'Distanza tra $a$ e $b$: $'],
        ['Start bei $', 'Si parte da $'], ['$, dann $', '$, poi $'], ['nach <b>rechts</b>', 'verso <b>destra</b>'], ['nach <b>links</b>', 'verso <b>sinistra</b>'],
        ['$ gar nicht.', '$: non ci si muove.'],
        ['Eine Zahl subtrahieren heißt ihre <b>Gegenzahl addieren</b>. ', 'Sottrarre un numero significa <b>addizionare il suo opposto</b>. '],
        ['Minus mal minus: Wer $', 'Meno per meno: chi sottrae $'], ['$ abzieht, geht nach rechts.', '$ va verso destra.'],
        ['Eine positive Zahl addieren: nach rechts. Eine negative Zahl addieren: nach links.', 'Addizionare un numero positivo: verso destra. Addizionare un numero negativo: verso sinistra.'],
        // zahlbereiche7
        ['eine natürliche Zahl', 'un numero naturale'], [', also natürlich', ', quindi naturale'], ['der Betrag von $-4$ ist $4$', 'il valore assoluto di $-4$ è $4$'],
        ['ganz und negativ', 'intero e negativo'], ['ein Bruch ohne Minuszeichen', 'una frazione senza segno meno'], ['zwischen 2 und 3, nicht ganz', 'tra 2 e 3, non intero'],
        ['negativ und nicht ganz', 'negativo e non intero'],
        ['Die <b>ganzen</b> Zahlen $\\mathbb{Z}$ und die <b>gebrochenen</b> Zahlen $\\mathbb{Q}^+$ überlappen sich. Im Überlapp liegen die <b>natürlichen</b> Zahlen $\\mathbb{N}$. Alles zusammen liegt in den <b>rationalen</b> Zahlen $\\mathbb{Q}$.',
            'I numeri <b>interi</b> $\\mathbb{Z}$ e i numeri <b>razionali assoluti</b> $\\mathbb{Q}^+$ si sovrappongono. Nella parte comune ci sono i numeri <b>naturali</b> $\\mathbb{N}$. Tutto insieme sta nei numeri <b>razionali</b> $\\mathbb{Q}$.'],
        ['<b>Teilmenge:</b> $\\mathbb{N} \\subset \\mathbb{Z}$, $\\mathbb{N} \\subset \\mathbb{Q}^+$, $\\mathbb{Z} \\subset \\mathbb{Q}$ und $\\mathbb{Q}^+ \\subset \\mathbb{Q}$. Jede natürliche Zahl ist auch eine ganze Zahl, aber nicht umgekehrt: $-3 \\in \\mathbb{Z}$, aber $-3 \\notin \\mathbb{N}$.',
            '<b>Sottoinsieme:</b> $\\mathbb{N} \\subset \\mathbb{Z}$, $\\mathbb{N} \\subset \\mathbb{Q}^+$, $\\mathbb{Z} \\subset \\mathbb{Q}$ e $\\mathbb{Q}^+ \\subset \\mathbb{Q}$. Ogni numero naturale è anche un numero intero, ma non viceversa: $-3 \\in \\mathbb{Z}$, ma $-3 \\notin \\mathbb{N}$.'],
        ['<b>Schnittmenge:</b> $\\mathbb{Z} \\cap \\mathbb{Q}^+ = \\mathbb{N}$. Das sind die Zahlen, die in beiden Mengen liegen: ganz <b>und</b> ohne Minuszeichen.',
            '<b>Intersezione:</b> $\\mathbb{Z} \\cap \\mathbb{Q}^+ = \\mathbb{N}$. Sono i numeri che stanno in entrambi gli insiemi: interi <b>e</b> senza segno meno.'],
        ['<b>Vereinigungsmenge:</b> $\\mathbb{Z} \\cup \\mathbb{Q}^+$ enthält alle Zahlen, die in mindestens einer der beiden Mengen liegen. Das ist noch nicht ganz $\\mathbb{Q}$: $-\\tfrac12$ liegt in keiner von beiden.',
            '<b>Unione:</b> $\\mathbb{Z} \\cup \\mathbb{Q}^+$ contiene tutti i numeri che stanno in almeno uno dei due insiemi. Non è ancora tutto $\\mathbb{Q}$: $-\\tfrac12$ non sta in nessuno dei due.'],
        ['<b>Richtig!</b> $', '<b>Giusto!</b> $'], ['Noch nicht. Tipp: ', 'Non ancora. Suggerimento: '],
        ['Hat die Zahl ein Minuszeichen, wenn du sie ausrechnest?', 'Il numero ha un segno meno, quando lo calcoli?'],
        ['Rechne die Zahl zuerst aus. Ist sie ganz?', 'Prima calcola il numero. È intero?'],
        // vorzeichen7 ("Von Zeile zu Zeile … kleiner/größer" is a rule)
        ['Gerader Exponent: positiv. Ungerader Exponent: negativ. Denn je zwei Minuszeichen heben sich auf.', 'Esponente pari: positivo. Esponente dispari: negativo. Perché ogni coppia di segni meno si annulla.'],
        ['Vorsicht: $-2^2 = -(2 \\cdot 2) = -4$, aber $(-2)^2 = 4$. Die Klammer entscheidet.', 'Attenzione: $-2^2 = -(2 \\cdot 2) = -4$, ma $(-2)^2 = 4$. Decide la parentesi.'],
        ['Wie geht das Muster weiter? Überlege, bevor du die nächste Zeile aufdeckst.', 'Come continua lo schema? Pensaci prima di scoprire la riga successiva.'],
        ['. Damit das Muster weitergeht, muss $', '. Perché lo schema continui, deve essere $'], ['$ sein.', '$.'],
        ['Plus mal minus ergibt minus.', 'Più per meno dà meno.'], ['Minus mal minus ergibt plus. Minus mal plus ergibt minus.', 'Meno per meno dà più. Meno per più dà meno.'],
        // umstellen7 (the instruction sentence is a rule: the word order changes)
        ['Probe: ', 'Verifica: '], ['Stahl, $', 'acciaio, $'], ['Wasser, $', 'acqua, $'], ['Fertig. Mit Zahlen: ', 'Fatto. Con i numeri: '],
        // prozent7
        [' von 100 Feldern', ' di 100 caselle'], ['Hunderterfeld mit ', 'Griglia da cento con '], [' gefärbten Feldern', ' caselle colorate'], [' und Prozentstreifen', ' e striscia delle percentuali'],
        ['Grundwert $G = ', 'Valore di base $G = '], ['$ · Prozentsatz $p\\,\\% = ', '$ · tasso percentuale $p\\,\\% = '], ['Prozentwert ', 'Valore percentuale '],
        ['\\,\\% \\text{ von } ', '\\,\\% \\text{ di } '], ['Die drei Grundaufgaben:', 'I tre problemi fondamentali:'],
        ['vorher ', 'prima '], ['nachher ', 'dopo '], ['zurück ', 'ritorno '],
        ['Steigerung um $', 'Un aumento del $'], ['Senkung um $', 'Una riduzione del $'],
        ['. Der Faktor ist $', '. Il fattore è $'], ['Neuer Wert: ', 'Nuovo valore: '], ['Zurückrechnen auf den Grundwert: $', 'Ritorno al valore di base: $'],
        [' der alte Wert! Die zweiten $', ' è il vecchio valore! Il secondo $'], ['\\,\\%$ beziehen sich auf einen anderen Grundwert.', '\\,\\%$ si riferisce a un altro valore di base.'],
        // diagramm7 (the aria "<title> als Säulendiagramm" is a rule)
        ['Zusammen: ', 'In tutto: '], ['Antworten', 'risposte'], ['Stimmen', 'voti'],
        // the chart titles also stand in bold inside a sentence block, where they are not whole labels
        ['Wie kommst du zur Schule? Umfrage in einer Klasse', 'Come vieni a scuola? Sondaggio in una classe'], ['Klassensprecherwahl: Stimmen', 'Elezione del rappresentante di classe: voti'],
        ['Höhe einer Sonnenblume, jede Woche gemessen', 'Altezza di un girasole, misurata ogni settimana'],
        [' = 100 % = 360°. Im Kreisdiagramm gehören zu 1 % genau 3,6°.', ' = 100 % = 360°. Nel diagramma a torta all’1 % corrispondono esattamente 3,6°.'],
        ['Ein Liniendiagramm passt hier nicht: Die Kategorien haben keine Reihenfolge, und zwischen ihnen gibt es keine Zwischenwerte.',
            'Qui un diagramma a linee non va bene: le categorie non hanno un ordine e tra di esse non ci sono valori intermedi.'],
        ['Ein Kreisdiagramm passt hier nicht: Es zeigt Anteile an einem Ganzen. Die Höhen der einzelnen Wochen ergeben zusammen kein sinnvolles Ganzes.',
            'Qui un diagramma a torta non va bene: mostra le parti di un tutto. Le altezze delle singole settimane messe insieme non formano un tutto sensato.'],
        ['Das Liniendiagramm passt: Es zeigt, wie sich ein Wert im Lauf der Zeit verändert.', 'Il diagramma a linee va bene: mostra come cambia un valore nel corso del tempo.'],
        // schraegbild7 (the aria "Quader im Schrägbild" is a rule)
        [' · Ecken $', ' · vertici $'], ['$ · Kanten $', '$ · spigoli $'], ['$ · Flächen $', '$ · facce $'],
        ['<b>Schrägbild:</b> Kanten, die nach hinten gehen, zeichnest du unter $45^\\circ$ und auf die <b>Hälfte</b> verkürzt. Alle anderen Kanten haben ihre wahre Länge. Verdeckte Kanten sind gestrichelt.',
            '<b>Assonometria cavaliera:</b> gli spigoli che vanno all’indietro li disegni inclinati di $45^\\circ$ e ridotti alla <b>metà</b>. Tutti gli altri spigoli hanno la loro lunghezza reale. Gli spigoli nascosti sono tratteggiati.'],
        ['<b>Aufriss</b> (oben): der Körper von vorn. <b>Grundriss</b> (unten): von oben. Zusammengehörige Punkte liegen auf einer <b>Ordnungslinie</b> senkrecht zur Rissachse $x_{12}$. ',
            '<b>Prospetto</b> (sopra): il solido visto di fronte. <b>Pianta</b> (sotto): visto dall’alto. I punti corrispondenti stanno su una <b>linea di richiamo</b> perpendicolare alla linea di terra $x_{12}$. '],
        ['Bezeichnung: $A\'$ im Grundriss, $A\'\'$ im Aufriss.', 'Notazione: $A\'$ nella pianta, $A\'\'$ nel prospetto.'],
        ['Die Seitenkante ', 'Lo spigolo laterale '], [' liegt schräg im Raum. In beiden Rissen erscheint sie <b>verkürzt</b>. Drehe sie im Grundriss um $S\'$, bis sie parallel zur Rissachse liegt: $B_0\'$. ',
            ' è inclinato nello spazio. In entrambe le proiezioni appare <b>accorciato</b>. Ruotalo nella pianta attorno a $S\'$ finché è parallelo alla linea di terra: $B_0\'$. '],
        ['Die Ordnungslinie führt zu $B_0\'\'$. Die Strecke ', 'La linea di richiamo porta a $B_0\'\'$. Il segmento '], [' zeigt die <b>wahre Länge</b>.', ' mostra la <b>vera lunghezza</b>.'],
        ['Gemessen: $\\overline{SB} \\approx ', 'Misurato: $\\overline{SB} \\approx '],
        ['$h_s$ ist die Höhe einer Seitenfläche, hier gemessen: $h_s \\approx ', '$h_s$ è l’altezza di una faccia laterale, qui misurata: $h_s \\approx '],
        ['$V = V_{\\text{groß}} - V_{\\text{klein}}$: Ergänze den Stumpf zur ganzen Pyramide (Höhe $', '$V = V_{\\text{grande}} - V_{\\text{piccola}}$: completa il tronco fino alla piramide intera (altezza $'],
        ['$ cm) und ziehe die kleine Spitze ab.', '$ cm) e togli la piccola punta.'],
        ['Die vier Seitenflächen sind Trapeze mit der Höhe $h_s \\approx ', 'Le quattro facce laterali sono trapezi di altezza $h_s \\approx '],
        ['Masse aus ', 'Massa se di '], ['Fichtenholz', 'legno di abete'], ['Glas', 'vetro'], ['Stahl', 'acciaio'],
        // faltnetz7
        ['Dreiecke', 'triangoli'], ['Dreieck', 'triangolo'], ['Vierecke', 'quadrilateri'], ['Viereck', 'quadrilatero'], ['Fünfecke', 'pentagoni'], ['Fünfeck', 'pentagono'],
        ['Sechsecke', 'esagoni'], ['Sechseck', 'esagono'],
        ['Ecken $e = ', 'Vertici $e = '], ['$ · Kanten $k = ', '$ · spigoli $k = '], ['$ · Flächen $f = ', '$ · facce $f = '],
        ['Alle Flächen sind gleiche regelmäßige ', 'Tutte le facce sono '], [', an jeder Ecke stoßen ', ' regolari uguali; in ogni vertice si incontrano '], [' zusammen.', '.'],
        // eckenwinkel7 ("So ist das <b>Ikosaeder</b> gebaut." and the aria are rules)
        ['Lücke ', 'spazio vuoto '], ['Jeder Innenwinkel: $', 'Ogni angolo interno: $'], ['^\\circ$ · an der Ecke: $', '^\\circ$ · nel vertice: $'],
        ['Weniger als $360^\\circ$: Klappt man die Lücke zu, entsteht eine räumliche Ecke. ', 'Meno di $360^\\circ$: se si chiude lo spazio vuoto, si forma un vertice nello spazio. '],
        ['Genau $360^\\circ$: Die Vielecke liegen flach in der Ebene, ein Parkett. Eine Ecke eines Körpers entsteht nicht.',
            'Esattamente $360^\\circ$: i poligoni stanno piatti nel piano, come in una tassellazione. Non si forma il vertice di un solido.'],
        ['Mehr als $360^\\circ$: Die Vielecke überlappen sich. Daraus lässt sich keine Ecke falten.', 'Più di $360^\\circ$: i poligoni si sovrappongono. Non se ne può piegare nessun vertice.'],
        ['Spalten: wie viele Vielecke an einer Ecke. Genau fünf Felder haben ein Häkchen: Es gibt genau fünf platonische Körper.',
            'Colonne: quanti poligoni in un vertice. Esattamente cinque caselle hanno il segno di spunta: esistono esattamente cinque solidi platonici.'],

        // book it-18 mathe8-it:

        // book it-19 mathe9-it:
        // schraegbild7
        [' · Ecken $', ' · vertici $'], ['$ · Kanten $', '$ · spigoli $'], ['$ · Flächen $', '$ · facce $'],
        ['<b>Schrägbild:</b> Kanten, die nach hinten gehen, zeichnest du unter $45^\\circ$ und auf die <b>Hälfte</b> verkürzt. Alle anderen Kanten haben ihre wahre Länge. Verdeckte Kanten sind gestrichelt.',
            '<b>Assonometria cavaliera:</b> gli spigoli che vanno verso il fondo li disegni a $45^\\circ$ e ridotti alla <b>metà</b>. Tutti gli altri spigoli hanno la loro vera lunghezza. Gli spigoli nascosti sono tratteggiati.'],
        ['<b>Aufriss</b> (oben): der Körper von vorn. <b>Grundriss</b> (unten): von oben. Zusammengehörige Punkte liegen auf einer <b>Ordnungslinie</b> senkrecht zur Rissachse $x_{12}$. ',
            '<b>Prospetto</b> (sopra): il solido visto di fronte. <b>Pianta</b> (sotto): visto dall’alto. I punti corrispondenti stanno su una <b>linea di richiamo</b> perpendicolare alla linea di terra $x_{12}$. '],
        ['Bezeichnung: $A\'$ im Grundriss, $A\'\'$ im Aufriss.', 'Notazione: $A\'$ nella pianta, $A\'\'$ nel prospetto.'],
        ['Gemessen: $\\overline{SB} \\approx ', 'Misurato: $\\overline{SB} \\approx '],
        ['$h_s$ ist die Höhe einer Seitenfläche, hier gemessen: $h_s \\approx ', '$h_s$ è l’altezza di una faccia laterale (l’apotema), qui misurata: $h_s \\approx '],
        ['$V = V_{\\text{groß}} - V_{\\text{klein}}$: Ergänze den Stumpf zur ganzen Pyramide (Höhe $', '$V = V_{\\text{grande}} - V_{\\text{piccola}}$: completa il tronco fino alla piramide intera (altezza $'],
        ['$ cm) und ziehe die kleine Spitze ab.', '$ cm) e togli la piccola punta.'],
        ['Die vier Seitenflächen sind Trapeze mit der Höhe $h_s \\approx ', 'Le quattro facce laterali sono trapezi con l’altezza $h_s \\approx '],
        // faltnetz7
        ['Ecken $e = ', 'Vertici $e = '], ['$ · Kanten $k = ', '$ · spigoli $k = '], ['$ · Flächen $f = ', '$ · facce $f = '],
        // drittel7
        ['Der Würfel hat die Kantenlänge $a$. Alle drei Pyramiden haben ihre Spitze in derselben Würfelecke. Jede hat ein Quadrat mit $G = a^2$ als Grundfläche und die Höhe $h = a$.',
            'Il cubo ha lo spigolo di lunghezza $a$. Le tre piramidi hanno il vertice nello stesso vertice del cubo. Ognuna ha come base un quadrato con $G = a^2$ e l’altezza $h = a$.'],
        ['Drei gleiche Pyramiden füllen den Würfel: $3 \\cdot V_{\\text{Pyramide}} = a^3$, also ', 'Tre piramidi uguali riempiono il cubo: $3 \\cdot V_{\\text{piramide}} = a^3$, quindi '],
        ['$V_{\\text{Pyramide}} = \\tfrac13 \\cdot a^2 \\cdot a = \\tfrac13 \\cdot G \\cdot h$', '$V_{\\text{piramide}} = \\tfrac13 \\cdot a^2 \\cdot a = \\tfrac13 \\cdot G \\cdot h$'],
        // diagramm7: the chart titles also stand in bold inside a sentence block, where they are not whole labels
        ['<b>Wie kommst du zur Schule? Umfrage in einer Klasse</b>', '<b>Come vieni a scuola? Sondaggio in una classe</b>'],
        ['<b>Klassensprecherwahl: Stimmen</b>', '<b>Elezione del rappresentante di classe: voti</b>'],
        ['<b>Höhe einer Sonnenblume, jede Woche gemessen</b>', '<b>Altezza di un girasole, misurata ogni settimana</b>'],

    ],
    rule: [
        // book it-12 mathegy7-it:
        // konstruktion7: "SCHRITT 2 VON 5"
        [/SCHRITT (\d+) VON (\d+)/g, (m, a, b) => 'PASSO ' + a + ' DI ' + b],
        // kreisgerade7: the kind of line in bold, in the middle of a sentence ("È una <b>retta esterna</b>.")
        [/>(Passante|Tangente|Sekante)<\/b>/g, (m, w) => '>' + { Passante: 'retta esterna', Tangente: 'tangente', Sekante: 'secante' }[w] + '</b>'],
        // dreieckkreise7: "Die drei <span>Mittelsenkrechten</span> schneiden sich …" - assi is masculine, bisettrici feminine
        // (the label inside the span is already a placeholder or still German, so the rule takes whatever stands there)
        [/Die drei (<span class="g-cy">)[^<]*(<\/span>) schneiden sich in einem Punkt \$U\$\./g, (m, a, b) => 'I tre ' + a + 'assi' + b + ' dei lati si intersecano in un punto $U$.'],
        [/Die drei (<span class="g-cy">)[^<]*(<\/span>) schneiden sich in einem Punkt \$I\$\./g, (m, a, b) => 'Le tre ' + a + 'bisettrici' + b + ' degli angoli si intersecano in un punto $I$.'],
        // dreieckkreise7: the heading over "Umkreis | Inkreis" (gy5 and gy6 have "Kreis" as a fraction shape)
        [/^Kreis$/, () => 'Circonferenza'], [/>Kreis</g, () => '>Circonferenza<'],
        // its two buttons, short
        [/^(Umkreis|Inkreis)$/, (m, w) => w === 'Umkreis' ? 'Circoscritta' : 'Inscritta'], [/>(Umkreis|Inkreis)</g, (m, w) => '>' + (w === 'Umkreis' ? 'Circoscritta' : 'Inscritta') + '<'],
        // zahlbereiche7: "Richtig: 3 von 5"
        [/Richtig: (\d+) von (\d+)/g, (m, a, b) => 'Giuste: ' + a + ' su ' + b],
        // vorzeichen7: "Von Zeile zu Zeile wird das Ergebnis um 3 kleiner."
        [/Von Zeile zu Zeile wird das Ergebnis um 3 (kleiner|größer)(?=\.)/g, (m, w) => 'Di riga in riga il risultato ' + (w === 'kleiner' ? 'diminuisce' : 'aumenta') + ' di 3'],
        // umstellen7: the instruction (Italian starts with the variable), then the buttons "nach $b$" under "ricava"
        [/Die Formel \$([^$]+)\$ nach \$([^$]+)\$ umstellen: auf <b>beiden<\/b> Seiten dasselbe tun, bis \$([^$]+)\$ allein steht\./g,
            (m, f, v, w) => 'Ricava $' + v + '$ dalla formula $' + f + '$: fai la stessa cosa in <b>entrambi</b> i membri, finché $' + w + '$ resta da sola.'],
        [/\bnach \$([A-Za-z])\$/g, (m, v) => '$' + v + '$'],
        // prozent7: "Steigerung um $20\,\%$ heißt Steigerung <b>auf</b> $120\,\%$", "Danach um $20\,\%$ senken"
        [/\$ heißt (?:Steigerung|Senkung) <b>auf<\/b> \$/g, () => '$ significa passare <b>al</b> $'],
        [/Danach um \$(\d+)\\,\\%\$ (senken|erhöhen)/g, (m, p, v) => 'Poi ' + (v === 'senken' ? 'diminuisci' : 'aumenta') + ' del $' + p + '\\,\\%$'],
        // diagramm7: aria "<title> als Säulendiagramm"
        [/^(.+) als (Säulendiagramm|Liniendiagramm|Kreisdiagramm)$/, (m, t, c) => ({
            'Wie kommst du zur Schule? Umfrage in einer Klasse': 'Come vai a scuola? Sondaggio in una classe',
            'Klassensprecherwahl: Stimmen': 'Elezione del rappresentante di classe: voti',
            'Höhe einer Sonnenblume, jede Woche gemessen': 'Altezza di un girasole, misurata ogni settimana'
        }[t] || t) + ' come ' + { Säulendiagramm: 'diagramma a colonne', Liniendiagramm: 'grafico a linee', Kreisdiagramm: 'diagramma circolare' }[c]],
        // schraegbild7: aria "Quader im Schrägbild"
        [/^(.+) im (Schrägbild|Zweitafelbild)$/, (m, b, v) => ({
            'Würfel': 'Cubo', 'Quader': 'Parallelepipedo', 'Dreiecksprisma': 'Prisma triangolare', 'Sechseckprisma': 'Prisma esagonale', 'Quadratische Pyramide': 'Piramide quadrangolare',
            'Dreieckspyramide': 'Piramide triangolare', 'Pyramidenstumpf': 'Tronco di piramide'
        }[b] || b) + (v === 'Schrägbild' ? ' in assonometria cavaliera' : ' in proiezioni ortogonali')],
        // faltnetz7: Euler's formula with the Italian letters
        [/\$e - k \+ f = /g, () => '$v - s + f = '],
        // eckenwinkel7: "So ist das <b>Ikosaeder</b> gebaut." (before the cube rule) and the aria "4 regelmäßige 3-Ecke an einer Ecke"
        [/So ist (?:der|das) <b>([^<]+)<\/b> gebaut\./g, (m, s) => 'Così è fatto il <b>' +
            ({ 'Tetraeder': 'tetraedro', 'Würfel': 'cubo', 'Oktaeder': 'ottaedro', 'Dodekaeder': 'dodecaedro', 'Ikosaeder': 'icosaedro' }[s] || s) + '</b>.'],
        [/^(\d+) regelmäßige (\d+)-Ecke an einer Ecke$/, (m, n, k) => n + ' poligoni regolari di ' + k + ' lati in un vertice'],
        // "Würfel" is a die in the stochastics dictionary: here it is the cube, as a whole label and in bold
        [/^Würfel$/, () => 'Cubo'], [/>Würfel</g, () => '>Cubo<'],

        // book it-17 mathe7-it:
        // zahlbereiche7: "Richtig: 3 von 5"
        [/Richtig: (\d+) von (\d+)/g, (m, a, b) => 'Giuste: ' + a + ' su ' + b],
        // vorzeichen7: "Von Zeile zu Zeile wird das Ergebnis um 3 kleiner."
        [/Von Zeile zu Zeile wird das Ergebnis um 3 (kleiner|größer)(?=\.)/g, (m, w) => 'Di riga in riga il risultato ' + (w === 'kleiner' ? 'diminuisce' : 'aumenta') + ' di 3'],
        // umstellen7: the instruction (Italian starts with the variable), then the buttons "nach $b$" under "ricava"
        [/Die Formel \$([^$]+)\$ nach \$([^$]+)\$ umstellen: auf <b>beiden<\/b> Seiten dasselbe tun, bis \$([^$]+)\$ allein steht\./g,
            (m, f, v, w) => 'Ricava $' + v + '$ dalla formula $' + f + '$: fai la stessa cosa su <b>entrambi</b> i lati finché $' + w + '$ resta da sola.'],
        [/\bnach \$([A-Za-z])\$/g, (m, v) => '$' + v + '$'],
        // prozent7: "Steigerung um $20\,\%$ heißt Steigerung <b>auf</b> $120\,\%$", "Danach um $20\,\%$ senken"
        [/\$ heißt (?:Steigerung|Senkung) <b>auf<\/b> \$/g, () => '$ significa passare <b>al</b> $'],
        [/Danach um \$(\d+)\\,\\%\$ (senken|erhöhen)/g, (m, p, v) => 'Poi ' + (v === 'senken' ? 'ridurre' : 'aumentare') + ' del $' + p + '\\,\\%$'],
        // diagramm7: aria "<title> als Säulendiagramm"
        [/^(.+) als (Säulendiagramm|Liniendiagramm|Kreisdiagramm)$/, (m, t, c) => ({
            'Wie kommst du zur Schule? Umfrage in einer Klasse': 'Come vieni a scuola? Sondaggio in una classe',
            'Klassensprecherwahl: Stimmen': 'Elezione del rappresentante di classe: voti',
            'Höhe einer Sonnenblume, jede Woche gemessen': 'Altezza di un girasole, misurata ogni settimana'
        }[t] || t) + ' come ' + { Säulendiagramm: 'diagramma a colonne', Liniendiagramm: 'diagramma a linee', Kreisdiagramm: 'diagramma a torta' }[c]],
        // schraegbild7: aria "Quader im Schrägbild"
        [/^(.+) im (Schrägbild|Zweitafelbild)$/, (m, b, v) => ({
            'Würfel': 'Cubo', 'Quader': 'Parallelepipedo', 'Dreiecksprisma': 'Prisma triangolare', 'Sechseckprisma': 'Prisma esagonale', 'Quadratische Pyramide': 'Piramide quadrangolare',
            'Dreieckspyramide': 'Piramide triangolare', 'Pyramidenstumpf': 'Tronco di piramide'
        }[b] || b) + (v === 'Schrägbild' ? ' in assonometria cavaliera' : ' in doppia proiezione')],
        // eckenwinkel7: "So ist das <b>Ikosaeder</b> gebaut." and the aria "4 regelmäßige 3-Ecke an einer Ecke"
        [/So ist (?:der|das) <b>([^<]+)<\/b> gebaut\./g, (m, s) => 'Così è fatto ' +
            ({ 'Tetraeder': 'il <b>tetraedro</b>', 'Würfel': 'il <b>cubo</b>', 'Oktaeder': 'l’<b>ottaedro</b>', 'Dodekaeder': 'il <b>dodecaedro</b>', 'Ikosaeder': 'l’<b>icosaedro</b>' }[s] || '<b>' + s + '</b>') + '.'],
        [/^(\d+) regelmäßige (\d+)-Ecke an einer Ecke$/, (m, n, k) => n + ' poligoni regolari di ' + k + ' lati in un vertice'],
        // "Würfel" is a die (word in gy6): the cube button in the lists of solids (faltnetz7, schraegbild7), also when the word pass came first
        [/(data-v="wuerfel">)(?:Würfel|Dado|\u0003\d+\u0004)(<\/button>)(?=[\s\S]*data-v="(?:quader|oktaeder)")/g, '$1Cubo$2'],
        // faltnetz7: the cube as the bold name before the list of faces ("<b>Würfel</b>: 6 Vierecke")
        [/(<p style="margin:0"><b>)Würfel(<\/b>: \d+ )/g, '$1Cubo$2'],

        // book it-18 mathe8-it:

        // book it-19 mathe9-it:
        // schraegbild7: the sentences around the coloured spans (tags cut the phrases), the material of the mass, the aria "Quader im Schrägbild"
        [/Die Seitenkante (<span class="g-cy">[^<]*<\/span>) liegt schräg im Raum\. In beiden Rissen erscheint sie <b>verkürzt<\/b>\. Drehe sie im Grundriss um \$S'\$, bis sie parallel zur Rissachse liegt: \$B_0'\$\. /g,
            (m, s) => 'Lo spigolo laterale ' + s + ' è obliquo nello spazio. In entrambe le proiezioni appare <b>accorciato</b>. Ruotalo nella pianta attorno a $S\'$ finché è parallelo alla linea di terra: $B_0\'$. '],
        [/Die Ordnungslinie führt zu \$B_0''\$\. Die Strecke (<span class="g-lam">[^<]*<\/span>) zeigt die <b>wahre Länge<\/b>\./g,
            (m, s) => 'La linea di richiamo porta a $B_0\'\'$. Il segmento ' + s + ' mostra la <b>vera lunghezza</b>.'],
        [/Masse aus (Fichtenholz|Glas|Stahl) \(/g, (m, s) => 'Massa in ' + { 'Fichtenholz': 'legno di abete', 'Glas': 'vetro', 'Stahl': 'acciaio' }[s] + ' ('],
        [/^(.+) im (Schrägbild|Zweitafelbild)$/, (m, b, v) => ({
            'Würfel': 'Cubo', 'Quader': 'Parallelepipedo', 'Dreiecksprisma': 'Prisma triangolare', 'Sechseckprisma': 'Prisma esagonale', 'Quadratische Pyramide': 'Piramide quadrangolare',
            'Dreieckspyramide': 'Piramide triangolare', 'Pyramidenstumpf': 'Tronco di piramide'
        }[b] || b) + (v === 'Schrägbild' ? ' in assonometria cavaliera' : ' in proiezioni ortogonali')],
        // faltnetz7: "1 Viereck, 4 Dreiecke" and the sentence about the regular solids
        [/(\d+) (Dreiecke?|Vierecke?|Fünfecke?|Sechsecke?)(?=, |<\/p>)/g, (m, n, w) => n + ' ' + ({ 'Dreieck': 'triangolo', 'Dreiecke': 'triangoli', 'Viereck': 'quadrilatero',
            'Vierecke': 'quadrilateri', 'Fünfeck': 'pentagono', 'Fünfecke': 'pentagoni', 'Sechseck': 'esagono', 'Sechsecke': 'esagoni' }[w])],
        [/Alle Flächen sind gleiche regelmäßige (Dreiecke|Vierecke|Fünfecke|Sechsecke), an jeder Ecke stoßen (\d+) zusammen\./g, (m, w, n) => 'Tutte le facce sono ' +
            { 'Dreiecke': 'triangoli', 'Vierecke': 'quadrilateri', 'Fünfecke': 'pentagoni', 'Sechsecke': 'esagoni' }[w] + ' regolari uguali; in ogni vertice se ne incontrano ' + n + '.'],
        // "Würfel" is a die in the stochastics dictionary: here it is the cube, as a whole label and in bold
        [/^Würfel$/, () => 'Cubo'], [/>Würfel</g, () => '>Cubo<'],
        // diagramm7: "Zusammen: 28 Antworten = 100 % = 360°. …" and the aria "<title> als Säulendiagramm"
        [/Zusammen: (\d+) (Antworten|Stimmen) = 100 % = 360°\. Im Kreisdiagramm gehören zu 1 % genau 3,6°\./g,
            (m, n, u) => 'In totale: ' + n + (u === 'Antworten' ? ' risposte' : ' voti') + ' = 100 % = 360°. Nel diagramma a torta all’1 % corrispondono esattamente 3,6°.'],
        [/^(.+) als (Säulendiagramm|Liniendiagramm|Kreisdiagramm)$/, (m, t, c) => ({ Säulendiagramm: 'Diagramma a colonne', Liniendiagramm: 'Diagramma a linee', Kreisdiagramm: 'Diagramma a torta' }[c]) + ': ' + ({
            'Wie kommst du zur Schule? Umfrage in einer Klasse': 'come vieni a scuola? Sondaggio in una classe',
            'Klassensprecherwahl: Stimmen': 'elezione del rappresentante di classe, voti',
            'Höhe einer Sonnenblume, jede Woche gemessen': 'altezza di un girasole, misurata ogni settimana'
        }[t] || t)],

    ]
});
