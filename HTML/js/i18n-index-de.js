/**
 * i18n extension for Index/Dashboard page — Deutsch (de).
 * Loaded by js/i18n-index.js (loader) for the ACTIVE language only —
 * never referenced directly from HTML. One file per language.
 */
(function () {
    if (typeof CyberI18n === 'undefined') {
        console.error("CyberI18n not found! Load i18n.js before i18n-index-de.js");
        return;
    }
    const t = (CyberI18n.translations.de = CyberI18n.translations.de || {});
    t.index = {
            admin_gate: {
                title: "BERECHTIGUNG PRÜFEN",
                pwd_placeholder: "Passwort",
                access: "ACCESS",
                cancel: "ABBRECHEN"
            },
            ui: {
                coffee_title: "Cyber-Kaffee spendieren",
                about_title: "Cinematic Intro — Doc Alvers",
                qr_title: "QR-Code dieser Seite",
                sound_title: "Ambient Sound",
                search_placeholder: "LABOR-SCAN STARTEN...",
                mission_start: "Mission Start",
                all_tools: "Alle Werkzeuge",
                /** tools.html Kopfzeile: „{n} Werkzeuge“ (ohne „Alle“) */
                tools_subtitle_word: "Werkzeuge",
                tools_filter_hits: "TREFFER GEFUNDEN",
                tools_no_results: "Keine Treffer für „{query}“",
                search_no_terms: "nichts gefunden",
                tools_close_aria: "Werkzeug-Übersicht schließen und zur Labor-Auswahl",
                tools_footer_aria: "Fußzeile",
                tools_universe_aria: "Universe · Labor-Galerie im Weltraum öffnen",
                tools_doc_title: "Cyber-Labor | Mission Control",
                education: "EDUCATION",
                games: "Spiele",
                lgs: "Gleichungssysteme",
                pythagoras: "Pythagoras",
                triangles: "Dreiecke",
                arithmetic: "Grundrechenarten",
                hot_stuff: "Hot stuff",
                neu: "Neu",
                apps: "Apps",
                fun: "Fun",
                functions: "Funktionen",
                highlights: "Highlights",
                fraktale: "Fraktale",
                university: "Universität",
                themes_count: "Themen",
                themes_top5_title: "Top Labs",
                grade_title: "Jahrgang",
                grade_uni: "Uni",
                grade_uni_tip: "Universität · besonders komplexe Labore (Analysis, Physik, Fraktale, …)",
                grade_back_tip: "Zurück zur Themenauswahl",
                universe_tip: "Universe · Labor-Galerie im Weltraum",
                credits: "CREDITS",
                impressum: "IMPRESSUM"
            },
            contact: {
                title: "Kontakt",
                desc: "Du hast Fragen, Feedback oder Ideen für neue Labormodule? Ich freue mich über jede Nachricht – ob es um Mathematik, didaktische Konzepte oder technische Zusammenarbeit geht.",
                close: "SCHLIESSEN"
            },
            qr: {
                title: "QR-Code",
                desc: "Scanne mit dem Handy – diese Seite zum Mitnehmen."
            },
            donate: {
                title: "Cyber-Kaffee Spendieren",
                desc: "Dir gefallen die interaktiven Labore und du möchtest die Weiterentwicklung des Cyber-Labors unterstützen? Ich freue mich über jeden virtuellen Kaffee, der mich nachts beim Coden wachhält! ☕️🚀",
                paypal: "JETZT SPENDEN MIT PayPal"
            },
            header: {
                title: "Doc Alvers Mathe-Labor",
                subtitle: "DAS INTERAKTIVE MATHEMATIK-UNIVERSUM",
                author: "von Dr. Michael R. Alvers"
            },
            view: {
                back_title: "Zurück",
                title: "LABOR-ANSICHT"
            },
            admin: {
                active: "REDAKTIONS-MODUS AKTIV",
                export: "Änderungen Exportieren",
                exit: "Beenden"
            },
            labs: {
                "fourier": { title: "Fourier-Transformation", description: "Die Musik der Mathematik. Zerlege komplexe Formen in harmonische Kreisschwingungen." },
                "mandelbrot-deep": { title: "Fraktale", description: "Mandelbrot- und Julia-Mengen in der komplexen Ebene: Escapingzeit-Dynamik der Abbildung z↦z²+c als GPU-gestützte Iteration im Fragment-Shader; parametrisierte Exploration von c mit adaptiver Iterationstiefe entlang der fraktalen Randstruktur." },
                "atomorbitale": { title: "Atomorbitale", description: "Kugelflächenfunktionen Y_ℓ^m in 3D: Wahrscheinlichkeitswolken und Quantenzahlen." },
                "galtonboard": { title: "Galton Board", description: "Interaktive Simulation der Normalverteilung. Beobachte wie die Glockenkurve entsteht." },
                "opti-lens": { title: "Linsenoptimierung", description: "Evolutionäre Linsenoptimierung (CMA-ES): Echtzeit-Strahlsimulation und Fokus-Suche." },
                "addition": { title: "Schriftliche Addition", description: "Lerne die schriftliche Addition Schritt für Schritt. Visualisiert den Spaltenaufbau." },
                "subtraktion": { title: "Schriftliche Subtraktion", description: "Trainiere die schriftliche Subtraktion mit Entborgen Schritt für Schritt." },
                "multiplikation": { title: "Schriftliche Multiplikation", description: "Visualisiert die schriftliche Multiplikation Schritt für Schritt." },
                "dividieren": { title: "Schriftliche Division", description: "Meistere die schriftliche Division mit dem interaktiven ULTRA-Labor." },
                "cmaes": { title: "Flächenoptimierung", description: "CMA-ES in Echtzeit: geschlossene Polygone und Freiform-Konturen evolutionär verbessern." },
                "transformationen": { title: "Kongruenz", description: "Erforsche Drehung, Verschiebung und Skalierung eines Dreiecks interaktiv." },
                "winkelsumme3d": { title: "3D Winkelsumme", description: "Erlebe die Winkelsumme im 3-dimensionalen Raum. Dynamische Visualisierung." },
                "ausgleichsgerade": { title: "Ausgleichsgerade", description: "Finde die beste Gerade durch eine Punktwolke. Verstehe die Regression." },
                "binomischeslabor": { title: "1. Binomische Formel", description: "Visualisiere die binomischen Formeln geometrisch durch Flächenzerlegung." },
                "triangulierer": { title: "Delaunay", description: "Algorithmen der Triangulierung. Erzeuge optimale Dreiecksnetze." },
                "differentiallabor": { title: "Differential-Labor", description: "Meistere die Differentialrechnung. Zusammenhang zwischen Funktion und Ableitung." },
                "parabellabor": { title: "Parabeln", description: "Manipulation quadratischer Funktionen. Verstehe den Einfluss der Parameter." },
                "potenzlabor": { title: "Potenz-Labor", description: "Erforsche das Verhalten von Potenz- und Wurzelfunktionen interaktiv." },
                "steigung": { title: "Steigungs-Labor", description: "Verstehe die Steigung an jedem Punkt einer Kurve. Basis der Analysis." },
                "winkellabor": { title: "Winkel-Labor", description: "Interaktive Untersuchung von Winkelsummen und Dreieckstypen." },
                "uhrzeitwinkel": { title: "Winkel-Uhr Labor", description: "Untersuche den Winkel zwischen Zeigern zu jeder Tageszeit." },
                "logikspiel": { title: "Zahlen-Puzzle", description: "Werde zum Meister der Matrix! Löse komplexe Zahlen-Gitter." },
                "integralreaktor": { title: "Integrale", description: "Die Energie der Fläche. Visualisiere Riemann-Summen und Näherungsverfahren." },
                "lissajous": { title: "Lissajous", description: "Überlagerung zweier harmonischer Schwingungen: Frequenz und Phase." },
                "cool-squares": { title: "Cool Squares", description: "Der ultimative geometrische Beweis. Verfolge die Spirale der Quadrate." },
                "fibonacci": { title: "Fibonacci-Labor", description: "Erkunde die goldene Spirale und das organische Wachstum." },
                "fermatpunkt": { title: "Fermat-Punkt", description: "Finde den Punkt mit der minimalen Abstandssumme zu den Ecken." },
                "gleichungssysteme": { title: "LGS Labor", description: "Erkunde Lineare Gleichungssysteme visuell durch Geraden." },
                "imaginarynumbers": { title: "Imaginary numbers", description: "Komplexe Zahlen in der Gaußschen Zahlenebene: Realteil, Imaginärteil und die imaginäre Einheit — interaktiv erkunden." },
                "pythagoras": { title: "Pythagoras", description: "Entdecke den Satz des Pythagoras durch interaktive Flächenvergleiche." },
                "pythagorasbeweis": { title: "Pythagoras Beweis", description: "Geometrischer Beweis des Satzes von Pythagoras durch Flächenzerlegung." },
                "gleichschenkligesDreieck": { title: "Gleichschenkliges Dreieck", description: "Spezielle Dreiecke und ihre Eigenschaften interaktiv berechnen." },
                "eulergerade": { title: "Euler Feuerbach und Napoleon", description: "Die faszinierende Geometrie des Dreiecks: Euler-Gerade und Feuerbach-Kreis." },
                "easyhard": { title: "Geometrie Knobelei", description: "Ein anspruchsvolles geometrisches Rätsel. Bestimme den fehlenden Winkel." },
                "winkelsumme": { title: "Polygon-Labor", description: "Berechne die Winkelsumme in beliebigen n-Ecken." },
                "beweisinwinkellsumme": { title: "Beweis Innenwinkelsatz", description: "Warum beträgt die Winkelsumme im Dreieck immer 180°? Der Beweis Schritt für Schritt." },
                "butterfly": { title: "Schmetterlingskurve", description: "Eine faszinierende transzendente Kurve, definiert durch Polarkoordinaten." },
                "heart3d": { title: "3D Heart Surface", description: "Visualisierung einer impliziten 3D-Fläche hinter dem mathematischen Herzen." },
                "litchi3d": { title: "3D Litchi Labor", description: "Komplexe 3D-Oberflächenmathematik interaktiv erkunden." },
                "cinematic-intro": { title: "Cinematic Intro", description: "Erlebe den monumentalen Start in das Doc Alvers Labor. ULTRA v5.3.8 Visual Identity." },
                "stanford-portal": { title: "Stanford University", description: "Elite-Forschungsuni im Silicon Valley: Spitzenforschung, offene Ideen und Campus-Kultur." },
                "happy-birthday-ulf": { title: "Happy Birthday Ulf!", description: "Eine mathematische Überraschung zum Geburtstag. Feier mit Doc Alvers!" }
            ,
                "einsundeins": { title: "1 + 1 = 2", description: "Eine einzige Rechnung, vier Ebenen tiefer: Hochsprache → Assembler → Maschinenbytes → Volladdierer aus Logikgattern. Auf jeder Ebene dieselbe Information, nur eine Abstraktion tiefer — der Übertrag rieselt sichtbar durch die Gatter, und ein Bit ist am Ende nur Spannung an oder aus." },
                "solita": { title: "Solita", description: "Solita — deine persönliche Sprach-Assistentin (Claude) im Doc Alvers Mathe-Labor. Reden, vorlesen, Kontext behalten." },
                "gameoflife": { title: "Game of Life", description: "Conways zellulärer Automat: Aus drei simplen Regeln entstehen Gleiter, Oszillatoren und ganze Welten. Zeichne Startmuster und sieh zu, wie Ordnung und Chaos sich abwechseln." },
                "burningship": { title: "Burning Ship", description: "Das dunkle Schwesterfraktal der Mandelbrot-Menge: Ein einziger Betrag in der Iterationsformel lässt brennende Schiffe am Horizont erscheinen. Zoome in die flammende Struktur." },
                "reaction-diffusion": { title: "Reaction-Diffusion", description: "Turing-Muster live: Zwei Chemikalien reagieren und diffundieren — heraus kommen Streifen, Punkte und Korallen wie auf Tierfellen. Stelle Zufuhr und Zerfall ein und züchte eigene Muster." },
                "gravitation": { title: "Gravitation", description: "Newtons Gravitationsgesetz zum Anfassen: Setze Massen ins All, gib ihnen Startgeschwindigkeit und beobachte Bahnen, Einfänge und Kollisionen im Mehrkörper-Tanz." },
                "glocken": { title: "Die Glocken von Bagdad", description: "Wann schlagen alle Glocken gleichzeitig? Eine Geschichte aus Bagdad führt zum kleinsten gemeinsamen Vielfachen — mit Tutor, der Schritt für Schritt zu kgV und Brüchen begleitet." },
                "langley": { title: "Langley-Labor", description: "Langleys berüchtigtes Winkelrätsel von 1922: Ein gleichschenkliges Dreieck, zwei innere Linien — und ein Winkel, der die Welt seit 100 Jahren ärgert. Miss, probiere, beweise." },
                "batman": { title: "Batman-Kurve", description: "Eine einzige Gleichung, die als Graph das Batman-Logo zeichnet: Beträge, Wurzeln und Fallunterscheidungen als Superhelden-Mathematik. Zerlege die Formel Stück für Stück." },
                "worldclock": { title: "Weltuhr", description: "Die Erde als Uhr: Zeitzonen, Sonnenstand und Tag-Nacht-Grenze live auf der Weltkarte. Sieh, wo gerade die Sonne aufgeht, während bei uns Mitternacht schlägt." },
                "tracker": { title: "Doc Alvers Tracker", description: "GPS-Tracking als Web-App: Touren aufzeichnen mit Höhenprofil, Foto-, Voice- und Wissens-Wegpunkten, Regenradar und Live-Sharing. Läuft im Browser und als Android-App." },
                "kaimbo": { title: "Kaimbo Studio", description: "Sprachenlernen mit eigenen Aufgabenlisten: Vokabeln und Sätze als Aufgaben-Serien organisieren, filtern und trainieren — das Studio zu Docs Sprachlern-Werkzeug, jetzt im Browser." },
                "pagode": { title: "Pagode (230 SL)", description: "Ein Mercedes 230 SL von 1964 trifft Bluetooth: Motor per Funk starten, Kanäle testen, interaktiver Schaltplan — und Solita lernt fahren. Oldtimer-Elektrik mit KI-Fernsteuerung." },
                "voicerecorder": { title: "Voice Recorder", description: "Aufnehmen und live transkribieren: Sprich — er hört zu, schreibt mit und speichert. Im Browser per Web Speech API, als Android-App mit nativer Spracherkennung." },
                "mathtrainer": { title: "MathTrainer", description: "Mathe trainieren mit Aufgaben-Serien: Kopfrechnen und Schulaufgaben üben, Serien auswählen, Tempo steigern — School is cool. Der SchoolTrainer als Web-App." },
                "pinkerfinder": { title: "PinkerFinder", description: "Der macOS-Finder 1:1 nachgebaut — plus Such-Facetten: Ordnergrößen in der Liste, Dubletten nach Inhalt, Facetten-Suche über den ganzen Mac, Live-Update. Native Mac-App zum Download." },
                "kovarianz": { title: "Kovarianz", description: "Eine lineare Abbildung A zieht, dreht und schert die Ebene. Auf eine runde Punktwolke angewandt wird daraus eine Ellipse — und genau deren Form steht in der Kovarianzmatrix: aus Σ₀ = σ²E wird Σ = A Σ₀ Aᵀ. Matrix zellenweise einstellen oder die Bildellipse direkt am Griff ziehen; Σ, Korrelation und die Eigenvektoren als Hauptachsen werden live aus den gezeichneten Punkten gerechnet. Mit Normal- und Gleichverteilung, homogenen Koordinaten und Parallelen, die zeigen, was die Abbildung mit Geraden macht." },
                "irisvis": { title: "Conway's Iris", description: "Verlängere an jeder Ecke beide Seiten um die gegenüberliegende Seite — die sechs Endpunkte liegen auf einem Kreis um den Inkreismittelpunkt, R = √(r²+(s+d)²). Sechs Scheibenwischer-Bögen bilden daraus eine Kurve konstanter Breite; ein Quadrat umschließt sie in jeder Drehlage, und CMA-ES sucht seine Lage live. Mit Beweis-Ansichten, Heatmap der Suchlandschaft und dem Reuleaux-Dreieck auf Knopfdruck." },
                "ascii": { title: "ASCII-Art", description: "Bilder sind Zahlen: Foto, Kamera-Livebild oder Beispiel in Zellen rastern, Grauwert rechnen, Zeichen wählen — als Zeichen, farbig, Halbton oder Braille, mit Dithering. Ein Klick auf ein Zeichen zeigt die komplette Rechnung für genau diese Zelle; in Stufe 2 schreiben Schüler die Abbildung Grauwert → Zeichen selbst." },
                "neuroaddierer": { title: "Der gelernte Addierer", description: "Im Lab 1 + 1 = 2 sind die Volladdierer fest verdrahtet — hier ist keiner verdrahtet. Ein winziges neuronales Netz aus 32 Zahlen bekommt nur die acht Zeilen der Wahrheitstabelle zu sehen und soll das Addieren selbst finden: durch Evolution (CMA-ES), ganz ohne Ableitung. Danach rechnen acht Kopien des gelernten Netzes in Reihe jede Summe bis 255 — und man sieht, dass seine Ausgänge nie exakt 0 oder 1 sind, sondern 0,03 und 0,97." },
                "shell": { title: "Shell", description: "Wie entsteht das Muster auf einer Meeresschnecke? Sechs Kapitel bauen den Mechanismus einzeln auf: Das Bild ist ein Protokoll — eine Zelle steckt an und schreibt ein V — zwei Wellen löschen sich aus und schneiden die Zeltspitze — das aufgezehrte Substrat erklärt, warum. Oben lebt die Mündungskante mit Aktivator und Substrat, darunter wächst die Schale. Mit Einzelschritt-Taste." },
                "conuslab": { title: "Conus", description: "Warum trägt eine Kegelschnecke Zickzack und Zelte? Die Schale wächst nur an der Mündungskante — eine einzige Zellreihe entscheidet „Pigment ja/nein“, und jede Wachstumslinie bleibt für immer stehen. Das Muster ist also ein Raum-Zeit-Diagramm. Hier läuft es live: wandernde Pigmentwellen, die beim Zusammenstoß auslöschen und dabei die Zelte schneiden — daneben derselbe Effekt als zellulärer Automat (Regel 30)." },
                "costablanca": { title: "Highlights Costa Blanca", description: "Costa-Blanca-Ausflüge zum Abhaken: 22 recherchierte Ziele von Altea bis Valencia mit Fotos, Insider-Tipps und Fortschrittsbalken — in vier Sprachen (DE/EN/ES/IT)." },
                "bb84": { title: "BB84", description: "Quantenschlüsselaustausch nach Bennett und Brassard: Alice schickt einzelne Photonen, jedes in einer von zwei Basen — + mit den Zuständen — und |, oder × mit / und \\. Bob wählt seine Basis zufällig: gleiche Basis heißt sicheres Ergebnis, andere Basis heißt reiner Zufall. Über jede Spalte fahren erklärt genau dieses Photon. Mit der Lauscherin Eve steigt die Fehlerquote im öffentlich verglichenen Teil auf ein Viertel — die Entdeckungswahrscheinlichkeit ist 1 − (3/4)^m, und tausend Läufe auf Knopfdruck zeigen, dass es wirklich so ist. Dazu ein Lehrmodus, der alle Fälle einmal durchgeht." },
                "jacquard": { title: "Jacquard", description: "Ein Webstuhl von 1805, in 3D — und die erste Maschine, die ein Bild nach einer Vorlage herstellt. Eine Lochkarte steuert jeden Kettfaden einzeln: Wo ein Loch ist, rutscht die Nadel hindurch, der Haken bleibt stehen und das Messer hebt den Faden; wo Papier ist, bleibt er unten und der blaue Schuss deckt ihn ab. Karte für Karte wächst das Bild aus der Maschine. Motiv und Maschine sind dabei zwei verschiedene Dinge: derselbe Kreis wird mit mehr Kettfäden runder, und wo die Zeichnung feiner ist als das Gewebe, webt der Webstuhl ein Muster, das es in der Vorlage gar nicht gibt." },
                "koerper": { title: "Körper", description: "Platonische, Archimedische und Catalanische Körper, Prismen, Antiprismen, Pyramiden und Rundformen — drehbar in 3D, mit Oberfläche, Volumen, Um-, Kanten- und Inkugelradius, Flächenwinkeln und Formeln live zur Kantenlänge. Jeder Körper lässt sich per Schieber zum Netz auffalten; Catalanische Körper entstehen als Duale der Archimedischen durch Polarität an der Kantenkugel." },
                "brahmagupta": { title: "Satz von Brahmagupta", description: "Ein Sehnenviereck, dessen Diagonalen senkrecht aufeinander stehen — und zwei Aussagen daran, beide von Brahmagupta (7. Jh., Indien). Der Satz: Fällt man vom Diagonalenschnittpunkt P das Lot auf eine Seite und verlängert es über P hinaus, so trifft es die Gegenseite genau in der Mitte — weil P mit den beiden Endpunkten ein rechtwinkliges Dreieck bildet und der Lotfußpunkt dessen Umkreismittelpunkt ist. Die Formel: K = √((s−a)(s−b)(s−c)(s−d)) misst die Fläche, aber nur solange alle vier Ecken auf dem Kreis liegen. Nimmt man sie herunter, wird K zu groß — Heron für Vierecke, mit einer Bedingung." }
            }
    };
})();
