/**
 * i18n extension for Index/Dashboard page
 */
(function() {
    if (typeof CyberI18n === 'undefined') {
        console.error("CyberI18n not found! Load i18n.js before i18n-index.js");
        return;
    }

    const indexTranslations = {
        de: {
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
                education: "EDUCATION",
                games: "Spiele",
                lgs: "Gleichungssysteme",
                pythagoras: "Pythagoras",
                triangles: "Dreiecke",
                arithmetic: "Grundrechenarten",
                hot_stuff: "Hot stuff",
                fun: "Fun",
                functions: "Funktionen",
                highlights: "Highlights",
                fraktale: "Fraktale",
                university: "Universität",
                themes_count: "Themen",
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
                subtitle: "INTERAKTIVE MATHEMATIK",
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
            }
        },
        en: {
            admin_gate: {
                title: "CHECK AUTHORIZATION",
                pwd_placeholder: "Password",
                access: "ACCESS",
                cancel: "CANCEL"
            },
            ui: {
                coffee_title: "Buy a Cyber-Coffee",
                about_title: "Cinematic Intro — Doc Alvers",
                qr_title: "QR Code of this page",
                sound_title: "Ambient Sound",
                search_placeholder: "START LABORATORY SCAN...",
                mission_start: "Start Mission",
                all_tools: "All Tools",
                tools_subtitle_word: "Tools",
                education: "EDUCATION",
                games: "Games",
                lgs: "Equation Systems",
                pythagoras: "Pythagorean Theorem",
                triangles: "Triangles",
                arithmetic: "Basic Arithmetic",
                hot_stuff: "Hot stuff",
                fun: "Fun",
                functions: "Functions",
                highlights: "Highlights",
                fraktale: "Fractals",
                university: "University",
                themes_count: "Themes",
                grade_title: "Grade",
                grade_uni: "Uni",
                grade_uni_tip: "University · particularly complex laboratories (Analysis, Physics, Fractals, …)",
                grade_back_tip: "Back to theme selection",
                universe_tip: "Universe · Laboratory gallery in space",
                credits: "CREDITS",
                impressum: "IMPRINT"
            },
            contact: {
                title: "Contact",
                desc: "Do you have questions, feedback or ideas for new laboratory modules? I look forward to every message – whether it's about mathematics, didactic concepts or technical cooperation.",
                close: "CLOSE"
            },
            qr: {
                title: "QR Code",
                desc: "Scan with your phone – take this page with you."
            },
            donate: {
                title: "Buy a Cyber-Coffee",
                desc: "Do you like the interactive laboratories and want to support the further development of the Cyber-Laboratory? I appreciate every virtual coffee that keeps me awake while coding at night! ☕️🚀",
                paypal: "DONATE NOW WITH PayPal"
            },
            header: {
                title: "Doc Alvers Mathe-Labor",
                subtitle: "INTERACTIVE MATHEMATICS",
                author: "by Dr. Michael R. Alvers"
            },
            view: {
                back_title: "Back",
                title: "LAB VIEW"
            },
            admin: {
                active: "EDITORIAL MODE ACTIVE",
                export: "Export Changes",
                exit: "Exit"
            },
            labs: {
                "fourier": { title: "Fourier Transform", description: "The music of mathematics. Decompose complex shapes into harmonic circular oscillations." },
                "mandelbrot-deep": { title: "Fractals", description: "Mandelbrot and Julia sets in the complex plane: escape-time dynamics of z↦z²+c via GPU fragment-shader iteration; parametric exploration of c with adaptive iteration depth along the fractal boundary." },
                "atomorbitale": { title: "Atomic Orbitals", description: "Spherical harmonics Y_ℓ^m in 3D: probability clouds and quantum numbers." },
                "galtonboard": { title: "Galton Board", description: "Interactive simulation of normal distribution. Watch the bell curve emerge live." },
                "opti-lens": { title: "Lens Optimization", description: "Evolutionary lens optimization (CMA-ES): real-time ray simulation and focus search." },
                "addition": { title: "Written Addition", description: "Learn written addition step by step. Visualizes the column structure." },
                "subtraktion": { title: "Written Subtraction", description: "Train written subtraction with borrowing step by step." },
                "multiplikation": { title: "Written Multiplication", description: "Visualizes written multiplication step by step." },
                "dividieren": { title: "Written Division", description: "Master written division with the interactive ULTRA laboratory." },
                "cmaes": { title: "Surface Optimization", description: "CMA-ES in real time: evolutionary improvement of closed polygons and freeform contours." },
                "transformationen": { title: "Congruence", description: "Explore rotation, translation and scaling of a triangle interactively." },
                "winkelsumme3d": { title: "3D Angle Sum", description: "Experience the sum of angles in 3D space. Dynamic visualization." },
                "ausgleichsgerade": { title: "Best-fit Line", description: "Find the best line through a point cloud. Understand linear regression." },
                "binomischeslabor": { title: "1st Binomial Formula", description: "Visualize binomial formulas geometrically through area decomposition." },
                "triangulierer": { title: "Delaunay", description: "Triangulation algorithms. Generate optimal triangle meshes." },
                "differentiallabor": { title: "Differential Lab", description: "Master differential calculus. Relation between function and derivative." },
                "parabellabor": { title: "Parabolas", description: "Manipulation of quadratic functions. Understand the influence of parameters." },
                "potenzlabor": { title: "Power Lab", description: "Explore the behavior of power and root functions interactively." },
                "steigung": { title: "Slope Lab", description: "Understand the slope at any point on a curve. Basis of analysis." },
                "winkellabor": { title: "Angle Lab", description: "Interactive investigation of angle sums and triangle types." },
                "uhrzeitwinkel": { title: "Angle-Clock Lab", description: "Examine the angle between clock hands at any time of day." },
                "logikspiel": { title: "Number Puzzle", description: "Become a master of the matrix! Solve complex number grids." },
                "integralreaktor": { title: "Integrals", description: "The energy of the area. Visualize Riemann sums and approximation methods." },
                "lissajous": { title: "Lissajous", description: "Superposition of two harmonic oscillations: frequency and phase." },
                "cool-squares": { title: "Cool Squares", description: "The ultimate geometric proof. Follow the spiral of squares." },
                "fibonacci": { title: "Fibonacci Lab", description: "Explore the golden spiral and organic growth patterns." },
                "fermatpunkt": { title: "Fermat Point", description: "Find the point with the minimal sum of distances to the vertices." },
                "gleichungssysteme": { title: "LSE Lab", description: "Explore Linear Systems of Equations visually through lines." },
                "pythagoras": { title: "Pythagoras", description: "Discover the Pythagorean theorem through interactive area comparisons." },
                "pythagorasbeweis": { title: "Pythagoras Proof", description: "Geometric proof of the Pythagorean theorem by area decomposition." },
                "gleichschenkligesDreieck": { title: "Isosceles Triangle", description: "Calculate special triangles and their properties interactively." },
                "eulergerade": { title: "Euler Feuerbach and Napoleon", description: "The fascinating geometry of the triangle: Euler line and Feuerbach circle." },
                "easyhard": { title: "Geometry Puzzle", description: "A challenging geometric riddle. Determine the missing angle." },
                "winkelsumme": { title: "Polygon Lab", description: "Calculate the sum of angles in any n-gon." },
                "beweisinwinkellsumme": { title: "Interior Angle Proof", description: "Why is the sum of angles in a triangle always 180°? The proof step by step." },
                "butterfly": { title: "Butterfly Curve", description: "A fascinating transcendental curve defined by polar coordinates." },
                "heart3d": { title: "3D Heart Surface", description: "Visualization of an implicit 3D surface behind the mathematical heart." },
                "litchi3d": { title: "3D Litchi Lab", description: "Explore complex 3D surface mathematics interactively." },
                "cinematic-intro": { title: "Cinematic Intro", description: "Experience the monumental start into Doc Alvers' lab. ULTRA v5.3.8 Visual Identity." },
                "stanford-portal": { title: "Stanford University", description: "Elite research university in Silicon Valley: top research, open ideas and campus culture." },
                "happy-birthday-ulf": { title: "Happy Birthday Ulf!", description: "A mathematical surprise for the birthday. Celebrate with Doc Alvers!" }
            }
        },
        es: {
            admin_gate: {
                title: "VERIFICAR AUTORIZACIÓN",
                pwd_placeholder: "Contraseña",
                access: "ACCESO",
                cancel: "CANCELAR"
            },
            ui: {
                coffee_title: "Invitar a un Cyber-Café",
                about_title: "Intro Cinemática — Doc Alvers",
                qr_title: "Código QR de esta página",
                sound_title: "Sonido Ambiente",
                search_placeholder: "INICIAR ESCANEO DE LABORATORIO...",
                mission_start: "Iniciar Misión",
                all_tools: "Todas las Herramientas",
                tools_subtitle_word: "Herramientas",
                education: "EDUCACIÓN",
                games: "Juegos",
                lgs: "Sistemas de Ecuaciones",
                pythagoras: "Pitágoras",
                triangles: "Triángulos",
                arithmetic: "Aritmética Básica",
                hot_stuff: "Cosas interesantes",
                fun: "Diversión",
                functions: "Funciones",
                highlights: "Destacados",
                fraktale: "Fractales",
                university: "Universidad",
                themes_count: "Temas",
                grade_title: "Año",
                grade_uni: "Uni",
                grade_uni_tip: "Universidad · laboratorios particularmente complejos (Análisis, Física, Fractales, …)",
                grade_back_tip: "Volver a la selección de temas",
                universe_tip: "Universe · Galería de laboratorios en el espacio",
                credits: "CRÉDITOS",
                impressum: "AVISO LEGAL"
            },
            contact: {
                title: "Contacto",
                desc: "¿Tienes preguntas, comentarios o ideas para nuevos módulos de laboratorio? Espero tu mensaje, ya sea sobre matemáticas, conceptos didácticos o cooperación técnica.",
                close: "CERRAR"
            },
            qr: {
                title: "Código QR",
                desc: "Escanea con tu móvil – llévate esta página contigo."
            },
            donate: {
                title: "Invitar a un Cyber-Café",
                desc: "¿Te gustan los laboratorios interactivos y quieres apoyar el desarrollo del Cyber-Laboratorio? ¡Agradezco cada café virtual que me mantiene despierto programando por la noche! ☕️🚀",
                paypal: "DONAR AHORA CON PayPal"
            },
            header: {
                title: "Doc Alvers Mathe-Labor",
                subtitle: "MATEMÁTICAS INTERACTIVAS",
                author: "por Dr. Michael R. Alvers"
            },
            view: {
                back_title: "Volver",
                title: "VISTA DE LABORATORIO"
            },
            admin: {
                active: "MODO DE EDICIÓN ACTIVO",
                export: "Exportar Cambios",
                exit: "Salir"
            },
            labs: {
                "fourier": { title: "Transformada de Fourier", description: "La música de las matemáticas. Descomponga formas complejas en oscilaciones circulares armónicas." },
                "mandelbrot-deep": { title: "Fractales", description: "Conjuntos de Mandelbrot y Julia en el plano complejo: dinámica de tiempo de escape de z↦z²+c mediante iteración en shader de fragmentos en GPU; exploración paramétrica de c con profundidad adaptativa en la frontera fractal." },
                "atomorbitale": { title: "Orbitales Atómicos", description: "Armónicos esféricos Y_ℓ^m in 3D: nubes de probabilidad y números cuánticos." },
                "galtonboard": { title: "Tablero de Galton", description: "Simulación interactiva de la distribución normal. Observe la curva de campana en vivo." },
                "opti-lens": { title: "Optimización de Lentes", description: "Optimización evolutiva de lentes (CMA-ES): simulación de rayos en tiempo real." },
                "addition": { title: "Suma Escrita", description: "Aprenda la suma escrita paso a paso. Visualiza la estructura de columnas." },
                "subtraktion": { title: "Resta Escrita", description: "Entrene la resta escrita con acarreo paso a paso." },
                "multiplikation": { title: "Multiplicación Escrita", description: "Visualiza la multiplicación escrita paso a paso." },
                "dividieren": { title: "División Escrita", description: "Domine la división escrita con el laboratorio interactivo ULTRA." },
                "cmaes": { title: "Optimización de Superficies", description: "CMA-ES in tiempo real: mejora evolutiva de polígonos cerrados y contornos libres." },
                "transformationen": { title: "Congruencia", description: "Explore la rotación, traslación y escalado de un triángulo de forma interactiva." },
                "winkelsumme3d": { title: "Suma de Ángulos 3D", description: "Experimente la suma de ángulos en el espacio 3D. Visualización dinámica." },
                "ausgleichsgerade": { title: "Línea de Ajuste", description: "Encuentre la mejor línea a través de una nube de puntos. Entienda la regresión." },
                "binomischeslabor": { title: "1ª Fórmula Binomial", description: "Visualice fórmulas binomiales geométricamente mediante descomposición de áreas." },
                "triangulierer": { title: "Delaunay", description: "Algoritmos de triangulación. Genere mallas de triángulos óptimas." },
                "differentiallabor": { title: "Laboratorio Diferencial", description: "Domine el cálculo diferencial. Relación entre función y derivada." },
                "parabellabor": { title: "Parábolas", description: "Manipulación de funciones cuadráticas. Entienda la influencia de los parámetros." },
                "potenzlabor": { title: "Laboratorio de Potencias", description: "Explore el comportamiento de las funciones de potencia y raíz de forma interactiva." },
                "steigung": { title: "Laboratorio de Pendientes", description: "Entienda la pendiente en cualquier punto de una curva. Base del análisis." },
                "winkellabor": { title: "Laboratorio de Ángulos", description: "Investigación interactiva de sumas de ángulos y tipos de triángulos." },
                "uhrzeitwinkel": { title: "Laboratorio de Reloj de Ángulos", description: "Examine el ángulo entre las manecillas del reloj en cualquier momento del día." },
                "logikspiel": { title: "Puzzle de Números", description: "¡Conviértase en un maestro de la matriz! Resuelva cuadrículas de números complejas." },
                "integralreaktor": { title: "Integrales", description: "La energía del área. Visualice sumas de Riemann y métodos de aproximación." },
                "lissajous": { title: "Lissajous", description: "Superposición de dos oscilaciones armónicas: frecuencia y fase." },
                "cool-squares": { title: "Cuadrados Geniales", description: "La prueba geométrica definitiva. Siga la espiral de cuadrados." },
                "fibonacci": { title: "Laboratorio Fibonacci", description: "Explore la espiral dorada y los patrones de crecimiento orgánico." },
                "fermatpunkt": { title: "Punto de Fermat", description: "Encuentre el punto con la suma mínima de distancias a los vértices." },
                "gleichungssysteme": { title: "Laboratorio de SLE", description: "Explore sistemas de ecuaciones lineales visualmente a través de líneas." },
                "pythagoras": { title: "Pitágoras", description: "Descubra el teorema de Pitágoras a través de comparaciones interactivas de áreas." },
                "pythagorasbeweis": { title: "Prueba de Pitágoras", description: "Prueba geométrica del teorema de Pitágoras mediante descomposición de áreas." },
                "gleichschenkligesDreieck": { title: "Triángulo Isósceles", description: "Calcule triángulos especiales y sus propiedades de forma interactiva." },
                "eulergerade": { title: "Euler Feuerbach y Napoleon", description: "La fascinante geometría del triángulo: recta de Euler y círculo de Feuerbach." },
                "easyhard": { title: "Puzzle de Geometría", description: "Un acertijo geométrico desafiante. Determine el ángulo que falta." },
                "winkelsumme": { title: "Laboratorio de Polígonos", description: "Calcule la suma de los ángulos en cualquier n-ágono." },
                "beweisinwinkellsumme": { title: "Prueba del Ángulo Interior", description: "¿Por qué la suma de los ángulos de un triángulo es siempre 180°? La prueba paso a paso." },
                "butterfly": { title: "Curva de Mariposa", description: "Una fascinante curva trascendente definida por coordenadas polares." },
                "heart3d": { title: "Superficie de Corazón 3D", description: "Visualización de una superficie 3D implícita detrás del corazón matemático." },
                "litchi3d": { title: "Laboratorio de Litchi 3D", description: "Explore interactivamente las complejas matemáticas de superficies 3D." },
                "cinematic-intro": { title: "Intro Cinemática", description: "Experimente el monumental comienzo del laboratorio del Doc Alvers. Identidad visual ULTRA v5.3.8." },
                "stanford-portal": { title: "Stanford University", description: "Universidad de investigación de élite en Silicon Valley: investigación de vanguardia, ideas abiertas y cultura de campus." },
                "happy-birthday-ulf": { title: "¡Feliz Cumpleaños Ulf!", description: "Una sorpresa matemática para el cumpleaños. ¡Celebra con el Doc Alvers!" }
            }
        },
        fr: {
            admin_gate: {
                title: "VÉRIFIER L'AUTORISATION",
                pwd_placeholder: "Mot de passe",
                access: "ACCÈS",
                cancel: "ANNULER"
            },
            ui: {
                coffee_title: "Offrir un Cyber-Café",
                about_title: "Intro Cinématique — Doc Alvers",
                qr_title: "Code QR de cette page",
                sound_title: "Son d'Ambiance",
                search_placeholder: "LANCER LE SCAN DU LABORATOIRE...",
                mission_start: "Démarrer Mission",
                all_tools: "Tous les Outils",
                tools_subtitle_word: "Outils",
                education: "ÉDUCATION",
                games: "Jeux",
                lgs: "Systèmes d'Équations",
                pythagoras: "Pythagore",
                triangles: "Triangles",
                arithmetic: "Arithmétique de Base",
                hot_stuff: "À la mode",
                fun: "Amusant",
                functions: "Fonctions",
                highlights: "Faits saillants",
                fraktale: "Fractales",
                university: "Université",
                themes_count: "Thèmes",
                grade_title: "Année",
                grade_uni: "Uni",
                grade_uni_tip: "Université · laboratoires particulièrement complexes (Analyse, Physique, Fractales, …)",
                grade_back_tip: "Retour à la sélection de thèmes",
                universe_tip: "Universe · Galerie de laboratoires dans l'espace",
                credits: "CRÉDITS",
                impressum: "MENTIONS LÉGALES"
            },
            contact: {
                title: "Contact",
                desc: "Avez-vous des questions, des commentaires ou des idées pour de nouveaux modules de laboratoire ? J'attends chaque message avec impatience – qu'il s'agisse de mathématiques, de concepts didactiques ou de coopération technique.",
                close: "FERMER"
            },
            qr: {
                title: "Code QR",
                desc: "Scannez avec votre téléphone – emportez cette page avec vous."
            },
            donate: {
                title: "Offrir un Cyber-Café",
                desc: "Aimez-vous les laboratoires interactifs et souhaitez-vous soutenir le développement du Cyber-Laboratoire ? J'apprécie chaque café virtuel qui me garde éveillé en programmant la nuit ! ☕️🚀",
                paypal: "FAIRE UN DON AVEC PayPal"
            },
            header: {
                title: "Doc Alvers Mathe-Labor",
                subtitle: "MATHÉMATIQUES INTERACTIVES",
                author: "par Dr. Michael R. Alvers"
            },
            view: {
                back_title: "Retour",
                title: "VUE DU LABORATOIRE"
            },
            admin: {
                active: "MODE ÉDITION ACTIF",
                export: "Exporter les Changements",
                exit: "Quitter"
            },
            labs: {
                "fourier": { title: "Transformée de Fourier", description: "La musique des mathématiques. Décomposez des formes complexes en oscillations circulaires harmoniques." },
                "mandelbrot-deep": { title: "Fractales", description: "Ensembles de Mandelbrot et Julia dans le plan complexe : dynamique en temps d'échappement de z↦z²+c via itération GPU en shader fragmentaire ; exploration paramétrique de c et profondeur d'itération adaptive au voisinage de la frontière fractale." },
                "atomorbitale": { title: "Orbitales Atomiques", description: "Harmoniques sphériques Y_ℓ^m en 3D : nuages de probabilité et nombres quantiques." },
                "galtonboard": { title: "Planche de Galton", description: "Simulation interactive de la distribution normale. Observez la courbe en cloche se former en direct." },
                "opti-lens": { title: "Optimisation de Lentille", description: "Optimisation évolutive de lentille (CMA-ES) : simulation de rayons en temps réel." },
                "addition": { title: "Addition Posée", description: "Apprenez l'addition posée étape par étape. Visualise la structure en colonnes." },
                "subtraktion": { title: "Soustraction Posée", description: "Entraînez-vous à la soustraction avec retenue étape par étape." },
                "multiplikation": { title: "Multiplication Posée", description: "Visualise la multiplication posée étape par étape." },
                "dividieren": { title: "Division Posée", description: "Maîtrisez la division posée avec le laboratoire interactif ULTRA." },
                "cmaes": { title: "Optimisation de Surfaces", description: "CMA-ES en temps réel : amélioration évolutive de polygones fermés et de contours libres." },
                "transformationen": { title: "Congruence", description: "Explorez la rotation, la translation et la mise à l'échelle d'un triangle de manière interactive." },
                "winkelsumme3d": { title: "Somme d'Angles 3D", description: "Expérimentez la somme des angles dans l'espace 3D. Visualisation dynamique." },
                "ausgleichsgerade": { title: "Droite d'Ajustement", description: "Trouvez la meilleure droite à travers un nuage de points. Comprenez la régression." },
                "binomischeslabor": { title: "1ère Formule Binomiale", description: "Visualisez les formules binomiales géométriquement par décomposition d'aires." },
                "triangulierer": { title: "Delaunay", description: "Algorithmes de triangulation. Générez des maillages triangulaires optimaux." },
                "differentiallabor": { title: "Labo Différentiel", description: "Maîtrisez le calcul différentiel. Relation entre la fonction et la dérivée." },
                "parabellabor": { title: "Paraboles", description: "Manipulation de fonctions quadratiques. Comprenez l'influence des paramètres." },
                "potenzlabor": { title: "Labo de Puissances", description: "Explorez le comportement des fonctions puissance et racine de manière interactive." },
                "steigung": { title: "Labo de Pente", description: "Comprenez la pente en tout point d'une courbe. Base de l'analyse." },
                "winkellabor": { title: "Labo d'Angles", description: "Investigation interactive des sommes d'angles et des types de triangles." },
                "uhrzeitwinkel": { title: "Labo Horloge", description: "Examinez l'angle entre les aiguilles d'une horloge à n'importe quelle heure." },
                "logikspiel": { title: "Puzzle Numérique", description: "Devenez un maître de la matrice ! Résolvez des grilles de nombres complexes." },
                "integralreaktor": { title: "Intégrales", description: "L'énergie de l'aire. Visualisez les sommes de Riemann et les méthodes d'approximation." },
                "lissajous": { title: "Lissajous", description: "Superposition de deux oscillations harmoniques : fréquence et phase." },
                "cool-squares": { title: "Carrés Géniaux", description: "La preuve géométrique ultime. Suivez la spirale des carrés." },
                "fibonacci": { title: "Labo Fibonacci", description: "Explorez la spirale d'or et les motifs de croissance organique." },
                "fermatpunkt": { title: "Point de Fermat", description: "Trouvez le point avec la somme minimale des distances aux sommets." },
                "gleichungssysteme": { title: "Labo SLE", description: "Explorez visuellement les systèmes d'équations linéaires à l'aide de droites." },
                "pythagoras": { title: "Pythagore", description: "Découvrez le théorème de Pythagore grâce à des comparaisons interactives d'aires." },
                "pythagorasbeweis": { title: "Preuve Pythagore", description: "Preuve géométrique du théorème de Pythagore par décomposition d'aires." },
                "gleichschenkligesDreieck": { title: "Triangle Isocèle", description: "Calculez des triangles spéciaux et leurs propriétés de manière interactive." },
                "eulergerade": { title: "Euler Feuerbach et Napoléon", description: "La géométrie fascinante du triangle : droite d'Euler et cercle de Feuerbach." },
                "easyhard": { title: "Casse-tête Géométrique", description: "Une énigme géométrique difficile. Déterminez l'angle manquant." },
                "winkelsumme": { title: "Labo Polygone", description: "Calculez la somme des angles de n'importe quel n-gone." },
                "beweisinwinkellsumme": { title: "Preuve Angle Interne", description: "Pourquoi la somme des angles d'un triangle est-elle toujours de 180° ? La preuve étape par étape." },
                "butterfly": { title: "Courbe Papillon", description: "Une courbe transcendante fascinante définie par des coordonnées polaires." },
                "heart3d": { title: "Surface Cœur 3D", description: "Visualisation d'une surface 3D implicite derrière le cœur mathématique." },
                "litchi3d": { title: "Labo Litchi 3D", description: "Explorez interactivement les mathématiques complexes des surfaces 3D." },
                "cinematic-intro": { title: "Intro Cinématique", description: "Vivez le départ monumental dans le laboratoire de Doc Alvers. Identité visuelle ULTRA v5.3.8." },
                "stanford-portal": { title: "Université Stanford", description: "Université de recherche d'élite dans la Silicon Valley : recherche de pointe, idées ouvertes et culture de campus." },
                "happy-birthday-ulf": { title: "Joyeux Anniversaire Ulf!", description: "Une surprise mathématique pour l'anniversaire. Célébrez avec Doc Alvers!" }
            }
        },
        it: {
            admin_gate: {
                title: "VERIFICA AUTORIZZAZIONE",
                pwd_placeholder: "Password",
                access: "ACCESSO",
                cancel: "ANNULLA"
            },
            ui: {
                coffee_title: "Offri un Cyber-Caffè",
                about_title: "Intro Cinematografica — Doc Alvers",
                qr_title: "Codice QR di questa pagina",
                sound_title: "Suono Ambientale",
                search_placeholder: "AVVIA SCANSIONE DEL LABORATORIO...",
                mission_start: "Avvia Missione",
                all_tools: "Tutti gli Strumenti",
                tools_subtitle_word: "Strumenti",
                education: "EDUCAZIONE",
                games: "Giochi",
                lgs: "Sistemi di Equazioni",
                pythagoras: "Pitagora",
                triangles: "Triangoli",
                arithmetic: "Aritmetica di Base",
                hot_stuff: "In evidenza",
                fun: "Divertimento",
                functions: "Funzioni",
                highlights: "Punti salienti",
                fraktale: "Frattali",
                university: "Università",
                themes_count: "Temi",
                grade_title: "Grado",
                grade_uni: "Uni",
                grade_uni_tip: "Università · laboratori particolarmente complessi (Analisi, Fisica, Frattali, …)",
                grade_back_tip: "Torna alla selezione dei temi",
                universe_tip: "Universe · Galleria di laboratori nello spazio",
                credits: "CREDITI",
                impressum: "NOTE LEGALI"
            },
            contact: {
                title: "Contatto",
                desc: "Hai domande, feedback o idee per nuovi moduli di laboratorio? Attendo ogni tuo messaggio – che si tratti di matematica, concetti didattici o collaborazione tecnica.",
                close: "CHIUDI"
            },
            qr: {
                title: "Codice QR",
                desc: "Scansiona con il tuo telefono – porta questa pagina con te."
            },
            donate: {
                title: "Offri un Cyber-Caffè",
                desc: "Ti piacciono i laboratori interattivi e vuoi supportare lo sviluppo del Cyber-Laboratorio? Apprezzo ogni caffè virtuale che mi tiene sveglio a programmare di notte! ☕️🚀",
                paypal: "DONA ORA CON PayPal"
            },
            header: {
                title: "Doc Alvers Mathe-Labor",
                subtitle: "MATEMATICA INTERATTIVA",
                author: "di Dr. Michael R. Alvers"
            },
            view: {
                back_title: "Indietro",
                title: "VISTA DEL LABORATORIO"
            },
            admin: {
                active: "MODALITÀ EDITORIALE ATTIVA",
                export: "Esporta Modifiche",
                exit: "Esci"
            },
            labs: {
                "fourier": { title: "Trasformata di Fourier", description: "La musica della matematica. Scomponi forme complesse in oscillazioni circolari armoniche." },
                "mandelbrot-deep": { title: "Frattali", description: "Insiemi di Mandelbrot e Julia nel piano complesso: dinamica del tempo di fuga di z↦z²+c tramite iterazione su GPU nel fragment shader; esplorazione parametrica di c con profondità di iterazione adattiva lungo il contorno frattale." },
                "atomorbitale": { title: "Orbitali Atomici", description: "Armoniche sferiche Y_ℓ^m in 3D: nuvole di probabilità e numeri quantici." },
                "galtonboard": { title: "Macchina di Galton", description: "Simulazione interattiva della distribuzione normale. Osserva la formazione della curva a campana dal vivo." },
                "opti-lens": { title: "Ottimizzazione Lente", description: "Ottimizzazione evolutiva della lente (CMA-ES): simulazione dei raggi in tempo reale." },
                "addition": { title: "Addizione in Colonna", description: "Impara l'addizione in colonna passo dopo passo. Visualizza la struttura delle colonne." },
                "subtraktion": { title: "Sottrazione in Colonna", description: "Allenati con la sottrazione in colonna con prestito passo dopo passo." },
                "multiplikation": { title: "Moltiplicazione in Colonna", description: "Visualizza la moltiplicazione in colonna passo dopo passo." },
                "dividieren": { title: "Divisione in Colonna", description: "Padroneggia la divisione in colonna con il laboratorio interattivo ULTRA." },
                "cmaes": { title: "Ottimizzazione Superfici", description: "CMA-ES in tempo reale: miglioramento evolutivo di poligoni chiusi e contorni liberi." },
                "transformationen": { title: "Congruenza", description: "Esplora la rotazione, traslazione e ridimensionamento di un triangolo in modo interattivo." },
                "winkelsumme3d": { title: "Somme Angoli 3D", description: "Sperimenta la somma degli angoli nello spazio 3D. Visualizzazione dinamica." },
                "ausgleichsgerade": { title: "Retta di Adattamento", description: "Trova la retta migliore attraverso una nuvola di punti. Comprendi la regressione." },
                "binomischeslabor": { title: "1° Formula Binomiale", description: "Visualizza le formule binomiali geometricamente mediante scomposizione di aree." },
                "triangulierer": { title: "Delaunay", description: "Algoritmi di triangolazione. Genera maglie triangolari ottimali." },
                "differentiallabor": { title: "Lab Differenziale", description: "Padroneggia il calcolo differenziale. Relazione tra la funzione e la derivata." },
                "parabellabor": { title: "Parabole", description: "Manipolazione delle funzioni quadratiche. Comprendi l'influenza dei parametri." },
                "potenzlabor": { title: "Lab delle Potenze", description: "Esplora il comportamento delle funzioni di potenza e radice in modo interattivo." },
                "steigung": { title: "Lab delle Pendenze", description: "Comprendi la pendenza in qualsiasi punto di una curva. Base dell'analisi." },
                "winkellabor": { title: "Lab degli Angoli", description: "Indagine interattiva delle somme degli angoli e dei tipi di triangoli." },
                "uhrzeitwinkel": { title: "Lab dell'Orologio", description: "Esamina l'angolo tra le lancette dell'orologio a qualsiasi ora." },
                "logikspiel": { title: "Puzzle Numerico", description: "Diventa un maestro della matrice! Risolvi complesse griglie di numeri." },
                "integralreaktor": { title: "Integrali", description: "L'energia dell'area. Visualizza le somme di Riemann e i metodi di approssimazione." },
                "lissajous": { title: "Lissajous", description: "Sovrapposizione di due oscillazioni armoniche: frequenza e fase." },
                "cool-squares": { title: "Cool Squares", description: "La dimostrazione geometrica definitiva. Segui la spirale dei quadrati." },
                "fibonacci": { title: "Lab Fibonacci", description: "Esplora la spirale aurea e i modelli di crescita organica." },
                "fermatpunkt": { title: "Punto di Fermat", description: "Trova il punto con la somma minima delle distanze dai vertici." },
                "gleichungssysteme": { title: "Lab SLE", description: "Esplora visivamente i sistemi di equazioni lineari attraverso le rette." },
                "pythagoras": { title: "Pitagora", description: "Scopri il teorema di Pitagora attraverso confronti interattivi di aree." },
                "pythagorasbeweis": { title: "Dimostrazione Pitagora", description: "Dimostrazione geometrica del teorema di Pitagora tramite scomposizione di aree." },
                "gleichschenkligesDreieck": { title: "Triangolo Isoscele", description: "Calcola triangoli speciali e le loro proprietà in modo interattivo." },
                "eulergerade": { title: "Euler Feuerbach e Napoleone", description: "L'affascinante geometria del triangolo: retta di Eulero e cerchio di Feuerbach." },
                "easyhard": { title: "Rompicapo Geometrico", description: "Un puzzle geometrico impegnativo. Determina l'angolo mancante." },
                "winkelsumme": { title: "Lab dei Poligoni", description: "Calcola la somma degli angoli in qualsiasi n-agono." },
                "beweisinwinkellsumme": { title: "Dimostrazione Angolo Interno", description: "Perché la somma degli angoli di un triangolo è sempre 180°? La dimostrazione passo dopo passo." },
                "butterfly": { title: "Curva a Farfalla", description: "Un'affascinante curva trascendente definita da coordinate polari." },
                "heart3d": { title: "Superficie Cuore 3D", description: "Visualizzazione di una superficie 3D implicita dietro il cuore matematico." },
                "litchi3d": { title: "Lab Litchi 3D", description: "Esplora in modo interattivo la complessa matematica delle superfici 3D." },
                "cinematic-intro": { title: "Intro Cinematografica", description: "Vivi il lancio monumentale nel laboratorio del Doc Alvers. Identità visiva ULTRA v5.3.8." },
                "stanford-portal": { title: "Università di Stanford", description: "Università di ricerca d'élite nella Silicon Valley: ricerca all'avanguardia, idee aperte e cultura del campus." },
                "happy-birthday-ulf": { title: "Buon Compleanno Ulf!", description: "Una sorpresa matematica per il compleanno. Festeggia con Doc Alvers!" }
            }
        },
pt: {
            admin_gate: {
                title: "VERIFICAR AUTORIZAÇÃO",
                pwd_placeholder: "Senha",
                access: "ACESSO",
                cancel: "CANCELAR"
            },
            ui: {
                coffee_title: "Compre um Cyber-Café",
                about_title: "Introdução Cinematográfica — Doc Alvers",
                qr_title: "Código QR desta página",
                sound_title: "Som Ambiente",
                search_placeholder: "INICIAR VERIFICAÇÃO DO LABORATÓRIO...",
                mission_start: "Iniciar Missão",
                all_tools: "Todas as Ferramentas",
                tools_subtitle_word: "Ferramentas",
                education: "EDUCAÇÃO",
                games: "Jogos",
                lgs: "Sistemas de Equações",
                pythagoras: "Teorema de Pitágoras",
                triangles: "Triângulos",
                arithmetic: "Aritmética Básica",
                hot_stuff: "Destaques",
                fun: "Diversão",
                functions: "Funções",
                highlights: "Destaques",
                fraktale: "Fractais",
                university: "Universidade",
                themes_count: "Temas",
                grade_title: "Ano",
                grade_uni: "Uni",
                grade_uni_tip: "Universidade · laboratórios particularmente complexos",
                grade_back_tip: "Voltar para a seleção de tema",
                universe_tip: "Universo · Galeria do Laboratório no espaço",
                credits: "CRÉDITOS",
                impressum: "AVISO LEGAL"
            },
            contact: {
                title: "Contato",
                desc: "Você tem perguntas, feedback ou ideias para novos módulos de laboratório? Aguardo todas as mensagens.",
                close: "FECHAR"
            },
            qr: {
                title: "Código QR",
                desc: "Escaneie com seu telefone – leve esta página com você."
            },
            donate: {
                title: "Compre um Cyber-Café",
                desc: "Você gosta dos laboratórios interativos e quer apoiar o desenvolvimento do Cyber-Laboratório? Agradeço cada café virtual que me mantém acordado enquanto codifico à noite! ☕️🚀",
                paypal: "DOE AGORA COM PayPal"
            },
            header: {
                title: "Doc Alvers Mathe-Labor",
                subtitle: "MATEMÁTICA INTERATIVA",
                author: "por Dr. Michael R. Alvers"
            },
            view: {
                back_title: "Voltar",
                title: "VISÃO DO LAB"
            },
            admin: {
                active: "MODO EDITORIAL ATIVO",
                export: "Exportar Alterações",
                exit: "Sair"
            },
            labs: {
                "fourier": { title: "Transformada de Fourier", description: "A música da matemática. Decomponha formas complexas em oscilações." },
                "mandelbrot-deep": { title: "Fractais", description: "Conjuntos de Mandelbrot e Julia no plano complexo: dinâmica de tempo de escape de z↦z²+c por iteração em shader de fragmentos na GPU; exploração paramétrica de c com profundidade adaptativa na fronteira fractal." },
                "atomorbitale": { title: "Orbitais Atômicos", description: "Harmônicos esféricos Y_ℓ^m em 3D." },
                "galtonboard": { title: "Tábua de Galton", description: "Simulação interativa da distribuição normal." },
                "opti-lens": { title: "Otimização de Lentes", description: "Otimização evolutiva de lentes (CMA-ES)." },
                "addition": { title: "Adição Escrita", description: "Aprenda adição escrita passo a passo." },
                "subtraktion": { title: "Subtração Escrita", description: "Treine subtração escrita passo a passo." },
                "multiplikation": { title: "Multiplicação Escrita", description: "Visualiza multiplicação escrita passo a passo." },
                "dividieren": { title: "Divisão Escrita", description: "Domine a divisão escrita com o laboratório." },
                "cmaes": { title: "Otimização de Superfície", description: "CMA-ES em tempo real: melhoria de polígonos." },
                "transformationen": { title: "Congruência", description: "Explore rotação, translação e escalonamento." },
                "winkelsumme3d": { title: "Soma de Ângulos 3D", description: "Experimente a soma de ângulos no espaço 3D." },
                "ausgleichsgerade": { title: "Linha de Melhor Ajuste", description: "Encontre a melhor linha através de uma nuvem de pontos." },
                "binomischeslabor": { title: "1ª Fórmula Binomial", description: "Visualize fórmulas binomiais geometricamente." },
                "triangulierer": { title: "Delaunay", description: "Algoritmos de triangulação." },
                "differentiallabor": { title: "Lab. Diferencial", description: "Domine o cálculo diferencial." },
                "parabellabor": { title: "Parábolas", description: "Manipulação de funções quadráticas." },
                "potenzlabor": { title: "Lab. de Potências", description: "Explore o comportamento de potências e raízes." },
                "steigung": { title: "Lab. de Inclinação", description: "Entenda a inclinação em qualquer ponto." },
                "winkellabor": { title: "Lab. de Ângulos", description: "Investigação interativa de ângulos." },
                "uhrzeitwinkel": { title: "Lab. Relógio", description: "Examine o ângulo entre os ponteiros do relógio." },
                "logikspiel": { title: "Quebra-cabeça de Números", description: "Torne-se um mestre da matriz! Resolve grades complexas." },
                "integralreaktor": { title: "Integrais", description: "A energia da área. Visualize somas de Riemann." },
                "lissajous": { title: "Lissajous", description: "Superposição de duas oscilações harmônicas." },
                "cool-squares": { title: "Quadrados Legais", description: "A prova geométrica definitiva. Siga a espiral de quadrados." },
                "fibonacci": { title: "Lab. Fibonacci", description: "Explore a espiral áurea e padrões de crescimento." },
                "fermatpunkt": { title: "Ponto de Fermat", description: "Encontre o ponto com a soma mínima de distâncias aos vértices." },
                "gleichungssysteme": { title: "Lab. de Sistemas Lineares", description: "Explore sistemas lineares de equações visualmente através de linhas." },
                "pythagoras": { title: "Pitágoras", description: "Descubra o teorema de Pitágoras por meio de comparações interativas de áreas." },
                "pythagorasbeweis": { title: "Prova de Pitágoras", description: "Prova geométrica do teorema de Pitágoras por decomposição de área." },
                "gleichschenkligesDreieck": { title: "Triângulo Isósceles", description: "Calcule triângulos especiais e suas propriedades de forma interativa." },
                "eulergerade": { title: "Euler, Feuerbach e Napoleão", description: "A fascinante geometria do triângulo." },
                "easyhard": { title: "Quebra-cabeça de Geometria", description: "Um enigma geométrico desafiador. Determine o ângulo que falta." },
                "winkelsumme": { title: "Lab. de Polígonos", description: "Calcule a soma dos ângulos em qualquer polígono." },
                "beweisinwinkellsumme": { title: "Prova de Ângulo Interno", description: "Por que a soma dos ângulos de um triângulo é sempre 180°? A prova passo a passo." },
                "butterfly": { title: "Curva da Borboleta", description: "Uma fascinante curva definida por coordenadas polares." },
                "heart3d": { title: "Coração 3D", description: "Visualização de uma superfície 3D." },
                "litchi3d": { title: "Lichia 3D", description: "Explore matemática complexa interativamente." },
                "cinematic-intro": { title: "Introdução Cinematográfica", description: "Experimente o início monumental. ULTRA v5.3.8." },
                "stanford-portal": { title: "Universidade de Stanford", description: "Universidade de pesquisa de elite no Vale do Silício." },
                "happy-birthday-ulf": { title: "Feliz Aniversário Ulf!", description: "Uma surpresa matemática de aniversário." }
            }
        }
    };

    // Inject into global dictionary
    for (let lang in indexTranslations) {
        if (CyberI18n.translations[lang]) {
            CyberI18n.translations[lang].index = indexTranslations[lang];
        }
    }
})();
