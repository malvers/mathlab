/* js/buch-it/analysis.js — Italian for the widgets of js/buch-analysis.js.
 * Loaded by the Italian editions right after js/buch-analysis.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Package IT0 (18.10.2026) put in only the cover of the start page; every book writes only below its own comment line, each entry ending
 * with a comma, so the three books merge without a conflict. The Spanish file js/buch-es/analysis.js shows which German
 * strings the widgets write.
 * Round 2 (20.10.2026): six books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 */
window.BuchIT && BuchIT.add('analysis', {
    word: {
        // it0: the cover of the start page
        'Titelbild: Kurve mit Wendetangente und Ableitung, Binomialverteilung und ein Vektor im Raum':
            'Copertina: curva con tangente di flesso e derivata, distribuzione binomiale e un vettore nello spazio',
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        'Spur löschen': 'Cancella la traccia',
        'Neue Aufgabe': 'Nuovo esercizio',
        'Mauer': 'muro',
        'Annäherung, Schritt $k$': 'Avvicinamento, passo $k$',
        'Graph mit Annäherung an einen Grenzwert': 'Grafico che si avvicina a un limite',
        'Annäherung:': 'Avvicinamento:',
        'Richtung': 'Direzione',
        '$x$ links': '$x$ da sinistra',
        '$x$ rechts': '$x$ da destra',
        'Abstand $h$ von $P$ zu $Q$': 'Distanza $h$ da $P$ a $Q$',
        'Tangente zeigen': 'Mostra la tangente',
        'Tangente ausblenden': 'Nascondi la tangente',
        'Sekante durch P und Q nähert sich der Tangente': 'La secante per P e Q si avvicina alla tangente',
        'Ganzen Graphen von f′ zeigen': 'Mostra tutto il grafico di f′',
        'Oben: f mit Tangente. Ziehe den Punkt P. Unten: Jede Tangentensteigung wird zu einem Punkt des Graphen von f′.': 'Sopra: f con la tangente. Trascina il punto P. Sotto: ogni pendenza della tangente diventa un punto del grafico di f′.',
        'Graph von f mit Tangente': 'Grafico di f con la tangente',
        'Graph der Ableitung f Strich': 'Grafico della derivata f primo',
        'Potenzen': 'Potenze',
        'Summen': 'Somme',
        'Wurzeln und Brüche': 'Radici e frazioni',
        'eˣ und sin x': 'eˣ e sin x',
        'Produkte': 'Prodotti',
        'Gemischt': 'Misti',
        'Aufgabenart': 'Tipo di esercizio',
        'Lösung': 'Soluzione',
        'Zeige auch:': 'Mostra anche:',
        'f′ und f″': 'f′ e f″',
        'Ableitungen zeigen': 'Mostra le derivate',
        'Graph einer Funktion dritten Grades mit Extrem- und Wendepunkten': 'Grafico di una funzione di terzo grado con punti di estremo e di flesso',
        'fällt ↘': 'decresce ↘',
        'Intervall': 'Intervallo',
        'Hochpunkt': 'Massimo',
        'Tiefpunkt': 'Minimo',
        'keine Extrempunkte': 'nessun punto di estremo',
        'Tangente und Normale an einen Graphen': 'Tangente e normale a un grafico',
        'Parabel durch 3 Punkte': 'Parabola per 3 punti',
        'Kubisch: Extrempunkt + 2 Punkte': 'Cubica: punto di estremo + 2 punti',
        'Kubisch: Wendepunkt mit Tangente + Punkt': 'Cubica: punto di flesso con tangente + punto',
        'Bedingungen': 'Condizioni',
        'Steigung im Wendepunkt $m$': 'Pendenza nel punto di flesso $m$',
        'Funktion aus Bedingungen': 'Funzione a partire da condizioni',
        'Schachtel': 'Scatola',
        'Maximum': 'Massimo',
        'Dose': 'Lattina',
        'Minimum': 'Minimo',
        'Zaun an der Mauer': 'Recinzione lungo il muro',
        'Problem': 'Problema',
        'Zielfunktion': 'Funzione obiettivo',
        'Lösung mit der Ableitung': 'Soluzione con la derivata',
        'z. B. 6x^2 - 2 oder cos x': 'per es. 6x^2 - 2 o cos x',
        'z. B. x^3/3 - 2x oder -cos(2x)/2': 'per es. x^3/3 - 2x o -cos(2x)/2',
        'Lineare Verkettung': 'Composizione lineare',
        'Karton mit ausgeschnittenen Ecken': 'Cartone con gli angoli ritagliati',
        'Gehege an einer Mauer': 'Recinto lungo un muro',
        // book it-3 mathe13-it:
        'Funktionenschar': 'Famiglia di funzioni',
        'Funktionenschar mit Ortskurve': 'Famiglia di funzioni con il luogo geometrico',
        'Parameter $a$': 'Parametro $a$',
        'Verkaufspreis $p$ (€ pro Stück)': 'Prezzo di vendita $p$ (€ al pezzo)',
        'x in Stück': 'x in pezzi',
        'Kosten, Erlös und Gewinn': 'Costi, ricavo e profitto',
        // book it-4 mathefos11-it:

        // book it-5 mathefos12-it:
        'Titelbild: Exponentialkurve mit Hochpunkt, Wendetangente und Rechtecken darunter, eine Hyperbel mit Asymptoten und ein Parallelogramm im Raum mit seinem Vektorprodukt':
            'Copertina: curva esponenziale con punto di massimo, tangente di flesso e rettangoli sotto, un’iperbole con i suoi asintoti e un parallelogramma nello spazio con il suo prodotto vettoriale',
        // efunktion
        'Welche Basis?': 'Quale base?', 'Zinseszins': 'Interesse composto', 'Was wird gezeigt?': 'Che cosa si mostra?', 'a = e setzen': 'Poni a = e', 'Basis $a$': 'Base $a$',
        'Exponentialfunktionen und die Eulersche Zahl e': 'Funzioni esponenziali e il numero di Nepero e', 'Faktor $a$': 'Fattore $a$', 'im Exponenten $b$': 'Nell’esponente $b$',
        'Verschiebung $c$': 'Traslazione $c$', 'Verzinsung': 'Capitalizzazione',
        // the slider value after "Capitalizzazione" (short, so the row fits at 390 px); in the sentence below the adverbs of the phrases
        'jährlich': 'annuale', 'halbjährlich': 'semestrale', 'vierteljährlich': 'trimestrale', 'monatlich': 'mensile', 'wöchentlich': 'settimanale',
        'täglich': 'giornaliera', 'stündlich': 'oraria', 'minütlich': 'al minuto',
        // bruchfunktion: the same entries as the it-6 block (GY 11, branch it-mathegy11), so the books agree - keep one copy when merging
        'Polstelle': 'Polo', 'Lücke': 'Buco', 'ohne Vorzeichenwechsel': 'Senza cambio di segno', 'schiefe Asymptote': 'Asintoto obliquo',
        'Graph einer gebrochenrationalen Funktion mit Polstellen, Lücken und Asymptoten': 'Grafico di una funzione razionale fratta con poli, buchi e asintoti',
        'Zähler:': 'Numeratore:', 'Nenner:': 'Denominatore:', 'Grad des Zählers': 'Grado del numeratore', 'Grad des Nenners': 'Grado del denominatore',
        'Grad 0': 'Grado 0', 'Grad 1': 'Grado 1', 'Grad 2': 'Grado 2', 'Faktor $k$': 'Fattore $k$', 'Beispiele:': 'Esempi:',

        // book it-6 mathegy11-it:
        // bruchfunktion
        'Polstelle': 'Polo', 'Lücke': 'Buco', 'ohne Vorzeichenwechsel': 'Senza cambio di segno', 'schiefe Asymptote': 'Asintoto obliquo',
        'Graph einer gebrochenrationalen Funktion mit Polstellen, Lücken und Asymptoten': 'Grafico di una funzione razionale fratta con poli, buchi e asintoti',
        'Zähler:': 'Numeratore:', 'Nenner:': 'Denominatore:', 'Grad des Zählers': 'Grado del numeratore', 'Grad des Nenners': 'Grado del denominatore',
        'Grad 0': 'Grado 0', 'Grad 1': 'Grado 1', 'Grad 2': 'Grado 2', 'Faktor $k$': 'Fattore $k$', 'Beispiele:': 'Esempi:',

        // book it-7 mathegy11lk-it:

        // book it-8 mathegy12-it:

        // book it-9 mathegy12lk-it:
    },
    phrase: [
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        ['Potenzregel $(x^n)\' = n\\,x^{n-1}$ und Faktorregel: Der Faktor bleibt stehen.', 'Regola della potenza $(x^n)\' = n\\,x^{n-1}$ e regola del fattore costante: il fattore resta.'],
        ['Summenregel: Jeder Summand wird einzeln abgeleitet. Ein konstanter Summand fällt weg.', 'Regola della somma: ogni addendo si deriva separatamente. Un addendo costante sparisce.'],
        ['Die Potenzregel gilt auch für rationale Exponenten: $(x^r)\' = r\\,x^{r-1}$.', 'La regola della potenza vale anche per esponenti razionali: $(x^r)\' = r\\,x^{r-1}$.'],
        ['$(\\mathrm{e}^x)\' = \\mathrm{e}^x$ und $(\\sin x)\' = \\cos x$.', '$(\\mathrm{e}^x)\' = \\mathrm{e}^x$ e $(\\sin x)\' = \\cos x$.'],
        ['$(\\sin x)\' = \\cos x$, und $(c \\cdot x)\' = c$.', '$(\\sin x)\' = \\cos x$, e $(c \\cdot x)\' = c$.'],
        ['Produktregel $(u \\cdot v)\' = u\'v + uv\'$ mit $u = x$, $v = \\mathrm{e}^x$.', 'Regola del prodotto $(u \\cdot v)\' = u\'v + uv\'$ con $u = x$, $v = \\mathrm{e}^x$.'],
        ['$ mit $', '$ con $'],
        ['Produktregel mit $u = ', 'Regola del prodotto con $u = '],
        ['Potenzregel rückwärts: Exponent um 1 erhöhen, durch den neuen Exponenten teilen, $\\int x^n\\,\\mathrm{d}x = \\dfrac{x^{n+1}}{n+1} + C$.', 'Regola della potenza al contrario: aumenta l’esponente di 1 e dividi per il nuovo esponente, $\\int x^n\\,\\mathrm{d}x = \\dfrac{x^{n+1}}{n+1} + C$.'],
        ['Summen- und Faktorregel: Jeder Summand wird einzeln integriert, ein Faktor bleibt stehen. Eine Konstante $a$ hat die Stammfunktion $ax$.', 'Regole della somma e del fattore costante: ogni addendo si integra separatamente, un fattore resta. Una costante $a$ ha la primitiva $ax$.'],
        ['$: Exponent $\\tfrac12 + 1 = \\tfrac32$, durch $\\tfrac32$ teilen heißt mit $\\tfrac23$ malnehmen.', '$: esponente $\\tfrac12 + 1 = \\tfrac32$; dividere per $\\tfrac32$ significa moltiplicare per $\\tfrac23$.'],
        ['$: Exponent $-1$, durch $-1$ teilen, also $-x^{-1} = -\\tfrac1x$.', '$: esponente $-1$, dividere per $-1$, cioè $-x^{-1} = -\\tfrac1x$.'],
        ['$: Exponent $\\tfrac12$, durch $\\tfrac12$ teilen heißt verdoppeln.', '$: esponente $\\tfrac12$; dividere per $\\tfrac12$ significa raddoppiare.'],
        ['Die Potenzregel gilt für jeden Exponenten $r \\neq -1$: $\\int x^r\\,\\mathrm{d}x = \\dfrac{x^{r+1}}{r+1} + C$.', 'La regola della potenza vale per ogni esponente $r \\neq -1$: $\\int x^r\\,\\mathrm{d}x = \\dfrac{x^{r+1}}{r+1} + C$.'],
        ['$ ist seine eigene Ableitung, also auch seine eigene Stammfunktion.', '$ è la derivata di se stessa, quindi anche la primitiva di se stessa.'],
        ['Die Lücke der Potenzregel: $\\int \\tfrac1x\\,\\mathrm{d}x = \\ln|x| + C$. Für $x > 0$ reicht $\\ln x$.', 'L’eccezione della regola della potenza: $\\int \\tfrac1x\\,\\mathrm{d}x = \\ln|x| + C$. Per $x > 0$ basta $\\ln x$.'],
        ['Für $', 'Per $'],
        ['$. Für $', '$. Per $'],
        ['Lineare Verkettung: $\\int \\mathrm{e}^{ax+b}\\,\\mathrm{d}x = \\tfrac1a\\,\\mathrm{e}^{ax+b} + C$. Probe: Die Kettenregel liefert den Faktor $a$, $\\tfrac1a$ hebt ihn auf.', 'Composizione lineare: $\\int \\mathrm{e}^{ax+b}\\,\\mathrm{d}x = \\tfrac1a\\,\\mathrm{e}^{ax+b} + C$. Verifica: la regola della catena dà il fattore $a$ e $\\tfrac1a$ lo annulla.'],
        ['$: erst die Stammfunktion von $\\sin$, dann durch die innere Ableitung $a$ teilen.', '$: prima la primitiva di $\\sin$, poi dividi per la derivata della funzione interna $a$.'],
        ['$: Potenzregel für die Klammer, dann durch die innere Ableitung teilen.', '$: regola della potenza per la parentesi, poi dividi per la derivata della funzione interna.'],
        ['links gegen $-\\infty$, rechts gegen $+\\infty$: kein Grenzwert, senkrechte Asymptote $x = 1$', 'tende a $-\\infty$ da sinistra e a $+\\infty$ da destra: non c’è limite, asintoto verticale $x = 1$'],
        ['wächst über alle Grenzen: $f(x) \\to \\infty$, kein Grenzwert', 'cresce oltre ogni limite: $f(x) \\to \\infty$, non c’è limite'],
        ['Bei $x = 0$ ist $f$ nicht definiert. Die Werte kommen trotzdem beliebig nah an 1 heran.', 'In $x = 0$ $f$ non è definita. Eppure i valori si avvicinano a 1 quanto si vuole.'],
        ['An der Stelle $x = 1$ ist $f$ nicht definiert, der Graph hat dort ein Loch. Der Grenzwert existiert trotzdem: Kürzen gibt $\\tfrac{(x-1)(x+1)}{x-1} = x + 1 \\to 2$.', 'In $x = 1$ $f$ non è definita: lì il grafico ha un buco. Il limite esiste lo stesso: semplificando si ottiene $\\tfrac{(x-1)(x+1)}{x-1} = x + 1 \\to 2$.'],
        ['Bei $', 'In $'],
        ['Der Graph pendelt um die $x$-Achse, die Ausschläge werden immer kleiner.', 'Il grafico oscilla attorno all’asse $x$ e le oscillazioni diventano sempre più piccole.'],
        ['$ für $', '$ per $'],
        ['Waagerechte Asymptote: $y = ', 'Asintoto orizzontale: $y = '],
        ['$ mit $h = ', '$ con $h = '],
        ['Tangentensteigung: $', 'Pendenza della tangente: $'],
        ['· Für $h \\to 0$ wird aus der Sekante die Tangente.', '· Per $h \\to 0$ la secante diventa la tangente.'],
        ['· Mach $h$ kleiner.', '· Rimpicciolisci $h$.'],
        ['$ · Steigung in $P', '$ · pendenza in $P'],
        ['Leite ab: $f(x) = ', 'Deriva: $f(x) = '],
        ['Das kann ich nicht lesen. Schreibe zum Beispiel ', 'Non riesco a leggerlo. Scrivi per esempio '],
        ['<b>Richtig!</b>', '<b>Corretto!</b>'],
        ['Noch nicht. Tipp: ', 'Non ancora. Suggerimento: '],
        [' · Sattelpunkt bei $x = ', ' · flesso a tangente orizzontale in $x = '],
        ['Wendepunkt $W', 'Punto di flesso $W'],
        ['$: Dort ist $f\'\'(x) = 0$ und die Steigung ', '$: lì $f\'\'(x) = 0$ e la pendenza è '],
        ['am kleinsten', 'minima'],
        ['am größten', 'massima'],
        ['Für $a = 0$ ist $f$ eine Parabel (oder Gerade) ohne Wendepunkt.', 'Per $a = 0$ $f$ è una parabola (o una retta) senza punto di flesso.'],
        ['$ · Berührpunkt $P', '$ · punto di tangenza $P'],
        ['Normale (senkrecht zur Tangente, $m_n = -\\tfrac{1}{m_t}$): $', 'Normale (perpendicolare alla tangente, $m_n = -\\tfrac{1}{m_t}$): $'],
        ['Lösung: $f(x) = ', 'Soluzione: $f(x) = '],
        ['Achtung: Bei $E$ ist $f\'\'(x) = 0$, das ist ein Sattelpunkt, kein Extrempunkt.', 'Attenzione: in $E$ si ha $f\'\'(x) = 0$; è un flesso a tangente orizzontale, non un punto di estremo.'],
        ['Probe: $', 'Verifica: $'],
        ['< 0$, also ein Hochpunkt.', '< 0$, quindi un massimo.'],
        ['> 0$, also ein Tiefpunkt.', '> 0$, quindi un minimo.'],
        ['Mit diesen Bedingungen hat das Gleichungssystem keine eindeutige Lösung. Zwei Punkte mit gleichem $x$?', 'Con queste condizioni il sistema di equazioni non ha un’unica soluzione. Due punti con la stessa $x$?'],
        ['Ansatz: $f(x) = ', 'Impostazione: $f(x) = '],
        ['Aus einem Karton von 30 cm × 20 cm werden an den Ecken Quadrate mit der Seite $x$ ausgeschnitten und die Ränder hochgeklappt. Für welches $x$ wird das Volumen der offenen Schachtel am größten?', 'Da un cartone di 30 cm × 20 cm si ritagliano agli angoli quadrati di lato $x$ e si piegano i bordi verso l’alto. Per quale $x$ il volume della scatola aperta è massimo?'],
        ['Eine zylindrische Dose soll 1 Liter fassen ($V = \\pi r^2 h = 1000\\,\\text{cm}^3$). Für welchen Radius $r$ braucht man am wenigsten Blech?', 'Una lattina cilindrica deve contenere 1 litro ($V = \\pi r^2 h = 1000\\,\\text{cm}^3$). Con quale raggio $r$ serve la minor quantità di lamiera?'],
        ['Mit 60 m Zaun soll an einer Mauer ein rechteckiges Gehege abgesteckt werden. Die Mauer bildet eine Seite. Wie groß wird die Fläche höchstens?', 'Con 60 m di recinzione si vuole delimitare un recinto rettangolare lungo un muro. Il muro forma un lato. Al massimo quanto può essere grande l’area?'],
        [' Die zweite Lösung $x \\approx ', ' La seconda soluzione $x \\approx '],
        ['$ liegt außerhalb von $0 < x < 10$.', '$ è fuori da $0 < x < 10$.'],
        [' Dann ist $h = ', ' Allora $h = '],
        ['$: Die beste Dose ist so hoch wie breit.', '$: la lattina migliore è alta quanto larga.'],
        [' Die Seite parallel zur Mauer ist dann $60 - 2 \\cdot 15 = 30\\,\\text{m}$ lang.', ' Il lato parallelo al muro è allora lungo $60 - 2 \\cdot 15 = 30\\,\\text{m}$.'],
        // book it-3 mathe13-it:
        [' Ortskurve der Extrempunkte zeigen', ' Mostra il luogo geometrico dei punti di estremo'],
        ['Für $a \\le 0$ gibt es keine Extrempunkte: $f_a\'(x) = 3x^2 - a$ hat dann keine Nullstelle mit Vorzeichenwechsel.', 'Per $a \\le 0$ non ci sono punti di estremo: $f_a\'(x) = 3x^2 - a$ non ha allora nessuno zero con cambio di segno.'],
        [' mit Vorzeichenwechsel', ' con cambio di segno'],
        ['Jede Parabel der Schar geht durch den Ursprung, denn $f_a(0) = 0$ für alle $a$.', 'Ogni parabola della famiglia passa per l’origine, perché $f_a(0) = 0$ per ogni $a$.'],
        ['Ortskurve aller Extrempunkte (violett): $', 'Luogo geometrico di tutti i punti di estremo (viola): $'],
        ['Gewinnschwelle bei $x \\approx ', 'Soglia di profitto in $x \\approx '],
        ['$, Gewinngrenze bei $x \\approx ', '$, limite di profitto in $x \\approx '],
        ['$ Stück, $G \\approx ', '$ pezzi, $G \\approx '],
        ['$ Stück.', '$ pezzi.'],
        ['Gewinn ab $x \\approx ', 'Profitto da $x \\approx '],
        ['Bei diesem Preis wird nie Gewinn gemacht.', 'Con questo prezzo non si fa mai profitto.'],
        ['Gewinnmaximum: $G\'(x) = 0$ bei $x \\approx ', 'Profitto massimo: $G\'(x) = 0$ in $x \\approx '],
        ['Kein positives Gewinnmaximum.', 'Nessun profitto massimo positivo.'],
        // book it-4 mathefos11-it:

        // book it-5 mathefos12-it:
        // efunktion (the engine has already written the point (0 \mid 1) as (0, 1) here: the rules run before the pieces)
        [' · Steigung in $(0, 1)$: $', ' · pendenza in $(0, 1)$: $'],
        ['<b>Treffer:</b> Bei $a = \\mathrm{e} \\approx 2{,}71828$ ist die Steigung genau $1$ und $f\'(x) = f(x)$: Die Graphen von $f$ und $f\'$ liegen aufeinander.',
            '<b>Centro!</b> Con $a = \\mathrm{e} \\approx 2{,}71828$ la pendenza è esattamente $1$ e $f\'(x) = f(x)$: i grafici di $f$ e di $f\'$ coincidono.'],
        ['Die Ableitung ist $f\'(x) = ', 'La derivata è $f\'(x) = '],
        [' \\cdot f(x)$, ein Vielfaches von $f$. Für welche Basis ist der Faktor genau $1$?', ' \\cdot f(x)$, un multiplo di $f$. Per quale base il fattore è esattamente $1$?'],
        [' · Mit $a = 0$ oder $b = 0$ ist $f$ konstant.', ' · Con $a = 0$ o $b = 0$, $f$ è costante.'],
        ['Schnittpunkt mit der $y$-Achse: $', 'Intersezione con l’asse $y$: $'], [' · Nullstelle: ', ' · zero: '],
        ['keine, denn $\\mathrm{e}^{bx} > 0$ kann nicht $', 'nessuno, perché $\\mathrm{e}^{bx} > 0$ non può valere $'], ['$ sein</p>', '$</p>'],
        ['Für $', 'Per $'], ['$ geht $f(x) \\to ', '$, $f(x) \\to '], ['$: waagerechte Asymptote $y = ', '$: asintoto orizzontale $y = '], ['$. Für $', '$. Per $'],
        ['$f$ ist überall streng monoton ', '$f$ è ovunque strettamente '], ['steigend', 'crescente'], ['fallend', 'decrescente'],
        [', weil $f\'(x)$ immer ', ', perché $f\'(x)$ è sempre '], ['positiv ist.', 'positiva.'], ['negativ ist.', 'negativa.'],
        ['Ein Euro, 100 % Zinsen im Jahr, ', 'Un euro, il 100 % di interesse all’anno, accreditato '], [' verzinst: ', ': '], ['-mal $\\tfrac{100\\,\\%}{', ' volte $\\tfrac{100\\,\\%}{'],
        ['jährlich', 'annualmente'], ['halbjährlich', 'semestralmente'], ['vierteljährlich', 'trimestralmente'], ['monatlich', 'mensilmente'], ['wöchentlich', 'settimanalmente'],
        ['täglich', 'giornalmente'], ['stündlich', 'ogni ora'], ['minütlich', 'ogni minuto'],
        ['Je öfter verzinst wird, desto näher kommt das Guthaben an $\\mathrm{e} = 2{,}718281\\ldots$ heran, aber nie darüber: $',
            'Più spesso si accreditano gli interessi, più il saldo si avvicina a $\\mathrm{e} = 2{,}718281\\ldots$, ma senza mai superarlo: $'],
        // bruchfunktion: as in the it-6 block, except "Zählergrad um 1 größer" (it-6: "maggiore di 1" would mean "greater than 1")
        ['Nullstelle des Zählers $', 'Zero del numeratore $'], ['Nullstelle des Nenners $', 'Zero del denominatore $'],
        ['Nach dem Kürzen steht kein $x$ mehr im Nenner: Der Graph ist ', 'Dopo la semplificazione al denominatore non resta più nessuna $x$: il grafico è '],
        ['eine waagerechte Gerade', 'una retta orizzontale'], ['eine Gerade', 'una retta'],
        ['Zählergrad kleiner als Nennergrad: waagerechte Asymptote $y = 0$, die $x$-Achse.', 'Grado del numeratore minore del grado del denominatore: asintoto orizzontale $y = 0$, l’asse $x$.'],
        ['Zählergrad gleich Nennergrad: waagerechte Asymptote $y = ', 'Grado del numeratore uguale al grado del denominatore: asintoto orizzontale $y = '],
        ['$ (Quotient der Leitkoeffizienten).', '$ (quoziente dei coefficienti direttivi).'],
        ['Zählergrad um 1 größer: Polynomdivision ergibt $f(x) = ', 'Grado del numeratore più alto di 1: la divisione tra polinomi dà $f(x) = '],
        ['$, schiefe Asymptote $y = ', '$, asintoto obliquo $y = '],
        ['Kürzen: $f(x) = ', 'Semplificando: $f(x) = '], ['$ für $x \\neq ', '$ per $x \\neq '],
        ['$ · hebbare Lücken', '$ · buchi (discontinuità eliminabili)'], ['$ · hebbare Lücke', '$ · buco (discontinuità eliminabile)'],
        ['Nullstellen: ', 'Zeri: '], [' · Polstellen: ', ' · poli: '],
        [' mit Vorzeichenwechsel', ' con cambio di segno'], [' ohne Vorzeichenwechsel', ' senza cambio di segno'], [' (senkrechte Asymptote)', ' (asintoto verticale)'],

        // book it-6 mathegy11-it:
        // bruchfunktion
        ['Nullstelle des Zählers $', 'Zero del numeratore $'], ['Nullstelle des Nenners $', 'Zero del denominatore $'],
        ['Nach dem Kürzen steht kein $x$ mehr im Nenner: Der Graph ist ', 'Dopo la semplificazione al denominatore non resta più nessuna $x$: il grafico è '],
        ['eine waagerechte Gerade', 'una retta orizzontale'], ['eine Gerade', 'una retta'],
        ['Zählergrad kleiner als Nennergrad: waagerechte Asymptote $y = 0$, die $x$-Achse.', 'Grado del numeratore minore del grado del denominatore: asintoto orizzontale $y = 0$, l’asse $x$.'],
        ['Zählergrad gleich Nennergrad: waagerechte Asymptote $y = ', 'Grado del numeratore uguale al grado del denominatore: asintoto orizzontale $y = '],
        ['$ (Quotient der Leitkoeffizienten).', '$ (quoziente dei coefficienti direttivi).'],
        ['Zählergrad um 1 größer: Polynomdivision ergibt $f(x) = ', 'Grado del numeratore maggiore di 1: la divisione tra polinomi dà $f(x) = '],
        ['$, schiefe Asymptote $y = ', '$, asintoto obliquo $y = '],
        ['Kürzen: $f(x) = ', 'Semplificando: $f(x) = '], ['$ für $x \\neq ', '$ per $x \\neq '],
        ['$ · hebbare Lücken', '$ · buchi (discontinuità eliminabili)'], ['$ · hebbare Lücke', '$ · buco (discontinuità eliminabile)'],
        ['Nullstellen: ', 'Zeri: '], [' · Polstellen: ', ' · poli: '],
        [' mit Vorzeichenwechsel', ' con cambio di segno'], [' ohne Vorzeichenwechsel', ' senza cambio di segno'], [' (senkrechte Asymptote)', ' (asintoto verticale)'],

        // book it-7 mathegy11lk-it:

        // book it-8 mathegy12-it:

        // book it-9 mathegy12lk-it:
    ],
    rule: [
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        // kurve: the sliders "$a$ (vor $x^3$)" → "$a$ (coefficiente di $x^3$)"
        [/\(vor (\$x(?:\^\d)?\$)\)/g, '(coefficiente di $1)'],
        // ableiten: "3 von 5 gelöst"
        [/(\d+) von (\d+) gelöst/g, '$1 su $2 risolti'],
        // book it-3 mathe13-it:
        // book it-4 mathefos11-it:

        // book it-5 mathefos12-it:
        // efunktion: "1-mal $\tfrac…" is "1 volta" (the pieces make "volte" of every other number)
        [/(?<![\d.])1-mal \$/g, '1 volta $$'],
        // bruchfunktion (as in the it-6 block): "… mit einem Loch.", "Nullstellen: keine", and the set of the domain "\{1; -2\}" → "\{1, -2\}" when no number has a decimal comma
        [/ mit (Löchern|einem Loch)\./g, (m, w) => ' con ' + (w === 'Löchern' ? 'dei buchi' : 'un buco') + '.'],
        [/Nullstellen: keine(?![a-zäöüß])/g, 'Zeri: nessuno'], [/Polstellen: keine(?![a-zäöüß])/g, 'poli: nessuno'],
        [/(\\setminus \\\{)([^}]*)(\\\})/g, (m, a, b, c) => /,/.test(b) ? m : a + b.replace(/; /g, ', ') + c],

        // book it-6 mathegy11-it:
        // bruchfunktion: "… mit einem Loch.", "Nullstellen: keine", and the set of the domain "\{1; -2\}" → "\{1, -2\}" when no number has a decimal comma
        [/ mit (Löchern|einem Loch)\./g, (m, w) => ' con ' + (w === 'Löchern' ? 'dei buchi' : 'un buco') + '.'],
        [/Nullstellen: keine(?![a-zäöüß])/g, 'Zeri: nessuno'], [/Polstellen: keine(?![a-zäöüß])/g, 'poli: nessuno'],
        [/(\\setminus \\\{)([^}]*)(\\\})/g, (m, a, b, c) => /,/.test(b) ? m : a + b.replace(/; /g, ', ') + c],

        // book it-7 mathegy11lk-it:

        // book it-8 mathegy12-it:

        // book it-9 mathegy12lk-it:
    ]
});
