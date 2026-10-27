/* kapitel.js — the chapters of the French edition of "Mathematik · Gymnasium 9" (buch/mathegy9/), in the order of the
 * school year (Stoffverteilungsplan svp/mathe/mathegy9.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich; 4 Ustd./week).
 * Doc, 26.10.2026: "Wir machen jetzt noch 5 Bücher ins Französische vom Gymnasium" (French round 3,
 * tools/buch-fr/README.md, block fr-16). Terms as in tools/buch-fr/glossaire.md, French school notation (× for the product,
 * P perimeter, A total area, points (2 ; 3)). Single source for the table of contents (index.html) and the previous/next
 * cards at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Mathématiques · Gymnasium 9',
    short: 'Mathématiques GY 9',
    lang: 'fr',
    description: 'Manuel interactif de mathématiques pour le Gymnasium (lycée allemand qui mène à l’Abitur), 9e année, Saxe : puissances et racines, fonctions puissances, fonctions et équations du second degré, problèmes d’optimisation, cercle, cylindre et boule, le théorème de Pythagore et les relations métriques, trigonométrie dans le triangle rectangle, pyramide et cône, analyse de données et nombre d’or, avec des laboratoires, des simulations et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Domaine d’apprentissage 1', k: '1.1', title: 'Puissances et racines',
          sub: 'Puissances et racines n-ièmes, règles de calcul avec des exposants rationnels, équations avec des racines', when: 'Août · septembre', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Domaine d’apprentissage 1', k: '1.2', title: 'Fonctions puissances',
          sub: 'Exposants entiers et rationnels, symétrie, zéros et pôles, asymptotes', when: 'Septembre', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Domaine d’apprentissage 1', k: '1.3', title: 'Paramètres et fonctions du second degré',
          sub: 'Étirer, translater, symétriser, forme développée et forme canonique, mise sous forme canonique', when: 'Octobre', ustd: 8 },
        { file: 'lb1-4.html', lb: 'Domaine d’apprentissage 1', k: '1.4', title: 'Équations du second degré et extremums',
          sub: 'Formule de résolution, discriminant, relations de Viète, problèmes d’optimisation avec le sommet', when: 'Novembre', ustd: 16 },
        { file: 'lb2.html', lb: 'Domaine d’apprentissage 2', k: '2', title: 'Cercle, cylindre et boule',
          sub: 'Arc et secteur circulaire, aire totale, volume et masse, Archimède', when: 'Décembre', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Domaine d’apprentissage 3', k: '3.1', title: 'Pythagore et les relations métriques',
          sub: 'Théorème et démonstration, longueurs dans le plan et dans l’espace, théorème de la hauteur et théorème d’Euclide, réciproque', when: 'Janvier · février', ustd: 16 },
        { file: 'lb3-2.html', lb: 'Domaine d’apprentissage 3', k: '3.2', title: 'Trigonométrie dans le triangle rectangle',
          sub: 'Sinus, cosinus et tangente, côtés et angles, aires, polygones réguliers et π', when: 'Février · mars', ustd: 12 },
        { file: 'lb3-3.html', lb: 'Domaine d’apprentissage 3', k: '3.3', title: 'Pyramide et cône de révolution',
          sub: 'Aire totale et volume, projet d’arpentage', when: 'Mars', ustd: 4 },
        { file: 'lb4.html', lb: 'Domaine d’apprentissage 4', k: '4', title: 'Analyser des données',
          sub: 'Mode, médiane, moyenne, dispersion, histogrammes, pièges statistiques', when: 'Avril', ustd: 12 },
        { file: 'lb5.html', lb: 'Domaine d’apprentissage 5', k: '5', title: 'Mathématiques et outils de calcul modernes',
          sub: 'Résoudre un problème concret avec un tableur et un CAS', when: 'Mai', ustd: 4 },
        { file: 'wb.html', lb: 'Domaine optionnel', k: 'OP', title: 'Le nombre d’or',
          sub: 'Calcul, construction, pentagramme, art et architecture', when: 'Mai · juin', ustd: 8 }
    ]
};
