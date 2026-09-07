/**
 * i18n extension for Index/Dashboard page — Français (fr).
 * Loaded by js/i18n-index.js (loader) for the ACTIVE language only —
 * never referenced directly from HTML. One file per language.
 */
(function () {
    if (typeof CyberI18n === 'undefined') {
        console.error("CyberI18n not found! Load i18n.js before i18n-index-fr.js");
        return;
    }
    const t = (CyberI18n.translations.fr = CyberI18n.translations.fr || {});
    t.index = {
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
                tools_filter_hits: "RÉSULTATS",
                tools_no_results: "Aucun résultat pour « {query} »",
                search_no_terms: "aucun résultat",
                tools_close_aria: "Fermer la vue des outils et revenir au choix des laboratoires",
                tools_footer_aria: "Pied de page",
                tools_universe_aria: "Ouvrir Universe · galerie de laboratoires dans l’espace",
                tools_doc_title: "Cyber-Labo | Mission Control",
                education: "ÉDUCATION",
                games: "Jeux",
                lgs: "Systèmes d'Équations",
                pythagoras: "Pythagore",
                triangles: "Triangles",
                arithmetic: "Arithmétique de Base",
                hot_stuff: "À la mode",
                neu: "Nouveau",
                apps: "Applis",
                fun: "Amusant",
                functions: "Fonctions",
                highlights: "Faits saillants",
                fraktale: "Fractales",
                university: "Université",
                themes_count: "Thèmes",
                themes_top5_title: "Top Labs",
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
                subtitle: "L’UNIVERS INTERACTIF DES MATHÉMATIQUES",
                author: "GOOD VIBES par Dr. Michael R. Alvers"
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
            ,
                "einsundeins": { title: "1 + 1 = 2", description: "Un seul calcul, quatre niveaux plus bas : langage évolué, assembleur, octets machine, puis un additionneur complet fait de portes logiques. La même information à chaque niveau, une abstraction plus bas." },
                "solita": { title: "Solita", description: "Solita — ton assistante vocale personnelle (Claude) dans le Laboratoire de mathématiques de Doc Alvers. Parler, se faire lire des textes, garder le contexte." },
                "gameoflife": { title: "Game of Life", description: "L'automate cellulaire de Conway : trois règles simples font naître des planeurs, des oscillateurs et des mondes entiers. Dessine un motif de départ et regarde l'ordre et le chaos alterner." },
                "burningship": { title: "Burning Ship", description: "La fractale sœur sombre de l'ensemble de Mandelbrot : une seule valeur absolue dans la formule d'itération fait apparaître des navires en flammes à l'horizon. Zoome dans la structure ardente." },
                "reaction-diffusion": { title: "Réaction-Diffusion", description: "Les motifs de Turing en direct : deux substances réagissent et diffusent, et il en sort des rayures, des points et des coraux comme sur les pelages. Règle l'apport et la décroissance et cultive tes propres motifs." },
                "gravitation": { title: "Gravitation", description: "La loi de la gravitation de Newton à portée de main : place des masses dans l'espace, donne-leur une vitesse initiale et observe orbites, captures et collisions dans la danse à plusieurs corps." },
                "glocken": { title: "Les cloches de Bagdad", description: "Quand toutes les cloches sonnent-elles ensemble ? Une histoire de Bagdad mène au plus petit commun multiple, avec un tuteur qui accompagne pas à pas jusqu'au PPCM et aux fractions." },
                "langley": { title: "Laboratoire Langley", description: "Le fameux problème d'angle de Langley de 1922 : un triangle isocèle, deux lignes intérieures, et un angle qui agace le monde depuis cent ans. Mesure, essaie, démontre." },
                "batman": { title: "Courbe de Batman", description: "Une seule équation dont le graphe dessine le logo de Batman : valeurs absolues, racines et distinctions de cas comme mathématiques de super-héros. Démonte la formule morceau par morceau." },
                "worldclock": { title: "Horloge mondiale", description: "La Terre comme horloge : fuseaux horaires, position du Soleil et ligne jour-nuit en direct sur la carte du monde. Vois où le soleil se lève alors qu'ici il est minuit." },
                "tracker": { title: "Doc Alvers Tracker", description: "Suivi GPS en application web : enregistre des parcours avec profil d'altitude, points photo, voix et savoir, radar de pluie et partage en direct. Fonctionne dans le navigateur et comme application Android." },
                "kaimbo": { title: "Kaimbo Studio", description: "Apprendre les langues avec ses propres listes de tâches : organiser, filtrer et travailler vocabulaire et phrases en séries. Le studio de l'outil de langues de Doc, maintenant dans le navigateur." },
                "pagode": { title: "Pagode (230 SL)", description: "Une Mercedes 230 SL de 1964 rencontre le Bluetooth : démarrer le moteur par radio, tester les canaux, explorer un schéma électrique interactif, et Solita apprend à conduire. Électricité de collection avec télécommande par IA." },
                "voicerecorder": { title: "Dictaphone", description: "Enregistrer et transcrire en direct : parle, il écoute, écrit et enregistre. Dans le navigateur via la Web Speech API, en application Android avec reconnaissance vocale native." },
                "mathtrainer": { title: "MathTrainer", description: "S'entraîner en maths avec des séries d'exercices : calcul mental et exercices scolaires, choisir une série, accélérer le rythme. School is cool : le SchoolTrainer en application web." },
                "pinkerfinder": { title: "PinkerFinder", description: "Le Finder de macOS reconstruit à l'identique — plus des facettes de recherche : tailles des dossiers dans la liste, doublons par contenu, recherche à facettes sur tout le Mac, mise à jour en direct. Application Mac native, téléchargement gratuit." },
                "imaginarynumbers": { title: "Nombres imaginaires", description: "Les nombres complexes dans le plan de Gauss : partie réelle, partie imaginaire et unité imaginaire, à explorer de façon interactive." },
                "kovarianz": { title: "Covariance", description: "Une application linéaire A étire, tourne et cisaille le plan. Appliquée à un nuage de points rond, elle en fait une ellipse — et c’est précisément sa forme qu’exprime la matrice de covariance : de Σ₀ = σ²E on passe à Σ = A Σ₀ Aᵀ. Réglez la matrice cellule par cellule ou tirez directement l’ellipse image par sa poignée ; Σ, la corrélation et les vecteurs propres comme axes principaux sont calculés en direct à partir des points dessinés. Avec loi normale et loi uniforme, coordonnées homogènes et parallèles qui montrent ce que l’application fait aux droites." },
                "irisvis": { title: "Conway's Iris", description: "Prolongez à chaque sommet les deux côtés de la longueur du côté opposé : les six extrémités se trouvent sur un cercle centré au centre du cercle inscrit, R = √(r²+(s+d)²). Six arcs en essuie-glace en forment une courbe de largeur constante ; un carré l’enferme dans toutes les rotations et CMA-ES cherche sa position en direct. Avec vues de démonstration, carte de chaleur du paysage de recherche et le triangle de Reuleaux d’un simple clic." },
                "ascii": { title: "Art ASCII", description: "Les images sont des nombres : découpez en cellules une photo, l’image live de la caméra ou un exemple, calculez la valeur de gris, choisissez le caractère — en caractères, en couleur, en demi-teinte ou en braille, avec tramage. Un clic sur un caractère affiche tout le calcul de cette cellule ; au niveau 2, les élèves écrivent eux-mêmes la correspondance valeur de gris → caractère." },
                "neuroaddierer": { title: "L’additionneur appris", description: "Dans le labo 1 + 1 = 2, les additionneurs complets sont câblés en dur — ici rien n’est câblé. Un minuscule réseau de neurones de 32 nombres ne voit que les huit lignes de la table de vérité et doit trouver seul l’addition : par évolution (CMA-ES), sans aucune dérivée. Ensuite huit copies du réseau appris calculent en série toutes les sommes jusqu’à 255 — et l’on voit que ses sorties ne valent jamais exactement 0 ou 1, mais 0,03 et 0,97." },
                "shell": { title: "Shell", description: "Comment naît le motif d'un coquillage ? Six chapitres construisent le mécanisme pièce par pièce : l'image est un enregistrement — une cellule s'allume et écrit un V — deux ondes s'annihilent et coupent la pointe d'une tente — le substrat consommé explique pourquoi. En haut vit le bord de l'ouverture, en dessous grandit la coquille. Avec un bouton pas à pas." },
                "conuslab": { title: "Conus", description: "Pourquoi un cône porte-t-il des zigzags et des tentes ? La coquille ne croît qu’au bord de l’ouverture : une seule rangée de cellules décide « pigment oui/non », et chaque ligne de croissance reste inscrite pour toujours. Le motif est donc un diagramme espace-temps. Ici, il se déroule en direct : des ondes de pigment qui se déplacent, s’annihilent en se rencontrant et découpent ainsi les tentes — à côté, le même effet en automate cellulaire (règle 30)." },
                "costablanca": { title: "Les incontournables de la Costa Blanca", description: "Des excursions sur la Costa Blanca à cocher : 22 destinations documentées d’Altea à Valence, avec photos, conseils d’initiés et barre de progression — en quatre langues (DE/EN/ES/IT)." },
                "bb84": { title: "BB84", description: "Échange quantique de clés selon Bennett et Brassard : Alice envoie des photons uniques, chacun dans l’une de deux bases — + avec les états — et |, ou × avec / et \\. Bob choisit sa base au hasard : même base signifie résultat sûr, base différente signifie pur hasard. Survoler une colonne explique précisément ce photon. Avec l’espionne Eve, le taux d’erreur dans la partie comparée publiquement monte à un quart — la probabilité de détection vaut 1 − (3/4)^m, et mille tirages d’un clic montrent qu’il en est bien ainsi. Avec en plus un mode pédagogique qui parcourt tous les cas une fois." },
                "jacquard": { title: "Jacquard", description: "Un métier à tisser de 1805, en 3D — la première machine qui fabrique une image d'après un plan écrit. Une carte perforée commande chaque fil de chaîne séparément : là où il y a un trou, l'aiguille passe, le crochet reste en place et le couteau lève le fil ; là où il y a du carton, le fil reste en bas et la trame bleue le recouvre. Carte après carte, l'image sort de la machine. Le motif et la machine sont deux choses différentes : le même cercle devient plus rond avec plus de fils, et là où le dessin est plus fin que le tissu, le métier tisse un motif qui n'existe pas dans l'original." },
                "koerper": { title: "Solides", description: "Solides de Platon, d’Archimède et de Catalan, prismes, antiprismes, pyramides et formes rondes — tournables en 3D, avec aire, volume, rayons des sphères circonscrite, tangente aux arêtes et inscrite, angles dièdres et formules en direct selon la longueur d’arête. Chaque solide se déplie en son patron à l’aide d’un curseur ; les solides de Catalan naissent comme duaux des archimédiens par polarité par rapport à la sphère tangente aux arêtes." },
                "kreisteilung": { title: "Division du cercle", description: "n points sur un cercle, toutes les cordes tracées — en combien de régions le disque se découpe-t-il ? 1, 2, 4, 8, 16 … puis 31, et non 32. Le labo ne compte pas avec une formule : il parcourt le vrai graphe des arcs et des morceaux de cordes. Il montre donc aussi le cas dégénéré : l’hexagone régulier ne donne que 30 régions, car trois diagonales se croisent au centre. Déplace un point sur le cercle et le compte saute de 30 à 31." },
                "brahmagupta": { title: "Théorème de Brahmagupta", description: "Un quadrilatère inscriptible dont les diagonales sont perpendiculaires — et deux énoncés à son sujet, tous deux de Brahmagupta (VIIe siècle, Inde). Le théorème : abaissez du point d’intersection P des diagonales la perpendiculaire à un côté et prolongez-la au-delà de P, elle rencontre le côté opposé exactement en son milieu — car P forme avec les deux extrémités un triangle rectangle dont le pied de la perpendiculaire est le centre du cercle circonscrit. La formule : K = √((s−a)(s−b)(s−c)(s−d)) donne l’aire, mais seulement tant que les quatre sommets sont sur le cercle. Écartez-les et K devient trop grand — la formule de Héron pour les quadrilatères, sous une condition." }
            }
    };
})();
