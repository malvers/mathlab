/* kapitel.js — the chapters of the book "Mathematik · Oberschule 8" (Realschulbildungsgang), in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathe8.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → LB 6 → Wahlpflichtbereich 1; 4 Ustd./week, 100 + 8 Ustd.).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Oberschule 8',
    short: 'Mathematik OS 8',
    description: 'Interaktives Lehrbuch Mathematik für die Oberschule, Klasse 8, Realschulbildungsgang (Sachsen): Terme und Termumformungen, lineare Gleichungen und Formeln, Funktionen, lineare Funktionen und Gleichungssysteme mit Tarifvergleichen, Kreis und Satz des Thales, Kreiszylinder, Ähnlichkeit und zentrische Streckung, Zufallsversuche mit Baumdiagramm, Mathematik im Alltag mit Miete, Strom und Baukosten und das Fahrrad, mit Widgets zum Ausprobieren und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Lernbereich 1', k: '1.1', title: 'Terme und Termumformungen',
          sub: 'Termwerte und Formeln, Zusammenfassen, Klammern auflösen, Ausmultiplizieren und Ausklammern', when: 'August · September', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Lernbereich 1', k: '1.2', title: 'Lineare Gleichungen und Formeln',
          sub: 'Äquivalenzumformungen, keine oder unendlich viele Lösungen, Formeln umstellen, Sachaufgaben', when: 'September', ustd: 8 },
        { file: 'lb2-1.html', lb: 'Lernbereich 2', k: '2.1', title: 'Funktionen',
          sub: 'Eindeutige Zuordnung, Argument und Funktionswert, Definitions- und Wertebereich, proportionale Funktionen', when: 'Oktober', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Lernbereich 2', k: '2.2', title: 'Lineare Funktionen',
          sub: 'y = m · x + n, Steigung und y-Achsenabschnitt, Nullstellen, Gleichung aus Punkten', when: 'November', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Lernbereich 2', k: '2.3', title: 'Lineare Gleichungssysteme',
          sub: 'Zeichnerisch und rechnerisch lösen, Lösbarkeit, Tarif- und Preisvergleiche', when: 'November · Dezember', ustd: 10 },
        { file: 'lb3-1.html', lb: 'Lernbereich 3', k: '3.1', title: 'Der Kreis',
          sub: 'Kreis und Gerade, Satz des Thales, Umfang und Flächeninhalt, die Zahl π, Kreisring', when: 'Dezember · Januar', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Lernbereich 3', k: '3.2', title: 'Der Kreiszylinder',
          sub: 'Netz, Ansichten und Schrägbild, Oberfläche, Volumen und Masse von Kreis- und Hohlzylindern', when: 'Januar', ustd: 6 },
        { file: 'lb4.html', lb: 'Lernbereich 4', k: '4', title: 'Ähnlichkeit',
          sub: 'Zentrische Streckung und Maßstab, Hauptähnlichkeitssatz, Längen, Flächen und Volumen, Kongruenz', when: 'März', ustd: 14 },
        { file: 'lb5.html', lb: 'Lernbereich 5', k: '5', title: 'Zufällige Ereignisse',
          sub: 'Simulieren, Baumdiagramm und Pfadregeln, mit und ohne Zurücklegen, kombinatorisches Zählen', when: 'April', ustd: 14 },
        { file: 'lb6.html', lb: 'Lernbereich 6', k: '6', title: 'Mathematik im Alltag',
          sub: 'Miete und Nebenkosten, Strom- und Wasserabrechnung, Baukosten, Angebote und Zinsen vergleichen', when: 'Mai · Juni', ustd: 12 },
        { file: 'wb.html', lb: 'Wahlpflichtbereich', k: 'W', title: 'Das Fahrrad',
          sub: 'Zoll und Reifengröße, Radumfang, Übersetzung, Trittfrequenz und Geschwindigkeit', when: 'Juni', ustd: 8 }
    ]
};
