/**
 * ULTRA v6.7.0 - Briefing Data Registry
 * 
 * Diese Datei dient als Fallback für Umgebungen ohne Webserver (file://).
 * Sie spiegelt den Inhalt der .txt-Dateien aus resources/explanations/ wider.
 */
window.CyberBriefings = {
    "addition": `LABOR: SCHRIFTLICHE ADDITION (ALGORITHMUS DER SUMMEN)

MATHEMATISCHER HINTERGRUND:
Die schriftliche Addition ist einer der fundamentalen Algorithmen der Arithmetik. Er basiert auf dem Stellenwertsystem (Dezimalsystem). Das Prinzip beruht darauf, Zahlen stellenweise von rechts nach links (Einer, Zehner, Hunderter...) zu addieren. Erreicht eine Teilsumme den Wert 10 oder mehr, entsteht ein "Übertrag" (Carry), der zur nächsthöheren Stelle addiert wird.

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
Der Algorithmus prüft bei jedem Schritt die Summe der Ziffern einer Spalte plus den eventuellen Übertrag aus der vorherigen Spalte. Das Ergebnis (Modulo 10) wird notiert, der neue Übertrag (Division durch 10) wird für den nächsten Schritt gespeichert.`
};
