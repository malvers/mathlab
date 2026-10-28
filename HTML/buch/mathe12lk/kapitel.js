/* kapitel.js — the chapters of the book "Mathematik · Berufliches Gymnasium 12 · Leistungskurs", in the order of the school year
 * (Lehrplan Berufliches Gymnasium Mathematik, Sachsen, version of 2026, Jahrgangsstufen 12 und 13 – Leistungskurs:
 * LB 1 → LB 2 → LB 6 in Jahrgangsstufe 12; LB 3, 4, 5, 7 and the Wahlpflicht follow in the book for Jahrgangsstufe 13).
 * No Stoffverteilungsplan exists for this course yet: Ustd. are the Zeitrichtwerte of the curriculum, split over the chapters.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Berufliches Gymnasium 12 · Leistungskurs',
    short: 'Mathematik 12 LK',
    description: 'Interaktives Lehrbuch Mathematik für das Berufliche Gymnasium, Jahrgangsstufe 12, Leistungskurs (Sachsen): diskrete Zufallsgrößen mit Verteilungsfunktion und Binomialverteilung, Differenzialrechnung von Grenzwerten und Stetigkeit über Produkt- und Kettenregel bis zu Regression und Extremwertproblemen, Vektorgeometrie im Raum, mit Beweisen, Labs, 3D-Grafik und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Lernbereich 1', k: '1.1', title: 'Bedingte Wahrscheinlichkeit',
          sub: 'Baumdiagramme, Vierfeldertafeln, Satz von Bayes, Unabhängigkeit', when: 'August · September', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Lernbereich 1', k: '1.2', title: 'Zufallsgrößen',
          sub: 'Wahrscheinlichkeits- und Verteilungsfunktion, Erwartungswert, Varianz', when: 'September · Oktober', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Lernbereich 1', k: '1.3', title: 'Die Binomialverteilung',
          sub: 'Bernoulli-Ketten, Summensymbol, gesuchtes n und p, Kenngrößen', when: 'Oktober · November', ustd: 20 },
        { file: 'lb2-1.html', lb: 'Lernbereich 2', k: '2.1', title: 'Grenzwerte und Stetigkeit',
          sub: 'Verhalten im Unendlichen, Grenzwert an einer Stelle, Unstetigkeitsstellen', when: 'November · Dezember', ustd: 10 },
        { file: 'lb2-2.html', lb: 'Lernbereich 2', k: '2.2', title: 'Die Ableitung',
          sub: 'Änderungsraten, Differenzialquotient, lineare Approximation', when: 'Dezember · Januar', ustd: 12 },
        { file: 'lb2-3.html', lb: 'Lernbereich 2', k: '2.3', title: 'Ableitungsregeln',
          sub: 'Potenz-, Faktor- und Summenregel, eˣ, ln x, sin x, cos x', when: 'Januar', ustd: 12 },
        { file: 'lb2-4.html', lb: 'Lernbereich 2', k: '2.4', title: 'Produkt- und Kettenregel',
          sub: 'Produkte und Verkettungen ableiten, Wurzeln und e-Funktionen', when: 'Februar', ustd: 12 },
        { file: 'lb2-5.html', lb: 'Lernbereich 2', k: '2.5', title: 'Monotonie, Extrema, Wendepunkte',
          sub: 'Notwendige und hinreichende Bedingungen, globale Extrema', when: 'Februar · März', ustd: 14 },
        { file: 'lb2-6.html', lb: 'Lernbereich 2', k: '2.6', title: 'Graphen untersuchen',
          sub: 'Symmetrie, Asymptoten, Tangenten und Normalen, Probleme im Kontext', when: 'März · April', ustd: 14 },
        { file: 'lb2-7.html', lb: 'Lernbereich 2', k: '2.7', title: 'Steckbriefe und Regression',
          sub: 'Funktionen aus Bedingungen, Regressionsmodelle mit Hilfsmitteln', when: 'April', ustd: 9 },
        { file: 'lb2-8.html', lb: 'Lernbereich 2', k: '2.8', title: 'Extremwertprobleme',
          sub: 'Modellieren, Randextrema, Fallunterscheidungen', when: 'Mai', ustd: 12 },
        { file: 'lb6-1.html', lb: 'Lernbereich 6', k: '6.1', title: 'Vektoren im Raum',
          sub: 'Orts- und Verbindungsvektoren, Linearkombination, Schwerpunkte', when: 'Mai · Juni', ustd: 12 },
        { file: 'lb6-2.html', lb: 'Lernbereich 6', k: '6.2', title: 'Skalarprodukt und Winkel',
          sub: 'Orthogonalität, Winkel, Nachweise und Beweise mit Vektoren', when: 'Juni · Juli', ustd: 8 }
    ]
};
