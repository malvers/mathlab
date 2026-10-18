/* kapitel.js — the chapters of the Italian edition of "Mathematik · Berufliches Gymnasium 12" (buch/mathe12/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe12.html: LB 1 → LB 2 → LB 5).
 * Doc, 18.10.2026: "macht die Übersetzung für die Mathebücher BGY elf zwölf dreizehn. Bitte in Italienisch." (package IT0:
 * start page and this file; the chapters: IT2). Terms as in tools/buch-it/glossario.md. Single source for the table of
 * contents (index.html) and the previous/next cards at the end of every chapter. No print edition: druck: false hides the
 * page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matematica · Berufliches Gymnasium 12',
    short: 'Matematica 12',
    lang: 'it',
    druck: false,
    description: 'Libro di testo interattivo di matematica per il Berufliches Gymnasium (liceo tedesco a indirizzo professionale), 12ª classe, Sassonia: variabili aleatorie discrete e distribuzione binomiale, calcolo differenziale dai limiti ai problemi di ottimizzazione, e vettori nello spazio, con laboratori, simulazioni, grafica 3D e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Area di apprendimento 1', k: '1.1', title: 'Probabilità condizionata',
          sub: 'Diagrammi ad albero, tabelle a doppia entrata, indipendenza stocastica', when: 'Agosto · settembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Area di apprendimento 1', k: '1.2', title: 'Variabili aleatorie',
          sub: 'Distribuzione di probabilità, valore atteso, varianza, giochi equi', when: 'Settembre', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Area di apprendimento 1', k: '1.3', title: 'La distribuzione binomiale',
          sub: 'Schemi di Bernoulli, coefficiente binomiale, probabilità cumulate', when: 'Ottobre · novembre', ustd: 20 },
        { file: 'lb2-1.html', lb: 'Area di apprendimento 2', k: '2.1', title: 'Limiti',
          sub: 'Comportamento all’infinito, asintoti, continuità', when: 'Novembre · dicembre', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Area di apprendimento 2', k: '2.2', title: 'La derivata',
          sub: 'Tassi di variazione, dalla secante alla tangente, derivare graficamente', when: 'Dicembre', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Area di apprendimento 2', k: '2.3', title: 'Regole di derivazione',
          sub: 'Regole della potenza, della somma e del fattore costante, eˣ e sin x, prodotti semplici', when: 'Gennaio', ustd: 12 },
        { file: 'lb2-4.html', lb: 'Area di apprendimento 2', k: '2.4', title: 'Monotonia, estremi, punti di flesso',
          sub: 'Che cosa rivelano f′ e f″ sul grafico', when: 'Gennaio · marzo', ustd: 12 },
        { file: 'lb2-5.html', lb: 'Area di apprendimento 2', k: '2.5', title: 'Studiare i grafici',
          sub: 'Simmetria, asintoti, tangenti e normali, funzioni in contesto', when: 'Marzo', ustd: 12 },
        { file: 'lb2-6.html', lb: 'Area di apprendimento 2', k: '2.6', title: 'Determinare funzioni e problemi di ottimizzazione',
          sub: 'Funzioni a partire da condizioni, trovare il meglio', when: 'Aprile · maggio', ustd: 20 },
        { file: 'lb5-1.html', lb: 'Area di apprendimento 5', k: '5.1', title: 'Vettori nello spazio',
          sub: 'Punti e vettori, calcolare con i vettori, modulo, punto medio', when: 'Maggio · giugno', ustd: 12 },
        { file: 'lb5-2.html', lb: 'Area di apprendimento 5', k: '5.2', title: 'Prodotto scalare e angoli',
          sub: 'Ortogonalità, angolo tra vettori, dimostrazioni sui quadrilateri', when: 'Giugno · luglio', ustd: 8 }
    ]
};
