/* js/buch-fr/exponential.js — French for the widgets of js/buch-exponential.js.
 * Loaded by the French editions right after js/buch-exponential.js; the engine and the shared words are in js/buch-fr.js.
 *   word    a whole label → its French
 *   phrase  German sentence pieces exactly as the widget source writes them → French
 *   rule    word order and notation (after the point and interval rules of js/buch-fr.js, before its header rules)
 * Numbers keep their German form (0,5 · 10 000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * French typography: the no-break space (U+00A0, the character itself) before : ; ! ? and inside « », the apostrophe ’.
 * Terms: tools/buch-fr/glossaire.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang fr
 * French round 2 (25.10.2026): five books at the same time, each has its own comment line in word, phrase and rule -
 * write only right below your book's line, every entry ending with a comma. Before translating a string, search the
 * other French dictionaries for it. The Italian file js/buch-it/exponential.js shows which German strings the widgets write.
 */
window.BuchFR && BuchFR.add('exponential', {
    word: {
        // book fr-6 mathegy10-fr:
        // wachstumsmodell (the models are feminine, as "croissance"; the helpers MODELS are reported for every page that loads the module)
        'beschränkt': 'bornée', 'logistisch': 'logistique',
        'Sparschwein: 50 € am Anfang, jede Woche kommen 20 € dazu.': 'Tirelire : 50 € au départ, on ajoute 20 € chaque semaine.',
        'Bakterienkultur: 200 Bakterien, jede Stunde 30 % mehr.': 'Culture de bactéries : 200 bactéries, 30 % de plus chaque heure.',
        'Ein Getränk aus dem Kühlschrank (6 °C) erwärmt sich auf Raumtemperatur (22 °C). Pro Minute schrumpft der Abstand zur Raumtemperatur um 15 %.':
            'Une boisson sortie du réfrigérateur (6 °C) se réchauffe jusqu’à la température de la pièce (22 °C). Chaque minute, l’écart avec la température de la pièce diminue de 15 %.',
        'Ein Gerücht an einer Schule mit 800 Schülerinnen und Schülern: Am Anfang kennen es 10.': 'Une rumeur dans une école de 800 élèves : au début, 10 la connaissent.',
        'Betrag in €': 'Montant en €', 'Anzahl': 'Nombre', 'Temperatur in °C': 'Température en °C', 'kennen es': 'la connaissent',
        'Zunahme $d$ pro Schritt': 'Hausse $d$ par étape', 'Wachstumsfaktor $q$': 'Facteur de croissance $q$',
        'Anteil $k$ des Abstands pro Schritt': 'Proportion $k$ de l’écart par étape', 'Wachstumskonstante $k$': 'Constante de croissance $k$',
        'Anfangsbestand $B_0$': 'Quantité initiale $B_0$', 'Schranke $S$': 'Borne $S$', 'Anzahl der Schritte': 'Nombre d’étapes',
        'Bestand Schritt für Schritt': 'La quantité étape par étape',
        'Die <b>Differenz</b> aufeinanderfolgender Werte ist konstant.': 'La <b>différence</b> de deux valeurs successives est constante.',
        // logfunktion
        'Verschiebung $d$ nach rechts': 'Translation $d$ vers la droite', 'Verschiebung $e$ nach oben': 'Translation $e$ vers le haut',
        'Logarithmusfunktion mit Asymptote': 'Fonction logarithme et son asymptote', 'senkrechte Asymptote': 'asymptote verticale',
        'Die Basis $a = 1$ ist nicht erlaubt: $1^y$ ist immer $1$, man kann also nicht nach $y$ auflösen.':
            'La base $a = 1$ n’est pas autorisée : $1^y$ vaut toujours $1$, on ne peut donc pas isoler $y$.',
        // rechenschieber
        'Faktor $b$': 'Facteur $b$',
        'Rechenschieber: verschiebbare Zunge über einer festen Skala': 'Règle à calcul : une réglette mobile au-dessus d’une échelle fixe',
        // verkettung
        '$f(x)$:': '$f(x)$ :', '$g(x)$:': '$g(x)$ :', 'Verknüpfung:': 'Opération :', 'Verknüpfung': 'Opération',
        'Funktion f': 'Fonction f', 'Funktion g': 'Fonction g', 'Zwei Funktionen und ihre Verknüpfung': 'Deux fonctions et leur combinaison', 'Ergebnis': 'Résultat',
        // expanwendung
        'Medikament': 'Médicament', 'Bakterien': 'Bactéries', 'Sachverhalt': 'Situation',
        '2000 € werden mit 3 % pro Jahr verzinst.': '2000 € sont placés à 3 % d’intérêts par an.',
        'Kohlenstoff-14 zerfällt mit einer Halbwertszeit von 5730 Jahren.': 'Le carbone 14 se désintègre avec une demi-vie de 5730 ans.',
        '400 mg eines Wirkstoffs, der Körper baut pro Stunde 20 % ab.': '400 mg d’une substance active, le corps en élimine 20 % par heure.',
        '500 Bakterien, die Anzahl verdoppelt sich alle 3 Stunden.': '500 bactéries, leur nombre double toutes les 3 heures.',
        'Zielwert $Z$': 'Valeur cible $Z$', 'Wachstums- oder Zerfallskurve mit Zielwert': 'Courbe de croissance ou de décroissance avec une valeur cible',
        't in Jahre': 't en années', 't in Stunden': 't en heures', 'in €': 'en €', 'in %': 'en %', 'in mg': 'en mg',
        // funktionsklassen (the buttons name the function: "fonction polynôme", "fonction rationnelle" …)
        'ganzrational': 'polynôme', 'gebrochenrational': 'rationnelle', 'logarithmisch': 'logarithme', 'trigonometrisch': 'trigonométrique',
        'Funktionsklasse': 'Famille de fonctions', 'Typische Graphen der gewählten Funktionsklasse': 'Courbes typiques de la famille de fonctions choisie',
        'lg x': 'log x', 'Term': 'Expression', 'Verlauf': 'Allure', 'Besonderheit': 'Particularité', 'Asymptote': 'Asymptote', 'Nullstelle und Asymptote': 'Zéro et asymptote',
        '$a_n x^n + \\ldots + a_1 x + a_0$, zum Beispiel $x^2$ oder $x^3 - 3x$': '$a_n x^n + \\ldots + a_1 x + a_0$, par exemple $x^2$ ou $x^3 - 3x$',
        'alle reellen Zahlen': 'tous les réels', 'höchstens $n$ Stück (Grad $n$)': 'au plus $n$ (degré $n$)',
        'für große $|x|$ bestimmt der Summand mit dem höchsten Exponenten den Verlauf, keine Asymptoten':
            'pour les grandes valeurs de $|x|$, le terme de plus haut degré détermine l’allure ; pas d’asymptote',
        'nur gerade Exponenten: achsensymmetrisch zur $y$-Achse, nur ungerade: punktsymmetrisch zum Ursprung':
            'seulement des exposants pairs : symétrique par rapport à l’axe des $y$ ; seulement des impairs : symétrique par rapport à l’origine',
        'ein Bruch mit $x$ im Nenner, zum Beispiel $\\tfrac{1}{x}$ oder $\\tfrac{2}{x - 1} + 1$':
            'une fraction avec $x$ au dénominateur, par exemple $\\tfrac{1}{x}$ ou $\\tfrac{2}{x - 1} + 1$',
        'alle reellen Zahlen außer den Nullstellen des Nenners': 'tous les réels sauf les zéros du dénominateur',
        'Fahrzeit $t = \\tfrac{s}{v}$ bei fester Strecke': 'durée du trajet $t = \\tfrac{s}{v}$ pour une distance fixe',
        '$\\sqrt{x}$, verschoben oder gestreckt': '$\\sqrt{x}$, translatée ou étirée',
        '$x \\geq 0$ (beim Grundtyp)': '$x \\geq 0$ (pour la fonction de référence)', '$y \\geq 0$ (beim Grundtyp)': '$y \\geq 0$ (pour la fonction de référence)',
        'Umkehrfunktion von $y = x^2$ für $x \\geq 0$, keine Asymptote': 'fonction réciproque de $y = x^2$ pour $x \\geq 0$, pas d’asymptote',
        '$a \\cdot b^x$ mit $b > 0$, $b \\neq 1$': '$a \\cdot b^x$ avec $b > 0$, $b \\neq 1$',
        '$y > 0$ (für $a > 0$), also keine Nullstelle': '$y > 0$ (pour $a > 0$), donc aucun zéro',
        'die $x$-Achse, alle Graphen $b^x$ gehen durch $(0 \\mid 1)$': 'l’axe des $x$ ; toutes les courbes de $b^x$ passent par $(0\\,;\\,1)$',
        'Wachstum und Zerfall, Zinseszins': 'croissance et décroissance, intérêts composés',
        '$\\log_a x$ mit $a > 0$, $a \\neq 1$': '$\\log_a x$ avec $a > 0$, $a \\neq 1$',
        'Nullstelle $x = 1$, senkrechte Asymptote: die $y$-Achse': 'zéro $x = 1$, asymptote verticale : l’axe des $y$',
        'Richterskala, Dezibel, pH-Wert': 'échelle de Richter, décibels, pH',
        '$\\sin x$, $\\cos x$, $\\tan x$, auch $a \\cdot \\sin(b(x - c)) + d$': '$\\sin x$, $\\cos x$, $\\tan x$, et aussi $a \\cdot \\sin(b(x - c)) + d$',
        'Sinus und Kosinus: alle reellen Zahlen; Tangens: ohne $\\tfrac{\\pi}{2} + k\\pi$': 'sinus et cosinus : tous les réels ; tangente : sauf $\\tfrac{\\pi}{2} + k\\pi$',
        'Sinus und Kosinus: $-1 \\leq y \\leq 1$; Tangens: alle reellen Zahlen': 'sinus et cosinus : $-1 \\leq y \\leq 1$ ; tangente : tous les réels',
        'Schwingungen, Gezeiten, Tageslänge': 'oscillations, marées, durée du jour',
        // skizze
        'Nächster Schritt': 'Étape suivante', 'Graph zeigen': 'Afficher la courbe', 'Andere Funktion': 'Autre fonction',
        'Skizze: charakteristische Punkte und Asymptoten': 'Esquisse : points caractéristiques et asymptotes',
        'Grundfunktion $2^x$, um 4 nach <b>unten</b> verschoben: waagerechte Asymptote $y = -4$.': 'Fonction de référence $2^x$, translatée de 4 vers le <b>bas</b> : asymptote horizontale $y = -4$.',
        'Schnittpunkt mit der $y$-Achse: $f(0) = 1 - 4 = -3$.': 'Intersection avec l’axe des $y$ : $f(0) = 1 - 4 = -3$.',
        'Nullstelle: $2^x = 4 \\Rightarrow x = 2$.': 'Zéro : $2^x = 4 \\Rightarrow x = 2$.',
        'Ein Punkt mehr: $f(3) = 8 - 4 = 4$. Streng monoton steigend.': 'Un point de plus : $f(3) = 8 - 4 = 4$. Strictement croissante.',
        'Scheitelpunktform: Scheitel $S(1 \\mid 4)$, nach <b>unten</b> geöffnet, so breit wie die Normalparabel.':
            'Forme canonique : sommet $S(1\\,;\\,4)$, tournée vers le <b>bas</b>, de même largeur que la parabole de référence.',
        'Nullstellen: $(x - 1)^2 = 4 \\Rightarrow x - 1 = \\pm 2$, also $x = -1$ und $x = 3$.': 'Zéros : $(x - 1)^2 = 4 \\Rightarrow x - 1 = \\pm 2$, donc $x = -1$ et $x = 3$.',
        'Schnittpunkt mit der $y$-Achse: $f(0) = -1 + 4 = 3$, gespiegelt an $x = 1$ auch $(2 \\mid 3)$.':
            'Intersection avec l’axe des $y$ : $f(0) = -1 + 4 = 3$, et par symétrie par rapport à $x = 1$, aussi $(2\\,;\\,3)$.',
        'Grundfunktion $\\tfrac1x$, um 2 nach rechts verschoben: <b>Polstelle</b> $x = 2$ mit senkrechter Asymptote.':
            'Fonction de référence $\\tfrac1x$, translatée de 2 vers la droite : <b>pôle</b> $x = 2$ avec une asymptote verticale.',
        'Um 1 nach oben verschoben: waagerechte Asymptote $y = 1$.': 'Translatée de 1 vers le haut : asymptote horizontale $y = 1$.',
        'Nullstelle: $\\tfrac{1}{x - 2} = -1 \\Rightarrow x - 2 = -1 \\Rightarrow x = 1$.': 'Zéro : $\\tfrac{1}{x - 2} = -1 \\Rightarrow x - 2 = -1 \\Rightarrow x = 1$.',
        '$y$-Achse: $f(0) = -\\tfrac12 + 1 = \\tfrac12$; rechts der Polstelle zum Beispiel $f(3) = 2$.': 'Axe des $y$ : $f(0) = -\\tfrac12 + 1 = \\tfrac12$ ; à droite du pôle, par exemple $f(3) = 2$.',
        'Grundfunktion $\\log_2 x$, um 1 nach <b>links</b> verschoben: Definitionsbereich $x > -1$, senkrechte Asymptote $x = -1$.':
            'Fonction de référence $\\log_2 x$, translatée de 1 vers la <b>gauche</b> : ensemble de définition $x > -1$, asymptote verticale $x = -1$.',
        'Nullstelle: $x + 1 = 1 \\Rightarrow x = 0$. Sie ist zugleich der Schnittpunkt mit der $y$-Achse.': 'Zéro : $x + 1 = 1 \\Rightarrow x = 0$. C’est aussi le point d’intersection avec l’axe des $y$.',
        'Weitere Punkte an Zweierpotenzen: $f(1) = 1$, $f(3) = 2$, $f(7) = 3$.': 'D’autres points là où $x + 1$ est une puissance de 2 : $f(1) = 1$, $f(3) = 2$, $f(7) = 3$.',
        'Mittellinie $y = 1$, Amplitude 2: Die Werte liegen zwischen $-1$ und $3$.': 'Axe médian $y = 1$, amplitude 2 : les valeurs sont comprises entre $-1$ et $3$.',
        'Periode $2\\pi$ wie beim Sinus. Hochpunkt bei $\\tfrac{\\pi}{2}$, Tiefpunkt bei $\\tfrac{3\\pi}{2}$.': 'Période $2\\pi$, comme pour le sinus. Maximum en $\\tfrac{\\pi}{2}$, minimum en $\\tfrac{3\\pi}{2}$.',
        'Auf der Mittellinie bei $0$, $\\pi$ und $2\\pi$.': 'Sur l’axe médian en $0$, $\\pi$ et $2\\pi$.',
        'Ausklammern: $x(x^2 - 4) = x(x - 2)(x + 2)$, Nullstellen $-2$, $0$ und $2$.': 'Factoriser : $x(x^2 - 4) = x(x - 2)(x + 2)$, zéros $-2$, $0$ et $2$.',
        'Nur ungerade Exponenten: <b>punktsymmetrisch</b> zum Ursprung. Für große $x$ entscheidet $x^3$: rechts nach oben, links nach unten.':
            'Seulement des exposants impairs : <b>symétrique par rapport à l’origine</b>. Pour les grands $x$, c’est $x^3$ qui décide : vers le haut à droite, vers le bas à gauche.',
        'Zwei Punkte: $f(1) = -3$ und, symmetrisch, $f(-1) = 3$.': 'Deux points : $f(1) = -3$ et, par symétrie, $f(-1) = 3$.',
        'Jetzt die Punkte glatt verbinden und die Asymptoten beachten. So sieht der Graph aus.': 'Maintenant, relie les points par une courbe régulière en tenant compte des asymptotes. Voici la courbe.',
        'Überleg zuerst selbst: Welche Grundfunktion steckt darin? Wie ist sie verschoben oder gestreckt? Dann Schritt für Schritt aufdecken.':
            'Réfléchis d’abord toi-même : quelle fonction de référence s’y cache ? Comment est-elle translatée ou étirée ? Ensuite, dévoile étape par étape.',
        'Wochen': 'semaines', 'Minuten': 'minutes',
        // book fr-7 mathegy11-fr:
        // book fr-9 mathegy11lk-fr:
        // book fr-21 mathe10-fr:
    },
    phrase: [
        // book fr-6 mathegy10-fr:
        // wachstumsmodell
        ['rekursiv: $B_0 = ', 'par récurrence : $B_0 = '], ['explizit: $', 'explicite : $'],
        ['Der <b>Quotient</b> aufeinanderfolgender Werte ist konstant: ', 'Le <b>quotient</b> de deux valeurs successives est constant : '],
        [' % pro Schritt (Abnahme).', ' % par étape (baisse).'], [' % pro Schritt.', ' % par étape.'], ['Der Bestand bleibt gleich.', 'La quantité ne change pas.'],
        ['Der <b>Abstand zur Schranke</b> schrumpft mit dem Faktor $1 - k = ', 'L’<b>écart à la borne</b> diminue avec le facteur $1 - k = '],
        ['$, der Bestand kommt $S$ immer näher, ohne sie zu überschreiten.', '$ ; la quantité se rapproche toujours plus de $S$ sans la dépasser.'],
        ['Am Anfang wächst der Bestand fast exponentiell, in der Nähe von $\\tfrac{S}{2} = ', 'Au début, la quantité croît presque exponentiellement ; c’est près de $\\tfrac{S}{2} = '],
        ['$ am schnellsten, dann bremst ihn die Schranke. Eine einfache explizite Formel gibt es für diese schrittweise Rechnung nicht, man rechnet Schritt für Schritt, am besten mit einer Tabellenkalkulation.',
            '$ qu’elle croît le plus vite, puis la borne la freine. Il n’existe pas de formule explicite simple pour ce calcul pas à pas : on calcule étape par étape, de préférence avec un tableur.'],
        [' <b>Achtung:</b> Bei so großem $k$ springt der Bestand über die Schranke und schwingt.', ' <b>Attention :</b> avec un $k$ aussi grand, la quantité saute au-dessus de la borne et oscille.'],
        // funktionsklassen: cells that begin with <b> are not looked up as whole labels
        ['<b>Polstellen</b> mit senkrechten Asymptoten, oft eine waagerechte Asymptote', '<b>pôles</b> avec des asymptotes verticales, souvent une asymptote horizontale'],
        ['<b>periodisch</b>: Periode $2\\pi$ bei Sinus und Kosinus, $\\pi$ beim Tangens', '<b>périodique</b> : période $2\\pi$ pour le sinus et le cosinus, $\\pi$ pour la tangente'],
        // logfunktion
        ['streng monoton <b>steigend</b> ($a > 1$)', 'strictement <b>croissante</b> ($a > 1$)'], ['streng monoton <b>fallend</b> ($0 < a < 1$)', 'strictement <b>décroissante</b> ($0 < a < 1$)'],
        ['Definitionsbereich $x > ', 'Ensemble de définition : $x > '], ['$ · Wertebereich: alle reellen Zahlen · ', '$ · ensemble des images : tous les réels · '],
        ['Nullstelle: $', 'Zéro : $'], ['$ · weiße Punkte: $(', '$ · points blancs : $('],
        [' · Gespiegelt an $y = x$ wird daraus die Exponentialfunktion $y = ', ' · Par symétrie par rapport à $y = x$, on obtient la fonction exponentielle $y = '],
        // rechenschieber (the rule of js/buch-fr/funktionen.js has turned \lg into \log before the pieces)
        ['Der Anfang der oberen Skala steht über $a = ', 'Le début de l’échelle du haut est au-dessus de $a = '], ['$, der Läufer über $b = ', '$, le curseur au-dessus de $b = '],
        ['$ auf der oberen Skala. Unten liest man ab: <b>$', '$ sur l’échelle du haut. En bas, on lit : <b>$'],
        [' · Weil $a \\cdot b > 10$ ist, steht hier der <b>rechte</b> Index über $a$, man liest $\\tfrac{a \\cdot b}{10}$ ab: $a \\cdot b = ',
            ' · Comme $a \\cdot b > 10$, c’est ici l’index de <b>droite</b> qui est au-dessus de $a$ ; on lit $\\tfrac{a \\cdot b}{10}$ : $a \\cdot b = '],
        ['Längen auf der Skala sind Logarithmen: $\\log ', 'Les longueurs sur l’échelle sont des logarithmes : $\\log '],
        ['Längen auf der Skala sind Logarithmen: $\\lg ', 'Les longueurs sur l’échelle sont des logarithmes : $\\log '],
        ['$. Aus dem Addieren der Längen wird ein Multiplizieren der Zahlen.', '$. Additionner les longueurs revient à multiplier les nombres.'],
        // verkettung
        ['Unter der Wurzel darf keine negative Zahl stehen.', 'Sous la racine, il ne peut pas y avoir de nombre négatif.'], ['Ein Nenner darf nicht null werden.', 'Un dénominateur ne peut pas être nul.'],
        [' Darum muss man prüfen, für welche $x$ die innere Funktion einen erlaubten Wert liefert.', ' Il faut donc vérifier pour quels $x$ la fonction intérieure donne une valeur autorisée.'],
        ['Innere Funktion: $', 'Fonction intérieure : $'], ['$, äußere Funktion: $', '$, fonction extérieure : $'], ['$. Man setzt die innere in die äußere ein.', '$. On substitue la fonction intérieure dans la fonction extérieure.'],
        ['Beim Quotienten fallen außerdem alle Stellen weg, an denen $g(x) = 0$ ist.', 'Pour le quotient, on exclut en plus toutes les valeurs où $g(x) = 0$.'],
        ['Der Definitionsbereich ist der Bereich, in dem <b>beide</b> Funktionen definiert sind.', 'L’ensemble de définition est l’ensemble où <b>les deux</b> fonctions sont définies.'],
        ['Im Allgemeinen ist $f(g(x)) \\neq g(f(x))$: Probier die andere Reihenfolge.', 'En général, $f(g(x)) \\neq g(f(x))$ : essaie l’autre ordre.'],
        // skizze
        ['Skizziere ohne Taschenrechner:', 'Esquisse sans calculatrice :'],
        // expanwendung: the pieces of the question alone (the rule below turns the whole question first)
        ['Wann ist das Kapital auf', 'Quand le capital atteint-il'], ['Wann ist der Anteil auf', 'Quand la part tombe-t-elle à'],
        ['Wann sind nur noch', 'Quand ne reste-t-il plus que'], ['Wann sind es', 'Quand y en a-t-il'],
        // book fr-7 mathegy11-fr:
        // book fr-9 mathegy11lk-fr:
        // book fr-21 mathe10-fr:
    ],
    rule: [
        // book fr-6 mathegy10-fr:
        // expanwendung: "Wann ist das Kapital auf 3000 €?" … the question as a whole, the French word order and its no-break space
        [/(Wann ist das Kapital auf|Wann ist der Anteil auf|Wann sind nur noch|Wann sind es) ([^<?]*?)( übrig)?\?/g,
            (m, q, x) => ({ 'Wann ist das Kapital auf': 'Quand le capital atteint-il ', 'Wann ist der Anteil auf': 'Quand la part tombe-t-elle à ',
                'Wann sind nur noch': 'Quand ne reste-t-il plus que ', 'Wann sind es': 'Quand y en a-t-il ' }[q]) + x + ' ?'],
        // expanwendung: the unit after the result ("… ≈ 13,7$ Jahre"); skizze: "(Funktion 2 von 6)"
        [/\$ Jahre<\/p>/g, '$ ans</p>'], [/\$ Stunden<\/p>/g, '$ heures</p>'],
        [/\(Funktion (\d+) von (\d+)\)/g, '(fonction $1 sur $2)'],
        // book fr-7 mathegy11-fr:
        // book fr-9 mathegy11lk-fr:
        // book fr-21 mathe10-fr:
    ]
});
