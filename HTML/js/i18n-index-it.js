/**
 * i18n extension for Index/Dashboard page — Italiano (it).
 * Loaded by js/i18n-index.js (loader) for the ACTIVE language only —
 * never referenced directly from HTML. One file per language.
 */
(function () {
    if (typeof CyberI18n === 'undefined') {
        console.error("CyberI18n not found! Load i18n.js before i18n-index-it.js");
        return;
    }
    const t = (CyberI18n.translations.it = CyberI18n.translations.it || {});
    t.index = {
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
                tools_filter_hits: "RISULTATI",
                tools_no_results: "Nessun risultato per «{query}»",
                tools_close_aria: "Chiudi la panoramica strumenti e torna alla scelta del laboratorio",
                tools_footer_aria: "Piè di pagina",
                tools_universe_aria: "Apri Universe · galleria laboratori nello spazio",
                tools_doc_title: "Cyber-Lab | Mission Control",
                education: "EDUCAZIONE",
                games: "Giochi",
                lgs: "Sistemi di Equazioni",
                pythagoras: "Pitagora",
                triangles: "Triangoli",
                arithmetic: "Aritmetica di Base",
                hot_stuff: "In evidenza",
                neu: "Novità",
                apps: "App",
                fun: "Divertimento",
                functions: "Funzioni",
                highlights: "Punti salienti",
                fraktale: "Frattali",
                university: "Università",
                themes_count: "Temi",
                themes_top5_title: "Top Labs",
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
                subtitle: "L’UNIVERSO INTERATTIVO DELLA MATEMATICA",
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
            ,
                "einsundeins": { title: "1 + 1 = 2", description: "Un solo calcolo, quattro livelli più in basso: linguaggio evoluto, assembler, byte macchina e un sommatore completo fatto di porte logiche. La stessa informazione a ogni livello, solo un'astrazione più in profondità." },
                "solita": { title: "Solita", description: "Solita — la tua assistente vocale personale (Claude) nel Laboratorio di matematica di Doc Alvers. Parlare, farsi leggere i testi, mantenere il contesto." },
                "gameoflife": { title: "Game of Life", description: "L'automa cellulare di Conway: da tre regole semplici nascono alianti, oscillatori e mondi interi. Disegna uno schema iniziale e guarda ordine e caos alternarsi." },
                "burningship": { title: "Burning Ship", description: "Il frattale sorella oscura dell'insieme di Mandelbrot: un solo valore assoluto nella formula di iterazione fa comparire navi in fiamme all'orizzonte. Ingrandisci la struttura fiammeggiante." },
                "reaction-diffusion": { title: "Reazione-Diffusione", description: "Schemi di Turing in diretta: due sostanze reagiscono e diffondono, e ne escono strisce, punti e coralli come sui manti degli animali. Regola apporto e decadimento e coltiva i tuoi schemi." },
                "gravitation": { title: "Gravitazione", description: "La legge di gravitazione di Newton da toccare: metti masse nello spazio, dai loro una velocità iniziale e osserva orbite, catture e collisioni nella danza a molti corpi." },
                "glocken": { title: "Le campane di Baghdad", description: "Quando suonano tutte le campane insieme? Una storia da Baghdad porta al minimo comune multiplo, con un tutor che accompagna passo per passo fino al m.c.m. e alle frazioni." },
                "langley": { title: "Laboratorio Langley", description: "Il famigerato problema dell'angolo di Langley del 1922: un triangolo isoscele, due linee interne e un angolo che infastidisce il mondo da cento anni. Misura, prova, dimostra." },
                "batman": { title: "Curva di Batman", description: "Una sola equazione il cui grafico disegna il logo di Batman: valori assoluti, radici e distinzioni di casi come matematica da supereroi. Smonta la formula pezzo per pezzo." },
                "worldclock": { title: "Orologio mondiale", description: "La Terra come orologio: fusi orari, posizione del Sole e linea giorno-notte in diretta sulla mappa del mondo. Guarda dove sorge il sole mentre qui è mezzanotte." },
                "tracker": { title: "Doc Alvers Tracker", description: "Tracciamento GPS come applicazione web: registra percorsi con profilo altimetrico, punti foto, voce e conoscenza, radar della pioggia e condivisione dal vivo. Funziona nel browser e come app Android." },
                "kaimbo": { title: "Kaimbo Studio", description: "Imparare le lingue con i propri elenchi di compiti: organizzare, filtrare ed esercitare vocaboli e frasi come serie di compiti. Lo studio dello strumento linguistico di Doc, ora nel browser." },
                "pagode": { title: "Pagoda (230 SL)", description: "Una Mercedes 230 SL del 1964 incontra il Bluetooth: avviare il motore via radio, provare i canali, esplorare uno schema elettrico interattivo, e Solita impara a guidare. Elettrica d'epoca con telecomando a IA." },
                "voicerecorder": { title: "Registratore vocale", description: "Registrare e trascrivere in diretta: parla e lui ascolta, scrive e salva. Nel browser con la Web Speech API, come app Android con riconoscimento vocale nativo." },
                "mathtrainer": { title: "MathTrainer", description: "Allenarsi in matematica con serie di esercizi: calcolo mentale ed esercizi scolastici, scegli una serie, aumenta il ritmo. School is cool: lo SchoolTrainer come applicazione web." },
                "pinkerfinder": { title: "PinkerFinder", description: "Il Finder di macOS ricostruito 1:1 — più faccette di ricerca: dimensioni delle cartelle in lista, duplicati per contenuto, ricerca a faccette su tutto il Mac, aggiornamento live. App nativa per Mac, download gratuito." },
                "imaginarynumbers": { title: "Numeri immaginari", description: "I numeri complessi nel piano di Gauss: parte reale, parte immaginaria e unità immaginaria, da esplorare in modo interattivo." },
                "kovarianz": { title: "Covarianza", description: "Un’applicazione lineare A stira, ruota e taglia il piano. Applicata a una nuvola di punti rotonda diventa un’ellisse — e proprio la sua forma sta nella matrice di covarianza: da Σ₀ = σ²E si ottiene Σ = A Σ₀ Aᵀ. Imposta la matrice cella per cella oppure trascina l’ellisse immagine dalla sua maniglia; Σ, la correlazione e gli autovettori come assi principali vengono calcolati dal vivo dai punti disegnati. Con distribuzione normale e uniforme, coordinate omogenee e parallele che mostrano che cosa fa l’applicazione alle rette." },
                "irisvis": { title: "Conway's Iris", description: "Prolunga in ogni vertice entrambi i lati della lunghezza del lato opposto: i sei estremi giacciono su una circonferenza centrata nell’incentro, R = √(r²+(s+d)²). Sei archi a tergicristallo ne formano una curva di larghezza costante; un quadrato la racchiude in ogni rotazione e CMA-ES ne cerca la posizione dal vivo. Con viste di dimostrazione, mappa di calore del paesaggio di ricerca e il triangolo di Reuleaux con un clic." },
                "ascii": { title: "Arte ASCII", description: "Le immagini sono numeri: suddividi in celle una foto, l’immagine dal vivo della fotocamera o un esempio, calcola il valore di grigio, scegli il carattere — come caratteri, a colori, in mezzatinta o in braille, con dithering. Un clic su un carattere mostra l’intero calcolo di quella cella; al livello 2 gli studenti scrivono da sé la corrispondenza valore di grigio → carattere." },
                "neuroaddierer": { title: "Il sommatore appreso", description: "Nel lab 1 + 1 = 2 i sommatori completi sono cablati — qui non c’è alcun cablaggio. Una minuscola rete neurale di 32 numeri vede solo le otto righe della tabella di verità e deve scoprire da sé come si somma: per evoluzione (CMA-ES), del tutto senza derivate. Poi otto copie della rete appresa calcolano in serie ogni somma fino a 255 — e si vede che le sue uscite non valgono mai esattamente 0 o 1, ma 0,03 e 0,97." },
                "conuslab": { title: "Conus", description: "Perché una conchiglia del genere Conus porta zigzag e tende? La conchiglia cresce solo sul bordo dell’apertura: una sola fila di cellule decide «pigmento sì/no» e ogni linea di crescita resta per sempre. Il motivo è dunque un diagramma spazio-tempo. Qui scorre dal vivo: onde di pigmento che viaggiano, si annullano allo scontro e così ritagliano le tende — accanto, lo stesso effetto come automa cellulare (regola 30)." },
                "costablanca": { title: "Il meglio della Costa Blanca", description: "Gite sulla Costa Blanca da spuntare: 22 mete documentate da Altea a Valencia con foto, consigli di chi ci vive e barra di avanzamento — in quattro lingue (DE/EN/ES/IT)." },
                "bb84": { title: "BB84", description: "Scambio quantistico di chiavi secondo Bennett e Brassard: Alice invia singoli fotoni, ciascuno in una di due basi — + con gli stati — e |, oppure × con / e \\. Bob sceglie la sua base a caso: stessa base significa risultato sicuro, base diversa significa puro caso. Passando sopra una colonna si spiega proprio quel fotone. Con la spia Eve il tasso di errore nella parte confrontata pubblicamente sale a un quarto — la probabilità di scoperta è 1 − (3/4)^m, e mille prove con un clic mostrano che è davvero così. In più una modalità didattica che percorre una volta tutti i casi." }
            }
    };
})();
