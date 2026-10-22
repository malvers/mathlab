/* kapitel.js — the chapters of the French edition of "Mathematik · Berufliches Gymnasium 13" (buch/mathe13/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathe13.html: LB 3 → LB 4 → Wahlpflicht 1 → LB 6 → Abiturvorbereitung).
 * Doc, 22.10.2026: "Schnapp dir fünf Agenten und mach die Übersetzung der Bücher in Französisch. Fang mit BGY an."
 * (block fr-3, Lepaute). Terms as in tools/buch-fr/glossaire.md. Single source for the table of contents (index.html) and
 * the previous/next cards at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathématiques · Berufliches Gymnasium 13',
    short: 'Mathématiques 13',
    lang: 'fr',
    druck: false,
    description: 'Manuel interactif de mathématiques pour le Berufliches Gymnasium (lycée allemand à orientation professionnelle), 13e année, Saxe : calcul intégral, statistique inférentielle avec tests d’hypothèse, géométrie analytique des droites et des plans dans l’espace, autres applications et un chapitre de préparation à l’Abitur, avec des laboratoires, des simulations et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb3-1.html', lb: 'Domaine d’apprentissage 3', k: '3.1', title: 'Primitives',
          sub: 'Dériver à l’envers, intégrale indéfinie, règles d’intégration', when: 'Août · septembre', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Domaine d’apprentissage 3', k: '3.2', title: 'L’intégrale définie',
          sub: 'Quantité reconstituée, propriétés, théorème fondamental', when: 'Septembre', ustd: 8 },
        { file: 'lb3-3.html', lb: 'Domaine d’apprentissage 3', k: '3.3', title: 'Calculs d’aires',
          sub: 'Entre une courbe et l’axe des x, entre deux courbes', when: 'Fin septembre · octobre', ustd: 8 },
        { file: 'lb3-4.html', lb: 'Domaine d’apprentissage 3', k: '3.4', title: 'Intégration numérique et applications',
          sub: 'Méthodes des rectangles et des trapèzes, problèmes variés', when: 'Octobre · novembre', ustd: 8 },
        { file: 'lb4-1.html', lb: 'Domaine d’apprentissage 4', k: '4.1', title: 'Population et échantillon',
          sub: 'Estimer et tester, moyenne et variance de l’échantillon', when: 'Novembre', ustd: 4 },
        { file: 'lb4-2.html', lb: 'Domaine d’apprentissage 4', k: '4.2', title: 'Tests d’hypothèse',
          sub: 'Hypothèses, zone de rejet, erreurs de première et de deuxième espèce', when: 'Novembre · décembre', ustd: 8 },
        { file: 'wp1-1.html', lb: 'Domaine au choix 1', k: 'OP.1', title: 'Droites et plans',
          sub: 'Représentations paramétriques, vecteur normal par le produit vectoriel', when: 'Décembre', ustd: 8 },
        { file: 'wp1-2.html', lb: 'Domaine au choix 1', k: 'OP.2', title: 'Équation cartésienne et positions relatives',
          sub: 'Point, droite, plan : positions, points d’intersection, points de percée', when: 'Janvier', ustd: 8 },
        { file: 'wp1-3.html', lb: 'Domaine au choix 1', k: 'OP.3', title: 'Angles d’intersection, prismes et pyramides',
          sub: 'Angles entre droites et plans, aires et volumes', when: 'Janvier', ustd: 4 },
        { file: 'lb6.html', lb: 'Domaine d’apprentissage 6', k: '6', title: 'Autres applications',
          sub: 'Familles de fonctions, paramètres dans les systèmes, coût et bénéfice, distances', when: 'Fin janvier · février', ustd: 8 },
        { file: 'abi.html', lb: 'Abitur', k: 'A', title: 'Prêt pour l’Abitur',
          sub: 'Listes de contrôle et exercices au format de l’Abitur sur les trois années', when: 'Février · avril', ustd: 0 }
    ]
};
