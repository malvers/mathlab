/* kapitel.js — the chapters of the book "Mathematik · Berufliches Gymnasium 13 · Leistungskurs", in the order of the school year
 * (Lehrplan Berufliches Gymnasium Mathematik, Sachsen, version 2026, Leistungskurs Jahrgangsstufe 13: LB 3 → LB 4 → LB 5 →
 * Wahlpflicht 1 or Wahlpflicht 2 (the school chooses one, the book has both) → LB 7 → Abiturvorbereitung).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Berufliches Gymnasium 13 · Leistungskurs',
    short: 'Mathematik 13 LK',
    description: 'Interaktives Lehrbuch Mathematik für das Berufliche Gymnasium, Jahrgangsstufe 13, Leistungskurs (Sachsen): Integralrechnung mit Hauptsatz und Rotationskörpern, normalverteilte Zufallsgrößen, beurteilende Statistik, beide Wahlpflichtbereiche – Geraden und Ebenen im Raum oder Matrizen mit Leontief-Modell und Populationsmodellen –, weitere Anwendungen und ein Kapitel zur Abiturvorbereitung, mit Labs, Simulationen, 3D-Grafik und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb3-1.html', lb: 'Lernbereich 3', k: '3.1', title: 'Stammfunktionen',
          sub: 'Rückwärts ableiten, Nachweis, Integrationsregeln, 1/x und ln|x|, CAS', when: 'August · September', ustd: 10 },
        { file: 'lb3-2.html', lb: 'Lernbereich 3', k: '3.2', title: 'Das bestimmte Integral und der Hauptsatz',
          sub: 'Rekonstruierter Bestand, Eigenschaften, Integralfunktion, Hauptsatz mit Beweis', when: 'September', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Lernbereich 3', k: '3.3', title: 'Flächeninhalte',
          sub: 'Zwischen Graph und x-Achse, zwischen zwei Graphen, Flächen mit Parameter', when: 'Oktober', ustd: 8 },
        { file: 'lb3-4.html', lb: 'Lernbereich 3', k: '3.4', title: 'Numerische Integration und Rotationskörper',
          sub: 'Rechteck- und Trapezmethode, Volumen bei Rotation um die x-Achse', when: 'Oktober · November', ustd: 10 },
        { file: 'lb4.html', lb: 'Lernbereich 4', k: '4', title: 'Normalverteilte Zufallsgrößen',
          sub: 'Glockenkurve, Dichte- und Verteilungsfunktion, Erwartungswert, Standardabweichung, σ-Regeln', when: 'November', ustd: 12 },
        { file: 'lb5-1.html', lb: 'Lernbereich 5', k: '5.1', title: 'Grundgesamtheit und Stichprobe',
          sub: 'Schätzen und Testen, Stichprobenmittel und Stichprobenvarianz', when: 'Dezember', ustd: 5 },
        { file: 'lb5-2.html', lb: 'Lernbereich 5', k: '5.2', title: 'Signifikanztests',
          sub: 'Ein- und zweiseitige Tests, Ablehnungsbereich, Fehler 1. und 2. Art, statistische Sicherheit', when: 'Dezember · Januar', ustd: 10 },
        { file: 'wp1-1.html', lb: 'Wahlpflicht 1', k: 'W1.1', title: 'Geraden und Ebenen',
          sub: 'Parametergleichungen, Vektorprodukt, Koordinatengleichung, Hessesche Normalform', when: 'Januar', ustd: 9 },
        { file: 'wp1-2.html', lb: 'Wahlpflicht 1', k: 'W1.2', title: 'Lagebeziehungen und Schnittwinkel',
          sub: 'Punkt, Gerade, Ebene: Schnittmengen, Spurpunkte, Spurgeraden, Schnittwinkel', when: 'Januar · Februar', ustd: 9 },
        { file: 'wp1-3.html', lb: 'Wahlpflicht 1', k: 'W1.3', title: 'Abstände, Prismen und Pyramiden',
          sub: 'Abstand Punkt–Ebene, Gerade–Ebene, Ebene–Ebene, Oberfläche und Volumen', when: 'Februar', ustd: 7 },
        { file: 'wp2-1.html', lb: 'Wahlpflicht 2', k: 'W2.1', title: 'Matrizen multiplizieren und invertieren',
          sub: 'Matrizenprodukt, Einheitsmatrix, inverse Matrix, Gleichungssysteme mit der Inversen', when: 'Januar', ustd: 8 },
        { file: 'wp2-2.html', lb: 'Wahlpflicht 2', k: 'W2.2', title: 'Verflechtungen und das Leontief-Modell',
          sub: 'Gozintographen, mehrstufige Produktion, Kostenrechnung, Input-Output-Analyse', when: 'Januar · Februar', ustd: 9 },
        { file: 'wp2-3.html', lb: 'Wahlpflicht 2', k: 'W2.3', title: 'Populationsmodelle',
          sub: 'Übergangsmatrizen, Potenzen von Matrizen, Grenzmatrix und Fixvektor, zyklische Entwicklung', when: 'Februar', ustd: 8 },
        { file: 'lb7-1.html', lb: 'Lernbereich 7', k: '7.1', title: 'Biquadratische Gleichungen und Funktionenscharen',
          sub: 'Substitution, Scharen, Parameter und Lösungsvielfalt, Ortskurven', when: 'Februar · März', ustd: 8 },
        { file: 'lb7-2.html', lb: 'Lernbereich 7', k: '7.2', title: 'Parameter und Extremwerte in Raum und Wirtschaft',
          sub: 'Gleichungssysteme mit Parameter, Drehmatrizen, kürzeste Abstände, Kosten, Erlös und Gewinn', when: 'März', ustd: 7 },
        { file: 'abi.html', lb: 'Abitur', k: 'A', title: 'Fit fürs Abitur',
          sub: 'Checklisten, Fehlerfallen und Aufgaben im Abiturformat des Leistungskurses aus 11, 12 und 13', when: 'März · April', ustd: 0 }
    ]
};
