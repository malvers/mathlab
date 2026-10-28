/* kapitel.js — the chapters of the French edition of "Mathematik · Berufliches Gymnasium 13 · Leistungskurs" (buch/mathe13lk/), in the
 * order of the school year (Lehrplan Berufliches Gymnasium Mathematik, Sachsen, 2026, Leistungskurs Jahrgangsstufe 13: LB 3 → LB 4 → LB 5 →
 * Wahlpflicht 1 or Wahlpflicht 2 (the school chooses one, the book has both) → LB 7 → Abiturvorbereitung).
 * Doc, 28.10.2026: "Die Übersetzung, die fangen wir heute an. Und ziehen es durch." (Schwartz, block fr-23). Terms as in tools/buch-fr/glossaire.md.
 * Wahlpflicht 1 / 2 is "Domaine au choix 1 / 2", the chapter numbers W1.1 … W2.3 become OP1.1 … OP2.3 (as OP.1 in mathe13-fr).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Mathématiques · Berufliches Gymnasium 13 · Leistungskurs',
    short: 'Mathématiques 13 LK',
    lang: 'fr',
    description: 'Manuel interactif de mathématiques pour le Berufliches Gymnasium (lycée allemand à orientation professionnelle), 13e année, Leistungskurs (cours approfondi), Saxe : calcul intégral avec le théorème fondamental et les solides de révolution, variables aléatoires de loi normale, statistique inférentielle, les deux domaines au choix – droites et plans dans l’espace ou matrices avec le modèle de Leontief et des modèles de population –, d’autres applications et un chapitre de préparation à l’Abitur, avec des laboratoires, des simulations, des graphiques 3D et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb3-1.html', lb: 'Domaine d’apprentissage 3', k: '3.1', title: 'Primitives',
          sub: 'Dériver à l’envers, vérification, règles de calcul des primitives, 1/x et ln|x|, CAS', when: 'Août · septembre', ustd: 10 },
        { file: 'lb3-2.html', lb: 'Domaine d’apprentissage 3', k: '3.2', title: 'L’intégrale et le théorème fondamental',
          sub: 'Quantité reconstituée, propriétés, fonction intégrale, théorème fondamental avec démonstration', when: 'Septembre', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Domaine d’apprentissage 3', k: '3.3', title: 'Calculs d’aires',
          sub: 'Entre la courbe et l’axe des abscisses, entre deux courbes, aires avec paramètre', when: 'Octobre', ustd: 8 },
        { file: 'lb3-4.html', lb: 'Domaine d’apprentissage 3', k: '3.4', title: 'Intégration numérique et solides de révolution',
          sub: 'Méthodes des rectangles et des trapèzes, volume par rotation autour de l’axe des abscisses', when: 'Octobre · novembre', ustd: 10 },
        { file: 'lb4.html', lb: 'Domaine d’apprentissage 4', k: '4', title: 'Variables aléatoires de loi normale',
          sub: 'Courbe en cloche, densité et fonction de répartition, espérance, écart type, règles des σ', when: 'Novembre', ustd: 12 },
        { file: 'lb5-1.html', lb: 'Domaine d’apprentissage 5', k: '5.1', title: 'Population et échantillon',
          sub: 'Estimer et tester, moyenne et variance de l’échantillon', when: 'Décembre', ustd: 5 },
        { file: 'lb5-2.html', lb: 'Domaine d’apprentissage 5', k: '5.2', title: 'Tests d’hypothèse',
          sub: 'Tests unilatéraux et bilatéraux, zone de rejet, erreurs de première et de deuxième espèce, signification statistique', when: 'Décembre · janvier', ustd: 10 },
        { file: 'wp1-1.html', lb: 'Domaine au choix 1', k: 'OP1.1', title: 'Droites et plans',
          sub: 'Représentations paramétriques, produit vectoriel, équation cartésienne, forme normale de Hesse', when: 'Janvier', ustd: 9 },
        { file: 'wp1-2.html', lb: 'Domaine au choix 1', k: 'OP1.2', title: 'Positions relatives et angles d’intersection',
          sub: 'Point, droite, plan : intersections, points de percée, traces, angles d’intersection', when: 'Janvier · février', ustd: 9 },
        { file: 'wp1-3.html', lb: 'Domaine au choix 1', k: 'OP1.3', title: 'Distances, prismes et pyramides',
          sub: 'Distance point–plan, droite–plan, plan–plan, aire totale et volume', when: 'Février', ustd: 7 },
        { file: 'wp2-1.html', lb: 'Domaine au choix 2', k: 'OP2.1', title: 'Multiplier et inverser des matrices',
          sub: 'Produit de matrices, matrice identité, matrice inverse, systèmes résolus avec l’inverse', when: 'Janvier', ustd: 8 },
        { file: 'wp2-2.html', lb: 'Domaine au choix 2', k: 'OP2.2', title: 'Production en plusieurs étapes et modèle de Leontief',
          sub: 'Graphes de Gozinto, production en plusieurs étapes, calcul des coûts, analyse entrées-sorties', when: 'Janvier · février', ustd: 9 },
        { file: 'wp2-3.html', lb: 'Domaine au choix 2', k: 'OP2.3', title: 'Modèles de population',
          sub: 'Matrices de transition, puissances de matrices, matrice limite et vecteur fixe, évolution cyclique', when: 'Février', ustd: 8 },
        { file: 'lb7-1.html', lb: 'Domaine d’apprentissage 7', k: '7.1', title: 'Équations bicarrées et familles de fonctions',
          sub: 'Changement de variable, familles, paramètre et nombre de solutions, lieux des points', when: 'Février · mars', ustd: 8 },
        { file: 'lb7-2.html', lb: 'Domaine d’apprentissage 7', k: '7.2', title: 'Paramètres et extremums dans l’espace et en économie',
          sub: 'Systèmes avec paramètre, matrices de rotation, plus courtes distances, coût, recette et bénéfice', when: 'Mars', ustd: 7 },
        { file: 'abi.html', lb: 'Abitur', k: 'A', title: 'Prêt pour l’Abitur',
          sub: 'Listes de contrôle, pièges classiques et exercices au format de l’Abitur du Leistungskurs, sur la 11e, la 12e et la 13e année', when: 'Mars · avril', ustd: 0 }
    ]
};
