/* kapitel.js — the chapters of the book "Mathematik · Gymnasium 7", in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathegy7.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlbereich 3; 4 Ustd./week, 104 + 8 Ustd.).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Gymnasium 7',
    short: 'Mathematik GY 7',
    description: 'Interaktives Lehrbuch Mathematik für das Gymnasium, Klasse 7 (Sachsen): Kreis und Gerade, Umkreis und Inkreis, der Satz des Thales und die Winkel am Kreis, Konstruieren und Problemlösen, rationale Zahlen und das Rechnen mit ihnen, Gleichungen und Formeln, Prozentrechnung, Prismen und Pyramiden in Schrägbild, Netz und Zweitafelbild, Oberfläche und Volumen, Diagramme und die platonischen Körper, mit Faltnetzen in 3D, Konstruktionen zum Mitklicken und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Lernbereich 1', k: '1.1', title: 'Kreis und Gerade, Umkreis und Inkreis',
          sub: 'Passante, Tangente und Sekante, Mittelsenkrechten und Winkelhalbierende im Dreieck', when: 'August · September', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Lernbereich 1', k: '1.2', title: 'Sätze am Kreis',
          sub: 'Satz des Thales, Peripheriewinkel und Zentriwinkel, Sehnenviereck, Satz und Beweis', when: 'September', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Lernbereich 1', k: '1.3', title: 'Konstruieren und Problemlösen',
          sub: 'Planfigur und Konstruktionsplan, Tangenten von einem Punkt, Vorwärts- und Rückwärtsarbeiten', when: 'September · Oktober', ustd: 8 },
        { file: 'lb2-1.html', lb: 'Lernbereich 2', k: '2.1', title: 'Rationale Zahlen',
          sub: 'Negative Zahlen, Zahlengerade, Betrag und Gegenzahl, Zahlbereiche und Mengen', when: 'Oktober · November', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Lernbereich 2', k: '2.2', title: 'Rechnen mit rationalen Zahlen',
          sub: 'Die vier Grundrechenarten, Vorzeichenregeln, Rechengesetze, Potenzen und Quadratwurzeln', when: 'November · Dezember', ustd: 16 },
        { file: 'lb2-3.html', lb: 'Lernbereich 2', k: '2.3', title: 'Gleichungen und Formeln',
          sub: 'Gleichungen im Kopf und mit Äquivalenzumformungen lösen, Textaufgaben, Formeln umstellen', when: 'Dezember · Januar', ustd: 16 },
        { file: 'lb2-4.html', lb: 'Lernbereich 2', k: '2.4', title: 'Prozentrechnung',
          sub: 'Grundwert, Prozentwert und Prozentsatz, Rabatt und Mehrwertsteuer, Steigerung um und auf, Diagramme', when: 'Februar · März', ustd: 16 },
        { file: 'lb3-1.html', lb: 'Lernbereich 3', k: '3.1', title: 'Prismen und Pyramiden darstellen',
          sub: 'Netz, Schrägbild und Zweitafelbild, wahre Länge und wahre Größe', when: 'April', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Lernbereich 3', k: '3.2', title: 'Oberfläche, Volumen und Masse',
          sub: 'Prismen und Pyramiden berechnen, zusammengesetzte Körper, der Pyramidenstumpf', when: 'April · Mai', ustd: 8 },
        { file: 'lb4.html', lb: 'Lernbereich 4', k: '4', title: 'Daten darstellen',
          sub: 'Säulen-, Linien- und Kreisdiagramm, Diagramme in den Medien kritisch lesen', when: 'Mai', ustd: 4 },
        { file: 'wb.html', lb: 'Wahlbereich', k: 'W', title: 'Platonische Körper',
          sub: 'Polyeder, warum es genau fünf reguläre gibt, Eulers Polyedersatz, Platon und Kepler', when: 'Mai · Juni', ustd: 8 }
    ]
};
