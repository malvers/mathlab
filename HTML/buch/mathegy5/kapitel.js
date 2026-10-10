/* kapitel.js — the chapters of the book "Mathematik · Gymnasium 5", in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathegy5.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 3; 4 Ustd./week, 104 + 8 Ustd.).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Gymnasium 5',
    short: 'Mathematik GY 5',
    description: 'Interaktives Lehrbuch Mathematik für das Gymnasium, Klasse 5 (Sachsen): große Zahlen, Runden, Rechengesetze, Potenzen, Teiler und Primzahlen, Brüche, Dezimalzahlen und Prozent, Koordinaten, Winkel, Symmetrie und Spiegelung, Rechtecke und Quader, Größen im Alltag und Zahlen der Ägypter, Römer und Maya, mit Labs, Simulationen und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Lernbereich 1', k: '1.1', title: 'Große Zahlen',
          sub: 'Stellenwerttafel, Zahlenstrahl, Schätzen, Runden, Vergleichen und Ordnen', when: 'August · September', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Lernbereich 1', k: '1.2', title: 'Rechnen mit natürlichen Zahlen',
          sub: 'Rechengesetze und Rechenvorteile, Überschlag, Potenzen, Dividieren', when: 'September', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Lernbereich 1', k: '1.3', title: 'Teiler und Primzahlen',
          sub: 'Teiler und Vielfache, Teilbarkeitsregeln, das Sieb des Eratosthenes, Primfaktoren', when: 'September · Oktober', ustd: 3 },
        { file: 'lb2-1.html', lb: 'Lernbereich 2', k: '2.1', title: 'Brüche',
          sub: 'Anteile darstellen, Kürzen und Erweitern, echte und unechte Brüche, Vergleichen', when: 'November', ustd: 12 },
        { file: 'lb2-2.html', lb: 'Lernbereich 2', k: '2.2', title: 'Dezimalzahlen und Prozent',
          sub: 'Zehntel, Hundertstel, Tausendstel, Umwandeln, Prozent, Ordnen und Runden', when: 'November · Dezember', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Lernbereich 2', k: '2.3', title: 'Rechnen mit Dezimalzahlen',
          sub: 'Addieren und Subtrahieren, Kommaverschiebung, Multiplizieren und Dividieren, Mittelwert', when: 'Dezember', ustd: 7 },
        { file: 'lb3-1.html', lb: 'Lernbereich 3', k: '3.1', title: 'Koordinaten und Winkel',
          sub: 'Koordinatensystem, parallel und senkrecht, Winkel messen, Winkelarten, Winkelpaare', when: 'Januar · Februar', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Lernbereich 3', k: '3.2', title: 'Symmetrie und Spiegelung',
          sub: 'Muster, Achsen- und Punktsymmetrie, Verschiebung, Drehung, Geradenspiegelung', when: 'Februar · März', ustd: 10 },
        { file: 'lb4-1.html', lb: 'Lernbereich 4', k: '4.1', title: 'Rechtecke',
          sub: 'Umfang und Flächeninhalt, Flächeneinheiten, zusammengesetzte Figuren', when: 'März · April', ustd: 8 },
        { file: 'lb4-2.html', lb: 'Lernbereich 4', k: '4.2', title: 'Quader',
          sub: 'Ansichten, Schrägbild, Netz, Volumen, Hohlmaße, Oberfläche, Projekt Verpackungen', when: 'April · Mai', ustd: 14 },
        { file: 'lb5.html', lb: 'Lernbereich 5', k: '5', title: 'Mathematik im Alltag',
          sub: 'Größen umrechnen, Näherungswerte, Fahrpläne, Fermi-Aufgaben, ein Projekt', when: 'Mai · Juni', ustd: 10 },
        { file: 'wb.html', lb: 'Wahlbereich', k: 'W', title: 'Zählen und Rechnen – einst und jetzt',
          sub: 'Ägypter, Römer und Maya, Adam Ries, das Zweiersystem', when: 'Juni', ustd: 8 }
    ]
};
