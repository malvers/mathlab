/* kapitel.js — the chapters of the French edition of "Mathematik · Gymnasium 12 · Leistungskurs" (buch/mathegy12lk/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathegy12lk.html: LB 5 → Wahlbereich 5 → LB 6 → LB 7 → LB 8 → LB 9 → Abitur; 5 Ustd./week).
 * Doc, 25.10.2026: "bitte beauftrage 5 Agentinnen weitere 5 Bücher in FR zu übersetzen" (French round 2, Ferrand, block fr-10).
 * Terms as in tools/buch-fr/glossaire.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathématiques · Gymnasium 12 · Leistungskurs',
    short: 'Mathématiques GY 12 LK',
    lang: 'fr',
    druck: false,
    description: 'Manuel interactif de mathématiques pour le Gymnasium (lycée général allemand), 12e année, Leistungskurs (cours approfondi), Saxe : calcul intégral avec la fonction intégrale, le théorème fondamental et des solides de révolution en vraie 3D, intégration numérique jusqu’à Simpson, variables aléatoires de loi normale et théorème de Moivre-Laplace, estimation et tests d’hypothèse, distances et angles dans l’espace avec la forme normale de Hesse et les droites non coplanaires, extremums, symétries, domaines non bornés, familles de fonctions et lieux des points, et entraînement à l’Abitur, avec des laboratoires, des simulations et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb5-1.html', lb: 'Domaine d’apprentissage 5', k: '5.1', title: 'Primitives et intégration',
          sub: 'La dérivation à l’envers, primitives de référence, composées affines, fonctions composées avec le CAS', when: 'Août · septembre', ustd: 15 },
        { file: 'lb5-2.html', lb: 'Domaine d’apprentissage 5', k: '5.2', title: 'L’intégrale et le théorème fondamental',
          sub: 'Quantités à partir de taux de variation, grandeurs physiques, sommes de Riemann, propriétés, fonction intégrale, théorème fondamental avec démonstration', when: 'Septembre', ustd: 10 },
        { file: 'lb5-3.html', lb: 'Domaine d’apprentissage 5', k: '5.3', title: 'Aires et solides de révolution',
          sub: 'Aire entre une courbe et l’axe des abscisses ou entre deux courbes, volume par rotation autour de l’axe des abscisses, cône et boule démontrés', when: 'Octobre', ustd: 10 },
        { file: 'wb5.html', lb: 'Domaine optionnel 5', k: 'OP', title: 'Intégration numérique',
          sub: 'Histoire du calcul intégral, méthodes des rectangles et des trapèzes, règle des tonneaux de Kepler, Simpson, comparaison des méthodes', when: 'Novembre', ustd: 10 },
        { file: 'lb6.html', lb: 'Domaine d’apprentissage 6', k: '6', title: 'Variables aléatoires de loi normale',
          sub: 'Courbe en cloche de Gauss, densité et fonction de répartition, espérance et écart type, règles des σ, théorème de Moivre-Laplace', when: 'Novembre', ustd: 10 },
        { file: 'lb7.html', lb: 'Domaine d’apprentissage 7', k: '7', title: 'Statistique inférentielle',
          sub: 'Échantillons, estimation de proportions, de moyennes et de variances, tests d’hypothèse unilatéraux et bilatéraux, signification statistique', when: 'Décembre', ustd: 15 },
        { file: 'lb8-1.html', lb: 'Domaine d’apprentissage 8', k: '8.1', title: 'Produit scalaire, produit vectoriel et forme normale de Hesse',
          sub: 'Angle et projection, vecteur orthogonal et aire, équation normale et équation cartésienne, forme normale de Hesse pour la droite et le plan', when: 'Janvier', ustd: 10 },
        { file: 'lb8-2.html', lb: 'Domaine d’apprentissage 8', k: '8.2', title: 'Angles d’intersection',
          sub: 'Droite et droite, droite et plan, plan et plan, inclinaisons dans les solides', when: 'Janvier', ustd: 5 },
        { file: 'lb8-3.html', lb: 'Domaine d’apprentissage 8', k: '8.3', title: 'Distances',
          sub: 'Point et point, point et plan, droite et plan, plan et plan, point et droite, droites non coplanaires', when: 'Février', ustd: 10 },
        { file: 'lb9-1.html', lb: 'Domaine d’apprentissage 9', k: '9.1', title: 'Distances extrémales, angles et symétries',
          sub: 'Fonction distance, point et courbe, plus grand angle de vue, symétrie par rapport à un point et à un plan, plus courts chemins', when: 'Février · mars', ustd: 10 },
        { file: 'lb9-2.html', lb: 'Domaine d’apprentissage 9', k: '9.2', title: 'Aires, densité, familles et lieux des points',
          sub: 'Aires de trois façons, domaines non bornés, densité et probabilité, familles de fonctions, lieux des points, familles de droites et de plans', when: 'Mars', ustd: 10 },
        { file: 'abi.html', lb: 'Examen', k: 'A', title: 'Prêt pour l’Abitur',
          sub: 'Listes de contrôle, pièges classiques et exercices au format de l’Abitur du Leistungskurs, sur la 11e et la 12e année', when: 'Avril', ustd: 0 }
    ]
};
