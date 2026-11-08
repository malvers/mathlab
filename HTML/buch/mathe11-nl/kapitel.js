/* kapitel.js — the chapters of the Dutch edition (the Netherlands) of "Mathematik · Berufliches Gymnasium 11" (buch/mathe11/),
 * in the order of the school year (Stoffverteilungsplan svp/mathe/mathe11.html: LB 2 → LB 3 → LB 4 → LB 1 → Wahlbereich 3).
 * Doc, 08.11.2026: three new languages tonight (pt, nl, tr; the architecture: package buch3-arch; this book: nl-1).
 * Terms and the Dutch school notation as in tools/buch-nl/README.md. Single source for the table of contents (index.html)
 * and the previous/next cards at the end of every chapter. No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Wiskunde · Berufliches Gymnasium 11',
    short: 'Wiskunde 11',
    lang: 'nl',
    druck: false,
    description: 'Interactief leerboek wiskunde voor het Berufliches Gymnasium (een Duitse school voor de bovenbouw met een beroepsgerichte richting), klas 11, Saksen: vergelijkingen, functies, stelsels vergelijkingen, kansrekening en numerieke methoden, met labs, simulaties en zelftoetsen met directe feedback.',
    chapters: [
        { file: 'lb2.html', lb: 'Leergebied 2', k: '2', title: 'Vergelijkingen, formules, figuren',
          sub: 'Problemen oplossen met en zonder hulpmiddelen', when: 'September', ustd: 20 },
        { file: 'lb3-1.html', lb: 'Leergebied 3', k: '3.1', title: 'Functies en hun eigenschappen',
          sub: 'Domein, nulpunten, stijgen en dalen, symmetrie', when: 'Eind september', ustd: 5 },
        { file: 'lb3-2.html', lb: 'Leergebied 3', k: '3.2', title: 'Groei en verval',
          sub: 'Lineaire en exponentiële functies', when: 'Oktober · november', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Leergebied 3', k: '3.3', title: 'Kwadratische functies en vergelijkingen',
          sub: 'Eenparig versnelde bewegingen', when: 'November', ustd: 15 },
        { file: 'lb3-4.html', lb: 'Leergebied 3', k: '3.4', title: 'Periodieke verschijnselen',
          sub: 'Sinusfuncties', when: 'December', ustd: 10 },
        { file: 'lb3-5.html', lb: 'Leergebied 3', k: '3.5', title: 'Regressie',
          sub: 'Meetreeksen analyseren met digitale hulpmiddelen', when: 'December', ustd: 5 },
        { file: 'lb3-6.html', lb: 'Leergebied 3', k: '3.6', title: 'Inverse functies en logaritmen',
          sub: 'Wortelfunctie, logaritme, exponentiële vergelijkingen', when: 'Januari', ustd: 15 },
        { file: 'lb3-7.html', lb: 'Leergebied 3', k: '3.7', title: 'Grafieken en parameters',
          sub: 'De basisfuncties zonder hulpmiddelen, vermenigvuldigen en verschuiven', when: 'Februari · maart', ustd: 15 },
        { file: 'lb4.html', lb: 'Leergebied 4', k: '4', title: 'Stelsels lineaire vergelijkingen en matrices',
          sub: 'Methode van Gauss, oplossingsverzamelingen, rekenen met matrices', when: 'Maart · april', ustd: 20 },
        { file: 'lb1.html', lb: 'Leergebied 1', k: '1', title: 'Kansen bij kansexperimenten in meerdere stappen',
          sub: 'Kansbomen, kruistabellen, simulatie', when: 'April', ustd: 15 },
        { file: 'wb3.html', lb: 'Keuzegebied 3', k: 'K', title: 'Numerieke methoden en simulaties',
          sub: 'Bisectiemethode, oppervlaktes benaderen, Monte-Carlomethode', when: 'Mei · juni', ustd: 10 }
    ]
};
