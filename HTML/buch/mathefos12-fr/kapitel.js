/* kapitel.js — the chapters of the French edition of "Mathematik · Fachoberschule 12" (buch/mathefos12/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathefos12.html: LB 1 → LB 2 → LB 3 → LB 4 → FHR-Prüfung → Wahlbereich 3; 4 Ustd./week).
 * Doc, 22.10.2026: "Schnapp dir fünf Agenten und mach die Übersetzung der Bücher in Französisch" (tools/buch-fr/README.md, block fr-5).
 * Terms as in tools/buch-fr/glossaire.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathématiques · Fachoberschule 12',
    short: 'Mathématiques FOS 12',
    lang: 'fr',
    druck: false,
    description: 'Manuel interactif de mathématiques pour la Fachoberschule (lycée technique allemand), 12e année, Saxe : vecteurs, droites et plans dans l’espace en vraie 3D, calcul différentiel des limites aux problèmes d’optimisation, calcul intégral, fonctions rationnelles et exponentielles, entraînement à l’examen de la Fachhochschulreife et un domaine optionnel avec un CAS, avec des laboratoires, des simulations et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Domaine d’apprentissage 1', k: '1.1', title: 'Vecteurs et produit scalaire',
          sub: 'Flèches dans l’espace, norme, calculer avec des vecteurs, angle et orthogonalité', when: 'Août · septembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Domaine d’apprentissage 1', k: '1.2', title: 'Droites dans l’espace',
          sub: 'Représentation paramétrique, test d’appartenance, points de percée, positions relatives, angle d’intersection', when: 'Septembre', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Domaine d’apprentissage 1', k: '1.3', title: 'Plans dans l’espace',
          sub: 'Représentation paramétrique et équation cartésienne, produit vectoriel, droite et plan', when: 'Septembre · octobre', ustd: 8 },
        { file: 'lb1-4.html', lb: 'Domaine d’apprentissage 1', k: '1.4', title: 'Perpendiculaire, distance et aires',
          sub: 'Projeté orthogonal, distance point–plan, aires, applications variées', when: 'Octobre · novembre', ustd: 6 },
        { file: 'lb2-1.html', lb: 'Domaine d’apprentissage 2', k: '2.1', title: 'Limites et taux de variation',
          sub: 'Suites de nombres, comportement à l’infini, continuité, vitesse moyenne et instantanée', when: 'Novembre', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Domaine d’apprentissage 2', k: '2.2', title: 'La dérivée',
          sub: 'Nombre dérivé, règles de dérivation, règle de la chaîne, tangente et normale', when: 'Novembre · décembre', ustd: 12 },
        { file: 'lb2-3.html', lb: 'Domaine d’apprentissage 2', k: '2.3', title: 'Étude de fonction',
          sub: 'Zéros, symétrie, sens de variation, extremums et points d’inflexion, le schéma complet', when: 'Décembre · janvier', ustd: 8 },
        { file: 'lb2-4.html', lb: 'Domaine d’apprentissage 2', k: '2.4', title: 'Familles, cartes d’identité et problèmes d’optimisation',
          sub: 'Points d’intersection et de contact, familles de fonctions, fonctions à partir de conditions, optimiser', when: 'Janvier', ustd: 7 },
        { file: 'lb3.html', lb: 'Domaine d’apprentissage 3', k: '3', title: 'Calcul intégral',
          sub: 'Primitives, intégrale, théorème fondamental, aires entre deux courbes', when: 'Février · mars', ustd: 10 },
        { file: 'lb4-1.html', lb: 'Domaine d’apprentissage 4', k: '4.1', title: 'Fonctions rationnelles',
          sub: 'Pôles et trous, asymptotes, règle du quotient, étude complète', when: 'Mars', ustd: 12 },
        { file: 'lb4-2.html', lb: 'Domaine d’apprentissage 4', k: '4.2', title: 'Fonctions exponentielles de base e',
          sub: 'Le nombre e, équations exponentielles, dériver avec les règles de la chaîne et du produit, croissance', when: 'Avril', ustd: 13 },
        { file: 'fhr.html', lb: 'Examen', k: 'P', title: 'En forme pour l’examen de la FHR',
          sub: 'Listes de contrôle et exercices au format de l’examen dans tous les domaines d’apprentissage', when: 'Mai', ustd: 0 },
        { file: 'wb3.html', lb: 'Domaine optionnel 3', k: 'OP', title: 'Calcul différentiel et intégral avec un CAS',
          sub: 'Familles à deux paramètres, fonctions définies par morceaux, régression, ouverture sur la perspective centrale', when: 'Juin', ustd: 8 }
    ]
};
