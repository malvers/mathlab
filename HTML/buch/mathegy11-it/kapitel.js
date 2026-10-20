/* kapitel.js — the chapters of the Italian edition of "Mathematik · Gymnasium 11" (buch/mathegy11/, Grundkurs), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathegy11.html: LB 1 with LB 2 before the conditions part, Wahlbereich 2 at the end of 11/I,
 * then LB 3 → LB 4; 4 Ustd./week). The numbers follow the Lehrplan, so chapter 2 comes between 1.4 and 1.5.
 * Doc, 20.10.2026: "schnapp Dir 6 Agentinnen und macht 6 weitere Bücher in Italienisch" (round 2, Nalli, block it-6).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matematica · Gymnasium 11',
    short: 'Matematica GY 11',
    lang: 'it',
    druck: false,
    description: 'Libro di testo interattivo di matematica per il Gymnasium (liceo tedesco), 11ª classe, corso base (Sassonia): limiti, la derivata e le regole di derivazione, studio di funzione, funzioni da condizioni date, problemi di ottimizzazione e regressione, matrici e metodo di Gauss-Jordan, metodi numerici, vettori, rette e piani nello spazio, esperimenti aleatori a più stadi e la distribuzione binomiale, con laboratori, simulazioni e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Area di apprendimento 1', k: '1.1', title: 'Limiti e continuità',
          sub: 'Comportamento all’infinito, limite in un punto, teoremi sui limiti, continuità', when: 'Agosto · settembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Area di apprendimento 1', k: '1.2', title: 'Tassi di variazione e derivata',
          sub: 'Secante e tangente, rapporto incrementale e derivata, funzione derivata', when: 'Settembre', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Area di apprendimento 1', k: '1.3', title: 'Regole di derivazione',
          sub: 'Regole della potenza, del fattore costante e della somma, eˣ, ln x e sin x, regole del prodotto e della catena', when: 'Settembre · ottobre', ustd: 12 },
        { file: 'lb1-4.html', lb: 'Area di apprendimento 1', k: '1.4', title: 'Studiare le funzioni',
          sub: 'Monotonia, estremi, punti di flesso, simmetria, poli e asintoti', when: 'Ottobre · novembre', ustd: 12 },
        { file: 'lb2.html', lb: 'Area di apprendimento 2', k: '2', title: 'Matrici',
          sub: 'Notazione matriciale, moltiplicazione, metodo di Gauss-Jordan, rotazioni', when: 'Novembre · dicembre', ustd: 6 },
        { file: 'lb1-5.html', lb: 'Area di apprendimento 1', k: '1.5', title: 'Funzioni su misura',
          sub: 'Funzioni da condizioni date, problemi di ottimizzazione, regressione', when: 'Dicembre · gennaio', ustd: 12 },
        { file: 'wb2.html', lb: 'Area opzionale 2', k: 'OP', title: 'Metodi numerici',
          sub: 'Risolvere equazioni graficamente, bisezione, metodo di Newton', when: 'Gennaio · febbraio', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Area di apprendimento 3', k: '3.1', title: 'Vettori nello spazio',
          sub: 'Sistema di coordinate nello spazio, operazioni con i vettori, dipendenza lineare', when: 'Febbraio · marzo', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Area di apprendimento 3', k: '3.2', title: 'Rette nello spazio',
          sub: 'Equazione parametrica, verifica di appartenenza, punti traccia, posizione reciproca di due rette', when: 'Marzo', ustd: 8 },
        { file: 'lb3-3.html', lb: 'Area di apprendimento 3', k: '3.3', title: 'Piani',
          sub: 'Equazione parametrica, equazione cartesiana, posizione reciproca di una retta e un piano', when: 'Aprile', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Area di apprendimento 4', k: '4.1', title: 'Esperimenti aleatori a più stadi',
          sub: 'Modello dell’urna, regole dei percorsi, tabella a doppia entrata, indipendenza, simulazione', when: 'Aprile · maggio', ustd: 6 },
        { file: 'lb4-2.html', lb: 'Area di apprendimento 4', k: '4.2', title: 'La distribuzione binomiale',
          sub: 'Schemi di Bernoulli, coefficiente binomiale, probabilità cumulate, valore atteso e dispersione', when: 'Maggio · giugno', ustd: 12 }
    ]
};
