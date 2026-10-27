/* kapitel.js — the chapters of the Italian edition of "Mathematik · Gymnasium 11 · Leistungskurs" (buch/mathegy11lk/), in the order
 * of the school year (Stoffverteilungsplan of the Leistungskurs 11, 5 Ustd./week: LB 1 with LB 2 before the conditions part, Wahlbereich 2 at the end of 11/I,
 * then LB 3 → LB 4). The numbers follow the Lehrplan, so chapter 2 comes between 1.4 and 1.5.
 * Doc, 20.10.2026: "schnapp Dir 6 Agentinnen und macht 6 weitere Bücher in Italienisch" (round 2, Pastori, block it-7).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Matematica · Gymnasium 11 · Leistungskurs',
    short: 'Matematica GY 11 LK',
    lang: 'it',
    description: 'Libro di testo interattivo di matematica per il Gymnasium (liceo tedesco), 11ª classe, Leistungskurs (corso di livello avanzato), Sassonia: limiti e continuità, derivata per definizione e approssimazione lineare, regole di derivazione con dimostrazione, proprietà delle funzioni, matrici con rotazioni e produzione a più stadi, funzioni da condizioni date, ottimizzazione e regressione, metodi numerici fino al teorema del punto fisso, vettori, rette e piani in tutte le posizioni, concetto di probabilità, teorema di Bayes e distribuzione binomiale, con laboratori, simulazioni e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Area di apprendimento 1', k: '1.1', title: 'Limiti e continuità',
          sub: 'Comportamento all’infinito, limite in un punto, teoremi sui limiti, funzioni definite a tratti, continuità', when: 'Agosto · settembre', ustd: 15 },
        { file: 'lb1-2.html', lb: 'Area di apprendimento 1', k: '1.2', title: 'Tassi di variazione e concetto di derivata',
          sub: 'Approssimazione lineare, rapporto incrementale e derivata, derivata per definizione, derivabilità', when: 'Settembre', ustd: 10 },
        { file: 'lb1-3.html', lb: 'Area di apprendimento 1', k: '1.3', title: 'Regole di derivazione',
          sub: 'Regole con dimostrazione, eˣ, ln x e sin x, regola del prodotto e della catena, dalla derivata alla funzione', when: 'Ottobre', ustd: 15 },
        { file: 'lb1-4.html', lb: 'Area di apprendimento 1', k: '1.4', title: 'Studio di funzione',
          sub: 'Monotonia, estremi, concavità e punti di flesso, simmetria, poli, asintoti obliqui', when: 'Novembre', ustd: 14 },
        { file: 'lb2.html', lb: 'Area di apprendimento 2', k: '2', title: 'Matrici',
          sub: 'Ax = b, prodotto di matrici compatibili, metodo di Gauss-Jordan, rotazioni, produzione a più stadi', when: 'Novembre · dicembre', ustd: 6 },
        { file: 'lb1-5.html', lb: 'Area di apprendimento 1', k: '1.5', title: 'Condizioni, ottimizzazione, regressione',
          sub: 'Funzioni da condizioni date, problemi di ottimizzazione, equazioni di funzioni per regressione', when: 'Dicembre', ustd: 12 },
        { file: 'wb2.html', lb: 'Area opzionale 2', k: 'OP', title: 'Metodi numerici',
          sub: 'Soluzione grafica, bisezione, metodo di Newton, iterazione di punto fisso, teorema di Banach', when: 'Gennaio', ustd: 10 },
        { file: 'lb3-1.html', lb: 'Area di apprendimento 3', k: '3.1', title: 'Spazio e vettori',
          sub: 'Sistema di coordinate nello spazio, altri sistemi di coordinate, calcolo con i vettori, proprietà delle operazioni', when: 'Febbraio · marzo', ustd: 10 },
        { file: 'lb3-2.html', lb: 'Area di apprendimento 3', k: '3.2', title: 'Dipendenza lineare e rette',
          sub: 'Dipendenza e indipendenza lineare, rette in forma parametrica, posizione reciproca di due rette', when: 'Marzo', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Area di apprendimento 3', k: '3.3', title: 'Piani e posizioni reciproche',
          sub: 'Equazione parametrica e cartesiana, retta e piano, piano e piano, retta di intersezione', when: 'Marzo · aprile', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Area di apprendimento 4', k: '4.1', title: 'Probabilità e conteggio',
          sub: 'Statistica, Laplace, Kolmogorov, simulazione, modello dell’urna, regole dei percorsi, tabella a doppia entrata, tecniche di conteggio', when: 'Aprile · maggio', ustd: 13 },
        { file: 'lb4-2.html', lb: 'Area di apprendimento 4', k: '4.2', title: 'Probabilità condizionata e Bayes',
          sub: 'Probabilità condizionata, teorema di Bayes con l’albero e la tabella a doppia entrata, indipendenza stocastica', when: 'Maggio', ustd: 8 },
        { file: 'lb4-3.html', lb: 'Area di apprendimento 4', k: '4.3', title: 'La distribuzione binomiale',
          sub: 'Schemi di Bernoulli, derivazione della formula, simbolo di sommatoria, valore atteso, varianza, modellizzare', when: 'Maggio · giugno', ustd: 11 }
    ]
};
