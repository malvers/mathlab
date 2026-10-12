/* kapitel.js — the chapters of the book "Mathematik · Oberschule 6", in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathe6.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 2; 5 Ustd./week, 125 + 10 Ustd.).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Oberschule 6',
    short: 'Mathematik OS 6',
    description: 'Interaktives Lehrbuch Mathematik für die Oberschule, Klasse 6 (Sachsen): gebrochene Zahlen darstellen, umwandeln und vergleichen, Rechnen mit Brüchen und Dezimalzahlen, Zuordnungen und Dreisatz, Winkel und Dreiecke, Flächeninhalt und Umfang, Körper und ihre Netze, Mathematik im Alltag und mathematische Spiele, mit Labs, Simulationen und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Lernbereich 1', k: '1.1', title: 'Gebrochene Zahlen darstellen',
          sub: 'Mengen, Zahlenstrahl, Erweitern und Kürzen, Bruch und Dezimalzahl, Vergleichen', when: 'August · September', ustd: 20 },
        { file: 'lb1-2.html', lb: 'Lernbereich 1', k: '1.2', title: 'Rechnen mit gebrochenen Zahlen',
          sub: 'Addieren und Subtrahieren, Multiplizieren und Dividieren, Kopfrechnen und Überschlag', when: 'September · Oktober', ustd: 10 },
        { file: 'lb1-3.html', lb: 'Lernbereich 1', k: '1.3', title: 'Rechengesetze, Mittelwert und Sachaufgaben',
          sub: 'Vorrangregeln und Rechenvorteile, arithmetisches Mittel, Gleichungen durch Überlegen lösen', when: 'Oktober', ustd: 5 },
        { file: 'lb2-1.html', lb: 'Lernbereich 2', k: '2.1', title: 'Zuordnungen darstellen',
          sub: 'Eindeutig, eineindeutig, mehrdeutig, Wortform, Tabelle, Pfeile, Graph und Gleichung', when: 'November', ustd: 10 },
        { file: 'lb2-2.html', lb: 'Lernbereich 2', k: '2.2', title: 'Proportionalität und Dreisatz',
          sub: 'Direkt und indirekt proportional, Quotient und Produkt, Dreisatz, Sachaufgaben', when: 'November · Dezember', ustd: 15 },
        { file: 'lb3-1.html', lb: 'Lernbereich 3', k: '3.1', title: 'Winkel und Dreiecke',
          sub: 'Winkel an Geraden, Innenwinkelsatz, Dreiecksarten, Kongruenzsätze und Dreiecksungleichung', when: 'Januar', ustd: 15 },
        { file: 'lb3-2.html', lb: 'Lernbereich 3', k: '3.2', title: 'Flächeninhalt und Umfang',
          sub: 'Dreieck, Parallelogramm, Drachenviereck und Trapez, zusammengesetzte Flächen, Problemlösen', when: 'Januar · Februar', ustd: 15 },
        { file: 'lb4.html', lb: 'Lernbereich 4', k: '4', title: 'Geometrische Körper',
          sub: 'Körper beschreiben, Ansichten, Schrägbild und Netz, zusammengesetzte Körper, gerade Prismen', when: 'März · April', ustd: 20 },
        { file: 'lb5.html', lb: 'Lernbereich 5', k: '5', title: 'Mathematik im Alltag',
          sub: 'Problemlösestrategien, Zufallsversuche und Häufigkeiten, wenn–dann und je–desto', when: 'April · Mai', ustd: 15 },
        { file: 'wb.html', lb: 'Wahlbereich', k: 'W', title: 'Mathematische Spiele',
          sub: 'Tangram und Soma-Würfel, Turm von Hanoi, Nim-Spiele, Würfelspiele, ein eigenes Spiel', when: 'Juni', ustd: 10 }
    ]
};
