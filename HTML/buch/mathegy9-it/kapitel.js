/* kapitel.js — the chapters of the Italian edition of "Mathematik · Gymnasium 9" (buch/mathegy9/), in the order of the
 * school year. Doc, 20.10.2026: "schnapp dir noch 5 Agentinnen und zieht es durch" (round 3, block it-14, tools/buch-it/README.md).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matematica · Gymnasium 9',
    short: 'Matematica GY 9',
    lang: 'it',
    druck: false,
    description: 'Libro di testo interattivo di matematica per il Gymnasium (liceo tedesco che porta all’Abitur), 9ª classe, Sassonia: potenze e radici, funzioni potenza, funzioni ed equazioni quadratiche, problemi di massimo e minimo, cerchio, cilindro e sfera, il gruppo dei teoremi di Pitagora, trigonometria nel triangolo rettangolo, piramide e cono, analisi dei dati e la sezione aurea, con laboratori, simulazioni e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Area di apprendimento 1', k: '1.1', title: 'Potenze e radici',
          sub: 'Elevare a potenza ed estrarre radici, proprietà delle potenze con esponenti razionali, equazioni irrazionali', when: 'Agosto · settembre', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Area di apprendimento 1', k: '1.2', title: 'Funzioni potenza',
          sub: 'Esponenti interi e razionali, simmetria, zeri e poli, asintoti', when: 'Settembre', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Area di apprendimento 1', k: '1.3', title: 'Parametri e funzioni quadratiche',
          sub: 'Dilatare, traslare, riflettere, forma normale e forma del vertice, completamento del quadrato', when: 'Ottobre', ustd: 8 },
        { file: 'lb1-4.html', lb: 'Area di apprendimento 1', k: '1.4', title: 'Equazioni quadratiche e valori estremi',
          sub: 'Formula risolutiva, discriminante, relazioni di Viète, problemi di ottimizzazione con il vertice', when: 'Novembre', ustd: 16 },
        { file: 'lb2.html', lb: 'Area di apprendimento 2', k: '2', title: 'Cerchio, cilindro e sfera',
          sub: 'Arco e settore circolare, superficie totale, volume e massa, Archimede', when: 'Dicembre', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Area di apprendimento 3', k: '3.1', title: 'Il gruppo dei teoremi di Pitagora',
          sub: 'Teorema e dimostrazione, segmenti nel piano e nello spazio, teoremi di Euclide, teorema inverso', when: 'Gennaio · febbraio', ustd: 16 },
        { file: 'lb3-2.html', lb: 'Area di apprendimento 3', k: '3.2', title: 'Trigonometria nel triangolo rettangolo',
          sub: 'Seno, coseno e tangente, lati e angoli, aree, poligoni regolari e π', when: 'Febbraio · marzo', ustd: 12 },
        { file: 'lb3-3.html', lb: 'Area di apprendimento 3', k: '3.3', title: 'Piramide e cono',
          sub: 'Superficie totale e volume, progetto di rilievo topografico', when: 'Marzo', ustd: 4 },
        { file: 'lb4.html', lb: 'Area di apprendimento 4', k: '4', title: 'Analisi dei dati',
          sub: 'Moda, mediana, media, dispersione, istogrammi, trucchi statistici', when: 'Aprile', ustd: 12 },
        { file: 'lb5.html', lb: 'Area di apprendimento 5', k: '5', title: 'La matematica e i moderni strumenti di calcolo',
          sub: 'Risolvere un problema reale con il foglio di calcolo e il CAS', when: 'Maggio', ustd: 4 },
        { file: 'wb.html', lb: 'Area opzionale', k: 'OP', title: 'La sezione aurea',
          sub: 'Deduzione, costruzione, pentagramma, arte e architettura', when: 'Maggio · giugno', ustd: 8 }
    ]
};
