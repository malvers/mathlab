/* kapitel.js — the chapters of the book "Mathematik · Gymnasium 8", in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathegy8.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 3; 4 Ustd./week, 104 + 8 Ustd.).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Gymnasium 8',
    short: 'Mathematik GY 8',
    description: 'Interaktives Lehrbuch Mathematik für das Gymnasium, Klasse 8 (Sachsen): Terme und Rechenbäume, binomische Formeln, Gleichungen und Ungleichungen, Zufallsversuche, Wahrscheinlichkeit und Baumdiagramme, Funktionen und lineare Funktionen, lineare Gleichungssysteme, zentrische Streckung und Ähnlichkeit, heuristische Strategien und Simulation mit Zufallszahlen, mit Labs, Simulationen und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Lernbereich 1', k: '1.1', title: 'Variablen und Terme',
          sub: 'Name, Wert und Bedeutung, Rechenbäume, zusammenfassen, ausmultiplizieren, ausklammern', when: 'August · September', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Lernbereich 1', k: '1.2', title: 'Binomische Formeln und Gleichungen',
          sub: 'Die drei binomischen Formeln, lineare Gleichungen, CAS, Ungleichungen', when: 'September', ustd: 12 },
        { file: 'lb2-1.html', lb: 'Lernbereich 2', k: '2.1', title: 'Zufallsversuche und Wahrscheinlichkeit',
          sub: 'Ergebnisse und Ereignisse, Venn-Diagramme, relative Häufigkeit, Laplace-Versuche', when: 'November', ustd: 16 },
        { file: 'lb2-2.html', lb: 'Lernbereich 2', k: '2.2', title: 'Mehrstufige Zufallsversuche und Zählen',
          sub: 'Urnenmodell, Baumdiagramm, Pfadregeln, Produktregel, Simulation', when: 'Dezember', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Lernbereich 3', k: '3.1', title: 'Funktionen und ihre Eigenschaften',
          sub: 'Eindeutige Zuordnungen, Darstellungsformen, Definitions- und Wertebereich, Monotonie, Extrema, Symmetrie', when: 'Januar', ustd: 8 },
        { file: 'lb3-2.html', lb: 'Lernbereich 3', k: '3.2', title: 'Lineare Funktionen',
          sub: 'Anstieg und Differenzenquotient, Nullstellen, Geradengleichungen, lineare Regression', when: 'Januar · Februar', ustd: 12 },
        { file: 'lb3-3.html', lb: 'Lernbereich 3', k: '3.3', title: 'Lineare Gleichungssysteme',
          sub: 'Grafisch und rechnerisch lösen, Lösbarkeit, Modellieren', when: 'März', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Lernbereich 4', k: '4.1', title: 'Zentrische Streckung',
          sub: 'Streckzentrum und Streckfaktor, Konstruktion, Winkeltreue, Streckenverhältnisse', when: 'April', ustd: 8 },
        { file: 'lb4-2.html', lb: 'Lernbereich 4', k: '4.2', title: 'Ähnlichkeit',
          sub: 'Hauptähnlichkeitssatz, Hilfsfiguren, Höhen messen, Längen, Flächen und Volumina', when: 'April · Mai', ustd: 12 },
        { file: 'lb5.html', lb: 'Lernbereich 5', k: '5', title: 'Heuristische Strategien',
          sub: 'Vorwärts- und Rückwärtsarbeiten, Lösungspläne, Lösungswege präsentieren', when: 'Mai', ustd: 4 },
        { file: 'wb.html', lb: 'Wahlbereich', k: 'W', title: 'Simulation mit Zufallszahlen',
          sub: 'Zufallszahlen, Monte-Carlo-Methode, Ziegenproblem, Sammelbilder', when: 'Mai · Juni', ustd: 8 }
    ]
};
