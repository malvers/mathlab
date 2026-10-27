/* kapitel.js — the chapters of the Italian edition of "Mathematik · Berufliches Gymnasium 11" (buch/mathe11/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe11.html: LB 2 → LB 3 → LB 4 → LB 1 → Wahlbereich 3).
 * Doc, 18.10.2026: "macht die Übersetzung für die Mathebücher BGY elf zwölf dreizehn. Bitte in Italienisch." (package IT0:
 * start page and this file; the chapters: IT1). Terms as in tools/buch-it/glossario.md. Single source for the table of
 * contents (index.html) and the previous/next cards at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Matematica · Berufliches Gymnasium 11',
    short: 'Matematica 11',
    lang: 'it',
    description: 'Libro di testo interattivo di matematica per il Berufliches Gymnasium (liceo tedesco a indirizzo professionale), 11ª classe, Sassonia: equazioni, funzioni, sistemi di equazioni, probabilità e metodi numerici, con laboratori, simulazioni e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb2.html', lb: 'Area di apprendimento 2', k: '2', title: 'Equazioni, formule, figure',
          sub: 'Risolvere problemi con e senza calcolatrice', when: 'Settembre', ustd: 20 },
        { file: 'lb3-1.html', lb: 'Area di apprendimento 3', k: '3.1', title: 'Le funzioni e le loro proprietà',
          sub: 'Dominio, zeri, monotonia, simmetria', when: 'Fine settembre', ustd: 5 },
        { file: 'lb3-2.html', lb: 'Area di apprendimento 3', k: '3.2', title: 'Crescita e decrescita',
          sub: 'Funzioni lineari e funzioni esponenziali', when: 'Ottobre · novembre', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Area di apprendimento 3', k: '3.3', title: 'Funzioni ed equazioni quadratiche',
          sub: 'Moto uniformemente accelerato', when: 'Novembre', ustd: 15 },
        { file: 'lb3-4.html', lb: 'Area di apprendimento 3', k: '3.4', title: 'Fenomeni periodici',
          sub: 'Funzioni seno', when: 'Dicembre', ustd: 10 },
        { file: 'lb3-5.html', lb: 'Area di apprendimento 3', k: '3.5', title: 'Regressione',
          sub: 'Analizzare serie di misure con strumenti digitali', when: 'Dicembre', ustd: 5 },
        { file: 'lb3-6.html', lb: 'Area di apprendimento 3', k: '3.6', title: 'Funzioni inverse e logaritmi',
          sub: 'Funzione radice quadrata, logaritmo, equazioni esponenziali', when: 'Gennaio', ustd: 15 },
        { file: 'lb3-7.html', lb: 'Area di apprendimento 3', k: '3.7', title: 'Grafici e parametri',
          sub: 'Le funzioni elementari senza calcolatrice, dilatare e traslare', when: 'Febbraio · marzo', ustd: 15 },
        { file: 'lb4.html', lb: 'Area di apprendimento 4', k: '4', title: 'Sistemi di equazioni lineari e matrici',
          sub: 'Metodo di Gauss, insiemi delle soluzioni, operazioni con le matrici', when: 'Marzo · aprile', ustd: 20 },
        { file: 'lb1.html', lb: 'Area di apprendimento 1', k: '1', title: 'Probabilità di esperimenti aleatori a più stadi',
          sub: 'Diagrammi ad albero, tabelle a doppia entrata, simulazione', when: 'Aprile', ustd: 15 },
        { file: 'wb3.html', lb: 'Area opzionale 3', k: 'OP', title: 'Metodi numerici e simulazioni',
          sub: 'Bisezione, aree approssimate, il metodo Monte Carlo', when: 'Maggio · giugno', ustd: 10 }
    ]
};
