/* kapitel.js — the chapters of the Italian edition of "Mathematik · Gymnasium 12 · Leistungskurs" (buch/mathegy12lk/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathegy12lk.html: LB 5 → Wahlbereich 5 → LB 6 → LB 7 → LB 8 → LB 9 → Abitur; 5 Ustd./week).
 * Doc, 20.10.2026: "schnapp Dir 6 Agentinnen und macht 6 weitere Bücher in Italienisch" (round 2, Gianotti, block it-9).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matematica · Gymnasium 12 · Leistungskurs',
    short: 'Matematica GY 12 LK',
    lang: 'it',
    druck: false,
    description: 'Libro di testo interattivo di matematica per il Gymnasium (liceo tedesco), 12ª classe, Leistungskurs (corso di livello avanzato), Sassonia: calcolo integrale con funzione integrale, teorema fondamentale e solidi di rotazione in vero 3D, integrazione numerica fino a Simpson, variabili aleatorie normali e De Moivre-Laplace, stima e test di significatività, distanze e angoli nello spazio con la forma normale di Hesse e rette sghembe, estremi, simmetrie, regioni illimitate, famiglie e luoghi geometrici e allenamento per l’Abitur, con laboratori, simulazioni e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb5-1.html', lb: 'Area di apprendimento 5', k: '5.1', title: 'Primitive e integrazione',
          sub: 'La derivazione al contrario, integrali immediati, sostituzione lineare, funzioni composte con il CAS', when: 'Agosto · settembre', ustd: 15 },
        { file: 'lb5-2.html', lb: 'Area di apprendimento 5', k: '5.2', title: 'L’integrale definito e il teorema fondamentale',
          sub: 'Quantità dai tassi di variazione, grandezze fisiche, somme di Riemann, proprietà, funzione integrale, teorema fondamentale con dimostrazione', when: 'Settembre', ustd: 10 },
        { file: 'lb5-3.html', lb: 'Area di apprendimento 5', k: '5.3', title: 'Aree e solidi di rotazione',
          sub: 'Area con l’asse x e tra due grafici, volume nella rotazione attorno all’asse x, cono e sfera dedotti', when: 'Ottobre', ustd: 10 },
        { file: 'wb5.html', lb: 'Area opzionale 5', k: 'OP', title: 'Integrazione numerica',
          sub: 'Storia del calcolo integrale, metodo dei rettangoli e dei trapezi, regola delle botti di Keplero, Simpson, confronto dei metodi', when: 'Novembre', ustd: 10 },
        { file: 'lb6.html', lb: 'Area di apprendimento 6', k: '6', title: 'Variabili aleatorie normali',
          sub: 'Curva a campana di Gauss, funzione di densità e funzione di ripartizione, valore atteso e deviazione standard, regole σ, De Moivre-Laplace', when: 'Novembre', ustd: 10 },
        { file: 'lb7.html', lb: 'Area di apprendimento 7', k: '7', title: 'Statistica inferenziale',
          sub: 'Campioni, stima di proporzioni, media e varianza, test di significatività unilaterali e bilaterali, livello di confidenza', when: 'Dicembre', ustd: 15 },
        { file: 'lb8-1.html', lb: 'Area di apprendimento 8', k: '8.1', title: 'Prodotto scalare, prodotto vettoriale e forma normale di Hesse',
          sub: 'Angolo e proiezione, vettore perpendicolare e area, equazione normale ed equazione cartesiana, forma normale di Hesse per la retta e il piano', when: 'Gennaio', ustd: 10 },
        { file: 'lb8-2.html', lb: 'Area di apprendimento 8', k: '8.2', title: 'Angoli di intersezione',
          sub: 'Retta e retta, retta e piano, piano e piano, inclinazioni nei solidi', when: 'Gennaio', ustd: 5 },
        { file: 'lb8-3.html', lb: 'Area di apprendimento 8', k: '8.3', title: 'Distanze',
          sub: 'Punto e punto, punto e piano, retta e piano, piano e piano, punto e retta, rette sghembe', when: 'Febbraio', ustd: 10 },
        { file: 'lb9-1.html', lb: 'Area di apprendimento 9', k: '9.1', title: 'Distanze estreme, angoli e simmetrie',
          sub: 'Funzione distanza, punto e curva, angolo visuale massimo, simmetria rispetto a un punto e a un piano, cammini minimi', when: 'Febbraio · marzo', ustd: 10 },
        { file: 'lb9-2.html', lb: 'Area di apprendimento 9', k: '9.2', title: 'Aree, densità, famiglie e luoghi geometrici',
          sub: 'Aree in tre modi, regioni illimitate, densità e probabilità, famiglie di funzioni, luoghi geometrici, fasci di rette e di piani', when: 'Marzo', ustd: 10 },
        { file: 'abi.html', lb: 'Abitur', k: 'A', title: 'Pronti per l’Abitur',
          sub: 'Liste di controllo, errori tipici ed esercizi in formato Abitur del Leistungskurs dell’11ª e della 12ª classe', when: 'Aprile', ustd: 0 }
    ]
};
