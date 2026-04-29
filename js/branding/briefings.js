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
Adaptives ULTRA-Layout, das den horizontalen Platzbedarf der Division und den vertikalen Prozessfluss optimal ausnutzt.`,

    "pythagoras": `MATHEMATISCHER HINTERGRUND:
Dieses Labor visualisiert den Satz des Pythagoras (a² + b² = c²) für rechtwinklige Dreiecke. Es demonstriert grafisch, dass die Summe der Flächeninhalte der Quadrate über den Katheten (a und b) exakt dem Flächeninhalt des Quadrats über der Hypotenuse (c) entspricht.

FEATURES & STEUERUNG:
- Interaktive Eckpunkte: Verändern der Dreiecksform durch Ziehen der Punkte A und B unter Beibehaltung des rechten Winkels.
- Flächen-Animation: Dynamische Skalierung der Quadrate synchron zur Veränderung der Seitenlängen.
- Live-Berechnung: Kontinuierliche Anzeige der Werte für a², b² und c² zur numerischen Verifikation der Gleichung.
- Rechtwinkel-Garantie: Das System erzwingt die Orthogonalität der Katheten zur Wahrung der mathematischen Korrektheit.

INTERFACE:
Didaktisch fokussiertes ULTRA-Labor mit kontraststarken Flächenfarben und klarer geometrischer Führung.`,

    "pythagorasbeweis": `MATHEMATISCHER HINTERGRUND:
Dieses Modul bietet einen interaktiven, visuellen Beweis für den Satz des Pythagoras durch Zerlegung und Umordnung. Es nutzt das Prinzip der Ergänzungsgleichheit: Vier kongruente rechtwinklige Dreiecke werden innerhalb eines Quadrats so angeordnet, dass die verbleibende Fläche entweder dem Quadrat über der Hypotenuse oder den beiden Quadraten über den Katheten entspricht.

FEATURES & STEUERUNG:
- Puzzle-Mechanik: Freies Verschieben und Rotieren der blauen Dreiecks-Elemente innerhalb des Zielrahmens.
- Echtzeit-Triangulierung: Das System erkennt automatisch die verbleibenden Freiflächen und berechnet deren Inhalt durch komplexe Polygon-Zerlegung.
- Kollisions-Detektion: Visuelle Warnung bei Überlappungen der Elemente, um die Integrität des Beweises zu sichern.
- Flächen-Summen-HUD: Ein detailliertes Display bilanziert alle Einzel-Dreiecke gegen die Ziel-Quadratfläche.

INTERFACE:
Hochgradig interaktives ULTRA-Labor, das Spielmechanik mit tiefgreifender geometrischer Logik verbindet.`,

    "winkelsumme": `MATHEMATISCHER HINTERGRUND:
Die Summe der Innenwinkel in einem n-Eck (Polygon) folgt der Formel (n-2) * 180°. Dieses Labor erlaubt die Verifikation dieses Gesetzes für verschiedene Figuren – vom Dreieck (180°) bis hin zu komplexen Vielecken.

FEATURES & STEUERUNG:
- Polygon-Konfiguration: Schnelles Umschalten zwischen verschiedenen n-Ecken (Dreieck, Viereck, Fünfeck etc.) über die Sidebar.
- Interaktive Eckpunkte: Freies Verschieben der Ecken zur Überprüfung der Invarianz der Winkelsumme gegenüber Formveränderungen.
- Winkel-Visualisierung: Farbige Bogen-Markierungen an den Innenecken inklusive Live-Winkelanzeige in Grad.
- Summen-Validierung: Das System kumuliert alle Einzelwinkel und gleicht das Ergebnis permanent mit der theoretischen Summe ab.

INTERFACE:
Klares, geometrisch fokussiertes ULTRA-Design mit neonfarbenen Winkelsegmenten und einem detaillierten Analyse-Log.`,

    "winkelsumme3d": `MATHEMATISCHER HINTERGRUND:
Dieses Modul erweitert den klassischen Innenwinkelsatz (Summe = 180°) in die dritte Dimension. Es demonstriert durch ein virtuelles Falt-Experiment, wie die drei Ecken eines beliebigen Dreiecks exakt an einem Punkt der Grundseite zusammentreffen und so einen gestreckten Winkel bilden.

FEATURES & STEUERUNG:
- Interaktive Faltung: Stufenlose Steuerung des Faltvorgangs vom flachen Dreieck bis zum kollabierten Zustand.
- 3D-Navigation: Freies Rotieren und Zoomen im Raum mittels Three.js-Engine zur Untersuchung der Faltkanten.
- Dynamische Geometrie: Veränderung der Dreiecksform durch horizontalen Versatz der Spitze zur Verifikation der Allgemeingültigkeit.
- Winkel-Synchronisation: Echtzeit-Anzeige der Einzelwinkel und deren konstanter Summe während der Transformation.

INTERFACE:
Hochmodernes 3D-ULTRA-Design mit transparenten Materialeffekten und präziser räumlicher Projektion.`,

    "beweisinwinkellsumme": `MATHEMATISCHER HINTERGRUND:
Dieser mathematische Beweis nutzt die Eigenschaften von Parallelen und Wechselwinkeln (Z-Winkel). Durch das Zeichnen einer Parallelen zu einer Dreiecksseite durch den gegenüberliegenden Eckpunkt wird gezeigt, dass die drei Innenwinkel zusammen einen gestreckten Winkel von 180° bilden.

FEATURES & STEUERUNG:
- Parallelprojektion: Automatische Konstruktion einer Parallelen durch einen wählbaren Pivot-Punkt (A, B oder C).
- Wechselwinkel-Check: Die farbliche Übereinstimmung der Winkel am Pivot-Punkt mit den Winkeln im Dreieck visualisiert die Identität der Wechselwinkel.
- Beweis-Synchronisation: Zwei parallele Rechnungen zeigen die Summe am Pivot und die Summe im Dreieck, die beide stets 180° ergeben.
- Pivot-Umschaltung: Der Beweis kann flexibel durch jeden der drei Eckpunkte geführt werden.

INTERFACE:
Didaktisch optimiertes ULTRA-Labor mit KaTeX-gestützter Beweisführung und dynamisch mitgeführten Winkelwerten.`,

    "eulergerade": `MATHEMATISCHER HINTERGRUND:
In jedem nicht-gleichseitigen Dreieck liegen der Höhenschnittpunkt (H), der Umkreismittelpunkt (U) und der Schwerpunkt (S) auf einer gemeinsamen Geraden – der Eulergeraden. Zudem ist die Strecke HS stets doppelt so lang wie die Strecke SU (Verhältnis 2:1).

FEATURES & STEUERUNG:
- Konstruktions-Elemente: Ein- und Ausschalten von Umkreis, Inkreis und dem Feuerbach-Kreis (9-Punkte-Kreis).
- Hilfslinien-System: Visualisierung der Höhen, Seitenhalbierenden und Winkelhalbierenden zur Identifikation der Schnittpunkte.
- Live-Verhältnisanalyse: Das Dashboard berechnet permanent das HS/SU-Verhältnis und validiert damit den mathematischen Satz in Echtzeit.
- Interaktive Eckpunkte: Die Punkte A, B und C können frei verschoben werden, wobei die geometrische Konsistenz der Eulergeraden gewahrt bleibt.

INTERFACE:
Hochpräzises geometrisches Labor im ULTRA-Standard mit farblich differenzierten Punkten und Kreisen für maximale Analyse-Tiefe.`,

    "fermatpunkt": `MATHEMATISCHER HINTERGRUND:
Der Fermat-Punkt eines Dreiecks ist der Punkt, für den die Summe der Abstände zu den drei Eckpunkten minimal ist. Er ist von zentraler Bedeutung für Optimierungsprobleme (z.B. Standortplanung). Bei Dreiecken mit Winkeln unter 120° ist er der Punkt, von dem aus alle Seiten unter einem Winkel von 120° erscheinen.

FEATURES & STEUERUNG:
- Geometrischer Beweis: Visualisierung der Konstruktion über gleichseitige Dreiecke an den Seiten des Hauptdreiecks (Napoleon-Dreiecke).
- Distanz-Analyse: Ein optionaler freier Punkt P erlaubt den manuellen Vergleich der Abstandssumme mit dem theoretischen Minimum des Fermat-Punktes.
- Interaktive Dynamik: Ziehen der Eckpunkte verändert sofort die Lage des Fermat-Punktes und die zugehörigen Konstruktionslinien.
- Mathematische Schärfe: Das Labor erkennt automatisch den Fall von Winkeln > 120°, bei dem der Fermat-Punkt mit dem entsprechenden Eckpunkt zusammenfällt.

INTERFACE:
Cyber-Interface mit lila hervorgehobenem Fermat-Punkt und gestrichelten Verbindungslinien (Connectors) zur Distanzvisualisierung.`,

    "winkellabor": `MATHEMATISCHER HINTERGRUND:
Dieses Labor untersucht die Gesetzmäßigkeiten von Winkeln an geschnittenen Parallelen. Es visualisiert fundamentale Beziehungen wie Scheitelwinkel, Nebenwinkel, Stufenwinkel (f-Winkel) und Wechselwinkel (z-Winkel).

FEATURES & STEUERUNG:
- Interaktive Geometrie: Veränderung des Schnittwinkels und des Abstands der Parallelen durch Verschieben der Ankerpunkte.
- Dynamische Winkel-Identifikation: Farbliche Kennzeichnung gleicher Winkelpaare (Alpha, Beta, Gamma, Delta) zur intuitiven Erkennung von Identitäten.
- Summen-Validierung: Anzeige der Winkelsumme von Nebenwinkeln (180°) zur Verifikation der Supplementär-Beziehung.
- Briefing-HUD: Kontextsensitive Erklärungen zu den verschiedenen Winkelarten im Seitenpanel.

INTERFACE:
Übersichtliches ULTRA-Labor für das Erlernen der Basiskonzepte der Ebenengeometrie.`,

    "gleichschenkligesDreieck": `MATHEMATISCHER HINTERGRUND:
In diesem Labor wird ein Dreieck mit festem Umfang (u = 8 cm) untersucht. Durch die Bedingung der Gleichschenkligkeit reduziert sich das System auf einen Freiheitsgrad: Die Veränderung der Basis b bestimmt zwangsläufig die Länge der Schenkel s.

FEATURES & STEUERUNG:
- Interaktives Modell: Veränderung der Basis b per Slider mit sofortiger Auswirkung auf die Dreiecksgeometrie.
- Existenz-Validierung: Prüfung der Dreiecksungleichung (Summe zweier Seiten muss größer als die dritte sein) mit visuellem Warnhinweis bei Kollaps.
- Duale Darstellung: Kombination aus geometrischem Modell und analytischem Graphen (Basis vs. Schenkellänge).
- Analytisches Dashboard: Live-Berechnung aller Seitenlängen und Anzeige des Gültigkeitsbereichs.

INTERFACE:
Minimalistisches ULTRA-Labor mit Fokus auf die Kopplung von geometrischen Formen und funktionalen Zusammenhängen.`,

    "differentiallabor": `MATHEMATISCHER HINTERGRUND:
Dieses Modul visualisiert den Übergang von der Sekante zur Tangente und damit das Konzept der Ableitung f'(x) als lokale Steigung einer Funktion. Es veranschaulicht den Zusammenhang zwischen Funktionsverlauf, Steigung und Krümmung.

FEATURES & STEUERUNG:
- Funktions-Bibliothek: Auswahl verschiedener Basisfunktionen (linear, quadratisch, kubisch, trigonometrisch).
- Interaktive Tangente: Verschieben des Berührungspunktes x₀ zur Beobachtung der Steigungsänderung in Echtzeit.
- Ableitungs-Graphen: Zuschaltbare Visualisierung der ersten Ableitung f'(x) und der zweiten Ableitung f''(x).
- Steigungs-Telemetrie: Präzise Anzeige der numerischen Ableitungswerte am aktuellen Punkt.

INTERFACE:
Professionelles ULTRA-Analyse-Interface mit CyberCanvas-Integration und hochauflösenden Funktions-Plots.`,

    "integralreaktor": `MATHEMATISCHER HINTERGRUND:
Der Integralreaktor dient der Berechnung und Visualisierung des bestimmten Integrals einer Funktion f(x) im Intervall [a, b]. Er veranschaulicht den Hauptsatz der Differential- und Integralrechnung durch die Interpretation des Integrals als orientierter Flächeninhalt.

FEATURES & STEUERUNG:
- Dynamische Intervallwahl: Anpassung der Integrationsgrenzen a und b direkt im Koordinatensystem oder per Slider.
- Funktions-Reaktor: Auswahl verschiedener mathematischer Modelle (Parabeln, trigonometrische Kurven, Exponentialfunktionen).
- Numerische Integration: Live-Berechnung des Integralwertes inklusive Fehlerabschätzung bei komplexen Verläufen.
- Visuelle Feedback-Schleife: Die berechnete Fläche wird farblich hervorgehoben und das Ergebnis mittels KaTeX-Notation im Dashboard angezeigt.

INTERFACE:
Hochmodernes ULTRA-Design mit Fokus auf numerische Präzision und grafische Klarheit; ideal für die Untersuchung von Flächenbilanzen.`,

    "parabellabor": `MATHEMATISCHER HINTERGRUND:
Das Labor dient der Untersuchung von Parabeln der Form f(x) = a*(x-d)^2 + e (Scheitelpunktform). Es verdeutlicht den Einfluss der Parameter a (Streckung/Stauchung), d (horizontale Verschiebung) und e (vertikale Verschiebung) auf den Graphen.

FEATURES & STEUERUNG:
- Interaktive Handles: Der Scheitelpunkt S(d|e) und der Streckfaktor a können direkt auf dem Canvas per Maus oder Touch manipuliert werden.
- Duale Formelanzeige: Automatische Umrechnung zwischen der Scheitelpunktform und der Normalform (ax^2 + bx + c).
- Nullstellen-Analyse: Automatische Berechnung und Markierung der reellen Nullstellen (x1, x2) auf der x-Achse.
- Adaptive Skalierung: Das Koordinatensystem passt sich dynamisch an extreme Parameterwerte an.

INTERFACE:
Klares ULTRA-Design mit KaTeX-Formeln, die direkt am Scheitelpunkt "kleben" und sich bei jeder Interaktion aktualisieren.`,

    "steigung": `MATHEMATISCHER HINTERGRUND:
Das Labor visualisiert die Parameter m (Steigung) und n (y-Achsenabschnitt) der allgemeinen Geradengleichung y = mx + n. Es verdeutlicht das Konzept des Steigungsdreiecks als Quotient aus vertikaler (Delta-Y) und horizontaler (Delta-X) Differenz.

FEATURES & STEUERUNG:
- Handle-Interaktion: Dynamisches Verschieben der Punkte P1 und P2 zur Veränderung des Anstiegs m.
- Steigungsdreieck-Visualisierung: Ein neon-blaues Dreieck zeigt die katheten-basierte Herleitung der Steigung.
- Formel-Synchronisation: Die Geradengleichung wird in Echtzeit mittels KaTeX aktualisiert und spiegelt jede Parameter-Änderung wider.
- n-Achsen-Korrektur: Untersuchung des Einflusses des Achsenabschnitts n auf die vertikale Position der Geraden.

INTERFACE:
Analytisches ULTRA-Interface mit Fokus auf die Kopplung von algebraischen Werten und geometrischer Darstellung.`,

    "potenzlabor": `MATHEMATISCHER HINTERGRUND:
Das Labor untersucht Potenzfunktionen der Form f(x) = x^n und deren Umkehrfunktionen (Wurzelfunktionen) g(x) = sqrt_n(x). Es verdeutlicht das Wachstumsverhalten für verschiedene Exponenten n sowie die Spiegelung an der Winkelhalbierenden.

FEATURES & STEUERUNG:
- Exponenten-Tuning: Stufenlose Anpassung des Exponenten n zur Beobachtung von Krümmung und Steilheit.
- Punkt-Telemetrie: Ein interaktiver Cursor zeigt die exakten Koordinaten (x, y) und deren Entsprechungen auf der Umkehrfunktion an.
- Multi-Funktions-Ansicht: Parallele Darstellung von f(x) und g(x) zur Untersuchung von Symmetrie-Eigenschaften.
- Dynamische Formel-Tags: Schwebende KaTeX-Labels folgen dem Cursor und visualisieren die aktuelle Berechnung.

INTERFACE:
Analytisches ULTRA-Interface mit Fokus auf den direkten Vergleich von Funktionsklassen und deren numerischer Präzision.`,

    "transformationen": `MATHEMATISCHER HINTERGRUND:
Dieses Modul untersucht die Auswirkungen von Abbildungen auf geometrische Objekte (Dreiecke). Es unterscheidet zwischen kongruenten Abbildungen (Translation, Rotation, Spiegelung), die Form und Fläche erhalten, und Ähnlichkeitsabbildungen (Skalierung).

FEATURES & STEUERUNG:
- Multi-Abbildungs-System: Kombination von Verschiebung (Translation), Drehung um einen Referenzpunkt und Skalierung.
- Spiegelungs-Modus: Interaktive Achsenspiegelung und Punktspiegelung zur Untersuchung von Symmetrie-Eigenschaften.
- Flächen-Äquivalenz: Echtzeit-Berechnung des Flächeninhalts zur Verifikation der Erhaltungseigenschaften bei Kongruenzabbildungen.
- Chaining-Effekte: Iterative Anwendung verschiedener Transformationen zur Erzeugung komplexer Bildfolgen.

INTERFACE:
Hochgradig interaktives ULTRA-Labor für die Untersuchung fundamentaler Abbildungsgeometrie.`,

    "gleichungssysteme": `MATHEMATISCHER HINTERGRUND:
Ein lineares Gleichungssystem mit zwei Unbekannten lässt sich grafisch als Schnittproblem zweier Geraden interpretieren. Der Schnittpunkt S(x|y) stellt die gemeinsame Lösung beider Gleichungen dar.

FEATURES & STEUERUNG:
- Dynamische Geraden-Manipulation: Veränderung der Geraden durch Verschieben von zwei Stützpunkten oder Rotation um einen Punkt.
- Notations-Scrambler: Umschalten zwischen verschiedenen Darstellungsformen der Gleichungen (Normalform, Skaliert, Implizit), um die Abstraktionsfähigkeit zu schulen.
- Magnet-Snap: Optionales Einrasten der Punkte auf ganzzahligen Koordinaten zur Erleichterung der Aufgabenstellung.
- Aufgaben-Generator: Erstellt per Klick neue LGS-Szenarien mit ganzzahligen Lösungen.

INTERFACE:
Hochfunktionales ULTRA-Design mit Fokus auf die algebraische Entsprechung der geometrischen Lage; inklusive Live-Lösungsanzeige.`,

    "binomischeslabor": `MATHEMATISCHER HINTERGRUND:
Das Labor visualisiert die erste binomische Formel (a + b)² = a² + 2ab + b² als geometrische Flächenzerlegung. Ein Quadrat mit der Seitenlänge (a+b) wird in vier Teilflächen zerlegt: zwei Quadrate (a², b²) und zwei identische Rechtecke (ab).

FEATURES & STEUERUNG:
- Dynamische Skalierung: Veränderung der Parameter a und b per Slider oder direktem Ziehen am Canvas.
- Flächen-Analytik: Echtzeit-Berechnung der Einzel- und Gesamtflächen zur Verifikation der algebraischen Identität.
- Visuelle Korrespondenz: Farbliche Kodierung der Terme in der Formel und ihrer Entsprechungen im geometrischen Modell.
- KaTeX-Synchronisation: Die mathematische Formel aktualisiert sich dynamisch bei jeder Parameter- Änderung.

INTERFACE:
Klares ULTRA-Design mit Fokus auf die duale Repräsentation von Algebra und Geometrie; inklusive leuchtender Flächen-Labels.`,

    "galtonboard": `MATHEMATISCHER HINTERGRUND:
Das Galtonboard visualisiert das Entstehen der Normalverteilung (Glockenkurve) durch einen stochastischen Prozess. Jede Kugel trifft auf eine Reihe von Hindernissen und entscheidet sich bei jedem Stoß mit einer Wahrscheinlichkeit von p=0,5 für die linke oder rechte Seite.

FEATURES & STEUERUNG:
- Physikalische Simulation: Echtzeit-Berechnung der Kugel-Kollisionen und Trajektorien.
- Statistische Akkumulation: Visualisierung der Trefferhäufigkeit in den Ziel-Slots als Histogramm.
- Normalverteilungs-Overlay: Einblendung der theoretischen Glockenkurve zum direkten Vergleich mit den Simulationsdaten.
- Geschwindigkeits-Boost: Beschleunigte Simulation zur schnellen Generierung großer Datenmengen (Gesetz der großen Zahlen).

INTERFACE:
Dynamisches ULTRA-Interface mit integriertem Ziffern-Widget für die Kugelzählung und flüssigen physikalischen Animationen.`,

    "fourier": `MATHEMATISCHER HINTERGRUND:
Dieses Labor demonstriert die Fourier-Analyse, nach der jede periodische Funktion als Summe von Sinus- und Kosinusfunktionen dargestellt werden kann. Es visualisiert das Prinzip durch rotierende Vektoren (Epizyklen), die jede beliebige geschlossene Kurve in der komplexen Ebene zeichnen können.

FEATURES & STEUERUNG:
- Epizyklen-Visualisierung: Darstellung der komplexen Fourier-Reihe als Kette rotierender Vektoren.
- Approximations-Steuerung: Anpassung der Anzahl der verwendeten Oberschwingungen (n), um die Genauigkeit der Rekonstruktion zu erhöhen.
- Pfad-Tracking: Aufzeichnung der resultierenden Kurve zur Veranschaulichung der Konvergenz gegen die Zielform.
- Zeit-Manipulation: Steuerung der Simulationsgeschwindigkeit zur detaillierten Beobachtung der Phasenbeziehungen.

INTERFACE:
Hochkomplexes ULTRA-Design mit Fokus auf die Ästhetik mathematischer Schwingungsprozesse und Echtzeit-Frequenz-Analytik.`,

    "lissajous": `MATHEMATISCHER HINTERGRUND:
Lissajous-Figuren entstehen durch die Überlagerung zweier harmonischer Schwingungen in x- und y-Richtung. Die resultierenden Kurven hängen entscheidend vom Frequenzverhältnis (a:b) und der Phasendifferenz (phi) ab.

FEATURES & STEUERUNG:
- Frequenz-Manipulation: Unabhängige Steuerung der Schwingfrequenzen für die horizontale und vertikale Achse.
- Phasen-Shift: Untersuchung des Einflusses der zeitlichen Verschiebung auf die Kurvenform (von Geraden über Ellipsen bis zu komplexen Knoten).
- Formel-Overlay: Permanente Einblendung der zugrunde liegenden Sinus-Gleichungen inklusive Echtzeit-Parameterwerten.
- Pendel-Modus: Simulation des physikalischen Ursprungs als gekoppelte Schwingungen.

INTERFACE:
Ästhetisch anspruchsvolles ULTRA-Design mit leuchtenden Trajektorien und einem detaillierten Analyse-Panel für Frequenzverhältnisse.`,

    "mandelbrot": `MATHEMATISCHER HINTERGRUND:
Die Mandelbrot-Menge ist das bekannteste Fraktal der Mathematik. Sie wird durch die iterative Folge z_{n+1} = z_n^2 + c in der komplexen Zahlenebene definiert. Punkte c, für die die Folge beschränkt bleibt, gehören zur Menge.

FEATURES & STEUERUNG:
- Fraktale Exploration: Interaktives Navigieren durch die komplexe Ebene zur Entdeckung selbstähnlicher Strukturen.
- Farb-Mapping: Visualisierung der Divergenzgeschwindigkeit durch ästhetische Farbverläufe (Escape-Time-Algorithmus).
- Präzisions-Zoom: Untersuchung der unendlichen Komplexität an den Rändern der Menge.
- ULTRA-V6-Engine: Hochperformante Berechnung der Iterationen direkt im Browser-Canvas.

INTERFACE:
Minimalistisches ULTRA-Design, das die mathematische Schönheit des Fraktals ohne störende UI-Elemente in den Vordergrund stellt.`,

    "fibonacci": `MATHEMATISCHER HINTERGRUND:
Die Fibonacci-Folge (0, 1, 1, 2, 3, 5, 8, ...) ist durch das Bildungsgesetz f(n) = f(n-1) + f(n-2) definiert. Das Verhältnis aufeinanderfolgender Glieder nähert sich dem Goldenen Schnitt (ca. 1,618) an. Dieses Labor visualisiert den Zusammenhang zwischen der Zahlenfolge und der daraus resultierenden logarithmischen Spirale.

FEATURES & STEUERUNG:
- Iterations-Steuerung: Erhöhung der Folgenglieder (Schritte), um das exponentielle Wachstum der Quadrate zu beobachten.
- Spiral-Visualisierung: Ein- und Ausschalten der Fibonacci-Spirale, die durch Kreisbögen innerhalb der Quadrate konstruiert wird.
- Analytik-Widget: Live-Berechnung der Flächeninhalte und des aktuellen Verhältnisses der letzten beiden Glieder zur Veranschaulichung der Konvergenz zum Goldenen Schnitt.
- Zen-Modus: Eine minimalistische Ansicht für eine ästhetische Betrachtung der mathematischen Harmonie.

INTERFACE:
Elegantes ULTRA-Design mit Fokus auf geometrische Proportionen und flüssige Animationen beim Skalieren der Folge.`,

    "ausgleichsgerade": `MATHEMATISCHER HINTERGRUND:
Das Labor visualisiert das Verfahren der linearen Regression. Ziel ist es, eine Gerade so durch eine Punktwolke zu legen, dass die Summe der Quadrate der vertikalen Abstände (Residuen) zwischen den Punkten und der Geraden minimiert wird (Methode der kleinsten Quadrate).

FEATURES & STEUERUNG:
- Interaktive Punktwolke: Manuelles Setzen und Verschieben von Datenpunkten zur Untersuchung der Auswirkungen auf die Regression.
- Analytik-Dashboard: Live-Berechnung des Korrelationskoeffizienten (r), der Steigung (m) und des Achsenabschnitts (n).
- Fehler-Visualisierung: Anzeige der Standardabweichung (SD) als schattierter Korridor um die Regressionsgerade.
- Daten-Manipulation: Funktionen wie "Punkte näher" oder "Punkte weiter" skalieren die Residuen, um den Einfluss von Streuung auf die Korrelation zu demonstrieren.

INTERFACE:
Hochpräzises Statistik-Tool im ULTRA-Standard mit Echtzeit-Telemetrie und KaTeX-Integration für die mathematische Notation.`,

    "logikspiel": `MATHEMATISCHER HINTERGRUND:
Die Basis moderner Computerarchitektur ist die binäre Logik (0 und 1). Dieses Labor visualisiert die grundlegenden logischen Verknüpfungen (Gatter) wie AND, OR, NOT, NAND und XOR. Durch Kombination dieser Gatter lassen sich komplexe Schaltungen wie Addierer realisieren.

FEATURES & STEUERUNG:
- Interaktive Eingänge: Umschalten der Input-Zustände (An/Aus) per Klick.
- Signalfluss-Visualisierung: Leuchtende Verbindungen zeigen den aktiven Datenfluss durch die Gatter-Struktur.
- Wahrheitstabellen: Live-Abgleich der aktuellen Konstellation mit der mathematischen Definition des Gatters.
- Gatter-Exploration: Untersuchung der Invertierung (NAND/NOR) und der Exklusivität (XOR).

INTERFACE:
Futuristisches Schaltungs-Design im ULTRA-Standard mit klarer Signal-Hervorhebung und intuitivem Interface für logische Experimente.`,

    "heart3d": `MATHEMATISCHER HINTERGRUND:
Dieses Labor visualisiert die Taubin-Herz-Gleichung, eine algebraische Fläche 6. Ordnung. Die Darstellung erfolgt mittels Raymarching-Algorithmen, die Signed Distance Fields (SDF) in Echtzeit auf der GPU berechnen.

FEATURES & STEUERUNG:
- Algebraische Deformation: Manipulation der Parameter A (vertikale Stauchung) und B (Oberflächen-Modulation) zur Untersuchung der Formvarianz.
- Holografisches Rendering: Hochperformante Shader-Berechnung für flüssige 3D-Interaktion und präzise Oberflächen-Details.
- Dynamische Formel-Analyse: Die zugrunde liegende Gleichung wird live mittels KaTeX eingeblendet und reflektiert jede Parameteränderung farbkodiert.
- 3D-Navigation: Intuitive Orbit-Steuerung zur Untersuchung der komplexen Krümmungen aus jedem Blickwinkel.

INTERFACE:
Futuristisches ULTRA-Design mit Fokus auf die Symbiose von komplexer Algebra und ästhetischer 3D-Grafik.`,

    "butterfly": `MATHEMATISCHER HINTERGRUND:
Dieses Labor visualisiert den Butterfly-Effekt (Schmetterlingseffekt) anhand des Lorenz-Attraktors. Es handelt sich um ein System von drei gekoppelten, nichtlinearen Differentialgleichungen. Eine winzige Änderung der Anfangsbedingungen führt bei solchen Systemen nach kurzer Zeit zu völlig unterschiedlichen Ergebnissen – das Kernmerkmal des deterministischen Chaos.

FEATURES & STEUERUNG:
- Dynamik-Simulation: Echtzeit-Integration der Lorenz-Gleichungen mit einstellbarer Simulationsgeschwindigkeit.
- Parameter-Tuning: Anpassung der Koeffizienten (Exp Amp, Cos Amp etc.), um verschiedene Phasenräume und Attraktor-Formen zu erkunden.
- Glow-Engine: Ein zuschaltbarer Bloom-Effekt visualisiert die Trajektorien als leuchtende Energieströme im Raum.
- Auto-Reset: Setzt das System bei instabilen Zuständen automatisch auf sichere Startparameter zurück.

INTERFACE:
Cinematisches ULTRA-Design mit schwebendem KaTeX-Panel, das die zugrunde liegenden Differentialgleichungen permanent einblendet.`,

    "litchi3d": `MATHEMATISCHER HINTERGRUND:
Das Litchi-Labor demonstriert die algorithmische Erzeugung organischer Strukturen durch prozedurale Geometrie. Die komplexe Oberflächenbeschaffenheit wird durch eine Sine-Wellen-Modulation eines Signed Distance Fields (SDF) erreicht, die biomimetische Muster simuliert.

FEATURES & STEUERUNG:
- Reife-Simulation: Dynamische Pigment-Verschiebung des Shaders zur Visualisierung biologischer Reifeprozesse.
- Stachel-Morphologie: Kontrolle über die Amplitude der prozeduralen Erhebungen zur Untersuchung von Fraktal-ähnlichen Oberflächenspannungen.
- Form-Faktor: Skalierung der algebraischen Primitiv-Objekte entlang der Y-Achse zur Erforschung morphologischer Varianten.
- SDF-Gleichung: Live-Einblendung der Distanzfunktion d(p) inklusive Farbhervorhebung der aktiven Parameter.

INTERFACE:
Organisch inspiriertes ULTRA-Design; nutzt hochperformantes Raymarching zur Darstellung komplexer, algorithmisch definierter Biosphären.`,

    "triangulierer": `MATHEMATISCHER HINTERGRUND:
Die Triangulierung ist ein Verfahren zur Zerlegung einer Fläche in Dreiecke. Dieses Labor nutzt den Delaunay-Algorithmus, der sicherstellt, dass keine Punkte innerhalb des Umkreises eines der resultierenden Dreiecke liegen, was zu "wohlgeformten" Dreiecken führt.

FEATURES & STEUERUNG:
- Echtzeit-Triangulierung: Sofortige Neuberechnung des Dreiecksnetzes bei jedem Hinzufügen oder Verschieben eines Messpunktes.
- Flächen-HUD: Ein schwebendes Display listet die Flächeninhalte aller Einzel-Dreiecke auf und kumuliert sie zur Gesamtfläche.
- Mehrfach-Selektion: Gruppierung und gemeinsames Verschieben von Punkten zur Untersuchung struktureller Veränderungen.
- Referenz-Quadrat: Ein definiertes 100 cm² großes Zielgebiet dient als Basis für die Flächenberechnungen.

INTERFACE:
Technisches Analyse-UI im ULTRA-Standard mit Fokus auf Präzision, Flächenbilanzierung und die Ästhetik mathematischer Netzstrukturen.`,

    "uhrzeitwinkel": `MATHEMATISCHER HINTERGRUND:
Die Uhrzeit-Winkel-Berechnung basiert auf der Winkelgeschwindigkeit der Zeiger: Der Stundenzeiger bewegt sich mit 0,5° pro Minute, der Minutenzeiger mit 6° pro Minute. Das Labor berechnet den resultierenden Bogenwinkel zwischen beiden Zeigern.

FEATURES & STEUERUNG:
- Präzisions-Einstellung: Stufenlose Justierung der Uhrzeit (Stunden/Minuten) per Slider zur Beobachtung der Zeiger-Physik.
- Dual-Winkel-Analyse: Anzeige des Innenwinkels (Alpha) und des Außenwinkels (Beta) zwischen den Zeigern.
- Mathematische Tags: Schwebende HUD-Elemente visualisieren die berechneten Winkelwerte direkt im Ziffernblatt.
- Digitale Synchronisation: Eine digitale Zeitanzeige im ULTRA-Look korrespondiert mit der analogen Zeigerstellung.

INTERFACE:
Stilisiertes Cyber-Clock-Design mit Fokus auf die mathematische Interpretation von Zeitintervallen.`,

    "mandelbrot_deep": `MATHEMATISCHER HINTERGRUND:
Die Mandelbrot-Menge ist die Menge aller komplexen Zahlen c, für welche die rekursive Folge z_{n+1} = z_n^2 + c mit dem Startwert z_0 = 0 beschränkt bleibt. Dieses Labor nutzt eine hochpräzise "Störungsrechnung" (Perturbation Theory), um die 64-Bit-Gleitkommagrenze herkömmlicher GPUs zu durchbrechen. Dies ermöglicht Zooms bis in Bereiche von 10^-80 und tiefer.

FEATURES & STEUERUNG:
- Modus: Wechsel zwischen der klassischen Mandelbrot-Menge und der Julia-Menge (basierend auf der aktuellen Cursor-Position).
- Präzision: Realisiert durch die decimal.js Bibliothek für 80-Bit-Berechnungen.
- Autopilot: Startet einen kontinuierlichen Flug in die fraktalen Strukturen.
- Detailgrad: Regelt die maximale Iterationszahl (maxIter). Höhere Werte enthüllen komplexere Strukturen an den Rändern, benötigen aber mehr Rechenleistung.

INTERFACE:
Das Labor folgt dem ULTRA-Design-Standard mit Echtzeit-Telemetrie im StatsGrid für Zoom-Faktor und aktuelle Koordinaten.`,

    "index": `FUNKTION:
Dieses Modul dient als zentrales Betriebssystem und Navigations-Hub der ULTRA-Labor-Suite. Es bietet einen kuratierten Zugriff auf alle verfügbaren mathematischen und physikalischen Experimente.

FEATURES & STEUERUNG:
- Interaktive Labor-Matrix: Ein dynamisches Gitter-Layout präsentiert alle Module mit hochauflösenden Thumbnails und Kurzbeschreibungen.
- Echtzeit-Suche: Integriertes Scan-System zum schnellen Auffinden spezifischer Themengebiete oder mathematischer Begriffe.
- System-Status: Zentrale Überwachung der Branding- und UI-Parameter über das gesamte Ökosystem hinweg.
- Navigationseffekte: Smooth-Transitions und Hover-Animationen im ULTRA-Stil sorgen für ein immersives Benutzererlebnis beim Modulwechsel.

INTERFACE:
Das administrative Herzstück des Doc-Alvers-Ökosystems; cinematisches Design mit Fokus auf Usability und technologische Ästhetik.`,

    "cmaes": `MATHEMATISCHER HINTERGRUND:
Das Labor nutzt den "Covariance Matrix Adaptation Evolution Strategy" (CMA-ES) Algorithmus. Dies ist ein hochmoderner stochastischer Optimierer für nicht-lineare, nicht-konvexe Probleme. Er adaptiert eine Kovarianzmatrix, um die Suchrichtung im multidimensionalen Raum kontinuierlich zu verbessern – analog zur biologischen Evolution.

FEATURES & STEUERUNG:
- Mission Isoperimetrie: Der Algorithmus versucht, eine geschlossene Form bei konstantem Umfang so zu verformen, dass die Fläche maximal wird. Die Evolution konvergiert exakt zum Kreis.
- Mission Optik: Optimierung eines Glasblocks zur idealen Linse. Die Fitness-Funktion bewertet, wie präzise parallele Lichtstrahlen in einem definierten Brennpunkt gebündelt werden.
- Telemetrie-Dashboard: Live-Anzeige von Generation, Fitness-Wert, Umfang und Fläche.
- Interaktives Dragging: Punkte der Start-Geometrie können manuell verschoben werden, um den Optimierer vor neue Herausforderungen zu stellen.

INTERFACE:
Hochkomplexes Analyse-Tool im ULTRA-v6-Standard mit Echtzeit-Raytracing-Visualisierung für die Linsen-Optimierung.`,

    "winkelpuzzle": `MATHEMATISCHER HINTERGRUND:
Das Winkelpuzzle ist ein anspruchsvolles Modul zur Bestimmung unbekannter Winkel in einer Keil-Konstruktion. Es erfordert die Anwendung von Winkelsummen in Dreiecken, Nebenwinkel-Beziehungen und dem Stufenwinkelsatz.

FEATURES & STEUERUNG:
- Keil-Konfiguration: Freie Anpassung des Hauptwinkels und der Abstände der Schnittgeraden zur Generierung neuer Rätsel-Setups.
- Sichtbarkeits-Layer: Getrennte Steuerung der Anzeige für gegebene Werte (Blau), gesuchte Winkel (Rot) und Zwischenschritte (Gelb).
- Logische Herleitung: Unterstützung der pädagogischen Erarbeitung durch schrittweise Einblendung von Hilfswinkeln.
- Labor-Reset: Schnelle Wiederherstellung der Standardkonfiguration zur Fehleranalyse oder zum Neustart des Rätsels.

INTERFACE:
Hochkomplexes ULTRA-Design mit Fokus auf logische Strukturanalyse und geometrische Abstraktion.`,

    "orbitals": `MATHEMATISCHER HINTERGRUND:
Atomorbitale beschreiben die Aufenthaltswahrscheinlichkeit von Elektronen in der Atomhülle. Sie sind Lösungen der Schrödinger-Gleichung für das Wasserstoffatom und werden durch Kugelflächenfunktionen (KFF) mathematisch modelliert. Die Form der Orbitale hängt von den Quantenzahlen l (Nebenquantenzahl) und m (Magnetquantenzahl) ab.

FEATURES & STEUERUNG:
- Orbital-Selektion: Umschalten zwischen verschiedenen Energiezuständen (s, p, d, f Orbitale) über die Dropdown-Matrix.
- Phasen-Visualisierung: Farbliche Kennzeichnung der Wellenfunktion (Vorzeichen der KFF) zur Verdeutlichung von Knotenflächen.
- Räumliche Untersuchung: Freie 3D-Navigation und Rotation zur Analyse der komplexen Geometrien aus jedem Blickwinkel.
- Echtzeit-Rendering: Hochperformante GPU-Berechnung der Wahrscheinlichkeitsdichten für flüssige Interaktion.

INTERFACE:
Wissenschaftlich präzises ULTRA-Labor mit KaTeX-gestützter Formelanzeige und physikalischer Telemetrie.`
};

