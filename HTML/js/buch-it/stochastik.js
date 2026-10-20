/* js/buch-it/stochastik.js — Italian for the widgets of js/buch-stochastik.js.
 * Loaded by the Italian editions right after js/buch-stochastik.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Package IT0 (18.10.2026) put in only the block comments; every book writes only below its own comment line, each entry ending
 * with a comma, so the three books merge without a conflict. The Spanish file js/buch-es/stochastik.js shows which German
 * strings the widgets write.
 * Round 2 (20.10.2026): six books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 */
window.BuchIT && BuchIT.add('stochastik', {
    word: {
        // book it-1 mathe11-it:
        // baum-hero, baum, schnelltest, vierfeld-trainer, simulation, ziegen
        'Baumdiagramm': 'Diagramma ad albero', 'Baumdiagramm: zwei Kugeln ohne Zurücklegen': 'Diagramma ad albero: due palline senza reimmissione',
        'Rot': 'Rosso', 'eine rote Kugel weniger': 'una pallina rossa in meno', 'eine rote Kugel mehr': 'una pallina rossa in più',
        'eine blaue Kugel weniger': 'una pallina blu in meno', 'eine blaue Kugel mehr': 'una pallina blu in più',
        'Anzahl der Züge': 'Numero di estrazioni', '2 Züge': '2 estrazioni', '3 Züge': '3 estrazioni', 'Ziehen': 'Estrazione',
        'ohne Zurücklegen': 'senza reimmissione', 'mit Zurücklegen': 'con reimmissione', 'Urne:': 'Urna:',
        'Ereignis wählen:': 'Scegli un evento:', 'Ereignis': 'Evento', 'Baumdiagramm der Urne': 'Diagramma ad albero dell’urna', 'unmöglich': 'impossibile',
        'beide Rot': 'entrambe rosse', 'alle Rot': 'tutte rosse', 'genau einmal Rot': 'esattamente una rossa', 'mindestens einmal Rot': 'almeno una rossa',
        'keinmal Rot': 'nessuna rossa', 'beide gleich': 'entrambe uguali', 'alle gleich': 'tutte uguali', 'leeren': 'svuota',
        'Anteil der Erkrankten': 'Percentuale di malati', 'Test erkennt Kranke (Sensitivität)': 'Il test riconosce i malati (sensibilità)',
        'Test erkennt Gesunde (Spezifität)': 'Il test riconosce i sani (specificità)', 'Darstellung': 'Rappresentazione',
        'Anzahlen (von 10 000)': 'Numeri (su 10 000)', 'Wahrscheinlichkeiten': 'Probabilità', 'Anzahlen': 'Numeri',
        'positiv $T^+$': 'positivo $T^+$', 'negativ $T^-$': 'negativo $T^-$', 'krank $K$': 'malato $M$', 'gesund $\\overline{K}$': 'sano $\\overline{M}$',
        'krank': 'malato', 'gesund': 'sano', 'Baumdiagramm: krank oder gesund, dann Testergebnis': 'Diagramma ad albero: malato o sano, poi il risultato del test',
        'Neue Tafel': 'Nuova tabella', 'A und B': 'A e B', 'A und nicht B': 'A e non B', 'nicht A und B': 'non A e B', 'nicht A und nicht B': 'non A e non B',
        'A gesamt': 'totale di A', 'nicht A gesamt': 'totale di non A', 'B gesamt': 'totale di B', 'nicht B gesamt': 'totale di non B', 'gesamt': 'totale',
        // "Würfel" (dado / cubo) is never a global word: the simulator's button is a rule below
        'Münze': 'Moneta', 'Zwei Würfel': 'Due dadi', 'Urne': 'Urna', 'Wappen': 'testa', 'Sechs': 'sei', 'Augensumme 7': 'somma dei punti 7',
        'beide rot (3 rot, 2 blau, ohne Zurücklegen)': 'entrambe rosse (3 rosse, 2 blu, senza reimmissione)',
        'mindestens eine Sechs in vier Würfen': 'almeno un sei in quattro lanci', 'Zufallsversuch': 'Esperimento aleatorio', 'Durchführen:': 'Esegui:',
        'Relative Häufigkeit in Abhängigkeit von der Anzahl der Versuche': 'Frequenza relativa in funzione del numero di prove',
        'VERSUCHE n': 'PROVE n', 'TREFFER': 'SUCCESSI', 'REL. HÄUFIGKEIT': 'FREQ. RELATIVA', 'WAHRSCHEINLICHKEIT': 'PROBABILITÀ',
        'Noch kein Versuch – starte mit +1 oder +10.': 'Ancora nessuna prova – comincia con +1 o +10.',
        'Hinter einer Tür steht ein Auto, hinter den anderen beiden je eine Ziege. Wähle eine Tür.':
            'Dietro una porta c’è un’automobile, dietro ciascuna delle altre due una capra. Scegli una porta.',
        'Neues Spiel': 'Nuova partita', '1000 Spiele vom Rechner spielen lassen': 'Fai giocare 1000 partite al computer',
        'Strategie': 'Strategia', 'Spiele': 'Partite', 'Autos': 'Automobili', 'Gewinnquote': 'Percentuale di vittorie',
        'du: bleiben': 'tu: resti', 'du: wechseln': 'tu: cambi', 'Rechner: bleiben': 'computer: resta', 'Rechner: wechseln': 'computer: cambia',
        // book it-2 mathe12-it:
        'Anzahlen (von 10 000)': 'Frequenze (su 10 000)',
        'Baumdiagramm: zwei Kugeln ohne Zurücklegen': 'Diagramma ad albero: due palline senza reimmissione',
        'Baumdiagramm': 'Diagramma ad albero',
        'gerade · Vielfaches von 3': 'pari · multiplo di 3',
        'Primzahl · größer als 6': 'primo · maggiore di 6',
        'Anteil der Erkrankten': 'Proporzione di malati',
        'Test erkennt Kranke (Sensitivität)': 'Il test riconosce i malati (sensibilità)',
        'Test erkennt Gesunde (Spezifität)': 'Il test riconosce i sani (specificità)',
        'positiv $T^+$': 'positivo $T^+$',
        'negativ $T^-$': 'negativo $T^-$',
        'Baumdiagramm: krank oder gesund, dann Testergebnis': 'Diagramma ad albero: malato o sano, poi il risultato del test',
        'Unabhängig machen': 'Rendi indipendenti',
        'Unvereinbar machen': 'Rendi incompatibili',
        'Einheitsquadrat: Anteil von A in B und in nicht B': 'Quadrato unitario: parte di A in B e in non B',
        'A und B': 'A e B',
        'A und nicht B': 'A e non B',
        'nicht A und B': 'non A e B',
        'nicht A und nicht B': 'non A e non B',
        'A gesamt': 'totale di A',
        'nicht A gesamt': 'totale di non A',
        'B gesamt': 'totale di B',
        'nicht B gesamt': 'totale di non B',
        'Darstellung': 'Rappresentazione',
        'Wahrscheinlichkeiten': 'Probabilità',
        'Anzahlen': 'Frequenze assolute',
        'Neue Tafel': 'Nuova tabella',
        'Drei Münzen': 'Tre monete',
        'Augensumme': 'Somma dei punti',
        'Glücksrad': 'Ruota della fortuna',
        'Zufallsgröße': 'Variabile aleatoria',
        'Einsatz': 'Puntata',
        'Wahrscheinlichkeitsverteilung als Stabdiagramm': 'Distribuzione di probabilità come diagramma a barre',
        'Spielen:': 'Gioca:',
        'SPIELE n': 'PARTITE n',
        'MITTELWERT': 'MEDIA',
        'LETZTE': 'ULTIME',
        'Stufen $n$:': 'Stadi $n$:',
        'Anzahl der Stufen': 'Numero di stadi',
        'Trefferwahrscheinlichkeit $p$': 'Probabilità di successo $p$',
        'Genau $k$ Treffer:': 'Esattamente $k$ successi:',
        'Anzahl der Treffer': 'Numero di successi',
        'Baumdiagramm einer Bernoulli-Kette': 'Diagramma ad albero di uno schema di Bernoulli',
        'Anzahl der Versuche $n$': 'Numero di prove $n$',
        'Was wird berechnet?': 'Che cosa si calcola?',
        'Histogramm der Binomialverteilung': 'Istogramma della distribuzione binomiale',
        'unvereinbar': 'incompatibili',
        // book it-3 mathe13-it:
        'Anteil in der Grundgesamtheit $p$': 'Proporzione nella popolazione $p$',
        'Stichprobenumfang $n$': 'Ampiezza del campione $n$',
        'Stichproben ziehen:': 'Estrai campioni:',
        'Verteilung der relativen Häufigkeiten vieler Stichproben': 'Distribuzione delle frequenze relative di molti campioni',
        'Noch keine Stichprobe gezogen.': 'Non è ancora stato estratto nessun campione.',
        'Nullhypothese $p_0$': 'Ipotesi nulla $p_0$',
        'Art des Tests': 'Tipo di test',
        'Signifikanzniveau $\\alpha$:': 'Livello di significatività $\\alpha$:',
        'Signifikanzniveau': 'Livello di significatività',
        'Beobachtete Trefferzahl $k$': 'Numero di successi osservato $k$',
        'Binomialverteilung unter der Nullhypothese mit Ablehnungsbereich': 'Distribuzione binomiale sotto l’ipotesi nulla con la regione di rifiuto',
        // book it-4 mathefos11-it:
        // venn
        'Ein Glücksrad hat 12 gleich große Felder: $\\Omega = \\{1; 2; \\ldots; 12\\}$. Wähle eine Vorlage oder stell $A$ und $B$ selbst zusammen: Ereignis wählen, dann Zahlen antippen.':
            'Una ruota della fortuna ha 12 settori uguali: $\\Omega = \\{1, 2, \\ldots, 12\\}$. Scegli un modello o componi tu $A$ e $B$: scegli l’evento, poi tocca i numeri.',
        'Vorlage': 'Modello', '$A$ bearbeiten': 'Modifica $A$', '$B$ bearbeiten': 'Modifica $B$', 'Ereignis bearbeiten': 'Evento da modificare',
        'Verknüpfung:': 'Operazione:', 'Verknüpfung': 'Operazione', 'Mengendiagramm der Ereignisse A und B': 'Diagramma di Venn degli eventi A e B',
        // urne
        'Kugeln $n$': 'Palline $n$', 'Ziehungen $k$': 'Estrazioni $k$', 'n kleiner': 'n minore', 'n größer': 'n maggiore', 'k kleiner': 'k minore', 'k größer': 'k maggiore',
        'mit Reihenfolge': 'con ordine', 'ohne Reihenfolge': 'senza ordine', 'Reihenfolge': 'Ordine', 'Zurücklegen': 'Reimmissione', 'Einmal ziehen': 'Estrai una volta', 'URNE': 'URNA',
        // pascal
        '$n$ (Zeile)': '$n$ (riga)', '$k$ (Stelle)': '$k$ (posizione)', 'Pascalsches Dreieck bis zur Zeile 10': 'Triangolo di Pascal fino alla riga 10',

        // book it-5 mathefos12-it:

        // book it-6 mathegy11-it:
        // pascal (FOS 11 uses this widget too)
        '$n$ (Zeile)': '$n$ (riga)', '$k$ (Stelle)': '$k$ (posizione)', 'Pascalsches Dreieck bis zur Zeile 10': 'Triangolo di Tartaglia fino alla riga 10',

        // book it-7 mathegy11lk-it:

        // book it-8 mathegy12-it:
        // signifikanztest: the side of the test (lb6, abi)
        'linksseitig': 'sinistro', 'rechtsseitig': 'destro', 'zweiseitig': 'bilaterale',

        // book it-9 mathegy12lk-it:
    },
    phrase: [
        // book it-1 mathe11-it:
        // baum, schnelltest, vierfeld-trainer, simulation, ziegen
        ['Klicke auf die Enden der Pfade (rechts im Baum) oder wähle oben ein Ereignis. ', 'Fai clic sulle estremità dei percorsi (a destra nell’albero) o scegli in alto un evento. '],
        ['Das Buch rechnet dir die Pfadregeln vor.', 'Il libro ti mostra il calcolo con le regole dei percorsi.'],
        ['<b>1. Pfadregel</b> (multiplizieren entlang des Pfades):', '<b>1ª regola dei percorsi</b> (moltiplicare lungo il percorso):'],
        ['<b>2. Pfadregel</b> (Pfade addieren):', '<b>2ª regola dei percorsi</b> (sommare i percorsi):'],
        ['aber nur <b>', 'ma solo <b>'], ['</b> davon sind wirklich krank.', '</b> di loro sono davvero malate.'],
        ['Anteil der Kranken unter den positiv Getesteten: ', 'Percentuale di malati tra chi risulta positivo: '],
        [' alles richtig', ' tutto corretto'], ['Ereignis: <b>', 'Evento: <b>'], ['Zuletzt: ', 'Ultimi: '],
        ['TÜR', 'PORTA'], ['Tür', 'Porta'], ['Gewonnen – das Auto! ', 'Hai vinto l’automobile! '], ['Leider eine Ziege. ', 'Peccato, una capra. '],
        ['Du hast gewechselt.', 'Hai cambiato.'], ['Du bist geblieben.', 'Sei rimasto.'],
        // the module-level constants of venn (not on a BGY 11 page, but check.mjs reads them for every page)
        ['$A$ oder $B$ (oder beide)', '$A$ o $B$ (o entrambi)'], ['$A$ und $B$', '$A$ e $B$'], ['nicht $A$ und nicht $B$', 'non $A$ e non $B$'],
        ['nicht $A$ oder nicht $B$', 'non $A$ o non $B$'], ['weder $A$ noch $B$', 'né $A$ né $B$'], ['nicht beide', 'non entrambi'], ['nicht $A$', 'non $A$'],
        ['gerade · Vielfaches von 3', 'pari · multiplo di 3'], ['Primzahl · größer als 6', 'primo · maggiore di 6'], ['unvereinbar', 'incompatibili'],
        // book it-2 mathe12-it:
        ['$A$ oder $B$ (oder beide)', '$A$ o $B$ (o entrambi)'],
        ['$A$ und $B$', '$A$ e $B$'],
        ['nicht $A$', 'non $A$'],
        ['weder $A$ noch $B$', 'né $A$ né $B$'],
        ['nicht $A$ und nicht $B$', 'non $A$ e non $B$'],
        ['nicht beide', 'non entrambi'],
        ['nicht $A$ oder nicht $B$', 'non $A$ o non $B$'],
        ['gerade · Vielfaches von 3', 'pari · multiplo di 3'],
        ['Primzahl · größer als 6', 'primo · maggiore di 6'],
        ['Positiv getestet werden <b>', 'Risultano positive <b>'],
        ['</b> von 10 000 Personen – ', '</b> persone su 10 000 – '],
        ['aber nur <b>', 'ma solo <b>'],
        ['$ und $P(A \\cap B) = ', '$ e $P(A \\cap B) = '],
        ['<b>Unabhängig:</b> Ob $B$ eintritt oder nicht, der Anteil von $A$ bleibt gleich. Im Quadrat liegt die Grenze in beiden Spalten auf gleicher Höhe.', '<b>Indipendenti:</b> che $B$ si verifichi o no, la parte di $A$ resta la stessa. Nel quadrato il confine si trova alla stessa altezza in entrambe le colonne.'],
        ['<b>Unvereinbar</b> ($A \\cap B = \\emptyset$) und damit <b>abhängig</b>: Wenn $B$ eintritt, kann $A$ nicht mehr eintreten.', '<b>Incompatibili</b> ($A \\cap B = \\emptyset$) e quindi <b>dipendenti</b>: se si verifica $B$, $A$ non può più verificarsi.'],
        ['<b>Abhängig:</b> $B$ verändert die Wahrscheinlichkeit von $A$ ', '<b>Dipendenti:</b> $B$ modifica la probabilità di $A$ '],
        ['nach oben', 'verso l’alto'],
        ['nach unten', 'verso il basso'],
        [' alles richtig', ' tutto corretto'],
        ['Histogramm einer Binomialverteilung', 'Istogramma di una distribuzione binomiale'],
        ['Augenzahl', 'punteggio'],
        ['Anzahl Wappen', 'numero di teste'],
        ['Augensumme zweier Würfel', 'somma dei punti di due dadi'],
        ['Gewinn = Auszahlung − Einsatz', 'guadagno = vincita − puntata'],
        ['Gewinn bei 1 € Einsatz', 'guadagno con una puntata di 1 €'],
        [' Auszahlungen 0 €, 1 €, 2 €, 10 € mit den Wahrscheinlichkeiten ', ' Vincite di 0 €, 1 €, 2 € e 10 € con le probabilità '],
        [' Du setzt 1 € auf eine Zahl, dann werden drei Würfel geworfen. Für jeden Würfel mit deiner Zahl bekommst du 1 € Gewinn, sonst ist der Einsatz weg.', ' Punti 1 € su un numero e si lanciano tre dadi. Per ogni dado che mostra il tuo numero vinci 1 €; se non esce nessuno, perdi la puntata.'],
        ['Erwartungswert: $E(X)', 'Valore atteso: $E(X)'],
        [' · Das Spiel ist <b>fair</b>.', ' · Il gioco è <b>equo</b>.'],
        [' · Auf lange Sicht <b>verlierst</b> du im Mittel ', ' · A lungo andare in media <b>perdi</b> '],
        [' € pro Spiel.', ' € a partita.'],
        [' · Auf lange Sicht <b>gewinnst</b> du im Mittel ', ' · A lungo andare in media <b>vinci</b> '],
        ['Varianz: $V(X)', 'Varianza: $V(X)'],
        ['Pfade mit genau ', 'Percorsi con esattamente '],
        ['$ · jeder hat die Wahrscheinlichkeit $', '$ · ciascuno ha la probabilità $'],
        ['Formel von Bernoulli: $P(X = ', 'Formula di Bernoulli: $P(X = '],
        ['$X$ ist binomialverteilt mit $n = ', '$X$ ha una distribuzione binomiale con $n = '],
        ['$ und $p = ', '$ e $p = '],
        ['Erwartungswert $\\mu', 'Valore atteso $\\mu'],
        // book it-3 mathe13-it:
        [' Fehler 2. Art zeigen: wahres $p$ =', ' Mostra l’errore di II specie: $p$ vero ='],
        [' Stichproben vom Umfang ', ' campioni di ampiezza '],
        [' Stichprobe vom Umfang ', ' campione di ampiezza '],
        ['Mittelwert der $h$: $', 'Media delle $h$: $'],
        ['$ · Standardabweichung der $h$: $', '$ · deviazione standard delle $h$: $'],
        ['$. Viermal so großes $n$ halbiert die Streuung.', '$. Un $n$ quattro volte più grande dimezza la dispersione.'],
        ['$ gegen $H_1\\colon ', '$ contro $H_1\\colon '],
        ['$ · tatsächliche Irrtumswahrscheinlichkeit $\\approx ', '$ · probabilità di errore effettiva $\\approx '],
        ['Beobachtet $k = ', 'Osservato $k = '],
        ['<b>$H_0$ wird abgelehnt.</b> Das Ergebnis ist signifikant.', '<b>$H_0$ viene rifiutata.</b> Il risultato è significativo.'],
        ['<b>$H_0$ wird nicht abgelehnt.</b> Das beweist aber nicht, dass $H_0$ stimmt.', '<b>$H_0$ non viene rifiutata.</b> Ma questo non dimostra che $H_0$ sia vera.'],
        ['Ist in Wahrheit $p = ', 'Se in realtà $p = '],
        ['$ (violett), wird $H_0$ mit $\\beta \\approx ', '$ (viola), $H_0$ viene mantenuta per errore con $\\beta \\approx '],
        ['$ fälschlich beibehalten (Fehler 2. Art).', '$ (errore di II specie).'],
        // book it-4 mathefos11-it:
        // venn
        ['Additionssatz: $', 'Regola della somma: $'], ['Gegenereignis: $', 'Evento contrario: $'],
        [' · $A$ und $B$ sind <b>unvereinbar</b> ($A \\cap B = \\emptyset$), es wird nichts doppelt gezählt.', ' · $A$ e $B$ sono <b>incompatibili</b> ($A \\cap B = \\emptyset$): niente viene contato due volte.'],
        ['Die Zahlen, die in beiden Ereignissen liegen.', 'I numeri che stanno in entrambi gli eventi.'],
        ['$A \\cap B = \\emptyset$: Die Ereignisse sind <b>unvereinbar</b>, sie können nicht zusammen eintreten.', '$A \\cap B = \\emptyset$: gli eventi sono <b>incompatibili</b>, non possono verificarsi insieme.'],
        ['Regel von de Morgan: $', 'Legge di De Morgan: $'], ['$. Wähle die andere Seite und vergleiche: Es ist dieselbe Menge.', '$. Scegli l’altro membro e confronta: è lo stesso insieme.'],
        // urne
        ['Variation mit Wiederholung', 'Disposizione con ripetizione'], ['Permutation (alle Kugeln, mit Reihenfolge)', 'Permutazione (tutte le palline, con ordine)'],
        ['Variation ohne Wiederholung', 'Disposizione senza ripetizione'], ['Kombination ohne Wiederholung', 'Combinazione senza ripetizione'],
        ['Kombination mit Wiederholung', 'Combinazione con ripetizione'], ['</b> · Beispiel: ', '</b> · esempio: '], ['Anzahl der Möglichkeiten: ', 'Numero delle possibilità: '],
        ['Gezogen: <b>', 'Estratto: <b>'], ['Ergebnisse als Tupel $(\\ldots)$: Die Reihenfolge zählt.', 'Esiti come n-uple $(\\ldots)$: l’ordine conta.'],
        ['Ergebnisse als Mengen $\\{\\ldots\\}$: Die Reihenfolge zählt nicht.', 'Esiti come insiemi $\\{\\ldots\\}$: l’ordine non conta.'],
        [' Genau dafür gibt es die Formel.', ' Proprio per questo c’è la formula.'],
        // urne: the pieces of the examples that the rules below translate as a whole (for tools/buch-en/check.mjs)
        ['ein Zahlenschloss mit ', 'un lucchetto a combinazione con '], [' Rädern zu je ', ' rotelle da '], [' Personen stellen sich in eine Reihe', ' persone si mettono in fila'],
        ['ein Siegerpodest: ', 'un podio: '], [' Startern auf die Plätze 1 bis ', ' partecipanti ai posti da 1 a '], ['Lotto: ', 'lotto: '],
        [' Zahlen, die Reihenfolge der Ziehung zählt nicht', ' numeri, l’ordine dell’estrazione non conta'], [' Kugeln Eis aus ', ' palline di gelato da '],
        [' Sorten, eine Sorte darf mehrfach vorkommen', ' gusti, un gusto può ripetersi'], [' Möglichkeiten sind zu viele zum Auflisten.', ' possibilità sono troppe da elencare.'],
        // pascal
        [': So viele Möglichkeiten gibt es, $', ': ci sono altrettanti modi di scegliere $'], ['$ aus $', '$ tra $'], ['$ auszuwählen.', '$.'],
        ['Summenregel (grün umrandet): $', 'Regola della somma (bordo verde): $'], ['Symmetrie (gestrichelt): $', 'Simmetria (tratteggiata): $'],
        ['Die Mitte der Zeile: $', 'Il centro della riga: $'], ['}$ ist hier sein eigenes Spiegelbild.', '}$ è qui l’immagine speculare di sé stesso.'],
        // binomial: the standard deviation after the expected value (the BGY books have only the h of the samples)
        ['$ · Standardabweichung $', '$ · deviazione standard $'],

        // book it-5 mathefos12-it:

        // book it-6 mathegy11-it:
        // pascal
        [': So viele Möglichkeiten gibt es, $', ': è il numero di modi per scegliere $'], ['$ aus $', '$ tra $'], ['$ auszuwählen.', '$.'],
        ['Summenregel (grün umrandet): $', 'Regola della somma (bordo verde): $'], ['Symmetrie (gestrichelt): $', 'Simmetria (tratteggiata): $'],
        ['Die Mitte der Zeile: $', 'Il centro della riga: $'], ['}$ ist hier sein eigenes Spiegelbild.', '}$ qui è l’immagine speculare di se stesso.'],

        // book it-7 mathegy11lk-it:

        // book it-8 mathegy12-it:

        // book it-9 mathegy12lk-it:
    ],
    rule: [
        // book it-1 mathe11-it:
        // letters in the trees and in the simulator: R/B (rot/blau) stay R/B (rosso/blu), K/G (krank/gesund) → M/S (malato/sano),
        // coin W/Z (Wappen/Zahl) → T/C (testa/croce); the chapter text lb1 uses the same letters
        [/(font-weight:700">)K(<\/text>)/g, '$1M$2'], [/(font-weight:700">)G(<\/text>)/g, '$1S$2'],
        [/(margin-right:10px">)W</g, '$1T<'], [/(margin-right:10px">)Z</g, '$1C<'],
        // simulator: the dice button ("Würfel" has two meanings, so no global word)
        [/(data-x="wuerfel">)Würfel</g, '$1Dado<'],
        // four-field trainer: "3 von 5 richtig"
        [/(\d+) von (\d+) richtig/g, '$1 su $2 corrette'],
        // rapid test
        [/Positiv getestet werden <b>([^<]*)<\/b> von 10 000 Personen – /g, (m, n) => 'Su 10 000 persone risultano positive <b>' + n + '</b>, '],
        // goats (before the header rule "^Zu " of js/buch-it.js)
        [/Der Moderator weiß, wo das Auto steht, und öffnet Tür (\d): eine Ziege\. Bleibst du oder wechselst du\?/g,
            'Il presentatore sa dov’è l’automobile e apre la porta $1: una capra. Resti o cambi?'],
        [/Bei Tür (\d) bleiben/g, 'Resto con la porta $1'], [/Zu Tür (\d) wechseln/g, 'Passo alla porta $1'],
        // book it-2 mathe12-it:
        // letters in the trees: K/G (krank/gesund) → M/S (malato/sano), coins W/Z (Wappen/Zahl) → T/C (testa/croce); R/B stay (rosso/blu)
        [/(font-weight:700">)K(<\/text>)/g, '$1M$2'], [/(font-weight:700">)G(<\/text>)/g, '$1S$2'],
        [/(margin-right:10px">)W</g, '$1T<'], [/(margin-right:10px">)Z</g, '$1C<'],
        // four-field trainer: "3 von 5 richtig"
        [/(\d+) von (\d+) richtig/g, '$1 su $2 corrette'],
        // rapid test: "Positiv getestet werden <b>670</b> von 10 000 Personen – "
        [/Positiv getestet werden <b>([^<]*)<\/b> von 10 000 Personen – /g, (m, n) => 'Su 10 000 persone, <b>' + n + '</b> risultano positive, '],
        // zufallsgroesse: the dice button ("Würfel" has two meanings, so no global word); Bernoulli trees: T/N (Treffer/Niete) → S/I (successo/insuccesso)
        [/(<button type="button" data-v="wuerfel">)Würfel(<\/button>)/g, '$1Dado$2'],
        [/(<text\b[^>]*>)([TN]{1,4})(<\/text>)/g, (m, a, k, b) => a + k.replace(/T/g, 'S').replace(/N/g, 'I') + b],
        [/Pfade mit genau 1 Treffern: \$/g, 'Percorsi con esattamente 1 successo: $'],
        // book it-3 mathe13-it:
        // book it-4 mathefos11-it:
        // venn: sets of whole numbers in TeX, \{2;\,4\} → \{2, 4\} (with a decimal comma the semicolon stays; needs "\{", so SVG text cannot match)
        [/\\\{([^$]*?)\\\}/g, (m, s) => /\d(?:,|\{,\})\d/.test(s) ? m : '\\{' + s.replace(/;\\,|; /g, ', ') + '\\}'],
        // urne: outcomes "(1; 2)" and "{1; 2}" → "(1, 2)", "{1, 2}"; the examples with their numbers (singular for 1)
        [/[({]\d+(?:; \d+)+[)}]/g, m => m.replace(/; /g, ', ')],
        [/ein Zahlenschloss mit (\d+) Rädern zu je (\d+) Ziffern/g, (m, k, n) => 'un lucchetto a combinazione con ' + k + (k === '1' ? ' rotella' : ' rotelle') + ' da ' + n + ' cifre'],
        [/(\d+) Personen stellen sich in eine Reihe/g, '$1 persone si mettono in fila'],
        [/ein Siegerpodest: (\d+) von (\d+) Startern auf die Plätze 1 bis (\d+)/g, (m, k, n, p) => 'un podio: ' + k + (k === '1' ? ' partecipante' : ' partecipanti') + ' su ' + n + ' ' + (p === '1' ? 'al posto 1' : 'ai posti da 1 a ' + p)],
        [/Lotto: (\d+) aus (\d+) Zahlen, die Reihenfolge der Ziehung zählt nicht/g, 'lotto: $1 numeri su $2, l’ordine dell’estrazione non conta'],
        [/(\d+) Kugeln Eis aus (\d+) Sorten, eine Sorte darf mehrfach vorkommen/g, (m, k, n) => k + (k === '1' ? ' pallina' : ' palline') + ' di gelato da ' + n + ' gusti, un gusto può ripetersi'],
        [/(\d{1,3}(?:\.\d{3})*) Möglichkeiten sind zu viele zum Auflisten\./g, '$1 possibilità sono troppe da elencare.'],
        // pascal: "$, denn $2$ auswählen heißt $3$ weglassen."
        [/\$, denn \$(\d+)\$ auswählen heißt \$(\d+)\$ weglassen\./g, (m, k, r) => '$, perché scegliere $' + k + '$ equivale a lasciarne fuori $' + r + '$.'],

        // book it-5 mathefos12-it:

        // book it-6 mathegy11-it:
        // pascal: "$, denn $2$ auswählen heißt $3$ weglassen."
        [/\$, denn \$(\d+)\$ auswählen heißt \$(\d+)\$ weglassen\./g, (m, k, r) => '$, perché sceglierne $' + k + '$ equivale a lasciarne fuori $' + r + '$.'],

        // book it-7 mathegy11lk-it:

        // book it-8 mathegy12-it:

        // book it-9 mathegy12lk-it:
    ]
});
