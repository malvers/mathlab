/* kapitel.js — the chapters of the French edition of "Mathematik · Gymnasium 10" (buch/mathegy10/), in the order of the
 * school year (Stoffverteilungsplan svp/mathe/mathegy10.html: LB 1 → LB 2 → LB 3 → LB 4 → LB 5 → Wahlbereich; 4 Ustd./week).
 * Doc, 25.10.2026: "bitte beauftrage 5 Agentinnen weitere 5 Bücher in FR zu übersetzen" (French round 2,
 * tools/buch-fr/README.md, block fr-6). Terms as in tools/buch-fr/glossaire.md. Single source for the table of contents
 * (index.html) and the previous/next cards at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Mathématiques · Gymnasium 10',
    short: 'Mathématiques GY 10',
    lang: 'fr',
    description: 'Manuel interactif de mathématiques pour le Gymnasium (lycée allemand qui mène à l’Abitur), 10e année, Saxe : croissance et fonctions exponentielles, phénomènes périodiques et fonction sinus, variables aléatoires, espérance et jeux équitables, loi des sinus et loi des cosinus, logarithme et équations exponentielles, tangente, vue d’ensemble des fonctions, suites et limites, calcul des intérêts et nombres complexes, avec des laboratoires, des simulations et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Domaine d’apprentissage 1', k: '1.1', title: 'Croissance et fonctions exponentielles',
          sub: 'Linéaire, exponentielle, bornée, par récurrence et explicite, paramètres et régression', when: 'Août · septembre', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Domaine d’apprentissage 1', k: '1.2', title: 'Phénomènes périodiques et fonction sinus',
          sub: 'Période, amplitude, axe médian, degrés et radians, paramètres de la fonction sinus', when: 'Septembre · octobre', ustd: 10 },
        { file: 'lb2-1.html', lb: 'Domaine d’apprentissage 2', k: '2.1', title: 'Variables aléatoires et règles des chemins',
          sub: 'Lois de probabilité, diagramme en bâtons, « exactement k », « au moins k », « au plus k »', when: 'Novembre', ustd: 8 },
        { file: 'lb2-2.html', lb: 'Domaine d’apprentissage 2', k: '2.2', title: 'Espérance et jeux équitables',
          sub: 'Espérance, variance et écart type, jeux équitables et non équitables', when: 'Novembre', ustd: 8 },
        { file: 'lb3-1.html', lb: 'Domaine d’apprentissage 3', k: '3.1', title: 'Loi des sinus, loi des cosinus et aire',
          sub: 'Triangles quelconques, le cas ambigu, Pythagore comme cas particulier, formule de l’aire avec le sinus', when: 'Décembre', ustd: 12 },
        { file: 'lb3-2.html', lb: 'Domaine d’apprentissage 3', k: '3.2', title: 'Calculs dans les triangles et les solides',
          sub: 'Plan de résolution, mesures sur le terrain, pyramide et cône, problèmes concrets', when: 'Janvier', ustd: 8 },
        { file: 'lb4-1.html', lb: 'Domaine d’apprentissage 4', k: '4.1', title: 'Fonction réciproque et logarithme',
          sub: 'Existence d’une réciproque, symétrie par rapport à y = x, le logarithme, règles de calcul des logarithmes', when: 'Janvier · février', ustd: 12 },
        { file: 'lb4-2.html', lb: 'Domaine d’apprentissage 4', k: '4.2', title: 'Fonctions logarithmes et équations exponentielles',
          sub: 'Courbe et propriétés, équations exponentielles, temps de doublement et demi-vie', when: 'Mars', ustd: 8 },
        { file: 'lb4-3.html', lb: 'Domaine d’apprentissage 4', k: '4.3', title: 'Opérations sur les fonctions, composition et fonction tangente',
          sub: 'Somme, produit, quotient, fonction intérieure et extérieure, la tangente et ses pôles', when: 'Mars', ustd: 8 },
        { file: 'lb4-4.html', lb: 'Domaine d’apprentissage 4', k: '4.4', title: 'Vue d’ensemble des fonctions',
          sub: 'Classer les familles de fonctions, cartes d’identité, esquisser des courbes sans calculatrice', when: 'Avril', ustd: 8 },
        { file: 'lb4-5.html', lb: 'Domaine d’apprentissage 4', k: '4.5', title: 'Suites numériques et limites',
          sub: 'Explicites et par récurrence, sens de variation, bornes, limite, cercle en représentation paramétrique', when: 'Avril', ustd: 6 },
        { file: 'lb5.html', lb: 'Domaine d’apprentissage 5', k: '5', title: 'Calcul des intérêts',
          sub: 'Intérêts simples et composés, crédit et tableau d’amortissement, ce que coûte vraiment un crédit', when: 'Mai', ustd: 4 },
        { file: 'wb.html', lb: 'Domaine optionnel', k: 'OP', title: 'Nombres complexes',
          sub: 'Unité imaginaire, calculer dans ℂ, plan complexe, module et argument', when: 'Mai · juin', ustd: 8 }
    ]
};
