/* js/buch-it/integral.js — Italian for the widgets of js/buch-integral.js.
 * Loaded by the Italian editions right after js/buch-integral.js; the engine and the shared words are in js/buch-it.js.
 *   word    a whole label → its Italian
 *   phrase  German sentence pieces exactly as the widget source writes them → Italian
 *   rule    word order and notation (after the point rules of js/buch-it.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Terms: tools/buch-it/glossario.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang it
 * Package IT0 (18.10.2026) put in only the cover of the start page; every book writes only below its own comment line, each entry ending
 * with a comma, so the three books merge without a conflict. The Spanish file js/buch-es/integral.js shows which German
 * strings the widgets write.
 * Round 2 (20.10.2026): six books are translated at the same time; each has its own comment line in word, phrase and
 * rule - write only right below your book's line, every entry ending with a comma, so the books merge without a conflict.
 */
window.BuchIT && BuchIT.add('integral', {
    word: {
        // it0: the cover of the start page
        'Titelbild: Glockenkurve über dem Histogramm eines Tests mit Ablehnungsbereich, eine Ebene im Raum mit Normalenvektor und Gerade':
            'Copertina: curva a campana sull’istogramma di un test con regione di rifiuto, un piano nello spazio con vettore normale e retta',
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        // book it-3 mathe13-it:
        'Konstante $C$': 'Costante $C$',
        'Oben: Stammfunktionen F + C (die gewählte hell). Ziehe den Punkt. Unten: f. Die Steigung von F im Punkt ist genau der Funktionswert f(x₀).': 'Sopra: primitive F + C (quella scelta più chiara). Trascina il punto. Sotto: f. La pendenza di F nel punto è esattamente il valore della funzione f(x₀).',
        'Schar von Stammfunktionen': 'Famiglia di primitive',
        'Die Funktion f': 'La funzione f',
        'Wassertank': 'Serbatoio d’acqua',
        'Zuflussrate in l/min': 'Portata in entrata in l/min',
        'Wasser in l': 'Acqua in l',
        'Bis $t = 6$ fließt Wasser zu, danach läuft es ab (negative Änderungsrate). Der Bestand ist bei $t = 6$ am größten.': 'Fino a $t = 6$ entra acqua, poi esce (tasso di variazione negativo). La quantità è massima in $t = 6$.',
        'Autofahrt': 'Viaggio in auto',
        'Die Fläche unter dem Geschwindigkeitsgraphen ist der zurückgelegte Weg.': 'L’area sotto il grafico della velocità è lo spazio percorso.',
        'Änderungsrate mit Fläche': 'Tasso di variazione con l’area',
        'Rekonstruierter Bestand': 'Quantità ricostruita',
        'Zeit $t$': 'Tempo $t$',
        'Bestimmtes Integral zwischen zwei Grenzen': 'Integrale definito tra due estremi',
        'Parabel und Gerade': 'Parabola e retta',
        'Kubik und Parabel': 'Cubica e parabola',
        'Sinus und Kosinus': 'Seno e coseno',
        'Funktionen': 'Funzioni',
        'Fläche zwischen zwei Graphen': 'Area tra due grafici',
        'Zu wenige Schnittstellen im Bild.': 'Troppo pochi punti di intersezione nell’immagine.',
        // book it-5 mathefos12-it:

        // book it-7 mathegy11lk-it:

        // book it-8 mathegy12-it:

        // book it-9 mathegy12lk-it:
    },
    phrase: [
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        // book it-3 mathe13-it:
        ['$ · Stammfunktionen $F(x) = ', '$ · primitive $F(x) = '],
        [' + C$, denn $F\'(x) = f(x)$.', ' + C$, perché $F\'(x) = f(x)$.'],
        ['Bei $x_0 = ', 'In $x_0 = '],
        ['$: Steigung von $F$ $= f(', '$: pendenza di $F$ $= f('],
        ['$, egal welches $C$.', '$, qualunque sia $C$.'],
        ['$ · Anfangsbestand $', '$ · quantità iniziale $'],
        ['Bestand nach $t = ', 'Quantità dopo $t = '],
        ['Teilstücke zwischen den Nullstellen: ', 'Tratti tra gli zeri: '],
        ['Flächeninhalt zwischen Graph und $x$-Achse: $A \\approx ', 'Area tra il grafico e l’asse $x$: $A \\approx '],
        [' · Das Integral ist kleiner, weil Flächen unter der Achse (rot) negativ zählen.', ' · L’integrale è minore perché le aree sotto l’asse (rosse) contano come negative.'],
        [' · Achtung: $a > b$ dreht das Vorzeichen.', ' · Attenzione: $a > b$ cambia il segno.'],
        ['$ · Schnittstellen: ', '$ · intersezioni: '],
        // book it-5 mathefos12-it:

        // book it-7 mathegy11lk-it:

        // book it-8 mathegy12-it:

        // book it-9 mathegy12lk-it:
    ],
    rule: [
        // book it-1 mathe11-it:
        // book it-2 mathe12-it:
        // book it-3 mathe13-it:
        // book it-5 mathefos12-it:

        // book it-7 mathegy11lk-it:

        // book it-8 mathegy12-it:

        // book it-9 mathegy12lk-it:
    ]
});
