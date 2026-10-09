/* kapitel.js — the chapters of the book "Mathematik · Berufliches Gymnasium 11", in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathe11.html: LB 2 → LB 3 → LB 4 → LB 1 → Wahlbereich 3).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Berufliches Gymnasium 11',
    short: 'Mathematik 11',
    description: 'Interaktives Lehrbuch Mathematik für das Berufliche Gymnasium, Klasse 11 (Sachsen): Gleichungen, Funktionen, Gleichungssysteme, Wahrscheinlichkeit und Numerik, mit Labs, Simulationen und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb2.html', lb: 'Lernbereich 2', k: '2', title: 'Gleichungen, Formeln, Figuren',
          sub: 'Probleme mit und ohne Hilfsmittel lösen', when: 'September', ustd: 20 },
        { file: 'lb3-1.html', lb: 'Lernbereich 3', k: '3.1', title: 'Funktionen und ihre Eigenschaften',
          sub: 'Definitionsbereich, Nullstellen, Monotonie, Symmetrie', when: 'Ende September', ustd: 5 },
        { file: 'lb3-2.html', lb: 'Lernbereich 3', k: '3.2', title: 'Wachstum und Zerfall',
          sub: 'Lineare Funktionen und Exponentialfunktionen', when: 'Oktober · November', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Lernbereich 3', k: '3.3', title: 'Quadratische Funktionen und Gleichungen',
          sub: 'Gleichmäßig beschleunigte Bewegungen', when: 'November', ustd: 15 },
        { file: 'lb3-4.html', lb: 'Lernbereich 3', k: '3.4', title: 'Periodische Vorgänge',
          sub: 'Sinusfunktionen', when: 'Dezember', ustd: 10 },
        { file: 'lb3-5.html', lb: 'Lernbereich 3', k: '3.5', title: 'Regression',
          sub: 'Messreihen mit digitalen Hilfsmitteln auswerten', when: 'Dezember', ustd: 5 },
        { file: 'lb3-6.html', lb: 'Lernbereich 3', k: '3.6', title: 'Umkehrfunktionen und Logarithmus',
          sub: 'Wurzelfunktion, Logarithmus, Exponentialgleichungen', when: 'Januar', ustd: 15 },
        { file: 'lb3-7.html', lb: 'Lernbereich 3', k: '3.7', title: 'Graphen und Parameter',
          sub: 'Die Grundfunktionen ohne Hilfsmittel, Strecken und Verschieben', when: 'Februar · März', ustd: 15 },
        { file: 'lb4.html', lb: 'Lernbereich 4', k: '4', title: 'Lineare Gleichungssysteme und Matrizen',
          sub: 'Gauß-Verfahren, Lösungsmengen, Matrizenoperationen', when: 'März · April', ustd: 20 },
        { file: 'lb1.html', lb: 'Lernbereich 1', k: '1', title: 'Wahrscheinlichkeiten mehrstufiger Zufallsversuche',
          sub: 'Baumdiagramme, Vierfeldertafeln, Simulation', when: 'April', ustd: 15 },
        { file: 'wb3.html', lb: 'Wahlbereich 3', k: 'W', title: 'Numerische Verfahren und Simulationen',
          sub: 'Bisektion, Flächen näherungsweise, Monte-Carlo-Methode', when: 'Mai · Juni', ustd: 10 }
    ]
};
