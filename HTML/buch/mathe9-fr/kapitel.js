/* kapitel.js — the chapters of the French edition of "Mathematik · Oberschule 9" (buch/mathe9/, Realschulbildungsgang), in
 * the order of the school year (Stoffverteilungsplan svp/mathe/mathe9.html: LB 1 → LB 2 → LB 3 → Wahlpflichtbereich 1 → LB 4;
 * 4 Ustd./week, 100 + 8 Ustd.). Doc, 27.10.2026: the remaining five books in French (French round 4, tools/buch-fr/README.md,
 * block fr-20). Terms as in tools/buch-fr/glossaire.md, French school notation (× for the product, P perimeter, A total area,
 * points (2 ; 3), [AB] segment). Single source for the table of contents (index.html) and the previous/next cards at the end
 * of every chapter. No print edition: druck: false hides the page overview (O) in js/buch.js.
 */
window.BUCH = {
    title: 'Mathématiques · Oberschule 9',
    short: 'Mathématiques OS 9',
    lang: 'fr',
    druck: false,
    description: 'Manuel interactif de mathématiques pour l’Oberschule (école secondaire de Saxe), 9e année, filière Realschule : le théorème de Pythagore et sa réciproque, sinus, cosinus et tangente, problèmes avec des triangles rectangles, pyramide, cône de révolution et boule, solides composés, fonctions et équations du second degré avec la formule de résolution, le nombre d’or et la statistique descriptive avec un projet personnel, avec des éléments interactifs à essayer et des autoévaluations corrigées immédiatement.',
    chapters: [
        { file: 'lb1-1.html', lb: 'Domaine d’apprentissage 1', k: '1.1', title: 'Le théorème de Pythagore',
          sub: 'Hypoténuse et côtés de l’angle droit, calculer des côtés et des hauteurs, distances dans un repère, réciproque et corde à nœuds', when: 'Août · septembre', ustd: 12 },
        { file: 'lb1-2.html', lb: 'Domaine d’apprentissage 1', k: '1.2', title: 'Sinus, cosinus et tangente',
          sub: 'Rapports de longueurs dans le triangle rectangle, calculer des côtés et des angles avec la calculatrice', when: 'Septembre', ustd: 8 },
        { file: 'lb1-3.html', lb: 'Domaine d’apprentissage 1', k: '1.3', title: 'Les triangles rectangles au quotidien',
          sub: 'Pente en pourcentage et angle d’inclinaison, échelle, toit et câble tendu, découper en sous-problèmes', when: 'Septembre · octobre', ustd: 8 },
        { file: 'lb2-1.html', lb: 'Domaine d’apprentissage 2', k: '2.1', title: 'La pyramide',
          sub: 'Patron, perspective cavalière et épure, hauteur, apothème et arête latérale, aire totale, volume et masse', when: 'Novembre', ustd: 12 },
        { file: 'lb2-2.html', lb: 'Domaine d’apprentissage 2', k: '2.2', title: 'Cône de révolution et boule',
          sub: 'Génératrice, surface latérale en secteur circulaire, aire totale et volume du cône et de la boule, racine cubique', when: 'Décembre', ustd: 12 },
        { file: 'lb2-3.html', lb: 'Domaine d’apprentissage 2', k: '2.3', title: 'Solides composés',
          sub: 'Décomposer des tours, des silos, des pièces et des récipients, volume, aire totale et quantité de matériau', when: 'Janvier', ustd: 4 },
        { file: 'lb3-1.html', lb: 'Domaine d’apprentissage 3', k: '3.1', title: 'Fonctions du second degré',
          sub: 'Parabole de référence, y = a × x² + c, forme canonique y = (x + d)² + e, forme normalisée et mise sous forme canonique', when: 'Janvier · février · mars', ustd: 16 },
        { file: 'lb3-2.html', lb: 'Domaine d’apprentissage 3', k: '3.2', title: 'Équations du second degré',
          sub: 'Résoudre par le raisonnement, formule de résolution et discussion des cas, zéros, points d’intersection et problèmes concrets', when: 'Mars', ustd: 12 },
        { file: 'wb.html', lb: 'Domaine au choix', k: 'OP', title: 'Le nombre d’or',
          sub: 'Rapport de partage et le nombre Φ, construction, nombres de Fibonacci, art, architecture et nature', when: 'Avril', ustd: 8 },
        { file: 'lb4.html', lb: 'Domaine d’apprentissage 4', k: '4', title: 'Statistique descriptive',
          sub: 'Données dans les médias, moyenne, médiane et mode, étendue, un projet statistique personnel', when: 'Mai · juin', ustd: 16 }
    ]
};
