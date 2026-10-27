/* kapitel.js — the chapters of the French edition of "Mathematik · Fachoberschule 11" (buch/mathefos11/), in the order
 * of the school year (Stoffverteilungsplan svp/mathe/mathefos11.html: LB 1 → LB 2 → Wahlbereich 2, then the outlooks of Wahlbereich 1 and 3; 3 Ustd./week).
 * Doc, 22.10.2026: "Schnapp dir fünf Agenten und mach die Übersetzung der Bücher in Französisch. Fang mit BGY an."
 * (block fr-4, tools/buch-fr/README.md). Terms as in tools/buch-fr/glossaire.md. Single source for the table of contents
 * (index.html) and the previous/next cards at the end of every chapter. Print edition: druck.html, made by tools/buch-druck/druck-html.mjs.
 */
window.BUCH = {
    title: 'Mathématiques · Fachoberschule 11',
    short: 'Mathématiques FOS 11',
    lang: 'fr',
    description: 'Manuel interactif de mathématiques pour la Fachoberschule (lycée technique allemand), 11e année, Saxe : expressions et formules, fonctions affines et du second degré, équations, inéquations et systèmes d’équations, fonctions polynômes, probabilités, dénombrement et schémas de Bernoulli, mathématiques financières et un regard sur les nombres complexes et l’algèbre de Boole, avec des laboratoires, des simulations et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Domaine d’apprentissage 1', k: '1.1', title: 'Nombres, expressions et formules',
          sub: 'Ensembles de nombres, transformer des formules, valeur absolue, identités remarquables, pourcentages, puissances', when: 'Août · septembre', ustd: 6 },
        { file: 'lb1-2.html', lb: 'Domaine d’apprentissage 1', k: '1.2', title: 'Fonctions et fonctions affines',
          sub: 'Notion de fonction, coefficient directeur et ordonnée à l’origine, équations de droites, angle d’inclinaison', when: 'Septembre', ustd: 9 },
        { file: 'lb1-3.html', lb: 'Domaine d’apprentissage 1', k: '1.3', title: 'Équations et inéquations du premier degré',
          sub: 'Transformations équivalentes, ensembles de solutions, équations rationnelles', when: 'Octobre', ustd: 6 },
        { file: 'lb1-4.html', lb: 'Domaine d’apprentissage 1', k: '1.4', title: 'Droites et systèmes d’équations linéaires',
          sub: 'Paramètres, positions relatives, trois méthodes de résolution, applications', when: 'Novembre', ustd: 9 },
        { file: 'lb1-5.html', lb: 'Domaine d’apprentissage 1', k: '1.5', title: 'Fonctions et équations du second degré',
          sub: 'Forme canonique et forme développée, formule de résolution, relations de Viète', when: 'Décembre', ustd: 6 },
        { file: 'lb1-6.html', lb: 'Domaine d’apprentissage 1', k: '1.6', title: 'Des paraboles sur mesure',
          sub: 'Forme factorisée, équations de fonctions à partir de conditions, paramètres et disjonction des cas', when: 'Janvier', ustd: 6 },
        { file: 'lb1-7.html', lb: 'Domaine d’apprentissage 1', k: '1.7', title: 'Fonctions polynômes',
          sub: 'Factorisation, changement de variable, multiplicité, allure de la courbe', when: 'Janvier', ustd: 3 },
        { file: 'lb2-1.html', lb: 'Domaine d’apprentissage 2', k: '2.1', title: 'Hasard et probabilité',
          sub: 'Issues et événements, loi des grands nombres, Laplace, combiner des événements', when: 'Février · mars', ustd: 9 },
        { file: 'lb2-2.html', lb: 'Domaine d’apprentissage 2', k: '2.2', title: 'Expériences aléatoires à plusieurs épreuves',
          sub: 'Indépendance, arbres pondérés et règles des chemins, applications', when: 'Mars', ustd: 9 },
        { file: 'lb2-3.html', lb: 'Domaine d’apprentissage 2', k: '2.3', title: 'Dénombrement, modèle de l’urne et schémas de Bernoulli',
          sub: 'Principe multiplicatif, permutation, arrangement, combinaison, formule de Bernoulli', when: 'Avril', ustd: 12 },
        { file: 'wb2.html', lb: 'Domaine optionnel 2', k: 'OP', title: 'Mathématiques financières',
          sub: 'Intérêts composés, plans d’épargne, amortissements constants et annuités constantes', when: 'Mai', ustd: 6 },
        { file: 'exkurse.html', lb: 'Perspectives', k: 'E', title: 'Nombres complexes et algèbre de Boole',
          sub: 'Les domaines optionnels 1 et 3 en excursions : plan complexe, tables de vérité, circuits', when: 'Juin', ustd: 0 }
    ]
};
