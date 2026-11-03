/* js/buch-sw/gy12lk.js — Swahili for the widgets of js/buch-gy12lk.js.
 * Loaded by the Swahili editions right after js/buch-gy12lk.js; the engine and the shared words are in js/buch-sw.js.
 *   word    a whole label → its Swahili
 *   phrase  German sentence pieces exactly as the widget source writes them → Swahili
 *   rule    word order and notation (after the number and point rules of js/buch-sw.js, before its header rules)
 * Terms: tools/buch-sw/istilahi.md. After changing a German widget sentence: node tools/buch-en/check.mjs --lang sw
 * Package sw3-prep (03.11.2026): the module's helpers (outside every widget) go below the sw0 line, everything a
 * book needs below its own comment line, every entry ending with a comma.
 */
window.BuchSW && BuchSW.add('gy12lk', {
    word: {
        // sw0: the helpers of the module (outside every widget)
        // book sw-5 mathe13lk-sw:
        // normalverteilung ('Was wird berechnet?' is in js/buch-sw/stochastik.js, which the same page loads)
        'Erwartungswert $\\mu$': 'Thamani tarajiwa $\\mu$', 'Standardabweichung $\\sigma$': 'Mkengeuko sanifu $\\sigma$', '$\\sigma$-Regeln': 'Kanuni za $\\sigma$',
        'Dichte': 'Msongamano', 'Verteilungsfunktion': 'Fanksheni ya mgawanyo', 'Ansicht': 'Mwonekano',
        'Dichtefunktion der Normalverteilung mit markierter Fläche': 'Fanksheni ya msongamano ya mgawanyo wa kawaida, yenye eneo lililowekwa alama',
        // moivre ('Anzahl der Versuche $n$', 'Trefferwahrscheinlichkeit $p$': js/buch-sw/stochastik.js)
        'Histogramm': 'Histogramu', 'standardisiert': 'iliyosanifishwa', 'erfüllt': 'limetimizwa', 'nicht erfüllt': 'halijatimizwa',
        'Histogramm der Binomialverteilung mit der Glockenkurve gleichen Erwartungswerts und gleicher Standardabweichung':
            'Histogramu ya mgawanyo wa binomia pamoja na mkunjo wa kengele wenye thamani tarajiwa na mkengeuko sanifu sawa',
        // rotation (Kegel, Kugel as in js/buch-sw/gleichungen.js, the hint as in js/buch-sw/vektoren.js; Kreisscheibe = diski)
        'Kegel': 'Koni', 'Kugel': 'Tufe', 'Paraboloid': 'Paraboloidi', 'Fass': 'Pipa', 'Welcher Körper?': 'Gimba gani?', 'Kreisscheiben $n$': 'Diski $n$', 'aus': 'hakuna',
        'Ziehen zum Drehen': 'Buruta ili kuzungusha',
        'Rotationskörper im räumlichen Koordinatensystem, durch Ziehen drehbar': 'Gimba la mzunguko katika mfumo wa viwianishi wa nafasi, unaweza kulizungusha kwa kuburuta',
        'Schalte Kreisscheiben zu: Jede Scheibe hat das Volumen $\\pi \\, r^2 \\, \\Delta x$ mit $r = f(x)$.':
            'Washa diski: kila diski ina ujazo $\\pi \\, r^2 \\, \\Delta x$ ambapo $r = f(x)$.',
        // integralfunktion
        'Welche Funktion?': 'Fanksheni gani?', 'untere Grenze $a$': 'mpaka wa chini $a$',
        'Graph von f mit der Fläche von a bis x': 'Grafu ya f pamoja na eneo kutoka a hadi x', 'Graph der Integralfunktion mit Tangente': 'Grafu ya fanksheni ya kiunganishi pamoja na tanjenti',
        // hesse2d
        'Richtung des Normalenvektors': 'Mwelekeo wa vekta ya normali',
        'Gerade mit Normaleneinheitsvektor, ein Punkt P und sein Lot auf die Gerade': 'Mstari pamoja na vekta kizio ya normali, nukta P na wima wake hadi mstari',
        // abstand3d ('windschief', 'schneidend', 'parallel', the zero-vector sentences: js/buch-sw/vektoren.js, which the same page loads)
        'Das 3D-Modul fehlt.': 'Moduli ya 3D haipo.', 'Beispiel 3': 'Mfano 3', 'Ursprungsgerade': 'Mstari kupitia nukta ya asili', 'P auf g': 'P kwenye g',
    },
    phrase: [
        // sw0: the helpers of the module (outside every widget)
        // book sw-5 mathe13lk-sw:
        // normalverteilung (N(μ; σ²) is a rule)
        ['$ mit $\\mu = ', '$ ambapo $\\mu = '], ['$ und $\\sigma = ', '$ na $\\sigma = '],
        ['Standardisieren: $Z = \\dfrac{X - \\mu}{\\sigma}$ ist standardnormalverteilt.', 'Kusanifisha: $Z = \\dfrac{X - \\mu}{\\sigma}$ ina mgawanyo wa kawaida sanifu.'],
        ['. Das ist die gelbe Fläche.', '. Hili ndilo eneo la njano.'], ['. Das ist der gelbe Anstieg der Verteilungsfunktion.', '. Hili ndilo ongezeko la njano la fanksheni ya mgawanyo.'],
        // moivre
        ['Erwartungswert $\\mu = n', 'Thamani tarajiwa $\\mu = n'], ['$, Standardabweichung $\\sigma = \\sqrt{', '$, mkengeuko sanifu $\\sigma = \\sqrt{'],
        ['Laplace-Bedingung $\\sigma > 3$: ', 'Sharti la Laplace $\\sigma > 3$: '],
        ['Standardisiert: Jede Säule wird um $\\mu$ verschoben, in der Breite durch $\\sigma$ geteilt und in der Höhe mit $\\sigma$ multipliziert. Für großes $n$ legen sich alle Histogramme auf dieselbe Kurve $\\varphi$.',
            'Iliyosanifishwa: kila nguzo inahamishwa kwa $\\mu$, upana wake unagawanywa kwa $\\sigma$ na kimo chake kinazidishwa kwa $\\sigma$. Kwa $n$ kubwa, histogramu zote zinalala juu ya mkunjo mmoja $\\varphi$.'],
        ['Größte Abweichung zwischen $P(X = k)$ und der Glockenkurve an der Stelle $k$: $', 'Tofauti kubwa zaidi kati ya $P(X = k)$ na mkunjo wa kengele kwenye $k$: $'],
        // rotation ("Summe der 12 Kreisscheiben …" is a rule)
        ['$ auf $[', '$ kwenye $['], [']$ dreht sich um die $x$-Achse: ', ']$ inazunguka mhimili wa $x$: '], ['$, Abweichung $', '$, tofauti $'],
        // integralfunktion
        [' (x links von a: das Integral zählt rückwärts)', ' (x iko kushoto mwa a: kiunganishi kinahesabu kinyumenyume)'], ['An der Stelle $x = ', 'Kwenye $x = '],
        ['Die pinke Tangente an $I$ hat die Steigung $', 'Tanjenti ya waridi ya $I$ ina mwinamo $'], ['$, und das ist genau $f(', '$, na hiyo ndiyo hasa $f('],
        [')$. Das ist der Hauptsatz: $I_a\'(x) = f(x)$.', ')$. Hii ndiyo nadharia kuu: $I_a\'(x) = f(x)$.'],
        // hesse2d
        ['Hessesche Normalform: $', 'Umbo la normali la Hesse: $'], ['mit $|\\vec n_0| = 1$.', 'ambapo $|\\vec n_0| = 1$.'], ['Punkt einsetzen: $', 'Weka nukta: $'],
        ['Abstand $d(P, g) \\approx ', 'Umbali $d(P, g) \\approx '], ['P liegt auf der Geraden.', 'P iko kwenye mstari.'],
        ['Positiv: P liegt auf der Seite, in die $\\vec n_0$ zeigt.', 'Chanya: P iko upande ambao $\\vec n_0$ inaelekea.'], ['Negativ: P liegt auf der anderen Seite.', 'Hasi: P iko upande mwingine.'],
        // abstand3d
        ['Lotfußpunkt: $\\big(', 'Kitako cha wima: $\\big('], ['$ gibt $t = ', '$ inatoa $t = '], ['$, also $F(', '$, kwa hiyo $F('], [')$ und $d(P, g) = ', ')$ na $d(P, g) = '],
        ['Kontrolle mit dem Vektorprodukt: $', 'Ukaguzi kwa zao la vekta: $'], ['. $P$ liegt auf $g$.', '. $P$ iko kwenye $g$.'],
        ['$: Die Geraden sind parallel. Dann ist ihr Abstand der Abstand des Punktes $Q$ von $g$: $d ', '$: mistari ni sambamba. Basi umbali kati yake ni umbali wa nukta $Q$ kutoka $g$: $d '],
        [', sie sind identisch.', ', yaani inaambatana.'],
        ['$ steht auf beiden Geraden senkrecht, $|\\vec{n}| ', '$ iko wima kwa mistari yote miwili, $|\\vec{n}| '],
        ['. Abstand $0$: Die Geraden <b>schneiden</b> sich in $S(', '. Umbali $0$: mistari <b>inakatana</b> kwenye $S('],
        ['. <b>Windschief</b>; das kürzeste Verbindungsstück (pink) verbindet $F(', '. <b>Inapitana bila kukutana</b> (skew); kipande kifupi zaidi cha kuunganisha (waridi) kinaunganisha $F('], [')$ und $G(', ')$ na $G('],
    ],
    rule: [
        // book sw-5 mathe13lk-sw:
        // normalverteilung: N(\mu;\ \sigma^2) → N(\mu, \sigma^2) · rotation: [0;\ 4] → [0, 4] (the engine only knows ;\,)
        [/N\(\\mu;\\ \\sigma\^2\)/g, 'N(\\mu, \\sigma^2)'],
        [/\[([-−]?[\d.]+);\\ ([-−]?[\d.]+)\]/g, '[$1, $2]'],
        // rotation: "Summe der 12 Kreisscheiben (…): $" → "Jumla ya diski 12 (…): $"
        [/Summe der (\d+) Kreisscheiben \(Radius in der Mitte jedes Streifens\): \$/g, (m, n) => 'Jumla ya diski ' + n + ' (nusukipenyo katikati ya kila kipande): $'],
    ]
});
