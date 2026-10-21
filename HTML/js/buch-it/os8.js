/* js/buch-it/os8.js — Italian for the widgets of js/buch-os8.js.
 * Loaded by the Italian editions right after js/buch-os8.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 3 (20.10.2026): eleven books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/os8.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('os8', {
    word: {
        // book it-18 mathe8-it:
        // titelbildos8
        'Titelbild: zwei sich schneidende Geraden, ein Kreiszylinder im Schrägbild, eine zentrische Streckung, ein Baumdiagramm und ein Kettenblatt':
            'Copertina: due rette che si intersecano, un cilindro in assonometria, un’omotetia, un diagramma ad albero e una corona di bicicletta',
        // kreisflaecheos8
        'Anzahl der Stücke $n$': 'Numero di spicchi $n$',
        // zylinderos8
        'Kreiszylinder': 'Cilindro', 'Hohlzylinder': 'Cilindro cavo', 'Körper': 'Solido', 'Schrägbild': 'Assonometria', 'Netz': 'Sviluppo',
        'Darstellung': 'Rappresentazione', 'Material': 'Materiale', 'Holz': 'Legno', 'Aluminium': 'Alluminio', 'Stahl': 'Acciaio',
        'Radius $r$': 'Raggio $r$', 'Innenradius $r_i$': 'Raggio interno $r_i$', 'Höhe $h$': 'Altezza $h$', 'Mantel': 'Superficie laterale',
        'Grundfläche (Kreisring)': 'Base (corona circolare)', 'Außenmantel': 'Superficie laterale esterna', 'Innenmantel': 'Superficie laterale interna',
        'Oberfläche': 'Superficie totale', 'Volumen': 'Volume', 'Grundfläche': 'Area di base', 'Größe': 'Grandezza', 'Formel und Wert': 'Formula e valore',
        'Der Mantel ist ein Rechteck: so breit wie der Umfang des Grundkreises, so hoch wie der Zylinder.':
            'La superficie laterale è un rettangolo: largo quanto la circonferenza di base, alto quanto il cilindro.',
        'Im Schrägbild wird der Grundkreis zur flachen Ellipse. Verdeckte Linien sind gestrichelt.':
            'In assonometria il cerchio di base diventa un’ellisse schiacciata. Le linee nascoste sono tratteggiate.',
        // stromos8
        'Verbrauch im Jahr': 'Consumo annuo', 'Arbeitspreis in ct/kWh': 'Prezzo dell’energia in ct/kWh', 'Grundpreis im Monat': 'Quota fissa al mese',
        'Abschlag im Monat': 'Acconto mensile', 'Kosten': 'Costi', 'gezahlt': 'pagato',
        'Balken: Jahreskosten aus Arbeitspreis und Grundpreis gegen die gezahlten Abschläge':
            'Barre: costi annui da prezzo dell’energia e quota fissa a confronto con gli acconti pagati',
        'Arbeitspreis': 'Prezzo dell’energia', 'Grundpreis': 'Quota fissa', 'Jahreskosten': 'Costi annui', 'Abschläge': 'Acconti',
        // fahrrados8
        'Reifengröße': 'Misura dello pneumatico', 'Kettenblatt vorn (Zähne)': 'Corona anteriore (denti)', 'Ritzel hinten (Zähne)': 'Pignone posteriore (denti)',
        'Trittfrequenz (pro Minute)': 'Cadenza (al minuto)', 'Übersetzung': 'Rapporto di trasmissione', 'Radumfang': 'Circonferenza della ruota',
        'Weg pro Kurbelumdrehung': 'Percorso per pedalata', 'Geschwindigkeit': 'Velocità', 'Kurbelumdrehungen pro km': 'Pedalate per km',
        'Vereinfacht ist hier der Raddurchmesser die Zollangabe mal $2{,}54\\,\\text{cm}$. Großes Kettenblatt und kleines Ritzel: schnell, aber schwer zu treten.':
            'Per semplicità qui il diametro della ruota è la misura in pollici per $2{,}54\\,\\text{cm}$. Corona grande e pignone piccolo: si va veloci, ma si fa fatica a pedalare.',
        // termwertos8
        'Termpaar': 'Coppia di espressioni', 'Einsetzen: $x$': 'Sostituisci: $x$',
        // flaecheos8
        'Term': 'Espressione', 'mit Zahlen': 'con numeri', 'mit x': 'con x', 'Faktor $a$': 'Fattore $a$', 'Länge $b$': 'Lunghezza $b$', 'Länge $c$': 'Lunghezza $c$',
        'Rechteck mit der Höhe a, aufgeteilt in zwei Teile: a mal (b plus c)': 'Rettangolo di altezza a, diviso in due parti: a per (b più c)',
        'Rechteck mit der Höhe a, aufgeteilt in zwei Teile: a mal (b minus c)': 'Rettangolo di altezza a, diviso in due parti: a per (b meno c)',
        // linearos8
        'Steigung $m$': 'Pendenza $m$', 'y-Achsenabschnitt $n$': 'Intercetta $n$',
        'Graph einer proportionalen Funktion mit Steigungsdreieck': 'Grafico di una funzione di proporzionalità diretta con il triangolo della pendenza',
        'Graph einer linearen Funktion mit Steigungsdreieck': 'Grafico di una funzione lineare con il triangolo della pendenza',
        'Der Graph ist eine Gerade durch den Ursprung $(0 \\mid 0)$.': 'Il grafico è una retta passante per l’origine $(0, 0)$.',
        // lgsgrafos8
        'Gleichungssystem': 'Sistema di equazioni', 'Nächster Schritt': 'Passo successivo', 'Alle Schritte': 'Tutti i passi', 'Von vorn': 'Da capo',
        'Zwei Geraden eines Gleichungssystems im Koordinatensystem': 'Due rette di un sistema di equazioni nel sistema di coordinate',
        'Unendlich viele Lösungen.': 'Infinite soluzioni.', 'Keine Lösung: $L = \\{\\,\\}$': 'Nessuna soluzione: $S = \\{\\,\\}$',
        // tarifos8
        'Handy': 'Cellulare', 'Strom': 'Luce', 'Carsharing': 'Car sharing',
        'Minuten': 'minuti', 'kWh im Jahr': 'kWh all’anno', 'Kilometer': 'chilometri',
        'Tarif A: Grundgebühr': 'Tariffa A: canone fisso', 'Tarif B: Grundgebühr': 'Tariffa B: canone fisso',
        'Tarif A: € pro Minute': 'Tariffa A: € al minuto', 'Tarif B: € pro Minute': 'Tariffa B: € al minuto',
        'Tarif A: € pro kWh': 'Tariffa A: € al kWh', 'Tarif B: € pro kWh': 'Tariffa B: € al kWh',
        'Tarif A: € pro km': 'Tariffa A: € al km', 'Tarif B: € pro km': 'Tariffa B: € al km',
        'Kosten der Tarife A und B in Abhängigkeit vom Verbrauch': 'Costi delle tariffe A e B in funzione del consumo',
        // rosetteos8
        'Hilfslinien ein/aus': 'Linee ausiliarie sì/no', 'Zweiter Ring ein/aus': 'Secondo anello sì/no', 'Anzahl der Blätter $n$': 'Numero di petali $n$',
        'Bei 6 Blättern passt alles genau: Der Radius lässt sich sechsmal auf der Kreislinie abtragen. Jeder Bogen um einen der Punkte geht durch den Mittelpunkt und die beiden Nachbarpunkte. Die Blätter berühren sich gerade.':
            'Con 6 petali tutto torna esattamente: il raggio si può riportare sei volte sulla circonferenza. Ogni arco intorno a uno dei punti passa per il centro e per i due punti vicini. I petali si toccano appena.',
        // zaehlenos8
        'Anordnungen': 'Ordinamenti', 'Zählprinzip': 'Principio di moltiplicazione', 'Art': 'Tipo', 'Anzahl der Personen $n$': 'Numero di persone $n$',
        'Zahlenschloss': 'Lucchetto a combinazione', 'Menü': 'Menù', 'Outfit': 'Outfit',
        'Kombinationen': 'combinazioni', 'Menüs': 'menù', 'Outfits': 'outfit',
        'Vorspeise': 'Antipasto', 'Hauptgericht': 'Piatto principale', 'Nachtisch': 'Dolce', 'T-Shirt': 'Maglietta', 'Hose': 'Pantaloni', 'Schuhe': 'Scarpe',
        '1. Ring: Möglichkeiten': '1ª rotella: possibilità', '2. Ring: Möglichkeiten': '2ª rotella: possibilità', '3. Ring: Möglichkeiten': '3ª rotella: possibilità',
        'Vorspeise: Möglichkeiten': 'Antipasto: possibilità', 'Hauptgericht: Möglichkeiten': 'Piatto principale: possibilità', 'Nachtisch: Möglichkeiten': 'Dolce: possibilità',
        'T-Shirt: Möglichkeiten': 'Maglietta: possibilità', 'Hose: Möglichkeiten': 'Pantaloni: possibilità', 'Schuhe: Möglichkeiten': 'Scarpe: possibilità',
        'Das sind zu viele, um sie alle aufzuschreiben. Bei 4 Personen sind es noch 24.': 'Sono troppi per scriverli tutti. Con 4 persone sono ancora 24.',
        // raumos8
        'Länge $a$': 'Lunghezza $a$', 'Breite $b$': 'Larghezza $b$', 'Raumhöhe $h$': 'Altezza della stanza $h$', 'Türen': 'Porte', 'Fenster': 'Finestre',
        'Verschnitt beim Boden': 'Sfrido del pavimento',
        'Grundriss eines Zimmers und seine vier Wände nebeneinander, mit Türen und Fenstern': 'Pianta di una stanza e le sue quattro pareti una accanto all’altra, con porte e finestre',
        'Bodenfläche': 'Superficie del pavimento', 'Wandfläche': 'Superficie delle pareti', 'Farbe (2 Anstriche)': 'Pittura (2 mani)', 'Material zusammen': 'Materiale in tutto',
        'Luftraum des Zimmers': 'Volume d’aria della stanza',
        // reifenos8
        'Reifen': 'Pneumatico', 'Reifenbreite': 'Larghezza dello pneumatico', 'Raddurchmesser': 'Diametro della ruota', 'in Zoll': 'in pollici', 'Umdrehungen pro km': 'Giri per km',

    },
    phrase: [
        // book it-18 mathe8-it:
        // kreisflaecheos8
        ['\\,\\%$ von $r$), ', '\\,\\%$ di $r$), '],
        ['seine Länge ist der halbe Umfang $\\dfrac{u}{2} = \\pi \\cdot r$. Je mehr Stücke, desto genauer stimmt es:',
            'la sua lunghezza è mezza circonferenza, $\\dfrac{u}{2} = \\pi \\cdot r$. Più spicchi ci sono, più è preciso:'],
        // zylinderos8: the mass row
        ['Masse (Holz, $', 'Massa (legno, $'], ['Masse (Aluminium, $', 'Massa (alluminio, $'], ['Masse (Stahl, $', 'Massa (acciaio, $'],
        // stromos8
        ['Kosten und Abschläge sind genau gleich.', 'Costi e acconti sono esattamente uguali.'],
        ['<b>Nachzahlung</b>: $', '<b>Conguaglio da pagare</b>: $'], ['$. Die Abschläge waren zu niedrig.', '$. Gli acconti erano troppo bassi.'],
        ['<b>Guthaben</b>: $', '<b>Credito</b>: $'], ['$ werden zurückgezahlt.', '$ vengono rimborsati.'],
        [' Ein passender neuer Abschlag wäre etwa $', ' Un nuovo acconto adatto sarebbe di circa $'], ['$ im Monat.', '$ al mese.'],
        // termwertos8 (the sentences with "Für $x = …$" go through the rules below)
        ['In allen Zeilen derselbe Wert. Die Tabelle beweist es nicht, aber eine Umformung zeigt: Die Terme sind <b>gleichwertig</b>.',
            'In tutte le righe lo stesso valore. La tabella non lo dimostra, ma una trasformazione lo mostra: le espressioni sono <b>equivalenti</b>.'],
        // flaecheos8
        ['Ausmultiplizieren: ', 'Sviluppare: '], ['Ausklammern, von rechts nach links gelesen: $', 'Raccogliere a fattor comune, letto da destra a sinistra: $'],
        ['Vom ganzen Rechteck $a \\cdot b$ wird der schraffierte Streifen $a \\cdot c$ abgezogen.', 'Dal rettangolo intero $a \\cdot b$ si toglie la striscia tratteggiata $a \\cdot c$.'],
        ['Das ganze Rechteck ist so groß wie seine beiden Teile zusammen.', 'Il rettangolo intero è grande quanto le sue due parti insieme.'],
        [' Jeder Summand in der Klammer wird mit dem Faktor $a$ multipliziert.', ' Ogni addendo nella parentesi viene moltiplicato per il fattore $a$.'],
        // linearos8
        ['Der Graph verläuft <b>waagerecht</b>.', 'Il grafico è <b>orizzontale</b>.'],
        ['Jede Stelle ist eine Nullstelle.', 'Ogni $x$ è uno zero.'], ['Es gibt keine Nullstelle.', 'Non c’è nessuno zero.'],
        ['Nullstelle (türkis): $0 = ', 'Zero (turchese): $0 = '], ['$, also $x_0 = ', '$, quindi $x_0 = '],
        ['Schnittpunkt mit der y-Achse (weiß): $', 'Punto di intersezione con l’asse y (bianco): $'],
        // lgsgrafos8
        ['<b>Schritt 1:</b> Beide Gleichungen nach $y$ umstellen: $y = ', '<b>Passo 1:</b> ricava $y$ da entrambe le equazioni: $y = '],
        ['<b>Schritt 2:</b> Beide Geraden zeichnen: Start bei $(0 \\mid n)$, dann mit dem Steigungsdreieck weiter.',
            '<b>Passo 2:</b> disegna entrambe le rette: parti da $(0, n)$, poi prosegui con il triangolo della pendenza.'],
        ['<b>Schritt 3:</b> Schnittpunkt ablesen: $S(', '<b>Passo 3:</b> leggi il punto di intersezione: $S('], ['$. Probe: $', '$. Verifica: $'],
        ['Genau eine Lösung: $S = ', 'Esattamente una soluzione: $S = '],
        ['<b>Schritt 3:</b> Beide Gleichungen beschreiben <b>dieselbe Gerade</b>. Jeder Punkt auf ihr erfüllt beide Gleichungen.',
            '<b>Passo 3:</b> entrambe le equazioni descrivono <b>la stessa retta</b>. Ogni suo punto soddisfa entrambe le equazioni.'],
        ['<b>Schritt 3:</b> Gleiche Steigung, verschiedene y-Achsenabschnitte: Die Geraden sind <b>parallel</b> und schneiden sich nie.',
            '<b>Passo 3:</b> stessa pendenza, intercette diverse: le rette sono <b>parallele</b> e non si intersecano mai.'],
        // tarifos8
        ['Tarif A: $y = ', 'Tariffa A: $y = '], ['Tarif B: $y = ', 'Tariffa B: $y = '],
        ['($x$ in Minuten, $y$ in €)', '($x$ in minuti, $y$ in €)'], ['($x$ in kWh im Jahr, $y$ in €)', '($x$ in kWh all’anno, $y$ in €)'],
        ['($x$ in Kilometer, $y$ in €)', '($x$ in chilometri, $y$ in €)'],
        ['Beide Tarife kosten gleich viel pro Einheit, die Geraden sind parallel. ', 'Entrambe le tariffe costano uguale per unità, le rette sono parallele. '],
        ['Die Tarife sind gleich teuer.', 'Le tariffe costano uguale.'],
        ['$ ergibt $x \\approx ', '$ dà $x \\approx '], ['$. Dann kosten beide etwa $', '$. Allora entrambe costano circa $'],
        ['Die Geraden schneiden sich nicht bei positivem Verbrauch: ', 'Le rette non si intersecano per un consumo positivo: '],
        // rosetteos8
        ['Jedes Blatt besteht aus zwei Kreisbögen mit dem Radius $r$ vom Mittelpunkt zu einem Punkt auf der Kreislinie. Die Punkte teilen den Kreis in ',
            'Ogni petalo è formato da due archi di circonferenza di raggio $r$ dal centro a un punto della circonferenza. I punti dividono il cerchio in '],
        ['Weil jedes Blatt $60^\\circ$ breit ist, bleiben bei weniger als 6 Blättern Lücken.', 'Poiché ogni petalo è largo $60^\\circ$, con meno di 6 petali restano dei vuoti.'],
        ['Weil jedes Blatt $60^\\circ$ breit ist, überlappen sich die Blätter bei mehr als 6.', 'Poiché ogni petalo è largo $60^\\circ$, con più di 6 i petali si sovrappongono.'],
        // zaehlenos8
        ['Die Wahrscheinlichkeit, dass eine zufällige Sitzordnung genau die alphabetische ist: $', 'La probabilità che una disposizione dei posti casuale sia proprio quella alfabetica: $'],
        ['Vorspeise: ', 'Antipasto: '], ['Hauptgericht: ', 'Piatto principale: '], ['Nachtisch: ', 'Dolce: '], ['T-Shirt: ', 'Maglietta: '], ['Hose: ', 'Pantaloni: '], ['Schuhe: ', 'Scarpe: '],
        ['$ Kombinationen', '$ combinazioni'], ['$ Menüs', '$ menù'], ['$ Outfits', '$ outfit'],
        ['Für jede Wahl im ersten Schritt gibt es alle Möglichkeiten des zweiten, für jede dieser Kombinationen alle des dritten: Die Anzahlen werden multipliziert.',
            'Per ogni scelta al primo passo ci sono tutte le possibilità del secondo, per ognuna di queste combinazioni tutte quelle del terzo: i numeri si moltiplicano.'],
        [' Wer die Kombination rät, trifft beim ersten Versuch mit der Wahrscheinlichkeit $', ' Chi tira a indovinare la combinazione la azzecca al primo tentativo con probabilità $'],
        // raumos8
        ['Annahmen: Laminat im Paket zu ', 'Ipotesi: laminato in confezioni da '],
        [' m² für 21,90 €, Tür 1,8 m², Fenster 1,56 m², 1 ℓ Farbe reicht für 7 m², Eimer zu 5 ℓ für 24,95 €. Pakete und Eimer gibt es nur ganz: Es wird aufgerundet.',
            ' m² a 21,90 €, porta 1,8 m², finestra 1,56 m², 1 ℓ di pittura basta per 7 m², secchi da 5 ℓ a 24,95 €. Confezioni e secchi si vendono solo interi: si arrotonda per eccesso.'],
        // reifenos8
        ['Aufschrift auf dem Reifen: ', 'Scritta sullo pneumatico: '], [' (Breite in mm, dann Felgendurchmesser in mm)', ' (larghezza in mm, poi diametro del cerchione in mm)'],

    ],
    rule: [
        // book it-18 mathe8-it:
        // kreisflaecheos8
        [/Ein Kreis in (\d+) Stücke geschnitten und die Stücke abwechselnd nebeneinandergelegt/g, 'Un cerchio tagliato in $1 spicchi e gli spicchi messi uno accanto all’altro, alternati'],
        [/Die (\d+) Stücke bilden fast ein Rechteck\. Seine Höhe ist fast der Radius \$r\$ \(hier \$/g, 'I $1 spicchi formano quasi un rettangolo. La sua altezza è quasi il raggio $r$ (qui $'],
        // zylinderos8: "Kreiszylinder mit dem Radius 3 cm und der Höhe 8 cm"
        [/(Hohlzylinder|Kreiszylinder) mit dem Radius ([\d,]+) cm und der Höhe ([\d,]+) cm/g,
            (m, k, r, h) => (k === 'Hohlzylinder' ? 'Cilindro cavo' : 'Cilindro') + ' di raggio ' + r + ' cm e altezza ' + h + ' cm'],
        // fahrrados8, reifenos8: "28 Zoll" on the buttons, the chain drive
        [/(\d+) Zoll\b/g, '$1 pollici'],
        [/Kettenantrieb: Kettenblatt mit (\d+) Zähnen, Ritzel mit (\d+) Zähnen und das Hinterrad/g, 'Trasmissione a catena: corona da $1 denti, pignone da $2 denti e la ruota posteriore'],
        [/Kettenblatt (\d+)/g, 'Corona $1'], [/Ritzel (\d+)/g, 'Pignone $1'],
        // termwertos8: "Für $x = -2$ ist $3(x + 2) = …$", "und $…$." at the start of the second line, the verdict, "Dass sie in 3 Zeilen übereinstimmen, reicht nicht."
        [/Für \$x = ([^$]+)\$ ist \$/g, 'Per $x = $1$: $'],
        [/(<p style="margin:4px 0 0">)und \$/g, '$1e $'],
        [/Für \$x = ([^$]+)\$ sind die Werte verschieden: Die Terme sind <b>nicht gleichwertig<\/b>\./g, 'Per $x = $1$ i valori sono diversi: le espressioni <b>non sono equivalenti</b>.'],
        [/ Dass sie in (\d+) Zeilen? übereinstimmen, reicht nicht\./g, (m, n) => ' Che coincidano in ' + n + (n === '1' ? ' riga' : ' righe') + ' non basta.'],
        // flaecheos8: "Probe mit $x = 5$: $3 \cdot (5 + 2) = 21$ und $3 \cdot 5 + 6 = 21$."
        [/Probe mit \$x = ([^$]+)\$: (\$[^$]+\$) und (\$[^$]+\$)\./g, 'Verifica con $x = $1$: $2 e $3.'],
        // linearos8
        [/Der Graph <b>steigt<\/b>: Geht man 1 nach rechts, geht es ([\d,]+) nach oben\./g, 'Il grafico <b>sale</b>: se vai di 1 verso destra, sale di $1.'],
        [/Der Graph <b>fällt<\/b>: Geht man 1 nach rechts, geht es ([\d,]+) nach unten\./g, 'Il grafico <b>scende</b>: se vai di 1 verso destra, scende di $1.'],
        // lgsgrafos8: the solution set is S (glossario)
        [/\$L = (?=\\mathbb\{R\}|\\\{)/g, '$S = '],
        // lgsgrafos8, tarifos8, zaehlenos8: the example buttons
        [/\bBeispiel (\d+)\b/g, 'Esempio $1'],
        // tarifos8
        [/Tarif ([AB]) ist immer günstiger\./g, 'La tariffa $1 è sempre più conveniente.'],
        [/Bis etwa ([\d.,]+) (min|kWh|km) ist Tarif ([AB]) günstiger, darüber Tarif ([AB])\./g, 'Fino a circa $1 $2 conviene la tariffa $3, oltre la tariffa $4.'],
        // rosetteos8
        [/Rosette mit (\d+) Blättern, mit dem Zirkel konstruiert/g, 'Rosetta con $1 petali, costruita con il compasso'],
        [/ gleiche Teile von je \$([\d{},]+)\^\\circ\$\. /g, (m, d) => ' parti uguali di $' + d + '^\\circ$ ciascuna. '],
        // zaehlenos8
        [/(\d+) Personen auf (\d+) Plätzen: Für den ersten Platz gibt es (\d+) Möglichkeiten, für den zweiten noch (\d+), und so weiter bis zum letzten Platz\./g,
            '$1 persone su $2 posti: per il primo posto ci sono $3 possibilità, per il secondo ne restano $4, e così via fino all’ultimo posto.'],
        [/([123])\. Ring: /g, '$1ª rotella: '],
        // raumos8
        [/Wände abgewickelt: ([\d,]+) m lang, ([\d,]+) m hoch/g, 'Pareti sviluppate: lunghe $1 m, alte $2 m'],
        [/mit (\d+) % Verschnitt/g, 'con il $1 % di sfrido'],
        [/ → (\d+) Pakete zu \$/g, (m, n) => ' → ' + n + (n === '1' ? ' confezione' : ' confezioni') + ' da $'],
        [/(\d+) Eimer zu 5 ℓ/g, (m, n) => n + (n === '1' ? ' secchio' : ' secchi') + ' da 5 ℓ'],
        // reifenos8
        [/Laufrad mit Felge (\d+) mm und Reifen (\d+) mm breit/g, 'Ruota con cerchione da $1 mm e pneumatico largo $2 mm'],
        [/Die Zollangabe ist eher ein Name: Ein „(\d+)-Zoll-Rad“ hat hier \$([\d{},]+)\$ Zoll\. Genauer ist die Millimeterangabe\./g,
            (m, n, z) => 'La misura in pollici è più che altro un nome: una «ruota da ' + n + ' pollici» qui ha $' + z + '$ pollici. Più precisa è la misura in millimetri.'],

    ]
});
