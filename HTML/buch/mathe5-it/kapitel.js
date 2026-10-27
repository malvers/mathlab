/* kapitel.js — the chapters of the Italian edition of "Mathematik · Oberschule 5" (buch/mathe5/), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathe5.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlbereich 1; Lehrplan Oberschule 2019:
 * 100 Ustd. Pflicht + 8 Ustd. Wahlbereich).
 * Doc, 26.10.2026: OS 5 in English, Spanish, French and Italian at the same time (Italian: Castelnuovo, block it-21).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Matematica · Oberschule 5',
    short: 'Matematica OS 5',
    lang: 'it',
    description: 'Libro di testo interattivo di matematica per l’Oberschule (scuola secondaria sassone), 5ª classe (Sassonia): numeri grandi, calcolo in colonna, proprietà delle operazioni e ordine delle operazioni, quadrati, equazioni e divisibilità, frazioni, numeri decimali, percentuali e grandezze, coordinate e angoli, rettangolo e cubo, simmetria e traslazione e i simboli numerici di babilonesi, egizi e romani, con laboratori, simulazioni e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Area di apprendimento 1', k: '1.1', title: 'Numeri grandi',
          sub: 'Retta numerica, tabella dei valori posizionali, milioni e miliardi, arrotondare, stimare, confrontare', when: 'Agosto · settembre', ustd: 7 },
        { file: 'lb1-2.html', lb: 'Area di apprendimento 1', k: '1.2', title: 'Calcolare con i numeri naturali',
          sub: 'Addizione, sottrazione, moltiplicazione e divisione in colonna, stima, proprietà e ordine delle operazioni', when: 'Settembre · ottobre', ustd: 15 },
        { file: 'lb1-3.html', lb: 'Area di apprendimento 1', k: '1.3', title: 'Potenze, equazioni e divisori',
          sub: 'Potenze di dieci, quadrati, risolvere equazioni per tentativi, criteri di divisibilità, numeri primi', when: 'Ottobre · novembre', ustd: 12 },
        { file: 'lb2-1.html', lb: 'Area di apprendimento 2', k: '2.1', title: 'Frazioni',
          sub: 'Rappresentare parti, frazioni sulla retta numerica, frazioni di grandezze, confrontare e stimare', when: 'Dicembre · gennaio', ustd: 11 },
        { file: 'lb2-2.html', lb: 'Area di apprendimento 2', k: '2.2', title: 'Numeri decimali e percentuali',
          sub: 'Decimi, centesimi, millesimi, trasformare, confrontare, arrotondare, scrittura in percentuale', when: 'Gennaio', ustd: 9 },
        { file: 'lb2-3.html', lb: 'Area di apprendimento 2', k: '2.3', title: 'Calcolare con numeri decimali e grandezze',
          sub: 'Addizione e sottrazione, moltiplicare e dividere, media, denaro, lunghezza, massa e tempo', when: 'Gennaio · marzo', ustd: 14 },
        { file: 'lb3-1.html', lb: 'Area di apprendimento 3', k: '3.1', title: 'Coordinate, rette e angoli',
          sub: 'Sistema di coordinate, parallele e perpendicolari, misurare, disegnare e stimare gli angoli, tipi di angoli', when: 'Marzo · aprile', ustd: 9 },
        { file: 'lb3-2.html', lb: 'Area di apprendimento 3', k: '3.2', title: 'Rettangolo e cubo',
          sub: 'Assonometria cavaliera e sviluppo del cubo, perimetro e area, superficie totale e volume', when: 'Aprile · maggio', ustd: 11 },
        { file: 'lb4.html', lb: 'Area di apprendimento 4', k: '4', title: 'Simmetria e figure congruenti',
          sub: 'Assi di simmetria, simmetria rispetto a una retta, traslazione, figura e immagine, fregi', when: 'Maggio · giugno', ustd: 12 },
        { file: 'wb.html', lb: 'Area opzionale', k: 'OP', title: 'Come l’umanità ha imparato a contare e a calcolare',
          sub: 'Bastoni a tacche, babilonesi, egizi e romani, calcolare sulle linee, una presentazione', when: 'Giugno · luglio', ustd: 8 }
    ]
};
