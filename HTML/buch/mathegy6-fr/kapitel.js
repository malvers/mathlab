/* kapitel.js — the chapters of the French edition of "Mathematik · Gymnasium 6" (buch/mathegy6/), in the order of the
 * school year (Stoffverteilungsplan svp/mathe/mathegy6.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 3; 4 Ustd./week,
 * 104 + 8 Ustd.). Doc, 26.10.2026: "Wir machen jetzt noch 5 Bücher ins Französische vom Gymnasium" (French round 3,
 * tools/buch-fr/README.md, block fr-13). Terms as in tools/buch-fr/glossaire.md. Single source for the table of contents
 * (index.html) and the previous/next cards at the end of every chapter. No print edition: druck: false hides the page
 * overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathématiques · Gymnasium 6',
    short: 'Mathématiques GY 6',
    lang: 'fr',
    druck: false,
    description: 'Manuel interactif de mathématiques pour le Gymnasium (lycée allemand qui mène à l’Abitur), 6e année, Saxe : fractions, nombres décimaux et pourcentages, calcul avec les fractions, équations et problèmes, correspondances et règle de trois, triangles et quadrilatères avec la somme des angles, triangles égaux et aire, prismes, proportions et nombres premiers, avec des laboratoires, des simulations et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Domaine d’apprentissage 1', k: '1.1', title: 'Fractions, décimaux et pourcentages',
          sub: 'Écrire un nombre de trois façons, écriture décimale finie ou périodique, ensembles de nombres', when: 'Août · septembre', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Domaine d’apprentissage 1', k: '1.2', title: 'Calculer avec les fractions et les décimaux',
          sub: 'Additionner, soustraire, multiplier et diviser des fractions et des nombres décimaux', when: 'Septembre', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Domaine d’apprentissage 1', k: '1.3', title: 'Propriétés des opérations, équations et problèmes',
          sub: 'Priorités de calcul et calcul astucieux, résoudre des équations et des inéquations par le raisonnement, problèmes avec un plan', when: 'Octobre · novembre', ustd: 10 },
        { file: 'lb2-1.html', lb: 'Domaine d’apprentissage 2', k: '2.1', title: 'Correspondances',
          sub: 'Non univoques, univoques, biunivoques, tableau, graphique et équation, effectifs et fréquences', when: 'Novembre · décembre', ustd: 12 },
        { file: 'lb2-2.html', lb: 'Domaine d’apprentissage 2', k: '2.2', title: 'Proportionnalité',
          sub: 'Proportionnalité et proportionnalité inverse, quotient constant et produit constant, graphiques, règle de trois', when: 'Décembre · janvier', ustd: 12 },
        { file: 'lb3-1.html', lb: 'Domaine d’apprentissage 3', k: '3.1', title: 'Somme des angles et triangles égaux',
          sub: 'Somme des angles d’un triangle avec sa démonstration, définition et théorème, cas d’égalité, constructions de triangles', when: 'Janvier · février', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Domaine d’apprentissage 3', k: '3.2', title: 'Théorèmes et droites remarquables du triangle',
          sub: 'Angles à la base, côtés et angles, inégalité triangulaire, médiatrices, bissectrices, hauteurs, médianes', when: 'Mars', ustd: 8 },
        { file: 'lb3-3.html', lb: 'Domaine d’apprentissage 3', k: '3.3', title: 'L’aire et la maison des quadrilatères',
          sub: 'Parallélogramme, triangle, trapèze et cerf-volant, figures composées, classer les quadrilatères', when: 'Mars · avril', ustd: 10 },
        { file: 'lb4.html', lb: 'Domaine d’apprentissage 4', k: '4', title: 'Prismes',
          sub: 'Propriétés, perspective cavalière et patron, aire totale et volume, projet déchets d’emballage', when: 'Avril · mai', ustd: 12 },
        { file: 'lb5.html', lb: 'Domaine d’apprentissage 5', k: '5', title: 'Relier : les proportions',
          sub: 'Fraction et pourcentage, diagrammes circulaires, proportions d’aires et de volumes', when: 'Mai', ustd: 4 },
        { file: 'wb.html', lb: 'Domaine optionnel', k: 'OP', title: 'Nombres premiers',
          sub: 'Crible d’Ératosthène, décomposition en facteurs premiers, une infinité de nombres premiers, cryptographie', when: 'Mai · juin', ustd: 8 }
    ]
};
