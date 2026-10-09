/* kapitel.js — the chapters of the book "Mathematik · Gymnasium 9", in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathegy9.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich; 4 Ustd./week, 104 + 8 Ustd.).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Gymnasium 9',
    short: 'Mathematik GY 9',
    description: 'Interaktives Lehrbuch Mathematik für das Gymnasium, Klasse 9 (Sachsen): Potenzen und Wurzeln, Potenzfunktionen, quadratische Funktionen und Gleichungen, Extremwertaufgaben, Kreis, Zylinder und Kugel, die Satzgruppe des Pythagoras, Trigonometrie im rechtwinkligen Dreieck, Pyramide und Kegel, Daten auswerten und der goldene Schnitt, mit Labs, Simulationen und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Lernbereich 1', k: '1.1', title: 'Potenzen und Wurzeln',
          sub: 'Potenzieren und Radizieren, Potenzgesetze mit rationalen Exponenten, Wurzelgleichungen', when: 'August · September', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Lernbereich 1', k: '1.2', title: 'Potenzfunktionen',
          sub: 'Ganzzahlige und rationale Exponenten, Symmetrie, Null- und Polstellen, Asymptoten', when: 'September', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Lernbereich 1', k: '1.3', title: 'Parameter und quadratische Funktionen',
          sub: 'Strecken, Verschieben, Spiegeln, Normal- und Scheitelpunktform, quadratische Ergänzung', when: 'Oktober', ustd: 8 },
        { file: 'lb1-4.html', lb: 'Lernbereich 1', k: '1.4', title: 'Quadratische Gleichungen und Extremwerte',
          sub: 'Lösungsformel, Diskriminante, Satz von Vieta, Extremwertaufgaben über den Scheitel', when: 'November', ustd: 16 },
        { file: 'lb2.html', lb: 'Lernbereich 2', k: '2', title: 'Kreis, Zylinder und Kugel',
          sub: 'Kreisbogen und Kreisausschnitt, Oberfläche, Volumen und Masse, Archimedes', when: 'Dezember', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Lernbereich 3', k: '3.1', title: 'Die Satzgruppe des Pythagoras',
          sub: 'Satz und Beweis, Strecken in Ebene und Raum, Höhen- und Kathetensatz, Umkehrung', when: 'Januar · Februar', ustd: 16 },
        { file: 'lb3-2.html', lb: 'Lernbereich 3', k: '3.2', title: 'Trigonometrie im rechtwinkligen Dreieck',
          sub: 'Sinus, Kosinus und Tangens, Seiten und Winkel, Flächen, regelmäßige Vielecke und π', when: 'Februar · März', ustd: 12 },
        { file: 'lb3-3.html', lb: 'Lernbereich 3', k: '3.3', title: 'Pyramide und Kreiskegel',
          sub: 'Oberfläche und Volumen, Projekt Landvermessung', when: 'März', ustd: 4 },
        { file: 'lb4.html', lb: 'Lernbereich 4', k: '4', title: 'Daten auswerten',
          sub: 'Modalwert, Median, Mittelwert, Streuung, Histogramme, statistische Tricks', when: 'April', ustd: 12 },
        { file: 'lb5.html', lb: 'Lernbereich 5', k: '5', title: 'Mathematik und moderne Rechentechnik',
          sub: 'Ein Sachproblem mit Tabellenkalkulation und CAS lösen', when: 'Mai', ustd: 4 },
        { file: 'wb.html', lb: 'Wahlbereich', k: 'W', title: 'Der goldene Schnitt',
          sub: 'Herleitung, Konstruktion, Pentagramm, Kunst und Architektur', when: 'Mai · Juni', ustd: 8 }
    ]
};
