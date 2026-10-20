/* kapitel.js — the chapters of the Italian edition of "Mathematik · Gymnasium 10" (buch/mathegy10/), in the order of the
 * school year (Stoffverteilungsplan svp/mathe/mathegy10.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich; 4 Ustd./week).
 * Doc, 20.10.2026: "schnapp dir noch 5 Agentinnen und zieht es durch" (round 3, tools/buch-it/README.md, block it-15).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matematica · Gymnasium 10',
    short: 'Matematica GY 10',
    lang: 'it',
    druck: false,
    description: 'Libro di testo interattivo di matematica per il Gymnasium (liceo tedesco che porta all’Abitur), 10ª classe, Sassonia: crescita e funzioni esponenziali, fenomeni periodici e la funzione seno, variabili aleatorie, valore atteso e giochi equi, teoremi dei seni e del coseno, logaritmo ed equazioni esponenziali, tangente, panoramica delle funzioni, successioni e limiti, calcolo degli interessi e numeri complessi, con laboratori, simulazioni e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Area di apprendimento 1', k: '1.1', title: 'Crescita e funzioni esponenziali',
          sub: 'Lineare, esponenziale, limitata, ricorsiva ed esplicita, parametri e regressione', when: 'Agosto · settembre', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Area di apprendimento 1', k: '1.2', title: 'Fenomeni periodici e la funzione seno',
          sub: 'Periodo, ampiezza, linea mediana, gradi e radianti, parametri della funzione seno', when: 'Settembre · ottobre', ustd: 10 },
        { file: 'lb2-1.html', lb: 'Area di apprendimento 2', k: '2.1', title: 'Variabili aleatorie e regole dei percorsi',
          sub: 'Distribuzioni di probabilità, diagramma a barre, «esattamente k», «almeno k», «al massimo k»', when: 'Novembre', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Area di apprendimento 2', k: '2.2', title: 'Valore atteso e giochi equi',
          sub: 'Valore atteso, varianza e deviazione standard, giochi equi e non equi', when: 'Novembre', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Area di apprendimento 3', k: '3.1', title: 'Teorema dei seni, teorema del coseno e area',
          sub: 'Triangoli qualsiasi, il caso ambiguo, Pitagora come caso particolare, formula dell’area con il seno', when: 'Dicembre', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Area di apprendimento 3', k: '3.2', title: 'Calcoli su triangoli e solidi',
          sub: 'Piano di risoluzione, rilievi topografici, piramide e cono, problemi realistici', when: 'Gennaio', ustd: 8 },
        { file: 'lb4-1.html', lb: 'Area di apprendimento 4', k: '4.1', title: 'Funzione inversa e logaritmo',
          sub: 'Invertibilità, simmetria rispetto a y = x, il logaritmo, proprietà dei logaritmi', when: 'Gennaio · febbraio', ustd: 12 },
        { file: 'lb4-2.html', lb: 'Area di apprendimento 4', k: '4.2', title: 'Funzioni logaritmiche ed equazioni esponenziali',
          sub: 'Grafico e proprietà, equazioni esponenziali, tempo di raddoppio e di dimezzamento', when: 'Marzo', ustd: 8 },
        { file: 'lb4-3.html', lb: 'Area di apprendimento 4', k: '4.3', title: 'Operazioni tra funzioni, composizione e la funzione tangente',
          sub: 'Somma, prodotto, quoziente, funzione interna ed esterna, tangente con i suoi poli', when: 'Marzo', ustd: 8 },
        { file: 'lb4-4.html', lb: 'Area di apprendimento 4', k: '4.4', title: 'Panoramica delle funzioni',
          sub: 'Ordinare le classi di funzioni, carte d’identità, abbozzare grafici senza strumenti', when: 'Aprile', ustd: 8 },
        { file: 'lb4-5.html', lb: 'Area di apprendimento 4', k: '4.5', title: 'Successioni numeriche e limiti',
          sub: 'Esplicite e ricorsive, monotonia, limitazioni, limite, circonferenza in forma parametrica', when: 'Aprile', ustd: 6 },
        { file: 'lb5.html', lb: 'Area di apprendimento 5', k: '5', title: 'Calcolo degli interessi',
          sub: 'Interessi e interesse composto, prestito e piano di ammortamento, quanto costa davvero un prestito', when: 'Maggio', ustd: 4 },
        { file: 'wb.html', lb: 'Area opzionale', k: 'OP', title: 'Numeri complessi',
          sub: 'Unità immaginaria, calcolare in ℂ, piano di Gauss, modulo e argomento', when: 'Maggio · giugno', ustd: 8 }
    ]
};
