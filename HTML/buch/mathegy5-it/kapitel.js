/* kapitel.js — the chapters of the Italian edition of "Mathematik · Gymnasium 5" (buch/mathegy5/), in the order of the
 * school year (Stoffverteilungsplan svp/mathe/mathegy5.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 3).
 * Doc, 20.10.2026: "schnapp dir noch 5 Agentinnen und zieht es durch" (round 3, Cornaro, block it-10).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matematica · Gymnasium 5',
    short: 'Matematica GY 5',
    lang: 'it',
    druck: false,
    description: 'Libro di testo interattivo di matematica per il Gymnasium (liceo tedesco), 5ª classe, Sassonia: numeri grandi, arrotondamento, proprietà delle operazioni, potenze, divisori e numeri primi, frazioni, numeri decimali e percentuali, coordinate, angoli, simmetria e riflessione, rettangoli e parallelepipedi, grandezze nella vita di tutti i giorni e i numeri degli egizi, dei romani e dei maya, con laboratori, simulazioni e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Area di apprendimento 1', k: '1.1', title: 'Numeri grandi',
          sub: 'Tabella dei valori posizionali, retta numerica, stimare, arrotondare, confrontare e ordinare', when: 'Agosto · settembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Area di apprendimento 1', k: '1.2', title: 'Calcolare con i numeri naturali',
          sub: 'Proprietà delle operazioni e calcolo veloce, stima, potenze, divisione', when: 'Settembre', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Area di apprendimento 1', k: '1.3', title: 'Divisori e numeri primi',
          sub: 'Divisori e multipli, criteri di divisibilità, il crivello di Eratostene, fattori primi', when: 'Settembre · ottobre', ustd: 3 },
        { file: 'lb2-1.html', lb: 'Area di apprendimento 2', k: '2.1', title: 'Frazioni',
          sub: 'Rappresentare parti, semplificare e amplificare, frazioni proprie e improprie, confrontare', when: 'Novembre', ustd: 12 },
        { file: 'lb2-2.html', lb: 'Area di apprendimento 2', k: '2.2', title: 'Numeri decimali e percentuali',
          sub: 'Decimi, centesimi, millesimi, trasformare, percentuale, ordinare e arrotondare', when: 'Novembre · dicembre', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Area di apprendimento 2', k: '2.3', title: 'Calcolare con i numeri decimali',
          sub: 'Addizione e sottrazione, spostare la virgola, moltiplicazione e divisione, media', when: 'Dicembre', ustd: 7 },
        { file: 'lb3-1.html', lb: 'Area di apprendimento 3', k: '3.1', title: 'Coordinate e angoli',
          sub: 'Sistema di coordinate, parallele e perpendicolari, misurare gli angoli, tipi di angoli, coppie di angoli', when: 'Gennaio · febbraio', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Area di apprendimento 3', k: '3.2', title: 'Simmetria e riflessione',
          sub: 'Motivi decorativi, simmetria assiale e centrale, traslazione, rotazione, simmetria rispetto a una retta', when: 'Febbraio · marzo', ustd: 10 },
        { file: 'lb4-1.html', lb: 'Area di apprendimento 4', k: '4.1', title: 'Rettangoli',
          sub: 'Perimetro e area, unità di superficie, figure composte', when: 'Marzo · aprile', ustd: 8 },
        { file: 'lb4-2.html', lb: 'Area di apprendimento 4', k: '4.2', title: 'Parallelepipedi rettangoli',
          sub: 'Viste, assonometria cavaliera, sviluppo, volume, unità di capacità, superficie totale, progetto imballaggi', when: 'Aprile · maggio', ustd: 14 },
        { file: 'lb5.html', lb: 'Area di apprendimento 5', k: '5', title: 'La matematica di tutti i giorni',
          sub: 'Trasformare grandezze, valori approssimati, orari, problemi di Fermi, un progetto', when: 'Maggio · giugno', ustd: 10 },
        { file: 'wb.html', lb: 'Area opzionale', k: 'OP', title: 'Contare e calcolare, ieri e oggi',
          sub: 'Egizi, romani e maya, Adam Ries, il sistema binario', when: 'Giugno', ustd: 8 }
    ]
};
