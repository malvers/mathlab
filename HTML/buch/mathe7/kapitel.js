/* kapitel.js — the chapters of the book "Mathematik · Oberschule 7" (Realschulbildungsgang), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathe7.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlbereich 3; 4 Ustd./week, 100 + 8 Ustd.).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Oberschule 7',
    short: 'Mathematik OS 7',
    description: 'Interaktives Lehrbuch Mathematik für die Oberschule, Klasse 7 im Realschulbildungsgang (Sachsen): Prozent- und Zinsrechnung, Zufall und Häufigkeiten, rationale Zahlen, Terme und Gleichungen, Vierecke, Vielecke und Prismen mit Masse und Dichte, Parkettierungen nach Escher, mit Labs, Simulationen und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Lernbereich 1', k: '1.1', title: 'Prozentrechnung',
          sub: 'Prozent als Hundertstel, Grundwert, Prozentwert und Prozentsatz, die drei Grundaufgaben, Kreisdiagramme', when: 'August · September', ustd: 16 },
        { file: 'lb1-2.html', lb: 'Lernbereich 1', k: '1.2', title: 'Prozente im Alltag und Zinsen',
          sub: 'Preiserhöhung und Preissenkung, Rabatt und Mehrwertsteuer, Jahres- und Tageszinsen, Zinseszins mit der Tabellenkalkulation', when: 'September · Oktober', ustd: 12 },
        { file: 'lb2.html', lb: 'Lernbereich 2', k: '2', title: 'Elemente der Stochastik',
          sub: 'Zufallsversuche, Ergebnisse und Ereignisse, Häufigkeiten und Simulation, Wahrscheinlichkeit, Statistik kritisch lesen', when: 'November', ustd: 12 },
        { file: 'lb3-1.html', lb: 'Lernbereich 3', k: '3.1', title: 'Rationale Zahlen',
          sub: 'Negative Zahlen, Zahlengerade, Gegenzahl und Betrag, Zahlbereiche, Koordinaten in vier Quadranten', when: 'November · Dezember', ustd: 8 },
        { file: 'lb3-2.html', lb: 'Lernbereich 3', k: '3.2', title: 'Rechnen mit rationalen Zahlen',
          sub: 'Addieren und Subtrahieren, Multiplizieren, Dividieren und Potenzieren, Rechengesetze und Vorrangregeln', when: 'Dezember · Januar', ustd: 12 },
        { file: 'lb3-3.html', lb: 'Lernbereich 3', k: '3.3', title: 'Terme und Gleichungen',
          sub: 'Termwerte, Gleichungen aufstellen und lösen, Formeln umstellen, Verhältnisgleichungen', when: 'Januar', ustd: 8 },
        { file: 'lb4-1.html', lb: 'Lernbereich 4', k: '4.1', title: 'Vierecke und Vielecke',
          sub: 'Vierecke in der Umwelt, Vierecke konstruieren, Flächeninhalt und Umfang, Vielecke zerlegen und vergleichen', when: 'Februar · März', ustd: 16 },
        { file: 'lb4-2.html', lb: 'Lernbereich 4', k: '4.2', title: 'Prismen',
          sub: 'Schrägbild und Netz, Oberfläche und Volumen, Masse und Dichte, zusammengesetzte Körper und Verpackungen', when: 'April · Mai', ustd: 16 },
        { file: 'wb.html', lb: 'Wahlbereich', k: 'W', title: 'Parkettierungen',
          sub: 'Parkette aus regelmäßigen Vielecken, die Winkel an einer Ecke, Parkette nach M. C. Escher', when: 'Juni', ustd: 8 }
    ]
};
