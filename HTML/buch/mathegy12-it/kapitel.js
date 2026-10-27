/* kapitel.js — the chapters of the Italian edition of "Mathematik · Gymnasium 12" (buch/mathegy12/, Grundkurs), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathegy12.html: LB 5 → Wahlbereich 5 → LB 6 → LB 7 → LB 8 → Abitur; 4 Ustd./week).
 * Doc, 20.10.2026: "schnapp Dir 6 Agentinnen und macht 6 weitere Bücher in Italienisch" (round 2, Hack, block it-8).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Matematica · Gymnasium 12',
    short: 'Matematica GY 12',
    lang: 'it',
    description: 'Libro di testo interattivo di matematica per il Gymnasium (liceo tedesco), 12ª classe, corso di base (Sassonia): il calcolo integrale dalla ricerca delle primitive all’area tra due grafici, integrazione numerica, stime e test di significatività, distanze e angoli nello spazio in vero 3D, distanze minime, simmetrie, famiglie di funzioni e di rette e allenamento per l’Abitur, con laboratori, simulazioni e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb5-1.html', lb: 'Area di apprendimento 5', k: '5.1', title: 'Primitive e integrazione',
          sub: 'La derivazione al contrario, integrali immediati, regole di integrazione, funzioni composte lineari, CAS', when: 'Agosto · settembre', ustd: 12 },
        { file: 'lb5-2.html', lb: 'Area di apprendimento 5', k: '5.2', title: 'L’integrale definito',
          sub: 'Quantità dai tassi di variazione, somme superiori e inferiori, proprietà, teorema fondamentale, funzione integrale', when: 'Settembre', ustd: 8 },
        { file: 'lb5-3.html', lb: 'Area di apprendimento 5', k: '5.3', title: 'Aree',
          sub: 'Area tra il grafico e l’asse x, tra due grafici, estremi incogniti, problemi applicativi', when: 'Settembre · ottobre', ustd: 8 },
        { file: 'wb5.html', lb: 'Area opzionale 5', k: 'OP', title: 'Integrazione numerica',
          sub: 'Storia del calcolo integrale, metodo dei rettangoli e dei trapezi, precisione', when: 'Ottobre · novembre', ustd: 8 },
        { file: 'lb6.html', lb: 'Area di apprendimento 6', k: '6', title: 'Statistica inferenziale',
          sub: 'Campioni, stima di proporzioni, media e varianza, test di significatività unilaterali e bilaterali', when: 'Novembre', ustd: 12 },
        { file: 'lb7-1.html', lb: 'Area di apprendimento 7', k: '7.1', title: 'Prodotto scalare, prodotto vettoriale e forma normale',
          sub: 'Angolo e proiezione, vettore perpendicolare e area, forma normale ed equazione cartesiana', when: 'Dicembre', ustd: 8 },
        { file: 'lb7-2.html', lb: 'Area di apprendimento 7', k: '7.2', title: 'Angoli di intersezione',
          sub: 'Retta e retta, retta e piano, piano e piano, inclinazioni nei solidi', when: 'Gennaio', ustd: 8 },
        { file: 'lb7-3.html', lb: 'Area di apprendimento 7', k: '7.3', title: 'Distanze',
          sub: 'Punto e punto, piede della perpendicolare, distanza punto–piano, forma normale di Hesse, applicazioni', when: 'Gennaio', ustd: 8 },
        { file: 'lb8-1.html', lb: 'Area di apprendimento 8', k: '8.1', title: 'Distanze minime e simmetrie',
          sub: 'Funzione distanza, punto e retta, punto e curva, simmetria rispetto a un punto e a un piano, percorsi più brevi', when: 'Febbraio', ustd: 8 },
        { file: 'lb8-2.html', lb: 'Area di apprendimento 8', k: '8.2', title: 'Aree e famiglie',
          sub: 'Aree per tre strade, famiglie di funzioni e luoghi geometrici, fasci di rette, problemi di collegamento', when: 'Marzo', ustd: 12 },
        { file: 'abi.html', lb: 'Esame', k: 'A', title: 'Pronti per l’Abitur',
          sub: 'Liste di controllo, errori tipici ed esercizi in formato d’Abitur dell’11ª e della 12ª classe', when: 'Aprile', ustd: 0 }
    ]
};
