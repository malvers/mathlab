/**
 * i18n extension for Index/Dashboard page — English (en).
 * Loaded by js/i18n-index.js (loader) for the ACTIVE language only —
 * never referenced directly from HTML. One file per language.
 */
(function () {
    if (typeof CyberI18n === 'undefined') {
        console.error("CyberI18n not found! Load i18n.js before i18n-index-en.js");
        return;
    }
    const t = (CyberI18n.translations.en = CyberI18n.translations.en || {});
    t.index = {
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
                tools_filter_hits: "MATCHES FOUND",
                tools_no_results: "No matches for \"{query}\"",
                search_no_terms: "nothing found",
                tools_close_aria: "Close tools overview and return to lab selection",
                tools_footer_aria: "Footer",
                tools_universe_aria: "Open Universe · laboratory gallery in space",
                tools_doc_title: "Cyber-Lab | Mission Control",
                education: "EDUCATION",
                games: "Games",
                lgs: "Equation Systems",
                pythagoras: "Pythagorean Theorem",
                triangles: "Triangles",
                arithmetic: "Basic Arithmetic",
                hot_stuff: "Hot stuff",
                neu: "New",
                apps: "Apps",
                fun: "Fun",
                functions: "Functions",
                highlights: "Highlights",
                fraktale: "Fractals",
                university: "University",
                themes_count: "Themes",
                themes_top5_title: "Top Labs",
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
                subtitle: "THE INTERACTIVE MATHEMATICS UNIVERSE",
                author: "GOOD VIBES by Dr. Michael R. Alvers"
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
            ,
                "einsundeins": { title: "1 + 1 = 2", description: "One sum, four levels down: high-level language to assembler to machine bytes to a full adder built from logic gates. The same information on every level, just one abstraction deeper." },
                "solita": { title: "Solita", description: "Solita — your personal voice assistant (Claude) in the Doc Alvers Maths Lab. Talk, have things read aloud, keep the context." },
                "gameoflife": { title: "Game of Life", description: "Conway's cellular automaton: three simple rules give rise to gliders, oscillators and whole worlds. Draw a starting pattern and watch order and chaos take turns." },
                "burningship": { title: "Burning Ship", description: "The dark sister fractal of the Mandelbrot set: a single absolute value in the iteration formula makes burning ships appear on the horizon. Zoom into the flaming structure." },
                "reaction-diffusion": { title: "Reaction-Diffusion", description: "Turing patterns live: two chemicals react and diffuse — out come stripes, spots and corals like animal markings. Tune feed and decay and grow your own patterns." },
                "gravitation": { title: "Gravitation", description: "Newton's law of gravitation, hands on: place masses in space, give them an initial velocity and watch orbits, captures and collisions in the many-body dance." },
                "glocken": { title: "The Bells of Baghdad", description: "When do all the bells strike together? A story from Baghdad leads to the least common multiple — with a tutor guiding you step by step to LCM and fractions." },
                "langley": { title: "Langley Lab", description: "Langley's notorious angle puzzle of 1922: an isosceles triangle, two inner lines — and one angle that has vexed the world for a hundred years. Measure, try, prove." },
                "batman": { title: "Batman Curve", description: "A single equation whose graph draws the Batman logo: absolute values, roots and case distinctions as superhero mathematics. Take the formula apart piece by piece." },
                "worldclock": { title: "World Clock", description: "The Earth as a clock: time zones, the position of the sun and the day-night line live on the world map. See where the sun is rising while midnight strikes here." },
                "tracker": { title: "Doc Alvers Tracker", description: "GPS tracking as a web app: record tours with elevation profile, photo, voice and knowledge waypoints, rain radar and live sharing. Runs in the browser and as an Android app." },
                "kaimbo": { title: "Kaimbo Studio", description: "Language learning with your own task lists: organise, filter and drill vocabulary and sentences as task series — the studio for Doc's language tool, now in the browser." },
                "pagode": { title: "Pagoda (230 SL)", description: "A 1964 Mercedes 230 SL meets Bluetooth: start the engine by radio, test channels, explore an interactive wiring diagram — and Solita learns to drive. Classic-car electrics with AI remote control." },
                "voicerecorder": { title: "Voice Recorder", description: "Record and transcribe live: speak — it listens, writes along and saves. In the browser via the Web Speech API, as an Android app with native speech recognition." },
                "mathtrainer": { title: "MathTrainer", description: "Practise maths with task series: train mental arithmetic and school exercises, pick a series, pick up the pace — school is cool. The SchoolTrainer as a web app." },
                "pinkerfinder": { title: "PinkerFinder", description: "The macOS Finder rebuilt 1:1 — plus search facets: folder sizes in the list, duplicates by content, faceted search across the whole Mac, live updates. Native Mac app, free download." },
                "imaginarynumbers": { title: "Imaginary numbers", description: "Complex numbers in the Gaussian plane: real part, imaginary part and the imaginary unit — explore them interactively." },
                "kovarianz": { title: "Covariance", description: "A linear map A stretches, rotates and shears the plane. Applied to a round cloud of points it turns into an ellipse — and exactly its shape is written in the covariance matrix: Σ₀ = σ²E becomes Σ = A Σ₀ Aᵀ. Set the matrix cell by cell or drag the image ellipse directly by its handle; Σ, the correlation and the eigenvectors as principal axes are computed live from the drawn points. With normal and uniform distribution, homogeneous coordinates and parallels that show what the map does to straight lines." },
                "irisvis": { title: "Conway's Iris", description: "At every corner extend both sides by the length of the opposite side — the six endpoints lie on a circle around the incenter, R = √(r²+(s+d)²). Six windscreen-wiper arcs form a curve of constant width from them; a square encloses it in every rotation, and CMA-ES searches for its position live. With proof views, a heatmap of the search landscape and the Reuleaux triangle at the push of a button." },
                "ascii": { title: "ASCII Art", description: "Images are numbers: raster a photo, the live camera image or an example into cells, compute the grey value, pick the character — as characters, in colour, as halftone or Braille, with dithering. Clicking a character shows the complete calculation for exactly that cell; at level 2 students write the mapping grey value → character themselves." },
                "neuroaddierer": { title: "The Learned Adder", description: "In the lab 1 + 1 = 2 the full adders are hard-wired — here nothing is wired at all. A tiny neural network of 32 numbers only gets to see the eight rows of the truth table and is meant to discover addition by itself: through evolution (CMA-ES), entirely without derivatives. Afterwards eight copies of the learned network compute every sum up to 255 in series — and you can see that its outputs are never exactly 0 or 1, but 0.03 and 0.97." },
                "shell": { title: "Shell", description: "How does the pattern on a sea shell come about? Six chapters build the mechanism up one piece at a time: the picture is a record — one cell ignites and writes a V — two waves annihilate and cut the tip of a tent — the used-up substrate explains why. The living lip of the aperture sits on top, the shell grows below. With a single-step button." },
                "conuslab": { title: "Conus", description: "Why does a cone snail wear zigzags and tents? The shell only grows at the lip of the aperture — a single row of cells decides ‘pigment yes/no’, and every growth line stays put forever. So the pattern is a space-time diagram. Here it runs live: travelling pigment waves that annihilate on collision and cut the tents in doing so — next to it the same effect as a cellular automaton (rule 30)." },
                "costablanca": { title: "Costa Blanca Highlights", description: "Costa Blanca outings to tick off: 22 researched destinations from Altea to Valencia with photos, insider tips and a progress bar — in four languages (DE/EN/ES/IT)." },
                "bb84": { title: "BB84", description: "Quantum key exchange after Bennett and Brassard: Alice sends single photons, each in one of two bases — + with the states — and |, or × with / and \\. Bob picks his basis at random: the same basis means a reliable result, a different basis means pure chance. Hovering over a column explains exactly that photon. With the eavesdropper Eve the error rate in the publicly compared part rises to a quarter — the probability of detection is 1 − (3/4)^m, and a thousand runs at the push of a button show that it really is so. Plus a teaching mode that walks through every case once." },
                "jacquard": { title: "Jacquard", description: "A loom from 1805, in 3D — the first machine that makes a picture from a written plan. One punched card controls every warp thread on its own: where there is a hole the needle slips through, the hook stays put and the knife lifts the thread; where there is card, it stays down and the blue weft covers it. Card by card the picture grows out of the machine. Design and machine are two different things: the same circle comes out rounder with more warp threads, and where the drawing is finer than the cloth, the loom weaves a pattern that is not in the original at all." },
                "koerper": { title: "Solids", description: "Platonic, Archimedean and Catalan solids, prisms, antiprisms, pyramids and round shapes — rotatable in 3D, with surface area, volume, circum-, mid- and insphere radius, dihedral angles and formulas live in terms of the edge length. Every solid can be unfolded into its net with a slider; Catalan solids arise as duals of the Archimedean ones through polarity about the midsphere." },
                "brahmagupta": { title: "Brahmagupta’s Theorem", description: "A cyclic quadrilateral whose diagonals meet at right angles — and two statements about it, both from Brahmagupta (7th century, India). The theorem: drop the perpendicular from the diagonal intersection P onto one side and carry it on past P, and it meets the opposite side exactly at its midpoint — because P forms a right triangle with the two endpoints, and the foot of that perpendicular is the triangle’s circumcentre. The formula: K = √((s−a)(s−b)(s−c)(s−d)) gives the area, but only while all four corners sit on the circle. Take them off it and K comes out too large — Heron for quadrilaterals, with a condition." }
            }
    };
})();
