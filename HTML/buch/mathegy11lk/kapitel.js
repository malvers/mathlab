/* kapitel.js — the chapters of the book "Mathematik · Gymnasium 11 · Leistungskurs", in the order of the school year
 * (Stoffverteilungsplan of the Leistungskurs 11, 5 Ustd./week: LB 1 with LB 2 before the conditions part, Wahlbereich 2 at the end of 11/I,
 * then LB 3 → LB 4). The numbers follow the Lehrplan (1.x = Lernbereich 1 …), so chapter 2 comes between 1.4 and 1.5.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Gymnasium 11 · Leistungskurs',
    short: 'Mathematik GY 11 LK',
    description: 'Interaktives Lehrbuch Mathematik für das Gymnasium, Jahrgangsstufe 11, Leistungskurs (Sachsen): Grenzwerte und Stetigkeit, Ableitung nach Definition und lineare Approximation, Ableitungsregeln mit Beweis, Eigenschaften von Funktionen, Matrizen mit Drehungen und Verflechtungen, Steckbriefe, Extremwerte und Regression, numerische Verfahren bis zum Fixpunktsatz, Vektoren, Geraden und Ebenen in allen Lagen, Wahrscheinlichkeitsbegriff, Satz von Bayes und Binomialverteilung, mit Labs, Simulationen und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Lernbereich 1', k: '1.1', title: 'Grenzwerte und Stetigkeit',
          sub: 'Verhalten im Unendlichen, Grenzwert an einer Stelle, Grenzwertsätze, abschnittsweise definierte Funktionen, Stetigkeit', when: 'August · September', ustd: 15 },
        { file: 'lb1-2.html', lb: 'Lernbereich 1', k: '1.2', title: 'Änderungsraten und Ableitungsbegriff',
          sub: 'Lineare Approximation, Differenzen- und Differentialquotient, Ableitung nach Definition, Differenzierbarkeit', when: 'September', ustd: 10 },
        { file: 'lb1-3.html', lb: 'Lernbereich 1', k: '1.3', title: 'Ableitungsregeln',
          sub: 'Regeln mit Beweis, eˣ, ln x und sin x, Produkt- und Kettenregel, Umkehrung des Differenzierens', when: 'Oktober', ustd: 15 },
        { file: 'lb1-4.html', lb: 'Lernbereich 1', k: '1.4', title: 'Funktionsuntersuchung',
          sub: 'Monotonie, Extrema, Krümmung und Wendepunkte, Symmetrie, Polstellen, schiefe Asymptoten', when: 'November', ustd: 14 },
        { file: 'lb2.html', lb: 'Lernbereich 2', k: '2', title: 'Matrizen',
          sub: 'Ax = b, Produkt verketteter Matrizen, Gauß-Jordan-Verfahren, Drehungen, Verflechtungen', when: 'November · Dezember', ustd: 6 },
        { file: 'lb1-5.html', lb: 'Lernbereich 1', k: '1.5', title: 'Steckbrief, Extremwerte, Regression',
          sub: 'Funktionen aus Bedingungen, Extremwertprobleme, Funktionsgleichungen durch Regression', when: 'Dezember', ustd: 12 },
        { file: 'wb2.html', lb: 'Wahlbereich 2', k: 'W', title: 'Numerische Verfahren',
          sub: 'Grafische Lösung, Bisektion, Newton-Verfahren, Fixpunktiteration, Satz von Banach', when: 'Januar', ustd: 10 },
        { file: 'lb3-1.html', lb: 'Lernbereich 3', k: '3.1', title: 'Raum und Vektoren',
          sub: 'Räumliches Koordinatensystem, andere Koordinatensysteme, Rechnen mit Vektoren, Rechengesetze', when: 'Februar · März', ustd: 10 },
        { file: 'lb3-2.html', lb: 'Lernbereich 3', k: '3.2', title: 'Lineare Abhängigkeit und Geraden',
          sub: 'Lineare Abhängigkeit und Unabhängigkeit, Geraden in Parameterform, Lage zweier Geraden', when: 'März', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Lernbereich 3', k: '3.3', title: 'Ebenen und Lagebeziehungen',
          sub: 'Parameter- und Koordinatenform, Gerade und Ebene, Ebene und Ebene, Schnittgerade', when: 'März · April', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Lernbereich 4', k: '4.1', title: 'Wahrscheinlichkeit und Abzählen',
          sub: 'Statistisch, Laplace, Kolmogorow, Simulation, Urnenmodell, Pfadregeln, Vierfeldertafel, Abzählverfahren', when: 'April · Mai', ustd: 13 },
        { file: 'lb4-2.html', lb: 'Lernbereich 4', k: '4.2', title: 'Bedingte Wahrscheinlichkeit und Bayes',
          sub: 'Bedingte Wahrscheinlichkeit, Satz von Bayes an Baum und Vierfeldertafel, stochastische Unabhängigkeit', when: 'Mai', ustd: 8 },
        { file: 'lb4-3.html', lb: 'Lernbereich 4', k: '4.3', title: 'Die Binomialverteilung',
          sub: 'Bernoulli-Ketten, Herleitung der Formel, Summenzeichen, Erwartungswert, Varianz, Modellieren', when: 'Mai · Juni', ustd: 11 }
    ]
};
