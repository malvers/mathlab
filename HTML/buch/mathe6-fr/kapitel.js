/* kapitel.js — the chapters of the French edition of "Mathematik · Oberschule 6" (buch/mathe6/), in the order of the
 * school year (Stoffverteilungsplan svp/mathe/mathe6.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 2; 5 Ustd./week,
 * 125 + 10 Ustd.). Doc, 27.10.2026: "erst die Übersetzung die restlichen 5 ins Französisch" (French round 4,
 * tools/buch-fr/README.md, block fr-17). Terms as in tools/buch-fr/glossaire.md. Single source for the table of contents
 * (index.html) and the previous/next cards at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Mathématiques · Oberschule 6',
    short: 'Mathématiques OS 6',
    lang: 'fr',
    description: 'Manuel interactif de mathématiques pour l’Oberschule (école secondaire de Saxe), 6e année : représenter, convertir et comparer les fractions et les nombres décimaux, calculer avec les fractions et les décimaux, correspondances et règle de trois, angles et triangles, aire et périmètre, solides et patrons, les mathématiques au quotidien et des jeux mathématiques, avec des laboratoires, des simulations et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Domaine d’apprentissage 1', k: '1.1', title: 'Représenter les fractions et les décimaux',
          sub: 'Ensembles, droite graduée, amplifier et simplifier, fraction et écriture décimale, comparer', when: 'Août · septembre', ustd: 20 },
        { file: 'lb1-2.html', lb: 'Domaine d’apprentissage 1', k: '1.2', title: 'Calculer avec les fractions et les décimaux',
          sub: 'Additionner et soustraire, multiplier et diviser, calcul mental et ordre de grandeur', when: 'Septembre · octobre', ustd: 10 },
        { file: 'lb1-3.html', lb: 'Domaine d’apprentissage 1', k: '1.3', title: 'Propriétés des opérations, moyenne et problèmes',
          sub: 'Priorités de calcul et calcul astucieux, moyenne arithmétique, résoudre des équations par le raisonnement', when: 'Octobre', ustd: 5 },
        { file: 'lb2-1.html', lb: 'Domaine d’apprentissage 2', k: '2.1', title: 'Représenter des correspondances',
          sub: 'Univoque, biunivoque, non univoque, en mots, tableau, flèches, graphique et équation', when: 'Novembre', ustd: 10 },
        { file: 'lb2-2.html', lb: 'Domaine d’apprentissage 2', k: '2.2', title: 'Proportionnalité et règle de trois',
          sub: 'Proportionnel et inversement proportionnel, quotient et produit, règle de trois, problèmes', when: 'Novembre · décembre', ustd: 15 },
        { file: 'lb3-1.html', lb: 'Domaine d’apprentissage 3', k: '3.1', title: 'Angles et triangles',
          sub: 'Angles et droites, somme des angles d’un triangle, types de triangles, cas d’égalité et inégalité triangulaire', when: 'Janvier', ustd: 15 },
        { file: 'lb3-2.html', lb: 'Domaine d’apprentissage 3', k: '3.2', title: 'Aire et périmètre',
          sub: 'Triangle, parallélogramme, cerf-volant et trapèze, figures composées, résoudre des problèmes', when: 'Janvier · février', ustd: 15 },
        { file: 'lb4.html', lb: 'Domaine d’apprentissage 4', k: '4', title: 'Solides',
          sub: 'Décrire des solides, vues, perspective cavalière et patron, solides composés, prismes droits', when: 'Mars · avril', ustd: 20 },
        { file: 'lb5.html', lb: 'Domaine d’apprentissage 5', k: '5', title: 'Les mathématiques au quotidien',
          sub: 'Stratégies de résolution de problèmes, expériences aléatoires et fréquences, si… alors et plus… plus', when: 'Avril · mai', ustd: 15 },
        { file: 'wb.html', lb: 'Domaine optionnel', k: 'OP', title: 'Jeux mathématiques',
          sub: 'Tangram et cube Soma, tour de Hanoï, jeux de Nim, jeux de dés, un jeu à inventer', when: 'Juin', ustd: 10 }
    ]
};
