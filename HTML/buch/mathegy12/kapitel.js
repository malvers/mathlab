/* kapitel.js — the chapters of the book "Mathematik · Gymnasium 12" (Grundkurs), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathegy12.html: LB 5 → Wahlbereich 5 → LB 6 → LB 7 → LB 8 → Abitur; 4 Ustd./week).
 * The numbers follow the Lehrplan (5.x = Lernbereich 5 …), the elective is W, the Abitur training A.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Gymnasium 12',
    short: 'Mathematik GY 12',
    description: 'Interaktives Lehrbuch Mathematik für das Gymnasium, Jahrgangsstufe 12, Grundkurs (Sachsen): Integralrechnung vom Stammfunktionen-Suchen bis zu Flächen zwischen Graphen, numerische Integration, Schätzen und Signifikanztests, Abstände und Winkel im Raum in echtem 3D, extremale Entfernungen, Spiegelungen, Funktionen- und Geradenscharen und Training für das Abitur, mit Labs, Simulationen und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb5-1.html', lb: 'Lernbereich 5', k: '5.1', title: 'Stammfunktionen und Integrieren',
          sub: 'Umkehrung des Differenzierens, Grundintegrale, Integrationsregeln, lineare Verkettungen, CAS', when: 'August · September', ustd: 12 },
        { file: 'lb5-2.html', lb: 'Lernbereich 5', k: '5.2', title: 'Das bestimmte Integral',
          sub: 'Bestand aus Änderungsraten, Ober- und Untersummen, Eigenschaften, Hauptsatz, Integralfunktion', when: 'September', ustd: 8 },
        { file: 'lb5-3.html', lb: 'Lernbereich 5', k: '5.3', title: 'Flächeninhalte',
          sub: 'Fläche zwischen Graph und x-Achse, zwischen zwei Graphen, unbekannte Grenzen, Sachaufgaben', when: 'September · Oktober', ustd: 8 },
        { file: 'wb5.html', lb: 'Wahlbereich 5', k: 'W', title: 'Numerische Integration',
          sub: 'Geschichte der Integralrechnung, Rechteck- und Trapezverfahren, Genauigkeit', when: 'Oktober · November', ustd: 8 },
        { file: 'lb6.html', lb: 'Lernbereich 6', k: '6', title: 'Beurteilende Statistik',
          sub: 'Stichproben, Schätzen von Anteilen, Mittel und Varianz, ein- und zweiseitige Signifikanztests', when: 'November', ustd: 12 },
        { file: 'lb7-1.html', lb: 'Lernbereich 7', k: '7.1', title: 'Skalarprodukt, Vektorprodukt und Normalenform',
          sub: 'Winkel und Projektion, senkrechter Vektor und Flächeninhalt, Normalen- und Koordinatenform', when: 'Dezember', ustd: 8 },
        { file: 'lb7-2.html', lb: 'Lernbereich 7', k: '7.2', title: 'Schnittwinkel',
          sub: 'Gerade und Gerade, Gerade und Ebene, Ebene und Ebene, Neigungen an Körpern', when: 'Januar', ustd: 8 },
        { file: 'lb7-3.html', lb: 'Lernbereich 7', k: '7.3', title: 'Abstände',
          sub: 'Punkt und Punkt, Lotfußpunkt, Abstand Punkt–Ebene, Hessesche Normalform, Anwendungen', when: 'Januar', ustd: 8 },
        { file: 'lb8-1.html', lb: 'Lernbereich 8', k: '8.1', title: 'Extremale Entfernungen und Spiegelungen',
          sub: 'Abstandsfunktion, Punkt und Gerade, Punkt und Kurve, Spiegeln an Punkt und Ebene, kürzeste Wege', when: 'Februar', ustd: 8 },
        { file: 'lb8-2.html', lb: 'Lernbereich 8', k: '8.2', title: 'Flächen und Scharen',
          sub: 'Flächen auf drei Wegen, Funktionenscharen und Ortskurven, Geradenscharen, vernetzte Aufgaben', when: 'März', ustd: 12 },
        { file: 'abi.html', lb: 'Prüfung', k: 'A', title: 'Fit fürs Abitur',
          sub: 'Checklisten, Fehlerfallen und Aufgaben im Abiturformat aus den Jahrgangsstufen 11 und 12', when: 'April', ustd: 0 }
    ]
};
