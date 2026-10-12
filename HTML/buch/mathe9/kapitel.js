/* kapitel.js — the chapters of the book "Mathematik · Oberschule 9" (Realschulbildungsgang), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathe9.html: LB 1 → LB 2 → LB 3 → Wahlpflichtbereich 1 → LB 4; 4 Ustd./week, 100 + 8 Ustd.).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Oberschule 9',
    short: 'Mathematik OS 9',
    description: 'Interaktives Lehrbuch Mathematik für die Oberschule, Klasse 9, Realschulbildungsgang (Sachsen): der Satz des Pythagoras und seine Umkehrung, Sinus, Kosinus und Tangens, Sachaufgaben mit rechtwinkligen Dreiecken, Pyramide, Kreiskegel und Kugel, zusammengesetzte Körper, quadratische Funktionen und Gleichungen mit der Lösungsformel, der Goldene Schnitt und beschreibende Statistik mit einem eigenen Projekt, mit Widgets zum Ausprobieren und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Lernbereich 1', k: '1.1', title: 'Der Satz des Pythagoras',
          sub: 'Hypotenuse und Katheten, Seiten und Höhen berechnen, Abstände im Koordinatensystem, Umkehrung und Knotenschnur', when: 'August · September', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Lernbereich 1', k: '1.2', title: 'Sinus, Kosinus und Tangens',
          sub: 'Seitenverhältnisse im rechtwinkligen Dreieck, Seiten und Winkel mit dem Taschenrechner berechnen', when: 'September', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Lernbereich 1', k: '1.3', title: 'Rechtwinklige Dreiecke im Alltag',
          sub: 'Steigung in Prozent und Steigungswinkel, Leiter, Dach und Spannseil, Zerlegen in Teilprobleme', when: 'September · Oktober', ustd: 8 },
        { file: 'lb2-1.html', lb: 'Lernbereich 2', k: '2.1', title: 'Die Pyramide',
          sub: 'Netz, Schrägbild und Zweitafelbild, Körperhöhe, Seitenhöhe und Seitenkante, Oberfläche, Volumen und Masse', when: 'November', ustd: 12 },
        { file: 'lb2-2.html', lb: 'Lernbereich 2', k: '2.2', title: 'Kreiskegel und Kugel',
          sub: 'Mantellinie, Mantel als Kreisausschnitt, Oberfläche und Volumen von Kegel und Kugel, Kubikwurzel', when: 'Dezember', ustd: 12 },
        { file: 'lb2-3.html', lb: 'Lernbereich 2', k: '2.3', title: 'Zusammengesetzte Körper',
          sub: 'Türme, Silos, Werkstücke und Behälter zerlegen, Volumen, Oberfläche und Materialbedarf', when: 'Januar', ustd: 4 },
        { file: 'lb3-1.html', lb: 'Lernbereich 3', k: '3.1', title: 'Quadratische Funktionen',
          sub: 'Normalparabel, y = a · x² + c, Scheitelpunktform y = (x + d)² + e, Normalform und quadratische Ergänzung', when: 'Januar · Februar · März', ustd: 16 },
        { file: 'lb3-2.html', lb: 'Lernbereich 3', k: '3.2', title: 'Quadratische Gleichungen',
          sub: 'Inhaltlich lösen, Lösungsformel und Fallunterscheidung, Nullstellen, Schnittpunkte und Sachprobleme', when: 'März', ustd: 12 },
        { file: 'wb.html', lb: 'Wahlpflichtbereich', k: 'W', title: 'Der Goldene Schnitt',
          sub: 'Teilungsverhältnis und die Zahl Φ, Konstruktion, Fibonacci-Zahlen, Kunst, Architektur und Natur', when: 'April', ustd: 8 },
        { file: 'lb4.html', lb: 'Lernbereich 4', k: '4', title: 'Beschreibende Statistik',
          sub: 'Daten in den Medien, Mittelwert, Zentralwert und Modalwert, Spannweite, ein eigenes Statistikprojekt', when: 'Mai · Juni', ustd: 16 }
    ]
};
