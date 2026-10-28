/* kapitel.js — the chapters of the Italian edition of "Mathematik · Berufliches Gymnasium 12 · Leistungskurs" (buch/mathe12lk/), in the
 * order of the school year (Lehrplan Berufliches Gymnasium Mathematik, Sachsen, 2026, Leistungskurs: LB 1 → LB 2 → LB 6 in Jahrgangsstufe 12).
 * Doc, 28.10.2026: "Die Übersetzung, die fangen wir heute an. Und ziehen es durch." (Cibrario, block it-22).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Matematica · Berufliches Gymnasium 12 · Leistungskurs',
    short: 'Matematica 12 LK',
    lang: 'it',
    description: 'Libro di testo interattivo di matematica per il Berufliches Gymnasium (liceo tedesco a indirizzo professionale), 12ª classe, Leistungskurs (corso di livello avanzato), Sassonia: variabili aleatorie discrete con funzione di ripartizione e distribuzione binomiale, calcolo differenziale dai limiti e dalla continuità alle regole del prodotto e della catena, alla regressione e ai problemi di ottimizzazione, geometria vettoriale nello spazio, con dimostrazioni, laboratori, grafica 3D e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Area di apprendimento 1', k: '1.1', title: 'Probabilità condizionata',
          sub: 'Diagrammi ad albero, tabelle a doppia entrata, teorema di Bayes, indipendenza', when: 'Agosto · settembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Area di apprendimento 1', k: '1.2', title: 'Variabili aleatorie',
          sub: 'Funzione di probabilità e funzione di ripartizione, valore atteso, varianza', when: 'Settembre · ottobre', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Area di apprendimento 1', k: '1.3', title: 'La distribuzione binomiale',
          sub: 'Schemi di Bernoulli, simbolo di sommatoria, ricerca di n e p, parametri', when: 'Ottobre · novembre', ustd: 20 },
        { file: 'lb2-1.html', lb: 'Area di apprendimento 2', k: '2.1', title: 'Limiti e continuità',
          sub: 'Comportamento all’infinito, limite in un punto, punti di discontinuità', when: 'Novembre · dicembre', ustd: 10 },
        { file: 'lb2-2.html', lb: 'Area di apprendimento 2', k: '2.2', title: 'La derivata',
          sub: 'Tassi di variazione, limite del rapporto incrementale, approssimazione lineare', when: 'Dicembre · gennaio', ustd: 12 },
        { file: 'lb2-3.html', lb: 'Area di apprendimento 2', k: '2.3', title: 'Regole di derivazione',
          sub: 'Regole della potenza, del fattore costante e della somma, eˣ, ln x, sin x, cos x', when: 'Gennaio', ustd: 12 },
        { file: 'lb2-4.html', lb: 'Area di apprendimento 2', k: '2.4', title: 'Regola del prodotto e regola della catena',
          sub: 'Derivare prodotti e funzioni composte, radici e funzioni esponenziali', when: 'Febbraio', ustd: 12 },
        { file: 'lb2-5.html', lb: 'Area di apprendimento 2', k: '2.5', title: 'Monotonia, estremi, punti di flesso',
          sub: 'Condizioni necessarie e sufficienti, estremi assoluti', when: 'Febbraio · marzo', ustd: 14 },
        { file: 'lb2-6.html', lb: 'Area di apprendimento 2', k: '2.6', title: 'Studiare i grafici',
          sub: 'Simmetria, asintoti, tangenti e normali, problemi in contesto', when: 'Marzo · aprile', ustd: 14 },
        { file: 'lb2-7.html', lb: 'Area di apprendimento 2', k: '2.7', title: 'Determinare funzioni e regressione',
          sub: 'Funzioni a partire da condizioni, modelli di regressione con strumenti digitali', when: 'Aprile', ustd: 9 },
        { file: 'lb2-8.html', lb: 'Area di apprendimento 2', k: '2.8', title: 'Problemi di ottimizzazione',
          sub: 'Modellizzare, estremi al bordo, distinzione dei casi', when: 'Maggio', ustd: 12 },
        { file: 'lb6-1.html', lb: 'Area di apprendimento 6', k: '6.1', title: 'Vettori nello spazio',
          sub: 'Vettori posizione e vettori congiungenti, combinazione lineare, baricentri', when: 'Maggio · giugno', ustd: 12 },
        { file: 'lb6-2.html', lb: 'Area di apprendimento 6', k: '6.2', title: 'Prodotto scalare e angoli',
          sub: 'Ortogonalità, angoli, verifiche e dimostrazioni con i vettori', when: 'Giugno · luglio', ustd: 8 }
    ]
};
