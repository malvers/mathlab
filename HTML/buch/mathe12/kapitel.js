/* kapitel.js — the chapters of the book "Mathematik · Berufliches Gymnasium 12", in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathe12.html: LB 1 → LB 2 → LB 5; Grundkurs, Kurshalbjahre 12/I and 12/II).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Berufliches Gymnasium 12',
    short: 'Mathematik 12',
    description: 'Interaktives Lehrbuch Mathematik für das Berufliche Gymnasium, Klasse 12 (Sachsen): diskrete Zufallsgrößen und Binomialverteilung, Differenzialrechnung von Grenzwerten bis Extremwertproblemen und Vektorgeometrie im Raum, mit Labs, Simulationen, 3D-Grafik und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Lernbereich 1', k: '1.1', title: 'Bedingte Wahrscheinlichkeit',
          sub: 'Baumdiagramme, Vierfeldertafeln, stochastische Unabhängigkeit', when: 'August · September', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Lernbereich 1', k: '1.2', title: 'Zufallsgrößen',
          sub: 'Wahrscheinlichkeitsverteilung, Erwartungswert, Varianz, faire Spiele', when: 'September', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Lernbereich 1', k: '1.3', title: 'Die Binomialverteilung',
          sub: 'Bernoulli-Ketten, Binomialkoeffizient, kumulierte Wahrscheinlichkeiten', when: 'Oktober · November', ustd: 20 },
        { file: 'lb2-1.html', lb: 'Lernbereich 2', k: '2.1', title: 'Grenzwerte',
          sub: 'Verhalten im Unendlichen, Asymptoten, Stetigkeit', when: 'November · Dezember', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Lernbereich 2', k: '2.2', title: 'Die Ableitung',
          sub: 'Änderungsraten, von der Sekante zur Tangente, grafisches Ableiten', when: 'Dezember', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Lernbereich 2', k: '2.3', title: 'Ableitungsregeln',
          sub: 'Potenz-, Summen- und Faktorregel, eˣ und sin x, einfache Produkte', when: 'Januar', ustd: 12 },
        { file: 'lb2-4.html', lb: 'Lernbereich 2', k: '2.4', title: 'Monotonie, Extrema, Wendepunkte',
          sub: 'Was f′ und f″ über den Graphen verraten', when: 'Januar · März', ustd: 12 },
        { file: 'lb2-5.html', lb: 'Lernbereich 2', k: '2.5', title: 'Graphen untersuchen',
          sub: 'Symmetrie, Asymptoten, Tangenten und Normalen, Funktionen im Kontext', when: 'März', ustd: 12 },
        { file: 'lb2-6.html', lb: 'Lernbereich 2', k: '2.6', title: 'Steckbriefe und Extremwertprobleme',
          sub: 'Funktionen aus Bedingungen, das Beste finden', when: 'April · Mai', ustd: 20 },
        { file: 'lb5-1.html', lb: 'Lernbereich 5', k: '5.1', title: 'Vektoren im Raum',
          sub: 'Punkte und Vektoren, Rechnen mit Vektoren, Länge, Mittelpunkt', when: 'Mai · Juni', ustd: 12 },
        { file: 'lb5-2.html', lb: 'Lernbereich 5', k: '5.2', title: 'Skalarprodukt und Winkel',
          sub: 'Orthogonalität, Winkel zwischen Vektoren, Nachweise an Vierecken', when: 'Juni · Juli', ustd: 8 }
    ]
};
