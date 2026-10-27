/* kapitel.js — the chapters of the Italian edition of "Mathematik · Gymnasium 8" (buch/mathegy8/), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathegy8.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 3; 4 Ustd./week, 104 + 8 Ustd.).
 * Doc, 20.10.2026: "schnapp dir noch 5 Agentinnen und zieht es durch" (round 3, Nalli, block it-13).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Matematica · Gymnasium 8',
    short: 'Matematica GY 8',
    lang: 'it',
    description: 'Libro di testo interattivo di matematica per il Gymnasium (la scuola secondaria tedesca che porta all’Abitur), 8ª classe, Sassonia: espressioni e alberi di calcolo, prodotti notevoli, equazioni e disequazioni, esperimenti aleatori, probabilità e diagrammi ad albero, funzioni e funzioni lineari, sistemi di equazioni lineari, omotetia e similitudine, strategie euristiche e simulazione con numeri casuali, con laboratori, simulazioni e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Area di apprendimento 1', k: '1.1', title: 'Variabili ed espressioni',
          sub: 'Nome, valore e significato, alberi di calcolo, ridurre, sviluppare, raccogliere a fattor comune', when: 'Agosto · settembre', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Area di apprendimento 1', k: '1.2', title: 'Prodotti notevoli ed equazioni',
          sub: 'I tre prodotti notevoli, equazioni lineari, CAS, disequazioni', when: 'Settembre', ustd: 12 },
        { file: 'lb2-1.html', lb: 'Area di apprendimento 2', k: '2.1', title: 'Esperimenti aleatori e probabilità',
          sub: 'Esiti ed eventi, diagrammi di Venn, frequenza relativa, esperimenti di Laplace', when: 'Novembre', ustd: 16 },
        { file: 'lb2-2.html', lb: 'Area di apprendimento 2', k: '2.2', title: 'Esperimenti a più stadi e conteggio',
          sub: 'Modello dell’urna, diagramma ad albero, regole dei percorsi, principio di moltiplicazione, simulazione', when: 'Dicembre', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Area di apprendimento 3', k: '3.1', title: 'Le funzioni e le loro proprietà',
          sub: 'Corrispondenze univoche, forme di rappresentazione, dominio e insieme immagine, monotonia, estremi, simmetria', when: 'Gennaio', ustd: 8 },
        { file: 'lb3-2.html', lb: 'Area di apprendimento 3', k: '3.2', title: 'Funzioni lineari',
          sub: 'Pendenza e rapporto incrementale, zeri, equazioni della retta, regressione lineare', when: 'Gennaio · febbraio', ustd: 12 },
        { file: 'lb3-3.html', lb: 'Area di apprendimento 3', k: '3.3', title: 'Sistemi di equazioni lineari',
          sub: 'Risolvere graficamente e con il calcolo, numero di soluzioni, modellizzare', when: 'Marzo', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Area di apprendimento 4', k: '4.1', title: 'Omotetia',
          sub: 'Centro e rapporto di omotetia, costruzione, conservazione degli angoli, rapporti tra segmenti', when: 'Aprile', ustd: 8 },
        { file: 'lb4-2.html', lb: 'Area di apprendimento 4', k: '4.2', title: 'Similitudine',
          sub: 'Criterio principale di similitudine, figure ausiliarie, misurare altezze, lunghezze, aree e volumi', when: 'Aprile · maggio', ustd: 12 },
        { file: 'lb5.html', lb: 'Area di apprendimento 5', k: '5', title: 'Strategie euristiche',
          sub: 'Ragionare in avanti e a ritroso, piani di soluzione, presentare le soluzioni', when: 'Maggio', ustd: 4 },
        { file: 'wb.html', lb: 'Area opzionale', k: 'OP', title: 'Simulazione con numeri casuali',
          sub: 'Numeri casuali, metodo Monte Carlo, problema di Monty Hall, figurine', when: 'Maggio · giugno', ustd: 8 }
    ]
};
