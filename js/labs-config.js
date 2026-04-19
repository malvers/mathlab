/**
 * Cyber-Labor Laboratory Configuration v2.1
 * Centralized registry for all interactive mathematics modules.
 */

const LABS_DATA = [
    {
        "id": "cinematic-intro",
        "href": "intro.html",
        "title": "Cinematic Intro",
        "description": "Erlebe den monumentalen Start in das Doc Alvers Labor. Die ULTRA v5.3.8 Visual Identity in 6-Sekunden-Qualität.",
        "tagline": "Vita Somnium Breve",
        "icon": `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" stroke-width="1.2">
            <circle cx="12" cy="12" r="10" stroke-dasharray="2 4" opacity="0.5"></circle>
            <path d="M10 8l6 4-6 4V8z" fill="var(--neon-blue)"></path>
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" opacity="0.8"></path>
        </svg>`,
        "category": "hot fun",
        "keywords": "intro startup branding reveal ultra",
        "color": "blue"
    },
    {
        "id": "transformationen",
        "href": "transformationen.html",
        "title": "Transformationen",
        "description": "Erforsche Drehung, Verschiebung und Skalierung eines Dreiecks interaktiv. Verschiebe den Rotationspunkt und beobachte die mathematischen Auswirkungen.",
        "tagline": "Kongruenz",
        "icon": `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="var(--neon-green)" stroke-width="1.5">
            <path d="M5 19L12 5l7 14H5z" fill="rgba(173, 255, 47, 0.1)"></path>
            <path d="M16 4a8 8 0 0 1 4 4m-4-4l2 2m-2-2l-2 2" stroke="var(--neon-blue)"></path>
        </svg>`,
        "category": "geometrie hot grade6 grade7 grade8",
        "keywords": "geometrie dreieck transformation rotation translation zoom spiegelung",
        "color": "green"
    },
    {
        "id": "heart3d",
        "href": "heart3d.html",
        "title": "3D Heart Surface",
        "description": "Visualisierung einer impliziten 3D-Fläche. Entdecke die Formel hinter dem mathematischen Herzen.",
        "tagline": "Implizite Funktionen / Herz-Formel",
        "icon": "💖",
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
        "icon": "🍒",
        "category": "fun grade8",
        "keywords": "3d oberfläche litschi litchi visualisierung",
        "color": "purple"
    },
    {
        "id": "winkelsumme3d",
        "href": "winkelsumme3d.html",
        "title": "3D Winkelsumme",
        "description": "Erlebe die Winkelsumme im 3-dimensionalen Raum. Dynamische Visualisierung der inneren Winkel eines Dreiecks.",
        "tagline": "Räumliche Visualisierung / Animation",
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20,80 L 80,80 L 50,20 Z" fill="rgba(0, 210, 255, 0.1)" stroke="white" stroke-width="2" />
            <path d="M 50,20 L 50,80" stroke="rgba(0, 210, 255, 0.5)" stroke-width="1.5" stroke-dasharray="4,2" />
            <path d="M 20,80 L 50,80 L 35,40 Z" fill="rgba(0, 210, 255, 0.3)" stroke="var(--neon-blue)" stroke-width="2">
                <animateTransform attributeName="transform" type="rotate" from="0 50 80" to="-30 50 80" dur="3s" repeatCount="indefinite" />
            </path>
            <path d="M 80,80 L 50,80 L 65,40 Z" fill="rgba(0, 210, 255, 0.3)" stroke="var(--neon-blue)" stroke-width="2">
                <animateTransform attributeName="transform" type="rotate" from="0 50 80" to="30 50 80" dur="3s" repeatCount="indefinite" />
            </path>
            <circle cx="50" cy="80" r="3" fill="white" />
        </svg>`,
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
        "icon": "🛰️",
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
        "icon": `<svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="var(--neon-blue)" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <path d="M3 12h18M12 3v18"></path>
            <circle cx="12" cy="12" r="1.5" fill="var(--neon-blue)"></circle>
        </svg>`,
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
        "icon": "🦋",
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
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 25 L55 15 L85 40 L65 85 L25 75 Z" fill="rgba(198, 33, 40, 0.2)" stroke="white" stroke-width="2" />
            <line x1="20" y1="25" x2="50" y2="55" stroke="white" stroke-width="1.5" />
            <line x1="55" y1="15" x2="50" y2="55" stroke="white" stroke-width="1.5" />
            <line x1="85" y1="40" x2="50" y2="55" stroke="white" stroke-width="1.5" />
            <line x1="65" y1="85" x2="50" y2="55" stroke="white" stroke-width="1.5" />
            <line x1="25" y1="75" x2="50" y2="55" stroke="white" stroke-width="1.5" />
            <circle cx="20" cy="25" r="5" fill="#666" stroke="white" stroke-width="2" />
            <circle cx="55" cy="15" r="5" fill="#666" stroke="white" stroke-width="2" />
            <circle cx="85" cy="40" r="5" fill="#666" stroke="white" stroke-width="2" />
            <circle cx="65" cy="85" r="5" fill="#666" stroke="white" stroke-width="2" />
            <circle cx="25" cy="75" r="5" fill="#666" stroke="white" stroke-width="2" />
            <circle cx="50" cy="55" r="7" fill="#ff9800" stroke="white" stroke-width="2" />
        </svg>`,
        "category": "hot grade8",
        "keywords": "geometrie triangulation delaunay voronoi fläche",
        "color": "green"
    },
    {
        "id": "differentiallabor",
        "href": "differentiallabor.html",
        "title": "Differential-Labor",
        "description": "Meistere die Differentialrechnung. Erkunde den Zusammenhang zwischen einer Funktion und ihrer Ableitung durch die Tangente.",
        "tagline": "Ableitungen / Tangenten / Kurvendiskussion",
        "icon": "⚡",
        "category": "hot grade11",
        "keywords": "differential ableitung tangente analysis funktion kurvendiskussion",
        "color": "blue"
    },
    {
        "id": "eulergerade",
        "href": "eulergerade.html",
        "title": "Euler-Gerade & Feuerbach",
        "description": "Die faszinierende Geometrie des Dreiecks. Entdecke Neunpunktekreis und die Euler'sche Verbindungsgerade.",
        "tagline": "Neunpunktekreis / Schwerpunkt / Geometrie",
        "icon": "🪐",
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
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="20,85 80,85 50,20" fill="rgba(198, 33, 40, 0.8)" stroke="white" stroke-width="4" stroke-linejoin="round" />
            <line x1="20" y1="85" x2="62" y2="38" stroke="white" stroke-width="3" stroke-linecap="round" />
            <line x1="80" y1="85" x2="38" y2="38" stroke="white" stroke-width="3" stroke-linecap="round" />
            <circle cx="20" cy="85" r="6" fill="#666" stroke="white" stroke-width="2" />
            <circle cx="80" cy="85" r="6" fill="#666" stroke="white" stroke-width="2" />
            <circle cx="50" cy="20" r="9" fill="#ff9800" stroke="white" stroke-width="2.5" />
            <text x="50" y="27" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="white" text-anchor="middle">?</text>
        </svg>`,
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
        "icon": "📐",
        "category": "lgs grade8",
        "keywords": "geometrie dreieck gleichschenklig winkel lgs",
        "color": "gold"
    },
    {
        "id": "parabellabor",
        "href": "parabellabor.html",
        "title": "Parabel-Lab",
        "description": "Manipulation quadratischer Funktionen. Verstehe den Einfluss von Parametern auf die Parabelform.",
        "tagline": "Quadratische Funktionen / Parameter-Studie",
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20,10 Q 50,100 80,10" fill="none" stroke="var(--neon-purple)" stroke-width="5" />
            <circle cx="50" cy="55" r="5" fill="var(--neon-blue)" />
            <circle cx="65" cy="43.75" r="4.5" fill="#ffd700" />
        </svg>`,
        "category": "hot grade9 fun funktionen",
        "keywords": "parabel quadratisch gleichung scheitelpunkt stauchung streckung",
        "color": "purple"
    },
    {
        "id": "winkelsumme",
        "href": "winkelsumme.html",
        "title": "Polygon-Labor",
        "description": "Berechne die Winkelsumme in beliebigen n-Ecken. Entdecke die Formel für die Innenwinkel von Polygonen.",
        "tagline": "Winkelsumme in n-Ecken / Vielecke",
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="25,25 75,25 85,50 75,75 25,75 15,50" fill="rgba(0, 210, 255, 0.2)" stroke="white" stroke-width="2" />
            <circle cx="25" cy="25" r="4" fill="var(--neon-blue)" />
            <circle cx="75" cy="25" r="4" fill="var(--neon-blue)" />
            <circle cx="85" cy="50" r="4" fill="var(--neon-blue)" />
            <circle cx="75" cy="75" r="4" fill="var(--neon-blue)" />
            <circle cx="25" cy="75" r="4" fill="var(--neon-blue)" />
            <circle cx="15" cy="50" r="4" fill="var(--neon-blue)" />
        </svg>`,
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
        "icon": "📈",
        "category": "fun grade8 grade9 hot",
        "keywords": "exponent wurzel wachstum kurvendiskussion funktion",
        "color": "blue"
    },
    {
        "id": "pythagorasbeweis",
        "href": "pythagorasbeweis.html",
        "title": "Pythagoras Beweis",
        "description": "Geometrischer Beweis des Satzes von Pythagoras. Schiebe Flächen umher, um den Zusammenhang zu visualisieren.",
        "tagline": "Quadrate / Beweis durch Zerlegung",
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="20,80 80,80 20,20" fill="rgba(198, 33, 40, 0.8)" stroke="white" stroke-width="4" stroke-linejoin="round" />
            <polyline points="20,65 35,65 35,80" fill="none" stroke="white" stroke-width="3" />
            <circle cx="80" cy="80" r="7" fill="#666" stroke="white" stroke-width="2" />
            <circle cx="20" cy="20" r="7" fill="#666" stroke="white" stroke-width="2" />
            <circle cx="20" cy="80" r="7" fill="#ff9800" stroke="white" stroke-width="2" />
        </svg>`,
        "category": "pythagoras grade8",
        "keywords": "geometrie pythagoras beweis fläche quadrat",
        "color": "purple"
    },
    {
        "id": "pythagoras",
        "href": "pythagoras.html",
        "title": "Pythagoras",
        "description": "Entdecke den Satz des Pythagoras durch interaktive Flächenvergleiche und Beweis-Animationen.",
        "tagline": "Geometrie / Rechtwinkliges Dreieck / Beweis",
        "icon": "🛸",
        "category": "pythagoras grade8",
        "keywords": "geometrie rechtwinklig dreieck fläche beweis",
        "color": "orange"
    },
    {
        "id": "steigung",
        "href": "steigung.html",
        "title": "Steigungs-Labor",
        "description": "Verstehe die Steigung an jedem Punkt einer Kurve. Die Basis für die Differentialrechnung.",
        "tagline": "Differentialrechnung / Ableitung / Tangente",
        "icon": "🚀",
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
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="80" x2="90" y2="80" stroke="var(--neon-blue)" stroke-width="4" />
            <line x1="20" y1="90" x2="70" y2="10" stroke="var(--neon-purple)" stroke-width="4" />
            <path d="M 50,80 A 25,25 0 0,0 65,65" fill="none" stroke="var(--neon-yellow)" stroke-width="3" />
            <circle cx="56" cy="74" r="3" fill="var(--neon-yellow)" />
        </svg>`,
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
        "icon": "🕒",
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
        "icon": `<svg width="42" height="42" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs><clipPath id="triClip"><polygon points="20,80 80,80 50,20" /></clipPath></defs>
            <g clip-path="url(#triClip)">
                <circle cx="20" cy="80" r="18" fill="rgb(255, 177, 0)" />
                <circle cx="80" cy="80" r="18" fill="rgb(119, 181, 33)" />
                <circle cx="50" cy="20" r="18" fill="rgb(198, 33, 40)" />
            </g>
            <path d="M 32,20 A 18,18 0 0,1 50,20 Z" fill="rgb(255, 177, 0)" />
            <path d="M 50,20 A 18,18 0 0,1 68,20 Z" fill="rgb(119, 181, 33)" />
            <line x1="5" y1="20" x2="95" y2="20" stroke="rgb(198, 33, 40)" stroke-width="4" stroke-linecap="round" />
            <line x1="5" y1="80" x2="95" y2="80" stroke="rgb(198, 33, 40)" stroke-width="4" stroke-linecap="round" />
            <polygon points="20,80 80,80 50,20" fill="none" stroke="#00d2ff" stroke-width="4" stroke-linejoin="round" />
        </svg>`,
        "category": "dreiecke grade8",
        "keywords": "geometrie dreieck problem knobeln problemloesen",
        "color": "orange"
    },
    {
        "id": "integralreaktor",
        "href": "integralreaktor.html",
        "title": "Integral-Simulator",
        "description": "Die Energie der Fläche. Visualisiere bestimmte Integrale, Riemann-Summen und Näherungsverfahren in einem interaktiven Simulator.",
        "tagline": "Integralrechnung / Riemann-Summen / Flächen",
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill="rgba(0, 210, 255, 0.05)" stroke="var(--neon-blue)" stroke-width="2" stroke-dasharray="10,5" />
            <path d="M 40,35 L 40,65 M 40,35 C 55,35 55,65 70,65 M 70,35 L 70,65" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" />
            <text x="50" y="65" font-family="'Orbitron'" font-size="30" fill="var(--neon-blue)" text-anchor="middle" style="filter: drop-shadow(0 0 10px var(--neon-blue));">∫</text>
            <circle cx="50" cy="50" r="15" fill="none" stroke="var(--neon-purple)" stroke-width="1">
                <animate attributeName="r" values="10;25;10" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
            </circle>
        </svg>`,
        "category": "hot grade11 grade12 oberstufe analysis funktionen",
        "keywords": "integral analysis fläche summe riemann reaktor",
        "color": "blue"
    }
];
