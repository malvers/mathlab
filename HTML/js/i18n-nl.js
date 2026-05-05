
// Nederlands: eigen object (niet alias van EN) zodat index/tools in i18n-index.js nl krijgen zonder EN te wijzigen.
try {
    CyberI18n.translations.nl = structuredClone(CyberI18n.translations.en);
} catch (e) {
    CyberI18n.translations.nl = JSON.parse(JSON.stringify(CyberI18n.translations.en));
}
Object.assign(CyberI18n.translations.nl.lgs, {
    system_title: "STELSEL VAN VERGELIJKINGEN",
    formal_system: "FORMEEL SYSTEEM",
    intersection: "SNIJPUNT S",
    notation: "NOTATIE",
    magnet_snap: "MAGNET-SNAP",
    new_task: "NIEUWE OPDRACHT",
    view_reset: "BEELD RESET",
    mode_normal: "NORMAAL",
    mode_mirrored: "GESPIEGELD",
    mode_scaled: "GESCHAALD (sY)",
    mode_implicit_a: "IMPLICIET A",
    mode_implicit_b: "IMPLICIET B",
    mode_random: "WILLEKEURIG MIX",
    no_solution: "Evenwijdig / geen oplossing"
});
Object.assign(CyberI18n.translations.nl.ui, {
    reset: "LAB RESET",
    show_grid: "Raster tonen",
    show_axes: "Assen tonen",
    show_labels: "Aslabels",
    show_telemetry: "Coördinaten",
    mini_rail_lang_title: "Weergavetaal — klik voor volgende",
    reset_view: "Beeld resetten"
});
Object.assign(CyberI18n.translations.nl.angle3d, {
    axes: "Assen tonen",
    grid: "Raster tonen",
    labels: "Aslabels"
});
Object.assign(CyberI18n.translations.nl.fractal, {
    telemetry: "Coördinaten"
});
(function nlLabsDeepDutch() {
    var nl = CyberI18n.translations.nl;
    if (!nl) return;
    function deepMerge(target, source) {
        if (!source || typeof source !== "object") return;
        Object.keys(source).forEach(function (k) {
            var v = source[k];
            if (v && typeof v === "object" && !Array.isArray(v)) {
                if (!target[k] || typeof target[k] !== "object") target[k] = {};
                deepMerge(target[k], v);
            } else {
                target[k] = v;
            }
        });
    }
    /** Volledige NL-labteksten (geen EN-kloon voor deze namespaces). */
    deepMerge(nl, {
        ui: {
            next: "VOLGENDE",
            prev: "TERUG",
            reset: "LAB RESET",
            step: "STAP",
            universe_title: "Universe · labgalerij",
            logic_game: "Getallenpuzzel",
            angle_lab: "Hoekenlab",
            pythagoras: "Pythagorasbewijs",
            angle_sum: "Hoekensom-lab",
            transformation: "Transformaties",
            parabola: "Parabellenlab",
            regression: "Statistiek-lab",
            euler: "Eulerlijn",
            imaginary_numbers: "Imaginaire getallen",
            summand: "Term",
            description: "STAPBESCHRIJVING",
            minuend: "Minuend",
            subtrahend: "Subtrahend",
            factor1: "Factor 1 (vermenigvuldigd)",
            factor2: "Factor 2 (vermenigvuldiger)",
            dividend: "Deeltal",
            divisor: "Deler",
            fine_mode: "Stap voor stap",
            toggle_menu: "Menu wisselen",
            adopt_contact_btn_title: "Adopteer een lab!",
            contact_lab_modal_title: "Adopteer een lab!",
            contact_lab_modal_body:
                "We zoeken mensen die zich verantwoordelijk voelen voor een lab en af en toe controleren of alles nog werkt. Jouw hulp is van harte welkom!",
            contact_lab_email_cta: "E-mail",
            contact_lab_close: "SLUITEN"
        },
        euler: {
            construction: "CONSTRUCTIE",
            euler_line: "Eulerlijn",
            feuerbach: "Feuerbach-cirkel",
            circumcircle: "Omschreven cirkel",
            incircle: "Ingeschreven cirkel",
            help_lines: "HULPLIJNEN",
            altitudes: "Hoogtelijnen (H)",
            medians: "Zwaartelijnen (S)",
            bisectors: "Deellijnen (I)",
            fermat: "Fermat / Napoleon",
            analysis: "ANALYSE",
            ratio: "Verhouding HS / SU",
            incircle_radius: "Straal inkreis",
            reset_construction: "Constructie resetten"
        },
        binom: {
            proof_title: "Bewijs 1e binomiumformule",
            division: "VERDELING",
            p_value: "P-WAARDE",
            tip: "Tip: sleep het midden van het vierkant!",
            analytics: "ANALYSE",
            total: "TOTAAL"
        },
        integral: {
            title: "INTEGRAALREKENING",
            active_formula: "ACTIEVE INTEGRAALFORMULE",
            area_under_curve: "OPPERVLAK ONDER DE KROMME",
            error: "FOUT",
            limit_a: "Grens a",
            limit_b: "Grens b",
            precision_n: "Precisie n",
            mode_analytical: "ANALYTISCH",
            mode_bars: "STAVEN",
            waiting: "Wacht op data..."
        },
        diff: {
            title: "DIFFERENTIAALREKENING",
            functionality: "FUNCTIONALITEIT",
            point_pos: "Puntpositie (x₀)",
            visualization: "VISUALISATIE",
            deriv_1: "1e afgeleide f'(x)",
            deriv_2: "2e afgeleide f''(x)",
            analysis: "ANALYSE",
            slope: "Richting f'(x₀)",
            curvature: "Kromming f''(x₀)",
            reset_point: "Punt reset (x₀)"
        },
        power: {
            title: "Machts- en wortelfuncties",
            parameters: "PARAMETERS",
            exponent: "EXPONENT (N)",
            x_pos: "X-POSITIE",
            analytics: "ANALYSE"
        },
        cmaes: {
            title: "OPPERVLAKTE-OPTIMALISATIE",
            circle_mission: "CIRKEL-OPTIMALISATIE",
            lens_mission: "LENS-OPTIMALISATIE",
            controls: "BESTURING",
            telemetry: "EVOLUTIEDATA",
            generation: "GENERATIE",
            fitness: "FITNESS",
            perimeter: "OMTREK",
            area: "OPPERVLAK",
            start: "START",
            reset: "RESET",
            pause: "PAUZE",
            resume: "VERDER",
            max_gen: "MAX 5000",
            view_circle: "OPTIMALISATIE: CIRKEL"
        },
        fourier: {
            title: "FOURIER-ANALYSE",
            select_shape: "VORM KIEZEN",
            shape_note: "MUZIEKNOOT",
            shape_square: "VIERKANT",
            shape_heart: "HART",
            circles: "CIRKELS",
            speed: "SNELHEID",
            show_circles: "CIRKELS TONEN",
            tracking: "VOLGCAMERA",
            auto_evolve: "AUTO-EVOLUTIE",
            stop_evolution: "EVOLUTIE STOPPEN",
            start_evolution: "AUTO-EVOLUTIE STARTEN"
        },
        galton: {
            title: "GALTONBORD",
            balls_total: "TOTAAL AANTAL BALLEN",
            controls: "BESTURING",
            bins: "Vakken",
            interval: "Spawn-interval (ms)",
            speed: "Vliegsnelheid",
            slow: "langzaam",
            fast: "snel",
            ball_count: "Aantal ballen",
            stop: "STOP",
            play: "PLAY",
            reset: "RESET",
            rows: "Rijen",
            balls_active: "Actieve ballen",
            spawn_ms: "Spawn (ms)"
        },
        lissajous: {
            title: "LISSAJOUS · PARAMETRISCHE KROMMEN",
            parameters: "PARAMETERS",
            view_2d: "2D-kromme",
            view_3d: "3D-slinger",
            amp_a: "Amplitude A",
            amp_b: "Amplitude B",
            freq_x: "ωₓ (hoekfrequentie)",
            freq_y: "ωᵧ (hoekfrequentie)",
            phase: "Fase δ (graden)",
            path_span: "Padlengte (× perioden)",
            curve_color: "Krommekleur (tint)",
            simulation: "SIMULATIE",
            stop: "STOP",
            reset: "RESET",
            view_3d_desc: "Centraal perspectief · xz-vlak · ophangen analoog aan superpositie"
        },
        steigung: {
            title: "LINEAIRE FUNCTIES",
            function: "FUNCTIE",
            slope_m: "RICHTING M",
            intercept_n: "Y-AFSNIJDING N",
            zero_x0: "NULPUNT X₀",
            parameters: "PARAMETERS",
            slope_m_long: "RICHTING LIJN M",
            tri_pos: "DRIEHOEKSPOSITIE (X)",
            tri_width: "DRIEHOEKSBREEDTE (ΔX)",
            reset_lab: "Lab resetten"
        },
        pyth: {
            title: "ALGEMENE PYTHAGORAS",
            construction: "CONSTRUCTIE",
            choose_mode: "MODUS KIEZEN",
            mode_quad: "Vierkanten",
            mode_semi: "Halve cirkels",
            mode_tri: "Gelijkzijdige driehoeken",
            mode_star: "Crazy Star 🌟",
            mode_pacman: "Pac-Man-modus 🕹️",
            reset: "LAB RESET",
            analytics: "ANALYSE: OPPERVLAKTEN",
            area_sum: "OPTELSOM OPPERVLAKTE [A₁ + A₂]",
            large_area: "GROTE OPPERVLAKTE [A₃]"
        },
        fermat: {
            title: "FERMATPUNT-MINIMALISATIE",
            dist_f: "FERMAT-AFSTAND (F)",
            dist_p: "PUNT-AFSTAND (P)",
            diff: "VERSCHIL (Δ)",
            system: "FERMATPUNT-SYSTEEM",
            show_tri: "HULPDRIEHOEKEN TONEN",
            comp_p: "VERGELIJKINGSPUNT P"
        },
        clock: {
            title: "HOEK TUSSEN WIJZERS",
            time_control: "TIJDREGELING",
            angle_alpha: "Hoek α",
            angle_beta: "Hoek β"
        },
        sum: {
            title: "BEWIJS BINNENHOEKENSOM",
            coords: "COÖRDINATEN",
            parallel_point: "Evenwijdig door punt:",
            proof: "WISKUNDIG BEWIJS",
            pivot_point: "In kantelpunt:",
            internal_angles: "Binnenhoeken in driehoek:"
        },
        puzzle: {
            title: "HOEKENPUZZEL",
            wedge_angle: "KEILHOEK (°)",
            dist_a: "AFSTAND A",
            dist_b: "AFSTAND B",
            dist_c: "AFSTAND C",
            dist_d: "AFSTAND D",
            given_blue: "GEGEVEN (BLAUW)",
            solution_red: "OPLOSSING (ROOD)",
            steps_yellow: "TUSSENSTAPPEN (GEEL)",
            reset: "LAB RESET"
        },
        stats: {
            analytics: "ANALYSE",
            correlation: "Correlatie (r)",
            slope: "RICHTING (m)",
            y_intercept: "Y-SNIJPUNT (n)",
            error_analysis: "FOUTANALYSE",
            std_dev: "Standaardafwijking (SD)",
            chaos_points: "WILLEKEURIGE PUNTEN",
            points_near: "PUNTEN DICHTERBIJ",
            points_far: "PUNTEN VERDER",
            mission_title: "MISSIE: STATISTIEK-LAB",
            mission_desc:
                "Welkom bij de lineaire regressie. Analyseer het verband door punten in het assenstelsel te zetten en te verschuiven.",
            admin_ctrl: "TECHNISCHE REGELING (ALLEEN ADMIN)",
            admin_ctx: "Contextmenu: rechtsklik voor raster, assen en telemetrie.",
            admin_keys: "Pijltjestoetsen (omhoog/omlaag) om resten te schalen.",
            admin_manip: "Zijbalkknoppen voor chaos en restverschuiving."
        },
        parabola: {
            eq_title: "FUNCTIEVOORSCHRIFT",
            vertex_form: "TOPPUNTENVOORM",
            standard_form: "STANDAARDVOORM",
            roots: "NULLEN",
            roots_none: "GEEN REËLE NULLEN",
            vertex_point: "TOPPUNT S",
            parameter_a: "PARAMETER A",
            stretch_a: "Uitrekking a",
            shift_d: "Verschuiving d (x)",
            shift_e: "Verschuiving e (y)",
            vertex_label: "TOPPUNT"
        },
        angle3d: {
            fold: "PLOOIEN",
            offset: "Horizontale verschuiving",
            fold_btn: "PLOOI",
            rotate_btn: "ROTATIE",
            sum_title: "3D BINNENHOEKENSOM",
            sum_eq: "HOEKENSOM",
            tetrahedron: "Tetraëdervouw",
            axes: "Assen tonen",
            grid: "Raster tonen",
            labels: "Aslabels"
        },
        transform: {
            rotation: "ROTATIE",
            scale: "SCHAAL",
            mirror_axis: "SPIEGEL AS",
            mirror_point: "SPIEGEL PUNT",
            urbild: "VOORAFBEELDING (START)",
            hl_lock: "HULPLIJNEN VAST",
            measurements: "MEETWAARDEN",
            congruent: "CONGRUENT",
            not_congruent: "NIET CONGRUENT",
            transversal_short: "TRANSV.",
            parallels_short: "EVENW."
        },
        polygon: {
            sum_interior: "BINNENHOEKENSOM",
            angle_protocol: "HOEKENPROTOCOL",
            angle_label: "HOEK {n}",
            vertices: "HOEKPUNTEN",
            vertex_short: "{n}H"
        },
        proof: {
            target_area: "Doeloppervlak [ABCD]",
            triangle_sum: "Driehoekssom",
            tria_on: "TRIANGULATIE AAN",
            tria_off: "TRIANGULATIE UIT",
            reset_proof: "BEWIJS RESET",
            area_cm2: "OPPERVLAK CM²",
            sum_sigma: "SOM Σ",
            tria_deactive: "TRIANGULATIE UIT",
            out_of_bounds: "BUITEN BEREIK",
            collision: "BOTSING"
        },
        geometry: {
            angle_analysis: "HOEKANALYSE",
            lab_control: "LABBESTURING",
            supp_sum: "SOM SUPPLEMENTAIRE HOEKEN",
            parallel_on: "EVENWIJDIGEN: AAN",
            parallel_off: "EVENWIJDIGEN: UIT",
            transversal: "DWARSLIJN",
            parallels: "EVENWIJDIGEN",
            step_width: "STAPBREEDTE: {deg}°"
        },
        logic: {
            instruction_sum: "Tel de getallen zodat rij- en kolomtotalen kloppen.",
            instruction_prod: "Vermenigvuldig zodat rij- en kolomproducten kloppen.",
            mission_status: "MISSIESTATUS",
            level: "NIVEAU",
            moves: "ZETTEN",
            time: "TIJD",
            mode: "REKENMODUS",
            protocol_select: "PROTOCOL KIEZEN",
            protocol_restart: "PROTOCOL HERSTARTEN",
            hint_request: "HINT VRAGEN",
            hint_title: "HINT",
            confirm: "BEVESTIGEN",
            cancel: "ANNULEREN",
            solved: "OPGELOST!",
            next_protocol: "VOLGEND PROTOCOL"
        },
        units: {
            ones: "enen",
            tens: "tientallen",
            hundreds: "honderdtallen",
            thousands: "duizendtallen"
        },
        coolsquares: {
            title: "HET ULTIEME VIERKANTSBEWIJS",
            proportions: "VERHOUDINGEN",
            side_a: "Centrale zijde a",
            show_labels: "Labels tonen",
            gap_x: "Speling x",
            result_y: "Resultaat y",
            area_green: "Groen oppervlak"
        },
        fibonacci: {
            title: "FIBONACCI-SPIRAAL",
            step: "Stap",
            spiral: "Kwartcirkels (spiraal)",
            squares: "Vierkantsgrenzen"
        },
        orbitals: {
            title: "Atoomorbitalen",
            parameters: "PARAMETERS",
            orbital: "Orbitaal",
            resolution: "Resolutie (rooster)",
            specular: "Specular (glans)",
            opacity: "Doorzichtigheid",
            prob_cloud: "Waarschijnlijkheidswolk",
            prob_sq: "|Y|²",
            prob_desc: "(Oppervlak uit)",
            rotation: "AUTO-ROTATIE (SPATIEBALK)",
            help_btn: "TOETSENHULP",
            help_title: "Sneltoetsen",
            help_prev_next: "Vorig / volgend orbitaal",
            help_res: "Resolutie: ±1 per toets, Shift ±10",
            help_space_esc: "Auto-rotatie (spatiebalk) · Reset (Esc)",
            help_digits: "Resolutie: snelkeuze (cijfers)",
            help_toggle: "Hulpvenster wisselen",
            help_mouse: "Trackball: links draaien · wiel zoom · rechts pannen",
            orbital_suffix: "ORBITAAL"
        },
        coord: {
            title: "Coord-tester | ULTRA v5.3.8",
            subtitle: "COORD-SYSTEEM TESTER",
            controls: "PROJECTIEBESTURING",
            func1: "f(x) = -x²",
            func2: "g(x) = x⁻²"
        },
        iso_tri: {
            title: "Gelijkbenige driehoek | ULTRA v5.3.8",
            subtitle: "GELIJKBENIGE DRIEHOEK",
            invalid: "⚠️ GEEN DRIEHOEK MOGELIJK",
            perimeter: "OMTREK",
            base: "BASIS",
            leg: "BEEN",
            base_length: "BASISLENGTE",
            note: "LET OP: een driehoek bestaat alleen voor b < 4,0."
        },
        triangulierer: {
            title: "DELAUNAY-TRIANGULATIE",
            triangle: "DRIEHOEK",
            area: "OPPERVLAK",
            sum: "SOM Σ",
            controls: "BESTURING",
            multi_mode: "Multi-select modus",
            delete_selection: "Selectie wissen",
            target_area: "Doeloppervlak",
            sum_delta: "Som Δ"
        },
        langley: {
            title: "LANGLEY-AVONTUUR",
            subtitle: "Meetkunde & goniometrie",
            all_on_off: "ALLES AAN/UIT",
            phase1: "Fase 1: Rechte driehoek",
            phase2: "Fase 2: Linkse driehoek",
            phase3: "Fase 3: Binnenhoeken",
            phase4: "Fase 4: Raadsel",
            phase5_geo: "Fase 5: Meetkundige oplossing",
            phase5_tri: "Fase 5: Goniometrische oplossing",
            step: "STAP",
            variant_classic: "1. Klassiek (BAC=70°, ABD=60°)",
            variant_v2: "2. Variant (BAC=60°, ABD=50°)",
            variant_v3: "3. Variant (BAC=50°, ABD=60°)",
            briefing_title: "MISSIE-INSTRUCTIE",
            briefing_text: "Analyseer het Langley-vierhoek via stap-voor-stap hoekopbouw."
        },
        butterfly: {
            title: "VLINDER-LAB",
            animation: "ANIMATIEMOTOR",
            speed: "Snelheid",
            hue: "Basistint",
            pause: "PAUZE",
            play: "PLAY",
            glow: "GLOW",
            reset: "RESET",
            params: "KROMMEPARAMETERS",
            exp_amp: "Exp-versterking",
            cos_amp: "Cos-versterking",
            cos_freq: "Cos-freq",
            sin_amp: "Sin-versterking",
            sin_div: "Sin-deler",
            ctx_reset: "Animatie resetten",
            ctx_glow: "Glow-effect AAN/UIT"
        },
        heart3d: {
            title: "3D-HARTOPPERVLAK | TAUBIN-VERGELIJKING",
            sdf_control: "SDF-BESTURING",
            stretch: "Rekfactor (A)",
            modulation: "Oppervlakmodulatie (B)"
        },
        litchi3d: {
            title: "3D-LYCHEE | PROCEDURELE MEETKUNDE",
            ripeness: "Vruchtrijping",
            bumps: "Stekelintensiteit",
            shape: "Vormfactor (Y)"
        },
        arithmetic: {
            add: {
                title: "CIJFEROPTELLING",
                ready: "Klaar om {a} en {b} op te tellen. Van rechts naar links.",
                focus: "Kijk naar de {unit}.",
                calc: "{d1} + {d2} {c} = {sum}.",
                carry: "We schrijven {digit} en dragen {newCarry} over.",
                complete: "Klaar! Het antwoord is {result}."
            },
            sub: {
                title: "CIJFERSAFTREKKEN",
                ready: "Klaar voor {a} − {b}.",
                borrow: "Lenen 10 omdat {d1} kleiner is dan {d2}.",
                calc: "({d1} + 10) − {d2} = {result}.",
                complete: "Klaar! Het antwoord is {result}."
            },
            mult: {
                title: "CIJFERVERMENIGVULDIGING",
                ready: "Klaar voor {a} · {b}.",
                digit_step: "Vermenigvuldig {d} met {factor}.",
                row_done: "Rij met {d} is klaar. Alle deelresultaten van deze rij zijn berekend.",
                carry_init: "Overdracht {c} van vorig deelproduct.",
                carry_add: "Overdracht optellen: {prod} + {c} = {final}.",
                complete: "Klaar! Het antwoord is {result}."
            },
            div: {
                title: "CIJFERDELING",
                ready: "Klaar voor {a} : {b}.",
                collect: "Past {b} in {val}? Nee — volgende cijfer.",
                fit: "Hoe vaak past {b} in {val}? {q} keer. {q} × {b} = {prod}.",
                bring_down: "Volgende cijfer {d}. Nieuw getal {newVal}.",
                rem: "Rest {rem}.",
                complete: "Klaar! Het antwoord is {result}."
            }
        }
    });
    /** Mandelbrot/Julia: NL inclusief orbit-/scan-hulpteksten. */
    deepMerge(nl.fractal, {
        title: "FRACTALEN · MANDELBROT & JULIA",
        mode: "LABMODUS",
        mandelbrot: "MANDELBROT",
        julia: "JULIA-VERZAMELING",
        burning_ship: "BURNING SHIP",
        params: "FRACTALPARAMETERS",
        detail: "DETAILNIVEAU",
        zoom: "ZOOM",
        arithmetic: "REKENEN",
        real: "REËEL DEEL (C_re)",
        imaginary: "IMAGINAIR DEEL (C_im)",
        slider_plane_hint:
            "Schuifregelaars = coördinaten in het complexe vlak (zelfde eenheden als de orbit-assen), geen pixels.",
        iterations: "MAX. ITERATIES",
        navigation: "NAVIGATIE",
        flight_start: "ORBIT STARTEN",
        flight_stop: "ORBIT STOPPEN",
        reset: "RESET",
        display: "WEERGAVE",
        plane_fractal: "FRACTAAL",
        plane_orbit: "ORBIT",
        orbit_help_mb:
            "Iteratie z_{n+1}=z_n²+c vanaf z₀=0 met c in het midden van de fractaalweergave. Cirkels |z|=1 en |z|=2 (typische ontsnappingsgrens).",
        orbit_help_bs:
            "Burning Ship: z_{n+1}=(|ℜ z_n|+i|ℑ z_n|)²+c vanaf z₀=0; dezelfde cirkels |z|=1 en |z|=2 als bij Mandelbrot.",
        orbit_help_jl: "Julia: vaste c via de schuifregelaars; de orbit start bij z₀ = het midden van de fractaalweergave.",
        orbit_drag_hint:
            "Sleep punt c (Mandelbrot of Burning Ship; gelijk aan het midden van de fractaalweergave) of z₀ (Julia). Anders: het vlak verschuiven of zoomen.",
        orbit_grid: "Rasterlijnen",
        orbit_show_worked: "Berekening tonen",
        orbit_leg_polyline: "Orbit: segmenten, tussenpunten + punt c",
        orbit_legs_arrows:
            "Schenkelbudget (max.): {n} (↑/↓ alleen in orbitweergave; Shift = grotere stappen)",
        orbit_legs_escape_trunc: "→ getekend: {shown} van max. {budget} (afgebroken bij ontsnapping |z|²>4)",
        orbit_scan_hint:
            "Spatiebalk: rij voor rij van boven naar beneden — fijne oranje punten ≈ begrensde orbit; eindigt onderaan. Spatie tijdens scan: annuleren en wissen.",
        orbit_scan_running: "→ Scan bezig (boven→beneden)",
        orbit_stable_points_label: "Stabiele punten",
        orbit_scan_julia_outside_mb_note:
            "Dit c ligt buiten de Mandelbrotverzameling: de gevulde Julia-verzameling is hier extreem dun (Cantor-stof). Op een pixelraster vind je bijna nooit een start-z₀ met blijvend begrensde orbit — N≈0 is te verwachten.\nVergelijk met Mandelbrot-modus en scan: daar zie je veel gele c-treffers.",
        orbit_scan_julia_outside_mb_hud:
            "Let op: Julia-c buiten M → weinig rastertreffers (N≈0). Mandelbrot-scan toont gele punten.",
        orbit_hud_toggle: "⌘D / Ctrl+D: HUD aan/uit",
        orbit_hud_stopwatch_idle: "Stopwatch:\n—",
        orbit_hud_stopwatch_running: "Stopwatch:\n{t}",
        orbit_hud_stopwatch_latched: "Stopwatch:\n{t}\n(pauze / klaar)"
    });
})();

// Sprache: URL ?lang= → localStorage cyber-lab-lang → Standard DE (Nutzerwahl persistiert beim Flag-Toggle)
(function () {
    try {
        CyberI18n.resolveLanguageFromEnvironment();
        CyberI18n.suppressBrowserTranslatePrompt();
    } catch (e) {
        console.warn("Language auto-detect failed:", e);
    }
    window.addEventListener(
        'pageshow',
        function (ev) {
            if (!ev.persisted) return;
            requestAnimationFrame(function () {
                try {
                    CyberI18n.resolveLanguageFromEnvironment();
                    CyberI18n.suppressBrowserTranslatePrompt();
                    if (typeof CyberUI !== 'undefined' && typeof CyberUI.syncCyberLangDisplayButtons === 'function') {
                        CyberUI.syncCyberLangDisplayButtons();
                    }
                } catch (e2) {
                    console.warn('Language re-sync after bfcache failed:', e2);
                }
            });
        },
        false
    );
})();

