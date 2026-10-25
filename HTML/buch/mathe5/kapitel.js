/* kapitel.js — the chapters of the book "Mathematik · Oberschule 5", in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathe5.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlbereich 1; Lehrplan Oberschule 2019:
 * 100 Ustd. Pflicht + 8 Ustd. Wahlbereich). Single source for the table of contents (index.html) and the
 * previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Oberschule 5',
    short: 'Mathematik OS 5',
    description: 'Interaktives Lehrbuch Mathematik für die Oberschule, Klasse 5 (Sachsen): große Zahlen, schriftliches Rechnen, Rechengesetze und Vorrangregeln, Quadratzahlen, Gleichungen und Teilbarkeit, Brüche, Dezimalzahlen, Prozent und Größen, Koordinaten und Winkel, Rechteck und Würfel, Symmetrie und Verschiebung sowie die Zahlzeichen von Babyloniern, Ägyptern und Römern, mit Labs, Simulationen und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Lernbereich 1', k: '1.1', title: 'Große Zahlen',
          sub: 'Zahlenstrahl, Stellenwerttafel, Millionen und Milliarden, Runden, Schätzen, Vergleichen', when: 'August · September', ustd: 7 },
        { file: 'lb1-2.html', lb: 'Lernbereich 1', k: '1.2', title: 'Rechnen mit natürlichen Zahlen',
          sub: 'Schriftlich addieren, subtrahieren, multiplizieren und dividieren, Überschlag, Rechengesetze, Vorrangregeln', when: 'September · Oktober', ustd: 15 },
        { file: 'lb1-3.html', lb: 'Lernbereich 1', k: '1.3', title: 'Potenzen, Gleichungen und Teiler',
          sub: 'Zehnerpotenzen, Quadratzahlen, Gleichungen durch Probieren lösen, Teilbarkeitsregeln, Primzahlen', when: 'Oktober · November', ustd: 12 },
        { file: 'lb2-1.html', lb: 'Lernbereich 2', k: '2.1', title: 'Brüche',
          sub: 'Anteile darstellen, Brüche am Zahlenstrahl, Bruchteile von Größen, Vergleichen und Abschätzen', when: 'Dezember · Januar', ustd: 11 },
        { file: 'lb2-2.html', lb: 'Lernbereich 2', k: '2.2', title: 'Dezimalzahlen und Prozent',
          sub: 'Zehntel, Hundertstel, Tausendstel, Umwandeln, Vergleichen, Runden, Prozentschreibweise', when: 'Januar', ustd: 9 },
        { file: 'lb2-3.html', lb: 'Lernbereich 2', k: '2.3', title: 'Rechnen mit Dezimalzahlen und Größen',
          sub: 'Addieren und Subtrahieren, Vervielfachen und Teilen, Durchschnitt, Geld, Länge, Masse und Zeit', when: 'Januar · März', ustd: 14 },
        { file: 'lb3-1.html', lb: 'Lernbereich 3', k: '3.1', title: 'Koordinaten, Geraden und Winkel',
          sub: 'Koordinatensystem, parallel und senkrecht, Winkel messen, zeichnen und schätzen, Winkelarten', when: 'März · April', ustd: 9 },
        { file: 'lb3-2.html', lb: 'Lernbereich 3', k: '3.2', title: 'Rechteck und Würfel',
          sub: 'Schrägbild und Netz des Würfels, Umfang und Flächeninhalt, Oberfläche und Volumen', when: 'April · Mai', ustd: 11 },
        { file: 'lb4.html', lb: 'Lernbereich 4', k: '4', title: 'Symmetrie und deckungsgleiche Figuren',
          sub: 'Symmetrieachsen, Geradenspiegelung, Verschiebung, Original und Bild, Bandornamente', when: 'Mai · Juni', ustd: 12 },
        { file: 'wb.html', lb: 'Wahlbereich', k: 'W', title: 'Wie die Menschen zählen und rechnen lernten',
          sub: 'Kerbholz, Babylonier, Ägypter und Römer, Rechnen auf den Linien, eine Präsentation', when: 'Juni · Juli', ustd: 8 }
    ]
};
