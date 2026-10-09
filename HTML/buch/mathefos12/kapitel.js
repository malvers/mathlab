/* kapitel.js — the chapters of the book "Mathematik · Fachoberschule 12", in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathefos12.html: LB 1 → LB 2 → LB 3 → LB 4 → FHR-Prüfung → Wahlbereich 3; 4 Ustd./week).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Fachoberschule 12',
    short: 'Mathematik FOS 12',
    description: 'Interaktives Lehrbuch Mathematik für die Fachoberschule, Klasse 12 (Sachsen): Vektoren, Geraden und Ebenen im Raum in echtem 3D, Differenzialrechnung von Grenzwerten bis zu Extremalaufgaben, Integralrechnung, gebrochenrationale und Exponentialfunktionen, Training für die FHR-Prüfung und ein Wahlbereich mit CAS, mit Labs, Simulationen und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Lernbereich 1', k: '1.1', title: 'Vektoren und Skalarprodukt',
          sub: 'Pfeile im Raum, Betrag, Rechnen mit Vektoren, Winkel und Orthogonalität', when: 'August · September', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Lernbereich 1', k: '1.2', title: 'Geraden im Raum',
          sub: 'Parametergleichung, Punktprobe, Spurpunkte, Lagebeziehungen, Schnittwinkel', when: 'September', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Lernbereich 1', k: '1.3', title: 'Ebenen im Raum',
          sub: 'Parameter- und Koordinatengleichung, Vektorprodukt, Gerade und Ebene', when: 'September · Oktober', ustd: 8 },
        { file: 'lb1-4.html', lb: 'Lernbereich 1', k: '1.4', title: 'Lot, Abstand und Flächen',
          sub: 'Lotfußpunkt, Abstand Punkt–Ebene, Flächeninhalte, vermischte Anwendungen', when: 'Oktober · November', ustd: 6 },
        { file: 'lb2-1.html', lb: 'Lernbereich 2', k: '2.1', title: 'Grenzwerte und Änderungsraten',
          sub: 'Zahlenfolgen, Verhalten im Unendlichen, Stetigkeit, Durchschnitts- und Momentangeschwindigkeit', when: 'November', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Lernbereich 2', k: '2.2', title: 'Die Ableitung',
          sub: 'Differenzialquotient, Ableitungsregeln, Kettenregel, Tangente und Normale', when: 'November · Dezember', ustd: 12 },
        { file: 'lb2-3.html', lb: 'Lernbereich 2', k: '2.3', title: 'Kurvendiskussion',
          sub: 'Nullstellen, Symmetrie, Monotonie, Extrem- und Wendepunkte, das vollständige Schema', when: 'Dezember · Januar', ustd: 8 },
        { file: 'lb2-4.html', lb: 'Lernbereich 2', k: '2.4', title: 'Scharen, Steckbriefe und Extremalaufgaben',
          sub: 'Schnitt- und Berührpunkte, Funktionenscharen, Funktionen aus Bedingungen, Optimieren', when: 'Januar', ustd: 7 },
        { file: 'lb3.html', lb: 'Lernbereich 3', k: '3', title: 'Integralrechnung',
          sub: 'Stammfunktionen, bestimmtes Integral, Hauptsatz, Flächen zwischen Graphen', when: 'Februar · März', ustd: 10 },
        { file: 'lb4-1.html', lb: 'Lernbereich 4', k: '4.1', title: 'Gebrochenrationale Funktionen',
          sub: 'Polstellen und Lücken, Asymptoten, Quotientenregel, vollständige Untersuchung', when: 'März', ustd: 12 },
        { file: 'lb4-2.html', lb: 'Lernbereich 4', k: '4.2', title: 'Exponentialfunktionen zur Basis e',
          sub: 'Die Zahl e, Exponentialgleichungen, Ableiten mit Ketten- und Produktregel, Wachstum', when: 'April', ustd: 13 },
        { file: 'fhr.html', lb: 'Prüfung', k: 'P', title: 'Fit für die FHR-Prüfung',
          sub: 'Checklisten und Aufgaben im Prüfungsformat aus allen Lernbereichen', when: 'Mai', ustd: 0 },
        { file: 'wb3.html', lb: 'Wahlbereich 3', k: 'W', title: 'Differenzial- und Integralrechnung mit CAS',
          sub: 'Scharen mit zwei Parametern, abschnittsweise Funktionen, Regression, Ausblick Zentralprojektion', when: 'Juni', ustd: 8 }
    ]
};
