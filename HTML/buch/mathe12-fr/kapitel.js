/* kapitel.js — the chapters of the French edition of "Mathematik · Berufliches Gymnasium 12" (buch/mathe12/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe12.html: LB 1 → LB 2 → LB 5).
 * Doc, 22.10.2026: "Schnapp dir fünf Agenten und mach die Übersetzung der Bücher in Französisch. Fang mit BGY an." (package
 * fr-2, this file, the start page and the chapters). Terms as in tools/buch-fr/glossaire.md. Single source for the table of
 * contents (index.html) and the previous/next cards at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Mathématiques · Berufliches Gymnasium 12',
    short: 'Mathématiques 12',
    lang: 'fr',
    description: 'Manuel interactif de mathématiques pour le Berufliches Gymnasium (lycée allemand à orientation professionnelle), 12e année, Saxe : variables aléatoires discrètes et loi binomiale, calcul différentiel des limites aux problèmes d’optimisation, et vecteurs de l’espace, avec des laboratoires, des simulations, des graphiques 3D et des autoévaluations à correction immédiate.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Domaine d’apprentissage 1', k: '1.1', title: 'Probabilités conditionnelles',
          sub: 'Arbres pondérés, tableaux croisés, indépendance', when: 'Août · septembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Domaine d’apprentissage 1', k: '1.2', title: 'Variables aléatoires',
          sub: 'Loi de probabilité, espérance, variance, jeux équitables', when: 'Septembre', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Domaine d’apprentissage 1', k: '1.3', title: 'La loi binomiale',
          sub: 'Schémas de Bernoulli, coefficient binomial, probabilités cumulées', when: 'Octobre · novembre', ustd: 20 },
        { file: 'lb2-1.html', lb: 'Domaine d’apprentissage 2', k: '2.1', title: 'Limites',
          sub: 'Comportement à l’infini, asymptotes, continuité', when: 'Novembre · décembre', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Domaine d’apprentissage 2', k: '2.2', title: 'La dérivée',
          sub: 'Taux de variation, de la sécante à la tangente, dériver graphiquement', when: 'Décembre', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Domaine d’apprentissage 2', k: '2.3', title: 'Règles de dérivation',
          sub: 'Puissance, somme et facteur constant, eˣ et sin x, produits simples', when: 'Janvier', ustd: 12 },
        { file: 'lb2-4.html', lb: 'Domaine d’apprentissage 2', k: '2.4', title: 'Variations, extremums, points d’inflexion',
          sub: 'Ce que f′ et f″ révèlent sur la courbe', when: 'Janvier · mars', ustd: 12 },
        { file: 'lb2-5.html', lb: 'Domaine d’apprentissage 2', k: '2.5', title: 'Étudier des courbes',
          sub: 'Symétrie, asymptotes, tangentes et normales, fonctions en contexte', when: 'Mars', ustd: 12 },
        { file: 'lb2-6.html', lb: 'Domaine d’apprentissage 2', k: '2.6', title: 'Déterminer des fonctions et optimiser',
          sub: 'Des fonctions à partir de conditions, trouver le meilleur', when: 'Avril · mai', ustd: 20 },
        { file: 'lb5-1.html', lb: 'Domaine d’apprentissage 5', k: '5.1', title: 'Vecteurs de l’espace',
          sub: 'Points et vecteurs, calculer avec des vecteurs, norme, milieu', when: 'Mai · juin', ustd: 12 },
        { file: 'lb5-2.html', lb: 'Domaine d’apprentissage 5', k: '5.2', title: 'Produit scalaire et angles',
          sub: 'Orthogonalité, angle entre vecteurs, démonstrations sur les quadrilatères', when: 'Juin · juillet', ustd: 8 }
    ]
};
