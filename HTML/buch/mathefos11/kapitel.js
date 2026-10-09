/* kapitel.js — the chapters of the book "Mathematik · Fachoberschule 11", in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathefos11.html: LB 1 → LB 2 → Wahlbereich 2, then the outlooks of Wahlbereich 1 and 3; 3 Ustd./week).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Fachoberschule 11',
    short: 'Mathematik FOS 11',
    description: 'Interaktives Lehrbuch Mathematik für die Fachoberschule, Klasse 11 (Sachsen): Terme und Formeln, lineare und quadratische Funktionen, Gleichungen, Ungleichungen und Gleichungssysteme, ganzrationale Funktionen, Wahrscheinlichkeiten, Abzählen und Bernoulli-Ketten, Finanzmathematik und Ausblicke auf komplexe Zahlen und Schaltalgebra, mit Labs, Simulationen und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Lernbereich 1', k: '1.1', title: 'Zahlen, Terme und Formeln',
          sub: 'Zahlenbereiche, Formeln umstellen, Betrag, binomische Formeln, Prozente, Potenzen', when: 'August · September', ustd: 6 },
        { file: 'lb1-2.html', lb: 'Lernbereich 1', k: '1.2', title: 'Funktionen und lineare Funktionen',
          sub: 'Funktionsbegriff, Anstieg und Achsenabschnitt, Geradengleichungen, Steigungswinkel', when: 'September', ustd: 9 },
        { file: 'lb1-3.html', lb: 'Lernbereich 1', k: '1.3', title: 'Lineare Gleichungen und Ungleichungen',
          sub: 'Äquivalenzumformungen, Lösungsmengen, Bruchgleichungen', when: 'Oktober', ustd: 6 },
        { file: 'lb1-4.html', lb: 'Lernbereich 1', k: '1.4', title: 'Geraden und lineare Gleichungssysteme',
          sub: 'Parameter, Lagebeziehungen, drei Lösungsverfahren, Anwendungen', when: 'November', ustd: 9 },
        { file: 'lb1-5.html', lb: 'Lernbereich 1', k: '1.5', title: 'Quadratische Funktionen und Gleichungen',
          sub: 'Scheitelpunkt- und Normalform, Lösungsformel, Satz von Vieta', when: 'Dezember', ustd: 6 },
        { file: 'lb1-6.html', lb: 'Lernbereich 1', k: '1.6', title: 'Parabeln nach Maß',
          sub: 'Linearfaktoren, Funktionsgleichungen aus Bedingungen, Parameter mit Fallunterscheidung', when: 'Januar', ustd: 6 },
        { file: 'lb1-7.html', lb: 'Lernbereich 1', k: '1.7', title: 'Ganzrationale Funktionen',
          sub: 'Linearfaktorzerlegung, Substitution, Vielfachheit, Kurvenverlauf', when: 'Januar', ustd: 3 },
        { file: 'lb2-1.html', lb: 'Lernbereich 2', k: '2.1', title: 'Zufall und Wahrscheinlichkeit',
          sub: 'Ergebnisse und Ereignisse, Gesetz der großen Zahlen, Laplace, Ereignisse verknüpfen', when: 'Februar · März', ustd: 9 },
        { file: 'lb2-2.html', lb: 'Lernbereich 2', k: '2.2', title: 'Mehrstufige Zufallsexperimente',
          sub: 'Unabhängigkeit, Baumdiagramme und Pfadregeln, Anwendungen', when: 'März', ustd: 9 },
        { file: 'lb2-3.html', lb: 'Lernbereich 2', k: '2.3', title: 'Abzählen, Urnenmodell und Bernoulli-Ketten',
          sub: 'Zählprinzip, Permutation, Variation, Kombination, Formel von Bernoulli', when: 'April', ustd: 12 },
        { file: 'wb2.html', lb: 'Wahlbereich 2', k: 'W', title: 'Finanzmathematik',
          sub: 'Zinseszins, Sparpläne, Raten- und Annuitätentilgung', when: 'Mai', ustd: 6 },
        { file: 'exkurse.html', lb: 'Ausblicke', k: 'E', title: 'Komplexe Zahlen und Schaltalgebra',
          sub: 'Wahlbereich 1 und 3 als Exkurse: Gaußsche Zahlenebene, Wahrheitstafeln, Schaltungen', when: 'Juni', ustd: 0 }
    ]
};
