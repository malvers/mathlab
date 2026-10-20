/* kapitel.js — the chapters of the Italian edition of "Mathematik · Fachoberschule 12" (buch/mathefos12/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathefos12.html: LB 1 → LB 2 → LB 3 → LB 4 → FHR-Prüfung → Wahlbereich 3; 4 Ustd./week).
 * Doc, 20.10.2026: "schnapp Dir 6 Agentinnen und macht 6 weitere Bücher in Italienisch" (round 2, tools/buch-it/README.md, block it-5).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matematica · Fachoberschule 12',
    short: 'Matematica FOS 12',
    lang: 'it',
    druck: false,
    description: 'Libro di testo interattivo di matematica per la Fachoberschule (scuola superiore tecnica tedesca), 12ª classe, Sassonia: vettori, rette e piani nello spazio in vero 3D, calcolo differenziale dai limiti ai problemi di ottimizzazione, calcolo integrale, funzioni razionali fratte ed esponenziali, allenamento per l’esame della Fachhochschulreife e un’area opzionale con il CAS, con laboratori, simulazioni e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Area di apprendimento 1', k: '1.1', title: 'Vettori e prodotto scalare',
          sub: 'Frecce nello spazio, modulo, calcolare con i vettori, angolo e ortogonalità', when: 'Agosto · settembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Area di apprendimento 1', k: '1.2', title: 'Rette nello spazio',
          sub: 'Equazione parametrica, verifica di appartenenza, punti traccia, posizione reciproca, angolo di intersezione', when: 'Settembre', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Area di apprendimento 1', k: '1.3', title: 'Piani nello spazio',
          sub: 'Equazione parametrica ed equazione cartesiana, prodotto vettoriale, retta e piano', when: 'Settembre · ottobre', ustd: 8 },
        { file: 'lb1-4.html', lb: 'Area di apprendimento 1', k: '1.4', title: 'Perpendicolare, distanza e aree',
          sub: 'Piede della perpendicolare, distanza punto–piano, aree, applicazioni miste', when: 'Ottobre · novembre', ustd: 6 },
        { file: 'lb2-1.html', lb: 'Area di apprendimento 2', k: '2.1', title: 'Limiti e tassi di variazione',
          sub: 'Successioni numeriche, comportamento all’infinito, continuità, velocità media e istantanea', when: 'Novembre', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Area di apprendimento 2', k: '2.2', title: 'La derivata',
          sub: 'Limite del rapporto incrementale, regole di derivazione, regola della catena, tangente e normale', when: 'Novembre · dicembre', ustd: 12 },
        { file: 'lb2-3.html', lb: 'Area di apprendimento 2', k: '2.3', title: 'Studio di funzione',
          sub: 'Zeri, simmetria, monotonia, punti di estremo e di flesso, lo schema completo', when: 'Dicembre · gennaio', ustd: 8 },
        { file: 'lb2-4.html', lb: 'Area di apprendimento 2', k: '2.4', title: 'Famiglie, determinazione di funzioni e ottimizzazione',
          sub: 'Punti di intersezione e di tangenza, famiglie di funzioni, funzioni a partire da condizioni, ottimizzare', when: 'Gennaio', ustd: 7 },
        { file: 'lb3.html', lb: 'Area di apprendimento 3', k: '3', title: 'Calcolo integrale',
          sub: 'Primitive, integrale definito, teorema fondamentale, aree tra grafici', when: 'Febbraio · marzo', ustd: 10 },
        { file: 'lb4-1.html', lb: 'Area di apprendimento 4', k: '4.1', title: 'Funzioni razionali fratte',
          sub: 'Poli e discontinuità eliminabili, asintoti, regola del quoziente, studio completo', when: 'Marzo', ustd: 12 },
        { file: 'lb4-2.html', lb: 'Area di apprendimento 4', k: '4.2', title: 'Funzioni esponenziali in base e',
          sub: 'Il numero e, equazioni esponenziali, derivare con la regola della catena e del prodotto, crescita', when: 'Aprile', ustd: 13 },
        { file: 'fhr.html', lb: 'Esame', k: 'P', title: 'In forma per l’esame della FHR',
          sub: 'Liste di controllo ed esercizi nel formato dell’esame da tutte le aree di apprendimento', when: 'Maggio', ustd: 0 },
        { file: 'wb3.html', lb: 'Area opzionale 3', k: 'OP', title: 'Calcolo differenziale e integrale con il CAS',
          sub: 'Famiglie con due parametri, funzioni definite a tratti, regressione, uno sguardo alla proiezione centrale', when: 'Giugno', ustd: 8 }
    ]
};
