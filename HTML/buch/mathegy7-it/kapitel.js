/* kapitel.js — the chapters of the Italian edition of "Mathematik · Gymnasium 7" (buch/mathegy7/), in the order of the
 * school year (Stoffverteilungsplan svp/mathe/mathegy7.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlbereich 3).
 * Doc, 20.10.2026: "schnapp dir noch 5 Agentinnen und zieht es durch" (round 3, Cristoforetti, block it-12).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matematica · Gymnasium 7',
    short: 'Matematica GY 7',
    lang: 'it',
    druck: false,
    description: 'Libro di testo interattivo di matematica per il Gymnasium (liceo tedesco), 7ª classe, Sassonia: circonferenza e retta, circonferenza circoscritta e inscritta, il teorema di Talete e gli angoli nella circonferenza, costruire e risolvere problemi, i numeri razionali e il calcolo con essi, equazioni e formule, percentuali, prismi e piramidi in assonometria cavaliera, sviluppo piano e proiezioni ortogonali, superficie e volume, diagrammi e i solidi platonici, con sviluppi che si piegano in 3D, costruzioni passo per passo e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Area di apprendimento 1', k: '1.1', title: 'Circonferenza e retta, circoscritta e inscritta',
          sub: 'Retta esterna, tangente e secante, assi e bisettrici nel triangolo', when: 'Agosto · settembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Area di apprendimento 1', k: '1.2', title: 'Teoremi sulla circonferenza',
          sub: 'Teorema di Talete, angolo alla circonferenza e angolo al centro, quadrilatero inscritto, teorema e dimostrazione', when: 'Settembre', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Area di apprendimento 1', k: '1.3', title: 'Costruire e risolvere problemi',
          sub: 'Figura di analisi e piano di costruzione, tangenti da un punto, procedere in avanti e a ritroso', when: 'Settembre · ottobre', ustd: 8 },
        { file: 'lb2-1.html', lb: 'Area di apprendimento 2', k: '2.1', title: 'Numeri razionali',
          sub: 'Numeri negativi, retta dei numeri, valore assoluto e opposto, insiemi numerici', when: 'Ottobre · novembre', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Area di apprendimento 2', k: '2.2', title: 'Calcolare con i numeri razionali',
          sub: 'Le quattro operazioni, regola dei segni, proprietà delle operazioni, potenze e radici quadrate', when: 'Novembre · dicembre', ustd: 16 },
        { file: 'lb2-3.html', lb: 'Area di apprendimento 2', k: '2.3', title: 'Equazioni e formule',
          sub: 'Risolvere equazioni a mente e con trasformazioni equivalenti, problemi, formule inverse', when: 'Dicembre · gennaio', ustd: 16 },
        { file: 'lb2-4.html', lb: 'Area di apprendimento 2', k: '2.4', title: 'Percentuali',
          sub: 'Valore di base, valore percentuale e tasso percentuale, sconto e IVA, aumentare del e fino al, diagrammi', when: 'Febbraio · marzo', ustd: 16 },
        { file: 'lb3-1.html', lb: 'Area di apprendimento 3', k: '3.1', title: 'Rappresentare prismi e piramidi',
          sub: 'Sviluppo piano, assonometria cavaliera e proiezioni ortogonali, vera lunghezza e vera grandezza', when: 'Aprile', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Area di apprendimento 3', k: '3.2', title: 'Superficie, volume e massa',
          sub: 'Calcolare prismi e piramidi, solidi composti, il tronco di piramide', when: 'Aprile · maggio', ustd: 8 },
        { file: 'lb4.html', lb: 'Area di apprendimento 4', k: '4', title: 'Rappresentare i dati',
          sub: 'Diagrammi a colonne, grafici a linee e diagrammi circolari, leggere con occhio critico i diagrammi dei media', when: 'Maggio', ustd: 4 },
        { file: 'wb.html', lb: 'Area opzionale', k: 'OP', title: 'Solidi platonici',
          sub: 'Poliedri, perché ce ne sono esattamente cinque regolari, la formula di Eulero per i poliedri, Platone e Keplero', when: 'Maggio · giugno', ustd: 8 }
    ]
};
