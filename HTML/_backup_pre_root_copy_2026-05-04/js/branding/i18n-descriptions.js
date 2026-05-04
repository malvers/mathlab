/**
 * ULTRA v6.7.0 - Internationalized Briefing Data Registry
 *
 * This file holds detailed lab descriptions in multiple languages.
 * Supported languages: DE, EN, ES, FR, IT, PT, SW (Kiswahili), TR — lab descriptions SW/TR initially same as EN
 */
window.CyberBriefings = {
    "de": {
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
Zentrales ULTRA-Design mit adaptiver Skalierung und KaTeX-gestütztem Prozess-Overlay für maximale didaktische Clarity.`,

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
Adaptives ULTRA-Layout, das den horizontalen Platzbedarf der Division und den vertikalen Prozessfluss optimal ausnutzt.`,

        "parabellabor": `MATHEMATISCHER HINTERGRUND:
Das Labor dient der Untersuchung von Parabeln der Form f(x) = a*(x-d)^2 + e (Scheitelpunktform). Es verdeutlicht den Einfluss der Parameter a (Streckung/Stauchung), d (horizontale Verschiebung) und e (vertikale Verschiebung) auf den Graphen.

FEATURES & STEUERUNG:
- Interaktive Handles: Der Scheitelpunkt S(d|e) und der Streckfaktor a können direkt auf dem Canvas per Maus oder Touch manipuliert werden.
- Duale Formelanzeige: Automatische Umrechnung zwischen der Scheitelpunktform und der Normalform (ax^2 + bx + c).
- Nullstellen-Analyse: Automatische Berechnung und Markierung der reellen Nullstellen (x1, x2) auf der x-Achse.
- Adaptive Skalierung: Das Koordinatensystem passt sich dynamisch an extreme Parameterwerte an.

INTERFACE:
Klares ULTRA-Design mit KaTeX-Formeln, die direkt am Scheitelpunkt "kleben" und sich bei jeder Interaktion aktualisieren.`,

        "mandelbrot_deep": `MATHEMATISCHER HINTERGRUND:
Die Mandelbrot-Menge entsteht aus der Iteration z_{n+1} = z_n^2 + c mit z_0 = 0 über komplexen c. Bei Julia-Mengen wird c festgehalten und die Iteration aus variierenden Startpunkten betrachtet. Dieses Labor rendert direkt im WebGL-Fragment-Shader – sehr schnell, mit typischer Gleitkomma-Genauigkeit bei extrem hohem Zoom.

FEATURES & STEUERUNG:
- Modus: Mandelbrot und Julia; Julia-Parameter per Steuerelementen bzw. Cursor- Bezug.
- Zoom & Pan: Mausrad zoomen, Shift für feinere Schritte; Ziehen verschiebt die Ebene.
- Iterationen / Detail: Maximale Iterationszahl (Detail vs. Leistung).
- Flight: START FLIGHT zoomt ein; der Blickmittelpunkt folgt der Maus auf dem Canvas.

INTERFACE:
ULTRA-Sidebar mit Parametern; zentrales WebGL-Canvas.`,

        "pythagoras": `MATHEMATISCHER HINTERGRUND:
Dieses Labor visualisiert den Satz des Pythagoras (a² + b² = c²) für rechtwinklige Dreiecke. Es demonstriert grafisch, dass die Summe der Flächeninhalte der Quadrate über den Katheten (a und b) exakt dem Flächeninhalt des Quadrats über der Hypotenuse (c) entspricht.

FEATURES & STEUERUNG:
- Interaktive Eckpunkte: Verändern der Dreiecksform durch Ziehen der Punkte A und B unter Beibehaltung des rechten Winkels.
- Flächen-Animation: Dynamische Skalierung der Quadrate synchron zur Veränderung der Seitenlängen.
- Live-Berechnung: Kontinuierliche Anzeige der Werte für a², b² und c² zur numerischen Verifikation der Gleichung.

INTERFACE:
Didaktisch fokussiertes ULTRA-Labor mit kontraststarken Flächenfarben und klarer geometrischer Führung.`,

        "eulergerade": `MATHEMATISCHER HINTERGRUND:
In jedem nicht-gleichseitigen Dreieck liegen der Höhenschnittpunkt (H), der Umkreismittelpunkt (U) und der Schwerpunkt (S) auf einer gemeinsamen Geraden – der Eulergeraden. Zudem ist die Strecke HS stets doppelt so lang wie die Strecke SU (Verhältnis 2:1).

FEATURES & STEUERUNG:
- Konstruktions-Elemente: Ein- und Ausschalten von Umkreis, Inkreis und dem Feuerbach-Kreis.
- Hilfslinien-System: Visualisierung der Höhen, Seitenhalbierenden und Winkelhalbierenden.
- Live-Verhältnisanalyse: Das Dashboard berechnet permanent das HS/SU-Verhältnis.

INTERFACE:
Hochpräzises geometrisches Labor im ULTRA-Standard mit farblich differenzierten Punkten und Kreisen.`,

        "pythagorasbeweis": `MATHEMATISCHER HINTERGRUND:
Dieses Modul bietet einen interaktiven, visuellen Beweis für den Satz des Pythagoras durch Zerlegung und Umordnung. Es nutzt das Prinzip der Ergänzungsgleichheit: Vier kongruente rechtwinklige Dreiecke werden innerhalb eines Quadrats umgeordnet.

FEATURES & STEUERUNG:
- Puzzle-Mechanik: Freies Verschieben und Rotieren der blauen Dreiecks-Elemente.
- Echtzeit-Triangulierung: Das System erkennt automatisch die verbleibenden Freiflächen.
- Kollisions-Detektion: Warnung bei Überlappungen zur Sicherung des Beweises.

INTERFACE:
Hochgradig interaktives ULTRA-Labor, das Spielmechanik mit geometrischer Logik verbindet.`,

        "differentiallabor": `MATHEMATISCHER HINTERGRUND:
Dieses Modul visualisiert den Übergang von der Sekante zur Tangente und damit das Konzept der Ableitung f'(x) als lokale Steigung einer Funktion.

FEATURES & STEUERUNG:
- Funktions-Bibliothek: Auswahl verschiedener Basisfunktionen (quadratisch, trigonometrisch etc.).
- Interaktive Tangente: Verschieben des Berührungspunktes zur Beobachtung der Steigung.
- Ableitungs-Graphen: Visualisierung der ersten und zweiten Ableitung.

INTERFACE:
Professionelles ULTRA-Analyse-Interface mit hochauflösenden Funktions-Plots.`,

        "integralreaktor": `MATHEMATISCHER HINTERGRUND:
Der Integralreaktor dient der Berechnung und Visualisierung des bestimmten Integrals einer Funktion f(x). Er interpretiert das Integral als orientierten Flächeninhalt.

FEATURES & STEUERUNG:
- Dynamische Intervallwahl: Anpassung der Grenzen direkt im Koordinatensystem.
- Numerische Integration: Live-Berechnung des Integralwertes.
- Visuelles Feedback: Die berechnete Fläche wird farblich hervorgehoben.

INTERFACE:
Modernes ULTRA-Design mit Fokus auf numerische Präzision und grafische Klarheit.`,

        "steigung": `MATHEMATISCHER HINTERGRUND:
Das Labor visualisiert die Parameter m (Steigung) und n (y-Achsenabschnitt) der Geradengleichung y = mx + n.

FEATURES & STEUERUNG:
- Handle-Interaktion: Verschieben der Punkte zur Veränderung des Anstiegs.
- Steigungsdreieck: Ein neon-blaues Dreieck zeigt Delta-X und Delta-Y.
- Formel-Synchronisation: Die Gleichung wird in Echtzeit mittels KaTeX aktualisiert.

INTERFACE:
Analytisches ULTRA-Interface zur Kopplung von Algebra und Geometrie.`,

        "winkelsumme": `MATHEMATISCHER HINTERGRUND:
Die Summe der Innenwinkel in einem n-Eck folgt der Formel (n-2) * 180°. Dieses Labor erlaubt die Verifikation dieses Gesetzes für verschiedene Figuren.

FEATURES & STEUERUNG:
- Polygon-Konfiguration: Umschalten zwischen Dreieck, Viereck, Fünfeck etc.
- Interaktive Eckpunkte: Freies Verschieben der Ecken zur Überprüfung der Invarianz.
- Winkel-Visualisierung: Farbige Bogen-Markierungen an den Innenecken.

INTERFACE:
Klares ULTRA-Design mit neonfarbenen Winkelsegmenten und Live-Summen-Anzeige.`,

        "winkelsumme3d": `MATHEMATISCHER HINTERGRUND:
Dieses Modul demonstriert durch ein virtuelles Falt-Experiment, wie die drei Ecken eines Dreiecks an einem Punkt zusammentreffen und 180° bilden.

FEATURES & STEUERUNG:
- Interaktive Faltung: Stufenlose Steuerung des Faltvorgangs.
- 3D-Navigation: Freies Rotieren und Zoomen im Raum mittels Three.js.
- Dynamische Geometrie: Veränderung der Dreiecksform während der Faltung.

INTERFACE:
Hochmodernes 3D-ULTRA-Design mit transparenten Materialeffekten.`,

        "beweisinwinkellsumme": `MATHEMATISCHER HINTERGRUND:
Dieser Beweis nutzt Parallelen und Wechselwinkel (Z-Winkel), um die Winkelsumme von 180° im Dreieck herzuleiten.

FEATURES & STEUERUNG:
- Parallelprojektion: Automatische Konstruktion einer Parallelen durch einen Eckpunkt.
- Wechselwinkel-Check: Farbliche Übereinstimmung der Winkel am Pivot-Punkt.
- Live-Synchronisation: Zwei parallele Rechnungen zeigen die Übereinstimmung.

INTERFACE:
Didaktisch optimiertes ULTRA-Labor mit KaTeX-gestützter Beweisführung.`,

        "fermatpunkt": `MATHEMATISCHER HINTERGRUND:
Der Fermat-Punkt ist der Punkt im Dreieck, für den die Summe der Abstände zu den drei Eckpunkten minimal ist.

FEATURES & STEUERUNG:
- Geometrischer Beweis: Visualisierung der Konstruktion über gleichseitige Dreiecke.
- Distanz-Analyse: Ein freier Vergleichspunkt P zeigt die Differenz zum Minimum.
- Dynamische Eckpunkte: Sofortige Neuberechnung bei Formveränderung.

INTERFACE:
Cyber-Interface mit lila hervorgehobenem Fermat-Punkt und Distanz-HUD.`,

        "winkellabor": `MATHEMATISCHER HINTERGRUND:
Untersuchung von Winkeln an geschnittenen Parallelen: Scheitel-, Neben-, Stufen- und Wechselwinkel.

FEATURES & STEUERUNG:
- Interaktive Geometrie: Veränderung von Schnittwinkel und Parallelen-Abstand.
- Winkel-Identifikation: Farbliche Kennzeichnung gleicher Winkelpaare.
- Summen-Validierung: Anzeige der Supplementär-Beziehung (180°).

INTERFACE:
Übersichtliches ULTRA-Labor für die Basiskonzepte der Ebenengeometrie.`,

        "gleichschenkligesdreieck": `MATHEMATISCHER HINTERGRUND:
Untersuchung eines Dreiecks mit festem Umfang (u = 8 cm) und der Bedingung der Gleichschenkligkeit.

FEATURES & STEUERUNG:
- Basis-Slider: Veränderung der Basis b mit sofortiger Geometrie-Anpassung.
- Existenz-Check: Prüfung der Dreiecksungleichung mit visueller Warnung.
- Duale Darstellung: Kombination aus Modell und analytischem Graphen.

INTERFACE:
Minimalistisches ULTRA-Labor mit Fokus auf die Kopplung von Algebra und Geometrie.`,

        "potenzlabor": `MATHEMATISCHER HINTERGRUND:
Untersuchung von Potenzfunktionen f(x) = x^n und deren Umkehrfunktionen (Wurzelfunktionen).

FEATURES & STEUERUNG:
- Exponenten-Tuning: Stufenlose Anpassung von n zur Beobachtung des Wachstums.
- Punkt-Telemetrie: Interaktiver Cursor zeigt exakte (x, y) Koordinaten.
- Symmetrie-Check: Parallele Darstellung von Funktion und Umkehrfunktion.

INTERFACE:
Analytisches ULTRA-Interface mit Fokus auf den Vergleich von Funktionsklassen.`,

        "transformationen": `MATHEMATISCHER HINTERGRUND:
Untersuchung von Abbildungen (Translation, Rotation, Spiegelung, Skalierung) auf geometrische Objekte.

FEATURES & STEUERUNG:
- Multi-Abbildungs-System: Kombination verschiedener Transformationen.
- Spiegelungs-Modus: Interaktive Achsen- und Punktspiegelung.
- Flächen-Invarianz: Echtzeit-Check der Flächenerhaltung bei Kongruenz.

INTERFACE:
Interaktives ULTRA-Labor für die Untersuchung fundamentaler Abbildungsgeometrie.`,

        "gleichungssysteme": `MATHEMATISCHER HINTERGRUND:
Grafische Lösung linearer Gleichungssysteme (LGS) als Schnittpunktproblem zweier Geraden.

FEATURES & STEUERUNG:
- Geraden-Manipulation: Veränderung der Gleichungen durch Ziehen der Punkte.
- Notations-Scrambler: Umschalten zwischen Normalform, skaliert und implizit.
- Aufgaben-Generator: Erstellung neuer Szenarien mit ganzzahligen Lösungen.

INTERFACE:
Hochfunktionales ULTRA-Design mit Fokus auf die algebraische Entsprechung der Geometrie.`,

        "binomischeslabor": `MATHEMATISCHER HINTERGRUND:
Visualisierung der ersten binomischen Formel (a + b)² als geometrische Flächenzerlegung.

FEATURES & STEUERUNG:
- Dynamische Skalierung: Veränderung von a und b direkt am Modell.
- Flächen-Analytik: Echtzeit-Berechnung der Teilflächen (a², b², 2ab).
- KaTeX-Sync: Dynamische Aktualisierung der mathematischen Formel.

INTERFACE:
Klares ULTRA-Design mit Fokus auf die duale Repräsentation von Algebra und Geometrie.`,

        "coordinatensystemtester": `MATHEMATISCHER HINTERGRUND:
Entwicklungs- und Diagnosewerkzeug für die CyberCanvas-Engine zur Prüfung von Projektionen.

FEATURES & STEUERUNG:
- Stress-Test: Pan und Zoom im laufenden Betrieb.
- Funktions-Overlays: Test steiler und asymptotischer Funktionsbereiche.
- Integrität: Validierung der KaTeX-Achsenbeschriftung.

INTERFACE:
ULTRA-Sidebar mit Projektions-Checkboxen und CyberCanvas-Standardraster.`,

        "galtonboard": `MATHEMATISCHER HINTERGRUND:
Visualisierung der Normalverteilung (Glockenkurve) durch einen stochastischen Galton-Prozess.

FEATURES & STEUERUNG:
- Physikalische Simulation: Echtzeit-Berechnung der Kugel-Kollisionen.
- Histogramm-Akkumulation: Statistische Erfassung der Trefferwahrscheinlichkeit.
- Glockenkurven-Overlay: Vergleich von Theorie und Simulation.

INTERFACE:
Dynamisches ULTRA-Interface mit flüssigen physikalischen Animationen.`,

        "fourier": `MATHEMATISCHER HINTERGRUND:
Demonstration der Fourier-Analyse: Jede periodische Funktion als Summe von Sinus-Schwingungen.

FEATURES & STEUERUNG:
- Epizyklen-Visualisierung: Rotierende Vektoren zeichnen komplexe Kurven.
- Approximations-Grad: Anpassung der Anzahl der Oberschwingungen n.
- Pfad-Tracking: Aufzeichnung der Rekonstruktion in Echtzeit.

INTERFACE:
Hochkomplexes ULTRA-Design mit Fokus auf die Ästhetik von Schwingungsprozessen.`,

        "lissajous": `MATHEMATISCHER HINTERGRUND:
Überlagerung zweier harmonischer Schwingungen in x- und y-Richtung erzeugt Lissajous-Figuren.

FEATURES & STEUERUNG:
- Frequenz-Manipulation: Unabhängige Steuerung der Achsen-Frequenzen.
- Phasen-Shift: Untersuchung des Einflusses der zeitlichen Verschiebung.
- 3D-Pendel: Physikalische Analogie als räumliche Schwingung.

INTERFACE:
Ästhetisches ULTRA-Design mit leuchtenden Trajektorien und Frequenz-Analyse.`,

        "fibonacci": `MATHEMATISCHER HINTERGRUND:
Visualisierung der Fibonacci-Folge und der daraus resultierenden logarithmischen Spirale.

FEATURES & STEUERUNG:
- Iterations-Steuerung: Beobachtung des Wachstums der Fibonacci-Quadrate.
- Spiral-Konstruktion: Ein- und Ausschalten der geometrischen Spirale.
- Goldener Schnitt: Veranschaulichung der Konvergenz der Glieder-Verhältnisse.

INTERFACE:
Elegantes ULTRA-Design mit Fokus auf geometrische Proportionen.`,

        "ausgleichsgerade": `MATHEMATISCHER HINTERGRUND:
Lineare Regression nach der Methode der kleinsten Quadrate zur Bestimmung von Trends.

FEATURES & STEUERUNG:
- Interaktive Punktwolke: Manuelles Setzen von Datenpunkten.
- Korrelations-Dashboard: Live-Berechnung von r, m und n.
- Fehler-Visualisierung: Anzeige der Standardabweichung als Korridor.

INTERFACE:
Hochpräzises Statistik-Tool im ULTRA-Standard mit Echtzeit-Telemetrie.`,

        "logikspiel": `MATHEMATISCHER HINTERGRUND:
Grundlagen der binären Logik: Visualisierung von Gattern wie AND, OR, XOR und NOT.

FEATURES & STEUERUNG:
- Interaktive Eingänge: Umschalten der Input-Zustände per Klick.
- Signalfluss: Leuchtende Verbindungen zeigen den Datenfluss.
- Wahrheitstabellen: Live-Abgleich mit der logischen Definition.

INTERFACE:
Futuristisches Schaltungs-Design im ULTRA-Standard mit klarer Signal-Hervorhebung.`,

        "logikspiel2": `MATHEMATISCHER HINTERGRUND:
Magisches Quadrat / Zielwert-Rätsel: Logische Belegung von Zellen basierend auf Rand-Summen.

FEATURES & STEUERUNG:
- Rechen-Modi: Umschalten zwischen Addition und Multiplikation.
- Rand-Validierung: Visuelles Feedback bei korrekten Teil-Lösungen.
- Hilfe-System: Erarbeitung von Hinweisen durch kleine Mathe-Aufgaben.

INTERFACE:
ULTRA-Sidebar mit Zügen- und Zeiterfassung sowie Level-Auswahl.`,

        "heart3d": `MATHEMATISCHER HINTERGRUND:
Visualisierung der Taubin-Herz-Gleichung mittels GPU-basiertem Raymarching (SDF).

FEATURES & STEUERUNG:
- Deformation: Manipulation der Parameter A und B für Formvarianz.
- Holografisches Rendering: Hochperformante Shader-Berechnung.
- Dynamische Formel: Live-Einblendung der algebraischen Gleichung.

INTERFACE:
Futuristisches ULTRA-Design mit Symbiose aus Algebra und 3D-Grafik.`,

        "butterfly": `MATHEMATISCHER HINTERGRUND:
Visualisierung des Butterfly-Effekts anhand des Lorenz-Attraktors (Chaos-Theorie).

FEATURES & STEUERUNG:
- Dynamik-Simulation: Echtzeit-Integration der Lorenz-Gleichungen.
- Parameter-Tuning: Anpassung der Koeffizienten für verschiedene Attraktoren.
- Glow-Engine: Trajektorien als leuchtende Energieströme im Raum.

INTERFACE:
Cinematisches ULTRA-Design mit schwebendem KaTeX-Differentialgleichungs-Panel.`,

        "litchi3d": `MATHEMATISCHER HINTERGRUND:
Erzeugung organischer Strukturen durch Sine-Wellen-Modulation eines Signed Distance Fields.

FEATURES & STEUERUNG:
- Reife-Simulation: Dynamische Pigment-Verschiebung im Shader.
- Stachel-Morphologie: Kontrolle über die prozeduralen Oberflächen-Erhebungen.
- SDF-Gleichung: Live-Einblendung der Distanzfunktion d(p).

INTERFACE:
Organisch inspiriertes ULTRA-Design unter Nutzung von Raymarching.`,

        "triangulierer": `MATHEMATISCHER HINTERGRUND:
Flächenzerlegung in Dreiecke nach dem Delaunay-Algorithmus zur Netz-Erzeugung.

FEATURES & STEUERUNG:
- Echtzeit-Triangulierung: Sofortige Neuberechnung bei Punkt-Verschiebung.
- Flächen-HUD: Detaillierte Bilanzierung der Einzel- und Gesamtflächen.
- Mehrfach-Selektion: Gruppierung von Messpunkten für Struktur-Checks.

INTERFACE:
Technisches Analyse-UI im ULTRA-Standard mit Fokus auf Präzision.`,

        "uhrzeitwinkel": `MATHEMATISCHER HINTERGRUND:
Berechnung des Bogenwinkels zwischen Stunden- und Minutenzeiger basierend auf deren Geschwindigkeit.

FEATURES & STEUERUNG:
- Präzisions-Einstellung: Stufenlose Justierung der Zeit per Slider.
- Dual-Winkel-Analyse: Anzeige von Innen- (Alpha) und Außenwinkel (Beta).
- Digitale Synchronisation: Abgleich von analoger und digitaler Zeit.

INTERFACE:
Stilisiertes Cyber-Clock-Design mit Fokus auf mathematische Zeitintervall-Interpretation.`,

        "universe": `MATHEMATISCHER HINTERGRUND:
Visualisierung des ULTRA-Ökosystems als dynamische Galaxie mittels Raycasting-Logik.

FEATURES & STEUERUNG:
- Lab-Matrix: Module fliegen aus dem Zentrum auf den Betrachter zu.
- Interaktive Exploration: Fokussierung und Start der Labore per Klick.
- Tiefen-Projektion: Skalierung basierend auf der virtuellen Z-Koordinate.

INTERFACE:
Cinematisches ULTRA-Interface als zentraler navigatorischer Hub der Suite.`,

        "easyhard": `ÜBERSICHT:
Modul „easy/hard“ – gestufte Aufgaben oder Schwierigkeitsgrade für gezieltes Training.

FEATURES & STEUERUNG:
- Schwierigkeitswahl: Umschalten zwischen Basis- und Expertenmodus.
- Aufgaben-Matrix: Strukturierte Präsentation didaktischer Einheiten.
- Hilfe-System: Schneller Zugriff auf Kurzinformationen über das Navigations-Icon.

INTERFACE:
ULTRA-Labor-Layout mit zentraler Branding-Navigation und Fokus auf Usability.`
    },
    "en": {
        "addition": `MATHEMATICAL BACKGROUND:
Written addition is one of the fundamental algorithms of arithmetic. It is based on the place value system (decimal system). The principle is based on adding numbers digit by digit from right to left.

FEATURES & CONTROLS:
- Summand Input: Users can enter two summands with up to 7 digits.
- Algorithm Steps: Navigation arrows (< >) allow a step-by-step walkthrough.
- Carry Visualization: Small numbers above columns show the active carry.

INTERFACE:
- Input Fields (Top): Define base numbers.
- Calculation Matrix (Center): Vertical arrangement.
- Control Console (Bottom): Start, Reset, and step navigation.`,

        "subtraktion": `MATHEMATICAL BACKGROUND:
Written subtraction calculates the difference between a minuend and a subtrahend using the unbundling method.

FEATURES & CONTROLS:
- Digit Input: Precise control over minuend and subtrahend (max. 7 digits).
- Unbundling Logic: Math Coach explains the process of "borrowing".
- Process Control: Manual navigation through steps.

INTERFACE:
Central ULTRA design with adaptive scaling and KaTeX-based process overlay.`,

        "multiplikation": `MATHEMATICAL BACKGROUND:
Written multiplication breaks down the product calculation into partial products, which are added together digit-correctly.

FEATURES & CONTROLS:
- Multi-Digit Support: Complex products with up to 7-digit factors.
- Fine Mode: Shows every single digit multiplication and carry.
- Partial Product Summation: Final addition of all lines for the total result.

INTERFACE:
Award-winning Cyber Interface with a "Math Coach" box explaining algebraic steps.`,

        "dividieren": `MATHEMATICAL BACKGROUND:
Written division is based on repeated estimating, multiplying, subtracting, and "bringing down" digits to determine the quotient.

FEATURES & CONTROLS:
- Dividend Management: Values up to 7 digits; adjustable difficulty.
- Remainder Visualization: Clear representation of remainders.
- Didactic Coaching: Guides through "How many times does the divisor fit?".

INTERFACE:
Adaptive ULTRA layout utilizing horizontal space for division flow.`,

        "parabellabor": `MATHEMATICAL BACKGROUND:
Investigate parabolas of the form f(x) = a*(x-d)^2 + e. Shows the influence of parameters a, d, and e on the graph.

FEATURES & CONTROLS:
- Interactive Handles: Manipulate vertex S(d|e) and stretch factor a directly.
- Dual Formula Display: Automatic conversion between vertex and standard form.
- Root Analysis: Automatic calculation of real roots.

INTERFACE:
Clear ULTRA design with KaTeX formulas "sticking" to the vertex.`,

        "mandelbrot_deep": `MATHEMATICAL BACKGROUND:
The Mandelbrot set arises from iterating z_{n+1} = z_n^2 + c. This lab renders directly in WebGL fragment shader for high-speed extreme zoom.

FEATURES & CONTROLS:
- Mode: Mandelbrot and Julia; parameters via controls or cursor.
- Zoom & Pan: Mouse wheel zoom, drag to shift plane.
- Flight: START FLIGHT zooms in; center of view follows mouse.

INTERFACE:
ULTRA sidebar with parameters; central WebGL canvas.`,

        "pythagoras": `MATHEMATICAL BACKGROUND:
Visualizes the Pythagorean theorem (a² + b² = c²) for right-angled triangles. Sum of leg squares equals hypotenuse square.

FEATURES & CONTROLS:
- Interactive Vertices: Drag points A and B while maintaining the right angle.
- Area Animation: Dynamic scaling of squares syncs with side lengths.
- Live Calculation: Continuous verification of the equation.

INTERFACE:
Didactically focused ULTRA lab with high-contrast colors.`,

        "eulergerade": `MATHEMATICAL BACKGROUND:
In non-equilateral triangles, orthocenter (H), circumcenter (U), and centroid (S) lie on the Euler line. Ratio HS:SU is always 2:1.

FEATURES & CONTROLS:
- Construction: Toggle circumcircle, incircle, and Feuerbach circle.
- Helper System: Visualization of altitudes, medians, and bisectors.
- Live Analysis: Permanently calculates the HS/SU ratio.

INTERFACE:
High-precision geometric lab in ULTRA standard with color-differentiated points.`,

        "pythagorasbeweis": `MATHEMATICAL BACKGROUND:
Interactive visual proof of the Pythagorean theorem through decomposition and rearrangement of four congruent triangles.

FEATURES & CONTROLS:
- Puzzle Mechanics: Free moving and rotating of triangle elements.
- Real-time Triangulation: Automatically detects remaining free areas.
- Collision Detection: Ensures proof integrity through overlap warnings.

INTERFACE:
Highly interactive ULTRA lab combining game mechanics with geometric logic.`,

        "differentiallabor": `MATHEMATICAL BACKGROUND:
This module visualizes the transition from secant to tangent and the derivative f'(x) as the local slope of a function.

FEATURES & CONTROLS:
- Function library: Selection of various base functions (quadratic, trigonometric, etc.).
- Interactive tangent: Move the point of tangency to observe the slope.
- Derivative graphs: Visualization of the first and second derivatives.

INTERFACE:
Professional ULTRA analysis interface with high-resolution function plots.`,

        "integralreaktor": `MATHEMATICAL BACKGROUND:
The integral reactor computes and visualizes the definite integral of a function f(x), interpreted as signed area.

FEATURES & CONTROLS:
- Dynamic interval selection: Adjust bounds directly in the coordinate system.
- Numerical integration: Live computation of the integral value.
- Visual feedback: The computed area is highlighted.

INTERFACE:
Modern ULTRA design focused on numerical precision and graphical clarity.`,

        "steigung": `MATHEMATICAL BACKGROUND:
The lab visualizes the slope m and y-intercept n in the line equation y = mx + n.

FEATURES & CONTROLS:
- Handle interaction: Drag points to change the slope.
- Slope triangle: A neon-blue triangle shows Δx and Δy.
- Formula synchronization: The equation updates in real time via KaTeX.

INTERFACE:
Analytical ULTRA interface coupling algebra and geometry.`,

        "winkelsumme": `MATHEMATICAL BACKGROUND:
The sum of interior angles in an n-gon follows the formula (n-2) * 180°. Verify this law for various figures.

FEATURES & CONTROLS:
- Configuration: Toggle between triangle, quad, pentagon, etc.
- Interactive Vertices: Drag corners to check invariance of the sum.
- Angle Visualization: Colored arc markings at interior corners.

INTERFACE:
Clear ULTRA design with neon angle segments and live sum display.`,

        "winkelsumme3d": `MATHEMATICAL BACKGROUND:
Demonstrates through a virtual folding experiment how three triangle corners meet at one point to form 180°.

FEATURES & CONTROLS:
- Interactive Folding: Smooth control of the folding process.
- 3D Navigation: Free rotation and zooming using Three.js.
- Dynamic Geometry: Change triangle shape during folding.

INTERFACE:
Modern 3D ULTRA design with transparent material effects.`,

        "beweisinwinkellsumme": `MATHEMATICAL BACKGROUND:
This proof uses parallels and alternate angles (Z-angles) to derive the 180° angle sum in a triangle.

FEATURES & CONTROLS:
- Parallel Projection: Automatic construction of a parallel through a vertex.
- Alternate Angle Check: Color correspondence of angles at the pivot point.
- Live Sync: Parallel calculations show the matching sums.

INTERFACE:
Didactically optimized ULTRA lab with KaTeX-supported proof guidance.`,

        "fermatpunkt": `MATHEMATICAL BACKGROUND:
The Fermat point is the point in a triangle where the sum of distances to the three vertices is minimal.

FEATURES & CONTROLS:
- Geometric Proof: Visualization of construction via equilateral triangles.
- Distance Analysis: Comparison point P shows deviation from the minimum.
- Dynamic Vertices: Immediate recalculation on shape change.

INTERFACE:
Cyber Interface with purple highlighted Fermat point and distance HUD.`,

        "winkellabor": `MATHEMATICAL BACKGROUND:
Study of angles at intersected parallels: vertically opposite, supplementary, corresponding, and alternate angles.

FEATURES & CONTROLS:
- Interactive Geometry: Change intersection angle and parallel distance.
- Angle Identification: Color coding of matching angle pairs.
- Sum Validation: Display of supplementary relationship (180°).

INTERFACE:
Clear ULTRA lab for basic plane geometry concepts.`,

        "gleichschenkligesdreieck": `MATHEMATICAL BACKGROUND:
Study of a triangle with fixed perimeter (u = 8 cm) under isosceles conditions.

FEATURES & CONTROLS:
- Base Slider: Change base b with immediate geometry adjustment.
- Existence Check: Triangle inequality check with visual warning.
- Dual View: Combination of model and analytical graph.

INTERFACE:
Minimalist ULTRA lab focused on coupling algebra and geometry.`,

        "potenzlabor": `MATHEMATICAL BACKGROUND:
Investigation of power functions f(x) = x^n and their inverse functions (root functions).

FEATURES & CONTROLS:
- Exponent Tuning: Smooth adjustment of n to observe growth behavior.
- Point Telemetry: Interactive cursor shows exact (x, y) coordinates.
- Symmetry Check: Parallel display of function and its inverse.

INTERFACE:
Analytical ULTRA interface focused on comparing function classes.`,

        "transformationen": `MATHEMATICAL BACKGROUND:
Study of mappings (translation, rotation, reflection, scaling) on geometric objects.

FEATURES & CONTROLS:
- Multi-Mapping System: Combination of various transformations.
- Reflection Mode: Interactive axis and point reflection.
- Area Invariance: Real-time check of area conservation in congruency.

INTERFACE:
Interactive ULTRA lab for investigating fundamental mapping geometry.`,

        "gleichungssysteme": `MATHEMATICAL BACKGROUND:
Graphical solution of linear equation systems (LGS) as an intersection problem of two lines.

FEATURES & CONTROLS:
- Line Manipulation: Change equations by dragging points.
- Notation Scrambler: Toggle between standard form, scaled, and implicit.
- Task Generator: Create new scenarios with integer solutions.

INTERFACE:
Highly functional ULTRA design focused on the algebraic equivalent of geometry.`,

        "binomischeslabor": `MATHEMATICAL BACKGROUND:
Visualization of the first binomial formula (a + b)² as a geometric area decomposition.

FEATURES & CONTROLS:
- Dynamic Scaling: Change parameters a and b directly on the model.
- Area Analytics: Real-time calculation of sub-areas (a², b², 2ab).
- KaTeX Sync: Dynamic update of the mathematical formula.

INTERFACE:
Clear ULTRA design focused on the dual representation of algebra and geometry.`,

        "coordinatensystemtester": `MATHEMATICAL BACKGROUND:
Development and diagnostic tool for the CyberCanvas engine to test projections.

FEATURES & CONTROLS:
- Stress Test: Pan and zoom during operation.
- Function Overlays: Test steep and asymptotic function areas.
- Integrity: Validation of KaTeX axis labeling.

INTERFACE:
ULTRA sidebar with projection checkboxes and CyberCanvas standard grid.`,

        "galtonboard": `MATHEMATICAL BACKGROUND:
Visualization of the normal distribution (bell curve) through a stochastic Galton process.

FEATURES & CONTROLS:
- Physics Simulation: Real-time calculation of ball collisions.
- Histogram Accumulation: Statistical capture of hit probabilities.
- Bell Curve Overlay: Comparison of theory and simulation.

INTERFACE:
Dynamic ULTRA interface with smooth physical animations.`,

        "fourier": `MATHEMATICAL BACKGROUND:
Demonstration of Fourier analysis: Any periodic function as a sum of sine waves.

FEATURES & CONTROLS:
- Epicycle Visualization: Rotating vectors draw complex curves.
- Approximation Grade: Adjustment of the number of harmonics n.
- Path Tracking: Real-time recording of reconstruction.

INTERFACE:
Highly complex ULTRA design focused on the aesthetics of oscillatory processes.`,

        "lissajous": `MATHEMATICAL BACKGROUND:
Superposition of two harmonic oscillations in x and y directions creates Lissajous figures.

FEATURES & CONTROLS:
- Frequency Manipulation: Independent control of axis frequencies.
- Phase Shift: Investigation of temporal shift influence.
- 3D Pendulum: Physical analogy as spatial oscillation.

INTERFACE:
Aesthetically demanding ULTRA design with glowing trajectories and frequency analysis.`,

        "fibonacci": `MATHEMATICAL BACKGROUND:
Visualization of the Fibonacci sequence and the resulting logarithmic spiral.

FEATURES & CONTROLS:
- Iteration Control: Observe growth of Fibonacci squares.
- Spiral Construction: Toggle the geometric spiral.
- Golden Ratio: Illustrate convergence of term ratios.

INTERFACE:
Elegant ULTRA design focused on geometric proportions.`,

        "ausgleichsgerade": `MATHEMATICAL BACKGROUND:
Linear regression using the least squares method to determine trends in data.

FEATURES & CONTROLS:
- Interactive Point Cloud: Manually place data points.
- Correlation Dashboard: Live calculation of r, m, and n.
- Error Visualization: Display of standard deviation as a corridor.

INTERFACE:
High-precision statistics tool in ULTRA standard with real-time telemetry.`,

        "logikspiel": `MATHEMATICAL BACKGROUND:
Fundamentals of binary logic: Visualization of gates like AND, OR, XOR, and NOT.

FEATURES & CONTROLS:
- Interactive Inputs: Toggle input states per click.
- Signal Flow: Glowing connections show data flow.
- Truth Tables: Live comparison with logical definitions.

INTERFACE:
Futuristic circuit design in ULTRA standard with clear signal highlighting.`,

        "logikspiel2": `MATHEMATICAL BACKGROUND:
Magic Square / Target Value Puzzle: Logical cell assignment based on border sums.

FEATURES & CONTROLS:
- Calculation Modes: Toggle between addition and multiplication.
- Border Validation: Visual feedback for correct partial solutions.
- Help System: Develop hints through small math tasks.

INTERFACE:
ULTRA sidebar with move and time tracking plus level selection.`,

        "heart3d": `MATHEMATICAL BACKGROUND:
Visualization of the Taubin heart equation using GPU-based raymarching (SDF).

FEATURES & CONTROLS:
- Deformation: Manipulate parameters A and B for shape variance.
- Holographic Rendering: High-performance shader calculation.
- Dynamic Formula: Live display of the algebraic equation.

INTERFACE:
Futuristic ULTRA design with symbiosis of algebra and 3D graphics.`,

        "butterfly": `MATHEMATICAL BACKGROUND:
Visualization of the butterfly effect via the Lorenz attractor (chaos theory).

FEATURES & CONTROLS:
- Dynamics Simulation: Real-time integration of Lorenz equations.
- Parameter Tuning: Adjust coefficients for different attractors.
- Glow Engine: Trajectories as glowing energy flows in space.

INTERFACE:
Cinematic ULTRA design with floating KaTeX differential equation panel.`,

        "litchi3d": `MATHEMATICAL BACKGROUND:
Generation of organic structures through sine-wave modulation of a Signed Distance Field.

FEATURES & CONTROLS:
- Ripeness Simulation: Dynamic pigment shift in the shader.
- Spike Morphology: Control over procedural surface bumps.
- SDF Equation: Live display of distance function d(p).

INTERFACE:
Organically inspired ULTRA design using raymarching.`,

        "triangulierer": `MATHEMATICAL BACKGROUND:
Area decomposition into triangles using the Delaunay algorithm for mesh generation.

FEATURES & CONTROLS:
- Real-time Triangulation: Immediate recalculation on point move.
- Area HUD: Detailed balance of individual and total areas.
- Multi-Selection: Grouping of points for structural checks.

INTERFACE:
Technical analysis UI in ULTRA standard focused on precision.`,

        "uhrzeitwinkel": `MATHEMATICAL BACKGROUND:
Calculation of the arc angle between hour and minute hands based on their speed.

FEATURES & CONTROLS:
- Precision Setting: Smooth adjustment of time via slider.
- Dual Angle Analysis: Display of interior (Alpha) and exterior (Beta) angles.
- Digital Sync: Matching analog and digital time.

INTERFACE:
Stylized Cyber Clock design focused on mathematical time interval interpretation.`,

        "universe": `MATHEMATICAL BACKGROUND:
Visualization of the ULTRA ecosystem as a dynamic galaxy using raycasting logic.

FEATURES & CONTROLS:
- Lab Matrix: Modules fly from the center towards the viewer.
- Interactive Exploration: Focus and start labs via click.
- Depth Projection: Scaling based on virtual Z-coordinate.

INTERFACE:
Cinematic ULTRA interface as the central navigation hub of the suite.`,

        "easyhard": `OVERVIEW:
Module "easy/hard" – tiered tasks or difficulty levels for targeted training.

FEATURES & CONTROLS:
- Difficulty Choice: Toggle between basic and expert mode.
- Task Matrix: Structured presentation of didactic units.
- Help System: Quick access to info via navigation icon.

INTERFACE:
ULTRA lab layout with central branding navigation and focus on usability.`
    },
    "es": {
        "addition": `ANTECEDENTES MATEMÁTICOS:
La suma escrita es uno de los algoritmos fundamentales de la aritmética. Se basa en el sistema decimal sumando números posición por posición de derecha a izquierda.

CARACTERÍSTICAS Y CONTROLES:
- Entrada de sumandos: Hasta 7 dígitos.
- Pasos del algoritmo: Navegación (< >) paso a paso.
- Acarreo visual: Los pequeños números muestran el acarreo activo.

INTERFAZ:
- Campos (Arriba): Definir números base.
- Matriz (Centro): Disposición vertical.
- Consola (Abajo): Inicio, Reset y navegación.`,

        "subtraktion": `ANTECEDENTES MATEMÁTICOS:
La resta escrita calcula la diferencia entre un minuendo y un sustraendo utilizando el método de desagrupación.

CARACTERÍSTICAS Y CONTROLES:
- Entrada de cifras: Control preciso (máx. 7 dígitos).
- Lógica de desagrupación: El Math Coach explica el proceso de "pedir prestado".
- Control de proceso: Navegación manual.

INTERFAZ:
Diseño ULTRA con escalado adaptativo y superposición KaTeX.`,

        "multiplikation": `ANTECEDENTES MATEMÁTICOS:
La multiplicación escrita desglosa el cálculo en productos parciales que se suman correctamente.

CARACTERÍSTICAS Y CONTROLES:
- Multi-dígito: Factores de hasta 7 dígitos.
- Modo detallado: Muestra cada multiplicación y acarreo.
- Suma parcial: Adición final de todas las líneas.

INTERFAZ:
Interfaz Cyber con un "Math Coach" que explica los pasos algebraicos.`,

        "dividieren": `ANTECEDENTES MATEMÁTICOS:
La división escrita se basa en estimar, multiplicar, restar y "bajar" cifras repetidamente para hallar el cociente.

CARACTERÍSTICAS Y CONTROLES:
- Gestión del dividendo: Valores hasta 7 dígitos.
- Visualización del resto: Representación clara de residuos.
- Coaching didáctico: Guía sobre "¿Cuántas veces cabe el divisor?".

INTERFAZ:
Layout ULTRA adaptativo que utiliza el espacio horizontal para el flujo.`,

        "parabellabor": `ANTECEDENTES MATEMÁTICOS:
Investigación de parábolas f(x) = a*(x-d)^2 + e. Muestra la influencia de a, d y e.

CARACTERÍSTICAS Y CONTROLES:
- Tiradores interactivos: Manipula el vértice S(d|e) y el factor a directamente.
- Doble fórmula: Conversión automática entre forma de vértice y estándar.
- Análisis de raíces: Cálculo automático de ceros reales.

INTERFAZ:
Diseño ULTRA con fórmulas KaTeX que "siguen" al vértice.`,

        "mandelbrot_deep": `ANTECEDENTES MATEMÁTICOS:
Conjunto de Mandelbrot mediante iteración z_{n+1} = z_n^2 + c. Renderizado WebGL rápido.

CARACTERÍSTICAS Y CONTROLES:
- Modo: Mandelbrot y Julia; parámetros vía controles.
- Zoom y Pan: Rueda del ratón y arrastre.
- Vuelo: START FLIGHT activa el zoom interactivo.

INTERFAZ:
Barra lateral ULTRA; lienzo WebGL central.`,

        "pythagoras": `ANTECEDENTES MATEMÁTICOS:
Visualiza a² + b² = c² para triángulos rectángulos. La suma de cuadrados de catetos iguala a la hipotenusa.

CARACTERÍSTICAS Y CONTROLES:
- Vértices interactivos: Arrastra A y B manteniendo el ángulo recto.
- Animación de áreas: Escalado dinámico de cuadrados.
- Cálculo en vivo: Verificación continua de la ecuación.

INTERFAZ:
Laboratorio ULTRA didáctico con colores de alto contraste.`,

        "eulergerade": `ANTECEDENTES MATEMÁTICOS:
Ortocentro (H), circuncentro (U) y baricentro (S) alineados en la recta de Euler. Relación HS:SU es 2:1.

CARACTERÍSTICAS Y CONTROLES:
- Construcción: Activa circuncírculo, incírculo y círculo de Feuerbach.
- Líneas de ayuda: Alturas, medianas y bisectrices.
- Análisis: Cálculo permanente de la relación HS/SU.

INTERFAZ:
Laboratorio de alta precisión con puntos diferenciados por colores.`,

        "pythagorasbeweis": `ANTECEDENTES MATEMÁTICOS:
Prueba visual interactiva de Pitágoras mediante descomposición de cuatro triángulos congruentes.

CARACTERÍSTICAS Y CONTROLES:
- Mecánica de puzzle: Movimiento y rotación libre de elementos.
- Triangulación: Detecta áreas libres automáticamente.
- Colisiones: Avisos para asegurar la integridad de la prueba.

INTERFAZ:
Laboratorio ULTRA interactivo que une juego y lógica.`,

        "differentiallabor": `ANTECEDENTES MATEMÁTICOS:
Este módulo visualiza la transición de la secante a la tangente y el concepto de la derivada f'(x) como pendiente local.

CARACTERÍSTICAS Y CONTROLES:
- Biblioteca de funciones: selección de funciones base (cuadráticas, trigonométricas, etc.).
- Tangente interactiva: desplaza el punto de tangencia para ver la pendiente.
- Gráficas de derivadas: visualización de la primera y la segunda derivada.

INTERFAZ:
Interfaz de análisis ULTRA profesional con gráficos de alta resolución.`,

        "integralreaktor": `ANTECEDENTES MATEMÁTICOS:
El reactor integral calcula y visualiza la integral definida de f(x); interpreta la integral como área orientada.

CARACTERÍSTICAS Y CONTROLES:
- Intervalo dinámico: ajuste de límites en el sistema de coordenadas.
- Integración numérica: cálculo en vivo del valor.
- Retroalimentación visual: el área calculada se resalta.

INTERFAZ:
Diseño ULTRA moderno con precisión numérica y claridad gráfica.`,

        "steigung": `ANTECEDENTES MATEMÁTICOS:
El laboratorio visualiza los parámetros m (pendiente) y n (ordenada al origen) de y = mx + n.

CARACTERÍSTICAS Y CONTROLES:
- Manipuladores: arrastra puntos para cambiar la pendiente.
- Triángulo de pendiente: triángulo neón azul con Δx y Δy.
- Sincronización de fórmula: la ecuación se actualiza en vivo con KaTeX.

INTERFAZ:
Interfaz analítica ULTRA que enlaza álgebra y geometría.`,

        "winkelsumme": `ANTECEDENTES MATEMÁTICOS:
Suma de ángulos internos (n-2) * 180°. Verifica la ley en varias figuras.

CARACTERÍSTICAS Y CONTROLES:
- Configuración: Cambia entre triángulo, cuadrado, pentágono, etc.
- Vértices: Arrastra esquinas para verificar la invariancia.
- Visualización: Arcos de colores en ángulos internos.

INTERFAZ:
Diseño ULTRA con segmentos de neón y suma en vivo.`,

        "winkelsumme3d": `ANTECEDENTES MATEMÁTICOS:
Demuestra mediante plegado virtual cómo las tres esquinas se unen en 180°.

CARACTERÍSTICAS Y CONTROLES:
- Plegado interactivo: Control continuo del proceso.
- Navegación 3D: Rotación libre mediante Three.js.
- Geometría dinámica: Cambia la forma durante el plegado.

INTERFAZ:
Diseño 3D ULTRA con efectos de material transparente.`,

        "beweisinwinkellsumme": `ANTECEDENTES MATEMÁTICOS:
Prueba mediante paralelas y ángulos alternos para derivar los 180° en un triángulo.

CARACTERÍSTICAS Y CONTROLES:
- Proyección paralela: Construcción automática por un vértice.
- Ángulos alternos: Correspondencia de colores en el punto pivot.
- Sincronización: Cálculos paralelos que coinciden en 180°.

INTERFAZ:
Laboratorio optimizado con guía de prueba basada en KaTeX.`,

        "fermatpunkt": `ANTECEDENTES MATEMÁTICOS:
Punto en un triángulo donde la suma de distancias a los vértices es mínima.

CARACTERÍSTICAS Y CONTROLES:
- Prueba geométrica: Construcción vía triángulos equiláteros.
- Análisis de distancia: Punto P de comparación frente al mínimo.
- Vértices dinámicos: Recálculo inmediato al cambiar la forma.

INTERFAZ:
Interfaz Cyber con punto de Fermat en lila y HUD de distancia.`,

        "winkellabor": `ANTECEDENTES MATEMÁTICOS:
Estudio de ángulos en paralelas cortadas: opuestos, suplementarios, correspondientes y alternos.

CARACTERÍSTICAS Y CONTROLES:
- Geometría interactiva: Cambia ángulo de corte y distancia.
- Identificación: Código de colores para pares de ángulos.
- Validación: Relación suplementaria de 180°.

INTERFAZ:
Laboratorio ULTRA para conceptos básicos de geometría plana.`,

        "gleichschenkligesdreieck": `ANTECEDENTES MATEMÁTICOS:
Estudio de un triángulo con perímetro fijo (8 cm) bajo condición de isósceles.

CARACTERÍSTICAS Y CONTROLES:
- Slider de base: Cambia b con ajuste inmediato.
- Check de existencia: Desigualdad triangular con aviso visual.
- Vista dual: Modelo y gráfico analítico combinados.

INTERFAZ:
Laboratorio minimalista centrado en álgebra y geometría.`,

        "potenzlabor": `ANTECEDENTES MATEMÁTICOS:
Funciones de potencia f(x) = x^n y sus inversas (raíces).

CARACTERÍSTICAS Y CONTROLES:
- Tuning de exponente: Ajuste de n para observar el crecimiento.
- Telemetría: Cursor interactivo con coordenadas (x, y).
- Simetría: Vista paralela de función e inversa.

INTERFAZ:
Interfaz analítica centrada en comparar clases de funciones.`,

        "transformationen": `ANTECEDENTES MATEMÁTICOS:
Estudio de traslación, rotación, simetría y escalado en objetos geométricos.

CARACTERÍSTICAS Y CONTROLES:
- Multi-sistema: Combinación de varias transformaciones.
- Modo simetría: Reflexión de ejes y puntos interactiva.
- Invarianza de área: Check en tiempo real de conservación.

INTERFAZ:
Laboratorio interactivo para geometría de transformación.`,

        "gleichungssysteme": `ANTECEDENTES MATEMÁTICOS:
Solución gráfica de sistemas lineales (LGS) como intersección de dos rectas.

CARACTERÍSTICAS Y CONTROLES:
- Manipulación: Cambia ecuaciones arrastrando puntos.
- Scrambler de notación: Alterna entre forma estándar e implícita.
- Generador: Crea nuevos retos con soluciones enteras.

INTERFAZ:
Diseño funcional centrado en el equivalente algebraico de la geometría.`,

        "binomischeslabor": `ANTECEDENTES MATEMÁTICOS:
Visualización de (a + b)² como descomposición de áreas geométricas.

CARACTERÍSTICAS Y CONTROLES:
- Escalado dinámico: Cambia a y b directamente.
- Analítica: Cálculo de áreas parciales (a², b², 2ab).
- Sync KaTeX: Actualización dinámica de la fórmula.

INTERFAZ:
Diseño ULTRA centrado en la representación dual.`,

        "coordinatensystemtester": `ANTECEDENTES MATEMÁTICOS:
Herramienta de diagnóstico para CyberCanvas probando proyecciones.

CARACTERÍSTICAS Y CONTROLES:
- Stress Test: Pan y zoom en tiempo real.
- Overlays: Prueba de zonas críticas y asíntotas.
- Integridad: Validación de etiquetas KaTeX.

INTERFAZ:
Sidebar con checkboxes y rejilla estándar.`,

        "galtonboard": `ANTECEDENTES MATEMÁTICOS:
Distribución normal mediante un proceso estocástico de Galton.

CARACTERÍSTICAS Y CONTROLES:
- Simulación física: Colisiones de bolas en tiempo real.
- Histograma: Captura estadística de probabilidades.
- Curva de Gauss: Comparación entre teoría y práctica.

INTERFAZ:
Interfaz dinámica con animaciones físicas fluidas.`,

        "fourier": `ANTECEDENTES MATEMÁTICOS:
Análisis de Fourier: Funciones periódicas como suma de senos.

CARACTERÍSTICAS Y CONTROLES:
- Epiciclos: Vectores rotatorios dibujan curvas complejas.
- Grado de aproximación: Ajuste de armónicos n.
- Tracking: Registro de la reconstrucción en vivo.

INTERFAZ:
Diseño ULTRA centrado en la estética de oscilaciones.`,

        "lissajous": `ANTECEDENTES MATEMÁTICOS:
Figuras de Lissajous mediante superposición de oscilaciones en x e y.

CARACTERÍSTICAS Y CONTROLES:
- Frecuencia: Control independiente de ejes.
- Desfase: Influencia del desplazamiento temporal.
- Péndulo 3D: Analogía física espacial.

INTERFAZ:
Diseño estético con trayectorias brillantes y análisis.`,

        "fibonacci": `ANTECEDENTES MATEMÁTICOS:
Sucesión de Fibonacci y la espiral logarítmica resultante.

CARACTERÍSTICAS Y CONTROLES:
- Control de iteración: Crecimiento de cuadrados Fibonacci.
- Espiral: Activa la construcción geométrica.
- Proporción áurea: Convergencia de los ratios.

INTERFAZ:
Diseño elegante centrado en proporciones.`,

        "ausgleichsgerade": `ANTECEDENTES MATEMÁTICOS:
Regresión lineal por mínimos cuadrados para determinar tendencias.

CARACTERÍSTICAS Y CONTROLES:
- Nube de puntos: Coloca datos manualmente.
- Dashboard: Cálculo en vivo de r, m y n.
- Error visual: Desviación estándar como corredor.

INTERFAZ:
Herramienta estadística con telemetría en tiempo real.`,

        "logikspiel": `ANTECEDENTES MATEMÁTICOS:
Lógica binaria: puertas AND, OR, XOR y NOT.

CARACTERÍSTICAS Y CONTROLES:
- Inputs: Cambia estados con un clic.
- Flujo: Conexiones brillantes muestran datos.
- Tablas de verdad: Comparación en vivo.

INTERFAZ:
Diseño futurista con resaltado de señal claro.`,

        "logikspiel2": `ANTECEDENTES MATEMÁTICOS:
Cuadrado Mágico: Asignación lógica basada en sumas de bordes.

CARACTERÍSTICAS Y CONTROLES:
- Modos: Suma y multiplicación.
- Validación: Feedback visual para soluciones parciales.
- Ayuda: Retos matemáticos para obtener pistas.

INTERFAZ:
Sidebar con tracking de movimientos y tiempo.`,

        "heart3d": `ANTECEDENTES MATEMÁTICOS:
Ecuación de Taubin (corazón) mediante raymarching GPU (SDF).

CARACTERÍSTICAS Y CONTROLES:
- Deformación: Parámetros A y B para variar la forma.
- Render holográfico: Shader de alto rendimiento.
- Fórmula dinámica: Ecuación algebraica en vivo.

INTERFAZ:
Diseño futurista, simbiosis de álgebra y 3D.`,

        "butterfly": `ANTECEDENTES MATEMÁTICOS:
Efecto mariposa vía atractor de Lorenz (teoría del caos).

CARACTERÍSTICAS Y CONTROLES:
- Simulación: Integración de Lorenz en tiempo real.
- Tuning: Ajuste de coeficientes para atractores.
- Glow: Trayectorias como flujos de energía.

INTERFAZ:
Diseño cinemático con panel de ecuaciones KaTeX.`,

        "litchi3d": `ANTECEDENTES MATEMÁTICOS:
Estructuras orgánicas mediante modulación de ondas en SDF.

CARACTERÍSTICAS Y CONTROLES:
- Madurez: Cambio de pigmento en el shader.
- Morfología: Control de rugosidad procedimental.
- Ecuación SDF: Función de distancia d(p) en vivo.

INTERFAZ:
Diseño orgánico usando raymarching.`,

        "triangulierer": `ANTECEDENTES MATEMÁTICOS:
Triangulación Delaunay para generación de mallas.

CARACTERÍSTICAS Y CONTROLES:
- Tiempo real: Recálculo al mover puntos.
- HUD de área: Balance de áreas parciales y totales.
- Selección: Agrupado para checks estructurales.

INTERFAZ:
Interfaz técnica centrada en precisión.`,

        "uhrzeitwinkel": `ANTECEDENTES MATEMÁTICOS:
Ángulo entre manecillas basado en sus velocidades angulares.

CARACTERÍSTICAS Y CONTROLES:
- Precisión: Ajuste de tiempo vía slider.
- Análisis dual: Ángulos Alpha (interno) y Beta (externo).
- Sync digital: Correspondencia analógica-digital.

INTERFAZ:
Reloj Cyber centrado en interpretación matemática.`,

        "universe": `ANTECEDENTES MATEMÁTICOS:
Ecosistema ULTRA como galaxia dinámica mediante raycasting.

CARACTERÍSTICAS Y CONTROLES:
- Matriz: Módulos vuelan desde el centro.
- Exploración: Foco y arranque vía clic.
- Proyección: Escalado por coordenada Z.

INTERFAZ:
Interfaz cinemática como hub central de la suite.`,

        "easyhard": `RESUMEN:
Módulo "easy/hard": tareas escalonadas para entrenamiento dirigido.

CARACTERÍSTICAS Y CONTROLES:
- Dificultad: Alterna entre básico y experto.
- Matriz: Presentación de unidades didácticas.
- Ayuda: Acceso rápido vía icono de navegación.

INTERFAZ:
Diseño ULTRA con navegación de marca central.`
    },
    "fr": {
        "addition": `CONTEXTE MATHÉMATIQUE :
L'addition posée est un algorithme fondamental basé sur le système décimal, additionnant de droite à gauche.

FONCTIONNALITÉS & COMMANDES :
- Saisie des opérandes : Jusqu'à 7 chiffres.
- Étapes : Navigation (< >) pas à pas.
- Retenues : Affichage des retenues actives.

INTERFACE :
- Champs (Haut) : Nombres de base.
- Matrice (Centre) : Disposition verticale.
- Console (Bas) : Start, Reset et navigation.`,

        "subtraktion": `CONTEXTE MATHÉMATIQUE :
Soustraction posée utilisant la méthode de l'emprunt pour calculer la différence.

FONCTIONNALITÉS & COMMANDES :
- Saisie : Contrôle précis (max. 7 chiffres).
- Logique d'emprunt : Explication du processus par le Math Coach.
- Contrôle : Navigation manuelle.

INTERFACE :
Design ULTRA avec mise à l'échelle adaptive et KaTeX.`,

        "multiplikation": `CONTEXTE MATHÉMATIQUE :
Multiplication posée décomposée en produits partiels additionnés.

FONCTIONNALITÉS & COMMANDES :
- Multi-chiffres : Facteurs jusqu'à 7 chiffres.
- Mode détaillé : Chaque multiplication et retenue affichée.
- Somme : Addition finale des lignes.

INTERFACE :
Interface Cyber avec un "Math Coach" expliquant les étapes.`,

        "dividieren": `CONTEXTE MATHÉMATIQUE :
Division posée basée sur l'estimation et l'abaissement successif des chiffres.

FONCTIONNALITÉS & COMMANDES :
- Gestion : Valeurs jusqu'à 7 chiffres.
- Restes : Représentation claire des résidus.
- Coaching : Guide "Combien de fois le diviseur tient-il ?".

INTERFACE :
Layout ULTRA adaptatif utilisant l'espace horizontal.`,

        "parabellabor": `CONTEXTE MATHÉMATIQUE :
Étude des paraboles f(x) = a*(x-d)^2 + e. Influence de a, d et e.

FONCTIONNALITÉS & COMMANDES :
- Poignées : Manipulez le sommet S(d|e) et a directement.
- Double formule : Conversion automatique canonique/développée.
- Racines : Calcul automatique des zéros réels.

INTERFACE :
Design ULTRA avec formules KaTeX liées au sommet.`,

        "mandelbrot_deep": `CONTEXTE MATHÉMATIQUE :
Ensemble de Mandelbrot via z_{n+1} = z_n^2 + c. Rendu WebGL ultra-rapide.

FONCTIONNALITÉS & COMMANDES :
- Mode : Mandelbrot et Julia via contrôles.
- Zoom & Pan : Molette et glisser.
- Vol : START FLIGHT active le zoom interactif.

INTERFACE :
Barre latérale ULTRA ; canevas WebGL central.`,

        "pythagoras": `CONTEXTE MATHÉMATIQUE :
Visualise a² + b² = c² pour triangles rectangles. Somme des carrés des côtés égale l'hypoténuse.

FONCTIONNALITÉS & COMMANDES :
- Sommets : Glissez A et B en gardant l'angle droit.
- Animation : Mise à l'échelle dynamique des carrés.
- Calcul : Vérification continue de l'équation.

INTERFACE :
Labo ULTRA didactique aux couleurs contrastées.`,

        "eulergerade": `CONTEXTE MATHÉMATIQUE :
Orthocentre (H), centre circonscrit (U) et gravité (S) alignés. Rapport HS:SU = 2:1.

FONCTIONNALITÉS & COMMANDES :
- Construction : Cercles circonscrit, inscrit et Feuerbach.
- Aides : Hauteurs, médianes et bissectrices.
- Analyse : Calcul permanent du rapport HS/SU.

INTERFACE :
Labo de précision aux points différenciés par couleurs.`,

        "pythagorasbeweis": `CONTEXTE MATHÉMATIQUE :
Preuve visuelle interactive de Pythagore par décomposition de triangles.

FONCTIONNALITÉS & COMMANDES :
- Puzzle : Mouvement et rotation libre des éléments.
- Triangulation : Détecte les zones libres.
- Collisions : Alertes pour garantir la preuve.

INTERFACE :
Labo ULTRA interactif alliant jeu et logique.`,

        "differentiallabor": `CONTEXTE MATHÉMATIQUE :
Visualisation du passage de la sécante à la tangente et du concept de dérivée f'(x) comme pente locale.

FONCTIONNALITÉS & COMMANDES :
- Bibliothèque de fonctions : choix de fonctions de base (quadratiques, trigonométriques, etc.).
- Tangente interactive : déplacez le point de tangence pour observer la pente.
- Graphes des dérivées : visualisation des dérivées première et seconde.

INTERFACE :
Interface d'analyse ULTRA professionnelle avec tracés haute résolution.`,

        "integralreaktor": `CONTEXTE MATHÉMATIQUE :
Calcul et visualisation de l'intégrale définie de f(x), interprétée comme aire algébrique.

FONCTIONNALITÉS & COMMANDES :
- Choix d'intervalle dynamique : bornes directement dans le repère.
- Intégration numérique : valeur en direct.
- Retour visuel : mise en évidence de l'aire calculée.

INTERFACE :
Design ULTRA axé sur la précision numérique et la clarté graphique.`,

        "steigung": `CONTEXTE MATHÉMATIQUE :
Visualisation des paramètres m (pente) et n (ordonnée à l'origine) de y = mx + n.

FONCTIONNALITÉS & COMMANDES :
- Poignées : déplacez les points pour modifier la pente.
- Triangle de pente : Δx et Δy en bleu néon.
- Synchronisation KaTeX : équation mise à jour en temps réel.

INTERFACE :
Interface analytique ULTRA reliant algèbre et géométrie.`,

        "winkelsumme": `CONTEXTE MATHÉMATIQUE :
Somme des angles (n-2) * 180°. Vérifiez la loi sur diverses figures.

FONCTIONNALITÉS & COMMANDES :
- Configuration : Triangle, carré, pentagone, etc.
- Sommets : Glissez les coins pour vérifier l'invariance.
- Visualisation : Arcs colorés aux angles internes.

INTERFACE :
Design ULTRA avec segments néon et somme en direct.`,

        "winkelsumme3d": `CONTEXTE MATHÉMATIQUE :
Démontre par pliage virtuel comment les trois coins forment 180°.

FONCTIONNALITÉS & COMMANDES :
- Pliage : Contrôle continu du processus.
- Navigation 3D : Rotation via Three.js.
- Géométrie : Changez la forme durant le pliage.

INTERFACE :
Design 3D ULTRA avec effets de matière.`,

        "beweisinwinkellsumme": `CONTEXTE MATHÉMATIQUE :
Preuve via parallèles et angles alternes pour dériver les 180°.

FONCTIONNALITÉS & COMMANDES :
- Projection : Construction automatique par un sommet.
- Angles : Correspondance couleur au point pivot.
- Sync : Calculs parallèles coïncidant à 180°.

INTERFACE :
Labo optimisé avec guide KaTeX.`,

        "fermatpunkt": `CONTEXTE MATHÉMATIQUE :
Point minimisant la somme des distances aux sommets du triangle.

FONCTIONNALITÉS & COMMANDES :
- Preuve : Construction via triangles équilatéraux.
- Analyse : Point P comparé au minimum.
- Sommets : Recalcul immédiat lors des changements.

INTERFACE :
Interface Cyber avec point de Fermat en lilas et HUD.`,

        "winkellabor": `CONTEXTE MATHÉMATIQUE :
Angles sur parallèles : opposés, supplémentaires, correspondants et alternes.

FONCTIONNALITÉS & COMMANDES :
- Géométrie : Modifiez l'angle et la distance.
- Identification : Code couleur pour les paires.
- Validation : Relation de 180°.

INTERFACE :
Labo ULTRA pour les concepts de géométrie plane.`,

        "gleichschenkligesdreieck": `CONTEXTE MATHÉMATIQUE :
Triangle à périmètre fixe (8 cm) sous condition d'isocèle.

FONCTIONNALITÉS & COMMANDES :
- Slider : Changez b avec ajustement immédiat.
- Existence : Inégalité triangulaire avec alerte.
- Vue duale : Modèle et graphique combinés.

INTERFACE :
Labo minimaliste axé sur l'algèbre et la géométrie.`,

        "potenzlabor": `CONTEXTE MATHÉMATIQUE :
Fonctions puissance f(x) = x^n et leurs inverses (racines).

FONCTIONNALITÉS & COMMANDES :
- Tuning : Ajustez n pour observer la croissance.
- Télémétrie : Curseur avec coordonnées (x, y).
- Symétrie : Vue parallèle fonction/inverse.

INTERFACE :
Interface analytique comparant les classes de fonctions.`,

        "transformationen": `CONTEXTE MATHÉMATIQUE :
Translation, rotation, symétrie et échelle sur objets géométriques.

FONCTIONNALITÉS & COMMANDES :
- Multi-système : Combinaison de transformations.
- Symétrie : Réflexion axes/points interactive.
- Invariance : Check de conservation d'aire.

INTERFACE :
Labo interactif pour géométrie de transformation.`,

        "gleichungssysteme": `CONTEXTE MATHÉMATIQUE :
Solution graphique de systèmes linéaires (LGS) comme intersection de droites.

FONCTIONNALITÉS & COMMANDES :
- Manipulation : Glissez les points pour changer les droites.
- Scrambler : Alternez entre formes standard et implicite.
- Générateur : Nouveaux défis à solutions entières.

INTERFACE :
Design fonctionnel centré sur l'équivalent algébrique.`,

        "binomischeslabor": `CONTEXTE MATHÉMATIQUE :
Visualisation de (a + b)² comme décomposition d'aires.

FONCTIONNALITÉS & COMMANDES :
- Échelle : Modifiez a et b directement.
- Analytique : Calcul d'aires (a², b², 2ab).
- Sync KaTeX : Mise à jour dynamique de la formule.

INTERFACE :
Design ULTRA centré sur la représentation duale.`,

        "coordinatensystemtester": `CONTEXTE MATHÉMATIQUE :
Outil de diagnostic CyberCanvas testant les projections.

FONCTIONNALITÉS & COMMANDES :
- Stress Test : Pan et zoom en temps réel.
- Overlays : Test des zones critiques et asymptotes.
- Intégrité : Validation des étiquettes KaTeX.

INTERFACE :
Sidebar avec checkboxes et grille standard.`,

        "galtonboard": `CONTEXTE MATHÉMATIQUE :
Distribution normale via un processus stochastique de Galton.

FONCTIONNALITÉS & COMMANDES :
- Physique : Collisions en temps réel.
- Histogramme : Capture statistique.
- Courbe de Gauss : Comparaison théorie/pratique.

INTERFACE :
Interface dynamique avec animations physiques.`,

        "fourier": `CONTEXTE MATHÉMATIQUE :
Analyse de Fourier : Fonctions périodiques comme somme de sinus.

FONCTIONNALITÉS & COMMANDES :
- Épicycles : Vecteurs rotatifs dessinant des courbes.
- Approximation : Ajustement des harmoniques n.
- Tracking : Enregistrement de la reconstruction.

INTERFACE :
Design ULTRA axé sur l'esthétique des oscillations.`,

        "lissajous": `CONTEXTE MATHÉMATIQUE :
Figures de Lissajous par superposition d'oscillations x et y.

FONCTIONNALITÉS & COMMANDES :
- Fréquence : Contrôle indépendant des axes.
- Déphasage : Influence du décalage temporel.
- Pendule 3D : Analogie physique spatiale.

INTERFACE :
Design esthétique avec trajectoires brillantes.`,

        "fibonacci": `CONTEXTE MATHÉMATIQUE :
Suite de Fibonacci et spirale logarithmique résultante.

FONCTIONNALITÉS & COMMANDES :
- Itération : Croissance des carrés Fibonacci.
- Spirale : Activez la construction géométrique.
- Nombre d'or : Convergence des rapports.

INTERFACE :
Design élégant axé sur les proportions.`,

        "ausgleichsgerade": `CONTEXTE MATHÉMATIQUE :
Régression linéaire par moindres carrés pour les tendances.

FONCTIONNALITÉS & COMMANDES :
- Nuage : Placez les points manuellement.
- Dashboard : Calcul en direct de r, m et n.
- Erreur : Écart-type visualisé.

INTERFACE :
Outil statistique avec télémétrie temps réel.`,

        "logikspiel": `CONTEXTE MATHÉMATIQUE :
Logique binaire : Portes AND, OR, XOR et NOT.

FONCTIONNALITÉS & COMMANDES :
- Inputs : Changez les états d'un clic.
- Flux : Connexions brillantes montrant les données.
- Tables : Comparaison en direct des définitions.

INTERFACE :
Design futuriste avec signalétique claire.`,

        "logikspiel2": `CONTEXTE MATHÉMATIQUE :
Carré Magique : Affectation logique basée sur les sommes de bord.

FONCTIONNALITÉS & COMMANDES :
- Modes : Addition et multiplication.
- Validation : Feedback visuel des solutions.
- Aide : Défis maths pour obtenir des indices.

INTERFACE :
Sidebar avec suivi des coups et du temps.`,

        "heart3d": `CONTEXTE MATHÉMATIQUE :
Équation de Taubin (cœur) via raymarching GPU (SDF).

FONCTIONNALITÉS & COMMANDES :
- Déformation : Paramètres A et B pour la forme.
- Rendu : Shader haute performance.
- Formule : Équation algébrique en direct.

INTERFACE :
Design futuriste, symbiose algèbre et 3D.`,

        "butterfly": `CONTEXTE MATHÉMATIQUE :
Effet papillon via l'attracteur de Lorenz (théorie du chaos).

FONCTIONNALITÉS & COMMANDES :
- Simulation : Intégration de Lorenz temps réel.
- Tuning : Ajustement des attracteurs.
- Glow : Trajectoires lumineuses.

INTERFACE :
Design cinématique avec panneau KaTeX.`,

        "litchi3d": `CONTEXTE MATHÉMATIQUE :
Structures organiques par modulation d'ondes en SDF.

FONCTIONNALITÉS & COMMANDES :
- Maturité : Changement de pigment shader.
- Morphologie : Contrôle du relief procédural.
- Équation : Distance d(p) en direct.

INTERFACE :
Design organique utilisant le raymarching.`,

        "triangulierer": `CONTEXTE MATHÉMATIQUE :
Triangulation Delaunay pour génération de maillages.

FONCTIONNALITÉS & COMMANDES :
- Temps réel : Recalcul au mouvement des points.
- HUD : Bilans d'aires partielles et totales.
- Sélection : Groupement pour checks structurels.

INTERFACE :
Interface technique centrée sur la précision.`,

        "uhrzeitwinkel": `CONTEXTE MATHÉMATIQUE :
Angle entre aiguilles basé sur leurs vitesses angulaires.

FONCTIONNALITÉS & COMMANDES :
- Précision : Réglage du temps via slider.
- Analyse : Angles Alpha (interne) et Beta (externe).
- Sync : Correspondance analogique-digitale.

INTERFACE :
Horloge Cyber centrée sur l'interprétation.`,

        "universe": `CONTEXTE MATHÉMATIQUE :
Écosystème ULTRA en galaxie dynamique via raycasting.

FONCTIONNALITÉS & COMMANDES :
- Matrice : Modules volant depuis le centre.
- Exploration : Focus et lancement via clic.
- Projection : Échelle par coordonnée Z.

INTERFACE :
Interface cinématique, hub central de la suite.`,

        "easyhard": `RÉSUMÉ :
Module "easy/hard" : tâches graduées pour entraînement ciblé.

FONCTIONNALITÉS & COMMANDES :
- Difficulté : Bascule entre mode base et expert.
- Matrice : Unités didactiques structurées.
- Aide : Accès rapide via icône navigation.

INTERFACE :
Design ULTRA avec navigation de marque.`
    },
    "it": {
        "addition": `CONTESTO MATEMATICO:
L'addizione in colonna è un algoritmo basato sul sistema decimale, calcolando da destra a sinistra.

CARATTERISTICHE E COMANDI:
- Inserimento addendi: Fino a 7 cifre.
- Passaggi: Navigazione (< >) passo dopo passo.
- Riporti: Visualizzazione dei riporti attivi.

INTERFACCIA:
- Campi (Alto): Numeri di base.
- Matrice (Centro): Disposizione verticale.
- Console (Basso): Start, Reset e navigazione.`,

        "subtraktion": `CONTESTO MATEMATICO:
Sottrazione in colonna con metodo del prestito per calcolare la differenza.

CARATTERISTICHE E COMANDI:
- Inserimento cifre: Controllo preciso (max. 7 cifre).
- Logica prestito: Spiegazione del Math Coach.
- Controllo: Navigazione manuale.

INTERFACCIA:
Design ULTRA con ridimensionamento adattivo e KaTeX.`,

        "multiplikation": `CONTESTO MATEMATICO:
Moltiplicazione in colonna scomposta in prodotti parziali sommati.

CARATTERISTICHE E COMANDI:
- Multi-cifra: Fattori fino a 7 cifre.
- Modalità dettagliata: Ogni moltiplicazione e riporto mostrati.
- Somma: Addizione finale delle righe.

INTERFACCIA:
Interfaccia Cyber con "Math Coach" che spiega i passaggi.`,

        "dividieren": `CONTESTO MATEMATICO:
Divisione in colonna basata su stima e abbassamento delle cifre.

CARATTERISTICHE E COMANDI:
- Gestione: Valori fino a 7 cifre.
- Resti: Rappresentazione chiara dei residui.
- Coaching: Guida "Quante volte il divisore sta nel...?".

INTERFACCIA:
Layout ULTRA adattivo che usa lo spazio orizzontale.`,

        "parabellabor": `CONTESTO MATEMATICO:
Studio di parabole f(x) = a*(x-d)^2 + e. Influenza di a, d ed e.

CARATTERISTICHE E COMANDI:
- Maniglie: Manipola il vertice S(d|e) e a direttamente.
- Doppia formula: Conversione vertice/standard automatica.
- Radici: Calcolo automatico degli zeri reali.

INTERFACCIA:
Design ULTRA con formule KaTeX legate al vertice.`,

        "mandelbrot_deep": `CONTESTO MATEMATICO:
Insieme di Mandelbrot via z_{n+1} = z_n^2 + c. Rendering WebGL veloce.

CARATTERISTICHE E COMANDI:
- Modalità: Mandelbrot e Julia via controlli.
- Zoom & Pan: Rotella e trascinamento.
- Volo: START FLIGHT attiva lo zoom interattivo.

INTERFACCIA:
Sidebar ULTRA; tela WebGL centrale.`,

        "pythagoras": `CONTESTO MATEMATICO:
Visualizza a² + b² = c² per triangoli rettangoli. Somma dei quadrati uguale all'ipotenusa.

CARATTERISTICHE E COMANDI:
- Vertici: Trascina A e B mantenendo l'angolo retto.
- Animazione: Ridimensionamento dinamico dei quadrati.
- Calcolo: Verifica continua dell'equazione.

INTERFACCIA:
Labo ULTRA didattico con colori contrastanti.`,

        "eulergerade": `CONTESTO MATEMATICO:
Ortocentro (H), circocentro (U) e baricentro (S) allineati. Rapporto HS:SU = 2:1.

CARATTERISTICHE E COMANDI:
- Costruzione: Cerchi circoscritto, inscritto e Feuerbach.
- Aiuti: Altezze, mediane e bisettrici.
- Analisi: Calcolo permanente del rapporto HS/SU.

INTERFACCIA:
Labo di precisione con punti differenziati per colori.`,

        "pythagorasbeweis": `CONTESTO MATEMATICO:
Prova visiva interattiva di Pitagora mediante scomposizione di triangoli.

CARATTERISTICHE E COMANDI:
- Puzzle: Movimento e rotazione libera degli elementi.
- Triangolazione: Rileva aree libere automaticamente.
- Collisioni: Avvisi per garantire la prova.

INTERFACCIA:
Labo ULTRA interattivo tra gioco e logica.`,

        "differentiallabor": `CONTESTO MATEMATICO:
Visualizza il passaggio dalla secante alla tangente e il concetto di derivata f'(x) come pendenza locale.

CARATTERISTICHE E COMANDI:
- Libreria di funzioni: selezione di funzioni di base (quadratiche, trigonometriche, ecc.).
- Tangente interattiva: sposta il punto di tangenza per osservare la pendenza.
- Grafici delle derivate: visualizzazione della prima e della seconda derivata.

INTERFACCIA:
Interfaccia di analisi ULTRA professionale con grafici ad alta risoluzione.`,

        "integralreaktor": `CONTESTO MATEMATICO:
Calcolo e visualizzazione dell'integrale definito di f(x), interpretato come area orientata.

CARATTERISTICHE E COMANDI:
- Intervallo dinamico: limiti direttamente nel sistema di coordinate.
- Integrazione numerica: valore in tempo reale.
- Feedback visivo: evidenziazione dell'area calcolata.

INTERFACCIA:
Design ULTRA moderno su precisione numerica e chiarezza grafica.`,

        "steigung": `CONTESTO MATEMATICO:
Visualizza i parametri m (pendenza) e n (intersezione con l'asse y) di y = mx + n.

CARATTERISTICHE E COMANDI:
- Maniglie: trascina i punti per modificare la pendenza.
- Triangolo di pendenza: Δx e Δy in blu neon.
- Sincronizzazione KaTeX: equazione aggiornata in tempo reale.

INTERFACCIA:
Interfaccia analitica ULTRA che collega algebra e geometria.`,

        "winkelsumme": `CONTESTO MATEMATICO:
Somma angoli (n-2) * 180°. Verifica la legge su varie figure.

CARATTERISTICHE E COMANDI:
- Configurazione: Triangolo, quadrato, pentagono, ecc.
- Vertici: Trascina gli angoli per verificare l'invarianza.
- Visualizzazione: Archi colorati negli angoli interni.

INTERFACCIA:
Design ULTRA con segmenti neon e somma live.`,

        "winkelsumme3d": `CONTESTO MATEMATICO:
Dimostra con piegatura virtuale come i tre angoli formino 180°.

CARATTERISTICHE E COMANDI:
- Piegatura: Controllo continuo del processo.
- Navigazione 3D: Rotazione via Three.js.
- Geometria: Cambia forma durante la piegatura.

INTERFACCIA:
Design 3D ULTRA con effetti di materiale.`,

        "beweisinwinkellsumme": `CONTESTO MATEMATICO:
Prova con parallele e angoli alterni per derivare i 180°.

CARATTERISTICHE E COMANDI:
- Proiezione: Costruzione automatica per un vertice.
- Angoli: Corrispondenza colore al punto pivot.
- Sync: Calcoli paralleli coincidenti a 180°.

INTERFACCIA:
Labo ottimizzato con guida KaTeX.`,

        "fermatpunkt": `CONTESTO MATEMATICO:
Punto che minimizza la somma delle distanze dai vertici del triangolo.

CARATTERISTICHE E COMANDI:
- Prova: Costruzione via triangoli equilateri.
- Analisi: Punto P confrontato col minimo.
- Vertici: Ricalcolo immediato ai cambiamenti.

INTERFACCIA:
Interfaccia Cyber con punto di Fermat lilla e HUD.`,

        "winkellabor": `CONTESTO MATEMATICO:
Angoli su parallele: opposti, supplementari, corrispondenti e alterni.

CARATTERISTICHE E COMANDI:
- Geometria: Modifica angolo e distanza.
- Identificazione: Codice colore per le coppie.
- Validazione: Relazione di 180°.

INTERFACCIA:
Labo ULTRA per i concetti di geometria piana.`,

        "gleichschenkligesdreieck": `CONTESTO MATEMATICO:
Triangolo a perimetro fisso (8 cm) con condizione isoscele.

CARATTERISTICHE E COMANDI:
- Slider: Cambia b con regolazione immediata.
- Esistenza: Ineguaglianza triangolare con avviso.
- Vista duale: Modello e grafico combinati.

INTERFACCIA:
Labo minimalista su algebra e geometria.`,

        "potenzlabor": `CONTESTO MATEMATICO:
Funzioni potenza f(x) = x^n e loro inverse (radici).

CARATTERISTICHE E COMANDI:
- Tuning: Regola n per osservare la crescita.
- Telemetria: Cursore con coordinate (x, y).
- Simmetria: Vista parallela funzione/inversa.

INTERFACCIA:
Interfaccia analitica che confronta le classi di funzioni.`,

        "transformationen": `CONTESTO MATEMATICO:
Traslazione, rotazione, simmetria e scala su oggetti geometrici.

CARATTERISTICHE E COMANDI:
- Multi-sistema: Combinazione di trasformazioni.
- Simmetria: Riflessione assi/punti interattiva.
- Invarianza: Check conservazione area.

INTERFACCIA:
Labo interattivo per geometria di trasformazione.`,

        "gleichungssysteme": `CONTESTO MATEMATICO:
Soluzione grafica di sistemi lineari (LGS) come intersezione di rette.

CARATTERISTICHE E COMANDI:
- Manipolazione: Trascina i punti per cambiare le rette.
- Scrambler: Alterna tra forme standard e implicite.
- Generatore: Nuove sfide a soluzioni intere.

INTERFACCIA:
Design funzionale sull'equivalente algebrico.`,

        "binomischeslabor": `CONTESTO MATEMATICO:
Visualizzazione di (a + b)² come scomposizione di aree.

CARATTERISTICHE E COMANDI:
- Scala: Modifica a e b direttamente.
- Analitica: Calcolo aree (a², b², 2ab).
- Sync KaTeX: Aggiornamento dinamico formula.

INTERFACCIA:
Design ULTRA sulla rappresentazione duale.`,

        "coordinatensystemtester": `CONTESTO MATEMATICO:
Strumento diagnostico CyberCanvas che testa proiezioni.

CARATTERISTICHE E COMANDI:
- Stress Test: Pan e zoom in tempo reale.
- Overlays: Test zone critiche e asintoti.
- Integrità: Validazione etichette KaTeX.

INTERFACCIA:
Sidebar con checkbox e griglia standard.`,

        "galtonboard": `CONTESTO MATEMATICO:
Distribuzione normale via processo stocastico di Galton.

CARATTERISTICHE E COMANDI:
- Fisica: Collisioni in tempo reale.
- Istogramma: Cattura statistica.
- Curva Gauss: Confronto teoria/pratica.

INTERFACCIA:
Interfaccia dinamica con animazioni fisiche.`,

        "fourier": `CONTESTO MATEMATICO:
Analisi di Fourier: Funzioni periodiche come somma di seni.

CARATTERISTICHE E COMANDI:
- Epicicli: Vettori rotanti che disegnano curve.
- Approssimazione: Regolazione armoniche n.
- Tracking: Registrazione ricostruzione.

INTERFACCIA:
Design ULTRA sull'estetica delle oscillazioni.`,

        "lissajous": `CONTESTO MATEMATICO:
Figure di Lissajous per sovrapposizione di oscillazioni x e y.

CARATTERISTICHE E COMANDI:
- Frequenza: Controllo indipendente degli assi.
- Sfasamento: Influenza dello slittamento temporale.
- Pendolo 3D: Analogia fisica spaziale.

INTERFACCIA:
Design estetico con traiettorie brillanti.`,

        "fibonacci": `CONTESTO MATEMATICO:
Successione di Fibonacci e spirale logaritmica risultante.

CARATTERISTICHE E COMANDI:
- Iterazione: Crescita quadrati Fibonacci.
- Spirale: Attiva costruzione geometrica.
- Rapporto aureo: Convergenza dei rapporti.

INTERFACCIA:
Design elegante sulle proporzioni.`,

        "ausgleichsgerade": `CONTESTO MATEMATICO:
Regressione lineare per minimi quadrati per i trend.

CARATTERISTICHE E COMANDI:
- Nuvola: Posiziona i punti manualmente.
- Dashboard: Calcolo live di r, m e n.
- Errore: Deviazione standard visualizzata.

INTERFACCIA:
Strumento statistico con telemetria.`,

        "logikspiel": `CONTESTO MATEMATICO:
Logica binaria: Porte AND, OR, XOR e NOT.

CARATTERISTICHE E COMANDI:
- Inputs: Cambia stati con un clic.
- Flusso: Connessioni brillanti mostrano i dati.
- Tabelle: Confronto live definizioni.

INTERFACCIA:
Design futurista con segnaletica chiara.`,

        "logikspiel2": `CONTESTO MATEMATICO:
Quadrato Magico: Assegnazione basata su somme di bordo.

CARATTERISTICHE E COMANDI:
- Modi: Addizione e moltiplicazione.
- Validazione: Feedback visivo soluzioni.
- Aiuto: Sfide math per indizi.

INTERFACCIA:
Sidebar con tracking mosse e tempo.`,

        "heart3d": `CONTESTO MATEMATICO:
Equazione Taubin (cuore) via raymarching GPU (SDF).

CARATTERISTICHE E COMANDI:
- Deformazione: Parametri A e B per la forma.
- Rendering: Shader alte prestazioni.
- Formula: Equazione algebrica live.

INTERFACCIA:
Design futurista, simbiosi algebra e 3D.`,

        "butterfly": `CONTESTO MATEMATICO:
Effetto farfalla via attrattore di Lorenz (caos).

CARATTERISTICHE E COMANDI:
- Simulazione: Integrazione Lorenz tempo reale.
- Tuning: Regolazione attrattori.
- Glow: Traiettorie luminose.

INTERFACCIA:
Design cinematico con pannello KaTeX.`,

        "litchi3d": `CONTESTO MATEMATICO:
Strutture organiche per modulazione onde in SDF.

CARATTERISTICHE E COMANDI:
- Maturità: Cambio pigmento shader.
- Morfologia: Controllo rilievo procedurale.
- Equazione: Distanza d(p) live.

INTERFACCIA:
Design organico con raymarching.`,

        "triangulierer": `CONTESTO MATEMATICO:
Triangolazione Delaunay per generazione mesh.

CARATTERISTICHE E COMANDI:
- Tempo reale: Ricalcolo al muovere dei punti.
- HUD: Bilanci aree parziali e totali.
- Selezione: Raggruppamento per check.

INTERFACCIA:
Interfaccia tecnica su precisione.`,

        "uhrzeitwinkel": `CONTESTO MATEMATICO:
Angolo tra lancette basato sulle velocità angolari.

CARATTERISTICHE E COMANDI:
- Precisione: Regolazione tempo via slider.
- Analisi: Angoli Alpha (interno) e Beta (esterno).
- Sync: Corrispondenza analogico-digitale.

INTERFACCIA:
Orologio Cyber sull'interpretazione math.`,

        "universe": `CONTESTO MATEMATICO:
Ecosistema ULTRA in galassia dinamica via raycasting.

CARATTERISTICHE E COMANDI:
- Matrice: Moduli volanti dal centro.
- Esplorazione: Focus e lancio via clic.
- Proiezione: Scala per coordinata Z.

INTERFACCIA:
Interfaccia cinematica, hub centrale della suite.`,

        "easyhard": `RIASSUNTO:
Modulo "easy/hard": compiti graduati per training mirato.

CARATTERISTICHE E COMANDI:
- Difficoltà: Passa tra base ed esperto.
- Matrice: Unità didattiche strutturate.
- Aiuto: Accesso rapido via icona navigazione.

INTERFACCIA:
Design ULTRA con navigazione di marca.`
    },
    "pt": {
        "addition": `CONTEXTO MATEMÁTICO:
Adição escrita é um algoritmo fundamental baseado no sistema decimal, somando da direita para a esquerda.

RECURSOS E CONTROLOS:
- Entrada de parcelas: Até 7 dígitos.
- Etapas: Navegação (< >) passo a passo.
- Transporte: Visualização do transporte ativo.

INTERFACE:
- Campos (Topo): Números base.
- Matriz (Centro): Disposição vertical.
- Consola (Fundo): Iniciar, Reset e navegação.`,

        "subtraktion": `CONTEXTO MATEMÁTICO:
Subtração escrita usando o método de empréstimo para calcular a diferença.

RECURSOS E CONTROLOS:
- Entrada de dígitos: Controlo preciso (máx. 7 dígitos).
- Lógica de empréstimo: Explicação do Math Coach.
- Controlo: Navegação manual.

INTERFACE:
Design ULTRA com escala adaptativa e KaTeX.`,

        "multiplikation": `CONTEXTO MATEMÁTICO:
Multiplicação escrita decomposta em produtos parciais somados.

RECURSOS E CONTROLOS:
- Multi-dígito: Fatores até 7 dígitos.
- Modo detalhado: Cada multiplicação e transporte mostrados.
- Soma: Adição final das linhas.

INTERFACE:
Interface Cyber com "Math Coach" que explica as etapas.`,

        "dividieren": `CONTEXTO MATEMÁTICO:
Divisão escrita baseada em estimativa e descida de dígitos.

RECURSOS E CONTROLOS:
- Gestão: Valores até 7 dígitos.
- Restos: Representação clara de resíduos.
- Coaching: Guia "Quantas vezes o divisor cabe no...?".

INTERFACE:
Layout ULTRA adaptativo que usa o espaço horizontal.`,

        "parabellabor": `CONTEXTO MATEMÁTICO:
Estudo de parábolas f(x) = a*(x-d)^2 + e. Influência de a, d e e.

RECURSOS E CONTROLOS:
- Manipuladores: Manipule o vértice S(d|e) e a diretamente.
- Dupla fórmula: Conversão vértice/padrão automática.
- Raízes: Cálculo automático de zeros reais.

INTERFACE:
Design ULTRA com fórmulas KaTeX ligadas ao vértice.`,

        "mandelbrot_deep": `CONTEXTO MATEMÁTICO:
Conjunto de Mandelbrot via z_{n+1} = z_n^2 + c. Renderização WebGL rápida.

RECURSOS E CONTROLOS:
- Modo: Mandelbrot e Julia via controlos.
- Zoom & Pan: Roda e arrasto.
- Voo: START FLIGHT ativa o zoom interativo.

INTERFACE:
Sidebar ULTRA; tela WebGL central.`,

        "pythagoras": `CONTEXTO MATEMÁTICO:
Visualiza a² + b² = c² para triângulos retângulos. Soma dos quadrados igual à hipotenusa.

RECURSOS E CONTROLOS:
- Vértices: Arraste A e B mantendo o ângulo reto.
- Animação: Escala dinâmica dos quadrados.
- Cálculo: Verificação contínua da equação.

INTERFACE:
Labo ULTRA didático com cores contrastantes.`,

        "eulergerade": `CONTEXTO MATEMÁTICO:
Ortocentro (H), circuncentro (U) e centroide (S) alinhados. Razão HS:SU = 2:1.

RECURSOS E CONTROLOS:
- Construção: Círculos circunscrito, inscrito e Feuerbach.
- Auxiliares: Alturas, medianas e bissetrizes.
- Análise: Cálculo permanente da razão HS/SU.

INTERFACE:
Labo de precisão com pontos diferenciados por cores.`,

        "pythagorasbeweis": `CONTEXTO MATEMÁTICO:
Prova visual interativa de Pitágoras por decomposição de triângulos.

RECURSOS E CONTROLOS:
- Puzzle: Movimento e rotação livre dos elementos.
- Triangulação: Deteta áreas livres automaticamente.
- Colisões: Avisos para garantir a prova.

INTERFACE:
Labo ULTRA interativo entre jogo e lógica.`,

        "differentiallabor": `CONTEXTO MATEMÁTICO:
Visualiza a transição da secante à tangente e o conceito da derivada f'(x) como declive local.

RECURSOS E CONTROLOS:
- Biblioteca de funções: seleção de funções de base (quadráticas, trigonométricas, etc.).
- Tangente interativa: mover o ponto de tangência para observar o declive.
- Gráficos das derivadas: visualização da primeira e da segunda derivada.

INTERFACE:
Interface de análise ULTRA profissional com gráficos de alta resolução.`,

        "integralreaktor": `CONTEXTO MATEMÁTICO:
Cálculo e visualização do integral definido de f(x), interpretado como área orientada.

RECURSOS E CONTROLOS:
- Intervalo dinâmico: limites diretamente no sistema de coordenadas.
- Integração numérica: valor em tempo real.
- Feedback visual: realce da área calculada.

INTERFACE:
Design ULTRA moderno com precisão numérica e clareza gráfica.`,

        "steigung": `CONTEXTO MATEMÁTICO:
Visualiza os parâmetros m (declive) e n (ordenada na origem) de y = mx + n.

RECURSOS E CONTROLOS:
- Manipuladores: arraste pontos para alterar o declive.
- Triângulo de declive: Δx e Δy em azul néon.
- Sincronização KaTeX: equação atualizada em tempo real.

INTERFACE:
Interface analítica ULTRA que liga álgebra e geometria.`,

        "winkelsumme": `CONTEXTO MATEMÁTICO:
Soma de ângulos (n-2) * 180°. Verifique a lei em várias figuras.

RECURSOS E CONTROLOS:
- Configuração: Triângulo, quadrado, pentágono, etc.
- Vértices: Arraste cantos para verificar a invariância.
- Visualização: Arcos coloridos nos ângulos internos.

INTERFACE:
Design ULTRA com segmentos néon e soma live.`,

        "winkelsumme3d": `CONTEXTO MATEMÁTICO:
Demonstra por dobragem virtual como os três cantos formam 180°.

RECURSOS E CONTROLOS:
- Dobragem: Controlo contínuo do processo.
- Navegação 3D: Rotação via Three.js.
- Geometria: Altere a forma durante a dobragem.

INTERFACE:
Design 3D ULTRA com efeitos de material.`,

        "beweisinwinkellsumme": `CONTEXTO MATEMÁTICO:
Prova por paralelas e ângulos alternos para derivar os 180°.

RECURSOS E CONTROLOS:
- Projeção: Construção automática por um vértice.
- Ângulos: Correspondência de cor no ponto pivot.
- Sync: Cálculos paralelos coincidindo em 180°.

INTERFACE:
Labo otimizado com guia KaTeX.`,

        "fermatpunkt": `CONTEXTO MATEMÁTICO:
Ponto que minimiza a soma das distâncias aos vértices do triângulo.

RECURSOS E CONTROLOS:
- Prova: Construção via triângulos equiláteros.
- Análise: Ponto P comparado ao mínimo.
- Vértices: Recálculo imediato nas mudanças.

INTERFACE:
Interface Cyber com ponto de Fermat lilás e HUD.`,

        "winkellabor": `CONTEXTO MATEMÁTICO:
Ângulos em paralelas: opostos, suplementares, correspondentes e alternos.

RECURSOS E CONTROLOS:
- Geometria: Altere ângulo e distância.
- Identificação: Código de cor para os pares.
- Validação: Relação de 180°.

INTERFACE:
Labo ULTRA para conceitos de geometria plana.`,

        "gleichschenkligesdreieck": `CONTEXTO MATEMÁTICO:
Triângulo com perímetro fixo (8 cm) e condição isósceles.

RECURSOS E CONTROLOS:
- Slider: Altere b com ajuste imediato.
- Existência: Inequação triangular com aviso.
- Vista dual: Modelo e gráfico combinados.

INTERFACE:
Labo minimalista sobre álgebra e geometria.`,

        "potenzlabor": `CONTEXTO MATEMÁTICO:
Funções potência f(x) = x^n e suas inversas (raízes).

RECURSOS E CONTROLOS:
- Tuning: Ajuste n para observar o crescimento.
- Telemetria: Cursor com coordenadas (x, y).
- Simetria: Vista paralela função/inversa.

INTERFACE:
Interface analítica comparando classes de funções.`,

        "transformationen": `CONTEXTO MATEMÁTICO:
Translação, rotação, simetria e escala em objetos geométricos.

RECURSOS E CONTROLOS:
- Multi-sistema: Combinação de transformações.
- Simetria: Reflexão eixos/pontos interativa.
- Invariância: Check conservação de área.

INTERFACE:
Labo interativo para geometria de transformação.`,

        "gleichungssysteme": `CONTEXTO MATEMÁTICO:
Solução gráfica de sistemas lineares (LGS) como interseção de retas.

RECURSOS E CONTROLOS:
- Manipulação: Arraste os pontos para mudar as retas.
- Scrambler: Alterne entre formas padrão e implícitas.
- Gerador: Novos desafios com soluções inteiras.

INTERFACE:
Design funcional sobre o equivalente algébrico.`,

        "binomischeslabor": `CONTEXTO MATEMÁTICO:
Visualização de (a + b)² como decomposição de áreas.

RECURSOS E CONTROLOS:
- Escala: Altere a e b diretamente.
- Analítica: Cálculo de áreas (a², b², 2ab).
- Sync KaTeX: Atualização dinâmica da fórmula.

INTERFACE:
Design ULTRA sobre a representação dual.`,

        "coordinatensystemtester": `CONTEXTO MATEMÁTICO:
Ferramenta de diagnóstico CyberCanvas testando projeções.

RECURSOS E CONTROLOS:
- Stress Test: Pan e zoom em tempo real.
- Overlays: Teste de zonas críticas e assíntotas.
- Integridade: Validação de rótulos KaTeX.

INTERFACE:
Sidebar com checkboxes e grelha padrão.`,

        "galtonboard": `CONTEXTO MATEMÁTICO:
Distribuição normal via processo estocástico de Galton.

RECURSOS E CONTROLOS:
- Física: Colisões em tempo real.
- Histograma: Captura estatística.
- Curva de Gauss: Comparação teoria/prática.

INTERFACE:
Interface dinâmica com animações físicas.`,

        "fourier": `CONTEXTO MATEMÁTICO:
Análise de Fourier: Funções periódicas como soma de senos.

RECURSOS E CONTROLOS:
- Epiciclos: Vetores rotativos desenhando curvas.
- Aproximação: Ajuste de harmónicos n.
- Tracking: Registo da reconstrução.

INTERFACE:
Design ULTRA sobre estética de oscilações.`,

        "lissajous": `CONTEXTO MATEMÁTICO:
Figuras de Lissajous por sobreposição de oscilações x e y.

RECURSOS E CONTROLOS:
- Frequência: Controlo independente dos eixos.
- Desfasagem: Influência do desvio temporal.
- Pêndulo 3D: Analogia física espacial.

INTERFACE:
Design estético com trajetórias brilhantes.`,

        "fibonacci": `CONTEXTO MATEMÁTICO:
Sucessão de Fibonacci e espiral logarítmica resultante.

RECURSOS E CONTROLOS:
- Iteração: Crescimento de quadrados Fibonacci.
- Espiral: Ativa construção geométrica.
- Proporção áurea: Convergência dos rácios.

INTERFACE:
Design elegante sobre proporções.`,

        "ausgleichsgerade": `CONTEXTO MATEMÁTICO:
Regressão linear por mínimos quadrados para tendências.

RECURSOS E CONTROLOS:
- Nuvem: Posicione os pontos manualmente.
- Dashboard: Cálculo live de r, m e n.
- Erro: Desvio padrão visualizado.

INTERFACE:
Ferramenta estatística com telemetria.`,

        "logikspiel": `CONTEXTO MATEMÁTICO:
Lógica binária: Portas AND, OR, XOR e NOT.

RECURSOS E CONTROLOS:
- Inputs: Alterne estados com um clique.
- Fluxo: Conexões brilhantes mostram dados.
- Tabelas: Comparação live de definições.

INTERFACE:
Design futurista com sinalização clara.`,

        "logikspiel2": `CONTEXTO MATEMÁTICO:
Quadrado Mágico: Atribuição baseada em somas de bordas.

RECURSOS E CONTROLOS:
- Modos: Adição e multiplicação.
- Validação: Feedback visual das soluções.
- Ajuda: Desafios math para pistas.

INTERFACE:
Sidebar com tracking de jogadas e tempo.`,

        "heart3d": `CONTEXTO MATEMÁTICO:
Equação de Taubin (coração) via raymarching GPU (SDF).

RECURSOS E CONTROLOS:
- Deformação: Parâmetros A e B para a forma.
- Renderização: Shader de alto desempenho.
- Fórmula: Equação algébrica live.

INTERFACE:
Design futurista, simbiose álgebra e 3D.`,

        "butterfly": `CONTEXTO MATEMÁTICO:
Efeito borboleta via atrator de Lorenz (caos).

RECURSOS E CONTROLOS:
- Simulação: Integração de Lorenz tempo real.
- Tuning: Ajuste de atratores.
- Glow: Trajetórias luminosas.

INTERFACE:
Design cinemático com painel KaTeX.`,

        "litchi3d": `CONTEXTO MATEMÁTICO:
Estruturas orgânicas por modulação de ondas em SDF.

RECURSOS E CONTROLOS:
- Maturidade: Mudança de pigmento no shader.
- Morfologia: Controlo de relevo procedimental.
- Equação: Distância d(p) live.

INTERFACE:
Design orgânico com raymarching.`,

        "triangulierer": `CONTEXTO MATEMÁTICO:
Triangulação Delaunay para geração de malhas.

RECURSOS E CONTROLOS:
- Tempo real: Recálculo ao mover pontos.
- HUD: Balanço de áreas parciais e totais.
- Seleção: Agrupamento para checks.

INTERFACE:
Interface técnica sobre precisão.`,

        "uhrzeitwinkel": `CONTEXTO MATEMÁTICO:
Ângulo entre ponteiros baseado nas suas velocidades.

RECURSOS E CONTROLOS:
- Precisão: Ajuste de tempo via slider.
- Análise: Ângulos Alpha (interno) e Beta (externo).
- Sync: Correspondência analógica-digital.

INTERFACE:
Relógio Cyber sobre interpretação math.`,

        "universe": `CONTEXTO MATEMÁTICO:
Ecossistema ULTRA em galáxia dinâmica via raycasting.

RECURSOS E CONTROLOS:
- Matriz: Módulos voando do centro.
- Exploração: Foco e arranque via clique.
- Projeção: Escala por coordenada Z.

INTERFACE:
Interface cinemática, hub central da suite.`,

        "easyhard": `RESUMO:
Módulo "easy/hard": tarefas graduadas para treino direcionado.

RECURSOS E CONTROLOS:
- Dificuldade: Alterna entre base e perito.
- Matriz: Unidades didáticas estruturadas.
- Ajuda: Acesso rápido via ícone de navegação.

INTERFACE:
Design ULTRA com navegação de marca.`
    }
};

// Türkçe: Lab-Metin wie Englisch (kein stilles DE-Fallback in Briefings).
if (typeof window.CyberBriefings !== "undefined" && window.CyberBriefings.en && !window.CyberBriefings.tr) {
    window.CyberBriefings.tr = { ...window.CyberBriefings.en };
}
