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
                regression: "Statistik-Labor"
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
                regression: "Statistics Lab"
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
                regression: "Laboratorio de Estadística"
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
