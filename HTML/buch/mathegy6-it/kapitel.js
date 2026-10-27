/* kapitel.js — the chapters of the Italian edition of "Mathematik · Gymnasium 6" (buch/mathegy6/), in the order of the
 * school year (Stoffverteilungsplan svp/mathe/mathegy6.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 3).
 * Doc, 20.10.2026: "schnapp dir noch 5 Agentinnen und zieht es durch" (round 3, Montessori, block it-11).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Matematica · Gymnasium 6',
    short: 'Matematica GY 6',
    lang: 'it',
    description: 'Libro di testo interattivo di matematica per il Gymnasium (liceo tedesco), 6ª classe, Sassonia: frazioni, numeri decimali e percentuali, calcolo con i numeri frazionari, equazioni e problemi, corrispondenze e regola del tre, triangoli e quadrilateri con la somma degli angoli, congruenza e area, prismi, parti di un tutto e numeri primi, con laboratori, simulazioni e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Area di apprendimento 1', k: '1.1', title: 'Rappresentare i numeri frazionari',
          sub: 'Frazioni, numeri decimali e percentuali, limitati o periodici, insiemi e insiemi numerici', when: 'Agosto · settembre', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Area di apprendimento 1', k: '1.2', title: 'Calcolare con i numeri frazionari',
          sub: 'Addizione, sottrazione, moltiplicazione e divisione con frazioni e numeri decimali', when: 'Settembre', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Area di apprendimento 1', k: '1.3', title: 'Proprietà, equazioni e problemi',
          sub: 'Ordine delle operazioni e trucchi di calcolo, risolvere equazioni e disequazioni ragionando, problemi con un piano', when: 'Ottobre · novembre', ustd: 10 },
        { file: 'lb2-1.html', lb: 'Area di apprendimento 2', k: '2.1', title: 'Corrispondenze',
          sub: 'Non univoche, univoche, biunivoche, tabella, grafico ed equazione, frequenze assolute e relative', when: 'Novembre · dicembre', ustd: 12 },
        { file: 'lb2-2.html', lb: 'Area di apprendimento 2', k: '2.2', title: 'Corrispondenze proporzionali',
          sub: 'Proporzionalità diretta e inversa, quoziente costante e prodotto costante, grafici, regola del tre', when: 'Dicembre · gennaio', ustd: 12 },
        { file: 'lb3-1.html', lb: 'Area di apprendimento 3', k: '3.1', title: 'Somma degli angoli e congruenza',
          sub: 'Somma degli angoli interni con dimostrazione, definizione e teorema, criteri di congruenza, costruzione di triangoli', when: 'Gennaio · febbraio', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Area di apprendimento 3', k: '3.2', title: 'Teoremi e linee notevoli del triangolo',
          sub: 'Angoli alla base, lati e angoli, disuguaglianza triangolare, assi, bisettrici, altezze, mediane', when: 'Marzo', ustd: 8 },
        { file: 'lb3-3.html', lb: 'Area di apprendimento 3', k: '3.3', title: 'L’area e la casa dei quadrilateri',
          sub: 'Parallelogramma, triangolo, trapezio e deltoide, figure composte, classificare i quadrilateri', when: 'Marzo · aprile', ustd: 10 },
        { file: 'lb4.html', lb: 'Area di apprendimento 4', k: '4', title: 'Prismi',
          sub: 'Proprietà, assonometria cavaliera e sviluppo, area della superficie totale e volume, progetto rifiuti da imballaggio', when: 'Aprile · maggio', ustd: 12 },
        { file: 'lb5.html', lb: 'Area di apprendimento 5', k: '5', title: 'Collegare: le parti di un tutto',
          sub: 'Frazione e percentuale, diagrammi circolari, parti di superfici e di volumi', when: 'Maggio', ustd: 4 },
        { file: 'wb.html', lb: 'Area opzionale', k: 'OP', title: 'Numeri primi',
          sub: 'Crivello di Eratostene, scomposizione in fattori primi, infiniti numeri primi, crittografia', when: 'Maggio · giugno', ustd: 8 }
    ]
};
