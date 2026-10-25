/* kapitel.js — the chapters of the French edition of "Mathematik · Gymnasium 11" (buch/mathegy11/, Grundkurs), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathegy11.html: LB 1 with LB 2 before the conditions part, Wahlbereich 2 at
 * the end of 11/I, then LB 3 → LB 4; 4 Ustd./week). The numbers follow the Lehrplan, so chapter 2 comes between 1.4 and 1.5.
 * Doc, 25.10.2026: "bitte beauftrage 5 Agentinnen weitere 5 Bücher in FR zu übersetzen" (French round 2, Vergne, block fr-7).
 * Terms as in tools/buch-fr/glossaire.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathématiques · Gymnasium 11',
    short: 'Mathématiques GY 11',
    lang: 'fr',
    druck: false,
    description: 'Manuel interactif de mathématiques pour le Gymnasium (lycée allemand d’enseignement général), 11e année, Grundkurs (cours de base), Saxe : limites, la dérivée et les règles de dérivation, étude de fonction, fonctions à partir de conditions, problèmes d’optimisation et régression, matrices et méthode de Gauss-Jordan, méthodes numériques, vecteurs, droites et plans de l’espace, expériences aléatoires à plusieurs épreuves et la loi binomiale, avec des laboratoires, des simulations et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Domaine d’apprentissage 1', k: '1.1', title: 'Limites et continuité',
          sub: 'Comportement à l’infini, limite en un point, théorèmes sur les limites, continuité', when: 'Août · septembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Domaine d’apprentissage 1', k: '1.2', title: 'Taux de variation et dérivée',
          sub: 'Sécante et tangente, taux d’accroissement et nombre dérivé, fonction dérivée', when: 'Septembre', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Domaine d’apprentissage 1', k: '1.3', title: 'Règles de dérivation',
          sub: 'Règles des puissances, du facteur constant et de la somme, eˣ, ln x et sin x, règles du produit et de la chaîne', when: 'Septembre · octobre', ustd: 12 },
        { file: 'lb1-4.html', lb: 'Domaine d’apprentissage 1', k: '1.4', title: 'Étudier des fonctions',
          sub: 'Sens de variation, extremums, points d’inflexion, symétrie, pôles et asymptotes', when: 'Octobre · novembre', ustd: 12 },
        { file: 'lb2.html', lb: 'Domaine d’apprentissage 2', k: '2', title: 'Matrices',
          sub: 'Notation matricielle, multiplication, méthode de Gauss-Jordan, rotations', when: 'Novembre · décembre', ustd: 6 },
        { file: 'lb1-5.html', lb: 'Domaine d’apprentissage 1', k: '1.5', title: 'Des fonctions sur mesure',
          sub: 'Fonctions à partir de conditions, problèmes d’optimisation, régression', when: 'Décembre · janvier', ustd: 12 },
        { file: 'wb2.html', lb: 'Domaine optionnel 2', k: 'OP', title: 'Méthodes numériques',
          sub: 'Résoudre des équations graphiquement, dichotomie, méthode de Newton', when: 'Janvier · février', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Domaine d’apprentissage 3', k: '3.1', title: 'Vecteurs de l’espace',
          sub: 'Repère de l’espace, calcul vectoriel, dépendance linéaire', when: 'Février · mars', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Domaine d’apprentissage 3', k: '3.2', title: 'Droites de l’espace',
          sub: 'Représentation paramétrique, test d’appartenance, points de percée, positions relatives de deux droites', when: 'Mars', ustd: 8 },
        { file: 'lb3-3.html', lb: 'Domaine d’apprentissage 3', k: '3.3', title: 'Plans',
          sub: 'Représentation paramétrique, équation cartésienne, position relative d’une droite et d’un plan', when: 'Avril', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Domaine d’apprentissage 4', k: '4.1', title: 'Expériences aléatoires à plusieurs épreuves',
          sub: 'Modèle de l’urne, règles des chemins, tableau croisé, indépendance, simulation', when: 'Avril · mai', ustd: 6 },
        { file: 'lb4-2.html', lb: 'Domaine d’apprentissage 4', k: '4.2', title: 'La loi binomiale',
          sub: 'Schémas de Bernoulli, coefficient binomial, probabilités cumulées, espérance et dispersion', when: 'Mai · juin', ustd: 12 }
    ]
};
