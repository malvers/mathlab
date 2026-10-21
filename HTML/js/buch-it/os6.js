/* js/buch-it/os6.js — Italian for the widgets of js/buch-os6.js.
 * Loaded by the Italian editions right after js/buch-os6.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 3 (20.10.2026): eleven books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/os6.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('os6', {
    word: {
        // book it-16 mathe6-it:
        // titelbildos6
        'Titelbild: ein Tangram-Quadrat aus sieben Teilen, ein Kreis mit drei farbigen Vierteln, ein Zahlenstrahl, der Turm von Hanoi und ein Körper aus Würfeln':
            'Copertina: un quadrato del tangram di sette pezzi, un cerchio con tre quarti colorati, una retta numerica, la torre di Hanoi e un solido fatto di cubetti',
        // wuerfelbauos6 ("Mauer" is a rule below: analysis has the word "muro" in lower case)
        'Treppe': 'Scala', 'Turm': 'Torre', 'Selbst bauen': 'Costruisci il tuo', 'Körper': 'Solido', 'vorne': 'davanti',
        'Körper aus Würfeln im Schrägbild': 'Solido fatto di cubetti in assonometria cavaliera',
        'Bauplan: Draufsicht mit den Höhen': 'Pianta quotata: vista dall’alto con le altezze', 'Bauplan': 'Pianta quotata',
        'von vorn': 'di fronte', 'von rechts': 'da destra',
        'Tippe im Bauplan auf ein Feld: Die Zahl sagt, wie viele Würfel dort übereinander stehen (bis 3, dann wieder 0). Kantenlänge 1 cm.':
            'Tocca una casella della pianta: il numero dice quanti cubetti sono impilati lì (fino a 3, poi di nuovo 0). Lunghezza dello spigolo 1 cm.',
        // hanoios6
        '3 Scheiben': '3 dischi', '4 Scheiben': '4 dischi', '5 Scheiben': '5 dischi', '6 Scheiben': '6 dischi',
        'Anzahl der Scheiben': 'Numero di dischi', 'Neu': 'Nuovo', 'Lösung zeigen': 'Mostra la soluzione',
        'Nicht erlaubt: Eine größere Scheibe darf nie auf einer kleineren liegen.': 'Non è permesso: un disco più grande non può mai stare su uno più piccolo.',
        'Bringe alle Scheiben von A nach C. Tippe erst auf den Stab, von dem du nimmst, dann auf den Ziel-Stab. Immer nur eine Scheibe, nie eine größere auf eine kleinere.':
            'Porta tutti i dischi da A a C. Tocca prima il paletto da cui prendi, poi il paletto di arrivo. Sempre un solo disco alla volta, mai uno più grande su uno più piccolo.',
        // nimos6
        '15 Hölzer': '15 bastoncini', '21 Hölzer': '21 bastoncini', '30 Hölzer': '30 bastoncini', 'Anzahl der Hölzer': 'Numero di bastoncini',
        'ohne Hilfe': 'senza aiuto', 'Vierer zeigen': 'mostra i gruppi di quattro', 'Hilfe': 'Aiuto',
        'Nimm 1': 'Prendi 1', 'Nimm 2': 'Prendi 2', 'Nimm 3': 'Prendi 3',
        // tangramos6
        'Tangram: sieben Teile in einem Quadrat': 'Tangram: sette pezzi in un quadrato',
        // schiebeos6
        '3 × 3 · 8 Steine': '3 × 3 · 8 tessere', '4 × 4 · 15 Steine': '4 × 4 · 15 tessere', 'Mischen': 'Mescola', 'Ordnen': 'Riordina',
        'Geordnet. Tippe auf „Mischen“.': 'In ordine. Tocca «Mescola».',
        'Tippe auf einen Stein neben der Lücke, er rutscht hinein. Ordne die Zahlen der Reihe nach, die Lücke unten rechts.':
            'Tocca una tessera accanto allo spazio vuoto: ci scivola dentro. Metti i numeri in ordine, con lo spazio vuoto in basso a destra.',
        'Grün: Der Stein steht schon richtig. Gemischt wird nur mit erlaubten Zügen, darum ist jedes Puzzle lösbar. Vertauscht man dagegen zwei Steine, geht es nie mehr auf.':
            'Verde: la tessera è già al suo posto. Si mescola solo con mosse consentite, perciò ogni puzzle si può risolvere. Se invece si scambiano due tessere, non si risolve mai più.',
        // augensummeos6
        '1-mal': '1 volta', '10-mal': '10 volte', '100-mal': '100 volte', 'Löschen': 'Cancella',
        'Die 36 Ergebnisse zweier Würfel mit ihrer Augensumme': 'I 36 risultati di due dadi con la loro somma dei punti',
        'Säulendiagramm: relative Häufigkeiten der Augensummen': 'Diagramma a colonne: frequenze relative delle somme dei punti',
        // schiebeos6: the aria-label of the size buttons
        'Größe': 'Grandezza',

        // book it-17 mathe7-it:

    },
    phrase: [
        // book it-16 mathe6-it:
        // wuerfelbauos6: the line under the views (the number of cubes is a rule below)
        [' · Oberfläche ', ' · superficie totale '],
        // hanoios6, schiebeos6
        ['Züge:', 'Mosse:'], ['Mindestens nötig:', 'Minimo necessario:'], ['Geschafft!', 'Ce l’hai fatta!'],
        ['Mit der kleinstmöglichen Zahl von Zügen.', 'Con il minor numero possibile di mosse.'],
        // nimos6
        ['Du: ', 'Tu: '], ['Du hast das letzte Holz genommen und gewonnen!', 'Hai preso l’ultimo bastoncino e hai vinto!'],
        ['Der Computer hat das letzte Holz genommen.', 'Il computer ha preso l’ultimo bastoncino.'], ['Probier es noch einmal.', 'Riprova.'],
        ['Der Computer überlegt …', 'Il computer sta pensando …'], ['Du bist dran: Nimm 1, 2 oder 3 Hölzer.', 'Tocca a te: prendi 1, 2 o 3 bastoncini.'],
        ['Wer das letzte Holz nimmt, gewinnt.', 'Vince chi prende l’ultimo bastoncino.'],
        [' Die Farben zeigen Vierergruppen vom Ende her: Lass dem Computer immer ein Vielfaches von 4 übrig.',
            ' I colori mostrano gruppi di quattro contati dalla fine: lascia sempre al computer un multiplo di 4.'],
        // tangramos6
        ['großes Dreieck', 'triangolo grande'], ['mittleres Dreieck', 'triangolo medio'], ['kleines Dreieck', 'triangolo piccolo'],
        ['Anteil am Quadrat: ', 'Parte del quadrato: '],
        ['Ist das Quadrat 4 cm × 4 cm groß, hat das Teil ', 'Se il quadrato misura 4 cm × 4 cm, il pezzo ha un’area di '],
        ['Tippe auf ein Teil. Alle sieben zusammen ergeben das ganze Quadrat: ', 'Tocca un pezzo. Tutti e sette insieme formano il quadrato intero: '],
        // augensummeos6
        [' · zuletzt ', ' · l’ultimo: '], [' · im Gitter ', ' · nella griglia '], [' von 36 Feldern, also ', ' su 36 caselle, cioè '],
        ['Tippe auf ein Feld oder eine Säule. Die gestrichelte Linie zeigt den Anteil der Felder. Die 7 hat die meisten Felder (',
            'Tocca una casella o una colonna. La linea tratteggiata mostra la parte delle caselle. Il 7 ha più caselle di tutti ('],
        ['), die 2 und die 12 nur eins.', '), il 2 e il 12 solo una ciascuno.'],

        // book it-17 mathe7-it:

    ],
    rule: [
        // book it-16 mathe6-it:
        // wuerfelbauos6: the button "Mauer" and "7 Würfel · Volumen"
        [/(data-v="mauer">)Mauer</, '$1Muro<'],
        [/<b>(\d+)<\/b> Würfel · Volumen /, (m, n) => '<b>' + n + '</b> ' + (n === '1' ? 'cubetto' : 'cubetti') + ' · volume '],
        // hanoios6, schiebeos6, nimos6: numbers inside the sentences
        [/Turm von Hanoi mit (\d+) Scheiben/, 'Torre di Hanoi con $1 dischi'],
        [/Es geht auch mit (\d+) Zügen\./, 'Si può fare anche con $1 mosse.'],
        [/Geschafft in (\d+) Zügen!/, 'Ce l’hai fatta in $1 mosse!'],
        [/Schiebepuzzle mit (\d+) Steinen/, 'Puzzle a scorrimento con $1 tessere'],
        [/^(\d+) Hölzer liegen noch$/, (m, n) => n === '1' ? 'Resta 1 bastoncino' : 'Restano ' + n + ' bastoncini'],
        [/Noch <b>(\d+)<\/b> Hölzer\./, (m, n) => (n === '1' ? 'Resta' : 'Restano') + ' <b>' + n + '</b> ' + (n === '1' ? 'bastoncino.' : 'bastoncini.')],
        // tangramos6: the square and the parallelogram as the name of the piece and in the list of pieces of equal area
        [/(<p style="margin:0"><b>)(Quadrat|Parallelogramm)(<\/b><\/p>)/, (m, a, n, b) => a + (n === 'Quadrat' ? 'quadrato' : 'parallelogramma') + b],
        // all piece names are masculine in Italian; one twin or several
        [/Genauso groß: ([^(<]+) \(hell markiert\)\./, (m, l) => 'Della stessa grandezza: ' + l.replace(/\bQuadrat\b/g, 'quadrato').replace(/\bParallelogramm\b/g, 'parallelogramma') + (l.includes(',') ? ' (evidenziati).' : ' (evidenziato).')],
        // augensummeos6: "5 Würfe · zuletzt 3 + 4 = 7" and "Augensumme 7: 5-mal, relativ …"
        [/(<p style="margin:0">)(\d+) Würfe( · zuletzt |<\/p>)/, (m, a, n, b) => a + n + (n === '1' ? ' lancio' : ' lanci') + b],
        [/Augensumme <b>(\d+)<\/b>: (\d+)-mal(, relativ )?/, (m, s, k, r) => 'Somma dei punti <b>' + s + '</b>: ' + (k === '1' ? '1 volta' : k + ' volte') + (r ? ', frequenza relativa ' : '')],

        // book it-17 mathe7-it:

    ]
});
