/* kapitel.js — the chapters of the Italian edition of "Mathematik · Oberschule 8" (buch/mathe8/, Realschulbildungsgang), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathe8.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → LB 6 → Wahlpflichtbereich 1; 4 Ustd./week, 100 + 8 Ustd.).
 * Doc, 20.10.2026: "schnapp dir noch 5 Agentinnen und zieht es durch" (round 3, Pastori, block it-18).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Matematica · Oberschule 8',
    short: 'Matematica OS 8',
    lang: 'it',
    description: 'Libro di testo interattivo di matematica per l’Oberschule (scuola secondaria sassone), 8ª classe, percorso Realschule (Sassonia): espressioni algebriche e loro trasformazioni, equazioni lineari e formule, funzioni, funzioni lineari e sistemi di equazioni con confronti di tariffe, il cerchio e il teorema di Talete, il cilindro, similitudine e omotetia, esperimenti aleatori con diagrammi ad albero, la matematica di tutti i giorni con affitto, luce e costi di costruzione, e la bicicletta, con elementi interattivi e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Area di apprendimento 1', k: '1.1', title: 'Espressioni algebriche e loro trasformazioni',
          sub: 'Valori di espressioni e formule, ridurre i termini simili, eliminare le parentesi, sviluppare e raccogliere a fattor comune', when: 'Agosto · settembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Area di apprendimento 1', k: '1.2', title: 'Equazioni lineari e formule',
          sub: 'Trasformazioni equivalenti, nessuna o infinite soluzioni, ricavare una variabile da una formula, problemi', when: 'Settembre', ustd: 8 },
        { file: 'lb2-1.html', lb: 'Area di apprendimento 2', k: '2.1', title: 'Funzioni',
          sub: 'Corrispondenza univoca, argomento e valore della funzione, dominio e insieme immagine, proporzionalità diretta', when: 'Ottobre', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Area di apprendimento 2', k: '2.2', title: 'Funzioni lineari',
          sub: 'y = m · x + n, pendenza e intercetta, zeri, equazione da due punti', when: 'Novembre', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Area di apprendimento 2', k: '2.3', title: 'Sistemi di equazioni lineari',
          sub: 'Risolvere graficamente e algebricamente, numero di soluzioni, confronto di tariffe e prezzi', when: 'Novembre · dicembre', ustd: 10 },
        { file: 'lb3-1.html', lb: 'Area di apprendimento 3', k: '3.1', title: 'Il cerchio',
          sub: 'Circonferenza e retta, teorema di Talete, lunghezza della circonferenza e area, il numero π, corona circolare', when: 'Dicembre · gennaio', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Area di apprendimento 3', k: '3.2', title: 'Il cilindro',
          sub: 'Sviluppo, viste e assonometria cavaliera, superficie totale, volume e massa di cilindri pieni e cavi', when: 'Gennaio', ustd: 6 },
        { file: 'lb4.html', lb: 'Area di apprendimento 4', k: '4', title: 'Similitudine',
          sub: 'Omotetia e scala, primo criterio di similitudine, lunghezze, aree e volumi, congruenza', when: 'Marzo', ustd: 14 },
        { file: 'lb5.html', lb: 'Area di apprendimento 5', k: '5', title: 'Eventi casuali',
          sub: 'Simulare, diagramma ad albero e regole dei percorsi, con e senza reimmissione, conteggio combinatorio', when: 'Aprile', ustd: 14 },
        { file: 'lb6.html', lb: 'Area di apprendimento 6', k: '6', title: 'La matematica di tutti i giorni',
          sub: 'Affitto e spese accessorie, bollette di luce e acqua, costi di costruzione, confrontare offerte e interessi', when: 'Maggio · giugno', ustd: 12 },
        { file: 'wb.html', lb: 'Area a scelta', k: 'OP', title: 'La bicicletta',
          sub: 'Pollici e misura dello pneumatico, circonferenza della ruota, rapporto di trasmissione, cadenza e velocità', when: 'Giugno', ustd: 8 }
    ]
};
