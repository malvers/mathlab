/* kapitel.js — the chapters of the Dutch edition (the Netherlands) of "Mathematik · Berufliches Gymnasium 12" (buch/mathe12/),
 * in the order of the school year (Stoffverteilungsplan svp/mathe/mathe12.html: LB 1 → LB 2 → LB 5; Grundkurs, Kurshalbjahre
 * 12/I and 12/II). Book nl-2 (08.11.2026), the sibling of mathe11-nl. Terms and the Dutch school notation as in
 * tools/buch-nl/README.md and woordenlijst.md. Single source for the table of contents (index.html) and the previous/next
 * cards at the end of every chapter. No print edition yet (druck: false).
 */
window.BUCH = {
    title: 'Wiskunde · Berufliches Gymnasium 12',
    short: 'Wiskunde 12',
    lang: 'nl',
    druck: false,
    description: 'Interactief leerboek wiskunde voor het Berufliches Gymnasium (een Duitse school voor de bovenbouw met een beroepsgerichte richting), klas 12, Saksen: discrete toevalsvariabelen en de binomiale verdeling, differentiaalrekening van limieten tot optimaliseringsproblemen en vectoren in de ruimte, met labs, simulaties, 3D-graphics en zelftoetsen met directe feedback.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Leergebied 1', k: '1.1', title: 'Voorwaardelijke kans',
          sub: 'Kansbomen, kruistabellen, onafhankelijke gebeurtenissen', when: 'Augustus · september', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Leergebied 1', k: '1.2', title: 'Toevalsvariabelen',
          sub: 'Kansverdeling, verwachtingswaarde, variantie, eerlijke spelen', when: 'September', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Leergebied 1', k: '1.3', title: 'De binomiale verdeling',
          sub: 'Bernoulli-experimenten, binomiaalcoëfficiënt, cumulatieve kansen', when: 'Oktober · november', ustd: 20 },
        { file: 'lb2-1.html', lb: 'Leergebied 2', k: '2.1', title: 'Limieten',
          sub: 'Gedrag op oneindig, asymptoten, continuïteit', when: 'November · december', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Leergebied 2', k: '2.2', title: 'De afgeleide',
          sub: 'Veranderingen, van koorde naar raaklijn, grafisch differentiëren', when: 'December', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Leergebied 2', k: '2.3', title: 'Differentieerregels',
          sub: 'Machtsregel, somregel en constante-factorregel, eˣ en sin x, eenvoudige producten', when: 'Januari', ustd: 12 },
        { file: 'lb2-4.html', lb: 'Leergebied 2', k: '2.4', title: 'Stijgen en dalen, extremen, buigpunten',
          sub: 'Wat f′ en f″ over de grafiek verraden', when: 'Januari · maart', ustd: 12 },
        { file: 'lb2-5.html', lb: 'Leergebied 2', k: '2.5', title: 'Grafieken onderzoeken',
          sub: 'Symmetrie, asymptoten, raaklijnen en normalen, functies in een context', when: 'Maart', ustd: 12 },
        { file: 'lb2-6.html', lb: 'Leergebied 2', k: '2.6', title: 'Functies uit voorwaarden en optimaliseren',
          sub: 'Een functie opstellen uit gegevens, het beste vinden', when: 'April · mei', ustd: 20 },
        { file: 'lb5-1.html', lb: 'Leergebied 5', k: '5.1', title: 'Vectoren in de ruimte',
          sub: 'Punten en vectoren, rekenen met vectoren, lengte, midden', when: 'Mei · juni', ustd: 12 },
        { file: 'lb5-2.html', lb: 'Leergebied 5', k: '5.2', title: 'Inproduct en hoeken',
          sub: 'Loodrechte stand, hoek tussen vectoren, bewijzen bij vierhoeken', when: 'Juni · juli', ustd: 8 }
    ]
};
