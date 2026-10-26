/* kapitel.js — the chapters of the French edition of "Mathematik · Gymnasium 8" (buch/mathegy8/), in the order of the
 * school year (Stoffverteilungsplan svp/mathe/mathegy8.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 3; 4 Ustd./week,
 * 104 + 8 Ustd.). Doc, 26.10.2026: "Wir machen jetzt noch 5 Bücher ins Französische vom Gymnasium" (French round 3,
 * tools/buch-fr/README.md, block fr-15). Terms as in tools/buch-fr/glossaire.md. Single source for the table of contents
 * (index.html) and the previous/next cards at the end of every chapter. No print edition: druck: false hides the page
 * overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathématiques · Gymnasium 8',
    short: 'Mathématiques GY 8',
    lang: 'fr',
    druck: false,
    description: 'Manuel interactif de mathématiques pour le Gymnasium (lycée allemand qui mène à l’Abitur), 8e année, Saxe : expressions et arbres de calcul, identités remarquables, équations et inéquations, expériences aléatoires, probabilités et arbres pondérés, fonctions et fonctions affines, systèmes d’équations linéaires, homothétie et figures semblables, stratégies de résolution de problèmes et simulation avec des nombres aléatoires, avec des laboratoires, des simulations et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Domaine d’apprentissage 1', k: '1.1', title: 'Variables et expressions',
          sub: 'Nom, valeur et signification, arbres de calcul, réduire, développer, factoriser', when: 'Août · septembre', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Domaine d’apprentissage 1', k: '1.2', title: 'Identités remarquables et équations',
          sub: 'Les trois identités remarquables, équations du premier degré, calcul formel (CAS), inéquations', when: 'Septembre', ustd: 12 },
        { file: 'lb2-1.html', lb: 'Domaine d’apprentissage 2', k: '2.1', title: 'Expériences aléatoires et probabilité',
          sub: 'Issues et événements, diagrammes de Venn, fréquence, situations d’équiprobabilité (Laplace)', when: 'Novembre', ustd: 16 },
        { file: 'lb2-2.html', lb: 'Domaine d’apprentissage 2', k: '2.2', title: 'Expériences à plusieurs épreuves et dénombrement',
          sub: 'Modèle de l’urne, arbre pondéré, règles des chemins, principe multiplicatif, simulation', when: 'Décembre', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Domaine d’apprentissage 3', k: '3.1', title: 'Les fonctions et leurs propriétés',
          sub: 'Relations univoques, modes de représentation, ensemble de définition et ensemble des images, sens de variation, extremums, symétrie', when: 'Janvier', ustd: 8 },
        { file: 'lb3-2.html', lb: 'Domaine d’apprentissage 3', k: '3.2', title: 'Fonctions affines',
          sub: 'Coefficient directeur et taux d’accroissement, zéros, équations de droites, régression linéaire', when: 'Janvier · février', ustd: 12 },
        { file: 'lb3-3.html', lb: 'Domaine d’apprentissage 3', k: '3.3', title: 'Systèmes d’équations linéaires',
          sub: 'Résoudre graphiquement et par le calcul, nombre de solutions, modéliser', when: 'Mars', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Domaine d’apprentissage 4', k: '4.1', title: 'Homothétie',
          sub: 'Centre et rapport, construction, conservation des angles, rapports de longueurs', when: 'Avril', ustd: 8 },
        { file: 'lb4-2.html', lb: 'Domaine d’apprentissage 4', k: '4.2', title: 'Figures semblables',
          sub: 'Critère des deux angles, figures auxiliaires, mesurer des hauteurs, longueurs, aires et volumes', when: 'Avril · mai', ustd: 12 },
        { file: 'lb5.html', lb: 'Domaine d’apprentissage 5', k: '5', title: 'Stratégies de résolution de problèmes',
          sub: 'Raisonner en avant et en arrière, plans de résolution, présenter une solution', when: 'Mai', ustd: 4 },
        { file: 'wb.html', lb: 'Domaine optionnel', k: 'OP', title: 'Simulation avec des nombres aléatoires',
          sub: 'Nombres aléatoires, méthode de Monte-Carlo, problème de Monty Hall, album d’images à collectionner', when: 'Mai · juin', ustd: 8 }
    ]
};
