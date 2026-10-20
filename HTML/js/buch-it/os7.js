/* js/buch-it/os7.js — Italian for the widgets of js/buch-os7.js.
 * Loaded by the Italian editions right after js/buch-os7.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Round 3 (20.10.2026): eleven books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 * The Spanish file js/buch-es/os7.js shows which German strings the widgets write.
 */
window.BuchIT && BuchIT.add('os7', {
    word: {
        // book it-17 mathe7-it:
        // titelbildos7
        'Titelbild: ein Hunderterfeld mit 25 hellen Feldern, ein Parkett aus Sechsecken, ein Zahlenstrahl von minus 3 bis 3, ein Prisma und ein Kreisdiagramm':
            'Copertina: una griglia di cento quadretti con 25 caselle illuminate, una tassellazione di esagoni, una retta dei numeri da meno 3 a 3, un prisma e un diagramma a torta',
        // tageszinsos7
        'Kapital $K$': 'Capitale $K$', 'Zinssatz $p\\,\\%$': 'Tasso d’interesse $p\\,\\%$', 'Tage $t$': 'Giorni $t$', 'Jahr': 'Anno', '360 Tage': '360 giorni',
        'Bei Banken hat ein Zinsjahr meist 360 Tage und jeder Monat 30 Tage. Gerundet wird erst am Ende auf ganze Cent.':
            'In banca l’anno commerciale ha di solito 360 giorni e ogni mese 30 giorni. Si arrotonda ai centesimi interi solo alla fine.',
        // dichteos7
        'Holz': 'Legno', 'Eis': 'Ghiaccio', 'Aluminium': 'Alluminio', 'Eisen': 'Ferro', 'Gold': 'Oro', 'Stoff': 'Materiale',
        'Länge $a$': 'Lunghezza $a$', 'Breite $b$': 'Larghezza $b$', 'Höhe $c$': 'Altezza $c$',
        // quadrantos7
        'nur P': 'solo P', 'an der x-Achse': 'rispetto all’asse x', 'an der y-Achse': 'rispetto all’asse y', 'am Ursprung': 'rispetto all’origine',
        'Spiegeln': 'Simmetria',
        'An der x-Achse ändert die y-Koordinate ihr Vorzeichen.': 'Nella simmetria rispetto all’asse x la coordinata y cambia segno.',
        'An der y-Achse ändert die x-Koordinate ihr Vorzeichen.': 'Nella simmetria rispetto all’asse y la coordinata x cambia segno.',
        'Am Ursprung ändern beide Koordinaten ihr Vorzeichen.': 'Nella simmetria rispetto all’origine entrambe le coordinate cambiano segno.',
        'Ziehe P. Zuerst kommt die x-Koordinate (nach rechts oder links), dann die y-Koordinate (nach oben oder unten).':
            'Trascina P. Prima viene la coordinata x (verso destra o verso sinistra), poi la coordinata y (verso l’alto o verso il basso).',
        // parkettos7
        'Dreiecke': 'Triangoli', 'Quadrate': 'Quadrati', 'Sechsecke': 'Esagoni', 'Fünfecke': 'Pentagoni',
        'Achtecke und Quadrate': 'Ottagoni e quadrati', 'Sechsecke und Dreiecke': 'Esagoni e triangoli', 'Parkett': 'Tassellazione',
        'Ein Parkett bedeckt die Ebene ohne Lücken und ohne Überlappung. Das geht nur, wenn die Winkel an jeder Ecke zusammen genau $360^\\circ$ ergeben. Mit nur einer Sorte regelmäßiger Vielecke klappt das bei Dreiecken, Quadraten und Sechsecken.':
            'Una tassellazione ricopre il piano senza spazi vuoti e senza sovrapposizioni. Funziona solo se gli angoli in ogni vertice sommano esattamente $360^\\circ$. Con un solo tipo di poligono regolare ci riescono i triangoli, i quadrati e gli esagoni.',
        // escheros7
        'Parkett aus einer verformten Quadratkachel': 'Tassellazione con una piastrella quadrata deformata',
        'Ziehe den <b>roten</b> Punkt: Die linke Kante biegt sich, die rechte Kante macht genau dieselbe Form. Ziehe den <b>lila</b> Punkt: Unten und oben ändern sich gemeinsam.':
            'Trascina il punto <b>rosso</b>: il lato sinistro si piega e il lato destro prende esattamente la stessa forma. Trascina il punto <b>viola</b>: sotto e sopra cambiano insieme.',
        'Was auf einer Seite weggenommen wird, kommt auf der gegenüberliegenden Seite dazu. Darum hat die Kachel immer denselben Flächeninhalt wie das Quadrat – und sie füllt die Ebene lückenlos.':
            'Quello che si toglie da un lato si aggiunge al lato opposto. Per questo la piastrella ha sempre la stessa area del quadrato e ricopre il piano senza spazi vuoti.',
        'So arbeitete M. C. Escher: Er veränderte Kanten eines Vielecks, verschob oder drehte die Änderung auf eine andere Kante und malte in die Kachel ein Tier.':
            'Così lavorava M. C. Escher: modificava i lati di un poligono, traslava o ruotava la modifica su un altro lato e dipingeva un animale nella piastrella.',

    },
    phrase: [
        // book it-17 mathe7-it:
        // tageszinsos7
        ['Jahreszinsen: ', 'Interessi annui: '],
        // dichteos7
        ['Masse: ', 'Massa: '],
        ['Die Dichte ist kleiner als die von Wasser (', 'La densità è minore di quella dell’acqua ('], ['): Der Körper schwimmt.', '): il corpo galleggia.'],
        ['Die Dichte ist größer als die von Wasser (', 'La densità è maggiore di quella dell’acqua ('], ['): Der Körper geht unter.', '): il corpo affonda.'],
        // quadrantos7
        ['Spiegelpunkt: ', 'Punto simmetrico: '],
        // parkettos7: the angles at one vertex
        ['An einer Ecke: ', 'In un vertice: '], ['6 Dreiecke: ', '6 triangoli: '], ['4 Quadrate: ', '4 quadrati: '], ['3 Sechsecke: ', '3 esagoni: '],
        ['3 Fünfecke: ', '3 pentagoni: '], [' – es bleibt eine Lücke von ', ' – resta uno spazio vuoto di '], ['. 4 Fünfecke: ', '. 4 pentagoni: '], [', das ist zu viel.', ', ed è troppo.'],
        ['2 Achtecke und 1 Quadrat: ', '2 ottagoni e 1 quadrato: '], ['2 Sechsecke und 2 Dreiecke: ', '2 esagoni e 2 triangoli: '],

    ],
    rule: [
        // book it-17 mathe7-it:
        // tageszinsos7: "90 Tage", "1 Tag" on the slider and in the picture, "für $90$ Tage:", the label of the picture
        [/^1 Tag$/, '1 giorno'], [/^(\d+) Tage$/, '$1 giorni'], [/>1 Tag</g, '>1 giorno<'], [/>(\d+) Tage</g, '>$1 giorni<'],
        [/für \$(\d+)\$ (Tag|Tage): /, (m, t, w) => 'per $' + t + '$ ' + (w === 'Tag' ? 'giorno' : 'giorni') + ': '],
        [/Zinsjahr mit 360 Tagen, davon (\d+) Tage; Jahreszinsen und Tageszinsen als Säulen/,
            (m, t) => 'Anno commerciale di 360 giorni, di cui ' + t + (t === '1' ? ' giorno' : ' giorni') + '; interessi annui e interessi dei giorni come colonne'],
        // dichteos7: the label of the picture and the density sentence
        [/Quader aus (Holz|Eis|Aluminium|Eisen|Gold), (\d+) cm mal (\d+) cm mal (\d+) cm/, (m, s, a, b, c) => 'Parallelepipedo di ' +
            ({ Holz: 'legno', Eis: 'ghiaccio', Aluminium: 'alluminio', Eisen: 'ferro', Gold: 'oro' })[s] + ', ' + a + ' cm per ' + b + ' cm per ' + c + ' cm'],
        [/Dichte von (Fichtenholz|Eis|Aluminium|Eisen|Gold): /, (m, s) => 'Densità ' +
            ({ Fichtenholz: 'del legno di abete', Eis: 'del ghiaccio', Aluminium: 'dell’alluminio', Eisen: 'del ferro', Gold: 'dell’oro' })[s] + ': '],
        // quadrantos7: "P(3 | 2)" in the label, "liegt im I. Quadranten"
        [/Koordinatensystem mit vier Quadranten, Punkt P\((-?\d+) \| (-?\d+)\)/, 'Sistema di coordinate con quattro quadranti, punto P($1, $2)'],
        [/\$ liegt (?=im |auf )/, '$ si trova '], [/\bim (I|II|III|IV)\. Quadranten/g, 'nel $1 quadrante'], [/\bauf einer Achse/g, 'su un asse'],
        // parkettos7: the name of the tiling as the title and in the label of the picture
        [/(<p style="margin:0"><b>)(Dreiecke|Quadrate|Sechsecke|Fünfecke|Achtecke und Quadrate|Sechsecke und Dreiecke)(<\/b><\/p><p style="margin:8px 0 0">An einer Ecke)/,
            (m, a, n, b) => a + ({ 'Dreiecke': 'Triangoli', 'Quadrate': 'Quadrati', 'Sechsecke': 'Esagoni', 'Fünfecke': 'Pentagoni',
                'Achtecke und Quadrate': 'Ottagoni e quadrati', 'Sechsecke und Dreiecke': 'Esagoni e triangoli' })[n] + b],
        [/^Parkett: (Dreiecke|Quadrate|Sechsecke|Fünfecke|Achtecke und Quadrate|Sechsecke und Dreiecke)$/, (m, n) => 'Tassellazione: ' +
            ({ 'Dreiecke': 'triangoli', 'Quadrate': 'quadrati', 'Sechsecke': 'esagoni', 'Fünfecke': 'pentagoni',
                'Achtecke und Quadrate': 'ottagoni e quadrati', 'Sechsecke und Dreiecke': 'esagoni e triangoli' })[n]],

    ]
});
