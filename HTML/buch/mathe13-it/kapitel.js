/* kapitel.js — the chapters of the Italian edition of "Mathematik · Berufliches Gymnasium 13" (buch/mathe13/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe13.html: LB 3 → LB 4 → Wahlpflicht 1 → LB 6 → Abiturvorbereitung).
 * Doc, 18.10.2026: "macht die Übersetzung für die Mathebücher BGY elf zwölf dreizehn. Bitte in Italienisch." (package IT0:
 * start page and this file; the chapters: IT3). Terms as in tools/buch-it/glossario.md. Single source for the table of
 * contents (index.html) and the previous/next cards at the end of every chapter. No print edition: druck: false hides the
 * page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Matematica · Berufliches Gymnasium 13',
    short: 'Matematica 13',
    lang: 'it',
    druck: false,
    description: 'Libro di testo interattivo di matematica per il Berufliches Gymnasium (liceo tedesco a indirizzo professionale), 13ª classe, Sassonia: calcolo integrale, statistica inferenziale con test di significatività, geometria analitica di rette e piani nello spazio, altre applicazioni e un capitolo per prepararsi all’Abitur, con laboratori, simulazioni e autoverifiche con risposta immediata.',
    chapters: [
        { file: 'lb3-1.html', lb: 'Area di apprendimento 3', k: '3.1', title: 'Primitive',
          sub: 'Derivare all’indietro, l’integrale indefinito, regole di integrazione', when: 'Agosto · settembre', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Area di apprendimento 3', k: '3.2', title: 'L’integrale definito',
          sub: 'Quantità ricostruita, proprietà, teorema fondamentale', when: 'Settembre', ustd: 8 },
        { file: 'lb3-3.html', lb: 'Area di apprendimento 3', k: '3.3', title: 'Aree',
          sub: 'Tra un grafico e l’asse x, tra due grafici', when: 'Fine settembre · ottobre', ustd: 8 },
        { file: 'lb3-4.html', lb: 'Area di apprendimento 3', k: '3.4', title: 'Integrazione numerica e applicazioni',
          sub: 'Metodo dei rettangoli e dei trapezi, problemi vari', when: 'Ottobre · novembre', ustd: 8 },
        { file: 'lb4-1.html', lb: 'Area di apprendimento 4', k: '4.1', title: 'Popolazione e campione',
          sub: 'Stimare e verificare, media campionaria e varianza campionaria', when: 'Novembre', ustd: 4 },
        { file: 'lb4-2.html', lb: 'Area di apprendimento 4', k: '4.2', title: 'Test di significatività',
          sub: 'Ipotesi, regione di rifiuto, errori di I e di II specie', when: 'Novembre · dicembre', ustd: 8 },
        { file: 'wp1-1.html', lb: 'Area a scelta 1', k: 'OP.1', title: 'Rette e piani',
          sub: 'Equazioni parametriche, vettore normale con il prodotto vettoriale', when: 'Dicembre', ustd: 8 },
        { file: 'wp1-2.html', lb: 'Area a scelta 1', k: 'OP.2', title: 'Equazione cartesiana e posizioni reciproche',
          sub: 'Punto, retta, piano: posizione, punti di intersezione, tracce', when: 'Gennaio', ustd: 8 },
        { file: 'wp1-3.html', lb: 'Area a scelta 1', k: 'OP.3', title: 'Angoli di intersezione, prismi e piramidi',
          sub: 'Angoli tra rette e piani, superfici totali e volumi', when: 'Gennaio', ustd: 4 },
        { file: 'lb6.html', lb: 'Area di apprendimento 6', k: '6', title: 'Altre applicazioni',
          sub: 'Famiglie di funzioni, parametri nei sistemi di equazioni, costi e profitto, distanze', when: 'Fine gennaio · febbraio', ustd: 8 },
        { file: 'abi.html', lb: 'Abitur', k: 'A', title: 'Pronti per l’Abitur',
          sub: 'Liste di controllo ed esercizi in formato Abitur dei tre anni', when: 'Febbraio · aprile', ustd: 0 }
    ]
};
