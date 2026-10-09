/* kapitel.js — the chapters of the book "Mathematik · Gymnasium 10", in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathegy10.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich; 4 Ustd./week).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Gymnasium 10',
    short: 'Mathematik GY 10',
    description: 'Interaktives Lehrbuch Mathematik für das Gymnasium, Klasse 10 (Sachsen): Wachstum und Exponentialfunktionen, periodische Vorgänge und die Sinusfunktion, Zufallsgrößen, Erwartungswert und faire Spiele, Sinus- und Kosinussatz, Logarithmus und Exponentialgleichungen, Tangens, Funktionen im Überblick, Zahlenfolgen und Grenzwerte, Zinsrechnung und komplexe Zahlen, mit Labs, Simulationen und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Lernbereich 1', k: '1.1', title: 'Wachstum und Exponentialfunktionen',
          sub: 'Linear, exponentiell, beschränkt, rekursiv und explizit, Parameter und Regression', when: 'August · September', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Lernbereich 1', k: '1.2', title: 'Periodische Vorgänge und die Sinusfunktion',
          sub: 'Periode, Amplitude, Mittellage, Grad- und Bogenmaß, Parameter der Sinusfunktion', when: 'September · Oktober', ustd: 10 },
        { file: 'lb2-1.html', lb: 'Lernbereich 2', k: '2.1', title: 'Zufallsgrößen und Pfadregeln',
          sub: 'Wahrscheinlichkeitsverteilungen, Stabdiagramm, „genau k“, „mindestens k“, „höchstens k“', when: 'November', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Lernbereich 2', k: '2.2', title: 'Erwartungswert und faire Spiele',
          sub: 'Erwartungswert, Varianz und Standardabweichung, faire und unfaire Spiele', when: 'November', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Lernbereich 3', k: '3.1', title: 'Sinussatz, Kosinussatz und Flächeninhalt',
          sub: 'Allgemeine Dreiecke, der mehrdeutige Fall, Pythagoras als Sonderfall, Flächenformel mit Sinus', when: 'Dezember', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Lernbereich 3', k: '3.2', title: 'Berechnungen an Dreiecken und Körpern',
          sub: 'Lösungsplan, Vermessung, Pyramide und Kegel, realitätsnahe Probleme', when: 'Januar', ustd: 8 },
        { file: 'lb4-1.html', lb: 'Lernbereich 4', k: '4.1', title: 'Umkehrfunktion und Logarithmus',
          sub: 'Umkehrbarkeit, Spiegeln an y = x, der Logarithmus, Logarithmengesetze', when: 'Januar · Februar', ustd: 12 },
        { file: 'lb4-2.html', lb: 'Lernbereich 4', k: '4.2', title: 'Logarithmusfunktionen und Exponentialgleichungen',
          sub: 'Graph und Eigenschaften, Exponentialgleichungen, Verdopplungs- und Halbwertszeit', when: 'März', ustd: 8 },
        { file: 'lb4-3.html', lb: 'Lernbereich 4', k: '4.3', title: 'Verknüpfen, Verketten und die Tangensfunktion',
          sub: 'Summe, Produkt, Quotient, innere und äußere Funktion, Tangens mit Polstellen', when: 'März', ustd: 8 },
        { file: 'lb4-4.html', lb: 'Lernbereich 4', k: '4.4', title: 'Funktionen im Überblick',
          sub: 'Funktionsklassen ordnen, Steckbriefe, Graphen ohne Hilfsmittel skizzieren', when: 'April', ustd: 8 },
        { file: 'lb4-5.html', lb: 'Lernbereich 4', k: '4.5', title: 'Zahlenfolgen und Grenzwerte',
          sub: 'Explizit und rekursiv, Monotonie, Schranken, Grenzwert, Kreis in Parameterform', when: 'April', ustd: 6 },
        { file: 'lb5.html', lb: 'Lernbereich 5', k: '5', title: 'Zinsrechnung',
          sub: 'Zinsen und Zinseszins, Kredit und Tilgungsplan, was ein Kredit wirklich kostet', when: 'Mai', ustd: 4 },
        { file: 'wb.html', lb: 'Wahlbereich', k: 'W', title: 'Komplexe Zahlen',
          sub: 'Imaginäre Einheit, Rechnen in ℂ, Gaußsche Zahlenebene, Betrag und Argument', when: 'Mai · Juni', ustd: 8 }
    ]
};
