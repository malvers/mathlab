/* kapitel.js — the chapters of the French edition of "Mathematik · Gymnasium 5" (buch/mathegy5/), in the order of the
 * school year (Stoffverteilungsplan svp/mathe/mathegy5.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich 3; 4 Ustd./week,
 * 104 + 8 Ustd.). Doc, 26.10.2026: "Wir machen jetzt noch 5 Bücher ins Französische vom Gymnasium" (French round 3,
 * tools/buch-fr/README.md, block fr-12). Terms as in tools/buch-fr/glossaire.md (sections 1–5, ## mathe5-fr, ## mathegy5-fr).
 * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.
 * Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Mathématiques · Gymnasium 5',
    short: 'Mathématiques GY 5',
    lang: 'fr',
    description: 'Manuel interactif de mathématiques pour le Gymnasium (lycée allemand qui mène à l’Abitur), 5e année, Saxe : grands nombres, arrondir, propriétés des opérations, puissances, diviseurs et nombres premiers, fractions, nombres décimaux et pourcentages, coordonnées, angles, symétries, rectangles et pavés droits, grandeurs de la vie quotidienne et nombres des Égyptiens, des Romains et des Mayas, avec des laboratoires, des simulations et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Domaine d’apprentissage 1', k: '1.1', title: 'Grands nombres',
          sub: 'Tableau de numération, droite graduée, estimer, arrondir, comparer et ranger', when: 'Août · septembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Domaine d’apprentissage 1', k: '1.2', title: 'Calculer avec les nombres entiers naturels',
          sub: 'Propriétés des opérations et calcul astucieux, ordre de grandeur, puissances, diviser', when: 'Septembre', ustd: 12 },
        { file: 'lb1-3.html', lb: 'Domaine d’apprentissage 1', k: '1.3', title: 'Diviseurs et nombres premiers',
          sub: 'Diviseurs et multiples, critères de divisibilité, le crible d’Ératosthène, facteurs premiers', when: 'Septembre · octobre', ustd: 3 },
        { file: 'lb2-1.html', lb: 'Domaine d’apprentissage 2', k: '2.1', title: 'Fractions',
          sub: 'Représenter des parts, simplifier et amplifier, fractions inférieures et supérieures à 1, comparer', when: 'Novembre', ustd: 12 },
        { file: 'lb2-2.html', lb: 'Domaine d’apprentissage 2', k: '2.2', title: 'Nombres décimaux et pourcentages',
          sub: 'Dixièmes, centièmes, millièmes, convertir, pourcentages, ranger et arrondir', when: 'Novembre · décembre', ustd: 8 },
        { file: 'lb2-3.html', lb: 'Domaine d’apprentissage 2', k: '2.3', title: 'Calculer avec les nombres décimaux',
          sub: 'Additionner et soustraire, déplacer la virgule, multiplier et diviser, moyenne', when: 'Décembre', ustd: 7 },
        { file: 'lb3-1.html', lb: 'Domaine d’apprentissage 3', k: '3.1', title: 'Coordonnées et angles',
          sub: 'Repère, droites parallèles et perpendiculaires, mesurer des angles, types d’angles, paires d’angles', when: 'Janvier · février', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Domaine d’apprentissage 3', k: '3.2', title: 'Symétrie et transformations',
          sub: 'Motifs, symétrie axiale et symétrie centrale, translation, rotation, construire le symétrique d’une figure', when: 'Février · mars', ustd: 10 },
        { file: 'lb4-1.html', lb: 'Domaine d’apprentissage 4', k: '4.1', title: 'Rectangles',
          sub: 'Périmètre et aire, unités d’aire, figures composées', when: 'Mars · avril', ustd: 8 },
        { file: 'lb4-2.html', lb: 'Domaine d’apprentissage 4', k: '4.2', title: 'Pavés droits',
          sub: 'Vues, perspective cavalière, patron, volume, contenances, aire totale, projet emballages', when: 'Avril · mai', ustd: 14 },
        { file: 'lb5.html', lb: 'Domaine d’apprentissage 5', k: '5', title: 'Les mathématiques au quotidien',
          sub: 'Convertir des grandeurs, valeurs approchées, horaires, problèmes de Fermi, un projet', when: 'Mai · juin', ustd: 10 },
        { file: 'wb.html', lb: 'Domaine optionnel', k: 'OP', title: 'Compter et calculer, hier et aujourd’hui',
          sub: 'Égyptiens, Romains et Mayas, Adam Ries, le système binaire', when: 'Juin', ustd: 8 }
    ]
};
