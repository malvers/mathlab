/* kapitel.js — the chapters of the book "Mathematik · Gymnasium 6", in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathegy6.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 3; 4 Ustd./week, 104 + 8 Ustd.).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Gymnasium 6',
    short: 'Mathematik GY 6',
    description: 'Interaktives Lehrbuch Mathematik für das Gymnasium, Klasse 6 (Sachsen): Brüche, Dezimalzahlen und Prozent, Rechnen mit gebrochenen Zahlen, Gleichungen und Sachaufgaben, Zuordnungen und Dreisatz, Dreiecke und Vierecke mit Winkelsumme, Kongruenz und Flächeninhalt, Prismen, Anteile und Primzahlen, mit Labs, Simulationen und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Lernbereich 1', k: '1.1', title: 'Gebrochene Zahlen darstellen',
          sub: 'Brüche, Dezimalzahlen und Prozent, endlich oder periodisch, Mengen und Zahlbereiche', when: 'August · September', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Lernbereich 1', k: '1.2', title: 'Rechnen mit gebrochenen Zahlen',
          sub: 'Addieren, Subtrahieren, Multiplizieren und Dividieren mit Brüchen und Dezimalzahlen', when: 'September', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Lernbereich 1', k: '1.3', title: 'Rechengesetze, Gleichungen und Sachaufgaben',
          sub: 'Vorrangregeln und Rechenvorteile, Gleichungen und Ungleichungen durch Überlegen lösen, Sachaufgaben mit Plan', when: 'Oktober · November', ustd: 10 },
        { file: 'lb2-1.html', lb: 'Lernbereich 2', k: '2.1', title: 'Zuordnungen',
          sub: 'Mehrdeutig, eindeutig, eineindeutig, Tabelle, Diagramm und Gleichung, absolute und relative Häufigkeiten', when: 'November · Dezember', ustd: 12 },
        { file: 'lb2-2.html', lb: 'Lernbereich 2', k: '2.2', title: 'Proportionale Zuordnungen',
          sub: 'Direkt und indirekt proportional, Quotienten- und Produktgleichheit, Graphen, Dreisatz', when: 'Dezember · Januar', ustd: 12 },
        { file: 'lb3-1.html', lb: 'Lernbereich 3', k: '3.1', title: 'Winkelsumme und Kongruenz',
          sub: 'Innenwinkelsatz mit Beweis, Definition und Satz, Kongruenzsätze, Dreieckskonstruktionen', when: 'Januar · Februar', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Lernbereich 3', k: '3.2', title: 'Sätze und besondere Linien im Dreieck',
          sub: 'Basiswinkelsatz, Seiten und Winkel, Dreiecksungleichung, Mittelsenkrechten, Winkelhalbierende, Höhen, Seitenhalbierende', when: 'März', ustd: 8 },
        { file: 'lb3-3.html', lb: 'Lernbereich 3', k: '3.3', title: 'Flächeninhalt und das Haus der Vierecke',
          sub: 'Parallelogramm, Dreieck, Trapez und Drachen, zusammengesetzte Figuren, Vierecke ordnen', when: 'März · April', ustd: 10 },
        { file: 'lb4.html', lb: 'Lernbereich 4', k: '4', title: 'Prismen',
          sub: 'Eigenschaften, Schrägbild und Netz, Oberflächeninhalt und Volumen, Projekt Verpackungsmüll', when: 'April · Mai', ustd: 12 },
        { file: 'lb5.html', lb: 'Lernbereich 5', k: '5', title: 'Vernetzung: Anteile',
          sub: 'Bruch und Prozent, Kreisdiagramme, Flächen- und Volumenanteile', when: 'Mai', ustd: 4 },
        { file: 'wb.html', lb: 'Wahlbereich', k: 'W', title: 'Primzahlen',
          sub: 'Sieb des Eratosthenes, Primfaktorzerlegung, unendlich viele Primzahlen, Kryptographie', when: 'Mai · Juni', ustd: 8 }
    ]
};
