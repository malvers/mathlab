/* kapitel.js — the chapters of the book "Mathematik · Berufliches Gymnasium 13", in the order of the school year
 * (Stoffverteilungsplan svp/mathe/mathe13.html: LB 3 → LB 4 → Wahlpflicht 1 → LB 6 → Abiturvorbereitung; Grundkurs, Abiturjahrgang).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 */
window.BUCH = {
    title: 'Mathematik · Berufliches Gymnasium 13',
    short: 'Mathematik 13',
    description: 'Interaktives Lehrbuch Mathematik für das Berufliche Gymnasium, Klasse 13 (Sachsen): Integralrechnung, beurteilende Statistik mit Signifikanztests, analytische Geometrie der Geraden und Ebenen in 3D, weitere Anwendungen und ein Kapitel zur Abiturvorbereitung, mit Labs, Simulationen und Selbsttests mit sofortiger Rückmeldung.',
    chapters: [
        { file: 'lb3-1.html', lb: 'Lernbereich 3', k: '3.1', title: 'Stammfunktionen',
          sub: 'Rückwärts ableiten, unbestimmtes Integral, Integrationsregeln', when: 'August · September', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Lernbereich 3', k: '3.2', title: 'Das bestimmte Integral',
          sub: 'Rekonstruierter Bestand, Eigenschaften, Hauptsatz', when: 'September', ustd: 8 },
        { file: 'lb3-3.html', lb: 'Lernbereich 3', k: '3.3', title: 'Flächeninhalte',
          sub: 'Zwischen Graph und x-Achse, zwischen zwei Graphen', when: 'Ende September · Oktober', ustd: 8 },
        { file: 'lb3-4.html', lb: 'Lernbereich 3', k: '3.4', title: 'Numerische Integration und Anwendungen',
          sub: 'Rechteck- und Trapezmethode, vermischte Probleme', when: 'Oktober · November', ustd: 8 },
        { file: 'lb4-1.html', lb: 'Lernbereich 4', k: '4.1', title: 'Grundgesamtheit und Stichprobe',
          sub: 'Schätzen und Testen, Stichprobenmittel und -varianz', when: 'November', ustd: 4 },
        { file: 'lb4-2.html', lb: 'Lernbereich 4', k: '4.2', title: 'Signifikanztests',
          sub: 'Hypothesen, Ablehnungsbereich, Fehler 1. und 2. Art', when: 'November · Dezember', ustd: 8 },
        { file: 'wp1-1.html', lb: 'Wahlpflicht 1', k: 'W.1', title: 'Geraden und Ebenen',
          sub: 'Parametergleichungen, Normalenvektor mit dem Vektorprodukt', when: 'Dezember', ustd: 8 },
        { file: 'wp1-2.html', lb: 'Wahlpflicht 1', k: 'W.2', title: 'Koordinatengleichung und Lagebeziehungen',
          sub: 'Punkt, Gerade, Ebene: Lage, Schnittpunkte, Spurpunkte', when: 'Januar', ustd: 8 },
        { file: 'wp1-3.html', lb: 'Wahlpflicht 1', k: 'W.3', title: 'Schnittwinkel, Prismen und Pyramiden',
          sub: 'Winkel zwischen Geraden und Ebenen, Oberflächen und Volumen', when: 'Januar', ustd: 4 },
        { file: 'lb6.html', lb: 'Lernbereich 6', k: '6', title: 'Weitere Anwendungen',
          sub: 'Funktionenscharen, Parameter in Gleichungssystemen, Kosten und Gewinn, Abstände', when: 'Ende Januar · Februar', ustd: 8 },
        { file: 'abi.html', lb: 'Abitur', k: 'A', title: 'Fit fürs Abitur',
          sub: 'Checklisten und Aufgaben im Abiturformat aus allen drei Jahren', when: 'Februar · April', ustd: 0 }
    ]
};
