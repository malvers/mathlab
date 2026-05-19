/**
 * ULTRA v6.7.0 - Briefing Data Registry
 * 
 * Diese Datei dient als Fallback für Umgebungen ohne Webserver (file://).
 * Sie spiegelt den Inhalt der .txt-Dateien aus resources/explanations/ wider.
 */
window.CyberBriefings = {
        "addition": `Die schriftliche Addition ist einer der fundamenten Algorithmen der Arithmetik. Er basiert auf dem Stellenwertsystem (Dezimalsystem). Das Prinzip beruht darauf, Zahlen stellenweise von rechts nach links (Einer, Zehner, Hunderter...) zu addieren. Erreicht eine Teilsumme den Wert 10 oder mehr, entsteht ein "Übertrag" (Carry), der zur nächsthöheren Stelle addiert wird.

FEATURES
- Summanden-Eingabe: Nutzer können zwei Summanden mit bis zu 7 Stellen eingeben.
- Algorithmus-Schritte: Über die Navigations-Pfeile (< >) kann der Rechenweg Schritt für Schritt durchlaufen werden.
- Übertrag-Visualisierung: Die kleinen Merkzahlen über den Spalten zeigen den aktiven Übertrag an.
- Farb-Codierung: Aktive Stellenwerte werden hervorgehoben, um den Fokus des Algorithmus zu verdeutlichen.

FUNKTION
Der Algorithmus prüft bei jedem Schritt die Summe der Ziffern einer Spalte plus den eventuellen Übertrag aus der vorherigen Spalte. Das Ergebnis (Modulo 10) wird notiert, der neue Übertrag (Division durch 10) wird für den nächsten Schritt gespeichert.`,

        "subtraktion": `Die schriftliche Subtraktion berechnet die Differenz zwischen einem Minuenden und einem Subtrahenden. Das Labor nutzt das Abziehverfahren (Entbündelung), bei dem von rechts nach links subtrahiert wird. Ist eine Ziffer des Minuenden kleiner als die des Subtrahenden, wird ein Zehner von der nächsthöheren Stelle "geliehen".

FEATURES
- Ziffern-Eingabe: Präzise Kontrolle über Minuend und Subtrahend (max. 7 Stellen).
- Entbündelungs-Logik: Der "Math Coach" erklärt explizit den Vorgang des "Leihens" und die daraus resultierende Veränderung der Nachbarstellen.
- Prozess-Steuerung: Manuelle Navigation durch die Berechnungsschritte zur Förderung des algorithmischen Verständnisses.
- Ergebnis-Verifikation: Automatische Berechnung und doppelte Unterstreichung des finalen Differenzwertes.`,

        "multiplikation": `Die schriftliche Multiplikation zerlegt die Berechnung des Produkts zweier Faktoren in Teilprodukte. Jede Ziffer des zweiten Faktors (Multiplikator) wird mit dem ersten Faktor (Multiplikand) multipliziert, wobei die Ergebnisse stellenrichtig untereinander addiert werden.

FEATURES
- Multi-Digit-Support: Berechnung komplexer Produkte mit bis zu 7-stelligen Faktoren.
- Fein-Modus: Ein detaillierter Modus zeigt jede einzelne Ziffernmultiplikation inklusive der internen Übertragsverwaltung.
- Teilprodukt-Summation: Visualisierung der abschließenden Addition aller Zeilen zur Ermittlung des Gesamtergebnisses.
- Farbkodierung: Jede Zeile der Teilrechnung ist farblich mit der entsprechenden Ziffer des Multiplikators verknüpft (z.B. Gold, Lila, Grün).`,

        "dividieren": `Die schriftliche Division ist der komplexeste der vier Grundrechenarten-Algorithmen. Er basiert auf dem wiederholten Schätzen, Multiplizieren, Subtrahieren und "Herunterholen" von Ziffern des Dividenden, um den Quotienten (ggf. mit Rest) zu ermitteln.

FEATURES
- Dividenden-Management: Eingabe von Werten bis zu 7 Stellen; Divisor-Anpassung für verschiedene Schwierigkeitsgrade.
- Rest-Visualisierung: Klare Darstellung von Restwerten am Ende der Berechnung.
- Didaktisches Coaching: Der "Math Coach" führt den Nutzer durch die Fragen "Wie oft passt der Divisor in...?" und die anschließende Probe durch Multiplikation.
- Fehler-Prävention: Visuelle Hinweise bei unmöglichen Rechenschritten oder falscher Stellenplatzierung.`,

        "parabellabor": `Das Labor dient der Untersuchung von Parabeln der Form f(x) = a*(x-d)^2 + e (Scheitelpunktform). Es verdeutlicht den Einfluss der Parameter a (Streckung/Stauchung), d (horizontale Verschiebung) und e (vertikale Verschiebung) auf den Graphen.

FEATURES
- Interaktive Handles: Der Scheitelpunkt S(d|e) und der Streckfaktor a können direkt auf dem Canvas per Maus oder Touch manipuliert werden.
- Duale Formelanzeige: Automatische Umrechnung zwischen der Scheitelpunktform und der Normalform (ax^2 + bx + c).
- Nullstellen-Analyse: Automatische Berechnung und Markierung der reellen Nullstellen (x1, x2) auf der x-Achse.
- Adaptive Skalierung: Das Koordinatensystem passt sich dynamisch an extreme Parameterwerte an.`,

        "mandelbrot_deep": `Die Mandelbrot-Menge entsteht aus der Iteration z_{n+1} = z_n^2 + c mit z_0 = 0 über komplexen c. Bei Julia-Mengen wird c festgehalten und die Iteration aus variierenden Startpunkten betrachtet. Dieses Labor rendert direkt im WebGL-Fragment-Shader – sehr schnell, mit typischer Gleitkomma-Genauigkeit bei extrem hohem Zoom.

FEATURES
- Modus: Mandelbrot und Julia; Julia-Parameter per Steuerelementen bzw. Cursor- Bezug.
- Zoom & Pan: Mausrad zoomen, Shift für feinere Schritte; Ziehen verschiebt die Ebene.
- Iterationen / Detail: Maximale Iterationszahl (Detail vs. Leistung).
- Flight: START FLIGHT zoomt ein; der Blickmittelpunkt folgt der Maus auf dem Canvas.`,

        "pythagoras": `Dieses Labor visualisiert den Satz des Pythagoras (a² + b² = c²) für rechtwinklige Dreiecke. Es demonstriert grafisch, dass die Summe der Flächeninhalte der Quadrate über den Katheten (a und b) exakt dem Flächeninhalt des Quadrats über der Hypotenuse (c) entspricht.

FEATURES
- Interaktive Eckpunkte: Verändern der Dreiecksform durch Ziehen der Punkte A und B unter Beibehaltung des rechten Winkels.
- Flächen-Animation: Dynamische Skalierung der Quadrate synchron zur Veränderung der Seitenlängen.
- Live-Berechnung: Kontinuierliche Anzeige der Werte für a², b² und c² zur numerischen Verifikation der Gleichung.`,

        "eulergerade": `In jedem nicht-gleichseitigen Dreieck liegen der Höhenschnittpunkt (H), der Umkreismittelpunkt (U) und der Schwerpunkt (S) auf einer gemeinsamen Geraden – der Eulergeraden. Zudem ist die Strecke HS stets doppelt so lang wie die Strecke SU (Verhältnis 2:1).

FEATURES
- Konstruktions-Elemente: Ein- und Ausschalten von Umkreis, Inkreis und dem Feuerbach-Kreis.
- Hilfslinien-System: Visualisierung der Höhen, Seitenhalbierenden und Winkelhalbierenden.
- Live-Verhältnisanalyse: Das Dashboard berechnet permanent das HS/SU-Verhältnis.`,

        "pythagorasbeweis": `Dieses Modul bietet einen interaktiven, visuellen Beweis für den Satz des Pythagoras durch Zerlegung und Umordnung. Es nutzt das Prinzip der Ergänzungsgleichheit: Vier kongruente rechtwinklige Dreiecke werden innerhalb eines Quadrats umgeordnet.

FEATURES
- Puzzle-Mechanik: Freies Verschieben und Rotieren der blauen Dreiecks-Elemente.
- Echtzeit-Triangulierung: Das System erkennt automatisch die verbleibenden Freiflächen.
- Kollisions-Detektion: Warnung bei Überlappungen zur Sicherung des Beweises.`,

        "differentiallabor": `Dieses Modul visualisiert den Übergang von der Sekante zur Tangente und damit das Konzept der Ableitung f'(x) als lokale Steigung einer Funktion.

FEATURES
- Funktions-Bibliothek: Auswahl verschiedener Basisfunktionen (quadratisch, trigonometrisch etc.).
- Interaktive Tangente: Verschieben des Berührungspunktes zur Beobachtung der Steigung.
- Ableitungs-Graphen: Visualisierung der ersten und zweiten Ableitung.`,

        "integralreaktor": `Der Integralreaktor dient der Berechnung und Visualisierung des bestimmten Integrals einer Funktion f(x). Er interpretiert das Integral als orientierten Flächeninhalt.

FEATURES
- Dynamische Intervallwahl: Anpassung der Grenzen direkt im Koordinatensystem.
- Numerische Integration: Live-Berechnung des Integralwertes.
- Visuelles Feedback: Die berechnete Fläche wird farblich hervorgehoben.`,

        "steigung": `Das Labor visualisiert die Parameter m (Steigung) und n (y-Achsenabschnitt) der Geradengleichung y = mx + n.

FEATURES
- Handle-Interaktion: Verschieben der Punkte zur Veränderung des Anstiegs.
- Steigungsdreieck: Ein neon-blaues Dreieck zeigt Delta-X und Delta-Y.
- Formel-Synchronisation: Die Gleichung wird in Echtzeit mittels KaTeX aktualisiert.`,

        "winkelsumme": `Die Summe der Innenwinkel in einem n-Eck folgt der Formel (n-2) * 180°. Dieses Labor erlaubt die Verifikation dieses Gesetzes für verschiedene Figuren.

FEATURES
- Polygon-Konfiguration: Umschalten zwischen Dreieck, Viereck, Fünfeck etc.
- Interaktive Eckpunkte: Freies Verschieben der Ecken zur Überprüfung der Invarianz.
- Winkel-Visualisierung: Farbige Bogen-Markierungen an den Innenecken.`,

        "winkelsumme3d": `Dieses Modul demonstriert durch ein virtuelles Falt-Experiment, wie die drei Ecken eines Dreiecks an einem Punkt zusammentreffen und 180° bilden.

FEATURES
- Interaktive Faltung: Stufenlose Steuerung des Faltvorgangs.
- 3D-Navigation: Freies Rotieren und Zoomen im Raum mittels Three.js.
- Dynamische Geometrie: Veränderung der Dreiecksform während der Faltung.`,

        "beweisinwinkellsumme": `Dieser Beweis nutzt Parallelen und Wechselwinkel (Z-Winkel), um die Winkelsumme von 180° im Dreieck herzuleiten.

FEATURES
- Parallelprojektion: Automatische Konstruktion einer Parallelen durch einen Eckpunkt.
- Wechselwinkel-Check: Farbliche Übereinstimmung der Winkel am Pivot-Punkt.
- Live-Synchronisation: Zwei parallele Rechnungen zeigen die Übereinstimmung.`,

        "fermatpunkt": `Der Fermat-Punkt ist der Punkt im Dreieck, für den die Summe der Abstände zu den drei Eckpunkten minimal ist.

FEATURES
- Geometrischer Beweis: Visualisierung der Konstruktion über gleichseitige Dreiecke.
- Distanz-Analyse: Ein freier Vergleichspunkt P zeigt die Differenz zum Minimum.
- Dynamische Eckpunkte: Sofortige Neuberechnung bei Formveränderung.`,

        "winkellabor": `Untersuchung von Winkeln an geschnittenen Parallelen: Scheitel-, Neben-, Stufen- und Wechselwinkel.

FEATURES
- Interaktive Geometrie: Veränderung von Schnittwinkel und Parallelen-Abstand.
- Winkel-Identifikation: Farbliche Kennzeichnung gleicher Winkelpaare.
- Summen-Validierung: Anzeige der Supplementär-Beziehung (180°).`,

        "gleichschenkligesdreieck": `Untersuchung eines Dreiecks mit festem Umfang (u = 8 cm) und der Bedingung der Gleichschenkligkeit.

FEATURES
- Basis-Slider: Veränderung der Basis b mit sofortiger Geometrie-Anpassung.
- Existenz-Check: Prüfung der Dreiecksungleichung mit visueller Warnung.
- Duale Darstellung: Kombination aus Modell und analytischem Graphen.`,

        "potenzlabor": `Untersuchung von Potenzfunktionen f(x) = x^n und deren Umkehrfunktionen (Wurzelfunktionen).

FEATURES
- Exponenten-Tuning: Stufenlose Anpassung von n zur Beobachtung des Wachstums.
- Punkt-Telemetrie: Interaktiver Cursor zeigt exakte (x, y) Koordinaten.
- Symmetrie-Check: Parallele Darstellung von Funktion und Umkehrfunktion.`,

        "transformationen": `Untersuchung von Abbildungen (Translation, Rotation, Spiegelung, Skalierung) auf geometrische Objekte.

FEATURES
- Multi-Abbildungs-System: Kombination verschiedener Transformationen.
- Spiegelungs-Modus: Interaktive Achsen- und Punktspiegelung.
- Flächen-Invarianz: Echtzeit-Check der Flächenerhaltung bei Kongruenz.`,

        "gleichungssysteme": `Grafische Lösung linearer Gleichungssysteme (LGS) als Schnittpunktproblem zweier Geraden.

FEATURES
- Geraden-Manipulation: Veränderung der Gleichungen durch Ziehen der Punkte.
- Notations-Scrambler: Umschalten zwischen Normalform, skaliert und implizit.
- Aufgaben-Generator: Erstellung neuer Szenarien mit ganzzahligen Lösungen.`,

        "imaginarynumbers": `Die Gaußsche Zahlenebene erweitert den eindimensionalen Zahlenstrahl um eine zweite Dimension: die imaginäre Achse. Eine komplexe Zahl z = x + iy wird als Punkt in dieser Ebene dargestellt. Der Abstand zum Ursprung ist der Betrag |z|, und die Wurzel √(z) bzw. das Quadrat z² lassen sich geometrisch als Längen- und Winkelveränderungen interpretieren.

FEATURES
- Interaktiver Vektor: Ziehe den Punkt z frei durch die Ebene.
- Modus-Schalter: Wechsle zwischen r = √(z) und r = z².
- Echtzeit-Algebra: Die Formel-Overlays (Betrag, Realteil, Imaginärteil) passen sich dynamisch an.
- KaTeX-Rendering: Hochwertige mathematische Typografie für alle Formeln.`,

        "binomischeslabor": `Visualisierung der ersten binomischen Formel (a + b)² als geometrische Flächenzerlegung.

FEATURES
- Dynamische Skalierung: Veränderung von a und b direkt am Modell.
- Flächen-Analytik: Echtzeit-Berechnung der Teilflächen (a², b², 2ab).
- KaTeX-Sync: Dynamische Aktualisierung der mathematischen Formel.`,

        "coordinatensystemtester": `Entwicklungs- und Diagnosewerkzeug für die CyberCanvas-Engine zur Prüfung von Projektionen.

FEATURES
- Stress-Test: Pan und Zoom im laufenden Betrieb.
- Funktions-Overlays: Test steiler und asymptotischer Funktionsbereiche.
- Integrität: Validierung der KaTeX-Achsenbeschriftung.`,

        "galtonboard": `Visualisierung der Normalverteilung (Glockenkurve) durch einen stochastischen Galton-Prozess.

FEATURES
- Physikalische Simulation: Echtzeit-Berechnung der Kugel-Kollisionen.
- Histogramm-Akkumulation: Statistische Erfassung der Trefferwahrscheinlichkeit.
- Glockenkurven-Overlay: Vergleich von Theorie und Simulation.`,

        "fourier": `Die Fourier-Transformation erlaubt es, jede periodische Funktion (oder geschlossene Kurve) als Summe von Sinus- und Kosinus-Schwingungen darzustellen. Dieses Labor visualisiert diesen Prozess durch ein System rotierender Kreise (Epizyklen).

FEATURES
- Epizyklen-Visualisierung: Darstellung der komplexen Fourier-Reihe als Kette rotierender Vektoren.
- Approximations-Steuerung: Anpassung der Anzahl der verwendeten Oberschwingungen (n), um die Genauigkeit der Rekonstruktion zu erhöhen.
- Pfad-Tracking: Aufzeichnung der resultierenden Kurve zur Veranschaulichung der Konvergenz gegen die Zielform.
- Zeit-Manipulation: Steuerung der Simulationsgeschwindigkeit zur detaillierten Beobachtung der Phasenbeziehungen.`,

        "lissajous": `Überlagerung zweier harmonischer Schwingungen in x- und y-Richtung erzeugt Lissajous-Figuren.

FEATURES
- Frequenz-Manipulation: Unabhängige Steuerung der Achsen-Frequenzen.
- Phasen-Shift: Untersuchung des Einflusses der zeitlichen Verschiebung.
- 3D-Pendel: Physikalische Analogie als räumliche Schwingung.`,

        "fibonacci": `Visualisierung der Fibonacci-Folge und der daraus resultierenden logarithmischen Spirale.

FEATURES
- Iterations-Steuerung: Beobachtung des Wachstums der Fibonacci-Quadrate.
- Spiral-Konstruktion: Ein- und Ausschalten der geometrischen Spirale.
- Goldener Schnitt: Veranschaulichung der Konvergenz der Glieder-Verhältnisse.`,

        "ausgleichsgerade": `Lineare Regression nach der Methode der kleinsten Quadrate zur Bestimmung von Trends.

FEATURES
- Interaktive Punktwolke: Manuelles Setzen von Datenpunkten.
- Korrelations-Dashboard: Live-Berechnung von r, m und n.
- Fehler-Visualisierung: Anzeige der Standardabweichung als Korridor.`,

        "logikspiel": `Grundlagen der binären Logik: Visualisierung von Gattern wie AND, OR, XOR und NOT.

FEATURES
- Interaktive Eingänge: Umschalten der Input-Zustände per Klick.
- Signalfluss: Leuchtende Verbindungen zeigen den Datenfluss.
- Wahrheitstabellen: Live-Abgleich mit der logischen Definition.`,

        "logikspiel2": `Magisches Quadrat / Zielwert-Rätsel: Logische Belegung von Zellen basierend auf Rand-Summen.

FEATURES
- Rechen-Modi: Umschalten zwischen Addition und Multiplikation.
- Rand-Validierung: Visuelles Feedback bei korrekten Teil-Lösungen.
- Hilfe-System: Erarbeitung von Hinweisen durch kleine Mathe-Aufgaben.`,

        "heart3d": `Visualisierung der Taubin-Herz-Gleichung mittels GPU-basiertem Raymarching (SDF).

FEATURES
- Deformation: Manipulation der Parameter A und B für Formvarianz.
- Holografisches Rendering: Hochperformante Shader-Berechnung.
- Dynamische Formel: Live-Einblendung der algebraischen Gleichung.`,

        "butterfly": `Visualisierung des Butterfly-Effekts anhand des Lorenz-Attraktors (Chaos-Theorie).

FEATURES
- Dynamik-Simulation: Echtzeit-Integration der Lorenz-Gleichungen.
- Parameter-Tuning: Anpassung der Koeffizienten für verschiedene Attraktoren.
- Glow-Engine: Trajektorien als leuchtende Energieströme im Raum.`,

        "litchi3d": `Erzeugung organischer Strukturen durch Sine-Wellen-Modulation eines Signed Distance Fields.

FEATURES
- Reife-Simulation: Dynamische Pigment-Verschiebung im Shader.
- Stachel-Morphologie: Kontrolle über die prozeduralen Oberflächen-Erhebungen.
- SDF-Gleichung: Live-Einblendung der Distanzfunktion d(p).`,

        "triangulierer": `Flächenzerlegung in Dreiecke nach dem Delaunay-Algorithmus zur Netz-Erzeugung.

FEATURES
- Echtzeit-Triangulierung: Sofortige Neuberechnung bei Punkt-Verschiebung.
- Flächen-HUD: Detaillierte Bilanzierung der Einzel- und Gesamtflächen.
- Mehrfach-Selektion: Gruppierung von Messpunkten für Struktur-Checks.`,

        "uhrzeitwinkel": `Berechnung des Bogenwinkels zwischen Stunden- und Minutenzeiger basierend auf deren Geschwindigkeit.

FEATURES
- Präzisions-Einstellung: Stufenlose Justierung der Zeit per Slider.
- Dual-Winkel-Analyse: Anzeige von Innen- (Alpha) und Außenwinkel (Beta).
- Digitale Synchronisation: Abgleich von analoger und digitaler Zeit.`,

        "universe": `Visualisierung des-Ökosystems als dynamische Galaxie mittels Raycasting-Logik.

FEATURES
- Lab-Matrix: Module fliegen aus dem Zentrum auf den Betrachter zu.
- Interaktive Exploration: Fokussierung und Start der Labore per Klick.
- Tiefen-Projektion: Skalierung basierend auf der virtuellen Z-Koordinate.`,

        "easyhard": `ÜBERSICHT:
Modul „easy/hard“ – gestufte Aufgaben oder Schwierigkeitsgrade für gezieltes Training.

FEATURES
- Schwierigkeitswahl: Umschalten zwischen Basis- und Expertenmodus.
- Aufgaben-Matrix: Strukturierte Präsentation didaktischer Einheiten.
- Hilfe-System: Schneller Zugriff auf Kurzinformationen über das Navigations-Icon.`,

        "zahlenerkennung": `KONZEPT:
Künstliche neuronale Netze können lernen. Sie sind nicht programmiert darauf Muster zu erkennen, sie lernen Muster. Hier zeigt Dir das Labor, wie ein KNN geschriebene Zahlen lernt.

FEATURES
- Trainings-Management: Das Netz kann mit verschiedenen Batches von Trainingsdaten trainiert werden.
- Validierung: Teste die Erkennungsrate bei hand- oder mausgeschriebenen Zahlen in Echtzeit.`,

        "tools": `MISSION CONTROL (ZENTRALER LAUNCHER):
Dieses Modul dient als zentrales Betriebssystem und Navigations-Hub der-Labor-Suite. Es bietet einen kuratierten Zugriff auf alle verfügbaren mathematischen und physikalischen Experimente.

FEATURES
- Interaktive Labor-Matrix: Ein dynamisches Gitter-Layout präsentiert alle Module mit hochauflösenden Thumbnails.
- Zentraler Zugriff: Schneller Wechsel zwischen verschiedenen Laboren ohne Umwege.`,

        "ann_labor": `KÜNSTLICHE NEURONALE \n NETZE:
Dieses Labor ermöglicht die tiefe Untersuchung der Architektur und Funktionsweise künstlicher Neuronen. Von der Gewichtsanpassung bis hin zur Aktivierungsfunktion werden alle Prozesse visuell aufbereitet.

FEATURES
- Layer-Konfiguration: Anpassung der Anzahl der Neuronen und Schichten.
- Lernprozess-Visualisierung: Beobachtung der Gewichtsveränderungen während des Trainings.`,

        "cmaes_java": `EVOLUTIONÄRE STRATEGIEN (CMA-ES):
Optimierung komplexer Probleme mittels Kovarianzmatrix-Adaption. Dieses Labor demonstriert die Mächtigkeit stochastischer Optimierungsalgorithmen in der Geometrie und Optik.

FEATURES
- Multidimensionale Suche: Beobachtung der Konvergenz im Parameterraum.
- Echtzeit-Optimierung: Sofortiges Feedback der Fitness-Funktion bei Formänderungen.`,

        "gameoflife": `GAME OF LIFE (Conway, 1970):
Zelluläres Automaten-Universum auf einem 2D-Gitter. Aus drei einfachen Regeln entstehen komplexe Strukturen — stabile Stillleben, periodische Oszillatoren, wandernde Raumschiffe, sogar Gleiter-Kanonen.

REGELN
- Eine lebende Zelle mit weniger als 2 Nachbarn stirbt (Einsamkeit).
- Eine lebende Zelle mit 2 oder 3 Nachbarn überlebt.
- Eine lebende Zelle mit mehr als 3 Nachbarn stirbt (Überbevölkerung).
- Eine tote Zelle mit genau 3 Nachbarn wird geboren.

FEATURES
- SPIEL-Tab: Großes Spielfeld, Maus zum Malen, Tastatur-Shortcuts (Space, N, R, C, W, G/B/P/S, +/-).
- MUSTER-Tab: 12 klassische Pattern aus 5 Familien (Stillleben, Oszillatoren, Raumschiffe, Guns, Methusalems) mit Live-Mini-Simulation pro Karte. Karte anklicken → Sidebar-Button "IN SIMULATION" startet sie zentriert im großen Feld.
- Farbverlauf nach Alter: junge Zellen cyan → gelb → orange → rot (alt). Sterbende Zellen hinterlassen ein rotes Glühen.
- Torus-Welt (W toggelt zu Wänden): das Spielfeld wickelt sich an den Rändern um.`,

        "reaction-diffusion": `Reaction-Diffusion-Systeme modellieren das Wechselspiel zweier chemischer Stoffe U und V, die gleichzeitig (a) ineinander reagieren und (b) im Raum diffundieren. Das Labor implementiert das klassische Gray-Scott-Modell auf einem toroidalen 2D-Gitter. Aus minimalen lokalen Regeln entstehen global Muster wie Streifen, Flecken, Labyrinthe, Wirbel und sich selbst replizierende „Pillen" — verwandt mit Turing-Mustern in Biologie (Fellzeichnung, Korallen, Embryogenese).

Gleichungen pro Zelle:
- ∂u/∂t = Du · ∇²u − u·v² + F·(1 − u)
- ∂v/∂t = Dv · ∇²v + u·v² − (F + k)·v

FEATURES
- 16 Presets (Wirbel, Pillen, Streifen, Wellen, Flecken, Tupfen, Gitter, Chaos, Nebel, Koralle, Flocken, Schlangen, Pulsierend, Adern, Labyrinth, Bienenwabe).
- 5 Farbschemata (Feuer, Eis, Grün, Violett, Graustufen).
- Live-Interaktion: Maus/Touch „malt" Konzentration von V direkt ins Feld.
- Periodische Randbedingungen (Torus) — Muster wachsen nahtlos über die Ränder.
- Step-Counter zeigt Anzahl der Iterationen rechts unten.

PARAMETER
- PRESET — Vordefinierte (F, k, Du, Dv)-Kombinationen. Quick-Start in stabile Musterklassen, ohne die sehr empfindliche Parameterlandschaft selbst absuchen zu müssen.
- FARBE — Reine Visualisierung; greift nicht in die Simulation ein. Mappt die Konzentration v ∈ [0,1] auf eine Farbe mit Gamma 0.6.
- FEED (F) [0.005 – 0.090] — „Nachschub"-Rate für U. F·(1−u) füllt U permanent auf. Hohes F = aggressives Wachstum von V, kleine isolierte Flecken; niedriges F = ruhigere, größere Strukturen.
- KILL (k) [0.025 – 0.080] — Zerfallsrate für V. (F+k)·v frisst V auf. Höheres k = V stirbt schneller, dünnere/sparsamere Muster; niedrigeres k = überlebt großflächig. Nur ein schmaler Streifen im (F,k)-Raum erzeugt überhaupt Muster — außerhalb wird alles uniform.
- DIFFUSION U [0.01 – 1.0] — Wie schnell U sich räumlich ausbreitet (∇²u-Vorfaktor). Typisch ≈ 0.16. Größer = U glättet schneller, schärfere V-Strukturen verschwimmen.
- DIFFUSION V [0.005 – 0.5] — Diffusion von V. Typisch ≈ 0.08 — also rund halb so schnell wie Du. Genau diese Asymmetrie Du > Dv ist die Ursache der Muster (Turing-Instabilität). Bei Du ≈ Dv verschwindet die Strukturbildung.
- GESCHWINDIGKEIT [1 – 10] — Wie viele Simulationsschritte pro gezeichnetem Frame. Rein Performance/Zeitraffer — verändert die Physik nicht, nur wie schnell wir den Verlauf sehen.
- PINSEL [2 – 30] — Radius (in Gitterzellen) der Maus-/Touch-Aussaat. Beim Klick wird V lokal erhöht, U reduziert — neue „Reaktions-Keime".

STEUERUNG
- PAUSE/PLAY — Simulation anhalten / fortsetzen.
- RESET — Feld neu initialisieren (U=1, V=0, ein V-Tropfen in der Mitte).
- LEEREN — Feld auf gleichmäßigen Grundzustand (U=1, V=0); danach manuell säen.
- SÄEN — Setzt einen V-Tropfen in die Mitte.
- Maus / Finger ziehen — kontinuierliches Einzeichnen von V.`
};