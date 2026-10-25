/* js/buch-fr/gy11lk.js — French for the widgets of js/buch-gy11lk.js.
 * Loaded by the French editions right after js/buch-gy11lk.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * French round 2 (25.10.2026): five books at the same time, each has its own comment line in word, phrase and rule -
 * write only right below your book's line, every entry ending with a comma. Before translating a string, search the
 * other French dictionaries for it. The Italian file js/buch-it/gy11lk.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('gy11lk', {
    word: {
        // book fr-9 mathegy11lk-fr:
        // titelbildgy11lk
        'Titelbild: eine Kurve mit Tangente, der Epsilon-Delta-Streifen um einen Punkt und eine Fixpunktiteration als Spinnennetz':
            'Couverture : une courbe avec sa tangente, la bande epsilon-delta autour d’un point et une méthode du point fixe en toile d’araignée',
        // epsdelta
        'x² bei 1': 'x² en 1', '(x² − 4)/(x − 2) bei 2': '(x² − 4)/(x − 2) en 2', 'sin x / x bei 0': 'sin x / x en 0', '√x bei 4': '√x en 4', 'Sprung bei 0': 'Saut en 0',
        'Streifenbreite $\\varepsilon$': 'Largeur de la bande $\\varepsilon$',
        'Graph mit einem waagerechten Streifen der Breite Epsilon um den Grenzwert und einem senkrechten Streifen der Breite Delta um die Stelle':
            'Courbe avec une bande horizontale de largeur epsilon autour de la limite et une bande verticale de largeur delta autour du point',
        // stetigkeit
        'zwei Parabel- und Geradenstücke': 'Morceaux de parabole et de droite', 'Parameter $a$': 'Paramètre $a$', 'Gerade und Wurzel': 'Droite et racine', 'Lücke füllen': 'Combler le trou',
        'Funktionswert $b$ an der Stelle 1': 'Valeur $b$ de la fonction en 1',
        'Abschnittsweise definierte Funktion mit Übergangsstelle': 'Fonction définie par morceaux avec un point de raccordement',
        // linapprox
        'eˣ bei 0': 'eˣ en 0', 'sin x bei 0': 'sin x en 0', 'ln x bei 1': 'ln x en 1',
        'Ausschnitt: halbe Breite $r$': 'Fenêtre : demi-largeur $r$',
        'Funktionsgraph und Tangente in einem Ausschnitt, der sich verkleinern lässt': 'Courbe de la fonction et tangente dans une fenêtre que l’on peut réduire',
        // ablnachdef
        'Schrittweite $h = 10^{-k}$': 'Pas $h = 10^{-k}$', '$a = e$ setzen': 'Poser $a = e$', 'Tangente': 'Tangente',
        'Graph von a hoch x mit Sekante durch (0|1) und Tangente': 'Courbe de a puissance x avec la sécante passant par (0 ; 1) et la tangente',
        // produktregel
        'Zuwachs $h$ von $x$': 'Accroissement $h$ de $x$',
        'Rechteck mit den Seiten u und v und seinem Zuwachs aus zwei Streifen und einer Ecke': 'Rectangle de côtés u et v avec son accroissement : deux bandes et un coin',
        // randextrema
        'Funktionsgraph mit einem Intervall, seinen lokalen und globalen Extrema': 'Courbe de la fonction sur un intervalle, avec ses extremums locaux et globaux',
        'linker Rand $a$': 'borne gauche $a$', 'rechter Rand $b$': 'borne droite $b$',
        'lokales Maximum': 'maximum local', 'lokales Minimum': 'minimum local', 'Rand': 'borne', 'Art': 'Nature',
        'Globales Maximum': 'Maximum global', 'globales Minimum': 'minimum global',
        // drehraum
        'Dieses Bild braucht js/buch-vektoren.js.': 'Cette figure a besoin de js/buch-vektoren.js.',
        'Drehachse:': 'Axe de rotation :', 'Drehachse': 'Axe de rotation', 'x-Achse': 'axe des x', 'y-Achse': 'axe des y', 'z-Achse': 'axe des z',
        'Drehwinkel $\\varphi$': 'Angle de rotation $\\varphi$',
        'Ein Haus wird im Raum um eine Koordinatenachse gedreht': 'Une maison tourne dans l’espace autour d’un axe de coordonnées',
        // verflechtung (as in the text of chapter 2: cacao, sucre, lait, chocolat noir, au lait; "Classic" and "Mix" stay as product names)
        'Kakao': 'Cacao', 'Zucker': 'Sucre', 'Milch': 'Lait', 'Zartbitter': 'Noir', 'Vollmilch': 'Au lait', 'Classic': 'Classic', 'Mix': 'Mix',
        'Tafeln „Classic“ $e_1$': 'Tablettes « Classic » $e_1$', 'Boxen „Mix“ $e_2$': 'Boîtes « Mix » $e_2$',
        'Gozinto-Graph: drei Rohstoffe, zwei Zwischenprodukte, zwei Endprodukte, an den Pfeilen die benötigten Mengen':
            'Graphe de Gozinto : trois matières premières, deux produits intermédiaires, deux produits finis et, sur les flèches, les quantités nécessaires',
        // rettung
        'Tempo im Sand $v_1$ (m/s)': 'Vitesse sur le sable $v_1$ (m/s)', 'Tempo im Wasser $v_2$ (m/s)': 'Vitesse dans l’eau $v_2$ (m/s)', 'Sand': 'Sable', 'Wasser': 'Eau',
        'T in s': 'T en s',
        'Strand und Wasser: der Weg der Rettungsschwimmerin von A über den Punkt P an der Wasserlinie zum Schwimmer B':
            'Plage et eau : le trajet de la sauveteuse de A jusqu’au nageur B, en passant par le point P au bord de l’eau',
        'Die Zeit T in Abhängigkeit vom Punkt x, an dem sie ins Wasser geht': 'Le temps T en fonction du point x où elle entre dans l’eau',
        // fixpunkt
        'Funktion φ': 'Fonction φ', 'Nächster Schritt': 'Étape suivante', '10 Schritte': '10 étapes',
        'Fixpunktiteration: Spinnennetz zwischen dem Graphen von φ und der Geraden y = x': 'Méthode du point fixe : toile d’araignée entre la courbe de φ et la droite y = x',
    },
    phrase: [
        // book fr-9 mathegy11lk-fr:
        // epsdelta
        ['\\text{ rechts, } ', '\\text{ à droite, } '], ['\\text{ links, also } ', '\\text{ à gauche, donc } '],
        ['$, Behauptung: $', '$, affirmation : $'], ['$. Orange: alle $y$ mit $|y - ', '$. En orange : tous les $y$ tels que $|y - '],
        ['Blau: Für alle $x \\neq ', 'En bleu : pour tout $x \\neq '], ['$ mit $|x - ', '$ tel que $|x - '],
        ['| < \\delta$ liegt $f(x)$ im orangen Streifen. Das größte passende $\\delta$ ist hier etwa ', '| < \\delta$, $f(x)$ est dans la bande orange. Ici, le plus grand $\\delta$ qui convient vaut environ '],
        [' (exakt: $', ' (exactement : $'],
        ['. Mach $\\varepsilon$ kleiner: Es gibt immer noch ein $\\delta > 0$. Genau das heißt „Grenzwert“.', '. Rends $\\varepsilon$ plus petit : il existe toujours un $\\delta > 0$. C’est exactement cela, une « limite ».'],
        ['Kein $\\delta$ passt:', 'Aucun $\\delta$ ne convient :'],
        ['So nah man der 0 von links auch kommt, dort ist $f(x) = -1$, also mindestens 2 vom behaupteten Grenzwert entfernt. Für $\\varepsilon < 2$ scheitert jede Wahl. Die Funktion hat bei 0 keinen Grenzwert, nur einseitige.',
            'Aussi près de 0 que l’on soit à gauche, on y a $f(x) = -1$, donc un écart d’au moins 2 avec la limite affirmée. Pour $\\varepsilon < 2$, tout choix échoue. La fonction n’a pas de limite en 0, seulement une limite à gauche et une limite à droite.'],
        // stetigkeit (the rule below turns "Stetig an der Stelle 1:" first; the piece is for tools/buch-en/check.mjs)
        ['Stetig an der Stelle ', 'Continue en '],
        ['linksseitiger Grenzwert, rechtsseitiger Grenzwert und Funktionswert stimmen überein. Der Graph lässt sich ohne Absetzen zeichnen.',
            'la limite à gauche, la limite à droite et la valeur de la fonction coïncident. On peut tracer la courbe sans lever le crayon.'],
        ['Sprungstelle:</b> Die einseitigen Grenzwerte sind verschieden, der Graph springt um ', 'Discontinuité de saut :</b> la limite à gauche et la limite à droite sont différentes, la courbe fait un saut de '],
        ['. Stetig wird $f$ nur für $', '. $f$ ne devient continue que pour $'],
        ['Hebbare Unstetigkeit:</b> Der Grenzwert ', 'Discontinuité supprimable :</b> la limite '], [' existiert, aber der Funktionswert ist ', ' existe, mais la valeur de la fonction est '],
        ['. Mit $b = ', '. Avec $b = '], ['$ wird die Lücke geschlossen.', '$, le trou est comblé.'],
        // linapprox
        ['$, Tangente in $x_0 = ', '$, tangente en $x_0 = '], ['$, also $f(x_0 + h) \\approx ', '$, donc $f(x_0 + h) \\approx '],
        ['Am Rand des Ausschnitts ($h = \\pm', 'Au bord de la fenêtre ($h = \\pm'], ['$) weicht die Tangente höchstens um ', '$), la tangente s’écarte de la courbe d’au plus '],
        [' ab, das sind ', ', soit '],
        [' pro Einheit von $h$. Verkleinere $r$: Der Fehler schrumpft schneller als $h$, die Kurve sieht im Kleinen aus wie ihre Tangente.',
            ' par unité de $h$. Réduis $r$ : l’erreur diminue plus vite que $h$ ; vue de près, la courbe ressemble à sa tangente.'],
        // ablnachdef (the point rule has already made (0 \mid 1) into (0\,;\,1))
        [': Es genügt, den Grenzwert von $\\dfrac{a^h - 1}{h}$ für $h \\to 0$ zu kennen, den Anstieg in $(0\\,;\\,1)$.',
            ' : il suffit de connaître la limite de $\\dfrac{a^h - 1}{h}$ quand $h \\to 0$, c’est-à-dire la pente en $(0\\,;\\,1)$.'],
        ['Für $a = ', 'Pour $a = '], ['$ geht der Quotient gegen $\\ln a \\approx ', '$, le quotient tend vers $\\ln a \\approx '],
        ['$, also $\\left(a^x\\right)\' = \\ln a \\cdot a^x$. ', '$, donc $\\left(a^x\\right)\' = \\ln a \\cdot a^x$. '],
        ['Für $a = e$ ist der Grenzwert genau 1: ', 'Pour $a = e$, la limite vaut exactement 1 : '],
        ['Bei welcher Basis ist der Grenzwert genau 1?', 'Pour quelle base la limite vaut-elle exactement 1 ?'],
        // produktregel
        ['$ bei $x = 1{,}5$. Wächst $x$ um $h$, wächst die Fläche $u \\cdot v$ um zwei Streifen und eine Ecke:', '$ en $x = 1{,}5$. Si $x$ augmente de $h$, l’aire $u \\cdot v$ augmente de deux bandes et d’un coin :'],
        ['Für $h \\to 0$ geht die Ecke $\\Delta u \\cdot \\tfrac{\\Delta v}{h}$ gegen $0 \\cdot v\'$, übrig bleibt $', 'Quand $h \\to 0$, le coin $\\Delta u \\cdot \\tfrac{\\Delta v}{h}$ tend vers $0 \\cdot v\'$ ; il reste $'],
        ['$: die <b>Produktregel</b>.', '$ : la <b>règle du produit</b>.'],
        // randextrema
        ['$ auf $[', '$ sur $['],
        [']$. Kandidaten: die Stellen mit $f\'(x) = 0$ und Vorzeichenwechsel im Inneren, dazu die beiden Ränder.', ']$. Candidats : les points intérieurs où $f\'(x) = 0$ avec un changement de signe, plus les deux bornes.'],
        [' auf dem Intervall. ', ' sur l’intervalle. '],
        ['Ein globales Extremum liegt am <b>Rand</b>: Dort ist $f\'$ nicht null.', 'Un extremum global se trouve à une <b>borne</b> : là, $f\'$ n’est pas nulle.'],
        ['Hier liegen beide globalen Extrema im Inneren.', 'Ici, les deux extremums globaux sont à l’intérieur.'],
        // drehraum (the rule below turns "Drehung um die x-Achse um 90°:" first; the pieces are for check.mjs)
        ['Drehung um die ', 'Rotation autour de l’axe des '], ['-Achse um ', ' de '],
        ['$. Die Koordinate längs der Drehachse bleibt gleich, ', '$. La coordonnée le long de l’axe de rotation ne change pas, '],
        ['die beiden anderen werden wie in der Ebene gedreht.', 'les deux autres tournent comme dans le plan.'],
        // verflechtung
        ['Zwischenprodukte: $', 'Produits intermédiaires : $'], ['Rohstoffe: $', 'matières premières : $'], ['In einem Schritt: $', 'En une seule étape : $'],
        ['$ gibt den Rohstoffbedarf je Endprodukt an, und $', '$ donne les besoins en matières premières par produit fini, et $'],
        ['Für ', 'Pour '], [' Tafeln und ', ' tablettes et '], [' Boxen braucht man ', ' boîtes, il faut '],
        [' ME Kakao, ', ' u. de cacao, '], [' ME Zucker und ', ' u. de sucre et '], [' ME Milch', ' u. de lait'], [' ME', ' u.'],
        // rettung
        ['Bei $x = ', 'Pour $x = '], ['$ m braucht sie ', '$ m, il lui faut '], [' s, am schnellsten ist sie bei ', ' s ; elle est la plus rapide pour '],
        ['$ m</b> mit ', '$ m</b>, avec '], [' s (grün).', ' s (en vert).'],
        ['Winkel zum Lot: im Sand $\\alpha = ', 'Angles avec la normale : sur le sable $\\alpha = '], ['$, im Wasser $\\beta = ', '$, dans l’eau $\\beta = '],
        ['$. Im Optimum ist $\\dfrac{\\sin\\alpha}{v_1} = \\dfrac{\\sin\\beta}{v_2}$: ', '$. À l’optimum, $\\dfrac{\\sin\\alpha}{v_1} = \\dfrac{\\sin\\beta}{v_2}$ : '],
        ['$ und $\\dfrac{\\sin ', '$ et $\\dfrac{\\sin '], ['$, das Brechungsgesetz.', '$ : la loi de la réfraction (Snell-Descartes).'],
        // fixpunkt
        ['Hier ist $\\varphi\'(x^*) = 0$: Die Folge konvergiert extrem schnell, die Zahl der richtigen Stellen verdoppelt sich etwa bei jedem Schritt (das ist das Newton-Verfahren für $x^2 - 2 = 0$).',
            'Ici, $\\varphi\'(x^*) = 0$ : la suite converge extrêmement vite, le nombre de décimales exactes double à peu près à chaque étape (c’est la méthode de Newton pour $x^2 - 2 = 0$).'],
        ['Wegen $|\\varphi\'(x^*)| < 1$ ist der Fixpunkt <b>anziehend</b>: Nahe bei $x^*$ schrumpft der Fehler bei jedem Schritt etwa um diesen Faktor.',
            'Comme $|\\varphi\'(x^*)| < 1$, le point fixe est <b>attractif</b> : près de $x^*$, l’erreur est multipliée à chaque étape à peu près par ce facteur.'],
        [' Weil $\\varphi\' < 0$ ist, springt die Folge um den Fixpunkt herum (Spirale).', ' Comme $\\varphi\' < 0$, la suite saute d’un côté à l’autre du point fixe (spirale).'],
        [' Weil $\\varphi\' > 0$ ist, nähert sie sich von einer Seite (Treppe).', ' Comme $\\varphi\' > 0$, elle s’en approche d’un seul côté (escalier).'],
        ['Hier ist $|\\varphi\'(x^*)| = 1$: Der Satz sagt nichts. Bei $\\varphi(x) = \\tfrac2x$ springt die Folge ewig zwischen zwei Werten hin und her, ein Zyklus.',
            'Ici, $|\\varphi\'(x^*)| = 1$ : le théorème ne dit rien. Avec $\\varphi(x) = \\tfrac2x$, la suite saute indéfiniment entre deux valeurs : c’est un cycle.'],
        ['Wegen $|\\varphi\'(x^*)| > 1$ ist der Fixpunkt <b>abstoßend</b>: Selbst ganz nahe bei $x^*$ wächst der Fehler, die Folge läuft weg.',
            'Comme $|\\varphi\'(x^*)| > 1$, le point fixe est <b>répulsif</b> : même tout près de $x^*$, l’erreur grandit et la suite s’éloigne.'],
        ['$ mit $\\varphi(x) = ', '$ avec $\\varphi(x) = '], ['$, Fixpunkt $x^* \\approx ', '$, point fixe $x^* \\approx '],
        ['$ (grün), $|\\varphi\'(x^*)| \\approx ', '$ (en vert), $|\\varphi\'(x^*)| \\approx '], ['\\text{sehr groß}', '\\text{très grand}'],
    ],
    rule: [
        // book fr-9 mathegy11lk-fr:
        // stetigkeit: "<b>Stetig an der Stelle 1:</b>" → "<b>Continue en 1 :</b>" (the no-break space before the colon)
        [/<b>Stetig an der Stelle ([^:<]+):<\/b>/g, '<b>Continue en $1 :</b>'],
        // linapprox: "Tangente in $x_0 = 4$: $t(x) = …$" → the no-break space before the colon
        [/(Tangente in \$x_0 = [^$]*\$): \$/g, '$1 : $'],
        // randextrema: the interval "[-2;\, 3]" (a space after \,) → "[-2\,;\,3]", as the point rule of js/buch-fr.js writes it
        [/\[([-−]?\d+(?:\{,\}\d+)?);\\, ([-−]?\d+(?:\{,\}\d+)?)\]/g, '[$1\\,;\\,$2]'],
        // drehraum: "Drehung um die x-Achse um 90°: $" → "Rotation autour de l’axe des x de 90° : $"
        [/Drehung um die ([xyz])-Achse um (\d+)°: \$/g, 'Rotation autour de l’axe des $1 de $2° : $'],
    ]
});
