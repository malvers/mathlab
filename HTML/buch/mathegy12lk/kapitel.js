/* kapitel.js — the chapters of the book "Mathematik · Gymnasium 12 · Leistungskurs", in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathegy12lk.html: LB 5 → Wahlbereich 5 → LB 6 → LB 7 → LB 8 → LB 9 → Abitur; 5 Ustd./week).
 * The numbers follow the Lehrplan for the Leistungskurs (5.x = Lernbereich 5 …), the elective is W, the Abitur training A.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Gymnasium 12 · Leistungskurs',
    short: 'Mathematik GY 12 LK',
    description: 'Interaktives Lehrbuch Mathematik für das Gymnasium, Jahrgangsstufe 12, Leistungskurs (Sachsen): Integralrechnung mit Integralfunktion, Hauptsatz und Rotationskörpern in echtem 3D, numerische Integration bis Simpson, normalverteilte Zufallsgrößen und de Moivre-Laplace, Schätzen und Signifikanztests, Abstände und Winkel im Raum mit Hessescher Normalform und windschiefen Geraden, Extremwerte, Spiegelungen, unbegrenzte Flächen, Scharen und Ortskurven und Training für das Abitur, mit Labs, Simulationen und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb5-1.html', lb: 'Lernbereich 5', k: '5.1', title: 'Stammfunktionen und Integrieren',
          sub: 'Umkehrung des Differenzierens, Grundintegrale, lineare Substitution, verkettete Funktionen mit CAS', when: 'August · September', ustd: 15 },
        { file: 'lb5-2.html', lb: 'Lernbereich 5', k: '5.2', title: 'Das bestimmte Integral und der Hauptsatz',
          sub: 'Bestand aus Änderungsraten, physikalische Größen, Riemann-Summen, Eigenschaften, Integralfunktion, Hauptsatz mit Beweis', when: 'September', ustd: 10 },
        { file: 'lb5-3.html', lb: 'Lernbereich 5', k: '5.3', title: 'Flächen und Rotationskörper',
          sub: 'Fläche mit der x-Achse und zwischen Graphen, Volumen bei Rotation um die x-Achse, Kegel und Kugel hergeleitet', when: 'Oktober', ustd: 10 },
        { file: 'wb5.html', lb: 'Wahlbereich 5', k: 'W', title: 'Numerische Integration',
          sub: 'Geschichte der Integralrechnung, Rechteck- und Trapezverfahren, Keplersche Fassregel, Simpson, Vergleich der Verfahren', when: 'November', ustd: 10 },
        { file: 'lb6.html', lb: 'Lernbereich 6', k: '6', title: 'Normalverteilte Zufallsgrößen',
          sub: 'Gaußsche Glockenkurve, Dichte- und Verteilungsfunktion, Erwartungswert und Standardabweichung, σ-Regeln, de Moivre-Laplace', when: 'November', ustd: 10 },
        { file: 'lb7.html', lb: 'Lernbereich 7', k: '7', title: 'Beurteilende Statistik',
          sub: 'Stichproben, Schätzen von Anteilen, Mittel und Varianz, ein- und zweiseitige Signifikanztests, statistische Sicherheit', when: 'Dezember', ustd: 15 },
        { file: 'lb8-1.html', lb: 'Lernbereich 8', k: '8.1', title: 'Skalarprodukt, Vektorprodukt und Hessesche Normalform',
          sub: 'Winkel und Projektion, senkrechter Vektor und Flächeninhalt, Normalen- und Koordinatenform, Hessesche Normalform für Gerade und Ebene', when: 'Januar', ustd: 10 },
        { file: 'lb8-2.html', lb: 'Lernbereich 8', k: '8.2', title: 'Schnittwinkel',
          sub: 'Gerade und Gerade, Gerade und Ebene, Ebene und Ebene, Neigungen an Körpern', when: 'Januar', ustd: 5 },
        { file: 'lb8-3.html', lb: 'Lernbereich 8', k: '8.3', title: 'Abstände',
          sub: 'Punkt und Punkt, Punkt und Ebene, Gerade und Ebene, Ebene und Ebene, Punkt und Gerade, windschiefe Geraden', when: 'Februar', ustd: 10 },
        { file: 'lb9-1.html', lb: 'Lernbereich 9', k: '9.1', title: 'Extremale Entfernungen, Winkel und Spiegelungen',
          sub: 'Abstandsfunktion, Punkt und Kurve, größter Sehwinkel, Spiegeln an Punkt und Ebene, kürzeste Wege', when: 'Februar · März', ustd: 10 },
        { file: 'lb9-2.html', lb: 'Lernbereich 9', k: '9.2', title: 'Flächen, Dichte, Scharen und Ortskurven',
          sub: 'Flächen auf drei Wegen, unbegrenzte Flächen, Dichte und Wahrscheinlichkeit, Funktionenscharen, Ortskurven, Geraden- und Ebenenscharen', when: 'März', ustd: 10 },
        { file: 'abi.html', lb: 'Prüfung', k: 'A', title: 'Fit fürs Abitur',
          sub: 'Checklisten, Fehlerfallen und Aufgaben im Abiturformat des Leistungskurses aus den Jahrgangsstufen 11 und 12', when: 'April', ustd: 0 }
    ]
};
