/* kapitel.js — the chapters of the Italian edition of "Mathematik · Berufliches Gymnasium 13 · Leistungskurs" (buch/mathe13lk/), in the
 * order of the school year (Lehrplan Berufliches Gymnasium Mathematik, Sachsen, 2026, Leistungskurs Jahrgangsstufe 13: LB 3 → LB 4 → LB 5 →
 * Wahlpflicht 1 or Wahlpflicht 2 (the school chooses one, the book has both) → LB 7 → Abiturvorbereitung).
 * Doc, 28.10.2026: "Die Übersetzung, die fangen wir heute an. Und ziehen es durch." (Pastori, block it-23).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Matematica · Berufliches Gymnasium 13 · Leistungskurs',
    short: 'Matematica 13 LK',
    lang: 'it',
    description: 'Libro di testo interattivo di matematica per il Berufliches Gymnasium (liceo tedesco a indirizzo professionale), 13ª classe, Leistungskurs (corso di livello avanzato), Sassonia: calcolo integrale con teorema fondamentale e solidi di rotazione, variabili aleatorie normali, statistica inferenziale, entrambe le aree a scelta – rette e piani nello spazio oppure matrici con il modello di Leontief e i modelli di popolazione –, altre applicazioni e un capitolo per prepararsi all’Abitur, con laboratori, simulazioni, grafica 3D e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb3-1.html', lb: 'Area di apprendimento 3', k: '3.1', title: 'Primitive',
          sub: 'Derivare all’indietro, verifica, regole di integrazione, 1/x e ln|x|, CAS', when: 'Agosto · settembre', ustd: 10 },
        { file: 'lb3-2.html', lb: 'Area di apprendimento 3', k: '3.2', title: 'L’integrale definito e il teorema fondamentale',
          sub: 'Quantità ricostruita, proprietà, funzione integrale, teorema fondamentale con dimostrazione', when: 'Settembre', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Area di apprendimento 3', k: '3.3', title: 'Aree',
          sub: 'Tra un grafico e l’asse x, tra due grafici, aree con parametro', when: 'Ottobre', ustd: 8 },
        { file: 'lb3-4.html', lb: 'Area di apprendimento 3', k: '3.4', title: 'Integrazione numerica e solidi di rotazione',
          sub: 'Metodo dei rettangoli e dei trapezi, volume nella rotazione attorno all’asse x', when: 'Ottobre · novembre', ustd: 10 },
        { file: 'lb4.html', lb: 'Area di apprendimento 4', k: '4', title: 'Variabili aleatorie normali',
          sub: 'Curva a campana, funzione di densità e funzione di ripartizione, valore atteso, deviazione standard, regole σ', when: 'Novembre', ustd: 12 },
        { file: 'lb5-1.html', lb: 'Area di apprendimento 5', k: '5.1', title: 'Popolazione e campione',
          sub: 'Stimare e verificare, media campionaria e varianza campionaria', when: 'Dicembre', ustd: 5 },
        { file: 'lb5-2.html', lb: 'Area di apprendimento 5', k: '5.2', title: 'Test di significatività',
          sub: 'Test unilaterali e bilaterali, regione di rifiuto, errori di I e di II specie, significatività statistica', when: 'Dicembre · gennaio', ustd: 10 },
        { file: 'wp1-1.html', lb: 'Area a scelta 1', k: 'OP1.1', title: 'Rette e piani',
          sub: 'Equazioni parametriche, prodotto vettoriale, equazione cartesiana, forma normale di Hesse', when: 'Gennaio', ustd: 9 },
        { file: 'wp1-2.html', lb: 'Area a scelta 1', k: 'OP1.2', title: 'Posizioni reciproche e angoli di intersezione',
          sub: 'Punto, retta, piano: intersezioni, punti traccia, rette traccia, angoli di intersezione', when: 'Gennaio · febbraio', ustd: 9 },
        { file: 'wp1-3.html', lb: 'Area a scelta 1', k: 'OP1.3', title: 'Distanze, prismi e piramidi',
          sub: 'Distanza punto–piano, retta–piano, piano–piano, superficie totale e volume', when: 'Febbraio', ustd: 7 },
        { file: 'wp2-1.html', lb: 'Area a scelta 2', k: 'OP2.1', title: 'Moltiplicare e invertire matrici',
          sub: 'Prodotto di matrici, matrice identità, matrice inversa, sistemi di equazioni con l’inversa', when: 'Gennaio', ustd: 8 },
        { file: 'wp2-2.html', lb: 'Area a scelta 2', k: 'OP2.2', title: 'Produzione a più stadi e modello di Leontief',
          sub: 'Grafi di Gozinto, produzione a più stadi, calcolo dei costi, analisi input-output', when: 'Gennaio · febbraio', ustd: 9 },
        { file: 'wp2-3.html', lb: 'Area a scelta 2', k: 'OP2.3', title: 'Modelli di popolazione',
          sub: 'Matrici di transizione, potenze di matrici, matrice limite e vettore stazionario, sviluppo ciclico', when: 'Febbraio', ustd: 8 },
        { file: 'lb7-1.html', lb: 'Area di apprendimento 7', k: '7.1', title: 'Equazioni biquadratiche e famiglie di funzioni',
          sub: 'Sostituzione, famiglie, parametro e numero di soluzioni, luoghi geometrici', when: 'Febbraio · marzo', ustd: 8 },
        { file: 'lb7-2.html', lb: 'Area di apprendimento 7', k: '7.2', title: 'Parametri ed estremi nello spazio e in economia',
          sub: 'Sistemi di equazioni con parametro, matrici di rotazione, distanze minime, costi, ricavo e profitto', when: 'Marzo', ustd: 7 },
        { file: 'abi.html', lb: 'Abitur', k: 'A', title: 'Pronti per l’Abitur',
          sub: 'Liste di controllo, errori tipici ed esercizi in formato Abitur del Leistungskurs dell’11ª, della 12ª e della 13ª classe', when: 'Marzo · aprile', ustd: 0 }
    ]
};
