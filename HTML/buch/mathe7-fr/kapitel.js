/* kapitel.js — the chapters of the French edition of "Mathematik · Oberschule 7" (buch/mathe7/, Realschulbildungsgang),
 * in the order of the school year (Stoffverteilungsplan svp/mathe/mathe7.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlbereich 3;
 * 4 Ustd./week, 100 + 8 Ustd.). Doc, 27.10.2026: "erst die Übersetzung die restlichen 5 ins Französisch" (French round 4,
 * tools/buch-fr/README.md, block fr-18). Terms as in tools/buch-fr/glossaire.md. Single source for the table of contents
 * (index.html) and the previous/next cards at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Mathématiques · Oberschule 7',
    short: 'Mathématiques OS 7',
    lang: 'fr',
    description: 'Manuel interactif de mathématiques pour l’Oberschule (école secondaire de Saxe), 7e année, filière Realschule : pourcentages et intérêts, hasard et fréquences, nombres rationnels, expressions et équations, quadrilatères, polygones et prismes avec masse et masse volumique, pavages à la manière d’Escher, avec des laboratoires, des simulations et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Domaine d’apprentissage 1', k: '1.1', title: 'Pourcentages',
          sub: 'Le pourcentage comme centième, valeur de référence, part et taux, les trois problèmes types, diagrammes circulaires', when: 'Août · septembre', ustd: 16 },
        { file: 'lb1-2.html', lb: 'Domaine d’apprentissage 1', k: '1.2', title: 'Les pourcentages au quotidien et les intérêts',
          sub: 'Hausse et baisse de prix, remise et TVA, intérêts annuels et intérêts pour quelques jours, intérêts composés avec le tableur', when: 'Septembre · octobre', ustd: 12 },
        { file: 'lb2.html', lb: 'Domaine d’apprentissage 2', k: '2', title: 'Éléments de probabilités et de statistique',
          sub: 'Expériences aléatoires, issues et événements, fréquences et simulation, probabilité, lire les statistiques d’un œil critique', when: 'Novembre', ustd: 12 },
        { file: 'lb3-1.html', lb: 'Domaine d’apprentissage 3', k: '3.1', title: 'Nombres rationnels',
          sub: 'Nombres négatifs, droite graduée, opposé et valeur absolue, ensembles de nombres, coordonnées dans les quatre quadrants', when: 'Novembre · décembre', ustd: 8 },
        { file: 'lb3-2.html', lb: 'Domaine d’apprentissage 3', k: '3.2', title: 'Calculer avec les nombres rationnels',
          sub: 'Additionner et soustraire, multiplier, diviser et élever à une puissance, propriétés des opérations et règles de priorité', when: 'Décembre · janvier', ustd: 12 },
        { file: 'lb3-3.html', lb: 'Domaine d’apprentissage 3', k: '3.3', title: 'Expressions et équations',
          sub: 'Valeur d’une expression, mettre en équation et résoudre, isoler une variable dans une formule, égalités de rapports', when: 'Janvier', ustd: 8 },
        { file: 'lb4-1.html', lb: 'Domaine d’apprentissage 4', k: '4.1', title: 'Quadrilatères et polygones',
          sub: 'Les quadrilatères autour de nous, construire des quadrilatères, aire et périmètre, décomposer et comparer des polygones', when: 'Février · mars', ustd: 16 },
        { file: 'lb4-2.html', lb: 'Domaine d’apprentissage 4', k: '4.2', title: 'Prismes',
          sub: 'Perspective cavalière et patron, aire totale et volume, masse et masse volumique, solides composés et emballages', when: 'Avril · mai', ustd: 16 },
        { file: 'wb.html', lb: 'Domaine optionnel', k: 'OP', title: 'Pavages',
          sub: 'Pavages de polygones réguliers, les angles autour d’un sommet, pavages à la manière de M. C. Escher', when: 'Juin', ustd: 8 }
    ]
};
