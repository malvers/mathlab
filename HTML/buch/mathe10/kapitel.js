/* kapitel.js — the chapters of the book "Mathematik · Oberschule 10" (Realschulbildungsgang), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathe10.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlpflichtbereich 3; 4 Ustd./week, 80 + 8 Ustd.).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Oberschule 10',
    short: 'Mathematik OS 10',
    description: 'Interaktives Lehrbuch Mathematik für die Oberschule, Klasse 10, Realschulbildungsgang (Sachsen): Dreiecke und Vielecke mit Sinussatz und Kosinussatz, Potenz-, Exponential- und Sinusfunktionen, Zufallsgrößen und Erwartungswert, Lohn, Sparen und Kredit, Körper mit Pyramiden- und Kegelstumpf, Problemlösen für die Abschlussprüfung und Vermessung, mit Labs, Simulationen und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Lernbereich 1', k: '1.1', title: 'Dreiecke, Vierecke und Trigonometrie',
          sub: 'Haus der Vierecke, Winkelsummen, Sinus, Kosinus und Tangens in Figuren', when: 'August · September', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Lernbereich 1', k: '1.2', title: 'Sinussatz und Kosinussatz',
          sub: 'Seiten und Winkel in beliebigen Dreiecken, Entfernungen bestimmen', when: 'September', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Lernbereich 1', k: '1.3', title: 'Flächen in Dreiecken und Vielecken',
          sub: 'Flächeninhalt mit dem Sinus, regelmäßige Vielecke, Grundstücke berechnen', when: 'September · Oktober', ustd: 4 },
        { file: 'lb2-1.html', lb: 'Lernbereich 2', k: '2.1', title: 'Potenzfunktionen',
          sub: 'Parabeln und Hyperbeln, Symmetrie, Asymptoten, umgekehrte Proportionalität', when: 'November', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Lernbereich 2', k: '2.2', title: 'Exponentialfunktionen',
          sub: 'Wachstum und Zerfall, Wachstumsfaktor, Zinseszins, Halbwertszeit', when: 'November', ustd: 4 },
        { file: 'lb2-3.html', lb: 'Lernbereich 2', k: '2.3', title: 'Die Sinusfunktion',
          sub: 'Bogenmaß, Einheitskreis, Amplitude und Periode, Funktionen im Überblick', when: 'November · Dezember', ustd: 8 },
        { file: 'lb3.html', lb: 'Lernbereich 3', k: '3', title: 'Zufallsgrößen und Erwartungswert',
          sub: 'Wahrscheinlichkeitsverteilung, Erwartungswert, faire Spiele, Simulation und Risiko', when: 'Dezember · Januar', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Lernbereich 4', k: '4.1', title: 'Geld im Alltag',
          sub: 'Lohn und Abgaben, Haushaltsplan, Sparen, Kredit und Schuldenfalle', when: 'Januar', ustd: 8 },
        { file: 'lb4-2.html', lb: 'Lernbereich 4', k: '4.2', title: 'Körper und Stümpfe',
          sub: 'Prisma, Zylinder, Pyramide, Kegel und Kugel, Pyramiden- und Kegelstumpf, Masse und Kosten', when: 'Februar · März', ustd: 8 },
        { file: 'lb4-3.html', lb: 'Lernbereich 4', k: '4.3', title: 'Probleme lösen',
          sub: 'Wahrscheinlichkeit und Funktionen im Alltag, Basiswissen ohne Hilfsmittel, fit für die Prüfung', when: 'März', ustd: 12 },
        { file: 'wb.html', lb: 'Wahlpflichtbereich 3', k: 'W', title: 'Vermessungsprobleme',
          sub: 'Försterdreieck, Schattenmethode, Strahlensätze, Triangulation, Vermessung an der Schule', when: 'Mai', ustd: 8 }
    ]
};
