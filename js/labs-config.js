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
 * top5 (Hub-Kachel): fourier, mandelbrot-deep (Fraktale), atomorbitale, galtonboard, opti-lens (Linse)
 * Keine Jahrgangs-Tags: cinematic-intro, happy-birthday-ulf (Show / Spaß).
 * ————————————————————————————————————————————————————————————————
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
        "icon": `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="var(--neon-green)" stroke-width="1.5">
            <path d="M5 19L12 5l7 14H5z" fill="rgba(173, 255, 47, 0.1)"></path>
            <path d="M16 4a8 8 0 0 1 4 4m-4-4l2 2m-2-2l-2 2" stroke="var(--neon-blue)"></path>
        </svg>`,
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
        "id": "addition",
        "href": "addition.html",
        "title": "Schriftliche Addition",
        "description": "Lerne die schriftliche Addition Schritt für Schritt. Visualisiert den Spaltenaufbau und das Übertrag-System in Echtzeit.",
        "tagline": "Grundrechenarten / Spalten-Analyse",
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="15" width="70" height="70" rx="10" fill="rgba(0, 210, 255, 0.1)" stroke="#00d2ff" stroke-width="2" />
            <line x1="50" y1="35" x2="50" y2="65" stroke="#00d2ff" stroke-width="6" stroke-linecap="round" />
            <line x1="35" y1="50" x2="65" y2="50" stroke="#00d2ff" stroke-width="6" stroke-linecap="round" />
        </svg>`,
        "category": "arithmetik grade5 hot",
        "keywords": "addition plusrechnen schriftlich addieren mathe schule",
        "color": "blue"
    },
    {
        "id": "subtraktion",
        "href": "subtraktion.html",
        "title": "Schriftliche Subtraktion",
        "description": "Trainiere die schriftliche Subtraktion mit Entborgen Schritt für Schritt. Interaktive Spaltenhilfe für saubere Minusrechnung.",
        "tagline": "Grundrechenarten / Entborgen",
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="15" width="70" height="70" rx="10" fill="rgba(255, 77, 77, 0.1)" stroke="#ff4d4d" stroke-width="2" />
            <line x1="32" y1="50" x2="68" y2="50" stroke="#ff4d4d" stroke-width="6" stroke-linecap="round" />
        </svg>`,
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
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="15" width="70" height="70" rx="10" fill="rgba(255, 215, 0, 0.1)" stroke="#ffd700" stroke-width="2" />
            <circle cx="50" cy="50" r="6" fill="#ffd700" />
        </svg>`,
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
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="15" width="70" height="70" rx="10" fill="rgba(173, 255, 47, 0.1)" stroke="#adff2f" stroke-width="2" />
            <circle cx="50" cy="35" r="5" fill="#adff2f" />
            <line x1="35" y1="50" x2="65" y2="50" stroke="#adff2f" stroke-width="5" stroke-linecap="round" />
            <circle cx="50" cy="65" r="5" fill="#adff2f" />
        </svg>`,
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
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- Rectangular Frame -->
            <rect x="15" y="25" width="70" height="55" fill="rgba(0, 210, 255, 0.15)" stroke="#00d2ff" stroke-width="1.5" />
            <!-- Fold Lines meeting at the bottom center (50, 80) -->
            <line x1="15" y1="25" x2="50" y2="80" stroke="#00d2ff" stroke-width="1" />
            <line x1="85" y1="25" x2="50" y2="80" stroke="#00d2ff" stroke-width="1" />
            <!-- The 3 Colored Angle Sectors forming a semi-circle -->
            <path d="M 32,80 A 18,18 0 0,1 42,65 L 50,80 Z" fill="#ffb100" />
            <path d="M 42,65 A 18,18 0 0,1 58,65 L 50,80 Z" fill="#ff4d4d" />
            <path d="M 58,65 A 18,18 0 0,1 68,80 L 50,80 Z" fill="#adff2f" />
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
            <path d="M20 25 L55 15 L85 40 L65 85 L25 75 Z" fill="rgba(198, 33, 40, 0.2)" stroke="white" stroke-width="1" />
            <line x1="20" y1="25" x2="50" y2="55" stroke="white" stroke-width="0.7" />
            <line x1="55" y1="15" x2="50" y2="55" stroke="white" stroke-width="0.7" />
            <line x1="85" y1="40" x2="50" y2="55" stroke="white" stroke-width="0.7" />
            <line x1="65" y1="85" x2="50" y2="55" stroke="white" stroke-width="0.7" />
            <line x1="25" y1="75" x2="50" y2="55" stroke="white" stroke-width="0.7" />
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
        "id": "stanford-portal",
        "href": "https://www.stanford.edu/",
        "title": "Stanford University",
        "description": "Elite-Forschungsuni im Silicon Valley: Spitzenforschung, offene Ideen und eine Campus-Kultur, die Tech und Wissenschaft weltweit prägt. Ergänzend zu den Uni-Labs hier im Portal.",
        "tagline": "Stanford · Kalifornien · Forschung & Lehre",
        "icon": `<svg class="stanford-lab-card-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 162 248.022" focusable="false" aria-hidden="true"><g fill-rule="nonzero"><path fill="#8c1515" d="m35.872 1.1236-34.558 33.832v90.907l30.041 30.665h13.776c-0.33541 0.92261-0.77516 2.3452 0.18119 3.7375 1.0401 1.5433 2.835 1.5433 3.5228 1.5433 0.80522 0 1.9291-0.10059 3.6571-0.33551h0.02027s0.72132 0.64079-1.4762 1.3621c-1.8117 0.63746-3.3919 1.6909-3.912 3.5025-0.03436 0.13399-0.04703 0.27196-0.08053 0.38918h-45.716l-0.013433 46.465 34.558 33.953h90.887l34.558-33.905v-87.077l-30.047-30.618h-25.478c-0.0172 0-0.0403-0.0134-0.0403-0.0134-1.1239-0.67099-2.2781-1.3789-3.3349-2.0667l-0.38917-0.24828-0.0671-0.04026c-0.57036-0.35214-1.1709-0.78508-1.8251-1.3554-0.57036-0.45294-1.0434-0.90584-1.3957-1.3085l-0.10066-0.10066c-0.67099-0.70459-1.2581-1.3789-1.7111-1.966 3.9756 1.1407 8.3071 1.4292 10.387 1.4963h0.24828c0.13399 0 0.27196 0.02027 0.38918 0.02027l0.18116 0.0134c0.50323 0.03436 0.88907 0.11712 1.1407 0.20129 0.26842 0.10049 0.5066 0.22159 0.72469 0.32208l1.0736 0.40261c0.25165 0.06699 0.52 0.08053 0.80522 0.08053 1.5601 0 3.0195-0.93941 3.6904-2.4156 0.21816-0.50327 0.5536-1.5064 0.30195-2.8316l45.442 0.03367v-50.76l-34.551-33.886h-90.887z"/><path fill="#fff" d="m157.19 36.804-32.1-31.487h-87.55l-32.108 31.436v87.382l27.628 28.182 17.815 0.0172c-1.9963 1.7949-2.6169 3.6569-2.9357 4.5628-0.68775 1.9962-1.4091 2.5665 4.8479 1.6943 1.9795-0.28515 5.5862-1.5601 7.2803-2.7008 1.6607-1.1407 4.9484-0.21816 4.6633 2.2479-1.5433 3.7743-5.502 6.1397-9.2768 6.6095-8.6893 1.0904-4.9317 4.3279-4.9317 4.3279 0.95619 0.65426 1.644 1.2917 2.1305 1.8621h-4.2273v-0.0172h-42.978l-0.017178 40.478 32.091 31.537h87.567l32.09-31.487v-83.539l-27.628-28.148h-22.327c-1.7781-1.1911-4.177-2.5163-6.3578-3.9421 0-0.01718 0-0.01718-0.0172-0.01718-0.83874-0.48647-1.6607-1.0903-2.4491-1.7781-0.65421-0.52001-1.2413-1.0736-1.7446-1.6272-1.9291-2.013-3.3717-4.1099-3.7576-5.0829-0.72133-1.7781-0.55355-4.026 1.0736-3.1034 4.1267 2.3821 10.904 2.835 13.42 2.9189 0.28515 0 2.3149 0.2349 2.8014 0.38564 0.50322 0.20141 1.2749 0.57034 1.2749 0.57034 1.0233 0.43614 2.8685-0.97294 0.73812-3.5731-0.55359-0.88907-1.3923-1.9124-2.3821-2.9524h47.354v-44.756"/><path fill="#8c1515" transform="matrix(.80001 0 0 .80001 -.00065308 0)" d="m48.988 11.889l-37.05 36.297v104.79l31.537 32.17h29.607c5.053-2.22 6.123-2.03 7.527-4.86 0.21-0.45 0.418-1.75 0.44-3.02 0.063-0.36 0.693-4.18-1.153-3.25-3.166 1.59-9.562-2.61-14.343-0.11-4.781 2.47-1.279-3.27-0.608-4.26 0 0 2.558-3.37 6.416-5.6 0.147-0.08 0.273-0.16 0.377-0.25 0.378-0.21 0.756-0.39 1.155-0.58 2.935-1.37 11.3-6.94 12.81-8.68 0.902-1.01 2.496-3.32 2.559-4.6 0.272-1.11 0.483-2.87-0.586-3.56-1.594-1.05-2.874 1-5.369 2.12-2.496 1.11-4.383 1.57-6.606 1.65-2.138 0.07-4.193-0.75-5.472-0.56-1.28 0.21-2.035-0.76 0.314-3.13 1.069-1.07 1.532-1.55 2.035-1.91 5.578-3.58 10.589-3.62 13.399-9.98 0 0 2.181-5.7-2.034-3.27-2.306 1.34-3.564 3.27-10.17 3.27-6.584 0-9.164 3.13-10.275 4.49 0 0-4.486 6.27-3.375-2.52 1.133-8.76 2.83-13.23 6.961-16.65 3.564-2.93 12.412-6.87 15.6-11.21 1.635-1.62 5.746-6.32 3.355-10.299-1.007-1.678-3.459 2.669-5.996 3.229-2.894 0.76-6.563 1.7-9.373 1.13-3.481-0.69-5.704 0.63-7.004 1.22s-3.754-1.28-0.756-4.698c4.026-4.592 13.757-10.588 20.299-14.174 0.902-0.378 3.102-1.342 5.115-2.621 0.042-0.022 0.084-0.043 0.106-0.043 0.503-0.231 1.237-0.672 1.656-1.238 1.426-1.196 2.412-2.536 2.076-3.899-0.293-1.237-0.903-1.657-2.832-1.867-1.53-0.147-4.066 1.636-6.205 1.469-3.271-0.273-8.074 0.481-6.48-1.846 1.488-2.16 3.899-3.545 4.591-3.922 1.342-0.608 3.146-1.404 5.809-2.6 4.173-1.887 3.585-6.625 1.971-6.792-2.517-0.273-9.31 1.906-4.53-3.545 0 0 2.266-2.285 4.551-3.774 1.803-1.048 3.292-1.447 5.074-2.098 1.112-0.398 4.028-2.977-2.892-3.25 0 0-3.859 0.105-3.125-1.677 0.608-1.174 4.006-3.313 4.006-3.313s2.724-1.867 3.836-2.978c1.069-1.028 1.824-1.845 1.761-2.768-0.042-1.048-2.768-2.348-3.922-3.816-0.817-1.049-0.125-1.425 0.336-1.551 0.252-0.041 0.546-0.084 0.903-0.084 2.809 0.021 3.606-2.789 5.246-10.086 0.48-2.181 0.52-2.641 1.23-2.662 0.07 0 0.11 0.021 0.15 0.021 0 0 0.69 3.69 1.7 7.821 0.86 2.285 1.8 3.25 3.46 3.228 0.33 0 0.63 0.041 0.88 0.084 0.46 0.126 1.17 0.505 0.33 1.553-0.63 0.818-2.51 2.139-2.66 2.936-0.54 2.264 1.62 3.082 3.82 3.25 3.12 0.209 1.82 2.159-1.55 4.654-3.25 2.411 5.07 7.57 5.07 7.57 4.74 3.67 1.36 4.612 0.4 5.137-0.97 0.503-3.63 2.139-0.97 3.187 2.69 1.028 6.38 4.739 6.38 4.739 4.76 5.451-2.02 3.293-4.53 3.545-1.62 0.167-2.2 4.926 1.97 6.793 6.35 2.872 7.76 3.355 10 5.033 4.19 3.103 1.97 5.745-3.27 4.822 0 0-3.35-0.838-5.7-0.377-1.47 0.273-2.48 0.608-3.17 0.965-0.36 0.545-1.19 2.704 6.1 4.947 3.48 1.09 7.8 3.713 11.64 6.711l59.81-0.062-0.01-48.457-37.05-36.338h-105.3zm90.312 118.05c1.72 2.85 2.72 6.58 3.46 12.06 0.02 3.29-4.32 1.69-5.73 0.83-0.98-0.67-2.28-1.29-3.96-1.69-3.17-0.76-10.71-4.07-12.77-4.81-2.1-0.77-3.63 0.78-3.88 1.37h0.02c-0.54 1 0.57 3.02 0.57 3.02 2.96 6.71 8.41 6.35 14.4 10.65 8.24 5.87 3.84 7.11 2.14 6.23-1.67-0.9-4.44-0.34-4.44-0.34-6.65 1.83-8.64-0.94-12.54-1.97-3.88-1.05-0.69 3.78 0.71 5.39 1.49 1.74 9.88 7.32 12.79 8.68 6.36 2.96 9.67 7.76 11.64 13.86 1.87 5.77-0.17 4.51-1.68 3.8-1.51-0.72-1.95-2.27-5.7-2.18-3.77 0.08-5.89-0.19-8.58-2.31-0.71-0.55-1.28-1.18-1.76-1.7-0.04-0.02-0.06-0.04-0.08-0.06-2.58-1.97-2.08 4.57-1.55 5.64 1.86 3.75 3.12 2.22 13.86 7.95 5.09 2.72 6.29 6.37 6.83 7.9 0.86 2.48 1.74 3.19-6.06 2.1-2.49-0.34-6.98-1.93-9.12-3.38-2.05-1.42-6.18-0.27-5.81 2.81 1.93 4.72 6.88 7.68 11.6 8.26 4.13 0.53 6 1.43 6.75 2.35 2.26 2.58-1.93 6.36-1.93 6.36-2.1 2.43 0.17 5.28 1.72 6.12 2.52 1.28 7.4 4.21 9.02 8.41 8.47 21.8 0.27 15.55-3.74 13.06-4.02-2.5-11.68-8.91-18.66-8.35-6.98 0.55-9.31 0.93-13.46-2.37-4.13-3.29-3.73 2.04-3.73 2.04v26.29c0.25 5.89 1.34 11.51 6.02 16.27 3.83 3.93 6.75 3.19 12.16 9.8 2.49 3.04 10.63 6.31 16.06 6.37l10.42 0.02 37.05-36.34v-100.04l-31.51-32.1h-20.53zm-127.34 88.97l-0.021 43.09 37.05 36.36h11.91c11.198-0.55 15.391-9.23 18.788-14.57 2.558-4.05 7.088-7.49 9.961-10.43 3.04-3.08 3.586-10.13 3.669-17.76v-15.93l0.022 0.16v-3.81h0.021v-2.54h0.002v-0.59-6.87c0-1.6-1.845-1.72-5.871 2.64-4.047 4.34-10.819 3.98-14.74 4.34-3.921 0.35-15.202 6.23-18.432 10.44-1.992 2.62-4.823 0.46-3.67-4.7h-0.042c0.545-2.32 1.551-5.45 3.166-9.58 2.222-5.76 10.568-9.14 10.568-9.14s0.86-0.38 1.615-1.11h-53.996z"/></g></svg>`,
        "category": "uni highlight",
        "keywords": "stanford university kalifornien silicon valley forschung campus stanford.edu",
        "color": "blue"
    },
    {
        "id": "differentiallabor",
        "href": "differentiallabor.html",
        "title": "Differential-Labor",
        "description": "Meistere die Differentialrechnung. Erkunde den Zusammenhang zwischen einer Funktion und ihrer Ableitung durch die Tangente.",
        "tagline": "Ableitungen / Tangenten / Kurvendiskussion",
        "icon": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g transform="translate(50 50) scale(1.22) translate(-50 -50)">
            <line x1="18" y1="82" x2="92" y2="82" stroke="white" stroke-width="1"/>
            <path d="M 22,74 Q 42,18 54,38 Q 68,56 88,28" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="34" y1="66" x2="74" y2="26" stroke="var(--neon-cyan)" stroke-width="2" stroke-linecap="round"/>
            <circle cx="52" cy="38" r="4.2" fill="rgba(0,210,255,0.22)" stroke="var(--neon-cyan)" stroke-width="1.2"/>
            <text x="50" y="68" font-family="'Orbitron', sans-serif" font-size="56" fill="var(--neon-purple)" text-anchor="middle" style="filter: drop-shadow(0 0 14px var(--neon-purple)); opacity: 0.82;">′</text>
            </g>
        </svg>`,
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
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="20,80 85,80 50,20" fill="none" stroke="rgb(128, 128, 128)" stroke-width="1.5" />
            <!-- Euler Line -->
            <line x1="5" y1="65" x2="95" y2="35" stroke="var(--neon-purple)" stroke-width="1.5" />
            <!-- Nine-point Circle -->
            <circle cx="50" cy="50" r="28" fill="none" stroke="var(--neon-blue)" stroke-width="1.2" opacity="0.6" />
            <!-- Centroid/Points on the line -->
            <circle cx="20" cy="60" r="2" fill="white" />
            <circle cx="50" cy="50" r="2" fill="white" />
            <circle cx="80" cy="40" r="2" fill="white" />
        </svg>`,
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
            <polygon points="20,85 80,85 50,20" fill="rgba(157, 78, 221, 0.4)" stroke="rgb(128, 128, 128)" stroke-width="1.5" stroke-linejoin="round" />
            <line x1="20" y1="85" x2="62" y2="38" stroke="rgb(128, 128, 128)" stroke-width="1.2" />
            <line x1="80" y1="85" x2="38" y2="38" stroke="rgb(128, 128, 128)" stroke-width="1.2" />
            <circle cx="20" cy="85" r="4" fill="#666" />
            <circle cx="80" cy="85" r="4" fill="#666" />
            <circle cx="50" cy="20" r="7" fill="#ff9800" />
            <text x="50" y="25" font-family="'Orbitron', sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">?</text>
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
        "title": "Parabeln",
        "description": "Manipulation quadratischer Funktionen. Verstehe den Einfluss von Parametern auf die Parabelform.",
        "tagline": "Quadratische Funktionen / Parameter-Studie",
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20,20 Q 50,110 80,20" fill="none" stroke="var(--neon-purple)" stroke-width="2" stroke-linecap="round" />
            <circle cx="50" cy="65" r="3.5" fill="var(--neon-blue)" />
            <circle cx="65" cy="53.75" r="3" fill="#ffd700" />
        </svg>`,
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
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,15 80.3,32.5 80.3,67.5 50,85 19.7,67.5 19.7,32.5" fill="rgba(0, 210, 255, 0.2)" stroke="white" stroke-width="1.5" />
            <circle cx="50" cy="15" r="3" fill="var(--neon-blue)" />
            <circle cx="80.3" cy="32.5" r="3" fill="var(--neon-blue)" />
            <circle cx="80.3" cy="67.5" r="3" fill="var(--neon-blue)" />
            <circle cx="50" cy="85" r="3" fill="var(--neon-blue)" />
            <circle cx="19.7" cy="67.5" r="3" fill="var(--neon-blue)" />
            <circle cx="19.7" cy="32.5" r="3" fill="var(--neon-blue)" />
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
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="20,80 80,80 20,20" fill="rgba(255, 152, 0, 0.8)" stroke="rgb(128, 128, 128)" stroke-width="2" stroke-linejoin="round" />
            <polyline points="20,65 35,65 35,80" fill="none" stroke="rgb(0, 0, 60)" stroke-width="1.5" />
            <circle cx="80" cy="80" r="4" fill="#a00" />
            <circle cx="20" cy="20" r="4" fill="#a00" />
            <circle cx="20" cy="80" r="4" fill="#a00" />
        </svg>`,
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
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="20,80 80,80 20,20" fill="rgba(173, 255, 47, 0.8)" stroke="rgb(128, 128, 128)" stroke-width="2" stroke-linejoin="round" />
            <polyline points="20,65 35,65 35,80" fill="none" stroke="rgb(0, 0, 60)" stroke-width="1.5" />
            <circle cx="80" cy="80" r="4" fill="#a00" />
            <circle cx="20" cy="20" r="4" fill="#a00" />
            <circle cx="20" cy="80" r="4" fill="#a00" />
        </svg>`,
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
            <line x1="10" y1="40" x2="90" y2="40" stroke="var(--neon-blue)" stroke-width="3" />
            <line x1="10" y1="75" x2="90" y2="75" stroke="var(--neon-blue)" stroke-width="3" />
            <line x1="20" y1="90" x2="80" y2="25" stroke="var(--neon-purple)" stroke-width="3" />
            <circle cx="34" cy="75" r="4" fill="rgba(0, 210, 255, 0.3)" stroke="var(--neon-blue)" stroke-width="1" />
            <circle cx="65.5" cy="40" r="4" fill="rgba(0, 210, 255, 0.3)" stroke="var(--neon-blue)" stroke-width="1" />
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
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs><clipPath id="triClip"><polygon points="10,85 90,85 50,15" /></clipPath></defs>
            <g clip-path="url(#triClip)">
                <circle cx="10" cy="85" r="25" fill="rgb(255, 177, 0)" />
                <circle cx="90" cy="85" r="25" fill="rgb(119, 181, 33)" />
                <circle cx="50" cy="15" r="25" fill="rgb(198, 33, 40)" />
            </g>
            <line x1="0" y1="15" x2="100" y2="15" stroke="rgb(198, 33, 40)" stroke-width="3" />
            <line x1="0" y1="85" x2="100" y2="85" stroke="rgb(198, 33, 40)" stroke-width="3" />
            <polygon points="10,85 90,85 50,15" fill="none" stroke="#00d2ff" stroke-width="3" stroke-linejoin="round" />
        </svg>`,
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
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="25" height="25" fill="none" stroke="#00d2ff" stroke-width="2" rx="4" />
            <rect x="55" y="20" width="25" height="25" fill="none" stroke="#00d2ff" stroke-width="2" rx="4" />
            <rect x="20" y="55" width="25" height="25" fill="none" stroke="#00d2ff" stroke-width="2" rx="4" />
            <rect x="55" y="55" width="25" height="25" fill="none" stroke="#adff2f" stroke-width="2" rx="4" />
            <circle cx="50" cy="50" r="5" fill="#adff2f" />
        </svg>`,
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
        "icon": `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g transform="translate(50 50) scale(1.22) translate(-50 -50)">
            <line x1="20" y1="80" x2="90" y2="80" stroke="white" stroke-width="1"/>
            <path d="M 20,80 L 20,65 Q 45,15 60,55 T 90,40 L 90,80 Z" fill="rgba(0, 210, 255, 0.2)"/>
            <path d="M 20,65 Q 45,15 60,55 T 90,40" fill="none" stroke="white" stroke-width="1.5"/>
            <text x="50" y="62" font-family="'Orbitron', sans-serif" font-size="64" fill="var(--neon-purple)" text-anchor="middle" style="filter: drop-shadow(0 0 15px var(--neon-purple)); opacity: 0.82;">∫</text>
            </g>
        </svg>`,
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
        "icon": "🎻",
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
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20 50 Q 35 25 50 50 T 80 50" fill="none" stroke="var(--neon-cyan)" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M 50 22 Q 62 50 50 78 Q 38 50 50 22" fill="none" stroke="var(--neon-purple)" stroke-width="1.4" stroke-linecap="round" opacity="0.85"/>
            <circle cx="50" cy="50" r="2.2" fill="var(--neon-green)"/>
        </svg>`,
        "category": "fun geometrie hot highlight grade11 grade12 oberstufe uni",
        "keywords": "lissajous harmonisch schwingung frequenz phase parametrische kurve pendel figur",
        "color": "blue"
    },
    {
        "id": "cmaes",
        "href": "cmaes.html",
        "title": "CMA-ES Optimierer",
        "description": "Die Evolution der Form. Nutze die Covariance Matrix Adaptation Evolution Strategy zur Echtzeit-Optimierung komplexer Geometrien. Ein Blick in die Zukunft der computergestützten Linsengestaltung.",
        "tagline": "Evolutionäre Strategien / Optimierung",
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="35" fill="none" stroke="var(--neon-green)" stroke-width="1" stroke-dasharray="2 4" />
            <circle cx="50" cy="50" r="5" fill="var(--neon-green)" />
            <path d="M 50 15 L 50 35 M 50 65 L 50 85 M 15 50 L 35 50 M 65 50 L 85 50" stroke="var(--neon-green)" stroke-width="2" />
            <path d="M 30 30 Q 50 50 70 70" stroke="var(--neon-blue)" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.6" />
        </svg>`,
        "category": "hot highlight fun grade10 grade11 grade12 uni",
        "keywords": "cmaes evolution optimierung linsen optik strategie simulation",
        "color": "green"
    },
    /*
     * Happy-Birthday-Kachel (Cyber-Cake): temporär aus — happybirthday.html per direktem Link weiter nutzbar.
    {
        "id": "happy-birthday-ulf",
        "href": "happybirthday.html?name=Ulf",
        "title": "Happy Birthday",
        "description": "Eine kosmische Glückwunsch-Site mit Feuerwerk, Konfetti und animierter Geburtstagstorte. Klick für Raketen, SPACE für das große Finale.",
        "tagline": "Konfetti / Feuerwerk / Cyber-Cake",
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="82" rx="34" ry="5" fill="#1a2440" />
            <rect x="22" y="55" width="56" height="22" rx="3" fill="#ff6fb3" stroke="rgba(255,255,255,0.18)" stroke-width="0.5" />
            <rect x="30" y="40" width="40" height="18" rx="3" fill="#ffd1f0" stroke="rgba(255,255,255,0.18)" stroke-width="0.5" />
            <rect x="38" y="28" width="24" height="14" rx="3" fill="#ffd76a" stroke="rgba(255,255,255,0.18)" stroke-width="0.5" />
            <rect x="44" y="14" width="3" height="14" fill="#cf2a6c" />
            <rect x="53" y="14" width="3" height="14" fill="#cf2a6c" />
            <ellipse cx="45.5" cy="11" rx="2.5" ry="4" fill="#ffd24a" style="filter: drop-shadow(0 0 4px #ffaa00);" />
            <ellipse cx="54.5" cy="11" rx="2.5" ry="4" fill="#ffd24a" style="filter: drop-shadow(0 0 4px #ffaa00);" />
            <circle cx="15" cy="20" r="1.5" fill="#00d2ff" />
            <circle cx="85" cy="22" r="1.5" fill="#ff3ed1" />
            <circle cx="12" cy="50" r="1.2" fill="#ffcc00" />
            <circle cx="88" cy="55" r="1.2" fill="#9d50bb" />
        </svg>`,
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
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="14" r="3" fill="#ff9f3b" />
            <circle cx="40" cy="27" r="2.4" fill="#9de8ff" />
            <circle cx="60" cy="27" r="2.4" fill="#9de8ff" />
            <circle cx="30" cy="40" r="2.2" fill="#9de8ff" />
            <circle cx="50" cy="40" r="2.2" fill="#9de8ff" />
            <circle cx="70" cy="40" r="2.2" fill="#9de8ff" />
            <rect x="22" y="55" width="12" height="22" fill="rgba(255,159,59,0.85)" />
            <rect x="38" y="49" width="12" height="28" fill="rgba(255,159,59,0.9)" />
            <rect x="54" y="43" width="12" height="34" fill="rgba(255,159,59,0.95)" />
            <rect x="70" y="51" width="12" height="26" fill="rgba(255,159,59,0.9)" />
            <line x1="18" y1="77" x2="84" y2="77" stroke="rgba(190,235,255,0.8)" stroke-width="1" />
        </svg>`,
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
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="5" fill="var(--neon-cyan)" style="filter: drop-shadow(0 0 6px var(--neon-cyan));" />
            <ellipse cx="50" cy="50" rx="34" ry="10" fill="none" stroke="var(--neon-blue)" stroke-width="1.4" />
            <ellipse cx="50" cy="50" rx="10" ry="34" fill="none" stroke="var(--neon-purple)" stroke-width="1.4" transform="rotate(30 50 50)" />
            <path d="M 50 20 Q 62 40 50 50 Q 38 40 50 20 M 50 50 Q 62 60 50 80 Q 38 60 50 50" fill="none" stroke="var(--neon-green)" stroke-width="1.2" />
        </svg>`,
        "category": "highlight hot grade11 grade12 oberstufe fun uni top5",
        "keywords": "atom orbital kugelflächenfunktion kff harmonische ylm wahrscheinlichkeit 3d quanten chemie physik d orbital",
        "color": "blue"
    },
    {
        "id": "opti-lens",
        "href": "LensStandalone/cmaes_java.html",
        "title": "OPTI-LENS Premium",
        "description": "Premium-Edition der CMA-ES Linsenoptimierung. Symmetriemodus, oszillierender Brennpunkt, Echtzeit-Strahlsimulation und interaktive Maus-Zoom-Steuerung in einem standalone Hochleistungs-Lab.",
        "tagline": "Linsen-Evolution / Strahlenoptik / CMA-ES",
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <line x1="5" y1="28" x2="40" y2="28" stroke="var(--neon-cyan)" stroke-width="1.2" opacity="0.7" />
            <line x1="5" y1="50" x2="40" y2="50" stroke="var(--neon-cyan)" stroke-width="1.2" opacity="0.7" />
            <line x1="5" y1="72" x2="40" y2="72" stroke="var(--neon-cyan)" stroke-width="1.2" opacity="0.7" />
            <path d="M 50 18 Q 35 50 50 82 Q 65 50 50 18 Z" fill="rgba(0, 210, 255, 0.18)" stroke="var(--neon-cyan)" stroke-width="1.5" />
            <line x1="60" y1="28" x2="92" y2="50" stroke="var(--neon-blue)" stroke-width="1.2" opacity="0.85" />
            <line x1="60" y1="50" x2="92" y2="50" stroke="var(--neon-blue)" stroke-width="1.2" opacity="0.85" />
            <line x1="60" y1="72" x2="92" y2="50" stroke="var(--neon-blue)" stroke-width="1.2" opacity="0.85" />
            <circle cx="92" cy="50" r="3" fill="#ffcc00" style="filter: drop-shadow(0 0 6px #ffcc00);" />
        </svg>`,
        "category": "hot highlight fun grade10 grade11 grade12 uni top5",
        "keywords": "linse opti lens optik strahlen brennpunkt cmaes evolution premium standalone symmetrie refraktion",
        "color": "blue"
    },
    {
        "id": "cool-squares",
        "href": "coolsquares.html",
        "title": "Cool Squares",
        "description": "Der ultimative geometrische Beweis. Verfolge die Spirale der Quadrate und entdecke, warum die Variable x am Ende keine Rolle spielt. Ein visuelles Aha-Erlebnis.",
        "tagline": "Geometrie / Algebra / Spirale",
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="15" width="40" height="40" fill="rgba(0, 210, 255, 0.15)" stroke="var(--neon-blue)" stroke-width="1.5" />
            <rect x="55" y="15" width="30" height="30" fill="#84cc16" stroke="#84cc16" stroke-width="1.5" />
            <rect x="45" y="45" width="10" height="10" fill="#ffcc00" stroke="#ffcc00" stroke-width="1.5" />
            <path d="M 55 45 L 55 55 L 45 55" fill="none" stroke="#9d50bb" stroke-width="2" />
        </svg>`,
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
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="35" width="40" height="40" fill="rgba(255, 157, 0, 0.15)" stroke="#ff9d00" stroke-width="1.5" />
            <rect x="55" y="35" width="25" height="25" fill="rgba(255, 157, 0, 0.1)" stroke="#ff9d00" stroke-width="1.2" />
            <path d="M 15 75 A 40 40 0 0 1 55 35 A 25 25 0 0 1 80 60" fill="none" stroke="rgb(0, 0, 40)" stroke-width="2.5" />
        </svg>`,
        "category": "fun highlight geometrie hot grade8",
        "keywords": "fibonacci spirale goldener schnitt wachstum quadrat folge unendlichkeit",
        "color": "orange"
    },
    {
        "id": "mandelbrot-deep",
        "href": "mandelbrot_deep.html",
        "title": "Fraktale",
        "description": "Mandelbrot- und Julia-Menge im WebGL-Shader: Iteration z²+c, Tiefenzoom und Pan an der fraktalen Grenze, optionaler Flight-Modus.",
        "tagline": "Mandelbrot / Julia / Komplexe Ebene",
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="juliaCardGrad" x1="15%" y1="85%" x2="85%" y2="15%">
                    <stop offset="0%" stop-color="#6b21a8"/>
                    <stop offset="50%" stop-color="#00d2ff"/>
                    <stop offset="100%" stop-color="#fbbf24"/>
                </linearGradient>
            </defs>
            <!-- Stilisierte Julia-Menge: asymmetrischer Hauptkörper + Satelliten-Bulle am Rand -->
            <path fill="url(#juliaCardGrad)" fill-opacity="0.32" stroke="#00d2ff" stroke-width="1.65" stroke-linejoin="round"
                d="M 52 20 C 78 22 88 48 78 66 C 72 76 56 82 44 76 C 22 64 18 38 36 24 C 40 20 46 19 52 20 Z"/>
            <path fill="none" stroke="#9d50bb" stroke-width="1.35" stroke-linecap="round"
                d="M 44 44 Q 50 30 58 44 Q 50 58 44 44"/>
            <path fill="none" stroke="#ffcc00" stroke-width="1.15" stroke-linecap="round" opacity="0.9"
                d="M 38 58 Q 48 68 62 62"/>
            <circle cx="76" cy="38" r="8" fill="none" stroke="#adff2f" stroke-width="1.35" opacity="0.95"/>
            <circle cx="76" cy="38" r="2.4" fill="#adff2f" opacity="0.8"/>
            <circle cx="48" cy="48" r="3" fill="#050b18" stroke="#e2e8f0" stroke-width="0.9"/>
        </svg>`,
        "category": "fraktale highlight hot grade11 grade12 oberstufe uni top5",
        "keywords": "mandelbrot julia fraktal fractal deep zoom webgl komplex iteration chaos",
        "color": "purple"
    },
    {
        "id": "fermatpunkt",
        "href": "fermatpunkt.html",
        "title": "Fermat-Punkt",
        "description": "Finde den Punkt, dessen Abstandssumme zu den Ecken eines Dreiecks minimal ist. Beweise, dass F das absolute Strecken-Minimum bildet.",
        "tagline": "Kürzeste Netze / Geometrische Optimierung",
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,20 20,70 80,70" fill="rgba(0, 210, 255, 0.1)" stroke="var(--neon-blue)" stroke-width="1.5" />
            <line x1="50" y1="53" x2="50" y2="20" stroke="var(--neon-purple)" stroke-width="1.5" stroke-dasharray="2 2" />
            <line x1="50" y1="53" x2="20" y2="70" stroke="var(--neon-purple)" stroke-width="1.5" stroke-dasharray="2 2" />
            <line x1="50" y1="53" x2="80" y2="70" stroke="var(--neon-purple)" stroke-width="1.5" stroke-dasharray="2 2" />
            <circle cx="50" cy="53" r="3" fill="var(--neon-purple)" />
        </svg>`,
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
        "icon": `<svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <line x1="20" y1="80" x2="80" y2="20" stroke="var(--neon-blue)" stroke-width="2.5" />
            <line x1="20" y1="30" x2="80" y2="70" stroke="var(--neon-orange)" stroke-width="2.5" />
            <circle cx="50" cy="50" r="4.5" fill="var(--neon-green)" style="filter: drop-shadow(0 0 5px var(--neon-green));" />
        </svg>`,
        "category": "highlight lgs geometrie hot grade8",
        "keywords": "lgs gleichungssystem schnittpunkt geraden algebra mathe",
        "color": "green"
    }
];
