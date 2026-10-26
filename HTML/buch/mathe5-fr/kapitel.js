/* kapitel.js — the chapters of the French edition of "Mathematik · Oberschule 5" (buch/mathe5/), in the order of the
 * school year (Stoffverteilungsplan svp/mathe/mathe5.html: LB 1 → LB 2 → LB 3 → LB 4 → Wahlbereich; Lehrplan Oberschule
 * 2019: 100 Ustd. Pflicht + 8 Ustd. Wahlbereich). Doc, 26.10.2026: OS 5 in English, Spanish, Italian and French at the same
 * time (block fr-11, tools/buch-fr/README.md). Terms as in tools/buch-fr/glossaire.md. Single source for the table of
 * contents (index.html) and the previous/next cards at the end of every chapter. No print edition: druck: false hides
 * the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathématiques · Oberschule 5',
    short: 'Mathématiques OS 5',
    lang: 'fr',
    druck: false,
    description: 'Manuel interactif de mathématiques pour l’Oberschule (école secondaire de Saxe), 5e année : grands nombres, calcul posé, propriétés des opérations et priorités de calcul, carrés parfaits, équations et divisibilité, fractions, nombres décimaux, pourcentages et grandeurs, repérage et angles, rectangle et cube, symétrie et translation, et les chiffres des Babyloniens, des Égyptiens et des Romains, avec des laboratoires, des simulations et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Domaine d’apprentissage 1', k: '1.1', title: 'Grands nombres',
          sub: 'Droite graduée, tableau de numération, millions et milliards, arrondir, estimer, comparer', when: 'Août · septembre', ustd: 7 },
        { file: 'lb1-2.html', lb: 'Domaine d’apprentissage 1', k: '1.2', title: 'Calculer avec les nombres entiers naturels',
          sub: 'Additions, soustractions, multiplications et divisions posées, ordre de grandeur, propriétés des opérations, priorités de calcul', when: 'Septembre · octobre', ustd: 15 },
        { file: 'lb1-3.html', lb: 'Domaine d’apprentissage 1', k: '1.3', title: 'Puissances, équations et diviseurs',
          sub: 'Puissances de dix, carrés parfaits, résoudre des équations par essais, critères de divisibilité, nombres premiers', when: 'Octobre · novembre', ustd: 12 },
        { file: 'lb2-1.html', lb: 'Domaine d’apprentissage 2', k: '2.1', title: 'Fractions',
          sub: 'Représenter des parts, fractions sur la droite graduée, fraction d’une grandeur, comparer et estimer', when: 'Décembre · janvier', ustd: 11 },
        { file: 'lb2-2.html', lb: 'Domaine d’apprentissage 2', k: '2.2', title: 'Nombres décimaux et pourcentages',
          sub: 'Dixièmes, centièmes, millièmes, convertir, comparer, arrondir, écriture en pourcentage', when: 'Janvier', ustd: 9 },
        { file: 'lb2-3.html', lb: 'Domaine d’apprentissage 2', k: '2.3', title: 'Calculer avec les nombres décimaux et les grandeurs',
          sub: 'Additionner et soustraire, multiplier et diviser par un entier, moyenne, monnaie, longueur, masse et durée', when: 'Janvier · mars', ustd: 14 },
        { file: 'lb3-1.html', lb: 'Domaine d’apprentissage 3', k: '3.1', title: 'Coordonnées, droites et angles',
          sub: 'Repère, droites parallèles et perpendiculaires, mesurer, tracer et estimer des angles, types d’angles', when: 'Mars · avril', ustd: 9 },
        { file: 'lb3-2.html', lb: 'Domaine d’apprentissage 3', k: '3.2', title: 'Rectangle et cube',
          sub: 'Perspective cavalière et patron du cube, périmètre et aire, aire totale et volume', when: 'Avril · mai', ustd: 11 },
        { file: 'lb4.html', lb: 'Domaine d’apprentissage 4', k: '4', title: 'Symétrie et figures superposables',
          sub: 'Axes de symétrie, symétrie axiale, translation, figure et image, frises', when: 'Mai · juin', ustd: 12 },
        { file: 'wb.html', lb: 'Domaine optionnel', k: 'OP', title: 'Comment l’humanité a appris à compter et à calculer',
          sub: 'Bâton de comptage, Babyloniens, Égyptiens et Romains, calculer sur les lignes, un exposé', when: 'Juin · juillet', ustd: 8 }
    ]
};
