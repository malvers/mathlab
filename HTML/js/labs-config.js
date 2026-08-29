/* @AI-READONLY: CENTRAL LABS CONFIGURATION - DO NOT MODIFY WITHOUT EXPLICIT USER COMMAND */
/**
 * Cyber-Labor Laboratory Configuration v2.1
 * Centralized registry for all interactive mathematics modules.
 *
 * Jahrgangstabelle (Gymnasium): Filter über `category`-Token `grade5` … `grade12`.
 * `uni` = Universität / besonders komplexe Labs (Analysis, Physik, Fraktale, …) — nicht die Seite universe.html.
 * Hub-Ansicht aller uni-Labs: index.html#university
 * ————————————————————————————————————————————————————————————————
 * ————————————————————————————————————————————————————————————————
 * JG 5:  addition, subtraktion, multiplikation, dividieren, uhrzeitwinkel, logikspiel
 * JG 6:  uhrzeitwinkel, winkellabor
 * JG 7:  uhrzeitwinkel, winkellabor, cool-squares, transformationen (Kongruenz)
 * JG 8:  alle grade8-Labs inkl. Potenz (ab JG 8), Dreiecks-/Algebra-/LGS-Reihe, Fibonacci, …
 * JG 8–9: potenzlabor, pythagoras, pythagorasbeweis
 * JG 9:  parabellabor (zusätzlich zu JG 8–9 bei Pythagoras/Potenz)
 * JG 10–12: cmaes, opti-lens
 * JG 11–12: integralreaktor, fourier, mandelbrot-deep, atomorbitale, differentiallabor
 * uni (zusätzlich): stanford-portal (externer Link), lissajous, atomorbitale, mandelbrot-deep, fourier, integralreaktor, differentiallabor, cmaes, opti-lens
 * top5 (Hub-Kachel "TOP LABS"): kovarianz, irisvis (Conway's Iris), fourier, mandelbrot-deep (Fraktale), atomorbitale, galtonboard, opti-lens (Linsenoptimierung)
 * Keine Jahrgangs-Tags: cinematic-intro, happy-birthday-ulf (Show / Spaß).
 * ————————————————————————————————————————————————————————————————
 */

const LABS_DATA = [
    {
        "id": "koerper",
        "href": "koerper.html",
        "title": "Körper",
        "description": "Platonische, Archimedische und Catalanische Körper, Prismen, Antiprismen, Pyramiden und Rundformen — drehbar in 3D, mit Oberfläche, Volumen, Um-, Kanten- und Inkugelradius, Flächenwinkeln und Formeln live zur Kantenlänge. Jeder Körper lässt sich per Schieber zum Netz auffalten; Catalanische Körper entstehen als Duale der Archimedischen durch Polarität an der Kantenkugel.",
        "tagline": "Geometrie / Polyeder / Netze",
        "icon": LAB_ICONS["koerper"],
        "category": "geometrie neu highlight hot grade8 grade9 grade10 uni",
        "keywords": "koerper körper polyeder platonisch archimedisch catalanisch tetraeder wuerfel oktaeder dodekaeder ikosaeder fussball kuboktaeder rhombendodekaeder netz abwicklung oberflaeche volumen umkugel inkugel kantenkugel prisma antiprisma pyramide zylinder kegel kegelstumpf torus ellipsoid kugel geometrierechner",
        "color": "gold"
    },
    {
        "id": "kovarianz",
        "href": "kovarianz.html",
        "title": "Kovarianz",
        "description": "Eine lineare Abbildung A zieht, dreht und schert die Ebene. Auf eine runde Punktwolke angewandt wird daraus eine Ellipse \u2014 und genau deren Form steht in der Kovarianzmatrix: aus \u03a3\u2080 = \u03c3\u00b2E wird \u03a3 = A \u03a3\u2080 A\u1d40. Matrix zellenweise einstellen oder die Bildellipse direkt am Griff ziehen; Σ, Korrelation und die Eigenvektoren als Hauptachsen werden live aus den gezeichneten Punkten gerechnet. Mit Normal- und Gleichverteilung, homogenen Koordinaten und Parallelen, die zeigen, was die Abbildung mit Geraden macht.",
        "tagline": "Stochastik / Lineare Abbildung / Eigenvektoren",
        "icon": LAB_ICONS["kovarianz"],
        "category": "stochastik funktionen neu top5 highlight hot uni grade11 grade12",
        "keywords": "kovarianz kovarianzmatrix korrelation streuung varianz eigenvektor eigenwert hauptachse hauptachsentransformation pca lineare abbildung matrix scherung drehung determinante ellipse punktwolke normalverteilung gauss homogene koordinaten affine abbildung",
        "color": "cyan"
    },
    {
        "id": "irisvis",
        "href": "irisvis.html",
        "title": "Conway's Iris",
        "description": "Verlängere an jeder Ecke beide Seiten um die gegenüberliegende Seite — die sechs Endpunkte liegen auf einem Kreis um den Inkreismittelpunkt, R = \u221a(r²+(s+d)²). Sechs Scheibenwischer-Bögen bilden daraus eine Kurve konstanter Breite; ein Quadrat umschließt sie in jeder Drehlage, und CMA-ES sucht seine Lage live. Mit Beweis-Ansichten, Heatmap der Suchlandschaft und dem Reuleaux-Dreieck auf Knopfdruck.",
        "tagline": "Geometrie / Konstante Breite / CMA-ES",
        "icon": LAB_ICONS["irisvis"],
        "category": "geometrie dreiecke neu top5 highlight hot uni grade10 grade11 grade12",
        "keywords": "conway kreis satz circle theorem dreieck inkreis reuleaux konstante breite wischer wiper mathologer cmaes evolutionsstrategie optimierung stuetzfunktion quadrat rotation",
        "color": "gold"
    },
    {
        "id": "ascii",
        "href": "ascii.html",
        "title": "ASCII-Art",
        "description": "Bilder sind Zahlen: Foto, Kamera-Livebild oder Beispiel in Zellen rastern, Grauwert rechnen, Zeichen wählen — als Zeichen, farbig, Halbton oder Braille, mit Dithering. Ein Klick auf ein Zeichen zeigt die komplette Rechnung für genau diese Zelle; in Stufe 2 schreiben Schüler die Abbildung Grauwert → Zeichen selbst.",
        "tagline": "Informatik / Bilddaten / Pixel → Zeichen",
        "icon": LAB_ICONS["ascii"],
        "category": "informatik neu sonst",
        "keywords": "ascii art asciiart text bild zeichen pixel grauwert luminanz rampe braille halbton dithering floyd steinberg kamera webcam informatik bilddaten rgb",
        "color": "green"
    },
    {
        "id": "pinkerfinder",
        "href": "pinkerfinder/index.html",
        "title": "PinkerFinder",
        "description": "Der macOS-Finder 1:1 nachgebaut — plus Such-Facetten: Ordnergrößen in der Liste, Dubletten nach Inhalt, Facetten-Suche über den ganzen Mac, Live-Update. Native Mac-App zum Download.",
        "tagline": "macOS / Finder + Such-Facetten",
        "icon": LAB_ICONS["pinkerfinder"],
        "category": "apps neu",
        "keywords": "pinkerfinder pinker finder mac macos dateien ordner suche facetten dubletten größe explorer app",
        "color": "orange"
    },
    {
        "id": "cinematic-intro",
        "href": "intro.html",
        "title": "Cinematic Intro",
        "description": "Erlebe den monumentalen Start in das Doc Alvers Labor. Die ULTRA v5.3.8 Visual Identity in 6-Sekunden-Qualität.",
        "tagline": "Vita Somnium Breve",
        "icon": LAB_ICONS["cinematic-intro"],
        "category": "hot",
        "keywords": "intro startup branding reveal ultra",
        "color": "blue"
    },
    {
        "id": "transformationen",
        "href": "transformationen.html",
        "title": "Kongruenz",
        "description": "Erforsche Drehung, Verschiebung und Skalierung eines Dreiecks interaktiv. Verschiebe den Rotationspunkt und beobachte die mathematischen Auswirkungen (Transformationen).",
        "tagline": "Geometrie / Transformationen",
        "icon": LAB_ICONS["transformationen"],
        "category": "geometrie hot grade7 grade8",
        "keywords": "kongruenz geometrie dreieck transformation rotation translation zoom spiegelung",
        "color": "green"
    },
    {
        "id": "heart3d",
        "href": "heart3d.html",
        "title": "3D Heart Surface",
        "description": "Visualisierung einer impliziten 3D-Fläche. Entdecke die Formel hinter dem mathematischen Herzen.",
        "tagline": "Implizite Funktionen / Herz-Formel",
        "icon": LAB_ICONS["heart3d"],
        "category": "fun grade8",
        "keywords": "3d geometrie fläche herz herzkurve implizit",
        "color": "blue"
    },
    {
        "id": "litchi3d",
        "href": "litchi3d.html",
        "title": "3D Litchi Labor",
        "description": "Komplexe 3D-Oberflächenmathematik. Erkunde die Litschi-Fläche in einer interaktiven 3D-Umgebung.",
        "tagline": "Prozedurale Oberflächen / SDF Geometrie",
        "icon": LAB_ICONS["litchi3d"],
        "category": "fun grade8",
        "keywords": "3d oberfläche litschi litchi visualisierung",
        "color": "purple"
    },
    {
        "id": "addition",
        "href": "addition.html",
        "title": "Schriftliche Addition",
        "description": "Lerne die schriftliche Addition Schritt für Schritt. Visualisiert den Spaltenaufbau und das Übertrag-System in Echtzeit.",
        "tagline": "Grundrechenarten / Spalten-Analyse",
        "icon": LAB_ICONS["addition"],
        "category": "arithmetik grade5 hot",
        "keywords": "addition plusrechnen schriftlich addieren mathe schule",
        "color": "blue"
    },
    {
        "id": "einsundeins",
        "href": "einsundeinsgleichzwei.html",
        "title": "1 + 1 = 2",
        "description": "Eine einzige Rechnung, vier Ebenen tiefer: Hochsprache → Assembler → Maschinenbytes → Volladdierer aus Logikgattern. Auf jeder Ebene dieselbe Information, nur eine Abstraktion tiefer — der Übertrag rieselt sichtbar durch die Gatter, und ein Bit ist am Ende nur Spannung an oder aus.",
        "tagline": "Vom Code zu den Bits / Wie ein Computer rechnet",
        "icon": LAB_ICONS["einsundeins"],
        "category": "arithmetik logik fun hot highlight neu grade8 grade9",
        "keywords": "binär bit byte hex assembler maschinencode informatik volladdierer logikgatter xor and übertrag carry null eins strom spannung transistor cpu",
        "color": "gold"
    },
    {
        "id": "neuroaddierer",
        "href": "neuroaddierer.html",
        "title": "Der gelernte Addierer",
        "description": "Im Lab 1 + 1 = 2 sind die Volladdierer fest verdrahtet \u2014 hier ist keiner verdrahtet. Ein winziges neuronales Netz aus 32 Zahlen bekommt nur die acht Zeilen der Wahrheitstabelle zu sehen und soll das Addieren selbst finden: durch Evolution (CMA-ES), ganz ohne Ableitung. Danach rechnen acht Kopien des gelernten Netzes in Reihe jede Summe bis 255 \u2014 und man sieht, dass seine Ausg\u00e4nge nie exakt 0 oder 1 sind, sondern 0,03 und 0,97.",
        "tagline": "Netz lernt Rechnen / Evolution statt Backpropagation",
        "icon": LAB_ICONS["neuroaddierer"],
        "category": "logik informatik fun hot highlight neu grade9 grade10",
        "keywords": "ki neuronales netz machine learning evolution cmaes rechenberg evolutionsstrategie backpropagation gewichte training volladdierer xor \u00fcbertrag carry bit lernen gradient",
        "color": "gold"
    },
    {
        "id": "subtraktion",
        "href": "subtraktion.html",
        "title": "Schriftliche Subtraktion",
        "description": "Trainiere die schriftliche Subtraktion mit Entborgen Schritt für Schritt. Interaktive Spaltenhilfe für saubere Minusrechnung.",
        "tagline": "Grundrechenarten / Entborgen",
        "icon": LAB_ICONS["subtraktion"],
        "category": "arithmetik grade5 hot",
        "keywords": "subtraktion minus schriftlich entborgen mathe schule",
        "color": "blue"
    },
    {
        "id": "multiplikation",
        "href": "multiplikation.html",
        "title": "Schriftliche Multiplikation",
        "description": "Visualisiert die schriftliche Multiplikation Schritt für Schritt. Inklusive Übertrag-Tracking und Detail-Modus für tiefe mathematische Analyse.",
        "tagline": "Grundrechenarten / Detail-Analyse",
        "icon": LAB_ICONS["multiplikation"],
        "category": "arithmetik grade5 hot",
        "keywords": "multiplikation malrechnen schriftlich mathe schule",
        "color": "gold"
    },
    {
        "id": "dividieren",
        "href": "dividieren.html",
        "title": "Schriftliche Division",
        "description": "Meistere die schriftliche Division mit dem interaktiven ULTRA-Labor. Perfekte Ausrichtung und pädagogische Begleitung durch den Math-Coach.",
        "tagline": "Grundrechenarten / Grid-Analyse",
        "icon": LAB_ICONS["dividieren"],
        "category": "arithmetik grade5 hot",
        "keywords": "division teilen schriftlich dividieren mathe schule",
        "color": "blue"
    },
    {
        "id": "winkelsumme3d",
        "href": "winkelsumme3d.html",
        "title": "3D Winkelsumme",
        "description": "Erlebe die Winkelsumme im 3-dimensionalen Raum. Dynamische Visualisierung der inneren Winkel eines Dreiecks.",
        "tagline": "Räumliche Visualisierung / Animation",
        "icon": LAB_ICONS["winkelsumme3d"],
        "category": "dreiecke hot grade8",
        "keywords": "3d geometrie winkelsumme dreieck animation",
        "color": "purple"
    },
    {
        "id": "ausgleichsgerade",
        "href": "ausgleichsgerade.html",
        "title": "Ausgleichsgerade",
        "description": "Finde die beste Gerade durch eine Punktwolke. Verstehe die Minimierung der Fehlerquadrate (Regression).",
        "tagline": "Statistik / Regression / Datenanalyse",
        "icon": LAB_ICONS["ausgleichsgerade"],
        "category": "hot grade8",
        "keywords": "statistik regression korrelation funktion daten",
        "color": "green"
    },
    {
        "id": "binomischeslabor",
        "href": "binomischeslabor.html",
        "title": "1. Binomische Formel",
        "description": "Visualisiere die binomischen Formeln geometrisch. Verstehe das Quadrat einer Summe durch Flächenzerlegung.",
        "tagline": "Algebra / Geometrische Veranschaulichung",
        "icon": LAB_ICONS["binomischeslabor"],
        "category": "algebra hot grade8",
        "keywords": "algebra formel quadrat termvereinfachung",
        "color": "blue"
    },
    {
        "id": "butterfly",
        "href": "butterfly.html",
        "title": "Schmetterlingskurve",
        "description": "Eine faszinierende transzendente Kurve, definiert durch Polarkoordinaten. Mathematik trifft Ästhetik.",
        "tagline": "Polarkoordinaten / Mathematik trifft Kunst",
        "icon": LAB_ICONS["butterfly"],
        "category": "fun grade8",
        "keywords": "geometrie kurve polarkoordinaten butterfly schmetterling",
        "color": "gold"
    },
    {
        "id": "triangulierer",
        "href": "triangulierer.html",
        "title": "Delaunay",
        "description": "Algorithmen der Triangulierung. Erzeuge optimale Dreiecksnetze nach der Delaunay-Methode.",
        "tagline": "Delaunay / Voronoi / Algorithmen",
        "icon": LAB_ICONS["triangulierer"],
        "category": "hot grade8",
        "keywords": "geometrie triangulation delaunay voronoi fläche",
        "color": "green"
    },
    {
        "id": "stanford-portal",
        "href": "https://www.stanford.edu/",
        "title": "Stanford University",
        "description": "Elite-Forschungsuni im Silicon Valley: Spitzenforschung, offene Ideen und eine Campus-Kultur, die Tech und Wissenschaft weltweit prägt. Ergänzend zu den Uni-Labs hier im Portal.",
        "tagline": "Stanford · Kalifornien · Forschung & Lehre",
        "icon": LAB_ICONS["stanford-portal"],
        "category": "uni",
        "keywords": "stanford university kalifornien silicon valley forschung campus stanford.edu",
        "color": "blue"
    },
    {
        "id": "differentiallabor",
        "href": "differentiallabor.html",
        "title": "Differential-Labor",
        "description": "Meistere die Differentialrechnung. Erkunde den Zusammenhang zwischen einer Funktion und ihrer Ableitung durch die Tangente.",
        "tagline": "Ableitungen / Tangenten / Kurvendiskussion",
        "icon": LAB_ICONS["differentiallabor"],
        "category": "hot grade11 grade12 uni",
        "keywords": "differential ableitung tangente analysis funktion kurvendiskussion",
        "color": "blue"
    },
    {
        "id": "eulergerade",
        "href": "eulergerade.html",
        "title": "Euler Feuerbach und Napoleon",
        "description": "Die faszinierende Geometrie des Dreiecks. Entdecke die Euler-Gerade, den Feuerbach-Kreis und Napoleons Satz.",
        "tagline": "Besondere Linien & Punkte / Klassische Geometrie",
        "icon": LAB_ICONS["eulergerade"],
        "category": "dreiecke grade8 feuerbachkreis feuerbach neunpunktekreis",
        "keywords": "geometrie euler feuerbach kreis dreieck schwerpunkt",
        "color": "blue"
    },
    {
        "id": "easyhard",
        "href": "easyhard.html",
        "title": "Geometrie Knobelei",
        "description": "Ein anspruchsvolles geometrisches Rätsel. Kannst du den fehlenden Winkel nur durch Logik bestimmen?",
        "tagline": "Logik-Rätsel / Langley / Problemlösung",
        "icon": LAB_ICONS["easyhard"],
        "category": "dreiecke grade8",
        "keywords": "geometrie dreieck problem knobeln problemloesen",
        "color": "orange"
    },
    {
        "id": "gleichschenkligesDreieck",
        "href": "gleichschenkligesDreieck.html",
        "title": "Gleichschenkliges Dreieck",
        "description": "Spezielle Dreiecke und ihre Eigenschaften. Berechne Basiswinkel und Seitenlängen interaktiv.",
        "tagline": "Symmetrie / Basiswinkel / LGS",
        "icon": LAB_ICONS["gleichschenkligesDreieck"],
        "category": "lgs grade8",
        "keywords": "geometrie dreieck gleichschenklig winkel lgs",
        "color": "gold"
    },
    {
        "id": "parabellabor",
        "href": "parabellabor.html",
        "title": "Parabeln",
        "description": "Manipulation quadratischer Funktionen. Verstehe den Einfluss von Parametern auf die Parabelform.",
        "tagline": "Quadratische Funktionen / Parameter-Studie",
        "icon": LAB_ICONS["parabellabor"],
        "category": "hot grade9 funktionen highlight",
        "keywords": "parabel quadratisch gleichung scheitelpunkt stauchung streckung",
        "color": "purple"
    },
    {
        "id": "winkelsumme",
        "href": "winkelsumme.html",
        "title": "Polygon-Labor",
        "description": "Berechne die Winkelsumme in beliebigen n-Ecken. Entdecke die Formel für die Innenwinkel von Polygonen.",
        "tagline": "Winkelsumme in n-Ecken / Vielecke",
        "icon": LAB_ICONS["winkelsumme"],
        "category": "dreiecke hot grade8",
        "keywords": "geometrie polygon winkel vieleck winkelsumme",
        "color": "gold"
    },
    {
        "id": "potenzlabor",
        "href": "potenzlabor.html",
        "title": "Potenz-Labor",
        "description": "Erforsche das Verhalten von Potenz- und Wurzelfunktionen. Verstehe Exponenten durch interaktive Kurvenmanipulation.",
        "tagline": "Exponenten / Wachstum / Kurvendiskussion",
        "icon": LAB_ICONS["potenzlabor"],
        "category": "grade8 grade9 hot",
        "keywords": "exponent wurzel wachstum kurvendiskussion funktion",
        "color": "blue"
    },
    {
        "id": "pythagorasbeweis",
        "href": "pythagorasbeweis.html",
        "title": "Pythagoras Beweis",
        "description": "Geometrischer Beweis des Satzes von Pythagoras. Schiebe Flächen umher, um den Zusammenhang zu visualisieren.",
        "tagline": "Quadrate / Beweis durch Zerlegung",
        "icon": LAB_ICONS["pythagorasbeweis"],
        "category": "pythagoras grade8 grade9",
        "keywords": "geometrie pythagoras beweis fläche quadrat",
        "color": "purple"
    },
    {
        "id": "pythagoras",
        "href": "pythagoras.html",
        "title": "Pythagoras",
        "description": "Entdecke den Satz des Pythagoras durch interaktive Flächenvergleiche und Beweis-Animationen.",
        "tagline": "Geometrie / Rechtwinkliges Dreieck / Beweis",
        "icon": LAB_ICONS["pythagoras"],
        "category": "pythagoras grade8 grade9",
        "keywords": "geometrie rechtwinklig dreieck fläche beweis",
        "color": "orange"
    },
    {
        "id": "steigung",
        "href": "steigung.html",
        "title": "Steigungs-Labor",
        "description": "Verstehe die Steigung an jedem Punkt einer Kurve. Die Basis für die Differentialrechnung.",
        "tagline": "Differentialrechnung / Ableitung / Tangente",
        "icon": LAB_ICONS["steigung"],
        "category": "hot grade8",
        "keywords": "steigung ableitung differentialrechnung tangente",
        "color": "purple"
    },
    {
        "id": "winkellabor",
        "href": "winkellabor.html",
        "title": "Winkel-Labor",
        "description": "Interaktive Untersuchung von Winkelsummen und Dreieckstypen in der Ebene.",
        "tagline": "Stufenwinkel / Wechselwinkel / Scheitelwinkel",
        "icon": LAB_ICONS["winkellabor"],
        "category": "grade6 grade7 dreiecke hot",
        "keywords": "geometrie winkel dreieck winkelsumme beweis",
        "color": "green"
    },
    {
        "id": "uhrzeitwinkel",
        "href": "uhrzeitwinkel.html",
        "title": "Winkel-Uhr Labor",
        "description": "Untersuche den Winkel zwischen Stunden- und Minutenzeiger zu jeder Tageszeit. Verstehe die kontinuierliche Bewegung der Zeiger.",
        "tagline": "Zeigerbewegung / Winkelberechnung",
        "icon": LAB_ICONS["uhrzeitwinkel"],
        "category": "geometrie grade5 grade6 grade7 hot",
        "keywords": "geometrie winkel uhrzeit zeiger berechnung",
        "color": "green"
    },
    {
        "id": "beweisinwinkellsumme",
        "href": "beweisinwinkellsumme.html",
        "title": "Beweis Innenwinkelsatz",
        "description": "Warum beträgt die Winkelsumme im Dreieck immer 180°? Hier kannst du den Beweis Schritt für Schritt nachvollziehen.",
        "tagline": "Interaktive Beweisführung / Schritt für Schritt",
        "icon": LAB_ICONS["beweisinwinkellsumme"],
        "category": "dreiecke grade8",
        "keywords": "geometrie dreieck problem knobeln problemloesen",
        "color": "orange"
    },
    {
        "id": "logikspiel",
        "href": "logikspiel2.html",
        "title": "Zahlen-Puzzle",
        "description": "Werde zum Meister der Matrix! Löse komplexe Zahlen-Gitter durch Addition oder Multiplikation. Ein hochmoderner Strategie-Hacker für Mathe-Profis.",
        "tagline": "Logik / Arithmetik / Matrix-Hacking",
        "icon": LAB_ICONS["logikspiel"],
        "category": "arithmetik logik hot grade5",
        "keywords": "spiel game logik summen rätsel puzzle logic arithmetic sum grid multiplikation",
        "color": "green"
    },
    {
        "id": "integralreaktor",
        "href": "integralreaktor.html",
        "title": "Integrale",
        "description": "Die Energie der Fläche. Visualisiere bestimmte Integrale, Riemann-Summen und Näherungsverfahren in einem interaktiven Simulator.",
        "tagline": "Integralrechnung / Riemann-Summen / Flächen",
        "icon": LAB_ICONS["integralreaktor"],
        "category": "hot grade11 grade12 oberstufe analysis funktionen highlight uni",
        "keywords": "integral analysis fläche summe riemann reaktor",
        "color": "blue"
    },
    {
        "id": "fourier",
        "href": "fourier.html",
        "title": "Fourier-Transformation",
        "description": "Die Musik der Mathematik. Zerlege komplexe Formen in harmonische Kreisschwingungen und rekonstruiere sie. Verstehe die Magie der Frequenzanalyse interaktiv.",
        "tagline": "Fourier-Reihen / Harmonik / Epizykel",
        "icon": LAB_ICONS["fourier"],
        "category": "fun geometrie hot highlight grade11 grade12 uni top5",
        "keywords": "fourier musik note epicycles kreise geometrie harmonik transformation",
        "color": "blue"
    },
    {
        "id": "lissajous",
        "href": "lissajous.html",
        "title": "Lissajous",
        "description": "Überlagerung zweier harmonischer Schwingungen: Frequenzverhältnis, Phase und KaTeX-Parameter live. 2D-Kurve oder gedankliche 3D-Pendelansicht.",
        "tagline": "Harmonische Schwingungen / Parametrische Kurven",
        "icon": LAB_ICONS["lissajous"],
        "category": "fun geometrie hot highlight grade11 grade12 oberstufe uni",
        "keywords": "lissajous harmonisch schwingung frequenz phase parametrische kurve pendel figur",
        "color": "blue"
    },
    {
        "id": "cmaes",
        "href": "cmaes.html",
        "title": "Flächenoptimierung",
        "description": "CMA-ES in Echtzeit: geschlossene Polygone und Freiform-Konturen evolutionär verbessern — komplexe Geometrien, Schritt für Schritt.",
        "tagline": "CMA-ES / Evolutionäre Flächen- & Konturoptimierung",
        "icon": LAB_ICONS["cmaes"],
        "category": "hot highlight fun grade10 grade11 grade12 uni",
        "keywords": "cmaes flächenoptimierung fläche polygon geometrie evolution optimierung strategie simulation",
        "color": "green"
    },
    /*
     * Happy-birthday tile (Cyber-Cake): temporarily disabled — happybirthday.html remains reachable via direct URL.
    {
        "id": "happy-birthday-ulf",
        "href": "happybirthday.html?name=Ulf",
        "title": "Happy Birthday",
        "description": "Eine kosmische Glückwunsch-Site mit Feuerwerk, Konfetti und animierter Geburtstagstorte. Klick für Raketen, SPACE für das große Finale.",
        "tagline": "Konfetti / Feuerwerk / Cyber-Cake",
        "icon": LAB_ICONS["happy-birthday-ulf"],
        "category": "fun",
        "keywords": "happy birthday geburtstag glueckwunsch konfetti feuerwerk torte party celebrate ulf",
        "color": "purple"
    },
    */
    {
        "id": "galtonboard",
        "href": "galtonboard.html",
        "title": "Galton Board",
        "description": "Interaktives Nagelbrett mit 50/50-Abzweigung, sanften Kugelbahnen und stylischem Histogramm. Beobachte live, wie die Glockenkurve entsteht.",
        "tagline": "Wahrscheinlichkeit / Binomialverteilung / Simulation",
        "icon": LAB_ICONS["galtonboard"],
        "category": "fun highlight hot grade8 top5",
        "keywords": "galton board nagelbrett wahrscheinlichkeit zufall binomialverteilung histogramm simulation",
        "color": "blue"
    },
    {
        "id": "atomorbitale",
        "href": "orbitals.html",
        "title": "Atomorbitale",
        "description": "Kugelflächenfunktionen Y_ℓ^m in 3D: Kugelfläche und optionale |Y|²-Punktwolke, KaTeX-Formeln, Orbitwechsel. Cyber-Lab-Optik, Trackball, Auto-Rotation.",
        "tagline": "Kugelflächen / Harmonische / 3D",
        "icon": LAB_ICONS["atomorbitale"],
        "category": "highlight hot grade11 grade12 oberstufe fun uni top5",
        "keywords": "atom orbital kugelflächenfunktion kff harmonische ylm wahrscheinlichkeit 3d quanten chemie physik d orbital",
        "color": "blue"
    },
    {
        "id": "opti-lens",
        "href": "LensStandalone/cmaes_java.html",
        "title": "Linsenoptimierung",
        "description": "Labor zur evolutionären Linsenoptimierung (CMA-ES): Symmetriemodus, oszillierender Brennpunkt, Echtzeit-Strahlsimulation und Maus-Zoom in einer eigenständigen Hochleistungs-Oberfläche.",
        "tagline": "Strahlenoptik / Brennpunkt / Evolution",
        "icon": LAB_ICONS["opti-lens"],
        "category": "hot highlight fun grade10 grade11 grade12 uni top5",
        "keywords": "linse linsenoptimierung optik strahlen brennpunkt cmaes evolution standalone symmetrie refraktion",
        "color": "blue"
    },
    {
        "id": "cool-squares",
        "href": "coolsquares.html",
        "title": "Cool Squares",
        "description": "Der ultimative geometrische Beweis. Verfolge die Spirale der Quadrate und entdecke, warum die Variable x am Ende keine Rolle spielt. Ein visuelles Aha-Erlebnis.",
        "tagline": "Geometrie / Algebra / Spirale",
        "icon": LAB_ICONS["cool-squares"],
        "category": "fun highlight geometrie hot grade7 grade8",
        "keywords": "geometrie quadrat beweis spirale fläche algebra x a cool squares squares",
        "color": "blue"
    },
    {
        "id": "fibonacci",
        "href": "fibonacci.html",
        "title": "Fibonacci-Labor",
        "description": "Erkunde die goldene Spirale und die Fibonacci-Folge. Visualisiere das organische Wachstum durch Quadrate und Viertelkreise in einer interaktiven Unendlichkeitsschleife.",
        "tagline": "Goldener Schnitt / Organisches Wachstum",
        "icon": LAB_ICONS["fibonacci"],
        "category": "fun highlight geometrie hot grade8",
        "keywords": "fibonacci spirale goldener schnitt wachstum quadrat folge unendlichkeit",
        "color": "orange"
    },
    {
        "id": "mandelbrot-deep",
        "href": "mandelbrot.html",
        "title": "Fraktale",
        "description": "Mandelbrot- und Julia-Mengen in der komplexen Ebene: Escapingzeit-Dynamik der Abbildung z↦z²+c als GPU-gestützte Iteration im Fragment-Shader; parametrisierte Exploration von c mit adaptiver Iterationstiefe entlang der fraktalen Randstruktur.",
        "tagline": "Komplexe Dynamik · Escapingzeit · Julia/Mandelbrot",
        "icon": LAB_ICONS["mandelbrot-deep"],
        "category": "fraktale highlight hot grade11 grade12 oberstufe uni top5",
        "keywords": "mandelbrot julia fractal escapingzeit komplexe ebene webgl dynamik chaos grenzmenge zoom flight",
        "color": "purple"
    },
    {
        "id": "fermatpunkt",
        "href": "fermatpunkt.html",
        "title": "Fermat-Punkt",
        "description": "Finde den Punkt, dessen Abstandssumme zu den Ecken eines Dreiecks minimal ist. Beweise, dass F das absolute Strecken-Minimum bildet.",
        "tagline": "Kürzeste Netze / Geometrische Optimierung",
        "icon": LAB_ICONS["fermatpunkt"],
        "category": "highlight dreiecke geometrie hot grade8",
        "keywords": "fermat punkt geometrie dreieck abstand minimierung netz kürzeste wege",
        "color": "purple"
    },
    {
        "id": "gleichungssysteme",
        "href": "gleichungssysteme.html",
        "title": "LGS Labor",
        "description": "Erkunde Lineare Gleichungssysteme visuell. Ziehe Geraden, beobachte die Formeln in Echtzeit und scrambele die Notation für echte Gehirn-Akrobatik.",
        "tagline": "Schnittpunkte / Lineare Algebra",
        "icon": LAB_ICONS["gleichungssysteme"],
        "category": "highlight lgs geometrie hot grade8",
        "keywords": "lgs gleichungssystem schnittpunkt geraden algebra mathe",
        "color": "green"
    },
    /* {
        "id": "imaginarynumbers",
        "href": "imaginarynumbers/index.html",
        "title": "Imaginary numbers",
        "description": "Komplexe Zahlen in der Gaußschen Zahlenebene: Realteil, Imaginärteil und die imaginäre Einheit — interaktiv erkunden (Ausbau folgt).",
        "tagline": "Komplexe Ebene · Re / Im · i",
        "icon": LAB_ICONS["imaginarynumbers"],
        "category": "algebra highlight grade10 grade11 grade12 oberstufe uni",
        "keywords": "komplexe zahlen imaginaerteil reell imaginary complex plane gauss i",
        "color": "blue"
    }, */
    /* Solita: war privat; seit 2026-08-09 auf Docs GO als App verlinkt (Passwort-Gate in der App). */
    {
        "id": "solita",
        "href": "solita.html",
        "title": "Solita",
        "description": "Solita — deine persönliche Sprach-Assistentin (Claude) im Doc Alvers Mathe-Labor. Reden, vorlesen, Kontext behalten.",
        "tagline": "weiß alles, bleibt nah",
        "icon": LAB_ICONS["solita"],
        "category": "apps",
        "keywords": "solita ai ki assistent sprache voice chat claude vorlesen weckwort",
        "color": "blue"
    },
    {
        "id": "gameoflife",
        "href": "gameoflife/gameoflife.html",
        "title": "Game of Life",
        "description": "Conways zellulärer Automat: Aus drei simplen Regeln entstehen Gleiter, Oszillatoren und ganze Welten. Zeichne Startmuster und sieh zu, wie Ordnung und Chaos sich abwechseln.",
        "tagline": "Zellulärer Automat / Emergenz",
        "icon": LAB_ICONS["gameoflife"],
        "category": "fun logik neu grade8 grade9",
        "keywords": "game of life conway zellulärer automat gleiter glider emergenz simulation muster regeln",
        "color": "green"
    },
    {
        "id": "burningship",
        "href": "burningship.html",
        "title": "Burning Ship",
        "description": "Das dunkle Schwesterfraktal der Mandelbrot-Menge: Ein einziger Betrag in der Iterationsformel lässt brennende Schiffe am Horizont erscheinen. Zoome in die flammende Struktur.",
        "tagline": "Fraktale / Komplexe Dynamik",
        "icon": LAB_ICONS["burningship"],
        "category": "fraktale neu uni grade11 grade12",
        "keywords": "burning ship fraktal mandelbrot komplexe zahlen iteration escape time zoom",
        "color": "orange"
    },
    {
        "id": "reaction-diffusion",
        "href": "reaction-diffusion.html",
        "title": "Reaction-Diffusion",
        "description": "Turing-Muster live: Zwei Chemikalien reagieren und diffundieren — heraus kommen Streifen, Punkte und Korallen wie auf Tierfellen. Stelle Zufuhr und Zerfall ein und züchte eigene Muster.",
        "tagline": "Turing-Muster / Gray-Scott",
        "icon": LAB_ICONS["reaction-diffusion"],
        "category": "fun neu uni grade11 grade12",
        "keywords": "reaction diffusion turing muster gray scott simulation chemie pattern streifen punkte",
        "color": "purple"
    },
    {
        "id": "conuslab",
        "href": "conuslab.html",
        "title": "Conus",
        "description": "Warum tr\u00e4gt eine Kegelschnecke Zickzack und Zelte? Die Schale w\u00e4chst nur an der M\u00fcndungskante \u2014 eine einzige Zellreihe entscheidet \u201ePigment ja/nein\u201c, und jede Wachstumslinie bleibt f\u00fcr immer stehen. Das Muster ist also ein Raum-Zeit-Diagramm. Hier l\u00e4uft es live: wandernde Pigmentwellen, die beim Zusammensto\u00df ausl\u00f6schen und dabei die Zelte schneiden \u2014 daneben derselbe Effekt als zellul\u00e4rer Automat (Regel 30).",
        "tagline": "Musterbildung / Meinhardt",
        "icon": LAB_ICONS["conuslab"],
        "category": "fun physik informatik neu uni grade11 grade12",
        "keywords": "conus kegelschnecke muschel schale muster pigment meinhardt aktivator substrat reaction diffusion wellen zelte zickzack zellulaerer automat regel 30 wolfram biologie",
        "color": "gold"
    },
    {
        "id": "gravitation",
        "href": "gravitation.html",
        "title": "Gravitation",
        "description": "Newtons Gravitationsgesetz zum Anfassen: Setze Massen ins All, gib ihnen Startgeschwindigkeit und beobachte Bahnen, Einfänge und Kollisionen im Mehrkörper-Tanz.",
        "tagline": "Physik / Mehrkörperproblem",
        "icon": LAB_ICONS["gravitation"],
        "category": "fun physik neu grade9 grade10",
        "keywords": "gravitation newton schwerkraft orbit planet bahn mehrkörper simulation physik masse",
        "color": "blue"
    },
    {
        "id": "glocken",
        "href": "glocken/glocken.html",
        "title": "Die Glocken von Bagdad",
        "description": "Wann schlagen alle Glocken gleichzeitig? Eine Geschichte aus Bagdad führt zum kleinsten gemeinsamen Vielfachen — mit Tutor, der Schritt für Schritt zu kgV und Brüchen begleitet.",
        "tagline": "Arithmetik / kgV mit Tutor",
        "icon": LAB_ICONS["glocken"],
        "category": "arithmetik fun neu grade5 grade6",
        "keywords": "glocken bagdad kgv kleinstes gemeinsames vielfaches brüche teiler tutor quest",
        "color": "gold"
    },
    {
        "id": "langley",
        "href": "lenglay.html",
        "title": "Langley-Labor",
        "description": "Langleys berüchtigtes Winkelrätsel von 1922: Ein gleichschenkliges Dreieck, zwei innere Linien — und ein Winkel, der die Welt seit 100 Jahren ärgert. Miss, probiere, beweise.",
        "tagline": "Geometrie / Adventitious Angles",
        "icon": LAB_ICONS["langley"],
        "category": "geometrie dreiecke neu grade8 grade9",
        "keywords": "langley winkel dreieck rätsel geometrie beweis adventitious angles 80 20",
        "color": "green"
    },
    {
        "id": "batman",
        "href": "batman.html",
        "title": "Batman-Kurve",
        "description": "Eine einzige Gleichung, die als Graph das Batman-Logo zeichnet: Beträge, Wurzeln und Fallunterscheidungen als Superhelden-Mathematik. Zerlege die Formel Stück für Stück.",
        "tagline": "Funktionen / Implizite Kurven",
        "icon": LAB_ICONS["batman"],
        "category": "fun funktionen neu grade10 grade11",
        "keywords": "batman kurve gleichung graph implizit betrag wurzel funktion logo",
        "color": "blue"
    },
    {
        "id": "worldclock",
        "href": "worldclock/worldclock.html",
        "title": "Weltuhr",
        "description": "Die Erde als Uhr: Zeitzonen, Sonnenstand und Tag-Nacht-Grenze live auf der Weltkarte. Sieh, wo gerade die Sonne aufgeht, während bei uns Mitternacht schlägt.",
        "tagline": "Zeitzonen / Astronomie",
        "icon": LAB_ICONS["worldclock"],
        "category": "fun neu",
        "keywords": "weltuhr zeitzonen erde sonne tag nacht terminator karte uhrzeit utc",
        "color": "blue"
    },
    {
        "id": "tracker",
        "href": "tracker/index.html",
        "title": "Doc Alvers Tracker",
        "description": "GPS-Tracking als Web-App: Touren aufzeichnen mit Höhenprofil, Foto-, Voice- und Wissens-Wegpunkten, Regenradar und Live-Sharing. Läuft im Browser und als Android-App.",
        "tagline": "GPS / Touren & Wegpunkte",
        "icon": LAB_ICONS["tracker"],
        "category": "apps",
        "keywords": "tracker gps tour wandern aufzeichnen karte höhenprofil wegpunkte foto radar android app",
        "color": "green"
    },
    {
        "id": "kaimbo",
        "href": "kaimbo/kaimbo.html",
        "title": "Kaimbo Studio",
        "description": "Sprachenlernen mit eigenen Aufgabenlisten: Vokabeln und Sätze als Aufgaben-Serien organisieren, filtern und trainieren — das Studio zu Docs Sprachlern-Werkzeug, jetzt im Browser.",
        "tagline": "Sprachen / Aufgaben-Studio",
        "icon": LAB_ICONS["kaimbo"],
        "category": "apps",
        "keywords": "kaimbo sprachen lernen vokabeln aufgaben training studio languages app",
        "color": "gold"
    },
    {
        "id": "pagode",
        "href": "pagode/index.html",
        "title": "Pagode (230 SL)",
        "description": "Ein Mercedes 230 SL von 1964 trifft Bluetooth: Motor per Funk starten, Kanäle testen, interaktiver Schaltplan — und Solita lernt fahren. Oldtimer-Elektrik mit KI-Fernsteuerung.",
        "tagline": "Oldtimer / BLE-Fernsteuerung",
        "icon": LAB_ICONS["pagode"],
        "category": "apps",
        "keywords": "pagode 230sl mercedes oldtimer ble bluetooth fernsteuerung motor start schaltplan auto app",
        "color": "gold"
    },
    {
        "id": "voicerecorder",
        "href": "voicerecorder/index.html",
        "title": "Voice Recorder",
        "description": "Aufnehmen und live transkribieren: Sprich — er hört zu, schreibt mit und speichert. Im Browser per Web Speech API, als Android-App mit nativer Spracherkennung.",
        "tagline": "Audio / Live-Transkription",
        "icon": LAB_ICONS["voicerecorder"],
        "category": "apps",
        "keywords": "voice recorder aufnahme diktat transkription sprache mikrofon audio notiz app",
        "color": "orange"
    },
    {
        "id": "mathtrainer",
        "href": "mathtrainer/mathtrainer.html",
        "title": "MathTrainer",
        "description": "Mathe trainieren mit Aufgaben-Serien: Kopfrechnen und Schulaufgaben üben, Serien auswählen, Tempo steigern — School is cool. Der SchoolTrainer als Web-App.",
        "tagline": "Training / Aufgaben-Serien",
        "icon": LAB_ICONS["mathtrainer"],
        "category": "apps",
        "keywords": "mathtrainer schooltrainer mathe training üben aufgaben serien kopfrechnen schule app",
        "color": "blue"
    },
    {
        "id": "costablanca",
        "href": "tracker/costablanca.html",
        "title": "Highlights Costa Blanca",
        "description": "Costa-Blanca-Ausflüge zum Abhaken: 22 recherchierte Ziele von Altea bis Valencia mit Fotos, Insider-Tipps und Fortschrittsbalken — in vier Sprachen (DE/EN/ES/IT).",
        "tagline": "Reise / Ausflugs-Checkliste",
        "icon": LAB_ICONS["costablanca"],
        "category": "sonst neu",
        "keywords": "costa blanca altea calpe checkliste ausflüge reise spanien highlights urlaub",
        "color": "orange"
    }
];
