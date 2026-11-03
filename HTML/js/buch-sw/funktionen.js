/* js/buch-sw/funktionen.js — Swahili for the widgets of js/buch-funktionen.js.
 * Loaded by the Swahili editions right after js/buch-funktionen.js; the engine and the shared words are in js/buch-sw.js.
 *   word    a whole label → its Swahili
 *   phrase  German sentence pieces exactly as the widget source writes them → Swahili
 *   rule    word order and notation (after the number and point rules of js/buch-sw.js, which have already given every
 *           number its decimal point and turned every \mid into a comma - before its header rules)
 * A whole label (word) is looked up before the point rule, so its key is the German as the widget writes it, with \mid.
 * Notation as Kenyan schools teach it (in English): y = mx + c, the vertex form a(x - h)^2 + k with the vertex V(h, k).
 * Swahili puts the number after the noun ("miaka 40", "siku 8"): where a widget writes "40 Jahre", a rule turns it.
 * Terms: tools/buch-sw/istilahi.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang sw
 * Package SW0 (03.11.2026): the cover, the helpers of the module (the strings outside every widget) and the block of
 * book sw-1 mathe11-sw. A later book writes only below its own comment line, every entry ending with a comma.
 */
window.BuchSW && BuchSW.add('funktionen', {
    word: {
        // sw0: the cover of the start page (BGY 11 mathe11)
        'Titelbild: Parabel, Sinuskurve, Exponentialfunktion und Gerade': 'Picha ya jalada: parabola, mkunjo wa sine, fanksheni ya kipeo na mstari',
        // sw0: the helpers of the module (outside every widget; check.mjs funktionen/*)
        'Parabel': 'Parabola', 'Liegende Spitze': 'Ncha iliyolala', 'Liegende Parabel': 'Parabola iliyolala', 'Wurzel': 'Kipeuo cha pili',
        'Hyperbel': 'Haipabola', 'Betrag': 'Thamani kamili',
        'Rechts von $x = -1$ trifft jede senkrechte Gerade die Kurve zweimal: Zu $x = 1$ gehören $y = 2$ und $y = -2$.':
            'Upande wa kulia wa $x = -1$, kila mstari wima unakata mkunjo mara mbili: $x = 1$ inahusishwa na $y = 2$ na pia na $y = -2$.',
        'Zu $x = 2$ gehören $y = 2$ und $y = -2$. Eine Funktion ordnet jedem $x$ aber genau ein $y$ zu.':
            '$x = 2$ inahusishwa na $y = 2$ na pia na $y = -2$. Lakini fanksheni inahusisha kila $x$ na $y$ mmoja tu.',
        'zwei Nullstellen $x = 1 \\pm \\sqrt{1 - a}$': 'sifuri mbili $x = 1 \\pm \\sqrt{1 - a}$',
        'eine (doppelte) Nullstelle $x = 1$': 'sifuri moja (maradufu) $x = 1$',
        'keine Nullstelle': 'hakuna sifuri',
        'Diskriminante: $x^2 - 2x + a = 0$ hat $D = 1 - a$.': 'Kibainishi: kwa $x^2 - 2x + a = 0$ tunapata $D = 1 - a$.',
        'zwei Nullstellen $x = 0$ und $x = -a$': 'sifuri mbili $x = 0$ na $x = -a$',
        'eine doppelte Nullstelle $x = 0$': 'sifuri moja maradufu $x = 0$',
        'Ausklammern: $x^2 + ax = x(x + a) = 0$. Die Scheitel $S\\left(-\\tfrac{a}{2} \\mid -\\tfrac{a^2}{4}\\right)$ liegen alle auf der Parabel $y = -x^2$ (gestrichelt).':
            'Toa kigawo cha pamoja: $x^2 + ax = x(x + a) = 0$. Vilele vyote $S\\left(-\\tfrac{a}{2}, -\\tfrac{a^2}{4}\\right)$ viko kwenye parabola $y = -x^2$ (mstari wa vistari).',
        'zwei Nullstellen $x = \\pm \\tfrac{2}{\\sqrt{k}}$': 'sifuri mbili $x = \\pm \\tfrac{2}{\\sqrt{k}}$',
        'keine Parabel, sondern die Gerade $y = -4$: keine Nullstelle': 'si parabola, bali mstari $y = -4$: hakuna sifuri',
        'nach unten geöffnet mit dem Scheitel $(0 \\mid -4)$: keine Nullstelle': 'imefunguka kuelekea chini, kilele chake ni $(0, -4)$: hakuna sifuri',
        '$kx^2 = 4$ hat nur für $k > 0$ Lösungen. Der Fall $k = 0$ muss extra betrachtet werden, weil dann das $x^2$ verschwindet.':
            '$kx^2 = 4$ ina masuluhisho kwa $k > 0$ tu. Hali ya $k = 0$ lazima ichunguzwe peke yake, kwa sababu hapo $x^2$ inatoweka.',
        'Zaun an der Mauer': 'Uzio kando ya ukuta',
        'Rechteck mit Umfang 24 cm': 'Mstatili wenye mzunguko wa 24 cm',
        // book sw-1 mathe11-sw:
        // detektiv ("keine" stands for no zeros, no symmetry, no asymptotes: "hakuna" fits all three)
        'Graph der gewählten Funktion': 'Grafu ya fanksheni uliyochagua', 'Alle aufdecken': 'Funua zote', 'aufdecken': 'funua',
        'Definitionsbereich': 'Kikoa', 'Wertebereich': 'Masafa', 'Nullstellen': 'Sifuri', 'Monotonie': 'Kuongezeka na kupungua',
        'Symmetrie': 'Ulinganifu', 'Periodisch?': 'Inajirudia?', 'Asymptoten': 'Asimptoti', 'nein': 'hapana', 'keine': 'hakuna',
        // wachstum
        'Sparen': 'Kuweka akiba', 'Kernzerfall': 'Kuoza kwa mionzi', 'Eigene Werte': 'Thamani zako',
        'Lineares und exponentielles Wachstum': 'Ukuaji wa mstari na ukuaji wa kipeo', 'Startwert $a$': 'Thamani ya mwanzo $a$',
        'linear: Änderung $m$ pro Schritt': 'wa mstari: badiliko $m$ kila hatua', 'exponentiell: Faktor $q$': 'wa kipeo: kizidishi $q$',
        'Zeitraum': 'Kipindi cha muda',
        // gerade, parabel, wurf
        'Gerade durch zwei verschiebbare Punkte': 'Mstari kupitia nukta mbili zinazosogezeka',
        'Streckfaktor $a$': 'Kizidishi cha kunyoosha $a$', 'Verschiebung nach rechts $d$': 'Uhamisho kwenda kulia $h$',
        'Verschiebung nach oben $e$': 'Uhamisho kwenda juu $k$', 'Parabel mit verschiebbarem Scheitelpunkt': 'Parabola yenye kilele kinachosogezeka',
        'Abwurfhöhe $h_0$': 'Kimo cha kurusha $h_0$', 'Abwurfgeschwindigkeit $v_0$': 'Kasi ya kurusha $v_0$',
        'Höhe beim senkrechten Wurf': 'Kimo katika kurusha wima', 't in s': 't kwa s', 'h in m': 'h kwa m',
        // einheitskreis, sinus, tageslaenge
        'Abspielen': 'Cheza', 'Anhalten': 'Simamisha', 'Winkel $\\alpha$': 'Pembe $\\alpha$', 'Einheitskreis und Sinuskurve': 'Duara kizio na mkunjo wa sine',
        'Amplitude $a$': 'Amplitudi $a$', 'Faktor $b$ (Periode $\\tfrac{2\\pi}{b}$)': 'Kizidishi $b$ (kipindi $\\tfrac{2\\pi}{b}$)',
        'Verschiebung $c$ nach rechts': 'Uhamisho $c$ kwenda kulia', 'Verschiebung $d$ nach oben': 'Uhamisho $d$ kwenda juu',
        'Sinusfunktion mit Parametern': 'Fanksheni ya sine yenye vigezo',
        'Tag des Jahres': 'Siku ya mwaka', 't in Tagen': 't kwa siku', 'Stunden': 'saa', 'Tageslänge in Dresden': 'Urefu wa mchana mjini Dresden',
        // regression, anscombe
        'Kerze': 'Mshumaa', 'Bremsweg': 'Umbali wa breki', 'Abkühlen': 'Kupoa', 'Weltbevölkerung': 'Idadi ya watu duniani',
        'Brenndauer in h': 'Muda wa kuwaka kwa h', 'Länge in cm': 'Urefu kwa cm', 'Tempo in km/h': 'Kasi kwa km/h',
        'Bremsweg in m': 'Umbali wa breki kwa m', 'Zeit in min': 'Muda kwa min', 'ΔT in °C': 'ΔT kwa °C', 'Jahr': 'Mwaka', 'Mrd. Menschen': 'Bilioni za watu',
        'Messreihe': 'Mfululizo wa vipimo',
        'Messpunkte und Regressionskurve': 'Nukta za vipimo na mkunjo wa regresheni', 'Messpunkte lassen sich verschieben': 'Nukta za vipimo zinaweza kusogezwa',
        'Für ein exponentielles Modell müssen die Werte positiv sein.': 'Kwa modeli ya kipeo, thamani zote lazima ziwe chanya.',
        'Datensatz': 'Seti ya data', 'Anscombe-Quartett': 'Seti nne za Anscombe',
        // umkehr, expgleichung, parameter, graphquiz
        'Funktion und Umkehrfunktion, gespiegelt an y = x': 'Fanksheni na fanksheni kinyume, zimeakisiwa kwenye y = x',
        'Basis $a$': 'Msingi $a$', 'rechte Seite $b$': 'upande wa kulia $b$', 'Lösen': 'Tatua',
        'Die Basis muss positiv und von 1 verschieden sein.': 'Msingi lazima uwe chanya na tofauti na 1.',
        'Grundfunktion': 'Fanksheni ya msingi', 'Grundfunktion und veränderte Funktion': 'Fanksheni ya msingi na fanksheni iliyobadilishwa',
        'Das ist die Grundfunktion selbst.': 'Hii ndiyo fanksheni ya msingi yenyewe.',
        'Graph, zu dem der Term gesucht ist': 'Grafu ambayo usemi wake unatafutwa', 'Nächster Graph': 'Grafu inayofuata',
        // book sw-2 mathe12-sw:
        // (sw-2 above, sw-3 below)
        // book sw-3 mathe13-sw:
        // book sw-4 mathe12lk-sw:
        // (sw-4 above, sw-5 below)
        // book sw-5 mathe13lk-sw:
    },
    phrase: [
        // book sw-1 mathe11-sw:
        // parameter: c = 0 in f(c·x)
        ['mit $c = 0$ ist $g(x) = f(0)$ konstant', 'kwa $c = 0$, $g(x) = f(0)$ haibadiliki'],
        // detektiv
        [' (doppelt)', ' (maradufu)'], ['fallend für ', 'inapungua kwa '], ['steigend für ', 'inaongezeka kwa '],
        ['achsensymmetrisch zur $y$-Achse', 'ina ulinganifu kuhusu mhimili wa $y$'], ['punktsymmetrisch zum Ursprung', 'ina ulinganifu kuhusu nukta ya asili'],
        ['überall steigend', 'inaongezeka kila mahali'], ['fallend auf ', 'inapungua katika '], [' und fallend auf ', ' na inapungua katika '],
        [' (senkrecht) und ', ' (wima) na '], ['(waagerecht)', '(mlalo)'], ['$ und $', '$ na $'],
        ['abwechselnd steigend und fallend', 'inaongezeka na kupungua kwa zamu'], ['ja, Periode ', 'ndiyo, kipindi '],
        ['$ für $x', '$ kwa $x'], ['$ mit $k', '$ ambapo $k'],
        // wachstum (the numbers of years, days and steps: rules below)
        ['einfache Zinsen (30 € pro Jahr)', 'riba sahili (€30 kwa mwaka)'], ['Zinseszins (3 % pro Jahr)', 'riba mchanganyiko (3% kwa mwaka)'],
        ['linear: jeden Tag 6,25 Prozentpunkte weniger', 'wa mstari: kila siku pointi 6.25 za asilimia pungufu'],
        ['Jod-131: Halbwertszeit 8 Tage', 'Iodini-131: nusumaisha ni siku 8'],
        [' — in jedem Schritt wird mit <b>demselben Faktor</b> multipliziert', ' — katika kila hatua tunazidisha kwa <b>kizidishi kile kile</b>'],
        [' — in jedem Schritt ', ' — katika kila hatua '], ['geht <b>gleich viel</b> weg', 'kiasi <b>kile kile</b> kinapungua'],
        ['kommt <b>gleich viel</b> hinzu.', 'kiasi <b>kile kile</b> kinaongezeka.'],
        [', das sind ', ', yaani '], [' % pro Schritt. ', ' % kwa kila hatua. '],
        ['linear', 'wa mstari'], ['exponentiell', 'wa kipeo'], ['Verdopplungszeit', 'Muda wa kujirudufu'], ['Halbwertszeit', 'Nusumaisha'],
        // gerade
        ['Beide Punkte liegen senkrecht übereinander. Die Gerade $x = ', 'Nukta zote mbili ziko wima moja juu ya nyingine. Mstari $x = '],
        ['$ ist <b>kein</b> Funktionsgraph.', '$ <b>si</b> grafu ya fanksheni.'],
        ['Steigung $m = ', 'Mwinamo $m = '], ['Achsenabschnitt $n = ', 'Kikatizo cha $y$: $c = '], ['$ (weißer Punkt)', '$ (nukta nyeupe)'],
        [' · Nullstelle $x_0 = ', ' · sifuri $x_0 = '], [' · waagerechte Gerade', ' · mstari mlalo'],
        // parabel
        ['Für $a = 0$ ist der Graph keine Parabel, sondern eine Gerade.', 'Kwa $a = 0$ grafu si parabola, bali ni mstari.'],
        ['eine (doppelte) Nullstelle: $x = ', 'sifuri moja (maradufu): $x = '], ['Nullstellen: $x_1 = ', 'sifuri: $x_1 = '],
        ['Scheitelpunktform: $f(x) = ', 'Umbo la kilele: $f(x) = '], [' · Scheitel $S(', ' · kilele $V('], ['Normalform: $f(x) = ', 'Umbo la kawaida: $f(x) = '],
        // wurf
        ['Höchster Punkt nach $t_S = ', 'Nukta ya juu kabisa baada ya $t_S = '], ['Aufprall nach $', 'Inagonga ardhi baada ya $'],
        // einheitskreis, sinus, tageslaenge
        ['$ im Bogenmaß · ', '$ kwa radiani · '], ['Amplitude $|a| = ', 'Amplitudi $|a| = '], [' · Periode $p = ', ' · kipindi $p = '],
        [' · Mittellinie $y = ', ' · mstari wa kati $y = '], [' · Wertebereich $', ' · masafa $'], ['$ · am ', '$ · tarehe '],
        [' min</b> Tageslicht', ' min</b> za mwanga wa mchana'],
        // regression, anscombe
        ['Wann ist die Kerze abgebrannt?', 'Mshumaa utaisha lini?'], ['Bremsweg bei 150 km/h?', 'Umbali wa breki kwa 150 km/h?'],
        ['Temperaturunterschied nach 45 min?', 'Tofauti ya joto baada ya dakika 45?'], ['Prognose für 2050?', 'Utabiri wa mwaka 2050?'],
        ['Regressionsfunktion: $', 'Fanksheni ya regresheni: $'], [' &nbsp;mit $x$ = Jahre seit 1950', ' &nbsp;ambapo $x$ = miaka tangu 1950'],
        ['Bestimmtheitsmaß $R^2 = ', 'Kipimo cha ulinganifu $R^2 = '], ['(passt sehr gut)', '(inalingana vizuri sana)'], ['(passt gut)', '(inalingana vizuri)'],
        ['(passt mäßig)', '(inalingana kiasi)'], [' Das Modell sagt: $f(', ' Modeli inatabiri: $f('], ['Regressionsgerade: $', 'Mstari wa regresheni: $'],
        ['Datensatz', 'Seti ya data'],
        // umkehr, expgleichung (the points have their comma already: js/buch-sw.js)
        ['$ · Der Punkt $P(', '$ · Nukta $P('], ['$ auf $f$ wird zum Punkt $P', '$ kwenye $f$ inakuwa nukta $P'], ['$ auf $f^{-1}$.', '$ kwenye $f^{-1}$.'],
        ['Keine Lösung: $', 'Hakuna suluhisho: $'], ['Probe: $', 'Uthibitisho: $'],
        // parameter ("Der Graph ist …": "Grafu ime…", every part a verb of its own)
        ['gespiegelt an der $x$-Achse', 'imeakisiwa kwenye mhimili wa $x$'], ['gespiegelt an der $y$-Achse', 'imeakisiwa kwenye mhimili wa $y$'],
        [', in $x$-Richtung mit Faktor ', ', imenyooshwa katika mwelekeo wa $x$ kwa kizidishi '], ['Der Graph ist ', 'Grafu '],
        // parameter: the slider labels "$c \cdot f(x)$: strecken in $y$-Richtung"
        [': strecken in $y$-Richtung', ': nyoosha katika mwelekeo wa $y$'], [': verschieben in $y$-Richtung', ': hamisha katika mwelekeo wa $y$'],
        [': stauchen in $x$-Richtung', ': bana katika mwelekeo wa $x$'], [': verschieben in $x$-Richtung', ': hamisha katika mwelekeo wa $x$'],
        // book sw-2 mathe12-sw:
        // (sw-2 above, sw-3 below)
        // book sw-3 mathe13-sw:
        // book sw-4 mathe12lk-sw:
        // (sw-4 above, sw-5 below)
        // book sw-5 mathe13lk-sw:
    ],
    rule: [
        // sw0: lines are y = mx + c in Kenyan schools (German y = mx + n): the zero of gerade
        [/-\\tfrac\{n\}\{m\}/g, '-\\tfrac{c}{m}'],
        // book sw-1 mathe11-sw:
        // tageslaenge: "21. Jun" → "21 Jun" with the Swahili short months
        [/(\d+)\. (Jan|Feb|Mär|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Dez)(?![a-zä])/g, (m, d, mo) => d + ' ' + { Jan: 'Jan', Feb: 'Feb', 'Mär': 'Mac', Apr: 'Apr', Mai: 'Mei', Jun: 'Jun', Jul: 'Jul', Aug: 'Ago', Sep: 'Sep', Okt: 'Okt', Nov: 'Nov', Dez: 'Des' }[mo]],
        // wachstum: the unit before the number, as Swahili says it ("miaka 40", "siku 8")
        [/^(\d+) (Jahre|Tage|Schritte)$/, (m, n, u) => ({ Jahre: 'miaka', Tage: 'siku', Schritte: 'hatua' }[u]) + ' ' + n],
        [/\. Nach \$([^$]*)\$ (Jahren|Tagen|Schritten) wäre alles verbraucht\./g,
            (m, x, u) => '. Baada ya ' + { Jahren: 'miaka', Tagen: 'siku', Schritten: 'hatua' }[u] + ' $' + x + '$ kila kitu kingekuwa kimekwisha.'],
        [/(Verdopplungszeit|Halbwertszeit): \$([^$]*)\$ (Jahre|Tage|Schritte)\./g,
            (m, w, x, u) => (w === 'Verdopplungszeit' ? 'Muda wa kujirudufu' : 'Nusumaisha') + ': ' + { Jahre: 'miaka', Tage: 'siku', Schritte: 'hatua' }[u] + ' $' + x + '$.'],
        // parabel
        [/keine Nullstellen: Der Scheitel liegt (über|unter) der \$x\$-Achse und die Parabel ist nach (oben|unten) geöffnet\./g,
            (m, a, b) => 'hakuna sifuri: kilele kiko ' + (a === 'über' ? 'juu' : 'chini') + ' ya mhimili wa $x$ na parabola imefunguka kuelekea ' + (b === 'oben' ? 'juu' : 'chini') + '.'],
        // wurf: "… in $8.84\,\text{m}$ Höhe."
        [/\$ in \$([^$]*)\$ Höhe\. /g, (m, h) => '$, kwenye kimo cha $' + h + '$. '],
        // expgleichung
        [/\^x\$ ist immer positiv, kann also nie \$([^$]*)\$ werden\./g, (m, b) => '^x$ daima ni chanya, kwa hiyo haiwezi kamwe kuwa $' + b + '$.'],
        // expgleichung, umkehr: the common logarithm is log in Kenyan schools, not lg
        [/\\lg(?![a-z])/g, '\\log'],
        // parameter
        [/in \$([xy])\$-Richtung mit Faktor \$([^$]+)\$ (gestreckt|gestaucht)/g,
            (m, ax, f, w) => (w === 'gestreckt' ? 'imenyooshwa' : 'imebanwa') + ' katika mwelekeo wa $' + ax + '$ kwa kizidishi $' + f + '$'],
        [/ und mit \$([^$]+)\$ gestreckt/g, (m, f) => ' na kunyooshwa kwa kizidishi $' + f + '$'],
        [/ und mit \$([^$]+)\$ gestaucht/g, (m, f) => ' na kubanwa kwa kizidishi $' + f + '$'],
        [/um \$([^$]+)\$ nach (links|rechts|oben|unten) verschoben/g,
            (m, c, d) => 'imehamishwa $' + c + '$ ' + { links: 'kwenda kushoto', rechts: 'kwenda kulia', oben: 'kwenda juu', unten: 'kwenda chini' }[d]],
        // graphquiz score: "3 richtig" → "sahihi 3"
        [/^(\d+) richtig$/, (m, n) => 'sahihi ' + n],
        // book sw-2 mathe12-sw:
        // (sw-2 above, sw-3 below)
        // book sw-3 mathe13-sw:
        // book sw-4 mathe12lk-sw:
        // (sw-4 above, sw-5 below)
        // book sw-5 mathe13lk-sw:
    ]
});
