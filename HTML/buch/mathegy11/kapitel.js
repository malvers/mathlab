/* kapitel.js — the chapters of the book "Mathematik · Gymnasium 11" (Grundkurs), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathegy11.html: LB 1 with LB 2 before the conditions part, Wahlbereich 2 at the end of 11/I,
 * then LB 3 → LB 4; 4 Ustd./week). The numbers follow the Lehrplan (1.x = Lernbereich 1 …), so chapter 2 comes between 1.4 and 1.5.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Gymnasium 11',
    short: 'Mathematik GY 11',
    description: 'Interaktives Lehrbuch Mathematik für das Gymnasium, Jahrgangsstufe 11, Grundkurs (Sachsen): Grenzwerte, Ableitung und Ableitungsregeln, Funktionsuntersuchung, Funktionen aus Bedingungen, Extremwertprobleme und Regression, Matrizen und Gauß-Jordan-Verfahren, numerische Verfahren, Vektoren, Geraden und Ebenen im Raum, mehrstufige Zufallsexperimente und die Binomialverteilung, mit Labs, Simulationen und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Lernbereich 1', k: '1.1', title: 'Grenzwerte und Stetigkeit',
          sub: 'Verhalten im Unendlichen, Grenzwert an einer Stelle, Grenzwertsätze, Stetigkeit', when: 'August · September', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Lernbereich 1', k: '1.2', title: 'Änderungsraten und Ableitung',
          sub: 'Sekante und Tangente, Differenzen- und Differentialquotient, Ableitungsfunktion', when: 'September', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Lernbereich 1', k: '1.3', title: 'Ableitungsregeln',
          sub: 'Potenz-, Faktor- und Summenregel, eˣ, ln x und sin x, Produkt- und Kettenregel', when: 'September · Oktober', ustd: 12 },
        { file: 'lb1-4.html', lb: 'Lernbereich 1', k: '1.4', title: 'Funktionen untersuchen',
          sub: 'Monotonie, Extrema, Wendepunkte, Symmetrie, Polstellen und Asymptoten', when: 'Oktober · November', ustd: 12 },
        { file: 'lb2.html', lb: 'Lernbereich 2', k: '2', title: 'Matrizen',
          sub: 'Matrizenschreibweise, Multiplikation, Gauß-Jordan-Verfahren, Drehungen', when: 'November · Dezember', ustd: 6 },
        { file: 'lb1-5.html', lb: 'Lernbereich 1', k: '1.5', title: 'Funktionen nach Maß',
          sub: 'Funktionen aus Bedingungen, Extremwertprobleme, Regression', when: 'Dezember · Januar', ustd: 12 },
        { file: 'wb2.html', lb: 'Wahlbereich 2', k: 'W', title: 'Numerische Verfahren',
          sub: 'Gleichungen grafisch lösen, Bisektion, Newton-Verfahren', when: 'Januar · Februar', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Lernbereich 3', k: '3.1', title: 'Vektoren im Raum',
          sub: 'Räumliches Koordinatensystem, Rechnen mit Vektoren, lineare Abhängigkeit', when: 'Februar · März', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Lernbereich 3', k: '3.2', title: 'Geraden im Raum',
          sub: 'Parameterform, Punktprobe, Spurpunkte, Lagebeziehungen zweier Geraden', when: 'März', ustd: 8 },
        { file: 'lb3-3.html', lb: 'Lernbereich 3', k: '3.3', title: 'Ebenen',
          sub: 'Parameterform, parameterfreie Form, Lage von Gerade und Ebene', when: 'April', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Lernbereich 4', k: '4.1', title: 'Mehrstufige Zufallsexperimente',
          sub: 'Urnenmodell, Pfadregeln, Vierfeldertafel, stochastische Unabhängigkeit, Simulation', when: 'April · Mai', ustd: 6 },
        { file: 'lb4-2.html', lb: 'Lernbereich 4', k: '4.2', title: 'Die Binomialverteilung',
          sub: 'Bernoulli-Ketten, Binomialkoeffizient, kumulierte Wahrscheinlichkeiten, Erwartungswert und Streuung', when: 'Mai · Juni', ustd: 12 }
    ]
};
