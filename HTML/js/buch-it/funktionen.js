/* js/buch-it/funktionen.js — Italian for the widgets of js/buch-funktionen.js.
 * Loaded by the Italian editions right after js/buch-funktionen.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Package IT0 (18.10.2026) put in only the cover of the start page; every book writes only below its own comment line, each entry ending
 * with a comma, so the three books merge without a conflict. The Spanish file js/buch-es/funktionen.js shows which German
 * strings the widgets write.
 * Round 2 (20.10.2026): six books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 */
window.BuchIT && BuchIT.add('funktionen', {
    word: {
        // it0: the cover of the start page
        'Titelbild: Parabel, Sinuskurve, Exponentialfunktion und Gerade':
            'Copertina: parabola, sinusoide, funzione esponenziale e retta',
        // book it-1 mathe11-it:
        // titelbild, detektiv, wachstum, gerade, parabel, wurf, einheitskreis, sinus, tageslaenge, regression, anscombe,
        // umkehr, expgleichung, parameter, graphquiz (graph and the plot axis: js/buch-it.js)
        // detektiv ("keine" stands for no zeros, no symmetry, no asymptotes: "non ha" fits all three)
        'Graph der gewählten Funktion': 'Grafico della funzione scelta', 'Alle aufdecken': 'Mostra tutto', 'aufdecken': 'mostra',
        'Definitionsbereich': 'Dominio', 'Wertebereich': 'Insieme immagine', 'Nullstellen': 'Zeri', 'Monotonie': 'Monotonia',
        'Symmetrie': 'Simmetria', 'Periodisch?': 'Periodica?', 'Asymptoten': 'Asintoti', 'nein': 'no', 'keine': 'non ha',
        // wachstum
        'Sparen': 'Risparmio', 'Kernzerfall': 'Decadimento radioattivo', 'Eigene Werte': 'Valori propri',
        'Lineares und exponentielles Wachstum': 'Crescita lineare ed esponenziale', 'Startwert $a$': 'Valore iniziale $a$',
        'linear: Änderung $m$ pro Schritt': 'lineare: variazione $m$ per passo', 'exponentiell: Faktor $q$': 'esponenziale: fattore $q$',
        'Zeitraum': 'Intervallo di tempo',
        // gerade, parabel, wurf
        'Gerade durch zwei verschiebbare Punkte': 'Retta per due punti trascinabili',
        'Streckfaktor $a$': 'Fattore di dilatazione $a$', 'Verschiebung nach rechts $d$': 'Traslazione verso destra $d$',
        'Verschiebung nach oben $e$': 'Traslazione verso l’alto $e$', 'Parabel mit verschiebbarem Scheitelpunkt': 'Parabola con vertice trascinabile',
        'Abwurfhöhe $h_0$': 'Altezza di lancio $h_0$', 'Abwurfgeschwindigkeit $v_0$': 'Velocità di lancio $v_0$',
        'Höhe beim senkrechten Wurf': 'Altezza nel lancio verticale',
        // einheitskreis, sinus, tageslaenge
        'Abspielen': 'Avvia', 'Anhalten': 'Pausa', 'Winkel $\\alpha$': 'Angolo $\\alpha$', 'Einheitskreis und Sinuskurve': 'Circonferenza goniometrica e sinusoide',
        'Amplitude $a$': 'Ampiezza $a$', 'Faktor $b$ (Periode $\\tfrac{2\\pi}{b}$)': 'Fattore $b$ (periodo $\\tfrac{2\\pi}{b}$)',
        'Verschiebung $c$ nach rechts': 'Traslazione $c$ verso destra', 'Verschiebung $d$ nach oben': 'Traslazione $d$ verso l’alto',
        'Sinusfunktion mit Parametern': 'Funzione seno con parametri',
        'Tag des Jahres': 'Giorno dell’anno', 't in Tagen': 't in giorni', 'Stunden': 'ore', 'Tageslänge in Dresden': 'Durata del giorno a Dresda',
        // regression, anscombe
        'Kerze': 'Candela', 'Bremsweg': 'Spazio di frenata', 'Abkühlen': 'Raffreddamento', 'Weltbevölkerung': 'Popolazione mondiale',
        'Brenndauer in h': 'Tempo di combustione in h', 'Länge in cm': 'Lunghezza in cm', 'Tempo in km/h': 'Velocità in km/h',
        'Bremsweg in m': 'Spazio di frenata in m', 'Zeit in min': 'Tempo in min', 'Jahr': 'Anno',
        'Mrd. Menschen': 'Miliardi di persone', 'Messreihe': 'Serie di misure',
        'Messpunkte und Regressionskurve': 'Punti misurati e curva di regressione', 'Messpunkte lassen sich verschieben': 'I punti misurati si possono spostare',
        'Für ein exponentielles Modell müssen die Werte positiv sein.': 'Per un modello esponenziale i valori devono essere positivi.',
        'Datensatz': 'Insieme di dati', 'Anscombe-Quartett': 'Quartetto di Anscombe',
        // umkehr, expgleichung, parameter, graphquiz
        'Funktion und Umkehrfunktion, gespiegelt an y = x': 'Funzione e funzione inversa, simmetriche rispetto a y = x',
        'Basis $a$': 'Base $a$', 'rechte Seite $b$': 'secondo membro $b$', 'Lösen': 'Risolvi',
        'Die Basis muss positiv und von 1 verschieden sein.': 'La base deve essere positiva e diversa da 1.',
        'Grundfunktion': 'Funzione elementare', 'Grundfunktion und veränderte Funktion': 'Funzione elementare e funzione trasformata',
        'Das ist die Grundfunktion selbst.': 'È la funzione elementare stessa.',
        'Graph, zu dem der Term gesucht ist': 'Grafico di cui si cerca l’espressione', 'Nächster Graph': 'Grafico successivo',
        // helpers outside the widgets (CURVES, SCHAREN, EXT of funktion, parabelschar, extremwert): check.mjs reads them for every page
        'Parabel': 'Parabola', 'Liegende Spitze': 'V sdraiata', 'Liegende Parabel': 'Parabola sdraiata', 'Wurzel': 'Radice quadrata',
        'Hyperbel': 'Iperbole', 'Betrag': 'Valore assoluto', 'Zaun an der Mauer': 'Recinto lungo il muro', 'Rechteck mit Umfang 24 cm': 'Rettangolo di perimetro 24 cm',
        'Zu $x = 2$ gehören $y = 2$ und $y = -2$. Eine Funktion ordnet jedem $x$ aber genau ein $y$ zu.': 'A $x = 2$ corrispondono $y = 2$ e $y = -2$. Ma una funzione associa a ogni $x$ esattamente un $y$.',
        // book it-2 mathe12-it:
        'Parabel': 'Parabola',
        'Liegende Spitze': 'V coricata',
        'Liegende Parabel': 'Parabola coricata',
        'Wurzel': 'Radice quadrata',
        'Hyperbel': 'Iperbole',
        'Betrag': 'Valore assoluto',
        'Zaun an der Mauer': 'Recinzione lungo il muro',
        'Rechteck mit Umfang 24 cm': 'Rettangolo di perimetro 24 cm',
        // book it-3 mathe13-it:
        // book it-4 mathefos11-it:
        // funktion (the vertical line test)
        'Kurve': 'Curva', 'Kurve mit verschiebbarer senkrechter Gerade': 'Curva con una retta verticale trascinabile',
        'Zieh den türkisen Punkt unten: Die senkrechte Gerade wandert mit. Wie oft trifft sie die Kurve?':
            'Trascina il punto turchese in basso: la retta verticale si sposta con lui. Quante volte interseca la curva?',
        'Ist die Kurve der Graph einer Funktion?': 'La curva è il grafico di una funzione?', 'keine Funktion': 'non è una funzione',
        'Richtig.': 'Giusto.', 'Nicht ganz.': 'Non proprio.',
        'Entscheide mit den Knöpfen. Danach siehst du Definitions- und Wertebereich.': 'Decidi con i pulsanti. Poi vedrai il dominio e l’insieme immagine.',
        // lage (the buttons: the same Italian as in js/buch-it/vektoren.js, which the FOS pages do not load)
        'schneidend': 'incidenti', 'orthogonal': 'ortogonali', 'parallel': 'parallele', 'identisch': 'coincidenti',
        '$g$: Anstieg $m_1$': '$g$: pendenza $m_1$', '$g$: Achsenabschnitt $n_1$': '$g$: intercetta $n_1$',
        '$h$: Anstieg $m_2$': '$h$: pendenza $m_2$', '$h$: Achsenabschnitt $n_2$': '$h$: intercetta $n_2$',
        'Zwei Geraden und ihre Lage zueinander': 'Due rette e la loro posizione reciproca',

        // book it-5 mathefos12-it:

        // book it-6 mathegy11-it:
        // ganzrational
        'Vielfachheit': 'Molteplicità', 'Vielfachheit kleiner': 'Molteplicità minore', 'Vielfachheit größer': 'Molteplicità maggiore', 'Faktor $a$': 'Fattore $a$',
        'Zieh die Nullstellen auf der $x$-Achse. Vielfachheit 0 nimmt den Linearfaktor heraus.': 'Trascina gli zeri lungo l’asse $x$. La molteplicità 0 toglie il fattore lineare.',
        'Ganzrationale Funktion mit verschiebbaren Nullstellen': 'Funzione polinomiale con zeri che si possono spostare',

        // book it-7 mathegy11lk-it:

        // book it-8 mathegy12-it:

        // book it-9 mathegy12lk-it:
    },
    phrase: [
        // book it-1 mathe11-it:
        // parameter: c = 0 in f(c·x)
        ['mit $c = 0$ ist $g(x) = f(0)$ konstant', 'con $c = 0$, $g(x) = f(0)$ è costante'],
        // detektiv
        [' (doppelt)', ' (doppio)'], ['fallend für ', 'decrescente per '], ['steigend für ', 'crescente per '],
        ['achsensymmetrisch zur $y$-Achse', 'simmetrica rispetto all’asse $y$'], ['punktsymmetrisch zum Ursprung', 'simmetrica rispetto all’origine'],
        ['überall steigend', 'sempre crescente'], ['fallend auf ', 'decrescente in '], [' und fallend auf ', ' e decrescente in '],
        [' (senkrecht) und ', ' (verticale) e '], ['(waagerecht)', '(orizzontale)'], ['$ und $', '$ e $'],
        ['abwechselnd steigend und fallend', 'alternativamente crescente e decrescente'], ['ja, Periode ', 'sì, periodo '],
        ['$ für $x', '$ per $x'], ['$ mit $k', '$ con $k'],
        // wachstum
        ['einfache Zinsen (30 € pro Jahr)', 'interesse semplice (30 € all’anno)'], ['Zinseszins (3 % pro Jahr)', 'interesse composto (3 % all’anno)'],
        ['linear: jeden Tag 6,25 Prozentpunkte weniger', 'lineare: ogni giorno 6,25 punti percentuali in meno'],
        ['Jod-131: Halbwertszeit 8 Tage', 'iodio-131: tempo di dimezzamento 8 giorni'],
        [' — in jedem Schritt wird mit <b>demselben Faktor</b> multipliziert', ' — a ogni passo si moltiplica per <b>lo stesso fattore</b>'],
        [' — in jedem Schritt ', ' — a ogni passo '], ['geht <b>gleich viel</b> weg', 'si toglie <b>la stessa quantità</b>'],
        [' wäre alles verbraucht.', ' sarebbe tutto esaurito.'], ['kommt <b>gleich viel</b> hinzu.', 'si aggiunge <b>la stessa quantità</b>.'],
        ['. Nach $', '. Dopo $'], [', das sind ', ', cioè '], [' % pro Schritt. ', ' % per passo. '],
        ['linear', 'lineare'], ['exponentiell', 'esponenziale'], ['Verdopplungszeit', 'Tempo di raddoppio'], ['Halbwertszeit', 'Tempo di dimezzamento'],
        ['Jahre', 'anni'], ['Tage', 'giorni'], ['Schritte', 'passi'], ['Jahren', 'anni'], ['Tagen', 'giorni'], ['Schritten', 'passi'],
        // gerade
        ['Beide Punkte liegen senkrecht übereinander. Die Gerade $x = ', 'I due punti stanno sulla stessa verticale. La retta $x = '],
        ['$ ist <b>kein</b> Funktionsgraph.', '$ <b>non</b> è il grafico di una funzione.'],
        ['Steigung $m = ', 'Pendenza $m = '], ['Achsenabschnitt $n = ', 'Intercetta $n = '], ['$ (weißer Punkt)', '$ (punto bianco)'],
        [' · Nullstelle $x_0 = ', ' · zero $x_0 = '], [' · waagerechte Gerade', ' · retta orizzontale'],
        // parabel
        ['Für $a = 0$ ist der Graph keine Parabel, sondern eine Gerade.', 'Per $a = 0$ il grafico non è una parabola, ma una retta.'],
        ['eine (doppelte) Nullstelle: $x = ', 'uno zero (doppio): $x = '], ['Nullstellen: $x_1 = ', 'zeri: $x_1 = '],
        ['Scheitelpunktform: $f(x) = ', 'Forma del vertice: $f(x) = '], [' · Scheitel $S(', ' · vertice $S('], ['Normalform: $f(x) = ', 'Forma normale: $f(x) = '],
        // wurf
        ['Höchster Punkt nach $t_S = ', 'Punto più alto dopo $t_S = '], ['Aufprall nach $', 'Impatto dopo $'],
        // einheitskreis, sinus, tageslaenge
        ['$ im Bogenmaß · ', '$ in radianti · '], ['Amplitude $|a| = ', 'Ampiezza $|a| = '], [' · Periode $p = ', ' · periodo $p = '],
        [' · Mittellinie $y = ', ' · linea mediana $y = '], [' · Wertebereich $', ' · insieme immagine $'], ['$ · am ', '$ · il '],
        [' min</b> Tageslicht', ' min</b> di luce'],
        // regression, anscombe
        ['Wann ist die Kerze abgebrannt?', 'Quando sarà consumata la candela?'], ['Bremsweg bei 150 km/h?', 'Spazio di frenata a 150 km/h?'],
        ['Temperaturunterschied nach 45 min?', 'Differenza di temperatura dopo 45 min?'], ['Prognose für 2050?', 'Previsione per il 2050?'],
        ['Regressionsfunktion: $', 'Funzione di regressione: $'], [' &nbsp;mit $x$ = Jahre seit 1950', ' &nbsp;con $x$ = anni dal 1950'],
        ['Bestimmtheitsmaß $R^2 = ', 'Coefficiente di determinazione $R^2 = '], ['(passt sehr gut)', '(si adatta molto bene)'], ['(passt gut)', '(si adatta bene)'],
        ['(passt mäßig)', '(si adatta così così)'], [' Das Modell sagt: $f(', ' Il modello prevede: $f('], ['Regressionsgerade: $', 'Retta di regressione: $'],
        ['Datensatz', 'Insieme di dati'],
        // umkehr, expgleichung
        ['$ · Der Punkt $P(', '$ · Il punto $P('], ['$ auf $f$ wird zum Punkt $P', '$ su $f$ diventa il punto $P'], ['$ auf $f^{-1}$.', '$ su $f^{-1}$.'],
        ['Keine Lösung: $', 'Nessuna soluzione: $'], ['Probe: $', 'Verifica: $'],
        // parameter ("Der Graph ist …": il grafico, masculine)
        [': strecken in $y$-Richtung', ': dilatare nella direzione $y$'], [': verschieben in $y$-Richtung', ': traslare nella direzione $y$'],
        [': stauchen in $x$-Richtung', ': comprimere nella direzione $x$'], [': verschieben in $x$-Richtung', ': traslare nella direzione $x$'],
        ['gespiegelt an der $x$-Achse', 'riflesso rispetto all’asse $x$'], ['gespiegelt an der $y$-Achse', 'riflesso rispetto all’asse $y$'],
        [', in $x$-Richtung mit Faktor ', ', scalato nella direzione $x$ con fattore '], ['Der Graph ist ', 'Il grafico è '],
        // helpers: CURVES (funktion), SCHAREN (parabelschar), reported for every page that loads the module
        ['Rechts von $x = -1$ trifft jede senkrechte Gerade die Kurve zweimal: ', 'A destra di $x = -1$ ogni retta verticale interseca la curva due volte: '],
        ['Eine Funktion ordnet jedem $x$ aber genau ein $y$ zu.', 'Ma una funzione associa a ogni $x$ esattamente un $y$.'],
        ['zwei Nullstellen $x = 0$ und $x = -a$', 'due zeri $x = 0$ e $x = -a$'],
        ['zwei Nullstellen ', 'due zeri '], ['eine (doppelte) Nullstelle ', 'uno zero (doppio) '], ['eine doppelte Nullstelle ', 'uno zero doppio '],
        ['keine Parabel, sondern die Gerade $y = -4$: keine Nullstelle', 'non è una parabola, ma la retta $y = -4$: nessuno zero'],
        ['keine Parabel, sondern die Gerade $y = -4$', 'non è una parabola, ma la retta $y = -4$'],
        [': keine Nullstelle', ': nessuno zero'], ['keine Nullstelle', 'nessuno zero'],
        ['Diskriminante: $', 'Discriminante: $'], ['$ hat $D = ', '$ ha $D = '], ['Ausklammern: $', 'Raccogliendo: $'],
        ['$. Die Scheitel $S\\left(-\\tfrac{a}{2} \\mid -\\tfrac{a^2}{4}\\right)$ liegen alle auf der Parabel $y = -x^2$ (gestrichelt).',
            '$. I vertici $S\\left(-\\tfrac{a}{2}, -\\tfrac{a^2}{4}\\right)$ stanno tutti sulla parabola $y = -x^2$ (tratteggiata).'],
        ['Ausklammern: $x^2 + ax = x(x + a) = 0$. Die Scheitel $S\\left(-\\tfrac{a}{2} \\mid -\\tfrac{a^2}{4}\\right)$ liegen alle auf der Parabel $y = -x^2$ (gestrichelt).',
            'Raccogliendo: $x^2 + ax = x(x + a) = 0$. I vertici $S\\left(-\\tfrac{a}{2}, -\\tfrac{a^2}{4}\\right)$ stanno tutti sulla parabola $y = -x^2$ (tratteggiata).'],
        ['nach unten geöffnet mit dem Scheitel ', 'aperta verso il basso con il vertice '],
        ['$kx^2 = 4$ hat nur für $k > 0$ Lösungen. Der Fall $k = 0$ muss extra betrachtet werden, weil dann das $x^2$ verschwindet.',
            '$kx^2 = 4$ ha soluzioni solo per $k > 0$. Il caso $k = 0$ va studiato a parte, perché allora sparisce $x^2$.'],
        // book it-2 mathe12-it:
        ['$. Die Scheitel $S', '$. I vertici $S'],
        [' liegen alle auf der Parabel $y = -x^2$ (gestrichelt).', ' stanno tutti sulla parabola $y = -x^2$ (tratteggiata).'],
        ['Rechts von $x = -1$ trifft jede senkrechte Gerade die Kurve zweimal: Zu $x = 1$ gehören $y = 2$ und $y = -2$.', 'A destra di $x = -1$ ogni retta verticale taglia la curva due volte: a $x = 1$ corrispondono $y = 2$ e $y = -2$.'],
        ['Zu $x = 2$ gehören $y = 2$ und $y = -2$. Eine Funktion ordnet jedem $x$ aber genau ein $y$ zu.', 'A $x = 2$ corrispondono $y = 2$ e $y = -2$. Ma una funzione associa a ogni $x$ esattamente un $y$.'],
        ['Eine Funktion ordnet jedem $x$ aber genau ein $y$ zu.', 'Ma una funzione associa a ogni $x$ esattamente un $y$.'],
        ['$ und $y = ', '$ e $y = '],
        ['$ und $', '$ e $'],
        ['zwei Nullstellen $x = 0$ und $x = -a$', 'due zeri $x = 0$ e $x = -a$'],
        ['zwei Nullstellen ', 'due zeri '],
        ['eine (doppelte) Nullstelle ', 'uno zero (doppio) '],
        ['eine doppelte Nullstelle ', 'uno zero doppio '],
        [': keine Nullstelle', ': nessuno zero'],
        ['keine Nullstelle', 'nessuno zero'],
        ['Diskriminante: $', 'Discriminante: $'],
        ['$ hat $D = ', '$ ha $D = '],
        // book it-3 mathe13-it:
        // book it-4 mathefos11-it:
        // funktion
        ['$ · Bei $x = ', '$ · In $x = '], ['$ trifft die Senkrechte die Kurve <b>', '$ la verticale interseca la curva <b>'],
        ['gar nicht', 'in nessun punto'], ['genau einmal', 'esattamente una volta'],
        ['Jede senkrechte Gerade trifft die Kurve höchstens einmal: eine Funktion. ', 'Ogni retta verticale interseca la curva al massimo una volta: è una funzione. '],
        // lage
        ['Gleicher Anstieg und gleicher Achsenabschnitt: <b>identisch</b>. Jeder Punkt ist gemeinsam.', 'Stessa pendenza e stessa intercetta: <b>coincidenti</b>. Tutti i punti sono in comune.'],
        ['Gleicher Anstieg $m_1 = m_2$, verschiedene Achsenabschnitte: <b>parallel</b>. Es gibt keinen Schnittpunkt.',
            'Stessa pendenza $m_1 = m_2$, intercette diverse: <b>parallele</b>. Non c’è nessun punto di intersezione.'],
        ['$: Die Geraden sind <b>orthogonal</b> (senkrecht zueinander).', '$: le rette sono <b>perpendicolari</b> (ortogonali).'],
        ['Verschiedene Anstiege: Die Geraden <b>schneiden</b> sich.', 'Pendenze diverse: le rette si <b>intersecano</b>.'],
        ['Gleichsetzen: $', 'Uguagliando: $'], ['$ ergibt $x = ', '$ dà $x = '], ['$, also ', '$, quindi '], [' · Schnittwinkel $', ' · angolo di intersezione $'],
        ['parallel zur $x$-Achse', 'parallela all’asse $x$'],

        // book it-5 mathefos12-it:

        // book it-6 mathegy11-it:
        // ganzrational ("$x = 1$: doppelt → …": a double zero)
        [': einfach → ', ': semplice → '], [': doppelt → ', ': doppio → '], [': dreifach → ', ': triplo → '], [': vierfach → ', ': quadruplo → '],
        [': fünffach → ', ': quintuplo → '], [': sechsfach → ', ': sestuplo → '], [': siebenfach → ', ': settuplo → '], [': achtfach → ', ': ottuplo → '],
        [': neunfach → ', ': nonuplo → '],
        ['Vorzeichenwechsel, der Graph <b>schneidet</b> die $x$-Achse', 'cambio di segno, il grafico <b>taglia</b> l’asse $x$'],
        ['Vorzeichenwechsel, der Graph schneidet die $x$-Achse <b>flach</b> (Sattelpunkt)', 'cambio di segno, il grafico taglia l’asse $x$ <b>appiattendosi</b> (flesso a tangente orizzontale)'],
        ['kein Vorzeichenwechsel, der Graph <b>berührt</b> die $x$-Achse', 'nessun cambio di segno, il grafico <b>tocca</b> l’asse $x$'],
        ['$ · Grad $', '$ · grado $'], ['Für $x \\to +\\infty$ geht $f(x) \\to ', 'Per $x \\to +\\infty$, $f(x) \\to '],
        ['$, für $x \\to -\\infty$ geht $f(x) \\to ', '$; per $x \\to -\\infty$, $f(x) \\to '],
        ['Es entscheidet nur der Summand mit der höchsten Potenz: $', 'Decide solo l’addendo con la potenza più alta: $'],

        // book it-7 mathegy11lk-it:

        // book it-8 mathegy12-it:

        // book it-9 mathegy12lk-it:
    ],
    rule: [
        // book it-1 mathe11-it:
        // tageslaenge: "21. Jun" → "21 giu"
        [/(\d+)\. (Jan|Feb|Mär|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Dez)(?![a-zä])/g, (m, d, mo) => d + ' ' + { Jan: 'gen', Feb: 'feb', 'Mär': 'mar', Apr: 'apr', Mai: 'mag', Jun: 'giu', Jul: 'lug', Aug: 'ago', Sep: 'set', Okt: 'ott', Nov: 'nov', Dez: 'dic' }[mo]],
        // parabel
        [/keine Nullstellen: Der Scheitel liegt (über|unter) der \$x\$-Achse und die Parabel ist nach (oben|unten) geöffnet\./g,
            (m, a, b) => 'nessuno zero: il vertice sta ' + (a === 'über' ? 'sopra' : 'sotto') + ' l’asse $x$ e la parabola è aperta verso ' + (b === 'oben' ? 'l’alto' : 'il basso') + '.'],
        // wurf: "… in $8{,}84\,\text{m}$ Höhe."
        [/\$ in \$([^$]*)\$ Höhe\. /g, (m, h) => '$ a un’altezza di $' + h + '$. '],
        // expgleichung
        [/\^x\$ ist immer positiv, kann also nie \$([^$]*)\$ werden\./g, (m, b) => '^x$ è sempre positivo, quindi non può mai valere $' + b + '$.'],
        // parameter (il grafico: masculine)
        [/in \$([xy])\$-Richtung mit Faktor \$([^$]+)\$ (gestreckt|gestaucht)/g,
            (m, ax, f, w) => (w === 'gestreckt' ? 'dilatato' : 'compresso') + ' nella direzione $' + ax + '$ con fattore $' + f + '$'],
        [/ und mit \$([^$]+)\$ gestreckt/g, (m, f) => ' e dilatato con fattore $' + f + '$'],
        [/um \$([^$]+)\$ nach (links|rechts|oben|unten) verschoben/g,
            (m, c, d) => 'traslato di $' + c + '$ ' + { links: 'verso sinistra', rechts: 'verso destra', oben: 'verso l’alto', unten: 'verso il basso' }[d]],
        // graphquiz score: "3 richtig" → "3 giuste" (the shared "richtig" → "corretto" would not agree with the number)
        [/^(\d+) richtig$/, (m, n) => n + (n === '1' ? ' giusta' : ' giuste')],
        // helpers: CURVES (funktion) - whole sentences as rules, before the header rule "^Zu " → "Riguardo a " of js/buch-it.js
        [/Rechts von \$x = -1\$ trifft jede senkrechte Gerade die Kurve zweimal: Zu \$x = 1\$ gehören \$y = 2\$ und \$y = -2\$\./g,
            'A destra di $x = -1$ ogni retta verticale interseca la curva due volte: a $x = 1$ corrispondono $y = 2$ e $y = -2$.'],
        [/(: )?\bZu (\$x = [^$]+\$) gehören (\$y = [^$]+\$) und (\$y = [^$]+\$)\./g, (m, c, x, y1, y2) => (c ? ': a ' : 'A ') + x + ' corrispondono ' + y1 + ' e ' + y2 + '.'],
        // book it-2 mathe12-it:
        // helpers: CURVES (funktion) - the whole sentences, before the header rule "^Zu " of js/buch-it.js
        [/(: )?\bZu (\$x = [^$]+\$) gehören (\$y = [^$]+\$) und (\$y = [^$]+\$)\./g, (m, c, x, y1, y2) => (c ? ': a ' : 'A ') + x + ' corrispondono ' + y1 + ' e ' + y2 + '.'],
        // book it-3 mathe13-it:
        // book it-4 mathefos11-it:
        // funktion: "die Kurve <b>2-mal</b>"
        [/<b>(\d+)-mal<\/b>/g, '<b>$1 volte</b>'],

        // book it-5 mathefos12-it:

        // book it-6 mathegy11-it:

        // book it-7 mathegy11lk-it:

        // book it-8 mathegy12-it:

        // book it-9 mathegy12lk-it:
    ]
});
