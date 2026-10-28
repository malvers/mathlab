/* js/buch-it/bgy13lk.js — Italian for the widgets of js/buch-bgy13lk.js.
 * Loaded by the Italian editions right after js/buch-bgy13lk.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Book it-23 mathe13lk-it (Pastori, 28.10.2026). The identity matrix is I in the Italian books (German E), so the pieces
 * that write E in TeX say I. The sectors of the Leontief model keep their letters L, I, D, the help line under the table
 * names them in Italian.
 */
window.BuchIT && BuchIT.add('bgy13lk', {
    word: {
        // book it-23 mathe13lk-it:
        // titelbildbgy13lk
        'Titelbild: Trapeze unter einer Kurve, eine Glockenkurve mit rotem Ablehnungsbereich, ein Kreislauf Ei, Larve, Käfer':
            'Copertina: trapezi sotto una curva, una curva a campana con la regione di rifiuto in rosso, un ciclo uovo, larva, coleottero',
        // matrixinverse
        'nicht invertierbar': 'non invertibile', 'Beispielmatrix': 'Matrice di esempio',
        'Nächster Schritt': 'Passo successivo', 'Alle Schritte': 'Tutti i passi', 'Von vorn': 'Da capo',
        // leontief
        'Markt': 'Mercato',
        // uebergang
        'Käferpopulation': 'Popolazione di coleotteri', 'Kundenwanderung': 'Flussi di clienti',
        '1 Schritt': '1 passo', '10 Schritte': '10 passi', 'Zurück auf Start': 'Torna all’inizio',
        'Verlauf der drei Klassen über die Schritte n': 'Andamento delle tre classi lungo i passi n',
        'Übergangsgraph mit drei Zuständen und den Übergangsanteilen an den Pfeilen': 'Grafo di transizione con tre stati e le quote di transizione sulle frecce',
        'Eier': 'Uova', 'Larven': 'Larve', 'Käfer': 'Coleotteri',
        // biquadratisch
        'Die Parabel h(z) = z² + p·z + q mit ihren Nullstellen': 'La parabola h(z) = z² + p·z + q con i suoi zeri',
        'Der Graph von f(x) = x⁴ + p·x² + q mit seinen Nullstellen': 'Il grafico di f(x) = x⁴ + p·x² + q con i suoi zeri',
    },
    phrase: [
        // book it-23 mathe13lk-it:
        // matrixinverse: the steps of Gauß-Jordan (the numbered ones are rules below)
        ['Neben $A$ steht die Einheitsmatrix $E$. Ziel: links $E$ erzeugen, mit denselben Zeilenumformungen wie rechts.',
            'Accanto ad $A$ c’è la matrice identità $I$. Obiettivo: ottenere $I$ a sinistra, con le stesse operazioni sulle righe applicate anche a destra.'],
        ['Links lässt sich keine Einheitsmatrix mehr erzeugen: Eine Zeile wird links ganz null, oder in einer Spalte gibt es keine Zahl $\\neq 0$ mehr.',
            'A sinistra non si può più ottenere la matrice identità: una riga diventa tutta nulla a sinistra, oppure in una colonna non c’è più nessun numero $\\neq 0$.'],
        ['$A$ ist nicht invertierbar.', '$A$ non è invertibile.'],
        ['Links steht $E$, rechts steht $A^{-1}$.', 'A sinistra c’è $I$, a destra c’è $A^{-1}$.'],
        ['. Probe: $A \\cdot A^{-1} = E$, zum Beispiel erste Zeile mal erste Spalte: ', '. Verifica: $A \\cdot A^{-1} = I$, per esempio prima riga per prima colonna: '],
        ['Das Gleichungssystem $A \\cdot \\vec{x} = ', 'Il sistema di equazioni $A \\cdot \\vec{x} = '],
        ['$ hat die Lösung $\\vec{x} = A^{-1} \\cdot \\vec{b} = ', '$ ha la soluzione $\\vec{x} = A^{-1} \\cdot \\vec{b} = '],
        ['Die dritte Zeile von $A$ ist die Summe der ersten beiden. Dann hat $A \\cdot \\vec{x} = \\vec{b}$ entweder keine oder unendlich viele Lösungen, nie genau eine.',
            'La terza riga di $A$ è la somma delle prime due. Allora $A \\cdot \\vec{x} = \\vec{b}$ ha nessuna o infinite soluzioni, mai esattamente una.'],
        ['Weiter mit „Nächster Schritt“.', 'Avanti con «Passo successivo».'],
        // leontief
        ['Zeile: liefernder Sektor, Spalte: empfangender Sektor. ', 'Riga: settore che fornisce, colonna: settore che riceve. '],
        ['Endnachfrage', 'Domanda finale'], ['Landwirtschaft', 'agricoltura'], ['Industrie', 'industria'], ['Dienstleistung', 'servizi'],
        ['. Summe = Produktion, alle Angaben gerundet in ME.', '. Totale = produzione, tutti i dati arrotondati in u.'],
        ['Technologiematrix $A = ', 'Matrice tecnologica $A = '],
        ['$, Leontief-Inverse $(E - A)^{-1} \\approx ', '$, inversa di Leontief $(I - A)^{-1} \\approx '],
        ['$\\vec{x} = (E - A)^{-1} \\cdot \\vec{y} \\approx ', '$\\vec{x} = (I - A)^{-1} \\cdot \\vec{y} \\approx '],
        ['$. Jede Zeile der Tabelle geht auf: Lieferungen an die drei Sektoren plus Endnachfrage ergeben die Produktion. ',
            '$. Ogni riga della tabella torna: le forniture ai tre settori più la domanda finale danno la produzione. '],
        [' ME', ' u.'],
        // uebergang
        ['Eier je Käfer', 'Uova per coleottero'],
        ['Eier', 'Uova'], ['Larven', 'Larve'], ['Käfer', 'Coleotteri'],
        ['Anbieter', 'Fornitore'],
        ['a \\cdot b \\cdot f \\cdot E = ', 'a \\cdot b \\cdot f \\cdot I = '],
        [' \\cdot E$: Nach jeweils drei Schritten ist jede Klasse ', ' \\cdot I$: ogni tre passi ogni classe '],
        ['<b>genau so groß wie vorher</b>, die Population schwankt zyklisch.', 'è <b>grande esattamente come prima</b>: la popolazione oscilla in modo ciclico.'],
        ['. Mit wachsendem $n$ werden die Spalten von $P^n$ gleich: Sie nähern sich der <b>Grenzmatrix</b>, deren Spalten alle der <b>Fixvektor</b> sind.',
            '. Al crescere di $n$ le colonne di $P^n$ diventano uguali: si avvicinano alla <b>matrice limite</b>, le cui colonne sono tutte il <b>vettore stazionario</b>.'],
        ['Fixvektor aus $P \\cdot \\vec{v} = \\vec{v}$ und $v_1 + v_2 + v_3 = 1$: ', 'Vettore stazionario da $P \\cdot \\vec{v} = \\vec{v}$ e $v_1 + v_2 + v_3 = 1$: '],
        ['$. Langfristig: ', '$. A lungo termine: '],
        [' der Kundschaft, egal wie es anfing.', ' della clientela, comunque sia cominciata.'],
        // biquadratisch
        ['Koeffizient', 'Coefficiente'],
        [' = 0$ wird mit $z = x^2$ zu $z^2', ' = 0$ con $z = x^2$ diventa $z^2'],
        [' = 0$, Diskriminante $\\tfrac{p^2}{4} - q = ', ' = 0$, discriminante $\\tfrac{p^2}{4} - q = '],
        [' liefert $x = ', ' dà $x = '],
        [' liefert nichts, denn $x^2$ ist nie negativ', ' non dà nulla, perché $x^2$ non è mai negativo'],
        ['keine Lösung $z$, die Diskriminante ist negativ', 'nessuna soluzione $z$, il discriminante è negativo'],
        ['<b>Keine Lösung</b>', '<b>Nessuna soluzione</b>'], ['<b>Eine Lösung</b>', '<b>Una soluzione</b>'],
    ],
    rule: [
        // book it-23 mathe13lk-it:
        // matrixinverse: "Schritt 2 von 7: …" and the steps with row numerals
        [/Schritt (\d+) von (\d+): /g, 'Passo $1 di $2: '],
        [/Zeilen (I{1,3}) und (I{1,3}) tauschen, damit in Spalte (\d) oben keine Null steht\./g, 'Scambiare le righe $1 e $2, così che nella colonna $3 in alto non ci sia uno zero.'],
        [/Zeile (I{1,3}) durch (\$[^$]*\$) teilen: Das Pivotelement wird 1\./g, 'Dividere la riga $1 per $2: il pivot diventa 1.'],
        [/In Spalte (\d) Nullen erzeugen: /g, 'Ottenere degli zeri nella colonna $1: '],
        // leontief: the last sentence
        [/Insgesamt werden ([\d.]+) ME erzeugt, damit ([\d.]+) ME den Markt erreichen\./g, 'In totale si producono $1 u. perché $2 u. arrivino al mercato.'],
        // uebergang: growth and decline of the beetles
        [/um den Faktor ([\d,]+) <b>gewachsen<\/b>\./g, 'è <b>cresciuta</b> di un fattore $1.'],
        [/auf das ([\d,]+)-Fache <b>geschrumpft<\/b>, die Population stirbt langfristig aus\./g, 'si è <b>ridotta</b> di un fattore $1: a lungo termine la popolazione si estingue.'],
        // biquadratisch: "<b>3 Lösungen</b>", the solution set {−2;\ 2} with commas when there is no decimal comma
        [/<b>(\d) Lösungen<\/b>/g, '<b>$1 soluzioni</b>'],
        [/\\in \\\{([^}$]*)\\\}/g, (m, body) => /\{,\}/.test(body) ? m : m.replace(/;\\ /g, ', ')],
    ]
});
