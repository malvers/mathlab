/* kapitel.js — the chapters of the Italian edition of "Mathematik · Oberschule 7" (buch/mathe7/, Realschulbildungsgang), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe7.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlbereich 3; 4 Ustd./week, 100 + 8 Ustd.).
 * Doc, 20.10.2026: "schnapp dir noch 5 Agentinnen und zieht es durch" (round 3, Trotula, block it-17).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Matematica · Oberschule 7',
    short: 'Matematica OS 7',
    lang: 'it',
    description: 'Libro di testo interattivo di matematica per la Oberschule (scuola secondaria sassone), 7ª classe, indirizzo Realschule (Sassonia): percentuali e interessi, caso e frequenze, numeri razionali, espressioni ed equazioni, quadrilateri, poligoni e prismi con massa e densità, tassellazioni alla maniera di Escher, con laboratori, simulazioni e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Area di apprendimento 1', k: '1.1', title: 'Percentuali',
          sub: 'La percentuale come centesimo, valore di base, valore percentuale e tasso percentuale, i tre problemi fondamentali, diagrammi a torta', when: 'Agosto · settembre', ustd: 16 },
        { file: 'lb1-2.html', lb: 'Area di apprendimento 1', k: '1.2', title: 'Percentuali nella vita di tutti i giorni e interessi',
          sub: 'Aumenti e riduzioni di prezzo, sconto e IVA, interessi annui e giornalieri, interesse composto con il foglio di calcolo', when: 'Settembre · ottobre', ustd: 12 },
        { file: 'lb2.html', lb: 'Area di apprendimento 2', k: '2', title: 'Elementi di probabilità e statistica',
          sub: 'Esperimenti aleatori, esiti ed eventi, frequenze e simulazione, probabilità, leggere le statistiche con spirito critico', when: 'Novembre', ustd: 12 },
        { file: 'lb3-1.html', lb: 'Area di apprendimento 3', k: '3.1', title: 'Numeri razionali',
          sub: 'Numeri negativi, retta dei numeri, opposto e valore assoluto, insiemi numerici, coordinate nei quattro quadranti', when: 'Novembre · dicembre', ustd: 8 },
        { file: 'lb3-2.html', lb: 'Area di apprendimento 3', k: '3.2', title: 'Calcolare con i numeri razionali',
          sub: 'Addizione e sottrazione, moltiplicazione, divisione e potenze, proprietà delle operazioni e ordine delle operazioni', when: 'Dicembre · gennaio', ustd: 12 },
        { file: 'lb3-3.html', lb: 'Area di apprendimento 3', k: '3.3', title: 'Espressioni ed equazioni',
          sub: 'Valore di un’espressione, impostare e risolvere equazioni, ricavare una variabile da una formula, proporzioni', when: 'Gennaio', ustd: 8 },
        { file: 'lb4-1.html', lb: 'Area di apprendimento 4', k: '4.1', title: 'Quadrilateri e poligoni',
          sub: 'Quadrilateri intorno a noi, costruire quadrilateri, area e perimetro, scomporre e confrontare poligoni', when: 'Febbraio · marzo', ustd: 16 },
        { file: 'lb4-2.html', lb: 'Area di apprendimento 4', k: '4.2', title: 'Prismi',
          sub: 'Assonometria cavaliera e sviluppo, superficie totale e volume, massa e densità, solidi composti e confezioni', when: 'Aprile · maggio', ustd: 16 },
        { file: 'wb.html', lb: 'Area opzionale', k: 'OP', title: 'Tassellazioni',
          sub: 'Tassellazioni con poligoni regolari, gli angoli in un vertice, tassellazioni alla maniera di M. C. Escher', when: 'Giugno', ustd: 8 }
    ]
};
