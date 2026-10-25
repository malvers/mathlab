/* js/buch-fr/gy12lk.js — French for the widgets of js/buch-gy12lk.js.
 * Loaded by the French editions right after js/buch-gy12lk.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * French round 2 (25.10.2026): five books at the same time, each has its own comment line in word, phrase and rule -
 * write only right below your book's line, every entry ending with a comma. Before translating a string, search the
 * other French dictionaries for it. The Italian file js/buch-it/gy12lk.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('gy12lk', {
    word: {
        // book fr-10 mathegy12lk-fr:
        // titelbildgy12lk
        'Titelbild: ein Rotationskörper mit Kreisscheiben, ein Binomialhistogramm unter der Glockenkurve, zwei windschiefe Geraden mit ihrem kürzesten Verbindungsstück':
            'Couverture : un solide de révolution avec des disques, un histogramme de loi binomiale sous la courbe en cloche, deux droites non coplanaires et leur perpendiculaire commune',
        // normalverteilung ('Was wird berechnet?' is in js/buch-fr/stochastik.js, which the same page loads)
        'Erwartungswert $\\mu$': 'Espérance $\\mu$', 'Standardabweichung $\\sigma$': 'Écart type $\\sigma$', '$\\sigma$-Regeln': 'Règles des $\\sigma$',
        'Dichte': 'Densité', 'Verteilungsfunktion': 'Fonction de répartition', 'Ansicht': 'Affichage',
        'Dichtefunktion der Normalverteilung mit markierter Fläche': 'Densité de la loi normale avec une aire colorée',
        // moivre ('Anzahl der Versuche $n$', 'Trefferwahrscheinlichkeit $p$': js/buch-fr/stochastik.js)
        'Histogramm': 'Histogramme', 'standardisiert': 'centré réduit',
        'Histogramm der Binomialverteilung mit der Glockenkurve gleichen Erwartungswerts und gleicher Standardabweichung':
            'Histogramme de la loi binomiale avec la courbe en cloche de même espérance et de même écart type',
        'erfüllt': 'remplie', 'nicht erfüllt': 'non remplie',
        // rotation (the solids as in js/buch-fr/gleichungen.js, the hint as in js/buch-fr/vektoren.js)
        'Kegel': 'Cône', 'Kugel': 'Boule', 'Paraboloid': 'Paraboloïde', 'Fass': 'Tonneau', 'Welcher Körper?': 'Quel solide ?', 'Kreisscheiben $n$': 'Disques $n$', 'aus': 'aucun',
        'Ziehen zum Drehen': 'Fais glisser pour tourner',
        'Rotationskörper im räumlichen Koordinatensystem, durch Ziehen drehbar': 'Solide de révolution dans un repère de l’espace, à faire tourner en le faisant glisser',
        'Schalte Kreisscheiben zu: Jede Scheibe hat das Volumen $\\pi \\, r^2 \\, \\Delta x$ mit $r = f(x)$.':
            'Ajoute des disques : chaque disque a pour volume $\\pi \\, r^2 \\, \\Delta x$ avec $r = f(x)$.',
        // integralfunktion, uneigentlich
        'Welche Funktion?': 'Quelle fonction ?', 'untere Grenze $a$': 'borne inférieure $a$', 'obere Grenze $b$': 'borne supérieure $b$', 'Grenze': 'Borne',
        'Graph von f mit der Fläche von a bis x': 'Courbe de f avec l’aire de a à x', 'Graph der Integralfunktion mit Tangente': 'Courbe de la fonction intégrale avec la tangente',
        '1/√x bei 0': '1/√x en 0', 'Fläche unter einer Kurve bis zu einer verschiebbaren Grenze': 'Aire sous une courbe jusqu’à une borne mobile',
        // hesse2d
        'Richtung des Normalenvektors': 'Direction du vecteur normal',
        'Gerade mit Normaleneinheitsvektor, ein Punkt P und sein Lot auf die Gerade': 'Droite avec son vecteur normal unitaire, un point P et sa perpendiculaire à la droite',
        // simpson ('Trapez' as in js/buch-fr/vektoren.js; the error column is a rule: never a bare word 'Fehler')
        'Anzahl der Streifen $n$ (gerade)': 'Nombre de bandes $n$ (pair)', 'Graph mit Parabelbögen über je zwei Streifen': 'Courbe avec des arcs de parabole sur chaque paire de bandes',
        'Trapez': 'Trapèze',
        // abstand3d ('windschief', 'schneidend', 'parallel': js/buch-fr/vektoren.js)
        'Das 3D-Modul fehlt.': 'Le module 3D manque.', 'Beispiel 3': 'Exemple 3', 'Ursprungsgerade': 'Droite passant par l’origine', 'P auf g': 'P sur g',
    },
    phrase: [
        // book fr-10 mathegy12lk-fr:
        // normalverteilung
        ['$ mit $\\mu = ', '$ avec $\\mu = '], ['$ und $\\sigma = ', '$ et $\\sigma = '],
        ['Standardisieren: $Z = \\dfrac{X - \\mu}{\\sigma}$ ist standardnormalverteilt.', 'Centrer et réduire : $Z = \\dfrac{X - \\mu}{\\sigma}$ suit la loi normale centrée réduite.'],
        ['. Das ist die gelbe Fläche.', '. C’est l’aire jaune.'], ['. Das ist der gelbe Anstieg der Verteilungsfunktion.', '. C’est la montée jaune de la fonction de répartition.'],
        // moivre
        ['Erwartungswert $\\mu = n', 'Espérance $\\mu = n'], ['$, Standardabweichung $\\sigma = \\sqrt{', '$, écart type $\\sigma = \\sqrt{'],
        ['Laplace-Bedingung $\\sigma > 3$: ', 'Condition de Laplace $\\sigma > 3$ : '],
        ['Standardisiert: Jede Säule wird um $\\mu$ verschoben, in der Breite durch $\\sigma$ geteilt und in der Höhe mit $\\sigma$ multipliziert. Für großes $n$ legen sich alle Histogramme auf dieselbe Kurve $\\varphi$.',
            'Centré réduit : chaque barre est translatée de $\\mu$, sa largeur est divisée par $\\sigma$ et sa hauteur multipliée par $\\sigma$. Pour $n$ grand, tous les histogrammes se posent sur la même courbe $\\varphi$.'],
        ['Größte Abweichung zwischen $P(X = k)$ und der Glockenkurve an der Stelle $k$: $', 'Plus grand écart entre $P(X = k)$ et la courbe en cloche au point $k$ : $'],
        // rotation ("Summe der 12 Kreisscheiben …" is a rule)
        ['$ auf $[', '$ sur $['], [']$ dreht sich um die $x$-Achse: ', ']$ tourne autour de l’axe des abscisses : '], ['$, Abweichung $', '$, écart $'],
        // integralfunktion
        [' (x links von a: das Integral zählt rückwärts)', ' (x à gauche de a : l’intégrale compte à rebours)'], ['An der Stelle $x = ', 'Pour $x = '], ['$: $I_{', '$ : $I_{'],
        ['Die pinke Tangente an $I$ hat die Steigung $', 'La tangente rose à $I$ a pour coefficient directeur $'], ['$, und das ist genau $f(', '$, et c’est exactement $f('],
        [')$. Das ist der Hauptsatz: $I_a\'(x) = f(x)$.', ')$. C’est le théorème fondamental : $I_a\'(x) = f(x)$.'],
        // hesse2d
        ['Hessesche Normalform: $', 'Forme normale de Hesse : $'], ['mit $|\\vec n_0| = 1$.', 'avec $|\\vec n_0| = 1$.'], ['Punkt einsetzen: $', 'Coordonnées de P dans l’équation : $'],
        ['Abstand $d(P, g) \\approx ', 'Distance $d(P, g) \\approx '], ['P liegt auf der Geraden.', 'P est sur la droite.'],
        ['Positiv: P liegt auf der Seite, in die $\\vec n_0$ zeigt.', 'Valeur positive : P est du côté vers lequel pointe $\\vec n_0$.'], ['Negativ: P liegt auf der anderen Seite.', 'Valeur négative : P est de l’autre côté.'],
        // simpson
        ['$. Simpson mit $n = ', '$. Simpson avec $n = '],
        ['Doppelt so viele Streifen: Trapezfehler etwa durch $', 'Deux fois plus de bandes : l’erreur des trapèzes est divisée environ par $'], ['$, Simpsonfehler etwa durch $', '$, celle de Simpson environ par $'],
        ['$ geteilt. ', '$. '],
        ['Abbruchregel „zwei Simpson-Werte unterscheiden sich um weniger als $10^{-6}$“: ', 'Critère d’arrêt « deux valeurs de Simpson diffèrent de moins de $10^{-6}$ » : '],
        ['erfüllt ab $n = ', 'rempli à partir de $n = '], ['erst sehr spät erfüllt.', 'rempli seulement très tard.'],
        // abstand3d (the points have their \,;\, already: the rules of js/buch-fr.js run before the pieces)
        ['Lotfußpunkt: $\\big(', 'Projeté orthogonal : $\\big('], ['$ gibt $t = ', '$ donne $t = '], ['$, also $F(', '$, donc $F('], [')$ und $d(P, g) = ', ')$ et $d(P, g) = '],
        ['Kontrolle mit dem Vektorprodukt: $', 'Vérification avec le produit vectoriel : $'], ['. $P$ liegt auf $g$.', '. $P$ est sur $g$.'],
        ['$: Die Geraden sind parallel. Dann ist ihr Abstand der Abstand des Punktes $Q$ von $g$: $d ', '$ : les droites sont parallèles. Leur distance est alors la distance du point $Q$ à $g$ : $d '],
        [', sie sind identisch.', ' : elles sont confondues.'],
        ['$ steht auf beiden Geraden senkrecht, $|\\vec{n}| ', '$ est orthogonal aux deux droites, $|\\vec{n}| '],
        ['. Abstand $0$: Die Geraden <b>schneiden</b> sich in $S(', '. Distance $0$ : les droites <b>se coupent</b> en $S('],
        ['. <b>Windschief</b>; das kürzeste Verbindungsstück (pink) verbindet $F(', '. Droites <b>non coplanaires</b> : la perpendiculaire commune (en rose) relie $F('], [')$ und $G(', ')$ et $G('],
        // uneigentlich
        [' (die Grenze liegt weit rechts außerhalb des Bildes)', ' (la borne est loin à droite, hors de la figure)'], ['Grenzwert: $', 'Limite : $'], ['$: $A \\approx ', '$ : $A \\approx '],
        [': Die Fläche ist unbegrenzt, obwohl der Graph sich der Achse nähert.', ' : l’aire est infinie, bien que la courbe se rapproche de l’axe.'],
        [': Die unbegrenzte Fläche hat einen endlichen Inhalt.', ' : le domaine non borné a une aire finie.'],
    ],
    rule: [
        // book fr-10 mathegy12lk-fr:
        // normalverteilung: N(\mu;\ \sigma^2) → N(\mu\,;\,\sigma^2) · rotation: [0;\ 4] → [0\,;\,4] (the engine only knows ;\,)
        [/N\(\\mu;\\ \\sigma\^2\)/g, 'N(\\mu\\,;\\,\\sigma^2)'],
        [/\[(-?[\d{},]+);\\ (-?[\d{},]+)\]/g, '[$1\\,;\\,$2]'],
        // rotation: "Summe der 12 Kreisscheiben (…): $"
        [/Summe der (\d+) Kreisscheiben \(Radius in der Mitte jedes Streifens\): \$/g, 'Somme des $1 disques (rayon au milieu de chaque bande) : $'],
        // simpson: the colon after "Simpson mit $n = 4$", the error column of the table (no bare word 'Fehler': the header button)
        [/(Simpson mit \$n = \d+\$):/g, '$1 :'],
        [/<th>Fehler<\/th>/g, '<th>Erreur</th>'],
        // uneigentlich: "$b = 10$: $A \approx …$; $b = 100$: …" → a no-break space before the semicolon
        [/(\$A \\approx [^$]*\$); (?=\$)/g, '$1 ; '],
    ]
});
