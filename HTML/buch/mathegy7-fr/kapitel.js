/* kapitel.js — the chapters of the French edition of "Mathematik · Gymnasium 7" (buch/mathegy7/), in the order of the
 * school year (Stoffverteilungsplan svp/mathe/mathegy7.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlbereich 3; 4 Ustd./week).
 * Doc, 26.10.2026: "Wir machen jetzt noch 5 Bücher ins Französische vom Gymnasium" (French round 3,
 * tools/buch-fr/README.md, block fr-14). Terms as in tools/buch-fr/glossaire.md. Single source for the table of contents
 * (index.html) and the previous/next cards at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Mathématiques · Gymnasium 7',
    short: 'Mathématiques GY 7',
    lang: 'fr',
    description: 'Manuel interactif de mathématiques pour le Gymnasium (lycée allemand qui mène à l’Abitur), 7e année, Saxe : cercle et droite, cercle circonscrit et cercle inscrit, le triangle rectangle inscrit dans un demi-cercle et les angles inscrits, constructions et résolution de problèmes, nombres rationnels et calcul, équations et formules, pourcentages, prismes et pyramides en perspective cavalière, en patron et en vues, aire et volume, diagrammes et solides de Platon, avec des patrons qui se plient en 3D, des constructions à suivre pas à pas et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Domaine d’apprentissage 1', k: '1.1', title: 'Cercle et droite, cercle circonscrit et cercle inscrit',
          sub: 'Droite extérieure, tangente et sécante, médiatrices et bissectrices du triangle', when: 'Août · septembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Domaine d’apprentissage 1', k: '1.2', title: 'Théorèmes sur le cercle',
          sub: 'Théorème du demi-cercle (Thalès), angle inscrit et angle au centre, quadrilatère inscrit, théorème et démonstration', when: 'Septembre', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Domaine d’apprentissage 1', k: '1.3', title: 'Construire et résoudre des problèmes',
          sub: 'Figure d’étude et programme de construction, tangentes issues d’un point, raisonner en avant et en arrière', when: 'Septembre · octobre', ustd: 8 },
        { file: 'lb2-1.html', lb: 'Domaine d’apprentissage 2', k: '2.1', title: 'Nombres rationnels',
          sub: 'Nombres négatifs, droite graduée, valeur absolue et opposé, ensembles de nombres', when: 'Octobre · novembre', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Domaine d’apprentissage 2', k: '2.2', title: 'Calculer avec les nombres rationnels',
          sub: 'Les quatre opérations, règles des signes, propriétés des opérations, puissances et racines carrées', when: 'Novembre · décembre', ustd: 16 },
        { file: 'lb2-3.html', lb: 'Domaine d’apprentissage 2', k: '2.3', title: 'Équations et formules',
          sub: 'Résoudre des équations de tête et par transformations équivalentes, problèmes, isoler une variable dans une formule', when: 'Décembre · janvier', ustd: 16 },
        { file: 'lb2-4.html', lb: 'Domaine d’apprentissage 2', k: '2.4', title: 'Pourcentages',
          sub: 'Valeur de référence, part et taux de pourcentage, remise et TVA, augmenter de … et passer à …, diagrammes', when: 'Février · mars', ustd: 16 },
        { file: 'lb3-1.html', lb: 'Domaine d’apprentissage 3', k: '3.1', title: 'Représenter des prismes et des pyramides',
          sub: 'Patron, perspective cavalière et vues, vraie grandeur d’une longueur et d’une face', when: 'Avril', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Domaine d’apprentissage 3', k: '3.2', title: 'Aire, volume et masse',
          sub: 'Calculer des prismes et des pyramides, solides composés, le tronc de pyramide', when: 'Avril · mai', ustd: 8 },
        { file: 'lb4.html', lb: 'Domaine d’apprentissage 4', k: '4', title: 'Représenter des données',
          sub: 'Diagrammes en colonnes, en ligne brisée et circulaires, lire d’un œil critique les diagrammes des médias', when: 'Mai', ustd: 4 },
        { file: 'wb.html', lb: 'Domaine optionnel', k: 'OP', title: 'Solides de Platon',
          sub: 'Polyèdres, pourquoi il en existe exactement cinq réguliers, la relation d’Euler, Platon et Kepler', when: 'Mai · juin', ustd: 8 }
    ]
};
