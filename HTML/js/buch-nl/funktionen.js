/* js/buch-nl/funktionen.js — Dutch for the widgets of js/buch-funktionen.js.
 * Loaded by the Dutch editions right after js/buch-funktionen.js; the engine and the shared words are in js/buch-nl.js.
 *   word    a whole label → its Dutch
 *   phrase  German sentence pieces exactly as the widget source writes them → Dutch
 *   rule    word order and notation (after the point rules of js/buch-nl.js, before its header rules)
 * Numbers keep their German form (0,5 · 10.000 · 30 %); never write a rule that can match digits around a comma or a
 * point without German words around them - SVG coordinates are written "x,y" (tools/buch-es/auftrag.md, section 5).
 * Package arch3 (08.11.2026): what every book needs goes below the nl0 line, what one book needs below its own comment
 * line, every entry ending with a comma. Search the dictionaries before writing a string (grep -n "<German>" HTML/js/buch-nl/*.js).
 * Terms: tools/buch-nl/woordenlijst.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang nl
 */
window.BuchNL && BuchNL.add('funktionen', {
    word: {
        // nl0: the cover of the start page (BGY 11 mathe11) and the helpers of the module (outside every widget; check.mjs funktionen/*)
        'Titelbild: Parabel, Sinuskurve, Exponentialfunktion und Gerade': 'Omslag: parabool, sinusoïde, exponentiële functie en lijn',
        'Parabel': 'Parabool', 'Liegende Spitze': 'Liggende punt', 'Liegende Parabel': 'Liggende parabool', 'Wurzel': 'Wortel',
        'Hyperbel': 'Hyperbool', 'Betrag': 'Absolute waarde',
        'Rechts von $x = -1$ trifft jede senkrechte Gerade die Kurve zweimal: Zu $x = 1$ gehören $y = 2$ und $y = -2$.':
            'Rechts van $x = -1$ snijdt elke verticale lijn de kromme twee keer: bij $x = 1$ horen $y = 2$ en $y = -2$.',
        'Zu $x = 2$ gehören $y = 2$ und $y = -2$. Eine Funktion ordnet jedem $x$ aber genau ein $y$ zu.':
            'Bij $x = 2$ horen $y = 2$ en $y = -2$. Een functie kent aan elke $x$ echter precies één $y$ toe.',
        'zwei Nullstellen $x = 1 \\pm \\sqrt{1 - a}$': 'twee nulpunten $x = 1 \\pm \\sqrt{1 - a}$',
        'eine (doppelte) Nullstelle $x = 1$': 'één (dubbel) nulpunt $x = 1$',
        'keine Nullstelle': 'geen nulpunt',
        'Diskriminante: $x^2 - 2x + a = 0$ hat $D = 1 - a$.': 'Discriminant: $x^2 - 2x + a = 0$ heeft $D = 4 - 4a$.',
        'zwei Nullstellen $x = 0$ und $x = -a$': 'twee nulpunten $x = 0$ en $x = -a$',
        'eine doppelte Nullstelle $x = 0$': 'één dubbel nulpunt $x = 0$',
        'Ausklammern: $x^2 + ax = x(x + a) = 0$. Die Scheitel $S\\left(-\\tfrac{a}{2} \\mid -\\tfrac{a^2}{4}\\right)$ liegen alle auf der Parabel $y = -x^2$ (gestrichelt).':
            'Buiten haakjes brengen: $x^2 + ax = x(x + a) = 0$. De toppen $T\\left(-\\tfrac{a}{2}, -\\tfrac{a^2}{4}\\right)$ liggen allemaal op de parabool $y = -x^2$ (gestippeld).',
        'zwei Nullstellen $x = \\pm \\tfrac{2}{\\sqrt{k}}$': 'twee nulpunten $x = \\pm \\tfrac{2}{\\sqrt{k}}$',
        'keine Parabel, sondern die Gerade $y = -4$: keine Nullstelle': 'geen parabool, maar de lijn $y = -4$: geen nulpunt',
        'nach unten geöffnet mit dem Scheitel $(0 \\mid -4)$: keine Nullstelle': 'bergparabool met top $(0, -4)$: geen nulpunt',
        '$kx^2 = 4$ hat nur für $k > 0$ Lösungen. Der Fall $k = 0$ muss extra betrachtet werden, weil dann das $x^2$ verschwindet.':
            '$kx^2 = 4$ heeft alleen voor $k > 0$ oplossingen. Het geval $k = 0$ moet apart bekeken worden, omdat dan de $x^2$ verdwijnt.',
        'Zaun an der Mauer': 'Hek langs de muur',
        'Rechteck mit Umfang 24 cm': 'Rechthoek met omtrek 24 cm',
        // book nl-1 mathe11-nl:
        // detektiv ("keine" stands for no zeros, no symmetry, no asymptotes: "geen" fits all three)
        'Graph der gewählten Funktion': 'Grafiek van de gekozen functie', 'Alle aufdecken': 'Alles laten zien', 'aufdecken': 'laten zien',
        'Definitionsbereich': 'Domein', 'Wertebereich': 'Bereik', 'Nullstellen': 'Nulpunten', 'Monotonie': 'Stijgen en dalen',
        'Symmetrie': 'Symmetrie', 'Periodisch?': 'Periodiek?', 'Asymptoten': 'Asymptoten', 'nein': 'nee', 'keine': 'geen',
        // wachstum: Dutch letters, beginwaarde b, toename a (linear), groeifactor g
        'Sparen': 'Sparen', 'Kernzerfall': 'Radioactief verval', 'Eigene Werte': 'Eigen waarden',
        'Lineares und exponentielles Wachstum': 'Lineaire en exponentiële groei', 'Startwert $a$': 'Beginwaarde $b$',
        'linear: Änderung $m$ pro Schritt': 'lineair: toename $a$ per stap', 'exponentiell: Faktor $q$': 'exponentieel: groeifactor $g$',
        'Zeitraum': 'Periode',
        // gerade, parabel (vertex form a(x - p)^2 + q with the top T(p, q)), wurf
        'Gerade durch zwei verschiebbare Punkte': 'Lijn door twee versleepbare punten',
        'Streckfaktor $a$': 'Factor $a$', 'Verschiebung nach rechts $d$': 'Verschuiving naar rechts $p$',
        'Verschiebung nach oben $e$': 'Verschuiving omhoog $q$', 'Parabel mit verschiebbarem Scheitelpunkt': 'Parabool met versleepbare top',
        'Abwurfhöhe $h_0$': 'Beginhoogte $h_0$', 'Abwurfgeschwindigkeit $v_0$': 'Beginsnelheid $v_0$',
        'Höhe beim senkrechten Wurf': 'Hoogte bij een verticale worp', 't in s': 't in s', 'h in m': 'h in m',
        // einheitskreis, sinus (the Dutch form a + b sin(c(x - d))), tageslaenge
        'Abspielen': 'Afspelen', 'Anhalten': 'Stoppen', 'Winkel $\\alpha$': 'Hoek $\\alpha$', 'Einheitskreis und Sinuskurve': 'Eenheidscirkel en sinusoïde',
        'Amplitude $a$': 'Amplitude $b$', 'Faktor $b$ (Periode $\\tfrac{2\\pi}{b}$)': 'Factor $c$ (periode $\\tfrac{2\\pi}{c}$)',
        'Verschiebung $c$ nach rechts': 'Verschuiving $d$ naar rechts', 'Verschiebung $d$ nach oben': 'Evenwichtsstand $a$',
        'Sinusfunktion mit Parametern': 'Sinusfunctie met parameters',
        'Tag des Jahres': 'Dag van het jaar', 't in Tagen': 't in dagen', 'Stunden': 'uren', 'Tageslänge in Dresden': 'Daglengte in Dresden',
        // regression, anscombe
        'Kerze': 'Kaars', 'Bremsweg': 'Remweg', 'Abkühlen': 'Afkoelen', 'Weltbevölkerung': 'Wereldbevolking',
        'Brenndauer in h': 'Brandduur in h', 'Länge in cm': 'Lengte in cm', 'Tempo in km/h': 'Snelheid in km/h',
        'Bremsweg in m': 'Remweg in m', 'Zeit in min': 'Tijd in min', 'ΔT in °C': 'ΔT in °C', 'Jahr': 'Jaar', 'Mrd. Menschen': 'Mld. mensen',
        'Messreihe': 'Meetreeks',
        'Messpunkte und Regressionskurve': 'Meetpunten en regressiekromme', 'Messpunkte lassen sich verschieben': 'Meetpunten zijn versleepbaar',
        'Für ein exponentielles Modell müssen die Werte positiv sein.': 'Voor een exponentieel model moeten de waarden positief zijn.',
        'Datensatz': 'Dataset', 'Anscombe-Quartett': 'Kwartet van Anscombe',
        // umkehr, expgleichung (g^x = a, as the chapter writes it), parameter, graphquiz
        'Funktion und Umkehrfunktion, gespiegelt an y = x': 'Functie en inverse functie, gespiegeld in y = x',
        'Basis $a$': 'Grondtal $g$', 'rechte Seite $b$': 'rechterkant $a$', 'Lösen': 'Oplossen',
        'Die Basis muss positiv und von 1 verschieden sein.': 'Het grondtal moet positief en ongelijk aan 1 zijn.',
        'Grundfunktion': 'Basisfunctie', 'Grundfunktion und veränderte Funktion': 'Basisfunctie en veranderde functie',
        'Das ist die Grundfunktion selbst.': 'Dat is de basisfunctie zelf.',
        'Graph, zu dem der Term gesucht ist': 'Grafiek waarbij de formule wordt gezocht', 'Nächster Graph': 'Volgende grafiek',
    },
    phrase: [
        // nl0: the cover of the start page (BGY 11 mathe11) and the helpers of the module (outside every widget; check.mjs funktionen/*)
        // book nl-1 mathe11-nl:
        // parameter: c = 0 in f(c·x)
        ['mit $c = 0$ ist $g(x) = f(0)$ konstant', 'met $c = 0$ is $g(x) = f(0)$ constant'],
        // detektiv
        [' (doppelt)', ' (dubbel)'], ['fallend für ', 'dalend voor '], ['steigend für ', 'stijgend voor '],
        ['achsensymmetrisch zur $y$-Achse', 'symmetrisch in de $y$-as'], ['punktsymmetrisch zum Ursprung', 'puntsymmetrisch in de oorsprong'],
        ['überall steigend', 'overal stijgend'], ['fallend auf ', 'dalend op '], [' und fallend auf ', ' en dalend op '],
        [' (senkrecht) und ', ' (verticaal) en '], ['(waagerecht)', '(horizontaal)'], ['$ und $', '$ en $'],
        ['abwechselnd steigend und fallend', 'afwisselend stijgend en dalend'], ['ja, Periode ', 'ja, periode '],
        ['$ für $x', '$ voor $x'], ['$ mit $k', '$ met $k'],
        // wachstum (the numbers of years, days and steps: rules below)
        ['einfache Zinsen (30 € pro Jahr)', 'enkelvoudige interest (€ 30 per jaar)'], ['Zinseszins (3 % pro Jahr)', 'samengestelde interest (3% per jaar)'],
        ['linear: jeden Tag 6,25 Prozentpunkte weniger', 'lineair: elke dag 6,25 procentpunt minder'],
        ['Jod-131: Halbwertszeit 8 Tage', 'jodium-131: halveringstijd 8 dagen'],
        [' — in jedem Schritt wird mit <b>demselben Faktor</b> multipliziert', ' — bij elke stap wordt met <b>dezelfde factor</b> vermenigvuldigd'],
        [' — in jedem Schritt ', ' — bij elke stap '], ['geht <b>gleich viel</b> weg', 'gaat er <b>evenveel</b> af'],
        ['kommt <b>gleich viel</b> hinzu.', 'komt er <b>evenveel</b> bij.'],
        [', das sind ', ', dat is '], [' % pro Schritt. ', ' % per stap. '],
        ['linear', 'lineair'], ['exponentiell', 'exponentieel'], ['Verdopplungszeit', 'Verdubbelingstijd'], ['Halbwertszeit', 'Halveringstijd'],
        // gerade: y = ax + b
        ['Beide Punkte liegen senkrecht übereinander. Die Gerade $x = ', 'Beide punten liggen verticaal boven elkaar. De lijn $x = '],
        ['$ ist <b>kein</b> Funktionsgraph.', '$ is <b>geen</b> grafiek van een functie.'],
        ['Steigung $m = ', 'Richtingscoëfficiënt $a = '], ['Achsenabschnitt $n = ', 'startgetal $b = '], ['$ (weißer Punkt)', '$ (wit punt)'],
        [' · Nullstelle $x_0 = ', ' · nulpunt $x_0 = '], [' · waagerechte Gerade', ' · horizontale lijn'],
        // parabel
        ['Für $a = 0$ ist der Graph keine Parabel, sondern eine Gerade.', 'Voor $a = 0$ is de grafiek geen parabool, maar een lijn.'],
        ['eine (doppelte) Nullstelle: $x = ', 'één (dubbel) nulpunt: $x = '], ['Nullstellen: $x_1 = ', 'nulpunten: $x_1 = '],
        ['Scheitelpunktform: $f(x) = ', 'Topvorm: $f(x) = '], [' · Scheitel $S(', ' · top $T('], ['Normalform: $f(x) = ', 'Standaardvorm: $f(x) = '],
        // wurf
        ['Höchster Punkt nach $t_S = ', 'Hoogste punt na $t_T = '], ['Aufprall nach $', 'Landing na $'],
        // einheitskreis, sinus, tageslaenge
        ['$ im Bogenmaß · ', '$ in radialen · '], ['Amplitude $|a| = ', 'Amplitude $|b| = '], [' · Periode $p = ', ' · periode $p = '],
        [' · Mittellinie $y = ', ' · evenwichtsstand $y = '], [' · Wertebereich $', ' · bereik $'], ['$ · am ', '$ · op '],
        [' min</b> Tageslicht', ' min</b> daglicht'],
        // regression, anscombe
        ['Wann ist die Kerze abgebrannt?', 'Wanneer is de kaars opgebrand?'], ['Bremsweg bei 150 km/h?', 'Remweg bij 150 km/h?'],
        ['Temperaturunterschied nach 45 min?', 'Temperatuurverschil na 45 min?'], ['Prognose für 2050?', 'Voorspelling voor 2050?'],
        ['Regressionsfunktion: $', 'Regressiefunctie: $'], [' &nbsp;mit $x$ = Jahre seit 1950', ' &nbsp;met $x$ = jaren sinds 1950'],
        ['Bestimmtheitsmaß $R^2 = ', 'Determinatiecoëfficiënt $R^2 = '], ['(passt sehr gut)', '(past heel goed)'], ['(passt gut)', '(past goed)'],
        ['(passt mäßig)', '(past matig)'], [' Das Modell sagt: $f(', ' Het model voorspelt: $f('], ['Regressionsgerade: $', 'Regressielijn: $'],
        ['Datensatz', 'Dataset'],
        // umkehr, expgleichung (the points have their Dutch comma already: js/buch-nl.js)
        ['$ · Der Punkt $P(', '$ · Het punt $P('], ['$ auf $f$ wird zum Punkt $P', '$ op $f$ wordt het punt $P'], ['$ auf $f^{-1}$.', '$ op $f^{-1}$.'],
        ['Keine Lösung: $', 'Geen oplossing: $'], ['Probe: $', 'Controle: $'],
        // parameter ("Der Graph ist …": "De grafiek is …")
        ['gespiegelt an der $x$-Achse', 'gespiegeld in de $x$-as'], ['gespiegelt an der $y$-Achse', 'gespiegeld in de $y$-as'],
        [', in $x$-Richtung mit Faktor ', ', in de $x$-richting met factor '], ['Der Graph ist ', 'De grafiek is '],
        // parameter: the slider labels "$c \cdot f(x)$: strecken in $y$-Richtung"
        [': strecken in $y$-Richtung', ': vermenigvuldigen in de $y$-richting'], [': verschieben in $y$-Richtung', ': verschuiven in de $y$-richting'],
        [': stauchen in $x$-Richtung', ': vermenigvuldigen in de $x$-richting'], [': verschieben in $x$-Richtung', ': verschuiven in de $x$-richting'],
    ],
    rule: [
        // nl0: notation of the module, for every book
        [/-\\tfrac\{n\}\{m\}/g, '-\\tfrac{b}{a}'],
        // book nl-1 mathe11-nl:
        // tageslaenge: "21. Jun" → "21 jun" with the Dutch short months
        [/(\d+)\. (Jan|Feb|Mär|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Dez)(?![a-zä])/g, (m, d, mo) => d + ' ' + { Jan: 'jan', Feb: 'feb', 'Mär': 'mrt', Apr: 'apr', Mai: 'mei', Jun: 'jun', Jul: 'jul', Aug: 'aug', Sep: 'sep', Okt: 'okt', Nov: 'nov', Dez: 'dec' }[mo]],
        // wachstum: "40 Jahre" → "40 jaar"
        [/^(\d+) (Jahre|Tage|Schritte)$/, (m, n, u) => n + ' ' + ({ Jahre: 'jaar', Tage: 'dagen', Schritte: 'stappen' }[u])],
        [/\. Nach \$([^$]*)\$ (Jahren|Tagen|Schritten) wäre alles verbraucht\./g,
            (m, x, u) => '. Na $' + x + '$ ' + { Jahren: 'jaar', Tagen: 'dagen', Schritten: 'stappen' }[u] + ' zou alles op zijn.'],
        [/(Verdopplungszeit|Halbwertszeit): \$([^$]*)\$ (Jahre|Tage|Schritte)\./g,
            (m, w, x, u) => (w === 'Verdopplungszeit' ? 'Verdubbelingstijd' : 'Halveringstijd') + ': $' + x + '$ ' + { Jahre: 'jaar', Tage: 'dagen', Schritte: 'stappen' }[u] + '.'],
        // parabel
        [/keine Nullstellen: Der Scheitel liegt (über|unter) der \$x\$-Achse und die Parabel ist nach (oben|unten) geöffnet\./g,
            (m, a, b) => 'geen nulpunten: de top ligt ' + (a === 'über' ? 'boven' : 'onder') + ' de $x$-as en het is een ' + (b === 'oben' ? 'dalparabool' : 'bergparabool') + '.'],
        // sinus: the Dutch order a + b sin(c(x - d)), "$f(x) = 2\sin(x) + 3$" → "$f(x) = 3 + 2\sin(x)$"
        [/\$f\(x\) = (-?)((?:\d+(?:\{,\}\d+)?)?\\sin\((?:[^()$]|\([^()$]*\))*\)) ([+-]) (\d+(?:\{,\}\d+)?)\$/g,
            (m, neg, part, s, d) => '$f(x) = ' + (s === '-' ? '-' : '') + d + (neg ? ' - ' : ' + ') + part + '$'],
        // wurf: "… in $8,84\,\text{m}$ Höhe."
        [/\$ in \$([^$]*)\$ Höhe\. /g, (m, h) => '$ op een hoogte van $' + h + '$. '],
        // expgleichung: "2^x ist immer positiv, kann also nie -3 werden."
        [/\^x\$ ist immer positiv, kann also nie \$([^$]*)\$ werden\./g, (m, b) => '^x$ is altijd positief, dus nooit $' + b + '$.'],
        // expgleichung, umkehr: logarithms the Dutch way, lg → log, log_a b → ^a log b
        [/\\lg(?![a-z])/g, '\\log'],
        [/\\log_\{([^{}]*)\}\s*/g, '{}^{$1}\\!\\log '], [/\\log_([0-9a-zA-Z])\s*/g, '{}^{$1}\\!\\log '],
        // parameter
        [/in \$([xy])\$-Richtung mit Faktor \$([^$]+)\$ (gestreckt|gestaucht)/g,
            (m, ax, f, w) => 'vermenigvuldigd in de $' + ax + '$-richting met factor $' + f + '$'],
        [/ und mit \$([^$]+)\$ gestreckt/g, (m, f) => ' en vermenigvuldigd met $' + f + '$'],
        [/ und mit \$([^$]+)\$ gestaucht/g, (m, f) => ' en vermenigvuldigd met $' + f + '$'],
        [/um \$([^$]+)\$ nach (links|rechts|oben|unten) verschoben/g,
            (m, c, d) => '$' + c + '$ ' + { links: 'naar links', rechts: 'naar rechts', oben: 'omhoog', unten: 'omlaag' }[d] + ' verschoven'],
        // graphquiz score: "3 richtig" → "3 goed"
        [/^(\d+) richtig$/, (m, n) => n + ' goed'],
    ]
});
