/* kapitel.js — the chapters of the French edition of "Mathematik · Oberschule 8" (buch/mathe8/, Realschulbildungsgang), in the
 * order of the school year (Stoffverteilungsplan svp/mathe/mathe8.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → LB 6 →
 * Wahlpflichtbereich 1; 4 Ustd./week, 100 + 8 Ustd.). Doc, 27.10.2026: the last five German books in French (French round 4,
 * tools/buch-fr/README.md, block fr-19). Terms as in tools/buch-fr/glossaire.md; collège letters for lines, f(x) = ax + b.
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter. No print
 * edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathématiques · Oberschule 8',
    short: 'Mathématiques OS 8',
    lang: 'fr',
    druck: false,
    description: 'Manuel interactif de mathématiques pour l’Oberschule (école secondaire de Saxe), 8e année, filière Realschule : expressions et calcul littéral, équations du premier degré et formules, fonctions, fonctions affines et systèmes d’équations avec des comparaisons de tarifs, cercle et théorème du demi-cercle, cylindre de révolution, agrandissements, réductions et homothéties, expériences aléatoires et arbres pondérés, les maths au quotidien avec le loyer, l’électricité et les coûts de travaux, et le vélo, avec des laboratoires, des simulations et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Domaine d’apprentissage 1', k: '1.1', title: 'Expressions et calcul littéral',
          sub: 'Valeurs d’une expression et formules, réduire, supprimer des parenthèses, développer et factoriser', when: 'Août · septembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Domaine d’apprentissage 1', k: '1.2', title: 'Équations du premier degré et formules',
          sub: 'Transformations équivalentes, aucune ou une infinité de solutions, isoler une variable dans une formule, problèmes concrets', when: 'Septembre', ustd: 8 },
        { file: 'lb2-1.html', lb: 'Domaine d’apprentissage 2', k: '2.1', title: 'Fonctions',
          sub: 'Relation qui associe une seule valeur, antécédent et image, ensemble de définition et ensemble des images, fonctions linéaires', when: 'Octobre', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Domaine d’apprentissage 2', k: '2.2', title: 'Fonctions affines',
          sub: 'f(x) = ax + b, coefficient directeur et ordonnée à l’origine, zéros, équation à partir de deux points', when: 'Novembre', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Domaine d’apprentissage 2', k: '2.3', title: 'Systèmes d’équations linéaires',
          sub: 'Résoudre graphiquement et par le calcul, nombre de solutions, comparer des tarifs et des prix', when: 'Novembre · décembre', ustd: 10 },
        { file: 'lb3-1.html', lb: 'Domaine d’apprentissage 3', k: '3.1', title: 'Le cercle',
          sub: 'Cercle et droite, théorème du demi-cercle, périmètre et aire, le nombre π, couronne', when: 'Décembre · janvier', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Domaine d’apprentissage 3', k: '3.2', title: 'Le cylindre de révolution',
          sub: 'Patron, vues et perspective cavalière, aire totale, volume et masse des cylindres pleins et creux', when: 'Janvier', ustd: 6 },
        { file: 'lb4.html', lb: 'Domaine d’apprentissage 4', k: '4', title: 'Figures semblables',
          sub: 'Homothétie et échelle, critère des deux angles, longueurs, aires et volumes, figures superposables', when: 'Mars', ustd: 14 },
        { file: 'lb5.html', lb: 'Domaine d’apprentissage 5', k: '5', title: 'Événements aléatoires',
          sub: 'Simuler, arbre pondéré et règles des chemins, avec et sans remise, dénombrer', when: 'Avril', ustd: 14 },
        { file: 'lb6.html', lb: 'Domaine d’apprentissage 6', k: '6', title: 'Les maths au quotidien',
          sub: 'Loyer et charges, factures d’électricité et d’eau, coûts de travaux, comparer des offres et des intérêts', when: 'Mai · juin', ustd: 12 },
        { file: 'wb.html', lb: 'Domaine au choix', k: 'OP', title: 'Le vélo',
          sub: 'Pouces et taille des pneus, circonférence de la roue, braquet, cadence de pédalage et vitesse', when: 'Juin', ustd: 8 }
    ]
};
