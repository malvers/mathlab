/* kapitel.js — the chapters of the Italian edition of "Mathematik · Oberschule 6" (buch/mathe6/), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathe6.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 2; 5 Ustd./week, 125 + 10 Ustd.).
 * Doc, 20.10.2026: "schnapp dir noch 5 Agentinnen und zieht es durch" (round 3, Montalcini, block it-16).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matematica · Oberschule 6',
    short: 'Matematica OS 6',
    lang: 'it',
    druck: false,
    description: 'Libro di testo interattivo di matematica per l’Oberschule (scuola secondaria sassone), 6ª classe (Sassonia): rappresentare, trasformare e confrontare i numeri frazionari, calcolare con frazioni e numeri decimali, corrispondenze e regola del tre, angoli e triangoli, area e perimetro, solidi e loro sviluppi, matematica nella vita quotidiana e giochi matematici, con laboratori, simulazioni e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Area di apprendimento 1', k: '1.1', title: 'Rappresentare i numeri frazionari',
          sub: 'Insiemi, retta numerica, amplificare e semplificare, frazione e numero decimale, confrontare', when: 'Agosto · settembre', ustd: 20 },
        { file: 'lb1-2.html', lb: 'Area di apprendimento 1', k: '1.2', title: 'Calcolare con i numeri frazionari',
          sub: 'Addizione e sottrazione, moltiplicazione e divisione, calcolo mentale e stima', when: 'Settembre · ottobre', ustd: 10 },
        { file: 'lb1-3.html', lb: 'Area di apprendimento 1', k: '1.3', title: 'Proprietà delle operazioni, media e problemi',
          sub: 'Precedenza delle operazioni e trucchi di calcolo, media aritmetica, risolvere equazioni ragionando', when: 'Ottobre', ustd: 5 },
        { file: 'lb2-1.html', lb: 'Area di apprendimento 2', k: '2.1', title: 'Rappresentare le corrispondenze',
          sub: 'Univoche, biunivoche, non univoche: a parole, con tabella, frecce, grafico ed equazione', when: 'Novembre', ustd: 10 },
        { file: 'lb2-2.html', lb: 'Area di apprendimento 2', k: '2.2', title: 'Proporzionalità e regola del tre',
          sub: 'Proporzionalità diretta e inversa, quoziente e prodotto, regola del tre, problemi', when: 'Novembre · dicembre', ustd: 15 },
        { file: 'lb3-1.html', lb: 'Area di apprendimento 3', k: '3.1', title: 'Angoli e triangoli',
          sub: 'Angoli tra rette, somma degli angoli interni, tipi di triangoli, criteri di congruenza e disuguaglianza triangolare', when: 'Gennaio', ustd: 15 },
        { file: 'lb3-2.html', lb: 'Area di apprendimento 3', k: '3.2', title: 'Area e perimetro',
          sub: 'Triangolo, parallelogramma, deltoide e trapezio, figure composte, risolvere problemi', when: 'Gennaio · febbraio', ustd: 15 },
        { file: 'lb4.html', lb: 'Area di apprendimento 4', k: '4', title: 'Solidi geometrici',
          sub: 'Descrivere i solidi, viste, assonometria cavaliera e sviluppo, solidi composti, prismi retti', when: 'Marzo · aprile', ustd: 20 },
        { file: 'lb5.html', lb: 'Area di apprendimento 5', k: '5', title: 'Matematica nella vita quotidiana',
          sub: 'Strategie per risolvere problemi, esperimenti aleatori e frequenze, se – allora e più … più', when: 'Aprile · maggio', ustd: 15 },
        { file: 'wb.html', lb: 'Area opzionale', k: 'OP', title: 'Giochi matematici',
          sub: 'Tangram e cubo Soma, torre di Hanoi, giochi di Nim, giochi con i dadi, un gioco tutto tuo', when: 'Giugno', ustd: 10 }
    ]
};
