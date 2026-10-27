/* kapitel.js — the chapters of the Italian edition of "Mathematik · Oberschule 9" (buch/mathe9/, Realschulbildungsgang), in the
 * order of the school year (Stoffverteilungsplan svp/mathe/mathe9.html: LB 1 → LB 2 → LB 3 → Wahlpflichtbereich 1 → LB 4; 4 Ustd./week).
 * Doc, 20.10.2026: "schnapp dir noch 5 Agentinnen und zieht es durch" (round 3, Hack, block it-19).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Matematica · Oberschule 9',
    short: 'Matematica OS 9',
    lang: 'it',
    description: 'Libro di testo interattivo di matematica per la Oberschule (scuola secondaria tedesca), 9ª classe, percorso Realschule (Sassonia): il teorema di Pitagora e il suo inverso, seno, coseno e tangente, problemi con triangoli rettangoli, piramide, cono circolare e sfera, solidi composti, funzioni ed equazioni quadratiche con la formula risolutiva, la sezione aurea e la statistica descrittiva con un progetto personale, con widget da provare e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Area di apprendimento 1', k: '1.1', title: 'Il teorema di Pitagora',
          sub: 'Ipotenusa e cateti, calcolare lati e altezze, distanze nel sistema di coordinate, teorema inverso e corda a nodi', when: 'Agosto · settembre', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Area di apprendimento 1', k: '1.2', title: 'Seno, coseno e tangente',
          sub: 'Rapporti tra i lati nel triangolo rettangolo, calcolare lati e angoli con la calcolatrice', when: 'Settembre', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Area di apprendimento 1', k: '1.3', title: 'Triangoli rettangoli nella vita di tutti i giorni',
          sub: 'Pendenza in percentuale e angolo di inclinazione, scala, tetto e tirante, scomporre in problemi parziali', when: 'Settembre · ottobre', ustd: 8 },
        { file: 'lb2-1.html', lb: 'Area di apprendimento 2', k: '2.1', title: 'La piramide',
          sub: 'Sviluppo, assonometria e proiezioni ortogonali, altezza, apotema e spigolo laterale, superficie, volume e massa', when: 'Novembre', ustd: 12 },
        { file: 'lb2-2.html', lb: 'Area di apprendimento 2', k: '2.2', title: 'Cono circolare e sfera',
          sub: 'Apotema, superficie laterale come settore circolare, superficie e volume di cono e sfera, radice cubica', when: 'Dicembre', ustd: 12 },
        { file: 'lb2-3.html', lb: 'Area di apprendimento 2', k: '2.3', title: 'Solidi composti',
          sub: 'Scomporre torri, silos, pezzi meccanici e contenitori, volume, superficie e fabbisogno di materiale', when: 'Gennaio', ustd: 4 },
        { file: 'lb3-1.html', lb: 'Area di apprendimento 3', k: '3.1', title: 'Funzioni quadratiche',
          sub: 'Parabola normale, y = a · x² + c, forma del vertice y = (x + d)² + e, forma normale e completamento del quadrato', when: 'Gennaio · febbraio · marzo', ustd: 16 },
        { file: 'lb3-2.html', lb: 'Area di apprendimento 3', k: '3.2', title: 'Equazioni quadratiche',
          sub: 'Risolvere ragionando, formula risolutiva e distinzione dei casi, zeri, punti di intersezione e problemi', when: 'Marzo', ustd: 12 },
        { file: 'wb.html', lb: 'Area a scelta', k: 'OP', title: 'La sezione aurea',
          sub: 'Rapporto di divisione e il numero Φ, costruzione, numeri di Fibonacci, arte, architettura e natura', when: 'Aprile', ustd: 8 },
        { file: 'lb4.html', lb: 'Area di apprendimento 4', k: '4', title: 'Statistica descrittiva',
          sub: 'Dati nei media, media aritmetica, mediana e moda, campo di variazione, un progetto statistico personale', when: 'Maggio · giugno', ustd: 16 }
    ]
};
