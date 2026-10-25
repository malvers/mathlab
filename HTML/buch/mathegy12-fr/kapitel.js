/* kapitel.js — the chapters of the French edition of "Mathematik · Gymnasium 12" (buch/mathegy12/, Grundkurs), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathegy12.html: LB 5 → Wahlbereich 5 → LB 6 → LB 7 → LB 8 → Abitur; 4 Ustd./week).
 * Doc, 25.10.2026: "bitte beauftrage 5 Agentinnen weitere 5 Bücher in FR zu übersetzen" (French round 2, Amice, block fr-8).
 * Terms as in tools/buch-fr/glossaire.md. Single source for the table of contents (index.html) and the previous/next cards
 * at the end of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathématiques · Gymnasium 12',
    short: 'Mathématiques GY 12',
    lang: 'fr',
    druck: false,
    description: 'Manuel interactif de mathématiques pour le Gymnasium (lycée allemand d’enseignement général), 12e année, Grundkurs (cours de base), Saxe : le calcul intégral, de la recherche des primitives à l’aire entre deux courbes, l’intégration numérique, l’estimation et les tests d’hypothèse, les distances et les angles dans l’espace en vraie 3D, les distances minimales, les symétries, les familles de fonctions et de droites et la préparation à l’Abitur, avec des laboratoires, des simulations et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb5-1.html', lb: 'Domaine d’apprentissage 5', k: '5.1', title: 'Primitives et intégration',
          sub: 'Dériver à l’envers, primitives usuelles, règles de calcul, composées affines, CAS', when: 'Août · septembre', ustd: 12 },
        { file: 'lb5-2.html', lb: 'Domaine d’apprentissage 5', k: '5.2', title: 'L’intégrale définie',
          sub: 'Quantité à partir des taux de variation, sommes inférieures et supérieures, propriétés, théorème fondamental, fonction intégrale', when: 'Septembre', ustd: 8 },
        { file: 'lb5-3.html', lb: 'Domaine d’apprentissage 5', k: '5.3', title: 'Calculs d’aires',
          sub: 'Aire entre la courbe et l’axe des x, entre deux courbes, bornes inconnues, problèmes concrets', when: 'Septembre · octobre', ustd: 8 },
        { file: 'wb5.html', lb: 'Domaine optionnel 5', k: 'OP', title: 'Intégration numérique',
          sub: 'Histoire du calcul intégral, méthodes des rectangles et des trapèzes, précision', when: 'Octobre · novembre', ustd: 8 },
        { file: 'lb6.html', lb: 'Domaine d’apprentissage 6', k: '6', title: 'Statistique inférentielle',
          sub: 'Échantillons, estimer une proportion, moyenne et variance, tests d’hypothèse unilatéraux et bilatéraux', when: 'Novembre', ustd: 12 },
        { file: 'lb7-1.html', lb: 'Domaine d’apprentissage 7', k: '7.1', title: 'Produit scalaire, produit vectoriel et équation normale',
          sub: 'Angle et projection, vecteur orthogonal et aire, équation normale et équation cartésienne', when: 'Décembre', ustd: 8 },
        { file: 'lb7-2.html', lb: 'Domaine d’apprentissage 7', k: '7.2', title: 'Angles d’intersection',
          sub: 'Droite et droite, droite et plan, plan et plan, inclinaisons dans les solides', when: 'Janvier', ustd: 8 },
        { file: 'lb7-3.html', lb: 'Domaine d’apprentissage 7', k: '7.3', title: 'Distances',
          sub: 'Point et point, projeté orthogonal, distance d’un point à un plan, forme normale de Hesse, applications', when: 'Janvier', ustd: 8 },
        { file: 'lb8-1.html', lb: 'Domaine d’apprentissage 8', k: '8.1', title: 'Distances minimales et symétries',
          sub: 'Fonction distance, point et droite, point et courbe, symétrie par rapport à un point et à un plan, plus courts chemins', when: 'Février', ustd: 8 },
        { file: 'lb8-2.html', lb: 'Domaine d’apprentissage 8', k: '8.2', title: 'Aires et familles',
          sub: 'Des aires par trois chemins, familles de fonctions et lieux de points, familles de droites, exercices transversaux', when: 'Mars', ustd: 12 },
        { file: 'abi.html', lb: 'Examen', k: 'A', title: 'Prêt pour l’Abitur',
          sub: 'Listes de contrôle, pièges classiques et exercices au format de l’Abitur sur la 11e et la 12e année', when: 'Avril', ustd: 0 }
    ]
};
