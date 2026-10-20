/* kapitel.js — the chapters of the Italian edition of "Mathematik · Fachoberschule 11" (buch/mathefos11/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathefos11.html: LB 1 → LB 2 → Wahlbereich 2, then the outlooks of Wahlbereich 1 and 3; 3 Ustd./week).
 * Doc, 20.10.2026: "schnapp Dir 6 Agentinnen und macht 6 weitere Bücher in Italienisch" (round 2, block it-4, tools/buch-it/README.md).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matematica · Fachoberschule 11',
    short: 'Matematica FOS 11',
    lang: 'it',
    druck: false,
    description: 'Libro di testo interattivo di matematica per la Fachoberschule (scuola superiore tecnico-professionale tedesca), 11ª classe, Sassonia: espressioni e formule, funzioni lineari e quadratiche, equazioni, disequazioni e sistemi di equazioni, funzioni polinomiali, probabilità, calcolo combinatorio e schemi di Bernoulli, matematica finanziaria e uno sguardo sui numeri complessi e sull’algebra dei circuiti, con laboratori, simulazioni e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Area di apprendimento 1', k: '1.1', title: 'Numeri, espressioni e formule',
          sub: 'Insiemi numerici, ricavare una variabile da una formula, valore assoluto, prodotti notevoli, percentuali, potenze', when: 'Agosto · settembre', ustd: 6 },
        { file: 'lb1-2.html', lb: 'Area di apprendimento 1', k: '1.2', title: 'Funzioni e funzioni lineari',
          sub: 'Concetto di funzione, pendenza e intercetta, equazioni della retta, angolo di inclinazione', when: 'Settembre', ustd: 9 },
        { file: 'lb1-3.html', lb: 'Area di apprendimento 1', k: '1.3', title: 'Equazioni e disequazioni lineari',
          sub: 'Trasformazioni equivalenti, insiemi delle soluzioni, equazioni fratte', when: 'Ottobre', ustd: 6 },
        { file: 'lb1-4.html', lb: 'Area di apprendimento 1', k: '1.4', title: 'Rette e sistemi di equazioni lineari',
          sub: 'Parametri, posizioni reciproche, tre metodi risolutivi, applicazioni', when: 'Novembre', ustd: 9 },
        { file: 'lb1-5.html', lb: 'Area di apprendimento 1', k: '1.5', title: 'Funzioni ed equazioni quadratiche',
          sub: 'Forma del vertice e forma normale, formula risolutiva, relazioni di Viète', when: 'Dicembre', ustd: 6 },
        { file: 'lb1-6.html', lb: 'Area di apprendimento 1', k: '1.6', title: 'Parabole su misura',
          sub: 'Fattori lineari, equazioni di funzioni da condizioni date, parametri con distinzione dei casi', when: 'Gennaio', ustd: 6 },
        { file: 'lb1-7.html', lb: 'Area di apprendimento 1', k: '1.7', title: 'Funzioni polinomiali',
          sub: 'Scomposizione in fattori lineari, sostituzione, molteplicità, andamento del grafico', when: 'Gennaio', ustd: 3 },
        { file: 'lb2-1.html', lb: 'Area di apprendimento 2', k: '2.1', title: 'Caso e probabilità',
          sub: 'Esiti ed eventi, legge dei grandi numeri, Laplace, operazioni con gli eventi', when: 'Febbraio · marzo', ustd: 9 },
        { file: 'lb2-2.html', lb: 'Area di apprendimento 2', k: '2.2', title: 'Esperimenti aleatori a più stadi',
          sub: 'Indipendenza, diagrammi ad albero e regole dei percorsi, applicazioni', when: 'Marzo', ustd: 9 },
        { file: 'lb2-3.html', lb: 'Area di apprendimento 2', k: '2.3', title: 'Calcolo combinatorio, modello dell’urna e schemi di Bernoulli',
          sub: 'Principio di moltiplicazione, permutazioni, disposizioni, combinazioni, formula di Bernoulli', when: 'Aprile', ustd: 12 },
        { file: 'wb2.html', lb: 'Area opzionale 2', k: 'OP', title: 'Matematica finanziaria',
          sub: 'Interesse composto, piani di risparmio, ammortamento a quote capitale costanti e a rate costanti', when: 'Maggio', ustd: 6 },
        { file: 'exkurse.html', lb: 'Prospettive', k: 'E', title: 'Numeri complessi e algebra dei circuiti',
          sub: 'Aree opzionali 1 e 3 come escursioni: piano di Gauss, tavole di verità, circuiti', when: 'Giugno', ustd: 0 }
    ]
};
