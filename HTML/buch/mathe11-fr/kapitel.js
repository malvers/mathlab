/* kapitel.js — the chapters of the French edition of "Mathematik · Berufliches Gymnasium 11" (buch/mathe11/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe11.html: LB 2 → LB 3 → LB 4 → LB 1 → Wahlbereich 3).
 * Doc, 22.10.2026: "Schnapp dir fünf Agenten und mach die Übersetzung der Bücher in Französisch. Fang mit BGY an."
 * (package FR0: start page and this file, the pattern for the other four French books; the chapters: fr-1). Terms as in
 * tools/buch-fr/glossaire.md. Single source for the table of contents (index.html) and the previous/next cards at the end
 * of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathématiques · Berufliches Gymnasium 11',
    short: 'Mathématiques 11',
    lang: 'fr',
    druck: false,
    description: 'Manuel interactif de mathématiques pour le Berufliches Gymnasium (lycée allemand à orientation professionnelle), 11e année, Saxe : équations, fonctions, systèmes d’équations, probabilités et méthodes numériques, avec des laboratoires, des simulations et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb2.html', lb: 'Domaine d’apprentissage 2', k: '2', title: 'Équations, formules, figures',
          sub: 'Résoudre des problèmes avec et sans calculatrice', when: 'Septembre', ustd: 20 },
        { file: 'lb3-1.html', lb: 'Domaine d’apprentissage 3', k: '3.1', title: 'Les fonctions et leurs propriétés',
          sub: 'Ensemble de définition, zéros, variations, symétrie', when: 'Fin septembre', ustd: 5 },
        { file: 'lb3-2.html', lb: 'Domaine d’apprentissage 3', k: '3.2', title: 'Croissance et décroissance',
          sub: 'Fonctions affines et fonctions exponentielles', when: 'Octobre · novembre', ustd: 10 },
        { file: 'lb3-3.html', lb: 'Domaine d’apprentissage 3', k: '3.3', title: 'Fonctions et équations du second degré',
          sub: 'Mouvements uniformément accélérés', when: 'Novembre', ustd: 15 },
        { file: 'lb3-4.html', lb: 'Domaine d’apprentissage 3', k: '3.4', title: 'Phénomènes périodiques',
          sub: 'Fonctions sinus', when: 'Décembre', ustd: 10 },
        { file: 'lb3-5.html', lb: 'Domaine d’apprentissage 3', k: '3.5', title: 'Régression',
          sub: 'Exploiter des séries de mesures avec des outils numériques', when: 'Décembre', ustd: 5 },
        { file: 'lb3-6.html', lb: 'Domaine d’apprentissage 3', k: '3.6', title: 'Fonctions réciproques et logarithme',
          sub: 'Fonction racine carrée, logarithme, équations exponentielles', when: 'Janvier', ustd: 15 },
        { file: 'lb3-7.html', lb: 'Domaine d’apprentissage 3', k: '3.7', title: 'Courbes et paramètres',
          sub: 'Les fonctions de référence sans calculatrice, étirer et translater', when: 'Février · mars', ustd: 15 },
        { file: 'lb4.html', lb: 'Domaine d’apprentissage 4', k: '4', title: 'Systèmes d’équations linéaires et matrices',
          sub: 'Méthode du pivot de Gauss, ensembles de solutions, calcul matriciel', when: 'Mars · avril', ustd: 20 },
        { file: 'lb1.html', lb: 'Domaine d’apprentissage 1', k: '1', title: 'Probabilités des expériences aléatoires à plusieurs épreuves',
          sub: 'Arbres pondérés, tableaux croisés, simulation', when: 'Avril', ustd: 15 },
        { file: 'wb3.html', lb: 'Domaine optionnel 3', k: 'OP', title: 'Méthodes numériques et simulations',
          sub: 'Dichotomie, aires approchées, méthode de Monte-Carlo', when: 'Mai · juin', ustd: 10 }
    ]
};
