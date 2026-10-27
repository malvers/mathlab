/* kapitel.js — the chapters of the French edition of "Mathematik · Gymnasium 11 · Leistungskurs" (buch/mathegy11lk/), in the order
 * of the school year (Stoffverteilungsplan of the Leistungskurs 11, 5 Ustd./week: LB 1 with LB 2 before the conditions part, Wahlbereich 2 at the end of 11/I,
 * then LB 3 → LB 4). The numbers follow the Lehrplan, so chapter 2 comes between 1.4 and 1.5.
 * Doc, 25.10.2026: "bitte beauftrage 5 Agentinnen weitere 5 Bücher in FR zu übersetzen" (French round 2, Dubreil, block fr-9).
 * Terms as in tools/buch-fr/glossaire.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Mathématiques · Gymnasium 11 · Leistungskurs',
    short: 'Mathématiques GY 11 LK',
    lang: 'fr',
    description: 'Manuel interactif de mathématiques pour le Gymnasium (lycée allemand d’enseignement général), 11e année, Leistungskurs (cours approfondi), Saxe : limites et continuité, dérivée par la définition et approximation affine, règles de dérivation démontrées, propriétés des fonctions, matrices avec rotations et production en plusieurs étapes, fonctions à partir de conditions, optimisation et régression, méthodes numériques jusqu’au théorème du point fixe, vecteurs, droites et plans dans toutes leurs positions, notion de probabilité, formule de Bayes et loi binomiale, avec des laboratoires, des simulations et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Domaine d’apprentissage 1', k: '1.1', title: 'Limites et continuité',
          sub: 'Comportement à l’infini, limite en un point, théorèmes sur les limites, fonctions définies par morceaux, continuité', when: 'Août · septembre', ustd: 15 },
        { file: 'lb1-2.html', lb: 'Domaine d’apprentissage 1', k: '1.2', title: 'Taux de variation et notion de dérivée',
          sub: 'Approximation affine, taux d’accroissement et nombre dérivé, dérivée par la définition, dérivabilité', when: 'Septembre', ustd: 10 },
        { file: 'lb1-3.html', lb: 'Domaine d’apprentissage 1', k: '1.3', title: 'Règles de dérivation',
          sub: 'Règles démontrées, eˣ, ln x et sin x, règle du produit et règle de la chaîne, de la dérivée à la fonction', when: 'Octobre', ustd: 15 },
        { file: 'lb1-4.html', lb: 'Domaine d’apprentissage 1', k: '1.4', title: 'Étude de fonction',
          sub: 'Sens de variation, extremums, convexité et points d’inflexion, symétrie, pôles, asymptotes obliques', when: 'Novembre', ustd: 14 },
        { file: 'lb2.html', lb: 'Domaine d’apprentissage 2', k: '2', title: 'Matrices',
          sub: 'Ax = b, produit de matrices compatibles, méthode de Gauss-Jordan, rotations, production en plusieurs étapes', when: 'Novembre · décembre', ustd: 6 },
        { file: 'lb1-5.html', lb: 'Domaine d’apprentissage 1', k: '1.5', title: 'Conditions, optimisation, régression',
          sub: 'Fonctions à partir de conditions, problèmes d’optimisation, équations de fonctions par régression', when: 'Décembre', ustd: 12 },
        { file: 'wb2.html', lb: 'Domaine optionnel 2', k: 'OP', title: 'Méthodes numériques',
          sub: 'Résolution graphique, dichotomie, méthode de Newton, méthode du point fixe, théorème de Banach', when: 'Janvier', ustd: 10 },
        { file: 'lb3-1.html', lb: 'Domaine d’apprentissage 3', k: '3.1', title: 'L’espace et les vecteurs',
          sub: 'Repère de l’espace, autres systèmes de coordonnées, calcul vectoriel, règles de calcul', when: 'Février · mars', ustd: 10 },
        { file: 'lb3-2.html', lb: 'Domaine d’apprentissage 3', k: '3.2', title: 'Dépendance linéaire et droites',
          sub: 'Dépendance et indépendance linéaires, droites en représentation paramétrique, position relative de deux droites', when: 'Mars', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Domaine d’apprentissage 3', k: '3.3', title: 'Plans et positions relatives',
          sub: 'Représentation paramétrique et équation cartésienne, droite et plan, plan et plan, droite d’intersection', when: 'Mars · avril', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Domaine d’apprentissage 4', k: '4.1', title: 'Probabilités et dénombrement',
          sub: 'Approche fréquentiste, Laplace, Kolmogorov, simulation, modèle de l’urne, règles des chemins, tableau croisé, dénombrement', when: 'Avril · mai', ustd: 13 },
        { file: 'lb4-2.html', lb: 'Domaine d’apprentissage 4', k: '4.2', title: 'Probabilités conditionnelles et formule de Bayes',
          sub: 'Probabilité conditionnelle, formule de Bayes sur l’arbre et le tableau croisé, indépendance', when: 'Mai', ustd: 8 },
        { file: 'lb4-3.html', lb: 'Domaine d’apprentissage 4', k: '4.3', title: 'La loi binomiale',
          sub: 'Schémas de Bernoulli, établir la formule, le symbole somme, espérance, variance, modéliser', when: 'Mai · juin', ustd: 11 }
    ]
};
