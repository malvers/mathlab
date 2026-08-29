/**
 * i18n extension for Index/Dashboard page — Nederlands (nl).
 * Loaded by js/i18n-index.js (loader) for the ACTIVE language only —
 * never referenced directly from HTML. One file per language.
 */
(function () {
    if (typeof CyberI18n === 'undefined') {
        console.error("CyberI18n not found! Load i18n.js before i18n-index-nl.js");
        return;
    }
    const t = (CyberI18n.translations.nl = CyberI18n.translations.nl || {});
    t.index = {
            admin_gate: {
                title: "AUTORISATIE CONTROLEREN",
                pwd_placeholder: "Wachtwoord",
                access: "TOEGANG",
                cancel: "ANNULEREN"
            },
            ui: {
                coffee_title: "Trakteer op een cyberkoffie",
                about_title: "Filmische intro — Doc Alvers",
                qr_title: "QR-code van deze pagina",
                sound_title: "Achtergrondgeluid",
                search_placeholder: "LABORATORIUMSCAN STARTEN...",
                mission_start: "Missie starten",
                all_tools: "Alle tools",
                tools_subtitle_word: "Tools",
                tools_filter_hits: "TREFFERS",
                tools_no_results: "Geen resultaten voor \"{query}\"",
                tools_close_aria: "Tooloverzicht sluiten en terug naar labkeuze",
                tools_footer_aria: "Voettekst",
                tools_universe_aria: "Open Universe · laboratoriumgalerij in de ruimte",
                tools_doc_title: "Cyber-Lab | Mission Control",
                education: "ONDERWIJS",
                games: "Spellen",
                lgs: "Stelsels van vergelijkingen",
                pythagoras: "Stelling van Pythagoras",
                triangles: "Driehoeken",
                arithmetic: "Basisrekenen",
                hot_stuff: "Hot stuff",
                neu: "Nieuw",
                apps: "Apps",
                fun: "Fun",
                functions: "Functies",
                highlights: "Hoogtepunten",
                fraktale: "Fractalen",
                university: "Universiteit",
                themes_count: "Thema's",
                themes_top5_title: "Top Labs",
                grade_title: "Leerjaar",
                grade_uni: "Uni",
                grade_uni_tip: "Universiteit · bijzonder complexe laboratoria (analyse, natuurkunde, fractalen, …)",
                grade_back_tip: "Terug naar themakeuze",
                universe_tip: "Universe · laboratoriumgalerij in de ruimte",
                credits: "CREDITS",
                impressum: "JURIDISCHE INFORMATIE"
            },
            contact: {
                title: "Contact",
                desc: "Heb je vragen, feedback of ideeën voor nieuwe labmodules? Ik lees graag elk bericht – over wiskunde, didactiek of technische samenwerking.",
                close: "SLUITEN"
            },
            qr: {
                title: "QR-code",
                desc: "Scan met je telefoon – neem deze pagina mee."
            },
            donate: {
                title: "Trakteer op een cyberkoffie",
                desc: "Bevallen de interactieve labo’s je en wil je het Cyber-Lab verder helpen? Elke virtuele koffie houdt me wakker bij het programmeren ’s nachts! ☕️🚀",
                paypal: "NU DONEREN MET PayPal"
            },
            header: {
                title: "Doc Alvers Mathe-Labor",
                subtitle: "HET INTERACTIEVE WISKUNDE-UNIVERSUM",
                author: "door Dr. Michael R. Alvers"
            },
            view: {
                back_title: "Terug",
                title: "LABWEERGAVE"
            },
            admin: {
                active: "REDACTIEMODUS ACTIEF",
                export: "Wijzigingen exporteren",
                exit: "Afsluiten"
            },
            labs: {
                "fourier": { title: "Fouriertransformatie", description: "De muziek van de wiskunde. Ontbind complexe vormen in harmonische cirkelbewegingen." },
                "mandelbrot-deep": { title: "Fractalen", description: "Mandelbrot- en Juliaverzamelingen in het complexe vlak: escape-time-dynamica van z↦z²+c via GPU fragment-shaderiteratie; parametrische verkenning van c met adaptieve iteratiediepte langs de fractale rand." },
                "atomorbitale": { title: "Atoomorbitalen", description: "Bolfuncties Y_ℓ^m in 3D: waarschijnlijkheidswolken en kwantumgetallen." },
                "galtonboard": { title: "Galtonbord", description: "Interactieve simulatie van de normale verdeling. Zie de klokcurve live ontstaan." },
                "opti-lens": { title: "Lensoptimalisatie", description: "Evolutionaire lensoptimalisatie (CMA-ES): realtime stralen en zoeken naar focus." },
                "addition": { title: "Cijferen: optellen", description: "Leer cijferoptelling stap voor stap. Visualiseert de kolomstructuur." },
                "subtraktion": { title: "Cijferen: aftrekken", description: "Oefen schriftelijk aftrekken met lenen, stap voor stap." },
                "multiplikation": { title: "Cijferen: vermenigvuldigen", description: "Visualiseert cijfervermenigvuldiging stap voor stap." },
                "dividieren": { title: "Cijferen: delen", description: "Beheers cijferdeling met het interactieve ULTRA-lab." },
                "cmaes": { title: "Oppervlakte-optimalisatie", description: "CMA-ES in realtime: evolutionair verbeteren van gesloten veelhoeken en vrije contouren." },
                "transformationen": { title: "Congruentie", description: "Verken draaiing, verschuiving en schaling van een driehoek interactief." },
                "winkelsumme3d": { title: "3D-hoekensom", description: "Ervaar de hoekensom in de 3D-ruimte. Dynamische visualisatie." },
                "ausgleichsgerade": { title: "Beste rechte", description: "Vind de beste rechte door een puntenwolk. Begrijp lineaire regressie." },
                "binomischeslabor": { title: "Eerste binomiumformule", description: "Visualiseer binomiumformules geometrisch via oppervlakte-opdeling." },
                "triangulierer": { title: "Delaunay", description: "Triangulatie-algoritmen. Genereer optimale driehoeksroosters." },
                "differentiallabor": { title: "Differentiaallab", description: "Beheers differentiaalrekening. Verband tussen functie en afgeleide." },
                "parabellabor": { title: "Parabolen", description: "Manipuleer kwadratische functies. Begrijp de invloed van parameters." },
                "potenzlabor": { title: "Machtsfuncties-lab", description: "Verken machts- en wortelfuncties interactief." },
                "steigung": { title: "Hellingslab", description: "Begrijp de helling in elk punt van een kromme. Basis van analyse." },
                "winkellabor": { title: "Hoekenlab", description: "Interactief onderzoek naar hoekensommen en driehoekstypes." },
                "uhrzeitwinkel": { title: "Klokhoeken-lab", description: "Onderzoek de hoek tussen de wijzers op elk moment van de dag." },
                "logikspiel": { title: "Getallenpuzzel", description: "Word meester van de matrix! Los complexe getallenroosters op." },
                "integralreaktor": { title: "Integralen", description: "De energie van het oppervlak. Visualiseer Riemannsommen en benaderingen." },
                "lissajous": { title: "Lissajous", description: "Superpositie van twee harmonische trillingen: frequentie en fase." },
                "cool-squares": { title: "Cool Squares", description: "Het ultieme meetkundige bewijs. Volg de spiraal van vierkanten." },
                "fibonacci": { title: "Fibonacci-lab", description: "Verken de gulden spiraal en organische groeipatronen." },
                "fermatpunkt": { title: "Fermatpunt", description: "Vind het punt met de kleinste afstandssom naar de hoekpunten." },
                "gleichungssysteme": { title: "Stelsels-lab", description: "Verken lineaire vergelijkingssystemen visueel via rechten." },
                "pythagoras": { title: "Pythagoras", description: "Ontdek de stelling van Pythagoras via interactieve oppervlaktevergelijkingen." },
                "pythagorasbeweis": { title: "Bewijs Pythagoras", description: "Meetkundig bewijs van de stelling van Pythagoras via oppervlakteverdeling." },
                "gleichschenkligesDreieck": { title: "Gelijkbenige driehoek", description: "Bereken bijzondere driehoeken en hun eigenschappen interactief." },
                "eulergerade": { title: "Euler, Feuerbach en Napoleon", description: "Fascinerende driehoeksmeetkunde: Eulerlijn en Feuerbach-cirkel." },
                "easyhard": { title: "Meetkundepuzzel", description: "Een pittig meetkundig raadsel. Bepaal de ontbrekende hoek." },
                "winkelsumme": { title: "Veelhoeken-lab", description: "Bereken de hoekensom in elke n-hoek." },
                "beweisinwinkellsumme": { title: "Bewijs binnenhoeken", description: "Waarom is de hoekensom in een driehoek altijd 180°? Het bewijs stap voor stap." },
                "butterfly": { title: "Vlinderkromme", description: "Een intrigerende transcendente kromme in poolcoördinaten." },
                "heart3d": { title: "3D-hartoppervlak", description: "Visualisatie van een impliciet 3D-oppervlak achter het wiskundige hart." },
                "litchi3d": { title: "3D-lychee-lab", description: "Verken complexe 3D-oppervlaktemeetkunde interactief." },
                "cinematic-intro": { title: "Filmische intro", description: "Het monumentale begin van het lab van Doc Alvers. ULTRA v5.3.8 visuele identiteit." },
                "stanford-portal": { title: "Stanford University", description: "Eliteonderzoeksuniversiteit in Silicon Valley: topresearch, open ideeën en campuscultuur." },
                "happy-birthday-ulf": { title: "Gefeliciteerd Ulf!", description: "Een wiskundige verrassing voor je verjaardag. Vier mee met Doc Alvers!" }
            ,
                "einsundeins": { title: "1 + 1 = 2", description: "Eén berekening, vier lagen dieper: hogere programmeertaal, assembler, machinebytes en een volledige opteller van logische poorten. Op elke laag dezelfde informatie, alleen één abstractie dieper." },
                "solita": { title: "Solita", description: "Solita — je persoonlijke spraakassistent (Claude) in het Doc Alvers Wiskundelab. Praten, laten voorlezen, context onthouden." },
                "gameoflife": { title: "Game of Life", description: "Conways cellulaire automaat: uit drie eenvoudige regels ontstaan zweefvliegers, oscillatoren en hele werelden. Teken een beginpatroon en zie orde en chaos elkaar afwisselen." },
                "burningship": { title: "Burning Ship", description: "De donkere zusterfractal van de Mandelbrotverzameling: één absolute waarde in de iteratieformule laat brandende schepen aan de horizon verschijnen. Zoom in op de vlammende structuur." },
                "reaction-diffusion": { title: "Reactie-Diffusie", description: "Turingpatronen live: twee stoffen reageren en diffunderen, en eruit komen strepen, stippen en koralen zoals op dierenvachten. Stel toevoer en verval in en kweek je eigen patronen." },
                "gravitation": { title: "Gravitatie", description: "De gravitatiewet van Newton om aan te raken: zet massa's in de ruimte, geef ze een beginsnelheid en bekijk banen, invangingen en botsingen in de meerlichamendans." },
                "glocken": { title: "De klokken van Bagdad", description: "Wanneer slaan alle klokken tegelijk? Een verhaal uit Bagdad leidt naar het kleinste gemene veelvoud, met een tutor die stap voor stap naar het kgv en breuken begeleidt." },
                "langley": { title: "Langley-lab", description: "Langleys beruchte hoekraadsel uit 1922: een gelijkbenige driehoek, twee binnenlijnen en één hoek die de wereld al honderd jaar dwarszit. Meet, probeer, bewijs." },
                "batman": { title: "Batman-kromme", description: "Eén vergelijking waarvan de grafiek het Batman-logo tekent: absolute waarden, wortels en gevalsonderscheidingen als superheldenwiskunde. Ontleed de formule stuk voor stuk." },
                "worldclock": { title: "Wereldklok", description: "De aarde als klok: tijdzones, zonnestand en de dag-nachtgrens live op de wereldkaart. Zie waar de zon opkomt terwijl het hier middernacht is." },
                "tracker": { title: "Doc Alvers Tracker", description: "Gps-tracking als webapp: routes vastleggen met hoogteprofiel, foto-, spraak- en kenniswaypoints, regenradar en live delen. Werkt in de browser en als Android-app." },
                "kaimbo": { title: "Kaimbo Studio", description: "Talen leren met je eigen takenlijsten: woorden en zinnen als takenreeksen organiseren, filteren en trainen. De studio bij Docs taalleergereedschap, nu in de browser." },
                "pagode": { title: "Pagode (230 SL)", description: "Een Mercedes 230 SL uit 1964 ontmoet bluetooth: de motor via radio starten, kanalen testen, een interactief schakelschema verkennen, en Solita leert rijden. Oldtimerelektriciteit met AI-afstandsbesturing." },
                "voicerecorder": { title: "Voice Recorder", description: "Opnemen en live transcriberen: spreek, hij luistert, schrijft mee en bewaart. In de browser via de Web Speech API, als Android-app met native spraakherkenning." },
                "mathtrainer": { title: "MathTrainer", description: "Wiskunde trainen met opgavenreeksen: hoofdrekenen en schoolopgaven oefenen, een reeks kiezen, het tempo opvoeren. School is cool: de SchoolTrainer als webapp." },
                "pinkerfinder": { title: "PinkerFinder", description: "De macOS Finder 1:1 nagebouwd — plus zoekfacetten: mapgroottes in de lijst, duplicaten op inhoud, facetzoeken over de hele Mac, live bijwerken. Native Mac-app, gratis download." },
                "imaginarynumbers": { title: "Imaginaire getallen", description: "Complexe getallen in het complexe vlak van Gauss: reëel deel, imaginair deel en de imaginaire eenheid, interactief te verkennen." },
                "kovarianz": { title: "Covariantie", description: "Een lineaire afbeelding A rekt, draait en scheert het vlak. Toegepast op een ronde puntenwolk wordt die een ellips — en precies die vorm staat in de covariantiematrix: uit Σ₀ = σ²E volgt Σ = A Σ₀ Aᵀ. Stel de matrix cel voor cel in of sleep de beeldellips direct aan de greep; Σ, de correlatie en de eigenvectoren als hoofdassen worden live uit de getekende punten berekend. Met normale en uniforme verdeling, homogene coördinaten en evenwijdige lijnen die laten zien wat de afbeelding met rechte lijnen doet." },
                "irisvis": { title: "Conway's Iris", description: "Verleng in elk hoekpunt beide zijden met de lengte van de overstaande zijde — de zes eindpunten liggen op een cirkel om het middelpunt van de ingeschreven cirkel, R = √(r²+(s+d)²). Zes ruitenwisserbogen vormen daaruit een kromme van constante breedte; een vierkant omsluit haar in elke draaistand en CMA-ES zoekt live naar zijn ligging. Met bewijsweergaven, een heatmap van het zoeklandschap en de Reuleaux-driehoek op één knop." },
                "ascii": { title: "ASCII-kunst", description: "Beelden zijn getallen: raster een foto, het live camerabeeld of een voorbeeld in cellen, bereken de grijswaarde, kies het teken — als tekens, in kleur, als halftoon of braille, met dithering. Klik op een teken en de volledige berekening van precies die cel verschijnt; in niveau 2 schrijven leerlingen de afbeelding grijswaarde → teken zelf." },
                "neuroaddierer": { title: "De geleerde opteller", description: "In het lab 1 + 1 = 2 zijn de volle optellers vast bedraad — hier is niets bedraad. Een piepklein neuraal netwerk van 32 getallen krijgt alleen de acht rijen van de waarheidstabel te zien en moet het optellen zelf vinden: door evolutie (CMA-ES), volledig zonder afgeleide. Daarna rekenen acht kopieën van het geleerde netwerk in serie elke som tot 255 — en je ziet dat de uitgangen nooit precies 0 of 1 zijn, maar 0,03 en 0,97." },
                "conuslab": { title: "Conus", description: "Waarom draagt een kegelslak zigzags en tenten? De schelp groeit alleen aan de mondrand — één enkele rij cellen beslist ‘pigment ja/nee’, en elke groeilijn blijft voor altijd staan. Het patroon is dus een ruimte-tijddiagram. Hier loopt het live: reizende pigmentgolven die bij botsing uitdoven en daarbij de tenten uitsnijden — daarnaast hetzelfde effect als cellulaire automaat (regel 30)." },
                "costablanca": { title: "Hoogtepunten Costa Blanca", description: "Uitstapjes aan de Costa Blanca om af te vinken: 22 uitgezochte bestemmingen van Altea tot Valencia met foto’s, insidertips en voortgangsbalk — in vier talen (DE/EN/ES/IT)." },
                "bb84": { title: "BB84", description: "Quantum-sleuteluitwisseling volgens Bennett en Brassard: Alice stuurt losse fotonen, elk in een van twee bases — + met de toestanden — en |, of × met / en \\. Bob kiest zijn basis willekeurig: dezelfde basis betekent een zeker resultaat, een andere basis betekent puur toeval. Ga je over een kolom, dan wordt precies dat foton uitgelegd. Met afluisteraarster Eve stijgt het foutpercentage in het publiek vergeleken deel tot een kwart — de ontdekkingskans is 1 − (3/4)^m, en duizend runs op één knop laten zien dat het echt zo is. Plus een lesmodus die alle gevallen één keer doorloopt." },
                "koerper": { title: "Lichamen", description: "Platonische, Archimedische en Catalaanse lichamen, prisma’s, antiprisma’s, piramides en ronde vormen — draaibaar in 3D, met oppervlakte, volume, straal van omgeschreven, ribben- en ingeschreven bol, tweevlakshoeken en formules live bij de ribbelengte. Elk lichaam is met een schuif tot zijn uitslag open te vouwen; Catalaanse lichamen ontstaan als duale van de Archimedische door polariteit aan de ribbenbol." }
            }
    };
})();
