/* kapitel.js — the chapters of the French edition of "Mathematik · Oberschule 10" (buch/mathe10/, Realschulbildungsgang), in
 * the order of the school year (Stoffverteilungsplan svp/mathe/mathe10.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlpflichtbereich 3;
 * 4 Ustd./week, 80 + 8 Ustd.). Doc, 27.10.2026: "erst die Übersetzung die restlichen 5 ins Französisch" (French round 4,
 * tools/buch-fr/README.md, block fr-21). Terms as in tools/buch-fr/glossaire.md. Single source for the table of contents
 * (index.html) and the previous/next cards at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Mathématiques · Oberschule 10',
    short: 'Mathématiques OS 10',
    lang: 'fr',
    description: 'Manuel interactif de mathématiques pour l’Oberschule (école secondaire de Saxe), 10e année, filière Realschule : triangles et polygones avec la loi des sinus et la loi des cosinus, fonctions puissances, exponentielles et sinus, variables aléatoires et espérance, salaire, épargne et crédit, solides avec le tronc de pyramide et le tronc de cône, résolution de problèmes pour l’examen final et mesures sur le terrain, avec des laboratoires, des simulations et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Domaine d’apprentissage 1', k: '1.1', title: 'Triangles, quadrilatères et trigonométrie',
          sub: 'La maison des quadrilatères, sommes des angles, sinus, cosinus et tangente dans les figures', when: 'Août · septembre', ustd: 8 },
        { file: 'lb1-2.html', lb: 'Domaine d’apprentissage 1', k: '1.2', title: 'Loi des sinus et loi des cosinus',
          sub: 'Côtés et angles dans un triangle quelconque, déterminer des distances', when: 'Septembre', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Domaine d’apprentissage 1', k: '1.3', title: 'Aires des triangles et des polygones',
          sub: 'L’aire avec le sinus, polygones réguliers, calculer l’aire de terrains', when: 'Septembre · octobre', ustd: 4 },
        { file: 'lb2-1.html', lb: 'Domaine d’apprentissage 2', k: '2.1', title: 'Fonctions puissances',
          sub: 'Paraboles et hyperboles, symétrie, asymptotes, proportionnalité inverse', when: 'Novembre', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Domaine d’apprentissage 2', k: '2.2', title: 'Fonctions exponentielles',
          sub: 'Croissance et décroissance, facteur de croissance, intérêts composés, demi-vie', when: 'Novembre', ustd: 4 },
        { file: 'lb2-3.html', lb: 'Domaine d’apprentissage 2', k: '2.3', title: 'La fonction sinus',
          sub: 'Mesure en radians, cercle trigonométrique, amplitude et période, les fonctions en un coup d’œil', when: 'Novembre · décembre', ustd: 8 },
        { file: 'lb3.html', lb: 'Domaine d’apprentissage 3', k: '3', title: 'Variables aléatoires et espérance',
          sub: 'Loi de probabilité, espérance, jeux équitables, simulation et risque', when: 'Décembre · janvier', ustd: 12 },
        { file: 'lb4-1.html', lb: 'Domaine d’apprentissage 4', k: '4.1', title: 'L’argent au quotidien',
          sub: 'Salaire et prélèvements, budget du foyer, épargne, crédit et piège de l’endettement', when: 'Janvier', ustd: 8 },
        { file: 'lb4-2.html', lb: 'Domaine d’apprentissage 4', k: '4.2', title: 'Solides et troncs',
          sub: 'Prisme, cylindre, pyramide, cône et boule, tronc de pyramide et tronc de cône, masse et coûts', when: 'Février · mars', ustd: 8 },
        { file: 'lb4-3.html', lb: 'Domaine d’apprentissage 4', k: '4.3', title: 'Résoudre des problèmes',
          sub: 'Probabilités et fonctions au quotidien, connaissances de base sans calculatrice, prêt pour l’examen', when: 'Mars', ustd: 12 },
        { file: 'wb.html', lb: 'Domaine au choix 3', k: 'OP', title: 'Mesurer sur le terrain',
          sub: 'Triangle du forestier, méthode des ombres, théorème de Thalès, triangulation, mesures à l’école', when: 'Mai', ustd: 8 }
    ]
};
