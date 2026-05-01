/**
 * CYBER-LABOR GLOBAL i18n DICTIONARY
 * Supports: Addition, Subtraction, Multiplication, Division, Logic, Geometry, Proof, Polygon
 * Languages: DE (German), EN (English), ES (Spanish)
 */

const CyberI18n = {
    // Current active language
    current: 'en',

    // Dictionary
    translations: {
        de: {
            ui: {
                next: "WEITER",
                prev: "ZURÜCK",
                reset: "LABOR RESET",
                step: "SCHRITT",
                coach_title: "Doc Alvers Mathe-Labor",
                logic_game: "Zahlen-Puzzle",
                angle_lab: "Winkel-Labor",
                pythagoras: "Pythagoras-Beweis",
                angle_sum: "Winkelsumme-Labor",
                transformation: "Transformationen",
                parabola: "Parabel-Labor",
                regression: "Statistik-Labor",
                euler: "Euler-Gerade"
            },
            euler: {
                construction: "KONSTRUKTION",
                euler_line: "Eulergerade",
                feuerbach: "Feuerbach-Kreis",
                circumcircle: "Umkreis",
                incircle: "Inkreis",
                help_lines: "HILFSLINIEN",
                altitudes: "Höhen (H)",
                medians: "Seitenhalb. (S)",
                bisectors: "Winkelhalb. (I)",
                fermat: "Fermat / Napoleon",
                analysis: "ANALYSE",
                ratio: "Verhältnis HS / SU",
                incircle_radius: "Inkreis-R",
                reset_construction: "Konstruktion Reset"
            },
            lgs: {
                system_title: "GLEICHUNGSSYSTEM",
                formal_system: "FORMALES SYSTEM",
                intersection: "SCHNITTPUNKT S",
                notation: "NOTATION",
                magnet_snap: "MAGNET-SNAP",
                new_task: "NEUE AUFGABE",
                view_reset: "VIEW RESET",
                mode_normal: "NORMAL",
                mode_mirrored: "GESPIEGELT",
                mode_scaled: "SKALIERT (sY)",
                mode_implicit_a: "IMPLIZIT A",
                mode_implicit_b: "IMPLIZIT B",
                mode_random: "ZUFALL MIX",
                no_solution: "Parallel / Keine Lösung"
            },
            binom: {
                proof_title: "Beweis 1. Binomische Formel",
                division: "AUFTEILUNG",
                p_value: "P-WERT",
                tip: "Tipp: Ziehe den Mittelpunkt im Quadrat!",
                analytics: "ANALYTIK",
                total: "GESAMT"
            },
            integral: {
                title: "INTEGRALRECHNUNG",
                active_formula: "AKTIVE INTEGRAL-FORMEL",
                area_under_curve: "FLÄCHE UNTER DER KURVE",
                error: "FEHLER",
                limit_a: "Grenze a",
                limit_b: "Grenze b",
                precision_n: "Präzision n",
                mode_analytical: "ANALYTISCH",
                mode_bars: "BALKEN",
                waiting: "Warte auf Daten..."
            },
            diff: {
                title: "DIFFERENTIALRECHNUNG",
                functionality: "FUNKTIONALITÄT",
                point_pos: "Punkt-Position (x₀)",
                visualization: "VISUALISIERUNG",
                deriv_1: "1. Ableitung f'(x)",
                deriv_2: "2. Ableitung f''(x)",
                analysis: "ANALYSE",
                slope: "Steigung f'(x₀)",
                curvature: "Krümmung f''(x₀)",
                reset_point: "Punkt Reset (x₀)"
            },
            power: {
                title: "Potenz- & Wurzelfunktionen",
                parameters: "PARAMETER",
                exponent: "EXPONENT (N)",
                x_pos: "X-POSITION",
                analytics: "ANALYTIK"
            },
            cmaes: {
                title: "FLÄCHENOPTIMIERUNG",
                circle_mission: "OPTIMIERUNG KREIS",
                lens_mission: "OPTIMIERUNG LINSE",
                controls: "STEUERUNG",
                telemetry: "EVOLUTIONSDATEN",
                generation: "GENERATION",
                fitness: "FITNESS",
                perimeter: "UMFANG",
                area: "FLÄCHE",
                start: "START",
                reset: "RESET",
                pause: "PAUSE",
                resume: "WEITER",
                max_gen: "MAX 5000",
                view_circle: "OPTIMIERUNG: KREIS"
            },
            fourier: {
                title: "FOURIER-ANALYSE",
                select_shape: "FORM WÄHLEN",
                shape_note: "MUSIKNOTE",
                shape_square: "QUADRAT",
                shape_heart: "HERZ",
                circles: "KREISE",
                speed: "GESCHWINDIGKEIT",
                show_circles: "KREISE ANZEIGEN",
                tracking: "VERFOLGERKAMERA",
                auto_evolve: "AUTO-EVOLUTION",
                stop_evolution: "EVOLUTION STOPPEN",
                start_evolution: "AUTO-EVOLUTION STARTEN"
            },
            galton: {
                title: "GALTON BOARD",
                balls_total: "ANZAHL ALLER KUGELN",
                controls: "STEUERUNG",
                bins: "Bins",
                interval: "Austrittsintervall (ms)",
                speed: "Fluggeschwindigkeit",
                slow: "langsam",
                fast: "schnell",
                ball_count: "Anzahl Kugeln",
                stop: "STOP",
                play: "PLAY",
                reset: "RESET",
                rows: "Reihen",
                balls_active: "Kugeln aktiv",
                spawn_ms: "Spawn (ms)"
            },
            lissajous: {
                title: "LISSAJOUS · PARAMETRISCHE KURVEN",
                parameters: "PARAMETER",
                view_2d: "2D Kurve",
                view_3d: "3D Pendel",
                amp_a: "Amplitude A",
                amp_b: "Amplitude B",
                freq_x: "ωₓ (Kreisfrequenz)",
                freq_y: "ωᵧ (Kreisfrequenz)",
                phase: "Phase δ (Grad)",
                path_span: "Pfad-Umfang (× Perioden)",
                curve_color: "Kurvenfarbe (Hue)",
                simulation: "SIMULATION",
                stop: "STOPP",
                reset: "RESET",
                view_3d_desc: "Zentralperspektive · xz-Ebene · Aufhängung nur Analog zur Überlagerung"
            },
            steigung: {
                title: "LINEARE FUNKTIONEN",
                function: "FUNKTION",
                slope_m: "STEIGUNG M",
                intercept_n: "Y-ABSCHNITT N",
                zero_x0: "NULLSTELLE X₀",
                parameters: "PARAMETER",
                slope_m_long: "GERADEN-STEIGUNG M",
                tri_pos: "DREIECK POSITION (X)",
                tri_width: "DREIECK BREITE (ΔX)",
                reset_lab: "Labor Zurücksetzen"
            },
            pyth: {
                title: "ALLGEMEINER PYTHAGORAS",
                construction: "KONSTRUKTION",
                choose_mode: "WÄHLE MODUS",
                mode_quad: "Quadrate",
                mode_semi: "Halbkreise",
                mode_tri: "Gleichseitige Dreiecke",
                mode_star: "Crazy Star 🌟",
                mode_pacman: "Pac-Man Mode 🕹️",
                reset: "LABOR RESET",
                analytics: "ANALYSE: FLÄCHEN",
                area_sum: "FLÄCHEN-SUMME [A₁ + A₂]",
                large_area: "GROSSE FLÄCHE [A₃]"
            },
            fermat: {
                title: "FERMAT-PUNKT MINIMIERUNG",
                dist_f: "DISTANZ FERMAT (F)",
                dist_p: "DISTANZ PUNKT (P)",
                diff: "DIFFERENZ (Δ)",
                system: "FERMAT-PUNKT SYSTEM",
                show_tri: "HILFSDREIECKE ANZEIGEN",
                comp_p: "VERGLEICHS-PUNKT P"
            },
            clock: {
                title: "WINKEL ZWISCHEN ZEIGERN",
                time_control: "ZEITSTEUERUNG",
                angle_alpha: "Winkel α",
                angle_beta: "Winkel β"
            },
            sum: {
                title: "BEWEIS INNENWINKELSATZ",
                coords: "KOORDINATEN",
                parallel_point: "Parallele durch Punkt:",
                proof: "MATHEMATISCHER BEWEIS",
                pivot_point: "Am Pivot-Punkt:",
                internal_angles: "Innenwinkel im Dreieck:"
            },
            puzzle: {
                title: "WINKEL PUZZLE",
                wedge_angle: "KEIL-WINKEL (°)",
                dist_a: "ABSTAND A",
                dist_b: "ABSTAND B",
                dist_c: "ABSTAND C",
                dist_d: "ABSTAND D",
                given_blue: "GEGEBENE (BLAU)",
                solution_red: "LÖSUNG (ROT)",
                steps_yellow: "ZWISCHENSCHRITTE (GELB)",
                reset: "LABOR ZURÜCKSETZEN"
            },
            logic: {
                title: "ZAHLEN-LOGIK",
                solved: "GELÖST",
                next_protocol: "NÄCHSTES PROTOKOLL",
                hint_title: "SICHERHEITSABFRAGE",
                confirm: "BESTÄTIGEN",
                cancel: "ABBRECHEN",
                mission_status: "MISSION-STATUS",
                level: "LEVEL",
                moves: "ZÜGE",
                time: "ZEIT",
                mode: "MODUS",
                protocol_select: "PROTOKOLL WÄHLEN",
                protocol_restart: "PROTOKOLL NEUSTART",
                hint_request: "HILFE ANFORDERN",
                instruction_sum: "Alle Zeilen & Spalten müssen die Zielsumme ergeben.",
                instruction_prod: "Alle Zeilen & Spalten müssen das Zielprodukt ergeben."
            },
            fractal: {
                title: "FRAKTALE · MANDELBROT & JULIA",
                mode: "LABOR-MODUS",
                mandelbrot: "MANDELBROT",
                julia: "JULIA-MENGE",
                params: "FRAKTAL-PARAMETER",
                detail: "DETAILGRAD",
                zoom: "ZOOMFAKTOR",
                arithmetic: "ARITHMETIK",
                real: "REAL-TEIL (C_re)",
                imaginary: "IMAGINÄR-TEIL (C_im)",
                iterations: "MAX. ITERATIONEN",
                navigation: "NAVIGATION",
                flight_start: "START FLIGHT",
                flight_stop: "STOP FLIGHT",
                reset: "RESET"
            },
            stats: {
                analytics: "ANALYTIK",
                correlation: "Korrelation (r)",
                slope: "STEIGUNG (m)",
                y_intercept: "Y-ACHSE (n)",
                error_analysis: "FEHLER-ANALYSE",
                std_dev: "Standardabweichung (SD)",
                chaos_points: "ZUFALLS-PUNKTE",
                points_near: "PUNKTE NÄHER",
                points_far: "PUNKTE WEITER",
                mission_title: "MISSION: STATISTIK-LABOR",
                mission_desc: "Willkommen in der Analyseeinheit für Lineare Regression. Analysiere den Zusammenhang zwischen Datenpunkten durch Setzen und Verschieben im Koordinatensystem.",
                admin_ctrl: "TECHNISCHE KONTROLLE (ADMIN ONLY)",
                admin_ctx: "Kontextmenü: Rechtsklick für Gitter, Achsen und Telemetrie.",
                admin_keys: "Tastatur: Pfeiltasten (Oben/Unten) zum Skalieren der Residuen.",
                admin_manip: "Manipulation: Sidebar-Buttons für Chaos-Generierung und Residuen-Shift nutzen."
            },
            parabola: {
                eq_title: "FUNKTIONSGLEICHUNG",
                vertex_form: "SCHEITELPUNKTFORM",
                standard_form: "NORMALFORM",
                roots: "NULLSTELLEN",
                roots_none: "KEINE REELLEN NULLSTELLEN",
                vertex_point: "SCHEITELPUNKT S",
                parameter_a: "PARAMETER A",
                stretch_a: "Streckung a",
                shift_d: "Verschiebung d (x)",
                shift_e: "Verschiebung e (y)",
                vertex_label: "SCHEITELPUNKT"
            },
            angle3d: {
                fold: "FALTUNG",
                offset: "Horizontaler Versatz",
                fold_btn: "FALTEN",
                rotate_btn: "ROTATION",
                sum_title: "3D-INNENWINKELSATZ",
                sum_eq: "WINKELSUMME",
                tetrahedron: "Tetraeder-Faltung"
            },
            transform: {
                rotation: "ROTATION",
                scale: "SKALIERUNG",
                mirror_axis: "ACHSE SPIEGELN",
                mirror_point: "PUNKT SPIEGELN",
                urbild: "URBILD (START)",
                hl_lock: "HL FIXIEREN",
                measurements: "MESSWERTE",
                congruent: "KONGRUENT",
                not_congruent: "NICHT KONGRUENT",
                transversal_short: "TRANSV.",
                parallels_short: "PARALL."
            },
            polygon: {
                sum_interior: "INNENWINKELSUMME",
                angle_protocol: "WINKEL-PROTOKOLL",
                angle_label: "WINKEL {n}",
                vertices: "ECKEN",
                vertex_short: "{n}E"
            },
            proof: {
                target_area: "Zielfläche [ABCD]",
                triangle_sum: "Summe Dreiecke",
                tria_on: "TRIANGULIERUNG AN",
                tria_off: "TRIANGULIERUNG AUS",
                reset_proof: "BEWEIS RESET",
                area_cm2: "FLÄCHE CM²",
                sum_sigma: "SUMME Σ",
                tria_deactive: "TRIANGULIERUNG DEAKTIVIERT",
                out_of_bounds: "AUẞERHALB DES RAHMENS",
                collision: "KOLLISION ERKANNT"
            },
            geometry: {
                angle_analysis: "WINKEL-ANALYSE",
                lab_control: "LABOR-STEUERUNG",
                supp_sum: "NEBENWINKEL-SUMME",
                parallel_on: "PARALLELEN: AN",
                parallel_off: "PARALLELEN: AUS",
                transversal: "TRANSVERSALE",
                parallels: "PARALLELEN",
                step_width: "SCHRITTWEITE: {deg}°"
            },
            logic: {
                instruction_sum: "Addiere die Zahlen, so dass die Zahl neben den Zeilen und unter den Spalten rauskommt.",
                instruction_prod: "Multipliziere die Zahlen, so dass die Zahl neben den Zeilen und unter den Spalten rauskommt.",
                mission_status: "MISSIONS-STATUS",
                level: "LEVEL",
                moves: "ZÜGE",
                time: "ZEIT",
                mode: "RECHEN-MODUS",
                protocol_select: "PROTOKOLL-AUSWAHL",
                protocol_restart: "PROTOKOLL NEUSTART",
                hint_request: "HILFE ANFORDERN",
                hint_title: "HILFE-PROTOKOLL",
                confirm: "BESTÄTIGEN",
                cancel: "ABBRECHEN",
                solved: "PROTOKOLL GELÖST!",
                next_protocol: "NÄCHSTES PROTOKOLL"
            },
            units: {
                ones: "Einer",
                tens: "Zehner",
                hundreds: "Hunderter",
                thousands: "Tausender"
            },
            arithmetic: {
                add: {
                    title: "SCHRIFTLICHE ADDITION",
                    ready: "Bereit für die Addition von {a} und {b}. Wir rechnen von rechts nach links.",
                    focus: "Wir betrachten die {unit}.",
                    calc: "Wir addieren {d1} + {d2} {c} = {sum}.",
                    carry: "Wir notieren {digit} und übertragen {newCarry}.",
                    complete: "Berechnung abgeschlossen! Das Ergebnis ist {result}."
                },
                sub: {
                    title: "SCHRIFTLICHE SUBTRAKTION",
                    ready: "Bereit für die Subtraktion: {a} - {b}.",
                    borrow: "Wir borgen uns 10, da {d1} kleiner als {d2} ist.",
                    calc: "Wir rechnen ({d1} + 10) - {d2} = {result}.",
                    complete: "Berechnung abgeschlossen! Das Ergebnis ist {result}."
                },
                mult: {
                    title: "SCHRIFTLICHE MULTIPLIKATION",
                    ready: "Bereit für die Multiplikation: {a} · {b}.",
                    digit_step: "Wir multiplizieren {d} mit {factor}.",
                    complete: "Multiplikation abgeschlossen! Das Ergebnis ist {result}."
                },
                div: {
                    title: "SCHRIFTLICHE DIVISION",
                    ready: "Bereit für die Division: {a} : {b}.",
                    fit: "Wie oft passt {b} in {val}?",
                    rem: "Rest {rem} wird notiert.",
                    complete: "Division abgeschlossen! Das Ergebnis ist {result}."
                }
            }
        },
        en: {
            ui: {
                next: "NEXT",
                prev: "BACK",
                reset: "RESET LAB",
                step: "STEP",
                coach_title: "Doc Alvers Math Lab",
                logic_game: "Number Puzzle",
                angle_lab: "Angle Lab",
                pythagoras: "Pythagoras Proof",
                angle_sum: "Angle Sum Lab",
                transformation: "Transformations",
                parabola: "Parabola Lab",
                regression: "Statistics Lab",
                euler: "Euler Line"
            },
            euler: {
                construction: "CONSTRUCTION",
                euler_line: "Euler Line",
                feuerbach: "Feuerbach Circle",
                circumcircle: "Circumcircle",
                incircle: "Incircle",
                help_lines: "HELP LINES",
                altitudes: "Altitudes (H)",
                medians: "Medians (S)",
                bisectors: "Bisectors (I)",
                fermat: "Fermat / Napoleon",
                analysis: "ANALYSIS",
                ratio: "Ratio HS / SU",
                incircle_radius: "Incircle-R",
                reset_construction: "Reset Construction"
            },
            lgs: {
                system_title: "SYSTEM OF EQUATIONS",
                formal_system: "FORMAL SYSTEM",
                intersection: "INTERSECTION S",
                notation: "NOTATION",
                magnet_snap: "MAGNET SNAP",
                new_task: "NEW TASK",
                view_reset: "VIEW RESET",
                mode_normal: "NORMAL",
                mode_mirrored: "MIRRORED",
                mode_scaled: "SCALED (sY)",
                mode_implicit_a: "IMPLICIT A",
                mode_implicit_b: "IMPLICIT B",
                mode_random: "RANDOM MIX",
                no_solution: "Parallel / No Solution"
            },
            binom: {
                proof_title: "Proof 1st Binomial Formula",
                division: "DIVISION",
                p_value: "P-VALUE",
                tip: "Tip: Drag the center point in the square!",
                analytics: "ANALYTICS",
                total: "TOTAL"
            },
            integral: {
                title: "INTEGRAL CALCULUS",
                active_formula: "ACTIVE INTEGRAL FORMULA",
                area_under_curve: "AREA UNDER THE CURVE",
                error: "ERROR",
                limit_a: "Limit a",
                limit_b: "Limit b",
                precision_n: "Precision n",
                mode_analytical: "ANALYTICAL",
                mode_bars: "BARS",
                waiting: "Waiting for data..."
            },
            diff: {
                title: "DIFFERENTIAL CALCULUS",
                functionality: "FUNCTIONALITY",
                point_pos: "Point Position (x₀)",
                visualization: "VISUALIZATION",
                deriv_1: "1st Derivative f'(x)",
                deriv_2: "2nd Derivative f''(x)",
                analysis: "ANALYSIS",
                slope: "Slope f'(x₀)",
                curvature: "Curvature f''(x₀)",
                reset_point: "Reset Point (x₀)"
            },
            power: {
                title: "Power & Root Functions",
                parameters: "PARAMETERS",
                exponent: "EXPONENT (N)",
                x_pos: "X-POSITION",
                analytics: "ANALYTICS"
            },
            cmaes: {
                title: "AREA OPTIMIZATION",
                circle_mission: "CIRCLE OPTIMIZATION",
                lens_mission: "LENS OPTIMIZATION",
                controls: "CONTROLS",
                telemetry: "EVOLUTION DATA",
                generation: "GENERATION",
                fitness: "FITNESS",
                perimeter: "PERIMETER",
                area: "AREA",
                start: "START",
                reset: "RESET",
                pause: "PAUSE",
                resume: "RESUME",
                max_gen: "MAX 5000",
                view_circle: "OPTIMIZATION: CIRCLE"
            },
            fourier: {
                title: "FOURIER ANALYSIS",
                select_shape: "SELECT SHAPE",
                shape_note: "MUSIC NOTE",
                shape_square: "SQUARE",
                shape_heart: "HEART",
                circles: "CIRCLES",
                speed: "SPEED",
                show_circles: "SHOW CIRCLES",
                tracking: "TRACKING CAMERA",
                auto_evolve: "AUTO-EVOLUTION",
                stop_evolution: "STOP EVOLUTION",
                start_evolution: "START AUTO-EVOLUTION"
            },
            galton: {
                title: "GALTON BOARD",
                balls_total: "TOTAL BALLS",
                controls: "CONTROLS",
                bins: "Bins",
                interval: "Spawn Interval (ms)",
                speed: "Flight Speed",
                slow: "slow",
                fast: "fast",
                ball_count: "Ball Count",
                stop: "STOP",
                play: "PLAY",
                reset: "RESET",
                rows: "Rows",
                balls_active: "Active Balls",
                spawn_ms: "Spawn (ms)"
            },
            lissajous: {
                title: "LISSAJOUS · PARAMETRIC CURVES",
                parameters: "PARAMETERS",
                view_2d: "2D Curve",
                view_3d: "3D Pendulum",
                amp_a: "Amplitude A",
                amp_b: "Amplitude B",
                freq_x: "ωₓ (Angular Frequency)",
                freq_y: "ωᵧ (Angular Frequency)",
                phase: "Phase δ (Degrees)",
                path_span: "Path Span (× Periods)",
                curve_color: "Curve Color (Hue)",
                simulation: "SIMULATION",
                stop: "STOP",
                reset: "RESET",
                view_3d_desc: "Central perspective · xz-plane · Suspension analogous to superposition"
            },
            steigung: {
                title: "LINEAR FUNCTIONS",
                function: "FUNCTION",
                slope_m: "SLOPE M",
                intercept_n: "Y-INTERCEPT N",
                zero_x0: "ROOT X₀",
                parameters: "PARAMETERS",
                slope_m_long: "LINE SLOPE M",
                tri_pos: "TRIANGLE POSITION (X)",
                tri_width: "TRIANGLE WIDTH (ΔX)",
                reset_lab: "Reset Lab"
            },
            pyth: {
                title: "GENERAL PYTHAGORAS",
                construction: "CONSTRUCTION",
                choose_mode: "CHOOSE MODE",
                mode_quad: "Squares",
                mode_semi: "Semicircles",
                mode_tri: "Equilateral Triangles",
                mode_star: "Crazy Star 🌟",
                mode_pacman: "Pac-Man Mode 🕹️",
                reset: "RESET LAB",
                analytics: "ANALYSIS: AREAS",
                area_sum: "AREA SUM [A₁ + A₂]",
                large_area: "LARGE AREA [A₃]"
            },
            fermat: {
                title: "FERMAT POINT MINIMIZATION",
                dist_f: "FERMAT DISTANCE (F)",
                dist_p: "POINT DISTANCE (P)",
                diff: "DIFFERENCE (Δ)",
                system: "FERMAT POINT SYSTEM",
                show_tri: "SHOW CONSTRUCTION TRIANGLES",
                comp_p: "COMPARISON POINT P"
            },
            clock: {
                title: "ANGLE BETWEEN HANDS",
                time_control: "TIME CONTROL",
                angle_alpha: "Angle α",
                angle_beta: "Angle β"
            },
            sum: {
                title: "INTERNAL ANGLE SUM PROOF",
                coords: "COORDINATES",
                parallel_point: "Parallel through point:",
                proof: "MATHEMATICAL PROOF",
                pivot_point: "At pivot point:",
                internal_angles: "Internal angles in triangle:"
            },
            puzzle: {
                title: "ANGLE PUZZLE",
                wedge_angle: "WEDGE ANGLE (°)",
                dist_a: "DISTANCE A",
                dist_b: "DISTANCE B",
                dist_c: "DISTANCE C",
                dist_d: "DISTANCE D",
                given_blue: "GIVEN (BLUE)",
                solution_red: "SOLUTION (RED)",
                steps_yellow: "INTERMEDIATE STEPS (YELLOW)",
                reset: "RESET LAB"
            },
            fractal: {
                title: "FRACTALS · MANDELBROT & JULIA",
                mode: "LAB MODE",
                mandelbrot: "MANDELBROT",
                julia: "JULIA SET",
                params: "FRACTAL PARAMETERS",
                detail: "DETAIL LEVEL",
                zoom: "ZOOM FACTOR",
                arithmetic: "ARITHMETIC",
                real: "REAL PART (C_re)",
                imaginary: "IMAGINARY PART (C_im)",
                iterations: "MAX. ITERATIONS",
                navigation: "NAVIGATION",
                flight_start: "START FLIGHT",
                flight_stop: "STOP FLIGHT",
                reset: "RESET"
            },
            stats: {
                analytics: "ANALYTICS",
                correlation: "Correlation (r)",
                slope: "SLOPE (m)",
                y_intercept: "Y-INT (n)",
                error_analysis: "ERROR ANALYSIS",
                std_dev: "Standard Deviation (SD)",
                chaos_points: "RANDOM POINTS",
                points_near: "POINTS CLOSER",
                points_far: "POINTS FURTHER",
                mission_title: "MISSION: STATISTICS LAB",
                mission_desc: "Welcome to the Linear Regression analysis unit. Analyze the correlation between data points by placing and moving them in the coordinate system.",
                admin_ctrl: "TECHNICAL CONTROL (ADMIN ONLY)",
                admin_ctx: "Context Menu: Right-click for grid, axes, and telemetry.",
                admin_keys: "Keyboard: Arrow keys (Up/Down) to scale residuals.",
                admin_manip: "Manipulation: Use sidebar buttons for chaos generation and residual shift."
            },
            parabola: {
                eq_title: "FUNCTION EQUATION",
                vertex_form: "VERTEX FORM",
                standard_form: "STANDARD FORM",
                roots: "ROOTS (ZEROS)",
                roots_none: "NO REAL ROOTS",
                vertex_point: "VERTEX S",
                parameter_a: "PARAMETER A",
                stretch_a: "Stretching a",
                shift_d: "Shift d (x)",
                shift_e: "Shift e (y)",
                vertex_label: "VERTEX"
            },
            angle3d: {
                fold: "FOLDING",
                offset: "Horizontal Offset",
                fold_btn: "FOLD",
                rotate_btn: "ROTATION",
                sum_title: "3D INTERIOR ANGLE THEOREM",
                sum_eq: "ANGLE SUM",
                tetrahedron: "Tetrahedron Folding"
            },
            transform: {
                rotation: "ROTATION",
                scale: "SCALE",
                mirror_axis: "MIRROR AXIS",
                mirror_point: "MIRROR POINT",
                urbild: "PREIMAGE (START)",
                hl_lock: "LOCK HELPERS",
                measurements: "MEASUREMENTS",
                congruent: "CONGRUENT",
                not_congruent: "NOT CONGRUENT",
                transversal_short: "TRANSV.",
                parallels_short: "PARALL."
            },
            polygon: {
                sum_interior: "INTERIOR ANGLE SUM",
                angle_protocol: "ANGLE PROTOCOL",
                angle_label: "ANGLE {n}",
                vertices: "VERTICES",
                vertex_short: "{n}V"
            },
            proof: {
                target_area: "Target Area [ABCD]",
                triangle_sum: "Triangle Sum",
                tria_on: "TRIANGULATION ON",
                tria_off: "TRIANGULATION OFF",
                reset_proof: "RESET PROOF",
                area_cm2: "AREA CM²",
                sum_sigma: "SUM Σ",
                tria_deactive: "TRIANGULATION DISABLED",
                out_of_bounds: "OUT OF BOUNDS",
                collision: "COLLISION DETECTED"
            },
            geometry: {
                angle_analysis: "ANGLE ANALYSIS",
                lab_control: "LAB CONTROL",
                supp_sum: "SUPPLEMENTARY ANGLE SUM",
                parallel_on: "PARALLELS: ON",
                parallel_off: "PARALLELS: OFF",
                transversal: "TRANSVERSAL",
                parallels: "PARALLELS",
                step_width: "STEP WIDTH: {deg}°"
            },
            logic: {
                instruction_sum: "Add the numbers so that they match the totals next to the rows and below the columns.",
                instruction_prod: "Multiply the numbers so that they match the totals next to the rows and below the columns.",
                mission_status: "MISSION STATUS",
                level: "LEVEL",
                moves: "MOVES",
                time: "TIME",
                mode: "CALCULATION MODE",
                protocol_select: "PROTOCOL SELECTION",
                protocol_restart: "RESTART PROTOCOL",
                hint_request: "REQUEST HINT",
                hint_title: "HINT PROTOCOL",
                confirm: "CONFIRM",
                cancel: "CANCEL",
                solved: "PROTOCOL SOLVED!",
                next_protocol: "NEXT PROTOCOL"
            },
            units: {
                ones: "ones",
                tens: "tens",
                hundreds: "hundreds",
                thousands: "thousands"
            },
            arithmetic: {
                add: {
                    title: "WRITTEN ADDITION",
                    ready: "Ready to add {a} and {b}. Calculating from right to left.",
                    focus: "Looking at the {unit}.",
                    calc: "Adding {d1} + {d2} {c} = {sum}.",
                    carry: "Writing down {digit} and carrying {newCarry}.",
                    complete: "Calculation finished! The result is {result}."
                },
                sub: {
                    title: "WRITTEN SUBTRACTION",
                    ready: "Ready for subtraction: {a} - {b}.",
                    borrow: "Borrowing 10 because {d1} is smaller than {d2}.",
                    calc: "Calculating ({d1} + 10) - {d2} = {result}.",
                    complete: "Calculation finished! The result is {result}."
                },
                mult: {
                    title: "WRITTEN MULTIPLICATION",
                    ready: "Ready for multiplication: {a} · {b}.",
                    digit_step: "Multiplying {d} by {factor}.",
                    complete: "Multiplication finished! The result is {result}."
                },
                div: {
                    title: "WRITTEN DIVISION",
                    ready: "Ready for division: {a} : {b}.",
                    fit: "How many times does {b} fit into {val}?",
                    rem: "Remainder {rem} is noted.",
                    complete: "Division finished! The result is {result}."
                }
            }
        },
        es: {
            ui: {
                next: "CONTINUAR",
                prev: "VOLVER",
                reset: "REINICIAR",
                step: "PASO",
                coach_title: "Doc Alvers Laboratorio",
                logic_game: "Rompecabezas Numérico",
                angle_lab: "Laboratorio de Ángulos",
                pythagoras: "Prueba de Pitágoras",
                angle_sum: "Laboratorio de Suma de Ángulos",
                transformation: "Transformaciones",
                parabola: "Laboratorio de Parábolas",
                regression: "Laboratorio de Estadística",
                euler: "Recta de Euler"
            },
            euler: {
                construction: "CONSTRUCCIÓN",
                euler_line: "Recta de Euler",
                feuerbach: "Círculo de Feuerbach",
                circumcircle: "Circuncircunferencia",
                incircle: "Incircunferencia",
                help_lines: "LÍNEAS DE AYUDA",
                altitudes: "Alturas (H)",
                medians: "Medianas (S)",
                bisectors: "Bisectrices (I)",
                fermat: "Fermat / Napoleón",
                analysis: "ANÁLISIS",
                ratio: "Relación HS / SU",
                incircle_radius: "Radio In.",
                reset_construction: "Reiniciar Construcción"
            },
            lgs: {
                system_title: "SISTEMA DE ECUACIONES",
                formal_system: "SISTEMA FORMAL",
                intersection: "INTERSECCIÓN S",
                notation: "NOTACIÓN",
                magnet_snap: "AJUSTE MAGNÉTICO",
                new_task: "NUEVA TAREA",
                view_reset: "REINICIAR VISTA",
                mode_normal: "NORMAL",
                mode_mirrored: "ESPEJO",
                mode_scaled: "ESCALADO (sY)",
                mode_implicit_a: "IMPLÍCITO A",
                mode_implicit_b: "IMPLÍCITO B",
                mode_random: "MIX ALEATORIO",
                no_solution: "Paralelo / Sin solución"
            },
            binom: {
                proof_title: "Prueba 1ª Fórmula Binomial",
                division: "DIVISIÓN",
                p_value: "VALOR P",
                tip: "Consejo: ¡Arrastra el punto central en el cuadrado!",
                analytics: "ANALÍTICA",
                total: "TOTAL"
            },
            integral: {
                title: "CÁLCULO INTEGRAL",
                active_formula: "FÓRMULA INTEGRAL ACTIVA",
                area_under_curve: "ÁREA BAJO LA CURVA",
                error: "ERROR",
                limit_a: "Límite a",
                limit_b: "Límite b",
                precision_n: "Precisión n",
                mode_analytical: "ANALÍTICO",
                mode_bars: "BARRAS",
                waiting: "Esperando datos..."
            },
            diff: {
                title: "CÁLCULO DIFERENCIAL",
                functionality: "FUNCIONALIDAD",
                point_pos: "Posición del punto (x₀)",
                visualization: "VISUALIZACIÓN",
                deriv_1: "1ª Derivada f'(x)",
                deriv_2: "2ª Derivada f''(x)",
                analysis: "ANÁLISIS",
                slope: "Pendiente f'(x₀)",
                curvature: "Curvatura f''(x₀)",
                reset_point: "Reiniciar punto (x₀)"
            },
            power: {
                title: "Funciones de Potencia y Raíz",
                parameters: "PARÁMETROS",
                exponent: "EXPONENTE (N)",
                x_pos: "POSICIÓN X",
                analytics: "ANALÍTICA"
            },
            cmaes: {
                title: "OPTIMIZACIÓN DE ÁREAS",
                circle_mission: "OPTIMIZACIÓN DE CÍRCULO",
                lens_mission: "OPTIMIZACIÓN DE LENTE",
                controls: "CONTROLES",
                telemetry: "DATOS DE EVOLUCIÓN",
                generation: "GENERACIÓN",
                fitness: "FITNESS",
                perimeter: "PERÍMETRO",
                area: "ÁREA",
                start: "INICIO",
                reset: "REINICIAR",
                pause: "PAUSA",
                resume: "REANUDAR",
                max_gen: "MÁX 5000",
                view_circle: "OPTIMIZACIÓN: CÍRCULO"
            },
            fourier: {
                title: "ANÁLISIS DE FOURIER",
                select_shape: "SELECCIONAR FORMA",
                shape_note: "NOTA MUSICAL",
                shape_square: "CUADRADO",
                shape_heart: "CORAZÓN",
                circles: "CÍRCULOS",
                speed: "VELOCIDAD",
                show_circles: "MOSTRAR CÍRCULOS",
                tracking: "CÁMARA DE SEGUIMIENTO",
                auto_evolve: "AUTO-EVOLUCIÓN",
                stop_evolution: "DETENER EVOLUCIÓN",
                start_evolution: "INICIAR AUTO-EVOLUCIÓN"
            },
            galton: {
                title: "TABLERO DE GALTON",
                balls_total: "TOTAL DE BOLAS",
                controls: "CONTROLES",
                bins: "Contenedores",
                interval: "Intervalo de salida (ms)",
                speed: "Velocidad de vuelo",
                slow: "lento",
                fast: "rápido",
                ball_count: "Cantidad de bolas",
                stop: "DETENER",
                play: "JUGAR",
                reset: "REINICIAR",
                rows: "Filas",
                balls_active: "Bolas activas",
                spawn_ms: "Spawn (ms)"
            },
            lissajous: {
                title: "LISSAJOUS · CURVAS PARAMÉTRICAS",
                parameters: "PARÁMETROS",
                view_2d: "Curva 2D",
                view_3d: "Péndulo 3D",
                amp_a: "Amplitud A",
                amp_b: "Amplitud B",
                freq_x: "ωₓ (Frecuencia angular)",
                freq_y: "ωᵧ (Frecuencia angular)",
                phase: "Fase δ (Grados)",
                path_span: "Extensión del camino (× Periodos)",
                curve_color: "Color de la curva (Tono)",
                simulation: "SIMULACIÓN",
                stop: "DETENER",
                reset: "REINICIAR",
                view_3d_desc: "Perspectiva central · plano xz · Suspensión análoga a la superposición"
            },
            steigung: {
                title: "FUNCIONES LINEALES",
                function: "FUNCIÓN",
                slope_m: "PENDIENTE M",
                intercept_n: "INTERSECCIÓN Y",
                zero_x0: "RAÍZ X₀",
                parameters: "PARÁMETROS",
                slope_m_long: "PENDIENTE DE LA RECTA M",
                tri_pos: "POSICIÓN DEL TRIÁNGULO (X)",
                tri_width: "ANCHO DEL TRIÁNGULO (ΔX)",
                reset_lab: "Reiniciar Laboratorio"
            },
            pyth: {
                title: "PITÁGORAS GENERAL",
                construction: "CONSTRUCCIÓN",
                choose_mode: "ELEGIR MODO",
                mode_quad: "Cuadrados",
                mode_semi: "Semicírculos",
                mode_tri: "Triángulos equiláteros",
                mode_star: "Crazy Star 🌟",
                mode_pacman: "Pac-Man Mode 🕹️",
                reset: "REINICIAR LABORATORIO",
                analytics: "ANÁLISIS: ÁREAS",
                area_sum: "SUMA DE ÁREAS [A₁ + A₂]",
                large_area: "ÁREA GRANDE [A₃]"
            },
            fermat: {
                title: "MINIMIZACIÓN DEL PUNTO DE FERMAT",
                dist_f: "DISTANCIA FERMAT (F)",
                dist_p: "DISTANCIA PUNTO (P)",
                diff: "DIFERENCIA (Δ)",
                system: "SISTEMA DEL PUNTO DE FERMAT",
                show_tri: "MOSTRAR TRIÁNGULOS AUXILIARES",
                comp_p: "PUNTO DE COMPARACIÓN P"
            },
            clock: {
                title: "ÁNGULO ENTRE MANECILLAS",
                time_control: "CONTROL DE TIEMPO",
                angle_alpha: "Ángulo α",
                angle_beta: "Ángulo β"
            },
            sum: {
                title: "PRUEBA DE LA SUMA DE ÁNGULOS INTERNOS",
                coords: "COORDINADAS",
                parallel_point: "Paralela por el punto:",
                proof: "PRUEBA MATEMÁTICA",
                pivot_point: "En el punto de pivote:",
                internal_angles: "Ángulos internos del triángulo:"
            },
            puzzle: {
                title: "PUZZLE DE ÁNGULOS",
                wedge_angle: "ÁNGULO DE CUÑA (°)",
                dist_a: "DISTANCIA A",
                dist_b: "DISTANCIA B",
                dist_c: "DISTANCIA C",
                dist_d: "DISTANCIA D",
                given_blue: "DADO (AZUL)",
                solution_red: "SOLUCIÓN (ROJO)",
                steps_yellow: "PASOS INTERMEDIOS (AMARILLO)",
                reset: "REINICIAR LABORATORIO"
            },
            fractal: {
                title: "FRACTALES · MANDELBROT & JULIA",
                mode: "MODO DE LABORATORIO",
                mandelbrot: "MANDELBROT",
                julia: "CONJUNTO DE JULIA",
                params: "PARÁMETROS FRACTALES",
                detail: "NIVEL DE DETALLE",
                zoom: "FACTOR DE ZOOM",
                arithmetic: "ARITMÉTICA",
                real: "PARTE REAL (C_re)",
                imaginary: "PARTE IMAGINARIA (C_im)",
                iterations: "MÁX. ITERACIONES",
                navigation: "NAVEGACIÓN",
                flight_start: "INICIAR VUELO",
                flight_stop: "DETENER VUELO",
                reset: "REINICIAR"
            },
            stats: {
                analytics: "ANALÍTICA",
                correlation: "Correlación (r)",
                slope: "PENDIENTE (m)",
                y_intercept: "INTERCEPCIÓN Y (n)",
                error_analysis: "ANÁLISIS DE ERRORES",
                std_dev: "Desviación Estándar (SD)",
                chaos_points: "PUNTOS ALEATORIOS",
                points_near: "ACERCAR PUNTOS",
                points_far: "ALEJAR PUNTOS",
                mission_title: "MISIÓN: LABORATORIO DE ESTADÍSTICA",
                mission_desc: "Bienvenido a la unidad de análisis de Regresión Lineal. Analice la correlación entre los puntos de datos colocándolos y moviéndolos en el sistema de coordenadas.",
                admin_ctrl: "CONTROL TÉCNICO (SOLO ADMIN)",
                admin_ctx: "Menú contextual: clic derecho para cuadrícula, ejes y telemetría.",
                admin_keys: "Teclado: teclas de flecha (Arriba/Abajo) para escalar residuos.",
                admin_manip: "Manipulación: use los botones de la barra lateral para la generación de caos y el cambio de residuos."
            },
            parabola: {
                eq_title: "ECUACIÓN DE LA FUNCIÓN",
                vertex_form: "FORMA DEL VÉRTICE",
                standard_form: "FORMA ESTÁNDAR",
                roots: "RAÍCES (CEROS)",
                roots_none: "SIN RAÍCES REALES",
                vertex_point: "VÉRTICE S",
                parameter_a: "PARÁMETRO A",
                stretch_a: "Estiramiento a",
                shift_d: "Desplazamiento d (x)",
                shift_e: "Desplazamiento e (y)",
                vertex_label: "VÉRTICE"
            },
            angle3d: {
                fold: "PLEGADO",
                offset: "Desplazamiento Horizontal",
                fold_btn: "PLEGAR",
                rotate_btn: "ROTACIÓN",
                sum_title: "TEOREMA DE ÁNGULOS 3D",
                sum_eq: "SUMA DE ÁNGULOS",
                tetrahedron: "Plegado de Tetraedro"
            },
            transform: {
                rotation: "ROTACIÓN",
                scale: "ESCALA",
                mirror_axis: "REFLEJAR EJE",
                mirror_point: "REFLEJAR PUNTO",
                urbild: "PREIMAGEN (INICIO)",
                hl_lock: "BLOQUEAR AYUDAS",
                measurements: "MEDIDAS",
                congruent: "CONGRUENTE",
                not_congruent: "NO CONGRUENTE",
                transversal_short: "TRANSV.",
                parallels_short: "PARALL."
            },
            polygon: {
                sum_interior: "SUMA DE ÁNGULOS INTERIORES",
                angle_protocol: "PROTOCOLO DE ÁNGULOS",
                angle_label: "ÁNGULO {n}",
                vertices: "VÉRTICES",
                vertex_short: "{n}V"
            },
            proof: {
                target_area: "Área Objetivo [ABCD]",
                triangle_sum: "Suma de Triángulos",
                tria_on: "TRIANGULACIÓN ACTIVADA",
                tria_off: "TRIANGULACIÓN DESACTIVADA",
                reset_proof: "REINICIAR PRUEBA",
                area_cm2: "ÁREA CM²",
                sum_sigma: "SUMA Σ",
                tria_deactive: "TRIANGULACIÓN DESACTIVADA",
                out_of_bounds: "FUERA DE LÍMITES",
                collision: "COLISIÓN DETECTADA"
            },
            geometry: {
                angle_analysis: "ANÁLISIS DE ÁNGULOS",
                lab_control: "CONTROL DEL LABORATORIO",
                supp_sum: "SUMA DE ÁNGULOS SUPLEMENTARIOS",
                parallel_on: "PARALELAS: ACTIVADO",
                parallel_off: "PARALELAS: DESACTIVADO",
                transversal: "TRANSVERSAL",
                parallels: "PARALELAS",
                step_width: "ANCHO DE PASO: {deg}°"
            },
            logic: {
                instruction_sum: "Suma los números para que coincidan con los totales al lado de las filas y debajo de las columnas.",
                instruction_prod: "Multiplica los números para que coincidan con los totales al lado de las filas y debajo de las columnas.",
                mission_status: "ESTADO DE LA MISIÓN",
                level: "NIVEL",
                moves: "MOVIMIENTOS",
                time: "TIEMPO",
                mode: "MODO DE CÁLCULO",
                protocol_select: "SELECCIÓN DE PROTOCOLO",
                protocol_restart: "REINICIAR PROTOCOLO",
                hint_request: "SOLICITAR PISTA",
                hint_title: "PROTOCOLO DE PISTA",
                confirm: "CONFIRMAR",
                cancel: "CANCELAR",
                solved: "¡PROTOCOLO RESUELTO!",
                next_protocol: "SIGUIENTE PROTOCOLO"
            },
            units: {
                ones: "unidades",
                tens: "decenas",
                hundreds: "centenas",
                thousands: "millares"
            },
            arithmetic: {
                add: {
                    title: "SUMA ESCRITA",
                    ready: "Listo para sumar {a} y {b}. Calculando de derecha a izquierda.",
                    focus: "Mirando las {unit}.",
                    calc: "Sumando {d1} + {d2} {c} = {sum}.",
                    carry: "Anotamos {digit} y llevamos {newCarry}.",
                    complete: "¡Cálculo finalizado! El resultado es {result}."
                },
                sub: {
                    title: "RESTA ESCRITA",
                    ready: "Listo para restar: {a} - {b}.",
                    borrow: "Pedimos prestado 10 porque {d1} es menor que {d2}.",
                    calc: "Calculando ({d1} + 10) - {d2} = {result}.",
                    complete: "¡Cálculo finalizado! El resultado es {result}."
                },
                mult: {
                    title: "MULTIPLICACIÓN ESCRITA",
                    ready: "Listo para multiplicar: {a} · {b}.",
                    digit_step: "Multiplicamos {d} por {factor}.",
                    complete: "¡Multiplicación finalizada! El resultado es {result}."
                },
                div: {
                    title: "DIVISIÓN ESCRITA",
                    ready: "Listo para dividir: {a} : {b}.",
                    fit: "¿Cuántas veces cabe {b} en {val}?",
                    rem: "Se anota el resto {rem}.",
                    complete: "¡División finalizada! El resultado es {result}."
                }
            }
        }
    },

    // Helper to get a translation
    get: function (key, replacements = {}) {
        const parts = key.split('.');
        let result = this.translations[this.current];

        for (let part of parts) {
            if (result && result[part]) {
                result = result[part];
            } else {
                return key; // Fallback to key name
            }
        }

        // Replace placeholders
        if (typeof result === 'string') {
            Object.keys(replacements).forEach(placeholder => {
                result = result.replace(`{${placeholder}}`, replacements[placeholder]);
            });
        }

        return result;
    }
};
