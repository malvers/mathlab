/* js/buch-it/exponential.js — Italian for the widgets of js/buch-exponential.js.
 * Loaded by the Italian editions right after js/buch-exponential.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 3 (20.10.2026): eleven books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/exponential.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('exponential', {
    word: {
        // book it-15 mathegy10-it:
        // wachstumsmodell (helpers of the module, reported for every page that loads it)
        'beschränkt': 'limitata', 'logistisch': 'logistica',
        'Sparschwein: 50 € am Anfang, jede Woche kommen 20 € dazu.': 'Salvadanaio: 50 € all’inizio, ogni settimana se ne aggiungono 20.',
        'Bakterienkultur: 200 Bakterien, jede Stunde 30 % mehr.': 'Coltura di batteri: 200 batteri, ogni ora il 30 % in più.',
        'Ein Getränk aus dem Kühlschrank (6 °C) erwärmt sich auf Raumtemperatur (22 °C). Pro Minute schrumpft der Abstand zur Raumtemperatur um 15 %.':
            'Una bevanda presa dal frigorifero (6 °C) si scalda fino alla temperatura ambiente (22 °C). Ogni minuto la distanza dalla temperatura ambiente si riduce del 15 %.',
        'Ein Gerücht an einer Schule mit 800 Schülerinnen und Schülern: Am Anfang kennen es 10.': 'Una voce in una scuola con 800 studentesse e studenti: all’inizio la conoscono in 10.',
        'Betrag in €': 'Importo in €', 'Anzahl': 'Numero', 'Temperatur in °C': 'Temperatura in °C', 'kennen es': 'la conoscono', 'Wochen': 'settimane', 'Minuten': 'minuti',
        'Zunahme $d$ pro Schritt': 'Aumento $d$ per passo', 'Wachstumsfaktor $q$': 'Fattore di crescita $q$',
        'Anteil $k$ des Abstands pro Schritt': 'Frazione $k$ della distanza per passo', 'Wachstumskonstante $k$': 'Costante di crescita $k$',
        'Anfangsbestand $B_0$': 'Quantità iniziale $B_0$', 'Schranke $S$': 'Limite $S$', 'Anzahl der Schritte': 'Numero di passi',
        'Bestand Schritt für Schritt': 'La quantità passo dopo passo',
        'Die <b>Differenz</b> aufeinanderfolgender Werte ist konstant.': 'La <b>differenza</b> tra valori consecutivi è costante.',
        // funktionsklassen
        'ganzrational': 'polinomiale', 'gebrochenrational': 'razionale fratta', 'logarithmisch': 'logaritmica', 'trigonometrisch': 'goniometrica',
        'Funktionsklasse': 'Classe di funzioni', 'Typische Graphen der gewählten Funktionsklasse': 'Grafici tipici della classe di funzioni scelta',
        'Verlauf': 'Andamento', 'Besonderheit': 'Particolarità', 'Asymptote': 'Asintoto', 'Nullstelle und Asymptote': 'Zero e asintoto', 'Term': 'Espressione',
        '$a_n x^n + \\ldots + a_1 x + a_0$, zum Beispiel $x^2$ oder $x^3 - 3x$': '$a_n x^n + \\ldots + a_1 x + a_0$, per esempio $x^2$ o $x^3 - 3x$',
        'alle reellen Zahlen': 'tutti i numeri reali', 'höchstens $n$ Stück (Grad $n$)': 'al massimo $n$ (grado $n$)',
        'für große $|x|$ bestimmt der Summand mit dem höchsten Exponenten den Verlauf, keine Asymptoten':
            'per $|x|$ grande l’andamento è deciso dall’addendo con l’esponente più alto; nessun asintoto',
        'nur gerade Exponenten: achsensymmetrisch zur $y$-Achse, nur ungerade: punktsymmetrisch zum Ursprung':
            'solo esponenti pari: simmetrica rispetto all’asse $y$; solo dispari: simmetrica rispetto all’origine',
        'ein Bruch mit $x$ im Nenner, zum Beispiel $\\tfrac{1}{x}$ oder $\\tfrac{2}{x - 1} + 1$':
            'una frazione con $x$ al denominatore, per esempio $\\tfrac{1}{x}$ o $\\tfrac{2}{x - 1} + 1$',
        'alle reellen Zahlen außer den Nullstellen des Nenners': 'tutti i numeri reali tranne gli zeri del denominatore',
        'Fahrzeit $t = \\tfrac{s}{v}$ bei fester Strecke': 'tempo di viaggio $t = \\tfrac{s}{v}$ su un percorso fisso',
        '$\\sqrt{x}$, verschoben oder gestreckt': '$\\sqrt{x}$, traslata o dilatata',
        '$x \\geq 0$ (beim Grundtyp)': '$x \\geq 0$ (nel tipo base)', '$y \\geq 0$ (beim Grundtyp)': '$y \\geq 0$ (nel tipo base)',
        'Umkehrfunktion von $y = x^2$ für $x \\geq 0$, keine Asymptote': 'funzione inversa di $y = x^2$ per $x \\geq 0$, nessun asintoto',
        '$a \\cdot b^x$ mit $b > 0$, $b \\neq 1$': '$a \\cdot b^x$ con $b > 0$, $b \\neq 1$',
        '$y > 0$ (für $a > 0$), also keine Nullstelle': '$y > 0$ (per $a > 0$), quindi nessuno zero',
        'die $x$-Achse, alle Graphen $b^x$ gehen durch $(0 \\mid 1)$': 'l’asse $x$; tutti i grafici $b^x$ passano per $(0, 1)$',
        'Wachstum und Zerfall, Zinseszins': 'crescita e decrescita, interesse composto',
        '$\\log_a x$ mit $a > 0$, $a \\neq 1$': '$\\log_a x$ con $a > 0$, $a \\neq 1$',
        'Nullstelle $x = 1$, senkrechte Asymptote: die $y$-Achse': 'zero $x = 1$, asintoto verticale: l’asse $y$',
        'Richterskala, Dezibel, pH-Wert': 'scala Richter, decibel, pH',
        '$\\sin x$, $\\cos x$, $\\tan x$, auch $a \\cdot \\sin(b(x - c)) + d$': '$\\sin x$, $\\cos x$, $\\tan x$, anche $a \\cdot \\sin(b(x - c)) + d$',
        'Sinus und Kosinus: alle reellen Zahlen; Tangens: ohne $\\tfrac{\\pi}{2} + k\\pi$': 'seno e coseno: tutti i numeri reali; tangente: senza $\\tfrac{\\pi}{2} + k\\pi$',
        'Sinus und Kosinus: $-1 \\leq y \\leq 1$; Tangens: alle reellen Zahlen': 'seno e coseno: $-1 \\leq y \\leq 1$; tangente: tutti i numeri reali',
        'Schwingungen, Gezeiten, Tageslänge': 'oscillazioni, maree, durata del giorno',
        // logfunktion
        'Verschiebung $d$ nach rechts': 'Traslazione $d$ verso destra', 'Verschiebung $e$ nach oben': 'Traslazione $e$ verso l’alto',
        'Logarithmusfunktion mit Asymptote': 'Funzione logaritmica con asintoto', 'senkrechte Asymptote': 'asintoto verticale',
        'Die Basis $a = 1$ ist nicht erlaubt: $1^y$ ist immer $1$, man kann also nicht nach $y$ auflösen.':
            'La base $a = 1$ non è ammessa: $1^y$ vale sempre $1$, quindi non si può ricavare $y$.',
        // rechenschieber
        'Faktor $b$': 'Fattore $b$',
        'Rechenschieber: verschiebbare Zunge über einer festen Skala': 'Regolo calcolatore: un’asta scorrevole su una scala fissa',
        // verkettung
        'Verknüpfung:': 'Operazione:', 'Verknüpfung': 'Operazione', 'Funktion f': 'Funzione f', 'Funktion g': 'Funzione g',
        'Zwei Funktionen und ihre Verknüpfung': 'Due funzioni e la loro combinazione', 'Ergebnis': 'Risultato',
        // expanwendung
        'Medikament': 'Farmaco', 'Bakterien': 'Batteri', 'Sachverhalt': 'Situazione',
        '2000 € werden mit 3 % pro Jahr verzinst.': '2000 € fruttano interessi al 3 % annuo.',
        'Kohlenstoff-14 zerfällt mit einer Halbwertszeit von 5730 Jahren.': 'Il carbonio 14 decade con un tempo di dimezzamento di 5730 anni.',
        '400 mg eines Wirkstoffs, der Körper baut pro Stunde 20 % ab.': '400 mg di un principio attivo; il corpo ne elimina il 20 % ogni ora.',
        '500 Bakterien, die Anzahl verdoppelt sich alle 3 Stunden.': '500 batteri; il loro numero raddoppia ogni 3 ore.',
        'Zielwert $Z$': 'Valore obiettivo $Z$', 'Wachstums- oder Zerfallskurve mit Zielwert': 'Curva di crescita o di decrescita con valore obiettivo',
        't in Jahre': 't in anni', 't in Stunden': 't in ore',
        // skizze
        'Nächster Schritt': 'Passo successivo', 'Graph zeigen': 'Mostra il grafico', 'Andere Funktion': 'Altra funzione',
        'Skizze: charakteristische Punkte und Asymptoten': 'Schizzo: punti caratteristici e asintoti',
        'Grundfunktion $2^x$, um 4 nach <b>unten</b> verschoben: waagerechte Asymptote $y = -4$.': 'Funzione base $2^x$, traslata di 4 verso il <b>basso</b>: asintoto orizzontale $y = -4$.',
        'Schnittpunkt mit der $y$-Achse: $f(0) = 1 - 4 = -3$.': 'Intersezione con l’asse $y$: $f(0) = 1 - 4 = -3$.',
        'Nullstelle: $2^x = 4 \\Rightarrow x = 2$.': 'Zero: $2^x = 4 \\Rightarrow x = 2$.',
        'Ein Punkt mehr: $f(3) = 8 - 4 = 4$. Streng monoton steigend.': 'Un punto in più: $f(3) = 8 - 4 = 4$. Strettamente crescente.',
        'Scheitelpunktform: Scheitel $S(1 \\mid 4)$, nach <b>unten</b> geöffnet, so breit wie die Normalparabel.':
            'Forma del vertice: vertice $S(1, 4)$, rivolta verso il <b>basso</b>, larga come la parabola normale.',
        'Schnittpunkt mit der $y$-Achse: $f(0) = -1 + 4 = 3$, gespiegelt an $x = 1$ auch $(2 \\mid 3)$.':
            'Intersezione con l’asse $y$: $f(0) = -1 + 4 = 3$; per simmetria rispetto a $x = 1$ anche $(2, 3)$.',
        'Grundfunktion $\\tfrac1x$, um 2 nach rechts verschoben: <b>Polstelle</b> $x = 2$ mit senkrechter Asymptote.':
            'Funzione base $\\tfrac1x$, traslata di 2 verso destra: <b>polo</b> $x = 2$ con asintoto verticale.',
        'Um 1 nach oben verschoben: waagerechte Asymptote $y = 1$.': 'Traslata di 1 verso l’alto: asintoto orizzontale $y = 1$.',
        'Nullstelle: $\\tfrac{1}{x - 2} = -1 \\Rightarrow x - 2 = -1 \\Rightarrow x = 1$.': 'Zero: $\\tfrac{1}{x - 2} = -1 \\Rightarrow x - 2 = -1 \\Rightarrow x = 1$.',
        '$y$-Achse: $f(0) = -\\tfrac12 + 1 = \\tfrac12$; rechts der Polstelle zum Beispiel $f(3) = 2$.': 'Asse $y$: $f(0) = -\\tfrac12 + 1 = \\tfrac12$; a destra del polo per esempio $f(3) = 2$.',
        'Grundfunktion $\\log_2 x$, um 1 nach <b>links</b> verschoben: Definitionsbereich $x > -1$, senkrechte Asymptote $x = -1$.':
            'Funzione base $\\log_2 x$, traslata di 1 verso <b>sinistra</b>: dominio $x > -1$, asintoto verticale $x = -1$.',
        'Nullstelle: $x + 1 = 1 \\Rightarrow x = 0$. Sie ist zugleich der Schnittpunkt mit der $y$-Achse.': 'Zero: $x + 1 = 1 \\Rightarrow x = 0$. È anche l’intersezione con l’asse $y$.',
        'Weitere Punkte an Zweierpotenzen: $f(1) = 1$, $f(3) = 2$, $f(7) = 3$.': 'Altri punti in corrispondenza delle potenze di due: $f(1) = 1$, $f(3) = 2$, $f(7) = 3$.',
        'Mittellinie $y = 1$, Amplitude 2: Die Werte liegen zwischen $-1$ und $3$.': 'Linea mediana $y = 1$, ampiezza 2: i valori stanno tra $-1$ e $3$.',
        'Periode $2\\pi$ wie beim Sinus. Hochpunkt bei $\\tfrac{\\pi}{2}$, Tiefpunkt bei $\\tfrac{3\\pi}{2}$.': 'Periodo $2\\pi$ come per il seno. Massimo in $\\tfrac{\\pi}{2}$, minimo in $\\tfrac{3\\pi}{2}$.',
        'Auf der Mittellinie bei $0$, $\\pi$ und $2\\pi$.': 'Sulla linea mediana in $0$, $\\pi$ e $2\\pi$.',
        'Ausklammern: $x(x^2 - 4) = x(x - 2)(x + 2)$, Nullstellen $-2$, $0$ und $2$.': 'Raccogliere: $x(x^2 - 4) = x(x - 2)(x + 2)$, zeri $-2$, $0$ e $2$.',
        'Nur ungerade Exponenten: <b>punktsymmetrisch</b> zum Ursprung. Für große $x$ entscheidet $x^3$: rechts nach oben, links nach unten.':
            'Solo esponenti dispari: <b>simmetrica rispetto all’origine</b>. Per $x$ grandi decide $x^3$: a destra verso l’alto, a sinistra verso il basso.',
        'Zwei Punkte: $f(1) = -3$ und, symmetrisch, $f(-1) = 3$.': 'Due punti: $f(1) = -3$ e, per simmetria, $f(-1) = 3$.',
        'Jetzt die Punkte glatt verbinden und die Asymptoten beachten. So sieht der Graph aus.': 'Ora congiungi i punti con una curva regolare e tieni conto degli asintoti. Ecco il grafico.',
        'Überleg zuerst selbst: Welche Grundfunktion steckt darin? Wie ist sie verschoben oder gestreckt? Dann Schritt für Schritt aufdecken.':
            'Pensa prima da solo: quale funzione base c’è dentro? Come è traslata o dilatata? Poi scopri passo dopo passo.',

        // book it-20 mathe10-it:
        'beschränkt': 'limitato',
        'logistisch': 'logistico',
        'Sparschwein: 50 € am Anfang, jede Woche kommen 20 € dazu.': 'Salvadanaio: 50 € all’inizio, ogni settimana si aggiungono 20 €.',
        'Bakterienkultur: 200 Bakterien, jede Stunde 30 % mehr.': 'Coltura di batteri: 200 batteri, ogni ora il 30 % in più.',
        'Ein Getränk aus dem Kühlschrank (6 °C) erwärmt sich auf Raumtemperatur (22 °C). Pro Minute schrumpft der Abstand zur Raumtemperatur um 15 %.': 'Una bibita presa dal frigorifero (6 °C) si riscalda fino alla temperatura ambiente (22 °C). Ogni minuto la differenza dalla temperatura ambiente si riduce del 15 %.',
        'Ein Gerücht an einer Schule mit 800 Schülerinnen und Schülern: Am Anfang kennen es 10.': 'Una voce in una scuola con 800 studentesse e studenti: all’inizio la conoscono in 10.',
        'Betrag in €': 'Importo in €',
        'Temperatur in °C': 'Temperatura in °C',
        'kennen es': 'la conoscono',
        'Wochen': 'settimane',
        'Minuten': 'minuti',
        'Zunahme $d$ pro Schritt': 'Aumento $d$ per passo',
        'Wachstumsfaktor $q$': 'Fattore di crescita $q$',
        'Anteil $k$ des Abstands pro Schritt': 'Frazione $k$ della differenza per passo',
        'Wachstumskonstante $k$': 'Costante di crescita $k$',
        'Anfangsbestand $B_0$': 'Quantità iniziale $B_0$',
        'Schranke $S$': 'Soglia $S$',
        'Anzahl der Schritte': 'Numero di passi',
        'Bestand Schritt für Schritt': 'La quantità passo per passo',
        'Die <b>Differenz</b> aufeinanderfolgender Werte ist konstant.': 'La <b>differenza</b> tra valori consecutivi è costante.',
        'Funktionsklasse': 'Tipo di funzione',
        'Typische Graphen der gewählten Funktionsklasse': 'Grafici tipici del tipo di funzione scelto',
        'Asymptote': 'Asintoto',
        'senkrechte Asymptote': 'asintoto verticale',
        'Bakterien': 'Batteri',
        'Grundfunktion $2^x$, um 4 nach <b>unten</b> verschoben: waagerechte Asymptote $y = -4$.': 'Funzione elementare $2^x$, traslata di 4 verso il <b>basso</b>: asintoto orizzontale $y = -4$.',
        'Schnittpunkt mit der $y$-Achse: $f(0) = 1 - 4 = -3$.': 'Intersezione con l’asse $y$: $f(0) = 1 - 4 = -3$.',
        'Nullstelle: $2^x = 4 \\Rightarrow x = 2$.': 'Zero: $2^x = 4 \\Rightarrow x = 2$.',
        'Ein Punkt mehr: $f(3) = 8 - 4 = 4$. Streng monoton steigend.': 'Un punto in più: $f(3) = 8 - 4 = 4$. Strettamente crescente.',
        'Scheitelpunktform: Scheitel $S(1 \\mid 4)$, nach <b>unten</b> geöffnet, so breit wie die Normalparabel.': 'Forma del vertice: vertice $S(1, 4)$, aperta verso il <b>basso</b>, larga come la parabola normale.',
        'Schnittpunkt mit der $y$-Achse: $f(0) = -1 + 4 = 3$, gespiegelt an $x = 1$ auch $(2 \\mid 3)$.': 'Intersezione con l’asse $y$: $f(0) = -1 + 4 = 3$; per simmetria rispetto a $x = 1$ anche $(2, 3)$.',
        'Grundfunktion $\\tfrac1x$, um 2 nach rechts verschoben: <b>Polstelle</b> $x = 2$ mit senkrechter Asymptote.': 'Funzione elementare $\\tfrac1x$, traslata di 2 verso destra: <b>polo</b> $x = 2$ con asintoto verticale.',
        'Um 1 nach oben verschoben: waagerechte Asymptote $y = 1$.': 'Traslata di 1 verso l’alto: asintoto orizzontale $y = 1$.',
        'Nullstelle: $\\tfrac{1}{x - 2} = -1 \\Rightarrow x - 2 = -1 \\Rightarrow x = 1$.': 'Zero: $\\tfrac{1}{x - 2} = -1 \\Rightarrow x - 2 = -1 \\Rightarrow x = 1$.',
        '$y$-Achse: $f(0) = -\\tfrac12 + 1 = \\tfrac12$; rechts der Polstelle zum Beispiel $f(3) = 2$.': 'Asse $y$: $f(0) = -\\tfrac12 + 1 = \\tfrac12$; a destra del polo per esempio $f(3) = 2$.',
        'Grundfunktion $\\log_2 x$, um 1 nach <b>links</b> verschoben: Definitionsbereich $x > -1$, senkrechte Asymptote $x = -1$.': 'Funzione elementare $\\log_2 x$, traslata di 1 verso <b>sinistra</b>: dominio $x > -1$, asintoto verticale $x = -1$.',
        'Nullstelle: $x + 1 = 1 \\Rightarrow x = 0$. Sie ist zugleich der Schnittpunkt mit der $y$-Achse.': 'Zero: $x + 1 = 1 \\Rightarrow x = 0$. È anche l’intersezione con l’asse $y$.',
        'Weitere Punkte an Zweierpotenzen: $f(1) = 1$, $f(3) = 2$, $f(7) = 3$.': 'Altri punti nelle potenze di due: $f(1) = 1$, $f(3) = 2$, $f(7) = 3$.',
        'Mittellinie $y = 1$, Amplitude 2: Die Werte liegen zwischen $-1$ und $3$.': 'Linea mediana $y = 1$, ampiezza 2: i valori stanno tra $-1$ e $3$.',
        'Periode $2\\pi$ wie beim Sinus. Hochpunkt bei $\\tfrac{\\pi}{2}$, Tiefpunkt bei $\\tfrac{3\\pi}{2}$.': 'Periodo $2\\pi$ come per il seno. Massimo in $\\tfrac{\\pi}{2}$, minimo in $\\tfrac{3\\pi}{2}$.',
        'Auf der Mittellinie bei $0$, $\\pi$ und $2\\pi$.': 'Sulla linea mediana in $0$, $\\pi$ e $2\\pi$.',
        'Ausklammern: $x(x^2 - 4) = x(x - 2)(x + 2)$, Nullstellen $-2$, $0$ und $2$.': 'Raccogliere: $x(x^2 - 4) = x(x - 2)(x + 2)$, zeri $-2$, $0$ e $2$.',
        'Nur ungerade Exponenten: <b>punktsymmetrisch</b> zum Ursprung. Für große $x$ entscheidet $x^3$: rechts nach oben, links nach unten.': 'Solo esponenti dispari: <b>simmetrica rispetto all’origine</b>. Per $x$ grandi decide $x^3$: a destra verso l’alto, a sinistra verso il basso.',
        'Zwei Punkte: $f(1) = -3$ und, symmetrisch, $f(-1) = 3$.': 'Due punti: $f(1) = -3$ e, per simmetria, $f(-1) = 3$.',
        // funktionsklassen: the table of the function types (the block mathe10-es of js/buch-es/exponential.js)
        'ganzrational': 'polinomiale', 'gebrochenrational': 'razionale fratta', 'logarithmisch': 'logaritmica', 'trigonometrisch': 'goniometrica',
        'Verlauf': 'Andamento', 'Besonderheit': 'Particolarità', 'Nullstelle und Asymptote': 'Zero e asintoto', 'Term': 'Espressione',
        '$a_n x^n + \\ldots + a_1 x + a_0$, zum Beispiel $x^2$ oder $x^3 - 3x$': '$a_n x^n + \\ldots + a_1 x + a_0$, per esempio $x^2$ o $x^3 - 3x$',
        'alle reellen Zahlen': 'tutti i numeri reali', 'höchstens $n$ Stück (Grad $n$)': 'al massimo $n$ (grado $n$)',
        'für große $|x|$ bestimmt der Summand mit dem höchsten Exponenten den Verlauf, keine Asymptoten': 'per $|x|$ grande l’addendo con l’esponente più alto determina l’andamento; nessun asintoto',
        'nur gerade Exponenten: achsensymmetrisch zur $y$-Achse, nur ungerade: punktsymmetrisch zum Ursprung': 'solo esponenti pari: simmetrica rispetto all’asse $y$; solo dispari: simmetrica rispetto all’origine',
        'ein Bruch mit $x$ im Nenner, zum Beispiel $\\tfrac{1}{x}$ oder $\\tfrac{2}{x - 1} + 1$': 'una frazione con $x$ al denominatore, per esempio $\\tfrac{1}{x}$ o $\\tfrac{2}{x - 1} + 1$',
        'alle reellen Zahlen außer den Nullstellen des Nenners': 'tutti i numeri reali tranne gli zeri del denominatore',
        'Fahrzeit $t = \\tfrac{s}{v}$ bei fester Strecke': 'tempo di viaggio $t = \\tfrac{s}{v}$ con una distanza fissa',
        '$\\sqrt{x}$, verschoben oder gestreckt': '$\\sqrt{x}$, traslata o dilatata',
        '$x \\geq 0$ (beim Grundtyp)': '$x \\geq 0$ (nel tipo base)', '$y \\geq 0$ (beim Grundtyp)': '$y \\geq 0$ (nel tipo base)',
        'Umkehrfunktion von $y = x^2$ für $x \\geq 0$, keine Asymptote': 'funzione inversa di $y = x^2$ per $x \\geq 0$, nessun asintoto',
        '$a \\cdot b^x$ mit $b > 0$, $b \\neq 1$': '$a \\cdot b^x$ con $b > 0$, $b \\neq 1$',
        '$y > 0$ (für $a > 0$), also keine Nullstelle': '$y > 0$ (per $a > 0$), quindi nessuno zero',
        'die $x$-Achse, alle Graphen $b^x$ gehen durch $(0 \\mid 1)$': 'l’asse $x$; tutti i grafici $b^x$ passano per $(0, 1)$',
        'Wachstum und Zerfall, Zinseszins': 'crescita e decrescita, interesse composto',
        '$\\log_a x$ mit $a > 0$, $a \\neq 1$': '$\\log_a x$ con $a > 0$, $a \\neq 1$',
        'Nullstelle $x = 1$, senkrechte Asymptote: die $y$-Achse': 'zero $x = 1$, asintoto verticale: l’asse $y$',
        'Richterskala, Dezibel, pH-Wert': 'scala Richter, decibel, valore del pH',
        '$\\sin x$, $\\cos x$, $\\tan x$, auch $a \\cdot \\sin(b(x - c)) + d$': '$\\sin x$, $\\cos x$, $\\tan x$, anche $a \\cdot \\sin(b(x - c)) + d$',
        'Sinus und Kosinus: alle reellen Zahlen; Tangens: ohne $\\tfrac{\\pi}{2} + k\\pi$': 'seno e coseno: tutti i numeri reali; tangente: senza $\\tfrac{\\pi}{2} + k\\pi$',
        'Sinus und Kosinus: $-1 \\leq y \\leq 1$; Tangens: alle reellen Zahlen': 'seno e coseno: $-1 \\leq y \\leq 1$; tangente: tutti i numeri reali',
        'Schwingungen, Gezeiten, Tageslänge': 'oscillazioni, maree, durata del giorno',

    },
    phrase: [
        // book it-15 mathegy10-it:
        // wachstumsmodell
        ['rekursiv: $B_0 = ', 'ricorsiva: $B_0 = '], ['explizit: $', 'esplicita: $'],
        ['Der <b>Quotient</b> aufeinanderfolgender Werte ist konstant: ', 'Il <b>quoziente</b> tra valori consecutivi è costante: '],
        [' % pro Schritt (Abnahme).', ' % per passo (diminuzione).'], [' % pro Schritt.', ' % per passo.'], ['Der Bestand bleibt gleich.', 'La quantità non cambia.'],
        ['Der <b>Abstand zur Schranke</b> schrumpft mit dem Faktor $1 - k = ', 'La <b>distanza dal limite</b> si riduce con il fattore $1 - k = '],
        ['$, der Bestand kommt $S$ immer näher, ohne sie zu überschreiten.', '$; la quantità si avvicina sempre di più a $S$ senza superarlo.'],
        ['Am Anfang wächst der Bestand fast exponentiell, in der Nähe von $\\tfrac{S}{2} = ', 'All’inizio la quantità cresce in modo quasi esponenziale; vicino a $\\tfrac{S}{2} = '],
        ['$ am schnellsten, dann bremst ihn die Schranke. Eine einfache explizite Formel gibt es für diese schrittweise Rechnung nicht, man rechnet Schritt für Schritt, am besten mit einer Tabellenkalkulation.',
            '$ cresce più in fretta, poi il limite la frena. Per questo calcolo passo dopo passo non esiste una formula esplicita semplice: si calcola passo per passo, meglio con un foglio di calcolo.'],
        [' <b>Achtung:</b> Bei so großem $k$ springt der Bestand über die Schranke und schwingt.', ' <b>Attenzione:</b> con un $k$ così grande la quantità salta oltre il limite e oscilla.'],
        // funktionsklassen: cells that begin with <b> are not looked up as whole labels
        ['<b>Polstellen</b> mit senkrechten Asymptoten, oft eine waagerechte Asymptote', '<b>poli</b> con asintoti verticali, spesso un asintoto orizzontale'],
        ['<b>periodisch</b>: Periode $2\\pi$ bei Sinus und Kosinus, $\\pi$ beim Tangens', '<b>periodica</b>: periodo $2\\pi$ per seno e coseno, $\\pi$ per la tangente'],
        // logfunktion
        ['streng monoton <b>steigend</b> ($a > 1$)', 'strettamente <b>crescente</b> ($a > 1$)'], ['streng monoton <b>fallend</b> ($0 < a < 1$)', 'strettamente <b>decrescente</b> ($0 < a < 1$)'],
        ['Definitionsbereich $x > ', 'Dominio $x > '], ['$ · Wertebereich: alle reellen Zahlen · ', '$ · insieme immagine: tutti i numeri reali · '],
        ['Nullstelle: $', 'Zero: $'], ['$ · weiße Punkte: $(', '$ · punti bianchi: $('],
        [' · Gespiegelt an $y = x$ wird daraus die Exponentialfunktion $y = ', ' · Per simmetria rispetto a $y = x$ diventa la funzione esponenziale $y = '],
        // rechenschieber
        ['Der Anfang der oberen Skala steht über $a = ', 'L’inizio della scala superiore sta sopra $a = '], ['$, der Läufer über $b = ', '$, il cursore sopra $b = '],
        ['$ auf der oberen Skala. Unten liest man ab: <b>$', '$ sulla scala superiore. In basso si legge: <b>$'],
        [' · Weil $a \\cdot b > 10$ ist, steht hier der <b>rechte</b> Index über $a$, man liest $\\tfrac{a \\cdot b}{10}$ ab: $a \\cdot b = ',
            ' · Poiché $a \\cdot b > 10$, qui l’indice <b>destro</b> sta sopra $a$ e si legge $\\tfrac{a \\cdot b}{10}$: $a \\cdot b = '],
        ['Längen auf der Skala sind Logarithmen: $\\lg ', 'Le lunghezze sulla scala sono logaritmi: $\\lg '],
        ['$. Aus dem Addieren der Längen wird ein Multiplizieren der Zahlen.', '$. Sommare le lunghezze diventa moltiplicare i numeri.'],
        // verkettung
        ['Unter der Wurzel darf keine negative Zahl stehen.', 'Sotto la radice non può esserci un numero negativo.'], ['Ein Nenner darf nicht null werden.', 'Un denominatore non può essere zero.'],
        [' Darum muss man prüfen, für welche $x$ die innere Funktion einen erlaubten Wert liefert.', ' Per questo bisogna controllare per quali $x$ la funzione interna dà un valore ammesso.'],
        ['Innere Funktion: $', 'Funzione interna: $'], ['$, äußere Funktion: $', '$, funzione esterna: $'], ['$. Man setzt die innere in die äußere ein.', '$. Si sostituisce l’interna nell’esterna.'],
        ['Beim Quotienten fallen außerdem alle Stellen weg, an denen $g(x) = 0$ ist.', 'Nel quoziente si escludono inoltre tutti i punti in cui $g(x) = 0$.'],
        ['Der Definitionsbereich ist der Bereich, in dem <b>beide</b> Funktionen definiert sind.', 'Il dominio è l’insieme in cui sono definite <b>entrambe</b> le funzioni.'],
        ['Im Allgemeinen ist $f(g(x)) \\neq g(f(x))$: Probier die andere Reihenfolge.', 'In generale $f(g(x)) \\neq g(f(x))$: prova l’altro ordine.'],
        // expanwendung: "Wann ist das Kapital auf 3000 €?", "Wann sind nur noch 50 mg übrig?"
        ['Wann ist das Kapital auf', 'Quando il capitale arriva a'], ['Wann ist der Anteil auf', 'Quando la quota scende al'],
        ['Wann sind nur noch', 'Quando restano solo'], [' übrig?', ' nel corpo?'], ['Wann sind es', 'Quando diventano'],
        // skizze
        ['Skizziere ohne Taschenrechner:', 'Abbozza senza calcolatrice:'],

        // book it-20 mathe10-it:
        ['rekursiv: $B_0 = ', 'ricorsiva: $B_0 = '],
        ['explizit: $', 'esplicita: $'],
        ['Der <b>Quotient</b> aufeinanderfolgender Werte ist konstant: ', 'Il <b>quoziente</b> tra valori consecutivi è costante: '],
        [' % pro Schritt (Abnahme).', ' % per passo (diminuzione).'],
        [' % pro Schritt.', ' % per passo.'],
        ['Der Bestand bleibt gleich.', 'La quantità resta uguale.'],
        ['Der <b>Abstand zur Schranke</b> schrumpft mit dem Faktor $1 - k = ', 'La <b>differenza dalla soglia</b> si riduce con il fattore $1 - k = '],
        ['$, der Bestand kommt $S$ immer näher, ohne sie zu überschreiten.', '$; la quantità si avvicina sempre di più a $S$ senza superarla.'],
        ['Am Anfang wächst der Bestand fast exponentiell, in der Nähe von $\\tfrac{S}{2} = ', 'All’inizio la quantità cresce quasi in modo esponenziale; vicino a $\\tfrac{S}{2} = '],
        ['$ am schnellsten, dann bremst ihn die Schranke. Eine einfache explizite Formel gibt es für diese schrittweise Rechnung nicht, man rechnet Schritt für Schritt, am besten mit einer Tabellenkalkulation.', '$ cresce più in fretta, poi la soglia la frena. Per questo calcolo passo per passo non c’è una formula esplicita semplice: si calcola passo per passo, meglio con un foglio di calcolo.'],
        [' <b>Achtung:</b> Bei so großem $k$ springt der Bestand über die Schranke und schwingt.', ' <b>Attenzione:</b> con un $k$ così grande la quantità salta oltre la soglia e oscilla.'],
        ['Definitionsbereich $x > ', 'Dominio $x > '],
        ['Nullstelle: $', 'Zero: $'],
        ['<b>Polstellen</b> mit senkrechten Asymptoten, oft eine waagerechte Asymptote', '<b>poli</b> con asintoti verticali, spesso un asintoto orizzontale'],
        ['<b>periodisch</b>: Periode $2\\pi$ bei Sinus und Kosinus, $\\pi$ beim Tangens', '<b>periodica</b>: periodo $2\\pi$ per seno e coseno, $\\pi$ per la tangente'],

    ],
    rule: [
        // book it-15 mathegy10-it:
        // expanwendung: the unit after the result ("… ≈ 13,7$ Jahre"); skizze: "(Funktion 2 von 6)"
        [/\$ Jahre<\/p>/g, '$ anni</p>'], [/\$ Stunden<\/p>/g, '$ ore</p>'],
        [/\(Funktion (\d+) von (\d+)\)/g, '(funzione $1 di $2)'],

        // book it-20 mathe10-it:
        // expanwendung: the unit after the result; skizze: "(Funktion 2 von 6)"
        [/\$ Jahre<\/p>/g, '$ anni</p>'], [/\$ Stunden<\/p>/g, '$ ore</p>'],
        [/\(Funktion (\d+) von (\d+)\)/g, '(funzione $1 di $2)'],

    ]
});
