/**
 * ULTRA v6.7.0 - Briefing Data Registry
 * 
 * Diese Datei dient als Fallback für Umgebungen ohne Webserver (file://).
 * Sie spiegelt den Inhalt der .txt-Dateien aus resources/explanations/ wider.
 */
window.CyberBriefings = {
    "addition": `MATHEMATISCHER HINTERGRUND:
Die schriftliche Addition ist einer der fundamenten Algorithmen der Arithmetik. Er basiert auf dem Stellenwertsystem (Dezimalsystem). Das Prinzip beruht darauf, Zahlen stellenweise von rechts nach links (Einer, Zehner, Hunderter...) zu addieren. Erreicht eine Teilsumme den Wert 10 oder mehr, entsteht ein "Übertrag" (Carry), der zur nächsthöheren Stelle addiert wird.

FEATURES & STEUERUNG:
- Summanden-Eingabe: Nutzer können zwei Summanden mit bis zu 7 Stellen eingeben.
- Algorithmus-Schritte: Über die Navigations-Pfeile (< >) kann der Rechenweg Schritt für Schritt durchlaufen werden.
- Übertrag-Visualisierung: Die kleinen Merkzahlen über den Spalten zeigen den aktiven Übertrag an.
- Farb-Codierung: Aktive Stellenwerte werden hervorgehoben, um den Fokus des Algorithmus zu verdeutlichen.

INTERFACE:
- Eingabefelder (Top): Hier werden die Basis-Zahlen definiert.
- Rechen-Matrix (Center): Die vertikale Anordnung der Summanden und der Ergebniszeile.
- Steuerungs-Konsole (Bottom): Start, Reset und Schritt-Navigation.

FUNKTION:
Der Algorithmus prüft bei jedem Schritt die Summe der Ziffern einer Spalte plus den eventuellen Übertrag aus der vorherigen Spalte. Das Ergebnis (Modulo 10) wird notiert, der neue Übertrag (Division durch 10) wird für den nächsten Schritt gespeichert.`,

    "subtraktion": `MATHEMATISCHER HINTERGRUND:
Die schriftliche Subtraktion berechnet die Differenz zwischen einem Minuenden und einem Subtrahenden. Das Labor nutzt das Abziehverfahren (Entbündelung), bei dem von rechts nach links subtrahiert wird. Ist eine Ziffer des Minuenden kleiner als die des Subtrahenden, wird ein Zehner von der nächsthöheren Stelle "geliehen".

FEATURES & STEUERUNG:
- Ziffern-Eingabe: Präzise Kontrolle über Minuend und Subtrahend (max. 7 Stellen).
- Entbündelungs-Logik: Der "Math Coach" erklärt explizit den Vorgang des "Leihens" und die daraus resultierende Veränderung der Nachbarstellen.
- Prozess-Steuerung: Manuelle Navigation durch die Berechnungsschritte zur Förderung des algorithmischen Verständnisses.
- Ergebnis-Verifikation: Automatische Berechnung und doppelte Unterstreichung des finalen Differenzwertes.

INTERFACE:
Zentrales ULTRA-Design mit adaptiver Skalierung und KaTeX-gestütztem Prozess-Overlay für maximale didaktische Klarheit.`,

    "multiplikation": `MATHEMATISCHER HINTERGRUND:
Die schriftliche Multiplikation zerlegt die Berechnung des Produkts zweier Faktoren in Teilprodukte. Jede Ziffer des zweiten Faktors (Multiplikator) wird mit dem ersten Faktor (Multiplikand) multipliziert, wobei die Ergebnisse stellenrichtig untereinander addiert werden.

FEATURES & STEUERUNG:
- Multi-Digit-Support: Berechnung komplexer Produkte mit bis zu 7-stelligen Faktoren.
- Fein-Modus: Ein detaillierter Modus zeigt jede einzelne Ziffernmultiplikation inklusive der internen Übertragsverwaltung.
- Teilprodukt-Summation: Visualisierung der abschließenden Addition aller Zeilen zur Ermittlung des Gesamtergebnisses.
- Farbkodierung: Jede Zeile der Teilrechnung ist farblich mit der entsprechenden Ziffer des Multiplikators verknüpft (z.B. Gold, Lila, Grün).

INTERFACE:
Prämiertes Cyber-Interface mit einem "Math Coach" in einer schwebenden Glasmorphismus-Box, der die algebraischen Schritte synchron zur Visualisierung erläutert.`,

    "dividieren": `MATHEMATISCHER HINTERGRUND:
Die schriftliche Division ist der komplexeste der vier Grundrechenarten-Algorithmen. Er basiert auf dem wiederholten Schätzen, Multiplizieren, Subtrahieren und "Herunterholen" von Ziffern des Dividenden, um den Quotienten (ggf. mit Rest) zu ermitteln.

FEATURES & STEUERUNG:
- Dividenden-Management: Eingabe von Werten bis zu 7 Stellen; Divisor-Anpassung für verschiedene Schwierigkeitsgrade.
- Rest-Visualisierung: Klare Darstellung von Restwerten am Ende der Berechnung.
- Didaktisches Coaching: Der "Math Coach" führt den Nutzer durch die Fragen "Wie oft passt der Divisor in...?" und die anschließende Probe durch Multiplikation.
- Fehler-Prävention: Visuelle Hinweise bei unmöglichen Rechenschritten oder falscher Stellenplatzierung.

INTERFACE:
Adaptives ULTRA-Layout, das den horizontalen Platzbedarf der Division und den vertikalen Prozessfluss optimal ausnutzt.`
};
