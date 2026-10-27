/* kapitel.js — the chapters of the Italian edition of "Mathematik · Oberschule 10" (buch/mathe10/, Realschulbildungsgang), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe10.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlpflichtbereich 3; 4 Ustd./week, 80 + 8 Ustd.).
 * Doc, 20.10.2026: "schnapp dir noch 5 Agentinnen und zieht es durch" (round 3, Gianotti, block it-20).
 * Terms as in tools/buch-it/glossario.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Matematica · Oberschule 10',
    short: 'Matematica OS 10',
    lang: 'it',
    description: 'Libro di testo interattivo di matematica per la Oberschule (scuola secondaria sassone), 10ª classe, indirizzo Realschule (Sassonia): triangoli e poligoni con il teorema dei seni e il teorema del coseno, funzioni potenza, esponenziali e seno, variabili aleatorie e valore atteso, stipendio, risparmio e credito, solidi con tronchi di piramide e di cono, risoluzione di problemi per l’esame finale e misurazioni sul terreno, con laboratori, simulazioni e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Area di apprendimento 1', k: '1.1', title: 'Triangoli, quadrilateri e trigonometria',
          sub: 'La famiglia dei quadrilateri, somme degli angoli, seno, coseno e tangente nelle figure', when: 'Agosto · settembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Area di apprendimento 1', k: '1.2', title: 'Teorema dei seni e teorema del coseno',
          sub: 'Lati e angoli in triangoli qualsiasi, determinare distanze', when: 'Settembre', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Area di apprendimento 1', k: '1.3', title: 'Aree di triangoli e poligoni',
          sub: 'L’area con il seno, poligoni regolari, calcolare terreni', when: 'Settembre · ottobre', ustd: 4 },
        { file: 'lb2-1.html', lb: 'Area di apprendimento 2', k: '2.1', title: 'Funzioni potenza',
          sub: 'Parabole e iperboli, simmetria, asintoti, proporzionalità inversa', when: 'Novembre', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Area di apprendimento 2', k: '2.2', title: 'Funzioni esponenziali',
          sub: 'Crescita e decrescita, fattore di crescita, interesse composto, tempo di dimezzamento', when: 'Novembre', ustd: 4 },
        { file: 'lb2-3.html', lb: 'Area di apprendimento 2', k: '2.3', title: 'La funzione seno',
          sub: 'Radianti, circonferenza goniometrica, ampiezza e periodo, le funzioni a colpo d’occhio', when: 'Novembre · dicembre', ustd: 8 },
        { file: 'lb3.html', lb: 'Area di apprendimento 3', k: '3', title: 'Variabili aleatorie e valore atteso',
          sub: 'Distribuzione di probabilità, valore atteso, giochi equi, simulazione e rischio', when: 'Dicembre · gennaio', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Area di apprendimento 4', k: '4.1', title: 'Il denaro nella vita di tutti i giorni',
          sub: 'Stipendio e trattenute, bilancio familiare, risparmio, credito e la trappola dei debiti', when: 'Gennaio', ustd: 8 },
        { file: 'lb4-2.html', lb: 'Area di apprendimento 4', k: '4.2', title: 'Solidi e tronchi',
          sub: 'Prisma, cilindro, piramide, cono e sfera, tronchi di piramide e di cono, massa e costi', when: 'Febbraio · marzo', ustd: 8 },
        { file: 'lb4-3.html', lb: 'Area di apprendimento 4', k: '4.3', title: 'Risolvere problemi',
          sub: 'Probabilità e funzioni nella vita di tutti i giorni, conoscenze di base senza calcolatrice, pronti per l’esame', when: 'Marzo', ustd: 12 },
        { file: 'wb.html', lb: 'Area a scelta 3', k: 'OP', title: 'Misurazioni sul terreno',
          sub: 'Triangolo del guardaboschi, metodo dell’ombra, teorema di Talete, triangolazione, misurare a scuola', when: 'Maggio', ustd: 8 }
    ]
};
