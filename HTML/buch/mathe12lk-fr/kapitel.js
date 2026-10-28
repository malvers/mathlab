/* kapitel.js — the chapters of the French edition of "Mathematik · Berufliches Gymnasium 12 · Leistungskurs" (buch/mathe12lk/), in the
 * order of the school year (Lehrplan Berufliches Gymnasium Mathematik, Sachsen, 2026, Leistungskurs: LB 1 → LB 2 → LB 6 in
 * Jahrgangsstufe 12). Ustd. are the Zeitrichtwerte of the curriculum, split over the chapters.
 * Doc, 28.10.2026: "Die Übersetzung, die fangen wir heute an." (Dubreil, block fr-22). Terms as in tools/buch-fr/glossaire.md.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Mathématiques · Berufliches Gymnasium 12 · Leistungskurs',
    short: 'Mathématiques 12 LK',
    lang: 'fr',
    description: 'Manuel interactif de mathématiques pour le Berufliches Gymnasium (lycée allemand à orientation professionnelle), 12e année, Leistungskurs (cours approfondi), Saxe : variables aléatoires discrètes avec fonction de répartition et loi binomiale, calcul différentiel des limites et de la continuité aux règles du produit et de la chaîne, jusqu’à la régression et aux problèmes d’optimisation, géométrie vectorielle dans l’espace, avec des démonstrations, des laboratoires, des graphiques 3D et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Domaine d’apprentissage 1', k: '1.1', title: 'Probabilités conditionnelles',
          sub: 'Arbres pondérés, tableaux croisés, formule de Bayes, indépendance', when: 'Août · septembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Domaine d’apprentissage 1', k: '1.2', title: 'Variables aléatoires',
          sub: 'Loi de probabilité et fonction de répartition, espérance, variance', when: 'Septembre · octobre', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Domaine d’apprentissage 1', k: '1.3', title: 'La loi binomiale',
          sub: 'Schémas de Bernoulli, symbole somme, n et p cherchés, indicateurs', when: 'Octobre · novembre', ustd: 20 },
        { file: 'lb2-1.html', lb: 'Domaine d’apprentissage 2', k: '2.1', title: 'Limites et continuité',
          sub: 'Comportement à l’infini, limite en un point, points de discontinuité', when: 'Novembre · décembre', ustd: 10 },
        { file: 'lb2-2.html', lb: 'Domaine d’apprentissage 2', k: '2.2', title: 'La dérivée',
          sub: 'Taux de variation, nombre dérivé, approximation affine', when: 'Décembre · janvier', ustd: 12 },
        { file: 'lb2-3.html', lb: 'Domaine d’apprentissage 2', k: '2.3', title: 'Règles de dérivation',
          sub: 'Règles de la puissance, du facteur constant et de la somme, eˣ, ln x, sin x, cos x', when: 'Janvier', ustd: 12 },
        { file: 'lb2-4.html', lb: 'Domaine d’apprentissage 2', k: '2.4', title: 'Règle du produit et règle de la chaîne',
          sub: 'Dériver des produits et des composées, racines et fonctions exponentielles', when: 'Février', ustd: 12 },
        { file: 'lb2-5.html', lb: 'Domaine d’apprentissage 2', k: '2.5', title: 'Variations, extremums, points d’inflexion',
          sub: 'Conditions nécessaires et suffisantes, extremums globaux', when: 'Février · mars', ustd: 14 },
        { file: 'lb2-6.html', lb: 'Domaine d’apprentissage 2', k: '2.6', title: 'Étudier des courbes',
          sub: 'Symétrie, asymptotes, tangentes et normales, problèmes en contexte', when: 'Mars · avril', ustd: 14 },
        { file: 'lb2-7.html', lb: 'Domaine d’apprentissage 2', k: '2.7', title: 'Fonctions à partir de conditions et régression',
          sub: 'Des fonctions à partir de conditions, modèles de régression avec des outils numériques', when: 'Avril', ustd: 9 },
        { file: 'lb2-8.html', lb: 'Domaine d’apprentissage 2', k: '2.8', title: 'Problèmes d’optimisation',
          sub: 'Modéliser, extremums au bord, distinctions de cas', when: 'Mai', ustd: 12 },
        { file: 'lb6-1.html', lb: 'Domaine d’apprentissage 6', k: '6.1', title: 'Vecteurs de l’espace',
          sub: 'Vecteurs position et vecteurs entre deux points, combinaisons linéaires, centres de gravité', when: 'Mai · juin', ustd: 12 },
        { file: 'lb6-2.html', lb: 'Domaine d’apprentissage 6', k: '6.2', title: 'Produit scalaire et angles',
          sub: 'Orthogonalité, angles, preuves et démonstrations avec des vecteurs', when: 'Juin · juillet', ustd: 8 }
    ]
};
